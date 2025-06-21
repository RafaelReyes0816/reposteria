import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export default function Reportes() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportes = async () => {
      setLoading(true);
      // Usar la vista actual: mes y total_ventas
      const { data, error } = await supabase.from('vista_ventas_mensuales').select('*');
      if (error) setError(error.message);
      setReportes(data || []);
      setLoading(false);
    };
    fetchReportes();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Reporte de ventas mensuales</h2>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      <table className="w-full border mt-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Mes</th>
            <th className="p-2 border">Total vendido</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((r, i) => (
            <tr key={i} className="text-center">
              <td className="border p-2">{r.mes}</td>
              <td className="border p-2">Bs {r.total_ventas}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {reportes.length === 0 && !loading && <p className="mt-4">No hay datos para mostrar.</p>}
    </div>
  );
}
