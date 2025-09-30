import React from "react";
import "./Featured.scss";

const Featured = () => {
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
              />
            </div>
            <button>Search</button>
          </div>
          <div className="popular">
            <button>China ✈ Nigeria</button>
            <button>China ✈ Ghana</button>
            <button>China ✈ South Africa</button>
            <button>China ✈ Kenya</button>
            <button>China ✈ Zimbabwe</button>
          </div>
        </div>
        <div className="right">
          <img src="./img/designn.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Featured;
