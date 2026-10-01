const DEFAULT_PRODUCTS = [
{id:1,name:"Chocolate Noir Perfume 20ml",price:399,oldPrice:699,category:"perfumes",tags:["hot","men","women","discount"],icon:"✦",desc:"A rich chocolate-inspired fragrance with a warm, elegant character."},
{id:2,name:"Chocolate Noir Perfume 60ml",price:999,oldPrice:1599,category:"perfumes",tags:["hot","highrange","men","women","discount"],icon:"♛",desc:"Premium 60ml statement fragrance for a sophisticated everyday signature."},
{id:3,name:"NEXOVA Elite Watch",price:2490,oldPrice:3290,category:"watch",tags:["highrange","men","hot","discount"],icon:"⌚",desc:"A luxury-inspired statement watch for formal and smart-casual looks."},
{id:4,name:"Urban Classic Watch",price:1490,oldPrice:1890,category:"watch",tags:["midrange","men"],icon:"⌚",desc:"Clean dial and versatile styling for daily wear."},
{id:5,name:"Gold Edge Bracelet",price:499,oldPrice:699,category:"bracelet",tags:["hot","men","women","discount"],icon:"◉",desc:"Minimal premium bracelet designed to layer effortlessly."},
{id:6,name:"Signature Gift Box",price:1299,oldPrice:1699,category:"gift-box",tags:["hot","women","men","discount"],icon:"🎁",desc:"A curated luxury gift box for birthdays, anniversaries and special moments."},
{id:7,name:"NEXOVA Smart Gadget",price:1890,oldPrice:2290,category:"gadgets",tags:["midrange","hot"],icon:"◈",desc:"A stylish everyday gadget concept product for the NEXOVA collection."},
{id:8,name:"Premium Sunglass",price:890,oldPrice:1190,category:"sunglass",tags:["midrange","men","women","discount"],icon:"🕶",desc:"Fashion-forward sunglasses with a premium look."},
{id:9,name:"MagSafe Phone Accessory",price:590,oldPrice:790,category:"phone-accessories",tags:["midrange"],icon:"◉",desc:"A compact phone accessory for modern devices."},
{id:10,name:"Premium Oversized T-Shirt",price:690,oldPrice:899,category:"t-shirt",tags:["hot","men","women","discount"],icon:"T",desc:"Comfort-first premium casual T-shirt."},
{id:11,name:"Classic Men's Shirt",price:1090,oldPrice:1390,category:"shirt",tags:["men","midrange"],icon:"▣",desc:"Smart shirt for a polished everyday wardrobe."},
{id:12,name:"Modern Fit Pant",price:1190,oldPrice:1490,category:"pant",tags:["men","midrange"],icon:"▥",desc:"Clean modern fit for smart casual styling."},
{id:13,name:"Glow Beauty Set",price:990,oldPrice:1290,category:"beauty",tags:["women","hot","discount"],icon:"✿",desc:"A curated beauty set for everyday self-care."},
{id:14,name:"Kids Fun Gift Pack",price:799,oldPrice:999,category:"kids",tags:["kids","gift-box"],icon:"★",desc:"Fun gift collection for kids."},
{id:15,name:"Bike Rider Accessories Kit",price:1290,oldPrice:1590,category:"bike-accessories",tags:["men","midrange"],icon:"🏍",desc:"Useful rider accessories in one convenient kit."},
{id:16,name:"Mystery Box — NEXOVA Edition",price:999,oldPrice:1499,category:"mystery-box",tags:["hot","discount"],icon:"?",desc:"A surprise selection from the NEXOVA lifestyle collection."}
];

let products = JSON.parse(localStorage.getItem("nexova_products") || "null") || DEFAULT_PRODUCTS;
let cart = JSON.parse(localStorage.getItem("nexova_cart") || "[]");
let currentFilter = "all";

