import React from "react";
import "./Home.scss";
import Featured from "../../components/Featured/Featured";
import Slide from "../../components/Slide/Slide";
import CatCard from "../../components/CatCard/CatCard";
import { cards } from "../../data";
import { Link } from "react-router-dom";
import {
  Plane,
  Package,
  DollarSign,
  Ship,
  BarChart3,
  Lock,
} from "lucide-react";

///////////////////////
const Home = () => {
  return (
    <>
      <div className="home">
        <Featured />
        <Slide slidesToShow={4} arrowsScroll={2}>
          {cards.map((c) => (
            <CatCard key={c.id} card={c} />
          ))}
        </Slide>

        {/* Business Lines Section */}
        <div className="business-lines">
          <Link to="/gigs" className="business-tile">
            <div className="icon-group">
              <Plane size={28} />
              <Package size={28} />
              <DollarSign size={28} />
            </div>
            <h2 className="business-tile__title">Luggage Share</h2>
            <p className="business-tile__description">
              Find travelers with extra luggage space for your goods. Connect
              with verified couriers, ship items safely, and enjoy competitive
              rates per kilogram.
            </p>
          </Link>

          <Link to="/containers" className="business-tile">
            <div className="icon-group">
              <Ship size={28} />
              <BarChart3 size={28} />
              <Lock size={28} />
            </div>
            <h2 className="business-tile__title">Container Share</h2>
            <p className="business-tile__description">
              Discover shipping containers with available cargo space. Ship
              large volumes at competitive rates with professional handling and
              tracking.
            </p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
