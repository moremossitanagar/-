/* ============================================
   MORE MO'S â€” CORE JAVASCRIPT ENGINE
   Cart state management, Brutalist UI rendering,
   GPS geolocation, coupon rules, and WhatsApp checkout
   ============================================ */

(function () {
  'use strict';

  // ============================================
  // 1. CONFIGURATION (Modify these values to update shop variables)
  // ============================================
  var PHONE_NUMBER = '918787502765'; // Shop WhatsApp number (with country code)
  var SHOP_LOCATION = { lat: 27.083964, lng: 93.603163 }; // More Mo's, H Sector, Itanagar
  var RATE_PER_METER = 0.014; // Delivery charge per meter (₹14 per km)
  var MAX_DELIVERY_DISTANCE = 20000; // Updated to 15km delivery radius // Maximum delivery distance (in meters)
  var FREE_DELIVERY_THRESHOLD = 299; // Order total threshold to unlock free delivery
  var PERMANENT_HANDLING_FEE = 12; // Permanent handling fee in rupees
  var SHOP_NAME = "MORE MO'S";

  // Coupon dictionary definitions
  var VALID_COUPONS = {
    'MOS15': 0.15,         // 15% discount
    'WELCOME10': 0.10,      // 10% discount
    'MOS15': 0.15,          // 15% discount
    'WELCOME10': 0.10,      // 10% discount
    'MOREMOS20': 0.20,      // 20% discount
    'MOSUNDAY25': 0.25,     // 25% discount
    'MMVIP18': 0.18,        // 18% discount
    'CRAVEMOS12': 0.12,     // 12% discount
    'BITE15': 0.15,         // 15% discount
    'MOSFEST22': 0.22,      // 22% discount
    'FLAVOR10': 0.10,       // 10% discount
    'MOSDELIGHT20': 0.20,   // 20% discount
    'TASTY15': 0.15,        // 15% discount
    'MOREJOY18': 0.18,      // 18% discount
    'MMREWARD12': 0.12,     // 12% discount
    'MOSBONUS25': 0.2,     // 25% discount
    'CHEERS10': 0.10,       // 10% discount
    'SUNBITE20': 0.20,      // 20% discount
    'MOSMEAL15': 0.15,      // 15% discount
    'FOODIE18': 0.18,       // 18% discount
    'MOGOLD25': 0.25,       // 25% discount
    'CRUNCH12': 0.12,       // 12% discount
    'MOSVIP20': 0.20,       // 20% discount
    'MORELOVE15': 0.15,     // 15% discount
    'SUNDAY30': 0.3,       // 30% discount
    'MMSPECIAL18': 0.18,    // 18% discount
    'FLASH12': 0.12,        // 12% discount
    'MOSPARTY20': 0.20,     // 20% discount
    'TREAT15': 0.15,        // 15% discount
    'MOREDEAL25': 0.2,     // 25% discount
    'WEEKEND18': 0.18,      // 18% discount
    'MOSSTAR12': 0.12,      // 12% discount
    'THANKYOU20': 0.20      // 20% discount
  };

  // Global variables to track applied discount state
  window.activeCouponCode = null;
  window.activeDiscountValue = 0;

  // ============================================
  // 2. STATE MANAGEMENT (sessionStorage & localStorage)
  // ============================================
  var userLocation = null;
  var distanceMeters = 0;

  // Retrieve cart array safely from sessionStorage
  function getCart() {
    try {
      var raw = JSON.parse(sessionStorage.getItem('more_mos_cart') || '[]');
      if (!Array.isArray(raw)) return [];
      var safe = [];
      raw.forEach(function (entry) {
        if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
          var cleaned = {};
          if (Object.prototype.hasOwnProperty.call(entry, 'id')) cleaned.id = String(entry.id);
          if (Object.prototype.hasOwnProperty.call(entry, 'name')) cleaned.name = String(entry.name);
          if (Object.prototype.hasOwnProperty.call(entry, 'price')) cleaned.price = parseFloat(entry.price);
          if (Object.prototype.hasOwnProperty.call(entry, 'image')) cleaned.image = String(entry.image);
          if (Object.prototype.hasOwnProperty.call(entry, 'tags')) cleaned.tags = String(entry.tags);
          if (Object.prototype.hasOwnProperty.call(entry, 'category')) cleaned.category = String(entry.category);
          if (Object.prototype.hasOwnProperty.call(entry, 'qty')) cleaned.qty = parseInt(entry.qty) || 1;

          if (cleaned.id && cleaned.name && !isNaN(cleaned.price)) {
            safe.push(cleaned);
          }
        }
      });
      return safe;
    } catch (e) {
      return [];
    }
  }

  // Save cart back to sessionStorage
  function saveCart(cart) {
    sessionStorage.setItem('more_mos_cart', JSON.stringify(cart));
  }

  // ============================================
  // 3. CART ACTIONS
  // ============================================
  function addToCart(id, name, price, image, tags, category) {
    var cart = getCart();
    var existingItem = null;

    cart.forEach(function (entry) {
      if (entry.id === id) {
        existingItem = entry;
      }
    });

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({
        id: id,
        name: name,
        price: parseFloat(price),
        image: image || '',
        tags: tags || '',
        category: category || '',
        qty: 1
      });
    }

    saveCart(cart);
    updateCartUI();
    openCart(); // Slide cart open immediately
  }

  function removeFromCart(id) {
    var cart = getCart();
    var newCart = cart.filter(function (entry) {
      return entry.id !== id;
    });
    saveCart(newCart);
    updateCartUI();
  }

  function updateQuantity(id, delta) {
    var cart = getCart();
    var item = null;

    cart.forEach(function (entry) {
      if (entry.id === id) {
        item = entry;
      }
    });

    if (!item) return;
    item.qty += delta;

    if (item.qty <= 0) {
      removeFromCart(id);
      return;
    }

    saveCart(cart);
    updateCartUI();
  }

  // ============================================
  // 4. DRAWERS (Left Menu & Right Cart Sidebars)
  // ============================================
  var navDrawer = document.getElementById('nav-drawer');
  var drawerOverlay = document.getElementById('drawer-overlay');
  var menuTrigger = document.getElementById('menu-trigger');
  var drawerClose = document.getElementById('drawer-close');

  var cartDrawer = document.getElementById('cart-drawer');
  var cartOverlay = document.getElementById('cart-overlay');
  var cartClose = document.getElementById('cart-close');
  var cartTriggers = document.querySelectorAll('.cart-trigger');

  function openDrawer() {
    if (!navDrawer) return;
    navDrawer.classList.remove('-translate-x-full');
    if (drawerOverlay) drawerOverlay.classList.remove('opacity-0', 'pointer-events-none');
    document.body.classList.add('overflow-hidden');
  }

  function closeDrawer() {
    if (!navDrawer) return;
    navDrawer.classList.add('-translate-x-full');
    if (drawerOverlay) drawerOverlay.classList.add('opacity-0', 'pointer-events-none');
    document.body.classList.remove('overflow-hidden');
  }

  function openCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove('translate-x-full');
    if (cartOverlay) cartOverlay.classList.remove('opacity-0', 'pointer-events-none');
    document.body.classList.add('overflow-hidden');
  }

  function closeCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.add('translate-x-full');
    if (cartOverlay) cartOverlay.classList.add('opacity-0', 'pointer-events-none');
    document.body.classList.remove('overflow-hidden');
  }

  // Bind Drawer Trigger listeners
  if (menuTrigger) menuTrigger.addEventListener('click', openDrawer);
  var menuBadgeTrigger = document.getElementById('menu-badge-trigger');
  if (menuBadgeTrigger) menuBadgeTrigger.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  cartTriggers.forEach(function (btn) {
    btn.addEventListener('click', openCart);
  });
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Close overlays on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeDrawer();
      closeCart();
    }
  });

  // ============================================
  // 5. GEOLOCATION DISTANCE LOGIC
  // ============================================
  function calculateDistance(lat1, lng1, lat2, lng2) {
    var R = 6371000; // Earth radius in meters
    var toRad = function (deg) { return deg * Math.PI / 180; };
    var dLat = toRad(lat2 - lat1);
    var dLng = toRad(lng2 - lng1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  function requestLocation() {
    var statusEl = document.getElementById('location-status');
    var btn = document.getElementById('btn-grant-location');

    if (!navigator.geolocation) {
      if (statusEl) {
        statusEl.className = 'p-3 bg-error-container text-error rounded-md text-xs border-2 border-on-background mt-2';
        statusEl.innerHTML = ' Geolocation not supported by browser.';
      }
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = ' Fetching Coordinates...';
    }

    if (statusEl) {
      statusEl.className = 'text-xs text-primary font-bold animate-pulse mt-2';
      statusEl.textContent = 'Connecting with satellites...';
    }

    navigator.geolocation.getCurrentPosition(
      function (position) {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        distanceMeters = calculateDistance(
          SHOP_LOCATION.lat, SHOP_LOCATION.lng,
          userLocation.lat, userLocation.lng
        );

        if (btn) {
          btn.className = 'w-full py-3 bg-secondary-container text-on-secondary-container border-2 border-on-background font-label-bold rounded-md cursor-not-allowed';
          btn.textContent = 'âœ… Location Verified';
        }

        if (statusEl) {
          statusEl.className = 'p-3 bg-green-500/10 text-green-500 rounded-md text-xs border-2 border-green-500/30 mt-2 font-label-bold';
          statusEl.textContent = 'Distance: ' + (distanceMeters / 1000).toFixed(2) + ' km from kitchen';
        }

        updateCartUI();
      },
      function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'ðŸ“ Share Location for Delivery';
        }
        if (statusEl) {
          statusEl.className = 'p-3 bg-error-container text-error rounded-md text-xs border-2 border-error/30 mt-2';
          statusEl.textContent = 'âŒ Access denied. Location coordinate verification needed.';
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }

  // ============================================
  // 6. BUILD WHATSAPP MESSAGE
  // ============================================
  function buildWhatsAppMsg(cart, subtotal, discount, handlingFee, deliveryCharge, total) {
    var msg = 'Hello ' + SHOP_NAME + '! \n\nI want to place an order:\n\n';

    cart.forEach(function (item) {
      var cat = item.category ? ' (' + item.category + ')' : '';
      msg += ' ' + item.name + cat + ' x ' + item.qty + ' = ' + (item.price * item.qty).toFixed(2) + '\n';
    });

    if (userLocation) {
      msg += '\n*Delivery Location:*\nhttps://maps.google.com/?q=' + userLocation.lat + ',' + userLocation.lng;
      msg += '\n Distance: ' + (distanceMeters / 1000).toFixed(2) + ' km';
    }

    msg += '\n\n*Subtotal:* ' + subtotal.toFixed(2);
    if (discount > 0) {
      msg += '\n*COUPON APPLIED: ' + window.activeCouponCode + '* (-' + discount.toFixed(2) + ')';
    }
    msg += '\n*Handling Fee:* ' + handlingFee.toFixed(2);
    msg += '\n*Delivery Charge:* ' + (deliveryCharge === 0 ? 'Free' : ' ' + deliveryCharge.toFixed(2));
    msg += '\n*GRAND TOTAL: ' + total.toFixed(2) + '*';
    msg += '\n\nPlease confirm my order. Thank you!';

    return msg;
  }

  // ============================================
  // 7. RENDER CART IN DRAWER UI
  // ============================================
  function updateCartUI() {
    var cart = getCart();
    var container = document.getElementById('cart-items-container');
    var badgeNode = document.getElementById('capsule-cart-badge');
    var triggerBadges = document.querySelectorAll('.cart-badge');

    // Update standard triggers count badges
    var totalItems = 0;
    cart.forEach(function (entry) { totalItems += entry.qty; });

    if (badgeNode) {
      badgeNode.textContent = String(totalItems);
      badgeNode.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    triggerBadges.forEach(function (badge) {
      badge.textContent = String(totalItems);
      if (totalItems > 0) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    });

    // Clear contents
    if (container) {
      container.innerHTML = '';
    } else {
      return;
    }

    if (cart.length === 0) {
      container.innerHTML = '<p class="text-center font-body-md py-12 text-on-surface-variant">Your cart is empty. Feed the beast! ðŸ¥¢</p>';

      // Hide cart totals area
      var checkoutArea = document.getElementById('cart-checkout-area');
      if (checkoutArea) checkoutArea.style.display = 'none';
      return;
    }

    var checkoutAreaNode = document.getElementById('cart-checkout-area');
    if (checkoutAreaNode) checkoutAreaNode.style.display = 'block';

    // Loop and append cart item nodes
    cart.forEach(function (item) {
      var itemEl = document.createElement('div');
      itemEl.className = 'flex gap-4 p-4 bg-surface-container-lowest border-2 border-on-background hard-shadow';

      var imgDiv = document.createElement('div');
      imgDiv.className = 'w-16 h-16 bg-secondary-container border-2 border-on-background p-1 flex-shrink-0';
      var img = document.createElement('img');
      img.src = item.image || 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=120';
      img.alt = item.name;
      img.className = 'w-full h-full object-cover';
      imgDiv.appendChild(img);
      itemEl.appendChild(imgDiv);

      var infoDiv = document.createElement('div');
      infoDiv.className = 'flex-1 flex flex-col justify-between';

      var details = document.createElement('div');
      var nameNode = document.createElement('h4');
      nameNode.className = 'font-display-lg text-base text-primary uppercase leading-tight';
      nameNode.textContent = item.name;

      var priceNode = document.createElement('p');
      priceNode.className = 'font-label-bold text-xs text-on-surface-variant';
      priceNode.textContent = '\u20B9' + item.price.toFixed(2);

      details.appendChild(nameNode);
      details.appendChild(priceNode);
      infoDiv.appendChild(details);

      // Quantities
      var qtyWrap = document.createElement('div');
      qtyWrap.className = 'flex items-center gap-3 mt-2';

      var decBtn = document.createElement('button');
      decBtn.className = 'w-6 h-6 border-2 border-on-background flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors text-xs font-bold font-label-bold';
      decBtn.textContent = '-';
      decBtn.addEventListener('click', function () { updateQuantity(item.id, -1); });

      var countNode = document.createElement('span');
      countNode.className = 'font-label-bold text-sm';
      countNode.textContent = String(item.qty);

      var incBtn = document.createElement('button');
      incBtn.className = 'w-6 h-6 border-2 border-on-background flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors text-xs font-bold font-label-bold';
      incBtn.textContent = '+';
      incBtn.addEventListener('click', function () { updateQuantity(item.id, 1); });

      qtyWrap.appendChild(decBtn);
      qtyWrap.appendChild(countNode);
      qtyWrap.appendChild(incBtn);
      infoDiv.appendChild(qtyWrap);

      itemEl.appendChild(infoDiv);

      // Delete Button
      var delBtn = document.createElement('button');
      delBtn.className = 'self-start text-on-surface-variant hover:text-primary mt-1';
      delBtn.innerHTML = '<span class="material-symbols-outlined text-xl" data-icon="delete">delete</span>';
      delBtn.addEventListener('click', function () { removeFromCart(item.id); });
      itemEl.appendChild(delBtn);

      container.appendChild(itemEl);
    });

    // --- Math Calculations ---
    var subtotal = 0;
    cart.forEach(function (item) {
      subtotal += item.price * item.qty;
    });

    // Discount calculations: Exclude items below \u20B950
    var eligibleSubtotal = 0;
    cart.forEach(function (item) {
      if (item.price >= 50) {
        eligibleSubtotal += item.price * item.qty;
      }
    });

    var discount = 0;
    if (window.activeDiscountValue > 0) {
      discount = eligibleSubtotal * window.activeDiscountValue;
    }

    var deliveryCharge = 0;
    var canDeliver = true;
    var locationGranted = userLocation !== null;

    if (locationGranted) {
      if (distanceMeters > MAX_DELIVERY_DISTANCE) {
        canDeliver = false;
      } else if (distanceMeters <= 200) {
        deliveryCharge = 0;
      } else if (subtotal >= FREE_DELIVERY_THRESHOLD) {
        deliveryCharge = 0;
      } else {
        deliveryCharge = distanceMeters * RATE_PER_METER;
      }
    }

    var finalTotal = subtotal - discount + PERMANENT_HANDLING_FEE + deliveryCharge;

    // Render Pricing Nodes
    var subtotalNode = document.getElementById('cart-subtotal');
    var discountRow = document.getElementById('cart-discount-row');
    var discountNode = document.getElementById('cart-discount-value');
    var handlingNode = document.getElementById('cart-handling-value');
    var deliveryNode = document.getElementById('cart-delivery-value');
    var totalNode = document.getElementById('cart-total-value');
    var locationBox = document.getElementById('cart-location-box');
    var waButton = document.getElementById('btn-whatsapp-order');

    if (subtotalNode) subtotalNode.textContent = '\u20B9' + subtotal.toFixed(2);

    if (discountRow && discountNode) {
      if (discount > 0) {
        discountRow.classList.remove('hidden');
        discountNode.textContent = '-\u20B9' + discount.toFixed(2);
      } else {
        discountRow.classList.add('hidden');
      }
    }

    if (handlingNode) handlingNode.textContent = '\u20B9' + PERMANENT_HANDLING_FEE.toFixed(2);

    if (deliveryNode) {
      if (locationGranted) {
        if (!canDeliver) {
          deliveryNode.textContent = 'Out of Area (>5km)';
          deliveryNode.className = 'font-label-bold text-error';
        } else if (deliveryCharge === 0) {
          deliveryNode.textContent = 'Free Delivery';
          deliveryNode.className = 'font-label-bold text-green-500';
        } else {
          deliveryNode.textContent = '\u20B9' + deliveryCharge.toFixed(2);
          deliveryNode.className = 'font-label-bold text-on-surface';
        }
      } else {
        deliveryNode.textContent = 'Share Location';
        deliveryNode.className = 'font-label-bold text-primary animate-pulse';
      }
    }

    if (totalNode) totalNode.textContent = '\u20B9' + finalTotal.toFixed(2);

    // Render location access button inside cart drawer dynamically
    if (locationBox) {
      locationBox.innerHTML = '';
      if (!locationGranted) {
        var grantBtn = document.createElement('button');
        grantBtn.id = 'btn-grant-location';
        grantBtn.className = 'w-full py-3 bg-primary text-on-primary border-2 border-on-background font-label-bold rounded-md hard-shadow hard-shadow-active hover:bg-on-background hover:text-on-primary transition-all';
        grantBtn.textContent = 'ðŸ“ SHARE LOCATION FOR DELIVERY';
        grantBtn.addEventListener('click', requestLocation);

        var note = document.createElement('p');
        note.className = 'text-[10px] text-on-surface-variant text-center mt-2';
        note.innerHTML = 'Required for shipping fee calculations.<br><strong>Location setup coordinate calculations.</strong>';

        locationBox.appendChild(grantBtn);
        locationBox.appendChild(note);
      } else {
        var info = document.createElement('div');
        info.className = 'p-3 bg-secondary-container/50 border-2 border-on-background rounded-md text-xs font-label-bold flex justify-between items-center';

        var detailsNode = document.createElement('div');
        detailsNode.innerHTML = 'âœ… Location Verified<br><span class="text-[10px] text-on-surface-variant font-normal">Distance: ' + (distanceMeters / 1000).toFixed(2) + ' km</span>';

        var changeBtn = document.createElement('button');
        changeBtn.className = 'text-[10px] underline hover:text-primary';
        changeBtn.textContent = 'Update';
        changeBtn.addEventListener('click', function () {
          userLocation = null;
          updateCartUI();
        });

        info.appendChild(detailsNode);
        info.appendChild(changeBtn);
        locationBox.appendChild(info);
      }

      // Add wrapper element for location errors
      var statusDiv = document.createElement('div');
      statusDiv.id = 'location-status';
      locationBox.appendChild(statusDiv);
    }

    // Update WhatsApp checkout button link and status
    if (waButton) {
      if (locationGranted && canDeliver) {
        var msgText = buildWhatsAppMsg(cart, subtotal, discount, PERMANENT_HANDLING_FEE, deliveryCharge, finalTotal);
        waButton.href = 'https://wa.me/' + PHONE_NUMBER + '?text=' + encodeURIComponent(msgText);
        waButton.className = 'w-full py-4 bg-green-500 hover:bg-green-600 text-white font-display-lg text-headline-md uppercase hard-shadow hard-shadow-active flex items-center justify-center gap-3';
        waButton.innerHTML = 'ORDER VIA WHATSAPP <span class="material-symbols-outlined" data-icon="bolt">bolt</span>';

        // Remove disabled flag pointer events
        waButton.style.pointerEvents = 'auto';
      } else if (locationGranted && !canDeliver) {
        waButton.href = '#';
        waButton.className = 'w-full py-4 bg-gray-400 text-gray-700 font-display-lg text-headline-md uppercase cursor-not-allowed flex items-center justify-center gap-3';
        waButton.innerHTML = 'ðŸš« CANNOT DELIVER (TOO FAR)';
        waButton.style.pointerEvents = 'none';
      } else {
        waButton.href = '#';
        waButton.className = 'w-full py-4 bg-gray-400 text-gray-700 font-display-lg text-headline-md uppercase cursor-not-allowed flex items-center justify-center gap-3 animate-pulse';
        waButton.innerHTML = 'ðŸ”’ VERIFY LOCATION TO ORDER';
        waButton.style.pointerEvents = 'none';
      }
    }
  }

  // ============================================
  // 8. ADD TO CART CATALOG LISTENERS
  // ============================================
  function setupCatalogListeners() {
    var addButtons = document.querySelectorAll('.add-to-cart-btn');
    addButtons.forEach(function (btn) {
      // Avoid double-binding
      if (btn.getAttribute('data-bound')) return;
      btn.setAttribute('data-bound', 'true');

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var id = btn.getAttribute('data-id');
        var name = btn.getAttribute('data-name');
        var price = btn.getAttribute('data-price');
        var image = btn.getAttribute('data-image');
        var tags = btn.getAttribute('data-tags');
        var category = btn.getAttribute('data-category');

        addToCart(id, name, price, image, tags, category);

        // UI button pop feedback
        var originalText = btn.textContent;
        btn.textContent = 'ADDED!';
        btn.className = btn.className.replace('bg-on-background', 'bg-primary').replace('text-on-primary', 'text-on-primary');

        setTimeout(function () {
          btn.textContent = originalText;
          btn.className = btn.className.replace('bg-primary', 'bg-on-background');
        }, 1200);
      });
    });
  }

  // ============================================
  // 9. COUPON CODE SYSTEM
  // ============================================
  var btnApply = document.getElementById('btn-apply-coupon');
  if (btnApply) {
    btnApply.addEventListener('click', function () {
      var inputEl = document.getElementById('coupon-input');
      var messageEl = document.getElementById('coupon-message');
      var code = inputEl ? inputEl.value.trim().toUpperCase() : '';

      if (messageEl) {
        messageEl.className = 'text-xs mt-1 font-label-bold';
        messageEl.textContent = '';
      }

      if (!code) return;

      // Check device single-use limit in localStorage
      var burned = JSON.parse(localStorage.getItem('mosBurnedCoupons') || '[]');
      if (burned.indexOf(code) !== -1) {
        if (messageEl) {
          messageEl.className = 'text-xs mt-1 font-label-bold text-error';
          messageEl.textContent = 'This coupon was already used on this device.';
        }
        window.activeCouponCode = null;
        window.activeDiscountValue = 0;
        updateCartUI();
        return;
      }

      if (VALID_COUPONS[code]) {
        window.activeCouponCode = code;
        window.activeDiscountValue = VALID_COUPONS[code];
        if (messageEl) {
          messageEl.className = 'text-xs mt-1 font-label-bold text-green-500';
          messageEl.textContent = 'âœ… Applied! (' + (window.activeDiscountValue * 100) + '% discount)';
        }
      } else {
        window.activeCouponCode = null;
        window.activeDiscountValue = 0;
        if (messageEl) {
          messageEl.className = 'text-xs mt-1 font-label-bold text-error';
          messageEl.textContent = 'Invalid promo code.';
        }
      }

      updateCartUI();
    });
  }

  // Record burned coupon code upon WhatsApp checkout redirect click
  var checkoutButtonNode = document.getElementById('btn-whatsapp-order');
  if (checkoutButtonNode) {
    checkoutButtonNode.addEventListener('click', function () {
      if (window.activeCouponCode) {
        var burned = JSON.parse(localStorage.getItem('mosBurnedCoupons') || '[]');
        if (burned.indexOf(window.activeCouponCode) === -1) {
          burned.push(window.activeCouponCode);
          localStorage.setItem('mosBurnedCoupons', JSON.stringify(burned));
        }
      }
    });
  }

  // ============================================
  // 10. CATALOG FILTER SEARCH & CHIP LOGIC
  // ============================================
  var searchInput = document.getElementById('catalog-search-input');
  var filterChips = document.querySelectorAll('.catalog-chip');
  var catalogCards = document.querySelectorAll('.catalog-card');

  function filterCatalog() {
    var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    var activeChip = document.querySelector('.catalog-chip.active');
    var filterValue = activeChip ? activeChip.getAttribute('data-filter') : 'all';

    catalogCards.forEach(function (card) {
      var titleNode = card.querySelector('.catalog-card-title');
      var title = titleNode ? titleNode.textContent.toLowerCase() : '';
      var tags = (card.getAttribute('data-tags') || '').toLowerCase();

      var matchesSearch = title.indexOf(query) !== -1 || tags.indexOf(query) !== -1;
      var matchesChip = filterValue === 'all' || tags.indexOf(filterValue) !== -1;

      if (matchesSearch && matchesChip) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCatalog);
  }

  filterChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      filterChips.forEach(function (c) { c.classList.remove('active', 'bg-primary', 'text-on-primary'); c.classList.add('bg-secondary-container', 'text-on-secondary-container'); });
      chip.classList.add('active', 'bg-primary', 'text-on-primary');
      chip.classList.remove('bg-secondary-container', 'text-on-secondary-container');
      filterCatalog();
    });
  });

  // ============================================
  // 11. SPLASH SCREEN (Once per session)
  // ============================================
  window.addEventListener('DOMContentLoaded', function () {
    var splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
      var hasSeenSplash = sessionStorage.getItem('mos_splash_seen');
      if (hasSeenSplash === 'true') {
        splashScreen.remove();
      } else {
        sessionStorage.setItem('mos_splash_seen', 'true');
        setTimeout(function () {
          splashScreen.classList.add('opacity-0');
          setTimeout(function () {
            splashScreen.remove();
          }, 500);
        }, 2200);
      }
    }
  });
  // ---------- Cinematic Intro ----------
  (function () {
    const overlay = document.getElementById('intro-video-overlay');
    const video = document.getElementById('intro-video');
    const skipBtn = document.getElementById('skip-intro');
    const STORAGE_KEY = 'introWatched';

    function finishIntro() {
      if (!overlay) return;
      overlay.classList.add('opacity-0');
      setTimeout(() => {
        overlay?.remove();
      }, 600);
      sessionStorage.setItem(STORAGE_KEY, 'true');
    }

    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      overlay?.remove();
      return;
    }

    if (video) video.addEventListener('ended', finishIntro);
    if (skipBtn) skipBtn.addEventListener('click', finishIntro);
  })();
  // ============================================
  // 12. RUN INITIALIZATIONS
  // ============================================
  updateCartUI();
  setupCatalogListeners();

})();


