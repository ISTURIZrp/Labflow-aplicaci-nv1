'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CubeIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useInsumos, useLotesByInsumo, getStockStatus, getDaysUntilExpiration, Insumo, Lote } from '@/app/hooks/useFirestore';

export default function InsumosPage() {
  const { insumos, loading, error } = useInsumos();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInsumo, setSelectedInsumo] = useState<Insumo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showNewInsumoModal, setShowNewInsumoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showNewLoteModal, setShowNewLoteModal] = useState(false);
  const [selectedLote, setSelectedLote] = useState<any>(null);

  // Filtrar insumos basado en búsqueda
  const filteredInsumos = insumos.filter(insumo =>
    insumo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insumo.id_original.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular estadísticas
  const stats = {
    total: insumos.length,
    disponibles: insumos.filter(i => getStockStatus(i.existencia_total, i.stock_minimo) === 'Disponible').length,
    bajoStock: insumos.filter(i => ['Bajo Stock', 'Crítico'].includes(getStockStatus(i.existencia_total, i.stock_minimo))).length,
    criticos: insumos.filter(i => getStockStatus(i.existencia_total, i.stock_minimo) === 'Crítico').length,
    agotados: insumos.filter(i => getStockStatus(i.existencia_total, i.stock_minimo) === 'Agotado').length,
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Disponible':
        return 'var(--accent-secondary)';
      case 'Bajo Stock':
        return '#f59e0b';
      case 'Crítico':
        return 'var(--action-error)';
      case 'Agotado':
        return '#6b7280';
      default:
        return 'var(--text-secondary)';
    }
  };

  const toggleRow = (insumoId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(insumoId)) {
      newExpanded.delete(insumoId);
    } else {
      newExpanded.add(insumoId);
    }
    setExpandedRows(newExpanded);
  };

  const handleViewInsumo = (insumo: Insumo) => {
    setSelectedInsumo(insumo);
    setShowModal(true);
  };

  const handleEditInsumo = (insumo: Insumo) => {
    setSelectedInsumo(insumo);
    setShowEditModal(true);
  };

  const handleDeleteInsumo = (insumo: Insumo) => {
    setSelectedInsumo(insumo);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // TODO: Implementar eliminación en Firebase
    console.log('Eliminando insumo:', selectedInsumo);
    alert(`Insumo "${selectedInsumo?.nombre}" eliminado correctamente (Demo)`);
    setShowDeleteModal(false);
    setSelectedInsumo(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--accent-primary)' }}></div>
          <p className="theme-text-secondary">Cargando insumos...</p>
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
        <h3 className="text-lg font-semibold theme-text-primary mb-2">Error al cargar datos</h3>
        <p className="theme-text-secondary text-sm mb-4">{error}</p>

        {error.includes('permisos') && (
          <div className="theme-bg-container rounded-lg p-4 mt-4 text-left">
            <h4 className="font-semibold theme-text-primary mb-2">Solución rápida:</h4>
            <ol className="text-sm theme-text-secondary space-y-1 list-decimal list-inside">
              <li>Ve a Firebase Console</li>
              <li>Firestore Database → Rules</li>
              <li>Cambia las reglas a: <code className="bg-gray-200 px-1 rounded">allow read, write: if true;</code></li>
              <li>Haz clic en "Publish"</li>
            </ol>
          </div>
        )}

        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105"
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
          Gestión de Insumos
        </h1>
        <p className="theme-text-secondary">
          Control y administración de inventario de insumos con lotes
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
                placeholder="Buscar insumos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg theme-glass theme-border theme-text-primary placeholder:theme-text-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                style={{ focusRingColor: 'var(--accent-primary)' }}
              />
            </div>
            
            {/* Filter */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg theme-glass theme-border theme-text-secondary hover:theme-accent-primary transition-all duration-200">
              <FunnelIcon className="h-4 w-4" />
              <span className="hidden md:block">Filtros</span>
            </button>
          </div>

          {/* Add Button */}
          <button 
            onClick={() => setShowNewInsumoModal(true)}
            className="flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              boxShadow: 'var(--glass-shadow)'
            }}
          >
            <PlusIcon className="h-5 w-5" />
            Nuevo Insumo
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="theme-glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="theme-text-secondary text-sm font-medium">Total Insumos</p>
              <p className="text-2xl font-bold theme-text-primary">{stats.total}</p>
            </div>
            <CubeIcon className="h-8 w-8" style={{ color: 'var(--accent-primary)' }} />
          </div>
        </div>
        
        <div className="theme-glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="theme-text-secondary text-sm font-medium">Disponibles</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--accent-secondary)' }}>{stats.disponibles}</p>
            </div>
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--accent-secondary)' }}></div>
          </div>
        </div>
        
        <div className="theme-glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="theme-text-secondary text-sm font-medium">Bajo Stock</p>
              <p className="text-2xl font-bold" style={{ color: '#f59e0b' }}>{stats.bajoStock}</p>
            </div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          </div>
        </div>
        
        <div className="theme-glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="theme-text-secondary text-sm font-medium">Críticos</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--action-error)' }}>{stats.criticos}</p>
            </div>
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--action-error)' }}></div>
          </div>
        </div>

        <div className="theme-glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="theme-text-secondary text-sm font-medium">Agotados</p>
              <p className="text-2xl font-bold" style={{ color: '#6b7280' }}>{stats.agotados}</p>
            </div>
            <div className="h-3 w-3 rounded-full bg-gray-500"></div>
          </div>
        </div>
      </div>

      {/* Tabla con Acordeón */}
      <div className="theme-glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="theme-bg-container">
                <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary w-12"></th>
                <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Existencias Totales</th>
                <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Stock Mínimo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Estado</th>
                <th className="px-6 py-4 text-right text-sm font-semibold theme-text-primary">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border">
              {filteredInsumos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center theme-text-secondary">
                    {searchTerm ? 'No se encontraron insumos que coincidan con la búsqueda' : 'No hay insumos registrados'}
                  </td>
                </tr>
              ) : (
                filteredInsumos.map((insumo) => {
                  const estado = getStockStatus(insumo.existencia_total, insumo.stock_minimo);
                  const isExpanded = expandedRows.has(insumo.id!);

                  return (
                    <React.Fragment key={insumo.id}>
                      {/* Fila principal del insumo */}
                      <tr className="hover:theme-bg-container transition-colors">
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleRow(insumo.id!)}
                            className="p-1 rounded hover:theme-bg-container transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronDownIcon className="h-4 w-4 theme-text-secondary" />
                            ) : (
                              <ChevronRightIcon className="h-4 w-4 theme-text-secondary" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm theme-text-primary">{insumo.id_original}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium theme-text-primary">{insumo.nombre}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="theme-text-primary font-medium">
                            {insumo.existencia_total}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="theme-text-secondary">{insumo.stock_minimo}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ 
                              color: getEstadoColor(estado),
                              backgroundColor: `${getEstadoColor(estado)}20`
                            }}
                          >
                            {estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => handleViewInsumo(insumo)}
                              className="p-1 rounded theme-text-secondary hover:theme-accent-primary transition-colors"
                              title="Ver detalles"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditInsumo(insumo)}
                              className="p-1 rounded theme-text-secondary hover:theme-accent-primary transition-colors"
                              title="Editar"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteInsumo(insumo)}
                              className="p-1 rounded theme-text-secondary hover:text-red-500 transition-colors"
                              title="Eliminar"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Fila expandida con lotes */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="px-0 py-0">
                            <LotesSection insumoId={insumo.id!} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para ver detalles */}
      {showModal && selectedInsumo && (
        <div className="fixed inset-0 theme-modal-overlay flex items-center justify-center z-50 p-4">
          <div className="theme-modal rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold theme-text-primary mb-4">
              Detalles del Insumo
            </h3>
            <div className="space-y-3">
              <div>
                <span className="theme-text-secondary text-sm">ID Original:</span>
                <p className="theme-text-primary font-mono">{selectedInsumo.id_original}</p>
              </div>
              <div>
                <span className="theme-text-secondary text-sm">Nombre:</span>
                <p className="theme-text-primary font-medium">{selectedInsumo.nombre}</p>
              </div>
              <div>
                <span className="theme-text-secondary text-sm">Existencia Total:</span>
                <p className="theme-text-primary">{selectedInsumo.existencia_total}</p>
              </div>
              <div>
                <span className="theme-text-secondary text-sm">Stock Mínimo:</span>
                <p className="theme-text-primary">{selectedInsumo.stock_minimo}</p>
              </div>
              <div>
                <span className="theme-text-secondary text-sm">Fecha de Creación:</span>
                <p className="theme-text-primary">{new Date(selectedInsumo.created_at).toLocaleString('es-ES')}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-lg theme-glass theme-border theme-text-secondary hover:theme-accent-primary transition-all duration-200"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  window.location.href = `/dashboard/insumos/${selectedInsumo.id}/lotes`;
                }}
                className="flex-1 px-4 py-2 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  boxShadow: 'var(--glass-shadow)'
                }}
              >
                Ver Lotes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para nuevo insumo */}
      {showNewInsumoModal && (
        <NewInsumoModal
          onClose={() => setShowNewInsumoModal(false)}
          onSave={(newInsumo) => {
            // TODO: Implementar guardado en Firebase
            console.log('Nuevo insumo:', newInsumo);
            setShowNewInsumoModal(false);
            alert('Insumo creado correctamente (Demo)');
          }}
        />
      )}

      {/* Modal para editar insumo */}
      {showEditModal && selectedInsumo && (
        <EditInsumoModal
          insumo={selectedInsumo}
          onClose={() => {
            setShowEditModal(false);
            setSelectedInsumo(null);
          }}
          onSave={(updatedInsumo) => {
            // TODO: Implementar actualización en Firebase
            console.log('Insumo actualizado:', updatedInsumo);
            setShowEditModal(false);
            setSelectedInsumo(null);
            alert('Insumo actualizado correctamente (Demo)');
          }}
        />
      )}

      {/* Modal para confirmar eliminación */}
      {showDeleteModal && selectedInsumo && (
        <DeleteConfirmModal
          itemName={selectedInsumo.nombre}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedInsumo(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}

// Componente para mostrar los lotes de un insumo
function LotesSection({ insumoId }: { insumoId: string }) {
  const { lotes, loading, error } = useLotesByInsumo(insumoId);
  const [showNewLoteModal, setShowNewLoteModal] = useState(false);
  const [selectedLote, setSelectedLote] = useState<any>(null);
  const [showEditLoteModal, setShowEditLoteModal] = useState(false);
  const [showDeleteLoteModal, setShowDeleteLoteModal] = useState(false);

  const getExpiredStatus = (fechaCaducidad: string) => {
    const days = getDaysUntilExpiration(fechaCaducidad);
    if (days < 0) return { status: 'Caducado', color: 'var(--action-error)', icon: <ExclamationTriangleIcon className="h-4 w-4" /> };
    if (days <= 30) return { status: 'Próximo a caducar', color: '#f59e0b', icon: <CalendarIcon className="h-4 w-4" /> };
    return { status: 'Vigente', color: 'var(--accent-secondary)', icon: <CalendarIcon className="h-4 w-4" /> };
  };

  const handleEditLote = (lote: any) => {
    setSelectedLote(lote);
    setShowEditLoteModal(true);
  };

  const handleDeleteLote = (lote: any) => {
    setSelectedLote(lote);
    setShowDeleteLoteModal(true);
  };

  const confirmDeleteLote = () => {
    // TODO: Implementar eliminación en Firebase
    console.log('Eliminando lote:', selectedLote);
    alert(`Lote "${selectedLote?.lote}" eliminado correctamente (Demo)`);
    setShowDeleteLoteModal(false);
    setSelectedLote(null);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: 'var(--accent-primary)' }}></div>
          <span className="ml-2 theme-text-secondary">Cargando lotes...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="theme-bg-container p-6 rounded-lg">
        <p className="text-red-600 text-sm">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="theme-bg-container border-t theme-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold theme-text-primary">Lotes del Insumo</h4>
          <button
            onClick={() => setShowNewLoteModal(true)}
            className="flex items-center gap-2 px-3 py-1 text-sm rounded-lg text-white font-medium transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              boxShadow: 'var(--glass-shadow)'
            }}
          >
            <PlusIcon className="h-4 w-4" />
            Nuevo Lote
          </button>
        </div>

        {lotes.length === 0 ? (
          <div className="text-center py-8 theme-text-secondary">
            <CubeIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No hay lotes registrados para este insumo</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lotes.map((lote) => {
              const expirationInfo = getExpiredStatus(lote.fecha_caducidad);
              const daysUntilExpiration = getDaysUntilExpiration(lote.fecha_caducidad);
              
              return (
                <div key={lote.id} className="theme-glass rounded-lg p-4 border theme-border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-semibold theme-text-primary">Lote: {lote.lote}</h5>
                      <p className="text-lg font-bold theme-text-primary">{lote.existencia} unidades</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm" style={{ color: expirationInfo.color }}>
                        {expirationInfo.icon}
                        <span>{expirationInfo.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="theme-text-secondary">Fecha de caducidad:</span>
                      <span className="theme-text-primary font-medium">
                        {new Date(lote.fecha_caducidad).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    
                    {daysUntilExpiration >= 0 && (
                      <div className="flex justify-between">
                        <span className="theme-text-secondary">Días restantes:</span>
                        <span className="theme-text-primary font-medium">{daysUntilExpiration} días</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="theme-text-secondary">Fecha de registro:</span>
                      <span className="theme-text-primary">
                        {new Date(lote.created_at).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEditLote(lote)}
                      className="flex-1 px-3 py-1 text-sm rounded theme-glass theme-border theme-text-secondary hover:theme-accent-primary transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteLote(lote)}
                      className="flex-1 px-3 py-1 text-sm rounded theme-glass theme-border theme-text-secondary hover:text-red-500 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modales para lotes */}
      {showNewLoteModal && (
        <NewLoteModal
          insumoId={insumoId}
          onClose={() => setShowNewLoteModal(false)}
          onSave={(newLote) => {
            // TODO: Implementar guardado en Firebase
            console.log('Nuevo lote:', newLote);
            setShowNewLoteModal(false);
            alert('Lote creado correctamente (Demo)');
          }}
        />
      )}

      {showEditLoteModal && selectedLote && (
        <EditLoteModal
          lote={selectedLote}
          onClose={() => {
            setShowEditLoteModal(false);
            setSelectedLote(null);
          }}
          onSave={(updatedLote) => {
            // TODO: Implementar actualización en Firebase
            console.log('Lote actualizado:', updatedLote);
            setShowEditLoteModal(false);
            setSelectedLote(null);
            alert('Lote actualizado correctamente (Demo)');
          }}
        />
      )}

      {showDeleteLoteModal && selectedLote && (
        <DeleteConfirmModal
          itemName={`Lote ${selectedLote.lote}`}
          onClose={() => {
            setShowDeleteLoteModal(false);
            setSelectedLote(null);
          }}
          onConfirm={confirmDeleteLote}
        />
      )}
    </div>
  );
}

// Componente para el modal de nuevo insumo
function NewInsumoModal({ onClose, onSave }: { onClose: () => void; onSave: (insumo: any) => void }) {
  const [formData, setFormData] = useState({
    nombre: '',
    id_original: '',
    existencia_total: 0,
    stock_minimo: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      created_at: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 theme-modal-overlay flex items-center justify-center z-50 p-4">
      <div className="theme-modal rounded-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold theme-text-primary mb-4">
          Nuevo Insumo
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              Nombre del Insumo
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
            />
          </div>
          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              ID Original
            </label>
            <input
              type="text"
              required
              value={formData.id_original}
              onChange={(e) => setFormData({...formData, id_original: e.target.value})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block theme-text-secondary text-sm font-medium mb-1">
                Existencia Inicial
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.existencia_total}
                onChange={(e) => setFormData({...formData, existencia_total: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
                style={{ focusRingColor: 'var(--accent-primary)' }}
              />
            </div>
            <div>
              <label className="block theme-text-secondary text-sm font-medium mb-1">
                Stock Mínimo
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.stock_minimo}
                onChange={(e) => setFormData({...formData, stock_minimo: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
                style={{ focusRingColor: 'var(--accent-primary)' }}
              />
            </div>
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
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente para editar insumo
function EditInsumoModal({ insumo, onClose, onSave }: { insumo: Insumo; onClose: () => void; onSave: (insumo: any) => void }) {
  const [formData, setFormData] = useState({
    nombre: insumo.nombre,
    id_original: insumo.id_original,
    existencia_total: insumo.existencia_total,
    stock_minimo: insumo.stock_minimo
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...insumo,
      ...formData
    });
  };

  return (
    <div className="fixed inset-0 theme-modal-overlay flex items-center justify-center z-50 p-4">
      <div className="theme-modal rounded-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold theme-text-primary mb-4">
          Editar Insumo
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              Nombre del Insumo
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
            />
          </div>
          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              ID Original
            </label>
            <input
              type="text"
              required
              value={formData.id_original}
              onChange={(e) => setFormData({...formData, id_original: e.target.value})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block theme-text-secondary text-sm font-medium mb-1">
                Existencia Total
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.existencia_total}
                onChange={(e) => setFormData({...formData, existencia_total: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
                style={{ focusRingColor: 'var(--accent-primary)' }}
              />
            </div>
            <div>
              <label className="block theme-text-secondary text-sm font-medium mb-1">
                Stock Mínimo
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.stock_minimo}
                onChange={(e) => setFormData({...formData, stock_minimo: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
                style={{ focusRingColor: 'var(--accent-primary)' }}
              />
            </div>
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

// Componente para confirmar eliminación
function DeleteConfirmModal({ itemName, onClose, onConfirm }: { itemName: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 theme-modal-overlay flex items-center justify-center z-50 p-4">
      <div className="theme-modal rounded-xl p-6 max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold theme-text-primary mb-2">
            Confirmar Eliminación
          </h3>
          <p className="theme-text-secondary mb-6">
            ¿Estás seguro de que deseas eliminar "{itemName}"? Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg theme-glass theme-border theme-text-secondary hover:theme-accent-primary transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105 bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para nuevo lote
function NewLoteModal({ insumoId, onClose, onSave }: { insumoId: string; onClose: () => void; onSave: (lote: any) => void }) {
  const [formData, setFormData] = useState({
    lote: '',
    existencia: 0,
    fecha_caducidad: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      insumo_id: insumoId,
      created_at: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 theme-modal-overlay flex items-center justify-center z-50 p-4">
      <div className="theme-modal rounded-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold theme-text-primary mb-4">
          Nuevo Lote
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              Número de Lote
            </label>
            <input
              type="text"
              required
              value={formData.lote}
              onChange={(e) => setFormData({...formData, lote: e.target.value})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
            />
          </div>
          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              Cantidad
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.existencia}
              onChange={(e) => setFormData({...formData, existencia: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
            />
          </div>
          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              Fecha de Caducidad
            </label>
            <input
              type="date"
              required
              value={formData.fecha_caducidad}
              onChange={(e) => setFormData({...formData, fecha_caducidad: e.target.value})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
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
              Crear Lote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente para editar lote
function EditLoteModal({ lote, onClose, onSave }: { lote: any; onClose: () => void; onSave: (lote: any) => void }) {
  const [formData, setFormData] = useState({
    lote: lote.lote,
    existencia: lote.existencia,
    fecha_caducidad: lote.fecha_caducidad
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...lote,
      ...formData
    });
  };

  return (
    <div className="fixed inset-0 theme-modal-overlay flex items-center justify-center z-50 p-4">
      <div className="theme-modal rounded-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold theme-text-primary mb-4">
          Editar Lote
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              Número de Lote
            </label>
            <input
              type="text"
              required
              value={formData.lote}
              onChange={(e) => setFormData({...formData, lote: e.target.value})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
            />
          </div>
          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              Cantidad
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.existencia}
              onChange={(e) => setFormData({...formData, existencia: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
            />
          </div>
          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              Fecha de Caducidad
            </label>
            <input
              type="date"
              required
              value={formData.fecha_caducidad}
              onChange={(e) => setFormData({...formData, fecha_caducidad: e.target.value})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
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
