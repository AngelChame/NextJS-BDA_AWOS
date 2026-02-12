import { pool } from '@/app/lib/db';
import { QuerySchema } from '@/app/lib/validation';

export default async function Page({ searchParams }: { searchParams: any }) {
  const { page, search } = QuerySchema.parse(searchParams);
  const limit = 5;
  const offset = (page - 1) * limit;

  const res = await pool.query(
    `SELECT * FROM vw_students_at_risk WHERE alumno ILIKE $1 LIMIT $2 OFFSET $3`,
    [`%${search}%`, limit, offset]
  );

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-red-600 mb-6 uppercase">Alumnos en Riesgo</h1>
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-red-100">
          <form className="mb-6 flex gap-4">
            <input name="search" defaultValue={search} placeholder="Buscar..." className="flex-1 p-3 border rounded-xl" />
            <button className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold">Filtrar</button>
          </form>
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white">
              <tr><th className="p-4">Alumno</th><th className="p-4">Promedio</th><th className="p-4">Asistencia</th></tr>
            </thead>
            <tbody>
              {res.rows.map((r: any) => (
                <tr key={r.correo} className="border-b hover:bg-red-50">
                  <td className="p-4 font-bold">{r.alumno}</td>
                  <td className="p-4 text-red-600 font-mono">{r.promedio}</td>
                  <td className="p-4">{r.asistencia}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}