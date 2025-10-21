# Seller Mode - Quick Reference Guide

## For Developers: How to Use the Mode Context

### Import the Hook

```javascript
import { useMode } from "../../context/ModeContext";
```

### Get Mode Information

```javascript
const {
  isInSellerMode, // true if seller AND in seller mode
  isSeller, // true if user has seller privileges
  currentMode, // "user" or "seller"
  toggleMode, // Switch between modes
  switchToSellerMode, // Force seller mode
  switchToUserMode, // Force user mode
} = useMode();
```

---

## Common Patterns

### 1. Show/Hide UI Based on Mode

```javascript
{
  isInSellerMode && <button>Add New Gig</button>;
}
```

### 2. Protect Seller-Only Pages

```javascript
import { useMode } from "../../context/ModeContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function MySellerPage() {
  const { isInSellerMode, isSeller } = useMode();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSeller || !isInSellerMode) {
      navigate("/");
    }
  }, [isSeller, isInSellerMode, navigate]);

  // Page content...
}
```

### 3. Show "Become a Seller" Button

```javascript
{
  !isSeller && currentUser && <Link to="/become-seller">Become a Courier</Link>;
}
```

### 4. Mode Toggle Button

```javascript
<button onClick={toggleMode}>
  {currentMode === "seller" ? "Switch to User Mode" : "Switch to Seller Mode"}
</button>
```

---

## Backend Integration

### Protect Seller Endpoints

```javascript
// Always check the database isSeller field, not client state
export const createGig = async (req, res, next) => {
  const user = await User.findById(req.userId);

  if (!user.isSeller) {
    return next(createError(403, "Only sellers can create gigs"));
  }

  // Create gig...
};
```

### Become a Seller Endpoint

```javascript
// PUT /api/users/become-seller
{
  "phone": "+1234567890",
  "desc": "Detailed description (min 50 chars)"
}
```

---

## Important Notes

⚠️ **Security**: Mode toggle is UI-only. Always validate `isSeller` in backend.  
⚠️ **Persistence**: Mode is saved in localStorage and resets on logout.  
⚠️ **Default Mode**: New sellers start in "user" mode by default.

---

## State vs Database

| Field            | Location     | Purpose                         | Mutable           |
| ---------------- | ------------ | ------------------------------- | ----------------- |
| `isSeller`       | Database     | User's seller capability        | Yes (via backend) |
| `userMode`       | localStorage | Current view mode               | Yes (client-side) |
| `isInSellerMode` | Computed     | `isSeller && mode === "seller"` | Derived           |

---

## Quick Troubleshooting

**Problem**: Can't access seller pages  
**Solution**: Switch to seller mode via navbar dropdown

**Problem**: Mode not saving  
**Solution**: Check localStorage is enabled

**Problem**: Seller features showing for non-sellers  
**Solution**: Use `isInSellerMode` not just `isSeller`

---

## Example: Complete Page Protection

```javascript
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMode } from "../../context/ModeContext";

function SellerOnlyPage() {
  const navigate = useNavigate();
  const { isInSellerMode, isSeller } = useMode();

  // Redirect if not authorized
  useEffect(() => {
    if (!isSeller || !isInSellerMode) {
      navigate("/");
    }
  }, [isSeller, isInSellerMode, navigate]);

  // Early return while redirecting
  if (!isSeller || !isInSellerMode) {
    return null;
  }

  return <div>{/* Seller-only content */}</div>;
}

export default SellerOnlyPage;
```

---

## Testing Your Implementation

1. **As Non-Seller**:

   - Log in as regular user
   - Should see "Become a Courier" button
   - Click it → fill form → become seller
   - Should auto-switch to seller mode

2. **As Seller**:

   - Log in as seller
   - Open user menu
   - Toggle mode → UI should update
   - Navigate around → mode should persist
   - Log out → mode should reset

3. **Protected Routes**:
   - Be in user mode
   - Try to visit `/add` or `/mygigs`
   - Should redirect to home
   - Switch to seller mode → access granted

---

## Migration Checklist

When adding new seller-only features:

- [ ] Use `isInSellerMode` in component logic
- [ ] Add route protection with useEffect
- [ ] Validate `isSeller` in backend endpoint
- [ ] Test in both modes
- [ ] Document the feature

---

For full documentation, see `SELLER_MODE_IMPLEMENTATION.md`
