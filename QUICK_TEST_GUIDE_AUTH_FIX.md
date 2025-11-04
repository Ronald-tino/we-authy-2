# Quick Testing Guide - Auth & Upload Fixes

## 🚀 Quick Start Testing

### Prerequisites
1. Backend server running: `cd Api && npm start`
2. Frontend dev server running: `cd Client && npm run dev`
3. MongoDB connected
4. Cloudinary credentials configured

---

## Test 1: Google Sign-In for New User ⭐

**Expected Behavior**: New Google users are redirected to registration, NOT auto-created in MongoDB.

### Steps:
1. Open browser in **incognito/private mode**
2. Go to `/login`
3. Click "Sign in with Google"
4. Select/sign in with Google account that has **never been used** on this app
5. **Expected Result**:
   - ✅ Firebase authentication succeeds
   - ✅ User is redirected to `/register`
   - ✅ Message shown: "Please create an account first"
   - ✅ Google email/photo are pre-filled
   - ❌ NO MongoDB user is created (verify in database)

6. Complete the registration form (add username + country)
7. **Expected Result**:
   - ✅ MongoDB user is created
   - ✅ User is redirected to home page
   - ✅ User can access protected routes

### Verify in MongoDB:
```javascript
// User should NOT exist after step 4
// User SHOULD exist after step 7
db.users.find({ email: "your-test-email@gmail.com" })
```

---

## Test 2: Google Sign-In for Existing User ⭐

**Expected Behavior**: Existing users with complete profiles sign in normally.

### Steps:
1. Use account from Test 1 (now registered)
2. Sign out completely
3. Go to `/login`
4. Click "Sign in with Google"
5. **Expected Result**:
   - ✅ User is signed in
   - ✅ Redirected to home page
   - ✅ No registration required
   - ✅ Can access protected routes

---

## Test 3: Protected Routes ⭐

**Expected Behavior**: Unauthenticated users and users with incomplete profiles are redirected.

### Test 3a: No Authentication
1. Open incognito browser
2. Try to access: `/messages`, `/orders`, `/profile`, `/settings`, `/add`
3. **Expected Result**:
   - ✅ Redirected to `/login`

