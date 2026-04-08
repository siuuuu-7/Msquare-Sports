// ======================== FIREBASE IMPORTS ========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

// ======================== FIREBASE CONFIG ========================
const firebaseConfig = {
  apiKey: "AIzaSyBR6kgN7j53B9Yo5B5ncTkIV9_xlVA3LCM",
  authDomain: "msquare-sports.firebaseapp.com",
  projectId: "msquare-sports",
  storageBucket: "msquare-sports.firebasestorage.app",
  messagingSenderId: "144814096708",
  appId: "1:144814096708:web:8daff5c52f0c00d7a81711",
  measurementId: "G-BFZNTJJEEH"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

let isAdmin = false;

// ======================== LOGIN ========================
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

// ======================== AUTH STATE ========================
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
  if(isAdmin) loadOrders();
});

// ======================== LOAD PRODUCTS ========================
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

        <button onclick="placeOrder('${id}', '${p.name}')">Order & Pay</button>

        ${adminBtns}
      </div>
    `;

    grid.appendChild(div);
  });
}

// ======================== ADD PRODUCT ========================
window.addNewProduct = async function () {
  if (!isAdmin) return alert("Not authorized");

  const name = document.getElementById("pname").value;
  const price = document.getElementById("pprice").value;
  const img = document.getElementById("pimg").value;
  const offer = document.getElementById("poffer").value;
  const stock = document.getElementById("pstock").value;

  await addDoc(collection(db, "products"), { name, price, img, offer, stock });
  alert("Product Added");
  loadProducts();
};

// ======================== DELETE PRODUCT ========================
window.deleteProduct = async function (id) {
  if (!isAdmin) return alert("Not authorized");

  await deleteDoc(doc(db, "products", id));
  alert("Deleted");
  loadProducts();
};

// ======================== EDIT PRODUCT ========================
window.editProduct = async function (id) {
  if (!isAdmin) return alert("Not authorized");

  const name = prompt("New name:");
  const price = prompt("New price:");
  const img = prompt("New image URL:");
  const offer = prompt("Offer:");
  const stock = prompt("Stock:");

  await updateDoc(doc(db, "products", id), { name, price, img, offer, stock });
  alert("Updated");
  loadProducts();
};

// ======================== LOGOUT ========================
window.logoutAdmin = async function () {
  await signOut(auth);
};

// ======================== PLACE ORDER + PAYMENT ========================
window.placeOrder = async function (productId, productName) {
  const customerName = prompt("Enter your name:");
  const customerPhone = prompt("Enter your phone number:");
  if (!customerName || !customerPhone) return alert("Name & phone required");

  // Create order in Firestore
  const orderRef = await addDoc(collection(db, "orders"), {
    productId,
    productName,
    customerName,
    customerPhone,
    status: "pending",
    timestamp: new Date()
  });

  // Example amount (replace with actual product price)
  const amount = 100 * 100; // ₹100 in paise

  var options = {
    key: "YOUR_RAZORPAY_KEY",
    amount: amount,
    currency: "INR",
    name: "M Square Sports",
    description: productName,
    handler: async function (response) {
      await updateDoc(orderRef, { status: "paid", paymentId: response.razorpay_payment_id });
      alert("Payment successful! Order confirmed.");
      if(isAdmin) loadOrders();
    },
    prefill: { name: customerName, contact: customerPhone },
    theme: { color: "#F37254" }
  };

  var rzp1 = new Razorpay(options);
  rzp1.open();
};

// ======================== LOAD ORDERS (ADMIN VIEW) ========================
async function loadOrders() {
  if (!isAdmin) return;

  const container = document.getElementById("ordersContainer");
  if(!container) return; // optional admin orders section

  container.innerHTML = "";
  const snapshot = await getDocs(collection(db, "orders"));
  snapshot.forEach(docItem => {
    const o = docItem.data();
    const id = docItem.id;

    const div = document.createElement("div");
    div.className = "order firebase-item";
    div.innerHTML = `
      <strong>${o.productName}</strong> - ${o.customerName} (${o.customerPhone})<br>
      Status: ${o.status} ${o.paymentId ? "(Paid)" : "(Pending)"}<br>
      <button onclick="deleteOrder('${id}')">Delete</button>
    `;
    container.appendChild(div);
  });
}

// ======================== DELETE ORDER (ADMIN) ========================
window.deleteOrder = async function(id) {
  if(!isAdmin) return;
  await deleteDoc(doc(db, "orders", id));
  loadOrders();
};
