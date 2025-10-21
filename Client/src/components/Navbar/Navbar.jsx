import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { pathname } = useLocation();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && !event.target.closest(".user")) {
        setOpen(false);
      }
      if (
        mobileMenuOpen &&
        !event.target.closest(".links") &&
        !event.target.closest(".mobile-menu-btn")
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (open || mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, mobileMenuOpen]);
  const stored = localStorage.getItem("currentUser");
  const parsed = stored ? JSON.parse(stored) : null;
  // some responses are { info: {...} } — prefer the info object if present
  const currentUser = parsed?.info ?? parsed;

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setMobileMenuOpen(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <img
              src="/img/lug.png"
              alt="LuggageShare Logo"
              className="logo-img"
            />
            <span className="text">LuggageShare</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div
          className={`links ${mobileMenuOpen ? "mobile-open" : ""}`}
          id="mobile-menu"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Standard navbar options - always visible in mobile menu */}
          <Link
            className={`link${pathname === "/" ? " active" : ""}`}
            to="/"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            className={`link${pathname === "/about" ? " active" : ""}`}
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            className={`link${pathname === "/gigs" ? " active" : ""}`}
            to="/gigs"
            onClick={() => setMobileMenuOpen(false)}
          >
            Explore Gigs
          </Link>
          <Link
            className={`link${pathname === "/orders" ? " active" : ""}`}
            to="/orders"
            onClick={() => setMobileMenuOpen(false)}
          >
            Orders
          </Link>
          <Link
            className={`link${pathname === "/messages" ? " active" : ""}`}
            to="/messages"
            onClick={() => setMobileMenuOpen(false)}
          >
            Messages
          </Link>

          {/* Desktop-only items */}
          <span className="desktop-only">LugShare Business</span>

          {!currentUser?.isSeller && (
            <span className="desktop-only">Become a Courier</span>
          )}

          {/* User section - separate from standard nav options */}
          {currentUser ? (
            <div
              className="user"
              onClick={() => setOpen(!open)}
              role="button"
              tabIndex={0}
              aria-expanded={open}
              aria-haspopup="menu"
              aria-label="User menu"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpen(!open);
                }
              }}
            >
              <img
                src={currentUser?.img || "/img/noavatar.png"}
                alt="Profile"
              />
              <span className="desktop-only">
                {currentUser?.username || "Sign in"}
              </span>
              <span className="mobile-only">
                {currentUser?.username || "Profile"}
              </span>
              {open && (
                <div className="options" role="menu" aria-label="User options">
                  <Link
                    className="link"
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    role="menuitem"
                  >
                    Profile
                  </Link>
                  <Link
                    className="link"
                    to="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    role="menuitem"
                  >
                    Settings
                  </Link>
                  {currentUser.isSeller && (
                    <>
                      <Link
                        className="link"
                        to="/mygigs"
                        onClick={() => setMobileMenuOpen(false)}
                        role="menuitem"
                      >
                        My Gigs
                      </Link>
                      <Link
                        className="link"
                        to="/add"
                        onClick={() => setMobileMenuOpen(false)}
                        role="menuitem"
                      >
                        Add New Gig
                      </Link>
                    </>
                  )}
                  <Link className="link" onClick={handleLogout} role="menuitem">
                    Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                className="link"
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
              >
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
