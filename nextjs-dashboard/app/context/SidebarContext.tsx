'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  expandedSection: string | null;
  toggleSection: (sectionId: string) => void;
  setExpandedSection: (sectionId: string | null) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Cambiar a true por defecto para mostrar solo iconos
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    // Verificar el tamaño de pantalla al cargar
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true); // Auto-colapsar en móvil
        setExpandedSection(null); // Cerrar secciones en móvil
      } else {
        // En desktop, empezar colapsado para mostrar solo iconos
        setIsCollapsed(true);
      }
    };

    // Verificar al cargar
    checkScreenSize();

    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    // Si se está colapsando, cerrar todas las secciones
    if (newState) {
      setExpandedSection(null);
    }
  };

  const closeSidebar = () => {
    setIsCollapsed(true);
    setExpandedSection(null);
  };

  const openSidebar = () => {
    setIsCollapsed(false);
  };

  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
      // Auto-expandir sidebar cuando se selecciona una sección
      if (isCollapsed) {
        setIsCollapsed(false);
      }
    }
  };

  const value: SidebarContextType = {
    isCollapsed,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    expandedSection,
    toggleSection,
    setExpandedSection,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};
