// Global Variables
let currentSlideIndex = 0;
let cart = [];
let currentTab = 'home';
let currentProduct = null;
let detailQuantity = 1;

// Sample Product Data (in a real app, this would come from an API)
const productData = {
    stitched: [
        { id: 1, name: "Elegant Silk Kurta Set", price: 2599, category: "stitched", image: "👗", description: "This premium silk kurta set features elegant embroidery and comfortable fit. Perfect for festive occasions and special events. Made with high-quality silk fabric that drapes beautifully." },
        { id: 2, name: "Designer Palazzo Suit", price: 3299, category: "stitched", image: "👘", description: "Contemporary palazzo suit with modern design elements. Features comfortable palazzo pants and stylish top. Ideal for office wear and casual outings." },
        { id: 3, name: "Embroidered Anarkali", price: 4199, category: "stitched", image: "👗", description: "Beautifully embroidered Anarkali dress with intricate detailing. Perfect for weddings and traditional celebrations. Features flowing silhouette and premium fabric." },
        { id: 4, name: "Cotton Salwar Kameez", price: 1899, category: "stitched", image: "👘", description: "Comfortable cotton salwar kameez for everyday wear. Breathable fabric with classic design. Perfect for daily activities and casual meetings." },
        { id: 5, name: "Party Wear Lehenga", price: 5999, category: "stitched", image: "👗", description: "Stunning party wear lehenga with rich embellishments. Perfect for special occasions and celebrations. Features flowing skirt with matching blouse." },
        { id: 6, name: "Casual Kurti Set", price: 1599, category: "stitched", image: "👘", description: "Comfortable casual kurti set for everyday styling. Soft fabric with contemporary cut. Great for work, shopping, and casual outings." },
        { id: 7, name: "Formal Blazer Set", price: 3899, category: "stitched", image: "👗", description: "Professional blazer set for formal occasions. Tailored fit with premium fabric. Perfect for business meetings and formal events." },
        { id: 8, name: "Traditional Saree", price: 2799, category: "stitched", image: "🥻", description: "Classic traditional saree with elegant draping. Features beautiful patterns and premium fabric quality. Perfect for cultural events and ceremonies." }
    ],
    unstitched: [
        { id: 9, name: "Premium Silk Fabric", price: 899, category: "unstitched", image: "🧵", description: "High-quality silk fabric with lustrous finish. Perfect for creating elegant ethnic wear. Soft texture with excellent draping quality." },
        { id: 10, name: "Cotton Lawn Material", price: 599, category: "unstitched", image: "🧵", description: "Lightweight cotton lawn fabric ideal for summer wear. Breathable and comfortable material perfect for casual dresses and tops." },
        { id: 11, name: "Chiffon Print Fabric", price: 799, category: "unstitched", image: "🧵", description: "Beautiful printed chiffon fabric with vibrant patterns. Perfect for creating flowing dresses and scarves. Lightweight and elegant." },
        { id: 12, name: "Georgette Fabric", price: 699, category: "unstitched", image: "🧵", description: "Classic georgette fabric with crisp texture. Ideal for formal and semi-formal wear. Holds pleats well and drapes beautifully." },
        { id: 13, name: "Embroidered Net", price: 1299, category: "unstitched", image: "🧵", description: "Intricate embroidered net fabric perfect for special occasions. Features delicate patterns and premium quality embroidery work." },
        { id: 14, name: "Banarasi Silk", price: 1599, category: "unstitched", image: "🧵", description: "Authentic Banarasi silk with traditional motifs. Premium quality fabric perfect for creating classic Indian wear. Rich texture and finish." },
        { id: 15, name: "Cotton Jacquard", price: 799, category: "unstitched", image: "🧵", description: "Textured cotton jacquard fabric with raised patterns. Perfect for creating structured garments. Durable and easy to maintain." },
        { id: 16, name: "Organza Fabric", price: 999, category: "unstitched", image: "🧵", description: "Crisp organza fabric with transparent finish. Perfect for creating structured designs and layered garments. Holds shape well." }
    ],
    gym: [
        { id: 17, name: "Sports Bra Set", price: 1299, category: "gym", image: "🏃‍♀️", description: "High-support sports bra set designed for intense workouts. Moisture-wicking fabric keeps you dry and comfortable during exercise." },
        { id: 18, name: "Yoga Pants", price: 999, category: "gym", image: "🧘‍♀️", description: "Flexible yoga pants with four-way stretch. Perfect for yoga, pilates, and meditation. Comfortable waistband and breathable fabric." },
        { id: 19, name: "Activewear Top", price: 799, category: "gym", image: "💪", description: "Versatile activewear top suitable for various workouts. Quick-dry technology and comfortable fit for all-day wear." },
        { id: 20, name: "Running Shorts", price: 699, category: "gym", image: "🏃‍♀️", description: "Lightweight running shorts with built-in compression. Perfect for jogging and cardio workouts. Features side pockets for essentials." },
        { id: 21, name: "Gym Track Suit", price: 1899, category: "gym", image: "🏃‍♀️", description: "Complete gym track suit for comprehensive workout sessions. Coordinated set with jacket and pants. Comfortable and stylish." },
        { id: 22, name: "Yoga Bra", price: 899, category: "gym", image: "🧘‍♀️", description: "Comfortable yoga bra with medium support. Perfect for yoga and low-impact exercises. Soft fabric with excellent stretch." },
        { id: 23, name: "Workout Leggings", price: 1199, category: "gym", image: "💪", description: "High-performance workout leggings with compression technology. Squat-proof fabric with moisture management. Perfect for all workouts." },
        { id: 24, name: "Sports Jacket", price: 1599, category: "gym", image: "🏃‍♀️", description: "Stylish sports jacket for outdoor activities. Wind-resistant fabric with breathable lining. Perfect for pre and post-workout wear." }
    ],
    daily: [
        { id: 25, name: "Comfortable Cotton Top", price: 599, category: "daily", image: "👕", description: "Soft cotton top perfect for everyday comfort. Breathable fabric with relaxed fit. Ideal for casual outings and home wear." },
        { id: 26, name: "Daily Wear Jeans", price: 1299, category: "daily", image: "👖", description: "Classic daily wear jeans with comfortable fit. Durable denim fabric that maintains shape. Perfect for everyday styling." },
        { id: 27, name: "Office Blouse", price: 899, category: "daily", image: "👔", description: "Professional office blouse with polished finish. Wrinkle-resistant fabric perfect for workdays. Classic design with modern touch." },
        { id: 28, name: "Casual Dress", price: 1199, category: "daily", image: "👗", description: "Versatile casual dress for everyday wear. Comfortable fabric with flattering silhouette. Perfect for lunch dates and casual meetings." },
        { id: 29, name: "Work Trousers", price: 1399, category: "daily", image: "👖", description: "Formal work trousers with tailored fit. Professional appearance with comfortable wear. Perfect for office and business meetings." },
        { id: 30, name: "Everyday Cardigan", price: 999, category: "daily", image: "🧥", description: "Cozy everyday cardigan for layering. Soft knit fabric with versatile styling options. Perfect for changing weather conditions." },
        { id: 31, name: "Simple Tunic", price: 799, category: "daily", image: "👕", description: "Simple and elegant tunic for daily wear. Comfortable fit with timeless design. Great for pairing with leggings or jeans." },
        { id: 32, name: "Basic Skirt", price: 699, category: "daily", image: "👗", description: "Essential basic skirt for everyday styling. Classic cut with comfortable waistband. Perfect foundation piece for any wardrobe." }
    ],
    casuals: [
        { id: 33, name: "Weekend T-Shirt", price: 499, category: "casuals", image: "👕", description: "Relaxed weekend t-shirt with soft cotton fabric. Perfect for leisure activities and casual hangouts. Comfortable and easy to style." },
        { id: 34, name: "Casual Shorts", price: 699, category: "casuals", image: "🩳", description: "Comfortable casual shorts for warm weather. Lightweight fabric with relaxed fit. Perfect for beach days and summer outings." },
        { id: 35, name: "Denim Jacket", price: 1599, category: "casuals", image: "🧥", description: "Classic denim jacket with timeless appeal. Durable fabric with vintage-inspired design. Perfect layering piece for any season." },
        { id: 36, name: "Casual Maxi Dress", price: 1299, category: "casuals", image: "👗", description: "Flowing casual maxi dress for effortless style. Comfortable fabric with relaxed silhouette. Perfect for weekend brunches and casual events." },
        { id: 37, name: "Summer Tank Top", price: 399, category: "casuals", image: "👕", description: "Lightweight summer tank top with breathable fabric. Perfect for hot weather and layering. Essential piece for casual summer styling." },
        { id: 38, name: "Casual Pants", price: 999, category: "casuals", image: "👖", description: "Comfortable casual pants for relaxed styling. Soft fabric with easy fit. Perfect for weekend activities and casual outings." },
        { id: 39, name: "Beach Cover-up", price: 899, category: "casuals", image: "👗", description: "Stylish beach cover-up for vacation wear. Lightweight and quick-dry fabric. Perfect for poolside and beach activities." },
        { id: 40, name: "Casual Hoodie", price: 1199, category: "casuals", image: "🧥", description: "Cozy casual hoodie for comfortable wear. Soft fleece interior with relaxed fit. Perfect for cool weather and lounging." }
    ]
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupNavigation();
    setupCarousel();
    loadHomeProducts();
    setupMobileMenu();
    setupCartEventListeners();
    setupCheckoutForm();
    
    // Auto-start carousel
    setInterval(nextSlide, 5000);
}

