import Link from 'next/link';

const menuItems = [
  { title: "Rendimiento", desc: "Promedios por curso y periodo", path: "/reports/performance", color: "bg-blue-500" },
  { title: "Carga Docente", desc: "Estadísticas por profesor", path: "/reports/teacher-load", color: "bg-purple-500" },
  { title: "Alumnos en Riesgo", desc: "Alertas de deserción y reprobación", path: "/reports/at-risk", color: "bg-red-500" },
  { title: "Asistencia", desc: "Reporte detallado por grupos", path: "/reports/attendance", color: "bg-green-500" },
  { title: "Ranking", desc: "Mejores promedios por carrera", path: "/reports/ranking", color: "bg-yellow-500" },
];

export default function Dashboard() {
  return (
    <main className="p-12 bg-slate-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black mb-2">Panel de Coordinación Académica</h1>
        <p className="text-slate-400 mb-12">Sistema de monitoreo de indicadores de rendimiento y asistencia.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div className="group bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-white/50 transition-all cursor-pointer">
                <div className={`${item.color} w-12 h-12 rounded-lg mb-4`} />
                <h2 className="text-xl font-bold mb-2 group-hover:underline">{item.title}</h2>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
} 