let isAdmin = false;

// SOCIAL LINKS
function openInstagram() {
  window.open("https://www.instagram.com/msquare_05/", "_blank");
}

function openWhatsApp() {
  window.open("https://wa.me/9035202055", "_blank");
}

// SIDEBAR TOGGLE
function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.toggle("active");
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

// LOAD PRODUCTS
window.addEventListener("load", loadSavedProducts);

function loadSavedProducts() {
  const saved = JSON.parse(localStorage.getItem("products")) || [];
  const grid = document.querySelector(".grid");

  // REMOVE OLD CUSTOM PRODUCTS
  document.querySelectorAll(".product[data-category='custom']").forEach(el => el.remove());

  saved.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "product";
    div.setAttribute("data-category", "custom");

    // DELETE BUTTON ONLY FOR ADMIN
    let deleteBtn = "";
    if (isAdmin) {
      deleteBtn = `<button onclick="deleteProduct(${index})" style="background:red; margin-top:5px;">Delete</button>`;
    }

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

        ${deleteBtn}
      </div>
    `;

    grid.appendChild(div);
  });
}

// ADD PRODUCT
function addNewProduct() {
  const name = document.getElementById("pname").value;
  const price = document.getElementById("pprice").value;
  const img = document.getElementById("pimg").value;
  const offer = document.getElementById("poffer").value;
  const stock = document.getElementById("pstock").value;

  const newProduct = { name, price, img, offer, stock };

  let products = JSON.parse(localStorage.getItem("products")) || [];
  products.push(newProduct);
  localStorage.setItem("products", JSON.stringify(products));

  alert("Product Added!");
  loadSavedProducts(); // ✅ no reload
}

// DELETE PRODUCT
function deleteProduct(index) {
  let products = JSON.parse(localStorage.getItem("products")) || [];

  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));

  alert("Product Deleted!");
  loadSavedProducts(); // ✅ no reload
}

// SECRET ADMIN ACCESS
let secret = "";

document.addEventListener("keydown", (e) => {
  secret += e.key.toLowerCase();

  if (secret.includes("vishal")) { // 🔁 change to your name if needed
    isAdmin = true;

    document.getElementById("adminPanel").style.display = "block";
    alert("Admin Mode Activated");

    loadSavedProducts(); // 🔥 re-render with delete buttons

    secret = "";
  }

  if (secret.length > 20) {
    secret = "";
  }
});

console.log("JS LOADED");
