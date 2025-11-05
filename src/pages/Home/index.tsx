import { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { getProducts, getCategories } from "../../services/api";
import { CartContext } from "../../contexts/CartContext";
import { ProductCard } from "../../components/ProductCard";
import { SearchBar } from "../../components/SearchBar";
import { Pagination } from "../../components/Pagination";
import { BsFire, BsStar, BsTag, BsFilter, BsXCircle } from "react-icons/bs";
import toast from "react-hot-toast";
import type { Product, Category } from "../../types";
import { PRODUCT_FILTERS } from "../../constants/products";

const ITEMS_PER_PAGE = 20;

export function Home() {
  const { addItemCart } = useContext(CartContext);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleAddToCart = useCallback(
    (product: Product) => {
      addItemCart(product);
      toast.success(`${product.title} adicionado ao carrinho!`, {
        duration: 3000,
        position: "top-center",
      });
    },
    [addItemCart]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("");
    setIsFilterOpen(false);
  }, []);

  const handleCategoryChange = useCallback((slug: string) => {
    setSelectedCategory(slug);
    setIsFilterOpen(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setLoading(true);
      setError("");
      try {
        const skip = (currentPage - 1) * ITEMS_PER_PAGE;
        const data = await getProducts(ITEMS_PER_PAGE, skip);

        if (isMounted) {
          setProducts(data.products);
          setTotalProducts(data.total);
        }
      } catch (err) {
        if (isMounted) {
          setError("Erro ao carregar produtos. Por favor, tente novamente.");
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
        const categoriesData = await getCategories();
        setCategories(categoriesData);
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
  const currentCategoryName = selectedCategory
    ? categories.find((c) => c.slug === selectedCategory)?.name || "Produtos"
    : "Todos os Produtos";

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

  const FilterSidebarContent = (
    <div className="p-4 lg:p-0">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        <BsFilter className="inline-block mr-2" size={18} /> Filtrar por
        Categoria
      </h3>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => handleCategoryChange("")}
            className={`w-full text-left py-2 px-3 rounded-lg transition text-sm ${
              !selectedCategory
                ? "bg-blue-600 text-white font-semibold shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Todas as categorias
          </button>
        </li>
        {categoriesWithProducts.map((category) => (
          <li key={category.slug}>
            <button
              onClick={() => handleCategoryChange(category.slug)}
              className={`w-full text-left py-2 px-3 rounded-lg transition text-sm ${
                selectedCategory === category.slug
                  ? "bg-blue-600 text-white font-semibold shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
      {hasFilters && (
        <button
          onClick={handleClearFilters}
          className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm font-medium"
        >
          <BsXCircle size={16} /> Limpar Filtros
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl mb-4 md:mb-0">
              <h1 className="text-3xl font-extrabold leading-tight">
                Marketplace Pro
              </h1>
              <p className="text-base text-blue-100">
                A melhor seleção de produtos para você.
              </p>
            </div>
            <div className="w-full md:w-96">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        {featuredProducts.length > 0 && !hasFilters && currentPage === 1 && (
          <section className="mb-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <BsStar className="text-yellow-500" size={28} />
              <h2 className="text-2xl font-extrabold text-gray-900">
                Produtos em Destaque
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
            <div className="sticky top-4 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              {FilterSidebarContent}
            </div>
          </aside>

          <div className="lg:col-span-9 xl:col-span-10">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <BsTag className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">
                  {currentCategoryName}
                </h2>
              </div>

              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm font-medium shadow-sm"
              >
                <BsFilter size={16} /> Filtros
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              {searchTerm && (
                <span>
                  Resultados para "<strong>{searchTerm}</strong>" •{" "}
                </span>
              )}
              <strong>{filteredProducts.length}</strong>{" "}
              {filteredProducts.length === 1
                ? "produto encontrado"
                : "produtos encontrados"}
              {hasFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-blue-600 hover:text-blue-800 transition ml-3 underline text-xs font-semibold"
                >
                  (Limpar tudo)
                </button>
              )}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 mt-4 bg-white rounded-xl border border-gray-200 shadow-md">
                <div className="text-6xl mb-4">🤷‍♂️</div>
                <p className="text-gray-700 text-xl font-semibold mb-2">
                  Nenhum resultado encontrado
                </p>
                <p className="text-gray-500 text-base mb-6">
                  Parece que não há produtos para os filtros selecionados.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-md font-semibold shadow-md"
                >
                  Limpar todos os filtros
                </button>
              </div>
            )}

            {!hasFilters && filteredProducts.length > 0 && totalPages > 1 && (
              <div className="mt-10 pt-6 border-t border-gray-200">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {bestDeals.length > 0 && !hasFilters && currentPage === 1 && (
              <section className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <BsFire className="text-red-500" size={28} />
                  <h2 className="text-2xl font-bold text-gray-900">
                    🔥 Ofertas para você
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
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
          </div>
        </div>
      </main>

      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 lg:hidden ${
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setIsFilterOpen(false)}
        ></div>
        <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 overflow-y-auto">
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Filtros</h3>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <BsXCircle size={24} />
            </button>
          </div>
          {FilterSidebarContent}
        </div>
      </div>
    </div>
  );
}
