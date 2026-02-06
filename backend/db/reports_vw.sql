-- 1. vw_course_performance: Promedios y reprobados por curso y periodo.
-- Grain: 1 fila por curso + periodo.
-- Métricas: AVG(promedio), COUNT(reprobados).
CREATE OR REPLACE VIEW vw_course_performance AS
SELECT 
    c.name AS course_name,
    g.term,
    s.program,
    ROUND(AVG((gr.partial1 + gr.partial2 + gr.final) / 3), 2) AS general_average,
    COUNT(CASE WHEN (gr.partial1 + gr.partial2 + gr.final) / 3 < 6 THEN 1 END) AS failed_count
FROM courses c
JOIN groups g ON c.id = g.course_id
JOIN enrollments e ON g.id = e.group_id
JOIN grades gr ON e.id = gr.enrollment_id
JOIN students s ON e.student_id = s.id
GROUP BY c.name, g.term, s.program;

-- 2. vw_teacher_load: Carga por docente.
-- Grain: 1 fila por docente + periodo.
-- Métricas: COUNT(grupos), COUNT(alumnos).
CREATE OR REPLACE VIEW vw_teacher_load AS
SELECT 
    t.name AS teacher_name,
    g.term,
    COUNT(DISTINCT g.id) AS groups_count,
    COUNT(e.id) AS total_students,
    ROUND(AVG((gr.partial1 + gr.partial2 + gr.final) / 3), 2) AS avg_grade
FROM teachers t
JOIN groups g ON t.id = g.teacher_id
JOIN enrollments e ON g.id = e.group_id
JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY t.name, g.term
HAVING COUNT(DISTINCT g.id) > 0;

-- 3. vw_students_at_risk: Alumnos con bajo rendimiento o baja asistencia.
-- Usa CTE como requisito.
CREATE OR REPLACE VIEW vw_students_at_risk AS
WITH student_stats AS (
    SELECT 
        s.id,
        s.name,
        s.email,
        AVG((gr.partial1 + gr.partial2 + gr.final) / 3) as avg_grade,
        CAST(COUNT(CASE WHEN a.present THEN 1 END) AS FLOAT) / NULLIF(COUNT(a.id), 0) as attendance_rate
    FROM students s
    JOIN enrollments e ON s.id = e.student_id
    LEFT JOIN grades gr ON e.id = gr.enrollment_id
    LEFT JOIN attendance a ON e.id = a.enrollment_id
    GROUP BY s.id, s.name, s.email
)
SELECT * FROM student_stats 
WHERE avg_grade < 7 OR attendance_rate < 0.8;

-- 4. vw_attendance_by_group: Promedio de asistencia por grupo.
CREATE OR REPLACE VIEW vw_attendance_by_group AS
SELECT 
    c.name as course_name,
    g.term,
    COALESCE(ROUND(CAST(COUNT(CASE WHEN a.present THEN 1 END) AS NUMERIC) * 100 / NULLIF(COUNT(a.id), 0), 2), 0) as attendance_percentage
FROM groups g
JOIN courses c ON g.course_id = c.id
JOIN enrollments e ON g.id = e.group_id
LEFT JOIN attendance a ON e.id = a.enrollment_id
GROUP BY c.name, g.term;

-- 5. vw_rank_students: Ranking por carrera y periodo.
-- Usa Window Function como requisito.
CREATE OR REPLACE VIEW vw_rank_students AS
SELECT 
    s.name as student_name,
    s.program,
    g.term,
    ROUND(AVG((gr.partial1 + gr.partial2 + gr.final) / 3), 2) as final_avg,
    RANK() OVER (PARTITION BY s.program, g.term ORDER BY AVG((gr.partial1 + gr.partial2 + gr.final) / 3) DESC) as position
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN groups g ON e.group_id = g.id
JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY s.name, s.program, g.term;