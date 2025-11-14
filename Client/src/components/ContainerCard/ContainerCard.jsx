import React from "react";
import "./ContainerCard.scss";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import fixCloudinaryUrl from "../../utils/fixCloudinaryUrl";
import {
  calculateDaysRemaining,
  getExpirationMessage,
  getExpirationClass,
} from "../../utils/calculateDaysRemaining";

const ContainerCard = ({ item }) => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [interestedOpen, setInterestedOpen] = React.useState(false);
  const [interestedUsers, setInterestedUsers] = React.useState([]);
  const [interestedCount, setInterestedCount] = React.useState(0);
  const [isInterested, setIsInterested] = React.useState(false);

  const { isLoading, error, data } = useQuery({
    queryKey: ["containerUser", item.userId],
    queryFn: async () => {
      const res = await newRequest.get(`/users/${item.userId}`);
      return res.data;
    },
    enabled: !!item?.userId,
  });

  // Format timestamp
  const formatTimestamp = () => {
    if (!item?.createdAt) return "";
    const date = new Date(item.createdAt);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get container type badge style
  const getContainerTypeBadge = (type) => {
    const badges = {
      "20ft": { label: "20ft", color: "#3b82f6" },
      "40ft": { label: "40ft", color: "#10b981" },
      "40ft-HC": { label: "40ft HC", color: "#8b5cf6" },
    };
    return badges[type] || badges["20ft"];
  };

  const containerBadge = getContainerTypeBadge(item?.containerType);

  // Get tax clearance label
  const getTaxClearanceLabel = (type) => {
    return type === "handled_by_courier" ? "Tax Handled" : "Tax Separate";
  };

  // Calculate days remaining for expiration
  const expirationInfo = calculateDaysRemaining(
    item?.createdAt,
    item?.expirationDays
  );
  const expirationMessage = getExpirationMessage(
    expirationInfo.daysRemaining,
    expirationInfo.isExpired
  );
  const expirationClass = getExpirationClass(expirationInfo.status);

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

  const handleChatNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser._id === item.userId) {
      alert("You cannot chat with yourself!");
      return;
    }

    createConversationMutation.mutate(item.userId);
  };

  // Toggle interest (Make Offer)
  const toggleInterestMutation = useMutation({
    mutationFn: async () => {
      return await newRequest.post(`/containers/${item._id}/interest`);
    },
    onSuccess: (res) => {
      const payload = res.data || {};
      setInterestedCount(payload.interestedCount || 0);
      setInterestedUsers(payload.interestedUsers || []);
      setIsInterested(Boolean(payload.interested));
    },
    onError: (error) => {
      console.error("Error toggling interest:", error);
      alert(
        error?.response?.data?.message ||
          "Failed to update interest. Please try again."
      );
    },
  });

  const handleMakeOffer = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser._id === item.userId) {
      alert("You cannot make an offer on your own container!");
      return;
    }

    toggleInterestMutation.mutate();
  };

  // Fetch interested users list on demand
  const handleToggleInterestedList = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      if (!interestedOpen) {
        const res = await newRequest.get(`/containers/${item._id}/interested`);
        setInterestedUsers(res.data?.interestedUsers || []);
        setInterestedCount(res.data?.interestedCount || 0);
        const inList = (res.data?.interestedUsers || []).some(
          (u) => u?._id === currentUser._id
        );
        setIsInterested(inList);
      }
      setInterestedOpen((prev) => !prev);
    } catch (err) {
      console.error("Error fetching interested users:", err);
      alert(
        err?.response?.data?.message ||
          "Unable to load interested users. Please try again."
      );
    }
  };

  return (
    <Link to={`/container/${item._id}`} className="link">
      <div className="container-card">
        {/* Header */}
        <div className="container-card__header">
          <div
            className="container-card__user"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/profile/${item.userId}`);
            }}
          >
            <img
              className="container-card__avatar"
              src={
                isLoading || error
                  ? "/img/noavatar.png"
                  : fixCloudinaryUrl(data?.img) || "/img/noavatar.png"
              }
              alt={isLoading || error ? "User" : data?.username || "User"}
            />
            <div className="container-card__user-info">
              <div className="container-card__user-top">
                <span className="container-card__id">
                  #
                  {String(item._id || "")
                    .slice(-6)
                    .toUpperCase()}
                </span>
                <span className="container-card__badge">New</span>
              </div>
              <div className="container-card__user-name">
                <span className="container-card__name">
                  {isLoading
                    ? "Loading..."
                    : error
                    ? "Unknown"
                    : data?.username || "Unknown"}
                </span>
                <span className="container-card__verified">✓</span>
              </div>
              <span className="container-card__timestamp">
                {formatTimestamp()}
              </span>
            </div>
          </div>
          <div
            className="container-card__type-badge"
            style={{ backgroundColor: containerBadge.color }}
          >
            {containerBadge.label}
          </div>
        </div>

        {/* Location Section */}
        <div className="container-card__location">
          <div className="container-card__location-icon">📍</div>
          <div className="container-card__location-info">
            <span className="container-card__location-label">Location</span>
            <span className="container-card__location-text">
              {item?.locationCity || "N/A"}, {item?.locationCountry || "N/A"}
            </span>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="container-card__timeline">
          <div className="container-card__timeline-item">
            <span className="container-card__timeline-label">Departs</span>
            <span className="container-card__timeline-date">
              {formatDate(item?.departureDate)}
            </span>
          </div>
          <div className="container-card__timeline-arrow">→</div>
          <div className="container-card__timeline-item">
            <span className="container-card__timeline-label">Arrives</span>
            <span className="container-card__timeline-date">
              {formatDate(item?.arrivalDate)}
            </span>
          </div>
        </div>

        {/* Tax Clearance Badge */}
        <div className="container-card__tax-badge">
          {getTaxClearanceLabel(item?.taxClearance)}
        </div>

        {/* Expiration */}
        {item?.expirationDays && (
          <div
            className={`container-card__expiration container-card__expiration--${expirationClass}`}
          >
            {expirationMessage}
          </div>
        )}

        {/* Space & Price Section */}
        <div className="container-card__info">
          <div className="container-card__space">
            <div className="container-card__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="6"
                  width="18"
                  height="12"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="3"
                  y1="10"
                  x2="21"
                  y2="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="12"
                  y1="10"
                  x2="12"
                  y2="18"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="container-card__info-content">
              <span className="container-card__label">Capacity</span>
              <div className="container-card__capacity-section">
                <span className="container-card__capacity-total">
                  Total: {item?.originalSpaceCBM || item?.availableSpaceCBM || 0} CBM
                </span>
                <span className="container-card__capacity-available">
                  Available: {item?.availableSpaceCBM || 0} CBM
                </span>
              </div>
            </div>
          </div>

          <div className="container-card__price">
            <div className="container-card__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 9L21 6C21 4.89543 20.1046 4 19 4L5 4C3.89543 4 3 4.89543 3 6L3 9"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M21 9L18.5 16C18.2239 16.7766 17.4718 17.2984 16.6462 17.2984L7.35382 17.2984C6.52817 17.2984 5.77609 16.7766 5.5 16L3 9L21 9Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="container-card__info-content">
              <span className="container-card__label">Price per CBM</span>
              {item?.originalPriceRMB && 
               item.originalPriceRMB !== item.priceRMB ? (
                <div className="container-card__price-section">
                  <span className="container-card__price-strikethrough">
                    ¥{item.originalPriceRMB}
                  </span>
                  <span className="container-card__price-now">
                    Now: ¥{item?.priceRMB || 0}
                  </span>
                </div>
              ) : (
                <span className="container-card__value container-card__value--highlight">
                  ¥{item?.priceRMB || 0}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="container-card__actions">
          <button
            className="container-card__btn container-card__btn--outline"
            type="button"
            onClick={handleChatNow}
            disabled={createConversationMutation.isPending}
          >
            {createConversationMutation.isPending ? "Creating..." : "Chat Now"}
          </button>
          <button
            className="container-card__btn container-card__btn--primary"
            type="button"
            onClick={handleMakeOffer}
            disabled={toggleInterestMutation.isPending}
          >
            {toggleInterestMutation.isPending
              ? "Saving..."
              : isInterested
              ? "Interested"
              : "Make Offer"}
          </button>
        </div>

        {/* Stats Footer */}
        <div className="container-card__stats">
          <span className="container-card__stat container-card__stat--offers">
            {data?.tripsCompleted || 0} Trips Done
          </span>
          <span className="container-card__separator">|</span>
          <span
            className={`container-card__stat container-card__stat--bookings ${
              interestedOpen ? "container-card__stat--open" : ""
            }`}
            onClick={handleToggleInterestedList}
          >
            Interested{interestedCount ? ` (${interestedCount})` : ""}
          </span>
        </div>

        {interestedOpen && (
          <div className="container-card__interested-list">
            {interestedUsers.length === 0 ? (
              <div className="container-card__interested-empty">
                No interested users yet.
              </div>
            ) : (
              interestedUsers.map((u) => (
                <div className="container-card__interested-item" key={u._id}>
                  <img
                    className="container-card__interested-avatar"
                    src={fixCloudinaryUrl(u.img) || "/img/noavatar.png"}
                    alt={u.username || "User"}
                  />
                  <span className="container-card__interested-name">
                    {u.username}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ContainerCard;
