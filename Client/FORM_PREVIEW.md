# Updated Add Gig Form - Visual Preview

## 🎨 New Form Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Add New Gig                                │
│              Create a new luggage space listing for travelers       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  📝 Listing Information                                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Listing Title *                                                    │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ e.g. Dubai to Lahore - Reliable Luggage Transport Service    │ │
│  └───────────────────────────────────────────────────────────────┘ │
│  Create a clear, descriptive title for your luggage transport      │
│  service                                                            │
│                                                                     │
│  Service Description * (What goods can you transport?)              │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                                 │ │
│  │ Example: I'm traveling from Dubai to Lahore and have 15kg     │ │
│  │ of extra luggage space available. I can transport the         │ │
│  │ following items:                                               │ │
│  │                                                                 │ │
│  │ • Electronics (phones, tablets, laptops - sealed in original  │ │
│  │   packaging)                                                   │ │
│  │ • Clothing and textiles                                        │ │
│  │ • Documents and small packages                                 │ │
│  │ • Cosmetics and personal care items                            │ │
│  │ • Small gifts and souvenirs                                    │ │
│  │                                                                 │ │
│  │ I CANNOT transport:                                            │ │
│  │ ✗ Prohibited items (weapons, drugs, etc.)                     │ │
│  │ ✗ Liquids over 100ml                                          │ │
│  │ ✗ Fragile glass items                                         │ │
│  │ ✗ Perishable food items                                       │ │
│  │                                                                 │ │
│  │ I'm a verified traveler with 5+ years experience. All items   │ │
│  │ will be handled with care and delivered promptly. I'll        │ │
│  │ provide tracking updates throughout the journey.               │ │
│  │                                                                 │ │
│  └───────────────────────────────────────────────────────────────┘ │
│  ⚠️ IMPORTANT: You MUST specify what types of goods you can and    │
│  cannot transport. Include any restrictions, handling instructions,│
│  and your experience level. Minimum 50 characters.                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────┬───────────────────────────────────┐
│  🛫 Departure Information         │  🛬 Destination Information       │
├───────────────────────────────────┼───────────────────────────────────┤
│                                   │                                   │
│  Departure Country *              │  Destination Country *            │
│  ┌─────────────────────────────┐ │  ┌─────────────────────────────┐ │
│  │ Select departure country  ▼ │ │  │ Select destination country▼ │ │
│  └─────────────────────────────┘ │  └─────────────────────────────┘ │
│                                   │                                   │
│  Departure City *                 │  Destination City *               │
│  ┌─────────────────────────────┐ │  ┌─────────────────────────────┐ │
│  │ e.g. Dubai                  │ │  │ e.g. Lahore                 │ │
│  └─────────────────────────────┘ │  └─────────────────────────────┘ │
│                                   │                                   │
│  Available Space (kg) *           │  Price per kg (¥ RMB) *          │
│  ┌─────────────────────────────┐ │  ┌─────────────────────────────┐ │
│  │ e.g. 15                     │ │  │ e.g. 120                    │ │
│  └─────────────────────────────┘ │  └─────────────────────────────┘ │
│  How many kilograms of luggage    │  Set your price per kilogram in  │
│  space can you offer?             │  Chinese Yuan (¥)                │
│                                   │                                   │
│                                   │  Expiration (days) *              │
│                                   │  ┌─────────────────────────────┐ │
│                                   │  │ e.g. 22                     │ │
│                                   │  └─────────────────────────────┘ │
│                                   │  How many days until this offer  │
│                                   │  expires?                        │
│                                   │                                   │
└───────────────────────────────────┴───────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│                         [  Create Gig  ]                             │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Key Visual Changes

### 1. **New Section at Top** (Full Width)

The "Listing Information" section now appears FIRST and spans the full width, containing:

- ✅ Title input field
- ✅ Large About textarea with detailed example
- ✅ Warning message about goods specification

### 2. **Two-Column Layout Below**

Departure and Destination information remain in a clean two-column layout:

- Left: Departure Info
- Right: Destination Info

### 3. **Helper Text Under Each Field**

Every input now has gray helper text below it explaining what to enter

### 4. **Updated Labels**

- "Price (USD)" → "Price per kg (¥ RMB)"
- Added emoji icons (🛫 🛬) to section titles
- More descriptive labels

---

## 📱 Mobile View (< 768px)

