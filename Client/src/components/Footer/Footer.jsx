import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <>
      <div className="footer">
        <div className="container">
          <div className="top">
            <div className="item">
              <h1>Popular Routes</h1>
              <span>China ✈ Nigeria</span>
              <span>China ✈ Ghana</span>
              <span>China ✈ Kenya</span>
            </div>
            <div className="item">
              <h1>African Destinations</h1>
              <span>China ✈ South Africa</span>
              <span>China ✈ Zimbabwe</span>
              <span>China ✈ Ethiopia</span>
            </div>
            <div className="item">
              <h1>Service Types</h1>
              <span>Document Delivery</span>
              <span>Electronics Transport</span>
              <span>Gift Shipping</span>
            </div>
            <div className="item">
              <h1>Travel Routes</h1>
              <span>China ✈ Morocco</span>
              <span>China ✈ Egypt</span>
              <span>Emergency Delivery</span>
            </div>
            <div className="item">
              <h1>Support</h1>
              <span>How It Works</span>
              <span>Safety Guidelines</span>
              <span>Contact Support</span>
            </div>
          </div>
          <div className="bottom">
            <div className="left">
              <span>©LuggageShare All rights reserved</span>
            </div>
            <div className="right">
              <div className="social">
                <img src="/img/facebook.png" alt="" />
                <img src="/img/instagram.png" alt="" />
                <img src="/img/linkedin.png" alt="" />
                <img src="/img/twitter.png" alt="" />
              </div>
              <div className="links">
                <img src="/img/language.png" alt="" />
                <span>English</span>
                <img src="/img/coin.png" alt="" />
                <span>USD</span>
                <img src="/img/accessibility.png" alt="" />
                <span>accessability</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
