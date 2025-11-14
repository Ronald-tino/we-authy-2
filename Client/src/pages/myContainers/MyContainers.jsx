import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyContainers.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useMode } from "../../context/ModeContext";
import { calculateDaysRemaining, getExpirationMessage, getExpirationClass } from "../../utils/calculateDaysRemaining";
import fixCloudinaryUrl from "../../utils/fixCloudinaryUrl";

function MyContainers() {
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
    queryKey: ["myContainers", user?._id],
    queryFn: () => {
      return newRequest
        .get(`/containers?userId=${user._id}`)
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
      return newRequest.delete(`/containers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myContainers"]);
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id) => {
      return newRequest.post(`/containers/${id}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myContainers"]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      return newRequest.put(`/containers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myContainers"]);
    },
  });

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this container?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleComplete = (e, id) => {
    e.stopPropagation();
    completeMutation.mutate(id);
  };

  const handleContainerClick = (containerId) => {
    navigate(`/container/${containerId}`);
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

  return (
    <div className="myContainers">
      {isLoading ? (
        <div className="loading">Loading your containers...</div>
      ) : error ? (
        <div className="error">Error loading containers. Please try again.</div>
      ) : (
        <div className="container">
          <div className="title">
            <h1>My Containers</h1>
            {isInSellerMode && (
              <Link to="/add-container">
                <button className="add-btn">Add New Container</button>
              </Link>
            )}
          </div>
          
          {data && data.length > 0 ? (
            <div className="cards-grid">
              {data.map((container) => (
                <OwnerContainerCard
                  key={container._id}
                  container={container}
                  onDelete={handleDelete}
                  onComplete={handleComplete}
                  onUpdate={updateMutation.mutate}
                  onClick={handleContainerClick}
                  formatDate={formatDate}
                  getContainerTypeBadge={getContainerTypeBadge}
                  isUpdating={updateMutation.isPending}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No containers found. Create your first container listing!</p>
              <Link to="/add-container">
                <button className="add-btn">Add New Container</button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Owner Container Card Component with Edit Controls
function OwnerContainerCard({ 
  container, 
  onDelete, 
  onComplete, 
  onUpdate, 
  onClick, 
  formatDate, 
  getContainerTypeBadge,
  isUpdating 
}) {
  const [editingSpace, setEditingSpace] = useState(false);
  const [editingPrice, setEditingPrice] = useState(false);
  const [spaceValue, setSpaceValue] = useState(container.availableSpaceCBM || 0);
  const [priceValue, setPriceValue] = useState(container.priceRMB || 0);

  const containerBadge = getContainerTypeBadge(container.containerType);
  const expirationInfo = calculateDaysRemaining(container.createdAt, container.expirationDays);
  const expirationMessage = getExpirationMessage(expirationInfo.daysRemaining, expirationInfo.isExpired);
  const expirationClass = getExpirationClass(expirationInfo.status);

  const handleSaveSpace = (e) => {
    e.stopPropagation();
    if (spaceValue <= 0) {
      alert("Space must be a positive number");
      return;
    }
    onUpdate({ id: container._id, data: { availableSpaceCBM: parseFloat(spaceValue) } });
    setEditingSpace(false);
  };

  const handleSavePrice = (e) => {
    e.stopPropagation();
    if (priceValue <= 0) {
      alert("Price must be a positive number");
      return;
    }
    onUpdate({ id: container._id, data: { priceRMB: parseFloat(priceValue) } });
    setEditingPrice(false);
  };

  const handleCancelSpace = (e) => {
    e.stopPropagation();
    setSpaceValue(container.availableSpaceCBM);
    setEditingSpace(false);
  };

  const handleCancelPrice = (e) => {
    e.stopPropagation();
    setPriceValue(container.priceRMB);
    setEditingPrice(false);
  };

  return (
    <div className="owner-container-card" onClick={() => onClick(container._id)}>
      {/* Header with Type Badge */}
      <div className="owner-container-card__header">
        <div className="owner-container-card__id">
          #{String(container._id).slice(-6).toUpperCase()}
        </div>
        <div 
          className="owner-container-card__type-badge"
          style={{ backgroundColor: containerBadge.color }}
        >
          {containerBadge.label}
        </div>
      </div>

      {/* Title */}
      <h3 className="owner-container-card__title">{container.title}</h3>

      {/* Location */}
      <div className="owner-container-card__location">
        <span className="icon">📍</span>
        <span>{container.locationCity}, {container.locationCountry}</span>
      </div>

      {/* Timeline */}
      <div className="owner-container-card__timeline">
        <div className="timeline-item">
          <span className="label">Departs</span>
          <span className="date">{formatDate(container.departureDate)}</span>
        </div>
        <span className="arrow">→</span>
        <div className="timeline-item">
          <span className="label">Arrives</span>
          <span className="date">{formatDate(container.arrivalDate)}</span>
        </div>
      </div>

      {/* Expiration Status */}
      {container.expirationDays && (
        <div className={`owner-container-card__expiration owner-container-card__expiration--${expirationClass}`}>
          {expirationInfo.isExpired ? (
            container.isCompleted ? (
              <span className="completed-badge">✓ COMPLETED</span>
            ) : (
              <button
                className="complete-btn"
                onClick={(e) => onComplete(e, container._id)}
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
      <div className="owner-container-card__editable-section">
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
              placeholder="Space (CBM)"
              step="0.5"
              min="0.5"
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
            <span className="value">{container.availableSpaceCBM} CBM</span>
            {container.originalSpaceCBM && 
             container.originalSpaceCBM !== container.availableSpaceCBM && (
              <span className="original-value">
                / {container.originalSpaceCBM} CBM original
              </span>
            )}
          </div>
        )}
      </div>

      {/* Editable Price Section */}
      <div className="owner-container-card__editable-section">
        <div className="section-header">
          <span className="label">Price per CBM</span>
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
            <span className="value highlight">¥{container.priceRMB}</span>
            {container.originalPriceRMB && 
             container.originalPriceRMB !== container.priceRMB && (
              <span className="was-price">
                Was: ¥{container.originalPriceRMB}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="owner-container-card__stats">
        <span className="stat">Sales: {container.sales || 0}</span>
        <span className="separator">|</span>
        <span className="stat">Interested: {container.interestedUsers?.length || 0}</span>
      </div>

      {/* Actions */}
      <div className="owner-container-card__actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="delete-btn"
          onClick={(e) => onDelete(e, container._id)}
          title="Delete container"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default MyContainers;
