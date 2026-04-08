import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBR6kgN7j53B9Yo5B5ncTkIV9_xlVA3LCM",
  authDomain: "msquare-sports.firebaseapp.com",
  projectId: "msquare-sports",
  storageBucket: "msquare-sports.firebasestorage.app",
  messagingSenderId: "144814096708",
  appId: "1:144814096708:web:8daff5c52f0c00d7a81711"
};

// 🔥 INIT
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

let isAdmin = false;

// 🔐 LOGIN
window.loginAdmin = async function () {
  const email = document.getElementById("adminUser").value;
  const password = document.getElementById("adminPass").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful");
  } catch (err) {
    console.log(err.code, err.message);
    alert(err.code);
  }
};

// 🔐 AUTH STATE
onAuthStateChanged(auth, (user) => {
  if (user && user.email === "admin@msquare.com") { // replace with your admin email
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

// 📦 LOAD PRODUCTS
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
      <img src="${p.img}">
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="price">${p.price}</p>
        <p class="stock">${p.stock <= 5 ? "Only " + p.stock + " left" : ""}</p>

        <a href="https://wa.me/9035202055?text=I want ${p.name}" target="_blank">
          <button class="buy-btn">Order</button>
        </a>

        ${adminBtns}
      </div>
    `;

    grid.appendChild(div);
  });
}

// ➕ ADD PRODUCT
window.addNewProduct = async function () {
  if (!isAdmin) return alert("Not authorized");

  const name = document.getElementById("pname").value;
  const price = document.getElementById("pprice").value;
  const offer = document.getElementById("poffer").value;
  const stock = document.getElementById("pstock").value;
  const file = document.getElementById("pimg").files[0];

  if (!name || !price || !file) return alert("Fill all fields and select an image");

  // Upload image
  const storageRef = ref(storage, 'products/' + file.name);
  await uploadBytes(storageRef, file);
  const imgURL = await getDownloadURL(storageRef);

  // Save product
  await addDoc(collection(db, "products"), {
    name,
    price,
    offer,
    stock,
    img: imgURL
  });

  alert("Product added");
  loadProducts();

  // Reset form
  document.getElementById("pname").value = "";
  document.getElementById("pprice").value = "";
  document.getElementById("poffer").value = "";
  document.getElementById("pstock").value = "";
  document.getElementById("pimg").value = "";
};

// ❌ DELETE PRODUCT
window.deleteProduct = async function (id) {
  if (!isAdmin) return;

  if (!confirm("Delete this product?")) return;

  await deleteDoc(doc(db, "products", id));
  alert("Deleted");
  loadProducts();
};

// ✏️ EDIT PRODUCT
window.editProduct = async function (id) {
  if (!isAdmin) return;

  const name = prompt("New name:");
  const price = prompt("New price:");
  const offer = prompt("New offer:");
  const stock = prompt("New stock:");

  if (!name || !price) return alert("Name and price required");

  await updateDoc(doc(db, "products", id), { name, price, offer, stock });
  alert("Updated");
  loadProducts();
};

// 🚪 LOGOUT
window.logoutAdmin = async function () {
  await signOut(auth);
};
