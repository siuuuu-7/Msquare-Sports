import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"; 
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyB9k-ns5ykMT9XroM9byq-rcIeCvEseRfY",
  authDomain: "msquare-sports.firebaseapp.com",
  projectId: "msquare-sports",
  storageBucket: "msquare-sports.firebasestorage.app",
  messagingSenderId: "144814096708",
  appId: "1:144814096708:web:8daff5c52f0c00d7a81711"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, signInWithEmailAndPassword, onAuthStateChanged, signOut };
