# 🔧 HOW TO FIX MONGODB CONNECTION

## ⚠️ Current Issue
Your MongoDB connection string is incorrect. You need to create a MongoDB Atlas account and cluster first.

## ✅ Step-by-Step Fix

### Step 1: Create MongoDB Atlas Account
1. Go to: **https://cloud.mongodb.com/**
2. Click "Sign Up" or "Try Free"
3. Create account with Google or email

### Step 2: Create a Free Cluster
1. After login, click "Build a Database"
2. Choose **FREE** tier (M0)
3. Select cloud provider (AWS recommended)
4. Choose region closest to you
5. Click "Create"
6. Wait 3-5 minutes for cluster to be created

### Step 3: Create Database User
⚠️ **IMPORTANT**: This is NOT your email!

1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set:
   - **Username**: `siacreations` (or any name you want)
   - **Password**: Create a strong password (SAVE THIS!)
   - **Note**: Avoid special characters like @, :, / in password
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### Step 4: Whitelist Your IP Address
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - Or add your current IP
4. Click "Confirm"

### Step 5: Get Connection String
1. Click "Database" in left sidebar
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. Copy the connection string

It will look like:
```
mongodb+srv://siacreations:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Update .env File
1. Open `api/.env` file
2. Replace the MONGODB_URI line with your connection string
3. **IMPORTANT**: Replace `<password>` with your actual database user password
4. Add database name before the `?`:

```env
MONGODB_URI=mongodb+srv://siacreations:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/siacreations?retryWrites=true&w=majority
```

### Example:
If your username is `siacreations` and password is `MyPass123`:
```env
MONGODB_URI=mongodb+srv://siacreations:MyPass123@cluster0.ab12cd.mongodb.net/siacreations?retryWrites=true&w=majority
```

⚠️ **Common Mistakes:**
- ❌ Using email as username: `vansh.seth03@gmail.com:password`
- ❌ Forgetting to replace `<password>` with actual password
- ❌ Having special characters in password that need encoding
- ❌ Missing database name (the `/siacreations` part)
- ✅ Correct: `username:password@cluster.mongodb.net/databasename`

### Step 7: Restart Server
```powershell
# In the api folder
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
```

---

## 🚀 Quick Start (TL;DR)

1. Go to https://cloud.mongodb.com/
2. Create free account
3. Create free cluster (M0)
4. Create database user: `siacreations` / `your_password`
5. Whitelist IP (allow all for dev)
6. Get connection string
7. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://siacreations:your_password@cluster0.xxxxx.mongodb.net/siacreations?retryWrites=true&w=majority
   ```
8. Restart server: `npm start`

---

## 💡 For Now (Without MongoDB)

The server will still start and work partially without MongoDB, but:
- ❌ Cannot create/save products
- ❌ Cannot create/save orders
- ❌ Cannot save categories
- ✅ Server runs
- ✅ Routes respond
- ✅ Can test API structure

---

Need help? Check the official guide:
https://www.mongodb.com/docs/atlas/getting-started/
