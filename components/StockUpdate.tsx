import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, TrendingDown, Package, Search } from 'lucide-react';

export const StockUpdate: React.FC = () => {
  const { products, updateStock, movements } = useApp();
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [type, setType] = useState<'entrada' | 'salida'>('entrada');
  const [reason, setReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedProduct = products.find(p => p.id === selectedProductId);
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId || quantity <= 0) {
      alert('Por favor completa todos los campos');
      return;
    }

    updateStock(selectedProductId, quantity, type, reason);
    
    // Reset form
    setQuantity(0);
    setReason('');
    alert('Stock actualizado correctamente');
  };

  const recentMovements = movements.slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900 mb-2">Actualizar Stock</h1>
        <p className="text-slate-600">Registra entradas y salidas de inventario</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Update Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <h2 className="text-slate-900 mb-4">Registrar Movimiento</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-700 mb-2">Tipo de movimiento</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('entrada')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    type === 'entrada'
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${
                    type === 'entrada' ? 'text-green-600' : 'text-slate-400'
                  }`} />
                  <p className="text-slate-900 text-center">Entrada</p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setType('salida')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    type === 'salida'
                      ? 'border-red-500 bg-red-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <TrendingDown className={`w-6 h-6 mx-auto mb-2 ${
                    type === 'salida' ? 'text-red-600' : 'text-slate-400'
                  }`} />
                  <p className="text-slate-900 text-center">Salida</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-2">Buscar producto</label>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre o SKU..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Selecciona un producto</option>
                {filteredProducts.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.sku} (Stock: {product.stock})
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-slate-600 text-sm mb-2">Información del producto</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-slate-500 text-sm">Stock actual</p>
                    <p className="text-slate-900">{selectedProduct.stock}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">Stock mínimo</p>
                    <p className="text-slate-900">{selectedProduct.minStock}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-700 mb-2">Cantidad</label>
              <input
                type="number"
                value={quantity || ''}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                required
                min="1"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ingresa la cantidad"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">Motivo</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={type === 'entrada' ? 'Ej: Reabastecimiento' : 'Ej: Venta'}
              />
            </div>

            {selectedProduct && quantity > 0 && (
              <div className={`p-4 rounded-lg ${
                type === 'entrada' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <p className="text-slate-700 mb-1">Stock resultante</p>
                <p className={`text-2xl ${type === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                  {type === 'entrada' 
                    ? selectedProduct.stock + quantity 
                    : selectedProduct.stock - quantity
                  } unidades
                </p>
              </div>
            )}

            <button
              type="submit"
              className={`w-full px-4 py-3 rounded-lg text-white transition-colors ${
                type === 'entrada'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {type === 'entrada' ? 'Registrar Entrada' : 'Registrar Salida'}
            </button>
          </form>
        </div>

        {/* Recent Movements */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <h2 className="text-slate-900 mb-4">Historial de Movimientos</h2>
          
          {recentMovements.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No hay movimientos registrados</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {recentMovements.map(movement => (
                <div 
                  key={movement.id}
                  className={`p-4 rounded-lg border ${
                    movement.type === 'entrada'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {movement.type === 'entrada' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                      <span className={`px-2 py-1 rounded text-sm ${
                        movement.type === 'entrada'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {movement.type === 'entrada' ? 'Entrada' : 'Salida'}
                      </span>
                    </div>
                    <span className={`${
                      movement.type === 'entrada' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {movement.type === 'entrada' ? '+' : '-'}{movement.quantity}
                    </span>
                  </div>
                  
                  <p className="text-slate-900 mb-1">{movement.productName}</p>
                  <p className="text-slate-600 text-sm mb-2">{movement.reason}</p>
                  
                  <div className="flex items-center justify-between text-slate-500 text-sm">
                    <span>{movement.user}</span>
                    <span>{new Date(movement.date).toLocaleString('es-ES')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
