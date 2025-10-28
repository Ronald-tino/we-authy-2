# Profile Page - User Guide

## 🎯 Quick Start

The profile page is now **fully functional and modern**. Here's everything you need to know:

---

## 📍 How to Access

Navigate to: `/profile` or click on your profile from the navigation menu.

---

## 👀 View Mode (Default)

When you first open the profile page, you'll see:

### Header Section

- **Profile Avatar** - Your profile picture (or default avatar)
- **Verification Badge** - Shows if you're a verified seller
- **Username & Display Name**
- **Location** - Your country
- **Stats Bar**:
  - ⭐ Rating
  - 🚗 Trips Completed
  - 📅 Member Since

### Content Sections

1. **About** - Your bio/description
2. **Contact Information**:
   - 📧 Email
   - 📞 Phone
   - 📍 Location
3. **Activity Summary**:
   - Trips completed
   - Average rating
   - Join date

### Actions

- **Edit Profile** button (top right) - Click to enter edit mode

---

## ✏️ Edit Mode

### To Enter Edit Mode:

Click the **"Edit Profile"** button in the header.

### What Changes:

1. ✏️ Avatar gains an upload button
2. 📝 Bio becomes a textarea (with character counter)
3. 📞 Phone becomes an input field
4. 🌍 Location becomes a dropdown selector
5. 🔘 Buttons change to "Cancel" and "Save Changes"

### How to Edit:

#### 1. **Change Profile Picture**

```
- Click the small "+" button on your avatar
- Select an image file from your device
- See instant preview
- Image must be:
  ✓ Under 5MB
  ✓ Image format (jpg, png, gif, webp)
```

#### 2. **Edit Bio**

```
- Click in the bio text area
- Type or edit your description
- Watch character count (max 500)
- Red text shows if over limit
```

#### 3. **Update Phone**

```
- Click in the phone field
- Enter phone number
- Must be at least 10 characters
- Format: +1 (555) 123-4567 (example)
```

#### 4. **Change Location**

```
- Click the location dropdown
- Search for your country
- Select from the list
- Required field (cannot be empty)
```

### Validation

The form automatically validates:

| Field    | Rule                            | Error Message                                                 |
| -------- | ------------------------------- | ------------------------------------------------------------- |
| Bio      | Max 500 characters              | "Bio must be less than 500 characters"                        |
| Phone    | Min 10 characters (if provided) | "Phone number must be at least 10 characters"                 |
| Location | Required                        | "Location is required"                                        |
| Image    | Max 5MB, images only            | "Image must be less than 5MB" / "Please select an image file" |

### To Save Changes:

1. Make your edits
2. Click **"Save Changes"** button
3. Wait for loading indicator
4. See success toast notification
5. Automatically exits edit mode
6. Your changes are saved!

### To Cancel:

1. Click **"Cancel"** button
2. All changes are discarded
3. Returns to view mode
4. Original data is restored

---

## 🔔 Notifications (Toasts)

### Success Toast (Green)

```
✓ Profile updated successfully!
```

Shows when your profile is saved successfully.

### Error Toast (Red)

```
⚠ Please fix the errors below
⚠ Image must be less than 5MB
⚠ Failed to update profile
```

Shows when there's a validation error or save failure.

**Auto-dismiss**: Toasts automatically disappear after 4 seconds
**Manual dismiss**: Click the "×" to close immediately

---

## 📱 Mobile Experience

The profile page is fully responsive:

### On Mobile:

- Avatar and info center-aligned
- Stats stack vertically
- Buttons full-width
- Sections stack in single column
- Touch-friendly buttons
- Optimized spacing

---

## 🎨 Visual Indicators

### Colors & Meaning:

- 🟢 **Green** - Success, verified, active
- 🔵 **Blue** - Information, calendar
- 🟡 **Yellow** - Ratings, achievements
- 🔴 **Red** - Errors, required fields
- ⚪ **Gray** - Inactive, disabled

### Icons:

- ✏️ Edit Profile button
- ✓ Save confirmation
- 📧 Email
- 📞 Phone
- 📍 Location
- 📅 Calendar/Date
- ⭐ Rating

---

## 💡 Pro Tips

1. **Edit Everything at Once**

   - You can change multiple fields before saving
   - All changes save together

2. **Cancel Anytime**

   - Your changes aren't saved until you click "Save Changes"
   - Safe to cancel without losing original data

3. **Image Preview**

   - See your new avatar before saving
   - If you don't like it, cancel and try again

4. **Character Counter**

   - Keep an eye on the bio character count
   - Green = OK, Red = Over limit

