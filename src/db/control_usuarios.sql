create database control_usuarios;
use control_usuarios;

CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50)
);

CREATE TABLE permisos (
    id_permiso INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    descripcion TEXT
);

CREATE TABLE rol_permiso (
    id_rol_permiso INT AUTO_INCREMENT PRIMARY KEY,
    id_rol INT,
    permiso_id INT,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol),
    FOREIGN KEY (permiso_id) REFERENCES permisos(id_permiso)
);

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(300),
    clave VARCHAR(500),
    id_rol INT,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- Insertar roles
INSERT INTO roles (nombre) VALUES
('Administrador'),
('Empleado');

-- Insertar permisos
INSERT INTO permisos (nombre, descripcion) VALUES
('Crear', 'Permite crear nuevos registros'),
('Leer', 'Permite visualizar registros'),
('Actualizar', 'Permite modificar registros existentes'),
('Eliminar', 'Permite eliminar registros');

-- Asignar permisos al rol Administrador (id_rol = 1)
INSERT INTO rol_permiso (id_rol, permiso_id) VALUES
(1, 1), -- Crear
(1, 2), -- Leer
(1, 3), -- Actualizar
(1, 4); -- Eliminar

-- Asignar permisos al rol Empleado (id_rol = 2), solo Leer
INSERT INTO rol_permiso (id_rol, permiso_id) VALUES
(2, 2);

-- Insertar usuario Admin (Contraseña: 123456)
INSERT INTO usuarios (nombre, email, clave, id_rol)
VALUES
('Admin', 'admin@gmail.com', '$2b$10$wLyuMd5mP.D5YekCua2uSOQIRxVXFyKmpz3go/ryHgHU1ihTtioa6', 1);
-- La contraseña es: 1

-- Insertar usuario Empleado (Contraseña: 123456)
INSERT INTO usuarios (nombre, email, clave, id_rol)
VALUES
('Empleado', 'empleado@gmail.com', '$2b$10$wLyuMd5mP.D5YekCua2uSOQIRxVXFyKmpz3go/ryHgHU1ihTtioa6', 2);
-- La contraseña es: 1
