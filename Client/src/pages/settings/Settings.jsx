import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Settings.scss";

function Settings() {
  const [activeTab, setActiveTab] = useState("account");
  const [settings, setSettings] = useState({
    // Account Settings
    email: "john@example.com",
    username: "johndoe",
    fullName: "John Doe",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",

    // Privacy Settings
    profileVisibility: "public",
    showEmail: false,
    showPhone: true,
    allowMessages: true,
    showOnlineStatus: true,

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

    // Preferences
    language: "en",
    timezone: "America/New_York",
    currency: "USD",
    theme: "dark",
    autoSave: true,

    // Delivery Settings
    maxDistance: "50",
    deliveryRadius: "25",
    workingHours: {
      start: "09:00",
      end: "17:00",
    },
    availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],

    // Payment Settings
    paymentMethod: "card",
    autoWithdraw: false,
    withdrawThreshold: "100",
  });

  const handleSettingChange = (category, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedSettingChange = (category, field, subField, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subField]: value,
      },
    }));
  };

  const handleArraySettingChange = (category, field, value, checked) => {
    setSettings((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Settings saved:", settings);
  };

  const tabs = [
    { id: "account", label: "Account", icon: "👤" },
    { id: "privacy", label: "Privacy", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "security", label: "Security", icon: "🛡️" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
    { id: "delivery", label: "Delivery", icon: "🚚" },
    { id: "payment", label: "Payment", icon: "💳" },
  ];

  const renderAccountSettings = () => (
    <div className="settings-section">
      <h3 className="section-title">Account Information</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label className="setting-label">Full Name</label>
          <input
            type="text"
            className="setting-input"
            value={settings.fullName}
            onChange={(e) =>
              handleSettingChange("account", "fullName", e.target.value)
            }
          />
        </div>
        <div className="setting-item">
          <label className="setting-label">Username</label>
          <input
            type="text"
            className="setting-input"
            value={settings.username}
            onChange={(e) =>
              handleSettingChange("account", "username", e.target.value)
            }
          />
        </div>
        <div className="setting-item">
          <label className="setting-label">Email</label>
          <input
            type="email"
            className="setting-input"
            value={settings.email}
            onChange={(e) =>
              handleSettingChange("account", "email", e.target.value)
            }
          />
        </div>
        <div className="setting-item">
          <label className="setting-label">Phone</label>
          <input
            type="tel"
            className="setting-input"
            value={settings.phone}
            onChange={(e) =>
              handleSettingChange("account", "phone", e.target.value)
            }
          />
        </div>
        <div className="setting-item">
          <label className="setting-label">Location</label>
          <input
            type="text"
            className="setting-input"
            value={settings.location}
            onChange={(e) =>
              handleSettingChange("account", "location", e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="settings-section">
      <h3 className="section-title">Privacy & Visibility</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label className="setting-label">Profile Visibility</label>
          <select
            className="setting-select"
            value={settings.profileVisibility}
            onChange={(e) =>
              handleSettingChange(
                "privacy",
                "profileVisibility",
                e.target.value
              )
            }
          >
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div className="setting-item toggle-item">
          <div className="toggle-content">
            <label className="setting-label">Show Email Address</label>
            <p className="setting-description">
              Allow others to see your email address
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.showEmail}
              onChange={(e) =>
                handleSettingChange("privacy", "showEmail", e.target.checked)
              }
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item toggle-item">
          <div className="toggle-content">
            <label className="setting-label">Show Phone Number</label>
            <p className="setting-description">
              Allow others to see your phone number
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.showPhone}
              onChange={(e) =>
                handleSettingChange("privacy", "showPhone", e.target.checked)
              }
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item toggle-item">
          <div className="toggle-content">
            <label className="setting-label">Allow Messages</label>
            <p className="setting-description">
              Let other users send you messages
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.allowMessages}
              onChange={(e) =>
                handleSettingChange(
                  "privacy",
                  "allowMessages",
                  e.target.checked
                )
              }
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item toggle-item">
          <div className="toggle-content">
            <label className="setting-label">Show Online Status</label>
            <p className="setting-description">Display when you're online</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.showOnlineStatus}
              onChange={(e) =>
                handleSettingChange(
                  "privacy",
                  "showOnlineStatus",
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

  const renderPreferences = () => (
    <div className="settings-section">
      <h3 className="section-title">App Preferences</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label className="setting-label">Language</label>
          <select
            className="setting-select"
            value={settings.language}
            onChange={(e) =>
              handleSettingChange("preferences", "language", e.target.value)
            }
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
        <div className="setting-item">
          <label className="setting-label">Timezone</label>
          <select
            className="setting-select"
            value={settings.timezone}
            onChange={(e) =>
              handleSettingChange("preferences", "timezone", e.target.value)
            }
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
        <div className="setting-item">
          <label className="setting-label">Currency</label>
          <select
            className="setting-select"
            value={settings.currency}
            onChange={(e) =>
              handleSettingChange("preferences", "currency", e.target.value)
            }
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (C$)</option>
          </select>
        </div>
        <div className="setting-item">
          <label className="setting-label">Theme</label>
          <select
            className="setting-select"
            value={settings.theme}
            onChange={(e) =>
              handleSettingChange("preferences", "theme", e.target.value)
            }
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        <div className="setting-item toggle-item">
          <div className="toggle-content">
            <label className="setting-label">Auto-save Changes</label>
            <p className="setting-description">
              Automatically save changes as you type
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) =>
                handleSettingChange("preferences", "autoSave", e.target.checked)
              }
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderDeliverySettings = () => (
    <div className="settings-section">
      <h3 className="section-title">Delivery Preferences</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label className="setting-label">Maximum Distance (miles)</label>
          <input
            type="range"
            min="10"
            max="100"
            value={settings.maxDistance}
            onChange={(e) =>
              handleSettingChange("delivery", "maxDistance", e.target.value)
            }
            className="setting-range"
          />
          <span className="range-value">{settings.maxDistance} miles</span>
        </div>
        <div className="setting-item">
          <label className="setting-label">Delivery Radius (miles)</label>
          <input
            type="range"
            min="5"
            max="50"
            value={settings.deliveryRadius}
            onChange={(e) =>
              handleSettingChange("delivery", "deliveryRadius", e.target.value)
            }
            className="setting-range"
          />
          <span className="range-value">{settings.deliveryRadius} miles</span>
        </div>
        <div className="setting-item">
          <label className="setting-label">Working Hours</label>
          <div className="time-inputs">
            <input
              type="time"
              value={settings.workingHours.start}
              onChange={(e) =>
                handleNestedSettingChange(
                  "delivery",
                  "workingHours",
                  "start",
                  e.target.value
                )
              }
              className="setting-input time-input"
            />
            <span className="time-separator">to</span>
            <input
              type="time"
              value={settings.workingHours.end}
              onChange={(e) =>
                handleNestedSettingChange(
                  "delivery",
                  "workingHours",
                  "end",
                  e.target.value
                )
              }
              className="setting-input time-input"
            />
          </div>
        </div>
        <div className="setting-item">
          <label className="setting-label">Available Days</label>
          <div className="checkbox-group">
            {[
              { value: "monday", label: "Monday" },
              { value: "tuesday", label: "Tuesday" },
              { value: "wednesday", label: "Wednesday" },
              { value: "thursday", label: "Thursday" },
              { value: "friday", label: "Friday" },
              { value: "saturday", label: "Saturday" },
              { value: "sunday", label: "Sunday" },
            ].map((day) => (
              <label key={day.value} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={settings.availableDays.includes(day.value)}
                  onChange={(e) =>
                    handleArraySettingChange(
                      "delivery",
                      "availableDays",
                      day.value,
                      e.target.checked
                    )
                  }
                />
                <span className="checkbox-label">{day.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="settings-section">
      <h3 className="section-title">Payment & Billing</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label className="setting-label">Default Payment Method</label>
          <select
            className="setting-select"
            value={settings.paymentMethod}
            onChange={(e) =>
              handleSettingChange("payment", "paymentMethod", e.target.value)
            }
          >
            <option value="card">Credit/Debit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>
        <div className="setting-item toggle-item">
          <div className="toggle-content">
            <label className="setting-label">Auto Withdraw</label>
            <p className="setting-description">
              Automatically withdraw earnings
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.autoWithdraw}
              onChange={(e) =>
                handleSettingChange("payment", "autoWithdraw", e.target.checked)
              }
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <label className="setting-label">Withdrawal Threshold ($)</label>
          <input
            type="number"
            min="10"
            max="1000"
            value={settings.withdrawThreshold}
            onChange={(e) =>
              handleSettingChange(
                "payment",
                "withdrawThreshold",
                e.target.value
              )
            }
            className="setting-input"
          />
        </div>
        <div className="setting-item">
          <button className="action-button secondary">
            Manage Payment Methods
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return renderAccountSettings();
      case "privacy":
        return renderPrivacySettings();
      case "notifications":
        return renderNotificationSettings();
      case "security":
        return renderSecuritySettings();
      case "preferences":
        return renderPreferences();
      case "delivery":
        return renderDeliverySettings();
      case "payment":
        return renderPaymentSettings();
      default:
        return renderAccountSettings();
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
            <h1 className="settings-title">Settings</h1>
            <p className="settings-subtitle">
              Manage your account preferences and privacy settings
            </p>
            <button className="save-button" onClick={handleSave}>
              Save Changes
            </button>
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
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="nav-icon">{tab.icon}</span>
                    <span className="nav-label">{tab.label}</span>
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
