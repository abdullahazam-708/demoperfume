# Perfume Shop Backend API

## Overview
This is the backend API for the Perfume Shop application, built with Node.js, Express, and MongoDB.

## Features Implemented

### ✅ Models
- **User Model** (`models/User.js`)
  - Fields: name, email, password (hashed), isAdmin
  - Password hashing with bcryptjs
  - Password comparison method

- **Product Model** (`models/Product.js`)
  - Fields: name, brand, price, description, image, category, countInStock, rating, numReviews
  - Timestamps for created/updated dates

### ✅ Authentication & Authorization
- **JWT Authentication** (`middleware/authMiddleware.js`)
  - `protect` middleware - verifies JWT tokens
  - `admin` middleware - checks admin role

### ✅ Controllers
- **User Controller** (`controllers/userController.js`)
  - `registerUser` - Register new user
  - `loginUser` - Login and get JWT token
  - `getUserProfile` - Get logged-in user profile
  - `getUsers` - Get all users (admin only)

- **Product Controller** (`controllers/productController.js`)
  - `getProducts` - Get all products
  - `getProductById` - Get single product
  - `createProduct` - Create product (admin only)

### ✅ Routes
- **User Routes** (`routes/userRoutes.js`)
  - `POST /api/users/register` - Register
  - `POST /api/users/login` - Login
  - `GET /api/users/profile` - Get profile (protected)
  - `GET /api/users` - Get all users (admin only)

- **Product Routes** (`routes/productRoutes.js`)
  - `GET /api/products` - Get all products
  - `GET /api/products/:id` - Get product by ID
  - `POST /api/products` - Create product (admin only)

### ✅ Utility Scripts
- **createAdmin.js** - Creates default admin user
- **seedProducts.js** - Seeds sample perfume products

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/perfumeshop?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
```

## Available Scripts

```bash
# Start the server
npm start

# Run in development mode
npm run dev

# Create admin user
npm run createAdmin

# Seed sample products
npm run seedProducts
```

## Default Admin Credentials

After running `npm run createAdmin`:
- **Email**: admin@perfumeshop.com
- **Password**: admin123

⚠️ **Important**: Change the password after first login!

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/users/login` - Login
  ```json
  {
    "email": "admin@perfumeshop.com",
    "password": "admin123"
  }
  ```

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (requires admin token)

### Users
- `GET /api/users/profile` - Get user profile (requires token)
- `GET /api/users` - Get all users (requires admin token)

## Troubleshooting

### MongoDB Connection Issues

If you see `ECONNREFUSED` errors:

1. **Check Internet Connection**: Ensure you have an active internet connection

2. **Verify MongoDB Atlas Cluster**:
   - Login to MongoDB Atlas
   - Check if the cluster is running
   - Verify the cluster URL matches the one in `.env`

3. **Check Network Access**:
   - In MongoDB Atlas, go to Network Access
   - Add your current IP address or use `0.0.0.0/0` for testing

4. **Verify Database User**:
   - In MongoDB Atlas, check Database Access
   - Ensure the username and password are correct
   - User should have read/write permissions

5. **Update Connection String**:
   - Make sure the MONGO_URI includes the database name
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

### Testing the API

Once the server is running, you can test endpoints using:

**Using curl:**
```bash
# Test server
curl http://localhost:5000

# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@perfumeshop.com","password":"admin123"}'

# Get products
curl http://localhost:5000/api/products
```

**Using Postman or Thunder Client:**
1. Import the endpoints
2. Test each route
3. For protected routes, add Authorization header: `Bearer <token>`

## Project Structure

```
backend/
├── controllers/
│   ├── userController.js
│   └── productController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   └── Product.js
├── routes/
│   ├── userRoutes.js
│   └── productRoutes.js
├── .env
├── server.js
├── createAdmin.js
├── seedProducts.js
└── package.json
```

## Next Steps

1. **Fix MongoDB Connection**: Ensure MongoDB Atlas is accessible
2. **Run Admin Script**: `npm run createAdmin`
3. **Seed Products**: `npm run seedProducts`
4. **Start Server**: `npm start`
5. **Test API**: Use curl, Postman, or Thunder Client
6. **Connect Frontend**: Update frontend API calls to use `http://localhost:5000`

## Technologies Used

- **Express.js** - Web framework
- **MongoDB & Mongoose** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
"# perfumeshop-backend" 
