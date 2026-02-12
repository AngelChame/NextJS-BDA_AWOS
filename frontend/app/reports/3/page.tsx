import Link from 'next/link';
import { getStudentsAtRisk } from '@/lib/services/reports';
import { SearchParamsSchema } from '@/lib/definitions';
export default async function StudentsAtRisk({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  //validar los parametros de la busqueda
  const { query, page } = SearchParamsSchema.parse(params);

  //obtener los datos de los alumnos en riesgo
  const { data: students, metadata } = await getStudentsAtRisk(page, query);

  const q = query || '';
  const currentPage = metadata.page;
  const totalPages = metadata.totalPages;

  const getPageUrl = (newPage: number) => {
    const urlParams = new URLSearchParams();
    if (q) urlParams.set('query', q);
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
          <h1 className="text-3xl font-bold tracking-tight">Alumnos en Riesgo</h1>

          <form className="flex gap-2 w-full md:w-auto">
            <input
              name="query"
              defaultValue={q}
              placeholder="Buscar alumno..."
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">Buscar</button>
          </form>
        </div>

        <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-medium border-b">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-center">Promedio</th>
                <th className="px-6 py-4 text-center">Asistencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{row.name}</td>
                  <td className="px-6 py-4 text-gray-500">{row.email}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-700">{row.avg_grade}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${row.attendance_rate < 0.8 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {(row.attendance_rate * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">No se encontraron resultados.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          {currentPage > 1 ? (
            <Link href={getPageUrl(currentPage - 1)} className="px-4 py-2 border rounded hover:bg-gray-50 bg-white text-sm">
              Anterior
            </Link>
          ) : (
            <span className="px-4 py-2 border rounded bg-gray-50 text-gray-300 text-sm cursor-not-allowed">Anterior</span>
          )}
          <span className="px-4 py-2 text-sm font-medium self-center">Página {currentPage} de {totalPages || 1}</span>
          {currentPage < totalPages ? (
            <Link href={getPageUrl(currentPage + 1)} className="px-4 py-2 border rounded hover:bg-gray-50 bg-white text-sm">
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
