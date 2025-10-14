import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./Slide.scss";

const Slide = ({
  children,
  slidesToShow = 2,
  arrowsScroll = 1,
  infinite = true,
  showDots = false,
  autoPlay = false,
}) => {
  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: slidesToShow },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: slidesToShow },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: Math.min(3, slidesToShow) },
    mobile: { breakpoint: { max: 768, min: 480 }, items: Math.min(2, slidesToShow) },
    smallMobile: { breakpoint: { max: 480, min: 0 }, items: 1 },
  };

  return (
    <div className="slide">
      <div className="slide-container">
        <Carousel
          responsive={responsive}
          infinite={infinite}
          arrows
          draggable
          swipeable
          keyBoardControl
          autoPlay={autoPlay}
          showDots={showDots}
          slidesToSlide={arrowsScroll}
          containerClass="carousel-container"
          itemClass="carousel-item-padding-40-px"
        >
          {children}
        </Carousel>
      </div>
    </div>
  );
};

export default Slide;