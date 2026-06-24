export interface ProductSpecs {
  processor?: string;
  ram?: string;
  storage?: string;
  gpu?: string;
  screen?: string;
  weight?: string;
  battery?: string;
  os?: string;
  warranty?: string;
}

export interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: 'Laptops' | 'Monitors' | 'Accessories' | 'Gaming' | 'Tablets' | 'Desktops';
  subCategory: string; // e.g. Legion, ThinkPad, Yoga, LOQ, IdeaPad, Keyboards, Mice, Audio, Power, Bags, Office, Gaming-Monitor
  price: number; // in PKR
  originalPrice: number; // in PKR (for showing discounts)
  discount: number; // e.g. 10 for 10%
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  highlights: string[];
  specs: ProductSpecs;
  stock: number;
  customisable: boolean;
  featured?: boolean;
}

export interface CartItem {
  id: string; // unique cart item id (product.id + configured ram + configured storage)
  product: Product;
  quantity: number;
  configuredRam?: string;
  configuredStorage?: string;
  configuredPrice: number;
}

export interface ShippingDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingDetails: ShippingDetails;
  paymentMethod: 'Cash on Delivery' | 'Bank Transfer' | 'Card Payment';
  total: number;
  status: 'Order Placed' | 'Processing' | 'In Transit' | 'Delivered';
  date: string;
  trackingNumber: string;
}

export interface FilterState {
  category: string;
  subCategory: string[];
  processors: string[];
  ram: string[];
  storage: string[];
  gpus: string[];
  minPrice: number;
  maxPrice: number;
  searchQuery: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
}
