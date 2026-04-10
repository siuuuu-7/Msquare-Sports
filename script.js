// script.js
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

// 🔐 LOGIN
window.loginAdmin = async function () {
  const email = document.getElementById("adminUser").value.trim();
  const password = document.getElementById("adminPass").value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful");
  } catch (err) {
    alert("Invalid credentials");
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
});

// 🔥 LOAD PRODUCTS
async function loadProducts() {
  const grid = document.querySelector(".grid");
  grid.querySelectorAll(".firebase-item").forEach(el => el.remove());

  const snapshot = await getDocs(collection(db, "products"));

  snapshot.forEach((item) => {
    const p = item.data();
    const id = item.id;

    const div = document.createElement("div");
    div.className = "product firebase-item";

    div.innerHTML = `
      ${p.offer ? `<div class="offer-badge">${p.offer}</div>` : ""}
      <img src="${p.img}" alt="${p.name}">
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="price">${p.price}</p>
        <p class="stock">${p.stock <= 5 ? "Only " + p.stock + " left" : ""}</p>

        <a href="https://wa.me/9035202055?text=I want ${p.name}" target="_blank">
          <button class="buy-btn">Order on WhatsApp</button>
        </a>

        ${
          isAdmin
            ? `
          <button onclick="editProduct('${id}')" style="background:orange;margin-top:5px;">Edit</button>
          <button onclick="deleteProduct('${id}')" class="delete-btn">Delete</button>
          `
            : ""
        }
      </div>
    `;

    grid.appendChild(div);
  });
}

// ➕ ADD PRODUCT
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
    name,
    price,
    img,
    offer,
    stock
  });

  alert("Product Added");
  loadProducts();
};

// ❌ DELETE PRODUCT
window.deleteProduct = async function (id) {
  if (!isAdmin) return;

  await deleteDoc(doc(db, "products", id));
  loadProducts();
};

// ✏️ EDIT PRODUCT
window.editProduct = async function (id) {
  if (!isAdmin) return;

  const name = prompt("Product Name:");
  const price = prompt("Price:");
  const img = prompt("Image URL:");
  const offer = prompt("Offer:");
  const stock = prompt("Stock:");

  await updateDoc(doc(db, "products", id), {
    name,
    price,
    img,
    offer,
    stock
  });

  loadProducts();
};

// 🚪 LOGOUT
window.logoutAdmin = async function () {
  await signOut(auth);
};
${p.stock == 0 ? "<p class='stock'>Out of Stock</p>" : ""}
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
<button onclick="addToCart('${p.name}', '${p.price}', '${p.img}')">
  Add to Cart
</button>
window.addToCart = function (name, price, img) {
  cart.push({ name, price, img });
  saveCart();
  alert("Added to cart");
};
function renderCart() {
  const cartDiv = document.getElementById("cartItems");
  cartDiv.innerHTML = "";

  cart.forEach((item, index) => {
    cartDiv.innerHTML += `
      <div>
        <img src="${item.img}" width="50">
        ${item.name} - ${item.price}
        <button onclick="removeFromCart(${index})">X</button>
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
window.checkout = function () {
  let total = cart.reduce((sum, item) => {
    return sum + parseInt(item.price.replace("₹", ""));
  }, 0);

  const options = {
    key: "RAZORPAY_KEY_ID",
    amount: total * 100,
    currency: "INR",
    name: "MSquare Sports",
    description: "Order Payment",
    handler: function () {
      alert("Payment Successful");
      cart = [];
      saveCart();
      renderCart();
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
};
self.addEventListener("fetch", () => {});
function installHelp() {
  detectDevice();
  document.getElementById("installPopup").style.display = "flex";
}
