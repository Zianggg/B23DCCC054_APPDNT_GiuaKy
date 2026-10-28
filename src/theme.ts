import { StyleSheet } from 'react-native';

// "Gạch bông": xanh lục lam đậm + vàng nghệ trên nền xám đá
export const colors = {
  primary: '#0E5A5C',
  primaryContainer: '#D4EBE8',
  onPrimaryContainer: '#06393A',
  accent: '#E0A21B',
  accentContainer: '#FCEFCF',
  onAccent: '#3A2900',
  background: '#ECEFEA',
  card: '#FFFFFF',
  text: '#16211F',
  textMuted: '#4A5856',
  border: '#D0D8D3',
  danger: '#B3261E',
  dangerContainer: '#FBE3E1',
  disabled: '#DFE4E0',
  disabledText: '#6A7673',
};

export const font = {
  small: 14,
  normal: 16,
  large: 18,
  title: 22,
  display: 30,
};

export const spacing = 12;

export const common = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing,
    marginHorizontal: spacing,
    marginBottom: spacing,
    elevation: 2,
    shadowColor: colors.onPrimaryContainer,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing,
    minHeight: 52,
    fontSize: font.large,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.danger,
    borderWidth: 2,
  },
  errorText: {
    color: colors.danger,
    fontSize: font.small,
    marginTop: 6,
  },
  label: {
    fontSize: font.small,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 8,
    marginTop: spacing * 2,
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: font.normal,
    marginTop: 40,
    marginHorizontal: spacing * 2,
  },
  // Thanh cố định ở đáy màn (tạm tính, nút lưu, xác nhận)
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing,
    padding: spacing,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
