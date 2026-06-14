import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📦',
  title,
  description
}) => {
  return (
    <View className={styles.emptyState}>
      <View className={styles.icon}>{icon}</View>
      <Text className={styles.title}>{title}</Text>
      {description && <Text className={styles.desc}>{description}</Text>}
    </View>
  );
};

export default EmptyState;
