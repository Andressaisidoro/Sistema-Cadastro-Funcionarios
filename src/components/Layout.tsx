import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Users, UserPlus, LayoutDashboard, Building, Settings } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { company } = useAuth();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Cadastrar',
      href: '/cadastrar',
      icon: UserPlus,
    },
    {
      name: 'Funcionários',
      href: '/funcionarios',
      icon: Users,
    },
    {
      name: 'Configurações',
      href: '/configuracoes',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                {company?.logo_url ? (
                  <img 
                    src={company.logo_url} 
                    alt="Logo" 
                    className="w-8 h-8 object-cover rounded"
                  />
                ) : (
                  <Building className="w-6 h-6 text-primary-foreground" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {company?.name || 'Sistema de Funcionários'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {company?.subtitle || 'Gestão Profissional de Recursos Humanos'}
                </p>
              </div>
            </div>

            <nav className="flex space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 {company?.name || 'Sistema de Funcionários'}. Gestão profissional de recursos humanos.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;