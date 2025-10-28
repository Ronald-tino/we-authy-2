import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyContainers.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useMode } from "../../context/ModeContext";
import { calculateDaysRemaining } from "../../utils/calculateDaysRemaining";

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

  const mutation = useMutation({
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

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  const handleComplete = (e, id) => {
    e.stopPropagation();
    completeMutation.mutate(id);
  };

  const handleContainerClick = (containerId) => {
    navigate(`/container/${containerId}`);
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper function to get expiration status
  const getExpirationStatus = (createdAt, expirationDays) => {
    if (!createdAt || !expirationDays) return null;
    const { daysRemaining, status, isExpired } = calculateDaysRemaining(
      createdAt,
      expirationDays
    );
    return { daysRemaining, status, isExpired };
  };

  // Get container type label
  const getContainerTypeLabel = (type) => {
    const labels = {
      "20ft": "20ft",
      "40ft": "40ft",
      "40ft-HC": "40ft HC",
    };
    return labels[type] || type;
  };

  return (
    <div className="myContainers">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>My Containers</h1>
            {isInSellerMode && (
              <Link to="/add-container">
                <button>Add New Container</button>
              </Link>
            )}
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Location</th>
                <th>Title</th>
                <th>Price/CBM</th>
                <th>Space (CBM)</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Expires In</th>
                <th>Sales</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((container, index) => (
                  <tr
                    key={container._id}
                    onClick={() => handleContainerClick(container._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="number-cell">{index + 1}</td>
                    <td className="type-cell">
                      {getContainerTypeLabel(container.containerType)}
                    </td>
                    <td>
                      <div className="location">
                        <span className="city">
                          {container.locationCity || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="title-cell">
                      {container.title || "Untitled"}
                    </td>
                    <td className="price-cell">
                      <span className="amount">{container.priceRMB}</span>
                      <span className="currency">¥</span>
                    </td>
                    <td className="space-cell">
                      {container.availableSpaceCBM
                        ? `${container.availableSpaceCBM} CBM`
                        : "N/A"}
                    </td>
                    <td className="date-cell">
                      {formatDate(container.departureDate)}
                    </td>
                    <td className="date-cell">
                      {formatDate(container.arrivalDate)}
                    </td>
                    <td className="expires-cell">
                      {container.expirationDays
                        ? (() => {
                            const expirationStatus = getExpirationStatus(
                              container.createdAt,
                              container.expirationDays
                            );
                            return expirationStatus ? (
                              <span
                                className={`expiration-status expiration-status--${expirationStatus.status}`}
                              >
                                {expirationStatus.isExpired ? (
                                  container.isCompleted ? (
                                    <span className="completed-badge">
                                      ✓ COMPLETED
                                    </span>
                                  ) : (
                                    <button
                                      className="complete-btn"
                                      onClick={(e) =>
                                        handleComplete(e, container._id)
                                      }
                                      disabled={completeMutation.isPending}
                                    >
                                      {completeMutation.isPending
                                        ? "Marking..."
                                        : "Mark Complete"}
                                    </button>
                                  )
                                ) : (
                                  <>
                                    <span className="days">
                                      {expirationStatus.daysRemaining}
                                    </span>
                                    <span className="label"> days left</span>
                                  </>
                                )}
                              </span>
                            ) : (
                              "N/A"
                            );
                          })()
                        : "N/A"}
                    </td>
                    <td>{container.sales || 0}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <img
                        className="delete"
                        src="./img/delete.png"
                        alt="Delete"
                        onClick={() => handleDelete(container._id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No containers found. Create your first container listing!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyContainers;
