import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DataProvider } from './src/data/DataContext';
import { RootStackParamList } from './src/navigation';
import { colors } from './src/theme';
import MenuScreen from './src/screens/MenuScreen';
import DishFormScreen from './src/screens/DishFormScreen';
import TablesScreen from './src/screens/TablesScreen';
import OrderScreen from './src/screens/OrderScreen';
import PaymentScreen from './src/screens/PaymentScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <DataProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerTintColor: colors.primary,
              headerTitleStyle: { color: colors.text },
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen
              name="Menu"
              component={MenuScreen}
              options={{ title: 'Thực đơn' }}
            />
            <Stack.Screen
              name="DishForm"
              component={DishFormScreen}
              options={({ route }) => ({
                title: route.params.dishId ? 'Sửa món' : 'Thêm món',
              })}
            />
            <Stack.Screen
              name="Tables"
              component={TablesScreen}
              options={{ title: 'Sơ đồ bàn' }}
            />
            <Stack.Screen name="Order" component={OrderScreen} />
            <Stack.Screen
              name="Payment"
              component={PaymentScreen}
              options={{ title: 'Thanh toán' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </DataProvider>
    </SafeAreaProvider>
  );
}
