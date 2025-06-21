import { useState, useEffect } from 'react';
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

  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProductos = async () => {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('nombre', { ascending: true });
    if (!error) {
      setProductos(data);
    }
  };

  useEffect(() => {
    fetchProductos();
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
    if (!form.descripcion.trim()) {
      setError('El campo de descripción es obligatorio.');
      return;
    }
    if (!form.precio_base || form.precio_base <= 0) {
      setError('El precio base debe ser un número mayor que cero.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    // Limpiar espacios en blanco antes de enviar
    const trimmedForm = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio_base: Number(form.precio_base),
    };

    const { error } = await supabase.from('productos').insert([trimmedForm]);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setForm({ nombre: '', descripcion: '', precio_base: '' });
      fetchProductos(); // Recargar la lista de productos
    }
  };

  const filteredProductos = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Columna del formulario */}
      <div className="md:col-span-1">
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow space-y-4">
          <h2 className="text-lg font-bold mb-2">Agregar nuevo postre</h2>
          <div>
            <label className="block mb-1">Nombre</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block mb-1">Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block mb-1">Precio base</label>
            <input type="number" name="precio_base" value={form.precio_base} onChange={handleChange} required min="0.01" step="0.01" className="w-full border rounded px-2 py-1" />
          </div>
          <button type="submit" className="w-full bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={loading}>
            {loading ? 'Agregando...' : 'Agregar postre'}
          </button>
          {error && <p className="text-red-600 mt-2">Error: {error}</p>}
          {success && <p className="text-green-600 mt-2">¡Postre agregado correctamente!</p>}
        </form>
      </div>

      {/* Columna de la tabla de postres */}
      <div className="md:col-span-2">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-bold mb-4">Postres Registrados</h2>
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
                  <th className="p-2 border text-left">Descripción</th>
                  <th className="p-2 border text-left">Precio</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.map((producto) => (
                  <tr key={producto.id}>
                    <td className="p-2 border">{producto.nombre}</td>
                    <td className="p-2 border">{producto.descripcion}</td>
                    <td className="p-2 border">Bs {producto.precio_base}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProductos.length === 0 && (
              <p className="text-center mt-4">
                {searchTerm ? 'No se encontraron postres.' : 'No hay postres registrados.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
