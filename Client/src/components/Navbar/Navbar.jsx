import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { useMode } from "../../context/ModeContext";
import {
  MdHome,
  MdInfo,
  MdLuggage,
  MdInventory2,
  MdShoppingBag,
  MdMessage,
  MdPerson,
  MdSettings,
  MdWork,
  MdAdd,
  MdInventory,
  MdAddBox,
  MdLogout,
} from "react-icons/md";
import "./Navbar.scss";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { pathname } = useLocation();
  const { isInSellerMode, isSeller, toggleMode, currentMode } = useMode();

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
      localStorage.removeItem("currentUser");
      localStorage.removeItem("userMode"); // Clear mode on logout

      // Dispatch custom event to notify context of user update
      window.dispatchEvent(new Event("userUpdated"));

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
              src="https://res.cloudinary.com/dzmrfifoq/image/upload/v1761657923/OFFICIAL-LOGO_ccpbzm.png"
              alt="LuggageShare Logo"
              className="logo-img official"
              width="180"
              height="60"
            />
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
            <MdHome className="mobile-icon" />
            Home
          </Link>
          <Link
            className={`link${pathname === "/about" ? " active" : ""}`}
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
          >
            <MdInfo className="mobile-icon" />
            About
          </Link>
          <Link
            className={`link${pathname === "/gigs" ? " active" : ""}`}
            to="/gigs"
            onClick={() => setMobileMenuOpen(false)}
          >
            <MdLuggage className="mobile-icon" />
            Explore Luggage
          </Link>
          <Link
            className={`link${pathname === "/containers" ? " active" : ""}`}
            to="/containers"
            onClick={() => setMobileMenuOpen(false)}
          >
            <MdInventory2 className="mobile-icon" />
            Explore Containers
          </Link>
          <Link
            className={`link${pathname === "/orders" ? " active" : ""}`}
            to="/orders"
            onClick={() => setMobileMenuOpen(false)}
          >
            <MdShoppingBag className="mobile-icon" />
            Orders
          </Link>
          <Link
            className={`link${pathname === "/messages" ? " active" : ""}`}
            to="/messages"
            onClick={() => setMobileMenuOpen(false)}
          >
            <MdMessage className="mobile-icon" />
            Messages
          </Link>

          {/* Desktop-only items */}

          {!isSeller && currentUser && (
            <Link
              to="/become-seller"
              className="desktop-only become-seller-link"
            >
              Become a Courier
            </Link>
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
              <div className="user-info">
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
              </div>
              {/* Desktop: show on click, Mobile: always show */}
              <div
                className={`options ${
                  open ? "desktop-open" : ""
                } mobile-always-open`}
                role="menu"
                aria-label="User options"
              >
                {isSeller && (
                  <div className="mode-toggle-container">
                    <button
                      className={`mode-toggle ${
                        currentMode === "seller"
                          ? "seller-active"
                          : "user-active"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleMode();
                      }}
                      role="menuitem"
                    >
                      {currentMode === "seller" ? (
                        <>
                          <span className="mode-icon">👤</span>
                          <span>Switch to User Mode</span>
                        </>
                      ) : (
                        <>
                          <span className="mode-icon">💼</span>
                          <span>Switch to Seller Mode</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
                <Link
                  className="link"
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  role="menuitem"
                >
                  <MdPerson className="mobile-icon" />
                  Profile
                </Link>
                <Link
                  className="link"
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  role="menuitem"
                >
                  <MdSettings className="mobile-icon" />
                  Settings
                </Link>
                {isSeller && isInSellerMode && (
                  <>
                    <div className="business-section">
                      <span className="section-title">Luggage Share</span>
                      <Link
                        className="link sub-link"
                        to="/mygigs"
                        onClick={() => setMobileMenuOpen(false)}
                        role="menuitem"
                      >
                        <MdWork className="mobile-icon" />
                        My Gigs
                      </Link>
                      <Link
                        className="link sub-link"
                        to="/add"
                        onClick={() => setMobileMenuOpen(false)}
                        role="menuitem"
                      >
                        <MdAdd className="mobile-icon" />
                        Add New Gig
                      </Link>
                    </div>
                    <div className="business-section">
                      <span className="section-title">Container Share</span>
                      <Link
                        className="link sub-link"
                        to="/myContainers"
                        onClick={() => setMobileMenuOpen(false)}
                        role="menuitem"
                      >
                        <MdInventory className="mobile-icon" />
                        My Containers
                      </Link>
                      <Link
                        className="link sub-link"
                        to="/add-container"
                        onClick={() => setMobileMenuOpen(false)}
                        role="menuitem"
                      >
                        <MdAddBox className="mobile-icon" />
                        Add New Container
                      </Link>
                    </div>
                  </>
                )}
                <Link className="link" onClick={handleLogout} role="menuitem">
                  <MdLogout className="mobile-icon" />
                  Logout
                </Link>
              </div>
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
