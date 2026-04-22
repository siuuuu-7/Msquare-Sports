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
  const email = adminUser.value.trim();
  const password = adminPass.value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful");
  } catch {
    alert("Invalid credentials");
  }
};

// 🔐 AUTH STATE
onAuthStateChanged(auth, (user) => {
  isAdmin = !!user;

  adminPanel.style.display = isAdmin ? "block" : "none";
  loginPanel.style.display = isAdmin ? "none" : "block";

  loadProducts();
});

// 🔥 LOAD PRODUCTS
async function loadProducts() {
  const grid = document.querySelector(".grid");
  if (!grid) return;

  grid.innerHTML = "";

  const snapshot = await getDocs(collection(db, "products"));

  snapshot.forEach((item) => {
    const p = item.data();
    const id = item.id;

    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      ${p.offer ? `<div class="offer-badge">${p.offer}</div>` : ""}
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price">${p.price}</p>
      ${
        p.stock === 0
          ? "<p class='stock out'>Out of Stock</p>"
          : p.stock <= 5
          ? `<p class="stock">Only ${p.stock} left</p>`
          : ""
      }

      <button onclick="addToCart('${p.name}','${p.price}','${p.img}')">
        Add to Cart
      </button>

      ${
        isAdmin
          ? `
        <button onclick="editProduct('${id}')" style="background:orange">Edit</button>
        <button onclick="deleteProduct('${id}')" class="delete-btn">Delete</button>
        `
          : ""
      }
    `;

    grid.appendChild(div);
  });
}

// ➕ ADD PRODUCT
window.addNewProduct = async function () {
  if (!isAdmin) return alert("Not authorized");

  await addDoc(collection(db, "products"), {
    name: pname.value,
    price: pprice.value,
    img: pimg.value,
    offer: poffer.value,
    stock: Number(pstock.value)
  });

  alert("Product Added");
  loadProducts();
};

// ❌ DELETE
window.deleteProduct = async function (id) {
  if (!isAdmin) return;
  await deleteDoc(doc(db, "products", id));
  loadProducts();
};

// ✏️ EDIT
window.editProduct = async function (id) {
  if (!isAdmin) return;

  await updateDoc(doc(db, "products", id), {
    name: prompt("Name"),
    price: prompt("Price"),
    img: prompt("Image URL"),
    offer: prompt("Offer"),
    stock: Number(prompt("Stock"))
  });

  loadProducts();
};

// 🚪 LOGOUT
window.logoutAdmin = async function () {
  await signOut(auth);
};