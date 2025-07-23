import { UserGroupIcon } from '@heroicons/react/24/outline';

export default function UsuariosPage() {
  return (
    <div className="theme-glass rounded-xl p-8 mb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold theme-text-primary mb-2">Usuarios y Perfil</h1>
        <p className="theme-text-secondary">Gestión de usuarios y perfiles</p>
      </div>

      <div className="theme-glass rounded-xl p-8 text-center">
        <UserGroupIcon className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--accent-primary)' }} />
        <h2 className="text-xl font-semibold theme-text-primary mb-2">Gestión de Usuarios</h2>
        <p className="theme-text-secondary">Funcionalidad en desarrollo</p>
      </div>
    </div>
  );
}
