const BASE_URL = "https://dummyjson.com";

export async function getProducts(limit = 20, skip = 0) {
  const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
  if (!response.ok) throw new Error("Erro ao buscar produtos");
  return response.json();
}

export async function getCategories() {
  const response = await fetch(`${BASE_URL}/products/categories`);
  if (!response.ok) throw new Error('Erro ao buscar categorias');
  return response.json();
}

export async function getProductById(id: number) {
  const response = await fetch(`${BASE_URL}/products/${id}`)
  if (!response.ok) throw new Error('Erro ao buscar produto');
  return response.json();
}