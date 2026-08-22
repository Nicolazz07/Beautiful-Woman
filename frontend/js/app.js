// Esperar a que la página cargue por completo
document.addEventListener('DOMContentLoaded', () => {
    cargarCatalogo();
});

// Función principal para obtener productos de la API
async function cargarCatalogo() {
    const gridProductos = document.getElementById('grid-productos');
    
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
                        <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id_producto})">
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

// Función simulada para el botón (la programaremos a fondo después)
function agregarAlCarrito(idProducto) {
    alert(`Prenda con ID ${idProducto} añadida al carrito. ¡Paso a paso!`);
}