import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import upload from "../../utils/upload";
import "./CompleteProfile.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate, useLocation } from "react-router-dom";
import BackgroundGradient from "../../components/ui/background-gradient";
import CountrySelect from "../../components/CountrySelect/CountrySelect";
import { linkEmailPassword } from "../../firebase/auth";
import { useAuth } from "../../context/AuthContext";

function CompleteProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { firebaseUser, refreshUser } = useAuth();
  
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: firebaseUser?.email || "",
    password: "",
    country: "",
    phone: "",
    desc: "",
    isSeller: false,
  });
  const [skipPassword, setSkipPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if no Firebase user
    if (!firebaseUser) {
      navigate("/login");
      return;
    }
    
    // Pre-fill email from Firebase user
    setFormData(prev => ({
      ...prev,
      email: firebaseUser.email || "",
    }));
  }, [firebaseUser, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSeller = (e) => {
    setFormData((prev) => ({
      ...prev,
      isSeller: e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (!formData.username || !formData.country) {
      setError("Username and country are required");
      setLoading(false);
      return;
    }

    // Validate password if not skipped
    if (!skipPassword && formData.password && formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Link email/password credential if password is provided
      if (!skipPassword && formData.password) {
        try {
          await linkEmailPassword(formData.email, formData.password);
        } catch (linkError) {
          // Handle specific linking errors
          if (linkError.code === "auth/provider-already-linked") {
            // Already linked, continue
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

      // Step 2: Upload profile image if provided, otherwise use Google photo
      let imgUrl = firebaseUser.photoURL || "";
      if (file) {
        imgUrl = await upload(file);
      }

      // Step 3: Save profile to MongoDB
      const syncResponse = await newRequest.post("/auth/firebase-user", {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        username: formData.username.trim().toLowerCase(),
        img: imgUrl,
        country: formData.country,
        phone: formData.phone || "",
        desc: formData.desc || "",
        isSeller: formData.isSeller || false,
      });

      // Verify MongoDB user was created successfully
      if (!syncResponse.data?.user) {
        throw new Error("Failed to create user profile. Please try again.");
      }

      // Refresh user data in AuthContext
      await refreshUser();

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

  return (
    <div className="complete-profile">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="complete-profile-container"
      >
        <BackgroundGradient
          className="rounded-[22px] max-w-4xl p-4 sm:p-10 bg-zinc-900 dark:bg-zinc-900"
          containerClassName="w-full max-w-4xl"
        >
          <motion.div
            className="complete-profile-header"
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
            <h2 className="page-title">Complete Your Profile</h2>
            <p className="page-subtitle">Just a few more details to get started</p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="complete-profile-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
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
                    value={formData.email}
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
                    value={formData.username}
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
                    value={formData.password}
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
                            setFormData(prev => ({ ...prev, password: "" }));
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
                    value={formData.country || ""}
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
                  <motion.input
                    id="file"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.type.startsWith("image/")) {
                        setFile(file);
                        setError(null);
                      } else if (file) {
                        setError("Please select an image file");
                        setFile(null);
                      }
                    }}
                    accept="image/*"
                    className="form-input file-input"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  <span className="field-hint">
                    {firebaseUser?.photoURL && !file ? "Your Google profile picture will be used by default" : ""}
                  </span>
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
                        checked={formData.isSeller}
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
                    value={formData.phone}
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
                    value={formData.desc}
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
              className="submit-button"
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
              {loading ? "Completing Profile..." : "Complete Profile"}
            </motion.button>
          </motion.form>
        </BackgroundGradient>
      </motion.div>
    </div>
  );
}

export default CompleteProfile;



