'use client';

import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  DocumentTextIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

// Datos demo de pedidos registrados
const pedidosRegistrados = [
  {
    id: 1,
    numero_pedido: 'PED-INS-2024-001',
    proveedor: 'Suministros Industriales S.A.',
    fecha_pedido: '2024-01-15',
    fecha_requerida: '2024-01-25',
    fecha_entrega_estimada: '2024-01-23',
    estado: 'En Tránsito',
    prioridad: 'Alta',
    total_items: 150,
    items_recibidos: 0,
    valor_total: 2500000,
    valor_pagado: 1250000,
    observaciones: 'Pedido urgente para reposición de stock crítico',
    items: [
      { nombre: 'Acero Inoxidable 316L', cantidad: 50, recibido: 0, estado: 'Pendiente' },
      { nombre: 'Válvulas de Control', cantidad: 25, recibido: 0, estado: 'Pendiente' },
      { nombre: 'Sensores de Temperatura', cantidad: 75, recibido: 0, estado: 'Pendiente' }
    ],
    historial: [
      { fecha: '2024-01-15', evento: 'Pedido generado', usuario: 'Admin', notas: 'Pedido creado automáticamente por sistema' },
      { fecha: '2024-01-16', evento: 'Pedido enviado a proveedor', usuario: 'Juan Pérez', notas: 'Enviado por email y confirmado recepción' },
      { fecha: '2024-01-18', evento: 'Pago parcial realizado', usuario: 'María García', notas: 'Pagado 50% como anticipo' }
    ]
  },
  {
    id: 2,
    numero_pedido: 'PED-INS-2024-002',
    proveedor: 'TechComponents Ltd.',
    fecha_pedido: '2024-01-12',
    fecha_requerida: '2024-01-20',
    fecha_entrega_estimada: '2024-01-19',
    estado: 'Entrega Parcial',
    prioridad: 'Media',
    total_items: 200,
    items_recibidos: 120,
    valor_total: 1800000,
    valor_pagado: 1800000,
    observaciones: 'Entrega parcial recibida, faltantes por llegar',
    items: [
      { nombre: 'Kit de Sensores Avanzados', cantidad: 100, recibido: 80, estado: 'Parcial' },
      { nombre: 'Cables de Fibra Óptica', cantidad: 100, recibido: 40, estado: 'Parcial' }
    ],
    historial: [
      { fecha: '2024-01-12', evento: 'Pedido generado', usuario: 'Admin', notas: 'Reposición programada' },
      { fecha: '2024-01-13', evento: 'Pedido confirmado por proveedor', usuario: 'TechComponents', notas: 'Confirmación de disponibilidad' },
      { fecha: '2024-01-14', evento: 'Pago completo realizado', usuario: 'Carlos López', notas: 'Transferencia bancaria' },
      { fecha: '2024-01-19', evento: 'Entrega parcial recibida', usuario: 'Ana Rodríguez', notas: '60% del pedido recibido y verificado' }
    ]
  },
  {
    id: 3,
    numero_pedido: 'PED-INS-2024-003',
    proveedor: 'MetalCorp Internacional',
    fecha_pedido: '2024-01-10',
    fecha_requerida: '2024-01-18',
    fecha_entrega_estimada: '2024-01-17',
    estado: 'Completado',
    prioridad: 'Baja',
    total_items: 75,
    items_recibidos: 75,
    valor_total: 950000,
    valor_pagado: 950000,
    observaciones: 'Pedido completado satisfactoriamente',
    items: [
      { nombre: 'Panel de Instrumentación', cantidad: 25, recibido: 25, estado: 'Completo' },
      { nombre: 'Sistema de Control', cantidad: 50, recibido: 50, estado: 'Completo' }
    ],
    historial: [
      { fecha: '2024-01-10', evento: 'Pedido generado', usuario: 'Admin', notas: 'Reposición de rutina' },
      { fecha: '2024-01-11', evento: 'Pedido confirmado', usuario: 'MetalCorp', notas: 'Stock disponible' },
      { fecha: '2024-01-12', evento: 'Pago realizado', usuario: 'María García', notas: 'Pago contra entrega' },
      { fecha: '2024-01-17', evento: 'Entrega completa', usuario: 'Juan Pérez', notas: 'Todo recibido en perfecto estado' },
      { fecha: '2024-01-17', evento: 'Pedido cerrado', usuario: 'Admin', notas: 'Proceso completado exitosamente' }
    ]
  }
];

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case 'Pendiente':
      return { color: '#f59e0b', bg: '#f59e0b20' };
    case 'En Tránsito':
      return { color: 'var(--accent-primary)', bg: 'var(--accent-primary)20' };
    case 'Entrega Parcial':
      return { color: '#8b5cf6', bg: '#8b5cf620' };
    case 'Completado':
      return { color: 'var(--accent-secondary)', bg: 'var(--accent-secondary)20' };
    case 'Retrasado':
      return { color: 'var(--action-error)', bg: 'var(--action-error)20' };
    default:
      return { color: 'var(--text-secondary)', bg: 'var(--text-secondary)20' };
  }
};

