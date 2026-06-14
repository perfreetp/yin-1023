export interface Stall {
  id: string;
  name: string;
  ownerName: string;
  category: string;
  coverImage: string;
  address: string;
  distance: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  isFavorite: boolean;
  isVip: boolean;
  tags: string[];
  businessHours: string;
  queueCount: number;
  bookingCount: number;
  location: {
    lat: number;
    lng: number;
  };
  nearbyStalls?: string[];
}

export interface Product {
  id: string;
  stallId: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  unit: string;
  stock: number;
  maxStock: number;
  isLimited: boolean;
  isPreorder: boolean;
  description?: string;
  tags?: string[];
}

export interface Booking {
  id: string;
  stallId: string;
  stallName: string;
  products: BookingProduct[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  pickupCode: string;
  createdAt: string;
  pickupDate: string;
  note?: string;
  vendorNote?: string;
  estimatedReadyTime?: string;
  completedAt?: string;
  isGroupBuy: boolean;
  groupBuyId?: string;
}

export interface BookingProduct {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  note?: string;
}

export interface GroupBuy {
  id: string;
  stallId: string;
  stallName: string;
  initiatorId: string;
  initiatorName: string;
  members: GroupBuyMember[];
  products: BookingProduct[];
  totalPrice: number;
  minMembers: number;
  maxMembers: number;
  deadline: string;
  status: 'joining' | 'settled' | 'completed';
  shareDiscount: number;
}

export interface GroupBuyMember {
  userId: string;
  userName: string;
  avatar: string;
  share: number;
  products: BookingProduct[];
}

export interface QueueItem {
  id: string;
  stallId: string;
  stallName: string;
  number: number;
  currentNumber: number;
  aheadCount: number;
  status: 'waiting' | 'calling' | 'serving' | 'completed' | 'cancelled';
  estimatedTime: string;
  createdAt: string;
  products?: BookingProduct[];
}

export interface Review {
  id: string;
  stallId: string;
  userId: string;
  userName: string;
  avatar: string;
  rating: number;
  content: string;
  images?: string[];
  reply?: string;
  createdAt: string;
  tags: string[];
}

export interface CartItem {
  productId: string;
  stallId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  note?: string;
  isPreorder: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  isVip: boolean;
  vipLevel: number;
  favoriteStalls: string[];
  tastePreferences: string[];
  totalOrders: number;
  reviewCount: number;
}

export interface VendorDashboard {
  stallId: string;
  todayRevenue: number;
  todayOrders: number;
  pendingBookings: number;
  queueLength: number;
  stockWarning: number;
  reviewsPending: number;
}
