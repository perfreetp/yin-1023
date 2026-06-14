import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import type { QueueItem as QueueItemType } from '@/types';
import { getQueueStatusText, getQueueStatusColor } from '@/utils';
import styles from './index.module.scss';

interface QueueItemProps {
  item: QueueItemType;
  onNavigate?: (item: QueueItemType) => void;
  onCancel?: (item: QueueItemType) => void;
}

const QueueItem: React.FC<QueueItemProps> = ({ item, onNavigate, onCancel }) => {
  const statusColor = getQueueStatusColor(item.status);
  const statusText = getQueueStatusText(item.status);

  const handleNavigate = () => {
    if (onNavigate) onNavigate(item);
  };

  const handleCancel = () => {
    Taro.showModal({
      title: '确认取消',
      content: '确定要取消排队吗？',
      success: (res) => {
        if (res.confirm && onCancel) onCancel(item);
      }
    });
  };

  const isActive = item.status === 'waiting' || item.status === 'calling';

  return (
    <View className={styles.queueItem}>
      <View className={styles.header}>
        <Text className={styles.stallName}>{item.stallName}</Text>
        <Text className={styles.statusBadge} style={{ background: `${statusColor}15`, color: statusColor }}>
          {statusText}
        </Text>
      </View>

      <View className={styles.numberArea}>
        <View className={styles.numberBox}>
          <Text className={styles.numberLabel}>我的号码</Text>
          <Text className={styles.myNumber}>{String(item.number).padStart(3, '0')}</Text>
        </View>
        <Text className={styles.arrow}>→</Text>
        <View className={styles.numberBox}>
          <Text className={styles.numberLabel}>当前叫号</Text>
          <Text className={styles.currentNumber}>{String(item.currentNumber).padStart(3, '0')}</Text>
        </View>
      </View>

      <View className={styles.infoArea}>
        <View className={styles.infoRow}>
          <Text className={styles.label}>前方等待</Text>
          <Text className={classnames(styles.value, item.aheadCount > 5 && styles.warning, item.aheadCount === 0 && styles.highlight)}>
            {item.aheadCount > 0 ? `${item.aheadCount} 桌` : '轮到您了！'}
          </Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.label}>预计等待</Text>
          <Text className={styles.value}>{item.estimatedTime}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.label}>取号时间</Text>
          <Text className={styles.value}>{item.createdAt}</Text>
        </View>
      </View>

      {isActive && (
        <View className={styles.footer}>
          <Button className={classnames(styles.btn, styles.ghost)} onClick={handleCancel}>
            取消排队
          </Button>
          <Button className={classnames(styles.btn, styles.primary)} onClick={handleNavigate}>
            导航到摊
          </Button>
        </View>
      )}
    </View>
  );
};

export default QueueItem;
