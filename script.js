import { db, auth } from './firebase.js';
import { collection, getDocs, addDoc, deleteDoc, doc } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ===== Admin State =====
let isAdmin = false;

function setAdminState(user) {
  isAdmin = !!user;
  document.getElementById("adminPanel").style.display = isAdmin ? "block" : "none";
  document.getElementById("loginPanel").style.display = isAdmin ? "none" : "block";
}

// ===== LOGIN =====
window.loginAdmin = async function () {
  const email = document.getElementById("adminUser").value.trim();
  const password = document.getElementById("adminPass").value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful");
  } catch (err) {
    console.error(err);
    alert("Login Failed: " + err.code);
  }
};

// ===== AUTH STATE =====
onAuthStateChanged(auth, (user) => {
  setAdminState(user);
  loadProducts();
});

// ===== PRODUCT RENDERING =====
function createProductDiv(p, id) {
  const adminBtns = isAdmin
    ? `<button class="delete-btn" data-id="${id}" style="background:red;margin-top:5px;">Delete</button>`
    : "";

  const div = document.createElement("div");
  div.className = "product firebase-item";
  div.innerHTML = `
    <img src="${p.img}">
    <div class="product-info">
      <h3>${p.name}</h3>
      <p class="price">${p.price}</p>
      <a href="https://wa.me/9035202055?text=I want ${p.name}" target="_blank">
        <button class="buy-btn">Order</button>
      </a>
      ${adminBtns}
    </div>
  `;
  
  // Attach delete listener if admin
  if (isAdmin) {
    div.querySelector(".delete-btn").addEventListener("click", () => deleteProduct(id));
  }

  return div;
}

// ===== LOAD PRODUCTS =====
async function loadProducts() {
  const grid = document.querySelector(".grid");
  grid.querySelectorAll(".firebase-item").forEach(el => el.remove());

  try {
    const snapshot = await getDocs(collection(db, "products"));
    snapshot.forEach(docItem => grid.appendChild(createProductDiv(docItem.data(), docItem.id)));
  } catch (err) {
    console.error("Failed to load products:", err);
  }
}

// ===== ADD PRODUCT =====
window.addNewProduct = async function () {
  if (!isAdmin) return alert("Not authorized");

  const name = document.getElementById("pname").value;
  const price = document.getElementById("pprice").value;
  const img = document.getElementById("pimg").value;
  const offer = document.getElementById("poffer").value;
  const stock = document.getElementById("pstock").value;

  try {
    await addDoc(collection(db, "products"), { name, price, img, offer, stock });
    alert("Product added successfully");
    loadProducts();
  } catch (err) {
    console.error(err);
    alert("Failed to add product");
  }
};

// ===== DELETE PRODUCT =====
async function deleteProduct(id) {
  if (!isAdmin) return;

  try {
    await deleteDoc(doc(db, "products", id));
    alert("Product deleted");
    loadProducts();
  } catch (err) {
    console.error(err);
    alert("Failed to delete product");
  }
}

// ===== LOGOUT =====
window.logoutAdmin = async function () {
  try {
    await signOut(auth);
  } catch (err) {
    console.error(err);
    alert("Logout failed");
  }
};
