'use client';

import {
  HomeIcon,
  CubeIcon,
  ArrowsRightLeftIcon,
  ShoppingCartIcon,
  DocumentPlusIcon,
  CubeTransparentIcon,
  TruckIcon,
  UserGroupIcon,
  CogIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useSidebar } from '@/app/context/SidebarContext';

// Iconos principales para cada categoría
const categoryIcons = {
  'Principal': HomeIcon,
  'Gestión de Insumos': CubeIcon,
  'Productos y Envíos': CubeTransparentIcon,
  'Equipos': WrenchScrewdriverIcon,
  'Administración': CogIcon,
};

// Secciones organizadas por categorías para GESTION PRO
const sections = [
  {
    category: 'Principal',
    id: 'principal',
    links: [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    ]
  },
  {
    category: 'Gestión de Insumos',
    id: 'insumos',
    links: [
      { name: 'Insumos', href: '/dashboard/insumos', icon: CubeIcon },
      { name: 'Movimientos', href: '/dashboard/movimientos', icon: ArrowsRightLeftIcon },
      { name: 'Pedidos', href: '/dashboard/pedidos', icon: ShoppingCartIcon },
      { name: 'Registro Pedidos', href: '/dashboard/registro-pedidos', icon: DocumentPlusIcon },
    ]
  },
  {
    category: 'Productos y Envíos',
    id: 'productos',
    links: [
      { name: 'Productos', href: '/dashboard/productos', icon: CubeTransparentIcon },
      { name: 'Envíos', href: '/dashboard/envios', icon: TruckIcon },
    ]
  },
  {
    category: 'Equipos',
    id: 'equipos',
    links: [
      { name: 'Equipos', href: '/dashboard/equipos', icon: WrenchScrewdriverIcon },
      { name: 'Historial', href: '/dashboard/historial-equipos', icon: ClockIcon },
    ]
  },
  {
    category: 'Administración',
    id: 'administracion',
    links: [
      { name: 'Usuarios', href: '/dashboard/usuarios', icon: UserGroupIcon },
      { name: 'Ajustes', href: '/dashboard/ajustes', icon: CogIcon },
      { name: 'Configuración', href: '/dashboard/configuracion', icon: Cog6ToothIcon },
    ]
  }
];

export default function NavLinks() {
  const pathname = usePathname();
  const { isCollapsed, expandedSection, toggleSection } = useSidebar();

  // Verificar si algún link de una sección está activo
  const isSectionActive = (section: any) => {
    return section.links.some((link: any) => pathname === link.href);
  };

  // Si está colapsado, mostrar solo iconos de categorías
  if (isCollapsed) {
    return (
      <div className="space-y-2">
        {sections.map((section) => {
          const CategoryIcon = categoryIcons[section.category as keyof typeof categoryIcons];
          const isActive = isSectionActive(section);
          
          return (
            <button
              key={section.id}
              onClick={() => toggleSection(section.id)}
              className={clsx(
                'flex h-12 w-full items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105',
                {
                  'theme-glass theme-accent-primary': isActive,
                  'theme-text-secondary hover:theme-accent-primary hover:theme-bg-container': !isActive,
                }
              )}
              style={isActive ? {
                background: 'linear-gradient(135deg, var(--accent-glow-start), var(--accent-glow-end))',
                color: 'var(--accent-primary)'
              } : {}}
              title={section.category}
            >
              <CategoryIcon className="w-6 h-6 flex-shrink-0" />
            </button>
          );
        })}
      </div>
    );
  }

  // Si está expandido, mostrar categorías y sus links
  return (
    <div className="space-y-2">
      {sections.map((section) => {
        const CategoryIcon = categoryIcons[section.category as keyof typeof categoryIcons];
        const isExpanded = expandedSection === section.id;
        const isActive = isSectionActive(section);

        return (
          <div key={section.id} className="space-y-1">
            {/* Header de la categoría */}
            <button
              onClick={() => toggleSection(section.id)}
              className={clsx(
                'flex h-11 w-full items-center gap-3 rounded-xl px-4 text-sm font-medium transition-all duration-200 hover:scale-105',
                {
                  'theme-glass theme-accent-primary': isActive,
                  'theme-text-secondary hover:theme-accent-primary hover:theme-bg-container': !isActive,
                }
              )}
              style={isActive ? {
                background: 'linear-gradient(135deg, var(--accent-glow-start), var(--accent-glow-end))',
                color: 'var(--accent-primary)'
              } : {}}
            >
              <CategoryIcon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-left truncate">{section.category}</span>
              {section.links.length > 1 && (
                <div className="transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                  <ChevronRightIcon className="w-4 h-4" />
                </div>
              )}
            </button>

            {/* Sub-items expandibles */}
            {isExpanded && section.links.length > 1 && (
              <div className="ml-8 space-y-1 overflow-hidden">
                {section.links.map((link) => {
                  const LinkIcon = link.icon;
                  const isLinkActive = pathname === link.href;
                  
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={clsx(
                        'flex h-9 items-center gap-3 rounded-lg px-3 text-sm transition-all duration-200 hover:scale-105',
                        {
                          'theme-glass theme-accent-primary': isLinkActive,
                          'theme-text-secondary hover:theme-accent-primary hover:theme-bg-container': !isLinkActive,
                        }
                      )}
                      style={isLinkActive ? {
                        background: 'linear-gradient(135deg, var(--accent-glow-start), var(--accent-glow-end))',
                        color: 'var(--accent-primary)'
                      } : {}}
                    >
                      <LinkIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Para categorías con un solo item, ir directamente al link */}
            {section.links.length === 1 && isExpanded && (
              <div className="ml-8">
                {section.links.map((link) => {
                  const LinkIcon = link.icon;
                  const isLinkActive = pathname === link.href;
                  
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={clsx(
                        'flex h-9 items-center gap-3 rounded-lg px-3 text-sm transition-all duration-200 hover:scale-105',
                        {
                          'theme-glass theme-accent-primary': isLinkActive,
                          'theme-text-secondary hover:theme-accent-primary hover:theme-bg-container': !isLinkActive,
                        }
                      )}
                      style={isLinkActive ? {
                        background: 'linear-gradient(135deg, var(--accent-glow-start), var(--accent-glow-end))',
                        color: 'var(--accent-primary)'
                      } : {}}
                    >
                      <LinkIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
