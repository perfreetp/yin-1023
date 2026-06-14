import React, { useState, useMemo } from 'react';
import { View, Text, Button, Image, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import styles from './index.module.scss';

const VendorDashboardPage: React.FC = () => {
  const {
    bookings, vendorProducts, updateBookingStatus,
    addVendorProduct, updateVendorProductStock
  } = useAppStore();

  const VENDOR_STALL_ID = 's001';
  const [isOpen, setIsOpen] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showClosingSummary, setShowClosingSummary] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductUnit, setNewProductUnit] = useState('个');

  const vendorBookings = bookings.filter((b) => b.stallId === VENDOR_STALL_ID);

  const pendingBookings = vendorBookings.filter(
    (b) => b.status === 'pending' || b.status === 'confirmed'
  );

  const stallProducts = vendorProducts.filter((p) => p.stallId === VENDOR_STALL_ID);

  const todayRevenue = useMemo(() =>
    vendorBookings
      .filter((b) => b.status === 'completed' || b.status === 'ready')
      .reduce((sum, b) => sum + b.totalPrice, 0),
    [vendorBookings]
  );

  const todayOrders = vendorBookings.filter(
    (b) => b.status !== 'cancelled'
  ).length;

  const pendingCount = pendingBookings.length;
  const readyCount = vendorBookings.filter((b) => b.status === 'ready').length;

  const actions = [
    { icon: '📝', name: '快速上架', onClick: () => setShowAddProduct(true) },
    { icon: '🔢', name: '叫号管理', onClick: () => Taro.switchTab({ url: '/pages/queue/index' }) },
    { icon: '💬', name: '回复评价', onClick: () => Taro.navigateTo({ url: '/pages/review/index' }) },
    { icon: '🧾', name: '收摊清单', onClick: () => setShowClosingSummary(true) }
  ];

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    Taro.showToast({
      title: !isOpen ? '已开摊！祝生意兴隆' : '已收摊，明天见',
      icon: 'none'
    });
  };

  const handleConfirm = (bookingId: string) => {
    updateBookingStatus(bookingId, 'confirmed');
    Taro.showToast({ title: '已确认，开始备货', icon: 'success' });
  };

  const handleReady = (bookingId: string) => {
    updateBookingStatus(bookingId, 'ready');
    Taro.showToast({ title: '已通知熟客取货', icon: 'success' });
  };

  const adjustStock = (productId: string, delta: number) => {
    const product = vendorProducts.find((p) => p.id === productId);
    if (!product) return;
    const newStock = Math.max(0, product.stock + delta);
    updateVendorProductStock(productId, newStock);
  };

  const handleAddProduct = () => {
    if (!newProductName.trim()) {
      Taro.showToast({ title: '请输入商品名', icon: 'none' });
      return;
    }
    const price = parseFloat(newProductPrice);
    if (isNaN(price) || price <= 0) {
      Taro.showToast({ title: '请输入有效价格', icon: 'none' });
      return;
    }
    const stock = parseInt(newProductStock) || 10;
    addVendorProduct(newProductName.trim(), price, stock, newProductUnit);
    setShowAddProduct(false);
    setNewProductName('');
    setNewProductPrice('');
    setNewProductStock('');
    setNewProductUnit('个');
    Taro.showToast({ title: '商品上架成功！', icon: 'success' });
  };

  const lowStockCount = stallProducts.filter((p) => p.stock / p.maxStock <= 0.3).length;

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
            <Text className={styles.statNum}>¥{todayRevenue}</Text>
            <Text className={styles.statLabel}>今日营收</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statNum}>{todayOrders}</Text>
            <Text className={styles.statLabel}>今日订单</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statNum}>{pendingCount}</Text>
            <Text className={styles.statLabel}>待处理</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statNum}>{lowStockCount}</Text>
            <Text className={styles.statLabel}>库存预警</Text>
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
            <View className={styles.sectionBadge}>{pendingCount} 单</View>
          </View>
          {pendingBookings.length > 0 ? pendingBookings.map((booking) => (
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
          )) : (
            <View style={{ padding: '32rpx', textAlign: 'center' }}>
              <Text style={{ fontSize: '26rpx', color: '#A39E97' }}>✅ 所有预订已处理</Text>
            </View>
          )}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>📦 商品库存</Text>
            <View className={styles.sectionBadge}>
              {stallProducts.length} 种商品
            </View>
          </View>
          <View className={styles.productManage}>
            {stallProducts.map((product) => {
              const ratio = product.maxStock > 0 ? product.stock / product.maxStock : 0;
              const lowStock = ratio <= 0.3;
              return (
                <View key={product.id} className={styles.productRow}>
                  <Image
                    className={styles.productImg}
                    src={product.image}
                    mode="aspectFill"
                  />
                  <View className={styles.productInfo}>
                    <Text className={styles.productName}>
                      {product.name}
                      {product.tags?.includes('新上架') && <Text className={styles.newTag}>新</Text>}
                    </Text>
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
                    <Text className={styles.stockNum}>{product.stock}</Text>
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

      {showAddProduct && (
        <View className={styles.modalOverlay} onClick={() => setShowAddProduct(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>📝 快速上架新商品</Text>
              <View className={styles.modalClose} onClick={() => setShowAddProduct(false)}>✕</View>
            </View>
            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>商品名称</Text>
              <Input
                className={styles.formInput}
                placeholder="如：鲜肉大包"
                value={newProductName}
                onInput={(e) => setNewProductName(e.detail.value)}
              />
            </View>
            <View className={styles.formRow}>
              <View className={styles.formRowItem}>
                <Text className={styles.formLabel}>价格（元）</Text>
                <Input
                  className={styles.formInput}
                  type="digit"
                  placeholder="3.5"
                  value={newProductPrice}
                  onInput={(e) => setNewProductPrice(e.detail.value)}
                />
              </View>
              <View className={styles.formRowItem}>
                <Text className={styles.formLabel}>库存数量</Text>
                <Input
                  className={styles.formInput}
                  type="number"
                  placeholder="20"
                  value={newProductStock}
                  onInput={(e) => setNewProductStock(e.detail.value)}
                />
              </View>
            </View>
            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>单位</Text>
              <View style={{ display: 'flex', gap: '16rpx' }}>
                {['个', '斤', '杯', '盒'].map((u) => (
                  <View
                    key={u}
                    style={{
                      padding: '12rpx 32rpx',
                      borderRadius: '24rpx',
                      background: newProductUnit === u ? '#FF6B35' : '#FFF0E8',
                      color: newProductUnit === u ? '#FFFFFF' : '#6B6560',
                      fontSize: '26rpx'
                    }}
                    onClick={() => setNewProductUnit(u)}
                  >
                    {u}
                  </View>
                ))}
              </View>
            </View>
            <Button className={styles.submitBtn} onClick={handleAddProduct}>
              确认上架
            </Button>
          </View>
        </View>
      )}

      {showClosingSummary && (
        <View className={styles.modalOverlay} onClick={() => setShowClosingSummary(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>🧾 收摊清单</Text>
              <View className={styles.modalClose} onClick={() => setShowClosingSummary(false)}>✕</View>
            </View>

            <View className={styles.summaryCard}>
              <Text style={{ fontSize: '28rpx', fontWeight: '600', color: '#2D2A26', marginBottom: '16rpx', display: 'block' }}>
                💰 今日营收
              </Text>
              <View className={styles.summaryRow}>
                <Text className={styles.summaryLabel}>完成订单营收</Text>
                <Text className={styles.summaryHighlight}>¥{todayRevenue.toFixed(2)}</Text>
              </View>
              <View className={styles.summaryRow}>
                <Text className={styles.summaryLabel}>今日订单数</Text>
                <Text className={styles.summaryValue}>{todayOrders} 单</Text>
              </View>
              <View className={styles.summaryRow}>
                <Text className={styles.summaryLabel}>待取货订单</Text>
                <Text className={styles.summaryValue}>{readyCount} 单</Text>
              </View>
            </View>

            <View className={styles.summaryCard}>
              <Text style={{ fontSize: '28rpx', fontWeight: '600', color: '#2D2A26', marginBottom: '16rpx', display: 'block' }}>
                📦 剩余库存
              </Text>
              {stallProducts.filter((p) => p.stock > 0).map((product) => (
                <View key={product.id} className={styles.summaryRow}>
                  <Text className={styles.summaryLabel}>
                    {product.name}
                    {product.stock / product.maxStock <= 0.3 && <Text className={styles.summaryWarning}> ⚠️</Text>}
                  </Text>
                  <Text className={styles.summaryValue}>
                    {product.stock}/{product.maxStock}{product.unit}
                  </Text>
                </View>
              ))}
            </View>

            <View className={styles.summaryCard}>
              <Text style={{ fontSize: '28rpx', fontWeight: '600', color: '#2D2A26', marginBottom: '16rpx', display: 'block' }}>
                ⚠️ 未处理事项
              </Text>
              {pendingCount > 0 ? (
                <View className={styles.summaryRow}>
                  <Text className={styles.summaryLabel}>待处理预订</Text>
                  <Text className={styles.summaryWarning}>{pendingCount} 单</Text>
                </View>
              ) : null}
              {readyCount > 0 && (
                <View className={styles.summaryRow}>
                  <Text className={styles.summaryLabel}>未取货预订</Text>
                  <Text className={styles.summaryWarning}>
                    {readyCount} 单
                  </Text>
                </View>
              )}
              {lowStockCount > 0 && (
                <View className={styles.summaryRow}>
                  <Text className={styles.summaryLabel}>库存预警商品</Text>
                  <Text className={styles.summaryWarning}>{lowStockCount} 种</Text>
                </View>
              )}
              {pendingCount === 0 && readyCount === 0 && lowStockCount === 0 && (
                <Text style={{ fontSize: '26rpx', color: '#00B42A', textAlign: 'center', padding: '16rpx' }}>
                  ✅ 今天一切顺利，没有未处理事项
                </Text>
              )}
            </View>

            <Button
              className={styles.submitBtn}
              onClick={() => {
                setShowClosingSummary(false);
                toggleOpen();
              }}
            >
              确认收摊
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default VendorDashboardPage;
