// Global Variables
let currentSlideIndex = 0;
let cart = [];
window.wishlist = [];
let currentTab = 'home';
let currentProduct = null;
let detailQuantity = 1;

// Pagination settings
const ITEMS_PER_PAGE = 12;
let currentPage = 1;
let currentCategory = null;

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
        { id: 17, name: "Athletic Leggings Set", price: 1399, category: "gym", image: "🩱", description: "Premium athletic leggings set with matching top. Features moisture-wicking fabric and four-way stretch for ultimate comfort. Perfect for workouts, yoga, and active lifestyle." },
        { id: 18, name: "Yoga Pants", price: 999, category: "gym", image: "🧘‍♀️", description: "Flexible yoga pants with four-way stretch. Perfect for yoga, pilates, and meditation. Comfortable waistband and breathable fabric." },
        { id: 19, name: "Activewear Top", price: 799, category: "gym", image: "💪", description: "Versatile activewear top suitable for various workouts. Quick-dry technology and comfortable fit for all-day wear." },
        { id: 20, name: "Running Shorts", price: 699, category: "gym", image: "🏃‍♀️", description: "Lightweight running shorts with built-in compression. Perfect for jogging and cardio workouts. Features side pockets for essentials." },
        { id: 21, name: "Gym Track Suit", price: 1899, category: "gym", image: "🏃‍♀️", description: "Complete gym track suit for comprehensive workout sessions. Coordinated set with jacket and pants. Comfortable and stylish." },
        { id: 22, name: "Yoga Bra", price: 899, category: "gym", image: "🧘‍♀️", description: "Comfortable yoga bra with medium support. Perfect for yoga and low-impact exercises. Soft fabric with excellent stretch." },
        { id: 23, name: "Workout Leggings", price: 1199, category: "gym", image: "💪", description: "High-performance workout leggings with compression technology. Squat-proof fabric with moisture management. Perfect for all workouts." },
        { id: 24, name: "Sports Jacket", price: 1599, category: "gym", image: "🏃‍♀️", description: "Stylish sports jacket for outdoor activities. Wind-resistant fabric with breathable lining. Perfect for pre and post-workout wear." },
        { id: 101, name: "CrossFit Training Set", price: 1699, category: "gym", image: "🏋️‍♀️", description: "Durable training set for intense CrossFit sessions. Reinforced stitching and breathable material." },
        { id: 102, name: "Pilates Crop Top", price: 849, category: "gym", image: "🤸‍♀️", description: "Stylish crop top perfect for Pilates and barre classes. Supportive and comfortable design." },
        { id: 103, name: "Cycling Shorts", price: 949, category: "gym", image: "🚴‍♀️", description: "Padded cycling shorts for long rides. Moisture-wicking with anti-chafe technology." },
        { id: 104, name: "Dance Leotard", price: 1249, category: "gym", image: "💃", description: "Flexible leotard for dance and gymnastics. Four-way stretch with elegant cut." },
        { id: 105, name: "Boxing Shorts", price: 899, category: "gym", image: "🥊", description: "Lightweight boxing shorts with wide waistband. Perfect for training and competition." },
        { id: 106, name: "Swim Shorts", price: 799, category: "gym", image: "🏊‍♀️", description: "Quick-dry swim shorts for pool workouts. Chlorine-resistant fabric." },
        { id: 107, name: "Martial Arts Pants", price: 1099, category: "gym", image: "🥋", description: "Traditional martial arts pants with modern fabric technology. Durable and flexible." },
        { id: 108, name: "Tennis Skirt", price: 1399, category: "gym", image: "🎾", description: "Athletic tennis skirt with built-in shorts. Lightweight with ball pockets." },
        { id: 109, name: "Zumba Top", price: 749, category: "gym", image: "💃", description: "Colorful Zumba top with loose fit. Perfect for dance fitness classes." },
        { id: 110, name: "Compression Tights", price: 1499, category: "gym", image: "🏃‍♀️", description: "Medical-grade compression tights for recovery and performance. Graduated compression zones." },
        { id: 111, name: "Hiking Pants", price: 1799, category: "gym", image: "🥾", description: "Convertible hiking pants with zip-off legs. Water-resistant and quick-dry." },
        { id: 112, name: "Basketball Jersey", price: 999, category: "gym", image: "🏀", description: "Breathable basketball jersey with mesh panels. Moisture-wicking performance fabric." },
        { id: 113, name: "Golf Polo", price: 1299, category: "gym", image: "⛳", description: "Classic golf polo with UV protection. Stretchy fabric for full range of motion." },
        { id: 114, name: "Climbing Pants", price: 1899, category: "gym", image: "🧗‍♀️", description: "Reinforced climbing pants with gusseted crotch. Abrasion-resistant material." },
        { id: 115, name: "Skating Dress", price: 2199, category: "gym", image: "⛸️", description: "Elegant skating dress with built-in shorts. Stretchy and figure-hugging design." },
        { id: 116, name: "Ski Base Layer", price: 1599, category: "gym", image: "⛷️", description: "Thermal base layer for winter sports. Moisture-wicking with insulation." }
    ],
    daily: [
        { id: 25, name: "Comfortable Cotton Top", price: 599, category: "daily", image: "👕", description: "Soft cotton top perfect for everyday comfort. Breathable fabric with relaxed fit. Ideal for casual outings and home wear." },
        { id: 26, name: "Daily Wear Jeans", price: 1299, category: "daily", image: "👖", description: "Classic daily wear jeans with comfortable fit. Durable denim fabric that maintains shape. Perfect for everyday styling." },
        { id: 27, name: "Office Blouse", price: 899, category: "daily", image: "👔", description: "Professional office blouse with polished finish. Wrinkle-resistant fabric perfect for workdays. Classic design with modern touch." },
        { id: 28, name: "Casual Dress", price: 1199, category: "daily", image: "👗", description: "Versatile casual dress for everyday wear. Comfortable fabric with flattering silhouette. Perfect for lunch dates and casual meetings." },
        { id: 29, name: "Work Trousers", price: 1399, category: "daily", image: "👖", description: "Formal work trousers with tailored fit. Professional appearance with comfortable wear. Perfect for office and business meetings." },
        { id: 30, name: "Everyday Cardigan", price: 999, category: "daily", image: "🧥", description: "Cozy everyday cardigan for layering. Soft knit fabric with versatile styling options. Perfect for changing weather conditions." },
        { id: 31, name: "Simple Tunic", price: 799, category: "daily", image: "👕", description: "Simple and elegant tunic for daily wear. Comfortable fit with timeless design. Great for pairing with leggings or jeans." }
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
    // Core functionality for all pages
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (hamburger && navMenu) {
        setupMobileMenu();
    }

    // Initialize cart from localStorage if available
    loadCartFromStorage();
    loadWishlistFromStorage();
    
    // Initialize cart if cart elements exist
    if (document.getElementById('cart-items') && document.getElementById('cart-total')) {
        updateCartDisplay();
    }
    
    // Home page specific functionality
    const carousel = document.querySelector('.hero-carousel');
    if (carousel) {
        setupCarousel();
        setInterval(nextSlide, 5000);
        loadHomeProducts();
    }
    
    // Setup navigation if present
    setupNavigation();
    setupFooterNavigation();
    
    // Setup cart and checkout if present
    setupCartEventListeners();
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        setupCheckoutForm();
    }
    
    // Initialize cart sidebar
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (cartSidebar) {
        updateCartDisplay();
    }
    
    // Initialize wishlist sidebar
    const wishlistSidebar = document.querySelector('.wishlist-sidebar');
    if (wishlistSidebar) {
        updateWishlistDisplay();
    }
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('siaCreationsCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartCount();
    updateCartDisplay();
}

