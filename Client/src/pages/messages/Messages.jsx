import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Messages.scss";
import moment from "moment";

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      newRequest.get(`/conversations`).then((res) => {
        return res.data;
      }),
    refetchInterval: 5000,
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.put(`/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  const handleRead = (id) => {
    mutation.mutate(id);
  };

  const LoadingSkeleton = () => (
    <div className="conversation-skeleton">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-content">
        <div className="skeleton-name"></div>
        <div className="skeleton-message"></div>
      </div>
      <div className="skeleton-time"></div>
    </div>
  );

  const ErrorState = () => (
    <div className="error-state">
      <div className="error-icon">⚠️</div>
      <h3>Failed to load conversations</h3>
      <p>Please try refreshing the page</p>
    </div>
  );

  const EmptyState = () => (
    <div className="empty-state">
      <div className="empty-icon">💬</div>
      <h3>No conversations yet</h3>
      <p>Start a conversation by messaging a seller or buyer</p>
    </div>
  );

  return (
    <div className="messages">
      <div className="container">
        <div className="header">
          <h1>Messages</h1>
          <div className="header-actions">
            <span className="conversation-count">
              {data?.length || 0} conversations
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="conversations-list">
            {[...Array(5)].map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState />
        ) : !data || data.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="conversations-list">
            {data.map((conversation) => {
              const isUnread =
                (currentUser.isSeller && !conversation.readBySeller) ||
                (!currentUser.isSeller && !conversation.readByBuyer);

              return (
                <Link
                  to={`/message/${conversation.id}`}
                  className={`conversation-card ${isUnread ? "unread" : ""}`}
                  key={conversation.id}
                >
                  <div className="conversation-avatar">
                    <img
                      src={conversation.otherUser?.img || "/img/noavatar.png"}
                      alt={`${
                        conversation.otherUser?.username || "User"
                      } avatar`}
                      className="avatar"
                    />
                    {isUnread && <div className="unread-indicator"></div>}
                  </div>

                  <div className="conversation-content">
                    <div className="conversation-header">
                      <div className="conversation-name-container">
                        <h3 className="conversation-name">
                          {conversation.otherUser?.username || "Unknown User"}
                        </h3>
                        {conversation.otherUser?.country && (
                          <span className="conversation-location">
                            {conversation.otherUser.country}
                          </span>
                        )}
                      </div>
                      <span className="conversation-time">
                        {moment(conversation.updatedAt).fromNow()}
                      </span>
                    </div>

                    <p className="conversation-preview">
                      {conversation?.lastMessage?.substring(0, 80)}
                      {conversation?.lastMessage?.length > 80 && "..."}
                    </p>
                  </div>

                  <div className="conversation-actions">
                    {isUnread && (
                      <button
                        className="mark-read-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRead(conversation.id);
                        }}
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
