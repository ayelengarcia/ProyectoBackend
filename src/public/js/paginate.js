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

document.getElementById("form-paginate").onsubmit = (e) => {
  e.preventDefault();
  const limit = document.getElementById("limit").value;
  const page = document.getElementById("page").value;

  const url = `/productos?page=${page}&limit=${limit}`;

  window.location.href = url;
};

async function addProductCart(productId) {
  try {
    const cartId = await obtenerCartId();

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
      toast(`Producto agregado al 🛒`);
      actualizarCounter();
    } else {
      throw toast(`Error al agregar el producto`);
    }
  } catch (error) {
    toast(`Logueate u obtén los permisos para eso`);
    console.error(error);
  }
}

const btnAddToCart = document.getElementById("btnAddToCart");
btnAddToCart.addEventListener("click", function () {
  addProductCart(productId);
});
