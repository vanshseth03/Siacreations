// ========================================
// Sia Creation Admin Panel JavaScript
// Premium E-Commerce Admin Interface
// ========================================

// API Configuration - Production API URL
const API_URL = 'https://siacreations.vercel.app/api';
// For local development, use: 'http://localhost:3000/api'
let apiAvailable = true;

// Pagination state
let productsCurrentPage = 1;
let productsTotalPages = 1;
let productsPerPage = 10;

let ordersCurrentPage = 1;
let ordersTotalPages = 1;
let ordersPerPage = 5;

// Edit mode state
let editingProductId = null;

// Check API availability
async function checkApiConnection() {
    try {
        const response = await fetch(`${API_URL}/products`);
        apiAvailable = response.ok;
        return apiAvailable;
    } catch (error) {
        apiAvailable = false;
        return false;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Check if API is available
    const isConnected = await checkApiConnection();
    
    if (!isConnected) {
        showNotification('⚠️ API Server not running!', 'error');
        console.error('API SERVER NOT RUNNING');
        
        // Show persistent warning banner
        showApiWarningBanner();
    } else {
        showNotification('✅ Connected to API Server', 'success');
    }
    
    initializeAdmin();
});

// Show API warning banner
function showApiWarningBanner() {
    const banner = document.createElement('div');
    banner.id = 'api-warning-banner';
    banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
        color: white;
        padding: 1rem;
        text-align: center;
        z-index: 9999;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        font-weight: 600;
        font-size: 14px;
    `;
    banner.innerHTML = `
        ⚠️ API Server Not Running! 
        <span style="opacity: 0.9; font-weight: 400;">
            Open terminal and run: <code style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px;">cd api && npm start</code>
        </span>
    `;
    document.body.appendChild(banner);
    
    // Adjust body padding
    document.body.style.paddingTop = '60px';
}

// ========================================
// Initialize Admin Panel
// ========================================
function initializeAdmin() {
    setupNavigation();
    setupMobileMenu();
    setupModals();
    setupForms();
    setupImageUpload();
    setupQuickActions();
    setupCarouselManager();
    setupCategoryManager();
    setupProductFilters();
    setupOrderFilters();
    setupTagInput();
    setupProductActions();
    setupPagination();
    
    // Load initial data from API
    loadDashboardStats();
    loadProducts(1);
    loadCategories();
    loadCategoriesForProductForm();
    loadOrders(1);
    loadCarouselSlides();
}

// ========================================
// Navigation & Tab Switching
// ========================================
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');

    const tabTitles = {
        'dashboard': { title: 'Dashboard', subtitle: 'Overview of your store' },
        'carousel': { title: 'Carousel Manager', subtitle: 'Manage homepage carousel slides' },
        'new-product': { title: 'Add New Product', subtitle: 'Create and publish new products' },
        'products': { title: 'Product Management', subtitle: 'Edit and manage all products' },
        'categories': { title: 'Categories', subtitle: 'Organize your product categories' },
        'orders': { title: 'Order Management', subtitle: 'View and manage customer orders' }
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Show selected tab
            const tabId = item.getAttribute('data-tab');
            const selectedTab = document.getElementById(`${tabId}-tab`);
            if (selectedTab) {
                selectedTab.classList.add('active');
                
                // Update page title
                if (tabTitles[tabId]) {
                    pageTitle.textContent = tabTitles[tabId].title;
                    pageSubtitle.textContent = tabTitles[tabId].subtitle;
                }
            }
            
            // Close mobile menu if open
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
    });
}

// ========================================
// Mobile Menu Toggle
// ========================================
function setupMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const menuToggleTop = document.getElementById('mobileMenuToggleTop');
    const sidebar = document.getElementById('sidebar');

    // Handle both toggle buttons
    [menuToggle, menuToggleTop].forEach(btn => {
        if (btn && sidebar) {
            btn.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && 
                !menuToggle?.contains(e.target) && 
                !menuToggleTop?.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Close sidebar when clicking a nav item on mobile
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 968 && sidebar) {
                sidebar.classList.remove('active');
            }
        });
    });
}

// ========================================
// Quick Actions
// ========================================
function setupQuickActions() {
    const actionButtons = document.querySelectorAll('.action-btn[data-action]');
    
    actionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            const navItem = document.querySelector(`.nav-item[data-tab="${action}"]`);
            
            if (navItem) {
                navItem.click();
            }
        });
    });
}

// ========================================
// ========================================
// Modal Management
// ========================================
function setupModals() {
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close');

    // Close modal buttons
    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    // Close on backdrop click
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form if exists
    const form = modal.querySelector('form');
    if (form) {
        form.reset();
    }
}

// ========================================
// Carousel Manager
// ========================================
function setupCarouselManager() {
    const addSlideBtn = document.getElementById('addCarouselSlide');
    const previewBtn = document.getElementById('previewCarousel');
    const carouselForm = document.getElementById('carouselSlideForm');
    const imageInput = document.getElementById('carouselImage');

    if (addSlideBtn) {
        addSlideBtn.addEventListener('click', () => {
            openModal('carouselModal');
        });
    }

    if (previewBtn) {
        previewBtn.addEventListener('click', previewCarousel);
    }

    if (carouselForm) {
        carouselForm.addEventListener('submit', handleCarouselSubmit);
    }

    // Image preview for carousel
    if (imageInput) {
        // Set accept attribute for better mobile compatibility
        imageInput.setAttribute('accept', 'image/*');
        // Note: Removed 'capture' attribute - it forces camera on mobile, preventing gallery selection
        
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            const preview = document.getElementById('carouselImagePreview');
            
            if (file && preview) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.innerHTML = `
                        <img src="${e.target.result}" style="max-width: 100%; height: 150px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

async function handleCarouselSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const title = document.getElementById('carouselTitle').value;
    const description = document.getElementById('carouselDescription').value;
    const buttonTitle = document.getElementById('carouselButtonTitle').value;
    const buttonLink = document.getElementById('carouselButtonLink').value;
    const order = parseInt(document.getElementById('carouselOrder').value) || 1;
    const imageFile = document.getElementById('carouselImage').files[0];
    
    if (!imageFile) {
        showNotification('Please select an image', 'error');
        return;
    }
    
    // Show loading notification
    showNotification('Compressing and uploading carousel image...', 'info');
    
    try {
        // Compress image first (especially for mobile photos)
        const compressedFile = await compressImage(imageFile, 2400, 1350, 0.92); // High quality for carousel banners
        const originalSize = (imageFile.size / 1024 / 1024).toFixed(2);
        const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);
        console.log(`✅ Carousel image compressed: ${originalSize}MB → ${compressedSize}MB`);
        
        // Upload image
        const uploadData = new FormData();
        uploadData.append('image', compressedFile);
        
        console.log(`📤 Uploading carousel to: ${API_URL}/upload/image`);
        let imageUrl = '';
        const response = await fetch(`${API_URL}/upload/image`, {
            method: 'POST',
            body: uploadData
        });
        
        console.log(`📥 Carousel upload response: ${response.status} ${response.statusText}`);
        
        // Check if response is OK
        if (!response.ok) {
            let errorMsg = `HTTP ${response.status}: ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMsg = errorData.message || errorData.error || errorMsg;
            } catch (e) {
                // If response is not JSON, use status text
            }
            console.error('❌ Carousel upload failed with HTTP error:', errorMsg);
            showNotification(`Upload failed: ${errorMsg}`, 'error');
            return;
        }
        
        const data = await response.json();
        console.log('📦 Carousel upload data:', data);
        
        if (data.success) {
            imageUrl = data.imageUrl;
        } else {
            const errorMsg = data.message || data.error || 'API returned success=false';
            console.error('❌ Carousel upload failed:', errorMsg, 'Full response:', data);
            showNotification(`Upload failed: ${errorMsg}`, 'error');
            return;
        }
        
        // Create carousel slide with all data
        const slideData = {
            title: title,
            imageUrl: imageUrl,
            description: description,
            buttonTitle: buttonTitle,
            buttonLink: buttonLink,
            order: order,
            isActive: true
        };
        
        const slideResponse = await fetch(`${API_URL}/carousel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(slideData)
        });
        const slideResult = await slideResponse.json();
        
        if (slideResult.success) {
            showNotification('✅ Carousel slide added successfully!', 'success');
            closeModal(document.getElementById('carouselModal'));
            loadCarouselSlides(); // Immediate refresh
        } else {
            const errorMsg = slideResult.message || slideResult.error || 'API returned success=false';
            console.error('❌ Failed to create carousel:', errorMsg, 'Full response:', slideResult);
            showNotification(`Failed to create slide: ${errorMsg}`, 'error');
        }
    } catch (error) {
        console.error('❌ Error adding carousel slide:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        showNotification(`Carousel error: ${error.message || error.toString()}`, 'error');
    }
}

