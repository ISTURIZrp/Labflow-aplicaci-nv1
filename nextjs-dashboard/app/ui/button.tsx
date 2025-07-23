import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex h-12 items-center rounded-lg px-6 text-sm font-semibold text-white transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 transform hover:scale-105 active:scale-95',
        className,
      )}
      style={{
        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
        boxShadow: 'var(--glass-shadow)'
      }}
    >
      {children}
    </button>
  );
}
