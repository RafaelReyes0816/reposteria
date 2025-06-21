import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function PedidoForm() {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    cliente_id: '',
    producto_id: '',
    cantidad: 1,
    fecha_entrega: '',
  });
  const [personalizacion, setPersonalizacion] = useState({
    activa: false,
    tipo: '',
    descripcion: '',
    costo_adicional: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: clientesData } = await supabase.from('clientes').select('id, nombre');
      setClientes(clientesData || []);
      const { data: productosData } = await supabase.from('productos').select('id, nombre, precio_base');
      setProductos(productosData || []);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePersonalizacionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPersonalizacion((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const producto = productos.find((p) => p.id === form.producto_id);
      if (!producto) throw new Error('Debes seleccionar un producto.');

      let personalizacionId = null;
      let costoAdicional = 0;

      // 1. Si la personalización está activa, crearla y obtener su ID
      if (personalizacion.activa) {
        const { data: nuevaPersonalizacion, error: errorPers } = await supabase
          .from('personalizaciones')
          .insert([{
            tipo: personalizacion.tipo,
            descripcion: personalizacion.descripcion,
            costo_adicional: Number(personalizacion.costo_adicional),
          }])
          .select('id');
        
        if (errorPers) throw errorPers;
        personalizacionId = nuevaPersonalizacion[0].id;
        costoAdicional = Number(personalizacion.costo_adicional);
      }

      const precio_base = Number(producto.precio_base) || 0;
      const subtotal = (precio_base + costoAdicional) * Number(form.cantidad);

      // 2. Insertar en 'pedidos'
      const { data: pedido, error: errorPedido } = await supabase
        .from('pedidos')
        .insert([{
          cliente_id: form.cliente_id,
          fecha_entrega: form.fecha_entrega,
          total: subtotal,
        }])
        .select('id');

      if (errorPedido) throw errorPedido;
      const pedido_id = pedido[0].id;

      // 3. Insertar en 'detalle_pedido'
      const { error: errorDetalle } = await supabase.from('detalle_pedido').insert([{
        pedido_id,
        producto_id: form.producto_id,
        cantidad: Number(form.cantidad),
        personalizacion_id: personalizacionId,
        subtotal,
      }]);

      if (errorDetalle) throw errorDetalle;

      setSuccess(true);
      // Resetear formularios
      setForm({ cliente_id: '', producto_id: '', cantidad: 1, fecha_entrega: '' });
      setPersonalizacion({ activa: false, tipo: '', descripcion: '', costo_adicional: 0 });

    } catch (err) {
      setError(err.message || 'Error al registrar el pedido');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold mb-2">Registrar Nuevo Pedido</h2>
      <div>
        <label className="block mb-1">Cliente</label>
        <select name="cliente_id" value={form.cliente_id} onChange={handleChange} required className="w-full border rounded px-2 py-1">
          <option value="">Selecciona un cliente</option>
          {clientes.map((c) => (<option key={c.id} value={c.id}>{c.nombre}</option>))}
        </select>
      </div>
      <div>
        <label className="block mb-1">Producto</label>
        <select name="producto_id" value={form.producto_id} onChange={handleChange} required className="w-full border rounded px-2 py-1">
          <option value="">Selecciona un producto</option>
          {productos.map((p) => (<option key={p.id} value={p.id}>{p.nombre}</option>))}
        </select>
      </div>
      
      {/* Sección de Personalización Dinámica */}
      <div className="p-4 border rounded space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="activa"
            id="activa"
            checked={personalizacion.activa}
            onChange={handlePersonalizacionChange}
            className="h-4 w-4"
          />
          <label htmlFor="activa" className="ml-2 font-semibold">Añadir personalización</label>
        </div>

        {personalizacion.activa && (
          <>
            <div>
              <label className="block mb-1 text-sm">Tipo de Personalización</label>
              <input type="text" name="tipo" value={personalizacion.tipo} onChange={handlePersonalizacionChange} className="w-full border rounded px-2 py-1" placeholder="Ej: Decoración, Relleno"/>
            </div>
            <div>
              <label className="block mb-1 text-sm">Descripción</label>
              <textarea name="descripcion" value={personalizacion.descripcion} onChange={handlePersonalizacionChange} className="w-full border rounded px-2 py-1" placeholder="Ej: Mensaje 'Feliz Día'"/>
            </div>
            <div>
              <label className="block mb-1 text-sm">Costo Adicional (Bs)</label>
              <input type="number" name="costo_adicional" value={personalizacion.costo_adicional} onChange={handlePersonalizacionChange} min="0" step="0.01" className="w-full border rounded px-2 py-1"/>
            </div>
          </>
        )}
      </div>

      <div>
        <label className="block mb-1">Cantidad</label>
        <input type="number" name="cantidad" value={form.cantidad} min="1" onChange={handleChange} required className="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block mb-1">Fecha de Entrega</label>
        <input type="date" name="fecha_entrega" value={form.fecha_entrega} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrar Pedido'}
      </button>
      {error && <p className="text-red-600">Error: {error}</p>}
      {success && <p className="text-green-600">¡Pedido registrado correctamente!</p>}
    </form>
  );
}
