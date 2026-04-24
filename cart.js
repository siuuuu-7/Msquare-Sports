function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push({
    name: name,
    price: price,
    qty: 1
  });

  localStorage.setItem("cart", JSON.stringify(cart));

  alert(name + " added to cart 🛒");
}
function toggleBag() {
  const bag = document.getElementById("bagDrawer");
  bag.style.display = bag.style.display === "block" ? "none" : "block";
  renderBag();
}

function renderBag() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const content = document.getElementById("bagContent");

  if (cart.length === 0) {
    content.innerHTML = `
      <p>Your bag is empty</p>
      <button onclick="window.location.href='index.html'">
        Start shopping
      </button>
    `;
  } else {
    content.innerHTML = cart.map(item => `
      <p>${item.name} × ${item.qty || 1}</p>
    `).join("");
  }
}

/* Close bag when clicking outside */
document.addEventListener("click", function (e) {
  const bag = document.getElementById("bagDrawer");
  const icon = document.querySelector(".bag-wrapper");
  if (!bag.contains(e.target) && !icon.contains(e.target)) {
    bag.style.display = "none";
  }
});