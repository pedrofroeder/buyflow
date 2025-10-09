export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  brand: string;
  thumbnail: string;
  rating: number;
  stock: number;
  images: string[];
}

export interface CartItem extends Product {
  amount: number;
}

export interface Category { 
  slug: string;
  name: string;
  url: string;
}