function saveCartToStorage() {
    localStorage.setItem('siaCreationsCart', JSON.stringify(cart));
}

// Navigation Setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href') || '';
            const tab = this.getAttribute('data-tab');
            
            // Only prevent default and switch tabs for hash links or links with data-tab
            if (href.startsWith('#') || (tab && !href.endsWith('.html'))) {
                e.preventDefault();
                switchTab(tab);
            }
            // Otherwise, allow normal navigation to other pages
        });
    });
}

// Footer Navigation Setup
function setupFooterNavigation() {
    const footerLinks = document.querySelectorAll('.footer-link');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href') || '';
            const tab = this.getAttribute('data-tab');
            
            // Only prevent default and switch tabs for hash links
            if (href.startsWith('#')) {
                e.preventDefault();
                switchTab(tab);
            }
            // Otherwise, allow normal navigation to other pages
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
    const tabContent = document.getElementById(tabName);
    if (tabContent) {
        tabContent.classList.add('active');
    }
    
    // Reset to page 1 when switching categories
    currentPage = 1;
    
    // Load products for collection tabs
    if (['stitched', 'unstitched', 'gym', 'daily', 'casuals'].includes(tabName)) {
        loadProducts(tabName);
    }
    
    // Update wishlist display if needed
    if (tabName === 'wishlist') {
        updateWishlistDisplay();
    }
    
    currentTab = tabName;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mobile Menu Setup
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    // Remove any existing listeners by cloning hamburger only
    const newHamburger = hamburger.cloneNode(true);
    hamburger.parentNode.replaceChild(newHamburger, hamburger);
    
    // Toggle menu on hamburger click
    newHamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = newHamburger.classList.contains('active');
        
        if (isActive) {
            newHamburger.classList.remove('active');
            navMenu.classList.remove('active');
        } else {
            newHamburger.classList.add('active');
            navMenu.classList.add('active');
        }
    });
    
    // Handle nav link clicks - close menu after navigation
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            // Allow default navigation to happen
            // Just close the menu after a short delay
            setTimeout(function() {
                newHamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }, 150);
        }, false);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        const isClickInsideMenu = navMenu.contains(e.target);
        const isClickOnHamburger = newHamburger.contains(e.target);
        
        if (!isClickInsideMenu && !isClickOnHamburger && navMenu.classList.contains('active')) {
            newHamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }, false);
}

