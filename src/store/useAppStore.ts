import { create } from 'zustand';
import type { CartItem, UserProfile, Stall } from '@/types';

interface AppState {
  cart: CartItem[];
  user: UserProfile;
  currentStall: Stall | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  updateCartItemNote: (productId: string, note: string) => void;
  clearCart: () => void;
  toggleFavorite: (stallId: string) => void;
  setCurrentStall: (stall: Stall | null) => void;
}

const initialUser: UserProfile = {
  id: 'u001',
  name: '老街坊阿明',
  avatar: 'https://picsum.photos/id/64/200/200',
  phone: '138****8888',
  isVip: true,
  vipLevel: 3,
  favoriteStalls: ['s001', 's003'],
  tastePreferences: ['微辣', '少糖', '多加葱'],
  totalOrders: 128,
  reviewCount: 45
};

export const useAppStore = create<AppState>((set, get) => ({
  cart: [
    {
      productId: 'p001',
      stallId: 's001',
      name: '手工鲜肉大包',
      image: 'https://picsum.photos/id/292/300/300',
      price: 3.5,
      quantity: 4,
      isPreorder: true,
      note: '明天早上来取'
    },
    {
      productId: 'p005',
      stallId: 's001',
      name: '现磨豆浆',
      image: 'https://picsum.photos/id/431/300/300',
      price: 2,
      quantity: 2,
      isPreorder: true,
      note: '少糖'
    }
  ],
  user: initialUser,
  currentStall: null,

  addToCart: (item) => {
    const { cart } = get();
    const existingIndex = cart.findIndex((i) => i.productId === item.productId);
    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += item.quantity;
      set({ cart: newCart });
    } else {
      set({ cart: [...cart, item] });
    }
  },

  removeFromCart: (productId) => {
    set({ cart: get().cart.filter((i) => i.productId !== productId) });
  },

  updateCartQuantity: (productId, quantity) => {
    const { cart } = get();
    const newCart = cart.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    set({ cart: newCart });
  },

  updateCartItemNote: (productId, note) => {
    const { cart } = get();
    const newCart = cart.map((item) =>
      item.productId === productId ? { ...item, note } : item
    );
    set({ cart: newCart });
  },

  clearCart: () => set({ cart: [] }),

  toggleFavorite: (stallId) => {
    const { user } = get();
    const favorites = user.favoriteStalls.includes(stallId)
      ? user.favoriteStalls.filter((id) => id !== stallId)
      : [...user.favoriteStalls, stallId];
    set({ user: { ...user, favoriteStalls: favorites } });
  },

  setCurrentStall: (stall) => set({ currentStall: stall })
}));