// ========================================
// API Functions - Load Data
// ========================================

// Load Dashboard Statistics
async function loadDashboardStats() {
    if (!apiAvailable) return;
    
    try {
        const response = await fetch(`${API_URL}/stats/dashboard`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        if (data.success) {
            updateDashboardUI(data.stats);
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        // Don't show error notification if API is already known to be unavailable
    }
}

// Update Dashboard UI with stats
function updateDashboardUI(stats) {
    // Update stat cards with API data
    const statTotalProducts = document.getElementById('statTotalProducts');
    const statTotalOrders = document.getElementById('statTotalOrders');
    const statTotalCategories = document.getElementById('statTotalCategories');
    const statTotalRevenue = document.getElementById('statTotalRevenue');
    
    if (statTotalProducts) {
        statTotalProducts.textContent = stats.totalProducts || 0;
        const productChange = statTotalProducts.nextElementSibling;
        if (productChange) productChange.textContent = stats.totalProducts > 0 ? 'From database' : 'No products yet';
    }
    
    if (statTotalOrders) {
        statTotalOrders.textContent = stats.totalOrders || 0;
        const orderChange = statTotalOrders.nextElementSibling;
        if (orderChange) orderChange.textContent = stats.totalOrders > 0 ? 'From database' : 'No orders yet';
    }
    
    if (statTotalCategories) {
        statTotalCategories.textContent = stats.totalCategories || 0;
        const categoryChange = statTotalCategories.nextElementSibling;
        if (categoryChange) categoryChange.textContent = stats.totalCategories > 0 ? 'From database' : 'No categories yet';
    }
    
    if (statTotalRevenue) {
        statTotalRevenue.textContent = `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`;
        const revenueChange = statTotalRevenue.nextElementSibling;
        if (revenueChange) revenueChange.textContent = stats.totalRevenue > 0 ? 'From orders' : 'No revenue yet';
    }
    
    // Update recent orders if available
    if (stats.recentOrders && stats.recentOrders.length > 0) {
        updateRecentOrders(stats.recentOrders);
    } else {
        const orderList = document.getElementById('dashboardRecentOrders');
        if (orderList) {
            orderList.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 2rem;">No recent orders</p>';
        }
    }
}

// Update recent orders on dashboard
function updateRecentOrders(orders) {
    const orderList = document.getElementById('dashboardRecentOrders');
    if (!orderList) return;
    
    if (!orders || orders.length === 0) {
        orderList.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 2rem;">No recent orders</p>';
        return;
    }
    
    orderList.innerHTML = orders.slice(0, 5).map(order => `
        <div class="order-item">
            <div class="order-details">
                <p class="order-id">${order.orderId || `#${order._id?.slice(-6)}`}</p>
                <p class="order-customer">${order.customer?.name || 'Customer'}</p>
            </div>
            <div class="order-status">
                <span class="status-badge ${order.orderStatus}">${order.orderStatus || 'pending'}</span>
                <p class="order-amount">₹${order.totalAmount?.toLocaleString('en-IN') || 0}</p>
            </div>
        </div>
    `).join('');
}

// Load all products
async function loadProducts(page = 1) {
    if (!apiAvailable) return;
    
    try {
        const response = await fetch(`${API_URL}/products?page=${page}&limit=${productsPerPage}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        if (data.success) {
            displayProducts(data.products);
            
            // Update pagination
            productsCurrentPage = page;
            productsTotalPages = Math.ceil((data.total || data.products.length) / productsPerPage);
            updateProductsPagination();
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display products in table
function displayProducts(products) {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    if (!products || products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 3rem; color: var(--text-light);">
                    No products found. Click "Add New Product" to create one.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr data-product-id="${product._id}">
            <td>
                <div class="product-thumb" style="background: ${product.images && product.images.length > 0 ? `url(${product.images[0]}) center/cover` : 'linear-gradient(135deg, #E8C4B8 0%, #D4A59A 100%)'};"></div>
            </td>
            <td><strong>${product.name}</strong></td>
            <td>${product.category?.name || product.category || '-'}</td>
            <td>₹${product.mrp?.toLocaleString('en-IN') || 0}</td>
            <td>₹${product.price?.toLocaleString('en-IN') || 0}</td>
            <td>-</td>
            <td>
                ${product.isNewArrival ? '<span class="badge new-badge">NEW</span>' : ''}
            </td>
            <td><span class="visibility-badge ${product.isVisible ? 'visible' : 'hidden'}">${product.isVisible ? 'Visible' : 'Hidden'}</span></td>
            <td>
                <div class="action-buttons-small">
                    <button class="btn-icon edit-btn" title="Edit" onclick="editProduct('${product._id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-icon stock-btn" title="Manage Stock" onclick="manageStock('${product._id}')" style="color: #ff9800;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="1" y="3" width="15" height="13"></rect>
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                    </button>
                    <button class="btn-icon delete-btn" title="Delete" onclick="deleteProduct('${product._id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load all categories
async function loadCategories() {
    if (!apiAvailable) return;
    
    try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        if (data.success) {
            displayCategories(data.categories);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load categories for product form dropdown
async function loadCategoriesForProductForm() {
    if (!apiAvailable) return;
    
    try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        if (data.success) {
            const categorySelect = document.getElementById('productCategory');
            if (categorySelect) {
                // Keep the default "Select Category" option
                categorySelect.innerHTML = '<option value="">Select Category</option>';
                
                // Add categories from database
                data.categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category._id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Error loading categories for product form:', error);
        showNotification('Failed to load categories. Please refresh the page.', 'error');
    }
}

// Display categories
function displayCategories(categories) {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    
    if (!categories || categories.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-light);">
                <p>No categories found. Click "Add Category" to create one.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = categories.map(category => `
        <div class="category-card" data-category-id="${category._id}">
            <div class="category-header">
                <h4>${category.name}</h4>
                <div class="category-actions">
                    <button class="btn-icon edit-btn" title="Edit" onclick="editCategory('${category._id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-icon delete-btn" title="Delete" onclick="deleteCategory('${category._id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <p class="category-desc">${category.description || 'No description'}</p>
            <div class="category-footer">
                <span class="category-count">-</span>
                <span class="category-status ${category.showOnMainPage ? 'active' : 'inactive'}">
                    ${category.showOnMainPage ? 'Shown on main page' : 'Hidden from main page'}
                </span>
            </div>
        </div>
    `).join('');
}

// Load all orders
async function loadOrders(page = 1) {
    if (!apiAvailable) {
        console.log('API not available, cannot load orders');
        return;
    }
    
    try {
        console.log(`Loading orders - Page ${page}`);
        const response = await fetch(`${API_URL}/orders?page=${page}&limit=${ordersPerPage}`);
        console.log('Orders response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Orders data received:', data);
        
        if (data.success) {
            console.log(`Displaying ${data.orders.length} orders`);
            displayOrders(data.orders);
            
            // Update pagination
            ordersCurrentPage = page;
            ordersTotalPages = Math.ceil((data.total || data.orders.length) / ordersPerPage);
            updateOrdersPagination();
        } else {
            console.error('API returned success: false', data);
            const container = document.getElementById('ordersContainer');
            if (container) {
                container.innerHTML = `<p style="text-align: center; color: red; padding: 3rem;">Error: ${data.message || 'Failed to load orders'}</p>`;
            }
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        const container = document.getElementById('ordersContainer');
        if (container) {
            container.innerHTML = `<p style="text-align: center; color: red; padding: 3rem;">Error loading orders: ${error.message}</p>`;
        }
    }
}

// Display orders
function displayOrders(orders) {
    const container = document.getElementById('ordersContainer');
    if (!container) {
        console.error('Orders container not found!');
        return;
    }
    
    if (!orders || orders.length === 0) {
        console.log('No orders to display');
        container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 3rem;">No orders found.</p>';
        return;
    }
    
    console.log('Displaying orders:', orders.length);
    
    try {
        container.innerHTML = orders.map((order, index) => {
            try {
                // Safe access with defaults
                const orderId = order.orderId || 'N/A';
                const createdAt = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';
                const orderStatus = order.orderStatus || 'pending';
                const customerName = order.customer?.name || 'N/A';
                const customerPhone = order.customer?.phone || 'N/A';
                const customerAddress = order.customer?.address || '';
                const customerCity = order.customer?.city || '';
                const customerState = order.customer?.state || '';
                const customerPincode = order.customer?.pincode || '';
                
                // Build full address
                const fullAddress = [customerAddress, customerCity, customerState, customerPincode]
                    .filter(part => part)
                    .join(', ');
                
                const items = order.items || [];
                const paymentMode = order.paymentMode || 'COD';
                const totalAmount = order.totalAmount || 0;
                
                return `
                    <div class="order-card" data-order-id="${order._id}">
                        <div class="order-card-header">
                            <div class="order-id-section">
                                <h4>${orderId}</h4>
                                <span class="order-date">${createdAt}</span>
                            </div>
                            <select class="status-select ${orderStatus}" onchange="updateOrderStatus('${order._id}', this.value)">
                                <option value="pending" ${orderStatus === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="shipped" ${orderStatus === 'shipped' ? 'selected' : ''}>Shipped</option>
                                <option value="delivered" ${orderStatus === 'delivered' ? 'selected' : ''}>Delivered</option>
                                <option value="cancelled" ${orderStatus === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                        </div>
                        <div class="order-card-body">
                            <div class="order-customer-info">
                                <div class="info-row">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    <span>${customerName}</span>
                                </div>
                                <div class="info-row">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                    <span>${customerPhone}</span>
                                </div>
                                <div class="info-row">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    <span>${fullAddress || 'No address provided'}</span>
                                </div>
                            </div>
                            <div class="order-items">
                                ${items.map(item => `
                                    <div class="order-item-row">
                                        <span>${item.productName || 'Unknown Product'} × ${item.quantity || 0}</span>
                                        <span>₹${(item.price || 0) * (item.quantity || 0)}</span>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="order-footer">
                                <div class="payment-mode">
                                    <strong>Payment:</strong> ${paymentMode}
                                </div>
                                <div class="order-total">
                                    <strong>Total:</strong> ₹${totalAmount}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } catch (itemError) {
                console.error(`Error rendering order at index ${index}:`, itemError, order);
                return `<div class="order-card" style="border: 2px solid red; padding: 1rem;">
                    <p style="color: red;">Error rendering order ${order._id || index}</p>
                    <pre style="font-size: 0.8rem; overflow: auto;">${JSON.stringify(order, null, 2)}</pre>
                </div>`;
            }
        }).join('');
    } catch (error) {
        console.error('Error in displayOrders:', error);
        container.innerHTML = `<p style="text-align: center; color: red; padding: 3rem;">Error displaying orders: ${error.message}</p>`;
    }
}

// Load carousel slides
async function loadCarouselSlides() {
    if (!apiAvailable) return;
    
    try {
        const response = await fetch(`${API_URL}/carousel`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        if (data.success) {
            displayCarouselSlides(data.slides);
        }
    } catch (error) {
        console.error('Error loading carousel slides:', error);
    }
}

// Display carousel slides
function displayCarouselSlides(slides) {
    const container = document.getElementById('carouselSlidesContainer');
    if (!container) return;
    
    if (slides.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-light);">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity: 0.3; margin-bottom: 1rem;">
                    <rect x="2" y="7" width="20" height="15" rx="2"></rect>
                    <polyline points="17 2 12 7 7 2"></polyline>
                </svg>
                <p>No carousel slides yet. Click "Add New Slide" to create one.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = slides.map(slide => `
        <div class="category-card" data-slide-id="${slide._id}">
            <div class="category-header">
                <h4>${slide.title || 'Slide ' + slide.order}</h4>
                <div class="category-actions">
                    <button class="btn-icon edit-btn" title="Edit" onclick="editCarouselSlide('${slide._id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-icon delete-btn" title="Delete" onclick="deleteCarouselSlide('${slide._id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
            ${slide.imageUrl ? `
                <div style="width: 100%; height: 150px; background: url('${slide.imageUrl}') center/cover; border-radius: 8px; margin: 10px 0;"></div>
            ` : ''}
            <p class="category-desc">${slide.description || 'No description'}</p>
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-color);">
                <p style="font-size: 13px; color: var(--text-light); margin: 5px 0;">
                    <strong>Button:</strong> ${slide.buttonTitle || 'Shop Now'}
                </p>
                ${slide.buttonLink ? `
                    <p style="font-size: 12px; color: var(--text-light); margin: 5px 0; word-break: break-all;">
                        <strong>Link:</strong> ${slide.buttonLink}
                    </p>
                ` : ''}
                <p style="font-size: 13px; color: var(--text-light); margin: 5px 0;">
                    <strong>Order:</strong> ${slide.order}
                </p>
            </div>
            <div class="category-footer">
                <span class="category-status ${slide.isActive ? 'active' : 'inactive'}">
                    ${slide.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
        </div>
    `).join('');
}

// Edit carousel slide (placeholder)
function editCarouselSlide(slideId) {
    showNotification('Edit carousel slide feature coming soon', 'info');
    // TODO: Implement edit carousel slide functionality
}

// ========================================
// Pagination Setup
// ========================================
function setupPagination() {
    // Products pagination
    const productsPrevBtn = document.getElementById('productsPrevBtn');
    const productsNextBtn = document.getElementById('productsNextBtn');
    
    if (productsPrevBtn) {
        productsPrevBtn.addEventListener('click', () => {
            if (productsCurrentPage > 1) {
                loadProducts(productsCurrentPage - 1);
            }
        });
    }
    
    if (productsNextBtn) {
        productsNextBtn.addEventListener('click', () => {
            if (productsCurrentPage < productsTotalPages) {
                loadProducts(productsCurrentPage + 1);
            }
        });
    }
    
    // Orders pagination
    const ordersPrevBtn = document.getElementById('ordersPrevBtn');
    const ordersNextBtn = document.getElementById('ordersNextBtn');
    
    if (ordersPrevBtn) {
        ordersPrevBtn.addEventListener('click', () => {
            if (ordersCurrentPage > 1) {
                loadOrders(ordersCurrentPage - 1);
            }
        });
    }
    
    if (ordersNextBtn) {
        ordersNextBtn.addEventListener('click', () => {
            if (ordersCurrentPage < ordersTotalPages) {
                loadOrders(ordersCurrentPage + 1);
            }
        });
    }
}

function updateProductsPagination() {
    const currentPageSpan = document.getElementById('productsCurrentPage');
    const totalPagesSpan = document.getElementById('productsTotalPages');
    const prevBtn = document.getElementById('productsPrevBtn');
    const nextBtn = document.getElementById('productsNextBtn');
    
    if (currentPageSpan) currentPageSpan.textContent = productsCurrentPage;
    if (totalPagesSpan) totalPagesSpan.textContent = productsTotalPages;
    
    if (prevBtn) {
        prevBtn.disabled = productsCurrentPage <= 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = productsCurrentPage >= productsTotalPages;
    }
}

function updateOrdersPagination() {
    const currentPageSpan = document.getElementById('ordersCurrentPage');
    const totalPagesSpan = document.getElementById('ordersTotalPages');
    const prevBtn = document.getElementById('ordersPrevBtn');
    const nextBtn = document.getElementById('ordersNextBtn');
    
    if (currentPageSpan) currentPageSpan.textContent = ordersCurrentPage;
    if (totalPagesSpan) totalPagesSpan.textContent = ordersTotalPages;
    
    if (prevBtn) {
        prevBtn.disabled = ordersCurrentPage <= 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = ordersCurrentPage >= ordersTotalPages;
    }
}

// ========================================
// API Functions - Create/Update/Delete
// ========================================

// Delete product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.success) {
            showNotification('Product deleted successfully', 'success');
            loadProducts(productsCurrentPage);
            loadDashboardStats(); // Refresh dashboard
        } else {
            showNotification(data.message || 'Failed to delete product', 'error');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('Error deleting product', 'error');
    }
}

// Delete category
async function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
        const response = await fetch(`${API_URL}/categories/${categoryId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.success) {
            showNotification('Category deleted successfully', 'success');
            loadCategories();
            populateCategoryDropdown(); // Refresh dropdown
            loadDashboardStats(); // Refresh dashboard
        } else {
            showNotification(data.message || 'Failed to delete category', 'error');
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        showNotification('Error deleting category', 'error');
    }
}

// Delete carousel slide
async function deleteCarouselSlide(slideId) {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    
    try {
        const response = await fetch(`${API_URL}/carousel/${slideId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.success) {
            showNotification('Carousel slide deleted successfully', 'success');
            loadCarouselSlides(); // Immediate refresh
        } else {
            showNotification(data.message || 'Failed to delete slide', 'error');
        }
    } catch (error) {
        console.error('Error deleting slide:', error);
        showNotification('Error deleting slide', 'error');
    }
}

// Update order status
async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderStatus: newStatus })
        });
        const data = await response.json();
        
        if (data.success) {
            showNotification(`Order status updated to ${newStatus}`, 'success');
            loadOrders(ordersCurrentPage); // Immediate refresh
            loadDashboardStats(); // Refresh dashboard
        } else {
            showNotification(data.message || 'Failed to update order status', 'error');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        showNotification('Error updating order status', 'error');
    }
}

// Edit product (placeholder)
function editProduct(productId) {
    // Fetch product data
    fetch(`${API_URL}/products/${productId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.product) {
                const product = data.product;
                
                // Set editing mode
                editingProductId = productId;
                
                // Switch to new product tab
                const newProductTab = document.querySelector('.nav-item[data-tab="new-product"]');
                if (newProductTab) {
                    newProductTab.click();
                }
                
                // Update page title
                const pageTitle = document.getElementById('pageTitle');
                if (pageTitle) {
                    pageTitle.textContent = 'Edit Product';
                }
                
                // Populate form fields
                document.getElementById('productName').value = product.name || '';
                document.getElementById('productCategory').value = product.category || '';
                document.getElementById('productDescription').value = product.description || '';
                document.getElementById('productMRP').value = product.mrp || '';
                document.getElementById('productPrice').value = product.price || '';
                document.getElementById('showOnHomepage').checked = product.isVisible || false;
                document.getElementById('markNewArrival').checked = product.isNewArrival || false;
                
                // Populate tags
                const tagsContainer = document.getElementById('tagsContainer');
                if (tagsContainer && product.tags && product.tags.length > 0) {
                    tagsContainer.innerHTML = '';
                    tagsContainer.classList.remove('empty');
                    product.tags.forEach(tag => {
                        const tagItem = document.createElement('div');
                        tagItem.className = 'tag-item';
                        tagItem.innerHTML = `
                            <span>${tag}</span>
                            <button type="button" class="tag-remove" title="Remove tag">&times;</button>
                        `;
                        const removeBtn = tagItem.querySelector('.tag-remove');
                        removeBtn.addEventListener('click', () => {
                            tagItem.remove();
                            if (tagsContainer.children.length === 0) {
                                tagsContainer.classList.add('empty');
                            }
                        });
                        tagsContainer.appendChild(tagItem);
                    });
                }
                
                // Populate colors (always visible)
                const defaultColorInput = document.getElementById('defaultColorInput');
                const colorsContainer = document.getElementById('colorsContainer');
                
                if (product.colors && product.colors.length > 0) {
                    // First color goes to default color input
                    if (defaultColorInput) {
                        defaultColorInput.value = product.colors[0];
                    }
                    
                    // Remaining colors go to additional colors container
                    if (colorsContainer) {
                        colorsContainer.innerHTML = '';
                        colorsContainer.classList.remove('empty');
                        
                        // Skip first color (already in default input)
                        for (let i = 1; i < product.colors.length; i++) {
                            const color = product.colors[i];
                            const colorItem = document.createElement('div');
                            colorItem.className = 'tag-item';
                            colorItem.innerHTML = `
                                <span>${color}</span>
                                <button type="button" class="tag-remove" title="Remove color">&times;</button>
                            `;
                            const removeBtn = colorItem.querySelector('.tag-remove');
                            removeBtn.addEventListener('click', () => {
                                colorItem.remove();
                                if (colorsContainer.children.length === 0) {
                                    colorsContainer.classList.add('empty');
                                }
                                updateVariantsDisplay();
                            });
                            colorsContainer.appendChild(colorItem);
                        }
                        
                        if (product.colors.length === 1) {
                            colorsContainer.classList.add('empty');
                        }
                    }
                } else {
                    // Clear inputs if no colors exist
                    if (defaultColorInput) {
                        defaultColorInput.value = '';
                    }
                    if (colorsContainer) {
                        colorsContainer.innerHTML = '';
                        colorsContainer.classList.add('empty');
                    }
                }
                
                // Populate sizes
                const sizesContainer = document.getElementById('sizesContainer');
                const enableSizes = document.getElementById('enableSizes');
                const sizesSection = document.getElementById('sizesSection');
                
                if (product.sizes && product.sizes.length > 0) {
                    // Enable sizes section
                    if (enableSizes) {
                        enableSizes.checked = true;
                    }
                    if (sizesSection) {
                        sizesSection.style.display = 'block';
                    }
                    
                    // Populate sizes
                    if (sizesContainer) {
                        sizesContainer.innerHTML = '';
                        sizesContainer.classList.remove('empty');
                        product.sizes.forEach(size => {
                            const sizeItem = document.createElement('div');
                            sizeItem.className = 'tag-item';
                            sizeItem.innerHTML = `
                                <span>${size}</span>
                                <button type="button" class="tag-remove" title="Remove size">&times;</button>
                            `;
                            const removeBtn = sizeItem.querySelector('.tag-remove');
                            removeBtn.addEventListener('click', () => {
                                sizeItem.remove();
                                if (sizesContainer.children.length === 0) {
                                    sizesContainer.classList.add('empty');
                                }
                                updateVariantsDisplay();
                            });
                            sizesContainer.appendChild(sizeItem);
                        });
                    }
                } else {
                    // Disable sizes section
                    if (enableSizes) {
                        enableSizes.checked = false;
                    }
                    if (sizesSection) {
                        sizesSection.style.display = 'none';
                    }
                    if (sizesContainer) {
                        sizesContainer.innerHTML = '';
                        sizesContainer.classList.add('empty');
                    }
                }
                
                // Update variants display panel
                updateVariantsDisplay();
                
                // Populate images
                const previewGrid = document.getElementById('imagePreviewGrid');
                if (previewGrid && product.images && product.images.length > 0) {
                    previewGrid.innerHTML = '';
                    product.images.forEach(imageUrl => {
                        const preview = document.createElement('div');
                        preview.className = 'image-preview';
                        preview.style.cssText = `
                            position: relative;
                            width: 100px;
                            height: 100px;
                            border-radius: var(--radius-sm);
                            overflow: hidden;
                            box-shadow: var(--shadow-sm);
                        `;
                        preview.innerHTML = `
                            <img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover;">
                            <button onclick="this.parentElement.remove()" style="
                                position: absolute;
                                top: 4px;
                                right: 4px;
                                background: rgba(255, 255, 255, 0.9);
                                border: none;
                                border-radius: 50%;
                                width: 24px;
                                height: 24px;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 16px;
                                color: var(--danger);
                            ">&times;</button>
                        `;
                        previewGrid.appendChild(preview);
                    });
                }
                
                showNotification('Product loaded for editing', 'info');
            } else {
                showNotification('Failed to load product', 'error');
            }
        })
        .catch(error => {
            console.error('Error loading product:', error);
            showNotification('Error loading product', 'error');
        });
}

// Edit category (placeholder)
function editCategory(categoryId) {
    showNotification('Edit category feature coming soon', 'info');
    // TODO: Implement edit category functionality
}

// ========================================
// Category Manager
// ========================================
function setupCategoryManager() {
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const categoryForm = document.getElementById('categoryForm');

    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', () => {
            document.getElementById('categoryModalTitle').textContent = 'Add Category';
            openModal('categoryModal');
        });
    }

    if (categoryForm) {
        categoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const categoryData = {
                name: document.getElementById('categoryName').value,
                description: document.getElementById('categoryDescription').value,
                showOnMainPage: document.getElementById('categoryShowOnMain').checked
            };
            
            try {
                const response = await fetch(`${API_URL}/categories`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(categoryData)
                });
                const data = await response.json();
                
                if (data.success) {
                    showNotification('Category added successfully!', 'success');
                    closeModal(document.getElementById('categoryModal'));
                    loadCategories(); // Immediate refresh
                    populateCategoryDropdown(); // Refresh dropdown
                    loadDashboardStats(); // Refresh dashboard
                } else {
                    showNotification(data.message || 'Failed to add category', 'error');
                }
            } catch (error) {
                console.error('Error adding category:', error);
                showNotification('Error adding category', 'error');
            }
        });
    }

    // Setup edit buttons for existing categories
    document.addEventListener('click', (e) => {
        if (e.target.closest('.category-card .edit-btn')) {
            const card = e.target.closest('.category-card');
            const categoryName = card.querySelector('h4').textContent;
            
            document.getElementById('categoryModalTitle').textContent = 'Edit Category';
            document.getElementById('categoryName').value = categoryName;
            openModal('categoryModal');
        }
    });
}

// ========================================
// Form Handlers
// ========================================
function setupForms() {
    const newProductForm = document.getElementById('newProductForm');
    const saveDraftBtn = document.getElementById('saveDraft');

    if (newProductForm) {
        newProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get all tags
            const tagsContainer = document.getElementById('tagsContainer');
            const tags = [];
            if (tagsContainer) {
                tagsContainer.querySelectorAll('.tag-item span').forEach(tag => {
                    tags.push(tag.textContent);
                });
            }
            
            // Get all colors (default color + additional colors)
            const defaultColorInput = document.getElementById('defaultColorInput');
            const colorsContainer = document.getElementById('colorsContainer');
            const colors = [];
            
            // Add default color (required)
            if (defaultColorInput && defaultColorInput.value.trim()) {
                colors.push(defaultColorInput.value.trim());
            }
            
            // Add additional colors
            if (colorsContainer) {
                colorsContainer.querySelectorAll('.tag-item span').forEach(color => {
                    colors.push(color.textContent);
                });
            }
            
            // Get all sizes
            const sizesContainer = document.getElementById('sizesContainer');
            const sizes = [];
            if (sizesContainer) {
                sizesContainer.querySelectorAll('.tag-item span').forEach(size => {
                    sizes.push(size.textContent);
                });
            }
            
            // Get uploaded images
            const images = [];
            const previewGrid = document.getElementById('imagePreviewGrid');
            if (previewGrid) {
                const imagePreviews = previewGrid.querySelectorAll('.image-preview');
                for (const preview of imagePreviews) {
                    const imgUrl = preview.querySelector('img')?.src;
                    if (imgUrl && !imgUrl.startsWith('blob:')) {
                        images.push(imgUrl);
                    }
                }
            }
            
            const productData = {
                name: document.getElementById('productName').value,
                category: document.getElementById('productCategory').value,
                description: document.getElementById('productDescription').value,
                mrp: parseFloat(document.getElementById('productMRP').value),
                price: parseFloat(document.getElementById('productPrice').value),
                isVisible: document.getElementById('showOnHomepage').checked,
                isNewArrival: document.getElementById('markNewArrival').checked,
                tags: tags,
                colors: colors,
                sizes: sizes,
                images: images
            };
            
            // Debug: Log what we're sending
            console.log('=== PRODUCT DATA BEING SENT ===');
            console.log('Colors:', colors);
            console.log('Sizes:', sizes);
            console.log('Full productData:', productData);
            console.log('================================');
            
            try {
                let response;
                let successMessage;
                
                if (editingProductId) {
                    // Update existing product
                    response = await fetch(`${API_URL}/products/${editingProductId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(productData)
                    });
                    successMessage = 'Product updated successfully!';
                } else {
                    // Create new product
                    response = await fetch(`${API_URL}/products`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(productData)
                    });
                    successMessage = 'Product published successfully!';
                }
                
                const data = await response.json();
                
                console.log('=== API RESPONSE ===');
                console.log('Success:', data.success);
                console.log('Saved product colors:', data.product?.colors);
                console.log('Saved product sizes:', data.product?.sizes);
                console.log('Full response:', data);
                console.log('====================');
                
                if (data.success) {
                    showNotification(successMessage, 'success');
                    
                    // Reset form and editing state
                    newProductForm.reset();
                    editingProductId = null;
                    
                    // Update form title
                    const pageTitle = document.getElementById('pageTitle');
                    if (pageTitle && pageTitle.textContent.includes('Edit')) {
                        pageTitle.textContent = 'Add New Product';
                    }
                    
                    // Clear image previews
                    if (previewGrid) {
                        previewGrid.innerHTML = '';
                    }
                    
                    // Clear tags
                    if (tagsContainer) {
                        tagsContainer.innerHTML = '';
                        tagsContainer.classList.add('empty');
                    }
                    
                    // Clear colors
                    if (colorsContainer) {
                        colorsContainer.innerHTML = '';
                        colorsContainer.classList.add('empty');
                    }
                    
                    // Clear sizes
                    if (sizesContainer) {
                        sizesContainer.innerHTML = '';
                        sizesContainer.classList.add('empty');
                    }
                    
                    // Reload products list immediately
                    loadProducts(productsCurrentPage);
                    // Also refresh dashboard stats
                    loadDashboardStats();
                } else {
                    showNotification(data.message || 'Failed to save product', 'error');
                }
            } catch (error) {
                console.error('Error saving product:', error);
                showNotification('Error saving product', 'error');
            }
        });
    }

    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', () => {
            showNotification('Product saved as draft', 'info');
        });
    }
}

