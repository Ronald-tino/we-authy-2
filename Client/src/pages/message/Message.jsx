import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Message.scss";

const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  console.log("Current user from localStorage:", currentUser);

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["messages"],
    queryFn: () =>
      newRequest.get(`/messages/${id}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (message) => {
      return newRequest.post(`/messages`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      conversationId: id,
      desc: e.target[0].value,
    });
    e.target[0].value = "";
  };

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages">Messages</Link> John Doe {">"}
        </span>
        {isLoading ? (
          "loading"
        ) : error ? (
          "error"
        ) : (
          <div className="messages">
            {data.map((m) => {
              const currentUserId = currentUser?.info?._id || currentUser?._id;
              const isOwner = m.userId === currentUserId;
              console.log(
                "Message:",
                m.desc,
                "isOwner:",
                isOwner,
                "userId:",
                m.userId,
                "currentUserId:",
                currentUserId,
                "currentUser:",
                currentUser
              );
              return (
                <div className={isOwner ? "owner item" : "item"} key={m._id}>
                  <img
                    src={
                      isOwner
                        ? currentUser?.info?.img ||
                          currentUser?.img ||
                          "/img/noavatar.png"
                        : "/img/noavatar.png"
                    }
                    alt=""
                  />
                  <p>{m.desc}</p>
                </div>
              );
            })}
          </div>
        )}
        <hr />
        <form className="write" onSubmit={handleSubmit}>
          <textarea type="text" placeholder="write a message" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Message;
