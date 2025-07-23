import ProtectedRoute from '@/app/components/ProtectedRoute';
import { ClockIcon } from '@heroicons/react/24/outline';
import ThemeToggle from '@/app/ui/theme-toggle';

export default function HistorialEquiposPage() {
  return (
    <ProtectedRoute>
      <div className="p-6 theme-bg-body min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold theme-text-primary mb-2">Historial de Equipos</h1>
            <p className="theme-text-secondary">Registro histórico de equipos</p>
          </div>
          <ThemeToggle />
        </div>
        <div className="theme-glass rounded-xl p-8 text-center">
          <ClockIcon className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--accent-primary)' }} />
          <h2 className="text-xl font-semibold theme-text-primary mb-2">Historial de Equipos</h2>
          <p className="theme-text-secondary">Funcionalidad en desarrollo</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
