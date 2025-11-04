# Testing Guide - Signup Validation Fix

## Quick Start Testing

### Prerequisites
1. Backend server running: `cd Api && npm start`
2. Frontend server running: `cd Client && npm run dev`
3. MongoDB connected
4. Firebase project configured

---

## 🧪 Test Case 1: Email Signup - Username Already Taken

**Goal:** Verify that username validation happens BEFORE Firebase account creation

### Steps:
1. Open browser to `http://localhost:5173/register`
2. Click "Sign Up with Email/Password"
3. Fill in the form:
   - **Username:** Use an existing username (check MongoDB for one, or create test user first)
   - **Email:** newemail@example.com
   - **Password:** testpass123
   - **Country:** United States
4. Click "Create Account"

### Expected Results:
✅ Error message: "Username is already taken. Please choose a different username."
✅ No Firebase account created (check Firebase Console)
✅ No MongoDB record created
✅ User can correct username and submit again

### How to Verify:
```bash
# Check Firebase Console - Authentication section
# Should NOT see newemail@example.com

# Check MongoDB
# Should NOT see user with newemail@example.com
```

---

## 🧪 Test Case 2: Email Signup - Valid Username (Happy Path)

**Goal:** Verify successful signup with unique username

### Steps:
1. Navigate to `http://localhost:5173/register`
2. Click "Sign Up with Email/Password"
3. Fill in the form:
   - **Username:** uniqueuser123
   - **Email:** unique@example.com
   - **Password:** testpass123
   - **Country:** United States
4. Click "Create Account"

### Expected Results:
✅ Account created successfully
✅ Redirected to home page (`/`)
✅ Firebase user created
✅ MongoDB user created with matching firebaseUid
✅ User is logged in

### How to Verify:
```bash
# Check Firebase Console
# Should see unique@example.com

# Check MongoDB
db.users.findOne({ username: "uniqueuser123" })
# Should return user with firebaseUid matching Firebase UID

# Check frontend - should be logged in and on home page
```

---

## 🧪 Test Case 3: Email Signup - Username Too Short

**Goal:** Verify client-side validation works

### Steps:
1. Navigate to `/register`
2. Click "Sign Up with Email/Password"
3. Fill username: "ab" (2 characters)
4. Fill other fields
5. Click "Create Account"

### Expected Results:
✅ Error: "Username must be at least 3 characters"
✅ No API calls made (check Network tab)
✅ No Firebase account created

---

## 🧪 Test Case 4: Email Signup - Username Too Long

**Goal:** Verify username length validation

### Steps:
1. Fill username: "thisusernameiswaytoolongtobevalid" (33 characters)
2. Fill other fields
3. Submit

### Expected Results:
✅ Error: "Username must be at most 20 characters"
✅ No API calls made

---

## 🧪 Test Case 5: Google Signup - Username Already Taken

**Goal:** Verify Google flow also validates username

### Steps:
1. Navigate to `/register`
2. Click "Sign Up with Google"
3. Complete Google OAuth (select Google account)
4. Fill profile completion form:
   - **Username:** existinguser (use one that exists in DB)
   - **Country:** United States
5. Click "Complete Profile"

### Expected Results:
✅ Error: "Username is already taken. Please choose a different username."
✅ Google Firebase account still exists (from OAuth)
✅ NO MongoDB record created
✅ User can change username and retry

### How to Verify:
```bash
# Firebase Console - should see Google auth user
# MongoDB - should NOT see user with this firebaseUid until valid username provided
```

---

## 🧪 Test Case 6: Google Signup - Valid Username (Happy Path)

**Goal:** Verify successful Google signup

### Steps:
1. Navigate to `/register`
2. Click "Sign Up with Google"
3. Complete Google OAuth
4. Fill profile:
   - **Username:** googletestuser
   - **Country:** Canada
   - **Password:** (optional) testpass123
5. Click "Complete Profile"

### Expected Results:
✅ Profile created successfully
✅ Redirected to home page
✅ MongoDB record created with Google firebaseUid
✅ If password provided, can also login with email/password

---

## 🧪 Test Case 7: Cleanup Verification - Orphaned Account Prevention

**Goal:** Verify Firebase account is deleted if MongoDB save fails

### Steps:
1. Create a test where you manually stop MongoDB mid-request (advanced)
2. Or use existing username to trigger duplicate error
3. Submit email signup with existing username

### Expected Results:
✅ Username validation prevents account creation in first place
✅ If somehow bypassed, backend cleanup function deletes Firebase account
✅ No orphaned Firebase accounts

### How to Verify Server Logs:
```bash
# Should see in backend console:
⚠️ Username/email conflict detected. Cleaning up Firebase user: <uid>
✅ Successfully deleted Firebase user: <uid>
```

---

