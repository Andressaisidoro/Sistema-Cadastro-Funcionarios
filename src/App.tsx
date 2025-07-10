import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth, AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AuthPage from '@/pages/AuthPage';
import Index from "./pages/Index";
import CadastrarPage from "./pages/CadastrarPage";
import FuncionariosPage from "./pages/FuncionariosPage";
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/cadastrar" element={<CadastrarPage />} />
      <Route path="/funcionarios" element={<FuncionariosPage />} />
      <Route path="/configuracoes" element={<ConfiguracoesPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ProtectedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