// Navigation Setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
        });
    });
}

// Tab Switching
function switchTab(tabName) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const targetNavLink = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetNavLink) {
        targetNavLink.classList.add('active');
    }
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    // Load products for collection tabs
    if (['stitched', 'unstitched', 'gym', 'daily', 'casuals'].includes(tabName)) {
        loadProducts(tabName);
    }
    
    currentTab = tabName;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mobile Menu Setup
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Carousel Functions
function setupCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    // Initialize first slide
    updateCarousel();
}

function nextSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    updateCarousel();
}

function prevSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    updateCarousel();
}

function currentSlide(n) {
    currentSlideIndex = n - 1;
    updateCarousel();
}

function updateCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentSlideIndex) {
            slide.classList.add('active');
        }
    });
    
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentSlideIndex) {
            dot.classList.add('active');
        }
    });
}

// Product Loading Functions
function loadHomeProducts() {
    loadProductPreview('unstitched', 'unstitched-preview');
    loadProductPreview('gym', 'gym-preview');
    loadProductPreview('stitched', 'stitched-preview');
    loadProductPreview('casuals', 'casuals-preview');
}

function loadProductPreview(category, containerId) {
    const container = document.getElementById(containerId);
    const products = productData[category].slice(0, 6); // Show first 6 products
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

function loadProducts(category) {
    const container = document.getElementById(`${category}-products`);
    const products = productData[category];
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}" onclick="showProductDetail(${product.id})">
            <div class="product-image">
                ${product.image}
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">₹${product.price}</div>
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Product Detail Functions
function showProductDetail(productId) {
    // Find product in all categories
    let product = null;
    for (const category in productData) {
        product = productData[category].find(p => p.id === productId);
        if (product) break;
    }
    
    if (!product) return;
    
    currentProduct = product;
    detailQuantity = 1;
    
    // Update product detail elements
    document.getElementById('product-image-large').innerHTML = product.image;
    document.getElementById('product-detail-name').textContent = product.name;
    document.getElementById('product-detail-price').textContent = `₹${product.price}`;
    document.getElementById('product-detail-desc').textContent = product.description || 'This is a premium quality garment crafted with attention to detail and finest materials. Perfect for modern women who appreciate style and comfort.';
    document.getElementById('detail-quantity').textContent = detailQuantity;
    
    // Switch to product detail tab
    switchTab('product-detail');
}

function updateDetailQuantity(change) {
    detailQuantity += change;
    if (detailQuantity < 1) detailQuantity = 1;
    document.getElementById('detail-quantity').textContent = detailQuantity;
}

function addDetailToCart() {
    if (!currentProduct) return;
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === currentProduct.id);
    
    if (existingItem) {
        existingItem.quantity += detailQuantity;
    } else {
        cart.push({
            ...currentProduct,
            quantity: detailQuantity
        });
    }
    
    updateCartCount();
    showAddToCartFeedback();
}

