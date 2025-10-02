import React from "react";
import "./Gig.scss";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import newRequest from "../../utils/newRequest"; 
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
/////////////////////////////////////////////////////////////////////
function Gig() {
  const {id } = useParams()
  const { isLoading, error, data,  } = useQuery({
    queryKey: ["gig"],
    queryFn: async () => 
      newRequest.get(`/gigs/single/${id}`).then((res)=> {
        return res.data;
      }),
      
   
  });
  
  const {
     isLoading: isLoadingUser,
      error: errorUser, 
      data: dataUser,  
    } = useQuery({
    queryKey: ["user"],
    queryFn: async () => 
      newRequest.get(`/users/${data.userId}`).then((res)=> {
        return res.data;
      }),
      
   
  });
  //////////////////////////////////////////////////carousel
    const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop:           { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet:            { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile:            { breakpoint: { max: 464, min: 0 }, items: 1 },
  };
///////////////////////////////////////////////////////////////////////
  return (
    <div className="gig">
      <div className="container">
        <div className="left">
          <span className="breadcrumbs">LuggageShare Travel & Transport </span>
          <h1>I will transport your luggage from Beijing to Shanghai safely</h1>
          {isLoadingUser ? "LOADING": errorUser ? "Something went wrong": <div className="user">
            <img
              className="pp"
              src="https://images.pexels.com/photos/720327/pexels-photo-720327.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            
            <span>{dataUser.username}</span>
            {!isNaN(data.totalStars / data.starNumber) 
                  &&(
                  <div className="stars">
                    {Array(Math.round(data.totalStars / data.starNumber))
                      .fill()
                      .map((item,i)=>(
                      <img src="/img/star.png" alt="" key={i}/>
                    ))}
                    
                    <span>{Math.round(data.totalStars / data.starNumber)}</span>
                  </div>
                  )}
          </div>}
          
          <Carousel
            responsive={responsive}
            className="slider"
            arrows
            swipeable
            draggable
            infinite
          >
            <img
              src="https://images.pexels.com/photos/1074535/pexels-photo-1074535.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <img
              src="https://images.pexels.com/photos/1462935/pexels-photo-1462935.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <img
              src="https://images.pexels.com/photos/1054777/pexels-photo-1054777.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
          </Carousel>
          <h2>About This Service</h2>
              <p>
                I am a verified traveler with extensive experience in safe luggage
                transport between major Chinese cities. I understand the challenges
                international students face when trying to ship belongings,
                especially during peak travel times like summer. My service provides
                a secure alternative to unreliable social media groups. I have
                successfully transported over 200 packages for students, ensuring
                their belongings arrive safely without requiring them to share
                personal information with multiple strangers. I travel this route
                regularly and have extra luggage space available. All transactions
                are handled through LuggageShare&#39;s secure platform for your
                peace of mind. If you have any questions about my service or need
                special handling instructions, please don&#39;t hesitate to contact
                me.
              </p>
          { isLoadingUser ? "LOADING": errorUser ? "Something went wrong":<div className="seller">
            <h2>About The Seller</h2>
            <div className="user">
                <img
                src={dataUser?.img || "/img/noavatar.png"}
                alt={dataUser?.username || "User"}
              />
              <div className="info">
                <span>{dataUser.username}</span>
                {!isNaN(data.totalStars / data.starNumber) 
                  &&(
                  <div className="stars">
                    {Array(Math.round(data.totalStars / data.starNumber))
                      .fill()
                      .map((item,i)=>(
                      <img src="/img/star.png" alt="" key={i}/>
                    ))}
                    
                    <span>{Math.round(data.totalStars / data.starNumber)}</span>
                  </div>
                  )}
                <button>Contact Me</button>
              </div>
            </div>
            <div className="box">
              <div className="items">
                <div className="item">
                  <span className="title">From</span>
                  <span className="desc">USA</span>
                </div>
                <div className="item">
                  <span className="title">Member since</span>
                  <span className="desc">Aug 2022</span>
                </div>
                <div className="item">
                  <span className="title">Avg. response time</span>
                  <span className="desc">4 hours</span>
                </div>
                <div className="item">
                  <span className="title">Last delivery</span>
                  <span className="desc">1 day</span>
                </div>
                <div className="item">
                  <span className="title">Languages</span>
                  <span className="desc">English</span>
                </div>
              </div>
              <hr />
              <p>
                My name is Anna, I enjoy creating AI generated art in my spare
                time. I have a lot of experience using the AI program and that
                means I know what to prompt the AI with to get a great and
                incredibly detailed result.
              </p>
            </div>
          </div>}
          <div className="reviews">
            <h2>Reviews</h2>
            <div className="item">
              <div className="user">
                <img
                  className="pp"
                  src="https://images.pexels.com/photos/839586/pexels-photo-839586.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt=""
                />
                <div className="info">
                  <span>Garner David</span>
                  <div className="country">
                    <img
                      src="https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png"
                      alt=""
                    />
                    <span>United States</span>
                  </div>
                </div>
              </div>
              <div className="stars">
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <span>5</span>
              </div>
              <p>
                Anna was amazing! As an international student, I was worried
                about shipping my belongings safely. She handled my luggage with
                such care and kept me updated throughout the entire journey.
                Communication was excellent, and she delivered exactly as
                promised. This is so much better than those unreliable social
                media groups. I absolutely recommend her service and will
                definitely use LuggageShare again!
              </p>
              <div className="helpful">
                <span>Helpful?</span>
                <img src="/img/like.png" alt="" />
                <span>Yes</span>
                <img src="/img/dislike.png" alt="" />
                <span>No</span>
              </div>
            </div>
            <hr />
            <div className="item">
              <div className="user">
                <img
                  className="pp"
                  src="https://images.pexels.com/photos/4124367/pexels-photo-4124367.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt=""
                />
                <div className="info">
                  <span>Sidney Owen</span>
                  <div className="country">
                    <img
                      src="https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1e9-1f1ea.png"
                      alt=""
                    />
                    <span>Germany</span>
                  </div>
                </div>
              </div>
              <div className="stars">
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <span>5</span>
              </div>
              <p>
                The designer took my photo for my book cover to the next level!
                Professionalism and ease of working with designer along with
                punctuality is above industry standards!! Whatever your project
                is, you need this designer!
              </p>
              <div className="helpful">
                <span>Helpful?</span>
                <img src="/img/like.png" alt="" />
                <span>Yes</span>
                <img src="/img/dislike.png" alt="" />
                <span>No</span>
              </div>
            </div>
            <hr />
            <div className="item">
              <div className="user">
                <img
                  className="pp"
                  src="https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt=""
                />
                <div className="info">
                  <span>Lyle Giles </span>
                  <div className="country">
                    <img
                      src="https://fiverr-dev-res.cloudinary.com/general_assets/flags/1f1fa-1f1f8.png"
                      alt=""
                    />
                    <span>United States</span>
                  </div>
                </div>
              </div>
              <div className="stars">
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <img src="/img/star.png" alt="" />
                <span>5</span>
              </div>
              <p>
                Amazing work! Communication was amazing, each and every day he
                sent me images that I was free to request changes to. They
                listened, understood, and delivered above and beyond my
                expectations. I absolutely recommend this gig, and know already
                that Ill be using it again very very soon
              </p>
              <div className="helpful">
                <span>Helpful?</span>
                <img src="/img/like.png" alt="" />
                <span>Yes</span>
                <img src="/img/dislike.png" alt="" />
                <span>No</span>
              </div>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="price">
            <h3>Luggage Transport Service</h3>
            <h2>$ 59.99</h2>
          </div>
          <p>
            I will safely transport your luggage from Beijing to Shanghai with
            full insurance and tracking
          </p>
          <div className="details">
            <div className="item">
              <img src="/img/clock.png" alt="" />
              <span>2 Days Delivery</span>
            </div>
            <div className="item">
              <img src="/img/recycle.png" alt="" />
              <span>3 Revisions</span>
            </div>
          </div>
          <div className="features">
            <div className="item">
              <img src="/img/greencheck.png" alt="" />
              <span>Secure packaging</span>
            </div>
            <div className="item">
              <img src="/img/greencheck.png" alt="" />
              <span>Door-to-door delivery</span>
            </div>
            <div className="item">
              <img src="/img/greencheck.png" alt="" />
              <span>Package tracking</span>
            </div>
            <div className="item">
              <img src="/img/greencheck.png" alt="" />
              <span>Insurance coverage</span>
            </div>
          </div>
          <button>Continue</button>
        </div>
      </div>
    </div>
  );
}

export default Gig;
