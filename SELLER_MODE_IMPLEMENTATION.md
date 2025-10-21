# Seller Mode Toggle Feature - Implementation Guide

## Overview

This document describes the implementation of the **Seller Mode** toggle feature, which allows users with seller privileges to switch between "Seller Mode" and "User Mode" without modifying the database schema.

## Key Features

✅ **Mode Toggle**: Sellers can switch between Seller and User modes  
✅ **Session Persistence**: Mode choice persists across navigation  
✅ **Auto-Reset on Logout**: Mode automatically resets when user logs out  
✅ **Seller Onboarding**: New "Become a Seller" page for non-sellers  
✅ **Protected Routes**: Seller-only pages redirect when not in seller mode  
✅ **Zero Schema Changes**: No database modifications required

---

## Implementation Details

### 1. Mode Context (`/Client/src/context/ModeContext.jsx`)

**Purpose**: Centralized state management for user mode switching.

**Key Features**:

- Manages `currentMode` state ("user" or "seller")
- Persists mode to `localStorage`
- Provides `isInSellerMode` computed value
- Exposes helper functions: `toggleMode()`, `switchToSellerMode()`, `switchToUserMode()`
- Automatically resets mode when user logs out

**Usage**:

```javascript
import { useMode } from "../../context/ModeContext";

const { isInSellerMode, isSeller, toggleMode } = useMode();
```

---

### 2. Navigation Bar Updates (`/Client/src/components/Navbar/Navbar.jsx`)

**Changes**:

1. Added mode toggle button in user dropdown menu
2. Seller options (My Gigs, Add New Gig) now only show when `isInSellerMode === true`
3. "Become a Courier" button now links to `/become-seller` for non-sellers
4. Logout handler clears `userMode` from localStorage

**Mode Toggle Button**:

- Shows "Switch to User Mode" when in seller mode (with 👤 icon)
- Shows "Switch to Seller Mode" when in user mode (with 💼 icon)
- Visual distinction: green for seller mode, blue for user mode

---

### 3. Seller-Specific Pages Protection

#### Add Gig Page (`/Client/src/pages/add/Add.jsx`)

```javascript
useEffect(() => {
  if (!isSeller || !isInSellerMode) {
    navigate("/");
  }
}, [isSeller, isInSellerMode, navigate]);
```

#### My Gigs Page (`/Client/src/pages/myGigs/MyGigs.jsx`)

```javascript
useEffect(() => {
  if (!isSeller || !isInSellerMode) {
    navigate("/");
  }
}, [isSeller, isInSellerMode, navigate]);
```

**Behavior**: Users trying to access seller pages while in user mode are automatically redirected to the home page.

---

### 4. Become a Seller Flow

#### Frontend (`/Client/src/pages/becomeSeller/BecomeSeller.jsx`)

**Features**:

- Form to collect seller information (phone, description)
- Validation: phone must be 10+ characters, description 50+ characters
- Redirects existing sellers to `/mygigs` in seller mode
- Redirects non-logged-in users to `/login`
- On success: updates localStorage and switches to seller mode

**Form Fields**:

- **Phone Number** (required): Contact for verification and updates
- **Description** (required, min 50 chars): About courier services

#### Backend (`/Api/controllers/user.controller.js`)

**Endpoint**: `PUT /api/users/become-seller`  
**Middleware**: `verifyToken` (requires authentication)

**Request Body**:

```json
{
  "phone": "+1234567890",
  "desc": "Detailed description of courier services..."
}
```

**Response**: Updated user object (without password)

**Validation**:

- Phone: minimum 10 characters
- Description: minimum 50 characters
- User must be authenticated

**Database Update**:

```javascript
{
  $set: {
    isSeller: true,
    phone: phone.trim(),
    desc: desc.trim(),
  }
}
```

---

### 5. Route Configuration (`/Client/src/App.jsx`)

**Changes**:

1. Wrapped main `Layout` with `ModeProvider`
2. Added `/become-seller` route

```javascript
<ModeProvider>
  <Navbar />
  <Outlet />
</ModeProvider>
```

---

### 6. Styling (`/Client/src/components/Navbar/Navbar.scss`)

**New Classes**:

- `.mode-toggle-container`: Container for toggle button
- `.mode-toggle`: The toggle button itself
  - `.seller-active`: Green theme when in seller mode
  - `.user-active`: Blue theme when in user mode
- `.become-seller-link`: Styling for "Become a Courier" link

**Design**:

- Smooth transitions and hover effects
- Visual feedback for current mode
- Responsive design for mobile devices

