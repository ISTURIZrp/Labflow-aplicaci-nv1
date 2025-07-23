import {
  CubeTransparentIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

const productos = [
  {
    id: 1,
    nombre: 'Sistema de Control Industrial',
    categoria: 'Equipos',
    codigo: 'SCI-001',
    precio: 45000.00,
    stock: 8,
    estado: 'Activo',
    descripcion: 'Sistema completo de control para procesos industriales',
  },
  {
    id: 2,
    nombre: 'Panel de Instrumentación',
    categoria: 'Componentes',
    codigo: 'PI-002',
    precio: 12500.00,
    stock: 15,
    estado: 'Activo',
    descripcion: 'Panel con instrumentos de medición y control',
  },
  {
    id: 3,
    nombre: 'Kit de Sensores Avanzados',
    categoria: 'Sensores',
    codigo: 'KSA-003',
    precio: 8900.00,
    stock: 0,
    estado: 'Agotado',
    descripcion: 'Kit completo de sensores para monitoreo',
  },
];

export default function ProductosPage() {
  return (
    <>
      <div className="theme-glass rounded-xl p-8 mb-8">
        <h1 className="text-3xl font-bold theme-text-primary mb-2">
          Productos
        </h1>
        <p className="theme-text-secondary">
          Catálogo y gestión de productos terminados
        </p>
      </div>

        <div className="theme-glass rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 theme-text-secondary" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg theme-glass theme-border theme-text-primary placeholder:theme-text-secondary focus:outline-none focus:ring-2"
                />
              </div>
            </div>
            <button 
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                boxShadow: 'var(--glass-shadow)'
              }}
            >
              <PlusIcon className="h-5 w-5" />
              Nuevo Producto
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="theme-glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="theme-text-secondary text-sm font-medium">Total Productos</p>
                <p className="text-2xl font-bold theme-text-primary">156</p>
              </div>
              <CubeTransparentIcon className="h-8 w-8" style={{ color: 'var(--accent-primary)' }} />
            </div>
          </div>
          <div className="theme-glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="theme-text-secondary text-sm font-medium">En Stock</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--accent-secondary)' }}>134</p>
              </div>
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'var(--accent-secondary)' }}></div>
            </div>
          </div>
          <div className="theme-glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="theme-text-secondary text-sm font-medium">Valor Total</p>
                <p className="text-2xl font-bold theme-text-primary">$2.8M</p>
              </div>
              <TagIcon className="h-8 w-8" style={{ color: 'var(--accent-primary)' }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div key={producto.id} className="theme-glass rounded-xl p-6 transition-all duration-300 hover:scale-105">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold theme-text-primary mb-1">{producto.nombre}</h3>
                  <p className="text-sm theme-text-secondary mb-2">{producto.descripcion}</p>
                  <span className="text-xs px-2 py-1 rounded-full theme-bg-container theme-text-secondary">
                    {producto.codigo}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="theme-text-secondary">Categoría:</span>
                  <span className="theme-text-primary">{producto.categoria}</span>
                </div>
                <div className="flex justify-between">
                  <span className="theme-text-secondary">Stock:</span>
                  <span className="theme-text-primary font-semibold">{producto.stock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="theme-text-secondary">Precio:</span>
                  <span className="theme-text-primary font-bold">${producto.precio.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{ 
                    color: producto.estado === 'Activo' ? 'var(--accent-secondary)' : 'var(--action-error)',
                    backgroundColor: producto.estado === 'Activo' ? 'var(--accent-secondary)20' : 'var(--action-error)20'
                  }}
                >
                  {producto.estado}
                </span>
                <button className="theme-text-secondary hover:theme-accent-primary transition-colors">
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
    </>
  );
}
