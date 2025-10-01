import React, { useRef, useState, useEffect } from "react";
import "./Gigs.scss";
import { useLocation } from "react-router-dom";
import GigCard from "../../components/GiGcard/GigCard";
import newRequest from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";
//////////////////////////////////////////////
function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();

  const { search } = useLocation();

  const min = () => minRef.current?.value || "";
  const max = () => maxRef.current?.value || "";

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs", search, sort, min(), max()],
    queryFn: () => {
      const params = new URLSearchParams(
        search ? search.replace(/^\?/, "") : ""
      );
      if (min()) params.set("min", min());
      if (max()) params.set("max", max());
      if (sort) params.set("sort", sort);
      const queryString = params.toString() ? `?${params.toString()}` : "";
      return newRequest.get(`/gigs${queryString}`).then((res) => res.data);
    },
    keepPreviousData: true,
  });

  console.log(data);

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort]);

  const apply = () => {
    refetch();
  };
  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">Luggage-Share Goods & Services </span>
        <h1>Find the best LuggageShare for your goods</h1>
        <p>Explore the opportunites with LuggageShare</p>
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "sales" ? "Best Selling" : "Newest"}
            </span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                )}
                <span onClick={() => reSort("sales")}>Popular</span>
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading
            ? "LOADING"
            : error
            ? "Something went wrong !!"
            : data.map((gig) => <GigCard key={gig._id} item={gig} />)}
        </div>
      </div>
    </div>
  );
}

export default Gigs;