// Carousel Functions
function setupCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    // Initialize first slide
    updateCarousel();
    
    // Add touch/swipe support
    const carousel = document.querySelector('.hero-carousel');
    if (carousel) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50; // minimum distance for swipe
            
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swiped left, go to next slide
                nextSlide();
            }
            
            if (touchEndX > touchStartX + swipeThreshold) {
                // Swiped right, go to previous slide
                prevSlide();
            }
        }
    }
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
    if (!container) return; // Skip if container doesn't exist
    
    const products = productData[category].slice(0, 6); // Show first 6 products
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

function loadProducts(category) {
    const container = document.getElementById(`${category}-products`);
    if (!container) return; // Skip if container doesn't exist
    
    currentCategory = category;
    const products = productData[category];
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    
    // Calculate start and end indices for current page
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageProducts = products.slice(startIndex, endIndex);
    
    // Render products for current page
    container.innerHTML = pageProducts.map(product => createProductCard(product)).join('');
    
    // Add pagination controls
    renderPagination(category, totalPages);
    
    // Scroll to top of products
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderPagination(category, totalPages) {
    // Find or create pagination container
    const productsGrid = document.getElementById(`${category}-products`);
    if (!productsGrid) return;
    
    let paginationContainer = productsGrid.parentElement.querySelector('.pagination-container');
    
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-container';
        productsGrid.parentElement.appendChild(paginationContainer);
    }
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            ‹ Prev
        </button>
    `;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page
    if (startPage > 1) {
        paginationHTML += `
            <button class="pagination-btn" onclick="changePage(1)">1</button>
        `;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-info">...</span>`;
        }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    
    // Last page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-info">...</span>`;
        }
        paginationHTML += `
            <button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>
        `;
    }
    
    // Next button
    paginationHTML += `
        <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Next ›
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    const totalPages = Math.ceil(productData[currentCategory].length / ITEMS_PER_PAGE);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    loadProducts(currentCategory);
}

function createProductCard(product) {
    const isInWishlist = wishlist.some(item => item.id === product.id);
    const heartIcon = isInWishlist ? '♥' : '♡';
    const heartClass = isInWishlist ? 'wishlist-heart-filled' : 'wishlist-heart-empty';
    
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image" onclick="showProductDetail(${product.id})">
                ${product.image}
                <button class="product-share-btn" onclick="event.stopPropagation(); shareProduct(${product.id})" title="Share">
                    <span class="material-symbols-outlined">ios_share</span>
                </button>
                <div class="product-wishlist-heart ${heartClass}" onclick="event.stopPropagation(); toggleWishlist(${product.id})" title="Add to Wishlist">
                    ${heartIcon}
                </div>
            </div>
            <div class="product-info" onclick="showProductDetail(${product.id})">
                <div class="product-name">${product.name}</div>
                <div class="product-price">₹${product.price}</div>
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Share Product Function - Fixed to actually share, not just copy
function shareProduct(productId) {
    // Find product in all categories
    let product = null;
    for (const category in productData) {
        product = productData[category].find(p => p.id === productId);
        if (product) break;
    }
    
    if (!product) return;
    
    // Get the base URL (works on any page)
    const baseUrl = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
    const shareUrl = `${baseUrl}item-view.html?id=${productId}`;
    const shareTitle = `${product.name} - Sia Creations`;
    const shareText = `Check out this amazing ${product.name}!\n\nPrice: ₹${product.price}\n\n${product.description ? product.description.substring(0, 120) + '...' : 'Shop now at Sia Creations!'}`;
    
    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl
        }).then(() => {
            showShareFeedback('Shared successfully! ✓', 'success');
        }).catch((error) => {
            // User cancelled or error occurred
            if (error.name !== 'AbortError') {
                console.log('Error sharing:', error);
                showShareFeedback('Could not share. Try again!', 'error');
            }
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        showShareDialog(shareUrl, shareTitle, product);
    }
}

function showShareDialog(url, title, product) {
    // Create a modal dialog with share options
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        animation: fadeIn 0.3s ease-out;
    `;
    
    const shareBox = document.createElement('div');
    shareBox.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    `;
    
    shareBox.innerHTML = `
        <h3 style="margin-bottom: 1rem; color: var(--text-dark); font-family: var(--font-serif);">Share ${product.name}</h3>
        <p style="color: var(--text-light); margin-bottom: 1.5rem; font-size: 0.9rem;">Choose how you'd like to share this product:</p>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <button onclick="shareViaWhatsApp('${url}', '${title.replace(/'/g, "\\'")}', '${product.price}')" style="padding: 0.75rem; background: #25D366; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; justify-content: center;">
                <span>📱</span> Share on WhatsApp
            </button>
            <button onclick="copyToClipboard('${url}')" style="padding: 0.75rem; background: var(--soft-gold); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; justify-content: center;">
                <span>📋</span> Copy Link
            </button>
            <button onclick="closeShareDialog()" style="padding: 0.75rem; background: var(--beige); color: var(--text-dark); border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                Cancel
            </button>
        </div>
    `;
    
    modal.appendChild(shareBox);
    document.body.appendChild(modal);
    
    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeShareDialog();
        }
    });
    
    // Store reference for closing
    window.currentShareModal = modal;
}

function shareViaWhatsApp(url, title, price) {
    const text = `Check out this amazing product: ${title}\nPrice: ₹${price}\n\n${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    closeShareDialog();
    showShareFeedback('Opening WhatsApp...', 'success');
}

function copyToClipboard(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            closeShareDialog();
            showShareFeedback('Link copied to clipboard! 📋', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(url);
        });
    } else {
        fallbackCopyToClipboard(url);
    }
}

