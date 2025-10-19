# GigCard Component - Travel Luggage Space Listings

## 🎨 Design Theme

- **Background**: #0f0f0f (dark)
- **Accent Color**: #16db65 (neon green)
- **Text**: White (#ffffff) for primary content
- **Border Radius**: 12px (desktop), 10px (tablet), 8px (mobile)
- **Shadows**: Subtle with green glow on hover

---

## ✈️ Route Visualization (Horizontal Planes)

```
[white dot] AE  ---✈---✈---  PK [green dot]
   Dubai, United Arab Emirates    Lahore, Pakistan
              EXP in 22 days
```

### Key Features:

- **Two plane icons (✈)** oriented **horizontally** (facing right)
- **White dashed lines** between dots and planes
- **Departure**: White dot on left, country code in white
- **Destination**: Green dot on right, country code in green
- Full location names displayed below route line
- Expiration text centered below in gray

---

## 💼 Information Sections

### 1. Available Space

- 🧳 Suitcase SVG icon (green)
- Label: "AVAILABLE SPACE" (uppercase, gray)
- Value: "40 kg" (white, bold)
- Subtext: "Booked 0 kg" (muted gray)

### 2. Price

- 🏷️ Tag SVG icon (green)
- Label: "PRICE" (uppercase, gray)
- Value: **"120¥ per kg"** (green, bold)
  - Numeric part highlighted in green
  - Calculated as: `price / availableSpace`

---

## 🔘 Action Buttons

### Chat Now

- Style: Outlined with white border (2px)
- Hover: Slight background fill + lift effect (2px)

### Make Offer

- Style: Solid neon green background
- Hover: Darker green (#12c957) + lift effect (2px)

---

## 📊 Stats Footer

```
0 Offers | 0 Bookings
(green)     (gray)
```

---

## 📱 Component Structure (BEM)

```scss
.gig-card
├── __header
│   ├── __user
│   │   ├── __avatar
│   │   └── __user-info
│   │       ├── __user-top (__id, __badge)
│   │       ├── __user-name (__name, __verified)
│   │       └── __timestamp
│   └── __status
├── __route
│   ├── __route-point (--departure, --destination)
│   │   ├── __dot (--white, --green)
│   │   └── __code (--white, --green)
│   └── __route-line
│       ├── __dash (--long)
│       └── __plane (×2)
├── __locations
│   └── __location (--departure, --destination)
│       └── __location-text
├── __expiration
├── __info
│   ├── __space
│   │   ├── __icon
│   │   └── __info-content (__label, __value, __subtext)
│   └── __price
│       ├── __icon
│       └── __info-content (__label, __value--highlight)
├── __actions
│   └── __btn (--outline, --primary)
└── __stats
    ├── __stat (--offers, --bookings)
    └── __separator
```

---

## 🛠️ Props

```typescript
item: {
  _id: string;
  userId: string;
  departureCountry: string;   // e.g., "AE" or "United Arab Emirates"
  departureCity: string;       // e.g., "Dubai"
  destinationCountry: string;  // e.g., "PK" or "Pakistan"
  destinationCity: string;     // e.g., "Lahore"
  availableSpace: number;      // in kg (default: 40)
  price: number;               // total price for calculation
  expirationDays?: number;     // optional (displays "EXP in X days")
  createdAt?: string;          // ISO date string for timestamp
}
```

---

## 📐 Usage Example

```jsx
import GigCard from "./components/GiGcard/GigCard";

<GigCard
  item={{
    _id: "abc123def456",
    userId: "user789",
    departureCountry: "AE",
    departureCity: "Dubai",
    destinationCountry: "PK",
    destinationCity: "Lahore",
    availableSpace: 40,
    price: 4800, // 120¥ per kg
    expirationDays: 22,
    createdAt: "2025-10-19T07:30:00Z",
  }}
/>;
```

---

## 📱 Responsive Breakpoints

| Breakpoint           | Changes                                              |
| -------------------- | ---------------------------------------------------- |
| **Desktop** (>768px) | Full size with 24px padding, 12px border-radius      |
| **Tablet** (≤768px)  | Reduced fonts and spacing, 10px border-radius        |
| **Mobile** (≤480px)  | Compact layout, stacked locations, 8px border-radius |

---

## 🎯 Key Calculations

```javascript
// Price per kg (in Yuan)
pricePerKg = Math.round(price / availableSpace);

// Timestamp formatting
formatTimestamp("2025-10-19T07:30:00Z");
// Output: "Sat, Oct 19, 7:30 AM"
```

---

## ✨ Hover Effects

- **Card**: Lifts 4px, border turns green, green shadow appears
- **Buttons**: Lift 2px, slight background change
- **Smooth transitions**: 0.3s ease on all interactions

---

## 🎨 Design Notes

1. **Horizontal plane orientation**: Planes face right (→) not down (↓)
2. **Dashed lines**: CSS `repeating-linear-gradient` creating distinct `-  -  -  -` pattern
   - Desktop: 8px dash, 8px gap
   - Tablet: 7px dash, 7px gap
   - Mobile: 6px dash, 6px gap
3. **Placeholder data**: Falls back to "Dubai, UAE" ↔ "Lahore, Pakistan"
4. **Price display**: Yuan symbol (¥) used for international appeal
5. **Accessibility**: Proper alt text, semantic HTML, keyboard navigation
6. **Link wrapper**: Entire card is clickable, navigates to `/gig/{id}`

---

## 📦 File Structure

```
GiGcard/
├── GigCard.jsx      # React component (220 lines)
├── GigCard.scss     # BEM-style SCSS (580+ lines)
└── COMPONENT.md     # This documentation
```

---

**Last Updated**: October 2025  
**Version**: 2.0 (Horizontal plane redesign)
