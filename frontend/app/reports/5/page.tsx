import Link from 'next/link';
import { getStudentRank } from '@/lib/services/reports';
import { SearchParamsSchema } from '@/lib/definitions';

export default async function StudentRanking({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const allowedPrograms = ['Software Engineering', 'Data Science', 'Cybersecurity'];
  // valida el parametro program
  const { program: queryProgram } = SearchParamsSchema.parse(params);

  const program = queryProgram && allowedPrograms.includes(queryProgram)
    ? queryProgram
    : allowedPrograms[0];

  // obtiene los datos
  const students = await getStudentRank(program);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto space-y-6 text-slate-800">

        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 rounded-full hover:bg-slate-100 transition-colors" title="Volver al Dashboard">
            {<h1>Dashboard</h1>}
          </Link>

        </div>
        <h1 className="text-3xl font-bold tracking-tight">Ranking Académico</h1>

        <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-lg w-fit">
          {allowedPrograms.map((p) => {
            const isActive = program === p;
            return (
              <Link
                key={p}
                href={`?program=${p}`}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${isActive
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                  }`}
              >
                {p}
              </Link>
            );
          })}
        </div>

        <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900 text-white uppercase font-medium">
              <tr>
                <th className="px-6 py-4 text-center w-24">Posición</th>
                <th className="px-6 py-4">Alumno</th>
                <th className="px-6 py-4 text-center">Promedio Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((row) => {
                let badgeColor = "bg-gray-100 text-gray-600";
                if (row.position === 1) badgeColor = "bg-yellow-100 text-yellow-800 border-yellow-200";
                if (row.position === 2) badgeColor = "bg-gray-200 text-gray-800 border-gray-300";
                if (row.position === 3) badgeColor = "bg-orange-100 text-orange-800 border-orange-200";

                return (
                  <tr key={row.student_name + row.position} className={`hover:bg-gray-50 transition-colors ${row.position <= 3 ? 'bg-slate-50/50' : ''}`}>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full border text-sm font-bold ${badgeColor}`}>
                        #{row.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{row.student_name}</td>
                    <td className="px-6 py-4 text-center text-lg font-mono text-slate-700">{row.final_avg}</td>
                  </tr>
                )
              })}
              {students.length === 0 && (
                <tr><td colSpan={3} className="p-8 text-center text-gray-500">Sin datos para este programa.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
