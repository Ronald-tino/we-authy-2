# Example API Calls for Updated Gig Endpoints

## 🔐 Authentication

All POST, PUT, and DELETE requests require authentication via JWT token:

```
Headers: {
  "Authorization": "Bearer <your_jwt_token>"
}
```

---

## 📝 Create New Gig

### Request

```http
POST /api/gigs
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Beijing to Shanghai Luggage Transport",
  "about": "I'm traveling from Beijing to Shanghai and have extra luggage space available. I can transport packages up to 15kg. Very reliable and fast delivery. I'll be arriving on January 15th.",
  "departureCountry": "China",
  "departureCity": "Beijing",
  "destinationCountry": "China",
  "destinationCity": "Shanghai",
  "availableSpace": 15,
  "priceRMB": 120,
  "expirationDays": 22,
  "cover": "https://example.com/image.jpg",
  "images": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
  "cat": "luggage-transport",
  "features": ["Fast delivery", "Reliable", "Insured"]
}
```

### Success Response (201)

```json
{
  "_id": "65f1234567890abcdef12345",
  "userId": "65a9876543210fedcba98765",
  "title": "Beijing to Shanghai Luggage Transport",
  "about": "I'm traveling from Beijing to Shanghai and have extra luggage space available...",
  "departureCountry": "China",
  "departureCity": "Beijing",
  "destinationCountry": "China",
  "destinationCity": "Shanghai",
  "availableSpace": 15,
  "priceRMB": 120,
  "expirationDays": 22,
  "cover": "https://example.com/image.jpg",
  "images": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
  "cat": "luggage-transport",
  "features": ["Fast delivery", "Reliable", "Insured"],
  "totalStars": 0,
  "starNumber": 0,
  "sales": 0,
  "createdAt": "2025-10-19T10:30:00.000Z",
  "updatedAt": "2025-10-19T10:30:00.000Z"
}
```

### Error Response (400 - Missing Fields)

```json
{
  "status": 400,
  "message": "Missing required fields: title, about, departureCountry, departureCity, destinationCountry, destinationCity, availableSpace, priceRMB, expirationDays"
}
```

### Error Response (400 - Invalid Numbers)

```json
{
  "status": 400,
  "message": "availableSpace, priceRMB, and expirationDays must be positive numbers"
}
```

### Error Response (403 - Not a Seller)

```json
{
  "status": 403,
  "message": "Only sellers can create a gig!"
}
```

---

## ✏️ Update Existing Gig

### Request

```http
PUT /api/gigs/65f1234567890abcdef12345
Content-Type: application/json
Authorization: Bearer <token>

{
  "availableSpace": 10,
  "priceRMB": 100,
  "about": "Updated description with new details about the trip."
}
```

### Success Response (200)

```json
{
  "_id": "65f1234567890abcdef12345",
  "userId": "65a9876543210fedcba98765",
  "title": "Beijing to Shanghai Luggage Transport",
  "about": "Updated description with new details about the trip.",
  "departureCountry": "China",
  "departureCity": "Beijing",
  "destinationCountry": "China",
  "destinationCity": "Shanghai",
  "availableSpace": 10,
  "priceRMB": 100,
  "expirationDays": 22,
  "cover": "https://example.com/image.jpg",
  "totalStars": 0,
  "starNumber": 0,
  "sales": 0,
  "createdAt": "2025-10-19T10:30:00.000Z",
  "updatedAt": "2025-10-19T11:45:00.000Z"
}
```

### Error Response (403 - Not Owner)

```json
{
  "status": 403,
  "message": "You can update only your gig!"
}
```

### Error Response (404 - Not Found)

```json
{
  "status": 404,
  "message": "Gig not found!"
}
```

---

## 🔍 Get Single Gig

### Request

```http
GET /api/gigs/single/65f1234567890abcdef12345
```

### Success Response (200)

```json
{
  "_id": "65f1234567890abcdef12345",
  "userId": "65a9876543210fedcba98765",
  "title": "Beijing to Shanghai Luggage Transport",
  "about": "I'm traveling from Beijing to Shanghai and have extra luggage space available...",
  "departureCountry": "China",
  "departureCity": "Beijing",
  "destinationCountry": "China",
  "destinationCity": "Shanghai",
  "availableSpace": 15,
  "priceRMB": 120,
  "expirationDays": 22,
  "cover": "https://example.com/image.jpg",
  "images": ["https://example.com/img1.jpg"],
  "cat": "luggage-transport",
  "features": ["Fast delivery", "Reliable"],
  "totalStars": 45,
  "starNumber": 9,
  "sales": 3,
  "createdAt": "2025-10-19T10:30:00.000Z",
  "updatedAt": "2025-10-19T10:30:00.000Z"
}
```

