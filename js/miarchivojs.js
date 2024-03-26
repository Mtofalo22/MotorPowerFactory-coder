// Carrito de compras (inicialmente vacío)
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productos; // Variable para almacenar los productos cargados desde el JSON

// Función para cargar los productos desde un archivo JSON
async function cargarProductos() {
  try {
    const response = await fetch('productos.json');
    productos = await response.json(); 
    console.log("Productos cargados:", productos);
    mostrarProductos();
    mostrarCarrito(); // Mostrar el carrito después de cargar los productos
  } catch (error) {
    console.error('Error al cargar los productos:', error);
  }
}

// Función para mostrar los productos en forma de lista
function mostrarProductos() {
  console.log("Mostrando productos...");
  const productosLista = document.getElementById("productosLista");
  productosLista.innerHTML = "";
  productos.forEach(producto => {
    const productoItem = document.createElement("li");
    productoItem.classList.add("borderlist");
    productoItem.innerHTML = `
      <h3>${producto.nombre}</h3>
      <img src="../images/productos/${convertirNombreAImagen(producto.nombre)}" alt="${producto.nombre}" style="width: 250px; height: 200px;" />
      <p>Precio: $${producto.precio}</p>
      <input type="number" min="1" value="1" id="cantidad-${producto.id}" />
      <button class="agregar-carrito-btn" data-id="${producto.id}">Agregar al Carrito</button>
    `;
    productosLista.appendChild(productoItem);

    // Agregar event listener al botón "Agregar al Carrito"
    productoItem.querySelector(".agregar-carrito-btn").addEventListener("click", (event) => {
      const id = parseInt(event.currentTarget.dataset.id);
      const cantidadInput = document.getElementById(`cantidad-${id}`);
      const cantidad = parseInt(cantidadInput.value);
      agregarAlCarrito(id, cantidad);
    });
  });
  console.log("Productos mostrados.");
}

// Función para convertir el nombre del producto en el nombre de la imagen
const convertirNombreAImagen = (nombreProducto) => {
  console.log("Convirtiendo nombre a imagen...");
  // Convertir el nombre del producto a minúsculas y reemplazar espacios con guiones bajos
  return nombreProducto.toLowerCase().replace(/\s+/g, "_") + ".jpg";
};

// Función para agregar un producto al carrito
function agregarAlCarrito(id, cantidad) {
  console.log(`Agregando producto ${id} al carrito con cantidad ${cantidad}...`);
  const productoEnCarrito = carrito.find(producto => producto.id === id);
  if (productoEnCarrito) {
    productoEnCarrito.cantidad += cantidad;
  } else {
    const producto = productos.find(producto => producto.id === id);
    carrito.push({ ...producto, cantidad });
  }
  console.log("Carrito actualizado:", carrito);
  localStorage.setItem("carrito", JSON.stringify(carrito)); // Guardar el carrito en el almacenamiento local
  mostrarCarrito();
  const productoAgregado = productos.find(producto => producto.id === id);
  Toastify({
    text: `${cantidad} ${cantidad > 1 ? 'productos' : 'producto'} de ${productoAgregado.nombre} agregado al carrito`,
    duration: 3000,
    gravity: "bottom",
    position: "right",
    style: {
      background: "#6c757d" // Color de fondo
    }
  }).showToast();
}

// Función para mostrar el contenido del carrito y calcular el total
const mostrarCarrito = () => {
  console.log("Mostrando carrito...");
  const listaCarrito = document.getElementById("lista-carrito");
  listaCarrito.innerHTML = "";
  let total = 0;
  carrito.forEach(producto => {
    const itemCarrito = document.createElement("div");
    itemCarrito.classList.add("item-carrito");
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;
    itemCarrito.innerHTML = `
      <p>${producto.nombre} x ${producto.cantidad} - $${subtotal}</p>
    `;
    listaCarrito.appendChild(itemCarrito);
  });
  const totalElement = document.getElementById("total");
  totalElement.textContent = `$${total}`;
  console.log("Carrito mostrado.");
};

