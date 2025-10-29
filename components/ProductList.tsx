import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  AlertCircle,
  CheckCircle,
  Package
} from 'lucide-react';
import { ProductForm } from './ProductForm';
import { Product } from '../types/types';

export const ProductList: React.FC = () => {
  const { products, deleteProduct, user } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (user?.role !== 'admin') {
      alert('Solo los administradores pueden eliminar productos');
      return;
    }
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      deleteProduct(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) {
      return { label: 'Sin stock', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle };
    } else if (product.stock <= product.minStock) {
      return { label: 'Stock bajo', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertCircle };
    } else {
      return { label: 'Stock OK', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle };
    }
  };

  if (showForm) {
    return <ProductForm product={editingProduct} onClose={handleCloseForm} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-slate-900 mb-2">Productos</h1>
          <p className="text-slate-600">Gestiona tu inventario de productos</p>
        </div>
        
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Agregar Producto
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Todas las categorías</option>
            {categories.filter(c => c !== 'all').map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 border border-slate-200 text-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 mb-2">No se encontraron productos</p>
          <p className="text-slate-500 text-sm">Intenta ajustar los filtros de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(product => {
            const status = getStockStatus(product);
            const StatusIcon = status.icon;

            return (
              <div 
                key={product.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-slate-900 mb-1">{product.name}</h3>
                    <p className="text-slate-500 text-sm">{product.sku}</p>
                  </div>
                  
                  {user?.role === 'admin' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-slate-600 text-sm mb-1">Categoría</p>
                    <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                      {product.category}
                    </span>
                  </div>

                  <div>
                    <p className="text-slate-600 text-sm mb-1">Precio</p>
                    <p className="text-slate-900">${product.price.toFixed(2)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-slate-600 text-sm mb-1">Stock actual</p>
                      <p className="text-slate-900">{product.stock}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm mb-1">Stock mínimo</p>
                      <p className="text-slate-900">{product.minStock}</p>
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${status.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    <span className="text-sm">{status.label}</span>
                  </div>

                  {product.description && (
                    <p className="text-slate-600 text-sm pt-2 border-t border-slate-200">
                      {product.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
