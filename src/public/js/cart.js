const contenedorCart = document.getElementById("template-cart");
const contenedorTotal = document.getElementById("template-total");

const actualizarCantidadProduct = (productId) => {
  const productRow = document.getElementById(`product_${productId}`);
  const productQuantityCell = productRow.querySelector("td:nth-child(4)");

  if (productQuantityCell) {
    let quantity = parseInt(productQuantityCell.textContent);
    if (quantity > 1) {
      quantity--;
      productQuantityCell.textContent = quantity;
    } else {
      productRow.remove();
    }
  }
};

async function deleteProductCart(productId) {
  try {
    const cartId = await obtenerCartId();

    const response = await fetch(`/api/carts/${cartId}/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      actualizarCantidadProduct(productId);
      actualizarCounter();
      const total = await totalCarrito();
      contenedorTotal.innerHTML = `$ ${total}`;
      toast(`Producto eliminado`);
    } else {
      toast(`Error al eliminar producto`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//TEMPLATE CART
const templateCart = (cart) => {
  const stockText = cart.pid.stock <= 0 ? "Sin stock" : "En stock";
  const priceDisplay =
    cart.pid.stock <= 0 ? `<s>${cart.pid.price}</s>` : `${cart.pid.price}`;

  return `<tr id="product_${cart.pid._id}">
      <td><img class="class_img_cart" src="${cart.pid.thumbnail}" /></td>
      <td>${cart.pid.title}</td>
      <td>${stockText}</td>
      <td>${cart.quantity}</td>
      <td>$ ${priceDisplay}</td>
      <td><button id="btnDeleteToCart" class="btn" onclick="deleteProductCart('${cart.pid._id}')">Eliminar</button></td>
    </tr>`;
};

//SUMAR TOTAL
const totalCarrito = async () => {
  try {
    const cart = await obtenerCart();
    const total = cart.reduce((accumulator, currentItem) => {
      if (currentItem.pid.stock > 0) {
        const subtotal = currentItem.pid.price * currentItem.quantity;
        return accumulator + subtotal;
      } else {
        return accumulator;
      }
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

//RENDERIZAR CARRITO
const renderCarrito = () => {
  (async () => {
    try {
      const total = await totalCarrito();
      contenedorTotal.innerHTML = `$ ${total}`;

      const cart = await obtenerCart();
      recorrerObjetos(cart, templateCart, contenedorCart);
    } catch (error) {
      console.error(error);
    }
  })();
};

renderCarrito();

//FINALIZAR COMPRA Y MOSTRAR TICKET
const btnPurchease = document.getElementById("btn-purchease");

//EVENTO COMPRAR
btnPurchease.addEventListener("click", async (req, res) => {
  try {
    const cid = await obtenerCartId();
    const res = await fetch(`/api/payments/createCheckoutSession/${cid}`, {
      method: "POST",
    });

    const data = await res.json();
    console.log(data);

    window.location.href = data.url;
  } catch (error) {
    console.error(error);
  }
});

const toast = (text) => {
  Toastify({
    text: text,
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "center",
    stopOnFocus: true,
    style: {
      background: "#ff3f72dd",
    },
  }).showToast();
};
