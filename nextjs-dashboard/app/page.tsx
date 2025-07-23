import GestionProLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css';
import Image from 'next/image';
import ThemeToggle from '@/app/ui/theme-toggle';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6 theme-bg-body relative">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 theme-gradient-accent opacity-10 pointer-events-none"></div>

      <div className={styles.shape}>{/* <GestionProLogo /> */}</div>
      <div className="mt-4 flex grow flex-col gap-6 md:flex-row relative z-10">
        <div className="flex flex-col justify-center gap-8 rounded-xl theme-glass px-8 py-12 md:w-2/5 md:px-20">
          <p className="text-xl theme-text-primary md:text-3xl md:leading-normal">
            <strong>Bienvenido a GESTION PRO.</strong> La plataforma integral de gestión para tu empresa.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-xl px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 md:text-base transform active:scale-95"
            style={{
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              boxShadow: 'var(--glass-shadow)'
            }}
          >
            <span>Iniciar Sesión</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <div className="theme-glass rounded-xl p-4">
            <Image
              src="/hero-desktop.png"
              width={1000}
              height={760}
              className="rounded-lg"
              alt="Screenshots of the dashboard project showing desktop version"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
