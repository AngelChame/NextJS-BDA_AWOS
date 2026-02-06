-- Limpiar datos previos
TRUNCATE students, teachers, courses, groups, enrollments, grades, attendance RESTART IDENTITY CASCADE;

-- 1. Insertar Profesores
INSERT INTO teachers (name, email) VALUES
('Dr. Armando Casas', 'acasas@university.edu'),
('Dra. Elena Nito', 'enito@university.edu'),
('Ing. Alan Brito', 'abrito@university.edu');

-- 2. Insertar Materias
INSERT INTO courses (code, name, credits) VALUES
('CS101', 'Introducción a la Programación', 5),
('CS202', 'Bases de Datos I', 6),
('CS303', 'Desarrollo Web Avanzado', 7);

-- 3. Insertar Alumnos (Suficientes para probar paginación)
INSERT INTO students (name, email, program, enrollment_year) VALUES
('Alice Johnson', 'alice@test.com', 'Software Engineering', 2024),
('Bob Smith', 'bob@test.com', 'Software Engineering', 2024),
('Charlie Brown', 'charlie@test.com', 'Data Science', 2024),
('Diana Prince', 'diana@test.com', 'Data Science', 2024),
('Edward Norton', 'edward@test.com', 'Software Engineering', 2024),
('Fiona Apple', 'fiona@test.com', 'Software Engineering', 2024),
('George Miller', 'george@test.com', 'Cybersecurity', 2024),
('Hannah Abbott', 'hannah@test.com', 'Cybersecurity', 2024),
('Ian Wright', 'ian@test.com', 'Software Engineering', 2024),
('Julia Roberts', 'julia@test.com', 'Software Engineering', 2024),
('Kevin Hart', 'kevin@test.com', 'Data Science', 2024),
('Laura Palmer', 'laura@test.com', 'Data Science', 2024),
('Mike Tyson', 'mike@test.com', 'Software Engineering', 2024),
('Nina Simone', 'nina@test.com', 'Cybersecurity', 2024),
('Oscar Wilde', 'oscar@test.com', 'Software Engineering', 2024);

-- 4. Crear Grupos (Relación Docente + Materia)
INSERT INTO groups (course_id, teacher_id, term) VALUES
(1, 1, '2025-1'), -- Intro Prog con Armando
(2, 2, '2025-1'), -- BD con Elena
(3, 3, '2025-1'); -- Web con Alan

-- 5. Inscripciones (Inscribir a todos en el Grupo 1 para tener volumen)
INSERT INTO enrollments (student_id, group_id, enrolled_at)
SELECT id, 1, CURRENT_DATE FROM students;

-- 6. Calificaciones (Para generar reportes de rendimiento y alumnos en riesgo)
-- Algunos con promedio alto, otros bajo (Riesgo)
INSERT INTO grades (enrollment_id, partial1, partial2, final)
SELECT 
    id, 
    (random() * 10), -- Nota parcial 1
    (random() * 10), -- Nota parcial 2
    (random() * 10)  -- Nota final
FROM enrollments;

-- 7. Asistencia (Simular faltas para vw_students_at_risk)
INSERT INTO attendance (enrollment_id, date, present)
SELECT id, '2025-02-01', (random() > 0.2) FROM enrollments; -- 80% de probabilidad de asistencia