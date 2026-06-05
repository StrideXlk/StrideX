// ===========================
//   StrideX - Main Script
// ===========================

let currentCategory = "all";
let currentSearch = "";
let currentSort = "default";

$(document).ready(function () {

  // DYNAMIC CART SIDEBAR INJECTION
  if ($("#cartSidebar").length === 0) {
    $("body").append(`
      <!-- CART SIDEBAR -->
      <div class="cart-sidebar" id="cartSidebar">
        <div class="cart-header">
          <h2>Your Cart</h2>
          <button onclick="toggleCart()" class="close-cart-btn">✕</button>
        </div>
        <div class="cart-items" id="cartItems"></div>
        <div class="cart-footer">
          <div class="cart-total">
            <span>Subtotal</span>
            <span id="subtotal">Rs.0</span>
          </div>
          <button class="checkout-btn">Checkout</button>
        </div>
      </div>
    `);
  }

  // DYNAMIC CHECKOUT MODAL INJECTION
  if ($("#checkoutModal").length === 0) {
    $("body").append(`
      <!-- CHECKOUT MODAL -->
      <div class="checkout-modal" id="checkoutModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Complete Your Order</h2>
            <button onclick="closeCheckoutModal()" class="close-modal-btn">✕</button>
          </div>
          <form id="checkoutForm">
            <div class="form-group-modal">
              <label for="checkoutName">Full Name *</label>
              <input type="text" id="checkoutName" required placeholder="John Doe" />
            </div>
            <div class="form-group-modal">
              <label for="checkoutEmail">Email Address *</label>
              <input type="email" id="checkoutEmail" required placeholder="john@example.com" />
            </div>
            <div class="form-group-modal">
              <label for="checkoutAddress">Delivery Address *</label>
              <textarea id="checkoutAddress" required placeholder="123 Street, City, Country"></textarea>
            </div>
            <div class="form-group-modal">
              <label for="checkoutPhone">Phone Number *</label>
              <input type="tel" id="checkoutPhone" required placeholder="+94 77 123 4567" />
            </div>
            
            <div class="order-summary-box">
              <h3>Order Summary</h3>
              <div id="checkoutSummaryItems"></div>
              <div class="checkout-summary-total">
                <span>Total:</span>
                <span id="checkoutSummaryTotal">Rs.0</span>
              </div>
            </div>
            
            <button type="submit" class="btn btn-red place-order-btn">Place Order</button>
          </form>
          
          <div class="success-screen" id="checkoutSuccessScreen" style="display:none;">
            <div class="success-icon">✓</div>
            <h2>Order Placed!</h2>
            <p>Thank you for shopping with StrideX. Your mock order number is <strong id="orderNumber" style="color: #ff3b30;"></strong>.</p>
            <button type="button" onclick="closeCheckoutModal()" class="btn btn-red" style="margin-top: 20px; width: 100%;">Continue Shopping</button>
          </div>
        </div>
      </div>
    `);
  }

  // INITIALIZE CART UI ON LOAD
  updateCart();

  // HAMBURGER MENU
  $("#hamburger").on("click", function () {
    $("#nav-links").toggleClass("open");
  });

  // PARSE URL CATEGORY PARAMETER
  let urlParams = new URLSearchParams(window.location.search);
  let categoryParam = urlParams.get('category');
  if (categoryParam) {
    let normalized = categoryParam.toLowerCase();
    if (normalized === "boots") {
      currentCategory = "Boots";
    } else {
      currentCategory = normalized;
    }
    // Update active filter button in UI
    $(".filter-btn").removeClass("active");
    $(`.filter-btn[data-category="${currentCategory}"]`).addClass("active");
  }

  // LOAD PRODUCTS
  if ($("#products-container").length) {
    loadProducts();
  }

  // FILTER BUTTONS
  $(document).on("click", ".filter-btn", function () {
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");
    currentCategory = $(this).data("category");
    loadProducts();
  });

  // SEARCH INPUT
  $(document).on("input", "#search-input", function () {
    currentSearch = $(this).val();
    loadProducts();
  });

  // SORT SELECT
  $(document).on("change", "#sort-select", function () {
    currentSort = $(this).val();
    loadProducts();
  });

  // CHECKOUT FORM SUBMISSION
  $(document).on("submit", "#checkoutForm", function (e) {
    e.preventDefault();
    let orderNum = "SX-" + Math.floor(100000 + Math.random() * 900000);
    $("#orderNumber").text(orderNum);
    $("#checkoutForm").hide();
    $("#checkoutSuccessScreen").fadeIn();
    cart = [];
    updateCart();
  });

  // CHECKOUT BUTTON CLICK
  $(document).on("click", ".checkout-btn", function (e) {
    e.stopPropagation();
    if (!$(this).hasClass("disabled")) {
      openCheckout();
    }
  });

  // QUANTITY PLUS
  $(document).on("click", ".qty-plus", function (e) {
    e.stopPropagation();
    let key = decodeURIComponent($(this).data("key"));
    changeQuantity(key, 1);
  });

  // QUANTITY MINUS
  $(document).on("click", ".qty-minus", function (e) {
    e.stopPropagation();
    let key = decodeURIComponent($(this).data("key"));
    changeQuantity(key, -1);
  });

});


