import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, CheckCircle, Bell, Trash2 } from 'lucide-react';

export const Alerts: React.FC = () => {
  const { alerts, products, markAlertAsRead, clearAllAlerts } = useApp();

  const unreadAlerts = alerts.filter(a => !a.read);
  const readAlerts = alerts.filter(a => a.read);

  const getProduct = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-slate-900 mb-2">Alertas de Stock</h1>
          <p className="text-slate-600">Productos que requieren atención</p>
        </div>
        
        {unreadAlerts.length > 0 && (
          <button
            onClick={clearAllAlerts}
            className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Bell className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-slate-600">Alertas Activas</p>
              <p className="text-orange-600 text-2xl">{unreadAlerts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-slate-600">Sin Stock</p>
              <p className="text-red-600 text-2xl">
                {products.filter(p => p.stock === 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-slate-600">Resueltas</p>
              <p className="text-green-600 text-2xl">{readAlerts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Unread Alerts */}
      {unreadAlerts.length > 0 && (
        <div>
          <h2 className="text-slate-900 mb-4">Alertas Pendientes</h2>
          <div className="space-y-3">
            {unreadAlerts.map(alert => {
              const product = getProduct(alert.productId);
              const isOutOfStock = alert.currentStock === 0;

              return (
                <div 
                  key={alert.id}
                  className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${
                    isOutOfStock ? 'border-red-500' : 'border-orange-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${
                        isOutOfStock ? 'bg-red-100' : 'bg-orange-100'
                      }`}>
                        <AlertTriangle className={`w-6 h-6 ${
                          isOutOfStock ? 'text-red-600' : 'text-orange-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-slate-900">{alert.productName}</h3>
                          <span className={`px-2 py-1 rounded text-sm ${
                            isOutOfStock 
                              ? 'bg-red-100 text-red-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {isOutOfStock ? 'Sin stock' : 'Stock bajo'}
                          </span>
                        </div>
                        
                        <p className="text-slate-600 mb-3">
                          {isOutOfStock 
                            ? 'Este producto está agotado y no puede venderse.'
                            : `El stock actual está por debajo del nivel mínimo establecido.`
                          }
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {product && (
                            <>
                              <div>
                                <p className="text-slate-500">SKU</p>
                                <p className="text-slate-900">{product.sku}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Categoría</p>
                                <p className="text-slate-900">{product.category}</p>
                              </div>
                            </>
                          )}
                          <div>
                            <p className="text-slate-500">Stock actual</p>
                            <p className={isOutOfStock ? 'text-red-600' : 'text-orange-600'}>
                              {alert.currentStock} unidades
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Stock mínimo</p>
                            <p className="text-slate-900">{alert.minStock} unidades</p>
                          </div>
                        </div>
                        
                        <p className="text-slate-500 text-sm mt-3">
                          Alerta generada: {new Date(alert.timestamp).toLocaleString('es-ES')}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => markAlertAsRead(alert.id)}
                      className="ml-4 p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Marcar como leída"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Alerts Message */}
      {unreadAlerts.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 border border-slate-200 text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-slate-900 mb-2">¡Todo está bajo control!</h3>
          <p className="text-slate-600">No hay alertas de stock pendientes en este momento.</p>
        </div>
      )}

      {/* Read Alerts */}
      {readAlerts.length > 0 && (
        <div>
          <h2 className="text-slate-900 mb-4">Alertas Resueltas</h2>
          <div className="space-y-3">
            {readAlerts.map(alert => (
              <div 
                key={alert.id}
                className="bg-slate-50 rounded-xl p-6 border border-slate-200 opacity-60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-slate-900">{alert.productName}</p>
                      <p className="text-slate-600 text-sm">
                        Stock: {alert.currentStock} / {alert.minStock} - 
                        {' '}Resuelta: {new Date(alert.timestamp).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
