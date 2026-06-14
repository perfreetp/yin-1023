import React, { useMemo } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import { getStatusText, getStatusColor } from '@/utils';
import styles from './index.module.scss';

const BookingDetailPage: React.FC = () => {
  const router = useRouter();
  const bookingId = router.params.id;
  const { bookings, cancelBooking } = useAppStore();

  const booking = useMemo(() => bookings.find((b) => b.id === bookingId), [bookings, bookingId]);

  if (!booking) {
    return (
      <View className={styles.page}>
        <View className={styles.empty}>
          <Text className={styles.emptyIcon}>📋</Text>
          <Text className={styles.emptyText}>订单不存在</Text>
        </View>
      </View>
    );
  }

  const statusColor = getStatusColor(booking.status);
  const statusText = getStatusText(booking.status);

  const handleCancel = () => {
    Taro.showModal({
      title: '确认取消',
      content: '确定要取消这个预订吗？',
      success: (res) => {
        if (res.confirm) {
          cancelBooking(booking.id);
          Taro.showToast({ title: '已取消预订', icon: 'none' });
          setTimeout(() => Taro.navigateBack(), 500);
        }
      }
    });
  };

  const handleShowCode = () => {
    Taro.showModal({
      title: '取货码',
      content: `向摊主出示取货码：${booking.pickupCode}`,
      showCancel: false,
      confirmText: '知道了'
    });
  };

  const handleNavigate = () => {
    const st = useAppStore.getState();
    st.setNavigateStallId(booking.stallId);
    Taro.navigateTo({ url: '/pages/navigation/index' });
  };

  const handleReview = () => {
    Taro.navigateTo({ url: '/pages/review/index' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.statusCard} style={{ background: `linear-gradient(135deg, ${statusColor}20, ${statusColor}10)` }}>
        <Text className={styles.statusTag} style={{ background: statusColor, color: '#fff' }}>
          {statusText}
        </Text>
        <Text className={styles.stallName}>{booking.stallName}</Text>
        <Text className={styles.orderId}>订单号：{booking.id}</Text>
        <Text className={styles.createTime}>下单时间：{booking.createdAt}</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>📦 商品明细</Text>
          {booking.products.map((p, idx) => (
            <View key={idx} className={styles.productRow}>
              <Image className={styles.productImg} src={p.image} mode="aspectFill" />
              <View className={styles.productInfo}>
                <Text className={styles.productName}>{p.name}</Text>
                {p.note && <Text className={styles.productNote}>备注：{p.note}</Text>}
                <Text className={styles.productMeta}>¥{p.price} × {p.quantity}</Text>
              </View>
              <Text className={styles.productPrice}>¥{(p.price * p.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View className={styles.totalRow}>
            <Text className={styles.totalLabel}>合计</Text>
            <Text className={styles.totalPrice}>¥{booking.totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>🎫 取货码</Text>
            <View className={styles.codeBox}>
              <Text className={styles.codeLabel}>取货码</Text>
              <Text className={styles.codeValue}>{booking.pickupCode}</Text>
            </View>
          </View>
        )}

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>⏰ 取货时间</Text>
          <View className={styles.infoCard}>
            <Text className={styles.infoText}>{booking.pickupDate}</Text>
            {booking.estimatedReadyTime && (
              <Text className={styles.infoSub}>摊主预计备好：{booking.estimatedReadyTime}</Text>
            )}
          </View>
        </View>

        {(booking.note || booking.vendorNote) && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>📝 备注</Text>
            {booking.note && (
              <View className={styles.infoCard}>
                <Text className={styles.infoLabel}>我的备注</Text>
                <Text className={styles.infoText}>{booking.note}</Text>
              </View>
            )}
            {booking.vendorNote && (
              <View className={styles.infoCard}>
                <Text className={styles.infoLabel}>摊主留言</Text>
                <Text className={styles.infoText} style={{ color: '#FF6B35' }}>{booking.vendorNote}</Text>
              </View>
            )}
          </View>
        )}

        {booking.completedAt && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>✅ 完成记录</Text>
            <View className={styles.infoCard}>
              <Text className={styles.infoText}>取货完成时间：{booking.completedAt}</Text>
            </View>
          </View>
        )}
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.barContent}>
          <Text className={styles.barTotal}>
            合计 <Text className={styles.barPrice}>¥{booking.totalPrice.toFixed(2)}</Text>
          </Text>
          <View className={styles.barActions}>
            {booking.status === 'pending' && (
              <>
                <Button className={styles.btnGhost} onClick={handleCancel}>取消预订</Button>
                <Button className={styles.btnPrimary} onClick={handleNavigate}>导航到摊</Button>
              </>
            )}
            {booking.status === 'confirmed' && (
              <>
                <Button className={styles.btnGhost} onClick={handleShowCode}>出示取货码</Button>
                <Button className={styles.btnPrimary} onClick={handleNavigate}>导航到摊</Button>
              </>
            )}
            {booking.status === 'ready' && (
              <>
                <Button className={styles.btnGhost} onClick={handleNavigate}>导航到摊</Button>
                <Button className={styles.btnPrimary} onClick={handleShowCode}>出示取货码</Button>
              </>
            )}
            {booking.status === 'completed' && (
              <Button className={styles.btnPrimary} onClick={handleReview}>去评价</Button>
            )}
            {booking.status === 'cancelled' && (
              <Button className={styles.btnGhost} onClick={() => Taro.switchTab({ url: '/pages/stalls/index' })}>重新预订</Button>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default BookingDetailPage;
