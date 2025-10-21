import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Message.scss";
import moment from "moment";

const Message = () => {
  const { id } = useParams();
  const stored = localStorage.getItem("currentUser");
  const parsed = stored ? JSON.parse(stored) : null;
  const currentUser = parsed?.info ?? parsed;
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["messages", id],
    queryFn: () =>
      newRequest.get(`/messages/${id}`).then((res) => {
        // ensure ordered ascending in case backend misses sort
        return (res.data || [])
          .slice()
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }),
    // refetchInterval: 3000, // Disabled during development
    refetchOnWindowFocus: true,
  });

  const { data: conversationData } = useQuery({
    queryKey: ["conversation", id],
    queryFn: () =>
      newRequest.get(`/conversations/single/${id}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (message) => {
      return newRequest.post(`/messages`, message);
    },
    onMutate: async (message) => {
      await queryClient.cancelQueries(["messages", id]);
      const previous = queryClient.getQueryData(["messages", id]);

      // optimistic message
      const optimistic = {
        _id: `optimistic-${Date.now()}`,
        conversationId: id,
        userId: currentUser?._id ?? "",
        desc: message.desc,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(["messages", id], (old = []) => [
        ...old,
        optimistic,
      ]);
      setMessageText("");
      setIsTyping(false);

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["messages", id], context.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", id]);
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      mutation.mutate({
        conversationId: id,
        desc: messageText.trim(),
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data]);

  useEffect(() => {
    if (messageText) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [messageText]);

  const LoadingSkeleton = () => (
    <div className="message-skeleton">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-content">
        <div className="skeleton-message"></div>
        <div className="skeleton-message short"></div>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="error-state">
      <div className="error-icon">⚠️</div>
      <h3>Failed to load messages</h3>
      <p>Please try refreshing the page</p>
    </div>
  );

  const EmptyState = () => (
    <div className="empty-state">
      <div className="empty-icon">💬</div>
      <h3>No messages yet</h3>
      <p>Start the conversation by sending a message</p>
    </div>
  );

  return (
    <div className="message">
      <div className="container">
        <div className="chat-header">
          <Link to="/messages" className="back-button">
            ← Back to Messages
          </Link>
          <div className="chat-info">
            <div className="chat-user-info">
              <img
                src={conversationData?.otherUser?.img || "/img/noavatar.png"}
                alt={`${
                  conversationData?.otherUser?.username || "User"
                } avatar`}
                className="chat-user-avatar"
              />
              <div className="chat-user-details">
                <h2>
                  {conversationData?.otherUser?.username || "Unknown User"}
                </h2>
                {conversationData?.otherUser?.country && (
                  <span className="chat-user-location">
                    {conversationData.otherUser.country}
                  </span>
                )}
              </div>
            </div>
            <span className="message-count">{data?.length || 0} messages</span>
          </div>
        </div>

        <div className="chat-container">
          {isLoading ? (
            <div className="messages">
              {[...Array(3)].map((_, i) => (
                <LoadingSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorState />
          ) : !data || data.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="messages">
              {data.map((m) => {
                const isOwner = m.userId === currentUser?._id;

                return (
                  <div
                    className={`message-item ${isOwner ? "owner" : ""}`}
                    key={m._id}
                  >
                    <div className="message-avatar">
                      <img
                        src={
                          isOwner
                            ? currentUser?.img || "/img/noavatar.png"
                            : "/img/noavatar.png"
                        }
                        alt="User avatar"
                      />
                    </div>
                    <div className="message-content">
                      <div className="message-bubble">
                        <p>{m.desc}</p>
                      </div>
                      <span className="message-time">
                        {moment(m.createdAt).format("HH:mm")}
                      </span>
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="message-item typing">
                  <div className="message-avatar">
                    <img src="/img/noavatar.png" alt="User avatar" />
                  </div>
                  <div className="message-content">
                    <div className="message-bubble typing-bubble">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          <form className="message-input" onSubmit={handleSubmit}>
            <div className="input-container">
              <textarea
                ref={textareaRef}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows="1"
                disabled={mutation.isPending}
              />
              <button
                type="submit"
                disabled={!messageText.trim() || mutation.isPending}
                className="send-button"
              >
                {mutation.isPending ? (
                  <div className="loading-spinner"></div>
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Message;
