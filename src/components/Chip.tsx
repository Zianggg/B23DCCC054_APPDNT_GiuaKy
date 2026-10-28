import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, font } from '../theme';

type Props = {
  label: string;
  icon?: string;
  selected?: boolean;
  onPress: () => void;
};

// Nút chọn dạng viên thuốc: lọc loại món, chọn nhanh số tiền
export default function Chip({ label, icon, selected, onPress }: Props) {
  const color = selected ? colors.card : colors.onPrimaryContainer;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      android_ripple={{ color: colors.primaryContainer }}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      {icon && <Icon name={icon} size={18} color={color} />}
      <Text style={[styles.text, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontSize: font.small,
    fontWeight: '600',
  },
});
