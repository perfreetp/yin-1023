import React, { useState, useMemo } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import BookingItem from '@/components/BookingItem';
import EmptyState from '@/components/EmptyState';
import { useAppStore } from '@/store/useAppStore';
import type { Booking } from '@/types';
import styles from './index.module.scss';

type TabKey = 'all' | 'pending' | 'confirmed' | 'ready' | 'history';

const tabs: { key: TabKey; label: string; filter?: Booking['status'][] }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待确认', filter: ['pending'] },
  { key: 'confirmed', label: '备货中', filter: ['confirmed'] },
  { key: 'ready', label: '可取货', filter: ['ready'] },
  { key: 'history', label: '历史', filter: ['completed', 'cancelled'] }
];

const BookingPage: React.FC = () => {
  const { bookings, groupBuys, cancelBooking } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const filteredBookings = useMemo(() => {
    const currentTab = tabs.find((t) => t.key === activeTab);
    if (!currentTab?.filter) return bookings;
    return bookings.filter((b) => currentTab.filter!.includes(b.status));
  }, [activeTab, bookings]);

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const readyCount = bookings.filter((b) => b.status === 'ready').length;

  const handleTabClick = (key: TabKey) => {
    setActiveTab(key);
  };

  const handleReview = (booking: Booking) => {
    Taro.navigateTo({ url: '/pages/review/index' });
  };

  const handleCancel = (booking: Booking) => {
    cancelBooking(booking.id);
    Taro.showToast({ title: '已取消预订', icon: 'none' });
  };

  const handleGroupBuy = () => {
    Taro.navigateTo({ url: '/pages/group-buy/index' });
  };

  const handleNewBooking = () => {
    Taro.switchTab({ url: '/pages/stalls/index' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.tabRow}>
        {tabs.map((tab) => (
          <View
            key={tab.key}
            className={styles.tabItem + (activeTab === tab.key ? ` ${styles.active}` : '')}
            onClick={() => handleTabClick(tab.key)}
          >
            {tab.label}
            {tab.key === 'pending' && pendingCount > 0 && (
              <View className={styles.badge}>{pendingCount}</View>
            )}
            {tab.key === 'ready' && readyCount > 0 && (
              <View className={styles.badge}>{readyCount}</View>
            )}
          </View>
        ))}
      </View>

      <View className={styles.content}>
        <View className={styles.quickActions}>
          <View className={styles.actionCard} onClick={handleNewBooking}>
            <View className={styles.actionIcon} style={{ background: 'rgba(255,107,53,0.1)' }}>
              📝
            </View>
            <View className={styles.actionText}>
              <Text className={styles.title}>新建预订</Text>
              <Text className={styles.desc}>明天想吃啥先订好</Text>
            </View>
          </View>
          <View className={styles.actionCard} onClick={handleGroupBuy}>
            <View className={styles.actionIcon} style={{ background: 'rgba(46,196,182,0.1)' }}>
              👥
            </View>
            <View className={styles.actionText}>
              <Text className={styles.title}>发起拼单</Text>
              <Text className={styles.desc}>喊邻居一起更划算</Text>
            </View>
          </View>
        </View>

        {groupBuys.length > 0 && activeTab === 'all' && (
          <View className={styles.groupBuySection}>
            <Text className={styles.sectionTitle}>🫶 附近拼单中</Text>
            {groupBuys.filter((g) => g.status === 'joining').map((group) => (
              <View key={group.id} className={styles.groupCard} onClick={handleGroupBuy}>
                <View className={styles.groupHeader}>
                  <Text className={styles.groupTitle}>{group.stallName}</Text>
                  <Text className={styles.groupStatus}>
                    {group.members.length}/{group.maxMembers}人
                  </Text>
                </View>

                <View className={styles.groupInitiator}>
                  <Image
                    className={styles.initiatorAvatar}
                    src={group.members[0].avatar}
                    mode="aspectFill"
                  />
                  <View className={styles.initiatorInfo}>
                    <Text className={styles.name}>{group.initiatorName} 发起</Text>
                    <Text className={styles.label}>拼够立享 {(1 - group.shareDiscount) * 100}% 优惠</Text>
                  </View>
                </View>

                <View className={styles.groupMembers}>
                  <View className={styles.memberAvatars}>
                    {group.members.slice(0, 4).map((m, idx) => (
                      <Image
                        key={idx}
                        className={styles.memberAvatar}
                        src={m.avatar}
                        mode="aspectFill"
                      />
                    ))}
                  </View>
                  <Text className={styles.memberCount}>
                    还差 {Math.max(0, group.minMembers - group.members.length)} 人成团
                  </Text>
                </View>

                <View className={styles.groupDeadline}>
                  <Text className={styles.deadlineText}>⏰ {group.deadline}</Text>
                  <Button className={styles.groupJoinBtn} onClick={handleGroupBuy}>
                    加入拼单
                  </Button>
                </View>
              </View>
            ))}
          </View>
        )}

        {filteredBookings.length > 0 ? (
          <View className={styles.bookingList}>
            {filteredBookings.map((booking) => (
              <BookingItem
                key={booking.id}
                booking={booking}
                onReview={handleReview}
                onCancel={handleCancel}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            icon="📋"
            title="暂无预订记录"
            description="去今日摊位逛逛，提前预订更省心"
          />
        )}
      </View>
    </View>
  );
};

export default BookingPage;
