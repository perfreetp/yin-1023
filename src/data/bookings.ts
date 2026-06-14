import type { Booking } from '@/types';

export const mockBookings: Booking[] = [
  {
    id: 'b001',
    stallId: 's001',
    stallName: '张记包子铺',
    products: [
      {
        productId: 'p001',
        name: '手工鲜肉大包',
        image: 'https://picsum.photos/id/292/300/300',
        price: 3.5,
        quantity: 6
      },
      {
        productId: 'p005',
        name: '现磨豆浆',
        image: 'https://picsum.photos/id/431/300/300',
        price: 2,
        quantity: 3
      }
    ],
    totalPrice: 27,
    status: 'ready',
    pickupCode: 'A0823',
    createdAt: '2026-06-14 20:30',
    pickupDate: '2026-06-15 07:00',
    note: '豆浆少糖，包子要热的',
    isGroupBuy: false
  },
  {
    id: 'b002',
    stallId: 's003',
    stallName: '李婶蔬菜水果',
    products: [
      {
        productId: 'p006',
        name: '本地青菜',
        image: 'https://picsum.photos/id/312/300/300',
        price: 3,
        quantity: 3,
        note: '要嫩的'
      },
      {
        productId: 'p008',
        name: '土鸡蛋',
        image: 'https://picsum.photos/id/312/300/300',
        price: 1.5,
        quantity: 20
      }
    ],
    totalPrice: 39,
    status: 'confirmed',
    pickupCode: 'B1205',
    createdAt: '2026-06-14 21:15',
    pickupDate: '2026-06-15 08:30',
    isGroupBuy: true,
    groupBuyId: 'g001'
  },
  {
    id: 'b003',
    stallId: 's004',
    stallName: '陈记卤味',
    products: [
      {
        productId: 'p009',
        name: '招牌卤鸭脖',
        image: 'https://picsum.photos/id/625/300/300',
        price: 28,
        quantity: 1,
        note: '切小块，多放辣油'
      }
    ],
    totalPrice: 28,
    status: 'pending',
    pickupCode: 'C0301',
    createdAt: '2026-06-14 22:00',
    pickupDate: '2026-06-15 17:00',
    isGroupBuy: false
  },
  {
    id: 'b004',
    stallId: 's007',
    stallName: '孙家糕点',
    products: [
      {
        productId: 'p011',
        name: '桂花糕',
        image: 'https://picsum.photos/id/835/300/300',
        price: 15,
        quantity: 2
      }
    ],
    totalPrice: 30,
    status: 'completed',
    pickupCode: 'D0512',
    createdAt: '2026-06-13 18:00',
    pickupDate: '2026-06-14 10:00',
    isGroupBuy: false
  },
  {
    id: 'b005',
    stallId: 's001',
    stallName: '张记包子铺',
    products: [
      {
        productId: 'p004',
        name: '限量酱肉包',
        image: 'https://picsum.photos/id/292/300/300',
        price: 5,
        quantity: 4
      }
    ],
    totalPrice: 20,
    status: 'cancelled',
    pickupCode: 'A0915',
    createdAt: '2026-06-13 19:00',
    pickupDate: '2026-06-14 07:30',
    isGroupBuy: false
  }
];
