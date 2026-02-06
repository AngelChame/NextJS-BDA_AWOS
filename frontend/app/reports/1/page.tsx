import { query } from '@/lib/db';
import { z } from 'zod';

const termSchema = z.string().min(1);

export default async function CoursePerformance({ searchParams }: { searchParams: { term?: string } }) {
  // Validación de filtro obligatorio 
  const term = searchParams.term || '2025-1'; 
  
  const data = await query(
    `SELECT * FROM vw_course_performance WHERE term = $1`, 
    [term]
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Rendimiento por Curso</h1>
      <form className="mb-6 flex gap-4">
        <input 
          name="term" 
          placeholder="Periodo (ej: 2025-1)" 
          className="border p-2 rounded"
          defaultValue={term}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Filtrar</button>
      </form>

      <div className="bg-green-100 p-4 mb-4 rounded">
        <strong>KPI:</strong> Promedio General del Periodo
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Curso</th>
            <th className="border p-2">Programa</th>
            <th className="border p-2">Promedio</th>
            <th className="border p-2">Reprobados</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row: any, i: number) => (
            <tr key={i}>
              <td className="border p-2">{row.course_name}</td>
              <td className="border p-2">{row.program}</td>
              <td className="border p-2 text-center">{row.general_average}</td>
              <td className="border p-2 text-center text-red-600 font-bold">{row.failed_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}