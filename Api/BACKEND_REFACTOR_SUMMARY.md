# Backend Refactor Summary

## ✅ Completed Updates

### 1. Gig Model Schema (`/Api/models/gig.model.js`)

**New Required Fields Added:**

- `about` (String) - Detailed gig description
- `departureCountry` (String) - Departure location country
- `departureCity` (String) - Departure location city
- `destinationCountry` (String) - Destination location country
- `destinationCity` (String) - Destination location city
- `availableSpace` (Number) - Available luggage space in kg
- `priceRMB` (Number) - Price per kg in Chinese Yuan (¥)
- `expirationDays` (Number) - Number of days until offer expires

**Backwards Compatibility:**

- Existing fields (`desc`, `cat`, `price`, `cover`, `shortTitle`, `shortDesc`, `deliveryTime`, `revisionNumber`) made optional to maintain backwards compatibility
- Old documents will continue to work; they'll just have undefined values for new fields until updated

### 2. Gig Controller (`/Api/controllers/gig.controller.js`)

**Updated `createGig` Function:**

- Added validation for all new required fields
- Validates that numeric fields (`availableSpace`, `priceRMB`, `expirationDays`) are positive numbers
- Returns clear error messages when validation fails

**New `updateGig` Function:**

- Allows sellers to update their own gigs
- Validates ownership before allowing updates
- Validates numeric fields when they're being updated
- Uses Mongoose validators for additional safety

### 3. Gig Routes (`/Api/routes/gig.route.js`)

**New Route Added:**

- `PUT /:id` - Update an existing gig (requires authentication)

**Existing Routes Preserved:**

- `POST /` - Create a new gig
- `GET /single/:id` - Get single gig details
- `GET /` - Get list of gigs with filters
- `DELETE /:id` - Delete a gig

### 4. Order Model Compatibility

The Order model continues to reference `gigId` as a String, which remains compatible with the updated Gig schema. No changes needed.

## 🔌 API Endpoints

### Create Gig

```
POST /api/gigs
Headers: Authorization: Bearer <token>
Body: {
  title: String (required)
  about: String (required)
  departureCountry: String (required)
  departureCity: String (required)
  destinationCountry: String (required)
  destinationCity: String (required)
  availableSpace: Number (required, > 0)
  priceRMB: Number (required, > 0)
  expirationDays: Number (required, > 0)
  // Optional fields
  cat: String
  cover: String
  images: [String]
  features: [String]
}
```

### Update Gig

```
PUT /api/gigs/:id
Headers: Authorization: Bearer <token>
Body: {
  // Any field you want to update
  about: String
  availableSpace: Number
  priceRMB: Number
  // etc.
}
```

### Get Single Gig

```
GET /api/gigs/single/:id
Response: {
  _id: String
  userId: String
  title: String
  about: String
  departureCountry: String
  departureCity: String
  destinationCountry: String
  destinationCity: String
  availableSpace: Number
  priceRMB: Number
  expirationDays: Number
  totalStars: Number
  starNumber: Number
  sales: Number
  createdAt: Date
  updatedAt: Date
  // ... other fields
}
```

### Get Gigs List

```
GET /api/gigs
Query Params:
  - userId: Filter by seller
  - cat: Filter by category
  - min: Min price
  - max: Max price
  - search: Search in title
  - sort: Sort field
```

## 📝 Database Migration Notes

- **No database drop required** - The schema changes are additive and backwards compatible
- **Existing documents** will have `undefined` for new fields until they're updated
- **New documents** must include all required fields or will fail validation
- **Mongoose validation** is enabled using `runValidators: true` in updates

## 🎨 Front-End Integration

The front-end should now:

1. **Gig Card Component** - Display:

   - Departure: `${departureCity}, ${departureCountry}`
   - Destination: `${destinationCity}, ${destinationCountry}`
   - Price: `${priceRMB}¥ per kg`
   - Available Space: `${availableSpace} kg`
   - Expires in: `${expirationDays} days`

2. **Single Gig Page** - Display all fields including:

   - Full `about` description
   - All location details
   - Pricing and capacity information

3. **Add Gig Form** - Collect all required fields:
   - Title and about
   - Departure and destination locations
   - Available space, price per kg, expiration days

## ✅ Validation Rules

- All new fields are required for gig creation
- `availableSpace`, `priceRMB`, and `expirationDays` must be positive numbers
- Only the gig owner (seller) can update or delete their gigs
- Authentication required for create, update, and delete operations

## 🔍 Testing Checklist

- [ ] Create new gig with all required fields
- [ ] Create gig with missing fields (should fail with 400)
- [ ] Create gig with negative numbers (should fail with 400)
- [ ] Update existing gig
- [ ] Update gig owned by different user (should fail with 403)
- [ ] Get single gig with new fields
- [ ] Get gigs list with filters
- [ ] Delete gig

---

**Last Updated:** October 19, 2025
**Refactor Status:** ✅ Complete
