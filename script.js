// ===============================
// 🔥 FIREBASE + AUTH
// ===============================
import { db, auth } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

let isAdmin = false;

// ===============================
// 🔐 ADMIN LOGIN
// ===============================
window.loginAdmin = async function () {
  const email = document.getElementById("adminUser").value.trim();
  const password = document.getElementById("adminPass").value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful");
  } catch {
    alert("Invalid credentials");
  }
};

// ===============================
// 🔐 AUTH STATE
// ===============================
onAuthStateChanged(auth, (user) => {
  if (user) {
    isAdmin = true;
    adminPanel.style.display = "block";
    loginPanel.style.display = "none";
  } else {
    isAdmin = false;
    adminPanel.style.display = "none";
    loginPanel.style.display = "block";
  }
  loadProducts();
});

// ===============================
// 🛒 LOAD PRODUCTS
// ===============================
async function loadProducts() {
  const grid = document.querySelector(".grid");
  grid.querySelectorAll(".firebase-item").forEach(e => e.remove());

  const snapshot = await getDocs(collection(db, "products"));

  snapshot.forEach((item) => {
    const p = item.data();
    const id = item.id;

    const div = document.createElement("div");
    div.className = "product firebase-item";

    div.innerHTML = `
      ${p.offer ? `<div class="offer-badge">${p.offer}</div>` : ""}
      <img src="${p.img}">
      <h3>${p.name}</h3>
      <p class="price">${p.price}</p>
      ${p.stock === 0 ? `<p class="stock">Out of Stock</p>` : ""}
      ${p.stock > 0 && p.stock <= 5 ? `<p class="stock">Only ${p.stock} left</p>` : ""}

      <a href="https://wa.me/9035202055?text=I want ${p.name}" target="_blank">
        <button>Order on WhatsApp</button>
      </a>

      ${
        isAdmin
          ? `
        <button onclick="editProduct('${id}')" style="background:orange;">Edit</button>
        <button onclick="deleteProduct('${id}')" style="background:red;color:white;">Delete</button>
        `
          : ""
      }
    `;
    grid.appendChild(div);
  });
}

// ===============================
// ➕ ADD PRODUCT
// ===============================
window.addNewProduct = async function () {
  if (!isAdmin) return alert("Not authorized");

  const name = pname.value;
  const price = pprice.value;
  const img = pimg.value;
  const offer = poffer.value;
  const stock = Number(pstock.value);

  if (!name || !price || !img) {
    alert("Fill all required fields");
    return;
  }

  await addDoc(collection(db, "products"), {
    name, price, img, offer, stock
  });

  alert("Product Added");
  loadProducts();
};

// ===============================
// ❌ DELETE PRODUCT
// ===============================
window.deleteProduct = async function (id) {
  if (!isAdmin) return;
  await deleteDoc(doc(db, "products", id));
  loadProducts();
};

// ===============================
// ✏️ EDIT PRODUCT
// ===============================
window.editProduct = async function (id) {
  if (!isAdmin) return;

  const name = prompt("Product Name:");
  const price = prompt("Price:");
  const img = prompt("Image URL:");
  const offer = prompt("Offer:");
  const stock = prompt("Stock:");

  await updateDoc(doc(db, "products", id), {
    name, price, img, offer, stock
  });

  loadProducts();
};

// ===============================
// 🚪 LOGOUT
// ===============================
window.logoutAdmin = async function () {
  await signOut(auth);
};

// ===============================
// 🛍 CART SYSTEM (SAFE)
// ===============================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

window.addToCart = function (name, price, img) {
  cart.push({ name, price, img });
  saveCart();
  alert("Added to cart");
};

function renderCart() {
  const cartDiv = document.getElementById("cartItems");
  if (!cartDiv) return;

  cartDiv.innerHTML = "";
  cart.forEach((item, i) => {
    cartDiv.innerHTML += `
      <div>
        <img src="${item.img}" width="50">
        ${item.name} - ${item.price}
        <button onclick="removeFromCart(${i})">X</button>
      </div>
    `;
  });
}

window.removeFromCart = function (i) {
  cart.splice(i, 1);
  saveCart();
  renderCart();
};

renderCart();

// ===============================
// 💳 CHECKOUT (RAZORPAY READY)
// ===============================
window.checkout = function () {
  const total = cart.reduce((sum, item) => {
    return sum + parseInt(item.price.replace("₹", ""));
  }, 0);

  const rzp = new Razorpay({
    key: "RAZORPAY_KEY_ID",
    amount: total * 100,
    currency: "INR",
    name: "MSquare Sports",
    description: "Order Payment",
    handler() {
      alert("Payment Successful");
      cart = [];
      saveCart();
      renderCart();
    }
  });

  rzp.open();
};

// ===============================
// 📲 PWA INSTALL (PREMIUM)
// ===============================
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

window.installHelp = function () {
  navigator.vibrate && navigator.vibrate(30);
  detectDevice();
  installPopup.style.display = "flex";
};

window.triggerInstall = function () {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.finally(() => {
    deferredPrompt = null;
  });
};

window.addEventListener("appinstalled", () => {
  const btn = document.getElementById("installBtn");
  if (btn) btn.style.display = "none";
});
