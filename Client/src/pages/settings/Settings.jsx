import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Settings.scss";

function Settings() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    messageAlerts: true,
    marketingEmails: false,

    // Security Settings
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: "30",
  });

  const handleSettingChange = (category, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Settings saved:", settings);
  };

  const tabs = [
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "security", label: "Security", icon: "🛡️" },
    { id: "delivery", label: "Delivery", icon: "🚚", comingSoon: true },
    { id: "payment", label: "Payment", icon: "💳", comingSoon: true },
  ];

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h3 className="section-title">Notification Preferences</h3>
      <div className="settings-grid">
        <div className="setting-item toggle-item">
          <div className="toggle-content">
            <label className="setting-label">Email Notifications</label>
            <p className="setting-description">
              Receive notifications via email
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) =>
                handleSettingChange(
                  "notifications",
                  "emailNotifications",
                  e.target.checked
                )
              }
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item toggle-item">
          <div className="toggle-content">
            <label className="setting-label">Push Notifications</label>
            <p className="setting-description">
              Receive push notifications on your device
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) =>
                handleSettingChange(
                  "notifications",
                  "pushNotifications",
                  e.target.checked
                )
              }
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item toggle-item">
          <div className="toggle-content">
            <label className="setting-label">SMS Notifications</label>
            <p className="setting-description">Receive notifications via SMS</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) =>
                handleSettingChange(
                  "notifications",
                  "smsNotifications",
                  e.target.checked
                )
              }
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item toggle-item">
          <div className="toggle-content">
            <label className="setting-label">Order Updates</label>
            <p className="setting-description">
              Get notified about order status changes
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.orderUpdates}
              onChange={(e) =>
                handleSettingChange(
                  "notifications",
                  "orderUpdates",
                  e.target.checked
                )
              }
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item toggle-item">
          <div className="toggle-content">
            <label className="setting-label">Message Alerts</label>
            <p className="setting-description">
              Get notified about new messages
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.messageAlerts}
              onChange={(e) =>
                handleSettingChange(
                  "notifications",
                  "messageAlerts",
                  e.target.checked
                )
              }
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item toggle-item">
          <div className="toggle-content">
            <label className="setting-label">Marketing Emails</label>
            <p className="setting-description">
              Receive promotional emails and updates
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.marketingEmails}
              onChange={(e) =>
                handleSettingChange(
                  "notifications",
                  "marketingEmails",
                  e.target.checked
                )
              }
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <h3 className="section-title">Security & Authentication</h3>
      <div className="settings-grid">
        <div className="setting-item toggle-item">
          <div className="toggle-content">
            <label className="setting-label">Two-Factor Authentication</label>
            <p className="setting-description">
              Add an extra layer of security to your account
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) =>
                handleSettingChange(
                  "security",
                  "twoFactorAuth",
                  e.target.checked
                )
              }
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item toggle-item">
          <div className="toggle-content">
            <label className="setting-label">Login Alerts</label>
            <p className="setting-description">
              Get notified of new login attempts
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.loginAlerts}
              onChange={(e) =>
                handleSettingChange("security", "loginAlerts", e.target.checked)
              }
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <label className="setting-label">Session Timeout (minutes)</label>
          <select
            className="setting-select"
            value={settings.sessionTimeout}
            onChange={(e) =>
              handleSettingChange("security", "sessionTimeout", e.target.value)
            }
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="0">Never</option>
          </select>
        </div>
        <div className="setting-item">
          <button className="action-button secondary">Change Password</button>
        </div>
      </div>
    </div>
  );

  const renderComingSoon = (title, description) => (
    <div className="coming-soon-section">
      <div className="coming-soon-content">
        <div className="coming-soon-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="coming-soon-title">{title}</h3>
        <p className="coming-soon-description">{description}</p>
        <div className="coming-soon-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Coming Soon
        </div>
      </div>
    </div>
  );

  const renderDeliverySettings = () =>
    renderComingSoon(
      "Delivery Settings",
      "Configure your delivery preferences, working hours, and service radius. This feature will be available soon."
    );

  const renderPaymentSettings = () =>
    renderComingSoon(
      "Payment & Billing",
      "Manage your payment methods, withdrawal settings, and billing preferences. This feature will be available soon."
    );

  const renderTabContent = () => {
    switch (activeTab) {
      case "notifications":
        return renderNotificationSettings();
      case "security":
        return renderSecuritySettings();
      case "delivery":
        return renderDeliverySettings();
      case "payment":
        return renderPaymentSettings();
      default:
        return renderNotificationSettings();
    }
  };

  return (
    <div className="settings">
      <div className="responsive-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="settings-container"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="settings-header"
          >
            <div className="header-text">
              <h1 className="settings-title">Settings</h1>
              <p className="settings-subtitle">
                Manage your notifications, security, and app preferences
              </p>
            </div>
            {(activeTab === "notifications" || activeTab === "security") && (
              <button className="save-button" onClick={handleSave}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Save Changes
              </button>
            )}
          </motion.div>

          <div className="settings-layout">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="settings-sidebar"
            >
              <nav className="settings-nav">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`nav-item ${
                      activeTab === tab.id ? "active" : ""
                    } ${tab.comingSoon ? "coming-soon-tab" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <div className="nav-content">
                      <span className="nav-icon">{tab.icon}</span>
                      <span className="nav-label">{tab.label}</span>
                    </div>
                    {tab.comingSoon && <span className="soon-badge">Soon</span>}
                  </button>
                ))}
              </nav>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="settings-content"
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Settings;
