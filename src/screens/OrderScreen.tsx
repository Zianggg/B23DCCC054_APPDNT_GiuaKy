import React, { useLayoutEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import { useData } from '../data/DataContext';
import { ScreenProps } from '../navigation';
import { colors, common, font, spacing } from '../theme';
import { formatMoney } from '../utils';

export default function OrderScreen({
  navigation,
  route,
}: ScreenProps<'Order'>) {
  const { tableNumber } = route.params;
  const { dishes, servingOrder, changeQty } = useData();
  const order = servingOrder(tableNumber);

  useLayoutEffect(() => {
    navigation.setOptions({ title: `Gọi món - Bàn ${tableNumber}` });
  }, [navigation, tableNumber]);

  const qtyOf = (dishId: string) =>
    order?.items.find(i => i.dishId === dishId)?.quantity ?? 0;

  const subtotal = (order?.items ?? []).reduce((sum, i) => {
    const dish = dishes.find(d => d.id === i.dishId);
    return sum + (dish ? dish.price * i.quantity : 0);
  }, 0);

  return (
    <SafeAreaView style={common.screen} edges={['bottom', 'left', 'right']}>
      <FlatList
        data={dishes}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={common.empty}>
            Thực đơn đang trống. Thêm món ở màn Thực đơn trước.
          </Text>
        }
        renderItem={({ item }) => {
          const qty = qtyOf(item.id);
          return (
            <View style={[common.card, styles.row]}>
              <View style={[styles.info, !item.available && styles.soldOut]}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>
                  {item.available ? formatMoney(item.price) : 'Hết món'}
                </Text>
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

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Tạm tính</Text>
          <Text style={styles.total}>{formatMoney(subtotal)}</Text>
        </View>
        <AppButton
          title="Thanh toán"
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
  list: {
    paddingTop: spacing,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  soldOut: {
    opacity: 0.4,
  },
  name: {
    fontSize: font.large,
    fontWeight: '600',
    color: colors.text,
  },
  price: {
    fontSize: font.normal,
    color: colors.textMuted,
    marginTop: 2,
  },
  qty: {
    width: 36,
    textAlign: 'center',
    fontSize: font.large,
    fontWeight: '600',
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerLabel: {
    fontSize: font.small,
    color: colors.textMuted,
  },
  total: {
    fontSize: font.title,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
