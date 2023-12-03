const btnActualizar = document.getElementById("btnActualizar");
const btnEliminar = document.getElementById("btnEliminar");
const btnAgregar = document.getElementById("btnAgregar");

//AGREGAR PRODUCTO
function addProduct() {
  const form = document.getElementById("addProducts");
  const formData = new FormData(form);

  const url = `/api/products`;

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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error al agregar producto");
      }
    })
    .then((responseData) => {
      toast("Producto agregado exitosamente");
      console.log("Producto actualizado exitosamente", responseData);
      form.reset();
    })
    .catch((error) => {
      console.error(error);
      toast("Error al agregar");
    });
}

btnAgregar.addEventListener("click", function (e) {
  e.preventDefault();
  addProduct();
});

//ACTUALIZAR PRODUCTO
function updateProduct() {
  const form = document.getElementById("updateProducts");
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
      console.log("Producto actualizado exitosamente", responseData);
      toast("Producto actualizado exitosamente");
      form.reset();
    })
    .catch((error) => {
      console.error(error);
      toast("Error al actualizar");
    });
}

btnActualizar.addEventListener("click", function (e) {
  e.preventDefault();
  updateProduct();
});

//ELIMINAR PRODUCTO
function deleteProduct() {
  const form = document.getElementById("deleteProducts");
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
      toast("Producto eliminado exitosamente");
      form.reset();
    })
    .catch((error) => {
      console.error(error);
      toast("Error al eliminar");
    });
}

btnEliminar.addEventListener("click", function (e) {
  e.preventDefault();
  deleteProduct();
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