---

## 📋 Get List of Gigs

### Request (All Gigs)

```http
GET /api/gigs
```

### Request (With Filters)

```http
GET /api/gigs?search=Beijing&sort=createdAt&userId=65a9876543210fedcba98765
```

### Query Parameters

- `userId` - Filter by seller ID
- `cat` - Filter by category
- `min` - Minimum price
- `max` - Maximum price
- `search` - Search in title (case-insensitive regex)
- `sort` - Sort field (e.g., "createdAt", "price", "sales")

### Success Response (200)

```json
[
  {
    "_id": "65f1234567890abcdef12345",
    "userId": "65a9876543210fedcba98765",
    "title": "Beijing to Shanghai Luggage Transport",
    "about": "I'm traveling from Beijing to Shanghai...",
    "departureCountry": "China",
    "departureCity": "Beijing",
    "destinationCountry": "China",
    "destinationCity": "Shanghai",
    "availableSpace": 15,
    "priceRMB": 120,
    "expirationDays": 22,
    "totalStars": 45,
    "starNumber": 9,
    "sales": 3,
    "createdAt": "2025-10-19T10:30:00.000Z",
    "updatedAt": "2025-10-19T10:30:00.000Z"
  },
  {
    "_id": "65f9876543210fedcba98765",
    "userId": "65a9876543210fedcba98765",
    "title": "Guangzhou to Shenzhen Express",
    "about": "Quick delivery between Guangzhou and Shenzhen...",
    "departureCountry": "China",
    "departureCity": "Guangzhou",
    "destinationCountry": "China",
    "destinationCity": "Shenzhen",
    "availableSpace": 20,
    "priceRMB": 80,
    "expirationDays": 15,
    "totalStars": 50,
    "starNumber": 10,
    "sales": 5,
    "createdAt": "2025-10-18T14:20:00.000Z",
    "updatedAt": "2025-10-18T14:20:00.000Z"
  }
]
```

---

## 🗑️ Delete Gig

### Request

```http
DELETE /api/gigs/65f1234567890abcdef12345
Authorization: Bearer <token>
```

### Success Response (200)

```json
"Gig has been deleted!"
```

### Error Response (403 - Not Owner)

```json
{
  "status": 403,
  "message": "You can delete only your gig!"
}
```

---

## 🎨 Front-End Display Examples

### Gig Card Display

```javascript
// Example data formatting for UI
const gigCard = {
  title: gig.title,
  route: `${gig.departureCity}, ${gig.departureCountry} → ${gig.destinationCity}, ${gig.destinationCountry}`,
  price: `${gig.priceRMB}¥ per kg`,
  space: `${gig.availableSpace} kg available`,
  expires: `${gig.expirationDays} days`,
  rating:
    gig.starNumber > 0 ? (gig.totalStars / gig.starNumber).toFixed(1) : "New",
  sales: gig.sales,
};
```

### Single Gig Page Display

```javascript
const gigDetails = {
  ...gigCard,
  fullDescription: gig.about,
  images: gig.images || [gig.cover],
  features: gig.features || [],
  sellerId: gig.userId,
  createdDate: new Date(gig.createdAt).toLocaleDateString(),
};
```

---

## 🧪 cURL Testing Examples

### Create Gig

```bash
curl -X POST http://localhost:8800/api/gigs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Gig",
    "about": "This is a test gig description",
    "departureCountry": "China",
    "departureCity": "Beijing",
    "destinationCountry": "China",
    "destinationCity": "Shanghai",
    "availableSpace": 10,
    "priceRMB": 100,
    "expirationDays": 20
  }'
```

### Get All Gigs

```bash
curl http://localhost:8800/api/gigs
```

### Get Single Gig

```bash
curl http://localhost:8800/api/gigs/single/GIG_ID_HERE
```

### Update Gig

```bash
curl -X PUT http://localhost:8800/api/gigs/GIG_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "availableSpace": 5,
    "priceRMB": 90
  }'
```

### Delete Gig

```bash
curl -X DELETE http://localhost:8800/api/gigs/GIG_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
