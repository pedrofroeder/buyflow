import { Link } from "react-router-dom";
import { FiShoppingCart, FiMenu } from "react-icons/fi";
import { useContext, useState } from "react";
import { CartContext } from "../../contexts/CartContext";
import { colors } from "../../config/colors";
import logo from "../../assets/images/logo.png";

export function Header() {
  const { cart } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalItems = cart.reduce((total, item) => total + item.amount, 0);

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition flex-shrink-0"
        >
          <img
            src={logo}
            alt="BuyFlow Logo"
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
          />
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              Buy<span className={colors.primary.text}>flow</span>
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              Sua loja online completa
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-gray-700 ${colors.primary.text.replace('text-', 'hover:text-')} transition font-medium px-3 py-2 rounded-lg hover:bg-gray-50`}
          >
            Produtos
          </Link>

          <Link
            to="/cart"
            className={`relative flex items-center gap-2 ${colors.primary.bg} ${colors.primary.hover} text-white px-4 py-2 rounded-lg transition shadow-sm`}
          >
            <FiShoppingCart size={20} />
            <span className="text-sm font-semibold">Carrinho</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>

        <div className="flex md:hidden items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center justify-center w-10 h-10 text-gray-700 ${colors.primary.text.replace('text-', 'hover:text-')} hover:bg-gray-50 rounded-lg transition`}
          >
            <FiMenu size={20} />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-slideDown">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/"
              className={`flex items-center gap-3 text-gray-700 ${colors.primary.text.replace('text-', 'hover:text-')} transition font-medium px-3 py-2 rounded-lg hover:bg-gray-50`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Produtos</span>
            </Link>
            
            <Link
              to="/cart"
              className={`flex items-center gap-3 text-gray-700 ${colors.primary.text.replace('text-', 'hover:text-')} transition font-medium px-3 py-2 rounded-lg hover:bg-gray-50`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Carrinho</span>
              {totalItems > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}