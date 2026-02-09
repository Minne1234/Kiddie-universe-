const PRODUCTS = [
  {
    id: 1,
    name: "Galaxy Rocket Backpack",
    price: 54.99,
    description: "A lightweight backpack with glow-in-the-dark patches and plenty of room for snacks, books, and imagination.",
    badge: "Best seller",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Rainbow Craft Kit",
    price: 24.5,
    description: "Packed with 50+ colorful supplies, stickers, and kid-safe scissors for endless creative afternoons.",
    badge: "New",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Storytime Plush Owl",
    price: 18.0,
    description: "Soft plush owl with a hidden pocket for bedtime stories and a soothing lavender scent pouch.",
    badge: "Cozy pick",
    image: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Explorer Mini Tent",
    price: 64.0,
    description: "Indoor pop-up tent with starry ceiling, perfect for reading, napping, and pretend camping.",
    badge: "Limited",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Supernova Sneakers",
    price: 39.99,
    description: "Comfortable sneakers with light-up soles and adjustable straps for quick adventures.",
    badge: "Fan favorite",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Ocean Breeze Water Bottle",
    price: 14.75,
    description: "Leak-proof bottle with a flip straw and playful sea creature stickers included.",
    badge: "Eco",
    image: "https://images.unsplash.com/photo-1526401485004-2fda9f7a0a65?auto=format&fit=crop&w=800&q=80",
  },
];

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const cartKey = "kiddie_cart";

function getCart() {
  const raw = localStorage.getItem(cartKey);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart();
  const updated = cart.filter((item) => item.id !== productId);
  saveCart(updated);
}

function calculateTotal(cart) {
  return cart.reduce((sum, item) => {
    const product = PRODUCTS.find((entry) => entry.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
}

function renderFeatured() {
  const container = document.querySelector("[data-featured]");
  if (!container) return;
  const featured = PRODUCTS.slice(0, 3);
  container.innerHTML = featured
    .map((product) =>
      buildCard(product, { showDetails: false, showLink: true })
    )
    .join("");
}

function renderProducts() {
  const container = document.querySelector("[data-products]");
  if (!container) return;
  container.innerHTML = PRODUCTS.map((product) =>
    buildCard(product, { showDetails: true, showLink: true })
  ).join("");

  container.querySelectorAll("button[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(Number(button.dataset.add));
      button.textContent = "Added!";
      setTimeout(() => {
        button.textContent = "Add to cart";
      }, 1000);
    });
  });
}

function renderProductPage() {
  const container = document.querySelector("[data-product-page]");
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const product = PRODUCTS.find((item) => item.id === id) || PRODUCTS[0];
  container.innerHTML = `
    <div class="product-layout">
      <img src="${product.image}" alt="${product.name}">
      <div>
        <span class="badge">${product.badge}</span>
        <h1>${product.name}</h1>
        <p>${product.description}</p>
        <p class="price">${formatter.format(product.price)}</p>
        <div class="card-actions">
          <button data-add="${product.id}">Add to cart</button>
          <a class="secondary" href="products.html">Back to products</a>
        </div>
      </div>
    </div>
  `;

  const addButton = container.querySelector("button[data-add]");
  addButton.addEventListener("click", () => {
    addToCart(product.id);
    addButton.textContent = "Added!";
    setTimeout(() => {
      addButton.textContent = "Add to cart";
    }, 1000);
  });
}

function renderCart() {
  const container = document.querySelector("[data-cart]");
  if (!container) return;
  const cart = getCart();
  const list = container.querySelector(".cart-list");
  const totalEl = container.querySelector("[data-total]");
  if (cart.length === 0) {
    list.innerHTML = "<p>Your cart is empty. Visit the products page to add items.</p>";
    totalEl.textContent = formatter.format(0);
    return;
  }

  list.innerHTML = cart
    .map((item) => {
      const product = PRODUCTS.find((entry) => entry.id === item.id);
      if (!product) return "";
      return `
        <div class="cart-item">
          <div>
            <strong>${product.name}</strong><br>
            <span>${item.quantity} × ${formatter.format(product.price)}</span>
          </div>
          <div class="card-actions">
            <button class="secondary" data-remove="${product.id}">Remove</button>
          </div>
        </div>
      `;
    })
    .join("");

  totalEl.textContent = formatter.format(calculateTotal(cart));

  list.querySelectorAll("button[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(Number(button.dataset.remove));
      renderCart();
    });
  });
}

function setupCheckout() {
  const form = document.querySelector("[data-checkout-form]");
  const notice = document.querySelector("[data-checkout-notice]");
  if (!form || !notice) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveCart([]);
    notice.innerHTML = "<strong>Order placed!</strong> Thanks for shopping with Kiddie Universe.";
    notice.style.display = "block";
    form.reset();
  });
}

function buildCard(product, options) {
  const details = options.showDetails
    ? `<p>${product.description}</p>`
    : "<p>Playful, practical, and kid-approved essentials.</p>";

  const link = options.showLink
    ? `<a href="product.html?id=${product.id}">View</a>`
    : "";

  return `
    <div class="card">
      <img src="${product.image}" alt="${product.name}">
      <span class="badge">${product.badge}</span>
      <h3>${product.name}</h3>
      ${details}
      <p class="price">${formatter.format(product.price)}</p>
      <div class="card-actions">
        ${link}
        <button data-add="${product.id}">Add to cart</button>
      </div>
    </div>
  `;
}

renderFeatured();
renderProducts();
renderProductPage();
renderCart();
setupCheckout();
