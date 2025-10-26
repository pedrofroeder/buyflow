import { Link, useLocation } from "react-router-dom";
import { FiShoppingCart, FiMenu } from "react-icons/fi";
import { useContext, useState } from "react";
import { CartContext } from "../../contexts/CartContext";
import { colors } from "../../config/colors";
import logo from "../../assets/images/logo.png";

export function Header() {
  const { cart } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();

  const totalItems = cart.reduce((total, item) => total + item.amount, 0);

  const isRouteActive = (path: string) => location.pathname === path;

  const activeTextClass = colors.primary.text;
  const activeBorderClass = colors.primary.border;

  const inactiveText = 'text-gray-600 hover:text-gray-900';
  const inactiveHoverBg = 'hover:bg-gray-50';


  const navLinkClass = (path: string) => `
    font-semibold px-4 py-3 rounded-lg transition-all duration-200 relative
    flex items-center gap-1.5
    ${isRouteActive(path)
      ? `${activeTextClass} bg-gray-50 border-b-4 ${activeBorderClass}`
      : `${inactiveText} ${inactiveHoverBg} border-b-4 border-transparent`
    }
  `;

  const mobileLinkClass = (path: string) => `
    flex items-center gap-3 font-medium px-4 py-2 rounded-lg transition-all duration-200
    ${isRouteActive(path)
      ? `bg-gray-100 ${activeTextClass} border-l-4 ${activeBorderClass} font-bold`
      : `${inactiveText} hover:bg-gray-100`
    }
  `;


  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
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

        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={navLinkClass('/')}
          >
            Produtos
          </Link>

          <Link
            to="/cart"
            className={navLinkClass('/cart')}
          >
            <FiShoppingCart size={18} />
            <span>Carrinho</span>
            {totalItems > 0 && (
              <span
                className={`ml-1 ${colors.primary.bg.replace('bg-', 'bg-')} text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center`}
              >
                {totalItems}
              </span>
            )}
          </Link>
        </nav>

        <div className="flex md:hidden items-center">
          <Link to="/cart" className="relative mr-2 p-2 text-gray-600 hover:text-gray-900 transition">
            <FiShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center justify-center w-10 h-10 text-gray-700 ${colors.primary.text.replace('text-', 'hover:text-')} hover:bg-gray-100 rounded-lg transition`}
          >
            <FiMenu size={22} />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-inner">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/"
              className={mobileLinkClass('/')}
              onClick={() => setIsMenuOpen(false)}
            >
              Produtos
            </Link>

            <Link
              to="/cart"
              className={mobileLinkClass('/cart')}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center gap-2">
                 <FiShoppingCart size={18} /> <span>Carrinho</span>
              </div>
              {totalItems > 0 && (
                <span className="ml-auto bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
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