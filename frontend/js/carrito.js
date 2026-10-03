document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleccionamos los botones de sumar, restar y eliminar
    const botonesRestar = document.querySelectorAll('.control-cantidad button:first-child');
    const botonesSumar = document.querySelectorAll('.control-cantidad button:last-child');
    const botonesEliminar = document.querySelectorAll('.btn-eliminar');

    // 2. Función matemática para actualizar el cuadro de "Resumen de compra"
    function actualizarTotal() {
        let subtotal = 0;
        const productos = document.querySelectorAll('.producto-item');

        productos.forEach(producto => {
            // Extraer el precio (limpiando el signo $ y los puntos para poder sumar)
            let precioTexto = producto.querySelector('.precio').innerText;
            let precio = parseInt(precioTexto.replace('$', '').replace('.', ''));
            
            // Extraer la cantidad actual de la píldora
            let cantidad = parseInt(producto.querySelector('.control-cantidad span').innerText);
            
            // Multiplicar precio por cantidad y sumarlo al subtotal
            subtotal += precio * cantidad;
        });

        // Mostrar el subtotal formateado en pesos colombianos en la primera casilla
        const casillasValor = document.querySelectorAll('.fila-resumen .valor');
        casillasValor[0].innerText = '$' + subtotal.toLocaleString('es-CO');
        
        // Calcular el total final (sumando los $12.000 del envío, si hay productos)
        let totalFinal = subtotal > 0 ? subtotal + 12000 : 0;
        casillasValor[3].innerText = '$' + totalFinal.toLocaleString('es-CO');
    }

    // 3. Darle acción al botón de sumar (+)
    botonesSumar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            let spanCantidad = e.target.previousElementSibling;
            let cantidadActual = parseInt(spanCantidad.innerText);
            spanCantidad.innerText = cantidadActual + 1; // Suma 1
            actualizarTotal(); // Recalcula el precio en tiempo real
        });
    });

    // 4. Darle acción al botón de restar (-)
    botonesRestar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            let spanCantidad = e.target.nextElementSibling;
            let cantidadActual = parseInt(spanCantidad.innerText);
            if (cantidadActual > 1) { // Evita que baje a cero o negativo
                spanCantidad.innerText = cantidadActual - 1;
                actualizarTotal();
            }
        });
    });

    // 5. Darle acción al botón de eliminar (papelera)
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            // Busca el contenedor del producto completo y lo borra de la pantalla
            e.target.closest('.producto-item').remove();
            actualizarTotal(); // Recalcula porque ahora hay un producto menos
        });
    });
});