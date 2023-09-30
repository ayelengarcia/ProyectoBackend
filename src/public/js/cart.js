const obtenerCartId = async () => {
  try {
    const response = await fetch("/api/sessions/currentuser");
    if (!response.ok) {
      throw new Error("Error al obtener los datos del usuario logueado");
    }
    const responseData = await response.json();
    const cartId = responseData.payload.cart;
    console.log("Cart ID del usuario logueado:", cartId);
    return cartId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const obtenerCart = async () => {
  try {
    const cartId = await obtenerCartId();
    const response = await fetch(`/api/carts/${cartId}`);
    if (!response.ok) {
      throw new Error("Error al obtener carrito");
    }
    const responseData = await response.json();
    const cartData = responseData.payload.products;
    console.log("Cart del usuario", cartData);
    return cartData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const contenedorCart = document.getElementById("template-cart");
const contenedorTotal = document.getElementById("template-total");

//TEMPLATE CART
const templateCart = (cart) => {
  return `<tr>
      <td>${cart.pid.code}</td>
      <td>${cart.pid.thumbnail}</td>
      <td>${cart.pid.title}</td>
      <td>${cart.quantity}</td>
      <td>$ ${cart.pid.price}</td>
    </tr>`;
};

//SUMAR TOTAL
const totalCarrito = async () => {
  try {
    const cart = await obtenerCart();
    const total = cart.reduce((accumulator, currentItem) => {
      const subtotal = currentItem.pid.price * currentItem.quantity;
      return accumulator + subtotal;
    }, 0);

    return total;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

// RECORRER OBJETOS
const recorrerObjetos = (array, template, contenedor) => {
  contenedor.innerHTML = "";
  if (array.length > 0) {
    array.forEach((elemento) => {
      contenedor.innerHTML += template(elemento);
    });
  }
};

(async () => {
  try {
    const cart = await obtenerCart();
    const total = await totalCarrito();

    recorrerObjetos(cart, templateCart, contenedorCart);
    contenedorTotal.innerHTML = `$ ${total}`;
  } catch (error) {
    console.error(error);
  }
})();
