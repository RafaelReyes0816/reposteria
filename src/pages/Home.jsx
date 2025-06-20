import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: "url('/pexels-roman-odintsov-5947686.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay para oscurecer la imagen y mejorar la legibilidad */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-4 text-pink-700 drop-shadow-lg text-center">
          Sistema de Gestión de Repostería
        </h1>
        <p className="mb-8 text-lg text-gray-700 text-center max-w-xl">
          Bienvenido/a al sistema de gestión de pedidos personalizados de repostería.<br />
          Administra clientes, productos, pedidos, pagos y reportes de ventas de manera fácil y eficiente.<br />
          ¡Optimiza tu negocio y brinda la mejor experiencia a tus clientes!
        </p>
        <div className="space-x-4">
          <Link to="/pedidos" className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded shadow font-semibold">Pedidos</Link>
          <Link to="/reportes" className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded shadow font-semibold">Reportes</Link>
        </div>
      </div>
    </div>
  );
}
