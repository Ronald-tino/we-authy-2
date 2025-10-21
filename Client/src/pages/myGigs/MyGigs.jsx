import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useMode } from "../../context/ModeContext";
import { calculateDaysRemaining } from "../../utils/calculateDaysRemaining";

function MyGigs() {
  const currentUser = getCurrentUser();
  const user = currentUser?.info || currentUser; // Handle both nested and direct user objects
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
    enabled: !!user?._id, // Only run query if we have a user ID
  });

  const mutation = useMutation({
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

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  const handleComplete = (e, id) => {
    e.stopPropagation();
    completeMutation.mutate(id);
  };

  const handleGigClick = (gigId) => {
    navigate(`/gig/${gigId}`);
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

  return (
    <div className="myGigs">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Gigs</h1>
            {isInSellerMode && (
              <Link to="/add">
                <button>Add New Gig</button>
              </Link>
            )}
          </div>
          <table>
            <tbody>
              {data && data.length > 0 ? (
                data.map((gig, index) => (
                  <tr
                    key={gig._id}
                    onClick={() => handleGigClick(gig._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="number-cell">{index + 1}</td>
                    <td>
                      <div className="route">
                        <span className="city">
                          {gig.departureCity || "N/A"}
                        </span>
                        <span className="arrow">→</span>
                        <span className="city">
                          {gig.destinationCity || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="title-cell">{gig.title || "Untitled"}</td>
                    <td className="price-cell">
                      {gig.priceRMB ? (
                        <>
                          <span className="amount">{gig.priceRMB}</span>
                          <span className="currency">¥</span>
                        </>
                      ) : gig.price ? (
                        `$${gig.price}`
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="space-cell">
                      {gig.availableSpace ? `${gig.availableSpace} kg` : "N/A"}
                    </td>
                    <td className="expires-cell">
                      {gig.expirationDays
                        ? (() => {
                            const expirationStatus = getExpirationStatus(
                              gig.createdAt,
                              gig.expirationDays
                            );
                            return expirationStatus ? (
                              <span
                                className={`expiration-status expiration-status--${expirationStatus.status}`}
                              >
                                {expirationStatus.isExpired ? (
                                  gig.isCompleted ? (
                                    <span className="completed-badge">
                                      ✓ COMPLETED
                                    </span>
                                  ) : (
                                    <button
                                      className="complete-btn"
                                      onClick={(e) =>
                                        handleComplete(e, gig._id)
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
                    <td>{gig.sales || 0}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <img
                        className="delete"
                        src="./img/delete.png"
                        alt="Delete"
                        onClick={() => handleDelete(gig._id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No gigs found. Create your first gig!
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

export default MyGigs;
