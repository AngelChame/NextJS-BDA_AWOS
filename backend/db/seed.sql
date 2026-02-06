-- Limpiar datos previos y reiniciar contadores
TRUNCATE students, teachers, courses, groups, enrollments, grades, attendance RESTART IDENTITY CASCADE;

-- 1. Profesores (Suficientes para cubrir varias materias)
INSERT INTO teachers (name, email) VALUES
('Dr. Armando Casas', 'acasas@univ.edu'),
('Dra. Elena Nito', 'enito@univ.edu'),
('Ing. Alan Brito', 'abrito@univ.edu'),
('Mtra. Rosa Mendez', 'rmendez@univ.edu'),
('Dr. Armando Baeza', 'abaeza@univ.edu'),
('Ing. Elsa Capunta', 'ecapunta@univ.edu');

-- 2. Materias
INSERT INTO courses (code, name, credits) VALUES
('CS101', 'Introducción a la Programación', 5),
('CS202', 'Bases de Datos I', 6),
('CS303', 'Estructuras de Datos', 5),
('MAT101', 'Cálculo Diferencial', 5);

-- 3. Grupos (Relación curso-profesor)
INSERT INTO groups (course_id, teacher_id, term) VALUES
(1, 1, '2025-1'), (1, 2, '2025-1'), -- Dos grupos de Intro a la Prog
(2, 3, '2025-1'), (2, 4, '2025-1'), -- Dos grupos de Bases de Datos
(3, 5, '2025-1'), (4, 6, '2025-1');

-- 4. Estudiantes (30 alumnos para probar scroll y paginación)
-- Carreras: Software Engineering, Data Science, Cybersecurity (Coinciden con tu Whitelist)
INSERT INTO students (name, email, program, enrollment_year) VALUES
('Juan Pérez', 'juan@test.com', 'Software Engineering', 2023),
('María García', 'maria@test.com', 'Software Engineering', 2023),
('Carlos López', 'carlos@test.com', 'Data Science', 2023),
('Ana Martínez', 'ana@test.com', 'Cybersecurity', 2024),
('Luis Rodríguez', 'luis@test.com', 'Software Engineering', 2023),
('Laura Sánchez', 'laura@test.com', 'Data Science', 2024),
('Jorge Ramírez', 'jorge@test.com', 'Cybersecurity', 2023),
('Sofía Torres', 'sofia@test.com', 'Software Engineering', 2023),
('Pedro Flores', 'pedro@test.com', 'Data Science', 2024),
('Lucía Morales', 'lucia@test.com', 'Software Engineering', 2023),
('Miguel Castro', 'miguel@test.com', 'Cybersecurity', 2024),
('Elena Ortiz', 'elena@test.com', 'Software Engineering', 2023),
('Ricardo Silva', 'ricardo@test.com', 'Data Science', 2023),
('Mónica Ruiz', 'monica@test.com', 'Software Engineering', 2024),
('Fernando Vega', 'fernando@test.com', 'Cybersecurity', 2023),
('Gabriela León', 'gaby@test.com', 'Data Science', 2023),
('Hugo Méndez', 'hugo@test.com', 'Software Engineering', 2024),
('Paola Ríos', 'paola@test.com', 'Cybersecurity', 2023),
('Andrés Luna', 'andres@test.com', 'Data Science', 2023),
('Valeria Solís', 'valeria@test.com', 'Software Engineering', 2024),
('Diego Pineda', 'diego@test.com', 'Cybersecurity', 2023),
('Claudia Nava', 'claudia@test.com', 'Data Science', 2023),
('Oscar Peña', 'oscar@test.com', 'Software Engineering', 2024),
('Patricia Lara', 'patricia@test.com', 'Cybersecurity', 2023),
('Raúl Guerra', 'raul@test.com', 'Data Science', 2023),
('Beatriz Mendoza', 'bea@test.com', 'Software Engineering', 2024),
('Sergio Duval', 'sergio@test.com', 'Cybersecurity', 2023),
('Natalia Cruz', 'natalia@test.com', 'Data Science', 2023),
('Javier Soto', 'javier@test.com', 'Software Engineering', 2024),
('Irene Vargas', 'irene@test.com', 'Cybersecurity', 2023);

-- 5. Inscripciones (Asignamos a todos los estudiantes a al menos un grupo)
INSERT INTO enrollments (student_id, group_id, enrolled_at)
SELECT id, (id % 6) + 1, '2025-01-15' FROM students;

-- 6. Calificaciones (Mezcla de aprobados y reprobados para ver el riesgo)
INSERT INTO grades (enrollment_id, partial1, partial2, final)
SELECT 
    id, 
    (random() * 5 + 5)::numeric(3,1), -- Notas entre 5 y 10
    (random() * 5 + 5)::numeric(3,1),
    (random() * 5 + 5)::numeric(3,1)
FROM enrollments;

-- 7. Asistencia (Simulación de 3 días)
INSERT INTO attendance (enrollment_id, date, present)
SELECT id, '2025-02-01', (random() > 0.15) FROM enrollments; -- 85% asistencia aprox

INSERT INTO attendance (enrollment_id, date, present)
SELECT id, '2025-02-02', (random() > 0.20) FROM enrollments; -- 80% asistencia aprox

INSERT INTO attendance (enrollment_id, date, present)
SELECT id, '2025-02-03', (random() > 0.30) FROM enrollments; -- 70% asistencia aprox (genera riesgo)