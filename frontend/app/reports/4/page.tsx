import { query } from '@/lib/db';

export default async function AttendanceReport() {
  const data = await query(`SELECT * FROM vw_attendance_by_group`);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Asistencia Promedio por Grupo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {data.rows.map((row: any, i: number) => (
          <div key={i} className="p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="font-bold text-lg">{row.course_name}</h2>
            <p className="text-sm text-gray-500">Periodo: {row.term}</p>
            <div className="mt-2 text-2xl font-bold text-blue-600">
              {row.attendance_percentage}% <span className="text-sm text-gray-400 font-normal">de asistencia</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}