// ========================================
// Image Upload Handler
// ========================================
function setupImageUpload() {
    const uploadBox = document.getElementById('imageUploadBox');
    const fileInput = document.getElementById('productImages');
    const previewGrid = document.getElementById('imagePreviewGrid');

    if (uploadBox && fileInput) {
        // Set accept attribute for better mobile compatibility
        fileInput.setAttribute('accept', 'image/*');
        // Note: Removed 'capture' attribute - it forces camera on mobile, preventing gallery selection
        
        uploadBox.addEventListener('click', () => {
            fileInput.click();
        });

        // Drag and drop
        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.style.borderColor = 'var(--secondary-beige)';
            uploadBox.style.background = 'var(--soft-pink)';
        });

        uploadBox.addEventListener('dragleave', () => {
            uploadBox.style.borderColor = '';
            uploadBox.style.background = '';
        });

        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.style.borderColor = '';
            uploadBox.style.background = '';
            
            const files = e.dataTransfer.files;
            handleImageFiles(files, previewGrid);
        });

        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            handleImageFiles(files, previewGrid);
        });
    }
}

// Compress image before upload (for mobile compatibility)
async function compressImage(file, maxWidth = 1600, maxHeight = 1600, quality = 0.9) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Calculate new dimensions
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to blob
                canvas.toBlob((blob) => {
                    // Create new file from blob
                    const compressedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    resolve(compressedFile);
                }, 'image/jpeg', quality);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function handleImageFiles(files, previewGrid) {
    if (!previewGrid) return;

    Array.from(files).forEach(async file => {
        if (file.type.startsWith('image/')) {
            // Show loading preview
            const loadingPreview = document.createElement('div');
            loadingPreview.className = 'image-preview';
            loadingPreview.style.cssText = `
                position: relative;
                width: 100px;
                height: 100px;
                border-radius: var(--radius-sm);
                overflow: hidden;
                box-shadow: var(--shadow-sm);
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--soft-pink);
            `;
            loadingPreview.innerHTML = '<div style="color: var(--secondary-beige); font-size: 11px;">Compressing...</div>';
            previewGrid.appendChild(loadingPreview);
            
            try {
                // Compress image first (especially important for mobile photos)
                const compressedFile = await compressImage(file);
                const originalSize = (file.size / 1024 / 1024).toFixed(2);
                const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);
                console.log(`✅ Image compressed: ${originalSize}MB → ${compressedSize}MB`);
                
                loadingPreview.innerHTML = '<div style="color: var(--secondary-beige); font-size: 11px;">Uploading...</div>';
                
                // Upload to API
                const formData = new FormData();
                formData.append('image', compressedFile);
                
                console.log(`📤 Uploading to: ${API_URL}/upload/image`);
                const response = await fetch(`${API_URL}/upload/image`, {
                    method: 'POST',
                    body: formData
                });
                
                console.log(`📥 Response status: ${response.status} ${response.statusText}`);
                
                // Check if response is OK
                if (!response.ok) {
                    let errorMsg = `HTTP ${response.status}: ${response.statusText}`;
                    try {
                        const errorData = await response.json();
                        errorMsg = errorData.message || errorData.error || errorMsg;
                    } catch (e) {
                        // If response is not JSON, use status text
                    }
                    console.error('❌ Upload failed with HTTP error:', errorMsg);
                    loadingPreview.innerHTML = '<div style="color: var(--danger); font-size: 12px;">Failed</div>';
                    setTimeout(() => loadingPreview.remove(), 3000);
                    showNotification(`Upload failed: ${errorMsg}`, 'error');
                    return;
                }
                
                const data = await response.json();
                console.log('📦 Response data:', data);
                
                if (data.success && data.image && data.image.url) {
                    loadingPreview.innerHTML = `
                        <img src="${data.image.url}" style="width: 100%; height: 100%; object-fit: cover;">
                        <button onclick="this.parentElement.remove()" style="
                            position: absolute;
                            top: 4px;
                            right: 4px;
                            background: rgba(255, 255, 255, 0.9);
                            border: none;
                            border-radius: 50%;
                            width: 24px;
                            height: 24px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 16px;
                            color: var(--danger);
                        ">&times;</button>
                    `;
                    showNotification(`✅ Image uploaded (${compressedSize}MB)`, 'success');
                } else {
                    const errorMsg = data.message || data.error || 'API returned success=false';
                    console.error('❌ Upload failed:', errorMsg, 'Full response:', data);
                    loadingPreview.innerHTML = '<div style="color: var(--danger); font-size: 12px;">Failed</div>';
                    setTimeout(() => loadingPreview.remove(), 3000);
                    showNotification(`Upload failed: ${errorMsg}`, 'error');
                }
            } catch (error) {
                console.error('❌ Error uploading image:', error);
                console.error('Error details:', {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                });
                loadingPreview.innerHTML = '<div style="color: var(--danger); font-size: 12px;">Error</div>';
                setTimeout(() => loadingPreview.remove(), 3000);
                showNotification(`Upload error: ${error.message || error.toString()}`, 'error');
            }
        }
    });
}

