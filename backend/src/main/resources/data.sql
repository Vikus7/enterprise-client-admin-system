-- =====================================================================
-- Datos iniciales: usuario de prueba para autenticacion.
-- La contrasena 'admin123' se almacena como hash BCrypt.
-- ON CONFLICT evita duplicar el usuario en reinicios sucesivos.
-- =====================================================================

INSERT INTO app_user (username, password_hash, full_name, enabled)
VALUES ('admin', '$2a$10$k5XW0Oqvcger3jOm/IFCBepCYIYqBZ5S7YSVEHJwSi68bNEIkfhDK', 'Administrador', TRUE)
ON CONFLICT (username) DO NOTHING;
