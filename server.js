const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Conexión a la base de datos
const db = require('./backend/config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta básica de prueba
app.get('/', (req, res) => {
    res.send('API de Beautiful Woman activa.');
});

// Ruta que pide la página web para mostrar la ropa
app.get('/api/productos', async (req, res) => {
    try {
        const [productos] = await db.query(`
            SELECT p.id_producto, p.nombre, p.descripcion_corta, p.precio_base, p.imagen_principal, c.nombre AS categoria
            FROM Productos p
            INNER JOIN Categorias c ON p.id_categoria = c.id_categoria
            WHERE p.activo = TRUE
        `);
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});