```
┌───────────────────────────────────┐
│         Add New Gig               │
│  Create a new luggage space       │
│  listing for travelers            │
└───────────────────────────────────┘

┌───────────────────────────────────┐
│  📝 Listing Information           │
├───────────────────────────────────┤
│  Listing Title *                  │
│  ┌─────────────────────────────┐ │
│  │ e.g. Dubai to Lahore...     │ │
│  └─────────────────────────────┘ │
│  Create a clear, descriptive...   │
│                                   │
│  Service Description *            │
│  ┌─────────────────────────────┐ │
│  │                             │ │
│  │  [Large textarea]           │ │
│  │                             │ │
│  └─────────────────────────────┘ │
│  ⚠️ IMPORTANT: You MUST...       │
└───────────────────────────────────┘

┌───────────────────────────────────┐
│  🛫 Departure Information         │
├───────────────────────────────────┤
│  Departure Country *              │
│  [Field]                          │
│  Departure City *                 │
│  [Field]                          │
│  Available Space (kg) *           │
│  [Field]                          │
│  Helper text...                   │
└───────────────────────────────────┘

┌───────────────────────────────────┐
│  🛬 Destination Information       │
├───────────────────────────────────┤
│  Destination Country *            │
│  [Field]                          │
│  Destination City *               │
│  [Field]                          │
│  Price per kg (¥ RMB) *          │
│  [Field]                          │
│  Helper text...                   │
│  Expiration (days) *              │
│  [Field]                          │
│  Helper text...                   │
└───────────────────────────────────┘

┌───────────────────────────────────┐
│      [  Create Gig  ]             │
└───────────────────────────────────┘
```

**Note:** On mobile, sections stack vertically instead of side-by-side.

---

## 🎨 Color Scheme

- **Background:** Black (#000000)
- **Borders:** Dark Gray (#374151)
- **Text Primary:** White (#FFFFFF)
- **Text Secondary:** Gray (#9CA3AF)
- **Accent/Focus:** Green (#16DB65)
- **Helper Text:** Light Gray (#9CA3AF)
- **Warning Text:** Green (#16DB65) for important keywords

---

## ✨ Interactive Features

### On Focus:

```
┌───────────────────────────────────┐
│ [Input field]                     │ ← Glowing green border
└───────────────────────────────────┘
   Box shadow: 0 0 0 3px rgba(22, 219, 101, 0.1)
```

### On Hover:

```
┌───────────────────────────────────┐
│ [Input field]                     │ ← Green border
└───────────────────────────────────┘
```

### Submit Button:

```
Normal: Green gradient background
Hover:  Brighter green + shadow + slight lift
Active: No lift
Disabled: 60% opacity
```

---

## 📏 Spacing & Sizing

- **Form padding:** 20px
- **Section gap:** 32px
- **Field gap:** 20px
- **Label margin:** 8px bottom
- **Input padding:** 16px 20px
- **Textarea min-height:** 150px
- **Helper text margin:** 4px top
- **Button padding:** 18px 24px

---

## 🔤 Typography

- **Title:** 2rem, bold
- **Section titles:** 1.25rem, semi-bold
- **Labels:** 16px, medium
- **Inputs:** 16px
- **Helper text:** 13px
- **Placeholders:** 14px, gray

---

## 🎯 What Users See Now vs Before

### BEFORE:

```
❌ No title field
❌ No description field
❌ No guidance on what to write
❌ No examples
❌ Confusing price label (USD)
❌ No helper text
```

### AFTER:

```
✅ Clear title field
✅ Large description field with comprehensive example
✅ Explicit instructions to specify goods
✅ Real-world example in placeholder
✅ Clear price label (¥ RMB per kg)
✅ Helper text under every field
✅ Warning about goods specification
✅ Better organized layout
```

---

## 🚀 User Experience Flow

1. **User opens form** → Sees clear structure and examples
2. **Reads placeholder** → Understands exactly what to write
3. **Sees warning** → Knows goods specification is mandatory
4. **Fills fields** → Helper text guides each input
5. **Submits form** → Validation provides clear feedback
6. **Success** → Redirected to My Gigs with new listing

---

## 💯 Accessibility

- ✅ All labels properly associated with inputs
- ✅ Clear focus states
- ✅ Readable color contrast
- ✅ Mobile responsive
- ✅ Keyboard navigation friendly
- ✅ Screen reader compatible
- ✅ Clear error messages

---

This is what users will see when they visit `/add` to create a new gig! 🎉
