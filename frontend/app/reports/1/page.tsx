import Link from 'next/link';
import { getCoursePerformance } from '@/lib/services/reports';
import { SearchParamsSchema } from '@/lib/definitions';

export default async function CoursePerformance({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  //establecer el periodo por defecto
  const queryTerm = params.query || '2025-1';

  //validar los parametros de la busqueda
  SearchParamsSchema.parse(params);

  //obtener los datos de la carga académica
  const courses = await getCoursePerformance(queryTerm);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto space-y-6 text-slate-800">

        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 rounded-full hover:bg-slate-100 transition-colors" title="Volver al Dashboard">
            {<h1>Dashboard</h1>}
          </Link>

        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Rendimiento por Curso</h1>

          <form className="flex gap-2 w-full md:w-auto">
            <input
              name="query"
              defaultValue={queryTerm}
              placeholder="Periodo (ej: 2025-1)"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              Filtrar
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-white shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Promedio General</h3>
            <div className="text-2xl font-bold mt-2">
              {courses.length > 0
                ? (courses.reduce((acc, r) => acc + r.general_average, 0) / courses.length).toFixed(2)
                : '-'}
            </div>
          </div>
        </div>

        <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase font-medium border-b">
              <tr>
                <th className="px-6 py-4">Curso</th>
                <th className="px-6 py-4">Programa</th>
                <th className="px-6 py-4 text-center">Promedio</th>
                <th className="px-6 py-4 text-center">Reprobados</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{row.course_name}</td>
                  <td className="px-6 py-4 text-gray-600">{row.program}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.general_average < 70 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                      {row.general_average}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-700">{row.failed_count}</td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Sin resultados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
