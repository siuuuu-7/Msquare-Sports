import { deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔐 ADMIN FLAG
let isAdmin = false;

// 🔥 SECRET ACCESS
let secret = "";
document.addEventListener("keydown", (e) => {
  secret += e.key.toLowerCase();

  if (secret.includes("vishal")) {
    isAdmin = true;
    document.getElementById("adminPanel").style.display = "block";
    alert("Admin Mode Activated");

    refreshProducts(); // reload with delete buttons
    secret = "";
  }

  if (secret.length > 20) secret = "";
});

// ✅ FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBR6kgN7j53B9Yo5B5ncTkIV9_xlVA3LCM",
  authDomain: "msquare-sports.firebaseapp.com",
  projectId: "msquare-sports",
  storageBucket: "msquare-sports.firebasestorage.app",
  messagingSenderId: "144814096708",
  appId: "1:144814096708:web:8daff5c52f0c00d7a81711",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔥 LOAD PRODUCTS
async function loadProducts() {
  const snapshot = await getDocs(collection(db, "products"));
  const grid = document.querySelector(".grid");

  // CLEAR old dynamic products
  grid.querySelectorAll(".product[data-firebase]").forEach(el => el.remove());

  snapshot.forEach((docItem) => {
    const p = docItem.data();
    const id = docItem.id; // 🔥 IMPORTANT

    const div = document.createElement("div");
    div.className = "product";
    div.setAttribute("data-firebase", "true");

    let deleteBtn = "";
    if (isAdmin) {
      deleteBtn = `<button onclick="deleteProduct('${id}')" style="background:red; margin-top:5px;">Delete</button>`;
    }

    div.innerHTML = `
      ${p.offer ? `<div class="offer-badge">${p.offer}</div>` : ""}
      <img src="${p.img}">
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="price">${p.price}</p>
        <p class="stock">${p.stock <= 5 ? "Only " + p.stock + " left" : ""}</p>

        <a href="https://wa.me/9035202055?text=I want ${p.name}" target="_blank">
          <button class="buy-btn">Order on WhatsApp</button>
        </a>

        ${deleteBtn}
      </div>
    `;

    grid.appendChild(div);
  });
}

// 🔥 ADD PRODUCT
window.addNewProduct = async function () {
  const name = document.getElementById("pname").value;
  const price = document.getElementById("pprice").value;
  const img = document.getElementById("pimg").value;
  const offer = document.getElementById("poffer").value;
  const stock = document.getElementById("pstock").value;

  await addDoc(collection(db, "products"), {
    name, price, img, offer, stock
  });

  alert("Product Added Online!");
  refreshProducts(); // ✅ no reload
};

// 🔥 DELETE PRODUCT
window.deleteProduct = async function (id) {
  await deleteDoc(doc(db, "products", id));
  alert("Product Deleted!");
  refreshProducts(); // ✅ no reload
};

// 🔄 REFRESH PRODUCTS
function refreshProducts() {
  const grid = document.querySelector(".grid");
  grid.querySelectorAll(".product[data-firebase]").forEach(el => el.remove());
  loadProducts();
}

// LOAD ON PAGE
window.addEventListener("load", loadProducts);
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
const auth = getAuth(app);