function fallbackCopyToClipboard(url) {
    const tempInput = document.createElement('input');
    tempInput.value = url;
    tempInput.style.position = 'absolute';
    tempInput.style.left = '-9999px';
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    closeShareDialog();
    showShareFeedback('Link copied to clipboard! 📋', 'success');
}

function closeShareDialog() {
    if (window.currentShareModal) {
        window.currentShareModal.remove();
        window.currentShareModal = null;
    }
}

function showShareFeedback(message, type) {
    const feedback = document.createElement('div');
    const bgColor = type === 'success' ? 'var(--soft-gold)' : 
                   type === 'error' ? '#e74c3c' : 
                   'var(--blush-pink)';
    
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10002;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        font-weight: 600;
    `;
    feedback.textContent = message;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(feedback)) {
                document.body.removeChild(feedback);
            }
        }, 300);
    }, 2500);
}

// Product Detail Functions
function showProductDetail(productId) {
    // Redirect to item-view.html with the product ID
    window.location.href = `item-view.html?id=${productId}`;
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
        
        // Skip if elements don't exist
        if (!cartSidebar || !cartIcon) return;
        
        if (cartSidebar.classList.contains('open') && 
            !cartSidebar.contains(e.target) && 
            !cartIcon.contains(e.target)) {
            toggleCart();
        }
    });
}

function toggleCart() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (!cartSidebar) return;
    
    // Close wishlist if open
    const wishlist = document.querySelector('.wishlist-sidebar');
    if (wishlist && (wishlist.classList.contains('active') || wishlist.classList.contains('open'))) {
        wishlist.classList.remove('active', 'open');
    }
    
    // Toggle cart - use both classes for compatibility
    cartSidebar.classList.toggle('active');
    cartSidebar.classList.toggle('open');
    if (cartSidebar.classList.contains('active')) {
        updateCartDisplay();
    }
}

function toggleWishlistSidebar() {
    const wishlist = document.querySelector('.wishlist-sidebar');
    if (!wishlist) return;
    
    // Close cart if open
    const cart = document.querySelector('.cart-sidebar');
    if (cart && (cart.classList.contains('active') || cart.classList.contains('open'))) {
        cart.classList.remove('active', 'open');
    }
    
    // Toggle wishlist - use both classes for compatibility
    wishlist.classList.toggle('active');
    wishlist.classList.toggle('open');
    if (wishlist.classList.contains('active')) {
        updateWishlistDisplay();
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
    
    saveCartToStorage();
    updateCartCount();
    updateCartDisplay();
    showAddToCartFeedback();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
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
            saveCartToStorage();
            updateCartDisplay();
            updateCartCount();
        }
    }
}

function updateCartCount() {
    updateAllCartCounts();
}

function updateAllCartCounts() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update header cart count
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    // Update bottom bar cart count
    const bottomCartCount = document.getElementById('bottom-cart-count');
    if (bottomCartCount) {
        bottomCartCount.textContent = totalItems;
        bottomCartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function updateWishlistCount() {
    const countElement = document.getElementById('wishlist-count');
    if (countElement) {
        countElement.textContent = wishlist.length;
    }
}

function updateProductCardHearts() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productId = parseInt(card.getAttribute('data-id'));
        const heartElement = card.querySelector('.product-wishlist-heart');
        
        if (heartElement) {
            const isInWishlist = wishlist.some(item => item.id === productId);
            heartElement.textContent = isInWishlist ? '♥' : '♡';
            heartElement.className = isInWishlist ? 'product-wishlist-heart wishlist-heart-filled' : 'product-wishlist-heart wishlist-heart-empty';
        }
    });
}

function updateWishlistDisplay() {
    // Update main wishlist page if it exists
    const wishlistItemsContainer = document.getElementById('wishlist-items');
    const wishlistEmptyContainer = document.getElementById('wishlist-empty');
    
    if (wishlistItemsContainer && wishlistEmptyContainer) {
        if (wishlist.length === 0) {
            wishlistItemsContainer.style.display = 'none';
            wishlistEmptyContainer.style.display = 'block';
        } else {
            wishlistItemsContainer.style.display = 'grid';
            wishlistEmptyContainer.style.display = 'none';
            wishlistItemsContainer.innerHTML = wishlist.map(item => createWishlistCard(item)).join('');
        }
    }
    
    // Update wishlist sidebar
    const sidebarItemsContainer = document.getElementById('wishlist-sidebar-items');
    if (sidebarItemsContainer) {
        if (wishlist.length === 0) {
            sidebarItemsContainer.innerHTML = '<div class="wishlist-empty-message">Your wishlist is empty</div>';
        } else {
            sidebarItemsContainer.innerHTML = wishlist.map(item => `
                <div class="wishlist-item">
                    <div class="wishlist-item-image" onclick="showProductDetail(${item.id})">
                        ${item.image}
                    </div>
                    <div class="wishlist-item-info">
                        <div class="wishlist-item-name">${item.name}</div>
                        <div class="wishlist-item-price">₹${item.price}</div>
                        <div class="wishlist-item-controls">
                            <button class="add-to-cart" onclick="addToCartFromWishlist(${item.id})">
                                Add to Cart
                            </button>
                            <button class="remove-btn" onclick="removeFromWishlist(${item.id})" title="Remove">
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
}

