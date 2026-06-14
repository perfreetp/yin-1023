import React, { useState } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockStalls } from '@/data/stalls';
import { useAppStore } from '@/store/useAppStore';
import type { Stall } from '@/types';
import styles from './index.module.scss';

const NavigationPage: React.FC = () => {
  const { navigateStallId } = useAppStore();
  const initialStall = mockStalls.find((s) => s.id === navigateStallId) || mockStalls[0];
  const [currentStall, setCurrentStall] = useState<Stall>(initialStall);
  const nearbyStalls = mockStalls.filter(
    (s) => s.id !== currentStall.id && currentStall.nearbyStalls?.includes(s.id)
  ).concat(mockStalls.filter((s) => s.id !== currentStall.id && !currentStall.nearbyStalls?.includes(s.id)).slice(0, 2));

  const handleSelectStall = (stall: Stall) => {
    setCurrentStall(stall);
    Taro.showToast({ title: `已切换到${stall.name}`, icon: 'none' });
  };

  const handleNavigate = () => {
    Taro.showToast({ title: '正在打开地图导航...', icon: 'none' });
    console.log('[Navigation] 开始导航到:', currentStall.address);
  };

  const handleCallStall = () => {
    Taro.showToast({ title: '正在呼叫摊主...', icon: 'none' });
    console.log('[Navigation] 呼叫摊主:', currentStall.ownerName);
  };

  const markerPositions = [
    { top: '30%', left: '60%', emoji: '🥟' },
    { top: '25%', left: '45%', emoji: '🍜' },
    { top: '60%', left: '70%', emoji: '🥬' },
    { top: '45%', left: '35%', emoji: '🍖' },
  ];

  return (
    <View className={styles.page}>
      <View className={styles.mapContainer}>
        <View className={styles.mapPlaceholder}>
          <View className={styles.mapGrid}>
            {[...Array(8)].map((_, i) => (
              <View
                key={`h-${i}`}
                className={styles.gridLine}
                style={{
                  top: `${(i + 1) * 12}%`,
                  left: 0,
                  width: '100%',
                  height: '2rpx'
                }}
              />
            ))}
            {[...Array(8)].map((_, i) => (
              <View
                key={`v-${i}`}
                className={styles.gridLine}
                style={{
                  top: 0,
                  left: `${(i + 1) * 12}%`,
                  width: '2rpx',
                  height: '100%'
                }}
              />
            ))}
          </View>

          <View className={styles.routeLine} />

          <View className={styles.myLocation} />

          {markerPositions.map((pos, idx) => (
            <View
              key={idx}
              className={styles.stallMarker + (idx === 0 ? ` ${styles.activeMarker}` : '')}
              style={{ top: pos.top, left: pos.left }}
            >
              <View className={styles.markerPin}><span>{pos.emoji}</span></View>
              <View className={styles.markerLabel}>{idx === 0 ? currentStall.name : ''}</View>
            </View>
          ))}

          <View style={{ position: 'absolute', bottom: '24rpx', right: '24rpx' }}>
            <Text className={styles.mapText}>📍 简易地图预览</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.stallCard}>
          <View className={styles.stallHeader}>
            <Image
              className={styles.stallCover}
              src={currentStall.coverImage}
              mode="aspectFill"
            />
            <View className={styles.stallInfo}>
              <Text className={styles.stallName}>{currentStall.name}</Text>
              <View style={{ marginTop: '8rpx' }}>
                <View
                  className={styles.stallStatus + (currentStall.isOpen ? ` ${styles.statusOpen}` : ` ${styles.statusClosed}`)}
                >
                  {currentStall.isOpen ? '● 营业中' : '○ 已收摊'}
                </View>
                <Text className={styles.stallRating}>⭐ {currentStall.rating} · {currentStall.reviewCount}条评价</Text>
              </View>
            </View>
          </View>

          <View className={styles.stallMeta}>
            <View className={styles.metaTag}>
              <Text className={styles.metaIcon}>👤</Text>
              <Text>{currentStall.ownerName}</Text>
            </View>
            <View className={styles.metaTag}>
              <Text className={styles.metaIcon}>🕐</Text>
              <Text>{currentStall.businessHours}</Text>
            </View>
            <View className={styles.metaTag}>
              <Text className={styles.metaIcon}>📍</Text>
              <Text>{currentStall.distance}</Text>
            </View>
            <View className={styles.metaTag}>
              <Text className={styles.metaIcon}>📞</Text>
              <Text>点击呼叫</Text>
            </View>
          </View>

          <View className={styles.stallMeta} style={{ marginBottom: '24rpx' }}>
            <View className={styles.metaTag} style={{ flex: 1 }}>
              <Text className={styles.metaIcon}>🏠</Text>
              <Text>{currentStall.address}</Text>
            </View>
          </View>

          <View className={styles.tagsRow}>
            {currentStall.tags.map((tag, idx) => (
              <View
                key={idx}
                className={styles.stallTag + (idx === 0 ? ` ${styles.tagPrimary}` : ` ${styles.tagNormal}`)}
              >
                {tag}
              </View>
            ))}
          </View>

          <View className={styles.actionRow}>
            <Button className={styles.actionBtn + ` ${styles.btnSecondary}`} onClick={handleCallStall}>
              📞 联系摊主
            </Button>
            <Button className={styles.actionBtn + ` ${styles.btnPrimary}`} onClick={handleNavigate}>
              🧭 开始导航
            </Button>
          </View>
        </View>

        <View className={styles.nearbySection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>🏪 邻摊联动推荐</Text>
          </View>

          <View className={styles.nearbyList}>
            {nearbyStalls.slice(0, 3).map((stall) => (
              <View key={stall.id} className={styles.nearbyItem} onClick={() => handleSelectStall(stall)}>
                <Image
                  className={styles.nearbyAvatar}
                  src={stall.coverImage}
                  mode="aspectFill"
                />
                <View className={styles.nearbyInfo}>
                  <Text className={styles.nearbyName}>{stall.name}</Text>
                  <Text className={styles.nearbyMeta}>
                    {stall.category} · 距{stall.distance} · ⭐{stall.rating}
                    {stall.isOpen && <Text style={{ color: '#00B42A', marginLeft: '8rpx' }}>· 营业中</Text>}
                  </Text>
                </View>
                <View className={styles.nearbyAction}>看看</View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.tipsCard}>
          <Text className={styles.tipsTitle}>💡 集市小贴士</Text>
          <Text className={styles.tipsText}>
            · 早上6-8点是早市高峰，建议提前预订避免排队{'\n'}
            · 熟客可直接联系摊主预留商品，到摊即取{'\n'}
            · 集市内支持邻摊拼单，顺路一起买更方便
          </Text>
        </View>
      </View>
    </View>
  );
};

export default NavigationPage;
