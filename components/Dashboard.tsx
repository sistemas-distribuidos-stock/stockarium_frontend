import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  DollarSign,
  Activity
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { products, movements, alerts } = useApp();

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = alerts.filter(a => !a.read).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
  
  const recentMovements = movements.slice(0, 5);

  const stats = [
    {
      label: 'Total Productos',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      label: 'Stock Total',
      value: totalStock,
      icon: Activity,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      label: 'Valor Inventario',
      value: `$${totalValue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      label: 'Stock Bajo',
      value: lowStockCount,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    {
      label: 'Sin Stock',
      value: outOfStockCount,
      icon: TrendingDown,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ];

  const lowStockProducts = products
    .filter(p => p.stock <= p.minStock && p.stock > 0)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Resumen general del inventario</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-slate-600 mb-1">{stat.label}</p>
              <p className={`${stat.textColor} text-2xl`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Movements */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <h2 className="text-slate-900 mb-4">Movimientos Recientes</h2>
          
          {recentMovements.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No hay movimientos registrados</p>
          ) : (
            <div className="space-y-3">
              {recentMovements.map(movement => (
                <div 
                  key={movement.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {movement.type === 'entrada' ? (
                      <div className="bg-green-100 p-2 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="bg-red-100 p-2 rounded-lg">
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      </div>
                    )}
                    <div>
                      <p className="text-slate-900">{movement.productName}</p>
                      <p className="text-slate-500 text-sm">{movement.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`${movement.type === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                      {movement.type === 'entrada' ? '+' : '-'}{movement.quantity}
                    </p>
                    <p className="text-slate-500 text-sm">
                      {new Date(movement.date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <h2 className="text-slate-900 mb-4">Productos con Stock Bajo</h2>
          
          {lowStockProducts.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-slate-600">¡Todo está bien!</p>
              <p className="text-slate-500 text-sm">No hay productos con stock bajo</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map(product => (
                <div 
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                >
                  <div>
                    <p className="text-slate-900">{product.name}</p>
                    <p className="text-slate-600 text-sm">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-600">
                      {product.stock} / {product.minStock}
                    </p>
                    <p className="text-slate-500 text-sm">unidades</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Categories Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <h2 className="text-slate-900 mb-4">Distribución por Categorías</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from(new Set(products.map(p => p.category))).map(category => {
            const categoryProducts = products.filter(p => p.category === category);
            const categoryStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0);
            
            return (
              <div key={category} className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-900 mb-2">{category}</p>
                <p className="text-slate-600 text-sm mb-1">
                  {categoryProducts.length} productos
                </p>
                <p className="text-indigo-600">
                  {categoryStock} unidades
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
