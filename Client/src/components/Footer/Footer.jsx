import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Footer.scss";

const Footer = () => {
  const { pathname } = useLocation();
  const isActive = (to) => pathname === to;

  return (
    <nav className="footer bottom-nav">
      <div className="bottom-nav__container">
        <Link
          to="/"
          className={`bottom-nav__item ${isActive("/") ? "active" : ""}`}
        >
          <span className="icon" aria-hidden>
            {/* Home */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 10.5L12 4l8 6.5V20a2 2 0 0 1-2 2h-4v-6H10v6H6a2 2 0 0 1-2-2v-9.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="label">Home</span>
        </Link>

        <Link
          to="/orders"
          className={`bottom-nav__item ${isActive("/orders") ? "active" : ""}`}
        >
          <span className="icon" aria-hidden>
            {/* Orders (bag) */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 7h10l1.5 12a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2L7 7Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M9 7a3 3 0 1 1 6 0"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="label">Orders</span>
        </Link>

        <Link
          to="/gigs"
          className={`bottom-nav__item bottom-nav__item--center ${
            isActive("/gigs") ? "active" : ""
          }`}
        >
          <span className="icon" aria-hidden>
            {/* Plane */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5 12L3 9.5l.5-1.5 7 1L20 4l1 2-8 6 2 7-1.5.5-3-7Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="label">Travel</span>
        </Link>

        <Link to="/" className="bottom-nav__item">
          <span className="icon" aria-hidden>
            {/* Wallet */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 7h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M18 9h2v6h-2a3 3 0 1 1 0-6Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
          </span>
          <span className="label">Wallet</span>
        </Link>

        <Link
          to="/messages"
          className={`bottom-nav__item ${
            isActive("/messages") ? "active" : ""
          }`}
        >
          <span className="icon" aria-hidden>
            {/* Chat */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6h16v10H7l-3 3V6Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="label">Chat</span>
        </Link>
      </div>
    </nav>
  );
};

export default Footer;
