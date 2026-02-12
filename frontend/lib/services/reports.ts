
import { query } from '@/lib/db';
import {
    CoursePerformanceSchema,
    TeacherLoadSchema,
    StudentAtRiskSchema,
    StudentRankSchema,
    AttendanceByGroupSchema
} from '../definitions';
import { z } from 'zod';

//1. obtiene el desempeño de los cursos
export async function getCoursePerformance(term: string) {
    // valida el parametro term
    if (!term) throw new Error("El parámetro 'term' es obligatorio.");

    // ejecuta la consulta
    const res = await query(
        `SELECT * FROM vw_course_performance WHERE term ILIKE $1`,
        [`%${term}%`]
    );

    // valida la salida
    const parsed = z.array(CoursePerformanceSchema).safeParse(res.rows);

    if (!parsed.success) {
        console.error("Validation Error:", parsed.error);
        throw new Error("Error de validación de datos en Course Performance.");
    }

    return parsed.data;
}

//2. obtiene la carga docente
export async function getTeacherLoad(page: number = 1, limit: number = 5) {
    const offset = (page - 1) * limit;

    // consulta con ventana para obtener el total de registros
    const res = await query(
        `SELECT *, COUNT(*) OVER() as full_count 
     FROM vw_teacher_load 
     LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    const rows = res.rows;
    const total = Number(rows[0]?.full_count || 0);

    // valida la salida
    const parsed = z.array(TeacherLoadSchema).safeParse(rows);

    if (!parsed.success) {
        console.error("Validation Error:", parsed.error);
        throw new Error("Error de validación de datos en Teacher Load.");
    }

    return {
        data: parsed.data,
        metadata: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

//3. obtiene los alumnos en riesgo
export async function getStudentsAtRisk(page: number = 1, searchQuery: string = '', limit: number = 5) {
    const offset = (page - 1) * limit;
    const q = `%${searchQuery}%`;

    const res = await query(
        `SELECT *, COUNT(*) OVER() as full_count 
     FROM vw_students_at_risk 
     WHERE name ILIKE $1 OR email ILIKE $1
     LIMIT $2 OFFSET $3`,
        [q, limit, offset]
    );

    const rows = res.rows;
    const total = Number(rows[0]?.full_count || 0);

    // valida la salida
    const parsed = z.array(StudentAtRiskSchema).safeParse(rows);

    if (!parsed.success) {
        console.error("Validation Error:", parsed.error);
        throw new Error("Error de validación de datos en Students Risk.");
    }

    return {
        data: parsed.data,
        metadata: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

//4. obtiene la asistencia grupal
export async function getGroupAttendance(page: number = 1, limit: number = 6) {
    const offset = (page - 1) * limit;

    const res = await query(
        `SELECT *, COUNT(*) OVER() as full_count 
     FROM vw_attendance_by_group
     ORDER BY attendance_percentage ASC 
     LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    const total = Number(res.rows[0]?.full_count || 0);
    const parsed = z.array(AttendanceByGroupSchema).safeParse(res.rows);

    if (!parsed.success) {
        console.error("Validation Error:", parsed.error);
        throw new Error("Error de validación de datos en Group Attendance.");
    }

    return {
        data: parsed.data,
        metadata: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

//5. obtiene el ranking de los alumnos
export async function getStudentRank(program: string) {
    // 
    const ALLOWED_PROGRAMS = ['Software Engineering', 'Data Science', 'Cybersecurity'];

    if (!ALLOWED_PROGRAMS.includes(program)) {
        throw new Error(`Programa no válido.Permitidos: ${ALLOWED_PROGRAMS.join(', ')} `);
    }

    const res = await query(
        `SELECT * FROM vw_rank_students WHERE program = $1 ORDER BY position ASC LIMIT 20`,
        [program]
    );

    const parsed = z.array(StudentRankSchema).safeParse(res.rows);

    if (!parsed.success) {
        console.error("Validation Error:", parsed.error);
        throw new Error("Error de validación de datos en Student Rank.");
    }

    return parsed.data;
}

//6. obtiene los reportes del sistema
export async function getSystemReports() {
    const reports = [
        { id: 1, name: 'Desempeño de Cursos', view: 'vw_course_performance' },
        { id: 2, name: 'Carga Docente', view: 'vw_teacher_load' },
        { id: 3, name: 'Alumnos en Riesgo', view: 'vw_students_at_risk' },
        { id: 4, name: 'Asistencia Grupal', view: 'vw_attendance_by_group' },
        { id: 5, name: 'Ranking de Alumnos', view: 'vw_rank_students' },
    ];

    return reports;
}
