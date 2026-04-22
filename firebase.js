console.log("🔥 firebase.js loaded");

// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { 
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBdcTPbkGt1tYJ5ZyUU1Sg8h1DhNaafTj8",
  authDomain: "msquare-sports.firebaseapp.com",
  projectId: "msquare-sports",
  storageBucket: "msquare-sports.appspot.com",
  messagingSenderId: "144814096708",
  appId: "1:144814096708:web:8daff5c52f0c00d7a81711"
};

// INIT (ONLY ONCE)
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

let isAdmin = false;

/* ---------------- LOGIN ---------------- */
window.loginAdmin = async function () {
  console.log("LOGIN CLICKED");

  const email = document.getElementById("adminUser").value.trim();
  const password = document.getElementById("adminPass").value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful");
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    alert(err.message);
  }
};

/* ---------------- AUTH STATE ---------------- */
onAuthStateChanged(auth, (user) => {
  isAdmin = !!user;

  const adminPanel = document.getElementById("adminPanel");
  const loginPanel = document.getElementById("loginPanel");

  if (adminPanel && loginPanel) {
    adminPanel.style.display = user ? "block" : "none";
    loginPanel.style.display = user ? "none" : "block";
  }

  loadProducts();
});

/* ---------------- LOAD PRODUCTS ---------------- */
async function loadProducts() {
  const grid = document.querySelector(".grid");
  if (!grid) return;

  grid.querySelectorAll(".firebase-item").forEach(el => el.remove());

  const snapshot = await getDocs(collection(db, "products"));

  snapshot.forEach((docItem) => {
    const p = docItem.data();
    const id = docItem.id;

    const adminBtns = isAdmin
      ? `<button onclick="deleteProduct('${id}')" style="background:red;margin-top:5px;">Delete</button>`
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

    grid.appendChild(div);
  });
}

/* ---------------- ADD PRODUCT ---------------- */
window.addNewProduct = async function () {
  if (!isAdmin) return alert("Not authorized");

  const name = document.getElementById("pname").value;
  const price = document.getElementById("pprice").value;
  const img = document.getElementById("pimg").value;
  const offer = document.getElementById("poffer").value;
  const stock = document.getElementById("pstock").value;

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

/* ---------------- DELETE PRODUCT ---------------- */
window.deleteProduct = async function (id) {
  if (!isAdmin) return;

  await deleteDoc(doc(db, "products", id));
  alert("Product Deleted");
  loadProducts();
};

/* ---------------- LOGOUT ---------------- */
window.logoutAdmin = async function () {
  await signOut(auth);
};