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

  toggleMenu(); // close sidebar after selection
}
// LOAD SAVED PRODUCTS
window.addEventListener("load", loadSavedProducts);

function loadSavedProducts() {
  const saved = JSON.parse(localStorage.getItem("products")) || [];
  const grid = document.querySelector(".grid");

  saved.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "product";
    div.setAttribute("data-category", "custom");

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

    <button onclick="deleteProduct(${index})" style="background:red; margin-top:5px;">
      Delete
    </button>
  </div>
`;

    grid.appendChild(div);
  });
}

// ADD NEW PRODUCT
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
  location.reload();
}
// SECRET ADMIN ACCESS (type "admin" on keyboard)
let secret = "";

document.addEventListener("keydown", (e) => {
  secret += e.key.toLowerCase();

  if (secret.includes("vishal")) 
  {  document.getElementById("adminPanel").style.display = "block";
    alert("Admin Mode Activated");
    secret = "";
  }

  // limit length to avoid bugs
  if (secret.length > 20) {
    secret = "";
  }
});
console.log("JS LOADED");
function deleteProduct(index) {
  let products = JSON.parse(localStorage.getItem("products")) || [];

  products.splice(index, 1); // remove item

  localStorage.setItem("products", JSON.stringify(products));

  alert("Product Deleted");
  location.reload();
}
