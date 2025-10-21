import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BecomeSeller.scss";
import newRequest from "../../utils/newRequest";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMode } from "../../context/ModeContext";

const BecomeSeller = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const user = currentUser?.info || currentUser;
  const { isSeller, switchToSellerMode } = useMode();

  const [formData, setFormData] = useState({
    phone: user?.phone || "",
    desc: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already a seller
  useEffect(() => {
    if (isSeller) {
      switchToSellerMode();
      navigate("/mygigs");
    }
  }, [isSeller, navigate, switchToSellerMode]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate
    if (!formData.phone || formData.phone.trim().length < 10) {
      setError("Please enter a valid phone number (minimum 10 digits)");
      return;
    }

    if (!formData.desc || formData.desc.trim().length < 50) {
      setError(
        "Please provide a detailed description about your courier services (minimum 50 characters)"
      );
      return;
    }

    setIsLoading(true);

    try {
      // Update user to become a seller
      const response = await newRequest.put("/users/become-seller", {
        phone: formData.phone,
        desc: formData.desc,
        isSeller: true,
      });

      // Update localStorage with new user data
      const updatedUser = response.data;
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      // Dispatch custom event to notify context of user update
      window.dispatchEvent(new Event("userUpdated"));

      // Switch to seller mode and navigate
      switchToSellerMode();
      navigate("/mygigs");
    } catch (err) {
      console.error("Error becoming seller:", err);
      setError(
        err.response?.data?.message ||
          "Failed to register as seller. Please try again."
      );
      setIsLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="become-seller">
      <div className="become-seller-container">
        <div className="become-seller-header">
          <h1>Become a Courier</h1>
          <p>Join our community of trusted luggage couriers</p>
        </div>

        <div className="become-seller-content">
          <div className="info-section">
            <h2>Why Become a Courier?</h2>
            <ul>
              <li>
                <span className="icon">✈️</span>
                <span>Earn money while traveling</span>
              </li>
              <li>
                <span className="icon">🌍</span>
                <span>Help connect people across borders</span>
              </li>
              <li>
                <span className="icon">💰</span>
                <span>Set your own prices and schedule</span>
              </li>
              <li>
                <span className="icon">🤝</span>
                <span>Build trust and reputation</span>
              </li>
            </ul>
          </div>

          <form className="seller-form" onSubmit={handleSubmit}>
            <h2>Complete Your Profile</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="phone">
                Phone Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1234567890"
                required
                minLength="10"
              />
              <span className="form-helper">
                We'll use this to verify your identity and for important updates
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="desc">
                About Your Courier Services <span className="required">*</span>
              </label>
              <textarea
                id="desc"
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                placeholder="Tell us about yourself and your courier services. Include:
• Your travel experience and frequency
• Routes you commonly travel
• Types of items you're comfortable transporting
• Any special qualifications or certifications
• Your commitment to safe and reliable delivery"
                rows="8"
                required
                minLength="50"
              />
              <span className="form-helper">
                Minimum 50 characters. A detailed description helps build trust
                with customers.
              </span>
            </div>

            <div className="terms-section">
              <p>
                By becoming a courier, you agree to our{" "}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
                . You also commit to:
              </p>
              <ul>
                <li>Providing accurate and honest information</li>
                <li>Handling all items with care and professionalism</li>
                <li>Complying with all customs and travel regulations</li>
                <li>Maintaining clear communication with customers</li>
              </ul>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Become a Courier"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeSeller;
