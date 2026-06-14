import React, { useState, useMemo } from 'react';
import { View, Text, Button, Image, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import StallCard from '@/components/StallCard';
import TagBadge from '@/components/TagBadge';
import EmptyState from '@/components/EmptyState';
import { mockStalls } from '@/data/stalls';
import { useAppStore } from '@/store/useAppStore';
import type { Stall } from '@/types';
import styles from './index.module.scss';

const categories = [
  { icon: '🥟', name: '早点面食' },
  { icon: '🥬', name: '生鲜果蔬' },
  { icon: '🍖', name: '肉禽蛋品' },
  { icon: '🦐', name: '水产海鲜' },
  { icon: '🍲', name: '熟食卤味' },
  { icon: '🍰', name: '点心糕点' }
];

const StallsPage: React.FC = () => {
  const { user } = useAppStore();
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const favoriteStalls = useMemo(() => {
    return mockStalls.filter((s) => user.favoriteStalls.includes(s.id));
  }, [user.favoriteStalls]);

  const filteredStalls = useMemo(() => {
    let list = mockStalls;
    if (searchText) {
      list = list.filter(
        (s) =>
          s.name.includes(searchText) ||
          s.category.includes(searchText) ||
          s.tags.some((t) => t.includes(searchText))
      );
    }
    if (activeCategory) {
      list = list.filter((s) => s.category === activeCategory);
    }
    return list;
  }, [searchText, activeCategory]);

  const handleBook = (stall: Stall) => {
    useAppStore.getState().setCurrentStall(stall);
    Taro.switchTab({ url: '/pages/cart/index' });
  };

  const handleNavigate = (stall: Stall) => {
    const st = useAppStore.getState();
    st.setCurrentStall(stall);
    st.setNavigateStallId(stall.id);
    Taro.navigateTo({ url: '/pages/navigation/index' });
  };

  const handleQueue = (stall: Stall) => {
    useAppStore.getState().setCurrentStall(stall);
    Taro.switchTab({ url: '/pages/queue/index' });
  };

  const handleVendor = () => {
    Taro.navigateTo({ url: '/pages/vendor-dashboard/index' });
  };

  const handleCategoryClick = (name: string) => {
    setActiveCategory(activeCategory === name ? null : name);
  };

  const handleRefresh = () => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 800);
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.greeting}>
          <View className={styles.greetingText}>
            <Text className={styles.hello}>早上好，老街坊 ☀️</Text>
            <Text className={styles.name}>{user.name}</Text>
          </View>
          <Button className={styles.vendorBtn} onClick={handleVendor}>
            🏪 摊主后台
          </Button>
        </View>

        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索摊位名、品类或标签"
            placeholderClass={styles.searchPlaceholder}
            value={searchText}
            onInput={(e) => setSearchText(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.categoryRow}>
          {categories.map((cat, idx) => (
            <View
              key={idx}
              className={styles.categoryItem}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <View
                className={styles.categoryIcon}
                style={activeCategory === cat.name ? { background: 'rgba(255,107,53,0.15)' } : {}}
              >
                {cat.icon}
              </View>
              <Text className={styles.categoryText}>{cat.name}</Text>
            </View>
          ))}
        </View>

        {favoriteStalls.length > 0 && !searchText && !activeCategory && (
          <>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>
                <Text className={styles.highlight}>❤️</Text> 我的收藏
              </Text>
              <Text className={styles.sectionMore}>查看全部 ›</Text>
            </View>
            <ScrollView className={styles.favScroll} scrollX enhanced showScrollbar={false}>
              <View className={styles.favContainer}>
                {favoriteStalls.map((stall) => (
                  <View key={stall.id} className={styles.favCard} onClick={() => handleNavigate(stall)}>
                    <Image className={styles.favCover} src={stall.coverImage} mode="aspectFill" />
                    <Text className={styles.favName}>{stall.name}</Text>
                    <Text className={styles.favMeta}>
                      {stall.distance} · {stall.bookingCount}单预订
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </>
        )}

        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            {activeCategory ? activeCategory : '今日出摊'}
            <Text className={styles.highlight}> ({filteredStalls.length})</Text>
          </Text>
          <View style={{ display: 'flex', gap: '16rpx' }}>
            {activeCategory && (
              <TagBadge variant="primary" outline onClick={() => setActiveCategory(null)}>
                清除筛选
              </TagBadge>
            )}
          </View>
        </View>

        {filteredStalls.length > 0 ? (
          <View className={styles.stallList}>
            {filteredStalls.map((stall) => (
              <StallCard
                key={stall.id}
                stall={stall}
                onBook={handleBook}
                onNavigate={handleNavigate}
                onQueue={handleQueue}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            icon="🔍"
            title="暂无相关摊位"
            description="换个关键词或分类试试吧"
          />
        )}
      </View>

      <View style={{ display: 'none' }} onTouchEnd={handleRefresh} />
    </View>
  );
};

export default StallsPage;
