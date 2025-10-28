import React, { useRef, useState, useEffect } from "react";
import "./Containers.scss";
import { useLocation } from "react-router-dom";
import ContainerCard from "../../components/ContainerCard/ContainerCard";
import newRequest from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";

function Containers() {
  const [sort, setSort] = useState("createdAt");
  const [open, setOpen] = useState(false);
  const [filterType, setFilterType] = useState("");
  const minRef = useRef();
  const maxRef = useRef();

  const { search } = useLocation();

  const min = () => minRef.current?.value || "";
  const max = () => maxRef.current?.value || "";

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["containers", search, sort, min(), max(), filterType],
    queryFn: () => {
      const params = new URLSearchParams(
        search ? search.replace(/^\?/, "") : ""
      );
      if (min()) params.set("min", min());
      if (max()) params.set("max", max());
      if (sort) params.set("sort", sort);
      if (filterType) params.set("containerType", filterType);
      const queryString = params.toString() ? `?${params.toString()}` : "";
      return newRequest
        .get(`/containers${queryString}`)
        .then((res) => res.data);
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
  }, [sort, filterType]);

  const apply = () => {
    refetch();
  };

  return (
    <div className="containers">
      <div className="container">
        <span className="breadcrumbs">
          Container Share - Shipping Containers
        </span>
        <h1>Find Available Container Space</h1>
        <p>Explore shipping container options for your cargo needs</p>
        <div className="menu">
          <div className="left">
            <span>Price Range (¥ per CBM)</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="">All Container Types</option>
              <option value="20ft">20ft Standard</option>
              <option value="40ft">40ft Standard</option>
              <option value="40ft-HC">40ft High Cube</option>
            </select>
            <button onClick={apply}>Apply Filters</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "createdAt"
                ? "Newest"
                : sort === "priceRMB"
                ? "Price"
                : "Newest"}
            </span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                <span onClick={() => reSort("createdAt")}>Newest</span>
                <span onClick={() => reSort("priceRMB")}>Price</span>
                <span onClick={() => reSort("availableSpaceCBM")}>
                  Available Space
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading
            ? "LOADING"
            : error
            ? "Something went wrong !!"
            : data.map((container) => (
                <ContainerCard key={container._id} item={container} />
              ))}
        </div>
      </div>
    </div>
  );
}

export default Containers;
