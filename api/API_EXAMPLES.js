// ============================================
// QUICK API REFERENCE GUIDE
// Copy these examples to test your API
// ============================================

// BASE URL
const API_URL = 'http://localhost:3000/api';

// ============================================
// PRODUCTS API
// ============================================

// 1. Get all products
fetch(`${API_URL}/products`)
    .then(res => res.json())
    .then(data => console.log(data));

// 2. Get products by category
fetch(`${API_URL}/products?category=stitched`)
    .then(res => res.json())
    .then(data => console.log(data));

// 3. Get new arrivals
fetch(`${API_URL}/products?newArrival=true`)
    .then(res => res.json())
    .then(data => console.log(data));

// 4. Get trending products
fetch(`${API_URL}/products?trending=true`)
    .then(res => res.json())
    .then(data => console.log(data));

// 5. Create a new product
fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: "Elegant Silk Kurta",
        description: "Beautiful silk kurta with embroidery",
        category: "stitched",
        mrp: 2999,
        price: 2599,
        specialPrice: 1999,
        images: [
            "https://ik.imagekit.io/k3jsspai5/product1.jpg"
        ],
        tags: ["New", "Trending"],
        showOnHomepage: true,
        isNewArrival: true,
        isTrending: false
    })
})
.then(res => res.json())
.then(data => console.log(data));

// 6. Update a product (replace PRODUCT_ID with actual ID)
fetch(`${API_URL}/products/PRODUCT_ID`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        price: 2299,
        specialPrice: 1799
    })
})
.then(res => res.json())
.then(data => console.log(data));

// 7. Toggle product visibility
fetch(`${API_URL}/products/PRODUCT_ID/visibility`, {
    method: 'PATCH'
})
.then(res => res.json())
.then(data => console.log(data));

// 8. Delete a product
fetch(`${API_URL}/products/PRODUCT_ID`, {
    method: 'DELETE'
})
.then(res => res.json())
.then(data => console.log(data));

// ============================================
// CATEGORIES API
// ============================================

// 1. Get all categories
fetch(`${API_URL}/categories`)
    .then(res => res.json())
    .then(data => console.log(data));

// 2. Get categories shown on main page
fetch(`${API_URL}/categories?showOnMainPage=true`)
    .then(res => res.json())
    .then(data => console.log(data));

// 3. Create a new category
fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: "Summer Collection",
        description: "Light and breezy summer wear",
        showOnMainPage: true,
        displayOrder: 1
    })
})
.then(res => res.json())
.then(data => console.log(data));

// 4. Update a category
fetch(`${API_URL}/categories/CATEGORY_ID`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        description: "Updated description",
        showOnMainPage: false
    })
})
.then(res => res.json())
.then(data => console.log(data));

// ============================================
// ORDERS API
// ============================================

// 1. Get all orders
fetch(`${API_URL}/orders`)
    .then(res => res.json())
    .then(data => console.log(data));

// 2. Get orders by status
fetch(`${API_URL}/orders?status=pending`)
    .then(res => res.json())
    .then(data => console.log(data));

// 3. Get orders by date range
fetch(`${API_URL}/orders?startDate=2025-01-01&endDate=2025-12-31`)
    .then(res => res.json())
    .then(data => console.log(data));

// 4. Create a new order
fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        customer: {
            name: "Priya Sharma",
            email: "priya@example.com",
            phone: "+91 9876543210",
            address: "123 MG Road",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001"
        },
        items: [
            {
                productId: "PRODUCT_MONGODB_ID",
                productName: "Elegant Silk Kurta",
                quantity: 2,
                price: 2599
            }
        ],
        subtotal: 5198,
        deliveryCharge: 100,
        totalAmount: 5298,
        paymentMode: "COD",
        notes: "Please deliver between 10 AM to 5 PM"
    })
})
.then(res => res.json())
.then(data => console.log(data));

// 5. Update order status
fetch(`${API_URL}/orders/ORDER_ID/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        orderStatus: "shipped"
    })
})
.then(res => res.json())
.then(data => console.log(data));

// 6. Update payment status
fetch(`${API_URL}/orders/ORDER_ID/payment`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        paymentStatus: "Paid"
    })
})
.then(res => res.json())
.then(data => console.log(data));

// ============================================
// CAROUSEL API
// ============================================

// 1. Get all carousel slides
fetch(`${API_URL}/carousel`)
    .then(res => res.json())
    .then(data => console.log(data));

// 2. Get active slides only
fetch(`${API_URL}/carousel?active=true`)
    .then(res => res.json())
    .then(data => console.log(data));

// 3. Create a new carousel slide
fetch(`${API_URL}/carousel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        imageUrl: "https://ik.imagekit.io/k3jsspai5/banner1.jpg",
        buttonLink: "/category/new-arrivals",
        description: "Check out our latest collection",
        order: 1,
        isActive: true
    })
})
.then(res => res.json())
.then(data => console.log(data));

// 4. Toggle carousel slide active status
fetch(`${API_URL}/carousel/SLIDE_ID/toggle`, {
    method: 'PATCH'
})
.then(res => res.json())
.then(data => console.log(data));

// ============================================
// COMMON STATUS CODES
// ============================================
// 200 - Success (GET, PUT, PATCH)
// 201 - Created (POST)
// 400 - Bad Request (invalid data)
// 404 - Not Found (resource doesn't exist)
// 500 - Server Error

// ============================================
// VALID VALUES FOR ENUMS
// ============================================

// Product Categories:
// 'stitched', 'unstitched', 'gym', 'daily', 'casuals', 
// 'dresses', 'tops', 'bottom-wear', 'ethnic', 'western', 'accessories'

// Product Status:
// 'draft', 'published'

// Order Status:
// 'pending', 'shipped', 'delivered', 'cancelled'

// Payment Status:
// 'Pending', 'Paid', 'Failed'

// Payment Mode:
// 'COD', 'Online'
