import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <CartProvider>
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </CartProvider>
    </>
  );
}

export default App;
