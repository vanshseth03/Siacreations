# 🚀 How to Start Your E-Commerce Website

## ⚠️ IMPORTANT: The Error You're Seeing

The error `ERR_BLOCKED_BY_CLIENT` means:
1. **Your API server is not running** (most likely)
2. **OR** An ad blocker is blocking requests to `localhost:3000`

## ✅ Solution: Start the API Server

### Step 1: Open Terminal in VS Code
Press `` Ctrl + ` `` (backtick key) or go to **Terminal → New Terminal**

### Step 2: Navigate to API folder and start server
```powershell
cd api
npm start
```

You should see:
```
🚀 Server running on port 3000
✅ MongoDB connected successfully
📸 ImageKit URL: https://ik.imagekit.io/k3jsspai5/
```

### Step 3: Open Admin Panel
1. Right-click on `admin/admin.html`
2. Select **Open with Live Server**
3. OR just open `admin/admin.html` in your browser

### Step 4: Verify Connection
- You should see a success message in the admin panel
- Dashboard stats should load
- No more errors in console

---

## 🔧 If You Still See Errors

### Error: "API Server not running"
**Solution:** Make sure you ran `npm start` in the `api` folder

### Error: "EADDRINUSE" (Port already in use)
**Solution:** 
```powershell
# Kill the process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Error: Ad Blocker Blocking Requests
**Solution:** 
1. Disable ad blocker for `localhost`
2. OR add `localhost:3000` to allowed list
3. Common ad blockers: uBlock Origin, AdBlock Plus, Privacy Badger

### Error: MongoDB Connection Failed
**Solution:** Check your `.env` file in `api` folder:
```
MONGODB_URI=mongodb+srv://vanshseth03%40admin:vanshseth03@cluster0.4orhnft.mongodb.net/siacreations
```

---

## 📂 Project Structure

```
SiaCreations/
├── api/                    # Backend API (Node.js + Express)
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   └── package.json       # Dependencies
│
├── admin/                 # Admin Panel
│   ├── admin.html         # Admin page
│   ├── admin-script.js    # Admin JavaScript (connected to API)
│   └── admin-styles.css   # Admin styles
│
├── index.html             # Main website
├── script.js              # Website JavaScript
└── styles.css             # Website styles
```

---

## 🎯 Quick Test Checklist

- [ ] Run `cd api && npm start` in terminal
- [ ] See MongoDB connection success message
- [ ] See ImageKit connection success message
- [ ] Open admin panel in browser
- [ ] No errors in browser console
- [ ] Dashboard loads with stats
- [ ] Can add products, categories, carousel slides

---

## 📞 Need Help?

### Check API Server Status
Visit: http://localhost:3000/api/products
- Should see: `{"success": true, "products": []}`
- If error: Server is not running

### Check Browser Console
Press `F12` → Console tab
- Look for red error messages
- Check if ad blocker is blocking requests

### Common Issues
1. **Port 3000 already in use**: Close other apps using port 3000
2. **MongoDB connection error**: Check your MongoDB credentials in `.env`
3. **ImageKit errors**: Verify ImageKit credentials in `.env`
4. **Ad blocker blocking**: Disable for localhost

---

## 🌟 Next Steps After Server is Running

1. ✅ Add categories from admin panel
2. ✅ Upload product images
3. ✅ Create products
4. ✅ Manage carousel slides
5. ✅ View orders

**Enjoy building your e-commerce store! 🎉**
