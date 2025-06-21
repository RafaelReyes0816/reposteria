import { NavLink, Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow mb-8 sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link to="/" className="font-bold text-xl text-pink-600 hover:text-pink-700 transition">
          Repostería
        </Link>
        <div className="space-x-2 flex items-center flex-wrap">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-pink-100 transition ${isActive ? 'bg-pink-200 text-pink-700 font-semibold' : 'text-gray-700'}`
            }
            end
          >
            Inicio
          </NavLink>
          <NavLink
            to="/clientes"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-blue-100 transition ${isActive ? 'bg-blue-200 text-blue-700 font-semibold' : 'text-gray-700'}`
            }
          >
            Clientes
          </NavLink>
          <NavLink
            to="/productos"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-yellow-100 transition ${isActive ? 'bg-yellow-200 text-yellow-700 font-semibold' : 'text-gray-700'}`
            }
          >
            Postres
          </NavLink>
          <NavLink
            to="/registrar-pedido"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-pink-100 transition ${isActive ? 'bg-pink-200 text-pink-700 font-semibold' : 'text-gray-700'}`
            }
          >
            Registrar pedido
          </NavLink>
          <NavLink
            to="/pedidos"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-green-100 transition ${isActive ? 'bg-green-200 text-green-700 font-semibold' : 'text-gray-700'}`
            }
          >
            Pedidos
          </NavLink>
          <NavLink
            to="/pagos"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-lime-100 transition ${isActive ? 'bg-lime-200 text-lime-700 font-semibold' : 'text-gray-700'}`
            }
          >
            Pagos
          </NavLink>
          <NavLink
            to="/reportes"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-gray-100 transition ${isActive ? 'bg-gray-200 text-gray-700 font-semibold' : 'text-gray-700'}`
            }
          >
            Reportes
          </NavLink>
        </div>
      </nav>
    </header>
  );
} 