function createWishlistCard(product) {
    return `
        <div class="wishlist-item" data-id="${product.id}">
            <div class="wishlist-item-image" onclick="showProductDetail(${product.id})">
                ${product.image}
            </div>
            <div class="wishlist-item-info">
                <div class="wishlist-item-name">${product.name}</div>
                <div class="wishlist-item-price">₹${product.price}</div>
                <div class="wishlist-item-actions">
                    <button class="add-to-cart-from-wishlist" onclick="addToCartFromWishlist(${product.id})">
                        Add to Cart
                    </button>
                    <button class="remove-from-wishlist" onclick="removeFromWishlist(${product.id})" title="Remove from wishlist">
                        ✕
                    </button>
                </div>
            </div>
        </div>
    `;
}

function addToCartFromWishlist(productId) {
    addToCart(productId);
    
    // Remove from wishlist after adding to cart
    const index = wishlist.findIndex(item => item.id === productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        saveWishlistToStorage();
        updateWishlistCount();
        updateWishlistDisplay();
        updateProductCardHearts();
    }
    
    showWishlistFeedback('Item added to cart and removed from wishlist!', 'cart');
}

function removeFromWishlist(productId) {
    const index = wishlist.findIndex(item => item.id === productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        saveWishlistToStorage();
        updateWishlistCount();
        updateWishlistDisplay();
        updateProductCardHearts();
        showWishlistFeedback('Item removed from wishlist', 'removed');
    }
}

