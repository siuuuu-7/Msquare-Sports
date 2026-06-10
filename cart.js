// Prevent back button from exiting site
history.pushState(null, null, location.href);
window.addEventListener("popstate", function () {
  history.pushState(null, null, location.href);
});
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
  if (!bag.classList.contains("open")) {
  history.pushState({ bag: true }, "");
  bag.classList.add("open");
} else {
  bag.classList.remove("open");
}
  renderBag();
}

function renderBag() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const content = document.getElementById("bagContent");

  if (cart.length === 0) {
    content.innerHTML = `
      <p>Your bag is empty</p>
      <button onclick="goHome()">
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

  if (!bag || !icon) return;

  if (
    bag.classList.contains("open") &&
    !bag.contains(e.target) &&
    !icon.contains(e.target)
  ) {
    bag.classList.remove("open");
  }
});

/* ================= WISHLIST ================= */

function toggleWishlist() {
  const drawer = document.getElementById("wishlistDrawer");
  const heart = document.getElementById("wishlistHeart");

  if (!drawer.classList.contains("open")) {
  history.pushState({ wishlist: true }, "");
  drawer.classList.add("open");
} else {
  drawer.classList.remove("open");
}
  heart.classList.toggle("fa-solid");
  heart.classList.toggle("fa-regular");
}

/* Close wishlist when clicking outside */
document.addEventListener("click", function (e) {
  const drawer = document.getElementById("wishlistDrawer");
  const icon = document.querySelector(".wishlist-wrapper");

  if (!drawer || !icon) return;

  if (!drawer.contains(e.target) && !icon.contains(e.target)) {
    drawer.classList.remove("open");
  }
});
function goHome() {
  history.pushState({}, "", "index.html");
  window.location.reload();
}
window.addEventListener("popstate", function () {
  const bag = document.getElementById("bagDrawer");
  const wishlist = document.getElementById("wishlistDrawer");

  if (bag) bag.classList.remove("open");
  if (wishlist) wishlist.classList.remove("open");
});