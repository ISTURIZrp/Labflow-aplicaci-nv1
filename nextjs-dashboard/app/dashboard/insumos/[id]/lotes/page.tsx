'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { 
  ArrowLeftIcon,
  PlusIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import ThemeToggle from '@/app/ui/theme-toggle';
import { useLotesByInsumo, useInsumos, getDaysUntilExpiration, Lote } from '@/app/hooks/useFirestore';

export default function LotesPage() {
  const params = useParams();
  const router = useRouter();
  const insumoId = params?.id as string;
  
  const { insumos } = useInsumos();
  const { lotes, loading, error } = useLotesByInsumo(insumoId);
  
  const insumo = insumos.find(i => i.id === insumoId);

  const getExpirationStatus = (fechaCaducidad: string) => {
    const days = getDaysUntilExpiration(fechaCaducidad);
    if (days < 0) return 'Vencido';
    if (days <= 30) return 'Por Vencer';
    if (days <= 90) return 'Próximo a Vencer';
    return 'Vigente';
  };

  const getExpirationColor = (status: string) => {
    switch (status) {
      case 'Vencido':
        return 'var(--action-error)';
      case 'Por Vencer':
        return '#f59e0b';
      case 'Próximo a Vencer':
        return '#f97316';
      case 'Vigente':
        return 'var(--accent-secondary)';
      default:
        return 'var(--text-secondary)';
    }
  };

  const getExpirationIcon = (status: string) => {
    switch (status) {
      case 'Vencido':
        return <ExclamationTriangleIcon className="h-4 w-4" style={{ color: 'var(--action-error)' }} />;
      case 'Por Vencer':
        return <ExclamationTriangleIcon className="h-4 w-4" style={{ color: '#f59e0b' }} />;
      case 'Próximo a Vencer':
        return <ClockIcon className="h-4 w-4" style={{ color: '#f97316' }} />;
      case 'Vigente':
        return <CheckCircleIcon className="h-4 w-4" style={{ color: 'var(--accent-secondary)' }} />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  // Calcular estadísticas de lotes
  const stats = {
    total: lotes.length,
    vigentes: lotes.filter(l => getExpirationStatus(l.fecha_caducidad) === 'Vigente').length,
    porVencer: lotes.filter(l => ['Por Vencer', 'Próximo a Vencer'].includes(getExpirationStatus(l.fecha_caducidad))).length,
    vencidos: lotes.filter(l => getExpirationStatus(l.fecha_caducidad) === 'Vencido').length,
    existenciaTotal: lotes.reduce((total, lote) => total + lote.existencia, 0),
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="p-6 theme-bg-body min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--accent-primary)' }}></div>
            <p className="theme-text-secondary">Cargando lotes...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6 theme-bg-body min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg theme-glass theme-border theme-text-secondary hover:theme-accent-primary transition-all duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold theme-text-primary mb-2">
                Lotes de {insumo?.nombre || 'Insumo'}
              </h1>
              <p className="theme-text-secondary">
                Gestión de lotes y fechas de caducidad
              </p>
              {insumo && (
                <p className="theme-text-secondary text-sm mt-1">
                  ID: {insumo.id_original} | Stock Mínimo: {insumo.stock_minimo}
                </p>
              )}
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Actions Bar */}
        <div className="theme-glass rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1">
              <div className="theme-text-secondary">
                Total de lotes: <span className="theme-text-primary font-semibold">{stats.total}</span>
              </div>
            </div>

            {/* Add Lote Button */}
            <button 
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                boxShadow: 'var(--glass-shadow)'
              }}
            >
              <PlusIcon className="h-5 w-5" />
              Nuevo Lote
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="theme-glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="theme-text-secondary text-sm font-medium">Total Lotes</p>
                <p className="text-2xl font-bold theme-text-primary">{stats.total}</p>
              </div>
              <CalendarIcon className="h-8 w-8" style={{ color: 'var(--accent-primary)' }} />
            </div>
          </div>
          
          <div className="theme-glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="theme-text-secondary text-sm font-medium">Vigentes</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--accent-secondary)' }}>{stats.vigentes}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8" style={{ color: 'var(--accent-secondary)' }} />
            </div>
          </div>
          
          <div className="theme-glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="theme-text-secondary text-sm font-medium">Por Vencer</p>
                <p className="text-2xl font-bold" style={{ color: '#f59e0b' }}>{stats.porVencer}</p>
              </div>
              <ClockIcon className="h-8 w-8" style={{ color: '#f59e0b' }} />
            </div>
          </div>
          
          <div className="theme-glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="theme-text-secondary text-sm font-medium">Vencidos</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--action-error)' }}>{stats.vencidos}</p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8" style={{ color: 'var(--action-error)' }} />
            </div>
          </div>

          <div className="theme-glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="theme-text-secondary text-sm font-medium">Existencia Total</p>
                <p className="text-2xl font-bold theme-text-primary">{stats.existenciaTotal}</p>
              </div>
              <div className="h-8 w-8 rounded-full theme-bg-container flex items-center justify-center">
                <span className="text-xs font-bold theme-text-primary">Σ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lotes Table */}
        <div className="theme-glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="theme-bg-container">
                  <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Lote</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Existencia</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Fecha Caducidad</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Días Restantes</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold theme-text-primary">Fecha Creación</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold theme-text-primary">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border">
                {lotes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center theme-text-secondary">
                      No hay lotes registrados para este insumo
                    </td>
                  </tr>
                ) : (
                  lotes.map((lote) => {
                    const expirationStatus = getExpirationStatus(lote.fecha_caducidad);
                    const daysUntilExpiration = getDaysUntilExpiration(lote.fecha_caducidad);
                    
                    return (
                      <tr key={lote.id} className="hover:theme-bg-container transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm theme-text-primary">{lote.lote}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="theme-text-primary font-medium">{lote.existencia}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="theme-text-primary">
                            {new Date(lote.fecha_caducidad).toLocaleDateString('es-ES')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${daysUntilExpiration < 0 ? 'text-red-500' : 'theme-text-primary'}`}>
                            {daysUntilExpiration < 0 ? `${Math.abs(daysUntilExpiration)} días vencido` : `${daysUntilExpiration} días`}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getExpirationIcon(expirationStatus)}
                            <span 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              style={{ 
                                color: getExpirationColor(expirationStatus),
                                backgroundColor: `${getExpirationColor(expirationStatus)}20`
                              }}
                            >
                              {expirationStatus}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="theme-text-secondary text-sm">
                            {new Date(lote.created_at).toLocaleDateString('es-ES')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="theme-text-secondary hover:theme-accent-primary transition-colors text-sm">
                            Editar
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="theme-glass rounded-xl p-6 mt-6">
            <div className="flex items-center gap-3 text-red-500">
              <ExclamationTriangleIcon className="h-5 w-5" />
              <span>Error al cargar lotes: {error}</span>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
