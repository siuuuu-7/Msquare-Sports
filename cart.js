let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

window.addToCart = function (name, price, img) {
  cart.push({ name, price, img });
  saveCart();
  alert("Added to cart");
};

window.renderCart = function () {
  const cartDiv = document.getElementById("cartItems");
  if (!cartDiv) return;

  cartDiv.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    const p = parseInt(item.price.replace("₹", ""));
    total += p;

    cartDiv.innerHTML += `
      <div class="product">
        <img src="${item.img}">
        <h3>${item.name}</h3>
        <p>${item.price}</p>
        <button onclick="removeFromCart(${i})">Remove</button>
      </div>
    `;
  });

  document.getElementById("total").innerText = "₹" + total;
};

window.removeFromCart = function (i) {
  cart.splice(i, 1);
  saveCart();
  renderCart();
};