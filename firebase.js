console.log("🔥 firebase.js loaded");
// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
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
  apiKey: "AIzaSyD_H2N7M02PWZVlKAInpH9YwS8t5eOhMaI",
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

window.isAdmin = false;
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
  window.isAdmin = !!user;

  const adminPanel = document.getElementById("adminPanel");
  const loginPanel = document.getElementById("loginPanel");

  if (adminPanel && loginPanel) {
    adminPanel.style.display = user ? "block" : "none";
    loginPanel.style.display = user ? "none" : "block";
  }

  if (typeof window.loadProducts === "function") {
    window.loadProducts();
  }
});

/* ---------------- ADD PRODUCT ---------------- */
window.addNewProduct = async function () {
  if (!isAdmin) return alert("Access denied");

  const name = document.getElementById("pname").value;
  const price = document.getElementById("pprice").value;
  const img = document.getElementById("pimg").value;
  const offer = document.getElementById("poffer").value;
  const stock = document.getElementById("pstock").value;

  const docRef = await addDoc(collection(db, "products"), {
    name,
    price,
    img,
    offer,
    stock
  });

  // 🔍 Audit log
  await logAudit("ADD_PRODUCT", docRef.id, name);

  alert("Product Added");
  loadProducts();
};

/* ---------------- DELETE PRODUCT ---------------- */
window.deleteProduct = async function (id) {
  if (!isAdmin) return alert("Access denied");

  // Get product name before delete
  const productEl = document.querySelector(
    `button[onclick="deleteProduct('${id}')"]`
  )?.closest(".product");

  const productName =
    productEl?.querySelector("h3")?.innerText || "Unknown Product";

  await deleteDoc(doc(db, "products", id));

  // 🔍 Audit log
  await logAudit("DELETE_PRODUCT", id, productName);

  alert("Product Deleted");
  loadProducts();
};
