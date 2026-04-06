window.isAdmin = false;

function openInstagram() {
  window.open("https://www.instagram.com/msquare_05/", "_blank");
}

function openWhatsApp() {
  window.open("https://wa.me/9035202055", "_blank");
}

// SIDEBAR TOGGLE
function toggleMenu() {
  const sidebar = document.getElementById("sidebar");

  if (sidebar) {
    sidebar.classList.toggle("active");
  }
}

// PRODUCT FILTER
function filterProducts(category) {
  const products = document.querySelectorAll(".product");

  products.forEach(product => {
    const cat = product.dataset.category;

    if (category === "all" || cat === category) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });

  toggleMenu();
}

// SECRET ADMIN ACCESS
let secret = "";

document.addEventListener("keydown", (e) => {
  secret += e.key.toLowerCase();

  if (secret.includes("vishal")) {

    window.isAdmin = true;

    document.getElementById("adminPanel").style.display = "block";
    alert("Admin Mode Activated");

    // 🔥 IMPORTANT FIX
    document.querySelector(".grid").innerHTML = "";
    loadProducts();

    secret = "";
  }

  if (secret.length > 20) {
    secret = "";
  }
});

console.log("JS LOADED");