const getEstadoIcon = (estado: string) => {
  switch (estado) {
    case 'Pendiente':
      return <ClockIcon className="h-4 w-4" />;
    case 'En Tránsito':
      return <TruckIcon className="h-4 w-4" />;
    case 'Entrega Parcial':
      return <ExclamationTriangleIcon className="h-4 w-4" />;
    case 'Completado':
      return <CheckCircleIcon className="h-4 w-4" />;
    case 'Retrasado':
      return <ExclamationTriangleIcon className="h-4 w-4" />;
    default:
      return <DocumentTextIcon className="h-4 w-4" />;
  }
};

export default function RegistroPedidosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [selectedPedido, setSelectedPedido] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Filtrar pedidos
  const filteredPedidos = pedidosRegistrados.filter(pedido => {
    const matchesSearch = pedido.numero_pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pedido.proveedor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filtroEstado === 'Todos' || pedido.estado === filtroEstado;
    return matchesSearch && matchesEstado;
  });

  // Calcular estadísticas
  const stats = {
    total: pedidosRegistrados.length,
    pendientes: pedidosRegistrados.filter(p => p.estado === 'Pendiente').length,
    enTransito: pedidosRegistrados.filter(p => p.estado === 'En Tránsito').length,
    parciales: pedidosRegistrados.filter(p => p.estado === 'Entrega Parcial').length,
    completados: pedidosRegistrados.filter(p => p.estado === 'Completado').length,
    valorTotal: pedidosRegistrados.reduce((sum, p) => sum + p.valor_total, 0),
    valorPagado: pedidosRegistrados.reduce((sum, p) => sum + p.valor_pagado, 0)
  };

  const handleViewPedido = (pedido: any) => {
    setSelectedPedido(pedido);
    setShowDetailModal(true);
  };

  const handleUpdatePedido = (pedido: any) => {
    setSelectedPedido(pedido);
    setShowUpdateModal(true);
  };

  return (
    <>
      {/* Header */}
      <div className="theme-glass rounded-xl p-8 mb-8">
        <h1 className="text-3xl font-bold theme-text-primary mb-2">
          Registro de Pedidos
        </h1>
        <p className="theme-text-secondary">
          Seguimiento y actualización del estado de pedidos realizados
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
                placeholder="Buscar por número de pedido o proveedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg theme-glass theme-border theme-text-primary placeholder:theme-text-secondary focus:outline-none focus:ring-2"
                style={{ focusRingColor: 'var(--accent-primary)' }}
              />
            </div>
            
            {/* Filter */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg theme-glass theme-border theme-text-secondary hover:theme-accent-primary transition-all duration-200">
              <FunnelIcon className="h-4 w-4" />
              <span className="hidden md:block">Filtros</span>
            </button>
          </div>

          <div className="flex gap-2">
            {/* Estado Filters */}
            {['Todos', 'Pendiente', 'En Tránsito', 'Entrega Parcial', 'Completado'].map((estado) => (
              <button 
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 ${
                  filtroEstado === estado 
                    ? 'text-white font-semibold' 
                    : 'theme-glass theme-border theme-text-secondary hover:theme-accent-primary'
                }`}
                style={filtroEstado === estado ? {
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  boxShadow: 'var(--glass-shadow)'
                } : {}}
              >
                {estado}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="theme-glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="theme-text-secondary text-sm font-medium">Total Pedidos</p>
              <p className="text-2xl font-bold theme-text-primary">{stats.total}</p>
            </div>
            <DocumentTextIcon className="h-8 w-8" style={{ color: 'var(--accent-primary)' }} />
          </div>
        </div>
        
        <div className="theme-glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="theme-text-secondary text-sm font-medium">En Proceso</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                {stats.pendientes + stats.enTransito + stats.parciales}
              </p>
            </div>
            <TruckIcon className="h-8 w-8" style={{ color: 'var(--accent-primary)' }} />
          </div>
        </div>
        
        <div className="theme-glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="theme-text-secondary text-sm font-medium">Completados</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--accent-secondary)' }}>{stats.completados}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8" style={{ color: 'var(--accent-secondary)' }} />
          </div>
        </div>

        <div className="theme-glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="theme-text-secondary text-sm font-medium">Valor Pagado</p>
              <p className="text-lg font-bold theme-text-primary">${(stats.valorPagado/1000000).toFixed(1)}M</p>
              <p className="text-xs theme-text-secondary">de ${(stats.valorTotal/1000000).toFixed(1)}M total</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8" style={{ color: 'var(--accent-primary)' }} />
          </div>
        </div>
      </div>

      {/* Pedidos Table */}
      <div className="theme-glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="theme-bg-container">
                <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Número</th>
                <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Proveedor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Fecha Pedido</th>
                <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Progreso</th>
                <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Valor</th>
                <th className="px-6 py-4 text-right text-sm font-semibold theme-text-primary">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border">
              {filteredPedidos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center theme-text-secondary">
                    {searchTerm || filtroEstado !== 'Todos' ? 'No se encontraron pedidos que coincidan con los filtros' : 'No hay pedidos registrados'}
                  </td>
                </tr>
              ) : (
                filteredPedidos.map((pedido) => {
                  const estadoStyle = getEstadoColor(pedido.estado);
                  const progreso = (pedido.items_recibidos / pedido.total_items) * 100;
                  const pagoPorcentaje = (pedido.valor_pagado / pedido.valor_total) * 100;
                  
                  return (
                    <tr key={pedido.id} className="hover:theme-bg-container transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm theme-text-primary font-medium">{pedido.numero_pedido}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium theme-text-primary">{pedido.proveedor}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="theme-text-primary">
                          {new Date(pedido.fecha_pedido).toLocaleDateString('es-ES')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span style={{ color: estadoStyle.color }}>
                            {getEstadoIcon(pedido.estado)}
                          </span>
                          <span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ 
                              color: estadoStyle.color,
                              backgroundColor: estadoStyle.bg
                            }}
                          >
                            {pedido.estado}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="theme-text-secondary">Items:</span>
                            <span className="theme-text-primary">{pedido.items_recibidos}/{pedido.total_items}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${progreso}%`,
                                backgroundColor: progreso === 100 ? 'var(--accent-secondary)' : 'var(--accent-primary)'
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="theme-text-secondary">Pago:</span>
                            <span className="theme-text-primary">{pagoPorcentaje.toFixed(0)}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-right">
                          <p className="theme-text-primary font-bold">${(pedido.valor_total/1000).toFixed(0)}K</p>
                          <p className="theme-text-secondary text-sm">Pagado: ${(pedido.valor_pagado/1000).toFixed(0)}K</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => handleViewPedido(pedido)}
                            className="p-1 rounded theme-text-secondary hover:theme-accent-primary transition-colors"
                            title="Ver detalles"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleUpdatePedido(pedido)}
                            className="p-1 rounded theme-text-secondary hover:theme-accent-primary transition-colors"
                            title="Actualizar estado"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para ver detalles */}
      {showDetailModal && selectedPedido && (
        <PedidoDetailModal 
          pedido={selectedPedido}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedPedido(null);
          }}
        />
      )}

      {/* Modal para actualizar estado */}
      {showUpdateModal && selectedPedido && (
        <UpdatePedidoModal 
          pedido={selectedPedido}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedPedido(null);
          }}
          onSave={(updatedPedido) => {
            console.log('Pedido actualizado:', updatedPedido);
            alert('Estado del pedido actualizado exitosamente (Demo)');
            setShowUpdateModal(false);
            setSelectedPedido(null);
          }}
        />
      )}
    </>
  );
}