// ===========================
// PRODUCTS
// ===========================

const allProducts = [

  {
    name: "AirStrike Pro",
    price: "Rs.25,000",
    img: "Images/Shoes/Sneaker/airstrike1.jpg",
    cartImg: "Images/Cart/airstrike1.jpg",
    category: "sneakers",
    desc: "Lightweight street runner",
    colors: ["#cccccc", "#e74c3c", "#2980b9"],
    sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11]
  },

  {
    name: "Urban Drift",
    price: "Rs.15,000",
    img: "Images/Shoes/Casual/airstrike1.jpg",
    cartImg: "Images/Cart/urbandrift.jpg",
    category: "casual",
    desc: "Everyday comfort shoes",
    colors: ["#cccccc", "#7d5a3c", "#8e44ad"],
    sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11]
  },

  {
    name: "Summit X1",
    price: "Rs.30,000",
    img: "Images/Shoes/Boots/airstrike1.jpg",
    cartImg: "Images/Cart/summitx1.jpg",
    category: "Boots",
    desc: "High-performance boot",
    colors: ["#cccccc", "#7d5a3c", "#546e7a", "#e74c3c"],
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12]
  },

  {
    name: "Classic Edge",
    price: "Rs.10,000",
    img: "Images/Shoes/Formal/airstrike1.jpg",
    cartImg: "Images/Cart/classicedge.jpg",
    category: "formal",
    desc: "Sleek formal leather shoes",
    colors: ["#1a1a1a", "#7d5a3c", "#cccccc"],
    sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11]
  },

  {
    name: "NightRun 90",
    price: "Rs.25,000",
    img: "Images/Shoes/Sneaker/airstrike2.jpg",
    cartImg: "Images/Cart/nightrun90.jpg",
    category: "sneakers",
    desc: "Reflective night runner",
    colors: ["#1a1a1a", "#e74c3c", "#f39c12"],
    sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11]
  },

  {
    name: "TrailBlaze GTX",
    price: "Rs.20,000",
    img: "Images/Shoes/Boots/airstrike2.jpg",
    cartImg: "Images/Cart/TrailBlaze GTX.jpg",
    category: "Boots",
    desc: "Waterproof trail boot",
    colors: ["#1a1a1a", "#546e7a", "#7d5a3c"],
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12]
  },

  {
    name: "Canvas Wave",
    price: "Rs.15,000",
    img: "Images/Shoes/Casual/airstrike2.jpg",
    cartImg: "Images/Cart/canvaswave.jpg",
    category: "casual",
    desc: "Breezy canvas slip-on",
    colors: ["#cccccc", "#2980b9", "#e74c3c"],
    sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11]
  },

  {
    name: "Oxford Premier",
    price: "Rs.10,000",
    img: "Images/Shoes/Formal/airstrike2.jpg",
    cartImg: "Images/Cart/oxfordpremier.jpg",
    category: "formal",
    desc: "Premium Oxford dress shoe",
    colors: ["#1a1a1a", "#7d5a3c"],
    sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11]
  },

  {
    name: "Bolt Speed",
    price: "Rs.25,000",
    img: "Images/Shoes/Sneaker/airstrike3.jpg",
    cartImg: "Images/Cart/boltspeed.jpg",
    category: "sneakers",
    desc: "Speed training shoe",
    colors: ["#1a1a1a", "#e74c3c", "#f1c40f"],
    sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11]
  }

];


// ===========================
// LOAD PRODUCTS
// ===========================

