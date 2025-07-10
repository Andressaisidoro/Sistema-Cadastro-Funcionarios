import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Building, Mail, Lock, User } from 'lucide-react';

const AuthPage = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signUpData, setSignUpData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao sistema",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: "Erro na validação",
        description: "As senhas não conferem",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(signUpData.companyName, signUpData.email, signUpData.password);
      
      if (error) {
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Verifique seu email para confirmar a conta",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-professional">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Sistema de Funcionários
          </CardTitle>
          <p className="text-muted-foreground">
            Gestão Profissional de Recursos Humanos
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="form-field">
                  <Label htmlFor="email" className="form-label">Email da Empresa</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      className="pl-10"
                      placeholder="empresa@exemplo.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <Label htmlFor="password" className="form-label">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="pl-10"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-corporate"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="form-field">
                  <Label htmlFor="companyName" className="form-label">Nome da Empresa</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyName"
                      value={signUpData.companyName}
                      onChange={(e) => setSignUpData({...signUpData, companyName: e.target.value})}
                      className="pl-10"
                      placeholder="Minha Empresa Ltda"
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <Label htmlFor="signupEmail" className="form-label">Email da Empresa</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signupEmail"
                      type="email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                      className="pl-10"
                      placeholder="empresa@exemplo.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <Label htmlFor="signupPassword" className="form-label">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signupPassword"
                      type="password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                      className="pl-10"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <Label htmlFor="confirmPassword" className="form-label">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                      className="pl-10"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-corporate"
                >
                  {loading ? 'Cadastrando...' : 'Cadastrar Empresa'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;