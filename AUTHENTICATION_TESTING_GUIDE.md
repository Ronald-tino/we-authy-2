# Authentication Flow Testing Guide

## Overview
This guide provides comprehensive testing instructions for the new unified Google + Email authentication system.

## Prerequisites
- Firebase project configured with Google OAuth provider
- MongoDB database running and accessible
- Backend API server running on port 8800 (or configured port)
- Frontend development server running

## Test Scenarios

### 1. New Google User (First-Time Sign-Up)

**Flow**: Google OAuth → Profile Completion → Home

**Steps**:
1. Navigate to `/login`
2. Click "Sign in with Google"
3. Complete Google OAuth (select Google account)
4. **Expected**: Redirected to `/complete-profile`
5. Verify email is pre-filled and locked
6. Fill in required fields:
   - Username (required)
   - Country (required)
   - Password (optional - test both with and without)
7. Optionally set profile picture, phone, description, courier toggle
8. Click "Complete Profile"
9. **Expected**: Redirected to `/` (home page)
10. **Expected**: User data persisted in MongoDB with `firebaseUid`

**Verify**:
- MongoDB has user record with `firebaseUid` matching Firebase user
- If password was set, user can now sign in with email/password
- Profile displays correctly on home page
- User can access protected routes

### 2. Existing Google User with Complete Profile

**Flow**: Google OAuth → Home (Direct)

**Steps**:
1. Sign out if currently logged in
2. Navigate to `/login`
3. Click "Sign in with Google"
4. Select Google account that already completed profile
5. **Expected**: Redirected directly to `/` (home page)
6. **Expected**: No profile completion page shown

**Verify**:
- User authenticated immediately
- MongoDB user data loaded correctly
- Profile information displays properly

### 3. Existing Google User with Incomplete Profile

**Flow**: Google OAuth → Profile Completion → Home

**Steps**:
1. Manually set a user's country to "Not specified" in MongoDB
2. Sign out and navigate to `/login`
3. Click "Sign in with Google"
4. **Expected**: Redirected to `/complete-profile`
5. Complete the profile with valid username and country
6. **Expected**: Redirected to `/` (home page)

**Verify**:
- Incomplete profile detected correctly
- Profile completion flow works for returning users
- Updated data persisted to MongoDB

### 4. Email/Password Registration (Traditional)

**Flow**: Register Form → MongoDB Creation → Home

**Steps**:
1. Navigate to `/register`
2. Fill in all required fields:
   - Username
   - Email
   - Password
   - Country
3. Optionally fill profile picture, phone, description, courier toggle
4. Click "Create Account"
5. **Expected**: Firebase user created with email/password
6. **Expected**: MongoDB user created with `firebaseUid`
7. **Expected**: Auto-login and redirect to `/`

**Verify**:
- Firebase has user with email/password provider
- MongoDB has matching user record
- User can sign out and sign in again with email/password
- All profile data saved correctly

### 5. Google User Links Email/Password

**Flow**: Complete Profile with Password → Both Auth Methods Available

