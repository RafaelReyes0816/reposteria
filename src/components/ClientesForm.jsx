import { useState, useEffect } from 'react';
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

  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchClientes = async () => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nombre', { ascending: true });
    if (!error) {
      setClientes(data);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que todos los campos estén completos
    if (!form.nombre.trim()) {
      setError('El campo de nombre es obligatorio.');
      return;
    }
    if (!form.telefono.trim()) {
      setError('El campo de teléfono es obligatorio.');
      return;
    }
    if (!form.direccion.trim()) {
      setError('El campo de dirección es obligatorio.');
      return;
    }
    if (!form.correo.trim()) {
      setError('El campo de correo es obligatorio.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    // Limpiar espacios en blanco de todos los campos antes de enviar
    const trimmedForm = {
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      direccion: form.direccion.trim(),
      correo: form.correo.trim(),
    };

    const { error } = await supabase.from('clientes').insert([trimmedForm]);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setForm({ nombre: '', telefono: '', direccion: '', correo: '' });
      fetchClientes(); // Recargar la lista de clientes
    }
  };

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Columna del formulario */}
      <div className="md:col-span-1">
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow space-y-4">
          <h2 className="text-lg font-bold mb-2">Agregar nuevo cliente</h2>
          <div>
            <label className="block mb-1">Nombre</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block mb-1">Teléfono</label>
            <input type="text" name="telefono" value={form.telefono} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block mb-1">Dirección</label>
            <input type="text" name="direccion" value={form.direccion} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block mb-1">Correo</label>
            <input type="email" name="correo" value={form.correo} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={loading}>
            {loading ? 'Agregando...' : 'Agregar cliente'}
          </button>
          {error && <p className="text-red-600 mt-2">Error: {error}</p>}
          {success && <p className="text-green-600 mt-2">¡Cliente agregado correctamente!</p>}
        </form>
      </div>

      {/* Columna de la tabla de clientes */}
      <div className="md:col-span-2">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-bold mb-4">Clientes Registrados</h2>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="w-full border rounded px-2 py-1 mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-left">Nombre</th>
                  <th className="p-2 border text-left">Teléfono</th>
                  <th className="p-2 border text-left">Correo</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td className="p-2 border">{cliente.nombre}</td>
                    <td className="p-2 border">{cliente.telefono}</td>
                    <td className="p-2 border">{cliente.correo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredClientes.length === 0 && (
              <p className="text-center mt-4">
                {searchTerm ? 'No se encontraron clientes.' : 'No hay clientes registrados.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
