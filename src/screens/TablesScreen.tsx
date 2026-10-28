import React from 'react';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../data/DataContext';
import { ScreenProps } from '../navigation';
import { colors, common, font, spacing } from '../theme';
import { TABLE_COUNT } from '../utils';

const TABLES = Array.from({ length: TABLE_COUNT }, (_, i) => i + 1);

export default function TablesScreen({ navigation }: ScreenProps<'Tables'>) {
  const { servingOrder } = useData();

  return (
    <SafeAreaView style={common.screen} edges={['bottom', 'left', 'right']}>
      <FlatList
        data={TABLES}
        numColumns={2}
        keyExtractor={item => String(item)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const order = servingOrder(item);
          return (
            <Pressable
              onPress={() =>
                navigation.navigate('Order', { tableNumber: item })
              }
              style={({ pressed }) => [
                common.card,
                styles.table,
                order && styles.busy,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.number}>Bàn {item}</Text>
              <Text style={styles.status}>{order ? 'Có khách' : 'Trống'}</Text>
              {order && <Text style={styles.status}>Từ {order.createdAt}</Text>}
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: spacing,
    paddingRight: spacing,
  },
  table: {
    flex: 1,
    marginRight: 0,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  busy: {
    backgroundColor: colors.primaryContainer,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.6,
  },
  number: {
    fontSize: font.title,
    fontWeight: 'bold',
    color: colors.text,
  },
  status: {
    fontSize: font.small,
    color: colors.textMuted,
    marginTop: 4,
  },
});
