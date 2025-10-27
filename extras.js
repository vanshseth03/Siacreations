// Extras script: fixes navigation, implements wishlist sidebar UI and integrations
(function(){
    // Utility
    function $(sel, root=document) { return root.querySelector(sel); }
    function $all(sel, root=document) { return Array.from(root.querySelectorAll(sel)); }

    // Replace nodes to remove previously attached listeners (cloning technique)
    function replaceNodes(selector) {
        $all(selector).forEach(node => {
            const clone = node.cloneNode(true);
            node.parentNode.replaceChild(clone, node);
        });
    }

    function setupLinks() {
        // Replace nav and footer links so earlier preventDefault handlers are removed
        replaceNodes('.nav-link');
        replaceNodes('.footer-link');

        // Reattach friendly behavior
        $all('.nav-link').forEach(link => {
            link.addEventListener('click', function(e){
                const href = this.getAttribute('href') || '';
                const tab = this.getAttribute('data-tab');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    if (typeof window.switchTab === 'function') window.switchTab(tab);
                } else {
                    // allow navigation to other pages (no preventDefault)
                }
            });
        });

        $all('.footer-link').forEach(link => {
            link.addEventListener('click', function(e){
                const href = this.getAttribute('href') || '';
                const tab = this.getAttribute('data-tab');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    if (typeof window.switchTab === 'function') window.switchTab(tab);
                }
            });
        });
    }

    // Wishlist sidebar management (uses existing wishlist array and storage functions)
    function toggleWishlistSidebar() {
        const sidebar = document.getElementById('wishlist-sidebar');
        if (!sidebar) return;
        sidebar.classList.toggle('open');
        sidebar.classList.toggle('active');
        if (sidebar.classList.contains('open')) {
            renderWishlistSidebar();
        }
    }

    function renderWishlistSidebar() {
        const container = document.getElementById('wishlist-sidebar-items');
        if (!container) return;
        container.innerHTML = '';
        
        // Ensure wishlist is initialized
        if (typeof window.wishlist === 'undefined') {
            window.wishlist = [];
        }
        
        if (window.wishlist.length === 0) {
            container.innerHTML = '<div class="wishlist-empty-message">Your wishlist is empty</div>';
            if (typeof window.updateWishlistCount === 'function') window.updateWishlistCount();
            return;
        }
        const html = window.wishlist.map(item => {
            const qty = item.quantity || 1;
            const itemId = item._id || item.id;
            
            // Handle image - could be URL or emoji
            const imageUrl = item.images && item.images[0] ? item.images[0] : item.image;
            const imageHTML = imageUrl && imageUrl.startsWith('http') 
                ? `<img src="${imageUrl}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">` 
                : `<div style="font-size: 2.5rem; display: flex; align-items: center; justify-content: center; height: 100%;">${imageUrl || '🛍️'}</div>`;
            
            // Build variant info display - styled like cart items
            let variantInfo = '';
            if (item.selectedColor || item.selectedSize) {
                const parts = [];
                if (item.selectedColor) {
                    parts.push(`<span><strong>Colour:</strong> ${item.selectedColor}</span>`);
                }
                if (item.selectedSize) {
                    parts.push(`<span><strong>Size:</strong> ${item.selectedSize}</span>`);
                }
                variantInfo = `<div style="font-size: 0.8rem; color: #666; margin-top: 0.25rem; display: flex; gap: 1rem; flex-wrap: wrap;">${parts.join('')}</div>`;
            }
            
            return `
                <div class="wishlist-item" data-id="${itemId}">
                    <div class="wishlist-item-image" onclick="window.location.href='item-view.html?id=${itemId}'">${imageHTML}</div>
                    <div class="wishlist-item-info">
                        <div class="wishlist-item-name">${item.name}</div>
                        ${variantInfo}
                        <div class="wishlist-item-price">₹${item.price}</div>
                        <div class="wishlist-item-controls">
                            <button class="add-to-cart" onclick="event.stopPropagation(); if(typeof addToCartFromWishlist === 'function') addToCartFromWishlist('${itemId}')">Add to Cart</button>
                            <button class="remove-btn" onclick="event.stopPropagation(); if(typeof removeFromWishlist === 'function') removeFromWishlist('${itemId}'); renderWishlistSidebar()">✕</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        container.innerHTML = html;

        if (typeof window.updateWishlistCount === 'function') window.updateWishlistCount();
    }

    function addAllWishlistToCart() {
        if (!window.wishlist || window.wishlist.length === 0) {
            // Show feedback instead of alert
            const feedback = document.createElement('div');
            feedback.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: #e74c3c;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                font-weight: 600;
            `;
            feedback.textContent = 'Your wishlist is empty!';
            
            document.body.appendChild(feedback);
            
            setTimeout(() => {
                feedback.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    if (document.body.contains(feedback)) {
                        document.body.removeChild(feedback);
                    }
                }, 300);
            }, 2000);
            return;
        }
        
        // Get all products from wishlist with their stored variants
        const itemsToAdd = [...window.wishlist];
        let addedCount = 0;
        
        // Add each item to cart using stored variants (no modal needed)
        itemsToAdd.forEach(wishlistItem => {
            // Fetch full product data
            let fullProduct = null;
            const productId = wishlistItem._id || wishlistItem.id;
            
            if (window.productData) {
                for (const category in window.productData) {
                    fullProduct = window.productData[category].find(p => (p._id || p.id) === productId);
                    if (fullProduct) break;
                }
            }
            
            if (!fullProduct && window.allProducts) {
                fullProduct = window.allProducts.find(p => (p._id || p.id) === productId);
            }
            
            const product = fullProduct || wishlistItem;
            
            // Use stored variants from wishlist item
            const storedColor = wishlistItem.selectedColor || null;
            const storedSize = wishlistItem.selectedSize || null;
            
            // Add to cart with stored variants using addToCartDirectly
            if (typeof window.addToCartDirectly === 'function') {
                window.addToCartDirectly(product, storedColor, storedSize);
                addedCount++;
            }
        });
        
        // Clear wishlist after adding all to cart
        window.wishlist = [];
        if (typeof window.saveWishlistToStorage === 'function') window.saveWishlistToStorage();
        if (typeof window.updateWishlistCount === 'function') window.updateWishlistCount();
        if (typeof window.updateAllWishlistCounts === 'function') window.updateAllWishlistCounts();
        if (typeof window.updateWishlistDisplay === 'function') window.updateWishlistDisplay();
        if (typeof window.updateProductCardHearts === 'function') window.updateProductCardHearts();
        renderWishlistSidebar();
        
        // Show feedback
        if (typeof window.showWishlistFeedback === 'function') {
            window.showWishlistFeedback(`${addedCount} item${addedCount > 1 ? 's' : ''} added to cart!`, 'cart');
        } else {
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
                font-weight: 600;
            `;
            feedback.textContent = `${addedCount} item${addedCount > 1 ? 's' : ''} added to cart!`;
            
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
        
        // Close wishlist sidebar
        const sidebar = document.getElementById('wishlist-sidebar');
        if (sidebar) {
            sidebar.classList.remove('open', 'active');
        }
    }

    // Augment existing toggleWishlist to also update sidebar WITHOUT opening it
    const originalToggleWishlist = window.toggleWishlist;
    if (typeof originalToggleWishlist === 'function') {
        window.toggleWishlist = function(productId) {
            // Call original toggleWishlist
            originalToggleWishlist(productId);
            // After toggling, just render sidebar content (DON'T open it)
            renderWishlistSidebar();
        };
    }

    // Expose global helpers
    window.toggleWishlistSidebar = toggleWishlistSidebar;
    window.renderWishlistSidebar = renderWishlistSidebar;
    window.addAllWishlistToCart = addAllWishlistToCart;

    // Initialize when DOM ready
    document.addEventListener('DOMContentLoaded', function(){
        try { setupLinks(); } catch(e) { /* Silent fail */ }
        try { 
            if (typeof window.loadWishlistFromStorage === 'function') {
                window.loadWishlistFromStorage();
            }
            renderWishlistSidebar(); 
        } catch(e) { /* Silent fail */ }

        // Update counts periodically
        setInterval(function(){ 
            if (typeof window.updateWishlistCount === 'function') window.updateWishlistCount();
            if (typeof window.updateCartCount === 'function') window.updateCartCount();
        }, 1000);
    });
})();
