import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export default function PagosForm() {
  const [pedidos, setPedidos] = useState([]);
  const [form, setForm] = useState({
    pedido_id: '',
    fecha_pago: '',
    metodo: '',
    monto: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPedidos = async () => {
      // Traer pedidos pendientes o entregados
      const { data } = await supabase
        .from('pedidos')
        .select('id, fecha_entrega, estado, total, clientes(nombre)')
        .in('estado', ['Pendiente', 'Entregado']);
      setPedidos(data || []);
    };
    fetchPedidos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    // Insertar pago
    const { error: errorPago } = await supabase.from('pagos').insert([
      {
        pedido_id: form.pedido_id,
        fecha_pago: form.fecha_pago || null,
        metodo: form.metodo,
        monto: Number(form.monto),
      },
    ]);
    // (Opcional) Actualizar estado del pedido a 'Entregado'
    await supabase.from('pedidos').update({ estado: 'Entregado' }).eq('id', form.pedido_id);
    setLoading(false);
    if (errorPago) {
      setError(errorPago.message);
    } else {
      setSuccess(true);
      setForm({ pedido_id: '', fecha_pago: '', metodo: '', monto: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-lg font-bold mb-2">Registrar pago</h2>
      <div>
        <label className="block mb-1">Pedido</label>
        <select name="pedido_id" value={form.pedido_id} onChange={handleChange} required className="w-full border rounded px-2 py-1">
          <option value="">Selecciona un pedido</option>
          {pedidos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.clientes?.nombre || 'Sin cliente'} | Entrega: {p.fecha_entrega} | Estado: {p.estado} | Total: ${p.total}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">Fecha de pago</label>
        <input type="date" name="fecha_pago" value={form.fecha_pago} onChange={handleChange} className="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block mb-1">Método</label>
        <input type="text" name="metodo" value={form.metodo} onChange={handleChange} required className="w-full border rounded px-2 py-1" placeholder="Efectivo, transferencia, etc." />
      </div>
      <div>
        <label className="block mb-1">Monto</label>
        <input type="number" name="monto" value={form.monto} onChange={handleChange} required min="0" step="0.01" className="w-full border rounded px-2 py-1" />
      </div>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrar pago'}
      </button>
      {error && <p className="text-red-600">Error: {error}</p>}
      {success && <p className="text-green-600">¡Pago registrado correctamente!</p>}
    </form>
  );
} 