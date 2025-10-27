// Simple Node.js API Server for Sia Creations
// This is a basic Express server with MongoDB integration
// Updated: 2025-10-27 - Fixed Order model validation (orderId auto-generation)

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import Routes at the top
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import carouselRoutes from './routes/carousel.js';
import statsRoutes from './routes/stats.js';
import uploadRoutes from './routes/upload.js';

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
const MONGODB_URI = process.env.MONGODB_URI;

// Global connection promise for serverless
let cachedConnection = null;

async function connectToDatabase() {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    if (!MONGODB_URI) {
        console.error('MONGODB_URI is not defined in environment variables');
        throw new Error('MONGODB_URI not configured');
    }

    try {
        cachedConnection = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 1,
        });
        console.log('Connected to MongoDB');
        return cachedConnection;
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        throw err;
    }
}

// Connect on startup
connectToDatabase().catch(console.error);

// API Routes
app.use('/api/products', productRoutes);      // Product endpoints
app.use('/api/categories', categoryRoutes);    // Category endpoints
app.use('/api/orders', orderRoutes);           // Order endpoints
app.use('/api/carousel', carouselRoutes);      // Carousel/banner endpoints
app.use('/api/stats', statsRoutes);            // Statistics/dashboard endpoints
app.use('/api/upload', uploadRoutes);          // Image upload endpoints

// Root endpoint - API health check
app.get('/', (req, res) => {
    const mongoStatus = mongoose.connection.readyState;
    const statusMap = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    
    res.json({
        message: 'Welcome to Sia Creations API',
        status: 'running',
        version: '1.0.0',
        mongodb: {
            status: statusMap[mongoStatus],
            readyState: mongoStatus,
            uri_configured: !!process.env.MONGODB_URI,
            database: mongoose.connection.db ? mongoose.connection.db.databaseName : 'not connected'
        },
        environment: process.env.NODE_ENV || 'development'
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
    console.error('Error:', err.message);
    
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export for Vercel serverless
export default app;