// ========================================
// Product Filters
// ========================================
function setupProductFilters() {
    const productSearch = document.getElementById('productSearch');
    const productFilter = document.getElementById('productFilter');

    if (productSearch) {
        productSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterProducts(searchTerm, productFilter?.value || 'all');
        });
    }

    if (productFilter) {
        productFilter.addEventListener('change', (e) => {
            const filterValue = e.target.value;
            filterProducts(productSearch?.value.toLowerCase() || '', filterValue);
        });
    }
}

function filterProducts(searchTerm, filterValue) {
    const rows = document.querySelectorAll('#productsTableBody tr');
    
    rows.forEach(row => {
        const productName = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
        const matchesSearch = productName.includes(searchTerm);
        
        let matchesFilter = true;
        if (filterValue !== 'all') {
            // Implement filter logic based on your data structure
            matchesFilter = true; // Placeholder
        }
        
        row.style.display = (matchesSearch && matchesFilter) ? '' : 'none';
    });
}

// ========================================
// Order Filters
// ========================================
function setupOrderFilters() {
    const orderSearch = document.getElementById('orderSearch');
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    const dateFrom = document.getElementById('orderDateFrom');
    const dateTo = document.getElementById('orderDateTo');

    if (orderSearch) {
        orderSearch.addEventListener('input', (e) => {
            filterOrders();
        });
    }

    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', () => {
            filterOrders();
        });
    }

    if (dateFrom) {
        dateFrom.addEventListener('change', () => {
            filterOrders();
        });
    }

    if (dateTo) {
        dateTo.addEventListener('change', () => {
            filterOrders();
        });
    }

    // Order status selector change
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('status-select')) {
            const newStatus = e.target.value;
            e.target.className = `status-select ${newStatus}`;
            showNotification(`Order status updated to ${newStatus}`, 'success');
        }
    });
}

