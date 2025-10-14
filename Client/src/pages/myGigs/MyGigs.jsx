import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

function MyGigs() {
  const currentUser = getCurrentUser();
  const user = currentUser?.info || currentUser; // Handle both nested and direct user objects
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs", user?._id],
    queryFn: () => {
      return newRequest
        .get(`/gigs?userId=${user._id}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.error("API error:", err);
          throw err;
        });
    },
    enabled: !!user?._id, // Only run query if we have a user ID
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/gigs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  const handleGigClick = (gigId) => {
    navigate(`/gig/${gigId}`);
  };

  return (
    <div className="myGigs">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Gigs</h1>
            {user?.isSeller && (
              <Link to="/add">
                <button>Add New Gig</button>
              </Link>
            )}
          </div>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Sales</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((gig) => (
                  <tr
                    key={gig._id}
                    onClick={() => handleGigClick(gig._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <img className="image" src={gig.cover} alt="" />
                    </td>
                    <td>{gig.title}</td>
                    <td>{gig.price}</td>
                    <td>{gig.sales}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <img
                        className="delete"
                        src="./img/delete.png"
                        alt=""
                        onClick={() => handleDelete(gig._id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No gigs found. Create your first gig!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyGigs;