// Función para limpiar el carrito
const limpiarCarrito = () => {
  console.log("Limpiando carrito...");
  if (carrito.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "El carrito ya está vacío.",
      confirmButtonColor: "#6c757d",
    });
  } else {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Se eliminarán todos los productos del carrito!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6c757d",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, limpiar carrito"
    }).then((result) => {
      if (result.isConfirmed) {
        carrito = []; // Limpiar el carrito
        localStorage.removeItem("carrito");
        mostrarCarrito(); // Actualizar la interfaz de usuario para mostrar el carrito vacío
        Swal.fire( 
          "¡Carrito limpiado!",
          "Tu carrito ha sido limpiado.",
          "success",   
             
        );
        console.log("Carrito limpiado.");
      }
    });
  }
};
// Función para realizar una compra con tarjeta de crédito o débito
const realizarCompra = () => {
  return new Promise((resolve, reject) => {
    if (carrito.length === 0) {
      reject(new Error("El carrito está vacío. No se puede realizar la compra."));
    } else {
      Swal.fire({
        title: 'Por favor ingresa los datos de tu tarjeta de crédito o débito:',
        html:
          '<input id="swal-input-nombre" class="swal2-input" placeholder="Nombre en la tarjeta">' +
          '<input id="swal-input-numero" class="swal2-input" placeholder="Número de tarjeta" pattern="[0-9]{16}" maxlength="16">' +
          '<input id="swal-input-expiracion" class="swal2-input" placeholder="Fecha de expiración (MM/AA)" pattern="(0[1-9]|1[0-2])\/[0-9]{2}">' +
          '<input id="swal-input-cvc" class="swal2-input" placeholder="CVC/CVV" pattern="[0-9]{3}" maxlength="3">' +
          '<input id="swal-input-documento" class="swal2-input" placeholder="Número de documento" pattern="[0-9]{8}" maxlength="8">' +
          '<select id="swal-input-cuotas" class="swal2-select">' +
          '<option value="">Cantidad de cuotas</option>' +
          '<option value="1">1 cuota</option>' +
          '<option value="3">3 cuotas</option>' +
          '<option value="6">6 cuotas</option>' +
          '<option value="9">9 cuotas</option>' +
          '<option value="12">12 cuotas</option>' +
          '</select>',
        showCancelButton: true,
        confirmButtonText: 'Pagar',
        confirmButtonColor: '#6c757d', // Color del botón "Pagar"
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33', // Color del botón "Cancelar"
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const nombreTarjeta = document.getElementById('swal-input-nombre').value;
          const numeroTarjeta = document.getElementById('swal-input-numero').value;
          const fechaExpiracion = document.getElementById('swal-input-expiracion').value;
          const cvc = document.getElementById('swal-input-cvc').value;
          const documento = document.getElementById('swal-input-documento').value;
          const cuotas = document.getElementById('swal-input-cuotas').value;

          // Validar que todos los campos estén completos
          if (!nombreTarjeta || !numeroTarjeta || !fechaExpiracion || !cvc || !documento || !cuotas) {
            Swal.showValidationMessage('Por favor completa todos los campos.');
          }

          return { nombreTarjeta, numeroTarjeta, fechaExpiracion, cvc, documento, cuotas };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          carrito = []; // Limpiar el carrito
          localStorage.removeItem("carrito");
          mostrarCarrito(); // Actualizar la interfaz de usuario para mostrar el carrito vacío
          Swal.fire(
            "¡Compra realizada!",
            "Gracias por tu compra.",
            "success"
          );
          console.log("Compra realizada.");
        }
      });
    }
  });
};
// Event listener para el botón de comprar
document.getElementById("comprar-btn").addEventListener("click", () => {
  console.log("Botón 'Comprar' clickeado.");
  realizarCompra()
    .then((message) => {
      console.log(message);
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
        confirmButtonColor: "#6c757d",
      });
    });
});

// Event listener para el botón de limpiar carrito
document.getElementById("limpiar-btn").addEventListener("click", () => {
  console.log("Botón 'Limpiar Carrito' clickeado.");
  limpiarCarrito();
});

// Mostrar los productos al cargar la página
console.log("Cargando productos...");
cargarProductos();
console.log("Productos cargados.");