function backToCategory() {
    if (currentProduct && ['stitched', 'unstitched', 'gym', 'daily', 'casuals'].includes(currentProduct.category)) {
        switchTab(currentProduct.category);
    } else {
        switchTab('home');
    }
}

// Cart Functions
function setupCartEventListeners() {
    // Cart overlay close when clicking outside
    document.addEventListener('click', function(e) {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartIcon = document.querySelector('.cart-icon');
        
        if (cartSidebar.classList.contains('open') && 
            !cartSidebar.contains(e.target) && 
            !cartIcon.contains(e.target)) {
            toggleCart();
        }
    });
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('open');
    
    if (cartSidebar.classList.contains('open')) {
        updateCartDisplay();
    }
}

function addToCart(productId) {
    // Find product in all categories
    let product = null;
    for (const category in productData) {
        product = productData[category].find(p => p.id === productId);
        if (product) break;
    }
    
    if (!product) return;
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    showAddToCartFeedback();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    updateCartCount();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
            updateCartCount();
        }
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    const cartHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.image}</div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span style="margin: 0 0.5rem;">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
    
    cartItemsContainer.innerHTML = cartHTML;
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total;
}

function showAddToCartFeedback() {
    // Create temporary feedback
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--soft-gold);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 1002;
        animation: slideInRight 0.3s ease-out;
    `;
    feedback.textContent = 'Item added to cart!';
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 300);
    }, 2000);
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    toggleCart();
    switchTab('checkout');
    updateCheckoutSummary();
}

// Checkout Functions
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processOrder();
    });
}

function updateCheckoutSummary() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (cart.length === 0) {
        checkoutItemsContainer.innerHTML = '<p>No items in cart</p>';
        checkoutTotal.textContent = '0';
        return;
    }
    
    const itemsHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>₹${item.price * item.quantity}</span>
        </div>
    `).join('');
    
    checkoutItemsContainer.innerHTML = itemsHTML;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    checkoutTotal.textContent = total;
}

function processOrder() {
    // Get form data
    const formData = new FormData(document.getElementById('checkout-form'));
    const customerData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address')
    };
    
    // Update confirmation page with customer phone
    document.getElementById('confirmation-phone').textContent = customerData.phone;
    
    // Clear cart
    cart = [];
    updateCartCount();
    
    // Switch to confirmation page
    switchTab('order-confirmation');
    
    // Store order data (in a real app, this would be sent to a server)
    console.log('Order processed:', {
        customer: customerData,
        items: cart
    });
}

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(price);
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Add loading states for better UX
function showLoading(element) {
    element.innerHTML = '<div class="loading"></div>';
}

function hideLoading(element, content) {
    element.innerHTML = content;
}

// Performance optimization: Lazy load products
function observeProductCards() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    });
    
    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
}

// Initialize intersection observer after products load
setTimeout(observeProductCards, 1000);

// Export functions for global access
window.switchTab = switchTab;
window.toggleCart = toggleCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.proceedToCheckout = proceedToCheckout;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.currentSlide = currentSlide;
window.showProductDetail = showProductDetail;
window.updateDetailQuantity = updateDetailQuantity;
window.addDetailToCart = addDetailToCart;
window.backToCategory = backToCategory;