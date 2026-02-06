-- Índice para búsqueda de alumnos por nombre y email (Filtros)
CREATE INDEX idx_students_search ON students (name, email);

-- Índice para las llaves foráneas más consultadas en reportes
CREATE INDEX idx_enrollments_student_group ON enrollments (student_id, group_id);

-- Índice para filtrar por periodo en las vistas
CREATE INDEX idx_groups_term ON groups (term);