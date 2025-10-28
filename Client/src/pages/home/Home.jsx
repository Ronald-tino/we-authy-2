import React from "react";
import "./Home.scss";
import Featured from "../../components/Featured/Featured";
import Slide from "../../components/Slide/Slide";
import CatCard from "../../components/CatCard/CatCard";
import { cards } from "../../data";
import { Link } from "react-router-dom";

///////////////////////
const Home = () => {
  return (
    <>
      <div className="home">
        <Featured />
        <Slide slidesToShow={3} arrowsScroll={1}>
          {cards.map((c) => (
            <CatCard key={c.id} card={c} />
          ))}
        </Slide>

        {/* Business Lines Section */}
        <div className="business-lines">
          <div className="business-line">
            <div className="business-line__header">
              <h2 className="business-line__title">Luggage Share</h2>
              <p className="business-line__subtitle">
                Find travelers with extra luggage space for your goods
              </p>
              <Link to="/gigs" className="business-line__cta-button">
                Explore Luggage Share →
              </Link>
            </div>
            <div className="business-line__features">
              <div className="feature-card">
                <div className="feature-icon">✈️</div>
                <h3>Travel with Extra Space</h3>
                <p>Connect with travelers who have luggage capacity</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📦</div>
                <h3>Send Your Goods</h3>
                <p>Safely ship items with verified couriers</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💰</div>
                <h3>Affordable Pricing</h3>
                <p>Competitive rates per kilogram</p>
              </div>
            </div>
          </div>

          <div className="business-line">
            <div className="business-line__header">
              <h2 className="business-line__title">Container Share</h2>
              <p className="business-line__subtitle">
                Discover shipping containers with available cargo space
              </p>
              <Link to="/containers" className="business-line__cta-button">
                Explore Container Share →
              </Link>
            </div>
            <div className="business-line__features">
              <div className="feature-card">
                <div className="feature-icon">🚢</div>
                <h3>Shipping Containers</h3>
                <p>20ft, 40ft, and High Cube containers available</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Bulk Cargo</h3>
                <p>Ship large volumes at competitive rates</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Secure Transport</h3>
                <p>Professional handling and tracking</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