**Steps**:
1. Sign in with Google (new user)
2. On profile completion page, provide a password (don't skip)
3. Complete profile and submit
4. **Expected**: Profile completed successfully
5. Sign out
6. Navigate to `/login`
7. Try signing in with email/password (use Google email + set password)
8. **Expected**: Successfully signed in
9. Sign out again
10. Try signing in with Google
11. **Expected**: Successfully signed in

**Verify**:
- Single Firebase user has both Google and email/password providers
- Single MongoDB user record (same `firebaseUid`)
- User can authenticate with either method
- No duplicate user records created

### 6. Google User Skips Password

**Flow**: Complete Profile without Password → Google-Only Authentication

**Steps**:
1. Sign in with Google (new user)
2. On profile completion page, check "Skip password"
3. Complete profile and submit
4. **Expected**: Profile completed successfully
5. Sign out
6. Navigate to `/login`
7. Try signing in with email/password using Google email
8. **Expected**: Sign-in fails (no password set)
9. Click "Sign in with Google"
10. **Expected**: Successfully signed in

**Verify**:
- Firebase user only has Google provider
- Email/password sign-in is not available
- Google sign-in works correctly

### 7. Duplicate Prevention - Username

**Steps**:
1. Create user with username "testuser123"
2. Sign in with different Google account
3. On profile completion, try to use "testuser123"
4. **Expected**: Error message "Username already taken"
5. Change to unique username
6. **Expected**: Profile creation succeeds

**Verify**:
- Username uniqueness enforced
- Clear error messages displayed
- User can retry with different username

### 8. Duplicate Prevention - Email

**Steps**:
1. Register with email "test@example.com" and password
2. Try to sign in with Google using same email "test@example.com"
3. **Expected**: Appropriate handling (linking or error)

**Verify**:
- Email conflicts handled properly
- No duplicate user records
- Clear messaging to user

## Mobile/iPad Browser Testing

### Session Persistence
**Steps**:
1. Sign in on iOS Safari or iPad browser
2. Close browser tab
3. Reopen app URL
4. **Expected**: User remains signed in (Firebase session persisted)

**Verify**:
- Firebase session cookies work on mobile browsers
- User doesn't need to re-authenticate
- Token refresh works correctly

### OAuth Popup on Mobile
**Steps**:
1. Test Google sign-in on mobile browsers
2. **Expected**: OAuth flow works (may open in same tab on mobile)

**Verify**:
- Google OAuth completes successfully
- Redirect back to app works
- No popup blockers interfere

## Security Checks

### 1. Firebase Token Validation
- Backend rejects requests without valid Firebase token
- Expired tokens handled gracefully
- Token refresh works automatically

### 2. No Plaintext Passwords
- Check MongoDB - `password` field should be empty or not used
- Firebase handles all password hashing
- No sensitive data in localStorage

### 3. Protected Routes
- Unauthenticated users redirected to login
- Profile completion enforced before accessing app features

## Error Handling

### Test Error Scenarios:
1. Network error during registration
2. Firebase auth error (weak password, invalid email)
3. MongoDB connection error
4. Duplicate username/email
5. Cancelled Google OAuth popup
6. Popup blocked by browser

**Expected**: Clear error messages, no app crashes, ability to retry

## Backend API Verification

### Endpoints to Test:

#### POST `/api/auth/firebase-user`
**Headers**: `Authorization: Bearer <firebase-token>`

**Request Body**:
```json
{
  "firebaseUid": "abc123",
  "email": "user@example.com",
  "username": "testuser",
  "country": "United States",
  "phone": "+1234567890",
  "desc": "Test user",
  "img": "https://example.com/photo.jpg",
  "isSeller": false
}
```

**Expected Response**:
```json
{
  "user": {
    "_id": "mongo_id",
    "firebaseUid": "abc123",
    "email": "user@example.com",
    "username": "testuser",
    "country": "United States",
    "phone": "+1234567890",
    "desc": "Test user",
    "img": "https://example.com/photo.jpg",
    "isSeller": false,
    "totalStars": 0,
    "starNumber": 0,
    "tripsCompleted": 0,
    "createdAt": "2025-11-03T...",
    "updatedAt": "2025-11-03T..."
  },
  "profileComplete": true,
  "isNewUser": true
}
```

## Performance Checks

1. Profile completion form loads quickly
2. Google OAuth popup opens without delay
3. MongoDB sync happens asynchronously (doesn't block UI)
4. Image upload works smoothly

## Cross-Browser Testing

Test on:
- Chrome (Desktop & Mobile)
- Safari (Desktop & Mobile/iPad)
- Firefox
- Edge

## Final Validation

**All tests passed?**
- [ ] New Google user complete profile flow works
- [ ] Existing Google user auto-login works
- [ ] Email/password registration works
- [ ] Password linking for Google users works
- [ ] Skip password option works
- [ ] Duplicate prevention works
- [ ] Mobile session persistence works
- [ ] Error handling works
- [ ] Security validations pass
- [ ] No duplicate MongoDB entries

## Rollback Plan

If issues are found:
1. Backend changes are backward compatible (existing users unaffected)
2. Can disable Google OAuth in Firebase console temporarily
3. Frontend can revert to previous Register.jsx if needed
4. MongoDB schema unchanged (only logic updates)

## Monitoring

After deployment, monitor:
- Firebase Authentication logs
- MongoDB user creation success rate
- Error rates in auth endpoints
- User feedback on sign-up experience







