import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./BottomNav.scss";

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/gigs", label: "Gigs", icon: "✈️" },
    { path: "/orders", label: "Orders", icon: "📦" },
    { path: "/messages", label: "Chat", icon: "💬" },
    { path: "/mygigs", label: "My Gigs", icon: "🎯" },
  ];

  return (
    <nav className="bottom-nav">
      <div className="nav-container">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isCenter = item.path === "/gigs";

          if (isCenter) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item center-item ${isActive ? "active" : ""}`}
              >
                <div className="center-icon">
                  <span className="icon">{item.icon}</span>
                </div>
                <span className="label">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
