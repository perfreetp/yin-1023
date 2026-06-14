import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import type { Booking } from '@/types';
import { getStatusText, getStatusColor } from '@/utils';
import styles from './index.module.scss';

interface BookingItemProps {
  booking: Booking;
  onReview?: (booking: Booking) => void;
  onPickup?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
}

const BookingItem: React.FC<BookingItemProps> = ({ booking, onReview, onPickup, onCancel }) => {
  const statusColor = getStatusColor(booking.status);
  const statusText = getStatusText(booking.status);

  const handleClick = () => {
    Taro.navigateTo({ url: `/pages/booking-detail/index?id=${booking.id}` });
  };

  const handlePickup = () => {
    Taro.showModal({
      title: '取货码',
      content: `向摊主出示取货码：${booking.pickupCode}`,
      showCancel: false,
      confirmText: '知道了'
    });
    if (onPickup) onPickup(booking);
  };

  const handleCancel = () => {
    Taro.showModal({
      title: '确认取消',
      content: '确定要取消这个预订吗？',
      success: (res) => {
        if (res.confirm && onCancel) onCancel(booking);
      }
    });
  };

  const handleReview = () => {
    if (onReview) onReview(booking);
  };

  return (
    <View className={styles.bookingItem} onClick={handleClick}>
      <View className={styles.header}>
        <View style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
          <Text className={styles.stallName}>{booking.stallName}</Text>
          {booking.isGroupBuy && (
            <View className={styles.groupBadge}>👥 拼单</View>
          )}
        </View>
        <Text className={styles.statusTag} style={{ background: `${statusColor}15`, color: statusColor }}>
          {statusText}
        </Text>
      </View>

      <View className={styles.productList}>
        {booking.products.map((p, idx) => (
          <View key={idx} className={styles.productRow}>
            <Image className={styles.productImage} src={p.image} mode="aspectFill" />
            <View className={styles.productInfo}>
              <Text className={styles.productName}>{p.name}</Text>
              <Text className={styles.productMeta}>
                {p.note || ''} x{p.quantity}
              </Text>
            </View>
            <Text className={styles.productPrice}>¥{(p.price * p.quantity).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
        <View className={styles.codeBox}>
          <Text className={styles.codeLabel}>取货码</Text>
          <Text className={styles.codeValue}>{booking.pickupCode}</Text>
        </View>
      )}

      <View className={styles.infoRow}>
        <Text className={styles.label}>取货时间</Text>
        <Text className={styles.value}>{booking.pickupDate}</Text>
      </View>
      {booking.note && (
        <View className={styles.infoRow}>
          <Text className={styles.label}>备注</Text>
          <Text className={styles.value}>{booking.note}</Text>
        </View>
      )}

      <View className={styles.footer}>
        <Text className={styles.totalPrice}>
          合计
          <Text className={styles.price}>¥{booking.totalPrice.toFixed(2)}</Text>
        </Text>
        <View className={styles.actions}>
          {booking.status === 'pending' && (
            <Button className={classnames(styles.btn, styles.ghost)} onClick={handleCancel}>
              取消预订
            </Button>
          )}
          {booking.status === 'confirmed' && (
            <Button className={classnames(styles.btn, styles.primary)} onClick={handlePickup}>
              出示取货码
            </Button>
          )}
          {booking.status === 'ready' && (
            <Button className={classnames(styles.btn, styles.primary)} onClick={handlePickup}>
              出示取货码
            </Button>
          )}
          {booking.status === 'completed' && (
            <Button className={classnames(styles.btn, styles.success)} onClick={handleReview}>
              去评价
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};

export default BookingItem;
