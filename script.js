import { db, auth, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, signInWithEmailAndPassword, onAuthStateChanged, signOut } from './firebase.js';

let isAdmin = false;

// LOGIN
window.loginAdmin = async function () {
  const email = document.getElementById("adminUser").value;
  const password = document.getElementById("adminPass").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful");
  } catch (err) {
    console.log(err);
    alert("Wrong Credentials");
  }
};

// AUTH STATE
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

// LOAD PRODUCTS
async function loadProducts() {
  const grid = document.querySelector(".grid");
  grid.innerHTML = '';

  const snapshot = await getDocs(collection(db, "products"));
  snapshot.forEach((docItem) => {
    const p = docItem.data();
    const id = docItem.id;

    let adminBtns = '';
    if (isAdmin) {
      adminBtns = `
        <button onclick="editProduct('${id}')" style="background:orange;margin-top:5px;">Edit</button>
        <button onclick="deleteProduct('${id}')" style="background:red;margin-top:5px;">Delete</button>
      `;
    }

    const div = document.createElement("div");
    div.className = "product firebase-item";
    div.innerHTML = `
      ${p.offer ? `<div class="offer-badge">${p.offer}</div>` : ''}
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

// ADD PRODUCT
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

// DELETE PRODUCT
window.deleteProduct = async function (id) {
  if (!isAdmin) return alert("Not authorized");
  await deleteDoc(doc(db, "products", id));
  alert("Deleted");
  loadProducts();
};

// EDIT PRODUCT
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

// LOGOUT
window.logoutAdmin = async function () {
  await signOut(auth);
};