// Export functions for global access
window.cart = cart;
window.switchTab = switchTab;
window.toggleCart = toggleCart;
window.toggleWishlistSidebar = toggleWishlistSidebar;
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
window.toggleWishlist = toggleWishlist;
window.addToCartFromWishlist = addToCartFromWishlist;
window.removeFromWishlist = removeFromWishlist;
window.updateCartCount = updateCartCount;
window.updateCartDisplay = updateCartDisplay;
window.loadCartFromStorage = loadCartFromStorage;
window.saveCartToStorage = saveCartToStorage;
window.updateWishlistCount = updateWishlistCount;
window.updateAllWishlistCounts = updateAllWishlistCounts;
window.loadWishlistFromStorage = loadWishlistFromStorage;
window.saveWishlistToStorage = saveWishlistToStorage;
window.showWishlistFeedback = showWishlistFeedback;
window.updateWishlistDisplay = updateWishlistDisplay;
window.updateProductCardHearts = updateProductCardHearts;
window.showAddToCartFeedback = showAddToCartFeedback;
window.setupCheckoutForm = setupCheckoutForm;
window.updateCheckoutSummary = updateCheckoutSummary;
window.processOrder = processOrder;

// Export productData for global access
window.productData = productData;

// Export pagination functions
window.changePage = changePage;
window.ITEMS_PER_PAGE = ITEMS_PER_PAGE;

// Export share functions
window.shareViaWhatsApp = shareViaWhatsApp;
window.copyToClipboard = copyToClipboard;
window.closeShareDialog = closeShareDialog;

// Export share function
window.shareProduct = shareProduct;

