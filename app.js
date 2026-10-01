// NEXOVA - Main Store Application Logic
const DEFAULT_PRODUCTS = [
  {
    id: 'p1',
    name: 'NEXOVA Chocolate Perfume 60ml',
    price: 599,
    oldPrice: 1299,
    category: 'perfumes',
    tags: ['hot', 'discount', 'men', 'women'],
    image: 'nexova-logo.webp',
    inStock: true,
    colors: ['Gold Edition', 'Dark Chocolate'],
    description: 'A fragrance that tastes like happiness. Rich, sweet and seductive chocolate note perfume.'
  }
];

function getProducts() {
  const local = localStorage.getItem('nexova_products');
  if (!local) {
    localStorage.setItem('nexova_products', JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
  return JSON.parse(local);
}

function getCart() {
  return JSON.parse(localStorage.getItem('nexova_cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('nexova_cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const el = document.getElementById('cartCount');
  if (el) el.innerText = count;
}

function renderProducts(filterCategory = 'all', searchQuery = '') {
  const products = getProducts();
  const grid = document.getElementById('productGrid');
  const hotGrid = document.getElementById('hotGrid');

  if (!grid) return;

  let filtered = products.filter(p => {
    const matchesCat = filterCategory === 'all' ? true :
      filterCategory === 'hot' ? p.tags.includes('hot') :
      filterCategory === 'discount' ? (p.oldPrice && p.oldPrice > p.price) :
      p.category === filterCategory || p.tags.includes(filterCategory);

    const matchesSearch = searchQuery === '' ? true :
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="no-results">কোনো প্রোডাক্ট পাওয়া যায়নি।</div>`;
  } else {
    grid.innerHTML = filtered.map(p => createProductCard(p)).join('');
  }

  if (hotGrid) {
    const hotProducts = products.filter(p => p.tags.includes('hot'));
    hotGrid.innerHTML = hotProducts.map(p => createProductCard(p)).join('');
  }
}

function createProductCard(p) {
  const isDiscount = p.oldPrice && p.oldPrice > p.price;
  const discountPercent = isDiscount ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
  
  return `
    <div class="product-card ${!p.inStock ? 'out-of-stock' : ''}">
      <div class="product-image">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" onerror="this.src='nexova-logo.webp'">` : `<div class="placeholder-icon">✦</div>`}
        ${isDiscount ? `<span class="discount-badge">-${discountPercent}% OFF</span>` : ''}
        ${!p.inStock ? `<span class="stock-badge">STOCK OUT</span>` : ''}
      </div>
      <div class="product-info">
        <small>${p.category}</small>
        <h3>${p.name}</h3>
        <div class="price">
          <strong>৳${p.price}</strong>
          ${p.oldPrice ? `<span class="old">৳${p.oldPrice}</span>` : ''}
        </div>
        ${p.colors && p.colors.length ? `<div class="color-tags">Colors: ${p.colors.join(', ')}</div>` : ''}
        <div class="product-actions">
          <button onclick="openProductModal('${p.id}')">View Details</button>
          <button class="buy" onclick="quickBuy('${p.id}')" ${!p.inStock ? 'disabled' : ''}>
            ${p.inStock ? 'Order Now' : 'Stock Out'}
          </button>
        </div>
      </div>
    </div>
  `;
}

function openProductModal(id) {
  const products = getProducts();
  const p = products.find(item => item.id === id);
  if (!p) return;

  const content = document.getElementById('productModalContent');
  content.innerHTML = `
    <div class="product-modal-grid">
      <div class="large-image">
        <img src="${p.image || 'nexova-logo.webp'}" alt="${p.name}">
      </div>
      <div>
        <h2>${p.name}</h2>
        <div class="price" style="font-size:22px; margin:15px 0;">
          <strong>৳${p.price}</strong>
          ${p.oldPrice ? `<span class="old">৳${p.oldPrice}</span>` : ''}
        </div>
        <p class="detail-list">${p.description || 'No description available.'}</p>
        
        ${p.colors && p.colors.length ? `
          <div class="field" style="margin-top:15px;">
            <label>Select Color / Variant:</label>
            <select id="modalColorSelect">
              ${p.colors.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
        ` : ''}

        <div style="margin-top:20px; display:flex; gap:10px;">
          <button class="gold-btn" style="flex:1;" onclick="addToCartModal('${p.id}')" ${!p.inStock ? 'disabled' : ''}>
            ${p.inStock ? 'Add To Cart 🛒' : 'Stock Out'}
          </button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('productModal').classList.add('open');
}

function addToCartModal(id) {
  const products = getProducts();
  const p = products.find(item => item.id === id);
  const colorSelect = document.getElementById('modalColorSelect');
  const selectedColor = colorSelect ? colorSelect.value : null;

  let cart = getCart();
  const existing = cart.find(item => item.id === id && item.selectedColor === selectedColor);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: p.id,
      name: p.name + (selectedColor ? ` (${selectedColor})` : ''),
      price: p.price,
      image: p.image,
      selectedColor: selectedColor,
      qty: 1
    });
  }

  saveCart(cart);
  closeModal('productModal');
  showToast('Product added to cart!');
}

function quickBuy(id) {
  openProductModal(id);
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('open');
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartCount();

  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  
  if (menuBtn) {
    menuBtn.onclick = () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    };
  }
  if (overlay) {
    overlay.onclick = () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    };
  }

  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.onclick = () => {
      renderCartModal();
      document.getElementById('cartModal').classList.add('open');
    };
  }
});

function renderCartModal() {
  const cart = getCart();
  const container = document.getElementById('cartItems');
  const summary = document.getElementById('cartSummary');

  if (cart.length === 0) {
    container.innerHTML = `<div class="empty">আপনার কার্ট ফাঁকা রয়েছে।</div>`;
    summary.innerHTML = '';
    return;
  }

  container.innerHTML = cart.map((item, idx) => `
    <div class="cart-row">
      <div class="cart-thumb"><img src="${item.image || 'nexova-logo.webp'}"></div>
      <div>
        <h4>${item.name}</h4>
        <small>৳${item.price}</small>
      </div>
      <div class="qty">
        <button onclick="changeQty(${idx}, -1)">-</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${idx}, 1)">+</button>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  summary.innerHTML = `
    <div class="summary">
      <div class="summary-line total">
        <span>Total:</span>
        <strong>৳${total}</strong>
      </div>
    </div>
  `;
}

function changeQty(index, delta) {
  let cart = getCart();
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveCart(cart);
  renderCartModal();
}
