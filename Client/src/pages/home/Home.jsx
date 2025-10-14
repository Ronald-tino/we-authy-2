import React from "react";
import "./Home.scss";
import Featured from "../../components/Featured/Featured";
import Gigs from "../gigs/Gigs";
import Slide from "../../components/Slide/Slide";
import CatCard from "../../components/CatCard/CatCard";
import { cards } from "../../data";

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
        <Gigs />
      </div>
    </>
  );
};

export default Home;
