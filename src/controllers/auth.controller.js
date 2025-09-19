const db = require('../config/conexion_db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthController {
    async login(req, res) {
        const { email, password} = req.body;

        try {
            //Buscar usuario por email
            const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

            if(usuarios.length ===0) {
                return res.status(401).json({ erro: 'Usuario no encontrado'});
            }

            const usuario = usuarios[0];

            // verificar contraseña con bcrypt
            const esValida = await bcrypt.compare(password, usuario.clave);
            if (!esValida) {
                return res.status(401).json({ error: 'Contraseña incorrecta'});
            }

            //obtener rol y permisos del usuario
            const [rolDatos] = await db.query(
                `SELECT r.nombre AS rol, p.nombre AS permiso
                FROM roles r
                JOIN rol_permiso rp ON r.id_rol = rp.id_rol
                JOIN permisos p ON rp.permiso_id = p.id_permiso
                WHERE r.id_rol = ?`,
                [usuario.id_rol]
            );

            //generar JWT
            const token = jwt.sign(
                {id: usuario.id_usuario, rol: usuario.id_rol},
                'secreto_super_seguro',
                { expiresIn: '2h'}
            );

            res.json({
                mensaje: 'Inicio de sesion exitoso',
                token,
                usuario: {
                    id: usuario.id_usuario,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: rolDatos[0]?.rol || 'Sin rol',
                    permisos: rolDatos.map(p => p.permiso)
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
}

module.exports = new AuthController();