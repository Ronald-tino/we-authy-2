import React from "react";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./CatCard.scss";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 6, slidesToSlide: 2 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5, slidesToSlide: 5 },
  tablet: { breakpoint: { max: 1024, min: 640 }, items: 3, slidesToSlide: 3 },
  mobile: { breakpoint: { max: 640, min: 0 }, items: 1, slidesToSlide: 1 },
};

const CardItem = ({ card }) => (
  <Link to="/gigs?cat=design">
    <div className="catCard">
      <img src={card.img} alt="" />
      <span className="desc">{card.desc}</span>
      <span className="title">{card.title}</span>
    </div>
  </Link>
);

function CatCard({ card, cards }) {
  if (Array.isArray(cards)) {
    return (
      <Carousel
        responsive={responsive}
        infinite
        arrows
        draggable
        swipeable
        keyBoardControl
        autoPlay={false}
        showDots={false}
        containerClass="carousel-container"
      >
        {cards.map((c) => (
          <CardItem key={c.id ?? c.title} card={c} />
        ))}
      </Carousel>
    );
  }

  // Backward-compatible: render a single card as before
  return <CardItem card={card} />;
}

export default CatCard;