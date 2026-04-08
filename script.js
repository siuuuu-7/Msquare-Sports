import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🔥 FIREBASE CONFIG
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBR6kgN7j53B9Yo5B5ncTkIV9_xlVA3LCM",
  authDomain: "msquare-sports.firebaseapp.com",
  projectId: "msquare-sports",
  storageBucket: "msquare-sports.firebasestorage.app",
  messagingSenderId: "144814096708",
  appId: "1:144814096708:web:8daff5c52f0c00d7a81711",
  measurementId: "G-BFZNTJJEEH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

let isAdmin = false;

// 🔐 LOGIN
window.loginAdmin = async function () {
  const email = document.getElementById("adminUser").value;
  const password = document.getElementById("adminPass").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful");
  } catch (err) {
  console.log(err.code);
  console.log(err.message);
  alert(err.code);
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

// 🔥 LOAD PRODUCTS FROM FIREBASE
async function loadProducts() {
  const grid = document.querySelector(".grid");
  grid.querySelectorAll(".firebase-item").forEach(el => el.remove());

  const snapshot = await getDocs(collection(db, "products"));

  snapshot.forEach((docItem) => {
    const p = docItem.data();
    const id = docItem.id;

    let adminBtns = "";
    if (isAdmin) {
      adminBtns = `
        <button onclick="editProduct('${id}')" style="background:orange;margin-top:5px;">Edit</button>
        <button onclick="deleteProduct('${id}')" style="background:red;margin-top:5px;">Delete</button>
      `;
    }

    const div = document.createElement("div");
    div.className = "product firebase-item";

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

        ${adminBtns}
      </div>
    `;

    grid.appendChild(div);
  });
}

// ➕ ADD PRODUCT
window.addNewProduct = async function () {
  if (!isAdmin) {
    alert("Not authorized");
    return;
  }

  const name = document.getElementById("pname").value;
  const price = document.getElementById("pprice").value;
  const img = document.getElementById("pimg").value;
  const offer = document.getElementById("poffer").value;
  const stock = document.getElementById("pstock").value;

  await addDoc(collection(db, "products"), {
    name, price, img, offer, stock
  });

  alert("Product Added");
  loadProducts();
};

// ❌ DELETE PRODUCT
window.deleteProduct = async function (id) {
  if (!isAdmin) {
    alert("Not authorized");
    return;
  }

  await deleteDoc(doc(db, "products", id));
  alert("Deleted");
  loadProducts();
};

// ✏️ EDIT PRODUCT
window.editProduct = async function (id) {
  if (!isAdmin) {
    alert("Not authorized");
    return;
  }

  const name = prompt("New name:");
  const price = prompt("New price:");
  const img = prompt("New image URL:");
  const offer = prompt("Offer:");
  const stock = prompt("Stock:");

  await updateDoc(doc(db, "products", id), {
    name, price, img, offer, stock
  });

  alert("Updated");
  loadProducts();
};

// 🚪 LOGOUT
window.logoutAdmin = async function () {
  await signOut(auth);
};
