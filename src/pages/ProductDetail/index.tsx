import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../../services/api";
import { CartContext } from "../../contexts/CartContext";
import { Button } from "../../components/Button";
import type { Product } from "../../types";
import { BsCartPlus, BsArrowLeft } from "react-icons/bs";
import toast from "react-hot-toast";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItemCart } = useContext(CartContext);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    async function loadProduct() {
      try {
        setLoading(true);
        const data = await getProductById(Number(id));

        if (isMounted) {
          setProduct(data);
          setSelectedImage(data.thumbnail);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError("Erro ao carregar produto");
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  function handleAddToCart() {
    if (product) {
      addItemCart(product);
      toast.success(`${product.title} adicionado ao carrinho!`, {
        duration: 3000,
        position: "top-center",
      });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold mb-4">
            ❌ {error || "Produto não encontrado"}
          </p>
          <Link to="/" className="text-blue-600 hover:underline font-semibold">
            Voltar para a home
          </Link>
        </div>
      </div>
    );
  }

  const originalPrice =
    product.discountPercentage > 0
      ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
      : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium transition text-sm sm:text-base"
      >
        <BsArrowLeft size={18} />
        Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:order-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
              {product.category}
            </span>
            {product.brand && (
              <span className="text-gray-500 text-xs sm:text-sm">
                Marca: <strong>{product.brand}</strong>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            {product.title}
          </h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-base">⭐</span>
              <span className="font-semibold text-gray-900 text-sm sm:text-base">
                {product.rating}
              </span>
              <span className="text-gray-500 text-xs sm:text-sm">/5</span>
            </div>
            <div
              className={`text-xs sm:text-sm font-medium ${
                product.stock > 10 ? "text-green-600" : "text-orange-600"
              }`}
            >
              {product.stock > 0
                ? `${product.stock} em estoque`
                : "Fora de estoque"}
            </div>
          </div>

          <div className="mb-4">
            {product.discountPercentage > 0 && originalPrice && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-400 line-through text-base">
                  R$ {originalPrice}
                </span>
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  -{product.discountPercentage.toFixed(0)}% OFF
                </span>
              </div>
            )}
            <p className="text-3xl sm:text-4xl font-bold text-green-600">
              R$ {product.price.toFixed(2)}
            </p>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-2.5 px-4 rounded-md font-semibold text-base transition-colors duration-200 flex items-center justify-center gap-2 ${
              product.stock === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <BsCartPlus size={20} />
            {product.stock === 0
              ? "Produto indisponível"
              : "Adicionar ao carrinho"}
          </Button>

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Sobre o produto
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Entrega rápida e segura
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Garantia de 30 dias
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Pagamento seguro
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:order-1">
          <div className="bg-white rounded-lg shadow-md p-3 mb-3">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full max-h-80 sm:max-h-96 object-contain"
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto justify-center">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`flex-shrink-0 border-2 rounded-lg overflow-hidden transition ${
                    selectedImage === image
                      ? "border-blue-600"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} - ${index + 1}`}
                    className="w-16 h-16 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
