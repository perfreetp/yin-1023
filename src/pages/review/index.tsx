import React, { useState } from 'react';
import { View, Text, Button, Image, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockReviews, pendingReviews } from '@/data/reviews';
import type { Review } from '@/types';
import styles from './index.module.scss';

const ReviewPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'my' | 'all'>('pending');
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [writingReview, setWritingReview] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const ratingOptions = [
    { value: 5, label: '⭐⭐⭐⭐⭐ 非常满意' },
    { value: 4, label: '⭐⭐⭐⭐ 满意' },
    { value: 3, label: '⭐⭐⭐ 一般' },
    { value: 2, label: '⭐⭐ 不满意' },
    { value: 1, label: '⭐ 很差' }
  ];

  const availableTags = [
    '味道好', '分量足', '取货快', '服务好',
    '新鲜', '价格实惠', '熟客优惠', '可备注',
    '拼单划算', '叫号方便'
  ];

  const renderStars = (count: number) => {
    return [...Array(5)].map((_, i) => (
      <Text key={i} className={styles.star}>
        {i < count ? '⭐' : '☆'}
      </Text>
    ));
  };

  const handleStartReview = (id: string) => {
    setWritingReview(id);
    setRating(5);
    setContent('');
    setSelectedTags([]);
  };

  const handleCancelReview = () => {
    setWritingReview(null);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      Taro.showToast({ title: '请填写评价内容', icon: 'none' });
      return;
    }
    Taro.showToast({ title: '评价提交成功', icon: 'success' });
    console.log('[Review] 提交评价:', { rating, content, tags: selectedTags });
    setWritingReview(null);
  };

  const handleSkip = (id: string) => {
    Taro.showToast({ title: '已跳过', icon: 'none' });
    console.log('[Review] 跳过评价:', id);
  };

  const handleNextBooking = () => {
    Taro.showToast({ title: '已预约续单，明日提醒', icon: 'success' });
    console.log('[Review] 次日预约续单');
  };

  const handleReply = (reviewId: string) => {
    Taro.showToast({ title: '回复评价功能', icon: 'none' });
    console.log('[Review] 摊主回复评价:', reviewId);
  };

  const myReviews = reviews.filter((r) => r.userId === 'u001');

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>⭐ 评价中心</Text>
        <Text className={styles.headerDesc}>真实评价，让好摊主生意更红火</Text>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{pendingReviews.length}</Text>
          <Text className={styles.statLabel}>待评价</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{myReviews.length}</Text>
          <Text className={styles.statLabel}>我的评价</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNum}>{reviews.length}</Text>
          <Text className={styles.statLabel}>全部评价</Text>
        </View>
      </View>

      <View className={styles.tabs}>
        {[
          { key: 'pending', label: `待评价(${pendingReviews.length})` },
          { key: 'my', label: '我的评价' },
          { key: 'all', label: '全部评价' }
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

      {activeTab === 'pending' && (
        <View className={styles.section}>
          {pendingReviews.length === 0 ? (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>🎉</Text>
              <Text className={styles.emptyTitle}>暂无待评价订单</Text>
              <Text className={styles.emptyDesc}>快去买好吃的吧~</Text>
            </View>
          ) : (
            pendingReviews.map((item) => (
              <View key={item.id}>
                <View className={styles.pendingCard}>
                  <View className={styles.pendingHeader}>
                    <Image
                      className={styles.pendingCover}
                      src={item.stallCover}
                      mode="aspectFill"
                    />
                    <View className={styles.pendingInfo}>
                      <Text className={styles.pendingStall}>{item.stallName}</Text>
                      <Text className={styles.pendingTime}>完成于 {item.completedAt}</Text>
                    </View>
                  </View>

                  <View className={styles.pendingProducts}>
                    {item.products.map((p, idx) => (
                      <Text key={idx} className={styles.pendingProduct}>
                        · {p.name} × {p.quantity}
                      </Text>
                    ))}
                  </View>

                  {writingReview !== item.id ? (
                    <View className={styles.pendingActions}>
                      <Button className={styles.btnSkip} onClick={() => handleSkip(item.id)}>
                        稍后再说
                      </Button>
                      <Button className={styles.btnReview} onClick={() => handleStartReview(item.id)}>
                        去评价
                      </Button>
                    </View>
                  ) : null}
                </View>

                {writingReview === item.id && (
                  <View className={styles.reviewForm}>
                    <View className={styles.formSection}>
                      <Text className={styles.formLabel}>评分</Text>
                      <View className={styles.ratingSelect}>
                        {ratingOptions.map((opt) => (
                          <View
                            key={opt.value}
                            className={styles.ratingOption + (rating === opt.value ? ` ${styles.ratingSelected}` : '')}
                            onClick={() => setRating(opt.value)}
                          >
                            {opt.label.split(' ')[0]}
                          </View>
                        ))}
                      </View>
                    </View>

                    <View className={styles.formSection}>
                      <Text className={styles.formLabel}>评价内容</Text>
                      <Textarea
                        className={styles.textarea}
                        placeholder="说说你的真实感受，帮助其他街坊邻居~"
                        value={content}
                        onInput={(e) => setContent(e.detail.value)}
                        maxlength={500}
                      />
                    </View>

                    <View className={styles.formSection}>
                      <Text className={styles.formLabel}>添加标签</Text>
                      <View className={styles.tagOptions}>
                        {availableTags.map((tag) => (
                          <View
                            key={tag}
                            className={styles.tagOption + (selectedTags.includes(tag) ? ` ${styles.tagSelected}` : '')}
                            onClick={() => toggleTag(tag)}
                          >
                            {tag}
                          </View>
                        ))}
                      </View>
                    </View>

                    <Button className={styles.submitBtn} onClick={handleSubmit}>
                      提交评价
                    </Button>

                    <View className={styles.nextHint} onClick={handleNextBooking}>
                      🔔 明天还想买？一键预约续单
                    </View>

                    <View
                      style={{
                        marginTop: '20rpx',
                        textAlign: 'center',
                        fontSize: '24rpx',
                        color: '#A39E97'
                      }}
                      onClick={handleCancelReview}
                    >
                      取消
                    </View>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      )}

      {activeTab === 'my' && (
        <View className={styles.section}>
          {myReviews.length === 0 ? (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>✍️</Text>
              <Text className={styles.emptyTitle}>还没有写过评价</Text>
              <Text className={styles.emptyDesc}>给喜欢的摊位写个评价吧</Text>
            </View>
          ) : (
            myReviews.map((review) => (
              <View key={review.id} className={styles.reviewCard}>
                <View className={styles.reviewHeader}>
                  <View className={styles.reviewerAvatar}>👤</View>
                  <View className={styles.reviewerInfo}>
                    <Text className={styles.reviewerName}>
                      我
                      <Text className={styles.vipTag}>VIP熟客</Text>
                    </Text>
                    <Text className={styles.reviewTime}>{review.createdAt}</Text>
                  </View>
                  <View className={styles.ratingStars}>{renderStars(review.rating)}</View>
                </View>

                <Text className={styles.reviewContent}>{review.content}</Text>

                {review.images && review.images.length > 0 && (
                  <View className={styles.reviewImages}>
                    {review.images.map((img, idx) => (
                      <Image
                        key={idx}
                        className={styles.reviewImage}
                        src={img}
                        mode="aspectFill"
                      />
                    ))}
                  </View>
                )}

                <View className={styles.reviewTags}>
                  {review.tags.map((tag, idx) => (
                    <View key={idx} className={styles.reviewTag}>{tag}</View>
                  ))}
                </View>

                {review.reply && (
                  <View className={styles.replySection}>
                    <View className={styles.replyHeader}>
                      <Text className={styles.replyIcon}>💬</Text>
                      <Text className={styles.replyName}>摊主回复</Text>
                    </View>
                    <Text className={styles.replyContent}>{review.reply}</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      )}

      {activeTab === 'all' && (
        <View className={styles.section}>
          {reviews.map((review) => (
            <View key={review.id} className={styles.reviewCard}>
              <View className={styles.reviewHeader}>
                <Image
                  className={styles.reviewerAvatar}
                  src={review.avatar}
                  mode="aspectFill"
                />
                <View className={styles.reviewerInfo}>
                  <Text className={styles.reviewerName}>
                    {review.userName}
                    <Text className={styles.vipTag}>VIP熟客</Text>
                  </Text>
                  <Text className={styles.reviewTime}>{review.createdAt}</Text>
                </View>
                <View className={styles.ratingStars}>{renderStars(review.rating)}</View>
              </View>

              <Text className={styles.reviewContent}>{review.content}</Text>

              {review.images && review.images.length > 0 && (
                <View className={styles.reviewImages}>
                  {review.images.map((img, idx) => (
                    <Image
                      key={idx}
                      className={styles.reviewImage}
                      src={img}
                      mode="aspectFill"
                    />
                  ))}
                </View>
              )}

              <View className={styles.reviewTags}>
                {review.tags.map((tag, idx) => (
                  <View key={idx} className={styles.reviewTag}>{tag}</View>
                ))}
              </View>

              {review.reply ? (
                <View className={styles.replySection}>
                  <View className={styles.replyHeader}>
                    <Text className={styles.replyIcon}>💬</Text>
                    <Text className={styles.replyName}>摊主回复</Text>
                  </View>
                  <Text className={styles.replyContent}>{review.reply}</Text>
                </View>
              ) : (
                <View
                  style={{
                    marginTop: '16rpx',
                    fontSize: '24rpx',
                    color: '#FF6B35',
                    textAlign: 'right'
                  }}
                  onClick={() => handleReply(review.id)}
                >
                  摊主回复此评价 →
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ReviewPage;
