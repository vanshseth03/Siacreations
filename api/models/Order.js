// Order Model - Defines customer orders

import mongoose from "mongoose";

// Define Order Schema
const orderSchema = new mongoose.Schema({
    // Order ID (auto-generated)
    orderId: {
        type: String,
        required: false,  // Changed to false since it's auto-generated
        unique: true
    },
    
    // Customer information
    customer: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        }
    },
    
    // Order items - array of products with quantities
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        productName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    
    // Order totals
    subtotal: {
        type: Number,
        required: true
    },
    
    deliveryCharge: {
        type: Number,
        default: 0
    },
    
    totalAmount: {
        type: Number,
        required: true
    },
    
    // Payment details
    paymentMode: {
        type: String,
        enum: ['COD', 'Online'],
        required: true
    },
    
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    
    // Order status
    orderStatus: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    
    // Order notes (optional)
    notes: {
        type: String,
        default: ''
    }
    
}, {
    timestamps: true  // Adds createdAt and updatedAt
});

// Generate order ID before saving
orderSchema.pre('save', async function(next) {
    if (!this.orderId) {
        // Generate order ID: ORD-YYYYMMDD-XXXX
        const date = new Date();
        const dateStr = date.getFullYear() + 
                       String(date.getMonth() + 1).padStart(2, '0') + 
                       String(date.getDate()).padStart(2, '0');
        
        // Find last order of today
        const lastOrder = await mongoose.model('Order')
            .findOne({ orderId: new RegExp(`^ORD-${dateStr}`) })
            .sort({ orderId: -1 });
        
        let sequence = 1;
        if (lastOrder) {
            const lastSeq = parseInt(lastOrder.orderId.split('-')[2]);
            sequence = lastSeq + 1;
        }
        
        this.orderId = `ORD-${dateStr}-${String(sequence).padStart(4, '0')}`;
    }
    next();
});

// Export the model
export default mongoose.model('Order', orderSchema);
