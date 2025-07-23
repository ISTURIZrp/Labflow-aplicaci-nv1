'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NavLinks from '@/app/ui/dashboard/nav-links';
import GestionProLogo from '@/app/ui/acme-logo';
import { PowerIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/app/context/AuthContext';
import { useSidebar } from '@/app/context/SidebarContext';

export default function SideNav() {
  const { logout } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      {/* Overlay para móvil */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => useSidebar().closeSidebar()}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 flex h-full flex-col
          theme-bg-container border-r theme-border
          transition-all duration-300 ease-in-out
          ${isCollapsed 
            ? '-translate-x-full lg:translate-x-0 lg:w-20' 
            : 'translate-x-0 w-80 lg:w-64'
          }
        `}
      >
        {/* Toggle Button - Solo en desktop */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 hidden lg:flex h-6 w-6 items-center justify-center rounded-full theme-glass theme-border transition-all duration-300 hover:scale-110"
          aria-label={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4 theme-text-primary" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4 theme-text-primary" />
          )}
        </button>

        <div className="flex h-full flex-col px-3 py-4">
          {/* Logo */}
          <Link
            className={`
              mb-4 flex items-center justify-center rounded-xl p-4 
              theme-glass transition-all duration-300 hover:scale-105
              ${isCollapsed ? 'h-16' : 'h-20 md:h-32'}
            `}
            href="/dashboard"
            style={{
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
            }}
          >
            <div className={`text-white transition-all duration-300 ${isCollapsed ? 'w-8' : 'w-32 md:w-40'}`}>
              {isCollapsed ? (
                <div className="text-center">
                  <span className="text-2xl font-bold">GP</span>
                </div>
              ) : (
                <GestionProLogo />
              )}
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex grow flex-col justify-between">
            <NavLinks />
            
            <div className="space-y-3">
              {/* Spacer */}
              <div className="hidden h-auto w-full grow md:block"></div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`
                  flex h-12 w-full items-center gap-3 rounded-xl theme-glass p-3 
                  text-sm font-medium theme-text-secondary transition-all duration-300 
                  hover:scale-105 hover:theme-accent-primary
                  ${isCollapsed ? 'justify-center' : 'justify-start px-4'}
                `}
                title={isCollapsed ? 'Cerrar sesión' : ''}
              >
                <PowerIcon className="w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="transition-opacity duration-300">Cerrar sesión</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
