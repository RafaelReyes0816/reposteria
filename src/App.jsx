import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import ProductosPage from './pages/Productos';
import RegistrarPedido from './pages/RegistrarPedido';
import Pedidos from './pages/Pedidos';
import Reportes from './pages/Reportes';
import Pagos from './pages/Pagos';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import './App.css'

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <main className="min-h-[80vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/registrar-pedido" element={<RegistrarPedido />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/pagos" element={<Pagos />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
