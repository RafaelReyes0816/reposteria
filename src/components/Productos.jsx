import { useState } from 'react';
import { supabase } from '../services/supabase';

export default function Productos() {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio_base: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const { error } = await supabase.from('productos').insert([
      {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio_base: Number(form.precio_base),
      },
    ]);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setForm({ nombre: '', descripcion: '', precio_base: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-4 mb-8">
      <h2 className="text-lg font-bold mb-2">Agregar postre</h2>
      <div>
        <label className="block mb-1">Nombre</label>
        <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block mb-1">Descripción</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block mb-1">Precio base</label>
        <input type="number" name="precio_base" value={form.precio_base} onChange={handleChange} required min="0" step="0.01" className="w-full border rounded px-2 py-1" />
      </div>
      <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={loading}>
        {loading ? 'Agregando...' : 'Agregar postre'}
      </button>
      {error && <p className="text-red-600">Error: {error}</p>}
      {success && <p className="text-green-600">¡Postre agregado correctamente!</p>}
    </form>
  );
}
