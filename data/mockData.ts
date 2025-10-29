import { Product, User, StockMovement, Alert } from '../types/types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    role: 'admin',
    name: 'Administrador'
  },
  {
    id: '2',
    username: 'empleado',
    role: 'employee',
    name: 'Juan Pérez'
  }
];

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Dell XPS 15',
    sku: 'LAP-001',
    category: 'Electrónica',
    stock: 8,
    minStock: 5,
    price: 1299.99,
    description: 'Laptop de alto rendimiento para profesionales',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Mouse Logitech MX Master 3',
    sku: 'ACC-002',
    category: 'Accesorios',
    stock: 3,
    minStock: 10,
    price: 99.99,
    description: 'Mouse inalámbrico ergonómico',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Teclado Mecánico Keychron K2',
    sku: 'ACC-003',
    category: 'Accesorios',
    stock: 15,
    minStock: 8,
    price: 89.99,
    description: 'Teclado mecánico inalámbrico',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Monitor LG 27" 4K',
    sku: 'MON-004',
    category: 'Monitores',
    stock: 2,
    minStock: 5,
    price: 449.99,
    description: 'Monitor 4K UHD con HDR',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Auriculares Sony WH-1000XM4',
    sku: 'AUD-005',
    category: 'Audio',
    stock: 12,
    minStock: 6,
    price: 349.99,
    description: 'Auriculares con cancelación de ruido',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Webcam Logitech C920',
    sku: 'ACC-006',
    category: 'Accesorios',
    stock: 0,
    minStock: 8,
    price: 79.99,
    description: 'Webcam Full HD 1080p',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Silla Ergonómica Herman Miller',
    sku: 'MOB-007',
    category: 'Mobiliario',
    stock: 5,
    minStock: 3,
    price: 1299.99,
    description: 'Silla de oficina ergonómica premium',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Tablet iPad Air',
    sku: 'TAB-008',
    category: 'Electrónica',
    stock: 6,
    minStock: 5,
    price: 599.99,
    description: 'Tablet con pantalla Liquid Retina',
    lastUpdated: new Date().toISOString()
  }
];

export const initialMovements: StockMovement[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Laptop Dell XPS 15',
    type: 'entrada',
    quantity: 10,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    user: 'Administrador',
    reason: 'Reabastecimiento mensual'
  },
  {
    id: '2',
    productId: '2',
    productName: 'Mouse Logitech MX Master 3',
    type: 'salida',
    quantity: 5,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    user: 'Juan Pérez',
    reason: 'Venta a cliente corporativo'
  },
  {
    id: '3',
    productId: '4',
    productName: 'Monitor LG 27" 4K',
    type: 'salida',
    quantity: 3,
    date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    user: 'Juan Pérez',
    reason: 'Venta minorista'
  }
];
