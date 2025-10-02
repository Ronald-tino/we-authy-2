import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
////////////////////////////////////////////////////////
const GigCard = ({ item }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["gigUser", item.userId],
    queryFn: async () => {
      const res = await newRequest.get(`/users/${item.userId}`);
      return res.data;
    },
    enabled: !!item?.userId, // don't run until userId exists
  });
  /////////////////////////////////////////////
  return (
    <Link to={`/gig/${item._id}`} className="link">
      <div className="gigCard">
        <img src={item.cover} alt="" />
        <div className="info">
          {isLoading ? (
            "LOADING"
          ) : error ? (
            "something went wrong"
          ) : (
            <div className="user">
              <img
                src={data?.img || "/img/noavatar.png"}
                alt={data?.username || "User"}
              />
              <span>{data?.username || "Unknown"}</span>
            </div>
          )}
          <p>{item.desc}</p>
          <div className="star">
            <img src="./img/star.png" alt="" />
            <span>
              {!isNaN(item.totalStars / item.starNumber) &&
                Math.round(item.totalStars / item.starNumber)}
            </span>
          </div>
        </div>
        <hr />
        <div className="detail">
          <img src="./img/heart.png" alt="" />
          <div className="price">
            <span>STARTING AT</span>
            <h2>
              $ {item.price}
              <sup>99</sup>
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
