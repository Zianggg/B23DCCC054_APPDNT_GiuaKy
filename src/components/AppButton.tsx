import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, font } from '../theme';

type Props = {
  title?: string;
  icon?: string;
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
      {icon && <Icon name={icon} size={small ? 22 : 20} color={color} />}
      {title ? <Text style={[styles.text, { color }]}>{title}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 26,
    minHeight: 52,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
    overflow: 'hidden',
  },
  outline: {
    backgroundColor: colors.card,
  },
  small: {
    width: 48,
    minHeight: 48,
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
    fontWeight: '700',
  },
});
