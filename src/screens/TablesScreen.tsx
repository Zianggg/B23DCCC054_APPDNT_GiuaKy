import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TileCorners from '../components/TileCorners';
import { useData } from '../data/DataContext';
import { ScreenProps } from '../navigation';
import { colors, common, font, spacing } from '../theme';
import { formatMoney, TABLE_COUNT } from '../utils';

const TABLES = Array.from({ length: TABLE_COUNT }, (_, i) => i + 1);

export default function TablesScreen({ navigation }: ScreenProps<'Tables'>) {
  const { dishes, servingOrder } = useData();
  const busyCount = TABLES.filter(t => servingOrder(t)).length;

  return (
    <SafeAreaView style={common.screen} edges={['bottom', 'left', 'right']}>
      <View style={styles.legend}>
        <View style={[styles.swatch, styles.swatchFree]} />
        <Text style={styles.legendText}>Trống {TABLE_COUNT - busyCount}</Text>
        <View style={[styles.swatch, styles.swatchBusy]} />
        <Text style={styles.legendText}>Có khách {busyCount}</Text>
      </View>

      <FlatList
        data={TABLES}
        numColumns={2}
        keyExtractor={item => String(item)}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const order = servingOrder(item);
          const count = order?.items.reduce((s, i) => s + i.quantity, 0) ?? 0;
          const subtotal =
            order?.items.reduce((s, i) => {
              const dish = dishes.find(d => d.id === i.dishId);
              return s + (dish ? dish.price * i.quantity : 0);
            }, 0) ?? 0;

          return (
            <Pressable
              onPress={() =>
                navigation.navigate('Order', { tableNumber: item })
              }
              accessibilityRole="button"
              accessibilityLabel={`Bàn ${item}, ${
                order ? 'có khách' : 'trống'
              }`}
              style={({ pressed }) => [
                styles.tile,
                order && styles.busy,
                pressed && styles.pressed,
              ]}
            >
              <TileCorners
                color={order ? colors.accent : colors.primaryContainer}
              />
              <Text style={[styles.tableLabel, order && styles.textOnBusy]}>
                Bàn
              </Text>
              <Text style={[styles.number, order && styles.textOnBusy]}>
                {item}
              </Text>
              {order ? (
                <>
                  <Text style={styles.amount}>{formatMoney(subtotal)}</Text>
                  <Text style={styles.meta}>
                    {count} món · từ {order.createdAt.slice(0, 5)}
                  </Text>
                </>
              ) : (
                <View style={styles.freeRow}>
                  <Icon name="plus" size={16} color={colors.textMuted} />
                  <Text style={styles.free}>Trống · bấm để gọi món</Text>
                </View>
              )}
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing,
    paddingTop: spacing * 1.5,
    paddingBottom: spacing,
  },
  swatch: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  swatchFree: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  swatchBusy: {
    backgroundColor: colors.primary,
  },
  legendText: {
    fontSize: font.normal,
    fontWeight: '600',
    color: colors.text,
    marginRight: spacing,
  },
  list: {
    paddingHorizontal: spacing,
    paddingBottom: spacing,
    gap: spacing,
  },
  column: {
    gap: spacing,
  },
  tile: {
    ...StyleSheet.flatten(common.card),
    flex: 1,
    marginHorizontal: 0,
    marginBottom: 0,
    height: 132,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  busy: {
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.75,
  },
  tableLabel: {
    fontSize: font.small,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: -4,
  },
  number: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.text,
  },
  textOnBusy: {
    color: colors.card,
  },
  amount: {
    fontSize: font.large,
    fontWeight: '700',
    color: colors.card,
  },
  meta: {
    fontSize: font.small,
    color: colors.primaryContainer,
    marginTop: 2,
  },
  freeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  free: {
    fontSize: font.small,
    color: colors.textMuted,
  },
});
