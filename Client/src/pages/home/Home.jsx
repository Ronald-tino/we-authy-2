import React from "react";
import "./Home.scss";
import Featured from "../../components/Featured/Featured";
import TrustedBy from "../../components/TrustedBy/TrustedBy";
import Slide from "../../components/Slide/Slide";
import CatCard from "../../components/CatCard/CatCard";
import { cards } from "../../data";

///////////////////////
const Home = () => {
  return (
    <>
      <div className="home">
        <Featured />
        <TrustedBy />
        <Slide slidesToShow={5} arrowsScroll={5}>
          {cards.map((c) => (
            <CatCard key={c.id} card={c} />
          ))}
        </Slide>
        <div className="features">
          <div className="container">
            <div className="item">
              <h1>Connecting Students with Travelers</h1>
              <div className="title">
                <img src="/img/check.png" alt="" />
                Secure luggage transportation for international students
              </div>
              <p>
                No more searching through multiple social media groups or
                sharing personal information with strangers.
              </p>
              <div className="title">
                <img src="/img/check.png" alt="" />
                Centralized platform for finding travel partners
              </div>
              <p>
                Connect directly with verified travelers who have extra luggage
                space on their trips.
              </p>
              <div className="title">
                <img src="/img/check.png" alt="" />
                Enhanced security and privacy protection
              </div>
              <p>
                Safe transactions without sharing personal details with multiple
                individuals.
              </p>
              <div className="title">
                <img src="/img/check.png" alt="" />
                Reliable alternative to informal networks
              </div>
              <p>
                Streamlined process that eliminates the uncertainty of social
                media groups.
              </p>
            </div>
            <div className="item">
              <video src="/img/video.mp4" controls />
            </div>
          </div>
        </div>

        <div className="features dark">
          <div className="container">
            <div className="item">
              <h1>LuggageShare for Travelers</h1>
              <h1>Earn money while helping students</h1>
              <p>
                Turn your extra luggage space into income by helping
                international students transport their belongings safely.
              </p>
              <div className="title">
                <img src="/img/check.png" alt="" />
                Monetize your travel plans
              </div>
              <div className="title">
                <img src="/img/check.png" alt="" />
                Help students during peak travel times
              </div>
              <div className="title">
                <img src="/img/check.png" alt="" />
                Secure payment system
              </div>
              <div className="title">
                <img src="/img/check.png" alt="" />
                Build trust through verified profiles
              </div>
              <button>Get Started</button>
            </div>
            <div className="item">
              <img src="/img/wallpaper.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
