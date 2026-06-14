import React from 'react';
import { View } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface TagBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'default';
  outline?: boolean;
  className?: string;
}

const TagBadge: React.FC<TagBadgeProps> = ({
  children,
  variant = 'default',
  outline = false,
  className
}) => {
  return (
    <View
      className={classnames(
        styles.tagBadge,
        styles[variant],
        outline && styles.outline,
        className
      )}
    >
      {children}
    </View>
  );
};

export default TagBadge;
