export const CATEGORIES = ['Khai vị', 'Món chính', 'Tráng miệng', 'Đồ uống'];

// Icon (MaterialCommunityIcons) cho từng loại món
export const CATEGORY_ICONS: Record<string, string> = {
  'Khai vị': 'leaf',
  'Món chính': 'noodles',
  'Tráng miệng': 'cupcake',
  'Đồ uống': 'cup-outline',
};

export const SERVING = 'Đang phục vụ';
export const PAID = 'Đã thanh toán';

export const TABLE_COUNT = 10;

// 45000 -> "45.000 đ"
export function formatMoney(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
}

// hh:mm dd/mm/yyyy
export function formatTime(d: Date) {
  const p = (x: number) => String(x).padStart(2, '0');
  return `${p(d.getHours())}:${p(d.getMinutes())} ${p(d.getDate())}/${p(
    d.getMonth() + 1,
  )}/${d.getFullYear()}`;
}

export function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
