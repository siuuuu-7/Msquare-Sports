// script.js
console.log("🔥 script.js loaded");
import { db, auth } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🔥 LOAD PRODUCTS
async function loadProducts() {
  const grid = document.querySelector(".grid");
  if (!grid) return;

  grid.innerHTML = "";

  const snapshot = await getDocs(collection(db, "products"));

  snapshot.forEach((item) => {
    const p = item.data();
    const id = item.id;

    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      ${p.offer ? `<div class="offer-badge">${p.offer}</div>` : ""}
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price">${p.price}</p>
      ${
        p.stock === 0
          ? "<p class='stock out'>Out of Stock</p>"
          : p.stock <= 5
          ? `<p class="stock">Only ${p.stock} left</p>`
          : ""
      }
      ${
        isAdmin
          ? `
        <button onclick="editProduct('${id}')" style="background:orange">Edit</button>
        <button onclick="deleteProduct('${id}')" class="delete-btn">Delete</button>
        `
          : ""
      }
    `;

    grid.appendChild(div);
  });
}

// ➕ ADD PRODUCT
window.addNewProduct = async function () {
  if (!isAdmin) return alert("Not authorized");

  await addDoc(collection(db, "products"), {
    name: pname.value,
    price: pprice.value,
    img: pimg.value,
    offer: poffer.value,
    stock: Number(pstock.value)
  });

  alert("Product Added");
  loadProducts();
};
// ❌ DELETE
window.deleteProduct = async function (id) {
  if (!isAdmin) return;
  await deleteDoc(doc(db, "products", id));
  loadProducts();
};

// ✏️ EDIT
window.editProduct = async function (id) {
  if (!isAdmin) return;

  await updateDoc(doc(db, "products", id), {
    name: prompt("Name"),
    price: prompt("Price"),
    img: prompt("Image URL"),
    offer: prompt("Offer"),
    stock: Number(prompt("Stock"))
  });

  loadProducts();
};

// 🚪 LOGOUT
window.logoutAdmin = async function () {
  await signOut(auth);
};
// ===== PREMIUM NAV MODALS =====
function openClub() {
  document.getElementById("clubModal").style.display = "flex";
}

function openLogin() {
  document.getElementById("clubModal").style.display = "none";
  document.getElementById("loginModal").style.display = "flex";
}

window.addEventListener("click", function (e) {
  if (e.target.classList.contains("modal")) {
    e.target.style.display = "none";
  }
});
import { signInWithPhoneNumber, RecaptchaVerifier } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

let confirmationResult;

// 🔥 reCAPTCHA setup
window.recaptchaVerifier = new RecaptchaVerifier(
  "recaptcha-container",
  { size: "invisible" },
  auth
);

// 📲 SEND OTP
window.sendOTP = function () {
  const phone = document.querySelector(".phone-row input").value;

  if (!phone) {
    alert("Enter number");
    return;
  }

  signInWithPhoneNumber(auth, "+91" + phone, window.recaptchaVerifier)
    .then((result) => {
  confirmationResult = result;

  alert("OTP sent ✅");

  // SHOW OTP BOX
  document.getElementById("otpSection").style.display = "block";
})
    .catch((error) => {
      console.log(error);
      alert(error.message);
    });
};
window.verifyOTP = function () {
  const code = document.getElementById("otpInput").value;

  if (!code) {
    alert("Enter OTP");
    return;
  }

  confirmationResult.confirm(code)
    .then((result) => {
      alert("Login Success 🎉");

      // CLOSE MODAL
      document.getElementById("loginModal").style.display = "none";

      // RESET OTP UI
      document.getElementById("otpSection").style.display = "none";

    })
    .catch((error) => {
      console.log(error);
      alert("Wrong OTP ❌");
    });
};
// script.js

function sendOTP() {
  const phone = document.querySelector(".phone-row input").value;

  if (!phone || phone.length < 10) {
    alert("Enter valid number");
    return;
  }

  const fullPhone = "+91" + phone;

  auth.signInWithPhoneNumber(fullPhone, window.recaptchaVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      alert("OTP sent 📲");
      document.getElementById("otpSection").style.display = "block";
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
}

function verifyOTP() {
  const code = document.getElementById("otpInput").value;

  if (!window.confirmationResult) {
    alert("OTP not sent yet");
    return;
  }

  window.confirmationResult.confirm(code)
    .then(() => {
      alert("Login successful ✅");
      document.getElementById("loginModal").style.display = "none";
    })
    .catch(() => {
      alert("Wrong OTP ❌");
    });
}