---

## User Flow Examples

### Flow 1: Existing Seller Switching Modes

1. User logs in (has `isSeller: true`)
2. Opens user menu dropdown → sees mode toggle
3. Clicks **"Switch to User Mode"**
4. Seller options (My Gigs, Add New Gig) disappear
5. Can browse as regular user
6. Clicks **"Switch to Seller Mode"** to restore seller features

### Flow 2: Non-Seller Becoming a Seller

1. User logs in (has `isSeller: false`)
2. Sees **"Become a Courier"** in navbar
3. Clicks → navigates to `/become-seller`
4. Fills out form (phone, description)
5. Submits → backend updates `isSeller: true`
6. Automatically switched to seller mode
7. Redirected to `/mygigs`

### Flow 3: Protected Route Access

1. Seller in user mode tries to visit `/add`
2. `useEffect` hook detects `!isInSellerMode`
3. Automatically redirected to home page
4. Must switch to seller mode to access seller pages

---

## Technical Architecture

### State Flow

```
localStorage ("userMode") ←→ ModeContext ←→ Components
                              ↓
                         isInSellerMode
                              ↓
                    Conditional UI Rendering
```

### Data Persistence

| Storage      | Key           | Values             | Purpose                         |
| ------------ | ------------- | ------------------ | ------------------------------- |
| localStorage | `userMode`    | "user" \| "seller" | Current mode                    |
| localStorage | `currentUser` | User object        | User data (includes `isSeller`) |

**Note**: `isSeller` is the permanent database field. `userMode` is the temporary view mode.

---

## Security Considerations

1. **Client-Side Only**: Mode toggle is purely UI/UX — no security implications
2. **Backend Validation**: All seller endpoints should verify `isSeller === true` in database
3. **Protected Routes**: Client-side protection prevents accidental access
4. **Token Verification**: `/become-seller` endpoint requires valid JWT

**Important**: The mode toggle does NOT grant seller privileges. It only controls UI visibility. Backend endpoints must always validate the actual `isSeller` field from the database.

---

## Testing Checklist

- [ ] Seller can toggle between modes
- [ ] Mode persists across page navigation
- [ ] Mode resets on logout
- [ ] Non-sellers see "Become a Courier" button
- [ ] Seller onboarding form validates input
- [ ] Backend endpoint updates user correctly
- [ ] Protected pages redirect when not in seller mode
- [ ] UI updates correctly based on mode
- [ ] Mobile responsive design works
- [ ] No console errors or warnings

---

## File Changes Summary

### New Files

- `/Client/src/context/ModeContext.jsx` - Mode state management
- `/Client/src/pages/becomeSeller/BecomeSeller.jsx` - Seller onboarding page
- `/Client/src/pages/becomeSeller/BecomeSeller.scss` - Seller onboarding styles

### Modified Files (Frontend)

- `/Client/src/App.jsx` - Added ModeProvider wrapper and /become-seller route
- `/Client/src/components/Navbar/Navbar.jsx` - Added mode toggle and conditional rendering
- `/Client/src/components/Navbar/Navbar.scss` - Added mode toggle styles
- `/Client/src/pages/add/Add.jsx` - Added mode protection
- `/Client/src/pages/myGigs/MyGigs.jsx` - Added mode protection

### Modified Files (Backend)

- `/Api/controllers/user.controller.js` - Added `becomeSeller` controller
- `/Api/routes/user.route.js` - Added `/become-seller` route

---

## Future Enhancements (Optional)

1. **Mode Indicator Badge**: Show current mode in navbar
2. **Mode Switch Confirmation**: Ask for confirmation before switching
3. **Analytics**: Track mode switching behavior
4. **Admin Override**: Allow admins to force users into specific modes
5. **Mode-Specific Dashboard**: Different homepage for seller vs user mode

---

## Troubleshooting

### Issue: Mode not persisting

**Solution**: Check localStorage is enabled and not blocked by browser settings

### Issue: Can't switch to seller mode

**Solution**: Verify `isSeller: true` in database for that user

### Issue: Seller pages still accessible in user mode

**Solution**: Check useEffect protection is properly implemented in each page

### Issue: "Become a Seller" button not showing

**Solution**: Verify user is logged in and has `isSeller: false`

---

## Conclusion

This implementation provides a clean, maintainable way to toggle between seller and user views without any database modifications. The feature is entirely view-based, with proper validation and security measures in place.

**Key Principle**: The database `isSeller` field determines **capability**, while the `userMode` state determines **current view**.