// Componente para modal de detalles del pedido
function PedidoDetailModal({ pedido, onClose }: { pedido: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 theme-modal-overlay flex items-center justify-center z-50 p-4">
      <div className="theme-modal rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold theme-text-primary mb-6">
          Detalles del Pedido: {pedido.numero_pedido}
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información general */}
          <div className="space-y-6">
            <div className="theme-bg-container rounded-lg p-4">
              <h4 className="font-semibold theme-text-primary mb-3 flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Información General
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="theme-text-secondary">Proveedor:</span>
                  <span className="theme-text-primary font-medium">{pedido.proveedor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="theme-text-secondary">Fecha de Pedido:</span>
                  <span className="theme-text-primary">{new Date(pedido.fecha_pedido).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="theme-text-secondary">Fecha Requerida:</span>
                  <span className="theme-text-primary">{new Date(pedido.fecha_requerida).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="theme-text-secondary">Fecha Est. Entrega:</span>
                  <span className="theme-text-primary">{new Date(pedido.fecha_entrega_estimada).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="theme-text-secondary">Prioridad:</span>
                  <span className="theme-text-primary font-medium">{pedido.prioridad}</span>
                </div>
              </div>
            </div>

            {/* Progreso financiero */}
            <div className="theme-bg-container rounded-lg p-4">
              <h4 className="font-semibold theme-text-primary mb-3 flex items-center gap-2">
                <CurrencyDollarIcon className="h-5 w-5" />
                Información Financiera
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="theme-text-secondary">Valor Total:</span>
                  <span className="theme-text-primary font-bold">${pedido.valor_total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="theme-text-secondary">Valor Pagado:</span>
                  <span className="theme-text-primary font-bold">${pedido.valor_pagado.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="theme-text-secondary">Saldo Pendiente:</span>
                  <span className="theme-text-primary font-bold">${(pedido.valor_total - pedido.valor_pagado).toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div 
                    className="h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(pedido.valor_pagado / pedido.valor_total) * 100}%`,
                      backgroundColor: 'var(--accent-secondary)'
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Observaciones */}
            <div className="theme-bg-container rounded-lg p-4">
              <h4 className="font-semibold theme-text-primary mb-3">Observaciones</h4>
              <p className="theme-text-secondary text-sm">{pedido.observaciones}</p>
            </div>
          </div>

          {/* Items y historial */}
          <div className="space-y-6">
            {/* Items del pedido */}
            <div className="theme-bg-container rounded-lg p-4">
              <h4 className="font-semibold theme-text-primary mb-3">Items del Pedido</h4>
              <div className="space-y-2">
                {pedido.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded theme-glass">
                    <div>
                      <p className="theme-text-primary font-medium text-sm">{item.nombre}</p>
                      <p className="theme-text-secondary text-xs">
                        {item.recibido} de {item.cantidad} recibidos
                      </p>
                    </div>
                    <span 
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{ 
                        color: item.estado === 'Completo' ? 'var(--accent-secondary)' : 
                               item.estado === 'Parcial' ? '#f59e0b' : 'var(--text-secondary)',
                        backgroundColor: item.estado === 'Completo' ? 'var(--accent-secondary)20' : 
                                       item.estado === 'Parcial' ? '#f59e0b20' : 'var(--text-secondary)20'
                      }}
                    >
                      {item.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Historial */}
            <div className="theme-bg-container rounded-lg p-4">
              <h4 className="font-semibold theme-text-primary mb-3 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Historial del Pedido
              </h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {pedido.historial.map((evento: any, index: number) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-4 pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="theme-text-primary font-medium text-sm">{evento.evento}</p>
                        <p className="theme-text-secondary text-xs">por {evento.usuario}</p>
                      </div>
                      <span className="theme-text-secondary text-xs">
                        {new Date(evento.fecha).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    {evento.notas && (
                      <p className="theme-text-secondary text-xs mt-1">{evento.notas}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg theme-glass theme-border theme-text-secondary hover:theme-accent-primary transition-all duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente para modal de actualización
function UpdatePedidoModal({ pedido, onClose, onSave }: {
  pedido: any;
  onClose: () => void;
  onSave: (pedido: any) => void;
}) {
  const [formData, setFormData] = useState({
    estado: pedido.estado,
    fecha_entrega_estimada: pedido.fecha_entrega_estimada,
    valor_pagado: pedido.valor_pagado,
    observaciones: pedido.observaciones,
    nuevaNota: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pedidoActualizado = {
      ...pedido,
      ...formData,
      historial: [
        ...pedido.historial,
        {
          fecha: new Date().toISOString(),
          evento: 'Estado actualizado',
          usuario: 'Usuario Actual',
          notas: formData.nuevaNota || 'Actualización manual del estado'
        }
      ]
    };

    onSave(pedidoActualizado);
  };

  return (
    <div className="fixed inset-0 theme-modal-overlay flex items-center justify-center z-50 p-4">
      <div className="theme-modal rounded-xl p-6 max-w-2xl w-full">
        <h3 className="text-lg font-semibold theme-text-primary mb-4">
          Actualizar Pedido: {pedido.numero_pedido}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block theme-text-secondary text-sm font-medium mb-1">
                Estado del Pedido
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value})}
                className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
                style={{ focusRingColor: 'var(--accent-primary)' }}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Tránsito">En Tránsito</option>
                <option value="Entrega Parcial">Entrega Parcial</option>
                <option value="Completado">Completado</option>
                <option value="Retrasado">Retrasado</option>
              </select>
            </div>
            
            <div>
              <label className="block theme-text-secondary text-sm font-medium mb-1">
                Fecha Entrega Estimada
              </label>
              <input
                type="date"
                value={formData.fecha_entrega_estimada}
                onChange={(e) => setFormData({...formData, fecha_entrega_estimada: e.target.value})}
                className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
                style={{ focusRingColor: 'var(--accent-primary)' }}
              />
            </div>
          </div>

          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              Valor Pagado
            </label>
            <input
              type="number"
              min="0"
              max={pedido.valor_total}
              value={formData.valor_pagado}
              onChange={(e) => setFormData({...formData, valor_pagado: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
            />
          </div>

          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              Notas de Actualización
            </label>
            <textarea
              value={formData.nuevaNota}
              onChange={(e) => setFormData({...formData, nuevaNota: e.target.value})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
              rows={3}
              placeholder="Describe los cambios realizados..."
            />
          </div>

          <div className="flex gap-3 mt-6">
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
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
