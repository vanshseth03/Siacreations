// Simple Node.js API Server for Sia Creations
// This is a basic Express server with MongoDB integration

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - CORS must be FIRST, before any routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(cors()); // Additional CORS middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// MongoDB Connection
// You need to add MONGODB_URI in .env file
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables!');
    console.log('📝 Please add MONGODB_URI to your Vercel environment variables.');
} else {
    console.log('📝 MongoDB URI found, attempting connection...');
    console.log('🔗 Connecting to:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Hide password in logs
    
    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
        socketTimeoutMS: 45000, // Socket timeout
    })
    .then(() => {
        console.log('✅ Connected to MongoDB successfully');
        console.log('📊 Database:', mongoose.connection.db.databaseName);
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('⚠️  Server will start but database features will not work.');
        console.log('📝 Please verify:');
        console.log('   1. MongoDB URI is correct in Vercel environment variables');
        console.log('   2. MongoDB Atlas Network Access allows 0.0.0.0/0');
        console.log('   3. Database user credentials are correct');
    });
}

// Import Routes
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import carouselRoutes from './routes/carousel.js';
import statsRoutes from './routes/stats.js';
import uploadRoutes from './routes/upload.js';

// API Routes
app.use('/api/products', productRoutes);      // Product endpoints
app.use('/api/categories', categoryRoutes);    // Category endpoints
app.use('/api/orders', orderRoutes);           // Order endpoints
app.use('/api/carousel', carouselRoutes);      // Carousel/banner endpoints
app.use('/api/stats', statsRoutes);            // Statistics/dashboard endpoints
app.use('/api/upload', uploadRoutes);          // Image upload endpoints

// Root endpoint - API health check
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Sia Creations API',
        status: 'running',
        version: '1.0.0'
    });
});

// 404 handler - catch undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 API endpoints available at /api`);
    
    // Test ImageKit connection
    testImageKitConnection();
});

// Test ImageKit Configuration
async function testImageKitConnection() {
    try {
        const ImageKit = (await import('imagekit')).default;
        // Check if credentials exist
        if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
            console.log('⚠️  ImageKit credentials not found in .env file');
            console.log('📝 Image upload features will not work without ImageKit setup');
            return;
        }
        
        // Try to initialize ImageKit
        const imagekit = new ImageKit({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
        });
        
        console.log('✅ ImageKit configured successfully');
        console.log(`📸 ImageKit URL: ${process.env.IMAGEKIT_URL_ENDPOINT}`);
        
    } catch (error) {
        console.error('❌ ImageKit configuration error:', error.message);
        console.log('📝 Please check IMAGEKIT credentials in .env file');
    }
}
