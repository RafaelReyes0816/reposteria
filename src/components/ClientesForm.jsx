import { useState } from 'react';
import { supabase } from '../services/supabase';

export default function ClientesForm() {
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    correo: '',
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
    const { error } = await supabase.from('clientes').insert([
      {
        nombre: form.nombre,
        telefono: form.telefono,
        direccion: form.direccion,
        correo: form.correo,
      },
    ]);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setForm({ nombre: '', telefono: '', direccion: '', correo: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-4 mb-8">
      <h2 className="text-lg font-bold mb-2">Agregar cliente</h2>
      <div>
        <label className="block mb-1">Nombre</label>
        <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block mb-1">Teléfono</label>
        <input type="text" name="telefono" value={form.telefono} onChange={handleChange} className="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block mb-1">Dirección</label>
        <input type="text" name="direccion" value={form.direccion} onChange={handleChange} className="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block mb-1">Correo</label>
        <input type="email" name="correo" value={form.correo} onChange={handleChange} className="w-full border rounded px-2 py-1" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={loading}>
        {loading ? 'Agregando...' : 'Agregar cliente'}
      </button>
      {error && <p className="text-red-600">Error: {error}</p>}
      {success && <p className="text-green-600">¡Cliente agregado correctamente!</p>}
    </form>
  );
}
