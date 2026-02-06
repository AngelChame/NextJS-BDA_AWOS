import { query } from '@/lib/db';

export default async function StudentsAtRisk({ searchParams }: { searchParams: { search?: string, page?: string } }) {
  const search = searchParams.search || '';
  const page = parseInt(searchParams.page || '1');
  const limit = 5;
  const offset = (page - 1) * limit;

  // Consulta parametrizada sobre la VIEW con búsqueda y paginación [cite: 27, 28]
  const data = await query(
    `SELECT * FROM vw_students_at_risk 
     WHERE (name ILIKE $1 OR email ILIKE $1)
     LIMIT $2 OFFSET $3`,
    [`%${search}%`, limit, offset]
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-red-700">Alumnos en Riesgo (CTE)</h1>
      
      {/* Buscador [cite: 27] */}
      <form className="mb-6">
        <input 
          name="search" 
          placeholder="Buscar por nombre o email..." 
          className="border p-2 rounded w-full max-w-md"
          defaultValue={search}
        />
      </form>

      <table className="w-full border shadow-sm">
        <thead className="bg-red-50">
          <tr>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-center">Promedio</th>
            <th className="p-3 text-center">Asistencia</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row: any, i: number) => (
            <tr key={i} className="border-b">
              <td className="p-3">{row.name}</td>
              <td className="p-3 text-gray-500">{row.email}</td>
              <td className="p-3 text-center">{row.avg_grade}</td>
              <td className="p-3 text-center">{(row.attendance_rate * 100).toFixed(0)}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación simple  */}
      <div className="mt-4 flex gap-2">
        <a href={`?search=${search}&page=${page - 1}`} className="p-2 border rounded">Anterior</a>
        <span className="p-2">Página {page}</span>
        <a href={`?search=${search}&page=${page + 1}`} className="p-2 border rounded">Siguiente</a>
      </div>
    </div>
  );
}