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
import AppButton from '../components/AppButton';
import { useData } from '../data/DataContext';
import { ScreenProps } from '../navigation';
import { colors, common, font, spacing } from '../theme';
import { CATEGORIES } from '../utils';

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

  const onSave = () => {
    const e: typeof errors = {};
    const trimmed = name.trim();
    const value = Number(price);

    if (!trimmed) {
      e.name = 'Tên món không được để trống';
    } else if (
      dishes.some(
        d =>
          d.id !== editing?.id &&
          d.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      e.name = 'Tên món đã tồn tại';
    }

    if (!price.trim() || isNaN(value) || value <= 0) {
      e.price = 'Giá phải là số lớn hơn 0';
    } else if (value % 1000 !== 0) {
      e.price = 'Giá phải là bội số của 1.000';
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

          <Text style={common.label}>Giá (VNĐ)</Text>
          <TextInput
            style={[common.input, errors.price && common.inputError]}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholder="VD: 45000"
            placeholderTextColor={colors.textMuted}
          />
          {errors.price && <Text style={common.errorText}>{errors.price}</Text>}

          <Text style={common.label}>Loại món</Text>
          <View style={styles.chips}>
            {CATEGORIES.map(c => (
              <Pressable
                key={c}
                onPress={() => setCategory(c)}
                style={({ pressed }) => [
                  styles.chip,
                  c === category && styles.chipActive,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    c === category && styles.chipTextActive,
                  ]}
                >
                  {c}
                </Text>
              </Pressable>
            ))}
          </View>

          <AppButton
            title={editing ? 'Lưu thay đổi' : 'Thêm món'}
            onPress={onSave}
            style={styles.save}
          />
        </ScrollView>
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
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.card,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.6,
  },
  chipText: {
    color: colors.primary,
    fontSize: font.normal,
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  save: {
    marginTop: spacing * 2,
  },
});
