const btnActualizar = document.getElementById("btnActualizar");
const btnEliminar = document.getElementById("btnEliminar");

//ACTUALIZAR PRODUCTO
function updateProduct() {
  const form = document.getElementById("updateProducts");
  const responseContainer = document.getElementById("response-container");
  const formData = new FormData(form);

  const productId = formData.get("inputID");
  const url = `/api/products/${productId}`;

  const data = {
    code: formData.get("code"),
    title: formData.get("title"),
    description: formData.get("description"),
    stock: formData.get("stock"),
    price: formData.get("price"),
    thumbnail: formData.get("thumbnail"),
    category: formData.get("category"),
  };

  fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error al actualizar el producto");
      }
    })
    .then((responseData) => {
      form.reset();
      console.log("Producto actualizado exitosamente", responseData);
      responseContainer.innerHTML = "Producto Actualizado";
    })
    .catch((error) => {
      console.error(error);
    });
}

btnActualizar.addEventListener("click", function () {
  updateProduct();
});

//ELIMINAR PRODUCTO
function deleteProduct() {
  const form = document.getElementById("deleteProducts");
  const responseContainer = document.getElementById("container-delete");
  const formData = new FormData(form);

  const productId = formData.get("idDelete");
  const url = `/api/products/${productId}`;

  fetch(url, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error al eliminar el producto");
      }
    })
    .then((responseData) => {
      console.log("Producto eliminado exitosamente", responseData);
      responseContainer.innerHTML = "Producto Eliminado";
    })
    .catch((error) => {
      console.error(error);
    });
}

btnEliminar.addEventListener("click", function () {
  deleteProduct();
});
