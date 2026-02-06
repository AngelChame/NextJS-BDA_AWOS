import { query } from '@/lib/db';
import Link from 'next/link';

export default async function TeacherLoad({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  const data = await query(
    `SELECT *, COUNT(*) OVER() as full_count 
     FROM vw_teacher_load 
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  const totalRows = Number(data.rows[0]?.full_count || 0);
  const totalPages = Math.ceil(totalRows / limit);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto space-y-6 text-slate-800">

        <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-full hover:bg-slate-100 transition-colors" title="Volver al Dashboard">
               {<h1>Dashboard</h1>}
            </Link>
    
</div>
        <h1 className="text-3xl font-bold tracking-tight">Carga Académica</h1>
        
        <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-medium border-b">
              <tr>
                <th className="px-6 py-4">Docente</th>
                <th className="px-6 py-4 text-center">Periodo</th>
                <th className="px-6 py-4 text-center">Grupos</th>
                <th className="px-6 py-4 text-center">Alumnos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.rows.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{row.teacher_name}</td>
                  <td className="px-6 py-4 text-center text-gray-500">{row.term}</td>
                  <td className="px-6 py-4 text-center font-mono">{row.groups_count}</td>
                  <td className="px-6 py-4 text-center font-mono">{row.total_students}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          {page > 1 ? (
              <Link href={`?page=${page - 1}`} className="px-4 py-2 border rounded hover:bg-gray-100 bg-white text-sm">
                  Anterior
              </Link>
          ) : (
              <span className="px-4 py-2 border rounded bg-gray-100 text-gray-400 text-sm cursor-not-allowed">Anterior</span>
          )}
          <span className="px-4 py-2 text-sm font-medium self-center">Página {page} de {totalPages || 1}</span>
          {page < totalPages ? (
              <Link href={`?page=${page + 1}`} className="px-4 py-2 border rounded hover:bg-gray-100 bg-white text-sm">
                  Siguiente
              </Link>
          ) : (
              <span className="px-4 py-2 border rounded bg-gray-100 text-gray-400 text-sm cursor-not-allowed">Siguiente</span>
          )}
        </div>
      </div>
    </div>
  );
}
