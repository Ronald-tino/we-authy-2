# Seller Mode - Testing Checklist

Use this checklist to verify the Seller Mode toggle feature is working correctly.

---

## Pre-Testing Setup

- [ ] Backend server is running (`cd Api && npm start`)
- [ ] Frontend dev server is running (`cd Client && npm run dev`)
- [ ] Database is connected
- [ ] You have at least two test accounts:
  - One regular user (isSeller: false)
  - One seller (isSeller: true)

---

## Test Suite 1: Mode Toggle (Existing Seller)

**Setup**: Log in as a user with `isSeller: true`

### Basic Toggle

- [ ] Open user dropdown menu in navbar
- [ ] Verify mode toggle button is visible
- [ ] Button shows "Switch to User Mode" with 👤 icon
- [ ] Button has green/seller theme styling

### Switch to User Mode

- [ ] Click "Switch to User Mode"
- [ ] Verify "My Gigs" option disappears from menu
- [ ] Verify "Add New Gig" option disappears from menu
- [ ] Button now shows "Switch to Seller Mode" with 💼 icon
- [ ] Button has blue/user theme styling

### Switch Back to Seller Mode

- [ ] Click "Switch to Seller Mode"
- [ ] Verify "My Gigs" option appears in menu
- [ ] Verify "Add New Gig" option appears in menu
- [ ] Button shows "Switch to User Mode" again

### Persistence

- [ ] Switch to user mode
- [ ] Navigate to home page
- [ ] Open user menu → verify still in user mode
- [ ] Navigate to another page (e.g., /about)
- [ ] Open user menu → verify still in user mode
- [ ] Switch to seller mode
- [ ] Navigate around → verify stays in seller mode

### Logout Reset

- [ ] Switch to seller mode
- [ ] Click Logout
- [ ] Log back in
- [ ] Open user menu → verify mode reset to user mode (default)

---

## Test Suite 2: Protected Routes

**Setup**: Log in as seller, ensure in **user mode**

### Try Accessing Seller Pages

- [ ] Navigate to `/add` directly (type in browser)
- [ ] Verify redirect to home page
- [ ] Navigate to `/mygigs` directly
- [ ] Verify redirect to home page

### Access After Mode Switch

- [ ] Switch to seller mode
- [ ] Navigate to `/add`
- [ ] Verify page loads successfully
- [ ] Navigate to `/mygigs`
- [ ] Verify page loads successfully

### No Access for Non-Sellers

- [ ] Log out
- [ ] Log in as non-seller (isSeller: false)
- [ ] Try to navigate to `/add`
- [ ] Verify redirect to home page
- [ ] Try to navigate to `/mygigs`
- [ ] Verify redirect to home page

---

## Test Suite 3: Become a Seller Flow

**Setup**: Log in as regular user (isSeller: false)

### Button Visibility

- [ ] Verify "Become a Courier" button is visible in navbar
- [ ] Button is NOT visible if logged out
- [ ] Button is NOT visible if already a seller

### Navigation

- [ ] Click "Become a Courier"
- [ ] Verify navigation to `/become-seller` page
- [ ] Verify page displays correctly with form

### Form Validation - Phone

- [ ] Leave phone empty and submit
- [ ] Verify error message appears
- [ ] Enter phone with < 10 characters
- [ ] Submit → verify error message
- [ ] Enter valid phone (10+ characters)
- [ ] Verify no phone error

### Form Validation - Description

- [ ] Leave description empty and submit
- [ ] Verify error message appears
- [ ] Enter description with < 50 characters
- [ ] Submit → verify error message
- [ ] Enter valid description (50+ characters)
- [ ] Verify no description error

### Successful Registration

- [ ] Fill phone: "+1234567890"
- [ ] Fill description: (50+ characters about courier services)
- [ ] Click "Become a Courier" button
- [ ] Verify loading state ("Processing...")
- [ ] Wait for response
- [ ] Verify redirect to `/mygigs`
- [ ] Verify user is now in seller mode
- [ ] Open user menu → verify mode toggle is visible
- [ ] Verify "My Gigs" and "Add New Gig" options are visible

### Database Verification

- [ ] Check database for user
- [ ] Verify `isSeller: true`
- [ ] Verify `phone` field updated
- [ ] Verify `desc` field updated

---

## Test Suite 4: UI/UX Elements

### Mode Toggle Button

- [ ] Hover over toggle → verify hover effect
- [ ] Click toggle → verify smooth transition
- [ ] Verify icon changes (👤 ↔ 💼)
- [ ] Verify text changes correctly
- [ ] Verify color scheme changes (green ↔ blue)

