// PROJECT STRUCTURE
// This is the complete file tree for reference

/_
backend/
├── src/
│ ├── controllers/
│ │ ├── auth.controller.ts
│ │ ├── posts.controller.ts
│ │ ├── categories.controller.ts
│ │ ├── ads.controller.ts
│ │ └── metrics.controller.ts
│ ├── services/
│ │ ├── auth.service.ts
│ │ ├── posts.service.ts
│ │ ├── categories.service.ts
│ │ ├── ads.service.ts
│ │ └── metrics.service.ts
│ ├── models/
│ │ ├── User.ts
│ │ ├── Post.ts
│ │ ├── Category.ts
│ │ └── Ad.ts
│ ├── routes/
│ │ ├── auth.routes.ts
│ │ ├── public.routes.ts
│ │ ├── admin.routes.ts
│ │ └── metrics.routes.ts
│ ├── middleware/
│ │ ├── auth.middleware.ts
│ │ ├── error.middleware.ts
│ │ ├── validate.middleware.ts
│ │ └── rateLimiter.middleware.ts
│ ├── utils/
│ │ ├── slugify.ts
│ │ ├── logger.ts
│ │ └── db.ts
│ ├── app.ts
│ └── server.ts
├── docker/
│ ├── Dockerfile
│ └── docker-compose.yml
├── scripts/
│ └── seed.ts
├── tests/
│ ├── auth.test.ts
│ └── posts.test.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
_/

# Content + Ads Backend API

Production-ready Node.js + TypeScript backend for a content management and advertising platform. Built with Express, MongoDB, JWT authentication, and comprehensive ad tracking.

## 🚀 Features

- **Content Management**: Full CRUD operations for blog posts with categories
- **Ad Management**: Create, manage, and track ads with multiple placements
- **Analytics**: Real-time impression and click tracking with atomic increments
- **Authentication**: JWT-based admin authentication
- **Security**: Helmet, CORS, rate limiting, input validation
- **Production Ready**: Docker support, logging, error handling
- **TypeScript**: Full type safety and modern ES6+ features

## 📋 Prerequisites

- Node.js 20+
- MongoDB 7+
- Docker & Docker Compose (optional)

## 🛠️ Tech Stack

- **Runtime**: Node.js 20, TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken), bcrypt
- **Validation**: Joi
- **Security**: Helmet, CORS, express-rate-limit
- **Logging**: Pino
- **Testing**: Jest, ts-jest

## 📦 Installation

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start MongoDB (if not using Docker)
# mongod --dbpath=/path/to/data

# Run in development mode
npm run dev
```

### Using Docker

```bash
# Start MongoDB and backend
cd docker
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/mydb

# JWT Secret (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-me

# Admin Credentials (for initial setup)
ADMIN_INITIAL_EMAIL=admin@example.com
ADMIN_INITIAL_PASSWORD=SecurePassword123!

# Frontend (for CORS)
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=info
```

## 🌱 Seeding Database

Create initial admin user and sample data:

```bash
npm run seed
```

This will create:

- Admin user with credentials from `.env`
- Sample categories (Technology, Business, Lifestyle, Entertainment)
- Sample blog post
- Sample advertisements

## 📚 API Documentation

### Base URL

```
http://localhost:4000/api
```

### Authentication

All admin endpoints require JWT token in header:

```
Authorization: Bearer <your-jwt-token>
```

---

### Auth Endpoints
 
#### Register Admin
 
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "SecurePass123!",
  "name": "Admin User"
}
```

**Response:**

