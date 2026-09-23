// Esperar a que la página cargue por completo
document.addEventListener('DOMContentLoaded', () => {
    cargarCatalogo();
    actualizarContadorCarrito(); 
});

// Función principal para obtener productos de la API
async function cargarCatalogo() {
    const gridProductos = document.getElementById('grid-productos');
    
    if (!gridProductos) return;
    
    try {
        // Hacemos la petición (Fetch) a nuestra ruta de backend
        const respuesta = await fetch('http://localhost:3000/api/productos');
        
        if (!respuesta.ok) {
            throw new Error('Error al conectar con la API');
        }

        const productos = await respuesta.json(); // Transformar respuesta a JSON

        
        // Limpiar el texto de "Cargando..."
        gridProductos.innerHTML = '';

        // Recorrer el arreglo de productos de MySQL
        productos.forEach(producto => {
            // Formatear precio a pesos colombianos
            const precioFormat = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(producto.precio_base);

            // Construir el bloque HTML de la tarjeta
            const tarjetaHTML = `
                <article class="card-producto">
                    <div class="card-img-container">
                        <img src="${producto.imagen_principal}" alt="${producto.nombre}">
                    </div>
                    <div class="card-body">
                        <span class="tag-categoria">${producto.categoria}</span>
                        <h3 class="card-titulo">${producto.nombre}</h3>
                        <p style="font-size: 0.9rem; color: #666; margin-bottom: 10px;">
                            ${producto.descripcion_corta}
                        </p>
                        <p class="card-precio">${precioFormat}</p>
                        <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id_producto}, '${producto.nombre}', ${producto.precio_base}, '${producto.imagen_principal}')">
                            Añadir al carrito
                        </button>
                    </div>
                </article>
            `;
            
            // Inyectar la tarjeta en la grilla
            gridProductos.innerHTML += tarjetaHTML;
        });

    } catch (error) {
        console.error('Hubo un problema:', error);
        gridProductos.innerHTML = '<p style="color: red;">Error al cargar el catálogo. Verifica que el servidor (XAMPP y Node) esté encendido.</p>';
    }
}

// --- Lógica del Carrito de Compras ---

// Inicializar el carrito: busca si ya hay algo guardado, si no, crea un arreglo vacío
let carrito = JSON.parse(localStorage.getItem('carritoBW')) || [];

// Función para atrapar el producto al hacer clic
function agregarAlCarrito(idProducto, nombre, precio, imagen) {
    // Revisar si la prenda ya está en la bolsa
    const prendaExistente = carrito.find(item => item.id === idProducto);
    
    if (prendaExistente) {
        prendaExistente.cantidad++; // Si ya está, solo aumentamos la cantidad
    } else {
        // Si es nueva, la agregamos al arreglo
        carrito.push({
            id: idProducto,
            nombre: nombre,
            precio: precio,
            imagen: imagen,
            cantidad: 1
        });
    }
    
    // Guardar en la memoria del navegador
    localStorage.setItem('carritoBW', JSON.stringify(carrito));
    
    // Alerta temporal para confirmar
    alert(`¡${nombre} se añadió a tu bolsa de compras!`);
    
    alert(`¡${nombre} se añadió a tu bolsa de compras!`);
    console.log("Estado actual del carrito:", carrito);
    actualizarContadorCarrito(); // <-- Agrega esta línea al final
}
// Función para actualizar el número visual en el carrito
function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        // Sumar todas las cantidades de las prendas en el arreglo
        const totalPrendas = carrito.reduce((total, item) => total + item.cantidad, 0);
        contador.innerText = totalPrendas;
    }
}