/* ==========================================
   COMIC ENHANCEMENTS (JS)
   ========================================== */

// 1. Comic Action Bubbles on Hover
document.querySelectorAll('.catalog-card').forEach(card => {
  const bubble = document.createElement('div');
  const words = ["BAM!", "POW!", "CRUNCH!", "SPICY!", "ZAP!", "BOOM!"];
  const word = words[Math.floor(Math.random() * words.length)];
  bubble.innerText = word;
  // Add brutalist classes
  bubble.className = "absolute top-2 right-2 bg-yellow-400 text-black font-display-lg text-2xl px-3 py-1 border-4 border-black rotate-12 opacity-0 transition-all duration-300 pointer-events-none z-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";

  const imgWrapper = card.querySelector('.aspect-\\[4\\/3\\]') || card.querySelector('div.relative');
  if (imgWrapper) {
    imgWrapper.style.position = 'relative';
    imgWrapper.appendChild(bubble);
    card.addEventListener('mouseenter', () => {
      bubble.style.opacity = '1';
      bubble.style.transform = 'rotate(' + (Math.random() * 20 - 10) + 'deg) scale(1.2)';
    });
    card.addEventListener('mouseleave', () => {
      bubble.style.opacity = '0';
      bubble.style.transform = 'rotate(12deg) scale(1)';
    });
  }
});

// 2. Comic-Style Page Transitions (Slider Clicks / Menu Clicks)
const wipeOverlay = document.createElement('div');
wipeOverlay.className = "comic-wipe";
wipeOverlay.innerHTML = '<div class="comic-wipe-text">ZOOOOOM!</div>';
document.body.appendChild(wipeOverlay);

document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  // Only apply to html links that are not just anchors
  if (href && href.endsWith('.html') && href !== window.location.pathname.split('/').pop()) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const words = ["ZOOOOOM!", "SWOOSH!", "WHAM!", "FLIP!", "WAPOW!"];
      wipeOverlay.querySelector('.comic-wipe-text').innerText = words[Math.floor(Math.random() * words.length)];
      wipeOverlay.classList.add('active');

      // Navigate after the wipe covers the screen
      setTimeout(() => {
        window.location.href = href;
      }, 500);
    });
  }
});
