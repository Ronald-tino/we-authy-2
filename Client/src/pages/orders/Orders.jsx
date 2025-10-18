import React from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();
  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest.get(`/orders`).then((res) => {
        return res.data;
      }),
  });

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;

    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: currentUser.seller ? buyerId : sellerId,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getOrderStatus = (order) => {
    // You can add logic here to determine order status based on your business logic
    return "Active";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "status-active";
      case "Completed":
        return "status-completed";
      case "Cancelled":
        return "status-cancelled";
      default:
        return "status-pending";
    }
  };

  return (
    <div className="orders">
      <div className="orders-container">
        <div className="orders-header">
          <div className="header-content">
            <h1 className="orders-title">My Orders</h1>
            <p className="orders-subtitle">Manage and track your orders</p>
          </div>
          <div className="orders-stats">
            <div className="stat-item">
              <span className="stat-number">{data?.length || 0}</span>
              <span className="stat-label">Total Orders</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Something went wrong</h3>
            <p>We couldn't load your orders. Please try again later.</p>
          </div>
        ) : data && data.length > 0 ? (
          <div className="orders-grid">
            {data.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-image-container">
                  <img 
                    className="order-image" 
                    src={order.img || "/img/noavatar.png"} 
                    alt={order.title}
                    onError={(e) => {
                      e.target.src = "/img/noavatar.png";
                    }}
                  />
                  <div className={`order-status ${getStatusColor(getOrderStatus(order))}`}>
                    {getOrderStatus(order)}
                  </div>
                </div>
                
                <div className="order-content">
                  <h3 className="order-title">{order.title}</h3>
                  <div className="order-details">
                    <div className="order-price">
                      <span className="price-label">Price</span>
                      <span className="price-value">{formatPrice(order.price)}</span>
                    </div>
                    <div className="order-date">
                      <span className="date-label">Order Date</span>
                      <span className="date-value">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="order-actions">
                  <button 
                    className="contact-btn"
                    onClick={() => handleContact(order)}
                    title="Contact Seller"
                  >
                    <svg className="message-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No orders yet</h3>
            <p>When you place an order, it will appear here.</p>
            <button 
              className="explore-btn"
              onClick={() => navigate('/gigs')}
            >
              Explore Gigs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;