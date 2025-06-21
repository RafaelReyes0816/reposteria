import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Reportes() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    const fetchReportes = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('vista_ventas_mensuales').select('*').order('mes', { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setReportes(data || []);
        // Establecer el mes más reciente como seleccionado por defecto
        if (data && data.length > 0) {
          setSelectedMonth(data[0].mes);
        }
      }
      setLoading(false);
    };
    fetchReportes();
  }, []);

  const handleDownloadPDF = async () => {
    if (!selectedMonth) {
      setError('Por favor, selecciona un mes para descargar el reporte.');
      return;
    }

    setDownloading(true);
    setError(null);

    // Calcular el primer y último día del mes seleccionado
    const [year, month] = selectedMonth.split('-');
    const startDate = `${year}-${month}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Último día del mes

    // Consulta detallada para el PDF filtrada por mes
    const { data, error } = await supabase
      .from('pedidos')
      .select('fecha_pedido, total, clientes(nombre), pagos(fecha_pago)')
      .eq('estado', 'Entregado')
      .gte('fecha_pedido', startDate)
      .lte('fecha_pedido', endDate)
      .order('fecha_pedido', { ascending: false });

    if (error) {
      setError(error.message);
      setDownloading(false);
      return;
    }

    const doc = new jsPDF();
    doc.text(`Reporte de Ventas Detallado - ${selectedMonth}`, 14, 15);

    const tableColumn = ["Cliente", "Fecha Pedido", "Total (Bs)", "Fecha Pago"];
    const tableRows = [];

    data.forEach(item => {
      const rowData = [
        item.clientes.nombre,
        new Date(item.fecha_pedido).toLocaleDateString(),
        item.total,
        item.pagos.length > 0 ? new Date(item.pagos[0].fecha_pago).toLocaleDateString() : 'Pendiente'
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    
    doc.save(`reporte_ventas_${selectedMonth}.pdf`);
    setDownloading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Reporte de Ventas Mensuales (Resumen)</h2>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600 mt-2">Error: {error}</p>}
      <table className="w-full border mt-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Mes</th>
            <th className="p-2 border">Total vendido (Bs)</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((r, i) => (
            <tr key={i} className="text-center">
              <td className="border p-2">{r.mes}</td>
              <td className="border p-2">{r.total_ventas}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {reportes.length === 0 && !loading && <p className="mt-4">No hay datos para mostrar.</p>}

      {/* Sección de descarga */}
      <div className="mt-8 p-4 border-t">
        <h3 className="text-lg font-bold mb-2">Descargar Reporte Detallado por Mes</h3>
        <p className="text-sm text-gray-600 mb-4">
          Selecciona un mes para obtener un listado de todos los pedidos entregados con los detalles del cliente y la fecha de pago.
        </p>
        <div className="flex items-center space-x-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Selecciona un mes</option>
            {reportes.map((r) => (
              <option key={r.mes} value={r.mes}>{r.mes}</option>
            ))}
          </select>
          <button
            onClick={handleDownloadPDF}
            className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={downloading || !selectedMonth}
          >
            {downloading ? 'Generando PDF...' : 'Descargar PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
