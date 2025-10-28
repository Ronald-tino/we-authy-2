import React from "react";
import "./Container.scss";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import fixCloudinaryUrl from "../../utils/fixCloudinaryUrl";
import Reviews from "../../components/Reviews/Reviews";

function Container() {
  const { id } = useParams();
  const navigate = useNavigate();
  const stored = localStorage.getItem("currentUser");
  const parsed = stored ? JSON.parse(stored) : null;
  const currentUser = parsed?.info ?? parsed;

  const { isLoading, error, data } = useQuery({
    queryKey: ["container", id],
    queryFn: () =>
      newRequest.get(`/containers/single/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  const userId = data?.userId;

  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => newRequest.get(`/users/${userId}`).then((res) => res.data),
    enabled: !!userId,
  });

  const avgStars = () => {
    const total = Number(dataUser?.totalStars || 0);
    const count = Number(dataUser?.starNumber || 0);
    if (!count) return 0;
    return Math.round(total / count);
  };

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: (to) => {
      return newRequest.post("/conversations", { to });
    },
    onSuccess: (data) => {
      navigate(`/message/${data.data.id}`);
    },
    onError: (error) => {
      console.error("Error creating conversation:", error);
      alert("Failed to start conversation. Please try again.");
    },
  });

  const handleChatNow = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser._id === userId) {
      alert("You cannot chat with yourself!");
      return;
    }

    createConversationMutation.mutate(userId);
  };

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get container type badge
  const getContainerTypeBadge = (type) => {
    const badges = {
      "20ft": { label: "20ft Standard Container", color: "#3b82f6" },
      "40ft": { label: "40ft Standard Container", color: "#10b981" },
      "40ft-HC": { label: "40ft High Cube Container", color: "#8b5cf6" },
    };
    return badges[type] || badges["20ft"];
  };

  // Get tax clearance label
  const getTaxClearanceLabel = (type) => {
    return type === "handled_by_courier"
      ? "Tax & Customs Handled by Courier"
      : "Tax & Customs Paid Separately by Client";
  };

  const containerBadge = data
    ? getContainerTypeBadge(data.containerType)
    : null;

  return (
    <div className="container-page">
      {isLoading ? (
        "loading"
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="container-wrapper">
          {/* Container Details Section */}
          <div className="container-details">
            <div className="container-details__header">
              <div className="container-details__user">
                <img
                  className="container-details__avatar"
                  src={
                    isLoadingUser || errorUser
                      ? "/img/noavatar.png"
                      : fixCloudinaryUrl(dataUser?.img) || "/img/noavatar.png"
                  }
                  alt={
                    isLoadingUser || errorUser
                      ? "User"
                      : dataUser?.username || "User"
                  }
                />
                <div className="container-details__user-info">
                  <div className="container-details__user-top">
                    <span className="container-details__id">
                      #
                      {String(data._id || "")
                        .slice(-6)
                        .toUpperCase()}
                    </span>
                    <span className="container-details__badge">New</span>
                  </div>
                  <div className="container-details__user-name">
                    <span className="container-details__name">
                      {isLoadingUser
                        ? "Loading..."
                        : errorUser
                        ? "Unknown"
                        : dataUser?.username || "Unknown"}
                    </span>
                    <span className="container-details__verified">✓</span>
                  </div>
                </div>
              </div>
              {containerBadge && (
                <div
                  className="container-details__type-badge"
                  style={{ backgroundColor: containerBadge.color }}
                >
                  {containerBadge.label}
                </div>
              )}
            </div>

            <h1 className="container-details__title">{data.title}</h1>

            {/* Location and Timeline */}
            <div className="container-details__location-section">
              <div className="info-box">
                <h3 className="info-box__title">📍 Current Location</h3>
                <p className="info-box__content">
                  {data.locationCity}, {data.locationCountry}
                </p>
              </div>

              <div className="info-box">
                <h3 className="info-box__title">🚢 Departure Date</h3>
                <p className="info-box__content">
                  {formatDate(data.departureDate)}
                </p>
              </div>

              <div className="info-box">
                <h3 className="info-box__title">🏁 Arrival Date</h3>
                <p className="info-box__content">
                  {formatDate(data.arrivalDate)}
                </p>
              </div>
            </div>

            {/* Tax Clearance */}
            <div className="container-details__tax-section">
              <div className="tax-badge">
                {getTaxClearanceLabel(data.taxClearance)}
              </div>
            </div>

            {/* Description */}
            <div className="container-details__description">
              <h2 className="section-title">About This Container</h2>
              <p className="description-text">{data.about}</p>
            </div>

            {/* Cargo Types */}
            <div className="container-details__cargo">
              <h2 className="section-title">Accepted Cargo Types</h2>
              <p className="cargo-text">{data.cargoType}</p>
            </div>

            {/* Space & Pricing */}
            <div className="container-details__pricing">
              <div className="pricing-box">
                <div className="pricing-box__icon">📦</div>
                <div className="pricing-box__content">
                  <span className="pricing-box__label">Available Space</span>
                  <span className="pricing-box__value">
                    {data.availableSpaceCBM} CBM
                  </span>
                </div>
              </div>

              <div className="pricing-box">
                <div className="pricing-box__icon">💰</div>
                <div className="pricing-box__content">
                  <span className="pricing-box__label">Price per CBM</span>
                  <span className="pricing-box__value pricing-box__value--highlight">
                    ¥{data.priceRMB}
                  </span>
                </div>
              </div>

              <div className="pricing-box">
                <div className="pricing-box__icon">💵</div>
                <div className="pricing-box__content">
                  <span className="pricing-box__label">
                    Total Capacity Value
                  </span>
                  <span className="pricing-box__value">
                    ¥{(data.availableSpaceCBM * data.priceRMB).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Info Sidebar */}
          <div className="seller-info">
            <div className="seller-info__card">
              <div className="seller-info__header">
                <img
                  className="seller-info__avatar"
                  src={
                    isLoadingUser || errorUser
                      ? "/img/noavatar.png"
                      : fixCloudinaryUrl(dataUser?.img) || "/img/noavatar.png"
                  }
                  alt={dataUser?.username || "Seller"}
                />
                <div className="seller-info__details">
                  <h3 className="seller-info__name">
                    {dataUser?.username || "Seller"}
                  </h3>
                  <div className="seller-info__rating">
                    {"⭐".repeat(avgStars())}
                    <span className="rating-count">
                      ({dataUser?.starNumber || 0})
                    </span>
                  </div>
                </div>
              </div>

              <div className="seller-info__stats">
                <div className="stat-item">
                  <span className="stat-label">Trips Completed</span>
                  <span className="stat-value">
                    {dataUser?.tripsCompleted || 0}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Member Since</span>
                  <span className="stat-value">
                    {dataUser?.createdAt
                      ? new Date(dataUser.createdAt).getFullYear()
                      : "N/A"}
                  </span>
                </div>
              </div>

              <button
                className="seller-info__contact-btn"
                onClick={handleChatNow}
                disabled={createConversationMutation.isPending}
              >
                {createConversationMutation.isPending
                  ? "Creating..."
                  : "Contact Seller"}
              </button>
            </div>

            {/* Quick Info */}
            <div className="quick-info">
              <h3 className="quick-info__title">Quick Information</h3>
              <div className="quick-info__list">
                <div className="quick-info__item">
                  <span className="quick-info__label">Container Type:</span>
                  <span className="quick-info__value">
                    {containerBadge?.label || "N/A"}
                  </span>
                </div>
                <div className="quick-info__item">
                  <span className="quick-info__label">Available Space:</span>
                  <span className="quick-info__value">
                    {data.availableSpaceCBM} CBM
                  </span>
                </div>
                <div className="quick-info__item">
                  <span className="quick-info__label">Price per CBM:</span>
                  <span className="quick-info__value">¥{data.priceRMB}</span>
                </div>
                <div className="quick-info__item">
                  <span className="quick-info__label">Tax Clearance:</span>
                  <span className="quick-info__value">
                    {data.taxClearance === "handled_by_courier"
                      ? "Handled"
                      : "Separate"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <Reviews gigId={id} />
    </div>
  );
}

export default Container;