function loadProducts() {

  let container = $("#products-container");
  if (!container.length) return;

  container.html("");

  // Copy products array for sorting/filtering
  let filteredProducts = [...allProducts];

  // 1. Filter by Category
  if (currentCategory !== "all") {
    filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
  }

  // 2. Filter by Search Query
  if (currentSearch.trim() !== "") {
    let query = currentSearch.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.desc.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }

  // 3. Sort
  if (currentSort === "price-low" || currentSort === "price-high") {
    filteredProducts.sort((a, b) => {
      let priceA = parseFloat(a.price.replace(/,/g, "").replace("Rs.", ""));
      let priceB = parseFloat(b.price.replace(/,/g, "").replace("Rs.", ""));
      return currentSort === "price-low" ? priceA - priceB : priceB - priceA;
    });
  } else if (currentSort === "name-asc") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Render
  if (filteredProducts.length === 0) {
    container.append(`<p class="loading-text">No products match your search or filter criteria.</p>`);
    return;
  }

  filteredProducts.forEach(function (p) {

    container.append(

      buildCard(
        p.name,
        p.price,
        p.img,
        p.cartImg,
        p.category,
        p.desc,
        p.colors,
        p.sizes
      )

    );

  });

}


// ===========================
// BUILD PRODUCT CARD
// ===========================

function buildCard(name, price, img, cartImg, category, desc, colors, sizes) {

  // Build color dots
  let colorDots = colors.map((c, i) => `
    <div
      class="color-dot${i === 0 ? ' active' : ''}"
      style="background:${c};"
      data-color="${c}"
      onclick="selectColor(this)"
    ></div>
  `).join('');

  // Build size buttons
  let sizeBtns = sizes.map((s, i) => `
    <button
      class="size-btn${i === 2 ? ' active' : ''}"
      data-size="${s}"
      onclick="selectSize(this)"
    >${s}</button>
  `).join('');

  return `
    <div class="shoe-card">

      <img
        src="${img}"
        alt="${name}"
        class="shoe-card-img"
      >

      <div class="shoe-card-body">

        <div class="shoe-card-category">
          ${category}
        </div>

        <div class="shoe-card-name">
          ${name}
        </div>

        <p style="color:#aaa;font-size:0.88rem;margin-bottom:12px;">
          ${desc}
        </p>

        <div class="shoe-card-price">
          ${price}
        </div>

        <div class="option-label">Color</div>
        <div class="colors-row">
          ${colorDots}
        </div>

        <div class="option-label">Size (UK)</div>
        <div class="sizes-row">
          ${sizeBtns}
        </div>

        <button
          class="btn btn-red add-cart-btn"
          style="font-size:0.8rem;padding:9px 20px;"
          onclick="addToCart('${name}','${price}','${cartImg}', this)"
        >
          ADD TO CART
        </button>

      </div>

    </div>
  `;

}


// ===========================
// SELECT COLOR
// ===========================

function selectColor(el) {
  $(el).closest('.colors-row').find('.color-dot').removeClass('active');
  $(el).addClass('active');
}


// ===========================
// SELECT SIZE
// ===========================

function selectSize(el) {
  $(el).closest('.sizes-row').find('.size-btn').removeClass('active');
  $(el).addClass('active');
}


// ===========================
// CART
// ===========================

