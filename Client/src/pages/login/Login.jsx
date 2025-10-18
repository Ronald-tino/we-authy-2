import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Login.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate, Link } from "react-router-dom";
import BackgroundGradient from "../../components/ui/background-gradient";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/auth/login", { username, password });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response.data);
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
                src="/img/lug.png"
                alt="LuggageShare Logo"
                className="logo-img"
              />
              <h1 className="logo-text">LuggageShare</h1>
            </div>
            <motion.h2
              className="login-title"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Welcome back
            </motion.h2>
            <p className="login-subtitle">Sign in to your account</p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
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
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <motion.input
                name="username"
                type="text"
                placeholder="johndoe"
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
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
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </motion.div>

            <motion.button
              type="submit"
              className="login-button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(22, 219, 101, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>

            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {error}
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
