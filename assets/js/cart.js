function agregarAlCarrito(id, cantidad) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  let productoExistenteIndex = carrito.findIndex((item) => item.id === id);

  if (productoExistenteIndex !== -1) {
    carrito[productoExistenteIndex].cantidad += cantidad;
  } else {
    const producto = {
      id: id,
      cantidad: cantidad,
    };
    carrito.push(producto);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  console.log("Producto(s) agregado(s) al carrito:", {
    id: id,
    cantidad: cantidad,
  });
}

// agregarAlCarrito("1", 1);
// agregarAlCarrito("2", 1);
// agregarAlCarrito("3", 1);
// agregarAlCarrito("1", 1);

mostrarCarrito();

function obtenerUrlImagen(id) {
  const prod = inventario_joyeria.filter((el) => el.id === id)[0];
  return prod.Imagen;
}

function mostrarCarrito() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const carritoCuerpo = document.getElementById("carrito-cuerpo");

  carritoCuerpo.innerHTML = "";

  carrito.forEach((item) => {
    const fila = document.createElement("tr");
    const columnaImagen = document.createElement("td");
    const imagen = document.createElement("img");
    imagen.classList.add(
      "imagen_prod",
      "object-cover",
      "rounded-md",
      "self-center",
      "border",
      "border-[--chocolate]"
    );
    imagen.src = obtenerUrlImagen(item.id);
    imagen.alt = "Imagen del producto";
    imagen.style.maxWidth = "100px";
    columnaImagen.appendChild(imagen);
    columnaImagen.classList.add("img--container");
    fila.appendChild(columnaImagen);

    const columnaProducto = document.createElement("td");
    columnaProducto.textContent = obtenerNombreProducto(item.id);
    fila.appendChild(columnaProducto);

    const columnaAcciones = document.createElement("td");

    const btnAumentar = document.createElement("button");
    btnAumentar.classList.add("action_button", "rounded-md");
    btnAumentar.textContent = "+";
    btnAumentar.addEventListener("click", function () {
      aumentarCantidad(item.id);
    });

    const columnaCantidad = document.createElement("span");
    columnaCantidad.textContent = item.cantidad;

    const btnReducir = document.createElement("button");
    btnReducir.classList.add("action_button", "rounded-md");
    btnReducir.textContent = "-";
    btnReducir.addEventListener("click", function () {
      reducirCantidad(item.id);
    });

    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("action_button", "rounded-md");
    btnEliminar.textContent = "-";
    btnEliminar.addEventListener("click", function () {
      EliminarItem(item.id);
    });

    columnaAcciones.appendChild(btnReducir);
    columnaAcciones.appendChild(columnaCantidad);
    columnaAcciones.appendChild(btnAumentar);
    columnaAcciones.appendChild(btnEliminar);

    fila.appendChild(columnaAcciones);

    carritoCuerpo.appendChild(fila);
  });
}

function aumentarCantidad(id) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (
    inventario_joyeria.find((item) => item.id == id).Stock >
    carrito.find((item) => item.id == id).cantidad
  ) {
    carrito.find((item) => item.id == id).cantidad++;
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  mostrarCarrito();
}

function reducirCantidad(id) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  
  const producto = carrito.find((item) => item.id === id);
  
  if (producto && producto.cantidad >= 1) {
    producto.cantidad--;
  }
  
  localStorage.setItem("carrito", JSON.stringify(carrito));
  
  mostrarCarrito();
}

function obtenerNombreProducto(id) {
  const prod = inventario_joyeria.filter((el) => el.id === id)[0];
  return prod.Nombre;
}

const EliminarItem = (id) => {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const itemEliminar = carrito.findIndex(el => el.id === id);
  console.log("🚀 ~ EliminarItem ~ itemEliminar:", itemEliminar)
  carrito.splice(itemEliminar,1)
  console.log("🚀 ~ EliminarItem ~ carrito:", carrito)
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}
