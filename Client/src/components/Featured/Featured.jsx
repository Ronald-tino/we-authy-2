import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Featured.scss";

const Featured = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate(`/gigs?search=${input}`);
  };
  return (
    <div className="featured">
      <div className="container-1">
        <div className="left">
          <h1>
            Connect with <span>trusted</span> travelers who have{" "}
            <span>extra luggage space</span>
          </h1>
          <div className="search">
            <div className="searchInput">
              <img src="./img/search.png" alt="" />
              <input
                type="text"
                placeholder='Try "Beijing to Shanghai" or "China to USA"'
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <button onClick={handleSubmit}>Search</button>
          </div>
          <div className="popular">
        
            <button>China ✈ Ghana</button>
            <button>China ✈ South Africa</button>
            <button>China ✈ Kenya</button>
            <button>China ✈ Zimbabwe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
