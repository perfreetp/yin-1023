import React, { useState } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import type { Product, CartItem } from '@/types';
import TagBadge from '../TagBadge';
import { useAppStore } from '@/store/useAppStore';
import { isLowStock, formatStockLevel } from '@/utils';
import styles from './index.module.scss';

interface ProductCardProps {
  product: Product;
  showQuantity?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showQuantity = true }) => {
  const { addToCart, cart, updateCartQuantity } = useAppStore();
  const cartItem = cart.find((c) => c.productId === product.id);
  const [quantity, setQuantity] = useState(cartItem?.quantity || 0);

  const lowStock = isLowStock(product.stock, product.maxStock);

  const handleAdd = () => {
    if (product.stock <= 0) {
      Taro.showToast({ title: '已售罄', icon: 'none' });
      return;
    }
    const newQty = quantity + 1;
    if (newQty > product.stock) {
      Taro.showToast({ title: '库存不足', icon: 'none' });
      return;
    }
    setQuantity(newQty);
    const item: CartItem = {
      productId: product.id,
      stallId: product.stallId,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
      isPreorder: product.isPreorder
    };
    addToCart(item);
    Taro.vibrateShort({ type: 'light' });
  };

  const handleMinus = () => {
    if (quantity <= 0) return;
    const newQty = quantity - 1;
    setQuantity(newQty);
    if (newQty === 0) {
      useAppStore.getState().removeFromCart(product.id);
    } else {
      updateCartQuantity(product.id, newQty);
    }
  };

  return (
    <View className={styles.productCard}>
      <View className={styles.imageWrap}>
        <Image
          className={styles.productImage}
          src={product.image}
          mode="aspectFill"
        />
        {product.isLimited && (
          <View className={styles.limitedBadge}>限量</View>
        )}
      </View>

      <View className={styles.content}>
        <View>
          <View className={styles.header}>
            <Text className={styles.name}>{product.name}</Text>
          </View>

          {product.tags && product.tags.length > 0 && (
            <View className={styles.tagRow}>
              {product.tags.slice(0, 2).map((tag, idx) => (
                <TagBadge key={idx} variant={tag.includes('限量') ? 'error' : tag.includes('熟客') ? 'accent' : 'default'}>
                  {tag}
                </TagBadge>
              ))}
            </View>
          )}

          {product.description && (
            <Text className={styles.desc}>{product.description}</Text>
          )}

          <Text className={classnames(styles.stockInfo, lowStock && styles.low)}>
            {formatStockLevel(product.stock, product.maxStock)} · 剩余{product.stock}{product.unit}
          </Text>
        </View>

        <View className={styles.footer}>
          <View className={styles.priceArea}>
            <Text className={styles.price}>¥{product.price}</Text>
            <Text className={styles.priceUnit}>/{product.unit}</Text>
            {product.originalPrice && (
              <Text className={styles.originalPrice}>¥{product.originalPrice}</Text>
            )}
          </View>

          {showQuantity && product.stock > 0 && (
            quantity > 0 ? (
              <View className={styles.quantityControl}>
                <Button
                  className={classnames(styles.qtyBtn, quantity <= 0 && styles.disabled)}
                  onClick={handleMinus}
                >
                  -
                </Button>
                <Text className={styles.qtyNum}>{quantity}</Text>
                <Button
                  className={classnames(styles.qtyBtn, quantity >= product.stock && styles.disabled)}
                  onClick={handleAdd}
                >
                  +
                </Button>
              </View>
            ) : (
              <Button className={styles.addBtn} onClick={handleAdd}>
                + 加入
              </Button>
            )
          )}
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
