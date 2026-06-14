import type { Review } from '@/types';

export const mockReviews: Review[] = [
  {
    id: 'r001',
    stallId: 's001',
    userId: 'u002',
    userName: '老街坊阿明',
    avatar: 'https://picsum.photos/id/64/200/200',
    rating: 5,
    content: '张大叔的包子还是那个味儿！皮薄馅大，每天早上都要来两个。今天预订的肉包，到摊直接取，不用排队太方便了！',
    images: ['https://picsum.photos/id/292/400/300', 'https://picsum.photos/id/292/400/300'],
    reply: '感谢阿明一直以来的支持！明天给你多放半勺肉~',
    createdAt: '2026-06-14 08:30',
    tags: ['味道好', '熟客优惠', '取货快']
  },
  {
    id: 'r002',
    stallId: 's001',
    userId: 'u003',
    userName: '隔壁王婶',
    avatar: 'https://picsum.photos/id/91/200/200',
    rating: 5,
    content: '张记包子铺开了二十多年，从小吃到大。现在能提前预订真是太好了，我备注了少葱，摊主记得清清楚楚。',
    reply: '',
    createdAt: '2026-06-13 09:15',
    tags: ['老味道', '服务贴心', '可备注']
  },
  {
    id: 'r003',
    stallId: 's003',
    userId: 'u004',
    userName: '楼下张姐',
    avatar: 'https://picsum.photos/id/177/200/200',
    rating: 4,
    content: '李婶家的青菜很新鲜，都是当天从地里摘的。拼单凑了好几家邻居，分摊下来更划算。就是今天土鸡蛋只剩最后十几个，还好我预订了~',
    reply: '张姐下次提前说，给你留最新鲜的！',
    createdAt: '2026-06-12 17:20',
    tags: ['新鲜', '拼单划算', '可预留']
  },
  {
    id: 'r004',
    stallId: 's004',
    userId: 'u005',
    userName: '后街李哥',
    avatar: 'https://picsum.photos/id/201/200/200',
    rating: 5,
    content: '陈记卤味绝了！每次来都要排队，现在小程序叫号方便多了，快到号再过去就行。卤猪蹄软糯入味，家人都爱吃。',
    reply: '',
    createdAt: '2026-06-11 18:45',
    tags: ['味道好', '叫号方便', '熟客折扣']
  },
  {
    id: 'r005',
    stallId: 's007',
    userId: 'u006',
    userName: '孙奶奶粉丝',
    avatar: 'https://picsum.photos/id/225/200/200',
    rating: 5,
    content: '孙奶奶的桂花糕是我从小吃到大的味道！现在年纪大了还坚持手工做，预订还能享优惠，太感动了。推荐大家都尝尝~',
    reply: '谢谢你小姑娘，奶奶身体还好着呢，多来坐！',
    createdAt: '2026-06-10 15:30',
    tags: ['传统手艺', '儿时味道', '预订优惠']
  }
];

export const pendingReviews = [
  {
    id: 'p001',
    bookingId: 'b004',
    stallId: 's001',
    stallName: '张记包子铺',
    stallCover: 'https://picsum.photos/id/292/300/300',
    products: [
      { name: '鲜肉大包', quantity: 3 },
      { name: '荠菜蒸饺', quantity: 2 }
    ],
    completedAt: '2026-06-14 08:20'
  },
  {
    id: 'p002',
    bookingId: 'b005',
    stallId: 's004',
    stallName: '陈记卤味',
    stallCover: 'https://picsum.photos/id/625/300/300',
    products: [
      { name: '卤猪蹄', quantity: 1 },
      { name: '卤鸭脖', quantity: 4 }
    ],
    completedAt: '2026-06-13 19:05'
  }
];
