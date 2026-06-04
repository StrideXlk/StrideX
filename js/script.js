// ===========================
//   StrideX - Main Script
// ===========================

$(document).ready(function () {

  // DYNAMIC CART SIDEBAR INJECTION
  if ($("#cartSidebar").length === 0) {
    $("body").append(`
      <!-- CART SIDEBAR -->
      <div class="cart-sidebar" id="cartSidebar">
        <div class="cart-header">
          <h2>Your Cart</h2>
          <button onclick="toggleCart()" style="background:none;border:none;color:white;font-size:22px;cursor:pointer;">×</button>
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

  // INITIALIZE CART UI ON LOAD
  updateCart();

  // HAMBURGER MENU
  $("#hamburger").on("click", function () {
    $("#nav-links").toggleClass("open");
  });

  // LOAD PRODUCTS
  if ($("#products-container").length) {
    loadProducts("all");
  }

  // FILTER BUTTONS
  $(document).on("click", ".filter-btn", function () {

    $(".filter-btn").removeClass("active");

    $(this).addClass("active");

    let category = $(this).data("category");

    loadProducts(category);

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
    sizes: [6, 7, 8, 9, 10, 11]
  },

  {
    name: "Urban Drift",
    price: "Rs.15,000",
    img: "Images/Shoes/Casual/airstrike1.jpg",
    cartImg: "Images/Cart/urbandrift.jpg",
    category: "casual",
    desc: "Everyday comfort shoes",
    colors: ["#cccccc", "#7d5a3c", "#8e44ad"],
    sizes: [6, 7, 8, 9, 10, 11]
  },

  {
    name: "Summit X1",
    price: "Rs.30,000",
    img: "Images/Shoes/Boots/airstrike1.jpg",
    cartImg: "Images/Cart/summitx1.jpg",
    category: "Boots",
    desc: "High-performance boot",
    colors: ["#cccccc", "#7d5a3c", "#546e7a", "#e74c3c"],
    sizes: [7, 8, 9, 10, 11, 12]
  },

  {
    name: "Classic Edge",
    price: "Rs.10,000",
    img: "Images/Shoes/Formal/airstrike1.jpg",
    cartImg: "Images/Cart/classicedge.jpg",
    category: "formal",
    desc: "Sleek formal leather shoes",
    colors: ["#1a1a1a", "#7d5a3c", "#cccccc"],
    sizes: [6, 7, 8, 9, 10, 11]
  },

  {
    name: "NightRun 90",
    price: "Rs.25,000",
    img: "Images/Shoes/Sneaker/airstrike2.jpg",
    cartImg: "Images/Cart/nightrun90.jpg",
    category: "sneakers",
    desc: "Reflective night runner",
    colors: ["#1a1a1a", "#e74c3c", "#f39c12"],
    sizes: [6, 7, 8, 9, 10, 11]
  },

  {
    name: "TrailBlaze GTX",
    price: "Rs.20,000",
    img: "Images/Shoes/Boots/airstrike2.jpg",
    cartImg: "Images/Cart/TrailBlaze GTX.jpg",
    category: "Boots",
    desc: "Waterproof trail boot",
    colors: ["#1a1a1a", "#546e7a", "#7d5a3c"],
    sizes: [7, 8, 9, 10, 11, 12]
  },

  {
    name: "Canvas Wave",
    price: "Rs.15,000",
    img: "Images/Shoes/Casual/airstrike2.jpg",
    cartImg: "Images/Cart/canvaswave.jpg",
    category: "casual",
    desc: "Breezy canvas slip-on",
    colors: ["#cccccc", "#2980b9", "#e74c3c"],
    sizes: [6, 7, 8, 9, 10, 11]
  },

  {
    name: "Oxford Premier",
    price: "Rs.10,000",
    img: "Images/Shoes/Formal/airstrike2.jpg",
    cartImg: "Images/Cart/oxfordpremier.jpg",
    category: "formal",
    desc: "Premium Oxford dress shoe",
    colors: ["#1a1a1a", "#7d5a3c"],
    sizes: [6, 7, 8, 9, 10, 11]
  },

  {
    name: "Bolt Speed",
    price: "Rs.25,000",
    img: "Images/Shoes/Sneaker/airstrike3.jpg",
    cartImg: "Images/Cart/boltspeed.jpg",
    category: "sneakers",
    desc: "Speed training shoe",
    colors: ["#1a1a1a", "#e74c3c", "#f1c40f"],
    sizes: [6, 7, 8, 9, 10, 11]
  }

];


// ===========================
// LOAD PRODUCTS
// ===========================

function loadProducts(category) {

  let container = $("#products-container");

  container.html("");

  allProducts.forEach(function (p) {

    if (
      category === "all" ||
      p.category === category
    ) {

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

    }

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
      class="size-btn${i === 1 ? ' active' : ''}"
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

  cart.forEach(function (item) {

    let price =
      parseFloat(
        item.price.replace(/,/g, "").replace("Rs.", "")
      );

    let itemTotal = price * item.quantity;

    total      += itemTotal;
    totalItems += item.quantity;

    let safeKey = encodeURIComponent(item.cartKey);

    cartItems.append(`

      <div class="cart-item-simple" style="position:relative;">

        <img
          src="${item.cartImg}"
          class="cart-thumb"
        >

        <div class="cart-info" style="flex:1;">

          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">

            <div class="cart-item-name" style="margin:0;">
              ${item.name}
            </div>

            <button
              class="cart-remove-btn"
              data-key="${safeKey}"
              title="Remove"
              style="background:none;border:none;color:#666;font-size:16px;cursor:pointer;padding:0 4px;line-height:1;"
            >✕</button>

          </div>

          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;font-size:0.8rem;color:#aaa;">
            <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${item.color};border:1px solid #555;flex-shrink:0;"></span>
            Size: UK ${item.size} &nbsp;|&nbsp; Qty: ${item.quantity}
          </div>

          <div class="cart-item-price">
            Rs.${itemTotal.toLocaleString()}
          </div>

        </div>

      </div>

    `);

  });

  subtotal.text("Rs." + total.toLocaleString());

  if (totalItems > 0) {

    cartCount.text(totalItems);

    cartCount.css("display", "flex");

  } else {

    cartCount.hide();

  }

  // SAVE CART TO LOCALSTORAGE
  try {
    localStorage.setItem("stridex_cart", JSON.stringify(cart));
  } catch (e) {
    console.error("Failed to save cart to localStorage", e);
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