function filterOrders() {
    const searchTerm = document.getElementById('orderSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('orderStatusFilter')?.value || 'all';
    const orders = document.querySelectorAll('.order-card');
    
    orders.forEach(order => {
        const orderId = order.querySelector('.order-id-section h4')?.textContent.toLowerCase() || '';
        const customer = order.querySelector('.info-row span')?.textContent.toLowerCase() || '';
        const status = order.querySelector('.status-select')?.value || '';
        
        const matchesSearch = orderId.includes(searchTerm) || customer.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || status === statusFilter;
        
        order.style.display = (matchesSearch && matchesStatus) ? '' : 'none';
    });
}

// ========================================
// Tag Input Handler
// ========================================
function setupTagInput() {
    const addTagBtn = document.getElementById('addTagBtn');
    const tagInput = document.getElementById('tagInput');
    const tagsContainer = document.getElementById('tagsContainer');

    if (addTagBtn && tagInput && tagsContainer) {
        // Add tag on button click
        addTagBtn.addEventListener('click', () => {
            addTag(tagInput, tagsContainer);
        });

        // Add tag on Enter key
        tagInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTag(tagInput, tagsContainer);
            }
        });
    }

    // Setup color input (always visible, no toggle needed)
    const addColorBtn = document.getElementById('addColorBtn');
    const colorInput = document.getElementById('colorInput');
    const colorsContainer = document.getElementById('colorsContainer');
    const defaultColorInput = document.getElementById('defaultColorInput');

    // Update display when default color changes
    if (defaultColorInput) {
        defaultColorInput.addEventListener('input', () => {
            updateVariantsDisplay();
        });
    }

    if (addColorBtn && colorInput && colorsContainer) {
        console.log('✅ Color input elements found');
        
        addColorBtn.addEventListener('click', () => {
            console.log('Color button clicked!');
            addTag(colorInput, colorsContainer);
            updateVariantsDisplay();
        });

        colorInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('Color Enter key pressed!');
                addTag(colorInput, colorsContainer);
                updateVariantsDisplay();
            }
        });
    } else {
        console.error('❌ Missing color input elements:', {
            addColorBtn: !!addColorBtn,
            colorInput: !!colorInput,
            colorsContainer: !!colorsContainer
        });
    }

    // Setup size input
    const enableSizes = document.getElementById('enableSizes');
    const sizesSection = document.getElementById('sizesSection');
    const addSizeBtn = document.getElementById('addSizeBtn');
    const sizeInput = document.getElementById('sizeInput');
    const sizesContainer = document.getElementById('sizesContainer');

    if (enableSizes && sizesSection) {
        enableSizes.addEventListener('change', () => {
            sizesSection.style.display = enableSizes.checked ? 'block' : 'none';
        });
    }

    if (addSizeBtn && sizeInput && sizesContainer) {
        console.log('✅ Size input elements found');
        
        addSizeBtn.addEventListener('click', () => {
            console.log('Size button clicked!');
            addTag(sizeInput, sizesContainer);
            updateVariantsDisplay();
        });

        sizeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('Size Enter key pressed!');
                addTag(sizeInput, sizesContainer);
                updateVariantsDisplay();
            }
        });
    } else {
        console.error('❌ Missing size input elements:', {
            addSizeBtn: !!addSizeBtn,
            sizeInput: !!sizeInput,
            sizesContainer: !!sizesContainer
        });
    }
}

