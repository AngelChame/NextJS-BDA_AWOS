-- 1. Tabla de Estudiantes 
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    program VARCHAR(100) NOT NULL,
    enrollment_year INTEGER NOT NULL
);

-- 2. Tabla de Profesores 
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- 3. Tabla de Materias (Cursos) 
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    credits INTEGER NOT NULL
);

-- 4. Tabla de Grupos (Relaciona Materia con Profesor) 
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
    term VARCHAR(20) NOT NULL -- Ej: '2025-1'
);

-- 5. Tabla de Inscripciones (Relaciona Alumno con Grupo) 
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    enrolled_at DATE DEFAULT CURRENT_DATE,
    UNIQUE(student_id, group_id) -- Evita inscripciones duplicadas
);

-- 6. Tabla de Calificaciones
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    enrollment_id INTEGER REFERENCES enrollments(id) ON DELETE CASCADE,
    partial1 NUMERIC(4,2) CHECK (partial1 >= 0 AND partial1 <= 10),
    partial2 NUMERIC(4,2) CHECK (partial2 >= 0 AND partial2 <= 10),
    final NUMERIC(4,2) CHECK (final >= 0 AND final <= 10)
);

-- 7. Tabla de Asistencia 
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    enrollment_id INTEGER REFERENCES enrollments(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    present BOOLEAN NOT NULL
);