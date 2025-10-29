import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, User, StockMovement, Alert } from '../types/types';
import { initialProducts, initialMovements, mockUsers } from '../data/mockData';

interface AppContextType {
  user: User | null;
  products: Product[];
  movements: StockMovement[];
  alerts: Alert[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addProduct: (product: Omit<Product, 'id' | 'lastUpdated'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (productId: string, quantity: number, type: 'entrada' | 'salida', reason: string) => void;
  markAlertAsRead: (alertId: string) => void;
  clearAllAlerts: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    const storedMovements = localStorage.getItem('movements');
    const storedAlerts = localStorage.getItem('alerts');
    const storedUser = localStorage.getItem('user');

    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(initialProducts);
    }

    if (storedMovements) {
      setMovements(JSON.parse(storedMovements));
    } else {
      setMovements(initialMovements);
    }

    if (storedAlerts) {
      setAlerts(JSON.parse(storedAlerts));
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (movements.length > 0) {
      localStorage.setItem('movements', JSON.stringify(movements));
    }
  }, [movements]);

  useEffect(() => {
    localStorage.setItem('alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Check for low stock alerts
  useEffect(() => {
    const lowStockProducts = products.filter(p => p.stock <= p.minStock);
    const newAlerts: Alert[] = lowStockProducts.map(p => {
      const existingAlert = alerts.find(a => a.productId === p.id && !a.read);
      if (existingAlert) {
        return existingAlert;
      }
      return {
        id: `alert-${p.id}-${Date.now()}`,
        productId: p.id,
        productName: p.name,
        currentStock: p.stock,
        minStock: p.minStock,
        timestamp: new Date().toISOString(),
        read: false
      };
    });

    // Keep read alerts and add new ones
    const readAlerts = alerts.filter(a => a.read);
    setAlerts([...newAlerts, ...readAlerts]);
  }, [products]);

  const login = (username: string, password: string): boolean => {
    // Simple mock authentication (password is same as username for demo)
    const foundUser = mockUsers.find(u => u.username === username && username === password);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const addProduct = (product: Omit<Product, 'id' | 'lastUpdated'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      lastUpdated: new Date().toISOString()
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(p => 
      p.id === id 
        ? { ...p, ...updates, lastUpdated: new Date().toISOString() }
        : p
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateStock = (productId: string, quantity: number, type: 'entrada' | 'salida', reason: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newStock = type === 'entrada' 
      ? product.stock + quantity 
      : product.stock - quantity;

    if (newStock < 0) {
      alert('No hay suficiente stock disponible');
      return;
    }

    updateProduct(productId, { stock: newStock });

    const newMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      productId,
      productName: product.name,
      type,
      quantity,
      date: new Date().toISOString(),
      user: user?.name || 'Usuario',
      reason
    };

    setMovements([newMovement, ...movements]);
  };

  const markAlertAsRead = (alertId: string) => {
    setAlerts(alerts.map(a => 
      a.id === alertId ? { ...a, read: true } : a
    ));
  };

  const clearAllAlerts = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
  };

  return (
    <AppContext.Provider value={{
      user,
      products,
      movements,
      alerts,
      login,
      logout,
      addProduct,
      updateProduct,
      deleteProduct,
      updateStock,
      markAlertAsRead,
      clearAllAlerts
    }}>
      {children}
    </AppContext.Provider>
  );
};
