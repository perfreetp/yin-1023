import React from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import { mockStalls } from '@/data/stalls';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const { user } = useAppStore();
  const favoriteStalls = mockStalls.filter((s) => user.favoriteStalls.includes(s.id));

  const handleReview = () => {
    Taro.navigateTo({ url: '/pages/review/index' });
  };

  const handleVendor = () => {
    Taro.navigateTo({ url: '/pages/vendor-dashboard/index' });
  };

  const handleStallClick = (stallId: string) => {
    const stall = mockStalls.find((s) => s.id === stallId);
    if (stall) {
      useAppStore.getState().setCurrentStall(stall);
      Taro.navigateTo({ url: '/pages/navigation/index' });
    }
  };

  const menuItems = [
    {
      icon: '⭐',
      title: '我的评价',
      desc: `${user.reviewCount}条已发表评价`,
      onClick: handleReview
    },
    {
      icon: '🔄',
      title: '次日预约续单',
      desc: '老规矩，直接帮我留好',
      onClick: () => Taro.switchTab({ url: '/pages/booking/index' })
    },
    {
      icon: '🧾',
      title: '收摊清单',
      desc: '看看今天买了啥',
      onClick: () => Taro.switchTab({ url: '/pages/booking/index' })
    },
    {
      icon: '📍',
      title: '到摊导航记录',
      desc: '常去摊位一键导航',
      onClick: () => Taro.navigateTo({ url: '/pages/navigation/index' })
    },
    {
      icon: '🔔',
      title: '到货提醒设置',
      desc: '想要的货到了通知我',
      badge: '2',
      onClick: () => Taro.showToast({ title: '功能开发中', icon: 'none' })
    },
    {
      icon: '👤',
      title: '回头客标签',
      desc: `VIP等级 Lv.${user.vipLevel}，享专属权益`,
      onClick: () => Taro.showToast({ title: '功能开发中', icon: 'none' })
    }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.profileHeader}>
        <View className={styles.profileRow}>
          <Image className={styles.avatar} src={user.avatar} mode="aspectFill" />
          <View className={styles.profileInfo}>
            <Text className={styles.userName}>
              {user.name}
              {user.isVip && (
                <View className={styles.vipBadge}>👑 VIP Lv.{user.vipLevel}</View>
              )}
            </Text>
            <Text className={styles.userDesc}>累计下单 {user.totalOrders} 次 · 老街坊认证</Text>
            <View className={styles.tasteRow}>
              {user.tastePreferences.map((taste, idx) => (
                <View key={idx} className={styles.tasteTag}>{taste}</View>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View className={styles.statsBar}>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{user.totalOrders}</Text>
          <Text className={styles.statLabel}>累计订单</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{user.favoriteStalls.length}</Text>
          <Text className={styles.statLabel}>收藏摊位</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{user.reviewCount}</Text>
          <Text className={styles.statLabel}>发表评价</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{user.vipLevel}</Text>
          <Text className={styles.statLabel}>VIP等级</Text>
        </View>
      </View>

      {favoriteStalls.length > 0 && (
        <View className={styles.favStallsSection}>
          <View className={styles.favHeader}>
            <Text className={styles.favTitle}>❤️ 常去摊位</Text>
            <Text className={styles.favCount}>共 {favoriteStalls.length} 个</Text>
          </View>
          <ScrollView className={styles.favScroll} scrollX enhanced showScrollbar={false}>
            <View className={styles.favContainer}>
              {favoriteStalls.map((stall) => (
                <View
                  key={stall.id}
                  className={styles.favCard}
                  onClick={() => handleStallClick(stall.id)}
                >
                  <Image
                    className={styles.favCover}
                    src={stall.coverImage}
                    mode="aspectFill"
                  />
                  <Text className={styles.favName}>{stall.name}</Text>
                  <Text className={styles.favMeta}>{stall.distance} · {stall.businessHours}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      <View className={styles.vendorBanner} onClick={handleVendor}>
        <View className={styles.bannerContent}>
          <Text className={styles.bannerTitle}>
            🏪 我是摊主
          </Text>
          <Text className={styles.bannerDesc}>开摊管理、接单核销、回复评价一站式搞定</Text>
        </View>
        <Button className={styles.bannerBtn} onClick={handleVendor}>
          进入后台
        </Button>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>我的服务</Text>
        {menuItems.map((item, idx) => (
          <View key={idx} className={styles.menuItem} onClick={item.onClick}>
            <View className={styles.menuIcon}>{item.icon}</View>
            <View className={styles.menuContent}>
              <Text className={styles.menuTitle}>{item.title}</Text>
              <Text className={styles.menuDesc}>{item.desc}</Text>
            </View>
            {item.badge && <View className={styles.menuBadge}>{item.badge}</View>}
            <Text className={styles.menuArrow}>›</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default MinePage;
