/**
 * Calculate days remaining for a gig based on creation date and expiration days
 * @param {string|Date} createdAt - The creation date of the gig
 * @param {number} expirationDays - Total days until expiration from creation
 * @returns {Object} Object containing daysRemaining, status, and isExpired
 */
export const calculateDaysRemaining = (createdAt, expirationDays) => {
  if (!createdAt || !expirationDays) {
    return {
      daysRemaining: 0,
      status: "expired",
      isExpired: true,
    };
  }

  const creationDate = new Date(createdAt);
  const currentDate = new Date();

  // Calculate the expiration date
  const expirationDate = new Date(creationDate);
  expirationDate.setDate(expirationDate.getDate() + expirationDays);

  // Calculate days remaining (difference in milliseconds / milliseconds per day)
  const timeDiff = expirationDate - currentDate;
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  // Determine status based on days remaining
  let status = "active";
  if (daysRemaining <= 0) {
    status = "expired";
  } else if (daysRemaining <= 2) {
    status = "urgent"; // Less than or equal to 2 days
  } else if (daysRemaining <= 7) {
    status = "expiring-soon"; // Less than or equal to 7 days
  }

  return {
    daysRemaining: Math.max(0, daysRemaining), // Never negative
    status,
    isExpired: daysRemaining <= 0,
    expirationDate: expirationDate.toISOString(),
  };
};

/**
 * Get a formatted expiration message
 * @param {number} daysRemaining - Days remaining until expiration
 * @param {boolean} isExpired - Whether the gig has expired
 * @returns {string} Formatted message
 */
export const getExpirationMessage = (daysRemaining, isExpired) => {
  if (isExpired) {
    return "EXPIRED";
  }

  if (daysRemaining === 0) {
    return "Expires today";
  }

  if (daysRemaining === 1) {
    return "Expires in 1 day";
  }

  return `EXP in ${daysRemaining} days`;
};

/**
 * Get CSS class modifier based on expiration status
 * @param {string} status - The expiration status
 * @returns {string} CSS class modifier
 */
export const getExpirationClass = (status) => {
  const classMap = {
    expired: "expired",
    urgent: "urgent",
    "expiring-soon": "expiring-soon",
    active: "active",
  };

  return classMap[status] || "active";
};
