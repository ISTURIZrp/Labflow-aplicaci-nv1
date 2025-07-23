'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CubeIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { useInsumos, getStockStatus } from '@/app/hooks/useFirestore';

export default function PedidosPage() {
  const { insumos, loading, error } = useInsumos();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInsumos, setSelectedInsumos] = useState<any[]>([]);
  const [articulosPersonalizados, setArticulosPersonalizados] = useState<any[]>([]);
  const [showPedidoModal, setShowPedidoModal] = useState(false);
  const [showArticuloModal, setShowArticuloModal] = useState(false);

  // Filtrar insumos que necesitan reabastecimiento
  const insumosFaltantes = insumos.filter(insumo => {
    const estado = getStockStatus(insumo.existencia_total, insumo.stock_minimo);
    return ['Bajo Stock', 'Crítico', 'Agotado'].includes(estado);
  });

  // Filtrar por búsqueda
  const filteredInsumos = insumosFaltantes.filter(insumo =>
    insumo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insumo.id_original.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estadísticas
  const stats = {
    criticos: insumos.filter(i => getStockStatus(i.existencia_total, i.stock_minimo) === 'Crítico').length,
    agotados: insumos.filter(i => getStockStatus(i.existencia_total, i.stock_minimo) === 'Agotado').length,
    bajoStock: insumos.filter(i => getStockStatus(i.existencia_total, i.stock_minimo) === 'Bajo Stock').length,
    totalFaltantes: insumosFaltantes.length
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Crítico':
        return 'var(--action-error)';
      case 'Agotado':
        return '#6b7280';
      case 'Bajo Stock':
        return '#f59e0b';
      default:
        return 'var(--text-secondary)';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Crítico':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'Agotado':
        return <ClockIcon className="h-4 w-4" />;
      case 'Bajo Stock':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <CubeIcon className="h-4 w-4" />;
    }
  };

  const toggleInsumoSelection = (insumo: any) => {
    setSelectedInsumos(prev => {
      const isSelected = prev.find(i => i.id === insumo.id);
      if (isSelected) {
        return prev.filter(i => i.id !== insumo.id);
      } else {
        // Calcular cantidad sugerida (el doble del stock mínimo)
        const cantidadSugerida = Math.max(insumo.stock_minimo * 2, 10);
        return [...prev, { ...insumo, cantidadPedido: cantidadSugerida }];
      }
    });
  };

  const actualizarCantidad = (insumoId: string, cantidad: number) => {
    setSelectedInsumos(prev =>
      prev.map(i => i.id === insumoId ? { ...i, cantidadPedido: Math.max(1, cantidad) } : i)
    );
  };

  const agregarArticuloPersonalizado = (articulo: any) => {
    const nuevoArticulo = {
      id: `custom-${Date.now()}`,
      tipo: 'personalizado',
      ...articulo
    };
    setArticulosPersonalizados(prev => [...prev, nuevoArticulo]);
    setShowArticuloModal(false);
  };

  const eliminarArticuloPersonalizado = (id: string) => {
    setArticulosPersonalizados(prev => prev.filter(a => a.id !== id));
  };

  const actualizarCantidadPersonalizada = (id: string, cantidad: number) => {
    setArticulosPersonalizados(prev =>
      prev.map(a => a.id === id ? { ...a, cantidad: Math.max(1, cantidad) } : a)
    );
  };

  const generarPedido = () => {
    if (selectedInsumos.length === 0 && articulosPersonalizados.length === 0) {
      alert('Selecciona al menos un insumo o agrega un artículo personalizado para generar el pedido');
      return;
    }
    setShowPedidoModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--accent-primary)' }}></div>
          <p className="theme-text-secondary">Cargando análisis de inventario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="theme-glass rounded-xl p-8 text-center">
        <div className="h-12 w-12 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-4">
          <span className="text-red-600 text-xl">⚠️</span>
        </div>
        <h3 className="text-lg font-semibold theme-text-primary mb-2">Error al cargar inventario</h3>
        <p className="theme-text-secondary text-sm mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            boxShadow: 'var(--glass-shadow)'
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="theme-glass rounded-xl p-8 mb-8">
        <h1 className="text-3xl font-bold theme-text-primary mb-2">
          Pedidos de Insumos
        </h1>
        <p className="theme-text-secondary">
          Generar pedidos para insumos faltantes en inventario
        </p>
      </div>

      {/* Actions Bar */}
      <div className="theme-glass rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 theme-text-secondary" />
              <input
                type="text"
                placeholder="Buscar insumos faltantes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg theme-glass theme-border theme-text-primary placeholder:theme-text-secondary focus:outline-none focus:ring-2"
                style={{ focusRingColor: 'var(--accent-primary)' }}
              />
            </div>
          </div>

          <div className="flex gap-4 items-center">
            {(selectedInsumos.length > 0 || articulosPersonalizados.length > 0) && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg theme-bg-container">
                <ShoppingCartIcon className="h-5 w-5 theme-text-primary" />
                <span className="theme-text-primary font-medium">
                  {selectedInsumos.length + articulosPersonalizados.length} elementos
                </span>
              </div>
            )}

            <button
              onClick={() => setShowArticuloModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg theme-glass theme-border theme-text-primary hover:theme-accent-primary transition-all duration-200"
            >
              <PlusIcon className="h-5 w-5" />
              Artículo Personalizado
            </button>

            <button
              onClick={generarPedido}
              disabled={selectedInsumos.length === 0 && articulosPersonalizados.length === 0}
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                boxShadow: 'var(--glass-shadow)'
              }}
            >
              <DocumentTextIcon className="h-5 w-5" />
              Generar Pedido
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="theme-glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="theme-text-secondary text-sm font-medium">Total Faltantes</p>
              <p className="text-2xl font-bold theme-text-primary">{stats.totalFaltantes}</p>
            </div>
            <CubeIcon className="h-8 w-8" style={{ color: 'var(--accent-primary)' }} />
          </div>
        </div>
        
        <div className="theme-glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="theme-text-secondary text-sm font-medium">Críticos</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--action-error)' }}>{stats.criticos}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8" style={{ color: 'var(--action-error)' }} />
          </div>
        </div>
        
        <div className="theme-glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="theme-text-secondary text-sm font-medium">Agotados</p>
              <p className="text-2xl font-bold" style={{ color: '#6b7280' }}>{stats.agotados}</p>
            </div>
            <ClockIcon className="h-8 w-8" style={{ color: '#6b7280' }} />
          </div>
        </div>

        <div className="theme-glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="theme-text-secondary text-sm font-medium">Bajo Stock</p>
              <p className="text-2xl font-bold" style={{ color: '#f59e0b' }}>{stats.bajoStock}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8" style={{ color: '#f59e0b' }} />
          </div>
        </div>
      </div>

      {/* Insumos Faltantes */}
      <div className="theme-glass rounded-xl overflow-hidden">
        <div className="px-6 py-4 theme-bg-container border-b theme-border">
          <h3 className="text-lg font-semibold theme-text-primary">
            Insumos que Requieren Reabastecimiento
          </h3>
          <p className="theme-text-secondary text-sm">
            Selecciona los insumos que deseas incluir en el pedido
          </p>
        </div>

        <div className="overflow-x-auto">
          {filteredInsumos.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircleIcon className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--accent-secondary)' }} />
              <h3 className="text-lg font-semibold theme-text-primary mb-2">
                {searchTerm ? 'No se encontraron insumos' : '¡Excelente! No hay insumos faltantes'}
              </h3>
              <p className="theme-text-secondary">
                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Todos los insumos tienen stock suficiente'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="theme-bg-container">
                  <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary w-12">
                    <input
                      type="checkbox"
                      checked={selectedInsumos.length === filteredInsumos.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedInsumos(filteredInsumos.map(insumo => ({
                            ...insumo,
                            cantidadPedido: Math.max(insumo.stock_minimo * 2, 10)
                          })));
                        } else {
                          setSelectedInsumos([]);
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Insumo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Stock Actual</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Stock Mínimo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Cantidad a Pedir</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border">
                {filteredInsumos.map((insumo) => {
                  const estado = getStockStatus(insumo.existencia_total, insumo.stock_minimo);
                  const isSelected = selectedInsumos.find(i => i.id === insumo.id);
                  
                  return (
                    <tr key={insumo.id} className={`hover:theme-bg-container transition-colors ${isSelected ? 'theme-bg-container' : ''}`}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={!!isSelected}
                          onChange={() => toggleInsumoSelection(insumo)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm theme-text-primary">{insumo.id_original}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium theme-text-primary">{insumo.nombre}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="theme-text-primary font-medium">{insumo.existencia_total}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="theme-text-secondary">{insumo.stock_minimo}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span style={{ color: getEstadoColor(estado) }}>
                            {getEstadoIcon(estado)}
                          </span>
                          <span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ 
                              color: getEstadoColor(estado),
                              backgroundColor: `${getEstadoColor(estado)}20`
                            }}
                          >
                            {estado}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isSelected ? (
                          <input
                            type="number"
                            min="1"
                            value={isSelected.cantidadPedido}
                            onChange={(e) => actualizarCantidad(insumo.id, parseInt(e.target.value) || 1)}
                            className="w-20 px-2 py-1 text-center rounded theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
                            style={{ focusRingColor: 'var(--accent-primary)' }}
                          />
                        ) : (
                          <span className="theme-text-secondary text-sm">
                            {Math.max(insumo.stock_minimo * 2, 10)} sugerido
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Artículos Personalizados */}
      {articulosPersonalizados.length > 0 && (
        <div className="theme-glass rounded-xl overflow-hidden mt-6">
          <div className="px-6 py-4 theme-bg-container border-b theme-border">
            <h3 className="text-lg font-semibold theme-text-primary">
              Artículos Personalizados
            </h3>
            <p className="theme-text-secondary text-sm">
              Artículos no registrados agregados al pedido
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="theme-bg-container">
                  <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Descripción</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Proveedor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Cantidad</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border">
                {articulosPersonalizados.map((articulo) => (
                  <tr key={articulo.id} className="hover:theme-bg-container transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium theme-text-primary">{articulo.nombre}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="theme-text-secondary text-sm">{articulo.descripcion || 'Sin descripción'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="theme-text-secondary">{articulo.proveedor || 'No especificado'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        min="1"
                        value={articulo.cantidad}
                        onChange={(e) => actualizarCantidadPersonalizada(articulo.id, parseInt(e.target.value) || 1)}
                        className="w-20 px-2 py-1 text-center rounded theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
                        style={{ focusRingColor: 'var(--accent-primary)' }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => eliminarArticuloPersonalizado(articulo.id)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal para generar pedido */}
      {showPedidoModal && (
        <GenerarPedidoModal
          insumosSeleccionados={selectedInsumos}
          articulosPersonalizados={articulosPersonalizados}
          onClose={() => setShowPedidoModal(false)}
          onConfirm={(pedido) => {
            console.log('Pedido generado:', pedido);
            alert('Pedido generado exitosamente (Demo)');
            setShowPedidoModal(false);
            setSelectedInsumos([]);
            setArticulosPersonalizados([]);
          }}
        />
      )}

      {/* Modal para agregar artículo personalizado */}
      {showArticuloModal && (
        <AgregarArticuloModal
          onClose={() => setShowArticuloModal(false)}
          onConfirm={agregarArticuloPersonalizado}
        />
      )}
    </>
  );
}

// Componente para el modal de generar pedido
function GenerarPedidoModal({ insumosSeleccionados, articulosPersonalizados, onClose, onConfirm }: {
  insumosSeleccionados: any[];
  articulosPersonalizados: any[];
  onClose: () => void;
  onConfirm: (pedido: any) => void;
}) {
  const [formData, setFormData] = useState({
    proveedor: '',
    fecha_requerida: '',
    prioridad: 'Media',
    observaciones: ''
  });

  const totalInsumos = insumosSeleccionados.reduce((sum, item) => sum + (item.cantidadPedido || 0), 0);
  const totalPersonalizados = articulosPersonalizados.reduce((sum, item) => sum + (item.cantidad || 0), 0);
  const total = totalInsumos + totalPersonalizados;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemsInsumos = insumosSeleccionados.map(insumo => ({
      id: insumo.id,
      tipo: 'insumo',
      nombre: insumo.nombre,
      id_original: insumo.id_original,
      cantidad: insumo.cantidadPedido,
      stock_actual: insumo.existencia_total,
      stock_minimo: insumo.stock_minimo
    }));

    const itemsPersonalizados = articulosPersonalizados.map(articulo => ({
      id: articulo.id,
      tipo: 'personalizado',
      nombre: articulo.nombre,
      descripcion: articulo.descripcion,
      proveedor: articulo.proveedor,
      cantidad: articulo.cantidad
    }));

    const pedido = {
      ...formData,
      items: [...itemsInsumos, ...itemsPersonalizados],
      total_items: total,
      fecha_pedido: new Date().toISOString(),
      numero_pedido: `PED-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      estado: 'Pendiente'
    };

    onConfirm(pedido);
  };

  return (
    <div className="fixed inset-0 theme-modal-overlay flex items-center justify-center z-50 p-4">
      <div className="theme-modal rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold theme-text-primary mb-4">
          Generar Pedido de Insumos
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del pedido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block theme-text-secondary text-sm font-medium mb-1">
                Proveedor
              </label>
              <input
                type="text"
                required
                value={formData.proveedor}
                onChange={(e) => setFormData({...formData, proveedor: e.target.value})}
                className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
                style={{ focusRingColor: 'var(--accent-primary)' }}
                placeholder="Nombre del proveedor"
              />
            </div>
            
            <div>
              <label className="block theme-text-secondary text-sm font-medium mb-1">
                Fecha Requerida
              </label>
              <input
                type="date"
                required
                value={formData.fecha_requerida}
                onChange={(e) => setFormData({...formData, fecha_requerida: e.target.value})}
                className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
                style={{ focusRingColor: 'var(--accent-primary)' }}
              />
            </div>
          </div>

          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              Prioridad
            </label>
            <select
              value={formData.prioridad}
              onChange={(e) => setFormData({...formData, prioridad: e.target.value})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
            >
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
              <option value="Urgente">Urgente</option>
            </select>
          </div>

          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              Observaciones
            </label>
            <textarea
              value={formData.observaciones}
              onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
              rows={3}
              placeholder="Notas adicionales del pedido"
            />
          </div>

          {/* Resumen de items */}
          <div className="theme-bg-container rounded-lg p-4">
            <h4 className="font-semibold theme-text-primary mb-3">Resumen del Pedido</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {/* Insumos registrados */}
              {insumosSeleccionados.map((insumo) => (
                <div key={insumo.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="theme-text-primary">{insumo.nombre}</span>
                    <span className="text-xs px-2 py-0.5 rounded theme-glass theme-text-secondary">Insumo</span>
                  </div>
                  <span className="theme-text-secondary">{insumo.cantidadPedido} unidades</span>
                </div>
              ))}

              {/* Artículos personalizados */}
              {articulosPersonalizados.map((articulo) => (
                <div key={articulo.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="theme-text-primary">{articulo.nombre}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">Personalizado</span>
                  </div>
                  <span className="theme-text-secondary">{articulo.cantidad} unidades</span>
                </div>
              ))}
            </div>
            <div className="border-t theme-border mt-3 pt-3">
              <div className="flex justify-between font-semibold">
                <span className="theme-text-primary">Total Items:</span>
                <span className="theme-text-primary">{total} unidades</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg theme-glass theme-border theme-text-secondary hover:theme-accent-primary transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                boxShadow: 'var(--glass-shadow)'
              }}
            >
              Generar Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente para el modal de agregar artículo personalizado
function AgregarArticuloModal({ onClose, onConfirm }: {
  onClose: () => void;
  onConfirm: (articulo: any) => void;
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    proveedor: '',
    cantidad: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      alert('El nombre del artículo es obligatorio');
      return;
    }

    onConfirm(formData);
  };

  return (
    <div className="fixed inset-0 theme-modal-overlay flex items-center justify-center z-50 p-4">
      <div className="theme-modal rounded-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold theme-text-primary mb-4">
          Agregar Artículo Personalizado
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              Nombre del Artículo *
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
              placeholder="Ej: Material especial, herramienta específica..."
            />
          </div>

          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
              rows={3}
              placeholder="Descripción detallada del artículo"
            />
          </div>

          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              Proveedor Sugerido
            </label>
            <input
              type="text"
              value={formData.proveedor}
              onChange={(e) => setFormData({...formData, proveedor: e.target.value})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
              placeholder="Nombre del proveedor recomendado"
            />
          </div>

          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              Cantidad
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.cantidad}
              onChange={(e) => setFormData({...formData, cantidad: parseInt(e.target.value) || 1})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg theme-glass theme-border theme-text-secondary hover:theme-accent-primary transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                boxShadow: 'var(--glass-shadow)'
              }}
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
