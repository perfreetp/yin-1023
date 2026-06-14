import { create } from 'zustand';
import type {
  CartItem, UserProfile, Stall, Booking, GroupBuy,
  QueueItem as QueueItemType, Product
} from '@/types';
import { mockBookings } from '@/data/bookings';
import { mockGroupBuys } from '@/data/queue';
import { mockQueue } from '@/data/queue';
import { mockProducts } from '@/data/products';
import { generatePickupCode } from '@/utils';

interface AppState {
  cart: CartItem[];
  user: UserProfile;
  currentStall: Stall | null;
  bookings: Booking[];
  groupBuys: GroupBuy[];
  queueItems: QueueItemType[];
  vendorProducts: Product[];
  navigateStallId: string | null;
  bookingActiveTab: string | null;

  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  updateCartItemNote: (productId: string, note: string) => void;
  clearCart: () => void;
  toggleFavorite: (stallId: string) => void;
  setCurrentStall: (stall: Stall | null) => void;

  createBooking: (stallId: string, stallName: string, products: CartItem[], note: string, pickupDate: string) => string;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  cancelBooking: (bookingId: string) => void;

  joinGroupBuy: (groupBuyId: string) => void;
  settleGroupBuy: (groupBuyId: string) => void;

  takeQueueNumber: (stallId: string, stallName: string, currentNumber: number) => string;
  cancelQueue: (queueId: string) => void;
  setNavigateStallId: (stallId: string | null) => void;
  setBookingActiveTab: (tab: string | null) => void;

  addVendorProduct: (name: string, price: number, stock: number, unit: string) => void;
  updateVendorProductStock: (productId: string, stock: number) => void;
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

let bookingCounter = 100;
let queueCounter = 100;
let productCounter = 100;

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
  bookings: [...mockBookings],
  groupBuys: [...mockGroupBuys],
  queueItems: [...mockQueue],
  vendorProducts: [...mockProducts],
  navigateStallId: null,
  bookingActiveTab: null,

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

  setCurrentStall: (stall) => set({ currentStall: stall }),

  createBooking: (stallId, stallName, products, note, pickupDate) => {
    const bookingId = `b${String(++bookingCounter).padStart(3, '0')}`;
    const pickupCode = generatePickupCode();
    const now = new Date();
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const booking: Booking = {
      id: bookingId,
      stallId,
      stallName,
      products: products.map((p) => ({
        productId: p.productId,
        name: p.name,
        image: p.image,
        price: p.price,
        quantity: p.quantity,
        note: p.note
      })),
      totalPrice,
      status: 'pending',
      pickupCode,
      createdAt,
      pickupDate,
      note: note || undefined,
      isGroupBuy: false
    };
    set({ bookings: [booking, ...get().bookings], cart: [] });
    return bookingId;
  },

  updateBookingStatus: (bookingId, status) => {
    const { bookings } = get();
    set({
      bookings: bookings.map((b) =>
        b.id === bookingId ? { ...b, status } : b
      )
    });
  },

  cancelBooking: (bookingId) => {
    const { bookings } = get();
    set({
      bookings: bookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
      )
    });
  },

  joinGroupBuy: (groupBuyId) => {
    const { groupBuys, user } = get();
    const gb = groupBuys.find((g) => g.id === groupBuyId);
    if (!gb) return;
    if (gb.members.some((m) => m.userId === user.id)) return;
    if (gb.members.length >= gb.maxMembers) return;
    const newMember = {
      userId: user.id,
      userName: user.name,
      avatar: user.avatar,
      share: 0,
      products: []
    };
    const updatedGroupBuys = groupBuys.map((g) =>
      g.id === groupBuyId
        ? { ...g, members: [...g.members, newMember] }
        : g
    );
    set({ groupBuys: updatedGroupBuys });
  },

  settleGroupBuy: (groupBuyId) => {
    const { groupBuys } = get();
    const updatedGroupBuys = groupBuys.map((g) => {
      if (g.id !== groupBuyId) return g;
      const discount = g.shareDiscount;
      const totalAfterDiscount = g.totalPrice * discount;
      const memberCount = g.members.length;
      const baseShare = Math.floor((totalAfterDiscount / memberCount) * 100) / 100;
      const remainder = Math.round((totalAfterDiscount - baseShare * memberCount) * 100) / 100;
      const updatedMembers = g.members.map((m, idx) => ({
        ...m,
        share: idx === 0 ? Math.round((baseShare + remainder) * 100) / 100 : baseShare
      }));
      return { ...g, status: 'settled' as const, members: updatedMembers };
    });
    set({ groupBuys: updatedGroupBuys });
  },

  takeQueueNumber: (stallId, stallName, currentNumber) => {
    const queueId = `q${String(++queueCounter).padStart(3, '0')}`;
    const number = currentNumber + 1;
    const now = new Date();
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const aheadCount = number - currentNumber;
    const estimatedMin = aheadCount * 3;
    const newItem: QueueItemType = {
      id: queueId,
      stallId,
      stallName,
      number,
      currentNumber,
      aheadCount,
      status: 'waiting',
      estimatedTime: `约${estimatedMin}分钟`,
      createdAt
    };
    set({ queueItems: [newItem, ...get().queueItems] });
    return queueId;
  },

  cancelQueue: (queueId) => {
    const { queueItems } = get();
    set({
      queueItems: queueItems.map((q) =>
        q.id === queueId ? { ...q, status: 'cancelled' as const } : q
      )
    });
  },

  setNavigateStallId: (stallId) => set({ navigateStallId: stallId }),
  setBookingActiveTab: (tab) => set({ bookingActiveTab: tab }),

  addVendorProduct: (name, price, stock, unit) => {
    const productId = `p${String(++productCounter).padStart(3, '0')}`;
    const newProduct: Product = {
      id: productId,
      stallId: 's001',
      name,
      image: 'https://picsum.photos/id/292/300/300',
      price,
      unit,
      stock,
      maxStock: stock,
      isLimited: stock <= 20,
      isPreorder: true,
      tags: ['新上架']
    };
    set({ vendorProducts: [...get().vendorProducts, newProduct] });
  },

  updateVendorProductStock: (productId, stock) => {
    const { vendorProducts } = get();
    set({
      vendorProducts: vendorProducts.map((p) =>
        p.id === productId ? { ...p, stock, maxStock: Math.max(p.maxStock, stock) } : p
      )
    });
  }
}));
