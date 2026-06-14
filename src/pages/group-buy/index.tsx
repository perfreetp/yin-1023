import React, { useState } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockGroupBuys } from '@/data/queue';
import type { GroupBuy } from '@/types';
import styles from './index.module.scss';

const GroupBuyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'joining' | 'mine'>('all');
  const [groupBuys, setGroupBuys] = useState<GroupBuy[]>(mockGroupBuys);

  const filteredGroupBuys = groupBuys.filter((gb) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'joining') return gb.status === 'joining';
    if (activeTab === 'mine') return gb.members.some((m) => m.userId === 'u001');
    return true;
  });

  const handleJoin = (groupId: string) => {
    Taro.showToast({ title: '加入拼单成功', icon: 'success' });
    console.log('[GroupBuy] 加入拼单:', groupId);
  };

  const handleSettle = (groupId: string) => {
    Taro.showToast({ title: '已发起分摊', icon: 'success' });
    console.log('[GroupBuy] 发起分摊:', groupId);
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

  const renderSplitDetail = (groupBuy: GroupBuy) => (
    <View className={styles.card}>
      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>💰 拼单分摊</Text>
        <Text style={{ fontSize: '24rpx', color: '#A39E97' }}>共¥{groupBuy.totalPrice}</Text>
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
              {member.products.map((p) => p.name).join('、')}
            </Text>
          </View>
          <Text className={styles.splitShare}>¥{member.share}</Text>
        </View>
      ))}
    </View>
  );

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
            const isInitiator = groupBuy.initiatorId === 'u001';

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
                      </Text>
                      <View className={styles.progressBar}>
                        <View className={styles.progressFill} style={{ width: `${progress}%` }} />
                      </View>
                    </View>
                  </View>

                  <View className={styles.cardFooter}>
                    <View className={styles.priceInfo}>
                      <Text className={styles.totalPrice}>合计 ¥{groupBuy.totalPrice}</Text>
                      <Text className={styles.discountInfo}>拼单省 {(groupBuy.shareDiscount * 10).toFixed(0)}% 优惠</Text>
                    </View>
                    {groupBuy.status === 'joining' && !isInitiator && (
                      <Button className={styles.joinBtn} onClick={() => handleJoin(groupBuy.id)}>
                        我要拼
                      </Button>
                    )}
                    {groupBuy.status === 'joining' && isInitiator && (
                      <Button className={styles.settleBtn} onClick={() => handleSettle(groupBuy.id)}>
                        发起分摊
                      </Button>
                    )}
                    {groupBuy.status === 'settled' && (
                      <Button className={styles.settleBtn} onClick={() => Taro.showToast({ title: '等待支付', icon: 'none' })}>
                        查看分摊
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
