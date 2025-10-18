import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Profile.scss";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "johndoe",
    email: "john@example.com",
    fullName: "John Doe",
    bio: "Experienced courier with 5+ years of reliable service. I specialize in safe and timely delivery of your precious cargo.",
    location: "New York, NY",
    phone: "+1 (555) 123-4567",
    joinDate: "January 2023",
    rating: 4.8,
    totalDeliveries: 127,
    responseTime: "1 hour",
    languages: ["English", "Spanish"],
    verificationStatus: "Verified",
  });

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
    console.log("Profile saved:", profileData);
  };

  const handleCancel = () => {
    // TODO: Reset to original data
    setIsEditing(false);
  };

  return (
    <div className="profile">
      <div className="responsive-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="profile-container"
        >
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="profile-header"
          >
            <div className="header-content">
              <div className="profile-avatar-section">
                <div className="avatar-container">
                  <img
                    src="/img/noavatar.png"
                    alt="Profile"
                    className="profile-avatar"
                  />
                  <button className="avatar-edit-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 15l-3-3 3-3m0 0l3 3-3 3m-3-3h6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <div className="verification-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {profileData.verificationStatus}
                </div>
              </div>

              <div className="profile-info">
                <h1 className="profile-name">{profileData.fullName}</h1>
                <p className="profile-username">@{profileData.username}</p>
                <p className="profile-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="10"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  {profileData.location}
                </p>
                <div className="profile-stats">
                  <div className="stat">
                    <span className="stat-value">{profileData.rating}</span>
                    <span className="stat-label">Rating</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">
                      {profileData.totalDeliveries}
                    </span>
                    <span className="stat-label">Deliveries</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">
                      {profileData.responseTime}
                    </span>
                    <span className="stat-label">Response Time</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="header-actions">
              <button
                className="action-btn secondary"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
              {isEditing && (
                <button className="action-btn primary" onClick={handleSave}>
                  Save Changes
                </button>
              )}
            </div>
          </motion.div>

          {/* Profile Content */}
          <div className="profile-content">
            <div className="content-grid">
              {/* About Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="profile-section"
              >
                <h2 className="section-title">About</h2>
                <div className="section-content">
                  {isEditing ? (
                    <textarea
                      className="bio-input"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows="4"
                    />
                  ) : (
                    <p className="bio-text">{profileData.bio}</p>
                  )}
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="profile-section"
              >
                <h2 className="section-title">Contact Information</h2>
                <div className="section-content">
                  <div className="info-grid">
                    <div className="info-item">
                      <label className="info-label">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          className="info-input"
                          value={profileData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                        />
                      ) : (
                        <span className="info-value">{profileData.email}</span>
                      )}
                    </div>
                    <div className="info-item">
                      <label className="info-label">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          className="info-input"
                          value={profileData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                        />
                      ) : (
                        <span className="info-value">{profileData.phone}</span>
                      )}
                    </div>
                    <div className="info-item">
                      <label className="info-label">Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="info-input"
                          value={profileData.location}
                          onChange={(e) =>
                            handleInputChange("location", e.target.value)
                          }
                        />
                      ) : (
                        <span className="info-value">
                          {profileData.location}
                        </span>
                      )}
                    </div>
                    <div className="info-item">
                      <label className="info-label">Member Since</label>
                      <span className="info-value">{profileData.joinDate}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Languages */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="profile-section"
              >
                <h2 className="section-title">Languages</h2>
                <div className="section-content">
                  <div className="languages-list">
                    {profileData.languages.map((language, index) => (
                      <span key={index} className="language-tag">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Activity Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="profile-section"
              >
                <h2 className="section-title">Activity Summary</h2>
                <div className="section-content">
                  <div className="activity-stats">
                    <div className="activity-item">
                      <div className="activity-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="activity-content">
                        <span className="activity-value">127</span>
                        <span className="activity-label">
                          Completed Deliveries
                        </span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="activity-content">
                        <span className="activity-value">1 hour</span>
                        <span className="activity-label">
                          Average Response Time
                        </span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="activity-content">
                        <span className="activity-value">4.8</span>
                        <span className="activity-label">Average Rating</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;