## 🧪 Test Case 8: Case-Insensitive Username Check

**Goal:** Verify username normalization works

### Steps:
1. Existing username in DB: "testuser"
2. Try to register with "TestUser" (different case)
3. Submit

### Expected Results:
✅ Error: "Username is already taken"
✅ Case is normalized to lowercase on both client and server
✅ No duplicate users created

---

## 🧪 Test Case 9: Race Condition Test

**Goal:** Verify concurrent signups don't create duplicates

### Setup:
Open two browser windows side-by-side

### Steps:
1. Window 1: Start email signup with username "racetest"
2. Window 2: Start email signup with username "racetest"
3. Both fill same email: different1@test.com, different2@test.com
4. Both submit at same time

### Expected Results:
✅ First submission succeeds (whichever reaches server first)
✅ Second submission fails with "Username is already taken"
✅ Only ONE user with username "racetest" in MongoDB
✅ Only ONE Firebase account created (for winner)
✅ Second Firebase account (if created) is auto-deleted

---

## 🧪 Test Case 10: Network Error Handling

**Goal:** Verify error handling when username check API fails

### Steps:
1. Open DevTools → Network tab
2. Start email signup
3. Block the `/auth/check-username` request
4. Submit form

### Expected Results:
✅ Error message shown
✅ User can retry
✅ No Firebase account created

---

## Manual Verification Checklist

After running all tests, verify:

### Firebase Console
- [ ] No orphaned accounts (accounts without corresponding MongoDB user)
- [ ] All emails match MongoDB emails
- [ ] No duplicate emails

### MongoDB Database
```bash
# Check for orphaned users (shouldn't exist)
db.users.find({ firebaseUid: { $exists: false } })

# Check for duplicate usernames (shouldn't exist)
db.users.aggregate([
  { $group: { _id: "$username", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } }
])

# Check for duplicate emails (shouldn't exist)
db.users.aggregate([
  { $group: { _id: "$email", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } }
])
```

### Application Logs
- [ ] No unexpected errors
- [ ] Cleanup messages appear when appropriate
- [ ] Username validation messages logged

---

## Performance Testing

### Measure Latency
Open DevTools → Network tab and measure:

1. **Username Check API:**
   - Should be < 100ms
   - Route: `/api/auth/check-username`

2. **Total Signup Time:**
   - Email signup: Should be < 2s (including Firebase + MongoDB)
   - Google signup: Should be < 1.5s (excluding OAuth popup)

---

## Cleanup After Testing

### Remove Test Accounts

**Firebase:**
```
Go to Firebase Console → Authentication → Delete test users
```

**MongoDB:**
```bash
# Remove test users
db.users.deleteMany({ 
  email: { $regex: /test|example\.com/ } 
})

# Or remove specific test users
db.users.deleteMany({ 
  username: { $in: ["uniqueuser123", "googletestuser", "racetest"] } 
})
```

---

## Automated Testing (Future)

Consider adding Jest/Cypress tests for:

1. **Unit Tests:**
   - `checkUsernameAvailability` function
   - `deleteFirebaseUser` function
   - Username normalization

2. **Integration Tests:**
   - Complete signup flow
   - Cleanup on error
   - Race condition handling

3. **E2E Tests (Cypress):**
   - Full user journey from registration to login
   - Error state handling
   - Form validation

---

## Known Issues / Expected Behaviors

### Not Bugs:
1. **Google OAuth popup blocked** - User needs to allow popups
2. **Username check delay** - Network latency is normal (50-100ms)
3. **Firebase account exists after Google OAuth but no MongoDB user** - Expected until profile completed

### Edge Cases to Monitor:
1. **Very slow network** - Username check might time out
2. **Concurrent signups** - Database handles with unique constraints
3. **Firebase Admin SDK permission issues** - Ensure service account has auth permissions

---

## Success Criteria

All tests pass when:
✅ Username validation happens before Firebase account creation
✅ No orphaned Firebase accounts after failed signups
✅ Clear error messages guide users
✅ Users can correct errors and successfully register
✅ No duplicate usernames or emails in database
✅ Both Google and Email flows work correctly

---

## Troubleshooting

### Issue: "Username is available" but signup still fails
**Solution:** Check MongoDB connection, ensure indexes are created

### Issue: Firebase account created but not deleted on error
**Solution:** Check Firebase Admin SDK permissions, verify service account key

### Issue: Username check always returns "taken"
**Solution:** Check MongoDB query, verify username normalization

### Issue: "Email already taken" on retry after username rejection
**Solution:** This was the original bug - should be fixed now. If still occurring, check that frontend calls `/check-username` before Firebase creation

---

**Testing Completed:** ___________
**Tester:** ___________
**Issues Found:** ___________
**Status:** ✅ Pass / ❌ Fail


