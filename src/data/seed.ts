import { formatTime, SERVING } from '../utils';
import { Dish, Order } from './DataContext';

export const seedDishes: Dish[] = [
  {
    id: 'd1',
    name: 'Gỏi cuốn',
    category: 'Khai vị',
    price: 35000,
    available: true,
  },
  {
    id: 'd2',
    name: 'Súp cua',
    category: 'Khai vị',
    price: 40000,
    available: true,
  },
  {
    id: 'd3',
    name: 'Phở bò',
    category: 'Món chính',
    price: 55000,
    available: true,
  },
  {
    id: 'd4',
    name: 'Cơm gà',
    category: 'Món chính',
    price: 60000,
    available: true,
  },
  {
    id: 'd5',
    name: 'Chè khúc bạch',
    category: 'Tráng miệng',
    price: 30000,
    available: true,
  },
  {
    id: 'd6',
    name: 'Bánh flan',
    category: 'Tráng miệng',
    price: 20000,
    available: false,
  },
  {
    id: 'd7',
    name: 'Trà đá',
    category: 'Đồ uống',
    price: 5000,
    available: true,
  },
  {
    id: 'd8',
    name: 'Nước cam',
    category: 'Đồ uống',
    price: 25000,
    available: true,
  },
];

export const seedOrders: Order[] = [
  {
    id: 'o1',
    tableNumber: 1,
    items: [
      { dishId: 'd3', quantity: 2 },
      { dishId: 'd7', quantity: 2 },
    ],
    status: SERVING,
    createdAt: formatTime(new Date()),
  },
];
