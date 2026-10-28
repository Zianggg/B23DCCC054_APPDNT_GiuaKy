import { StyleSheet } from 'react-native';

// Một màu nhấn (xanh men gốm) trên nền trung tính lạnh
export const colors = {
  primary: '#1F4E99',
  primaryContainer: '#DCE6F7',
  onPrimaryContainer: '#0B2A5B',
  background: '#F3F5F8',
  card: '#FFFFFF',
  text: '#1A1F2B',
  textMuted: '#4A5468',
  border: '#D3D9E3',
  danger: '#B3261E',
  disabled: '#E3E7ED',
  disabledText: '#6B7385',
};

export const font = {
  small: 14,
  normal: 16,
  large: 18,
  title: 22,
};

export const spacing = 12;

export const common = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing,
    marginHorizontal: spacing,
    marginBottom: spacing,
    elevation: 2,
    shadowColor: '#0B2A5B',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing,
    minHeight: 48,
    fontSize: font.normal,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.danger,
    borderWidth: 2,
  },
  errorText: {
    color: colors.danger,
    fontSize: font.small,
    marginTop: 4,
  },
  label: {
    fontSize: font.small,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 6,
    marginTop: spacing * 1.5,
  },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: font.normal,
    marginTop: 40,
    marginHorizontal: spacing * 2,
  },
});