```json
{
  "message": "Admin user registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

---

### Posts (Public)

#### Get All Posts

```http
GET /api/posts?page=1&limit=10&published=true&category=<categoryId>&search=technology
```

**Query Parameters:**

- `page` (default: 1)
- `limit` (default: 10)
- `published` (true/false)
- `category` (category ID)
- `search` (text search)

**Response:**

```json
{
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Welcome to Our Blog",
      "slug": "welcome-to-our-blog",
      "content": "<h2>Welcome...</h2>",
      "thumbnailUrl": "https://example.com/image.jpg",
      "category": {
        "_id": "507f191e810c19729de860ea",
        "name": "Technology",
        "slug": "technology"
      },
      "metaTitle": "Welcome to Our Blog",
      "metaDescription": "Discover the latest...",
      "published": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 15,
  "pages": 2
}
```

#### Get Post by Slug

```http
GET /api/posts/welcome-to-our-blog
```

---

### Posts (Admin)

#### Create Post

```http
POST /api/admin/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My New Blog Post",
  "content": "<p>This is the content...</p>",
  "thumbnailUrl": "https://example.com/image.jpg",
  "category": "507f191e810c19729de860ea",
  "metaTitle": "SEO Title",
  "metaDescription": "SEO description here",
  "published": true
}
```

#### Update Post

```http
PUT /api/admin/posts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "published": true
}
```

#### Delete Post

```http
DELETE /api/admin/posts/:id
Authorization: Bearer <token>
```

---

### Categories

#### Get All Categories (Public)

```http
GET /api/categories
```

#### Create Category (Admin)

```http
POST /api/admin/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Technology"
}
```

#### Update Category (Admin)

```http
PUT /api/admin/categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Tech News"
}
```

---

### Ads

#### Get Ads by Placement (Public)

```http
GET /api/ads?placement=top
```

**Placements:** `top`, `sidebar`, `inline`, `popup`, `footer`

**Response:**

```json
{
  "ads": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Top Banner Ad",
      "type": "image",
      "imageUrl": "https://example.com/banner.jpg",
      "placement": "top",
      "redirectUrl": "https://example.com",
      "isActive": true,
      "impressions": 1250,
      "clicks": 45,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create Ad (Admin)

```http
POST /api/admin/ads
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Homepage Banner",
  "type": "image",
  "imageUrl": "https://example.com/ad.jpg",
  "placement": "top",
  "redirectUrl": "https://example.com/promo",
  "isActive": true
}
```

**For script-based ads:**

```json
{
  "title": "Google AdSense",
  "type": "script",
  "scriptCode": "<script async src='...'></script>",
  "placement": "sidebar",
  "isActive": true
}
```

#### Update Ad (Admin)

```http
PUT /api/admin/ads/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "isActive": false
}
```

#### Delete Ad (Admin)

```http
DELETE /api/admin/ads/:id
Authorization: Bearer <token>
```

---

### Metrics

#### Record Impression

```http
POST /api/metrics/impression
Content-Type: application/json

{
  "adId": "507f1f77bcf86cd799439011"
}
```

#### Record Click

```http
POST /api/metrics/click
Content-Type: application/json

{
  "adId": "507f1f77bcf86cd799439011"
}
```

#### Get Ad Metrics (Admin)

```http
GET /api/admin/metrics/ad/:id
Authorization: Bearer <token>
```

**Response:**

```json
{
  "metrics": {
    "impressions": 1250,
    "clicks": 45,
    "ctr": 3.6
  }
}
```

---

## 🎯 Frontend Integration Examples

### Initialize Ads Tracking

```javascript
// When ad is displayed
async function trackImpression(adId) {
  await fetch("http://localhost:4000/api/metrics/impression", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adId }),
  });
}

// When ad is clicked
async function trackClick(adId) {
  await fetch("http://localhost:4000/api/metrics/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adId }),
  });
}

// Usage in React
useEffect(() => {
  if (ad?._id) {
    trackImpression(ad._id);
  }
}, [ad]);
```

### Fetch Posts

```javascript
async function fetchPosts(page = 1) {
  const response = await fetch(
    `http://localhost:4000/api/posts?page=${page}&limit=10&published=true`
  );
  const data = await response.json();
  return data;
}
```

### Admin Login

```javascript
async function login(email, password) {
  const response = await fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  // Store token
  localStorage.setItem("token", data.token);

  return data;
}
```

### Create Post (Admin)

```javascript
async function createPost(postData) {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:4000/api/admin/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  return await response.json();
}
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

---

## 🐳 Docker Deployment

### Build and Run

```bash
cd docker
docker-compose up -d
```

### Seed Database in Docker

```bash
docker-compose exec backend npm run seed
```

### View Logs

```bash
docker-compose logs -f backend
```

### Stop Services

```bash
docker-compose down
```

---

## 🌐 Production Deployment

### Render.com

1. Create new Web Service
2. Connect your repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy!

### Heroku

```bash
# Install Heroku CLI
heroku create your-app-name

# Add MongoDB addon
heroku addons:create mongodb-atlas:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set FRONTEND_URL=https://your-frontend.com

# Deploy
git push heroku main

# Seed database
heroku run npm run seed
```

### Railway

1. Create new project
2. Add MongoDB service
3. Add Node.js service from GitHub
4. Set environment variables
5. Deploy automatically on push

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/       # Request handlers
│   ├── services/          # Business logic
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── utils/             # Helper functions
│   ├── app.ts             # Express app setup
│   └── server.ts          # Server entry point
├── docker/
│   ├── Dockerfile         # Container definition
│   └── docker-compose.yml # Multi-container setup
├── scripts/
│   └── seed.ts            # Database seeding
├── tests/                 # Test files
├── .env.example           # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Change JWT_SECRET** - Use strong, random secret in production
3. **Use HTTPS** - Always use SSL/TLS in production
4. **Rate Limiting** - Configured for auth and metrics endpoints
5. **Input Validation** - All inputs validated with Joi
6. **Helmet.js** - Security headers enabled
7. **CORS** - Configure `FRONTEND_URL` to restrict origins

---

## 🐛 Common Issues

### MongoDB Connection Failed

```bash
# Check if MongoDB is running
mongod --version

# Check connection string in .env
MONGO_URI=mongodb://localhost:27017/mydb
```

### Port Already in Use

```bash
# Change PORT in .env
PORT=5000
```

### JWT Token Invalid

- Check if `JWT_SECRET` matches between requests
- Verify token hasn't expired (7 day expiry)
- Check Authorization header format: `Bearer <token>`

---

## 📄 License

MIT License

---

## 👥 Support

For issues and questions:

- Check existing issues on GitHub
- Create new issue with detailed description
- Include error logs and environment details

---

## 🔄 API Response Format

### Success Response

```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "error": "Error message here",
  "details": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## ⚡ Performance Tips

1. **Indexes**: Already configured on slug, category, and text fields
2. **Pagination**: Always use pagination for large datasets
3. **Caching**: Consider Redis for frequently accessed data
4. **Connection Pooling**: Mongoose handles this automatically
5. **Compression**: Add compression middleware for large responses

---

Happy coding! 🚀
#   c o n t e n t W e b s i t e  
 