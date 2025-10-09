import { useEffect, useState, useContext, useMemo } from "react";
import { getProducts, getCategories } from "../../services/api";
import { CartContext } from "../../contexts/CartContext";
import { Button } from "../../components/Button";
import { Link } from "react-router-dom";
import {
  BsCartPlus,
  BsSearch,
  BsX,
  BsFire,
  BsStar,
  BsTag,
} from "react-icons/bs";
import toast from "react-hot-toast";
import type { Product, Category } from "../../types";

export function Home() {
  const { addItemCart } = useContext(CartContext);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        if (isMounted) {
          setProducts(data.products);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError("Erro ao carregar produtos");
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    async function loadCategories() {
      try {
        const categories = await getCategories();
        setCategories(categories);
      } catch (err) {
        console.log("Erro ao carregar categorias:", err);
      }
    }

    loadCategories();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, searchTerm, products]);

  function handleAddToCart(product: Product) {
    addItemCart(product);
    toast.success(`${product.title} adicionado ao carrinho!`);
  }

  const featuredProducts = useMemo(
    () =>
      products
        .filter((p) => p.rating >= 4.5 && p.discountPercentage > 10)
        .slice(0, 3),
    [products]
  );

  const bestDeals = useMemo(
    () =>
      products
        .filter((p) => p.discountPercentage > 15)
        .sort((a, b) => b.discountPercentage - a.discountPercentage)
        .slice(0, 4),
    [products]
  );

  const categoriesWithProducts = useMemo(
    () =>
      categories.filter((category) =>
        products.some((product) => product.category === category.slug)
      ),
    [categories, products]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">
            Carregando produtos incríveis...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center bg-red-50 rounded-xl p-8 max-w-md mx-4">
          <p className="text-red-600 text-xl font-semibold mb-4">❌ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 xl:py-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-4xl xl:text-4xl font-bold mb-3 leading-tight">
              Encontre os Melhores Produtos
            </h1>
            <p className="text-base sm:text-lg text-blue-100 mb-6">
              Ofertas incríveis com os melhores preços. Aproveite!
            </p>

            <div className="relative max-w-2xl">
              <BsSearch
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="O que você está procurando?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl text-gray-900 bg-white placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg text-base"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <BsX size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {featuredProducts.length > 0 && !searchTerm && !selectedCategory && (
          <section className="py-6 sm:py-8 lg:py-10">
            <div className="flex items-center gap-2 mb-4">
              <BsStar className="text-yellow-500" size={24} />
              <h2 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900">
                Produtos em Destaque
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-yellow-300"
                >
                  <div className="relative overflow-hidden">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-36 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                      <BsStar size={10} />
                      DESTAQUE
                    </span>
                    {product.discountPercentage > 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                        -{product.discountPercentage.toFixed(0)}%
                      </span>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem] text-sm">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-500 flex items-center gap-1 text-xs font-semibold">
                        ⭐ {product.rating}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-xs text-gray-600">
                        {product.stock} disponíveis
                      </span>
                    </div>
                    <p className="text-xl font-bold text-green-600 mb-2">
                      R$ {product.price.toFixed(2)}
                    </p>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 text-sm"
                    >
                      <BsCartPlus size={16} />
                      Adicionar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {bestDeals.length > 0 && !searchTerm && !selectedCategory && (
          <section className="py-6 sm:py-8 border-t border-gray-200 lg:py-10">
            <div className="flex items-center gap-2 mb-4">
              <BsFire className="text-red-500" size={24} />
              <h2 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900">
                Ofertas Imperdíveis
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {bestDeals.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                      -{product.discountPercentage.toFixed(0)}%
                    </span>
                  </div>

                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem] text-sm">
                      {product.title}
                    </h3>
                    <p className="text-xl font-bold text-green-600 mb-2">
                      R$ {product.price.toFixed(2)}
                    </p>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 text-sm"
                    >
                      <BsCartPlus size={16} />
                      Adicionar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="py-6 sm:py-8 border-t border-gray-200 lg:py-10">
          <div className="flex items-center gap-2 mb-4">
            <BsTag className="text-blue-600" size={24} />
            <h2 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900">
              {selectedCategory
                ? categories.find((c) => c.slug === selectedCategory)?.name ||
                  "Produtos"
                : "Todos os Produtos"}
            </h2>
          </div>

          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-shrink-0">
              <label
                htmlFor="category-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filtrar por categoria:
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 text-sm font-medium shadow-sm hover:border-gray-400 transition"
              >
                <option value="">Todas as categorias</option>
                {categoriesWithProducts.map((category) => (
                  <option
                    key={category.slug}
                    value={category.slug}
                    className="capitalize"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-gray-600 text-sm sm:text-right">
              {searchTerm && (
                <span>
                  Resultados para "<strong>{searchTerm}</strong>" •{" "}
                </span>
              )}
              <strong>{filteredProducts.length}</strong>{" "}
              {filteredProducts.length === 1
                ? "produto encontrado"
                : "produtos encontrados"}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-36 sm:h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  {product.discountPercentage > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{product.discountPercentage.toFixed(0)}%
                    </span>
                  )}
                </div>

                <div className="p-3">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem] text-sm hover:text-blue-600 transition">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500 mb-1 capitalize">
                    {product.category}
                  </p>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-500 text-xs">⭐</span>
                    <span className="text-xs text-gray-600 font-medium">
                      {product.rating}
                    </span>
                    <span className="text-gray-400 text-xs ml-auto">
                      {product.stock} em estoque
                    </span>
                  </div>
                  <p className="text-xl font-bold text-green-600 mb-2">
                    R$ {product.price.toFixed(2)}
                  </p>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-sm"
                  >
                    <BsCartPlus size={16} />
                    Adicionar
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-10 bg-gray-50 rounded-xl">
              <div className="text-5xl mb-3">🔍</div>
              <p className="text-gray-600 text-base mb-1">
                Nenhum produto encontrado
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Tente ajustar seus filtros ou buscar por outro termo
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
