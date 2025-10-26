# 🚀 QUICK START GUIDE - Sia Creations API

## ⚡ Fast Setup (5 minutes)

### Step 1: Install Node Packages
Open PowerShell in the `api` folder:
```powershell
cd api
npm install
```

### Step 2: Get MongoDB Connection String
1. Go to https://cloud.mongodb.com/
2. Sign up/Login
3. Create a free cluster
4. Get connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/...`)

### Step 3: Get ImageKit Keys
1. Go to https://imagekit.io/dashboard
2. Navigate to Settings → API Keys
3. Copy Public Key and Private Key

### Step 4: Create .env File
Create a new file named `.env` in the `api` folder:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string_here
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/k3jsspai5/
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
```

### Step 5: Add Sample Data (Optional)
```powershell
npm run seed
```

### Step 6: Start the Server
```powershell
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
```

### Step 7: Test the API
Open browser and go to:
- http://localhost:3000/ (API health check)
- http://localhost:3000/api/products (Get all products)
- http://localhost:3000/api/categories (Get all categories)

---

## 📡 Most Used API Endpoints

### Products
```javascript
// Get all products
GET http://localhost:3000/api/products

// Get new arrivals
GET http://localhost:3000/api/products?newArrival=true

// Get by category
GET http://localhost:3000/api/products?category=stitched

// Create product (use in admin panel)
POST http://localhost:3000/api/products
```

### Orders
```javascript
// Get all orders
GET http://localhost:3000/api/orders

// Create order (from checkout)
POST http://localhost:3000/api/orders

// Update order status
PATCH http://localhost:3000/api/orders/:id/status
```

### Categories
```javascript
// Get all categories
GET http://localhost:3000/api/categories

// Create category
POST http://localhost:3000/api/categories
```

### Carousel
```javascript
// Get active slides
GET http://localhost:3000/api/carousel?active=true

// Create slide
POST http://localhost:3000/api/carousel
```

---

## 🔧 Common Commands

```powershell
# Install dependencies
npm install

# Start server (production)
npm start

# Start with auto-reload (development)
npm run dev

# Add sample data to database
npm run seed

# Check Node.js version
node --version

# Check if server is running
# Open browser: http://localhost:3000
```

---

## ❓ Troubleshooting

### Error: "Cannot find module"
**Solution**: Run `npm install`

### Error: "Port 3000 is already in use"
**Solution**: Change PORT in .env to 3001

### Error: "MongoDB connection failed"
**Solution**: 
- Check MONGODB_URI in .env
- Make sure password is correct
- Whitelist IP in MongoDB Atlas

### Error: "ENOENT: no such file or directory, open '.env'"
**Solution**: Create .env file in api folder

---

## 📂 File Structure
```
api/
├── models/              # Database schemas
├── routes/              # API endpoints
├── server.js            # Main server
├── seed.js              # Sample data
├── package.json         # Dependencies
├── .env                 # Your credentials (create this!)
└── README.md            # Full documentation
```

---

## 🎯 What Next?

After API is running:
1. Test endpoints in browser or Postman
2. Connect your frontend to API
3. Update admin panel to use these endpoints
4. Test creating products and orders
5. Deploy to production (Railway, Render, or Heroku)

---

## 📱 Connect Frontend to API

In your frontend JavaScript files (script.js, admin-script.js):

```javascript
// Replace this
const API_URL = 'http://localhost:3000/api';

// With your production URL later
const API_URL = 'https://your-api.com/api';
```

---

## 🔒 Security Notes

- ⚠️ Never commit .env file to GitHub
- ⚠️ Use environment variables for sensitive data
- ⚠️ Add authentication before production
- ⚠️ Whitelist only necessary IPs in MongoDB

---

## 📞 Need More Help?

Check these files:
- `README.md` - Detailed documentation
- `CREDENTIALS_NEEDED.md` - What credentials to get
- `API_EXAMPLES.js` - Copy-paste code examples
- `.env.example` - Environment variables template

---

**Ready to start? Run these commands:**
```powershell
cd api
npm install
npm run seed
npm start
```

Then open: http://localhost:3000

---

Made with ❤️ for Sia Creations 🌸
