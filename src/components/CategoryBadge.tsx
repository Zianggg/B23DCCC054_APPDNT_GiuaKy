import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme';
import { CATEGORY_ICONS } from '../utils';

// Ô tròn chứa icon của loại món, đứng đầu mỗi dòng món
export default function CategoryBadge({ category }: { category: string }) {
  return (
    <View style={styles.badge}>
      <Icon
        name={CATEGORY_ICONS[category] ?? 'silverware-fork-knife'}
        size={22}
        color={colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