function money(n){return "৳"+Number(n).toLocaleString("en-BD")}
function save(){localStorage.setItem("nexova_products",JSON.stringify(products));localStorage.setItem("nexova_cart",JSON.stringify(cart))}
function toast(msg){const d=document.createElement("div");d.className="toast-msg";d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),1800)}
function productImage(p, large=false){return `<div class="${large?'large-image':'product-image'}">${p.image?`<img src="${p.image}" alt="${p.name}">`:`<div class="placeholder-icon">${p.icon||"✦"}</div>`}</div>`}
function priceHTML(p){return `<div class="price"><strong>${money(p.price)}</strong>${p.oldPrice?`<span class="old">${money(p.oldPrice)}</span>`:""}</div>`}
function discount(p){return p.oldPrice?Math.round((1-p.price/p.oldPrice)*100):0}

function card(p){
  return `<article class="product-card">
    <div onclick="openProduct(${p.id})">${productImage(p)}${discount(p)>0?`<span class="discount-badge">-${discount(p)}%</span>`:""}<button class="wish" onclick="event.stopPropagation();wishlist(${p.id})">♡</button></div>
    <div class="product-info"><small>${p.category.replaceAll("-"," ")}</small><h3>${p.name}</h3>${priceHTML(p)}
    <div class="product-actions"><button onclick="addToCart(${p.id})">Add to Cart</button><button class="buy" onclick="buyNow(${p.id})">Order Now</button></div></div>
  </article>`
}
function getFiltered(){
  let arr=[...products];
  if(currentFilter==="all") return arr;
  if(["hot","midrange","highrange","men","women","kids","discount"].includes(currentFilter)) arr=arr.filter(p=>p.tags?.includes(currentFilter)||(currentFilter==="discount"&&p.oldPrice));
  else arr=arr.filter(p=>p.category===currentFilter);
  const q=(document.getElementById("searchInput")?.value||"").toLowerCase().trim();
  if(q) arr=arr.filter(p=>(p.name+" "+p.category+" "+(p.desc||"")).toLowerCase().includes(q));
  const sort=document.getElementById("sortSelect")?.value;
  if(sort==="low") arr.sort((a,b)=>a.price-b.price); if(sort==="high") arr.sort((a,b)=>b.price-a.price); if(sort==="discount") arr.sort((a,b)=>discount(b)-discount(a));
  return arr;
}
function render(){
  document.getElementById("productGrid").innerHTML=getFiltered().map(card).join("")||`<div class="no-results">No products found.</div>`;
  const hot=products.filter(p=>p.tags?.includes("hot")).slice(0,4);
  document.getElementById("hotGrid").innerHTML=hot.map(card).join("");
  document.getElementById("activeFilter").textContent="Showing: "+(currentFilter==="all"?"All Products":currentFilter.replaceAll("-"," "));
  document.getElementById("cartCount").textContent=cart.reduce((s,i)=>s+i.qty,0);
}
function filterProducts(cat){currentFilter=cat;render();document.getElementById("shop").scrollIntoView({behavior:"smooth"});document.querySelectorAll(".side-link").forEach(x=>x.classList.toggle("active",x.dataset.cat===cat))}
function scrollToShop(){document.getElementById("shop").scrollIntoView({behavior:"smooth"})}
function openProduct(id){
 const p=products.find(x=>x.id===id); if(!p)return;
 document.getElementById("productModalContent").innerHTML=`<div class="product-modal-grid"><div>${productImage(p,true)}</div><div><small>${p.category.replaceAll("-"," ").toUpperCase()}</small><h2>${p.name}</h2>${priceHTML(p)}<p class="detail-list">${p.desc||""}</p><p class="detail-list">✓ Quality checked<br>✓ Easy ordering<br>✓ Multiple payment options<br>✓ Customer support</p><div class="product-actions"><button onclick="addToCart(${p.id});closeModal('productModal')">Add to Cart</button><button class="buy" onclick="buyNow(${p.id});closeModal('productModal')">Order Now</button></div></div></div>`;
 document.getElementById("productModal").classList.add("open");
}
function addToCart(id,qty=1){const item=cart.find(x=>x.id===id);if(item)item.qty+=qty;else cart.push({id,qty});save();render();toast("Added to cart ✦")}
function buyNow(id){cart=[{id,qty:1}];save();openCheckout()}
function removeCart(id){cart=cart.filter(x=>x.id!==id);save();render();openCart()}
function changeQty(id,n){const x=cart.find(i=>i.id===id);if(!x)return;x.qty+=n;if(x.qty<=0)removeCart(id);else{save();render();openCart()}}
function cartTotals(){let subtotal=cart.reduce((s,i)=>{const p=products.find(p=>p.id===i.id);return s+(p?p.price*i.qty:0)},0);return {subtotal,delivery:subtotal?80:0,total:subtotal+(subtotal?80:0)}}
function openCart(){
 document.getElementById("cartItems").innerHTML=cart.length?cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class="cart-row"><div class="cart-thumb">${p?.image?`<img src="${p.image}">`:p?.icon||"✦"}</div><div><h4>${p?.name||"Product"}</h4><small>${money(p?.price||0)}</small></div><div class="qty"><button onclick="changeQty(${i.id},-1)">−</button><span>${i.qty}</span><button onclick="changeQty(${i.id},1)">+</button><button onclick="removeCart(${i.id})" class="icon-btn">×</button></div></div>`}).join(""):`<div class="empty">Your cart is empty.</div>`;
 const t=cartTotals();
 document.getElementById("cartSummary").innerHTML=cart.length?`<div class="summary"><div class="summary-line"><span>Subtotal</span><span>${money(t.subtotal)}</span></div><div class="summary-line"><span>Delivery</span><span>${money(t.delivery)}</span></div><div class="summary-line total"><span>Total</span><span>${money(t.total)}</span></div><button class="gold-btn" style="width:100%;margin-top:14px" onclick="openCheckout()">Proceed to Checkout</button></div>`:"";
 document.getElementById("cartModal").classList.add("open")
}
function openCheckout(){
 if(!cart.length){toast("Add a product first");return}
 closeModal("cartModal");
 document.getElementById("checkoutContent").innerHTML=`<h2>Secure Checkout</h2><p style="color:#777">Complete your details to place the order.</p><div class="checkout-grid"><div>
 <div class="field"><label>Full Name</label><input id="coName" placeholder="Your name"></div>
 <div class="field"><label>Phone Number</label><input id="coPhone" placeholder="01XXXXXXXXX"></div>
 <div class="field"><label>Delivery Address</label><textarea id="coAddress" rows="4" placeholder="District, area, full address"></textarea></div>
 </div><div><div class="field"><label>Payment Method</label><div class="payment-list">
 <label class="payment-option"><input type="radio" name="pay" value="cod" checked> Cash on Delivery</label>
 <label class="payment-option"><input type="radio" name="pay" value="bkash"> bKash</label>
 <label class="payment-option"><input type="radio" name="pay" value="nagad"> Nagad</label>
 <label class="payment-option"><input type="radio" name="pay" value="rocket"> Rocket</label>
 <label class="payment-option"><input type="radio" name="pay" value="online"> Online Payment</label></div></div>
 <div class="summary">${checkoutSummary()}<button class="gold-btn" style="width:100%;margin-top:12px" onclick="placeOrder()">Place Order</button></div></div></div>`;
 document.getElementById("checkoutModal").classList.add("open")
}
function checkoutSummary(){const t=cartTotals();return `<div class="summary-line"><span>Items</span><span>${cart.reduce((s,x)=>s+x.qty,0)}</span></div><div class="summary-line total"><span>Total</span><span>${money(t.total)}</span></div>`}
function placeOrder(){
 const name=document.getElementById("coName").value.trim(),phone=document.getElementById("coPhone").value.trim(),address=document.getElementById("coAddress").value.trim(),pay=document.querySelector('input[name="pay"]:checked').value;
 if(!name||!phone||!address){toast("Please complete all required details");return}
 const order={id:"NX"+Date.now(),date:new Date().toISOString(),name,phone,address,payment:pay,items:cart.map(i=>({id:i.id,qty:i.qty})),total:cartTotals().total};
 const orders=JSON.parse(localStorage.getItem("nexova_orders")||"[]");orders.unshift(order);localStorage.setItem("nexova_orders",JSON.stringify(orders));
 const wa="01882243588";
 const lines=order.items.map(i=>{const p=products.find(x=>x.id===i.id);return `${p?.name} x${i.qty}`}).join("%0A");
 const msg=`NEXOVA Order ${order.id}%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AAddress: ${encodeURIComponent(address)}%0APayment: ${pay}%0AItems:%0A${lines}%0ATotal: ${money(order.total)}`;
 cart=[];save();render();closeModal("checkoutModal");toast("Order placed ✦");
 setTimeout(()=>window.open(`https://wa.me/88${wa.slice(1)}?text=${msg}`,"_blank"),300);
}
function wishlist(id){let w=JSON.parse(localStorage.getItem("nexova_wishlist")||"[]");if(!w.includes(id))w.push(id);localStorage.setItem("nexova_wishlist",JSON.stringify(w));toast("Saved to wishlist ♡")}
function closeModal(id){document.getElementById(id)?.classList.remove("open")}