function updateAllWishlistCounts() {
    // Update header wishlist count
    const wishlistCount = document.getElementById('wishlist-count');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
    
    // Update bottom bar wishlist count
    const bottomWishlistCount = document.getElementById('bottom-wishlist-count');
    if (bottomWishlistCount) {
        bottomWishlistCount.textContent = wishlist.length;
        bottomWishlistCount.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Guard clause: return if required elements don't exist
    if (!cartItemsContainer || !cartTotal) return;
    
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
    
    // Update all cart count displays
    updateAllCartCounts();
}

function showAddToCartFeedback() {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--soft-gold);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    `;
    feedback.textContent = 'Item added to cart!';
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(feedback)) {
                document.body.removeChild(feedback);
            }
        }, 300);
    }, 2000);
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showShareFeedback('Your cart is empty!', 'error');
        return;
    }
    
    window.location.href = 'checkout-page.html';
}

function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processOrder();
        });
    }
}

function updateCheckoutSummary() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (!checkoutItemsContainer || !checkoutTotal) return;
    
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
    const formData = new FormData(document.getElementById('checkout-form'));
    const customerData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address')
    };
    
    const confirmationPhone = document.getElementById('confirmation-phone');
    if (confirmationPhone) {
        confirmationPhone.textContent = customerData.phone;
    }
    
    cart = [];
    saveCartToStorage();
    updateCartCount();
    
    if (typeof switchTab === 'function') {
        switchTab('order-confirmation');
    }
    
    console.log('Order processed:', { customer: customerData, items: cart });
}

function loadWishlistFromStorage() {
    const savedWishlist = localStorage.getItem('siaCreationsWishlist');
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
    }
    updateWishlistCount();
    updateAllWishlistCounts();
}

function saveWishlistToStorage() {
    localStorage.setItem('siaCreationsWishlist', JSON.stringify(wishlist));
}

function showWishlistFeedback(message, type) {
    const feedback = document.createElement('div');
    const bgColor = type === 'added' ? 'var(--soft-gold)' : 
                   type === 'removed' ? '#e74c3c' : 
                   'var(--blush-pink)';
    
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 1002;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
    `;
    feedback.textContent = message;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(feedback)) {
                document.body.removeChild(feedback);
            }
        }, 300);
    }, 2000);
}

function toggleWishlist(productId) {
    let product = null;
    for (const category in productData) {
        product = productData[category].find(p => p.id === productId);
        if (product) break;
    }
    
    if (!product) return;
    
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showWishlistFeedback('Item removed from wishlist', 'removed');
    } else {
        wishlist.push(product);
        showWishlistFeedback('Item added to wishlist ♥', 'added');
    }
    
    saveWishlistToStorage();
    updateWishlistCount();
    updateAllWishlistCounts();
    updateWishlistDisplay();
    updateProductCardHearts();
    
    // Update similar products if function exists
    if (typeof updateSimilarProductHearts === 'function') {
        updateSimilarProductHearts();
    }
    
    // DO NOT open wishlist sidebar
}

// Export functions for global access
window.cart = cart;
window.switchTab = switchTab;
window.toggleCart = toggleCart;
window.toggleWishlistSidebar = toggleWishlistSidebar;
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
window.toggleWishlist = toggleWishlist;
window.addToCartFromWishlist = addToCartFromWishlist;
window.removeFromWishlist = removeFromWishlist;
window.updateCartCount = updateCartCount;
window.updateCartDisplay = updateCartDisplay;
window.loadCartFromStorage = loadCartFromStorage;
window.saveCartToStorage = saveCartToStorage;
window.updateWishlistCount = updateWishlistCount;
window.updateAllWishlistCounts = updateAllWishlistCounts;
window.loadWishlistFromStorage = loadWishlistFromStorage;
window.saveWishlistToStorage = saveWishlistToStorage;
window.showWishlistFeedback = showWishlistFeedback;
window.updateWishlistDisplay = updateWishlistDisplay;
window.updateProductCardHearts = updateProductCardHearts;
window.showAddToCartFeedback = showAddToCartFeedback;
window.setupCheckoutForm = setupCheckoutForm;
window.updateCheckoutSummary = updateCheckoutSummary;
window.processOrder = processOrder;

// Export productData for global access
window.productData = productData;

// Export pagination functions
window.changePage = changePage;
window.ITEMS_PER_PAGE = ITEMS_PER_PAGE;

// Export share functions
window.shareViaWhatsApp = shareViaWhatsApp;
window.copyToClipboard = copyToClipboard;
window.closeShareDialog = closeShareDialog;

// Export share function
window.shareProduct = shareProduct;