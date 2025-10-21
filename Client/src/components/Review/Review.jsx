import { useQuery } from "@tanstack/react-query";
import React from "react";
import newRequest from "../../utils/newRequest";
import "./Review.scss";
const Review = ({ review }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [review.userId],
    queryFn: () =>
      newRequest.get(`/users/${review.userId}`).then((res) => {
        return res.data;
      }),
  });

  return (
    <div className="review">
      <div className="user">
        {isLoading ? (
          <div className="loading">Loading user...</div>
        ) : error ? (
          <div className="error">Error loading user</div>
        ) : (
          <>
            <img
              className="pp"
              src={data?.img || "/img/noavatar.png"}
              alt={data?.username || "User"}
            />
            <div className="info">
              <span>{data?.username || "Unknown User"}</span>
              <div className="country">
                <span>{data?.country || "Unknown"}</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="stars">
        {Array(review.star)
          .fill()
          .map((item, i) => (
            <img src="/img/star.png" alt={`${i + 1} star`} key={i} />
          ))}
        <span>{review.star}</span>
      </div>

      <p>{review.desc}</p>

      <div className="helpful">
        <span>Helpful?</span>
        <img src="/img/like.png" alt="Like" />
        <span>Yes</span>
        <img src="/img/dislike.png" alt="Dislike" />
        <span>No</span>
      </div>
    </div>
  );
};

export default Review;
