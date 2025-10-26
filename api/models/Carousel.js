// Carousel Model - Defines homepage carousel/banner slides

import mongoose from "mongoose";

// Define Carousel Schema
const carouselSchema = new mongoose.Schema({
    // Carousel title
    title: {
        type: String,
        required: true,
        trim: true
    },
    
    // Slide image URL (from ImageKit)
    imageUrl: {
        type: String,
        required: true
    },
    
    // Slide description
    description: {
        type: String,
        default: '',
        trim: true
    },
    
    // Button title/text
    buttonTitle: {
        type: String,
        default: 'Shop Now',
        trim: true
    },
    
    // Button link URL
    buttonLink: {
        type: String,
        default: '',
        trim: true
    },
    
    // Display order
    order: {
        type: Number,
        required: true,
        default: 0
    },
    
    // Active status
    isActive: {
        type: Boolean,
        default: true
    }
    
}, {
    timestamps: true
});

// Sort by order by default
carouselSchema.index({ order: 1 });

// Export the model
export default mongoose.model('Carousel', carouselSchema);
