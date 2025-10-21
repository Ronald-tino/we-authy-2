import React from "react";
import "./GigCard.scss";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import {
  calculateDaysRemaining,
  getExpirationMessage,
  getExpirationClass,
} from "../../utils/calculateDaysRemaining";

const GigCard = ({ item }) => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [interestedOpen, setInterestedOpen] = React.useState(false);
  const [interestedUsers, setInterestedUsers] = React.useState([]);
  const [interestedCount, setInterestedCount] = React.useState(0);
  const [isInterested, setIsInterested] = React.useState(false);

  const { isLoading, error, data } = useQuery({
    queryKey: ["gigUser", item.userId],
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

  // Calculate price per kg (in Yuan)
  const pricePerKg = () => {
    if (!item?.availableSpace || item.availableSpace === 0) return 0;
    return Math.round(item?.price / item?.availableSpace);
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
      // Navigate to the message page with the conversation ID
      navigate(`/message/${data.data.id}`);
    },
    onError: (error) => {
      console.error("Error creating conversation:", error);
      alert("Failed to start conversation. Please try again.");
    },
  });

  const handleChatNow = (e) => {
    e.preventDefault(); // Prevent the Link navigation
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
      return await newRequest.post(`/gigs/${item._id}/interest`);
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
      alert("You cannot make an offer on your own gig!");
      return;
    }

    toggleInterestMutation.mutate();
  };

  // Fetch interested users list on demand (when opening dropdown)
  const handleToggleInterestedList = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      // If opening and list is empty, fetch
      if (!interestedOpen) {
        const res = await newRequest.get(`/gigs/${item._id}/interested`);
        setInterestedUsers(res.data?.interestedUsers || []);
        setInterestedCount(res.data?.interestedCount || 0);
        // Determine if current user is in the list
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
    <Link to={`/gig/${item._id}`} className="link">
      <div className="gig-card">
        {/* Header */}
        <div className="gig-card__header">
          <div className="gig-card__user">
            <img
              className="gig-card__avatar"
              src={
                isLoading || error
                  ? "/img/noavatar.png"
                  : data?.img || "/img/noavatar.png"
              }
              alt={isLoading || error ? "User" : data?.username || "User"}
            />
            <div className="gig-card__user-info">
              <div className="gig-card__user-top">
                <span className="gig-card__id">
                  #
                  {String(item._id || "")
                    .slice(-6)
                    .toUpperCase()}
                </span>
                <span className="gig-card__badge">New</span>
              </div>
              <div className="gig-card__user-name">
                <span className="gig-card__name">
                  {isLoading
                    ? "Loading..."
                    : error
                    ? "Unknown"
                    : data?.username || "Unknown"}
                </span>
                <span className="gig-card__verified">✓</span>
              </div>
              <span className="gig-card__timestamp">{formatTimestamp()}</span>
            </div>
          </div>
          {item?.expirationDays && (
            <div className="gig-card__status">Abroad</div>
          )}
        </div>

        {/* Route Section */}
        <div className="gig-card__route">
          <div className="gig-card__route-point gig-card__route-point--departure">
            <span className="gig-card__dot gig-card__dot--white"></span>
            <span className="gig-card__code gig-card__code--white">
              {(item?.departureCountry || "AE")
                .toString()
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </div>

          <div className="gig-card__route-line">
            <span className="gig-card__dash"></span>
            <span className="gig-card__plane">✈</span>
            <span className="gig-card__dash gig-card__dash--long"></span>
            <span className="gig-card__plane">✈</span>
            <span className="gig-card__dash"></span>
          </div>

          <div className="gig-card__route-point gig-card__route-point--destination">
            <span className="gig-card__code gig-card__code--green">
              {(item?.destinationCountry || "PK")
                .toString()
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <span className="gig-card__dot gig-card__dot--green"></span>
          </div>
        </div>

        {/* Location Details */}
        <div className="gig-card__locations">
          <div className="gig-card__location gig-card__location--departure">
            <span className="gig-card__location-text">
              {item?.departureCity || "Dubai"},{" "}
              {item?.departureCountry || "United Arab Emirates"}
            </span>
          </div>
          <div className="gig-card__location gig-card__location--destination">
            <span className="gig-card__location-text">
              {item?.destinationCity || "Lahore"},{" "}
              {item?.destinationCountry || "Pakistan"}
            </span>
          </div>
        </div>

        {/* Expiration */}
        {item?.expirationDays && (
          <div
            className={`gig-card__expiration gig-card__expiration--${expirationClass}`}
          >
            {expirationMessage}
          </div>
        )}

        {/* Space & Price Section */}
        <div className="gig-card__info">
          <div className="gig-card__space">
            <div className="gig-card__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect
                  x="4"
                  y="7"
                  width="16"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M9 7V5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="4"
                  y1="11"
                  x2="20"
                  y2="11"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="gig-card__info-content">
              <span className="gig-card__label">Available Space</span>
              <span className="gig-card__value">
                {item?.availableSpace || 40} kg
              </span>
              <span className="gig-card__subtext">Booked 0 kg</span>
            </div>
          </div>

          <div className="gig-card__price">
            <div className="gig-card__icon">
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
            <div className="gig-card__info-content">
              <span className="gig-card__label">Price</span>
              <span className="gig-card__value gig-card__value--highlight">
                {pricePerKg() || 120}¥ per kg
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="gig-card__actions">
          <button
            className="gig-card__btn gig-card__btn--outline"
            type="button"
            onClick={handleChatNow}
            disabled={createConversationMutation.isPending}
          >
            {createConversationMutation.isPending ? "Creating..." : "Chat Now"}
          </button>
          <button
            className="gig-card__btn gig-card__btn--primary"
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
        <div className="gig-card__stats">
          <span className="gig-card__stat gig-card__stat--offers">
            {data?.tripsCompleted || 0} Trips Done
          </span>
          <span className="gig-card__separator">|</span>
          <span
            className={`gig-card__stat gig-card__stat--bookings ${
              interestedOpen ? "gig-card__stat--open" : ""
            }`}
            onClick={handleToggleInterestedList}
          >
            Interested{interestedCount ? ` (${interestedCount})` : ""}
          </span>
        </div>

        {interestedOpen && (
          <div className="gig-card__interested-list">
            {interestedUsers.length === 0 ? (
              <div className="gig-card__interested-empty">
                No interested users yet.
              </div>
            ) : (
              interestedUsers.map((u) => (
                <div className="gig-card__interested-item" key={u._id}>
                  <img
                    className="gig-card__interested-avatar"
                    src={u.img || "/img/noavatar.png"}
                    alt={u.username || "User"}
                  />
                  <span className="gig-card__interested-name">
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

export default GigCard;
