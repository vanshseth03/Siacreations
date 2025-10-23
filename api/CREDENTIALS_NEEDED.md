# 🔑 CREDENTIALS NEEDED FOR SIA CREATIONS API

## ✅ What You Already Have

### ImageKit URL
- **URL Endpoint**: `https://ik.imagekit.io/k3jsspai5/`
- Status: ✅ Already provided

### Email (Optional - for notifications)
- **Email**: vansh.seth03@gmail.com
- **Password**: 03july2005
- Status: ✅ Already provided
- **Note**: For SMTP, you'll need to create an "App Password" instead of using regular password

---

## ❌ What You Need to Get

### 1. MongoDB Database (Required) ⭐
**Where to get it**: https://cloud.mongodb.com/

**Steps**:
1. Sign up for free account
2. Create a new cluster (free M0 tier)
3. Create database user:
   - Username: `siacreations` (or any name you want)
   - Password: Create a strong password
4. Whitelist your IP address (or allow all IPs for development)
5. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Example: `mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/siacreations`

**Add to .env file as**:
```
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/siacreations?retryWrites=true&w=majority
```

---

### 2. ImageKit API Keys (Required for uploading images) ⭐
**Where to get it**: https://imagekit.io/dashboard

**Steps**:
1. Login to ImageKit dashboard
2. Go to "Developer Options" → "API Keys"
3. Copy both:
   - **Public Key** (looks like: `public_xxxxxxxxxxxx`)
   - **Private Key** (looks like: `private_xxxxxxxxxxxx`)

**Add to .env file as**:
```
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/k3jsspai5/
IMAGEKIT_PUBLIC_KEY=your_public_key_here
IMAGEKIT_PRIVATE_KEY=your_private_key_here
```

---

### 3. Gmail App Password (Optional - for email notifications)
**Where to get it**: https://myaccount.google.com/apppasswords

**Steps**:
1. Login to your Google Account (vansh.seth03@gmail.com)
2. Go to Security → 2-Step Verification (enable if not already)
3. Go to App Passwords
4. Create new app password for "Mail"
5. Copy the 16-character password

**Add to .env file as**:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=vansh.seth03@gmail.com
SMTP_PASS=your_16_char_app_password_here
```

**Note**: This is optional. Only needed if you want to send email notifications for orders.

---

## 📋 Complete .env File Template

Create a file named `.env` in the `api` folder with these values:

```env
# Server Configuration
PORT=3000

# MongoDB Database (REQUIRED)
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/siacreations?retryWrites=true&w=majority

# ImageKit Configuration (REQUIRED for image uploads)
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/k3jsspai5/
IMAGEKIT_PUBLIC_KEY=your_public_key_here
IMAGEKIT_PRIVATE_KEY=your_private_key_here

# Email Configuration (OPTIONAL - for order notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=vansh.seth03@gmail.com
SMTP_PASS=your_app_password_here
```

---

## 🎯 Priority Order

1. **MOST IMPORTANT**: MongoDB URI
   - Without this, the API won't start
   
2. **IMPORTANT**: ImageKit API Keys
   - Needed for uploading product images from admin panel
   
3. **OPTIONAL**: Email SMTP
   - Only if you want automated order confirmation emails

---

## 🚀 Quick Setup Checklist

- [ ] MongoDB account created at cloud.mongodb.com
- [ ] Database cluster created (free tier)
- [ ] Database user created with password
- [ ] IP address whitelisted (or allow all for dev)
- [ ] Connection string copied
- [ ] ImageKit dashboard accessed
- [ ] Public and Private keys copied
- [ ] `.env` file created in `api` folder
- [ ] All credentials added to `.env`
- [ ] Run `npm install` in api folder
- [ ] Run `npm start` to test

---

## ❓ Need Help?

If you get stuck:

1. **MongoDB Connection Issues**:
   - Make sure username and password are correct
   - Check if IP is whitelisted
   - Ensure password doesn't have special characters that need encoding

2. **ImageKit Issues**:
   - Login to imagekit.io with your account
   - Go to Settings → API Keys
   - Make sure you're copying the entire key

3. **Port Already in Use**:
   - Change PORT in .env to 3001 or 3002

---

## 📞 Support Links

- MongoDB Help: https://docs.mongodb.com/manual/tutorial/atlas-free-tier-setup/
- ImageKit Docs: https://docs.imagekit.io/api-reference/api-introduction
- Gmail App Password: https://support.google.com/accounts/answer/185833

---

**Last Updated**: Your setup date
**API Version**: 1.0.0
