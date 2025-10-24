import React, { useEffect } from "react";
import "./About.scss";

function About() {
  useEffect(() => {
    document.title = "About — LuggageShare";
    const meta = document.querySelector('meta[name="description"]');
    const content =
      "Learn about LuggageShare — connecting students with travelers for secure, convenient luggage transport.";
    if (meta) {
      meta.setAttribute("content", content);
    } else {
      const m = document.createElement("meta");
      m.setAttribute("name", "description");
      m.setAttribute("content", content);
      document.head.appendChild(m);
    }
  }, []);

  return (
    <main className="about-page">
      <div className="container">
        

        <section className="trustedBy">
          <div className="container">
            <h1>TrustedBy</h1>
            <span>Trusted by:</span>
            <img
              src="https://fiverr-res.cloudinary.com/q_auto,f_auto,w_870,dpr_2.0/v1/attachments/generic_asset/asset/63e3500010778946859b6b1519193390-1742000662571/trusted-by-fiverr-white.png"
              alt="Trusted logo 1"
            />
            <img
              src="https://fiverr-res.cloudinary.com/q_auto,f_auto,w_870,dpr_2.0/v1/attachments/generic_asset/asset/63e3500010778946859b6b1519193390-1742000662571/trusted-by-fiverr-white.png"
              alt="Trusted logo 2"
            />
            <img
              src="https://fiverr-res.cloudinary.com/q_auto,f_auto,w_870,dpr_2.0/v1/attachments/generic_asset/asset/63e3500010778946859b6b1519193390-1742000662571/trusted-by-fiverr-white.png"
              alt="Trusted logo 3"
            />
            <img
              src="https://fiverr-res.cloudinary.com/q_auto,f_auto,w_870,dpr_2.0/v1/attachments/generic_asset/asset/63e3500010778946859b6b1519193390-1742000662571/trusted-by-fiverr-white.png"
              alt="Trusted logo 4"
            />
          </div>
        </section>

        <section className="features">
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
        </section>

        <section className="features dark">
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
              <img src="/img/plane.png.png" alt="" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default About;
