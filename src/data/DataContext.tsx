import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatTime, newId, PAID, SERVING } from '../utils';
import { seedDishes, seedOrders } from './seed';

export type Dish = {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
};

export type OrderItem = { dishId: string; quantity: number };

export type Order = {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: string;
  createdAt: string;
};

type DataValue = {
  dishes: Dish[];
  orders: Order[];
  saveDish: (dish: Dish) => void;
  deleteDish: (id: string) => void;
  toggleDish: (id: string) => void;
  servingOrder: (table: number) => Order | undefined;
  changeQty: (table: number, dishId: string, delta: number) => void;
  payOrder: (orderId: string) => void;
};

const DataContext = createContext<DataValue>(null as any);

export const useData = () => useContext(DataContext);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Đọc dữ liệu khi mở app, lần đầu thì nạp dữ liệu mẫu
  useEffect(() => {
    (async () => {
      const d = await AsyncStorage.getItem('dishes');
      const o = await AsyncStorage.getItem('orders');
      setDishes(d ? JSON.parse(d) : seedDishes);
      setOrders(o ? JSON.parse(o) : seedOrders);
      setLoaded(true);
    })();
  }, []);

  // Lưu lại mỗi khi dữ liệu thay đổi
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem('dishes', JSON.stringify(dishes));
    }
  }, [dishes, loaded]);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem('orders', JSON.stringify(orders));
    }
  }, [orders, loaded]);

  const saveDish = (dish: Dish) => {
    if (dish.id) {
      setDishes(list => list.map(x => (x.id === dish.id ? dish : x)));
    } else {
      setDishes(list => [...list, { ...dish, id: newId() }]);
    }
  };

  const deleteDish = (id: string) => {
    setDishes(list => list.filter(x => x.id !== id));
  };

  const toggleDish = (id: string) => {
    setDishes(list =>
      list.map(x => (x.id === id ? { ...x, available: !x.available } : x)),
    );
  };

  const servingOrder = (table: number) =>
    orders.find(o => o.tableNumber === table && o.status === SERVING);

  const changeQty = (table: number, dishId: string, delta: number) => {
    setOrders(list => {
      let order = list.find(
        o => o.tableNumber === table && o.status === SERVING,
      );
      if (!order) {
        if (delta <= 0) {
          return list;
        }
        order = {
          id: newId(),
          tableNumber: table,
          items: [],
          status: SERVING,
          createdAt: formatTime(new Date()),
        };
        list = [...list, order];
      }

      const old = order.items.find(i => i.dishId === dishId);
      const qty = (old ? old.quantity : 0) + delta;
      let items = order.items.filter(i => i.dishId !== dishId);
      if (qty > 0) {
        items = old
          ? order.items.map(i =>
              i.dishId === dishId ? { ...i, quantity: qty } : i,
            )
          : [...order.items, { dishId, quantity: qty }];
      }

      // Bỏ hết món thì huỷ hoá đơn, bàn trở về trống
      if (items.length === 0) {
        return list.filter(o => o.id !== order!.id);
      }
      return list.map(o => (o.id === order!.id ? { ...o, items } : o));
    });
  };

  const payOrder = (orderId: string) => {
    setOrders(list =>
      list.map(o => (o.id === orderId ? { ...o, status: PAID } : o)),
    );
  };

  if (!loaded) {
    return null;
  }

  return (
    <DataContext.Provider
      value={{
        dishes,
        orders,
        saveDish,
        deleteDish,
        toggleDish,
        servingOrder,
        changeQty,
        payOrder,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
