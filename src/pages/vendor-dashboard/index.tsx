import React, { useState } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockBookings } from '@/data/bookings';
import { mockProducts } from '@/data/products';
import styles from './index.module.scss';

const VendorDashboardPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [stocks, setStocks] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    mockProducts.slice(0, 5).forEach((p) => { init[p.id] = p.stock; });
    return init;
  });

  const pendingBookings = mockBookings.filter(
    (b) => b.status === 'pending' || b.status === 'confirmed'
  );

  const todayProducts = mockProducts.slice(0, 5);

  const actions = [
    { icon: '📝', name: '快速上架', onClick: () => Taro.showToast({ title: '功能开发中', icon: 'none' }) },
    { icon: '🔢', name: '叫号管理', onClick: () => Taro.switchTab({ url: '/pages/queue/index' }) },
    { icon: '💬', name: '回复评价', onClick: () => Taro.navigateTo({ url: '/pages/review/index' }) },
    { icon: '🧾', name: '收摊清单', onClick: () => Taro.showToast({ title: '功能开发中', icon: 'none' }) }
  ];

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    Taro.showToast({
      title: !isOpen ? '已开摊！祝生意兴隆' : '已收摊，明天见',
      icon: 'none'
    });
  };

  const handleConfirm = (bookingId: string) => {
    Taro.showToast({ title: '已确认预订', icon: 'success' });
    console.log('[Vendor] 确认预订:', bookingId);
  };

  const handleReady = (bookingId: string) => {
    Taro.showToast({ title: '已通知取货', icon: 'success' });
    console.log('[Vendor] 备货完成:', bookingId);
  };

  const adjustStock = (productId: string, delta: number) => {
    setStocks((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta)
    }));
  };

  return (
    <View className={styles.page}>
      <View className={styles.statusHeader}>
        <View className={styles.statusRow}>
          <View className={styles.stallInfo}>
            <View className={styles.stallIcon}>🥟</View>
            <View className={styles.stallDetail}>
              <Text className={styles.name}>张记包子铺</Text>
              <Text className={styles.time}>营业时段 05:30 - 10:00</Text>
            </View>
          </View>
          <Button
            className={styles.statusToggle + (isOpen ? ` ${styles.open}` : '')}
            onClick={toggleOpen}
          >
            {isOpen ? '● 营业中' : '○ 已收摊'}
          </Button>
        </View>

        <View className={styles.statsGrid}>
          <View className={styles.statCard}>
            <Text className={styles.statNum}>¥328</Text>
            <Text className={styles.statLabel}>今日营收</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statNum}>28</Text>
            <Text className={styles.statLabel}>今日订单</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statNum}>5</Text>
            <Text className={styles.statLabel}>待处理</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statNum}>8</Text>
            <Text className={styles.statLabel}>排队中</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.actionRow}>
          {actions.map((action, idx) => (
            <View key={idx} className={styles.actionItem} onClick={action.onClick}>
              <View className={styles.actionIcon}>{action.icon}</View>
              <Text className={styles.actionText}>{action.name}</Text>
            </View>
          ))}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>📋 待处理预订</Text>
            <View className={styles.sectionBadge}>{pendingBookings.length} 单</View>
          </View>
          {pendingBookings.map((booking) => (
            <View key={booking.id} className={styles.bookingItem}>
              <View className={styles.customerAvatar}>👤</View>
              <View className={styles.bookingInfo}>
                <Text className={styles.customerName}>
                  {booking.products[0].name}等{booking.products.length}件
                  <View className={styles.vipTag}>VIP熟客</View>
                </Text>
                <Text className={styles.bookingDetail}>
                  ¥{booking.totalPrice} · {booking.pickupDate}取货
                  {booking.note && ` · ${booking.note}`}
                </Text>
              </View>
              <View className={styles.bookingActions}>
                {booking.status === 'pending' && (
                  <Button
                    className={styles.miniBtn + ` ${styles.primary}`}
                    onClick={() => handleConfirm(booking.id)}
                  >
                    确认
                  </Button>
                )}
                {booking.status === 'confirmed' && (
                  <Button
                    className={styles.miniBtn + ` ${styles.success}`}
                    onClick={() => handleReady(booking.id)}
                  >
                    备好
                  </Button>
                )}
              </View>
            </View>
          ))}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>📦 商品库存</Text>
            <View className={styles.sectionBadge}>快速调整</View>
          </View>
          <View className={styles.productManage}>
            {todayProducts.map((product) => {
              const stock = stocks[product.id] || 0;
              const ratio = stock / product.maxStock;
              const lowStock = ratio <= 0.3;
              return (
                <View key={product.id} className={styles.productRow}>
                  <Image
                    className={styles.productImg}
                    src={product.image}
                    mode="aspectFill"
                  />
                  <View className={styles.productInfo}>
                    <Text className={styles.productName}>{product.name}</Text>
                    <View style={{ display: 'flex', alignItems: 'center', gap: '16rpx' }}>
                      <Text className={styles.stockText + (lowStock ? ` ${styles.warn}` : '')}>
                        {lowStock ? '⚠️ 库存紧张' : '库存充足'}
                      </Text>
                      <View className={styles.progressBar}>
                        <View
                          className={styles.progressFill}
                          style={{ width: `${Math.min(100, ratio * 100)}%` }}
                        />
                      </View>
                    </View>
                  </View>
                  <View className={styles.stockControl}>
                    <Button
                      className={styles.stockBtn}
                      onClick={() => adjustStock(product.id, -1)}
                    >
                      -
                    </Button>
                    <Text className={styles.stockNum}>{stock}</Text>
                    <Button
                      className={styles.stockBtn}
                      onClick={() => adjustStock(product.id, 1)}
                    >
                      +
                    </Button>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

export default VendorDashboardPage;
