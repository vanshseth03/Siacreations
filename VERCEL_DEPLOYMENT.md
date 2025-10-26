# Vercel Deployment Guide for Sia Creations

## 🚨 Current Issue

You're getting a **404 error** and **CORS error** because:
1. The Vercel deployment might not be configured properly
2. Environment variables are not set on Vercel
3. The API routes are not being recognized

## ✅ Solution: Deploy to Vercel with Proper Configuration

### Step 1: Verify Vercel Configuration

Your `vercel.json` is correctly configured. It should look like this:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "api/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 2: Set Environment Variables on Vercel

Go to your Vercel dashboard and add these environment variables:

**Required Variables:**

1. **MONGODB_URI**
   ```
   mongodb+srv://vansh.seth03@gmail.com:03july2005@cluster.mongodb.net/siacreations?retryWrites=true&w=majority
   ```

2. **IMAGEKIT_URL_ENDPOINT**
   ```
   https://ik.imagekit.io/k3jsspai5/
   ```

3. **IMAGEKIT_PUBLIC_KEY**
   ```
   public_Yz/hEeQml9qVBBnQQDifqw5KUnA=
   ```

4. **IMAGEKIT_PRIVATE_KEY**
   ```
   private_4zOFe2EipZBzXQY1e6zme2I9qe8=
   ```

5. **PORT** (optional, Vercel handles this)
   ```
   3000
   ```

### Step 3: Deploy to Vercel

**Option A: Using Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Click on your project (or create new)
3. Go to Settings → Environment Variables
4. Add all variables from Step 2
5. Go to Deployments → Redeploy

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Step 4: Verify Deployment

After deployment, test these endpoints:

1. **API Health Check:**
   ```
   https://siacreations.vercel.app/
   ```
   Should return: `{"message": "Welcome to Sia Creations API", "status": "running"}`

2. **Products Endpoint:**
   ```
   https://siacreations.vercel.app/api/products
   ```
   Should return: List of products

3. **Categories Endpoint:**
   ```
   https://siacreations.vercel.app/api/categories
   ```
   Should return: List of categories

### Step 5: Update Frontend (if needed)

Your frontend is already configured to use:
```javascript
const API_URL = 'https://siacreations.vercel.app/api';
```

## 🔧 Troubleshooting

### If you still get 404 errors:

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on latest deployment → View Function Logs
   - Look for errors

2. **Verify Routes:**
   - Make sure `vercel.json` is in the root directory
   - Make sure `api/server.js` exists

3. **Check MongoDB Connection:**
   - Verify MongoDB URI is correct
   - Check if MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
   - Go to MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere

### If you get CORS errors after fixing 404:

The CORS configuration in `server.js` is already correct. But if you still face issues:

1. **Add to server.js** (before routes):
   ```javascript
   app.use((req, res, next) => {
       res.header('Access-Control-Allow-Origin', '*');
       res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
       res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
       
       if (req.method === 'OPTIONS') {
           return res.sendStatus(200);
       }
       next();
   });
   ```

2. **Redeploy to Vercel**

## 📱 MongoDB Atlas Network Access

**IMPORTANT:** Make sure MongoDB allows Vercel connections:

1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Select your cluster
3. Click "Network Access" (left sidebar)
4. Click "Add IP Address"
5. Choose "Allow Access from Anywhere" (0.0.0.0/0)
6. Click "Confirm"

## 🎯 Quick Checklist

- [ ] `vercel.json` exists in root directory
- [ ] All environment variables added to Vercel dashboard
- [ ] MongoDB Atlas allows connections from anywhere
- [ ] API deployed successfully to Vercel
- [ ] Test endpoints return data (not 404)
- [ ] Frontend API_URL points to Vercel URL
- [ ] CORS headers are configured in server.js

## 🚀 Alternative: Use Local API for Now

If you want to continue development while fixing Vercel:

Change `script.js` line 3:
```javascript
// Temporarily use local API
const API_URL = 'http://localhost:3000/api';
```

Then run local API:
```bash
cd api
npm start
```

Make sure to disable ad blocker for localhost!

## 📞 Need Help?

Common issues:
1. **404 on all endpoints** → Environment variables not set on Vercel
2. **CORS errors** → MongoDB not allowing connections / CORS not configured
3. **500 errors** → MongoDB connection string incorrect
4. **No data returned** → Database is empty, run seed.js

---

After fixing these issues, your website will work perfectly with the production API! 🎉
