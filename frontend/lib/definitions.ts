import { z } from 'zod';

// ==========================================
// 1. Reporte 1: Rendimiento por Curso
// View: vw_course_performance
// ==========================================
export const CoursePerformanceSchema = z.object({
    course_name: z.string(),
    term: z.string(),
    program: z.string(),
    // AVG returns string from PG driver sometimes, so we transform
    general_average: z.number().or(z.string()).transform(val => Number(val)),
    // COUNT returns string from PG driver
    failed_count: z.number().or(z.string()).transform(val => Number(val)),
});

export type CoursePerformance = z.infer<typeof CoursePerformanceSchema>;

// ==========================================
// 2. Reporte 2: Carga Docente
// View: vw_teacher_load
// ==========================================
export const TeacherLoadSchema = z.object({
    teacher_name: z.string(),
    term: z.string(),
    groups_count: z.number().or(z.string()).transform(val => Number(val)),
    total_students: z.number().or(z.string()).transform(val => Number(val)),
    avg_grade: z.number().or(z.string()).transform(val => Number(val)),
    // Optional for pagination counts if needed
    full_count: z.number().or(z.string()).transform(val => Number(val)).optional(),
});

export type TeacherLoad = z.infer<typeof TeacherLoadSchema>;

// ==========================================
// 3. Reporte 3: Alumnos en Riesgo
// View: vw_students_at_risk
// ==========================================
export const StudentAtRiskSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    avg_grade: z.number().or(z.string()).transform(val => Number(val)),
    attendance_rate: z.number().or(z.string()).transform(val => Number(val)),
});

// Wrapper para la respuesta paginada
export const PaginatedStudentRiskSchema = z.object({
    data: z.array(StudentAtRiskSchema),
    metadata: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
    })
});

// ==========================================
// 4. Reporte 4: Asistencia por Grupo
// View: vw_attendance_by_group
// ==========================================
export const AttendanceByGroupSchema = z.object({
    course_name: z.string(),
    term: z.string(),
    attendance_percentage: z.number().or(z.string()).transform(val => Number(val)),
    full_count: z.number().or(z.string()).transform(val => Number(val)).optional(),
});

// ==========================================
// 5. Reporte 5: Ranking de Estudiantes
// View: vw_rank_students
// ==========================================
export const StudentRankSchema = z.object({
    student_name: z.string(),
    program: z.string(),
    term: z.string(),
    final_avg: z.number().or(z.string()).transform(val => Number(val)),
    position: z.number().or(z.string()).transform(val => Number(val)),
});

export type StudentRank = z.infer<typeof StudentRankSchema>;

// ==========================================
// Search Params Schema (Para filtros)
// ==========================================
export const SearchParamsSchema = z.object({
    query: z.string().optional(),
    page: z.string().optional().transform(val => Number(val) || 1),
    term: z.string().optional(),
    program: z.string().optional(),
});
