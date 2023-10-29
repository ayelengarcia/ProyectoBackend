document.getElementById("form-paginate").onsubmit = (e) => {
  e.preventDefault();
  const limit = document.getElementById("limit").value;
  const page = document.getElementById("page").value;

  const url = `/productos?page=${page}&limit=${limit}`;

  window.location.href = url;
};

function obtenerCartId() {
  return fetch("/api/sessions/currentuser")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error al obtener los datos del usuario logueado");
      }
    })
    .then((responseData) => {
      const cartId = responseData.payload.cart;
      console.log("Cart ID del usuario logueado:", cartId);
      return cartId;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

async function addProductCart(productId) {
  try {
    const cartId = await obtenerCartId();
    const msgAddProduct = document.getElementById("msgAddProduct");

    const response = await fetch(`/api/carts/${cartId}/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: 1 }),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Producto agregado exitosamente", responseData);
      msgAddProduct.innerHTML = "Producto agregado al carrito";
    } else {
      throw new Error("Error al agregar el producto al carrito");
    }
  } catch (error) {
    console.error(error);
  }
}

const btnAddToCart = document.getElementById("btnAddToCart");
btnAddToCart.addEventListener("click", function () {
  addProductCart(productId);
});
