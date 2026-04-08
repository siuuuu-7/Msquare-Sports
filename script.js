import { db, auth } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

let isAdmin = false;

// 🔐 LOGIN
window.loginAdmin = async function () {
  const email = document.getElementById("adminUser").value;
  const password = document.getElementById("adminPass").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful");
  } catch (err) {
    console.log(err.code, err.message);
    alert("Login failed: " + err.code);
  }
};

// 🔐 AUTH STATE
onAuthStateChanged(auth, (user) => {
  if (user) {
    isAdmin = true;
    document.getElementById("adminPanel").style.display = "block";
    document.getElementById("loginPanel").style.display = "none";
  } else {
    isAdmin = false;
    document.getElementById("adminPanel").style.display = "none";
    document.getElementById("loginPanel").style.display = "block";
  }
  loadProducts();
  loadOrders();
});

// 🚀 LOAD PRODUCTS
async function loadProducts() {
  const grid = document.querySelector(".grid");
  grid.querySelectorAll(".firebase-item").forEach(el => el.remove());

  const snapshot = await getDocs(collection(db, "products"));
  snapshot.forEach((docItem) => {
    const p = docItem.data();
    const id = docItem.id;

    const div = document.createElement("div");
    div.className = "product firebase-item";

    div.innerHTML = `
      ${p.offer ? `<div class="offer-badge">${p.offer}</div>` : ""}
      <img src="${p.img}">
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="price">${p.price}</p>
        <p class="stock">${p.stock <= 5 ? "Only " + p.stock + " left" : ""}</p>

        <button class="buy-btn" onclick="placeOrder('${id}','${p.name}')">Order Now</button>
      </div>
    `;
    grid.appendChild(div);
  });
}

// 🛒 PLACE ORDER
window.placeOrder = async function (productId, productName) {
  const customerName = prompt("Enter your name:");
  const customerPhone = prompt("Enter your phone number:");

  if (!customerName || !customerPhone) return alert("Name & phone required");

  await addDoc(collection(db, "orders"), {
    productId,
    productName,
    customerName,
    customerPhone,
    status: "pending",   // default status
    timestamp: new Date()
  });

  alert("Order placed successfully!");
};

// 📦 ADMIN — LOAD ORDERS
async function loadOrders() {
  if (!isAdmin) return;

  const ordersContainer = document.getElementById("ordersList");
  if (!ordersContainer) return;

  ordersContainer.innerHTML = "";

  const snapshot = await getDocs(collection(db, "orders"));
  snapshot.forEach((docItem) => {
    const o = docItem.data();
    const id = docItem.id;

    const div = document.createElement("div");
    div.className = "order-item";

    div.innerHTML = `
      <strong>${o.productName}</strong> - ${o.customerName} (${o.customerPhone})
      <br>Status: <select onchange="updateOrderStatus('${id}', this.value)">
        <option value="pending" ${o.status==='pending'?'selected':''}>Pending</option>
        <option value="paid" ${o.status==='paid'?'selected':''}>Paid</option>
        <option value="shipped" ${o.status==='shipped'?'selected':''}>Shipped</option>
      </select>
      <button onclick="deleteOrder('${id}')" style="background:red;margin-left:10px;">Delete</button>
      <hr>
    `;
    ordersContainer.appendChild(div);
  });
}

// ✏️ UPDATE ORDER STATUS
window.updateOrderStatus = async function (id, status) {
  await updateDoc(doc(db, "orders", id), { status });
  alert("Status updated");
};

// ❌ DELETE ORDER
window.deleteOrder = async function (id) {
  await deleteDoc(doc(db, "orders", id));
  alert("Order deleted");
  loadOrders();
};

// 🚪 LOGOUT
window.logoutAdmin = async function () {
  await signOut(auth);
};
