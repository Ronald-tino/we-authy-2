import React from "react";
import "./StarRating.scss";

const StarRating = ({
  rating,
  totalReviews,
  size = "medium",
  showNumber = true,
}) => {
  // Calculate average rating
  const avgRating = rating || 0;
  const fullStars = Math.floor(avgRating);
  const hasHalfStar = avgRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`star-rating star-rating--${size}`}>
      <div className="star-rating__stars">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <svg
            key={`full-${i}`}
            className="star-rating__star star-rating__star--full"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <svg
            className="star-rating__star star-rating__star--half"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <defs>
              <linearGradient id="half-fill">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill="url(#half-fill)"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        )}

        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <svg
            key={`empty-${i}`}
            className="star-rating__star star-rating__star--empty"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>

      {showNumber && (
        <div className="star-rating__text">
          <span className="star-rating__number">{avgRating.toFixed(1)}</span>
          {totalReviews !== undefined && totalReviews > 0 && (
            <span className="star-rating__reviews">({totalReviews})</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StarRating;
