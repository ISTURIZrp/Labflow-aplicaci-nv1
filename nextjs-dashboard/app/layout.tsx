import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { AuthProvider } from '@/app/context/AuthContext';
import { ThemeProvider } from '@/app/context/ThemeContext';
import { SidebarProvider } from '@/app/context/SidebarContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased theme-bg-body theme-text-primary`}>
        <ThemeProvider>
          <SidebarProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
