import { TruckIcon } from '@heroicons/react/24/outline';

export default function EnviosPage() {
  return (
    <div className="theme-glass rounded-xl p-8 mb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold theme-text-primary mb-2">Envíos de Productos</h1>
        <p className="theme-text-secondary">Gestión y seguimiento de envíos</p>
      </div>

      <div className="theme-glass rounded-xl p-8 text-center">
        <TruckIcon className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--accent-primary)' }} />
        <h2 className="text-xl font-semibold theme-text-primary mb-2">Módulo de Envíos</h2>
        <p className="theme-text-secondary">Funcionalidad en desarrollo</p>
      </div>
    </div>
  );
}