// Update the variants display panel in real-time
function updateVariantsDisplay() {
    const defaultColorInput = document.getElementById('defaultColorInput');
    const colorsContainer = document.getElementById('colorsContainer');
    const sizesContainer = document.getElementById('sizesContainer');
    const displayColors = document.getElementById('displayColors');
    const displaySizes = document.getElementById('displaySizes');
    const variantsPanel = document.querySelector('.variants-display-panel');
    
    if (!displayColors || !displaySizes || !variantsPanel) return;
    
    // Get all colors (default + additional)
    const colors = [];
    if (defaultColorInput && defaultColorInput.value.trim()) {
        colors.push(defaultColorInput.value.trim());
    }
    if (colorsContainer) {
        const additionalColors = Array.from(colorsContainer.querySelectorAll('.tag-item span'))
            .map(tag => tag.textContent.trim());
        colors.push(...additionalColors);
    }
    
    // Get sizes
    const sizes = [];
    if (sizesContainer) {
        const sizeList = Array.from(sizesContainer.querySelectorAll('.tag-item span'))
            .map(tag => tag.textContent.trim());
        sizes.push(...sizeList);
    }
    
    // Update display
    displayColors.textContent = colors.length > 0 ? colors.join(', ') : 'None';
    displaySizes.textContent = sizes.length > 0 ? sizes.join(', ') : 'None';
    
    // Show panel if variants exist
    if (colors.length > 0 || sizes.length > 0) {
        variantsPanel.style.display = 'block';
    } else {
        variantsPanel.style.display = 'none';
    }
}

