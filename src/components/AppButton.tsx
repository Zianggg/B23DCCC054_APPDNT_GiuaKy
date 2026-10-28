import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { colors, font } from '../theme';

type Props = {
  title?: string;
  icon?: 'plus' | 'minus';
  onPress: () => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export default function AppButton({
  title,
  icon,
  onPress,
  disabled,
  outline,
  small,
  label,
  style,
}: Props) {
  const color = disabled
    ? colors.disabledText
    : outline
    ? colors.primary
    : colors.card;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label ?? title}
      accessibilityState={{ disabled: !!disabled }}
      android_ripple={{ color: colors.primaryContainer }}
      style={({ pressed }) => [
        styles.button,
        outline && styles.outline,
        small && styles.small,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon && <PlusMinus type={icon} color={color} />}
      {title ? <Text style={[styles.text, { color }]}>{title}</Text> : null}
    </Pressable>
  );
}

// Dấu + / − vẽ bằng View để nét đều nhau
function PlusMinus({ type, color }: { type: 'plus' | 'minus'; color: string }) {
  return (
    <View style={styles.icon}>
      <View style={[styles.bar, { backgroundColor: color }]} />
      {type === 'plus' && (
        <View
          style={[styles.bar, styles.barVertical, { backgroundColor: color }]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 24,
    minHeight: 48,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    overflow: 'hidden',
  },
  outline: {
    backgroundColor: colors.card,
  },
  small: {
    width: 48,
    paddingHorizontal: 0,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },
  text: {
    fontSize: font.normal,
    fontWeight: '600',
  },
  icon: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    position: 'absolute',
    width: 14,
    height: 2,
    borderRadius: 1,
  },
  barVertical: {
    width: 2,
    height: 14,
  },
});
