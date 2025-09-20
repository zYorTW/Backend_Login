const db = require('../config/conexion_db');

class RoIPermisocontroller {
    // Obtener todas las relaciones rol-permiso
    async obtenerRoIPermisos(req, res) {
        try {
            const [roIPermisos] = await db.query(
                `SELECT rp.id_rol_permiso, rp.id_rol, r.nombre AS rol, p.nombre AS permiso
                FROM rol_permiso rp
                JOIN roles r ON rp.id_rol = r.id_rol
                JOIN permisos p ON rp.permiso_id = p.id_permiso`
            );
            res.json(roIPermisos);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener roles-permisos' });
        }
    }

    async obtenerPermisosDeRo1(req, res) {
        const { idro1 } = req.params;
        try {
            const [roIPermisos] = await db.query(
                `SELECT
                rp.id_rol_permiso,
                rp.id_rol,
                r.nombre AS rol,
                p.id_permiso,
                p.nombre AS permiso
                FROM rol_permiso rp
                JOIN roles r ON rp.id_rol = r.id_rol
                JOIN permisos p ON rp.permiso_id = p.id_permiso
                WHERE rp.id_rol = ?`, 
                [idro1]); // parámetro

            res.json(roIPermisos);
        } catch (error) {
            console.error("Error en obtenerPermisosDeRo1:", error);
            res.status(500).json({ error: 'Error al obtener roles-permisos' });
        }
    }


    // Obtener una relación por ID
    async obtenerRoIPermisoPorId(req, res) {
        const { id } = req.params;
        try {
            const [roIPermiso] = await db.query(
                `SELECT rp.id_rol_permiso, r.nombre AS rol, p.nombre AS permiso
                FROM rol_permiso rp
                JOIN roles r ON rp.id_rol = r.id_rol
                JOIN permisos p ON rp.permiso_id = p.id_permiso
                WHERE rp.id_rol_permiso = ?`, [id]);
            if (roIPermiso.length == 0) {
                return res.status(404).json({ error: 'Relacion rol-permiso no encontrada' });
            }
            res.json(roIPermiso[0]);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener relación rol-permiso' });
        }
    }

    // Asignar un permiso a un rol
    async agregarRoIPermiso(req, res) {
        const { id_rol, permiso_id } = req.body;
        try {
            await db.query(
                'INSERT INTO rol_permiso (id_rol, permiso_id) VALUES (?, ?)',
                [id_rol, permiso_id]
            );
            res.json({ mensaje: 'Permiso asignado al rol correctamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al asignar permiso al rol' });
        }
    }

    // Actualizar una relación (cambiar el permiso o el rol asociado)
    async actualizarRoPermiso(req, res) {
        const { id } = req.params;
        const { id_rol, permiso_id } = req.body;
        try {
            await db.query(
                'UPDATE roL_permiso SET id_rol = ?, permiso_id = ? WHERE id_roL_permiso = ?',
                [id_rol, permiso_id, id]
            );
            res.json({ mensaje: 'Relación rol-permiso actualizada correctamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar relación rol-permiso' });
        }
    }

    // Eliminar una relación rol-permiso
    async eliminarRoPermiso(req, res) {
        const { id } = req.params;
        try {
            await db.query('DELETE FROM roL_permiso WHERE id_roL_permiso = ?', [id]);
            res.json({ mensaje: 'Relación rol-permiso eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar relación rol-permiso' });
        }
    }
}

module.exports = RoIPermisocontroller;