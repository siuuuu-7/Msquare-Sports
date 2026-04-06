import { deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ✅ YOUR REAL CONFIG (ONLY ONCE)
const firebaseConfig = {
  apiKey: "AIzaSyBR6kgN7j53B9Yo5B5ncTkIV9_xlVA3LCM",
  authDomain: "msquare-sports.firebaseapp.com",
  projectId: "msquare-sports",
  storageBucket: "msquare-sports.firebasestorage.app",
  messagingSenderId: "144814096708",
  appId: "1:144814096708:web:8daff5c52f0c00d7a81711",
};

// ✅ INIT (ONLY ONCE)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// 🔥 LOAD PRODUCTS
window.loadProducts = async function () {
  const snapshot = await getDocs(collection(db, "products"));
  const grid = document.querySelector(".grid");

  snapshot.forEach((docItem) => {
    const p = docItem.data();

    const div = document.createElement("div");
    div.className = "product";

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
      </div>
    `;

    grid.appendChild(div);
  });
};


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
  location.reload();
};
window.deleteProduct = async function (id) {
  await deleteDoc(doc(db, "products", id));
  alert("Product Deleted");
  location.reload();
};

// LOAD ON PAGE
window.addEventListener("load", loadProducts);
// 🔥 Reload Firebase products when admin mode is activated
function refreshProducts() {
  const grid = document.querySelector(".grid");
  grid.innerHTML = ""; // clear old products
  loadProducts(); 
  refreshProducts();// from firebase.js
}
