import React, { useLayoutEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppButton from '../components/AppButton';
import CategoryBadge from '../components/CategoryBadge';
import Chip from '../components/Chip';
import { useData } from '../data/DataContext';
import { ScreenProps } from '../navigation';
import { colors, common, font, spacing } from '../theme';
import { CATEGORIES, CATEGORY_ICONS, formatMoney } from '../utils';

const ALL = 'Tất cả';

export default function OrderScreen({
  navigation,
  route,
}: ScreenProps<'Order'>) {
  const { tableNumber } = route.params;
  const { dishes, servingOrder, changeQty } = useData();
  const order = servingOrder(tableNumber);
  const [filter, setFilter] = useState(ALL);

  useLayoutEffect(() => {
    navigation.setOptions({ title: `Gọi món · Bàn ${tableNumber}` });
  }, [navigation, tableNumber]);

  const qtyOf = (dishId: string) =>
    order?.items.find(i => i.dishId === dishId)?.quantity ?? 0;

  const items = order?.items ?? [];
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => {
    const dish = dishes.find(d => d.id === i.dishId);
    return sum + (dish ? dish.price * i.quantity : 0);
  }, 0);
  const ordered = items
    .map(i => {
      const dish = dishes.find(d => d.id === i.dishId);
      return dish ? `${dish.name} ×${i.quantity}` : '';
    })
    .filter(Boolean)
    .join(', ');

  const shown = dishes.filter(d => filter === ALL || d.category === filter);

  return (
    <SafeAreaView style={common.screen} edges={['bottom', 'left', 'right']}>
      <View style={styles.summary}>
        <Icon name="clipboard-text-outline" size={22} color={colors.primary} />
        <Text style={styles.summaryText} numberOfLines={2}>
          {order
            ? `Đã gọi: ${ordered}`
            : 'Bàn trống. Bấm + ở món bất kỳ để mở hoá đơn.'}
        </Text>
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {[ALL, ...CATEGORIES].map(c => (
            <Chip
              key={c}
              label={c}
              icon={CATEGORY_ICONS[c] ?? 'silverware-fork-knife'}
              selected={filter === c}
              onPress={() => setFilter(c)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={shown}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={common.empty}>
            Không có món nào ở mục này. Thêm món ở màn Thực đơn.
          </Text>
        }
        renderItem={({ item }) => {
          const qty = qtyOf(item.id);
          return (
            <View style={[common.card, styles.row, qty > 0 && styles.picked]}>
              <View style={[styles.info, !item.available && styles.soldOut]}>
                <CategoryBadge category={item.category} />
                <View style={styles.flex}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>
                    {item.available ? formatMoney(item.price) : 'Hết món'}
                  </Text>
                </View>
              </View>
              <AppButton
                icon="minus"
                label={`Bớt ${item.name}`}
                small
                outline
                disabled={qty === 0}
                onPress={() => changeQty(tableNumber, item.id, -1)}
              />
              <Text style={styles.qty}>{qty}</Text>
              <AppButton
                icon="plus"
                label={`Thêm ${item.name}`}
                small
                disabled={!item.available}
                onPress={() => changeQty(tableNumber, item.id, 1)}
              />
            </View>
          );
        }}
      />

      <View style={common.bottomBar}>
        <View style={styles.flex}>
          <Text style={styles.footerLabel}>Tạm tính · {count} món</Text>
          <Text style={styles.total}>{formatMoney(subtotal)}</Text>
        </View>
        <AppButton
          title="Thanh toán"
          icon="cash"
          disabled={!order}
          onPress={() =>
            order && navigation.navigate('Payment', { orderId: order.id })
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    margin: spacing,
    padding: spacing,
    borderRadius: 12,
    backgroundColor: colors.primaryContainer,
  },
  summaryText: {
    flex: 1,
    fontSize: font.normal,
    color: colors.onPrimaryContainer,
  },
  chips: {
    gap: 8,
    paddingHorizontal: spacing,
    paddingBottom: spacing,
  },
  list: {
    paddingBottom: spacing,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picked: {
    backgroundColor: colors.accentContainer,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing,
  },
  soldOut: {
    opacity: 0.4,
  },
  name: {
    fontSize: font.normal,
    fontWeight: '700',
    color: colors.text,
  },
  price: {
    fontSize: font.small,
    color: colors.textMuted,
    marginTop: 2,
  },
  qty: {
    width: 32,
    textAlign: 'center',
    fontSize: font.large,
    fontWeight: '700',
    color: colors.text,
  },
  footerLabel: {
    fontSize: font.small,
    color: colors.textMuted,
  },
  total: {
    fontSize: font.title,
    fontWeight: '800',
    color: colors.primary,
  },
});
