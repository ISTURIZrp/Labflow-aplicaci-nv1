'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useAuth } from '@/app/context/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isFirebaseConfigured } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      setError('Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="flex-1 rounded-xl theme-glass px-6 pb-6 pt-8">
        <h1 className={`${lusitana.className} mb-6 text-2xl theme-text-primary font-semibold`}>
          Inicia sesión para continuar.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-sm font-medium theme-text-secondary"
              htmlFor="email"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-lg theme-glass theme-border py-3 pl-12 text-sm theme-text-primary placeholder:theme-text-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200"
                style={{
                  focusRingColor: 'var(--accent-primary)',
                  backgroundColor: 'var(--glass-bg)'
                }}
                id="email"
                type="email"
                name="email"
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 theme-text-secondary peer-focus:theme-accent-primary transition-colors" />
            </div>
          </div>
          <div className="mt-6">
            <label
              className="mb-3 block text-sm font-medium theme-text-secondary"
              htmlFor="password"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-lg theme-glass theme-border py-3 pl-12 text-sm theme-text-primary placeholder:theme-text-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200"
                style={{
                  focusRingColor: 'var(--accent-primary)',
                  backgroundColor: 'var(--glass-bg)'
                }}
                id="password"
                type="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 theme-text-secondary peer-focus:theme-accent-primary transition-colors" />
            </div>
          </div>
        </div>
        <Button className="mt-8 w-full justify-center" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          {!loading && <ArrowRightIcon className="ml-2 h-5 w-5" />}
        </Button>
        <div className="flex min-h-[2rem] items-center space-x-2 mt-4">
          {!isFirebaseConfigured && (
            <>
              <ExclamationCircleIcon className="h-5 w-5" style={{ color: 'var(--accent-secondary)' }} />
              <p className="text-sm" style={{ color: 'var(--accent-secondary)' }}>
                Firebase no configurado - ver FIREBASE_SETUP.md
              </p>
            </>
          )}
          {error && (
            <>
              <ExclamationCircleIcon className="h-5 w-5" style={{ color: 'var(--action-error)' }} />
              <p className="text-sm" style={{ color: 'var(--action-error)' }}>
                {error}
              </p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
