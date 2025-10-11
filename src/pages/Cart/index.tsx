import { useContext, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import { BsTrash, BsArrowLeft, BsPlus, BsDash } from "react-icons/bs";
import { Button } from "../../components/Button";
import toast from "react-hot-toast";

export function Cart() {
  const { cart, removeItemCart, updateQuantity, clearCart, total } = useContext(CartContext);

  const shipping = 50.0;
  const discount = 0;

  const { subtotal, finalTotal } = useMemo(() => {
    const sub = total;
    const final = sub + shipping - discount;
    return { subtotal: sub, finalTotal: final };
  }, [total, shipping, discount]);

  const handleRemoveItem = useCallback(
    (id: number, title: string) => {
      toast.dismiss();

      setTimeout(() => {
        toast(
          (t) => (
            <div className="flex flex-col gap-3 min-w-[280px]">
              <div>
                <p className="font-semibold text-gray-900">
                  Remover do carrinho?
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Deseja remover "<strong>{title}</strong>"?
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    removeItemCart(id);
                    toast.dismiss(t.id);
                    toast.success("Produto removido!");
                  }}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium transition touchscreen:active:scale-95"
                >
                  Remover
                </button>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm font-medium transition touchscreen:active:scale-95"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ),
          {
            duration: Infinity,
            position: "top-center",
          }
        );
      }, 100);
    },
    [removeItemCart]
  );

  const handleClearCart = useCallback(() => {
    toast.dismiss();

    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <div>
            <p className="font-semibold text-gray-900">Limpar carrinho?</p>
            <p className="text-sm text-gray-600 mt-1">
              Todos os {cart.length} produtos serão removidos.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                clearCart();
                toast.dismiss(t.id);
                toast.success("Carrinho limpo!");
              }}
              className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium transition"
            >
              Limpar tudo
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm font-medium transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
        position: "top-center",
      }
    );
  }, [clearCart, cart.length]);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Seu carrinho está vazio
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Adicione produtos para continuar comprando!
          </p>
          <Link to="/">
            <Button className="inline-flex items-center gap-2 px-8 py-3">
              <BsArrowLeft size={18} />
              Ir para a loja
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mb-6 sm:mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <BsArrowLeft size={16} />
            <span className="text-sm font-medium">Voltar para loja</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                Meu Carrinho
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                {cart.length} {cart.length === 1 ? "produto" : "produtos"}
              </p>
            </div>

            <button
              onClick={handleClearCart}
              className="cursor-pointer self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
            >
              <BsTrash size={16} />
              Limpar carrinho
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8 space-y-3 sm:space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5"
              >
                <div className="flex gap-4">
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition text-sm sm:text-base line-clamp-2 mb-1">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-xs sm:text-sm text-gray-500 capitalize mb-2">
                        {item.category}
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-green-600">
                        R$ {item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 sm:mt-4 gap-3">
                      <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.amount - 1)
                          }
                          className="cursor-pointer p-2 sm:p-2.5 hover:bg-gray-100 transition rounded-l-lg"
                          aria-label="Diminuir quantidade"
                        >
                          <BsDash size={16} className="text-gray-700" />
                        </button>
                        <span className="font-semibold text-gray-900 min-w-[2.5rem] text-center text-sm sm:text-base">
                          {item.amount}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.amount + 1)
                          }
                          className="cursor-pointer p-2 sm:p-2.5 hover:bg-gray-100 transition rounded-r-lg"
                          aria-label="Aumentar quantidade"
                        >
                          <BsPlus size={16} className="text-gray-700" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4">
                        <p className="font-bold text-gray-900 text-sm sm:text-base whitespace-nowrap">
                          R$ {(item.price * item.amount).toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.id, item.title)}
                          className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 transition p-2 rounded-lg"
                          title="Remover produto"
                          aria-label="Remover produto"
                        >
                          <BsTrash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 lg:sticky lg:top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5 pb-4 border-b">
                Resumo do pedido
              </h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-gray-700">
                  <span className="text-sm sm:text-base">Subtotal</span>
                  <span className="font-semibold text-sm sm:text-base">
                    R$ {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="text-sm sm:text-base">Frete</span>
                  <span className="font-semibold text-sm sm:text-base">
                    R$ {shipping.toFixed(2)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm sm:text-base">Desconto</span>
                    <span className="font-semibold text-sm sm:text-base">
                      - R$ {discount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-green-600">
                    R$ {finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full py-3 text-base font-semibold">
                  Finalizar compra
                </Button>

                <Link to="/">
                  <Button
                    variant="secondary"
                    className="w-full flex items-center justify-center gap-2 py-3"
                  >
                    <BsArrowLeft size={16} />
                    Continuar comprando
                  </Button>
                </Link>
              </div>

              <div className="mt-5 pt-5 border-t">
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="text-green-500 text-xl">✓</span>
                  <p>
                    <strong className="text-gray-900">Compra segura</strong>
                    <br />
                    Seus dados estão protegidos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
