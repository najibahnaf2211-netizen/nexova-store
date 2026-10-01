// NEXOVA Admin Logic
const ADMIN_PASS = 'Sajid001188';
const LOGO_URL = 'https://i.ibb.co/3ykXWjG/nexova-logo.jpg';

function login() {
  const pass = document.getElementById('pass').value;
  if (pass === ADMIN_PASS) {
    document.getElementById('login').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    loadAdminProducts();
  } else {
    alert('Incorrect Admin Password!');
  }
}

function loadAdminProducts() {
  const products = JSON.parse(localStorage.getItem('nexova_products') || '[]');
  const grid = document.getElementById('adminProducts');
  
  if (!grid) return;

  grid.innerHTML = products.map(p => `
    <div class="admin-card">
      <div class="thumb">
        <img src="${p.image || LOGO_URL}" onerror="this.src='${LOGO_URL}'">
      </div>
      <h4>${p.name}</h4>
      <div class="prices">
        <b>৳${p.price}</b> ${p.oldPrice ? `<span class="old">৳${p.oldPrice}</span>` : ''}
      </div>
      <div style="font-size:11px; color:#aaa; margin:5px 0;">
        Stock Status: <b style="color:${p.inStock ? '#5e5' : '#e55'}">${p.inStock ? 'IN STOCK' : 'OUT OF STOCK'}</b>
      </div>
      ${p.colors && p.colors.length ? `<div style="font-size:10px; color:#888;">Colors: ${p.colors.join(', ')}</div>` : ''}
      <div class="admin-actions">
        <button onclick="toggleStock('${p.id}')">${p.inStock ? 'Mark Out Stock' : 'Mark In Stock'}</button>
        <button onclick="editProduct('${p.id}')">Edit</button>
        <button class="delete" onclick="deleteProduct('${p.id}')">Delete</button>
      </div>
    </div>
  `).join('');

  document.getElementById('statProducts').innerText = products.length;
}

function toggleStock(id) {
  let products = JSON.parse(localStorage.getItem('nexova_products') || '[]');
  const p = products.find(item => item.id === id);
  if (p) {
    p.inStock = !p.inStock;
    localStorage.setItem('nexova_products', JSON.stringify(products));
    loadAdminProducts();
  }
}

function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  let products = JSON.parse(localStorage.getItem('nexova_products') || '[]');
  products = products.filter(p => p.id !== id);
  localStorage.setItem('nexova_products', JSON.stringify(products));
  loadAdminProducts();
}

function openEditor(id = null) {
  document.getElementById('editor').classList.add('open');
  if (!id) {
    document.getElementById('editorTitle').innerText = 'Add Product';
    document.getElementById('pid').value = '';
    document.getElementById('pname').value = '';
    document.getElementById('pprice').value = '';
    document.getElementById('pold').value = '';
    document.getElementById('pcat').value = 'perfumes';
    document.getElementById('ptags').value = '';
    document.getElementById('pcolors').value = '';
    document.getElementById('pdesc').value = '';
    document.getElementById('pimage').value = '';
  }
}

function editProduct(id) {
  const products = JSON.parse(localStorage.getItem('nexova_products') || '[]');
  const p = products.find(item => item.id === id);
  if (!p) return;

  openEditor(id);
  document.getElementById('editorTitle').innerText = 'Edit Product';
  document.getElementById('pid').value = p.id;
  document.getElementById('pname').value = p.name;
  document.getElementById('pprice').value = p.price;
  document.getElementById('pold').value = p.oldPrice || '';
  document.getElementById('pcat').value = p.category;
  document.getElementById('ptags').value = (p.tags || []).join(',');
  document.getElementById('pcolors').value = (p.colors || []).join(',');
  document.getElementById('pdesc').value = p.description || '';
  document.getElementById('pimage').value = p.image || '';
}

function saveProduct() {
  const id = document.getElementById('pid').value || 'p_' + Date.now();
  const name = document.getElementById('pname').value;
  const price = Number(document.getElementById('pprice').value);
  const oldPrice = Number(document.getElementById('pold').value) || null;
  const category = document.getElementById('pcat').value;
  const tags = document.getElementById('ptags').value.split(',').map(t => t.trim()).filter(Boolean);
  const colors = document.getElementById('pcolors').value.split(',').map(c => c.trim()).filter(Boolean);
  const description = document.getElementById('pdesc').value;
  const image = document.getElementById('pimage').value;

  if (!name || !price) {
    alert('Please enter product name and price.');
    return;
  }

  let products = JSON.parse(localStorage.getItem('nexova_products') || '[]');
  const existingIdx = products.findIndex(p => p.id === id);

  const productData = {
    id,
    name,
    price,
    oldPrice,
    category,
    tags,
    colors,
    description,
    image,
    inStock: existingIdx >= 0 ? products[existingIdx].inStock : true
  };

  if (existingIdx >= 0) {
    products[existingIdx] = productData;
  } else {
    products.push(productData);
  }

  localStorage.setItem('nexova_products', JSON.stringify(products));
  closeEditor();
  loadAdminProducts();
}

function closeEditor() {
  document.getElementById('editor').classList.remove('open');
}
