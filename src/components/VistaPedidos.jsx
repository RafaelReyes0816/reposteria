import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export default function VistaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('pedidos')
        .select('id, fecha_entrega, estado, total, clientes(nombre)')
        .eq('estado', 'Pendiente')
        .order('fecha_entrega', { ascending: true });
      if (error) setError(error.message);
      setPedidos(data || []);
      setLoading(false);
    };
    fetchPedidos();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Pedidos pendientes</h2>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      <table className="w-full border mt-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Cliente</th>
            <th className="p-2 border">Fecha de entrega</th>
            <th className="p-2 border">Estado</th>
            <th className="p-2 border">Total</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id} className="text-center">
              <td className="border p-2">{p.clientes?.nombre || 'Sin nombre'}</td>
              <td className="border p-2">{p.fecha_entrega}</td>
              <td className="border p-2">{p.estado}</td>
              <td className="border p-2">${p.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {pedidos.length === 0 && !loading && <p className="mt-4">No hay pedidos pendientes.</p>}
    </div>
  );
}
