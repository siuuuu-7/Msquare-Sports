import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyB9k-ns5ykMT9XroM9byq-rcIeCvEseRfY",
  authDomain: "msquare-sports.firebaseapp.com",
  projectId: "msquare-sports",
  storageBucket: "msquare-sports.firebasestorage.app",
  messagingSenderId: "144814096708",
  appId: "1:144814096708:web:8daff5c52f0c00d7a81711"
};

// ✅ INIT
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let isAdmin = false;

// ✅ LOGIN
window.loginAdmin = async function () {
  const email = document.getElementById("adminUser").value.trim();
  const password = document.getElementById("adminPass").value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful");
  } catch (err) {
  console.log(err.code);
  alert(err.code);
}
};

// ✅ AUTH STATE
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

// ✅ LOAD PRODUCTS
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
        <button onclick="deleteProduct('${id}')" style="background:red;margin-top:5px;">Delete</button>
      `;
    }

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

// ✅ ADD PRODUCT
window.addNewProduct = async function () {
  if (!isAdmin) return alert("Not authorized");

  const name = document.getElementById("pname").value;
  const price = document.getElementById("pprice").value;
  const img = document.getElementById("pimg").value;
  const offer = document.getElementById("poffer").value;
  const stock = document.getElementById("pstock").value;

  await addDoc(collection(db, "products"), {
    name, price, img, offer, stock
  });

  alert("Added");
  loadProducts();
};

// ✅ DELETE
window.deleteProduct = async function (id) {
  if (!isAdmin) return;

  await deleteDoc(doc(db, "products", id));
  alert("Deleted");
  loadProducts();
};

// ✅ LOGOUT
window.logoutAdmin = async function () {
  await signOut(auth);
};
