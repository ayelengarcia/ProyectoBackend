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

const obtenerCart = async () => {
  try {
    const cartId = await obtenerCartId();
    const response = await fetch(`/api/carts/${cartId}`);
    if (!response.ok) throw new Error("Error al obtener carrito");

    const responseData = await response.json();
    const cartData = responseData.payload.products;
    return cartData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const actualizarCounter = async () => {
  try {
    const counterCart = document.getElementById("counterCart");
    const cart = await obtenerCart();

    let cantidad = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (cantidad === 0) {
      counterCart.innerHTML = "0";
      const contenedorCart = document.getElementById("template-cart");

      if (contenedorCart) {
        contenedorCart.innerHTML = `<div class="carrito_vacio">Tu carrito está vacío</div>`;
      }
    } else {
      counterCart.innerHTML = cantidad.toString();
    }
  } catch (error) {
    console.error(error);
  }
};

actualizarCounter();
