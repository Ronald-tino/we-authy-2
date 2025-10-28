import React, { useState } from "react";
import { motion } from "framer-motion";
import upload from "../../utils/upload";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate, Link } from "react-router-dom";
import BackgroundGradient from "../../components/ui/background-gradient";
import CountrySelect from "../../components/CountrySelect/CountrySelect";

function Register() {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Only attempt upload if a file was selected
      const url = file ? await upload(file) : "";

      const res = await newRequest.post("/auth/register", {
        ...user,
        img: url,
      });

      // Store user data in localStorage (auto-login)
      localStorage.setItem("currentUser", JSON.stringify(res.data));

      // Dispatch custom event to notify context of user update
      window.dispatchEvent(new Event("userUpdated"));

      setLoading(false);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
      setLoading(false);
    }
  };
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
          <motion.div
            className="register-header"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="logo">
              <img
                src="/img/OFFICIAL-LOGO.svg"
                alt="LuggageShare Logo"
                className="logo-img"
                width="180"
                height="60"
              />
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="register-form"
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

            <motion.button
              type="submit"
              className="register-button"
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
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <p className="login-text">
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Sign in
              </Link>
            </p>
          </motion.div>
        </BackgroundGradient>
      </motion.div>
    </div>
  );
}

export default Register;
