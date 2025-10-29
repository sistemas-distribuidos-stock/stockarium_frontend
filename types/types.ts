export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  description: string;
  lastUpdated: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'employee';
  name: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'entrada' | 'salida';
  quantity: number;
  date: string;
  user: string;
  reason: string;
}

export interface Alert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  minStock: number;
  timestamp: string;
  read: boolean;
}