document.querySelectorAll(".side-link").forEach(b=>b.addEventListener("click",()=>{filterProducts(b.dataset.cat);document.getElementById("sidebar").classList.remove("open");document.getElementById("overlay").classList.remove("open")}));
document.getElementById("menuBtn").onclick=()=>{document.getElementById("sidebar").classList.add("open");document.getElementById("overlay").classList.add("open")};
document.getElementById("closeMenu").onclick=()=>{document.getElementById("sidebar").classList.remove("open");document.getElementById("overlay").classList.remove("open")};
document.getElementById("overlay").onclick=()=>document.getElementById("closeMenu").click();
document.getElementById("cartBtn").onclick=openCart;
document.getElementById("searchBtn").onclick=()=>{document.getElementById("searchPanel").classList.toggle("open");document.getElementById("searchInput").focus()};
document.getElementById("searchClose").onclick=()=>document.getElementById("searchPanel").classList.remove("open");
document.getElementById("searchInput").addEventListener("input",render);
document.getElementById("sortSelect").addEventListener("change",render);
document.getElementById("aiFab").onclick=()=>document.getElementById("aiChat").classList.add("open");
document.getElementById("aiClose").onclick=()=>document.getElementById("aiChat").classList.remove("open");
function aiReply(q){q=q.toLowerCase();if(q.includes("price")||q.includes("দাম"))return "You can browse the Shop Collection to see live NEXOVA prices and discounts.";if(q.includes("order")||q.includes("অর্ডার"))return "Open any product and tap Order Now, or add multiple products to Cart and checkout together.";if(q.includes("payment")||q.includes("bkash")||q.includes("nagad"))return "Checkout supports Cash on Delivery plus bKash, Nagad, Rocket and an online-payment option. Merchant credentials must be connected before live online payment.";if(q.includes("perfume"))return "NEXOVA currently has 20ml and 60ml chocolate-inspired perfume options.";return "I can help you find products, understand prices, ordering and payment options. What are you looking for?"}
document.getElementById("aiSend").onclick=sendAI;document.getElementById("aiInput").addEventListener("keydown",e=>{if(e.key==="Enter")sendAI()});
function sendAI(){const inp=document.getElementById("aiInput"),q=inp.value.trim();if(!q)return;const box=document.getElementById("aiMessages");box.innerHTML+=`<div class="ai-msg user">${q.replaceAll("<","&lt;")}</div>`;inp.value="";setTimeout(()=>{box.innerHTML+=`<div class="ai-msg bot">${aiReply(q)}</div>`;box.scrollTop=box.scrollHeight},250)}
render();
