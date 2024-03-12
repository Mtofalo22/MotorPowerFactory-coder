// Lista de productos disponibles
let productos = [
    { id: 1, nombre: "Admisión", precio: 15000 },
    { id: 2, nombre: "Alternador", precio: 150000 },
    { id: 3, nombre: "Amortiguadores", precio: 100000 },
    { id: 4, nombre: "Bobina", precio: 25000 },
    { id: 5, nombre: "Bobina Individual", precio: 22000 },
    { id: 6, nombre: "Cree LED", precio: 8000 },
    { id: 7, nombre: "Disco de Freno", precio: 60000 },
    { id: 8, nombre: "Intercooler", precio: 180000 },
    { id: 9, nombre: "Parrilla de Suspensión", precio: 37000 },
    { id: 10, nombre: "Pastillas de Freno", precio: 18000 },
    { id: 11, nombre: "Radiador", precio: 90000 },
    { id: 12, nombre: "Turbo Garrett", precio: 300000 }
  ];
  
  // Carrito de compras (inicialmente vacío)
  let carrito = [];
  
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
  
      // Agregar event listener al botón "Agregar al Carrito" recién creado
      productoItem.querySelector(".agregar-carrito-btn").addEventListener("click", () => {
        const id = parseInt(productoItem.querySelector(".agregar-carrito-btn").getAttribute("data-id"));
        const cantidadInput = document.getElementById(`cantidad-${producto.id}`);
        const cantidad = parseInt(cantidadInput.value);
        agregarAlCarrito(id, cantidad);
      });
    });
     // Event listener para el botón de limpiar carrito
     document.getElementById("limpiar-btn").addEventListener("click", () => {
        console.log("Botón 'Limpiar Carrito' clickeado.");
        limpiarCarrito();
    });
    console.log("Productos mostrados.");
  }
  
    // Función para convertir el nombre del producto en el nombre de la imagen
    function convertirNombreAImagen(nombreProducto) {
        console.log("Convirtiendo nombre a imagen...");
        // Convertir el nombre del producto a minúsculas y reemplazar espacios con guiones bajos
        return nombreProducto.toLowerCase().replace(/\s+/g, "_") + ".jpg";
      }
      
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
        console.log("Producto agregado al carrito:", carrito);
        mostrarCarrito();
      }
      
      // Función para mostrar el contenido del carrito y calcular el total
      function mostrarCarrito() {
        console.log("Mostrando carrito...");
        const listaCarrito = document.getElementById("lista-carrito");
        console.log("listaCarrito:", listaCarrito);
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
        console.log("totalElement:", totalElement);
        totalElement.textContent = `$${total}`;
        console.log("Carrito mostrado.");
      }
      
      // Función para limpiar el carrito
      function limpiarCarrito() {
        console.log("Limpiando carrito...");
        carrito = [];
        console.log("Carrito limpiado.");
        mostrarCarrito();
      }
      
      // Event listeners para botones de agregar al carrito
      document.querySelectorAll(".agregar-carrito-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          console.log("Botón 'Agregar al Carrito' clickeado.");
          const id = parseInt(btn.getAttribute("data-id"));
          const cantidadInput = document.getElementById(`cantidad-${id}`);
          const cantidad = parseInt(cantidadInput.value);
          console.log(`ID del producto: ${id}, Cantidad: ${cantidad}`);
          agregarAlCarrito(id, cantidad);
        });
      });
      console.log("Event listeners para botones de agregar al carrito agregados.");
      // Event listener para el botón de comprar
      document.getElementById("comprar-btn").addEventListener("click", () => {
        console.log("Botón 'Comprar' clickeado.");
        alert("Compra realizada. Gracias por tu compra!");
        limpiarCarrito();
      });
      
      // Mostrar los productos al cargar la página
      console.log("Cargando productos...");
      mostrarProductos();
      console.log("Productos cargados.");