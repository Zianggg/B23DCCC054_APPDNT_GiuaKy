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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppButton from '../components/AppButton';
import Chip from '../components/Chip';
import { useData } from '../data/DataContext';
import { ScreenProps } from '../navigation';
import { colors, common, font, spacing } from '../theme';
import { formatMoney } from '../utils';

const QUICK_CASH = [100000, 200000, 500000, 1000000];

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
  const short = cash !== '' && given < total;
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
          {/* Hoá đơn trình bày như tờ phiếu thật */}
          <View style={[common.card, styles.receipt]}>
            <View style={styles.receiptHead}>
              <Icon name="receipt" size={28} color={colors.primary} />
              <View>
                <Text style={styles.title}>
                  Hoá đơn · Bàn {order?.tableNumber}
                </Text>
                <Text style={styles.muted}>{order?.createdAt}</Text>
              </View>
            </View>
            <View style={styles.dashed} />

            {rows.length === 0 && (
              <Text style={common.empty}>Hoá đơn chưa có món nào</Text>
            )}
            {rows.map(r => (
              <View key={r.dishId} style={styles.item}>
                <View style={styles.flex}>
                  <Text style={styles.name}>{r.name}</Text>
                  <Text style={styles.muted}>
                    {r.quantity} × {formatMoney(r.price)}
                  </Text>
                </View>
                <Text style={styles.amount}>{formatMoney(r.amount)}</Text>
              </View>
            ))}

            <View style={styles.dashed} />
            <View style={styles.line}>
              <Text style={styles.muted}>Tạm tính</Text>
              <Text style={styles.value}>{formatMoney(subtotal)}</Text>
            </View>
            <View style={styles.line}>
              <Text style={styles.muted}>VAT 8%</Text>
              <Text style={styles.value}>{formatMoney(vat)}</Text>
            </View>
            <View style={[styles.line, styles.totalLine]}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.total}>{formatMoney(total)}</Text>
            </View>
          </View>

          <Text style={[common.label, styles.side]}>Tiền khách đưa</Text>
          <View
            style={[
              common.input,
              styles.cashBox,
              styles.side,
              short && common.inputError,
            ]}
          >
            <TextInput
              style={styles.cashInput}
              value={cash}
              onChangeText={setCash}
              keyboardType="numeric"
              placeholder="Nhập số tiền"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.unit}>đ</Text>
          </View>
          {short && (
            <Text style={[common.errorText, styles.side]}>
              Còn thiếu {formatMoney(total - given)}
            </Text>
          )}

          <View style={styles.quick}>
            <Chip
              label="Vừa đủ"
              icon="check"
              selected={given === total && total > 0}
              onPress={() => setCash(String(total))}
            />
            {QUICK_CASH.filter(v => v >= total).map(v => (
              <Chip
                key={v}
                label={formatMoney(v)}
                selected={given === v}
                onPress={() => setCash(String(v))}
              />
            ))}
          </View>

          <View style={[styles.changeBox, styles.side]}>
            <Text style={styles.changeLabel}>Tiền thừa trả khách</Text>
            <Text style={styles.change}>
              {formatMoney(Math.max(given - total, 0))}
            </Text>
          </View>
        </ScrollView>

        <View style={common.bottomBar}>
          <AppButton
            title="Xác nhận thanh toán"
            icon="check-circle"
            disabled={!canPay}
            onPress={onPay}
            style={styles.flex}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingVertical: spacing,
  },
  side: {
    marginHorizontal: spacing,
  },
  receipt: {
    padding: spacing * 1.5,
  },
  receiptHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing,
  },
  dashed: {
    borderBottomWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
    marginVertical: spacing,
  },
  title: {
    fontSize: font.large,
    fontWeight: '800',
    color: colors.text,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  name: {
    fontSize: font.normal,
    fontWeight: '600',
    color: colors.text,
  },
  amount: {
    fontSize: font.normal,
    fontWeight: '700',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  muted: {
    fontSize: font.small,
    color: colors.textMuted,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  value: {
    fontSize: font.normal,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  totalLine: {
    marginTop: 6,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: font.large,
    fontWeight: '800',
    color: colors.text,
  },
  total: {
    fontSize: font.title,
    fontWeight: '800',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  cashBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cashInput: {
    flex: 1,
    fontSize: font.large,
    color: colors.text,
    paddingVertical: 0,
  },
  unit: {
    fontSize: font.large,
    fontWeight: '700',
    color: colors.textMuted,
  },
  quick: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginHorizontal: spacing,
    marginTop: spacing,
  },
  changeBox: {
    marginTop: spacing * 1.5,
    padding: spacing,
    borderRadius: 12,
    backgroundColor: colors.accentContainer,
  },
  changeLabel: {
    fontSize: font.small,
    fontWeight: '600',
    color: colors.onAccent,
  },
  change: {
    fontSize: font.display,
    fontWeight: '800',
    color: colors.onAccent,
    fontVariant: ['tabular-nums'],
  },
});