### Test 3b: Incomplete Profile
1. Sign in with Google (new user)
2. When redirected to `/register`, **close the tab** (don't complete registration)
3. Open new tab, try to access `/messages` or `/orders`
4. **Expected Result**:
   - ✅ Redirected to `/complete-profile`

### Test 3c: Complete Profile
1. Complete user registration
2. Try to access protected routes
3. **Expected Result**:
   - ✅ Can access all protected routes

---

## Test 4: Image Upload - Small File ⭐

**Expected Behavior**: Small images upload successfully via client-side Cloudinary.

### Steps:
1. Go to `/register` or `/settings`
2. Select a small image (< 1MB, JPEG/PNG)
3. Submit form
4. **Expected Result**:
   - ✅ Upload succeeds
   - ✅ Console shows: "Cloudinary upload successful!"
   - ✅ Image URL is saved in MongoDB
   - ✅ Profile picture displays correctly

### Check Console Logs:
```
📤 Attempting Cloudinary upload (attempt 1/3)...
Upload progress: 100%
✅ Cloudinary upload successful!
```

---

## Test 5: Image Upload - Server Fallback 🔧

**Expected Behavior**: If client-side fails, server-side upload works as fallback.

### Steps (Advanced):
1. Open browser DevTools → Network tab
2. Block Cloudinary domain: `cloudinary.com`
3. Go to `/register` or `/settings`
4. Upload an image
5. **Expected Result**:
   - ⚠️ Client-side upload fails (expected)
   - ✅ Server-side upload succeeds
   - ✅ Image is uploaded via backend
   - ✅ User doesn't see any error

### Check Console Logs:
```
📤 Attempting Cloudinary upload (attempt 1/3)...
❌ Cloudinary upload attempt 1 failed: ...
⏳ Retrying in 1000ms...
❌ Cloudinary upload attempt 2 failed: ...
⏳ Retrying in 2000ms...
❌ Cloudinary upload attempt 3 failed: ...
⚠️ Client-side upload failed, trying server-side fallback...
📤 Attempting server-side upload...
Server upload progress: 100%
✅ Server-side upload successful!
```

---

## Test 6: Image Upload - Invalid File ⭐

**Expected Behavior**: Non-image files are rejected with clear error message.

### Steps:
1. Go to `/register` or `/settings`
2. Try to upload a PDF, TXT, or other non-image file
3. **Expected Result**:
   - ❌ Upload is rejected
   - ✅ Error message: "Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image."

---

## Test 7: Image Upload - Large File ⭐

**Expected Behavior**: Files > 5MB are rejected.

### Steps:
1. Create or find an image > 5MB
2. Try to upload it
3. **Expected Result**:
   - ❌ Upload is rejected
   - ✅ Error message: "File too large. Maximum size is 5MB."

---

## Test 8: Email/Password Signup ⭐

**Expected Behavior**: Traditional email signup still works.

### Steps:
1. Go to `/register`
2. Click "Sign Up with Email/Password"
3. Fill in all fields (username, email, password, country)
4. Submit
5. **Expected Result**:
   - ✅ Firebase account created
   - ✅ MongoDB user created
   - ✅ User is signed in
   - ✅ Redirected to home

---

## Test 9: Existing Google User - Email Login ⭐

**Expected Behavior**: Google users can optionally add email/password for dual auth.

### Steps:
1. Sign up with Google (complete profile)
2. Go to `/settings` (or during registration, set a password)
3. **Optional**: Set a password during Google signup
4. Sign out
5. Try to sign in with email + password
6. **Expected Result**:
   - ✅ Can sign in with either Google OR email/password

---

## Mobile Testing 📱

### Test on Mobile Browser
1. Open site on mobile device (iOS Safari, Android Chrome)
2. Test Google Sign-In
3. Test image upload (camera photo or gallery)
4. **Expected Results**:
   - ✅ Google OAuth works
   - ✅ Image upload works (may use server fallback)
   - ✅ UI is responsive

---

## Database Verification Commands

### Check if user exists:
```javascript
db.users.find({ email: "test@example.com" })
```

### Check if auto-created users exist (should be NONE):
```javascript
// Find users with temporary usernames (these shouldn't exist after fix)
db.users.find({ username: /.*_.*/ })
```

### Count total users:
```javascript
db.users.countDocuments()
```

---

## Common Issues & Solutions

### Issue: Redirected to `/register` after Google Sign-In
- **Status**: ✅ Working as intended
- **Solution**: Complete the registration form

### Issue: Image upload fails completely
- **Check**: Cloudinary credentials in backend `.env`
- **Check**: Backend server is running
- **Check**: Console errors

### Issue: Can't access protected routes
- **Check**: Profile has username and country filled
- **Check**: Not using temporary username with underscores
- **Fix**: Go to `/settings` and update profile

### Issue: "User not found" error
- **Status**: ✅ Working as intended for new Google users
- **Solution**: Complete registration first

---

## Success Criteria ✅

All tests should pass with these results:
- ✅ Google Sign-In does NOT auto-create MongoDB users
- ✅ New Google users are redirected to `/register`
- ✅ Protected routes are properly guarded
- ✅ Image uploads work with retry + fallback
- ✅ Clear error messages for invalid files
- ✅ No linting errors
- ✅ Mobile browsers work correctly

---

## Quick Smoke Test (2 minutes)

**Run this minimal test to verify everything works**:

1. ✅ Sign in with Google (new account) → Should redirect to register
2. ✅ Complete registration → Should create MongoDB user
3. ✅ Upload profile picture → Should succeed
4. ✅ Access `/messages` → Should work
5. ✅ Sign out and access `/orders` → Should redirect to login
6. ✅ Sign in again → Should work immediately

**If all 6 steps pass, the fix is working! 🎉**

---

## Need Help?

Check:
1. Backend logs for errors
2. Browser console for frontend errors
3. MongoDB to verify user creation/absence
4. Network tab for API call responses

Refer to `AUTHENTICATION_FIX_SUMMARY.md` for detailed implementation details.

