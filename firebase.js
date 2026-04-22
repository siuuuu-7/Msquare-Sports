import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBR6kgN7j53B9Yo5B5ncTkIV9_xlVA3LCM",
  authDomain: "msquare-sports.firebaseapp.com",
  projectId: "msquare-sports",
  storageBucket: "msquare-sports.firebasestorage.app",
  messagingSenderId: "144814096708",
  appId: "1:144814096708:web:8daff5c52f0c00d7a81711"
};

// ✅ INIT
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

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
});
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
};

// ✅ DELETE
window.deleteProduct = async function (id) {
  if (!isAdmin) return;

  await deleteDoc(doc(db, "products", id));
  alert("Deleted");
};

// ✅ LOGOUT
window.logoutAdmin = async function () {
  await signOut(auth);
};