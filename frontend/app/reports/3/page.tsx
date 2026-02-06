import { query } from '@/lib/db';
import Link from 'next/link';

export default async function StudentsAtRisk({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.query || '';
  const page = Number(params.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  const data = await query(
    `SELECT *, COUNT(*) OVER() as full_count 
     FROM vw_students_at_risk 
     WHERE name ILIKE $1 OR email ILIKE $1
     LIMIT $2 OFFSET $3`,
    [`%${q}%`, limit, offset]
  );

  const totalRows = Number(data.rows[0]?.full_count || 0);
  const totalPages = Math.ceil(totalRows / limit);

  const getPageUrl = (newPage: number) => {
      const urlParams = new URLSearchParams();
      if(q) urlParams.set('query', q);
      urlParams.set('page', newPage.toString());
      return `?${urlParams.toString()}`;
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto space-y-6 text-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

            <div className="flex items-center gap-4">
                <Link href="/" className="p-2 rounded-full hover:bg-slate-100 transition-colors" title="Volver al Dashboard">
                    {<h1>Dashboard</h1>}
                </Link>
        
        </div>
          <h1 className="text-3xl font-bold tracking-tight text-red-700">Alumnos en Riesgo</h1>
          
          <form className="flex gap-2 w-full md:w-auto">
              <input 
                  name="query" 
                  defaultValue={q} 
                  placeholder="Buscar alumno..."
                  className="border border-red-200 rounded px-3 py-2 w-full focus:ring-red-500 focus:outline-none"
              />
              <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">Buscar</button>
          </form>
        </div>

        <div className="rounded-lg border border-red-100 shadow-sm bg-white overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-red-50 text-red-900 uppercase font-medium border-b border-red-100">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-center">Promedio</th>
                <th className="px-6 py-4 text-center">Asistencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.rows.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-red-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{row.name}</td>
                  <td className="px-6 py-4 text-gray-500">{row.email}</td>
                  <td className="px-6 py-4 text-center font-bold text-red-600">{row.avg_grade}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${row.attendance_rate < 0.8 ? 'bg-red-200 text-red-800' : 'bg-gray-100'}`}>
                      {(row.attendance_rate * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
              {data.rows.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">No se encontraron resultados.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          {page > 1 ? (
              <Link href={getPageUrl(page - 1)} className="px-4 py-2 border rounded hover:bg-gray-50 bg-white text-sm">
                  Anterior
              </Link>
          ) : (
              <span className="px-4 py-2 border rounded bg-gray-50 text-gray-300 text-sm cursor-not-allowed">Anterior</span>
          )}
          <span className="px-4 py-2 text-sm font-medium self-center">Página {page} de {totalPages || 1}</span>
          {page < totalPages ? (
              <Link href={getPageUrl(page + 1)} className="px-4 py-2 border rounded hover:bg-gray-50 bg-white text-sm">
                  Siguiente
              </Link>
          ) : (
              <span className="px-4 py-2 border rounded bg-gray-50 text-gray-300 text-sm cursor-not-allowed">Siguiente</span>
          )}
        </div>
      </div>
    </div>
  );
}
