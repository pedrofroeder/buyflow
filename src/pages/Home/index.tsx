import { useEffect, useState, useContext } from "react";
import { getProducts, getCategories } from "../../services/api";
import { CartContext } from "../../contexts/CartContext";
import { Button } from "../../components/Button";
import { Link } from "react-router-dom";
import { BsCartPlus, BsSearch, BsX, BsFire, BsStar, BsTag } from "react-icons/bs";
import toast from "react-hot-toast";
import type { Product, Category } from "../../types";

export function Home() {
  const { addItemCart } = useContext(CartContext);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data.products);
        setFilteredProducts(data.products);
        setError("");
      } catch (err) {
        setError("Erro ao carregar produtos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    async function loadCategories() {
      try {
        const categories = await getCategories();
        setCategories(categories);
      } catch (err) {
        console.log(err);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory && selectedCategory !== "") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchTerm && searchTerm !== "") {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products]);

  function handleAddToCart(product: Product) {
    addItemCart(product);
    toast.success(`${product.title} adicionado ao carrinho!`);
  }

  const featuredProducts = products
    .filter(p => p.rating >= 4.5 && p.discountPercentage > 10)
    .slice(0, 3);

  const bestDeals = products
    .filter(p => p.discountPercentage > 15)
    .sort((a, b) => b.discountPercentage - a.discountPercentage)
    .slice(0, 4);

  const categoriesWithProducts = categories.filter(category => 
    products.some(product => product.category === category.slug)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Carregando produtos incríveis...</p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Encontre os Melhores Produtos
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8">
              Ofertas incríveis com os melhores preços. Aproveite!
            </p>
            
            <div className="relative max-w-2xl">
              <BsSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="O que você está procurando?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-xl text-gray-900 bg-white placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-xl"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <BsX size={24} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {featuredProducts.length > 0 && !searchTerm && !selectedCategory && (
          <section className="py-8 sm:py-12">
            <div className="flex items-center gap-3 mb-6">
              <BsStar className="text-yellow-500" size={28} />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Produtos em Destaque
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border-2 border-yellow-200"
                >
                  <div className="relative overflow-hidden">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </Link>
                    <span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <BsStar size={12} />
                      DESTAQUE
                    </span>
                    {product.discountPercentage > 0 && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                        -{product.discountPercentage.toFixed(0)}%
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem] text-lg">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-yellow-500 flex items-center gap-1 text-sm font-semibold">
                        ⭐ {product.rating}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{product.stock} disponíveis</span>
                    </div>
                    <p className="text-3xl font-bold text-green-600 mb-4">
                      R$ {product.price.toFixed(2)}
                    </p>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full flex items-center justify-center gap-2 py-3"
                    >
                      <BsCartPlus size={20} />
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {bestDeals.length > 0 && !searchTerm && !selectedCategory && (
          <section className="py-8 sm:py-12 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <BsFire className="text-red-500" size={28} />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Ofertas Imperdíveis
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestDeals.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </Link>
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-sm font-bold px-3 py-2 rounded-full shadow-lg">
                      -{product.discountPercentage.toFixed(0)}%
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                      {product.title}
                    </h3>
                    <p className="text-2xl font-bold text-green-600 mb-3">
                      R$ {product.price.toFixed(2)}
                    </p>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <BsCartPlus size={18} />
                      Adicionar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="py-8 sm:py-12 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <BsTag className="text-blue-600" size={28} />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {selectedCategory 
                ? categories.find(c => c.slug === selectedCategory)?.name || "Produtos" 
                : "Todos os Produtos"}
            </h2>
          </div>

          <div className="mb-6">
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por categoria:
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto min-w-[250px] px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition"
            >
              <option value="">Todas as categorias</option>
              {categoriesWithProducts.map((category) => (
                <option key={category.slug} value={category.slug} className="capitalize">
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">
              {searchTerm && (
                <span>
                  Resultados para "<strong>{searchTerm}</strong>" •{" "}
                </span>
              )}
              <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </Link>
                  {product.discountPercentage > 0 && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      -{product.discountPercentage.toFixed(0)}%
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[3rem] hover:text-blue-600 transition">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mb-2 capitalize">{product.category}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-yellow-500 text-sm">⭐</span>
                    <span className="text-sm text-gray-600 font-medium">{product.rating}</span>
                    <span className="text-gray-400 text-xs ml-auto">{product.stock} em estoque</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 mb-3">
                    R$ {product.price.toFixed(2)}
                  </p>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <BsCartPlus size={18} />
                    Adicionar
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600 text-lg mb-2">
                Nenhum produto encontrado
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Tente ajustar seus filtros ou buscar por outro termo
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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