let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

window.addToCart = function (name, price, img) {
  cart.push({ name, price, img });
  saveCart();
  alert("Added to cart");
};

function renderCart() {
  const cartDiv = document.getElementById("cartItems");
  if (!cartDiv) return;

  cartDiv.innerHTML = "";

  cart.forEach((item, i) => {
    cartDiv.innerHTML += `
      <div>
        <img src="${item.img}" width="50">
        ${item.name} - ${item.price}
        <button onclick="removeFromCart(${i})">X</button>
      </div>
    `;
  });
}

window.removeFromCart = function (i) {
  cart.splice(i, 1);
  saveCart();
  renderCart();
};

renderCart();