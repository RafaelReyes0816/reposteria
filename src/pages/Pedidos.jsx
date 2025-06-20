import VistaPedidos from '../components/VistaPedidos';

export default function Pedidos() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Pedidos Pendientes</h1>
      <VistaPedidos />
    </div>
  );
}
