import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppButton from '../components/AppButton';
import { useData } from '../data/DataContext';
import { ScreenProps } from '../navigation';
import { colors, common, font, spacing } from '../theme';
import { CATEGORIES, CATEGORY_ICONS, formatMoney } from '../utils';

export default function DishFormScreen({
  navigation,
  route,
}: ScreenProps<'DishForm'>) {
  const { dishes, saveDish } = useData();
  const editing = dishes.find(d => d.id === route.params.dishId);

  const [name, setName] = useState(editing?.name ?? '');
  const [price, setPrice] = useState(editing ? String(editing.price) : '');
  const [category, setCategory] = useState(editing?.category ?? CATEGORIES[0]);
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

  const value = Number(price);
  const pricePreview =
    price.trim() && !isNaN(value) && value > 0 ? formatMoney(value) : '';

  const onSave = () => {
    const e: typeof errors = {};
    const trimmed = name.trim();

    if (!trimmed) {
      e.name = 'Tên món không được để trống';
    } else if (
      dishes.some(
        d =>
          d.id !== editing?.id &&
          d.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      e.name = 'Tên món đã tồn tại, hãy đặt tên khác';
    }

    if (!price.trim() || isNaN(value) || value <= 0) {
      e.price = 'Giá phải là số lớn hơn 0';
    } else if (value % 1000 !== 0) {
      e.price = 'Giá phải là bội số của 1.000, ví dụ 45000';
    }

    setErrors(e);
    if (e.name || e.price) {
      return;
    }

    saveDish({
      id: editing?.id ?? '',
      name: trimmed,
      category,
      price: value,
      available: editing?.available ?? true,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={common.screen} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={common.label}>Tên món</Text>
          <TextInput
            style={[common.input, errors.name && common.inputError]}
            value={name}
            onChangeText={setName}
            placeholder="VD: Phở bò"
            placeholderTextColor={colors.textMuted}
          />
          {errors.name && <Text style={common.errorText}>{errors.name}</Text>}

          <Text style={common.label}>Giá bán</Text>
          <View
            style={[
              common.input,
              styles.priceBox,
              errors.price && common.inputError,
            ]}
          >
            <TextInput
              style={styles.priceInput}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholder="VD: 45000"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.unit}>đ</Text>
          </View>
          {errors.price ? (
            <Text style={common.errorText}>{errors.price}</Text>
          ) : (
            pricePreview !== '' && (
              <Text style={styles.preview}>Hiển thị: {pricePreview}</Text>
            )
          )}

          <Text style={common.label}>Loại món</Text>
          <View style={styles.grid}>
            {CATEGORIES.map(c => {
              const selected = c === category;
              return (
                <Pressable
                  key={c}
                  onPress={() => setCategory(c)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  style={({ pressed }) => [
                    styles.tile,
                    selected && styles.tileActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Icon
                    name={CATEGORY_ICONS[c]}
                    size={28}
                    color={selected ? colors.card : colors.primary}
                  />
                  <Text
                    style={[styles.tileText, selected && styles.tileTextActive]}
                  >
                    {c}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={common.bottomBar}>
          <AppButton
            title={editing ? 'Lưu thay đổi' : 'Thêm món'}
            icon="check"
            onPress={onSave}
            style={styles.flex}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing,
    paddingBottom: spacing * 2,
  },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    fontSize: font.large,
    color: colors.text,
    paddingVertical: 0,
  },
  unit: {
    fontSize: font.large,
    fontWeight: '700',
    color: colors.textMuted,
  },
  preview: {
    fontSize: font.small,
    color: colors.primary,
    marginTop: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing,
  },
  tile: {
    width: '47%',
    flexGrow: 1,
    minHeight: 88,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tileActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
  tileText: {
    fontSize: font.normal,
    fontWeight: '600',
    color: colors.text,
  },
  tileTextActive: {
    color: colors.card,
  },
});