function addTag(input, container) {
    const tagText = input.value.trim();
    
    console.log('addTag called:', {
        tagText,
        container: container?.id
    });
    
    if (tagText === '') {
        showNotification('Please enter a tag', 'warning');
        return;
    }

    // Remove empty class
    container.classList.remove('empty');

    // Create tag element
    const tagItem = document.createElement('div');
    tagItem.className = 'tag-item';
    tagItem.innerHTML = `
        <span>${tagText}</span>
        <button type="button" class="tag-remove" title="Remove tag">&times;</button>
    `;

    // Add remove functionality
    const removeBtn = tagItem.querySelector('.tag-remove');
    removeBtn.addEventListener('click', () => {
        tagItem.remove();
        
        // Add empty class back if no tags
        if (container.children.length === 0) {
            container.classList.add('empty');
        }
    });

    container.appendChild(tagItem);
    input.value = '';
    input.focus();
    
    console.log('Tag added successfully:', tagText);
}

// ========================================
// Product Actions Handler
// ========================================
function setupProductActions() {
    // Edit product buttons
    document.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.products-table .edit-btn');
        if (editBtn) {
            const row = editBtn.closest('tr');
            const productName = row.querySelector('td:nth-child(2) strong').textContent;
            
            showNotification(`Editing product: ${productName}`, 'info');
            
            // Switch to new product tab and populate form
            const newProductTab = document.querySelector('.nav-item[data-tab="new-product"]');
            if (newProductTab) {
                newProductTab.click();
                // Here you would populate the form with product data
                document.getElementById('productName').value = productName;
            }
        }

        // Delete product buttons
        const deleteBtn = e.target.closest('.products-table .delete-btn');
        if (deleteBtn) {
            const row = deleteBtn.closest('tr');
            const productId = row.getAttribute('data-product-id');
            const productName = row.querySelector('td:nth-child(2) strong').textContent;
            
            if (confirm(`Are you sure you want to delete "${productName}"?`)) {
                deleteProduct(productId);
            }
        }
    });
}

// ========================================
// Notification System
// ========================================
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const colors = {
        success: 'var(--success)',
        error: 'var(--danger)',
        warning: 'var(--warning)',
        info: 'var(--info)'
    };
    
    // Error messages stay longer and are wider
    const isError = type === 'error';
    const duration = isError ? 6000 : 3000; // Errors show for 6 seconds
    
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
        max-width: ${isError ? '500px' : '400px'};
        word-wrap: break-word;
        white-space: pre-wrap;
        line-height: 1.5;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Add notification animations to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// Stock Management Functions
// ========================================

