import Link from 'next/link';
import { getTeacherLoad } from '@/lib/services/reports';
import { SearchParamsSchema } from '@/lib/definitions';

export default async function TeacherLoad({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const { page } = SearchParamsSchema.parse(params); //valida la pagina

  //obtener los datos de la carga académica
  const { data: teachers, metadata } = await getTeacherLoad(page);

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
        <h1 className="text-3xl font-bold tracking-tight">Carga Académica</h1>

        <div className="max-w-6xl mx-auto space-y-6 text-slate-800">
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
              {teachers.map((row, i) => (
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
          {currentPage > 1 ? (
            <Link href={`?page=${currentPage - 1}`} className="px-4 py-2 border rounded hover:bg-gray-100 bg-white text-sm">
              Anterior
            </Link>
          ) : (
            <span className="px-4 py-2 border rounded bg-gray-100 text-gray-400 text-sm cursor-not-allowed">Anterior</span>
          )}
          <span className="px-4 py-2 text-sm font-medium self-center">Página {currentPage} de {totalPages || 1}</span>
          {currentPage < totalPages ? (
            <Link href={`?page=${currentPage + 1}`} className="px-4 py-2 border rounded hover:bg-gray-100 bg-white text-sm">
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
