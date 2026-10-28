import React from 'react';
import {
  Alert,
  Pressable,
  SectionList,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import { Dish, useData } from '../data/DataContext';
import { ScreenProps } from '../navigation';
import { colors, common, font, spacing } from '../theme';
import { CATEGORIES, formatMoney, SERVING, TABLE_COUNT } from '../utils';

export default function MenuScreen({ navigation }: ScreenProps<'Menu'>) {
  const { dishes, orders, toggleDish, deleteDish } = useData();

  const serving = orders.filter(o => o.status === SERVING);
  const busyTables = new Set(serving.map(o => o.tableNumber)).size;

  const sections = CATEGORIES.map(c => ({
    title: c,
    data: dishes.filter(d => d.category === c),
  })).filter(s => s.data.length > 0);

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
      <Text style={styles.summary}>
        {dishes.length} món · {busyTables}/{TABLE_COUNT} bàn có khách
      </Text>
      <View style={styles.top}>
        <AppButton
          title="Sơ đồ bàn"
          outline
          style={styles.flex}
          onPress={() => navigation.navigate('Tables')}
        />
        <AppButton
          title="Thêm món"
          icon="plus"
          style={styles.flex}
          onPress={() => navigation.navigate('DishForm', {})}
        />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('DishForm', { dishId: item.id })}
            onLongPress={() => onDelete(item)}
            style={({ pressed }) => [
              common.card,
              styles.row,
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.info, !item.available && styles.soldOut]}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{formatMoney(item.price)}</Text>
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
            Chưa có món nào. Bấm “Thêm món” để tạo món đầu tiên.
          </Text>
        }
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    gap: spacing,
    paddingHorizontal: spacing,
    paddingBottom: 4,
  },
  flex: {
    flex: 1,
  },
  summary: {
    fontSize: font.large,
    color: colors.text,
    fontWeight: '600',
    padding: spacing,
  },
  list: {
    paddingBottom: spacing,
  },
  sectionTitle: {
    fontSize: font.large,
    fontWeight: 'bold',
    color: colors.primary,
    marginHorizontal: spacing,
    marginTop: spacing,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
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
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  badge: {
    backgroundColor: colors.danger,
    color: '#fff',
    fontSize: font.small,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 8,
  },
});
