import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import type { Stall } from '@/types';
import TagBadge from '../TagBadge';
import { useAppStore } from '@/store/useAppStore';
import styles from './index.module.scss';

interface StallCardProps {
  stall: Stall;
  onBook?: (stall: Stall) => void;
  onNavigate?: (stall: Stall) => void;
  onQueue?: (stall: Stall) => void;
}

const StallCard: React.FC<StallCardProps> = ({ stall, onBook, onNavigate, onQueue }) => {
  const { user, toggleFavorite } = useAppStore();
  const isFav = user.favoriteStalls.includes(stall.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(stall.id);
    Taro.showToast({
      title: isFav ? '已取消收藏' : '已加入收藏',
      icon: 'none',
      duration: 1500
    });
  };

  const handleBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBook) onBook(stall);
  };

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNavigate) onNavigate(stall);
  };

  const handleQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQueue) onQueue(stall);
  };

  return (
    <View className={classnames(styles.stallCard, !stall.isOpen && styles.closed)}>
      <View className={styles.coverWrap}>
        <Image
          className={styles.coverImage}
          src={stall.coverImage}
          mode="aspectFill"
        />
        <View className={styles.statusTag}>
          <TagBadge variant={stall.isOpen ? 'success' : 'default'}>
            {stall.isOpen ? '营业中' : '已收摊'}
          </TagBadge>
        </View>
        <View className={styles.favoriteBtn} onClick={handleFavorite}>
          {isFav ? '❤️' : '🤍'}
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.name}>{stall.name}</Text>
          {stall.isVip && <TagBadge variant="accent">熟客摊主</TagBadge>}
        </View>

        <View className={styles.metaRow}>
          <Text className={styles.rating}>
            <Text className={styles.star}>⭐</Text>
            {stall.rating}
            <Text className={styles.reviewCount}>({stall.reviewCount})</Text>
          </Text>
          <Text className={styles.distance}>📍 {stall.distance}</Text>
          <Text className={styles.distance}>🕐 {stall.businessHours}</Text>
        </View>

        <Text className={styles.address}>{stall.address}</Text>

        {stall.tags.length > 0 && (
          <View className={styles.tagRow}>
            {stall.tags.slice(0, 4).map((tag, idx) => (
              <TagBadge key={idx} variant="default">{tag}</TagBadge>
            ))}
          </View>
        )}

        <View className={styles.footer}>
          <View style={{ display: 'flex', gap: '32rpx' }}>
            <Text className={styles.statItem}>
              排队 <Text className={styles.statNum}>{stall.queueCount}</Text>人
            </Text>
            <Text className={styles.statItem}>
              预订 <Text className={styles.statNum}>{stall.bookingCount}</Text>单
            </Text>
          </View>
          <View className={styles.actions}>
            <Button className={classnames(styles.btnMini, styles.ghost)} onClick={handleNavigate}>
              导航
            </Button>
            {stall.isOpen && (
              <>
                <Button className={classnames(styles.btnMini, styles.ghost)} onClick={handleQueue}>
                  叫号
                </Button>
                <Button className={classnames(styles.btnMini, styles.primary)} onClick={handleBook}>
                  预订
                </Button>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default StallCard;
