import React, { useState } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import type { GroupBuy } from '@/types';
import styles from './index.module.scss';

const GroupBuyPage: React.FC = () => {
  const { groupBuys, user, joinGroupBuy, settleGroupBuy } = useAppStore();
  const [activeTab, setActiveTab] = useState<'all' | 'joining' | 'mine'>('all');

  const filteredGroupBuys = groupBuys.filter((gb) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'joining') return gb.status === 'joining';
    if (activeTab === 'mine') return gb.members.some((m) => m.userId === user.id);
    return true;
  });

  const handleJoin = (groupId: string) => {
    const gb = groupBuys.find((g) => g.id === groupId);
    if (!gb) return;
    if (gb.members.some((m) => m.userId === user.id)) {
      Taro.showToast({ title: '您已在此拼单中', icon: 'none' });
      return;
    }
    if (gb.members.length >= gb.maxMembers) {
      Taro.showToast({ title: '拼单已满', icon: 'none' });
      return;
    }
    joinGroupBuy(groupId);
    Taro.showToast({ title: '加入拼单成功！', icon: 'success' });
  };

  const handleSettle = (groupId: string) => {
    settleGroupBuy(groupId);
    Taro.showToast({ title: '已发起分摊，通知成员付款', icon: 'success' });
  };

  const handleCreate = () => {
    Taro.showToast({ title: '功能开发中', icon: 'none' });
  };

  const getStatusBadge = (status: GroupBuy['status']) => {
    switch (status) {
      case 'joining':
        return { text: '拼单中', className: styles.badgeJoining };
      case 'settled':
        return { text: '分摊中', className: styles.badgeSettled };
      case 'completed':
        return { text: '已完成', className: styles.badgeSettled };
      default:
        return { text: status, className: styles.badgeJoining };
    }
  };

  const renderSplitDetail = (groupBuy: GroupBuy) => {
    const discountTotal = groupBuy.totalPrice * groupBuy.shareDiscount;
    return (
      <View className={styles.card}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>💰 拼单分摊</Text>
          <Text style={{ fontSize: '24rpx', color: '#A39E97' }}>
            原价¥{groupBuy.totalPrice} → 优惠后¥{discountTotal.toFixed(2)}
          </Text>
        </View>
        {groupBuy.members.map((member, idx) => (
          <View key={idx} className={styles.splitRow}>
            <Image
              className={styles.splitAvatar}
              src={member.avatar}
              mode="aspectFill"
            />
            <View className={styles.splitInfo}>
              <Text className={styles.splitName}>
                {member.userName}
                {idx === 0 && <Text style={{ color: '#FFB627', marginLeft: '8rpx', fontSize: '20rpx' }}>发起人</Text>}
              </Text>
              <Text className={styles.splitItems}>
                {member.products.length > 0
                  ? member.products.map((p) => p.name).join('、')
                  : '尚未选择商品'}
              </Text>
            </View>
            <Text className={styles.splitShare}>¥{member.share.toFixed(2)}</Text>
          </View>
        ))}
        <View style={{
          marginTop: '16rpx',
          padding: '16rpx',
          background: 'rgba(46,196,182,0.08)',
          borderRadius: '12rpx',
          textAlign: 'center'
        }}>
          <Text style={{ fontSize: '24rpx', color: '#2EC4B6' }}>
            每人应付如上，确认后即可付款取货
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>🤝 熟客拼单</Text>
        <Text className={styles.headerDesc}>邻里街坊一起买，分摊运费更划算</Text>
      </View>

      <View className={styles.tabs}>
        {[
          { key: 'all', label: '全部拼单' },
          { key: 'joining', label: '拼单中' },
          { key: 'mine', label: '我的拼单' }
        ].map((tab) => (
          <View
            key={tab.key}
            className={styles.tab + (activeTab === tab.key ? ` ${styles.tabActive}` : '')}
            onClick={() => setActiveTab(tab.key as any)}
          >
            {tab.label}
          </View>
        ))}
      </View>

      {filteredGroupBuys.length === 0 ? (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🍜</Text>
          <Text className={styles.emptyTitle}>还没有拼单</Text>
          <Text className={styles.emptyDesc}>点击右下角发起拼单，拉上街坊邻居一起买</Text>
        </View>
      ) : (
        <View className={styles.section}>
          {filteredGroupBuys.map((groupBuy) => {
            const badge = getStatusBadge(groupBuy.status);
            const progress = (groupBuy.members.length / groupBuy.maxMembers) * 100;
            const isInitiator = groupBuy.initiatorId === user.id;
            const isMember = groupBuy.members.some((m) => m.userId === user.id);

            return (
              <View key={groupBuy.id}>
                <View className={styles.card}>
                  <View className={styles.cardHeader}>
                    <Text className={styles.stallName}>📍 {groupBuy.stallName}</Text>
                    <View className={styles.badge + ` ${badge.className}`}>{badge.text}</View>
                  </View>

                  <View className={styles.initiator}>
                    <Image
                      className={styles.initiatorAvatar}
                      src={groupBuy.members[0].avatar}
                      mode="aspectFill"
                    />
                    <View className={styles.initiatorInfo}>
                      <Text className={styles.initiatorName}>
                        {groupBuy.initiatorName}
                        <Text className={styles.initiatorTag}>发起人</Text>
                      </Text>
                      <Text className={styles.deadline}>⏰ {groupBuy.deadline}</Text>
                    </View>
                  </View>

                  <View className={styles.productList}>
                    {groupBuy.members.flatMap((m) => m.products).slice(0, 3).map((product, idx) => (
                      <View key={idx} className={styles.productRow}>
                        <Image
                          className={styles.productImg}
                          src={product.image}
                          mode="aspectFill"
                        />
                        <View className={styles.productInfo}>
                          <Text className={styles.productName}>{product.name} × {product.quantity}</Text>
                          <Text className={styles.productPrice}>¥{product.price}/{product.quantity > 1 ? '份' : '个'}</Text>
                        </View>
                      </View>
                    ))}
                    {groupBuy.members.flatMap((m) => m.products).length > 3 && (
                      <Text style={{ fontSize: '22rpx', color: '#A39E97', padding: '8rpx 0' }}>
                        ...还有 {groupBuy.members.flatMap((m) => m.products).length - 3} 件商品
                      </Text>
                    )}
                  </View>

                  <View className={styles.membersRow}>
                    <View className={styles.memberAvatars}>
                      {groupBuy.members.slice(0, 3).map((member, idx) => (
                        <Image
                          key={idx}
                          className={styles.memberAvatar}
                          src={member.avatar}
                          mode="aspectFill"
                        />
                      ))}
                      {groupBuy.members.length > 3 && (
                        <View className={styles.memberAvatar}>+{groupBuy.members.length - 3}</View>
                      )}
                    </View>
                    <View className={styles.memberInfo}>
                      <Text className={styles.memberText}>
                        已拼 {groupBuy.members.length}/{groupBuy.maxMembers} 人
                        {groupBuy.minMembers > groupBuy.members.length && (
                          <Text style={{ color: '#FF6B35' }}> · 还差{groupBuy.minMembers - groupBuy.members.length}人成团</Text>
                        )}
                        {groupBuy.minMembers <= groupBuy.members.length && groupBuy.status === 'joining' && (
                          <Text style={{ color: '#00B42A' }}> · 已成团</Text>
                        )}
                      </Text>
                      <View className={styles.progressBar}>
                        <View className={styles.progressFill} style={{ width: `${progress}%` }} />
                      </View>
                    </View>
                  </View>

                  <View className={styles.cardFooter}>
                    <View className={styles.priceInfo}>
                      <Text className={styles.totalPrice}>合计 ¥{groupBuy.totalPrice}</Text>
                      <Text className={styles.discountInfo}>拼单省 {Math.round((1 - groupBuy.shareDiscount) * 100)}% 优惠</Text>
                    </View>
                    {groupBuy.status === 'joining' && !isMember && (
                      <Button className={styles.joinBtn} onClick={() => handleJoin(groupBuy.id)}>
                        我要拼
                      </Button>
                    )}
                    {groupBuy.status === 'joining' && isMember && !isInitiator && (
                      <View className={styles.joinBtn} style={{ background: '#EDE6DF', color: '#A39E97' }}>
                        已加入
                      </View>
                    )}
                    {groupBuy.status === 'joining' && isInitiator && groupBuy.members.length >= groupBuy.minMembers && (
                      <Button className={styles.settleBtn} onClick={() => handleSettle(groupBuy.id)}>
                        发起分摊
                      </Button>
                    )}
                    {groupBuy.status === 'joining' && isInitiator && groupBuy.members.length < groupBuy.minMembers && (
                      <View className={styles.settleBtn} style={{ background: '#EDE6DF', color: '#A39E97' }}>
                        还差{groupBuy.minMembers - groupBuy.members.length}人
                      </View>
                    )}
                    {groupBuy.status === 'settled' && (
                      <Button className={styles.settleBtn} onClick={() => Taro.showToast({ title: '确认付款', icon: 'none' })}>
                        确认付款
                      </Button>
                    )}
                  </View>
                </View>

                {groupBuy.status === 'settled' && renderSplitDetail(groupBuy)}
              </View>
            );
          })}
        </View>
      )}

      <View className={styles.fabBtn} onClick={handleCreate}>＋</View>
    </View>
  );
};

export default GroupBuyPage;
