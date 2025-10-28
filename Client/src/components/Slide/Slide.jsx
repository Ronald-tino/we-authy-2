import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./Slide.scss";

const Slide = ({
  children,
  slidesToShow = 4,
  arrowsScroll = 1,
  infinite = true,
  showDots = false,
  autoPlay = false,
}) => {
  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1400 }, items: 5 },
    desktop: { breakpoint: { max: 1400, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 3 },
    mobile: { breakpoint: { max: 768, min: 480 }, items: 2.5 },
    smallMobile: { breakpoint: { max: 480, min: 0 }, items: 1.5 },
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
