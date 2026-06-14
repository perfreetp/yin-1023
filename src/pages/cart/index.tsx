import React, { useState, useMemo } from 'react';
import { View, Text, Button, Image, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import EmptyState from '@/components/EmptyState';
import TagBadge from '@/components/TagBadge';
import { useAppStore } from '@/store/useAppStore';
import { mockStalls } from '@/data/stalls';
import styles from './index.module.scss';

const tasteOptions = ['微辣', '少糖', '多加葱', '不要香菜', '多加蒜', '清淡'];

const CartPage: React.FC = () => {
  const { cart, user, vendorProducts, updateCartQuantity, removeFromCart, updateCartItemNote, clearCart, createBooking, setBookingActiveTab } = useAppStore();
  const [selectedTastes, setSelectedTastes] = useState<string[]>(user.tastePreferences.slice(0, 2));

  const groupedCart = useMemo(() => {
    const groups: Record<string, typeof cart> = {};
    cart.forEach((item) => {
      if (!groups[item.stallId]) groups[item.stallId] = [];
      groups[item.stallId].push(item);
    });
    return groups;
  }, [cart]);

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const totalCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const toggleTaste = (taste: string) => {
    setSelectedTastes((prev) =>
      prev.includes(taste) ? prev.filter((t) => t !== taste) : [...prev, taste]
    );
  };

  const handleMinus = (productId: string, quantity: number) => {
    if (quantity <= 1) {
      Taro.showModal({
        title: '确认移除',
        content: '确定要移除这个商品吗？',
        success: (res) => {
          if (res.confirm) removeFromCart(productId);
        }
      });
    } else {
      updateCartQuantity(productId, quantity - 1);
    }
  };

  const handlePlus = (productId: string, quantity: number) => {
    const product = vendorProducts.find((p) => p.id === productId);
    if (product && quantity >= product.stock) {
      Taro.showToast({ title: '库存不足', icon: 'none' });
      return;
    }
    updateCartQuantity(productId, quantity + 1);
  };

  const handleClear = () => {
    Taro.showModal({
      title: '清空商品篮',
      content: '确定要清空所有商品吗？',
      success: (res) => {
        if (res.confirm) clearCart();
      }
    });
  };

  const handleSubmit = () => {
    if (cart.length === 0) return;
    try {
      const stallGroups: Record<string, typeof cart> = {};
      cart.forEach((item) => {
        if (!stallGroups[item.stallId]) stallGroups[item.stallId] = [];
        stallGroups[item.stallId].push(item);
      });
      const allNotes = selectedTastes.length > 0 ? selectedTastes.join('、') : '';
      Taro.showModal({
        title: '提交预订',
        content: `共 ${totalCount} 件商品，合计 ¥${totalPrice.toFixed(2)}`,
        confirmText: '确认预订',
        success: (res) => {
          if (res.confirm) {
            Taro.showLoading({ title: '提交中...' });
            setTimeout(() => {
              try {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const pickupDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')} 07:00`;
                Object.entries(stallGroups).forEach(([stallId, items]) => {
                  const stall = mockStalls.find((s) => s.id === stallId);
                  const stallNote = items.map((i) => i.note).filter(Boolean).join('；');
                  const fullNote = [allNotes, stallNote].filter(Boolean).join('；');
                  createBooking(stallId, stall?.name || '摊位', items, fullNote, pickupDate);
                });
                setBookingActiveTab('pending');
                Taro.hideLoading();
                Taro.showToast({ title: '预订成功！', icon: 'success' });
                setTimeout(() => {
                  Taro.switchTab({ url: '/pages/booking/index' });
                }, 800);
              } catch (err) {
                Taro.hideLoading();
                Taro.showToast({ title: '提交失败，请重试', icon: 'none' });
                console.error('[Cart] submit error', err);
              }
            }, 500);
          }
        },
        fail: () => {
          Taro.hideLoading();
        }
      });
    } catch (err) {
      Taro.showToast({ title: '操作失败，请重试', icon: 'none' });
      console.error('[Cart] handleSubmit error', err);
    }
  };

  const handleGroupBuy = () => {
    Taro.navigateTo({ url: '/pages/group-buy/index' });
  };

  if (cart.length === 0) {
    return (
      <View className={styles.page}>
        <EmptyState
          icon="🧺"
          title="商品篮是空的"
          description="去今日摊位挑点明天想吃的吧"
        />
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.tipBar}>
        <Text className={styles.tipIcon}>💡</Text>
        <Text className={styles.tipText}>
          预订商品，摊主会提前为您备好，到摊直接取走
        </Text>
      </View>

      <View className={styles.content}>
        <View className={styles.sectionTitle}>
          预订商品 ({Object.keys(groupedCart).length}家摊位)
          <Text className={styles.clearBtn} onClick={handleClear}>
            清空
          </Text>
        </View>

        {Object.entries(groupedCart).map(([stallId, items]) => {
          const stall = mockStalls.find((s) => s.id === stallId);
          return (
            <View key={stallId} className={styles.cartItem}>
              <View className={styles.cartHeader}>
                <View className={styles.stallAvatar}>🏪</View>
                <Text className={styles.stallName}>{stall?.name || '摊位'}</Text>
                <TagBadge variant="primary">预订</TagBadge>
              </View>

              {items.map((item) => (
                <View key={item.productId} className={styles.productRow}>
                  <Image
                    className={styles.productImage}
                    src={item.image}
                    mode="aspectFill"
                  />
                  <View className={styles.productContent}>
                    <Text className={styles.productName}>{item.name}</Text>
                    <View className={styles.noteInputWrap}>
                      <Input
                        className={styles.noteInput}
                        placeholder="口味备注：如少糖、微辣..."
                        placeholderClass={styles.notePlaceholder}
                        value={item.note}
                        onInput={(e) => updateCartItemNote(item.productId, e.detail.value)}
                      />
                    </View>
                    <View className={styles.productPriceRow}>
                      <Text className={styles.productPrice}>
                        ¥{(item.price * item.quantity).toFixed(2)}
                      </Text>
                      <View className={styles.quantityControl}>
                        <Button
                          className={styles.qtyBtn}
                          onClick={() => handleMinus(item.productId, item.quantity)}
                        >
                          -
                        </Button>
                        <Text className={styles.qtyNum}>{item.quantity}</Text>
                        <Button
                          className={styles.qtyBtn}
                          onClick={() => handlePlus(item.productId, item.quantity)}
                        >
                          +
                        </Button>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          );
        })}

        <View className={styles.tasteSection}>
          <Text className={styles.tasteTitle}>🍽️ 我的口味偏好</Text>
          <View className={styles.tasteTags}>
            {tasteOptions.map((taste) => (
              <View
                key={taste}
                className={styles.tasteTag + (selectedTastes.includes(taste) ? ` ${styles.active}` : '')}
                onClick={() => toggleTaste(taste)}
              >
                {taste}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.groupBuySection}>
          <View className={styles.groupHeader}>
            <Text className={styles.groupTitle}>👥 喊邻居拼单</Text>
            <TagBadge variant="secondary">最高省20%</TagBadge>
          </View>
          <Text className={styles.groupDesc}>
            满3人成团享9折，满5人享85折，喊上老街坊一起更划算
          </Text>
          <Button className={styles.groupBtn} onClick={handleGroupBuy}>
            发起拼单，生成分享链接
          </Button>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.barContent}>
          <View>
            <View className={styles.priceArea}>
              <Text className={styles.priceLabel}>合计</Text>
              <Text className={styles.priceValue}>{totalPrice.toFixed(2)}</Text>
              <Text className={styles.priceUnit}>元</Text>
            </View>
            <Text className={styles.countInfo}>共 {totalCount} 件商品</Text>
          </View>
          <Button
            className={styles.submitBtn + (cart.length === 0 ? ` ${styles.disabled}` : '')}
            onClick={handleSubmit}
          >
            提交预订
          </Button>
        </View>
        <Text className={styles.preorderHint}>预订成功后，摊主会提前为您备好</Text>
      </View>
    </View>
  );
};

export default CartPage;
