import type { QueueItem, GroupBuy, Stall } from '@/types';
import { mockStalls as _stalls } from './stalls';
export const mockStalls: Stall[] = _stalls;

export const mockQueue: QueueItem[] = [
  {
    id: 'q001',
    stallId: 's001',
    stallName: '张记包子铺',
    number: 15,
    currentNumber: 9,
    aheadCount: 6,
    status: 'waiting',
    estimatedTime: '约8分钟',
    createdAt: '2026-06-15 07:15'
  },
  {
    id: 'q002',
    stallId: 's004',
    stallName: '陈记卤味',
    number: 23,
    currentNumber: 23,
    aheadCount: 0,
    status: 'calling',
    estimatedTime: '请尽快取号',
    createdAt: '2026-06-15 16:20'
  },
  {
    id: 'q003',
    stallId: 's010',
    stallName: '郑氏鲜肉',
    number: 8,
    currentNumber: 8,
    aheadCount: 0,
    status: 'serving',
    estimatedTime: '正在服务',
    createdAt: '2026-06-15 07:05',
    products: [
      {
        productId: 'pork',
        name: '五花肉',
        image: 'https://picsum.photos/id/401/300/300',
        price: 28,
        quantity: 1
      }
    ]
  }
];

export const mockGroupBuys: GroupBuy[] = [
  {
    id: 'g001',
    stallId: 's003',
    stallName: '李婶蔬菜水果',
    initiatorId: 'u001',
    initiatorName: '老街坊阿明',
    members: [
      {
        userId: 'u001',
        userName: '老街坊阿明',
        avatar: 'https://picsum.photos/id/64/200/200',
        share: 39,
        products: [
          {
            productId: 'p006',
            name: '本地青菜',
            image: 'https://picsum.photos/id/312/300/300',
            price: 3,
            quantity: 3
          },
          {
            productId: 'p008',
            name: '土鸡蛋',
            image: 'https://picsum.photos/id/312/300/300',
            price: 1.5,
            quantity: 20
          }
        ]
      },
      {
        userId: 'u002',
        userName: '隔壁王婶',
        avatar: 'https://picsum.photos/id/91/200/200',
        share: 21,
        products: [
          {
            productId: 'p007',
            name: '农家西红柿',
            image: 'https://picsum.photos/id/312/300/300',
            price: 5,
            quantity: 3
          },
          {
            productId: 'p006',
            name: '本地青菜',
            image: 'https://picsum.photos/id/312/300/300',
            price: 3,
            quantity: 2
          }
        ]
      }
    ],
    products: [],
    totalPrice: 60,
    minMembers: 2,
    maxMembers: 5,
    deadline: '今日18:00截单',
    status: 'joining',
    shareDiscount: 0.9
  },
  {
    id: 'g002',
    stallId: 's007',
    stallName: '孙家糕点',
    initiatorId: 'u003',
    initiatorName: '楼下张姐',
    members: [
      {
        userId: 'u003',
        userName: '楼下张姐',
        avatar: 'https://picsum.photos/id/177/200/200',
        share: 33,
        products: [
          {
            productId: 'p011',
            name: '桂花糕',
            image: 'https://picsum.photos/id/835/300/300',
            price: 15,
            quantity: 2
          },
          {
            productId: 'p012',
            name: '绿豆糕',
            image: 'https://picsum.photos/id/835/300/300',
            price: 18,
            quantity: 1
          }
        ]
      }
    ],
    products: [],
    totalPrice: 33,
    minMembers: 3,
    maxMembers: 6,
    deadline: '明日09:00截单',
    status: 'joining',
    shareDiscount: 0.85
  }
];
