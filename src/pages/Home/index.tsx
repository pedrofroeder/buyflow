import { useEffect, useState, useContext, useMemo } from "react";
import { getProducts, getCategories } from "../../services/api";
import { CartContext } from "../../contexts/CartContext";
import { ProductCard } from "../../components/ProductCard";
import { SearchBar } from "../../components/SearchBar";
import { Pagination } from "../../components/Pagination";
import { BsFire, BsStar, BsTag } from "react-icons/bs";
import toast from "react-hot-toast";
import type { Product, Category } from "../../types";
import { PRODUCT_FILTERS } from "../../constants/products";

const ITEMS_PER_PAGE = 20;

export function Home() {
  const { addItemCart } = useContext(CartContext);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        const skip = (currentPage - 1) * ITEMS_PER_PAGE;
        const data = await getProducts(ITEMS_PER_PAGE, skip);

        if (isMounted) {
          setProducts(data.products);
          setTotalProducts(data.total);
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
  }, [currentPage]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const categories = await getCategories();
        setCategories(categories);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, searchTerm, products]);

  const featuredProducts = useMemo(
    () =>
      products
        .filter(
          (p) =>
            p.rating >= PRODUCT_FILTERS.MIN_RATING_FEATURED &&
            p.discountPercentage > PRODUCT_FILTERS.MIN_DISCOUNT_FEATURED
        )
        .slice(0, PRODUCT_FILTERS.MAX_FEATURED_PRODUCTS),
    [products]
  );

  const bestDeals = useMemo(
    () =>
      products
        .filter(
          (p) => p.discountPercentage > PRODUCT_FILTERS.MIN_DISCOUNT_DEALS
        )
        .sort((a, b) => b.discountPercentage - a.discountPercentage)
        .slice(0, PRODUCT_FILTERS.MAX_DEAL_PRODUCTS),
    [products]
  );

  const categoriesWithProducts = useMemo(
    () =>
      categories.filter((category) =>
        products.some((product) => product.category === category.slug)
      ),
    [categories, products]
  );

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const hasFilters = selectedCategory || searchTerm;

  function handleAddToCart(product: Product) {
    addItemCart(product);
    toast.success(`${product.title} adicionado ao carrinho!`);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
              Encontre os Melhores Produtos
            </h1>
            <p className="text-base sm:text-lg text-blue-100 mb-6">
              Ofertas incríveis com os melhores preços. Aproveite!
            </p>
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {featuredProducts.length > 0 && !hasFilters && currentPage === 1 && (
          <section className="py-6 sm:py-8 lg:py-10">
            <div className="flex items-center gap-2 mb-4">
              <BsStar className="text-yellow-500" size={24} />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Produtos em Destaque
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  variant="featured"
                />
              ))}
            </div>
          </section>
        )}

        {bestDeals.length > 0 && !hasFilters && currentPage === 1 && (
          <section className="py-6 sm:py-8 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <BsFire className="text-red-500" size={24} />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Ofertas Imperdíveis
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {bestDeals.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>
        )}

        <section className="py-6 sm:py-8 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <BsTag className="text-blue-600" size={24} />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {selectedCategory
                ? categories.find((c) => c.slug === selectedCategory)?.name ||
                  "Produtos"
                : "Todos os Produtos"}
            </h2>
          </div>

          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
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
                className="w-full sm:w-auto min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-sm font-medium shadow-sm"
              >
                <option value="">Todas as categorias</option>
                {categoriesWithProducts.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-gray-600 text-sm">
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
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
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

          {!hasFilters && filteredProducts.length > 0 && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </section>
      </div>
    </div>
  );
}
