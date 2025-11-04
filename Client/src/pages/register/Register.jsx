import React, { useState } from "react";
import { motion } from "framer-motion";
import upload from "../../utils/upload";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate, Link } from "react-router-dom";
import BackgroundGradient from "../../components/ui/background-gradient";
import CountrySelect from "../../components/CountrySelect/CountrySelect";
import { signUp, signInWithGoogle, linkEmailPassword } from "../../firebase/auth";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Signup method state: null (initial), 'google', 'email'
  const [signupMethod, setSignupMethod] = useState(null);
  
  // Google user data after OAuth
  const [googleUserData, setGoogleUserData] = useState(null);
  
  // Photo management
  const [file, setFile] = useState(null);
  const [useGooglePhoto, setUseGooglePhoto] = useState(true);
  
  // Form data
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
    phone: "",
  });

  // Skip password for Google users
  const [skipPassword, setSkipPassword] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState(null);

  // Handle redirect from Login (Google Sign-In without account)
  React.useEffect(() => {
    if (location.state?.fromGoogleSignIn && location.state?.firebaseUser) {
      const { firebaseUser, message } = location.state;
      
      // Show info message
      if (message) {
        setInfoMessage(message);
      }
      
      // Pre-populate with Google user data
      setGoogleUserData(firebaseUser);
      setSignupMethod('google');
      setUser((prev) => ({
        ...prev,
        email: firebaseUser.email || "",
        img: firebaseUser.photoURL || "",
      }));
      
      // Clear the location state to prevent re-triggering
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };

  // Handle Google OAuth signup
  const handleGoogleSignup = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    
    try {
      // Trigger Google OAuth
      const result = await signInWithGoogle();
      const firebaseUser = result.user;
      
      // Store Google user data and switch to Google signup mode
      setGoogleUserData(firebaseUser);
      setSignupMethod('google');
      
      // Pre-fill form with Google data
      setUser((prev) => ({
        ...prev,
        email: firebaseUser.email || "",
        img: firebaseUser.photoURL || "",
      }));
      
      setLoading(false);
    } catch (err) {
      let message = "Failed to sign up with Google";
      if (err.code === "auth/popup-closed-by-user") {
        message = "Sign-up was cancelled";
        setSignupMethod(null); // Reset to initial state
      } else if (err.code === "auth/popup-blocked") {
        message = "Popup was blocked. Please allow popups for this site";
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
      setLoading(false);
    }
  };

  // Handle Google registration submission (after OAuth)
  const handleGoogleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (!user.username || !user.country) {
      setError("Username and country are required");
      setLoading(false);
      return;
    }

    // Validate username length
    const normalizedUsername = user.username.trim().toLowerCase();
    if (normalizedUsername.length < 3) {
      setError("Username must be at least 3 characters");
      setLoading(false);
      return;
    }
    if (normalizedUsername.length > 20) {
      setError("Username must be at most 20 characters");
      setLoading(false);
      return;
    }

    // Validate password if not skipped
    if (!skipPassword && user.password && user.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Validate username availability BEFORE linking credentials or saving
      const usernameCheck = await newRequest.post("/auth/check-username", {
        username: normalizedUsername,
      });

      if (!usernameCheck.data.available) {
        setError("Username is already taken. Please choose a different username.");
        setLoading(false);
        return;
      }

      // Step 2: Link email/password credential if password is provided
      if (!skipPassword && user.password) {
        try {
          await linkEmailPassword(user.email, user.password);
        } catch (linkError) {
          // Handle specific linking errors
          if (linkError.code === "auth/provider-already-linked") {
            console.log("Email/password already linked");
          } else if (linkError.code === "auth/credential-already-in-use") {
            setError("This email is already in use with a password. Please sign in instead.");
            setLoading(false);
            return;
          } else if (linkError.code === "auth/email-already-in-use") {
            setError("This email is already registered. Please sign in instead.");
            setLoading(false);
            return;
          } else {
            throw linkError;
          }
        }
      }

      // Step 3: Handle profile photo
      let imgUrl = useGooglePhoto ? googleUserData.photoURL || "" : "";
      if (file && !useGooglePhoto) {
        imgUrl = await upload(file);
      }

      // Step 4: Save profile to MongoDB (username already validated)
      const syncResponse = await newRequest.post("/auth/firebase-user", {
        firebaseUid: googleUserData.uid,
        email: googleUserData.email,
        username: normalizedUsername,
        img: imgUrl,
        country: user.country,
        phone: user.phone || "",
        desc: user.desc || "",
        isSeller: user.isSeller || false,
      });

      // Verify MongoDB user was created successfully
      if (!syncResponse.data?.user) {
        throw new Error("Failed to create user profile. Please try again.");
      }

      // Success - navigate to home
      setLoading(false);
      navigate("/");
    } catch (err) {
      let message = "Something went wrong!";
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
      setLoading(false);
    }
  };

  // Handle email/password registration submission
  const handleEmailRegistrationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (!user.username || !user.email || !user.password || !user.country) {
      setError(
        "Please fill in all required fields (username, email, password, country)"
      );
      setLoading(false);
      return;
    }

    // Validate username length
    const normalizedUsername = user.username.trim().toLowerCase();
    if (normalizedUsername.length < 3) {
      setError("Username must be at least 3 characters");
      setLoading(false);
      return;
    }
    if (normalizedUsername.length > 20) {
      setError("Username must be at most 20 characters");
      setLoading(false);
      return;
    }

    let firebaseUser = null;

    try {
      // STEP 1: Validate username availability BEFORE creating Firebase account
      const usernameCheck = await newRequest.post("/auth/check-username", {
        username: normalizedUsername,
      });

      if (!usernameCheck.data.available) {
        setError("Username is already taken. Please choose a different username.");
        setLoading(false);
        return;
      }

      // STEP 2: Username is available - create Firebase account
      const userCredential = await signUp(user.email, user.password);
      firebaseUser = userCredential.user;

      // STEP 3: Upload profile image if provided
      const imgUrl = file ? await upload(file) : "";

      // STEP 4: Save to MongoDB with final server-side validation
      const syncResponse = await newRequest.post("/auth/firebase-user", {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        username: normalizedUsername,
        img: imgUrl,
        country: user.country,
        phone: user.phone || "",
        desc: user.desc || "",
        isSeller: user.isSeller || false,
      });

      // Verify MongoDB user was created successfully
      if (!syncResponse.data?.user) {
        throw new Error("Failed to create user profile. Please try again.");
      }

      // AuthContext will automatically sync via onAuthStateChanged
      setLoading(false);
      navigate("/");
    } catch (err) {
      let message = "Something went wrong!";
      
      // Firebase Auth errors
      if (err.code === "auth/email-already-in-use") {
        message = "An account with this email already exists";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email address";
      } else if (err.code === "auth/weak-password") {
        message = "Password should be at least 6 characters";
      } 
      // Backend errors
      else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }
      
      setError(message);
      setLoading(false);
    }
  };
  // Render method selector (initial view)
  const renderMethodSelector = () => (
    <>
      <motion.div
        className="register-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="logo">
          <img
            src="https://res.cloudinary.com/dzmrfifoq/image/upload/v1761657923/OFFICIAL-LOGO_ccpbzm.png"
            alt="LuggageShare Logo"
            className="logo-img"
            width="180"
            height="60"
          />
        </div>
        <h2 className="register-title">Create Your Account</h2>
        <p className="register-subtitle">Choose how you'd like to sign up</p>
      </motion.div>

      {infoMessage && (
        <motion.div
          className="info-message"
          role="alert"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{
            backgroundColor: "rgba(22, 219, 101, 0.1)",
            border: "1px solid rgba(22, 219, 101, 0.3)",
            color: "#16db65",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          {String(infoMessage)}
        </motion.div>
      )}

      <div className="signup-method-selector">
        <motion.button
          type="button"
          onClick={handleGoogleSignup}
          className="google-signup-button"
          disabled={loading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            className="google-icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {loading ? "Connecting..." : "Sign Up with Google"}
        </motion.button>

        <div className="divider">
          <span>or</span>
        </div>

        <motion.button
          type="button"
          onClick={() => setSignupMethod('email')}
          className="email-signup-button"
          disabled={loading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Sign Up with Email/Password
        </motion.button>
      </div>

      {error && (
        <motion.div
          className="error-message"
          role="alert"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {String(error)}
        </motion.div>
      )}

      <motion.div
        className="register-footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <p className="login-text">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Sign in
          </Link>
        </p>
      </motion.div>
    </>
  );

  // Render Google signup form (after OAuth)
  const renderGoogleSignupForm = () => (
    <>
      <motion.div
        className="register-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="logo">
          <img
            src="https://res.cloudinary.com/dzmrfifoq/image/upload/v1761657923/OFFICIAL-LOGO_ccpbzm.png"
            alt="LuggageShare Logo"
            className="logo-img"
            width="180"
            height="60"
          />
        </div>
        <h2 className="register-title">Complete Your Profile</h2>
        <p className="register-subtitle">Just a few more details to get started</p>
      </motion.div>

      {infoMessage && (
        <motion.div
          className="info-message"
          role="alert"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{
            backgroundColor: "rgba(22, 219, 101, 0.1)",
            border: "1px solid rgba(22, 219, 101, 0.3)",
            color: "#16db65",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          {String(infoMessage)}
        </motion.div>
      )}

      <motion.form
        onSubmit={handleGoogleRegistrationSubmit}
        className="register-form"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <button
          type="button"
          onClick={() => {
            setSignupMethod(null);
            setGoogleUserData(null);
            setError(null);
          }}
          className="back-button"
        >
          ← Back to signup options
        </button>

        <div className="form-sections">
          <div className="left-section">
            <h3 className="section-title">Basic Information</h3>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <motion.input
                name="email"
                type="email"
                value={user.email}
                disabled
                className="form-input locked"
                title="Email from Google account (cannot be changed)"
              />
              <span className="field-hint">From your Google account</span>
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <label htmlFor="username" className="form-label required">
                Username
              </label>
              <motion.input
                name="username"
                type="text"
                placeholder="johndoe"
                value={user.username}
                onChange={handleChange}
                className="form-input"
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                required
              />
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <label htmlFor="password" className="form-label">
                Password (Optional)
              </label>
              <motion.input
                name="password"
                type="password"
                placeholder="Set a password to enable email login"
                value={user.password}
                onChange={handleChange}
                disabled={skipPassword}
                className="form-input"
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <div className="skip-password-toggle">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={skipPassword}
                    onChange={(e) => {
                      setSkipPassword(e.target.checked);
                      if (e.target.checked) {
                        setUser(prev => ({ ...prev, password: "" }));
                      }
                    }}
                  />
                  <span>Skip password (Google sign-in only)</span>
                </label>
              </div>
              <span className="field-hint">
                Setting a password allows you to sign in with email/password in addition to Google
              </span>
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <CountrySelect
                name="country"
                id="country"
                value={user.country || ""}
                onChange={handleChange}
                label="Country"
                placeholder="Select your country"
                required
              />
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <label htmlFor="file" className="form-label">
                Profile Picture
              </label>
              
              {useGooglePhoto && googleUserData?.photoURL ? (
                <div className="google-photo-preview">
                  <img
                    src={googleUserData.photoURL}
                    alt="Google profile"
                    className="photo-preview-img"
                  />
                  <button
                    type="button"
                    onClick={() => setUseGooglePhoto(false)}
                    className="change-photo-button"
                  >
                    Upload different photo
                  </button>
                  <span className="field-hint">Using your Google profile photo</span>
                </div>
              ) : (
                <>
                  <motion.input
                    id="file"
                    type="file"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      if (selectedFile && selectedFile.type.startsWith("image/")) {
                        setFile(selectedFile);
                        setError(null);
                      } else if (selectedFile) {
                        setError("Please select an image file");
                        setFile(null);
                      }
                    }}
                    accept="image/*"
                    className="form-input file-input"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  {googleUserData?.photoURL && (
                    <button
                      type="button"
                      onClick={() => {
                        setUseGooglePhoto(true);
                        setFile(null);
                      }}
                      className="use-google-photo-button"
                    >
                      Use Google photo instead
                    </button>
                  )}
                </>
              )}
            </motion.div>
          </div>

          <div className="right-section">
            <h3 className="section-title">Courier Options</h3>

            <motion.div
              className="toggle-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="toggle">
                <label htmlFor="courier-toggle" className="toggle-label">
                  I want to become a courier
                </label>
                <label className="switch">
                  <input
                    id="courier-toggle"
                    type="checkbox"
                    checked={user.isSeller}
                    onChange={handleSeller}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <motion.input
                name="phone"
                type="text"
                placeholder="+1 234 567 8900"
                value={user.phone}
                onChange={handleChange}
                className="form-input"
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <label htmlFor="desc" className="form-label">
                Description
              </label>
              <motion.textarea
                placeholder="A short description of yourself"
                name="desc"
                value={user.desc}
                onChange={handleChange}
                className="form-textarea"
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </motion.div>
          </div>
        </div>

        {error && (
          <motion.div
            className="error-message"
            role="alert"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {String(error)}
          </motion.div>
        )}

        <motion.button
          type="submit"
          className="register-button"
          disabled={loading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 30px rgba(22, 219, 101, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? "Creating Account..." : "Complete Profile"}
        </motion.button>
      </motion.form>
    </>
  );

  // Render email/password signup form
  const renderEmailSignupForm = () => (
    <>
      <motion.div
        className="register-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="logo">
          <img
            src="https://res.cloudinary.com/dzmrfifoq/image/upload/v1761657923/OFFICIAL-LOGO_ccpbzm.png"
            alt="LuggageShare Logo"
            className="logo-img"
            width="180"
            height="60"
          />
        </div>
        <h2 className="register-title">Create Your Account</h2>
        <p className="register-subtitle">Fill in your details to get started</p>
      </motion.div>

      <motion.form
        onSubmit={handleEmailRegistrationSubmit}
        className="register-form"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <button
          type="button"
          onClick={() => {
            setSignupMethod(null);
            setError(null);
          }}
          className="back-button"
        >
          ← Back to signup options
        </button>

        <div className="form-sections">
          <div className="left-section">
            <h3 className="section-title">Basic Information</h3>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <motion.input
                    name="username"
                    type="text"
                    placeholder="johndoe"
                    onChange={handleChange}
                    className="form-input"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                </motion.div>

                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <motion.input
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    onChange={handleChange}
                    className="form-input"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                </motion.div>

                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <motion.input
                    name="password"
                    type="password"
                    onChange={handleChange}
                    className="form-input"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                </motion.div>

                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <CountrySelect
                    name="country"
                    id="country"
                    value={user.country || ""}
                    onChange={handleChange}
                    label="Country"
                    placeholder="Select your country"
                  />
                </motion.div>

                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <label htmlFor="file" className="form-label">
                    Profile Picture
                  </label>
                  <motion.input
                    id="file"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.type.startsWith("image/")) {
                        setFile(file);
                        setError(null);
                      } else {
                        setError("Please select an image file");
                        setFile(null);
                      }
                    }}
                    accept="image/*"
                    className="form-input file-input"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  {error && <span className="error-text">{error}</span>}
                  {loading && (
                    <span className="loading-text">Uploading...</span>
                  )}
                </motion.div>
              </div>

              <div className="right-section">
                <h3 className="section-title">Courier Options</h3>

                <motion.div
                  className="toggle-section"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <div className="toggle">
                    <label htmlFor="courier-toggle" className="toggle-label">
                      I want to become a courier
                    </label>
                    <label className="switch">
                      <input
                        id="courier-toggle"
                        type="checkbox"
                        onChange={handleSeller}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </motion.div>

                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <motion.input
                    name="phone"
                    type="text"
                    placeholder="+1 234 567 8900"
                    onChange={handleChange}
                    className="form-input"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                </motion.div>

                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <label htmlFor="desc" className="form-label">
                    Description
                  </label>
                  <motion.textarea
                    placeholder="A short description of yourself"
                    name="desc"
                    onChange={handleChange}
                    className="form-textarea"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                </motion.div>
              </div>
            </div>

        {error && (
          <motion.div
            className="error-message"
            role="alert"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {String(error)}
          </motion.div>
        )}

        <motion.button
          type="submit"
          className="register-button"
          disabled={loading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 30px rgba(22, 219, 101, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </motion.button>
      </motion.form>

      <motion.div
        className="register-footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <p className="login-text">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Sign in
          </Link>
        </p>
      </motion.div>
    </>
  );

  // Main return - conditionally render based on signup method
  return (
    <div className="register">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="register-container"
      >
        <BackgroundGradient
          className="rounded-[22px] max-w-4xl p-4 sm:p-10 bg-zinc-900 dark:bg-zinc-900"
          containerClassName="w-full max-w-4xl"
        >
          {signupMethod === null && renderMethodSelector()}
          {signupMethod === 'google' && renderGoogleSignupForm()}
          {signupMethod === 'email' && renderEmailSignupForm()}
        </BackgroundGradient>
      </motion.div>
    </div>
  );
}

export default Register;