async function manageStock(productId) {
    if (!apiAvailable) {
        showNotification('API not available', 'error');
        return;
    }
    
    try {
        // Fetch product details
        const response = await fetch(`${API_URL}/products/${productId}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        
        const data = await response.json();
        const product = data.product;
        
        // Check if product has colors or sizes
        const hasColors = product.colors && product.colors.length > 0;
        const hasSizes = product.sizes && product.sizes.length > 0;
        
        if (!hasColors && !hasSizes) {
            // Product has no variants - toggle entire product stock
            showSimpleStockModal(product);
        } else {
            // Product has variants - show variant selection
            showVariantStockModal(product);
        }
    } catch (error) {
        console.error('Error loading product:', error);
        showNotification('Error loading product details', 'error');
    }
}

function showSimpleStockModal(product) {
    const isOutOfStock = product.outOfStock === true;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>Manage Stock - ${product.name}</h2>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 1.5rem; color: #666;">
                    This product has no color or size variants.
                </p>
                <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 8px;">
                    <label style="flex: 1; font-weight: 500; cursor: pointer;">
                        <input type="checkbox" id="simple-out-of-stock" ${isOutOfStock ? 'checked' : ''} 
                               style="margin-right: 0.5rem; width: 18px; height: 18px; cursor: pointer;">
                        Mark entire product as out of stock
                    </label>
                </div>
                <p style="margin-top: 1rem; font-size: 0.9rem; color: #999;">
                    <strong>Note:</strong> Out of stock products will be hidden from customers on the website.
                </p>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                <button class="btn-primary" onclick="saveSimpleStock('${product._id}')">Save Changes</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

async function saveSimpleStock(productId) {
    const isOutOfStock = document.getElementById('simple-out-of-stock').checked;
    
    try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ outOfStock: isOutOfStock })
        });
        
        if (!response.ok) throw new Error('Failed to update stock');
        
        showNotification('✅ Stock status updated successfully', 'success');
        document.querySelector('.modal').remove();
        loadProducts();
    } catch (error) {
        console.error('Error updating stock:', error);
        showNotification('Error updating stock status', 'error');
    }
}

function showVariantStockModal(product) {
    const hasColors = product.colors && product.colors.length > 0;
    const hasSizes = product.sizes && product.sizes.length > 0;
    const outOfStockVariants = product.outOfStockVariants || [];
    
    let variantsHTML = '';
    
    if (hasColors && hasSizes) {
        // Product has both colors and sizes - create grid
        variantsHTML = `
            <div style="margin-bottom: 1rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; padding: 0.75rem; background: #fff3cd; border-radius: 6px;">
                    <input type="checkbox" id="mark-entire-product" style="width: 18px; height: 18px; cursor: pointer;">
                    <strong style="color: #856404;">Mark entire product as out of stock</strong>
                </label>
            </div>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f5f5f5;">
                            <th style="padding: 0.75rem; text-align: left; border: 1px solid #ddd;">Color</th>
                            ${product.sizes.map(size => `
                                <th style="padding: 0.75rem; text-align: center; border: 1px solid #ddd;">${size}</th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${product.colors.map(color => `
                            <tr>
                                <td style="padding: 0.75rem; font-weight: 500; border: 1px solid #ddd;">${color}</td>
                                ${product.sizes.map(size => {
                                    const variantKey = `${color}|${size}`;
                                    const isChecked = outOfStockVariants.includes(variantKey);
                                    return `
                                        <td style="padding: 0.75rem; text-align: center; border: 1px solid #ddd;">
                                            <input type="checkbox" class="variant-checkbox" value="${variantKey}" 
                                                   ${isChecked ? 'checked' : ''} 
                                                   style="width: 18px; height: 18px; cursor: pointer;">
                                        </td>
                                    `;
                                }).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else if (hasColors) {
        // Product has only colors
        variantsHTML = `
            <div style="margin-bottom: 1rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; padding: 0.75rem; background: #fff3cd; border-radius: 6px;">
                    <input type="checkbox" id="mark-entire-product" style="width: 18px; height: 18px; cursor: pointer;">
                    <strong style="color: #856404;">Mark entire product as out of stock</strong>
                </label>
            </div>
            <div style="display: grid; gap: 0.75rem;">
                ${product.colors.map(color => {
                    const isChecked = outOfStockVariants.includes(color);
                    return `
                        <label style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #f5f5f5; border-radius: 6px; cursor: pointer;">
                            <input type="checkbox" class="variant-checkbox" value="${color}" 
                                   ${isChecked ? 'checked' : ''} 
                                   style="width: 18px; height: 18px; cursor: pointer;">
                            <span style="font-weight: 500;">${color}</span>
                        </label>
                    `;
                }).join('')}
            </div>
        `;
    } else if (hasSizes) {
        // Product has only sizes
        variantsHTML = `
            <div style="margin-bottom: 1rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; padding: 0.75rem; background: #fff3cd; border-radius: 6px;">
                    <input type="checkbox" id="mark-entire-product" style="width: 18px; height: 18px; cursor: pointer;">
                    <strong style="color: #856404;">Mark entire product as out of stock</strong>
                </label>
            </div>
            <div style="display: grid; gap: 0.75rem;">
                ${product.sizes.map(size => {
                    const isChecked = outOfStockVariants.includes(size);
                    return `
                        <label style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #f5f5f5; border-radius: 6px; cursor: pointer;">
                            <input type="checkbox" class="variant-checkbox" value="${size}" 
                                   ${isChecked ? 'checked' : ''} 
                                   style="width: 18px; height: 18px; cursor: pointer;">
                            <span style="font-weight: 500;">Size ${size}</span>
                        </label>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h2>Manage Stock - ${product.name}</h2>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 1.5rem; color: #666;">
                    Select which ${hasColors && hasSizes ? 'color and size combinations' : hasColors ? 'colors' : 'sizes'} are out of stock:
                </p>
                ${variantsHTML}
                <p style="margin-top: 1.5rem; font-size: 0.9rem; color: #999;">
                    <strong>Note:</strong> Out of stock variants will be hidden from customers. 
                    ${hasColors && hasSizes ? 'If all variants of a color or size are out of stock, that option will be hidden.' : ''}
                    If the entire product is out of stock, it will be hidden from the website.
                </p>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                <button class="btn-primary" onclick="saveVariantStock('${product._id}')">Save Changes</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Add event listener for "mark entire product" checkbox
    const markEntireCheckbox = document.getElementById('mark-entire-product');
    if (markEntireCheckbox) {
        markEntireCheckbox.addEventListener('change', function() {
            const variantCheckboxes = document.querySelectorAll('.variant-checkbox');
            variantCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
}

async function saveVariantStock(productId) {
    const markEntire = document.getElementById('mark-entire-product');
    const isEntireProductOutOfStock = markEntire ? markEntire.checked : false;
    
    // Collect all checked variants
    const checkedVariants = Array.from(document.querySelectorAll('.variant-checkbox:checked'))
        .map(checkbox => checkbox.value);
    
    try {
        const updateData = {
            outOfStock: isEntireProductOutOfStock,
            outOfStockVariants: checkedVariants
        };
        
        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        
        if (!response.ok) throw new Error('Failed to update stock');
        
        showNotification('✅ Stock status updated successfully', 'success');
        document.querySelector('.modal').remove();
        loadProducts();
    } catch (error) {
        console.error('Error updating stock:', error);
        showNotification('Error updating stock status', 'error');
    }
}

// ========================================
// Sample Data Loading (for demonstration)
// ========================================

// You can uncomment this to load sample data
// Initialize complete
showNotification('Welcome to Sia Creation Admin Panel', 'success');
