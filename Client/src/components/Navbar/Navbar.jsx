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
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);
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

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">LuggageShare</span>
          </Link>
          <span className="dot">.</span>
        </div>

        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`links ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <Link
            className={`link${pathname === "/about" ? " active" : ""}`}
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <span className="desktop-only">LugShare Business</span>
          <span className="desktop-only">Explore</span>
          <span className="desktop-only">English</span>
          {!currentUser?.isSeller && (
            <span className="desktop-only">Become a Courier</span>
          )}
          {currentUser ? (
            <div className="user" onClick={() => setOpen(!open)}>
              <img
                src={currentUser?.img || "/img/noavatar.png"}
                alt="Profile"
              />
              <span className="desktop-only">
                {currentUser?.username || "Sign in"}
              </span>
              {open && (
                <div className="options">
                  {currentUser.isSeller && (
                    <>
                      <Link
                        className="link"
                        to="/mygigs"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Gigs
                      </Link>
                      <Link
                        className="link"
                        to="/add"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Add New Gig
                      </Link>
                    </>
                  )}
                  <Link
                    className="link"
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    className="link"
                    to="/messages"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Messages
                  </Link>
                  <Link className="link" onClick={handleLogout}>
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
