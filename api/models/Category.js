// Category Model - Defines product categories

import mongoose from "mongoose";

// Define Category Schema
const categorySchema = new mongoose.Schema({
    // Category name
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    
    // Category description
    description: {
        type: String,
        default: ''
    },
    
    // Show on main page
    showOnMainPage: {
        type: Boolean,
        default: true
    },
    
    // Order/priority for display
    displayOrder: {
        type: Number,
        default: 0
    }
    
}, {
    timestamps: true
});

// Export the model
export default mongoose.model('Category', categorySchema);
