export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  walletBalance: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  real_price: number;
  old_price?: number;
  category_id: string;
  stock_tag?: string;
  is_new: boolean;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_thumbnail: boolean;
  sort_order: number;
}

export interface Transaction {
  id: string;
  user_id: string;
  utr_number: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  trackingNumber?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

export interface AdminSettings {
  id: string;
  qr_code_url?: string;
  updated_by?: string;
  updated_at: string;
}
