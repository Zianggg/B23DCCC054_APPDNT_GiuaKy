import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Menu: undefined;
  DishForm: { dishId?: string };
  Tables: undefined;
  Order: { tableNumber: number };
  Payment: { orderId: string };
};

export type ScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
