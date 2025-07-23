'use client';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSidebar } from '@/app/context/SidebarContext';

export default function HamburgerMenu() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="fixed top-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-xl theme-glass theme-border transition-all duration-300 hover:scale-105 lg:hidden"
      aria-label={isCollapsed ? 'Abrir menú' : 'Cerrar menú'}
    >
      {isCollapsed ? (
        <Bars3Icon className="h-6 w-6 theme-text-primary" />
      ) : (
        <XMarkIcon className="h-6 w-6 theme-text-primary" />
      )}
    </button>
  );
}