### Navbar Updates

- [ ] "Become a Courier" styled correctly
- [ ] Hover effect works on all links
- [ ] Dropdown menu positions correctly
- [ ] No layout shift when toggling mode

### Become a Seller Page

- [ ] Page layout is centered and professional
- [ ] Form inputs have proper focus states
- [ ] Error messages display clearly
- [ ] Helper text is visible
- [ ] Submit button disabled during loading
- [ ] All text is readable and properly styled

---

## Test Suite 5: Mobile Responsiveness

### Toggle on Mobile

- [ ] Open on mobile device or use browser dev tools
- [ ] Open hamburger menu
- [ ] Verify mode toggle displays correctly
- [ ] Toggle works on mobile
- [ ] Seller options show/hide based on mode

### Become a Seller on Mobile

- [ ] Navigate to `/become-seller` on mobile
- [ ] Form is readable and usable
- [ ] Input fields are appropriately sized
- [ ] Submit button is accessible
- [ ] No horizontal scrolling

---

## Test Suite 6: Edge Cases

### Rapid Toggling

- [ ] Quickly toggle mode multiple times
- [ ] Verify no errors in console
- [ ] Verify state stays consistent

### Browser Refresh

- [ ] Set mode to seller
- [ ] Refresh page (F5)
- [ ] Verify mode persists

### LocalStorage Disabled

- [ ] Disable localStorage in browser
- [ ] Try to toggle mode
- [ ] Verify graceful fallback (no crash)

### Already a Seller

- [ ] Log in as seller
- [ ] Navigate to `/become-seller` directly
- [ ] Verify redirect to `/mygigs`
- [ ] Verify already in seller mode

### Not Logged In

- [ ] Log out
- [ ] Navigate to `/become-seller` directly
- [ ] Verify redirect to `/login`

---

## Test Suite 7: Console & Errors

### Check for Errors

- [ ] Open browser console (F12)
- [ ] Perform all actions above
- [ ] Verify **no console errors**
- [ ] Verify **no warnings** (or only minor ones)

### Network Requests

- [ ] Open Network tab
- [ ] Submit "Become a Seller" form
- [ ] Verify `PUT /api/users/become-seller` request
- [ ] Verify 200 success response
- [ ] Verify response contains updated user object

---

## Test Suite 8: Linter & Code Quality

### No Linter Errors

- [ ] Run `npm run lint` (if available)
- [ ] Verify no errors in:
  - ModeContext.jsx
  - App.jsx
  - Navbar.jsx
  - Add.jsx
  - MyGigs.jsx
  - BecomeSeller.jsx

---

## Regression Testing

Verify existing features still work:

- [ ] Login/logout works normally
- [ ] User profile loads correctly
- [ ] Settings page accessible
- [ ] Gig browsing works (/gigs)
- [ ] Gig detail page loads (/gig/:id)
- [ ] Messages page accessible
- [ ] Orders page accessible
- [ ] About page loads

---

## Performance Checks

- [ ] Mode toggle is instant (no lag)
- [ ] Page navigation is smooth
- [ ] No memory leaks after multiple toggles
- [ ] LocalStorage size is reasonable

---

## Documentation Check

- [ ] Read `SELLER_MODE_IMPLEMENTATION.md`
- [ ] Read `SELLER_MODE_QUICK_REFERENCE.md`
- [ ] Read `IMPLEMENTATION_SUMMARY.md`
- [ ] Code comments are clear
- [ ] No outdated documentation

---

## Final Verification

- [ ] All checkboxes above are ✅
- [ ] No critical bugs found
- [ ] Performance is acceptable
- [ ] UI/UX is polished
- [ ] Feature is production-ready

---

## Bug Reporting Template

If you find issues, use this format:

**Issue**: [Brief description]  
**Steps to Reproduce**:

1. Step 1
2. Step 2
3. ...

**Expected**: [What should happen]  
**Actual**: [What actually happened]  
**Browser**: [Chrome/Firefox/Safari/etc.]  
**Console Errors**: [Any errors from console]  
**Screenshots**: [If applicable]

---

## Success Criteria

✅ All tests pass  
✅ No console errors  
✅ No linter errors  
✅ Mobile responsive  
✅ Feature works as documented  
✅ No database schema changes

---

**Testing Date**: ******\_\_******  
**Tester Name**: ******\_\_******  
**Result**: [ ] PASS [ ] FAIL  
**Notes**: **********\_**********
