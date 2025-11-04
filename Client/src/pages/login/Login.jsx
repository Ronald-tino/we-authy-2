import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Login.scss";
import { useNavigate, Link } from "react-router-dom";
import BackgroundGradient from "../../components/ui/background-gradient";
import {
  signIn,
  signInWithGoogle,
  getCurrentUserToken,
} from "../../firebase/auth";
import newRequest from "../../utils/newRequest";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    try {
      // Sign in with Firebase (template pattern - simple auth call)
      await signIn(email, password);
      // AuthContext will automatically sync MongoDB via onAuthStateChanged
      navigate("/");
    } catch (err) {
      let message = "Invalid email or password";
      if (err.code === "auth/user-not-found") {
        message = "No account found with this email";
      } else if (err.code === "auth/wrong-password") {
        message = "Incorrect password";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email address";
      } else if (err.code === "auth/user-disabled") {
        message = "This account has been disabled";
      } else if (err.code === "auth/too-many-requests") {
        message = "Too many failed attempts. Please try again later";
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    try {
      // Sign in with Google (template pattern - simple auth call)
      const result = await signInWithGoogle();
      const firebaseUser = result.user;

      // Get Firebase token for API call
      const token = await getCurrentUserToken();

      // Check if user has completed their profile in MongoDB
      try {
        const response = await newRequest.post("/auth/firebase-user", {
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email,
          img: firebaseUser.photoURL,
        });

        const mongoUser = response.data?.user;

        // Check if profile is incomplete (missing username or country)
        if (
          !mongoUser?.username ||
          !mongoUser?.country ||
          mongoUser.country === "Not specified"
        ) {
          // Redirect to profile completion
          navigate("/complete-profile", {
            state: {
              fromGoogle: true,
              firebaseUser: {
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
                uid: firebaseUser.uid,
              },
            },
          });
          return;
        }

        // Profile is complete - proceed to home
        navigate("/");
      } catch (err) {
        // If MongoDB user doesn't exist or error, redirect to complete profile
        if (err.response?.status === 404 || err.response?.status === 401) {
          navigate("/complete-profile", {
            state: {
              fromGoogle: true,
              firebaseUser: {
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
                uid: firebaseUser.uid,
              },
            },
          });
          return;
        }
        throw err;
      }
    } catch (err) {
      let message = "Failed to sign in with Google";
      if (err.code === "auth/popup-closed-by-user") {
        message = "Sign-in was cancelled";
      } else if (err.code === "auth/popup-blocked") {
        message = "Popup was blocked. Please allow popups for this site";
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="login-container"
      >
        <BackgroundGradient
          className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-zinc-900 dark:bg-zinc-900"
          containerClassName="w-full max-w-sm"
        >
          <motion.div
            className="login-header"
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
          </motion.div>

          <motion.form
            onSubmit={handleEmailLogin}
            className="login-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <motion.input
                name="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <motion.input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                required
              />
            </motion.div>

            <div className="forgot-password-link">
              <Link to="/password-reset" className="link-text">
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(22, 219, 101, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </motion.button>

            <div className="divider">
              <span>or</span>
            </div>

            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              className="google-login-button"
              disabled={isSubmitting}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="google-icon"
                width="20"
                height="20"
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
              Sign in with Google
            </motion.button>

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
          </motion.form>

          <motion.div
            className="login-footer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <p className="signup-text">
              Don't have an account?{" "}
              <Link to="/register" className="signup-link">
                Sign up
              </Link>
            </p>
          </motion.div>
        </BackgroundGradient>
      </motion.div>
    </div>
  );
}

export default Login;
