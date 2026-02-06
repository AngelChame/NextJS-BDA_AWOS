import { query } from '@/lib/db';

export default async function TeacherLoad({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1');
  const limit = 5;
  const offset = (page - 1) * limit;

  const data = await query(
    `SELECT * FROM vw_teacher_load LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Carga Académica Docente</h1>
      <p className="text-gray-600 mb-4">Reporte de grupos y alumnos totales por docente (Filtrado por HAVING en DB).</p>
      
      <div className="bg-blue-100 p-4 mb-4 rounded border-l-4 border-blue-500">
        <strong>KPI:</strong> Total de Alumnos Atendidos
      </div>

      <table className="w-full border shadow-sm bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">Docente</th>
            <th className="p-3 text-center">Periodo</th>
            <th className="p-3 text-center">Grupos</th>
            <th className="p-3 text-center">Alumnos Totales</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row: any, i: number) => (
            <tr key={i} className="border-b">
              <td className="p-3 font-medium">{row.teacher_name}</td>
              <td className="p-3 text-center">{row.term}</td>
              <td className="p-3 text-center">{row.groups_count}</td>
              <td className="p-3 text-center">{row.total_students}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex items-center gap-4">
        <a href={`?page=${Math.max(1, page - 1)}`} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Anterior</a>
        <span className="font-semibold">Página {page}</span>
        <a href={`?page=${page + 1}`} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Siguiente</a>
      </div>
    </div>
  );
}