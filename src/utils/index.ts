export const formatPrice = (price: number): string => {
  return `¥${price.toFixed(2)}`;
};

export const getStatusText = (
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled'
): string => {
  const statusMap = {
    pending: '待确认',
    confirmed: '备货中',
    ready: '可取货',
    completed: '已完成',
    cancelled: '已取消'
  };
  return statusMap[status];
};

export const getStatusColor = (
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled'
): string => {
  const colorMap = {
    pending: '#FF7D00',
    confirmed: '#165DFF',
    ready: '#00B42A',
    completed: '#86909C',
    cancelled: '#C9CDD4'
  };
  return colorMap[status];
};

export const getQueueStatusText = (
  status: 'waiting' | 'calling' | 'serving' | 'completed' | 'cancelled'
): string => {
  const statusMap = {
    waiting: '排队中',
    calling: '叫号中',
    serving: '服务中',
    completed: '已完成',
    cancelled: '已取消'
  };
  return statusMap[status];
};

export const getQueueStatusColor = (
  status: 'waiting' | 'calling' | 'serving' | 'completed' | 'cancelled'
): string => {
  const colorMap = {
    waiting: '#FF7D00',
    calling: '#FF6B35',
    serving: '#00B42A',
    completed: '#86909C',
    cancelled: '#C9CDD4'
  };
  return colorMap[status];
};

export const generatePickupCode = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const num = String(Math.floor(Math.random() * 9000) + 1000);
  return `${letter}${num}`;
};

export const formatStockLevel = (stock: number, maxStock: number): string => {
  const ratio = stock / maxStock;
  if (ratio <= 0.1) return '即将售罄';
  if (ratio <= 0.3) return '库存紧张';
  if (ratio <= 0.6) return '库存充足';
  return '备货充足';
};

export const isLowStock = (stock: number, maxStock: number): boolean => {
  return stock / maxStock <= 0.3;
};
