import React from "react";
import "./Gig.scss";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/Reviews/Reviews";

function Gig() {
  const { id } = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: ["gig", id],
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  const userId = data?.userId;

  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => newRequest.get(`/users/${userId}`).then((res) => res.data),
    enabled: !!userId,
  });

  const avgStars = () => {
    const total = Number(data?.totalStars || 0);
    const count = Number(data?.starNumber || 0);
    if (!count) return 0;
    return Math.round(total / count);
  };

  // Calculate price per kg (in Yuan)
  const pricePerKg = () => {
    if (!data?.availableSpace || data.availableSpace === 0) return 0;
    return Math.round(data?.price / data?.availableSpace);
  };

  return (
    <div className="gig">
      {isLoading ? (
        "loading"
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="container">
          {/* Gig Details Section */}
          <div className="gig-details">
            <div className="gig-details__header">
              <div className="gig-details__user">
                <img
                  className="gig-details__avatar"
                  src={
                    isLoadingUser || errorUser
                      ? "/img/noavatar.png"
                      : dataUser?.img || "/img/noavatar.png"
                  }
                  alt={
                    isLoadingUser || errorUser
                      ? "User"
                      : dataUser?.username || "User"
                  }
                />
                <div className="gig-details__user-info">
                  <div className="gig-details__user-top">
                    <span className="gig-details__id">
                      #
                      {String(data._id || "")
                        .slice(-6)
                        .toUpperCase()}
                    </span>
                    <span className="gig-details__badge">New</span>
                  </div>
                  <div className="gig-details__user-name">
                    <span className="gig-details__name">
                      {isLoadingUser
                        ? "Loading..."
                        : errorUser
                        ? "Unknown"
                        : dataUser?.username || "Unknown"}
                    </span>
                    <span className="gig-details__verified">✓</span>
                  </div>
                </div>
              </div>
              {data?.expirationDays && (
                <div className="gig-details__status">Abroad</div>
              )}
            </div>

            {/* Route Section */}
            <div className="gig-details__route">
              <div className="gig-details__route-point gig-details__route-point--departure">
                <span className="gig-details__dot gig-details__dot--white"></span>
                <span className="gig-details__code gig-details__code--white">
                  {(data?.departureCountry || "AE")
                    .toString()
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>

              <div className="gig-details__route-line">
                <span className="gig-details__dash"></span>
                <span className="gig-details__plane">✈</span>
                <span className="gig-details__dash gig-details__dash--long"></span>
                <span className="gig-details__plane">✈</span>
                <span className="gig-details__dash"></span>
              </div>

              <div className="gig-details__route-point gig-details__route-point--destination">
                <span className="gig-details__code gig-details__code--green">
                  {(data?.destinationCountry || "PK")
                    .toString()
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <span className="gig-details__dot gig-details__dot--green"></span>
              </div>
            </div>

            {/* Location Details */}
            <div className="gig-details__locations">
              <div className="gig-details__location gig-details__location--departure">
                <span className="gig-details__location-text">
                  {data?.departureCity || "Dubai"},{" "}
                  {data?.departureCountry || "United Arab Emirates"}
                </span>
              </div>
              <div className="gig-details__location gig-details__location--destination">
                <span className="gig-details__location-text">
                  {data?.destinationCity || "Lahore"},{" "}
                  {data?.destinationCountry || "Pakistan"}
                </span>
              </div>
            </div>

            {/* Expiration */}
            {data?.expirationDays && (
              <div className="gig-details__expiration">
                EXP in {data.expirationDays} days
              </div>
            )}

            {/* Space & Price Section */}
            <div className="gig-details__info">
              <div className="gig-details__space">
                <div className="gig-details__icon">
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
                <div className="gig-details__info-content">
                  <span className="gig-details__label">Available Space</span>
                  <span className="gig-details__value">
                    {data?.availableSpace || 40} kg
                  </span>
                  <span className="gig-details__subtext">Booked 0 kg</span>
                </div>
              </div>

              <div className="gig-details__price">
                <div className="gig-details__icon">
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
                <div className="gig-details__info-content">
                  <span className="gig-details__label">Price</span>
                  <span className="gig-details__value gig-details__value--highlight">
                    {pricePerKg() || 120}¥ per kg
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            {data?.desc && (
              <div className="gig-details__description">
                <h3>About This Gig</h3>
                <p>{data.desc}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="gig-details__actions">
              <button
                className="gig-details__btn gig-details__btn--outline"
                type="button"
              >
                Chat Now
              </button>
              <button
                className="gig-details__btn gig-details__btn--primary"
                type="button"
              >
                Make Offer
              </button>
            </div>
          </div>

          {/* About Seller Section */}
          {isLoadingUser ? (
            "loading"
          ) : errorUser ? (
            "Something went wrong!"
          ) : (
            <div className="seller">
              <h2>About The Seller</h2>
              <div className="seller__user">
                <img src={dataUser?.img || "/img/noavatar.png"} alt="" />
                <div className="seller__info">
                  <span>{dataUser?.username}</span>
                  {avgStars() > 0 && (
                    <div className="seller__stars">
                      {Array(avgStars())
                        .fill()
                        .map((_, i) => (
                          <img src="/img/star.png" alt="" key={i} />
                        ))}
                      <span>{avgStars()}</span>
                    </div>
                  )}
                  <button>Contact Me</button>
                </div>
              </div>
              <div className="seller__box">
                <div className="seller__items">
                  <div className="seller__item">
                    <span className="seller__title">From</span>
                    <span className="seller__desc">{dataUser?.country}</span>
                  </div>
                  <div className="seller__item">
                    <span className="seller__title">Member since</span>
                    <span className="seller__desc">Aug 2022</span>
                  </div>
                  <div className="seller__item">
                    <span className="seller__title">Avg. response time</span>
                    <span className="seller__desc">4 hours</span>
                  </div>
                  <div className="seller__item">
                    <span className="seller__title">Last delivery</span>
                    <span className="seller__desc">1 day</span>
                  </div>
                  <div className="seller__item">
                    <span className="seller__title">Languages</span>
                    <span className="seller__desc">English</span>
                  </div>
                </div>
                <hr />
                <p>{dataUser?.desc}</p>
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <Reviews gigId={id} />
        </div>
      )}
    </div>
  );
}

export default Gig;
