import {
  DocumentTextIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  return (
    <div className="theme-glass rounded-xl p-8 mb-8">
      <h1 className="text-3xl font-bold theme-text-primary mb-4">
        ¡Bienvenido a GESTION PRO!
      </h1>
      <p className="theme-text-secondary mb-8 text-lg">
        Tu plataforma integral de gestión para tu empresa está lista.
      </p>

      {/* Dashboard Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="theme-glass rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <DocumentTextIcon className="h-8 w-8 mb-4" style={{ color: 'var(--accent-primary)' }} />
          <h3 className="text-lg font-semibold theme-text-primary mb-2">Facturas</h3>
          <p className="theme-text-secondary">Gestiona tus facturas</p>
        </div>

        <div className="theme-glass rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <UserGroupIcon className="h-8 w-8 mb-4" style={{ color: 'var(--accent-secondary)' }} />
          <h3 className="text-lg font-semibold theme-text-primary mb-2">Clientes</h3>
          <p className="theme-text-secondary">Administra tus clientes</p>
        </div>

        <div className="theme-glass rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <ChartBarIcon className="h-8 w-8 mb-4" style={{ color: 'var(--accent-primary)' }} />
          <h3 className="text-lg font-semibold theme-text-primary mb-2">Reportes</h3>
          <p className="theme-text-secondary">Visualiza tus métricas</p>
        </div>

        <div className="theme-glass rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <CogIcon className="h-8 w-8 mb-4" style={{ color: 'var(--accent-secondary)' }} />
          <h3 className="text-lg font-semibold theme-text-primary mb-2">Configuración</h3>
          <p className="theme-text-secondary">Personaliza tu cuenta</p>
        </div>
      </div>
    </div>
  );
}
