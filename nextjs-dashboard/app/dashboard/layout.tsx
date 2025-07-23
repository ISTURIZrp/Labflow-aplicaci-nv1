'use client';

import ProtectedRoute from '@/app/components/ProtectedRoute';
import SideNav from '@/app/ui/dashboard/sidenav';
import HamburgerMenu from '@/app/ui/hamburger-menu';
import ThemeToggle from '@/app/ui/theme-toggle';
import { useSidebar } from '@/app/context/SidebarContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();

  return (
    <ProtectedRoute>
      <div className="flex h-screen theme-bg-body">
        <SideNav />
        <div 
          className={`
            flex-1 flex flex-col transition-all duration-300 overflow-hidden
          `}
        >
          <HamburgerMenu />
          <div className="flex-1 p-6 md:p-8 overflow-y-auto relative">
            {/* Theme Toggle */}
            <div className="absolute top-6 right-6 z-10">
              <ThemeToggle />
            </div>

            {/* Background gradient */}
            <div className="absolute inset-0 theme-gradient-accent opacity-5 pointer-events-none"></div>

            <div className="relative z-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
