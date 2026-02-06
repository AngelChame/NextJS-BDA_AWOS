import { query } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function StudentRanking({ searchParams }: { searchParams: { program?: string } }) {
  // Whitelist de programas permitidos (Seguridad real)
  const allowedPrograms = ['Software Engineering', 'Data Science', 'Cybersecurity'];
  const program = searchParams.program || 'Software Engineering';

  if (!allowedPrograms.includes(program)) {
    return <div className="p-8 text-red-600">Programa no válido.</div>;
  }

  const data = await query(
    `SELECT * FROM vw_rank_students WHERE program = $1 ORDER BY position ASC`,
    [program]
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Ranking Académico</h1>
      
      {/* Selector con Whitelist */}
      <div className="mb-6 flex gap-2">
        {allowedPrograms.map((p) => (
          <a 
            key={p} 
            href={`?program=${p}`} 
            className={`px-4 py-2 rounded ${program === p ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {p}
          </a>
        ))}
      </div>

      <table className="w-full border">
        <thead className="bg-blue-900 text-white">
          <tr>
            <th className="p-3 text-center">Posición</th>
            <th className="p-3 text-left">Alumno</th>
            <th className="p-3 text-center">Promedio Final</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row: any, i: number) => (
            <tr key={i} className={i < 3 ? "bg-yellow-50 font-bold" : ""}>
              <td className="p-3 text-center text-xl">#{row.position}</td>
              <td className="p-3">{row.student_name}</td>
              <td className="p-3 text-center">{row.final_avg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}