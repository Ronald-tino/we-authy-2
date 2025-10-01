import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

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
        <div className="links">
          <span>LugShare Business</span>
          <span>Explore</span>
          <span>English</span>
          {!currentUser?.isSeller && <span>Become a Courier</span>}
          {currentUser ? (
            <div className="user" onClick={() => setOpen(!open)}>
              <img
                src={currentUser?.img || "/img/noavatar.png"}
                alt="Profile"
              />
              <span>{currentUser?.username || "Sign in"}</span>
              {open && (
                <div className="options">
                  {currentUser.isSeller && (
                    <>
                      <Link className="link" to="/mygigs">
                        Gigs
                      </Link>
                      <Link className="link" to="/add">
                        Add New Gig
                      </Link>
                    </>
                  )}
                  <Link className="link" to="/orders">
                    Orders
                  </Link>
                  <Link className="link" to="/messages">
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
              <Link to="/login" className="link">
                Sign in
              </Link>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
            <Link className="link menuLink" to="/">
              China ✈ Ghana
            </Link>
            <Link className="link menuLink" to="/">
              3 day Emergency Delivery
            </Link>
            <Link className="link menuLink" to="/">
              China ✈ Kenya
            </Link>
            <Link className="link menuLink" to="/">
              Zimbsbwe ✈ China
            </Link>
            <Link className="link menuLink" to="/">
              Indonesia ✈ China
            </Link>
            <Link className="link menuLink" to="/">
              Zambia ✈ China
            </Link>
            <Link className="link menuLink" to="/">
              China ✈ SouthAfrica
            </Link>
            <Link className="link menuLink" to="/">
              China ✈ Ethiopia
            </Link>
            <Link className="link menuLink" to="/">
              Nigeira ✈ China
            </Link>
          </div>
          <hr />
        </>
      )}
    </div>
  );
}

export default Navbar;
