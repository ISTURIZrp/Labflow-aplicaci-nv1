'use client';

import { useTheme } from '@/app/context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-14 h-8 rounded-full theme-glass border theme-border transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
      style={{
        background: isDark 
          ? 'linear-gradient(135deg, var(--accent-glow-start), var(--accent-glow-end))'
          : 'var(--glass-bg)'
      }}
      aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
    >
      <div
        className={`absolute w-6 h-6 bg-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out flex items-center justify-center ${
          isDark ? 'translate-x-3' : '-translate-x-3'
        }`}
        style={{
          background: isDark ? 'var(--accent-primary)' : '#ffffff',
          color: isDark ? '#ffffff' : 'var(--accent-primary)'
        }}
      >
        {isDark ? (
          <MoonIcon className="w-4 h-4" />
        ) : (
          <SunIcon className="w-4 h-4" />
        )}
      </div>
      
      {/* Background icons */}
      <SunIcon 
        className={`absolute left-1 w-4 h-4 transition-opacity duration-300 ${
          isDark ? 'opacity-30' : 'opacity-70'
        }`}
        style={{ color: 'var(--text-secondary)' }}
      />
      <MoonIcon 
        className={`absolute right-1 w-4 h-4 transition-opacity duration-300 ${
          isDark ? 'opacity-70' : 'opacity-30'
        }`}
        style={{ color: 'var(--text-secondary)' }}
      />
    </button>
  );
}
