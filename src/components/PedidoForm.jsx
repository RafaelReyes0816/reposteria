import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function PedidoForm() {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [personalizaciones, setPersonalizaciones] = useState([]);
  const [form, setForm] = useState({
    cliente_id: '',
    producto_id: '',
    personalizacion_id: '',
    cantidad: 1,
    fecha_entrega: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Cargar datos de clientes, productos y personalizaciones
  useEffect(() => {
    const fetchData = async () => {
      const { data: clientes } = await supabase.from('clientes').select('id, nombre');
      setClientes(clientes || []);
      const { data: productos } = await supabase.from('productos').select('id, nombre, precio_base');
      setProductos(productos || []);
      const { data: personalizaciones } = await supabase.from('personalizaciones').select('id, tipo, descripcion, costo_adicional');
      setPersonalizaciones(personalizaciones || []);
    };
    fetchData();
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
    try {
      // Buscar datos seleccionados
      const producto = productos.find(p => p.id === form.producto_id);
      const personalizacion = personalizaciones.find(p => p.id === form.personalizacion_id);
      const precio_base = producto ? Number(producto.precio_base) : 0;
      const costo_adicional = personalizacion ? Number(personalizacion.costo_adicional) : 0;
      const subtotal = (precio_base + costo_adicional) * Number(form.cantidad);
      // 1. Insertar en pedidos
      const { data: pedido, error: errorPedido } = await supabase.from('pedidos').insert([
        {
          cliente_id: form.cliente_id,
          fecha_entrega: form.fecha_entrega,
          total: subtotal,
        },
      ]).select('id');
      if (errorPedido) throw errorPedido;
      const pedido_id = pedido[0].id;
      // 2. Insertar en detalle_pedido
      const { error: errorDetalle } = await supabase.from('detalle_pedido').insert([
        {
          pedido_id,
          producto_id: form.producto_id,
          cantidad: Number(form.cantidad),
          personalizacion_id: form.personalizacion_id || null,
          subtotal,
        },
      ]);
      if (errorDetalle) throw errorDetalle;
      setSuccess(true);
      setForm({ cliente_id: '', producto_id: '', personalizacion_id: '', cantidad: 1, fecha_entrega: '' });
    } catch (err) {
      setError(err.message || 'Error al registrar el pedido');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold mb-2">Registrar nuevo pedido</h2>
      <div>
        <label className="block mb-1">Cliente</label>
        <select name="cliente_id" value={form.cliente_id} onChange={handleChange} required className="w-full border rounded px-2 py-1">
          <option value="">Selecciona un cliente</option>
          {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-1">Producto</label>
        <select name="producto_id" value={form.producto_id} onChange={handleChange} required className="w-full border rounded px-2 py-1">
          <option value="">Selecciona un producto</option>
          {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-1">Personalización (opcional)</label>
        <select name="personalizacion_id" value={form.personalizacion_id} onChange={handleChange} className="w-full border rounded px-2 py-1">
          <option value="">Sin personalización</option>
          {personalizaciones.map(p => <option key={p.id} value={p.id}>{p.tipo} - {p.descripcion}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-1">Cantidad</label>
        <input type="number" name="cantidad" value={form.cantidad} min="1" onChange={handleChange} required className="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block mb-1">Fecha de entrega</label>
        <input type="date" name="fecha_entrega" value={form.fecha_entrega} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrar pedido'}
      </button>
      {error && <p className="text-red-600">Error: {error}</p>}
      {success && <p className="text-green-600">¡Pedido registrado correctamente!</p>}
    </form>
  );
}
