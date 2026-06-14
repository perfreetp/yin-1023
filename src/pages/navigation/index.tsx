import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockStalls } from '@/data/stalls';
import { useAppStore } from '@/store/useAppStore';
import type { Stall, Product } from '@/types';
import styles from './index.module.scss';

const NavigationPage: React.FC = () => {
  const { navigateStallId, setNavigateStallId, vendorProducts, addToCart, queueItems, navigationReturnUrl, setNavigationReturnUrl } = useAppStore();
  const initialStall = mockStalls.find((s) => s.id === navigateStallId) || mockStalls[0];
  const [currentStall, setCurrentStall] = useState<Stall>(initialStall);

  useEffect(() => {
    if (navigateStallId) {
      const stall = mockStalls.find((s) => s.id === navigateStallId);
      if (stall && stall.id !== currentStall.id) {
        setCurrentStall(stall);
      }
    }
  }, [navigateStallId]);

  const stallProducts = useMemo(() =>
    vendorProducts.filter((p) => p.stallId === currentStall.id),
    [vendorProducts, currentStall.id]
  );

  const signatureProducts = useMemo(() =>
    stallProducts.filter((p) => p.tags?.some((t) => t === '招牌' || t === '限量')).slice(0, 3),
    [stallProducts]
  );

  const stallQueueCount = useMemo(() =>
    queueItems.filter((q) => q.stallId === currentStall.id && q.status !== 'cancelled' && q.status !== 'completed').length,
    [queueItems, currentStall.id]
  );

  const stallQueueItems = useMemo(() =>
    queueItems.filter((q) => q.stallId === currentStall.id && q.status !== 'cancelled' && q.status !== 'completed'),
    [queueItems, currentStall.id]
  );

  const nearbyStalls = mockStalls.filter(
    (s) => s.id !== currentStall.id && currentStall.nearbyStalls?.includes(s.id)
  ).concat(mockStalls.filter((s) => s.id !== currentStall.id && !currentStall.nearbyStalls?.includes(s.id)).slice(0, 2));

  const handleSelectStall = (stall: Stall) => {
    setCurrentStall(stall);
    setNavigateStallId(stall.id);
    Taro.showToast({ title: `已切换到${stall.name}`, icon: 'none' });
  };

  const handleNavigate = () => {
    Taro.showToast({ title: '正在打开地图导航...', icon: 'none' });
  };

  const handleCallStall = () => {
    Taro.showToast({ title: '正在呼叫摊主...', icon: 'none' });
  };

  const handleQuickAdd = (product: Product) => {
    addToCart({
      productId: product.id,
      stallId: product.stallId,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
      isPreorder: product.isPreorder
    });
    Taro.showToast({ title: `已加购${product.name}`, icon: 'success' });
  };

  const handleGoToCart = () => {
    Taro.switchTab({ url: '/pages/cart/index' });
  };

  const handleGoBack = () => {
    if (navigationReturnUrl) {
      const url = navigationReturnUrl;
      setNavigationReturnUrl(null);
      if (url.startsWith('/pages/booking') || url.startsWith('/pages/queue')) {
        Taro.switchTab({ url: '/pages/booking/index' });
      } else {
        Taro.navigateBack();
      }
    } else {
      Taro.navigateBack();
    }
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

        {signatureProducts.length > 0 && (
          <View className={styles.featureSection}>
            <View className={styles.featureHeader}>
              <Text className={styles.featureTitle}>🏷️ 招牌商品</Text>
              <Text className={styles.featureMore} onClick={() => Taro.switchTab({ url: '/pages/stalls/index' })}>更多 ›</Text>
            </View>
            <View className={styles.productScroll}>
              {signatureProducts.map((product) => (
                <View key={product.id} className={styles.productCard}>
                  <Image className={styles.productImg} src={product.image} mode="aspectFill" />
                  <View className={styles.productInfo}>
                    <Text className={styles.productName}>{product.name}</Text>
                    <Text className={styles.productMeta}>
                      ¥{product.price}/{product.unit}
                      {product.stock <= product.maxStock * 0.3 && (
                        <Text style={{ color: '#F53F3F', marginLeft: '8rpx' }}>库存紧张</Text>
                      )}
                    </Text>
                  </View>
                  <Button
                    className={styles.addBtn}
                    onClick={() => handleQuickAdd(product)}
                  >
                    加购
                  </Button>
                </View>
              ))}
            </View>
          </View>
        )}

        {(stallQueueCount > 0 || currentStall.queueCount > 0) && (
          <View className={styles.queueSection}>
            <View className={styles.featureHeader}>
              <Text className={styles.featureTitle}>🎫 排队情况</Text>
            </View>
            <View className={styles.queueInfoCard}>
              <View className={styles.queueStat}>
                <Text className={styles.queueStatNum}>
                  {stallQueueItems.length > 0 ? stallQueueItems[0].aheadCount : currentStall.queueCount}
                </Text>
                <Text className={styles.queueStatLabel}>前方等待</Text>
              </View>
              <View className={styles.queueStat}>
                <Text className={styles.queueStatNum}>
                  {stallQueueItems.length > 0 ? stallQueueItems[0].estimatedTime : `约${currentStall.queueCount * 3}分钟`}
                </Text>
                <Text className={styles.queueStatLabel}>预计等待</Text>
              </View>
              <View className={styles.queueStat}>
                <Text className={styles.queueStatNum}>{currentStall.queueCount}</Text>
                <Text className={styles.queueStatLabel}>总排队</Text>
              </View>
              <Button
                className={styles.takeNumberBtn}
                onClick={() => {
                  Taro.switchTab({ url: '/pages/queue/index' });
                }}
              >
                取号
              </Button>
            </View>
          </View>
        )}

        <View className={styles.nearbySection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>🏪 邻摊联动推荐</Text>
          </View>

          <View className={styles.nearbyList}>
            {nearbyStalls.slice(0, 3).map((stall) => {
              const nearbyProducts = vendorProducts.filter((p) => p.stallId === stall.id);
              return (
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
                    {nearbyProducts.length > 0 && (
                      <Text className={styles.nearbyProducts}>
                        招牌：{nearbyProducts.slice(0, 2).map((p) => p.name).join('、')}
                      </Text>
                    )}
                  </View>
                  <View className={styles.nearbyAction}>看看</View>
                </View>
              );
            })}
          </View>
        </View>

        <View className={styles.quickActionsBar}>
          <Button className={styles.quickActionBtn} onClick={handleGoToCart}>
            🧺 商品篮
          </Button>
          {navigationReturnUrl && (
            <Button className={styles.quickActionBtn + ` ${styles.returnBtn}`} onClick={handleGoBack}>
              ← 返回继续
            </Button>
          )}
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
