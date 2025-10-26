// Product Model - Defines the structure of product data in MongoDB

import mongoose from "mongoose";

// Define Product Schema
const productSchema = new mongoose.Schema({
    // Basic product information
    name: {
        type: String,
        required: true,
        trim: true
    },
    
    // Product description
    description: {
        type: String,
        required: true
    },
    
    // Category - reference to Category model
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    
    // Pricing details
    mrp: {
        type: Number,
        required: true
    },
    
    price: {
        type: Number,
        required: true
    },
    
    specialPrice: {
        type: Number,
        default: null
    },
    
    // Product images - array of image URLs (from ImageKit)
    images: [{
        type: String
    }],
    
    // Product tags (New, Hot, Trending, etc.)
    tags: [{
        type: String
    }],
    
    // Product variants
    colors: [{
        type: String,
        trim: true
    }],
    
    sizes: [{
        type: String,
        trim: true
    }],
    
    // Display settings
    isVisible: {
        type: Boolean,
        default: true
    },
    
    isNewArrival: {
        type: Boolean,
        default: false
    },
    
    // Stock management
    outOfStock: {
        type: Boolean,
        default: false
    },
    
    outOfStockVariants: [{
        type: String,
        trim: true
    }],
    
    // Draft or published
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published'
    }
    
}, {
    timestamps: true  // Automatically add createdAt and updatedAt fields
});

// Create indexes for faster queries
productSchema.index({ category: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ isVisible: 1 });

// Export the model
export default mongoose.model('Product', productSchema);
