import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

// Visual refactor: match inspiration TravellerCard look while preserving props/behavior
const GigCard = ({ item }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["gigUser", item.userId],
    queryFn: async () => {
      const res = await newRequest.get(`/users/${item.userId}`);
      return res.data;
    },
    enabled: !!item?.userId,
  });

  const rating = !isNaN(item.totalStars / item.starNumber)
    ? Math.round(item.totalStars / item.starNumber)
    : undefined;

  return (
    <Link to={`/gig/${item._id}`} className="link">
      <div className="gigCard">
        {/* Header */}
        <div className="gc-header">
          <div className="gc-user">
            <img
              className="gc-avatar"
              src={
                isLoading || error
                  ? "/img/noavatar.png"
                  : data?.img || "/img/noavatar.png"
              }
              alt={isLoading || error ? "User" : data?.username || "User"}
            />
            <div className="gc-user-meta">
              <div className="gc-user-row">
                <span className="gc-code">
                  #
                  {String(item._id || "")
                    .slice(-6)
                    .toUpperCase()}
                </span>
                <span className="gc-badge">New</span>
              </div>
              <div className="gc-name-row">
                <span className="gc-name">
                  {isLoading
                    ? "Loading..."
                    : error
                    ? "Unknown"
                    : data?.username || "Unknown"}
                </span>
                <span className="gc-verified" aria-hidden>
                  ●
                </span>
              </div>
              {item?.deliveryTime && (
                <p className="gc-date">Delivery in {item.deliveryTime} days</p>
              )}
            </div>
          </div>
        </div>

        {/* Route / Title area (use gig title/desc to mimic centre segment) */}
        <div className="gc-route">
          <div className="gc-route-side gc-left">
            <div className="gc-route-code">
              {(item?.countryCodeFrom || "")
                .toString()
                .slice(0, 2)
                .toUpperCase() || ""}
            </div>
            <div className="gc-route-label">{item?.from || ""}</div>
            <div className="gc-route-sub">{item?.fromCity || ""}</div>
          </div>
          <div className="gc-route-mid">
            <div className="gc-dash" />
            <img className="gc-plane" src="/img/plane.png" alt="" />
            <div className="gc-dash" />
          </div>
          <div className="gc-route-side gc-right">
            <div className="gc-route-code">
              {(item?.countryCodeTo || "")
                .toString()
                .slice(0, 2)
                .toUpperCase() || ""}
            </div>
            <div className="gc-route-label">{item?.to || ""}</div>
            <div className="gc-route-sub">{item?.toCity || ""}</div>
          </div>
        </div>

        {item?.desc && <p className="gc-desc">{item.desc}</p>}

        {/* Meta */}
        <div className="gc-meta">
          <div className="gc-meta-block">
            <img className="gc-icon" src="/img/clock.png" alt="expiry" />
            <div>
              <span className="gc-meta-title">Rating</span>
              <div className="gc-rating">
                <img className="gc-star" src="/img/star.png" alt="" />
                {typeof rating === "number" ? (
                  <span>{rating}</span>
                ) : (
                  <span>—</span>
                )}
              </div>
            </div>
          </div>
          <div className="gc-meta-block">
            <img className="gc-icon" src="/img/coin.png" alt="price" />
            <div className="gc-price-box">
              <span className="gc-meta-title">Price</span>
              <span className="gc-price">$ {item.price}</span>
            </div>
          </div>
        </div>

        {/* Actions / Footer */}
        <div className="gc-actions">
          <button className="gc-btn gc-btn-outline" type="button">
            Chat Now
          </button>
          <button className="gc-btn gc-btn-primary" type="button">
            Make Offer
          </button>
        </div>

        <div className="gc-stats">
          <span className="gc-offers">0 Offers</span>
          <span className="gc-sep">|</span>
          <span className="gc-bookings">0 Bookings</span>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
