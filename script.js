// API Configuration
// Production API URL (routes directly to API, no /api prefix needed)
const API_URL = 'https://siacreations.vercel.app/api';
// For local development, use: 'http://localhost:3000/api'

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
    // Load data from API first
    await loadDataFromAPI();
    initializeApp();
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
                
                // First, load categories to create a mapping
                const categoriesResponse = await fetch(`${API_URL}/categories`);
                let categoryMap = {};
                if (categoriesResponse.ok) {
                    const categoriesData = await categoriesResponse.json();
                    if (categoriesData.success) {
                        categories = categoriesData.categories;
                        window.categories = categories; // Update window reference
                        
                        // Create a map of category ID to category name
                        categories.forEach(cat => {
                            categoryMap[cat._id] = cat.name;
                        });
                    }
                }
                
                // Group products by category (preserving newest-first order)
                productData = {};
                allProducts.forEach(product => {
                    // Handle category - it could be populated object, string ID, or string name
                    let categoryName;
                    if (typeof product.category === 'object' && product.category !== null) {
                        // Category is populated with full object
                        categoryName = product.category.name;
                    } else if (typeof product.category === 'string') {
                        // Category is just an ID string - look it up in the map
                        categoryName = categoryMap[product.category] || product.category;
                    } else {
                        categoryName = 'uncategorized';
                    }
                    
                    if (!productData[categoryName]) {
                        productData[categoryName] = [];
                    }
                    
                    // Transform product to match expected format
                    productData[categoryName].push({
                        _id: product._id, // Keep MongoDB _id
                        id: product._id, // Also add as id for compatibility
                        name: product.name,
                        price: product.price,
                        mrp: product.mrp,
                        category: categoryName,
                        image: product.images && product.images[0] ? product.images[0] : '🛍️',
                        description: product.description || '',
                        images: product.images || [],
                        tags: product.tags || [],
                        colors: product.colors || [],
                        sizes: product.sizes || [],
                        outOfStock: product.outOfStock || false,
                        outOfStockVariants: product.outOfStockVariants || [],
                        isNewArrival: product.isNewArrival,
                        isVisible: product.isVisible,
                        createdAt: product.createdAt
                    });
                });
                
                window.productData = productData; // Update window reference
            }
        } else {
            // If products failed, still try to load categories
            const categoriesResponse = await fetch(`${API_URL}/categories`);
            if (categoriesResponse.ok) {
                const categoriesData = await categoriesResponse.json();
                if (categoriesData.success) {
                    categories = categoriesData.categories;
                    window.categories = categories; // Update window reference
                }
            }
        }

        // Load carousel slides
        const carouselResponse = await fetch(`${API_URL}/carousel?active=true`);
        if (carouselResponse.ok) {
            const carouselData = await carouselResponse.json();
            if (carouselData.success) {
                carouselSlides = carouselData.slides.sort((a, b) => a.order - b.order);
            }
        }
    } catch (error) {
        // Silently handle error
        
        // Initialize empty data structures
        productData = {};
        window.productData = productData;
        categories = [];
        window.categories = categories;
        allProducts = [];
        window.allProducts = allProducts;
    } finally {
        // Hide loading screen only after data is ready
        setTimeout(() => {
            const loader = document.getElementById('app-loader');
            const body = document.body;
            
            if (body) {
                body.classList.add('loaded');
            }
            
            if (loader) {
                setTimeout(() => {
                    loader.classList.add('hidden');
                }, 200);
            }
        }, 50);
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
    
    // Setup variant modal confirm button
    const confirmVariantBtn = document.getElementById('confirmVariantBtn');
    if (confirmVariantBtn) {
        confirmVariantBtn.addEventListener('click', confirmVariantSelection);
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
    const backdrop = document.getElementById('mobile-menu-backdrop');
    
    if (!hamburger || !navMenu) return;
    
    // Remove any existing listeners by cloning hamburger only
    const newHamburger = hamburger.cloneNode(true);
    hamburger.parentNode.replaceChild(newHamburger, hamburger);
    
    // Toggle menu function
    const toggleMenu = function(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        const isActive = newHamburger.classList.contains('active');
        
        if (isActive) {
            newHamburger.classList.remove('active');
            navMenu.classList.remove('active');
            if (backdrop) backdrop.classList.remove('active');
        } else {
            newHamburger.classList.add('active');
            navMenu.classList.add('active');
            if (backdrop) backdrop.classList.add('active');
        }
    };
    
    // Add click listener (works for both mouse and touch)
    newHamburger.addEventListener('click', toggleMenu, false);
    
    // Add touchend as backup for mobile devices
    newHamburger.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu(null);
    }, { passive: false });
    
    // Handle backdrop clicks
    if (backdrop) {
        backdrop.addEventListener('click', function() {
            newHamburger.classList.remove('active');
            navMenu.classList.remove('active');
            backdrop.classList.remove('active');
        }, false);
    }
    
    // Handle nav link clicks - close menu after navigation
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            // Allow default navigation to happen
            // Just close the menu after a short delay
            setTimeout(function() {
                newHamburger.classList.remove('active');
                navMenu.classList.remove('active');
                if (backdrop) backdrop.classList.remove('active');
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
            if (backdrop) backdrop.classList.remove('active');
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
    
    // Filter products with isNewArrival = true and not out of stock
    const newArrivals = allProducts
        .filter(product => product.isNewArrival === true && !product.outOfStock)
        .slice(0, 8); // Show max 8 products
    
    if (newArrivals.length === 0) {
        showcase.innerHTML = '<p style="text-align: center; padding: 2rem; color: #999;">No new arrivals at the moment. Check back soon!</p>';
        return;
    }
    
    const badges = ['NEW', 'HOT', 'TRENDING', 'POPULAR', 'FRESH', 'LATEST', 'EXCLUSIVE', 'FEATURED'];
    
    showcase.innerHTML = newArrivals.map((product, index) => {
        const categoryName = product.category?.name || product.category || 'shop';
        const productId = product._id || product.id; // Support both MongoDB _id and id
        const productIndex = allProducts.findIndex(p => p._id === productId || p.id === productId);
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
                    <button class="arrival-quick-view" onclick="viewProductById('${productId}')">
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
        return;
    }
    
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
}

// Load categories from API and render them
function loadCategoriesFromAPI() {
    const categoryButtonsContainer = document.getElementById('category-buttons');
    if (!categoryButtonsContainer) {
        return;
    }
    
    // Filter categories that should show on main page and sort by display order
    const mainPageCategories = categories
        .filter(cat => cat.showOnMainPage)
        .sort((a, b) => a.displayOrder - b.displayOrder);
    
    if (mainPageCategories.length === 0) {
        categoryButtonsContainer.innerHTML = '<p style="text-align: center; padding: 2rem; color: #999;">No categories available</p>';
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
}

// Load product sections dynamically based on categories
function loadProductSectionsFromAPI() {
    const productSectionsContainer = document.getElementById('product-sections');
    if (!productSectionsContainer) {
        return;
    }
    
    // Filter categories that should show on main page and have products
    const mainPageCategories = categories
        .filter(cat => {
            const hasProducts = productData[cat.name] && productData[cat.name].length > 0;
            return cat.showOnMainPage && hasProducts;
        })
        .sort((a, b) => a.displayOrder - b.displayOrder);
    
    if (mainPageCategories.length === 0) {
        productSectionsContainer.innerHTML = '<p style="text-align: center; padding: 3rem; color: #999;">No products available yet</p>';
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
    
    // Filter out out-of-stock products
    const availableProducts = productData[category].filter(product => !product.outOfStock);
    
    if (availableProducts.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #999;">No products available in this category</p>';
        return;
    }
    
    const products = availableProducts.slice(0, 6); // Show first 6 available products
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
    
    // Filter out out-of-stock products
    const availableProducts = productData[categoryName].filter(product => !product.outOfStock);
    
    if (availableProducts.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 3rem; color: #999; font-size: 1.2rem;">No products available in this category yet. Check back soon!</p>';
        return;
    }
    
    const totalPages = Math.ceil(availableProducts.length / ITEMS_PER_PAGE);
    
    // Calculate start and end indices for current page
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageProducts = availableProducts.slice(startIndex, endIndex);
    
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
    const productId = product._id || product.id; // Support both MongoDB _id and id
    const isInWishlist = wishlist.some(item => {
        const itemId = item._id || item.id;
        return String(itemId) === String(productId);
    });
    const heartIcon = isInWishlist ? '♥' : '♡';
    const heartClass = isInWishlist ? 'wishlist-heart-filled' : 'wishlist-heart-empty';
    
    // Build variant availability info
    let variantInfo = '';
    const hasColors = product.colors && product.colors.length > 0;
    const hasSizes = product.sizes && product.sizes.length > 0;
    
    if (hasColors || hasSizes) {
        let parts = [];
        if (hasColors) {
            parts.push(`<div class="variant-row"><strong>Colours Available:</strong> ${product.colors.join(', ')}</div>`);
        }
        if (hasSizes) {
            parts.push(`<div class="variant-row"><strong>Sizes Available:</strong> ${product.sizes.join(', ')}</div>`);
        }
        variantInfo = `<div class="product-variants-info">${parts.join('')}</div>`;
    }
    
    // Build price display with MRP strikethrough if available
    let priceHTML = '';
    if (product.mrp && product.mrp > product.price) {
        // Show special price with MRP crossed out
        const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
        priceHTML = `
            <div class="product-price-container">
                <div class="product-price">₹${product.price}</div>
                <div class="product-mrp">₹${product.mrp}</div>
                <div class="product-discount">${discount}% OFF</div>
            </div>
        `;
    } else {
        // Just show the price
        priceHTML = `<div class="product-price">₹${product.price}</div>`;
    }
    
    // Handle image - could be URL or emoji
    const imageUrl = product.image;
    const imageHTML = imageUrl && imageUrl.startsWith('http') 
        ? `<img src="${imageUrl}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` 
        : `<div style="font-size: 4rem; display: flex; align-items: center; justify-content: center; height: 100%;">${imageUrl || '🛍️'}</div>`;
    
    return `
        <div class="product-card" data-id="${productId}">
            <div class="product-image" onclick="showProductDetail('${productId}')">
                ${imageHTML}
                <button class="product-share-btn" onclick="event.stopPropagation(); shareProduct('${productId}')" title="Share">
                    <span class="material-symbols-outlined">ios_share</span>
                </button>
                <div class="product-wishlist-heart ${heartClass}" onclick="event.stopPropagation(); toggleWishlist('${productId}')" title="Add to Wishlist">
                    ${heartIcon}
                </div>
            </div>
            <div class="product-info" onclick="showProductDetail('${productId}')">
                <div class="product-name">${product.name}</div>
                ${priceHTML}
                ${variantInfo}
                <div class="product-actions">
                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCart('${productId}')">
                        Add to Cart
                    </button>
                    <button class="buy-now-btn" onclick="event.stopPropagation(); buyNow('${productId}')">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Share Product Function - Fixed to actually share, not just copy
function shareProduct(productId) {
    // Find product in all categories
    let product = null;
    for (const category in productData) {
        product = productData[category].find(p => (p._id || p.id) === productId);
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
    let text = `✨ *Check out this amazing product!* ✨\n\n${title}\n💰 Price: ₹${price}\n\n`;
    
    // Try to find the product to include variant information if available
    const productId = new URL(url).searchParams.get('id');
    if (productId) {
        let product = null;
        for (const category in productData) {
            product = productData[category].find(p => (p._id || p.id) === productId);
            if (product) break;
        }
        
        if (product) {
            // Add available variants info
            if (product.colors && product.colors.length > 0) {
                text += `🎨 Available Colors: ${product.colors.join(', ')}\n`;
            }
            if (product.sizes && product.sizes.length > 0) {
                text += `📏 Available Sizes: ${product.sizes.join(', ')}\n`;
            }
            text += `\n`;
        }
    }
    
    text += `🔗 Shop now: ${url}\n\n✨ Sia Creations - Crafting Elegance ✨`;
    
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
    const currentProductId = currentProduct._id || currentProduct.id;
    const existingItem = cart.find(item => (item._id || item.id) === currentProductId);
    
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
        product = productData[category].find(p => (p._id || p.id) === productId);
        if (product) break;
    }
    
    if (!product) return;
    
    // Check if product has colors or sizes
    const hasColors = product.colors && product.colors.length > 0;
    const hasSizes = product.sizes && product.sizes.length > 0;
    
    if (hasColors || hasSizes) {
        // Show variant selection modal
        showVariantModal(product, 'cart');
    } else {
        // Add directly to cart
        addToCartDirectly(product);
    }
}

function addToCartDirectly(product, selectedColor = null, selectedSize = null) {
    const productId = product._id || product.id;
    // Check if product already in cart with same variants
    const existingItem = cart.find(item => 
        (item._id || item.id) === productId && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1,
            selectedColor,
            selectedSize
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    updateCartDisplay();
    showAddToCartFeedback();
}

function removeFromCart(productId, selectedColor = '', selectedSize = '') {
    cart = cart.filter(item => 
        !((item._id || item.id) === productId && 
          (item.selectedColor || '') === selectedColor && 
          (item.selectedSize || '') === selectedSize)
    );
    saveCartToStorage();
    updateCartDisplay();
    updateCartCount();
}

function updateQuantity(productId, change, selectedColor = '', selectedSize = '') {
    const item = cart.find(item => 
        (item._id || item.id) === productId && 
        (item.selectedColor || '') === selectedColor && 
        (item.selectedSize || '') === selectedSize
    );
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId, selectedColor, selectedSize);
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
        const productId = card.getAttribute('data-id'); // Keep as string for MongoDB ObjectId
        const heartElement = card.querySelector('.product-wishlist-heart');
        
        if (heartElement && productId) {
            // Check if product is in wishlist - compare both _id and id fields
            const isInWishlist = wishlist.some(item => {
                const itemId = item._id || item.id;
                return String(itemId) === String(productId);
            });
            
            // Update heart icon and class
            heartElement.textContent = isInWishlist ? '♥' : '♡';
            
            // Remove all heart classes first
            heartElement.classList.remove('wishlist-heart-filled', 'wishlist-heart-empty');
            
            // Add the appropriate class
            heartElement.classList.add(isInWishlist ? 'wishlist-heart-filled' : 'wishlist-heart-empty');
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
            sidebarItemsContainer.innerHTML = wishlist.map(item => {
                const itemId = item._id || item.id;
                const imageUrl = item.images && item.images[0] ? item.images[0] : item.image;
                const imageHTML = imageUrl && imageUrl.startsWith('http') 
                    ? `<img src="${imageUrl}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">` 
                    : `<div style="font-size: 2.5rem; display: flex; align-items: center; justify-content: center; height: 100%;">${imageUrl || '🛍️'}</div>`;
                
                // Build variant info display
                let variantInfo = '';
                if (item.selectedColor) {
                    variantInfo += `<div style="font-size: 0.8rem; color: #666; margin-top: 0.25rem;">Color: ${item.selectedColor}</div>`;
                }
                if (item.selectedSize) {
                    variantInfo += `<div style="font-size: 0.8rem; color: #666;">Size: ${item.selectedSize}</div>`;
                }
                
                return `
                    <div class="wishlist-item">
                        <div class="wishlist-item-image" onclick="showProductDetail('${itemId}')">
                            ${imageHTML}
                        </div>
                        <div class="wishlist-item-info">
                            <div class="wishlist-item-name">${item.name}</div>
                            ${variantInfo}
                            <div class="wishlist-item-price">₹${item.price}</div>
                            <div class="wishlist-item-controls">
                                <button class="add-to-cart" onclick="addToCartFromWishlist('${itemId}')">
                                    Add to Cart
                                </button>
                                <button class="remove-btn" onclick="removeFromWishlist('${itemId}')" title="Remove">
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

function createWishlistCard(product) {
    const productId = product._id || product.id;
    const imageUrl = product.images && product.images[0] ? product.images[0] : product.image;
    const imageHTML = imageUrl && imageUrl.startsWith('http') 
        ? `<img src="${imageUrl}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` 
        : `<div style="font-size: 3rem; display: flex; align-items: center; justify-content: center; height: 100%;">${imageUrl || '🛍️'}</div>`;
    
    // Build variant info display
    let variantInfo = '';
    if (product.selectedColor) {
        variantInfo += `<div style="font-size: 0.85rem; color: #666; margin-top: 0.25rem;">Color: ${product.selectedColor}</div>`;
    }
    if (product.selectedSize) {
        variantInfo += `<div style="font-size: 0.85rem; color: #666;">Size: ${product.selectedSize}</div>`;
    }
    
    return `
        <div class="wishlist-item" data-id="${productId}">
            <div class="wishlist-item-image" onclick="showProductDetail('${productId}')">
                ${imageHTML}
            </div>
            <div class="wishlist-item-info">
                <div class="wishlist-item-name">${product.name}</div>
                ${variantInfo}
                <div class="wishlist-item-price">₹${product.price}</div>
                <div class="wishlist-item-actions">
                    <button class="add-to-cart-from-wishlist" onclick="addToCartFromWishlist('${productId}')">
                        Add to Cart
                    </button>
                    <button class="remove-from-wishlist" onclick="removeFromWishlist('${productId}')" title="Remove from wishlist">
                        ✕
                    </button>
                </div>
            </div>
        </div>
    `;
}

function addToCartFromWishlist(productId) {
    // Find the product in wishlist - it already has stored selectedColor and selectedSize
    const wishlistItem = wishlist.find(item => (item._id || item.id) === productId);
    
    if (!wishlistItem) return;
    
    // Fetch full product data to ensure we have all details (price, images, etc.)
    let fullProduct = null;
    for (const category in productData) {
        fullProduct = productData[category].find(p => (p._id || p.id) === productId);
        if (fullProduct) break;
    }
    
    // Fallback to allProducts if not found in productData
    if (!fullProduct && window.allProducts) {
        fullProduct = allProducts.find(p => (p._id || p.id) === productId);
    }
    
    // Use fullProduct if available, otherwise use wishlistItem
    const product = fullProduct || wishlistItem;
    
    // Add to cart using the stored variants (no modal needed)
    addToCartDirectly(product, wishlistItem.selectedColor, wishlistItem.selectedSize);
    
    // Remove from wishlist after adding to cart
    const index = wishlist.findIndex(item => (item._id || item.id) === productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        saveWishlistToStorage();
        updateWishlistCount();
        updateAllWishlistCounts();
        updateWishlistDisplay();
        updateProductCardHearts();
    }
    
    showWishlistFeedback('Item added to cart and removed from wishlist!', 'cart');
}

function removeFromWishlist(productId) {
    const index = wishlist.findIndex(item => (item._id || item.id) === productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        saveWishlistToStorage();
        updateWishlistCount();
        updateWishlistDisplay();
        updateProductCardHearts();
        showWishlistFeedback('Item removed from wishlist', 'removed');
    }
}

function addAllWishlistToCart() {
    if (wishlist.length === 0) {
        showWishlistFeedback('Your wishlist is empty', 'error');
        return;
    }
    
    // Get all products from wishlist with their stored variants
    const itemsToAdd = [...wishlist];
    let addedCount = 0;
    
    // Add each item to cart using stored variants
    itemsToAdd.forEach(wishlistItem => {
        // Fetch full product data
        let fullProduct = null;
        const productId = wishlistItem._id || wishlistItem.id;
        
        for (const category in productData) {
            fullProduct = productData[category].find(p => (p._id || p.id) === productId);
            if (fullProduct) break;
        }
        
        if (!fullProduct && window.allProducts) {
            fullProduct = allProducts.find(p => (p._id || p.id) === productId);
        }
        
        const product = fullProduct || wishlistItem;
        
        // Add to cart with stored variants (no modal needed)
        addToCartDirectly(product, wishlistItem.selectedColor, wishlistItem.selectedSize);
        addedCount++;
    });
    
    // Clear wishlist after adding all to cart
    wishlist = [];
    window.wishlist = wishlist;
    saveWishlistToStorage();
    updateWishlistCount();
    updateAllWishlistCounts();
    updateWishlistDisplay();
    updateProductCardHearts();
    
    showWishlistFeedback(`${addedCount} item${addedCount > 1 ? 's' : ''} added to cart!`, 'cart');
    
    // Close wishlist sidebar
    setTimeout(() => {
        const sidebar = document.getElementById('wishlist-sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
        }
    }, 1000);
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
window.addAllWishlistToCart = addAllWishlistToCart;
window.showVariantModal = showVariantModal;
window.closeVariantModal = closeVariantModal;
window.selectColor = selectColor;
window.selectSize = selectSize;
window.confirmVariantSelection = confirmVariantSelection;
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
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 3rem; font-family: var(--font-sans); font-size: 1.1rem;">🛒 Your cart is empty</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    const cartHTML = cart.map(item => {
        // Build variant info display
        let variantInfo = '';
        if (item.selectedColor) {
            variantInfo += `<div style="font-size: 0.85rem; color: #666; margin-top: 0.25rem;">Color: ${item.selectedColor}</div>`;
        }
        if (item.selectedSize) {
            variantInfo += `<div style="font-size: 0.85rem; color: #666;">Size: ${item.selectedSize}</div>`;
        }
        
        // Handle image - could be URL or emoji
        const imageUrl = item.images && item.images[0] ? item.images[0] : item.image;
        const imageHTML = imageUrl && imageUrl.startsWith('http') 
            ? `<img src="${imageUrl}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">` 
            : `<div style="font-size: 2.5rem; display: flex; align-items: center; justify-content: center; height: 100%;">${imageUrl || '🛍️'}</div>`;
        
        const itemId = item._id || item.id;
        
        return `
            <div class="cart-item">
                <div class="cart-item-image">${imageHTML}</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    ${variantInfo}
                    <div class="cart-item-price">₹${item.price}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${itemId}', -1, '${item.selectedColor || ''}', '${item.selectedSize || ''}')">-</button>
                        <span style="margin: 0 0.5rem;">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${itemId}', 1, '${item.selectedColor || ''}', '${item.selectedSize || ''}')">+</button>
                        <button class="remove-btn" onclick="removeFromCart('${itemId}', '${item.selectedColor || ''}', '${item.selectedSize || ''}')">Remove</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
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
        email: formData.get('email') || 'noemail@siacreations.com',
        city: formData.get('city') || 'Not Provided',
        state: formData.get('state') || 'Not Provided',
        pincode: formData.get('pincode') || '000000'
    };
    
    // Prepare order data for API (matching Order model exactly)
    const orderData = {
        customer: {
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            address: customerData.address,
            city: customerData.city,
            state: customerData.state,
            pincode: customerData.pincode
        },
        items: cart.map(item => ({
            productId: item._id || item.id,
            productName: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        giftPackagingCharge: 0,
        deliveryCharge: 'To be confirmed',
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        paymentMode: formData.get('payment') || 'COD',
        notes: ''
    };
    
    console.log('Submitting order:', orderData);
    
    // Submit order to API
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        console.log('Order API response status:', response.status);
        const data = await response.json();
        console.log('Order API response:', data);
        
        if (!data.success) {
            console.error('❌ Order failed:', data.message);
            alert('Failed to place order: ' + (data.message || 'Unknown error'));
            return;
        } else {
            console.log('✅ Order placed successfully!', data.order);
        }
    } catch (error) {
        console.error('❌ Error submitting order:', error);
        alert('Failed to connect to server. Please try again or contact us directly.');
        return;
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
        product = productData[category].find(p => (p._id || p.id) === productId);
        if (product) break;
    }
    
    if (!product) return;
    
    const existingIndex = wishlist.findIndex(item => {
        const itemId = item._id || item.id;
        return String(itemId) === String(productId);
    });
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showWishlistFeedback('Item removed from wishlist', 'removed');
    } else {
        // Check if product has colors or sizes
        const hasColors = product.colors && product.colors.length > 0;
        const hasSizes = product.sizes && product.sizes.length > 0;
        
        if (hasColors || hasSizes) {
            // Show variant selection modal
            showVariantModal(product, 'wishlist');
            return; // Don't add yet, wait for modal confirmation
        }
        
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

// Variant Modal Functions
let currentVariantProduct = null;
let currentVariantAction = null; // 'cart' or 'wishlist'
let selectedColor = null;
let selectedSize = null;

function showVariantModal(product, action) {
    currentVariantProduct = product;
    currentVariantAction = action;
    selectedColor = null;
    selectedSize = null;
    
    const modal = document.getElementById('variant-modal');
    const productName = document.getElementById('variant-product-name');
    const colorSection = document.getElementById('variant-color-section');
    const sizeSection = document.getElementById('variant-size-section');
    const colorOptions = document.getElementById('variant-color-options');
    const sizeOptions = document.getElementById('variant-size-options');
    
    if (!modal) return;
    
    // Set product name
    if (productName) {
        productName.textContent = product.name;
    }
    
    const outOfStockVariants = product.outOfStockVariants || [];
    
    // Handle colors
    if (product.colors && product.colors.length > 0) {
        // Filter out colors that are completely out of stock
        let availableColors = product.colors;
        
        if (product.sizes && product.sizes.length > 0) {
            // If product has both colors and sizes, check if all size combinations are out of stock for a color
            availableColors = product.colors.filter(color => {
                // Check if at least one size is available for this color
                return product.sizes.some(size => {
                    const variantKey = `${color}|${size}`;
                    return !outOfStockVariants.includes(variantKey);
                });
            });
        } else {
            // If product has only colors, filter out colors that are in outOfStockVariants
            availableColors = product.colors.filter(color => !outOfStockVariants.includes(color));
        }
        
        if (availableColors.length > 0) {
            colorSection.style.display = 'block';
            colorOptions.innerHTML = availableColors.map(color => `
                <div class="variant-option" onclick="selectColor('${color}')">${color}</div>
            `).join('');
        } else {
            colorSection.style.display = 'none';
        }
    } else {
        colorSection.style.display = 'none';
    }
    
    // Handle sizes
    if (product.sizes && product.sizes.length > 0) {
        // Filter out sizes that are completely out of stock
        let availableSizes = product.sizes;
        
        if (product.colors && product.colors.length > 0) {
            // If product has both colors and sizes, check if all color combinations are out of stock for a size
            availableSizes = product.sizes.filter(size => {
                // Check if at least one color is available for this size
                return product.colors.some(color => {
                    const variantKey = `${color}|${size}`;
                    return !outOfStockVariants.includes(variantKey);
                });
            });
        } else {
            // If product has only sizes, filter out sizes that are in outOfStockVariants
            availableSizes = product.sizes.filter(size => !outOfStockVariants.includes(size));
        }
        
        if (availableSizes.length > 0) {
            sizeSection.style.display = 'block';
            sizeOptions.innerHTML = availableSizes.map(size => `
                <div class="variant-option" onclick="selectSize('${size}')">${size}</div>
            `).join('');
        } else {
            sizeSection.style.display = 'none';
        }
    } else {
        sizeSection.style.display = 'none';
    }
    
    modal.classList.add('active');
}

function closeVariantModal() {
    const modal = document.getElementById('variant-modal');
    if (modal) {
        modal.classList.remove('active');
    }
    currentVariantProduct = null;
    currentVariantAction = null;
    selectedColor = null;
    selectedSize = null;
}

function selectColor(color) {
    selectedColor = color;
    
    // Update UI
    const colorOptions = document.querySelectorAll('#variant-color-options .variant-option');
    colorOptions.forEach(option => {
        if (option.textContent === color) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
    
    // Update available sizes based on selected color
    if (currentVariantProduct && currentVariantProduct.sizes && currentVariantProduct.sizes.length > 0) {
        const outOfStockVariants = currentVariantProduct.outOfStockVariants || [];
        const sizeOptions = document.getElementById('variant-size-options');
        
        // Filter sizes available for this color
        const availableSizes = currentVariantProduct.sizes.filter(size => {
            const variantKey = `${color}|${size}`;
            return !outOfStockVariants.includes(variantKey);
        });
        
        if (availableSizes.length > 0) {
            sizeOptions.innerHTML = availableSizes.map(size => `
                <div class="variant-option" onclick="selectSize('${size}')">${size}</div>
            `).join('');
        }
    }
}

function selectSize(size) {
    selectedSize = size;
    
    // Update UI
    const sizeOptions = document.querySelectorAll('#variant-size-options .variant-option');
    sizeOptions.forEach(option => {
        if (option.textContent === size) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
    
    // Update available colors based on selected size
    if (currentVariantProduct && currentVariantProduct.colors && currentVariantProduct.colors.length > 0) {
        const outOfStockVariants = currentVariantProduct.outOfStockVariants || [];
        const colorOptions = document.getElementById('variant-color-options');
        
        // Filter colors available for this size
        const availableColors = currentVariantProduct.colors.filter(color => {
            const variantKey = `${color}|${size}`;
            return !outOfStockVariants.includes(variantKey);
        });
        
        if (availableColors.length > 0) {
            colorOptions.innerHTML = availableColors.map(color => `
                <div class="variant-option" onclick="selectColor('${color}')">${color}</div>
            `).join('');
        }
    }
}

function confirmVariantSelection() {
    if (!currentVariantProduct) return;
    
    // Check if all required variants are selected
    const hasColors = currentVariantProduct.colors && currentVariantProduct.colors.length > 0;
    const hasSizes = currentVariantProduct.sizes && currentVariantProduct.sizes.length > 0;
    
    if (hasColors && !selectedColor) {
        showShareFeedback('Please select a color', 'error');
        return;
    }
    
    if (hasSizes && !selectedSize) {
        showShareFeedback('Please select a size', 'error');
        return;
    }
    
    // Perform action
    if (currentVariantAction === 'cart') {
        addToCartDirectly(currentVariantProduct, selectedColor, selectedSize);
    } else if (currentVariantAction === 'buyNow') {
        // Create buy now item with selected variants
        const buyNowItem = {
            ...currentVariantProduct,
            selectedColor,
            selectedSize,
            quantity: 1
        };
        
        // Store in sessionStorage for checkout page
        sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
        
        // Redirect to checkout with buy now flag
        setTimeout(() => {
            window.location.href = 'checkout-page.html?buyNow=true';
        }, 300);
    } else if (currentVariantAction === 'wishlist') {
        // Check if this is being called FROM wishlist to add to cart
        const productId = currentVariantProduct._id || currentVariantProduct.id;
        const isInWishlist = wishlist.some(item => (item._id || item.id) === productId);
        
        if (isInWishlist) {
            // Adding from wishlist to cart - add to cart then remove from wishlist
            addToCartDirectly(currentVariantProduct, selectedColor, selectedSize);
            
            // Remove from wishlist
            const index = wishlist.findIndex(item => (item._id || item.id) === productId);
            if (index > -1) {
                wishlist.splice(index, 1);
                saveWishlistToStorage();
                updateWishlistCount();
                updateWishlistDisplay();
                updateProductCardHearts();
            }
            
            showWishlistFeedback('Item added to cart and removed from wishlist!', 'cart');
        } else {
            // Adding to wishlist
            const productWithVariants = {
                ...currentVariantProduct,
                selectedColor,
                selectedSize
            };
            wishlist.push(productWithVariants);
            saveWishlistToStorage();
            updateWishlistCount();
            updateAllWishlistCounts();
            updateWishlistDisplay();
            updateProductCardHearts();
            showWishlistFeedback('Item added to wishlist ♥', 'added');
        }
    }
    
    closeVariantModal();
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
window.showVariantModal = showVariantModal;
window.closeVariantModal = closeVariantModal;
window.selectColor = selectColor;
window.selectSize = selectSize;
window.confirmVariantSelection = confirmVariantSelection;
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
// Sorting functionality for category page
let currentSortOption = 'default';

function applySorting(sortOption) {
    currentSortOption = sortOption;
    
    const categoryName = window.currentCategory;
    if (!categoryName) {
        return;
    }
    
    let products = productData[categoryName] ? [...productData[categoryName]] : [];
    
    if (products.length === 0) {
        return;
    }
    
    switch(sortOption) {
        case 'price-low':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            products.sort((a, b) => b.price - a.price);
            break;
        case 'name-az':
            products.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-za':
            products.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            // Keep original order (newest first from API)
            break;
    }
    
    let categoryProducts = document.getElementById('category-products');
    
    if (!categoryProducts && categoryName) {
        const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
        categoryProducts = document.getElementById(`${categorySlug}-products`);
    }
    
    if (!categoryProducts) {
        categoryProducts = document.querySelector('.products-grid');
    }
    
    if (!categoryProducts) {
        return;
    }
    
    categoryProducts.innerHTML = products.map(product => createProductCard(product)).join('');
}

window.applySorting = applySorting;

// Buy Now Function - Checkout only this item without clearing cart
function buyNow(productId) {
    // Find the product
    let product = null;
    for (const category in productData) {
        product = productData[category].find(p => (p._id || p.id) === productId);
        if (product) break;
    }
    
    if (!product) return;
    
    // Check if product has variants (colors or sizes)
    const hasVariants = (product.colors && product.colors.length > 0) || (product.sizes && product.sizes.length > 0);
    
    if (hasVariants) {
        // Show variant modal and set buy now mode - PASS THE PRODUCT OBJECT, NOT ID
        window.pendingBuyNowProduct = productId;
        showVariantModal(product, 'buyNow');
    } else {
        // No variants, create buy now item
        const buyNowItem = {
            ...product,
            quantity: 1
        };
        
        // Store in sessionStorage for checkout page
        sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
        
        // Redirect to checkout with buy now flag
        window.location.href = 'checkout-page.html?buyNow=true';
    }
}

window.buyNow = buyNow;

// ========================================
// Smart Back Button Handler
// ========================================

/**
 * Smart back button that handles navigation contextually
 * Falls back to home if no history
 */
function smartBack() {
    // Check if there's history to go back to
    if (window.history.length > 1 && document.referrer) {
        // Check if referrer is from same domain
        const referrerHost = new URL(document.referrer).hostname;
        const currentHost = window.location.hostname;
        
        if (referrerHost === currentHost) {
            window.history.back();
        } else {
            // External referrer, go to home
            window.location.href = 'index.html';
        }
    } else {
        // No history, go to home
        window.location.href = 'index.html';
    }
}

/**
 * Navigate back to category page
 * If category is known, go to that category tab
 */
function backToCategory(categoryId = null) {
    if (categoryId) {
        window.location.href = `category.html#${categoryId}`;
    } else if (window.history.length > 1 && document.referrer.includes('category.html')) {
        window.history.back();
    } else {
        window.location.href = 'category.html';
    }
}

/**
 * Navigate back to home page with optional tab
 */
function backToHome(tabId = 'home') {
    window.location.href = `index.html#${tabId}`;
}

/**
 * Handle browser back/forward button
 */
window.addEventListener('popstate', function(event) {
    // Reload page to ensure correct state
    window.location.reload();
});

// Make functions globally available
window.smartBack = smartBack;
window.backToCategory = backToCategory;
window.backToHome = backToHome;
