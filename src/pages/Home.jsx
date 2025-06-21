import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';

function StatCard({ title, value, description }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg text-center">
      <h3 className="text-4xl font-bold text-pink-600">{value}</h3>
      <p className="text-lg font-semibold text-gray-700 mt-2">{title}</p>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  );
}

export default function Home() {
  const [stats, setStats] = useState({
    pedidosPendientes: 0,
    ingresosDelMes: 0,
    pedidosDelMes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

      // Ejecutar consultas en paralelo para mayor eficiencia
      const [pendientesResult, pedidosMesResult] = await Promise.all([
        supabase
          .from('pedidos')
          .select('*', { count: 'exact', head: true })
          .eq('estado', 'Pendiente'),
        supabase
          .from('pedidos')
          .select('total')
          .eq('estado', 'Entregado')
          .gte('fecha_pedido', firstDayOfMonth)
      ]);

      const pendientes = pendientesResult.count || 0;
      const pedidosMes = pedidosMesResult.data || [];
      const ingresos = pedidosMes.reduce((acc, p) => acc + p.total, 0);
      
      setStats({
        pedidosPendientes: pendientes,
        ingresosDelMes: ingresos,
        pedidosDelMes: pedidosMes.length,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative p-4"
      style={{
        backgroundImage: "url('/fondo.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-white/50" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-5xl font-extrabold mb-2 text-pink-700 drop-shadow-lg">
          Bienvenido a tu Repostería
        </h1>
        <p className="mb-8 text-lg text-gray-800">
          Un resumen del estado actual de tu negocio.
        </p>

        {/* Panel de Estadísticas */}
        {loading ? (
          <p>Cargando estadísticas...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-4xl">
            <StatCard title="Pedidos Pendientes" value={stats.pedidosPendientes} description="Pedidos esperando ser procesados." />
            <StatCard title="Ingresos del Mes" value={`Bs ${stats.ingresosDelMes.toFixed(2)}`} description="Total de ventas este mes." />
            <StatCard title="Pedidos del Mes" value={stats.pedidosDelMes} description="Total de pedidos este mes." />
          </div>
        )}

        <div className="space-x-4">
          <Link to="/pedidos" className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg shadow-md font-semibold transition-transform transform hover:scale-105">Ver Pedidos</Link>
          <Link to="/registrar-pedido" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md font-semibold transition-transform transform hover:scale-105">Nuevo Pedido</Link>
        </div>
      </div>
    </div>
  );
}
