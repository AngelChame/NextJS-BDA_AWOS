-- Crear el rol de la aplicación
CREATE ROLE app_user WITH LOGIN PASSWORD 'app_password';

-- Dar permisos de conexión
GRANT CONNECT ON DATABASE school_reports TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;

-- El usuario SOLO puede leer de las VIEWS, no de las tablas base
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_user;

-- Asegurarse de que no tenga acceso a las tablas originales
REVOKE SELECT ON students, teachers, courses, groups, enrollments, grades, attendance FROM app_user;