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
  realPrice: number;
  oldPrice?: number;
  categoryId: string;
  stockTag?: string;
  isNew: boolean;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  isThumbnail: boolean;
  sortOrder: number;
}

export interface Transaction {
  id: string;
  userId: string;
  utrNumber: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  trackingNumber?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}
