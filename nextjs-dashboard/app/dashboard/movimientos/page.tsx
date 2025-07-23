'use client';

import { useState } from 'react';
import { 
  ArrowsRightLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useInsumos } from '@/app/hooks/useFirestore';

// Datos demo para movimientos
const movimientos = [
  {
    id: 1,
    fecha: '2024-01-20',
    tipo: 'Entrada',
    insumo: 'Acero Inoxidable 316L',
    cantidad: 25,
    unidad: 'kg',
    origen: 'Proveedor MetalCorp',
    destino: 'Almacén A-1',
    responsable: 'Juan Pérez',
    notas: 'Recepción de pedido #12345',
  },
  {
    id: 2,
    fecha: '2024-01-19',
    tipo: 'Salida',
    insumo: 'Válvulas de Control',
    cantidad: 5,
    unidad: 'pcs',
    origen: 'Almacén B-3',
    destino: 'Proyecto Alpha',
    responsable: 'María García',
    notas: 'Consumo para línea de producción',
  },
  {
    id: 3,
    fecha: '2024-01-19',
    tipo: 'Transferencia',
    insumo: 'Cables de Fibra Óptica',
    cantidad: 100,
    unidad: 'm',
    origen: 'Almacén C-1',
    destino: 'Almacén C-2',
    responsable: 'Carlos López',
    notas: 'Reorganización de inventario',
  },
  {
    id: 4,
    fecha: '2024-01-18',
    tipo: 'Entrada',
    insumo: 'Sensores de Temperatura',
    cantidad: 10,
    unidad: 'pcs',
    origen: 'Proveedor TechSensors',
    destino: 'Almacén B-1',
    responsable: 'Ana Rodríguez',
    notas: 'Reposición de stock crítico',
  },
];

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case 'Entrada':
      return <ArrowDownIcon className="h-4 w-4" style={{ color: 'var(--accent-secondary)' }} />;
    case 'Salida':
      return <ArrowUpIcon className="h-4 w-4" style={{ color: 'var(--action-error)' }} />;
    case 'Transferencia':
      return <ArrowsRightLeftIcon className="h-4 w-4" style={{ color: 'var(--accent-primary)' }} />;
    default:
      return <ArrowsRightLeftIcon className="h-4 w-4" />;
  }
};

const getTipoColor = (tipo: string) => {
  switch (tipo) {
    case 'Entrada':
      return 'var(--accent-secondary)';
    case 'Salida':
      return 'var(--action-error)';
    case 'Transferencia':
      return 'var(--accent-primary)';
    default:
      return 'var(--text-secondary)';
  }
};

