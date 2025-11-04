import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import CountrySelect from "../../components/CountrySelect/CountrySelect";
import StarRating from "../../components/StarRating/StarRating";
import upload from "../../utils/upload";
import { useAuth } from "../../context/AuthContext";
import "./Profile.scss";

// Simple toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: -50, x: "-50%" }}
      className={`toast toast-${type}`}
    >
      <div className="toast-icon">
        {type === "success" ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span>{message}</span>
      <button onClick={onClose} className="toast-close">
        ×
      </button>
    </motion.div>
  );
};

function Profile() {
  // ALL hooks must be called first, before any conditional returns
  const { userId: viewingUserId } = useParams();
  const { currentUser, refreshUser, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  // All useState hooks (must be before any conditional returns)
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    bio: "",
    location: "",
    phone: "",
    img: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);

  // useRef hooks
  const fileInputRef = useRef(null);

  // Derived values (after all hooks, before useQuery)
  const currentUserId =
    currentUser?.firebaseUid || currentUser?.info?._id || currentUser?._id;
  const isOwnProfile = !viewingUserId || viewingUserId === currentUserId;
  const userId = viewingUserId || currentUserId;
  const safeBio = typeof profileData?.bio === "string" ? profileData.bio : "";

  // useQuery MUST come before any conditional returns
  const {
    isLoading,
    error,
    data: userData,
  } = useQuery({
    queryKey: ["user", userId, isOwnProfile],
    queryFn: async () => {
      const endpoint = isOwnProfile
        ? `/users/${userId}`
        : `/users/public/${userId}`;

      try {
        const res = await newRequest.get(endpoint);
        return res.data;
      } catch (err) {
        if (!isOwnProfile && err.response?.status === 404) {
          console.warn(
            "Public endpoint failed, trying authenticated endpoint as fallback"
          );
          try {
            const fallbackRes = await newRequest.get(`/users/${userId}`);
            // Remove sensitive data client-side if we had to use auth endpoint
            // eslint-disable-next-line no-unused-vars
            const { email, phone, password, ...publicData } = fallbackRes.data;
            return publicData;
          } catch {
            throw err;
          }
        }
        throw err;
      }
    },
    enabled: !!userId,
    retry: false,
  });

  // useEffect hooks (must come before conditional returns)
  useEffect(() => {
    if (userData) {
      const data = {
        username: userData.username || "",
        email: userData.email || "",
        bio: userData.desc || "",
        location: userData.country || "",
        phone: userData.phone || "",
        img: userData.img || "",
        joinDate: userData.createdAt
          ? new Date(userData.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })
          : "",
        rating:
          userData.starNumber > 0
            ? (userData.totalStars / userData.starNumber).toFixed(1)
            : "N/A",
        tripsCompleted: userData.tripsCompleted || 0,
        isSeller: userData.isSeller || false,
      };
      setProfileData(data);
      setOriginalData(data);
    }
  }, [userData]);

  // Mutation for updating profile with optimistic updates
  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await newRequest.put(`/users/${userId}`, {
        desc: updatedData.bio,
        country: updatedData.location,
        phone: updatedData.phone,
        img: updatedData.img,
      });
      return res.data;
    },
    onMutate: async (updatedData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(["user", userId]);

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(["user", userId]);

      // Optimistically update cache
      queryClient.setQueryData(["user", userId], (old) => ({
        ...old,
        desc: updatedData.bio,
        country: updatedData.location,
        phone: updatedData.phone,
        img: updatedData.img,
      }));

      return { previousUser };
    },
    onError: (err, updatedData, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(["user", userId], context.previousUser);
      }
      setProfileData(originalData);
      const errorMessage =
        err.response?.data?.message || "Failed to update profile";
      setToast({ type: "error", message: errorMessage });
    },
    onSuccess: async () => {
      // Refresh user data in AuthContext to sync updated profile
      if (refreshUser) {
        await refreshUser();
      }

      setIsEditing(false);
      setToast({ type: "success", message: "Profile updated successfully!" });
      setErrors({});
      setImagePreview(null);

      // Update original data with new values
      setOriginalData(profileData);

      // Invalidate queries to refetch updated data
      await queryClient.invalidateQueries(["user", userId]);
    },
    onSettled: () => {
      // Refetch to ensure sync
      queryClient.invalidateQueries(["user", userId]);
    },
  });

  // NOW conditional returns (after all hooks)
  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!userId && currentUser) {
    console.warn("User is logged in but doesn't have MongoDB ID yet");
  }

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profileData.location || profileData.location.trim() === "") {
      newErrors.location = "Location is required";
    }

    if (profileData.phone && profileData.phone.trim().length < 10) {
      newErrors.phone = "Phone number must be at least 10 characters";
    }

    // Safety check - ensure bio is a string before checking length
    const bioLength = (profileData.bio || "").length;
    if (bioLength > 500) {
      newErrors.bio = "Bio must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setToast({ type: "error", message: "Image must be less than 5MB" });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setToast({ type: "error", message: "Please select an image file" });
      return;
    }

    // Show preview immediately (optimistic)
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploadingImage(true);
    try {
      const url = await upload(file);
      setProfileData((prev) => ({
        ...prev,
        img: url,
      }));
      setToast({
        type: "success",
        message: "Image uploaded! Click 'Save Changes' to update your profile.",
      });
    } catch (error) {
      console.error("Image upload error:", error);
      setToast({
        type: "error",
        message: "Image upload failed. Please try again.",
      });
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = () => {
    if (!validateForm()) {
      setToast({ type: "error", message: "Please fix the errors below" });
      return;
    }

    console.log("Saving profile:", profileData);
    console.log("User ID:", userId);
    updateMutation.mutate(profileData);
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
    setErrors({});
    setImagePreview(null);
    setUploadingImage(false);
  };

  if (isLoading) {
    return (
      <div className="profile">
        <div className="responsive-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile">
        <div className="responsive-container">
          <div className="error-container">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2>Failed to load profile</h2>
            <p>{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

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
                    src={imagePreview || profileData.img || "/img/noavatar.png"}
                    alt="Profile"
                    className="profile-avatar"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/img/noavatar.png";
                    }}
                  />
                  {uploadingImage && (
                    <div className="upload-overlay">
                      <div className="upload-spinner"></div>
                      <span>Uploading...</span>
                    </div>
                  )}
                  {isOwnProfile && isEditing && !uploadingImage && (
                    <>
                      <button
                        className="avatar-edit-btn"
                        onClick={handleImageClick}
                        type="button"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 4v16m8-8H4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden-file-input"
                      />
                    </>
                  )}
                </div>
                {profileData.isSeller && (
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
                    Verified Seller
                  </div>
                )}
              </div>

              <div className="profile-info">
                <h1 className="profile-name">{profileData.username}</h1>
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
                  {profileData.location || "Not specified"}
                </p>

                {/* Star Rating Display */}
                {userData && userData.starNumber > 0 && (
                  <div className="profile-rating">
                    <StarRating
                      rating={userData.totalStars / userData.starNumber}
                      totalReviews={userData.starNumber}
                      size="medium"
                      showNumber={true}
                    />
                  </div>
                )}

                <div className="profile-stats">
                  <div className="stat">
                    <span className="stat-value">
                      {userData && userData.starNumber > 0
                        ? (userData.totalStars / userData.starNumber).toFixed(1)
                        : "N/A"}
                    </span>
                    <span className="stat-label">Rating</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">
                      {profileData.tripsCompleted}
                    </span>
                    <span className="stat-label">Trips</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">
                      {profileData.joinDate
                        ? profileData.joinDate.split(" ")[1]
                        : "2025"}
                    </span>
                    <span className="stat-label">Member Since</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="header-actions">
              {!isOwnProfile && (
                <div className="public-profile-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M3 12h12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Public Profile
                </div>
              )}
              {isOwnProfile && !isEditing && (
                <button
                  className="action-btn primary"
                  onClick={() => setIsEditing(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Edit Profile
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
                className="profile-section full-width"
              >
                <h2 className="section-title">About</h2>
                <div className="section-content">
                  {isOwnProfile && isEditing ? (
                    <div className="input-group">
                      <textarea
                        className={`bio-input ${errors.bio ? "error" : ""}`}
                        value={safeBio}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        placeholder="Tell us about yourself..."
                        rows="4"
                        maxLength="500"
                      />
                      <div className="input-footer">
                        {errors.bio && (
                          <span className="error-text">{errors.bio}</span>
                        )}
                        <span className="char-count">{safeBio.length}/500</span>
                      </div>
                    </div>
                  ) : (
                    <p className="bio-text">
                      {profileData.bio || "No bio provided yet."}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Contact Information */}
              {/* Only show contact info section for own profile */}
              {isOwnProfile && (
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
                        <div className="info-value-with-icon">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="info-value">
                            {profileData.email}
                          </span>
                        </div>
                      </div>

                      <div className="info-item">
                        <label className="info-label">Phone</label>
                        {isEditing ? (
                          <div className="input-group">
                            <input
                              type="tel"
                              className={`info-input ${
                                errors.phone ? "error" : ""
                              }`}
                              value={profileData.phone}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              placeholder="+1 (555) 123-4567"
                            />
                            {errors.phone && (
                              <span className="error-text">{errors.phone}</span>
                            )}
                          </div>
                        ) : (
                          <div className="info-value-with-icon">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="info-value">
                              {profileData.phone || "Not provided"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="info-item">
                        <label className="info-label">
                          Location <span className="required">*</span>
                        </label>
                        {isEditing ? (
                          <div className="input-group">
                            <CountrySelect
                              value={profileData.location}
                              onChange={(e) =>
                                handleInputChange("location", e.target.value)
                              }
                              placeholder="Select your country"
                              className={errors.location ? "error" : ""}
                            />
                            {errors.location && (
                              <span className="error-text">
                                {errors.location}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="info-value-with-icon">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
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
                            <span className="info-value">
                              {profileData.location}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Activity Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="profile-section"
              >
                <h2 className="section-title">Activity Summary</h2>
                <div className="section-content">
                  <div className="activity-stats">
                    <div className="activity-item">
                      <div className="activity-icon success">
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
                        <span className="activity-value">
                          {profileData.tripsCompleted}
                        </span>
                        <span className="activity-label">Trips Completed</span>
                      </div>
                    </div>

                    <div className="activity-item">
                      <div className="activity-icon warning">
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
                        <span className="activity-value">
                          {profileData.rating}
                        </span>
                        <span className="activity-label">Average Rating</span>
                      </div>
                    </div>

                    <div className="activity-item">
                      <div className="activity-icon info">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="activity-content">
                        <span className="activity-value">
                          {profileData.joinDate || "N/A"}
                        </span>
                        <span className="activity-label">Member Since</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Sticky Bottom Save Bar - Only show in edit mode on own profile */}
          <AnimatePresence>
            {isOwnProfile && isEditing && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="sticky-save-bar"
              >
                <div className="save-bar-content">
                  <div className="save-bar-info">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>You have unsaved changes</span>
                  </div>

                  <div className="save-bar-actions">
                    <button
                      className="action-btn secondary"
                      onClick={handleCancel}
                      disabled={updateMutation.isPending || uploadingImage}
                    >
                      Cancel
                    </button>
                    <button
                      className="action-btn primary"
                      onClick={handleSave}
                      disabled={updateMutation.isPending || uploadingImage}
                    >
                      {updateMutation.isPending ? (
                        <>
                          <div className="btn-spinner"></div>
                          Saving...
                        </>
                      ) : uploadingImage ? (
                        <>
                          <div className="btn-spinner"></div>
                          Uploading Image...
                        </>
                      ) : (
                        <>
                          <svg
                            width="16"
                            height="16"
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
                          Save All Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;
