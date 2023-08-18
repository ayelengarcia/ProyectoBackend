const socket = io();
const tableList = document.getElementById("table-list");

// Función para actualizar la tabla de productos
function updateTable(products) {
  tableList.innerHTML = "";
  products.forEach((product) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = product.id;
    row.appendChild(idCell);

    const titleCell = document.createElement("td");
    titleCell.textContent = product.title;
    row.appendChild(titleCell);

    const descriptionCell = document.createElement("td");
    descriptionCell.textContent = product.description;
    row.appendChild(descriptionCell);

    const priceCell = document.createElement("td");
    priceCell.textContent = product.price;
    row.appendChild(priceCell);

    const thumbnailCell = document.createElement("td");
    thumbnailCell.textContent = product.thumbnail;
    row.appendChild(thumbnailCell);

    const stockCell = document.createElement("td");
    stockCell.textContent = product.stock;
    row.appendChild(stockCell);

    const codeCell = document.createElement("td");
    codeCell.textContent = product.code;
    row.appendChild(codeCell);

    tableList.appendChild(row);
  });
}

// Escuchar el evento "update-products" y llamar a la función de actualización
socket.on("update-products", (products) => {
  updateTable(products);
});

document.getElementById("form").onsubmit = (e) => {
  e.preventDefault();
  const title = document.querySelector("input[name=title]").value;
  const description = document.querySelector("input[name=description]").value;
  const price = document.querySelector("input[name=price]").value;
  const thumbnail = document.querySelector("input[name=thumbnail]").value;

  const product = {
    title,
    description,
    price,
    thumbnail,
  };

  socket.emit("new-product", product);
};
