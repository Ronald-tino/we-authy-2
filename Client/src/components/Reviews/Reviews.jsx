import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import newRequest from "../../utils/newRequest";
import Review from "../Review/Review";
import "./Reviews.scss";
const Reviews = ({ sellerId }) => {
  const queryClient = useQueryClient();
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { isLoading, error, data } = useQuery({
    queryKey: ["reviews", sellerId],
    queryFn: () =>
      newRequest.get(`/reviews/${sellerId}`).then((res) => {
        console.log("Reviews fetched:", res.data);
        return res.data;
      }),
    enabled: !!sellerId,
  });

  const mutation = useMutation({
    mutationFn: (review) => {
      console.log("Submitting review:", review);
      return newRequest.post("/reviews", review);
    },
    onSuccess: (data) => {
      console.log("Review submitted successfully:", data);
      queryClient.invalidateQueries(["reviews", sellerId]);
    },
    onError: (error) => {
      console.error("Review submission failed:", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const desc = formData.get("desc");
    const star = selectedRating;

    console.log("Form data:", { desc, star, sellerId });

    if (!desc.trim()) {
      alert("Please write a review");
      return;
    }

    if (!star) {
      alert("Please select a star rating");
      return;
    }

    mutation.mutate({ sellerId, desc, star });
    e.target.reset(); // Clear the form after submission
    setSelectedRating(0);
    setHoveredRating(0);
  };

  return (
    <div className="reviews">
      <h2>Reviews</h2>

      {/* Reviews Display */}
      <div className="reviews-list">
        {isLoading ? (
          <div className="loading">Loading reviews...</div>
        ) : error ? (
          <div className="error">Something went wrong loading reviews!</div>
        ) : data && data.length > 0 ? (
          data.map((review) => <Review key={review._id} review={review} />)
        ) : (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this seller!</p>
          </div>
        )}
      </div>

      {/* Add Review Form */}
      <div className="add">
        <h3>Add a review</h3>
        {mutation.error && (
          <div className="error-message">
            {mutation.error.response?.data?.message ||
              "Failed to submit review"}
          </div>
        )}
        <form className="addForm" onSubmit={handleSubmit}>
          <textarea
            name="desc"
            placeholder="Write your review here... Share your experience with this seller to help other users make informed decisions."
            rows="6"
            required
          />
          <div className="rating-section">
            <label>Rating:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${
                    star <= (hoveredRating || selectedRating) ? "active" : ""
                  }`}
                  onClick={() => setSelectedRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  ⭐
                </button>
              ))}
              {selectedRating > 0 && (
                <span className="rating-text">
                  {selectedRating} {selectedRating === 1 ? "star" : "stars"}
                </span>
              )}
            </div>
          </div>
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;
