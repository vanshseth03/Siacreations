# Sia Creations API

A simple Node.js REST API for the Sia Creations e-commerce website with MongoDB database.

## 📋 Prerequisites

Before you start, make sure you have:
- Node.js installed (version 14 or higher)
- MongoDB account (we'll use MongoDB Atlas - free cloud database)
- ImageKit account for image storage

## 🚀 Setup Instructions

### Step 1: Install Dependencies

Open PowerShell in the `api` folder and run:
```powershell
npm install
```

### Step 2: Set Up MongoDB Database

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/) and sign up/login
2. Create a new cluster (free tier is fine)
3. Create a database user:
   - Click "Database Access" → "Add New Database User"
   - Username: `siacreations`
   - Password: Create a strong password (save it!)
4. Allow network access:
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
5. Get your connection string:
   - Click "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://siacreations:<password>@cluster.mongodb.net/`

### Step 3: Set Up ImageKit (Image Storage)

You already have the URL: `https://ik.imagekit.io/k3jsspai5/`

To get your API keys:
1. Login to [ImageKit Dashboard](https://imagekit.io/dashboard)
2. Go to "Developer Options" → "API Keys"
3. Copy:
   - **Public Key**
   - **Private Key**

### Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Open `.env` file and fill in your credentials:
   ```
   PORT=3000
   MONGODB_URI=mongodb+srv://siacreations:YOUR_PASSWORD@cluster.mongodb.net/siacreations?retryWrites=true&w=majority
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/k3jsspai5/
   IMAGEKIT_PUBLIC_KEY=your_actual_public_key
   IMAGEKIT_PRIVATE_KEY=your_actual_private_key
   ```

### Step 5: Start the Server

```powershell
npm start
```

Or for development with auto-restart:
```powershell
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
📱 API endpoints available at http://localhost:3000/api
```

## 📡 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products?category=stitched` - Filter by category
- `GET /api/products?newArrival=true` - Get new arrivals
- `GET /api/products?trending=true` - Get trending products
- `GET /api/products/:id` - Get single product
- `GET /api/products/search?q=keyword` - Search products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PATCH /api/products/:id/visibility` - Toggle visibility
- `POST /api/products/bulk-delete` - Delete multiple products
- `POST /api/products/bulk-update` - Update multiple products

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders/orderId/:orderId` - Get order by order ID
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status
- `PATCH /api/orders/:id/payment` - Update payment status
- `DELETE /api/orders/:id` - Delete order

### Carousel (Homepage Banners)
- `GET /api/carousel` - Get all carousel slides
- `GET /api/carousel?active=true` - Get active slides only
- `GET /api/carousel/:id` - Get single slide
- `POST /api/carousel` - Create new slide
- `PUT /api/carousel/:id` - Update slide
- `DELETE /api/carousel/:id` - Delete slide
- `PATCH /api/carousel/:id/toggle` - Toggle active status

### Statistics (Dashboard)
- `GET /api/stats/dashboard` - Get all dashboard stats
- `GET /api/stats/products` - Get product statistics
- `GET /api/stats/sales` - Get sales statistics

### Upload (ImageKit Integration)
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images
- `POST /api/upload/carousel` - Upload carousel image
- `DELETE /api/upload/:fileId` - Delete image from ImageKit
- `GET /api/upload/auth` - Get auth params for frontend upload

### Wishlist (Optional - can use localStorage)
- `GET /api/wishlist/:userId` - Get user's wishlist
- `POST /api/wishlist/:userId/add` - Add product to wishlist
- `DELETE /api/wishlist/:userId/remove/:productId` - Remove from wishlist
- `DELETE /api/wishlist/:userId/clear` - Clear wishlist

## 📝 Example API Requests

### Create a Product
```javascript
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "Elegant Silk Kurta",
  "description": "Beautiful silk kurta with embroidery",
  "category": "stitched",
  "mrp": 2999,
  "price": 2599,
  "specialPrice": 1999,
  "images": [
    "https://ik.imagekit.io/k3jsspai5/product1.jpg",
    "https://ik.imagekit.io/k3jsspai5/product1-2.jpg"
  ],
  "tags": ["New", "Trending"],
  "showOnHomepage": true,
  "isNewArrival": true,
  "isTrending": false
}
```

### Create an Order
```javascript
POST http://localhost:3000/api/orders
Content-Type: application/json

{
  "customer": {
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "phone": "+91 9876543210",
    "address": "123 MG Road",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "items": [
    {
      "productId": "product_mongodb_id_here",
      "productName": "Elegant Silk Kurta",
      "quantity": 2,
      "price": 2599
    }
  ],
  "subtotal": 5198,
  "deliveryCharge": 100,
  "totalAmount": 5298,
  "paymentMode": "COD"
}
```

## 🔑 Credentials Summary

You need to provide:

1. **MongoDB Credentials**
   - Create account at: https://cloud.mongodb.com/
   - Create a cluster and get connection string

2. **ImageKit Credentials**
   - You have URL: https://ik.imagekit.io/k3jsspai5/
   - Get Public Key from: https://imagekit.io/dashboard
   - Get Private Key from: https://imagekit.io/dashboard

3. **Optional Email (for order notifications)**
   - Gmail: vansh.seth03@gmail.com
   - Password: 03july2005 (use App Password for SMTP)
   - To create App Password: https://myaccount.google.com/apppasswords

## 🛠️ Testing the API

You can test the API using:
- **Browser** - for GET requests
- **Postman** - download from https://www.postman.com/
- **Thunder Client** - VS Code extension
- **cURL** in PowerShell

## 📂 Project Structure

```
api/
├── models/          # Database models (schemas)
│   ├── Product.js
│   ├── Category.js
│   ├── Order.js
│   └── Carousel.js
├── routes/          # API endpoints
│   ├── products.js
│   ├── categories.js
│   ├── orders.js
│   └── carousel.js
├── server.js        # Main server file
├── package.json     # Dependencies
├── .env             # Your credentials (DON'T commit this!)
└── .env.example     # Example environment file
```

## 🔒 Security Notes

- Never commit your `.env` file to GitHub
- The `.env` file contains your passwords and API keys
- Add `.env` to `.gitignore` file

## 🐛 Troubleshooting

**MongoDB connection error?**
- Check your connection string in `.env`
- Make sure you replaced `<password>` with actual password
- Check if IP is whitelisted in MongoDB Atlas

**Port already in use?**
- Change PORT in `.env` to 3001 or another number

**Module not found?**
- Run `npm install` again

## 📞 Need Help?

If you face any issues, check:
1. Is Node.js installed? Run: `node --version`
2. Are dependencies installed? Check if `node_modules` folder exists
3. Is `.env` file created with correct values?
4. Is MongoDB connection string correct?

---

Made for Sia Creations 🌸
