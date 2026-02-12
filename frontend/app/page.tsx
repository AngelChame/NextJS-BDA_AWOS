import Link from 'next/link';
import { getSystemReports } from '@/lib/services/reports';

export default async function Home() {
  const reports = await getSystemReports();

  return (
    <main className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Sistema de Reportes Académicos
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {reports.map((report) => (
          <Link key={report.id} href={`/reports/${report.id}`}>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
              <h2 className="text-xl font-semibold text-blue-600 mb-2">{report.name}</h2>
              <p className="text-sm text-gray-500">Vista: {report.view}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}