let isAdmin = false;
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
  // 🔥 Remove ALL custom products before re-render
  document.querySelectorAll(".product[data-category='custom']").forEach(el => el.remove());

  saved.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "product";
    div.setAttribute("data-category", "custom");

    // ✅ DELETE BUTTON ONLY IF ADMIN
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

    ${window.isAdmin ? `
  <button class="delete-btn" onclick="deleteProduct('${docItem.id}')">
  Delete
</button>
` : ""}
  </div>
`;

    grid.appendChild(div);
  });
}
// SECRET ADMIN ACCESS (type "admin" on keyboard)
let secret = "";

document.addEventListener("keydown", (e) => {
  secret += e.key.toLowerCase();

  if (secret.includes("vishal")) {

    isAdmin = true; // 🔥 THIS WAS MISSING

    document.getElementById("adminPanel").style.display = "block";
    alert("Admin Mode Activated");
    secret = "";
  }

  if (secret.length > 20) {
    secret = "";
  }
});
console.log("JS LOADED");
}

