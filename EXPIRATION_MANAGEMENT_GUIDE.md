# Gig Expiration Management System

## Overview

This guide documents the implementation of the days-to-expire management system for gigs. The system calculates remaining days dynamically based on the creation date and expiration days, and displays them with color-coded visual indicators across the application.

## Features

### 1. **Dynamic Days Calculation**

- Calculates remaining days from the gig creation date (`createdAt`)
- Original `expirationDays` field stores the total days from creation
- Real-time calculation shows actual days remaining

### 2. **Visual Status Indicators**

The system uses four distinct status levels with color-coded styling:

| Status            | Days Remaining | Color                | Animation     |
| ----------------- | -------------- | -------------------- | ------------- |
| **Active**        | > 7 days       | Green (#16db65)      | None          |
| **Expiring Soon** | 3-7 days       | Orange (#ffa726)     | None          |
| **Urgent**        | 1-2 days       | Red-Orange (#ff5722) | Pulse effect  |
| **Expired**       | ≤ 0 days       | Red (#e53935)        | Strikethrough |

### 3. **Implementation Locations**

The expiration management is implemented in:

1. **GigCard Component** (`Client/src/components/GiGcard/GigCard.jsx`)

   - Displays in the main gig listings
   - Shows format: "EXP in X days" or "EXPIRED"

2. **Gig Detail Page** (`Client/src/pages/gig/Gig.jsx`)

   - Full gig details view
   - Same format as GigCard

3. **MyGigs Page** (`Client/src/pages/myGigs/MyGigs.jsx`)
   - Seller's gig management table
   - Shows format: "X days left" or "EXPIRED"

## Technical Implementation

### Core Utility Functions

Location: `Client/src/utils/calculateDaysRemaining.js`

#### `calculateDaysRemaining(createdAt, expirationDays)`

Calculates the remaining days until a gig expires.

**Parameters:**

- `createdAt` (string|Date): The creation date of the gig
- `expirationDays` (number): Total days until expiration from creation

**Returns:** Object

```javascript
{
  daysRemaining: number,    // Remaining days (0 or positive)
  status: string,           // 'active' | 'expiring-soon' | 'urgent' | 'expired'
  isExpired: boolean,       // True if expired
  expirationDate: string    // ISO format expiration date
}
```

**Example:**

```javascript
const result = calculateDaysRemaining("2024-10-15", 10);
// If today is 2024-10-20:
// {
//   daysRemaining: 5,
//   status: 'expiring-soon',
//   isExpired: false,
//   expirationDate: '2024-10-25T...'
// }
```

#### `getExpirationMessage(daysRemaining, isExpired)`

Formats the expiration message for display.

**Parameters:**

- `daysRemaining` (number): Days remaining until expiration
- `isExpired` (boolean): Whether the gig has expired

**Returns:** string

- `"EXPIRED"` if expired
- `"Expires today"` if 0 days remaining
- `"Expires in 1 day"` if 1 day remaining
- `"EXP in X days"` otherwise

#### `getExpirationClass(status)`

Returns CSS class modifier for styling.

**Parameters:**

- `status` (string): The expiration status

**Returns:** string - CSS class modifier (`'active'`, `'expiring-soon'`, `'urgent'`, `'expired'`)

## Database Schema

The gig model includes the following fields:

```javascript
// Api/models/gig.model.js
{
  expirationDays: {
    type: Number,
    required: true,  // Total days from creation until expiration
  },
  // timestamps: true automatically adds:
  createdAt: Date,   // Used to calculate remaining days
  updatedAt: Date
}
```

## Styling

### Color Palette

```scss
// Active (Green)
color: #16db65;
background: rgba(22, 219, 101, 0.05);

// Expiring Soon (Orange)
color: #ffa726;
background: rgba(255, 167, 38, 0.1);

// Urgent (Red-Orange)
color: #ff5722;
background: rgba(255, 87, 34, 0.15);

// Expired (Red)
color: #e53935;
background: rgba(229, 57, 53, 0.15);
```

### Pulse Animation

The urgent status includes a subtle pulse animation:

```scss
@keyframes pulse-urgent {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
```

## Usage Examples

### In a Component

```jsx
import {
  calculateDaysRemaining,
  getExpirationMessage,
  getExpirationClass,
} from "../../utils/calculateDaysRemaining";

function GigComponent({ gig }) {
  // Calculate expiration info
  const expirationInfo = calculateDaysRemaining(
    gig.createdAt,
    gig.expirationDays
  );

  const expirationMessage = getExpirationMessage(
    expirationInfo.daysRemaining,
    expirationInfo.isExpired
  );

  const expirationClass = getExpirationClass(expirationInfo.status);

  return (
    <div className={`expiration expiration--${expirationClass}`}>
      {expirationMessage}
    </div>
  );
}
```

## Testing Scenarios

### Scenario 1: Active Gig (> 7 days)

- Created: 2024-10-01
- Expiration Days: 20
- Current Date: 2024-10-10
- **Expected:** "EXP in 11 days" (Green)

### Scenario 2: Expiring Soon (3-7 days)

- Created: 2024-10-01
- Expiration Days: 10
- Current Date: 2024-10-06
- **Expected:** "EXP in 5 days" (Orange)

### Scenario 3: Urgent (1-2 days)

- Created: 2024-10-01
- Expiration Days: 10
- Current Date: 2024-10-09
- **Expected:** "EXP in 2 days" (Red-Orange, Pulsing)

### Scenario 4: Expires Today

- Created: 2024-10-01
- Expiration Days: 10
- Current Date: 2024-10-11
- **Expected:** "Expires today" (Red-Orange, Pulsing)

### Scenario 5: Expired

- Created: 2024-10-01
- Expiration Days: 10
- Current Date: 2024-10-12
- **Expected:** "EXPIRED" (Red, Strikethrough)

## Best Practices

1. **Always check for null values:**

   ```javascript
   if (!gig?.createdAt || !gig?.expirationDays) {
     return null; // or default fallback
   }
   ```

2. **Handle loading states:**

   ```javascript
   const expirationInfo = data
     ? calculateDaysRemaining(data.createdAt, data.expirationDays)
     : { daysRemaining: 0, status: "expired", isExpired: true };
   ```

3. **Use conditional rendering:**
   ```jsx
   {
     gig?.expirationDays && (
       <div className={`expiration--${expirationClass}`}>
         {expirationMessage}
       </div>
     );
   }
   ```

## Future Enhancements

Potential improvements for the expiration system:

1. **Auto-hide expired gigs** after X days
2. **Email notifications** when gigs are expiring soon
3. **Extend expiration** functionality for sellers
4. **Expiration history** tracking
5. **Customizable expiration periods** per gig type
6. **Dashboard analytics** showing expiring gigs count

## Troubleshooting

### Issue: Days remaining shows negative

**Cause:** The calculation doesn't clamp to 0
**Fix:** The `calculateDaysRemaining` function includes `Math.max(0, daysRemaining)`

### Issue: Wrong color displaying

**Cause:** CSS class not applied correctly
**Fix:** Ensure the class follows the pattern: `expiration--{status}`

### Issue: Animation not working

**Cause:** Missing keyframe definition
**Fix:** Ensure `@keyframes pulse-urgent` is defined in the SCSS file

## Related Files

- **Utility:** `Client/src/utils/calculateDaysRemaining.js`
- **Components:**
  - `Client/src/components/GiGcard/GigCard.jsx`
  - `Client/src/components/GiGcard/GigCard.scss`
- **Pages:**
  - `Client/src/pages/gig/Gig.jsx`
  - `Client/src/pages/gig/Gig.scss`
  - `Client/src/pages/myGigs/MyGigs.jsx`
  - `Client/src/pages/myGigs/MyGigs.scss`
- **Model:** `Api/models/gig.model.js`

## Support

For questions or issues related to the expiration management system, please refer to this documentation or contact the development team.
