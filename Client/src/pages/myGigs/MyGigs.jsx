import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useMode } from "../../context/ModeContext";
import { calculateDaysRemaining, getExpirationMessage, getExpirationClass } from "../../utils/calculateDaysRemaining";

function MyGigs() {
  const currentUser = getCurrentUser();
  const user = currentUser?.info || currentUser;
  const navigate = useNavigate();
  const { isInSellerMode, isSeller } = useMode();

  const queryClient = useQueryClient();

  // Redirect if user is not in seller mode
  useEffect(() => {
    if (!isSeller || !isInSellerMode) {
      navigate("/");
    }
  }, [isSeller, isInSellerMode, navigate]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs", user?._id],
    queryFn: () => {
      return newRequest
        .get(`/gigs?userId=${user._id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.error("API error:", err);
          throw err;
        });
    },
    enabled: !!user?._id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/gigs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id) => {
      return newRequest.post(`/gigs/${id}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      return newRequest.put(`/gigs/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this gig?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleComplete = (e, id) => {
    e.stopPropagation();
    completeMutation.mutate(id);
  };

  const handleGigClick = (gigId) => {
    navigate(`/gig/${gigId}`);
  };

  return (
    <div className="myGigs">
      {isLoading ? (
        <div className="loading">Loading your gigs...</div>
      ) : error ? (
        <div className="error">Error loading gigs. Please try again.</div>
      ) : (
        <div className="container">
          <div className="title">
            <h1>My Gigs</h1>
            {isInSellerMode && (
              <Link to="/add">
                <button className="add-btn">Add New Gig</button>
              </Link>
            )}
          </div>
          
          {data && data.length > 0 ? (
            <div className="cards-grid">
              {data.map((gig) => (
                <OwnerGigCard
                  key={gig._id}
                  gig={gig}
                  onDelete={handleDelete}
                  onComplete={handleComplete}
                  onUpdate={updateMutation.mutate}
                  onClick={handleGigClick}
                  isUpdating={updateMutation.isPending}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No gigs found. Create your first gig!</p>
              <Link to="/add">
                <button className="add-btn">Add New Gig</button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Owner Gig Card Component with Edit Controls
function OwnerGigCard({ 
  gig, 
  onDelete, 
  onComplete, 
  onUpdate, 
  onClick,
  isUpdating 
}) {
  const [editingSpace, setEditingSpace] = useState(false);
  const [editingPrice, setEditingPrice] = useState(false);
  const [spaceValue, setSpaceValue] = useState(gig.availableSpace || 0);
  const [priceValue, setPriceValue] = useState(gig.priceRMB || 0);

  const expirationInfo = calculateDaysRemaining(gig.createdAt, gig.expirationDays);
  const expirationMessage = getExpirationMessage(expirationInfo.daysRemaining, expirationInfo.isExpired);
  const expirationClass = getExpirationClass(expirationInfo.status);

  const handleSaveSpace = (e) => {
    e.stopPropagation();
    if (spaceValue <= 0) {
      alert("Space must be a positive number");
      return;
    }
    onUpdate({ id: gig._id, data: { availableSpace: parseFloat(spaceValue) } });
    setEditingSpace(false);
  };

  const handleSavePrice = (e) => {
    e.stopPropagation();
    if (priceValue <= 0) {
      alert("Price must be a positive number");
      return;
    }
    onUpdate({ id: gig._id, data: { priceRMB: parseFloat(priceValue) } });
    setEditingPrice(false);
  };

  const handleCancelSpace = (e) => {
    e.stopPropagation();
    setSpaceValue(gig.availableSpace);
    setEditingSpace(false);
  };

  const handleCancelPrice = (e) => {
    e.stopPropagation();
    setPriceValue(gig.priceRMB);
    setEditingPrice(false);
  };

  return (
    <div className="owner-gig-card" onClick={() => onClick(gig._id)}>
      {/* Header with ID */}
      <div className="owner-gig-card__header">
        <div className="owner-gig-card__id">
          #{String(gig._id).slice(-6).toUpperCase()}
        </div>
        <div className="owner-gig-card__status">Active</div>
      </div>

      {/* Title */}
      <h3 className="owner-gig-card__title">{gig.title}</h3>

      {/* Route */}
      <div className="owner-gig-card__route">
        <div className="route-point">
          <span className="dot dot--white"></span>
          <span className="code code--white">
            {(gig.departureCountry || "").slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="route-line">
          <span className="dash"></span>
          <span className="plane">✈</span>
          <span className="dash dash--long"></span>
          <span className="plane">✈</span>
          <span className="dash"></span>
        </div>
        <div className="route-point">
          <span className="code code--green">
            {(gig.destinationCountry || "").slice(0, 2).toUpperCase()}
          </span>
          <span className="dot dot--green"></span>
        </div>
      </div>

      {/* Location Details */}
      <div className="owner-gig-card__locations">
        <div className="location location--departure">
          {gig.departureCity}, {gig.departureCountry}
        </div>
        <div className="location location--destination">
          {gig.destinationCity}, {gig.destinationCountry}
        </div>
      </div>

      {/* Expiration Status */}
      {gig.expirationDays && (
        <div className={`owner-gig-card__expiration owner-gig-card__expiration--${expirationClass}`}>
          {expirationInfo.isExpired ? (
            gig.isCompleted ? (
              <span className="completed-badge">✓ COMPLETED</span>
            ) : (
              <button
                className="complete-btn"
                onClick={(e) => onComplete(e, gig._id)}
              >
                Mark Complete
              </button>
            )
          ) : (
            expirationMessage
          )}
        </div>
      )}

      {/* Editable Space Section */}
      <div className="owner-gig-card__editable-section">
        <div className="section-header">
          <span className="label">Available Space</span>
          {!editingSpace && (
            <button 
              className="edit-icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                setEditingSpace(true);
              }}
              title="Edit space"
            >
              ✏️
            </button>
          )}
        </div>
        {editingSpace ? (
          <div className="edit-controls" onClick={(e) => e.stopPropagation()}>
            <input
              type="number"
              value={spaceValue}
              onChange={(e) => setSpaceValue(e.target.value)}
              className="edit-input"
              placeholder="Space (kg)"
              step="1"
              min="1"
            />
            <div className="edit-buttons">
              <button 
                className="save-btn" 
                onClick={handleSaveSpace}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
              <button 
                className="cancel-btn" 
                onClick={handleCancelSpace}
                disabled={isUpdating}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="value-display">
            <span className="value">{gig.availableSpace} kg</span>
            {gig.originalSpace && 
             gig.originalSpace !== gig.availableSpace && (
              <span className="original-value">
                / {gig.originalSpace} kg original
              </span>
            )}
          </div>
        )}
      </div>

      {/* Editable Price Section */}
      <div className="owner-gig-card__editable-section">
        <div className="section-header">
          <span className="label">Price per kg</span>
          {!editingPrice && (
            <button 
              className="edit-icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                setEditingPrice(true);
              }}
              title="Edit price"
            >
              ✏️
            </button>
          )}
        </div>
        {editingPrice ? (
          <div className="edit-controls" onClick={(e) => e.stopPropagation()}>
            <input
              type="number"
              value={priceValue}
              onChange={(e) => setPriceValue(e.target.value)}
              className="edit-input"
              placeholder="Price (¥)"
              step="1"
              min="1"
            />
            <div className="edit-buttons">
              <button 
                className="save-btn" 
                onClick={handleSavePrice}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
              <button 
                className="cancel-btn" 
                onClick={handleCancelPrice}
                disabled={isUpdating}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="value-display">
            <span className="value highlight">¥{gig.priceRMB}</span>
            {gig.originalPriceRMB && 
             gig.originalPriceRMB !== gig.priceRMB && (
              <span className="was-price">
                Was: ¥{gig.originalPriceRMB}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="owner-gig-card__stats">
        <span className="stat">Sales: {gig.sales || 0}</span>
        <span className="separator">|</span>
        <span className="stat">Interested: {gig.interestedUsers?.length || 0}</span>
      </div>

      {/* Actions */}
      <div className="owner-gig-card__actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="delete-btn"
          onClick={(e) => onDelete(e, gig._id)}
          title="Delete gig"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default MyGigs;
