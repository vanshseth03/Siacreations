// Seed Script - Populate database with sample data
// Run this after setting up MongoDB to add sample products

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Product = require('./models/Product');
const Category = require('./models/Category');
const Carousel = require('./models/Carousel');

// Sample data
const sampleProducts = [
    {
        name: "Elegant Silk Kurta Set",
        description: "Premium silk kurta set with elegant embroidery and comfortable fit. Perfect for festive occasions and special events.",
        category: "stitched",
        mrp: 2999,
        price: 2599,
        specialPrice: null,
        images: ["https://ik.imagekit.io/k3jsspai5/product1.jpg"],
        tags: ["New"],
        showOnHomepage: true,
        isNewArrival: true,
        isTrending: false,
        isVisible: true,
        status: "published"
    },
    {
        name: "Designer Palazzo Suit",
        description: "Contemporary palazzo suit with modern design elements. Features comfortable palazzo pants and stylish top.",
        category: "stitched",
        mrp: 3299,
        price: 3299,
        specialPrice: 2799,
        images: ["https://ik.imagekit.io/k3jsspai5/product2.jpg"],
        tags: ["Hot", "Trending"],
        showOnHomepage: true,
        isNewArrival: false,
        isTrending: true,
        isVisible: true,
        status: "published"
    },
    {
        name: "Premium Silk Fabric",
        description: "High-quality silk fabric with lustrous finish. Perfect for creating elegant ethnic wear.",
        category: "unstitched",
        mrp: 899,
        price: 899,
        specialPrice: null,
        images: ["https://ik.imagekit.io/k3jsspai5/fabric1.jpg"],
        tags: [],
        showOnHomepage: false,
        isNewArrival: false,
        isTrending: false,
        isVisible: true,
        status: "published"
    },
    {
        name: "Athletic Leggings Set",
        description: "Premium athletic leggings set with matching top. Features moisture-wicking fabric and four-way stretch.",
        category: "gym",
        mrp: 1399,
        price: 1399,
        specialPrice: 999,
        images: ["https://ik.imagekit.io/k3jsspai5/activewear1.jpg"],
        tags: ["New", "Sale"],
        showOnHomepage: true,
        isNewArrival: true,
        isTrending: true,
        isVisible: true,
        status: "published"
    },
    {
        name: "Comfortable Cotton Top",
        description: "Soft cotton top perfect for everyday comfort. Breathable fabric with relaxed fit.",
        category: "daily",
        mrp: 599,
        price: 599,
        specialPrice: null,
        images: ["https://ik.imagekit.io/k3jsspai5/daily1.jpg"],
        tags: [],
        showOnHomepage: false,
        isNewArrival: false,
        isTrending: false,
        isVisible: true,
        status: "published"
    }
];

const sampleCategories = [
    {
        name: "Stitched Wear",
        description: "Ready-to-wear stitched garments for all occasions",
        showOnMainPage: true,
        displayOrder: 1
    },
    {
        name: "Unstitched Fabrics",
        description: "Premium fabrics for custom tailoring",
        showOnMainPage: true,
        displayOrder: 2
    },
    {
        name: "Active Wear",
        description: "Comfortable gym and sports wear",
        showOnMainPage: true,
        displayOrder: 3
    },
    {
        name: "Daily Wear",
        description: "Everyday comfortable clothing",
        showOnMainPage: true,
        displayOrder: 4
    }
];

const sampleCarousel = [
    {
        imageUrl: "https://ik.imagekit.io/k3jsspai5/banner1.jpg",
        buttonLink: "/category/new-arrivals",
        description: "New Collection 2025",
        order: 1,
        isActive: true
    },
    {
        imageUrl: "https://ik.imagekit.io/k3jsspai5/banner2.jpg",
        buttonLink: "/category/sale",
        description: "Up to 50% Off",
        order: 2,
        isActive: true
    },
    {
        imageUrl: "https://ik.imagekit.io/k3jsspai5/banner3.jpg",
        buttonLink: "/category/ethnic",
        description: "Traditional Ethnic Wear",
        order: 3,
        isActive: true
    }
];

// Connect to MongoDB and seed data
async function seedDatabase() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Clear existing data (optional - comment out if you don't want to delete existing data)
        console.log('🗑️  Clearing existing data...');
        await Product.deleteMany({});
        await Category.deleteMany({});
        await Carousel.deleteMany({});
        console.log('✅ Existing data cleared');

        // Add products
        console.log('📦 Adding sample products...');
        const products = await Product.insertMany(sampleProducts);
        console.log(`✅ Added ${products.length} products`);

        // Add categories
        console.log('📁 Adding sample categories...');
        const categories = await Category.insertMany(sampleCategories);
        console.log(`✅ Added ${categories.length} categories`);

        // Add carousel slides
        console.log('🎠 Adding sample carousel slides...');
        const carousel = await Carousel.insertMany(sampleCarousel);
        console.log(`✅ Added ${carousel.length} carousel slides`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Products: ${products.length}`);
        console.log(`   Categories: ${categories.length}`);
        console.log(`   Carousel Slides: ${carousel.length}`);
        console.log('\n🚀 You can now start your server with: npm start');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('\n👋 Database connection closed');
        process.exit(0);
    }
}

// Run the seed function
console.log('🌱 Starting database seed...\n');
seedDatabase();
