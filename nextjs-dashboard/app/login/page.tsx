import LoginForm from '@/app/ui/login-form';
import GestionProLogo from '@/app/ui/acme-logo';
import ThemeToggle from '@/app/ui/theme-toggle';

export default function LoginPage() {
  return (
    <main className="min-h-screen theme-bg-body flex items-center justify-center relative">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 theme-gradient-accent opacity-20"></div>

      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-6 p-6 md:-mt-16">
        {/* Logo Section with Glass Effect */}
        <div className="flex h-24 w-full items-end rounded-xl p-4 md:h-40 theme-glass">
          <div className="w-32 text-white md:w-40">
            <GestionProLogo />
          </div>
        </div>

        {/* Login Form */}
        <LoginForm />
      </div>
    </main>
  );
}
