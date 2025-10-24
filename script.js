// API Configuration
// Production API URL (routes directly to API, no /api prefix needed)
const API_URL = 'https://siacreations.vercel.app/api';
// For local development, use: 'http://localhost:3000/api'

console.log('🚀 Script loaded! API URL:', API_URL);

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

// Product Data - Will be loaded from API
let productData = {};
let allProducts = [];
let categories = [];
let carouselSlides = [];

// Make these globally accessible for category.html and other pages
window.productData = productData;
window.allProducts = allProducts;
window.categories = categories;
window.carouselSlides = carouselSlides;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('📄 DOM Content Loaded - Starting initialization...');
    // Load data from API first
    await loadDataFromAPI();
    console.log('📊 Data loaded, initializing app...');
    initializeApp();
    console.log('✅ App initialized!');
});

// Load all data from API
async function loadDataFromAPI() {
    try {
        // Load products
        const productsResponse = await fetch(`${API_URL}/products?visible=true`);
        if (productsResponse.ok) {
            const productsData = await productsResponse.json();
            if (productsData.success) {
                allProducts = productsData.products;
                window.allProducts = allProducts; // Update window reference
                
                console.log('📅 Product order from API (sorted by newest first):');
                allProducts.forEach((p, idx) => {
                    console.log(`  ${idx + 1}. "${p.name}" - Created: ${p.createdAt || 'N/A'}`);
                });
                
                // Group products by category (preserving newest-first order)
                productData = {};
                allProducts.forEach(product => {
                    const categoryName = product.category?.name || product.category || 'uncategorized';
                    console.log(`  📦 Product "${product.name}" → Category: "${categoryName}"`);
                    if (!productData[categoryName]) {
                        productData[categoryName] = [];
                    }
                    // Transform product to match expected format
                    productData[categoryName].push({
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        mrp: product.mrp,
                        category: categoryName,
                        image: product.images && product.images[0] ? product.images[0] : '🛍️',
                        description: product.description || '',
                        images: product.images || [],
                        tags: product.tags || [],
                        isNewArrival: product.isNewArrival,
                        createdAt: product.createdAt
                    });
                });
                window.productData = productData; // Update window reference
                
                console.log('✅ Products loaded:', allProducts.length);
                console.log('📦 Product categories:', Object.keys(productData));
                console.log('📊 Products per category:', Object.entries(productData).map(([cat, prods]) => `${cat}: ${prods.length}`));
                
                // Log product order within each category to verify newest-first
                Object.entries(productData).forEach(([catName, products]) => {
                    console.log(`\n📂 Category "${catName}" - Products order (newest first):`);
                    products.forEach((p, idx) => {
                        console.log(`  ${idx + 1}. "${p.name}" - Created: ${p.createdAt || 'N/A'}`);
                    });
                });
            }
        } else {
            console.error('❌ Failed to load products:', productsResponse.status);
        }

        // Load categories
        const categoriesResponse = await fetch(`${API_URL}/categories`);
        if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            if (categoriesData.success) {
                categories = categoriesData.categories;
                window.categories = categories; // Update window reference
                console.log('✅ Categories loaded:', categories.length);
                console.log('📁 Categories:', categories.map(c => `${c.name} (showOnMainPage: ${c.showOnMainPage})`));
            }
        } else {
            console.error('❌ Failed to load categories:', categoriesResponse.status);
        }

        // Load carousel slides
        const carouselResponse = await fetch(`${API_URL}/carousel?active=true`);
        if (carouselResponse.ok) {
            const carouselData = await carouselResponse.json();
            if (carouselData.success) {
                carouselSlides = carouselData.slides.sort((a, b) => a.order - b.order);
                console.log('✅ Carousel slides loaded:', carouselSlides.length);
            }
        } else {
            console.error('❌ Failed to load carousel:', carouselResponse.status);
        }
    } catch (error) {
        console.error('❌ Error loading data from API:', error);
        
        // Check if error is due to ad blocker or connection issues
        if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
            console.warn('⚠️ API request failed - This could be due to:');
            console.warn('   1. Network connectivity issues');
            console.warn('   2. API server is down or not responding');
            console.warn('   3. CORS configuration issues');
            if (API_URL.includes('localhost')) {
                console.warn('   4. Ad blocker blocking localhost requests (disable ad blocker for localhost)');
                console.warn('   5. Local API server not running (cd api && npm start)');
            }
            console.warn('');
            console.warn('💡 Please ensure:');
            console.warn('   - You have an active internet connection');
            console.warn('   - The API server is running and accessible');
            
            // Show development notice banner only for localhost
            const devNotice = document.getElementById('dev-notice');
            if (devNotice && API_URL.includes('localhost')) {
                devNotice.style.display = 'block';
            } else if (devNotice) {
                // Show production error message
                devNotice.innerHTML = `
                    <strong>⚠️ Connection Error:</strong> Unable to load data from server. Please check your internet connection. 
                    <button onclick="location.reload()" style="margin-left: 15px; background: white; color: #c92a2a; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer; font-weight: 600;">Retry</button>
                `;
                devNotice.style.display = 'block';
            }
        }
        
        // Initialize empty data structures
        console.log('⚠️ No data loaded - website requires API connection');
        productData = {};
        window.productData = productData;
        categories = [];
        window.categories = categories;
        allProducts = [];
        window.allProducts = allProducts;
    }
}

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
        loadCarouselFromAPI(); // Load carousel from API
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
    
    // Load products for collection tabs - check if it's a category
    const categoryNames = categories.map(cat => cat.name.toLowerCase().replace(/\s+/g, '-'));
    if (categoryNames.includes(tabName)) {
        // Find the actual category name from slug
        const category = categories.find(cat => cat.name.toLowerCase().replace(/\s+/g, '-') === tabName);
        if (category) {
            loadProducts(category.name);
        }
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

// Load carousel from API
function loadCarouselFromAPI() {
    if (carouselSlides.length === 0) return;
    
    const carouselContainer = document.querySelector('.carousel-slides');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!carouselContainer || !dotsContainer) return;
    
    // Clear existing slides
    carouselContainer.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    // Create slides from API data
    carouselSlides.forEach((slide, index) => {
        // Create slide
        const slideDiv = document.createElement('div');
        slideDiv.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
        slideDiv.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${slide.imageUrl}')`;
        slideDiv.innerHTML = `
            <div class="hero-content">
                <h1>${slide.title}</h1>
                <p>${slide.description}</p>
                <a href="${slide.buttonLink}" class="cta-button">${slide.buttonTitle}</a>
            </div>
        `;
        carouselContainer.appendChild(slideDiv);
        
        // Create dot
        const dot = document.createElement('span');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });
    
    currentSlideIndex = 0;
}

