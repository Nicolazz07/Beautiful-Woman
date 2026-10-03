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

// Ruta para registrar una nueva usuaria
app.post('/api/registro', (req, res) => {
    const { nombre, correo, contrasena } = req.body;
    const sql = 'INSERT INTO usuarios (nombre_completo, correo_electronico, contrasena) VALUES (?, ?, ?)';
    
    db.query(sql, [nombre, correo, contrasena], (err, result) => {
        if (err) {
            // Imprimimos el error, pero NO dejamos que el servidor muera
            console.error('Error de MySQL:', err.sqlMessage);
            // ESTE 'return' ES VITAL PARA EVITAR EL CRASH:
            return res.status(400).json({ error: 'Este correo ya está registrado.' });
        }
        
        res.status(200).json({ mensaje: '¡Registro exitoso!' });
    });
});

// Ruta para Iniciar Sesión (Login)
app.post('/api/login', (req, res) => {
    // 1. Recibir los datos que la clienta escribió en el formulario
    const { correo, contrasena } = req.body;

    // 2. Buscar en MySQL si existe un usuario con ese correo
    const sql = 'SELECT * FROM usuarios WHERE correo_electronico = ?';
    
    db.query(sql, [correo], (err, result) => {
        if (err) {
            console.error('Error al consultar en MySQL:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        // 3. Verificar si el correo existe (si el resultado está vacío, el usuario no existe)
        if (result.length === 0) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        // 4. El usuario existe, ahora verificamos si la contraseña coincide
        const usuario = result[0]; // Tomamos el primer (y único) usuario encontrado
        
        if (usuario.contrasena === contrasena) {
            // ¡Las credenciales son correctas! 
            // (Nota de desarrollo: En el futuro aquí crearemos un token de sesión, por ahora solo avisamos el éxito)
            res.status(200).json({ 
                mensaje: '¡Inicio de sesión exitoso!', 
                usuario: { nombre: usuario.nombre_completo, correo: usuario.correo_electronico } 
            });
        } else {
            // La contraseña no es igual a la de la base de datos
            res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }
    });
});
// --- RUTAS PARA LAS RESEÑAS (VERSIÓN ASYNC/AWAIT) ---

// Ruta para guardar una reseña nueva
app.post('/api/resenas', async (req, res) => {
    const { nombre, calificacion, comentario } = req.body;
    const sql = 'INSERT INTO resenas (nombre, calificacion, comentario) VALUES (?, ?, ?)';
    
    try {
        await db.query(sql, [nombre, calificacion, comentario]);
        res.status(200).json({ mensaje: '¡Reseña publicada con éxito!' });
    } catch (error) {
        console.error('Error al guardar reseña:', error);
        res.status(500).json({ error: 'Error al guardar la reseña en la base de datos' });
    }
});

// Ruta para pedir todas las reseñas y mostrarlas
app.get('/api/resenas', async (req, res) => {
    const sql = 'SELECT * FROM resenas ORDER BY id_resena DESC';
    
    try {
        // Usamos la misma estructura que ya te funciona en el catálogo
        const [resultados] = await db.query(sql);
        res.json(resultados);
    } catch (error) {
        console.error('Error al consultar reseñas:', error);
        res.status(500).json({ error: 'Error al obtener las reseñas' });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});