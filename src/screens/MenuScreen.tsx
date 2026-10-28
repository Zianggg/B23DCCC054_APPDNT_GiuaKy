import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import CategoryBadge from '../components/CategoryBadge';
import Chip from '../components/Chip';
import { Dish, useData } from '../data/DataContext';
import { ScreenProps } from '../navigation';
import { colors, common, font, spacing } from '../theme';
import {
  CATEGORIES,
  CATEGORY_ICONS,
  formatMoney,
  SERVING,
  TABLE_COUNT,
} from '../utils';

const ALL = 'Tất cả';

export default function MenuScreen({ navigation }: ScreenProps<'Menu'>) {
  const { dishes, orders, toggleDish, deleteDish } = useData();
  const [filter, setFilter] = useState(ALL);

  const serving = orders.filter(o => o.status === SERVING);
  const busySet = new Set(serving.map(o => o.tableNumber));

  const sections = CATEGORIES.filter(c => filter === ALL || filter === c)
    .map(c => ({ title: c, data: dishes.filter(d => d.category === c) }))
    .filter(s => s.data.length > 0);

  const onDelete = (dish: Dish) => {
    const inUse = serving.some(o => o.items.some(i => i.dishId === dish.id));
    if (inUse) {
      Alert.alert(
        'Không thể xoá',
        `"${dish.name}" đang có trong hoá đơn đang phục vụ.`,
      );
      return;
    }
    Alert.alert('Xoá món', `Bạn có chắc muốn xoá "${dish.name}"?`, [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: () => deleteDish(dish.id) },
    ]);
  };

  return (
    <SafeAreaView style={common.screen} edges={['bottom', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.flex}>
          <Text style={styles.summary}>
            {dishes.length} món · {busySet.size}/{TABLE_COUNT} bàn có khách
          </Text>
          {/* Mỗi ô là một bàn, ô tô màu là bàn có khách */}
          <View style={styles.strip}>
            {Array.from({ length: TABLE_COUNT }, (_, i) => (
              <View
                key={i}
                style={[styles.dot, busySet.has(i + 1) && styles.dotBusy]}
              />
            ))}
          </View>
        </View>
        <AppButton
          title="Sơ đồ bàn"
          icon="table-furniture"
          outline
          onPress={() => navigation.navigate('Tables')}
        />
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

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>
            {section.title} · {section.data.length}
          </Text>
        )}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('DishForm', { dishId: item.id })}
            onLongPress={() => onDelete(item)}
            accessibilityHint="Nhấn để sửa, nhấn giữ để xoá"
            style={({ pressed }) => [
              common.card,
              styles.row,
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.rowMain, !item.available && styles.soldOut]}>
              <CategoryBadge category={item.category} />
              <View style={styles.flex}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{formatMoney(item.price)}</Text>
              </View>
            </View>
            {!item.available && <Text style={styles.badge}>Hết món</Text>}
            <Switch
              value={item.available}
              onValueChange={() => toggleDish(item.id)}
              accessibilityLabel={`${item.name} còn phục vụ`}
              trackColor={{ true: colors.primary, false: colors.border }}
              thumbColor={colors.card}
            />
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={common.empty}>
            Chưa có món nào. Bấm “+ Thêm món” để tạo món đầu tiên.
          </Text>
        }
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
      />

      <AppButton
        title="Thêm món"
        icon="plus"
        label="+ Thêm món"
        style={styles.fab}
        onPress={() => navigation.navigate('DishForm', {})}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing,
    padding: spacing,
    paddingTop: spacing * 1.5,
  },
  summary: {
    fontSize: font.large,
    fontWeight: '700',
    color: colors.text,
  },
  strip: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dotBusy: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chips: {
    gap: 8,
    paddingHorizontal: spacing,
    paddingBottom: 4,
  },
  list: {
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: font.small,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: spacing,
    marginTop: spacing * 2,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing,
  },
  pressed: {
    opacity: 0.7,
  },
  soldOut: {
    opacity: 0.4,
  },
  name: {
    fontSize: font.large,
    fontWeight: '700',
    color: colors.text,
  },
  price: {
    fontSize: font.normal,
    color: colors.textMuted,
    marginTop: 2,
  },
  badge: {
    backgroundColor: colors.dangerContainer,
    color: colors.danger,
    fontSize: font.small,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  fab: {
    position: 'absolute',
    right: spacing * 1.5,
    bottom: spacing * 1.5,
    elevation: 6,
    shadowColor: colors.onPrimaryContainer,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
