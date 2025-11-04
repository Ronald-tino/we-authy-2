import React, { useState } from "react";
import { motion } from "framer-motion";
import "./PasswordReset.scss";
import { useNavigate, Link } from "react-router-dom";
import BackgroundGradient from "../../components/ui/background-gradient";
import { resetPassword } from "../../firebase/auth";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      let message = "Failed to send password reset email";
      if (err.code === "auth/user-not-found") {
        message = "No account found with this email";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email address";
      } else if (err.code === "auth/too-many-requests") {
        message = "Too many requests. Please try again later";
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="password-reset">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="password-reset-container"
      >
        <BackgroundGradient
          className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-zinc-900 dark:bg-zinc-900"
          containerClassName="w-full max-w-sm"
        >
          <motion.div
            className="password-reset-header"
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

          {success ? (
            <motion.div
              className="success-message"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2>Check your email</h2>
              <p>
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="instruction-text">
                Click the link in the email to reset your password. If you don't
                see it, check your spam folder.
              </p>
              <Link to="/login" className="back-to-login-link">
                Back to Login
              </Link>
            </motion.div>
          ) : (
            <>
              <motion.form
                onSubmit={handleSubmit}
                className="password-reset-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h2 className="form-title">Reset Password</h2>
                <p className="form-subtitle">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>

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
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    required
                  />
                </motion.div>

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
                  className="reset-button"
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
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </motion.button>
              </motion.form>

              <motion.div
                className="password-reset-footer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <p className="back-to-login-text">
                  Remember your password?{" "}
                  <Link to="/login" className="link-text">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </>
          )}
        </BackgroundGradient>
      </motion.div>
    </div>
  );
}

export default PasswordReset;