// Load new arrivals from API
function loadNewArrivals() {
    const showcase = document.getElementById('new-arrivals-showcase');
    if (!showcase) return;
    
    // Filter products with isNewArrival = true
    const newArrivals = allProducts.filter(product => product.isNewArrival === true).slice(0, 8); // Show max 8 products
    
    if (newArrivals.length === 0) {
        showcase.innerHTML = '<p style="text-align: center; padding: 2rem; color: #999;">No new arrivals at the moment. Check back soon!</p>';
        return;
    }
    
    const badges = ['NEW', 'HOT', 'TRENDING', 'POPULAR', 'FRESH', 'LATEST', 'EXCLUSIVE', 'FEATURED'];
    
    showcase.innerHTML = newArrivals.map((product, index) => {
        const categoryName = product.category?.name || product.category || 'shop';
        const productIndex = allProducts.findIndex(p => p._id === product.id || p.id === product.id);
        const image = product.images && product.images[0] ? product.images[0] : product.image || '🛍️';
        const badge = badges[index % badges.length];
        
        return `
            <div class="arrival-card" data-aos="fade-up" data-delay="${index * 100}">
                <div class="arrival-badge">${badge}</div>
                <div class="arrival-image">
                    ${image.startsWith('http') ? 
                        `<img src="${image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">` : 
                        `<div class="arrival-img-inner">${image}</div>`
                    }
                    <div class="arrival-glow"></div>
                </div>
                <div class="arrival-info">
                    <h3>${product.name}</h3>
                    <p class="arrival-desc">${product.description ? product.description.substring(0, 50) + '...' : 'Discover our latest collection'}</p>
                    <div class="arrival-price">₹${product.price}</div>
                    <button class="arrival-quick-view" onclick="viewProductById('${product.id}')">
                        <span>Quick View</span>
                        <span class="arrow">→</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Generate category tabs dynamically
function generateCategoryTabs() {
    const container = document.getElementById('category-tabs-container');
    if (!container) {
        console.warn('⚠️ Category tabs container not found');
        return;
    }
    
    console.log('🏗️ Generating category tabs for', categories.length, 'categories');
    
    // Generate tab sections for all categories
    const categoryTabsHTML = categories
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map(category => {
            const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
            const categoryId = category.name.toLowerCase();
            
            return `
                <section id="${categorySlug}" class="tab-content">
                    <div class="tab-header">
                        <h1>${category.name}</h1>
                        <p>${category.description || 'Explore our collection'}</p>
                    </div>
                    <div class="products-grid" id="${categorySlug}-products">
                        <!-- Products will be loaded here -->
                    </div>
                </section>
            `;
        }).join('');
    
    container.innerHTML = categoryTabsHTML;
    console.log('✅ Category tabs generated');
}

// Load categories from API and render them
function loadCategoriesFromAPI() {
    const categoryButtonsContainer = document.getElementById('category-buttons');
    if (!categoryButtonsContainer) {
        console.warn('⚠️ Category buttons container not found');
        return;
    }
    
    console.log('📂 Loading categories for main page...');
    
    // Filter categories that should show on main page and sort by display order
    const mainPageCategories = categories
        .filter(cat => cat.showOnMainPage)
        .sort((a, b) => a.displayOrder - b.displayOrder);
    
    console.log('📋 Categories to show on main page:', mainPageCategories.length);
    console.log('   Categories:', mainPageCategories.map(c => c.name));
    
    if (mainPageCategories.length === 0) {
        categoryButtonsContainer.innerHTML = '<p style="text-align: center; padding: 2rem; color: #999;">No categories available</p>';
        console.warn('⚠️ No categories have showOnMainPage enabled');
        return;
    }
    
    // Category icons mapping (you can customize these)
    const iconMap = {
        'stitched': '👗',
        'unstitched': '🧵',
        'gym': '🏃‍♀️',
        'daily': '👔',
        'casuals': '👕',
        'default': '🛍️'
    };
    
    categoryButtonsContainer.innerHTML = mainPageCategories.map(category => {
        const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
        const icon = iconMap[category.name.toLowerCase()] || iconMap['default'];
        
        return `
            <a class="category-btn" href="category.html#${categorySlug}">
                <span class="category-icon">${icon}</span>
                <span class="category-name">${category.name}</span>
                <span class="category-desc">${category.description || 'Explore collection'}</span>
            </a>
        `;
    }).join('');
    
    console.log('✅ Category buttons rendered');
}

// Load product sections dynamically based on categories
function loadProductSectionsFromAPI() {
    const productSectionsContainer = document.getElementById('product-sections');
    if (!productSectionsContainer) {
        console.warn('⚠️ Product sections container not found');
        return;
    }
    
    console.log('📦 Loading product sections...');
    
    // Filter categories that should show on main page and have products
    const mainPageCategories = categories
        .filter(cat => {
            const hasProducts = productData[cat.name] && productData[cat.name].length > 0;
            console.log(`  - ${cat.name}: showOnMainPage=${cat.showOnMainPage}, hasProducts=${hasProducts}`);
            return cat.showOnMainPage && hasProducts;
        })
        .sort((a, b) => a.displayOrder - b.displayOrder);
    
    console.log('📋 Product sections to show:', mainPageCategories.length);
    
    if (mainPageCategories.length === 0) {
        productSectionsContainer.innerHTML = '<p style="text-align: center; padding: 3rem; color: #999;">No products available yet</p>';
        console.warn('⚠️ No categories with products to show on main page');
        return;
    }
    
    // Generate sections HTML
    const sectionsHTML = mainPageCategories.map(category => {
        const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
        const previewId = `${categorySlug}-preview`;
        
        return `
            <div class="section-header">
                <h2>${category.name}</h2>
                <a class="view-all-btn" href="category.html#${categorySlug}">View All</a>
            </div>
            <div class="product-scroll" id="${previewId}">
                <!-- Products will be loaded here -->
            </div>
        `;
    }).join('');
    
    productSectionsContainer.innerHTML = sectionsHTML;
    
    // Now load products for each section
    mainPageCategories.forEach(category => {
        const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
        const previewId = `${categorySlug}-preview`;
        loadProductPreview(category.name, previewId);
    });
    
    console.log('✅ Product sections rendered');
}

// Load footer category links
function loadFooterCategories() {
    const footerLinksContainer = document.getElementById('footer-category-links');
    if (!footerLinksContainer) return;
    
    // Show all categories in footer, sorted by display order
    const footerCategories = categories
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .slice(0, 6); // Limit to 6 categories in footer
    
    if (footerCategories.length === 0) {
        footerLinksContainer.innerHTML = '<span style="color: #999;">No categories</span>';
        return;
    }
    
    const linksHTML = footerCategories.map((category, index) => {
        const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
        const divider = index < footerCategories.length - 1 ? '<span class="footer-divider">|</span>' : '';
        return `<a href="#${categorySlug}" class="footer-link" data-tab="${categorySlug}">${category.name}</a>${divider}`;
    }).join('');
    
    footerLinksContainer.innerHTML = linksHTML;
}

// Product Loading Functions
function loadHomeProducts() {
    generateCategoryTabs(); // Generate category tab sections
    loadCategoriesFromAPI(); // Load categories first
    loadProductSectionsFromAPI(); // Then load product sections
    loadNewArrivals(); // Load new arrivals from API
    loadFooterCategories(); // Load footer category links
}

function loadProductPreview(category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return; // Skip if container doesn't exist
    
    // Check if category exists and has products
    if (!productData[category] || productData[category].length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #999;">No products available in this category</p>';
        return;
    }
    
    const products = productData[category].slice(0, 6); // Show first 6 products
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

function loadProducts(categoryName) {
    // Convert category name to slug for container ID
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
    const container = document.getElementById(`${categorySlug}-products`);
    if (!container) return; // Skip if container doesn't exist
    
    currentCategory = categoryName;
    
    // Check if category exists and has products
    if (!productData[categoryName] || productData[categoryName].length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 3rem; color: #999; font-size: 1.2rem;">No products available in this category yet. Check back soon!</p>';
        return;
    }
    
    const products = productData[categoryName];
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    
    // Calculate start and end indices for current page
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageProducts = products.slice(startIndex, endIndex);
    
    // Render products for current page
    container.innerHTML = pageProducts.map(product => createProductCard(product)).join('');
    
    // Add pagination controls
    renderPagination(categoryName, totalPages);
    
    // Scroll to top of products
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderPagination(categoryName, totalPages) {
    // Convert category name to slug for container ID
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
    const productsGrid = document.getElementById(`${categorySlug}-products`);
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
                // Error sharing - silent fail
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

// View product by ID (for new arrivals and other sections)
function viewProductById(productId) {
    showProductDetail(productId);
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

async function processOrder() {
    const formData = new FormData(document.getElementById('checkout-form'));
    const customerData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        email: formData.get('email') || '',
        city: formData.get('city') || '',
        state: formData.get('state') || '',
        pincode: formData.get('pincode') || ''
    };
    
    // Prepare order data for API
    const orderData = {
        customer: {
            name: customerData.name,
            phone: customerData.phone,
            email: customerData.email,
            address: `${customerData.address}, ${customerData.city}, ${customerData.state} - ${customerData.pincode}`
        },
        items: cart.map(item => ({
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        paymentMode: formData.get('payment') || 'cod',
        orderStatus: 'pending',
        paymentStatus: 'pending'
    };
    
    // Submit order to API
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const data = await response.json();
        
        if (!data.success) {
            // Silently continue with local processing
        }
    } catch (error) {
        // Silently continue with local processing
    }
    
    // Update UI
    const confirmationPhone = document.getElementById('confirmation-phone');
    if (confirmationPhone) {
        confirmationPhone.textContent = customerData.phone;
    }
    
    // Clear cart
    cart = [];
    saveCartToStorage();
    updateCartCount();
    
    // Show confirmation
    if (typeof switchTab === 'function') {
        switchTab('order-confirmation');
    }
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