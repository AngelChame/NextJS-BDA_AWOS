import Link from 'next/link';
import { getGroupAttendance } from '@/lib/services/reports';
import { SearchParamsSchema } from '@/lib/definitions';

export default async function AttendanceReport({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const { page } = SearchParamsSchema.parse(params);

  // obtiene los datos
  const { data: groups, metadata } = await getGroupAttendance(page, 6); // Limita 6 como en el archivo original

  const currentPage = metadata.page;
  const totalPages = metadata.totalPages;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto space-y-6 text-slate-800">

        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 rounded-full hover:bg-slate-100 transition-colors" title="Volver al Dashboard">
            {<h1>Dashboard</h1>}
          </Link>

        </div>
        <h1 className="text-3xl font-bold tracking-tight">Asistencia por Grupo</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((row, i) => (
            <div key={i} className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-semibold text-lg text-gray-900 line-clamp-2">{row.course_name}</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">{row.term}</span>
              </div>
              <div className="pt-4 border-t flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Asistencia</p>
                  <p className={`text-3xl font-bold ${row.attendance_percentage < 80 ? 'text-red-500' : 'text-green-600'}`}>
                    {row.attendance_percentage}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Link
            href={`?page=${Math.max(1, currentPage - 1)}`}
            className={`px-4 py-2 border rounded bg-white text-sm ${currentPage <= 1 ? 'pointer-events-none opacity-50' : 'hover:bg-gray-50'}`}
          >
            Anterior
          </Link>
          <span className="px-4 py-2 text-sm font-medium self-center">
            Página {currentPage} de {totalPages || 1}
          </span>
          <Link
            href={`?page=${Math.min(totalPages, currentPage + 1)}`}
            className={`px-4 py-2 border rounded bg-white text-sm ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-gray-50'}`}
          >
            Siguiente
          </Link>
        </div>
      </div>
    </div>
  );
}