5. **Required Fields**
   - Fields with \* are required
   - Currently only Location is required

---

## 🔧 Troubleshooting

### "Failed to update profile"

- ✓ Check your internet connection
- ✓ Make sure you're logged in
- ✓ Try refreshing the page

### "Image must be less than 5MB"

- ✓ Your image file is too large
- ✓ Try compressing it online
- ✓ Or choose a smaller image

### "Phone number must be at least 10 characters"

- ✓ Include country code: +1
- ✓ Or leave phone blank (it's optional)

### "Location is required"

- ✓ You must select a country
- ✓ Use the dropdown to search and select

### Changes not saving

- ✓ Look for validation errors (red text)
- ✓ Fix any errors shown
- ✓ Try again

### Loading forever

- ✓ Check internet connection
- ✓ Refresh the page
- ✓ Check if backend server is running

---

## 🎯 Common Tasks

### Task: Update my bio

```
1. Click "Edit Profile"
2. Click in bio area
3. Type your new bio
4. Click "Save Changes"
✓ Done!
```

### Task: Add my phone number

```
1. Click "Edit Profile"
2. Click in phone field
3. Type phone number (at least 10 chars)
4. Click "Save Changes"
✓ Done!
```

### Task: Change profile picture

```
1. Click "Edit Profile"
2. Click "+" button on avatar
3. Select image from device
4. See preview
5. Click "Save Changes"
✓ Done!
```

### Task: Update my location

```
1. Click "Edit Profile"
2. Click location dropdown
3. Search for your country
4. Select it from list
5. Click "Save Changes"
✓ Done!
```

---

## 📊 What Gets Saved

### You CAN Edit:

- ✏️ Profile picture (avatar)
- ✏️ Bio/description
- ✏️ Phone number
- ✏️ Location/country

### You CANNOT Edit (Yet):

- ❌ Username (set at registration)
- ❌ Email (security reason)
- ❌ Rating (calculated from reviews)
- ❌ Trips completed (from actual trips)
- ❌ Member since (your join date)

---

## 🔐 Privacy & Security

### Your Data:

- ✓ Only YOU can edit your profile
- ✓ Changes require authentication
- ✓ Password never shown or editable here
- ✓ Email verified separately

### What Others See:

- Public: Username, avatar, bio, location, rating, trips
- Private: Email (visible to you only)
- Private: Phone (visible to you only)

---

## ⌨️ Keyboard Shortcuts

While in edit mode:

- `Tab` - Move between fields
- `Escape` - Close country dropdown
- `Enter` - Save when in input field
- Click outside - Close dropdowns

---

## 📱 Responsive Design

The profile page adapts to your screen:

| Screen Size            | Layout                         |
| ---------------------- | ------------------------------ |
| Desktop (1200px+)      | Full 2-column layout           |
| Tablet (768-1199px)    | 2-column with adjusted spacing |
| Mobile (< 768px)       | Single column, stacked         |
| Small mobile (< 480px) | Compact spacing                |

---

## 🎉 What's New

Compared to the old profile page:

| Feature            | Old   | New             |
| ------------------ | ----- | --------------- |
| Save functionality | ❌    | ✅              |
| Image upload       | ❌    | ✅              |
| Validation         | ❌    | ✅              |
| Notifications      | ❌    | ✅              |
| Loading states     | ❌    | ✅              |
| Error handling     | ❌    | ✅              |
| API integration    | ❌    | ✅              |
| Modern design      | ❌    | ✅              |
| Animations         | Basic | Advanced        |
| Responsive         | Basic | Fully optimized |

---

## 🆘 Need Help?

If something isn't working:

1. **Check for errors** - Look for red text on the page
2. **Read error messages** - They tell you what to fix
3. **Check console** - Open browser dev tools (F12)
4. **Refresh page** - Sometimes fixes temporary issues
5. **Check login** - Make sure you're logged in
6. **Clear cache** - Try clearing browser cache

---

## 🎯 Best Practices

### Writing Your Bio:

- Keep it concise and friendly
- Mention your experience
- Add what makes you reliable
- Max 500 characters = ~100 words

### Profile Picture:

- Use a clear photo
- Square images work best
- Good lighting
- Friendly appearance

### Phone Number:

- Include country code
- Use standard format
- Double-check for typos

---

## ✨ Summary

Your profile page is now a powerful, modern tool for managing your information. It's:

- 🎨 Beautiful and modern
- 📱 Works on all devices
- ✏️ Easy to edit
- ✅ Validates your input
- 🔔 Gives clear feedback
- 💾 Saves reliably

Enjoy your new profile page! 🎉