let cart = [];
try {
  let savedCart = localStorage.getItem("stridex_cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
} catch (e) {
  console.error("Failed to load cart from localStorage", e);
}


// ===========================
// TOGGLE CART
// ===========================

function toggleCart() {

  $("#cartSidebar").toggleClass("active");

}


// ===========================
// ADD TO CART
// ===========================

function addToCart(name, price, cartImg, btn) {

  let card = $(btn).closest('.shoe-card');

  let selectedColor = card.find('.color-dot.active').data('color') || '';
  let selectedSize  = card.find('.size-btn.active').data('size') || '';

  let cartKey = name + '|' + selectedColor + '|' + selectedSize;

  let existingItem = cart.find(item => item.cartKey === cartKey);

  if (existingItem) {

    existingItem.quantity++;

  } else {

    cart.push({
      cartKey: cartKey,
      name: name,
      price: price,
      cartImg: cartImg,
      color: selectedColor,
      size: selectedSize,
      quantity: 1
    });

  }

  updateCart();

  $("#cartSidebar").addClass("active");


  // BUTTON ANIMATION

  const originalText = btn.innerHTML;

  btn.innerHTML = "ADDED ✓";

  btn.style.background = "#16c47f";

  btn.style.transform = "scale(0.96)";


  setTimeout(() => {

    btn.innerHTML = originalText;

    btn.style.background = "#ff3b30";

    btn.style.transform = "scale(1)";

  }, 1200);

}


// ===========================
// UPDATE CART
// ===========================

function updateCart() {

  let cartItems = $("#cartItems");
  let subtotal  = $("#subtotal");
  let cartCount = $(".cart-count");

  cartItems.html("");
  let total = 0;
  let totalItems = 0;

  if (cart.length === 0) {
    cartItems.html(`
      <div class="cart-empty-state">
        <div class="empty-cart-icon">🛒</div>
        <div class="empty-title">Your Cart is Empty</div>
        <p class="empty-desc">Looks like you haven't added anything yet. Start exploring our premium footwear catalog!</p>
        <button class="btn btn-outline empty-shop-btn" onclick="toggleCart()">Shop Collection</button>
      </div>
    `);
    $(".checkout-btn").addClass("disabled").prop("disabled", true);
  } else {
    $(".checkout-btn").removeClass("disabled").prop("disabled", false);

    cart.forEach(function (item) {
      let price = parseFloat(item.price.replace(/,/g, "").replace("Rs.", ""));
      let itemTotal = price * item.quantity;
      total += itemTotal;
      totalItems += item.quantity;

      let safeKey = encodeURIComponent(item.cartKey);

      cartItems.append(`
        <div class="cart-item-simple">
          <img src="${item.cartImg}" class="cart-thumb" alt="${item.name}">
          <div class="cart-info">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
              <div class="cart-item-name">${item.name}</div>
              <button class="cart-remove-btn" data-key="${safeKey}" title="Remove">✕</button>
            </div>
            <div style="display:flex;align-items:center;gap:8px;margin: 6px 0 10px;font-size:0.8rem;color:#aaa;">
              <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${item.color};border:1px solid #555;flex-shrink:0;"></span>
              <span>Size: UK ${item.size}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
              <div class="cart-qty-controls">
                <button class="qty-btn qty-minus" data-key="${safeKey}">−</button>
                <div class="qty-val">${item.quantity}</div>
                <button class="qty-btn qty-plus" data-key="${safeKey}">+</button>
              </div>
              <div class="cart-item-price">
                Rs.${itemTotal.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      `);
    });
  }

  subtotal.text("Rs." + total.toLocaleString());

  // CART POP-SHAKE ANIMATION TRIGGER
  let badgeCount = parseInt(totalItems);
  let oldBadgeCount = parseInt(cartCount.first().text()) || 0;
  
  if (totalItems > 0) {
    cartCount.text(totalItems);
    cartCount.css("display", "flex");

    if (badgeCount !== oldBadgeCount) {
      $(".cart-btn").addClass("cart-shake");
      setTimeout(() => {
        $(".cart-btn").removeClass("cart-shake");
      }, 500);
    }
  } else {
    cartCount.hide();
    cartCount.text(0);
  }

  // SAVE CART TO LOCALSTORAGE
  try {
    localStorage.setItem("stridex_cart", JSON.stringify(cart));
  } catch (e) {
    console.error("Failed to save cart to localStorage", e);
  }

}

function changeQuantity(cartKey, delta) {
  let item = cart.find(i => i.cartKey === cartKey);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.cartKey !== cartKey);
    }
    updateCart();
  }
}


// ===========================
// CLOSE CART OUTSIDE CLICK
// ===========================

$(document).click(function (e) {

  if (
    !$(e.target).closest(
      "#cartSidebar, .cart-btn"
    ).length
  ) {

    $("#cartSidebar").removeClass("active");

  }

});


// ===========================
// REMOVE FROM CART
// ===========================

$(document).on("click", ".cart-remove-btn", function(e) {
  e.stopPropagation();
  var key = decodeURIComponent($(this).data("key"));
  cart = cart.filter(function(item) { return item.cartKey !== key; });
  updateCart();
});


// ===========================
// CHECKOUT MODAL LOGIC
// ===========================

function openCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  
  $("#cartSidebar").removeClass("active");
  $("#checkoutModal").addClass("active");
  $("#checkoutForm").show();
  $("#checkoutSuccessScreen").hide();
  
  let summaryItems = $("#checkoutSummaryItems");
  summaryItems.html("");
  let total = 0;
  
  cart.forEach(item => {
    let price = parseFloat(item.price.replace(/,/g, "").replace("Rs.", ""));
    let itemTotal = price * item.quantity;
    total += itemTotal;
    
    summaryItems.append(`
      <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:#aaa;margin-bottom:8px;">
        <span>${item.name} (UK ${item.size}) x ${item.quantity}</span>
        <span>Rs.${itemTotal.toLocaleString()}</span>
      </div>
    `);
  });
  
  $("#checkoutSummaryTotal").text("Rs." + total.toLocaleString());
}

function closeCheckoutModal() {
  $("#checkoutModal").removeClass("active");
}
