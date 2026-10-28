import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import { useData } from '../data/DataContext';
import { ScreenProps } from '../navigation';
import { colors, common, font, spacing } from '../theme';
import { formatMoney } from '../utils';

export default function PaymentScreen({
  navigation,
  route,
}: ScreenProps<'Payment'>) {
  const { dishes, orders, payOrder } = useData();
  const order = orders.find(o => o.id === route.params.orderId);
  const [cash, setCash] = useState('');

  const rows = (order?.items ?? []).map(i => {
    const dish = dishes.find(d => d.id === i.dishId);
    const price = dish?.price ?? 0;
    return {
      ...i,
      name: dish?.name ?? '(Món đã xoá)',
      price,
      amount: price * i.quantity,
    };
  });

  const subtotal = rows.reduce((sum, r) => sum + r.amount, 0);
  const vat = Math.round(subtotal * 0.08);
  const total = subtotal + vat;
  const given = Number(cash) || 0;
  const canPay = rows.length > 0 && given >= total;

  const onPay = () => {
    payOrder(route.params.orderId);
    navigation.popTo('Tables');
  };

  return (
    <SafeAreaView style={common.screen} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[common.card, styles.card]}>
            <Text style={styles.title}>Bàn {order?.tableNumber}</Text>
            <Text style={styles.muted}>{order?.createdAt}</Text>

            {rows.length === 0 && (
              <Text style={common.empty}>Hoá đơn chưa có món nào</Text>
            )}
            {rows.map(r => (
              <View key={r.dishId} style={styles.item}>
                <View style={styles.flex}>
                  <Text style={styles.name}>{r.name}</Text>
                  <Text style={styles.muted}>
                    {r.quantity} x {formatMoney(r.price)}
                  </Text>
                </View>
                <Text style={styles.name}>{formatMoney(r.amount)}</Text>
              </View>
            ))}

            <View style={styles.line}>
              <Text style={styles.muted}>Tạm tính</Text>
              <Text style={styles.value}>{formatMoney(subtotal)}</Text>
            </View>
            <View style={styles.line}>
              <Text style={styles.muted}>VAT 8%</Text>
              <Text style={styles.value}>{formatMoney(vat)}</Text>
            </View>
            <View style={styles.line}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.total}>{formatMoney(total)}</Text>
            </View>
          </View>

          <Text style={common.label}>Tiền khách đưa</Text>
          <TextInput
            style={[
              common.input,
              cash !== '' && given < total && common.inputError,
            ]}
            value={cash}
            onChangeText={setCash}
            keyboardType="numeric"
            placeholder="Nhập số tiền"
            placeholderTextColor={colors.textMuted}
          />
          {cash !== '' && given < total && (
            <Text style={common.errorText}>
              Còn thiếu {formatMoney(total - given)}
            </Text>
          )}

          <View style={styles.line}>
            <Text style={styles.totalLabel}>Tiền thừa</Text>
            <Text style={styles.total}>
              {formatMoney(Math.max(given - total, 0))}
            </Text>
          </View>

          <AppButton
            title="Xác nhận thanh toán"
            disabled={!canPay}
            onPress={onPay}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing,
  },
  card: {
    marginHorizontal: 0,
    marginBottom: 0,
  },
  title: {
    fontSize: font.title,
    fontWeight: 'bold',
    color: colors.text,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  name: {
    fontSize: font.normal,
    fontWeight: '600',
    color: colors.text,
  },
  muted: {
    fontSize: font.small,
    color: colors.textMuted,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  value: {
    fontSize: font.normal,
    color: colors.text,
  },
  totalLabel: {
    fontSize: font.large,
    fontWeight: 'bold',
    color: colors.text,
  },
  total: {
    fontSize: font.large,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
