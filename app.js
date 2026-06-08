document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // TAB CONTROLS
  // ==========================================================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const viewportControls = document.getElementById('viewport-controls');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Deactivate all tabs
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active-content'));
      
      // Activate clicked tab
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(`${tabId}-view`).classList.add('active-content');
      
      // Hide viewport controls if Submission Document is selected
      if (tabId === 'submission') {
        viewportControls.style.display = 'none';
      } else {
        viewportControls.style.display = 'flex';
      }
    });
  });

  // ==========================================================================
  // VIEWPORT MOCKUP CONTROLS
  // ==========================================================================
  const viewportButtons = document.querySelectorAll('.viewport-btn');
  const canvasContainer = document.getElementById('canvas-container');

  viewportButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Deactivate all buttons
      viewportButtons.forEach(b => b.classList.remove('active'));
      
      // Activate clicked button
      btn.classList.add('active');
      const viewport = btn.getAttribute('data-viewport');
      
      // Update canvas container class
      canvasContainer.className = ''; // Reset all classes
      canvasContainer.classList.add(`viewport-${viewport}`);
    });
  });

  // ==========================================================================
  // MOBILE MENU TOGGLE
  // ==========================================================================
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggleBtn && mobileMenu) {
    menuToggleBtn.addEventListener('click', () => {
      menuToggleBtn.classList.toggle('active');
      
      // Toggle display of mobile menu
      if (mobileMenu.style.display === 'block') {
        mobileMenu.style.display = 'none';
      } else {
        mobileMenu.style.display = 'block';
      }
    });

    // Close menu when clicking navigation items
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.style.display = 'none';
        menuToggleBtn.classList.remove('active');
      });
    });
  }

  // ==========================================================================
  // SEARCH FILTERING SYSTEM
  // ==========================================================================
  const searchInput = document.getElementById('product-search');
  const productCards = document.querySelectorAll('.product-card');
  const productsGrid = document.getElementById('products-grid-list');
  const emptySearchState = document.getElementById('empty-search-state');
  const clearSearchBtn = document.getElementById('clear-search-btn');

  function filterProducts(query) {
    const cleanQuery = query.trim().toLowerCase();
    let matchCount = 0;

    productCards.forEach(card => {
      const productName = card.getAttribute('data-name');
      const productCategory = card.getAttribute('data-category');
      
      if (productName.includes(cleanQuery) || productCategory.includes(cleanQuery)) {
        card.classList.remove('hidden');
        matchCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (matchCount === 0) {
      productsGrid.classList.add('hidden');
      emptySearchState.classList.remove('hidden');
    } else {
      productsGrid.classList.remove('hidden');
      emptySearchState.classList.add('hidden');
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterProducts(e.target.value);
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterProducts('');
    });
  }

  // ==========================================================================
  // INTERACTIVE CART SYSTEM
  // ==========================================================================
  let cart = [];
  const cartBtn = document.getElementById('cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartCounter = document.getElementById('cart-counter');
  const cartDrawerCount = document.getElementById('cart-drawer-count');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotal = document.getElementById('cart-subtotal');
  
  // Open / Close Drawer
  function openCart() {
    cartOverlay.classList.add('open');
  }

  function closeCart() {
    cartOverlay.classList.remove('open');
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  
  // Close drawer on overlay click
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) {
        closeCart();
      }
    });
  }

  // Add Item to Cart
  const addButtons = document.querySelectorAll('.cart-add-btn, .btn-quick-add');
  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const title = btn.getAttribute('data-title');
      const price = parseFloat(btn.getAttribute('data-price'));
      const img = btn.getAttribute('data-img');
      
      addToCart(id, title, price, img);
      
      // Micro-animation on cart badge
      if (cartCounter) {
        cartCounter.style.transform = 'scale(1.4)';
        setTimeout(() => {
          cartCounter.style.transform = 'scale(1)';
        }, 300);
      }
      
      // Auto open cart to provide confirmation feedback
      openCart();
    });
  });

  function addToCart(id, title, price, img) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id, title, price, img, quantity: 1 });
    }
    updateCartUI();
  }

  function updateCartUI() {
    // Save state
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update Badge & Counts
    if (cartCounter) cartCounter.textContent = totalItems;
    if (cartDrawerCount) cartDrawerCount.textContent = totalItems;

    // Render items
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your shopping cart is empty. Start adding items to build your skin ritual!</div>';
      if (cartSubtotal) cartSubtotal.textContent = '$0.00';
      return;
    }

    let itemsHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      itemsHTML += `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.title}" class="cart-item-img">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.title}</h4>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-item-qty-row">
              <div class="qty-controls">
                <button class="qty-btn minus-qty" data-id="${item.id}">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn plus-qty" data-id="${item.id}">+</button>
              </div>
              <button class="remove-item-btn" data-id="${item.id}">Remove</button>
            </div>
          </div>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = itemsHTML;
    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;

    // Add events to dynamic buttons inside the cart
    const plusButtons = cartItemsContainer.querySelectorAll('.plus-qty');
    const minusButtons = cartItemsContainer.querySelectorAll('.minus-qty');
    const removeButtons = cartItemsContainer.querySelectorAll('.remove-item-btn');

    plusButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = cart.find(item => item.id === id);
        if (item) {
          item.quantity += 1;
          updateCartUI();
        }
      });
    });

    minusButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = cart.find(item => item.id === id);
        if (item && item.quantity > 1) {
          item.quantity -= 1;
          updateCartUI();
        } else if (item && item.quantity === 1) {
          cart = cart.filter(item => item.id !== id);
          updateCartUI();
        }
      });
    });

    removeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
      });
    });
  }

  // ==========================================================================
  // WIREFRAME ANNOTATION LOGIC
  // ==========================================================================
  const annotationMarkers = document.querySelectorAll('.annotation-marker');
  const detailPanel = document.getElementById('detail-panel');
  const annotationTitle = document.getElementById('annotation-title');
  const annotationDesc = document.getElementById('annotation-desc');

  const notes = {
    'header-flow': {
      title: "1. Header Navigation Flow & Adaptability",
      desc: "On Desktop view, the header establishes horizontal hierarchy with direct navigation links, centered branding, and an expandable search field. On Mobile views, the layout collapses gracefully. The category menu and corporate information tuck into a toggleable slide-out hamburger panel to maximize clean screenspace, and the search input collapses into an icon click state to avoid layout crowding."
    },
    'hero-ux': {
      title: "2. Hero Section Anchor & Conversion Funnel",
      desc: "The visual anchor of the landing page. It introduces the brand’s tagline, core identity heading, and supporting subtext to communicate value instantly. A two-button CTA hierarchy is implemented: the bold Primary CTA (Shop The Collection) stands out clearly to drive immediate purchases, while the outline Secondary CTA (Explore Rituals) targets users higher in the consideration funnel."
    },
    'categories-layout': {
      title: "3. Category Hub Grid",
      desc: "Quickly segments and guides traffic. Displays round, minimal circles with symbolic emoji placeholders and helper text to categorize inventory (Skincare, Makeup, Haircare, Fragrance). Desktop arranges these in a clean 4-column row. On Mobile, it reflows to a 2x2 grid or horizontal swiper, minimizing scroll length while maintaining finger-friendly tap targets (minimum 48x48px)."
    },
    'card-hierarchy': {
      title: "4. Product Card Visual Hierarchy",
      desc: "Designed to minimize friction. The product image takes up 60% of the card area, serving as the visual hook. The title uses an editorial serif, and the helper text displays subcategories. The price sits directly next to a quick Add to Cart '+' button. On desktop hover, a full Quick Add button slides up. On mobile, the CTA is permanently displayed to eliminate hover dependency."
    },
    'promo-friction': {
      title: "5. Urgency Promotion & FOMO Trigger",
      desc: "A wide, horizontal promotion block that breaks the grid pattern to recapture user attention. An interactive countdown timer is embedded directly in the content copy. Ticking live hours/minutes/seconds builds a psychological trigger of scarcity (FOMO), promoting high click-through conversion rates for the featured Solstice package."
    },
    'footer-ux': {
      title: "6. Footer Accordions & Trust Marks",
      desc: "Maintains structured brand communication. The columns split neatly on desktop. On mobile, these menus transform into vertical accordions with expand/collapse headers, preventing the layout from stretching into massive vertical pages. Standard newsletter sign-up is placed on the far right to encourage community newsletter list growth."
    }
  };

  annotationMarkers.forEach(marker => {
    // Show on Hover or Click
    const showDetails = () => {
      const noteKey = marker.getAttribute('data-note');
      const info = notes[noteKey];
      if (info) {
        annotationTitle.textContent = info.title;
        annotationDesc.textContent = info.desc;
        
        // Highlight marker
        annotationMarkers.forEach(m => m.style.backgroundColor = 'var(--wf-marker)');
        marker.style.backgroundColor = 'var(--color-accent-copper)';
      }
    };

    marker.addEventListener('click', showDetails);
    marker.addEventListener('mouseenter', showDetails);
  });

  // ==========================================================================
  // COUNTDOWN TIMER SIMULATOR
  // ==========================================================================
  const hoursVal = document.getElementById('promo-hours');
  const minsVal = document.getElementById('promo-mins');
  const secsVal = document.getElementById('promo-secs');

  if (hoursVal && minsVal && secsVal) {
    let hours = 23;
    let minutes = 45;
    let seconds = 12;

    const timer = setInterval(() => {
      seconds--;
      if (seconds < 0) {
        seconds = 59;
        minutes--;
        if (minutes < 0) {
          minutes = 59;
          hours--;
          if (hours < 0) {
            // Reset timer
            hours = 23;
            minutes = 59;
            seconds = 59;
          }
        }
      }

      hoursVal.textContent = hours.toString().padStart(2, '0');
      minsVal.textContent = minutes.toString().padStart(2, '0');
      secsVal.textContent = seconds.toString().padStart(2, '0');
    }, 1000);
  }

  // ==========================================================================
  // COPY DOCUMENTATION TO CLIPBOARD
  // ==========================================================================
  const copyDocBtn = document.getElementById('copy-doc-btn');
  const documentContainer = document.getElementById('copyable-document');

  if (copyDocBtn && documentContainer) {
    copyDocBtn.addEventListener('click', () => {
      // Copy structured raw text
      const docText = documentContainer.innerText;
      
      navigator.clipboard.writeText(docText)
        .then(() => {
          const originalText = copyDocBtn.textContent;
          copyDocBtn.textContent = '✓ Copied Successfully!';
          copyDocBtn.style.backgroundColor = 'var(--color-primary-sage)';
          
          setTimeout(() => {
            copyDocBtn.textContent = originalText;
            copyDocBtn.style.backgroundColor = '';
          }, 2500);
        })
        .catch(err => {
          console.error('Failed to copy document: ', err);
          alert('Failed to copy. Please select the text manually.');
        });
    });
  }

});
