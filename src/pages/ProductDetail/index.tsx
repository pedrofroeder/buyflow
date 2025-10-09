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
    async function loadProduct() {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getProductById(Number(id));
        setProduct(data);
        setSelectedImage(data.thumbnail); // Imagem inicial
        setError("");
      } catch (err) {
        setError("Erro ao carregar produto");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  function handleAddToCart() {
    if (product) {
      addItemCart(product);
      toast.success(`${product.title} adicionado ao carrinho!`);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium transition"
      >
        <BsArrowLeft size={20} />
        Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-96 object-contain"
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
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
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
              {product.category}
            </span>
            {product.brand && (
              <span className="text-gray-500 text-sm">
                Marca: <strong>{product.brand}</strong>
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.title}
          </h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-lg">⭐</span>
              <span className="font-semibold text-gray-900">
                {product.rating}
              </span>
              <span className="text-gray-500 text-sm">/5</span>
            </div>
            <div
              className={`text-sm font-medium ${
                product.stock > 10 ? "text-green-600" : "text-orange-600"
              }`}
            >
              {product.stock > 0
                ? `${product.stock} em estoque`
                : "Fora de estoque"}
            </div>
          </div>

          <div className="mb-6">
            {product.discountPercentage > 0 && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-400 line-through text-lg">
                  R${" "}
                  {(
                    product.price /
                    (1 - product.discountPercentage / 100)
                  ).toFixed(2)}
                </span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  -{product.discountPercentage.toFixed(0)}% OFF
                </span>
              </div>
            )}
            <p className="text-4xl font-bold text-green-600">
              R$ {product.price.toFixed(2)}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Sobre o produto
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-3 ${
              product.stock === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <BsCartPlus size={24} />
            {product.stock === 0
              ? "Produto indisponível"
              : "Adicionar ao carrinho"}
          </Button>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <ul className="space-y-2 text-sm text-gray-600">
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
      </div>
    </div>
  );
}