export default function MovimientosPage() {
  const { insumos } = useInsumos();
  const [showNewMovimientoModal, setShowNewMovimientoModal] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('Todos');

  return (
    <>
      {/* Header */}
      <div className="theme-glass rounded-xl p-8 mb-8">
        <h1 className="text-3xl font-bold theme-text-primary mb-2">
          Movimientos de Insumos
        </h1>
        <p className="theme-text-secondary">
          Registro y seguimiento de movimientos de inventario
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
                placeholder="Buscar movimientos..."
                className="w-full pl-10 pr-4 py-2 rounded-lg theme-glass theme-border theme-text-primary placeholder:theme-text-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                style={{ focusRingColor: 'var(--accent-primary)' }}
              />
            </div>
            
            {/* Date Range */}
            <div className="relative">
              <CalendarDaysIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 theme-text-secondary" />
              <input
                type="date"
                className="pl-10 pr-4 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                style={{ focusRingColor: 'var(--accent-primary)' }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            {/* Filter Buttons */}
            {['Todos', 'Entradas', 'Salidas'].map((tipo) => (
              <button 
                key={tipo}
                onClick={() => setFiltroTipo(tipo)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  filtroTipo === tipo 
                    ? 'text-white font-semibold' 
                    : 'theme-glass theme-border theme-text-secondary hover:theme-accent-primary'
                }`}
                style={filtroTipo === tipo ? {
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  boxShadow: 'var(--glass-shadow)'
                } : {}}
              >
                {tipo}
              </button>
            ))}
            
            {/* New Movement Button */}
            <button 
              onClick={() => setShowNewMovimientoModal(true)}
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                boxShadow: 'var(--glass-shadow)'
              }}
            >
              <PlusIcon className="h-5 w-5" />
              Nuevo Movimiento
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="theme-glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="theme-text-secondary text-sm font-medium">Entradas Hoy</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--accent-secondary)' }}>12</p>
            </div>
            <ArrowDownIcon className="h-8 w-8" style={{ color: 'var(--accent-secondary)' }} />
          </div>
        </div>
        
        <div className="theme-glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="theme-text-secondary text-sm font-medium">Salidas Hoy</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--action-error)' }}>8</p>
            </div>
            <ArrowUpIcon className="h-8 w-8" style={{ color: 'var(--action-error)' }} />
          </div>
        </div>
        
        <div className="theme-glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="theme-text-secondary text-sm font-medium">Transferencias</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>5</p>
            </div>
            <ArrowsRightLeftIcon className="h-8 w-8" style={{ color: 'var(--accent-primary)' }} />
          </div>
        </div>
      </div>

      {/* Movements Table */}
      <div className="theme-glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="theme-bg-container">
                <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Tipo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Insumo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Cantidad</th>
                <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Origen</th>
                <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Destino</th>
                <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Responsable</th>
                <th className="px-6 py-4 text-right text-sm font-semibold theme-text-primary">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border">
              {movimientos.map((movimiento) => (
                <tr key={movimiento.id} className="hover:theme-bg-container transition-colors">
                  <td className="px-6 py-4">
                    <span className="theme-text-primary font-medium">
                      {new Date(movimiento.fecha).toLocaleDateString('es-ES')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getTipoIcon(movimiento.tipo)}
                      <span 
                        className="font-medium"
                        style={{ color: getTipoColor(movimiento.tipo) }}
                      >
                        {movimiento.tipo}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium theme-text-primary">{movimiento.insumo}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="theme-text-primary font-medium">
                      {movimiento.cantidad} {movimiento.unidad}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="theme-text-secondary text-sm">{movimiento.origen}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="theme-text-secondary text-sm">{movimiento.destino}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="theme-text-secondary text-sm">{movimiento.responsable}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="theme-text-secondary hover:theme-accent-primary transition-colors">
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para nuevo movimiento */}
      {showNewMovimientoModal && (
        <NewMovimientoModal 
          insumos={insumos}
          onClose={() => setShowNewMovimientoModal(false)}
          onSave={(newMovimiento) => {
            // TODO: Implementar guardado en Firebase
            console.log('Nuevo movimiento:', newMovimiento);
            setShowNewMovimientoModal(false);
            alert('Movimiento registrado correctamente (Demo)');
          }}
        />
      )}
    </>
  );
}

// Componente para el modal de nuevo movimiento
function NewMovimientoModal({ insumos, onClose, onSave }: { 
  insumos: any[]; 
  onClose: () => void; 
  onSave: (movimiento: any) => void 
}) {
  const [formData, setFormData] = useState({
    tipo: 'Entrada',
    insumo_id: '',
    cantidad: 0,
    unidad: 'kg',
    origen: '',
    destino: '',
    responsable: '',
    notas: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedInsumo = insumos.find(i => i.id === formData.insumo_id);
    onSave({
      ...formData,
      insumo_nombre: selectedInsumo?.nombre || '',
      fecha: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 theme-modal-overlay flex items-center justify-center z-50 p-4">
      <div className="theme-modal rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold theme-text-primary mb-4">
          Registrar Nuevo Movimiento
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de movimiento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Entrada', 'Salida', 'Transferencia'].map((tipo) => (
              <button
                key={tipo}
                type="button"
                onClick={() => setFormData({...formData, tipo})}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  formData.tipo === tipo 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'theme-border theme-bg-container theme-text-secondary hover:theme-border-accent'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {getTipoIcon(tipo)}
                  <span className="font-medium">{tipo}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Insumo */}
          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              Insumo
            </label>
            <select
              required
              value={formData.insumo_id}
              onChange={(e) => setFormData({...formData, insumo_id: e.target.value})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
            >
              <option value="">Seleccionar insumo...</option>
              {insumos.map((insumo) => (
                <option key={insumo.id} value={insumo.id}>
                  {insumo.nombre} - {insumo.id_original}
                </option>
              ))}
            </select>
          </div>

          {/* Cantidad y Unidad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block theme-text-secondary text-sm font-medium mb-1">
                Cantidad
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.cantidad}
                onChange={(e) => setFormData({...formData, cantidad: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
                style={{ focusRingColor: 'var(--accent-primary)' }}
              />
            </div>
            <div>
              <label className="block theme-text-secondary text-sm font-medium mb-1">
                Unidad
              </label>
              <select
                value={formData.unidad}
                onChange={(e) => setFormData({...formData, unidad: e.target.value})}
                className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
                style={{ focusRingColor: 'var(--accent-primary)' }}
              >
                <option value="kg">Kilogramos</option>
                <option value="pcs">Piezas</option>
                <option value="m">Metros</option>
                <option value="l">Litros</option>
                <option value="unidad">Unidades</option>
              </select>
            </div>
          </div>

          {/* Origen y Destino */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block theme-text-secondary text-sm font-medium mb-1">
                Origen
              </label>
              <input
                type="text"
                required
                value={formData.origen}
                onChange={(e) => setFormData({...formData, origen: e.target.value})}
                placeholder={formData.tipo === 'Entrada' ? 'Proveedor' : 'Almacén origen'}
                className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
                style={{ focusRingColor: 'var(--accent-primary)' }}
              />
            </div>
            <div>
              <label className="block theme-text-secondary text-sm font-medium mb-1">
                Destino
              </label>
              <input
                type="text"
                required
                value={formData.destino}
                onChange={(e) => setFormData({...formData, destino: e.target.value})}
                placeholder={formData.tipo === 'Salida' ? 'Proyecto/Cliente' : 'Almacén destino'}
                className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
                style={{ focusRingColor: 'var(--accent-primary)' }}
              />
            </div>
          </div>

          {/* Responsable */}
          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              Responsable
            </label>
            <input
              type="text"
              required
              value={formData.responsable}
              onChange={(e) => setFormData({...formData, responsable: e.target.value})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
            />
          </div>

          {/* Notas */}
          <div>
            <label className="block theme-text-secondary text-sm font-medium mb-1">
              Notas (opcional)
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData({...formData, notas: e.target.value})}
              className="w-full px-3 py-2 rounded-lg theme-glass theme-border theme-text-primary focus:outline-none focus:ring-2"
              style={{ focusRingColor: 'var(--accent-primary)' }}
              rows={3}
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
              Registrar Movimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
