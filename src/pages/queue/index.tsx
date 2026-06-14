import React, { useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import QueueItem from '@/components/QueueItem';
import EmptyState from '@/components/EmptyState';
import { useAppStore } from '@/store/useAppStore';
import { mockStalls } from '@/data/stalls';
import type { QueueItem as QueueItemType } from '@/types';
import styles from './index.module.scss';

const quickStalls = [
  { id: 's001', emoji: '🥟', name: '张记包子铺' },
  { id: 's004', emoji: '🍗', name: '陈记卤味' },
  { id: 's010', emoji: '🥩', name: '郑氏鲜肉' },
  { id: 's003', emoji: '🥬', name: '李婶蔬菜' }
];

const outOfStockOptions = ['换鲜肉大包', '换豆沙包', '改约明天', '直接退款'];

const QueuePage: React.FC = () => {
  const { queueItems, takeQueueNumber, cancelQueue, setNavigateStallId, setNavigationReturnUrl } = useAppStore();
  const [selectedStall, setSelectedStall] = useState<string | null>(null);

  const handleQuickTake = () => {
    if (!selectedStall) {
      Taro.showToast({ title: '请先选择摊位', icon: 'none' });
      return;
    }
    const stall = mockStalls.find((s) => s.id === selectedStall);
    const stallQueue = queueItems.filter((q) => q.stallId === selectedStall && q.status !== 'cancelled' && q.status !== 'completed');
    const currentNumber = stallQueue.length > 0 ? Math.max(...stallQueue.map((q) => q.number)) : Math.floor(Math.random() * 20) + 10;

    Taro.showLoading({ title: '取号中...' });
    setTimeout(() => {
      const queueId = takeQueueNumber(selectedStall, stall?.name || '摊位', currentNumber);
      Taro.hideLoading();
      const newItem = useAppStore.getState().queueItems.find((q) => q.id === queueId);
      Taro.showModal({
        title: '取号成功！',
        content: `${stall?.name} · 您的号码是 ${String(newItem?.number || 0).padStart(3, '0')}，前方${newItem?.aheadCount || 0}桌`,
        showCancel: false,
        confirmText: '知道了'
      });
    }, 600);
  };

  const handleNavigate = (item: QueueItemType) => {
    setNavigateStallId(item.stallId);
    setNavigationReturnUrl('/pages/queue/index');
    Taro.navigateTo({ url: '/pages/navigation/index' });
  };

  const handleCancel = (item: QueueItemType) => {
    cancelQueue(item.id);
    Taro.showToast({ title: '已取消排队', icon: 'none' });
  };

  const activeQueue = queueItems.filter((q) => q.status !== 'cancelled');
  const historyQueue = queueItems.filter((q) => q.status === 'completed' || q.status === 'serving');
  const openStalls = mockStalls.filter((s) => s.isOpen);

  return (
    <View className={styles.page}>
      <View className={styles.heroCard}>
        <Text className={styles.heroTitle}>🏪 现场叫号</Text>
        <Text className={styles.heroDesc}>取号后安心逛，叫号提醒不白等</Text>
        <View className={styles.heroStats}>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{activeQueue.length}</Text>
            <Text className={styles.statLabel}>我的排队</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{openStalls.length}</Text>
            <Text className={styles.statLabel}>营业摊位</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>~3min</Text>
            <Text className={styles.statLabel}>平均等待</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.quickTake}>
          <Text className={styles.quickTitle}>⚡ 快速取号</Text>
          <View className={styles.stallOptions}>
            {quickStalls.map((stall) => (
              <View
                key={stall.id}
                className={styles.stallOption + (selectedStall === stall.id ? ` ${styles.active}` : '')}
                onClick={() => setSelectedStall(selectedStall === stall.id ? null : stall.id)}
              >
                <Text className={styles.stallEmoji}>{stall.emoji}</Text>
                <Text className={styles.stallOptionName}>{stall.name}</Text>
              </View>
            ))}
          </View>
          <Button
            className={styles.queueBtn + (!selectedStall ? ` ${styles.disabled}` : '')}
            onClick={handleQuickTake}
          >
            立即取号
          </Button>
        </View>

        <View className={styles.noticeCard}>
          <Text className={styles.noticeIcon}>💡</Text>
          <View className={styles.noticeContent}>
            <Text className={styles.noticeTitle}>叫号小提示</Text>
            <Text className={styles.noticeText}>
              {'\n'}1. 取号后会通过小程序提醒您{'\n'}
              2. 叫号后5分钟内未到，号码会过号哦{'\n'}
              3. 过号可凭记录延后3桌安排
            </Text>
          </View>
        </View>

        <View className={styles.myQueueSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>📋 我的排队</Text>
            <Text className={styles.sectionMore}>历史记录 ›</Text>
          </View>

          {activeQueue.length > 0 ? (
            activeQueue.map((item) => (
              <QueueItem
                key={item.id}
                item={item}
                onNavigate={handleNavigate}
                onCancel={handleCancel}
              />
            ))
          ) : (
            <EmptyState
              icon="🎫"
              title="还没有在排队"
              description="选择喜欢的摊位取号，不用站着等"
            />
          )}
        </View>

        {historyQueue.length > 0 && (
          <View className={styles.myQueueSection}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>📋 历史记录</Text>
            </View>
            {historyQueue.map((item) => (
              <QueueItem
                key={item.id}
                item={item}
                onNavigate={handleNavigate}
                onCancel={handleCancel}
              />
            ))}
          </View>
        )}

        <View className={styles.changeConfig}>
          <Text className={styles.configTitle}>🔄 缺货改配</Text>
          <View className={styles.configRow}>
            <Text className={styles.configLabel}>遇到缺货时</Text>
            <Text className={styles.configValue}>自动联系我确认 ›</Text>
          </View>
          <View className={styles.configRow}>
            <Text className={styles.configLabel}>偏好替代品</Text>
          </View>
          <View className={styles.outOfStockList}>
            {outOfStockOptions.map((opt, idx) => (
              <View key={idx} className={styles.outOfStockItem}>
                ✔️ {opt}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default QueuePage;
