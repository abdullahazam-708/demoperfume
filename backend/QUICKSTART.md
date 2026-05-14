# Quick Start Guide - Perfume Shop Backend

## 🚨 Fix MongoDB Connection First

The backend is implemented but MongoDB Atlas connection is failing. Here's how to fix it:

### Method 1: Fix MongoDB Atlas Access (Recommended)

1. **Login to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Go to Network Access**:
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for testing
   - Click "Confirm"

3. **Verify Database User**:
   - Click "Database Access"
   - Ensure user `abdullahazam` exists with password `abtech708`
   - User should have "Atlas admin" or "Read and write to any database" role

4. **Check Cluster Status**:
   - Click "Database" (or "Clusters")
   - Ensure cluster0 is running (not paused)
   - If paused, click "Resume"

### Method 2: Use Local MongoDB

If Atlas doesn't work, install MongoDB locally:

```bash
# Download and install MongoDB Community Edition
# Then update backend/.env:
MONGO_URI=mongodb://localhost:27017/perfumeshop
```

## 🎯 Once MongoDB is Connected

### Step 1: Create Admin User
```bash
cd backend
npm run createAdmin
```

Expected output:
```
MongoDB Connected
Admin user created successfully!
Email: admin@perfumeshop.com
Password: admin123
```

### Step 2: Seed Sample Products
```bash
npm run seedProducts
```

Expected output:
```
MongoDB Connected
Existing products cleared
Sample products added successfully!
```

### Step 3: Start Backend Server
```bash
npm start
```

Expected output:
```
Server running on port 5000
MongoDB Connected
```

### Step 4: Test API (Optional)

Open a new terminal and test:

```bash
# Test server is running
curl http://localhost:5000

# Test login
curl -X POST http://localhost:5000/api/users/login -H "Content-Type: application/json" -d "{\"email\":\"admin@perfumeshop.com\",\"password\":\"admin123\"}"

# Test get products
curl http://localhost:5000/api/products
```

### Step 5: Start Frontend

In a new terminal:
```bash
cd d:\New folder (10)\frontend
npm start
```

## 📱 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Login**: admin@perfumeshop.com / admin123

## 🔧 Troubleshooting

### "ECONNREFUSED" Error
- Check internet connection
- Verify MongoDB Atlas IP whitelist
- Try Method 2 (local MongoDB)

### "User already exists" when creating admin
- Admin already created, skip to Step 2
- Or delete the user from MongoDB and try again

### Port 5000 already in use
```bash
# Windows: Find and kill process
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Or change port in backend/.env
PORT=5001
```

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify `src/config/api.js` has correct URL

## 📚 Additional Resources

- Full documentation: `backend/README.md`
- Implementation details: `backend/IMPLEMENTATION_SUMMARY.md`
- API endpoints and examples in README.md

## 🎉 You're All Set!

Once MongoDB is connected and you've completed the steps above, your full-stack Perfume Shop application will be running!
