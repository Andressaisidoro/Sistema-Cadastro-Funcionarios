import { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Building, Upload, Moon, Sun, User, Lock } from 'lucide-react';

const ConfiguracoesPage = () => {
  const { company, updateCompany, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [companyData, setCompanyData] = useState({
    name: company?.name || '',
    subtitle: company?.subtitle || ''
  });

  const handleLogoUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${company?.id}-logo.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  };

  const handleSaveCompany = async () => {
    setLoading(true);
    try {
      let logoUrl = company?.logo_url;
      
      if (logoFile) {
        logoUrl = await handleLogoUpload(logoFile);
      }

      const { error } = await updateCompany({
        name: companyData.name,
        subtitle: companyData.subtitle,
        logo_url: logoUrl
      });

      if (error) throw error;

      toast({
        title: "Configurações salvas!",
        description: "As informações da empresa foram atualizadas.",
      });

      setLogoFile(null);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado do sistema.",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema e da empresa
          </p>
        </div>

        <Tabs defaultValue="empresa" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="empresa">
              <Building className="w-4 h-4 mr-2" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="sistema">
              <Settings className="w-4 h-4 mr-2" />
              Sistema
            </TabsTrigger>
            <TabsTrigger value="conta">
              <User className="w-4 h-4 mr-2" />
              Conta
            </TabsTrigger>
          </TabsList>

          <TabsContent value="empresa">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-primary" />
                  <span>Informações da Empresa</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="form-field">
                  <Label htmlFor="companyName" className="form-label">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    value={companyData.name}
                    onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                    placeholder="Nome da empresa"
                  />
                </div>

                <div className="form-field">
                  <Label htmlFor="subtitle" className="form-label">Subtítulo do Sistema</Label>
                  <Input
                    id="subtitle"
                    value={companyData.subtitle}
                    onChange={(e) => setCompanyData({...companyData, subtitle: e.target.value})}
                    placeholder="Gestão Profissional de Recursos Humanos"
                  />
                </div>

                <div className="form-field">
                  <Label htmlFor="logo" className="form-label">Logo da Empresa</Label>
                  <div className="flex items-center space-x-4">
                    {company?.logo_url && (
                      <img 
                        src={company.logo_url} 
                        alt="Logo atual" 
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    )}
                    <div className="flex-1">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                        className="cursor-pointer"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Formatos aceitos: JPG, PNG, GIF (máx. 2MB)
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleSaveCompany} 
                  disabled={loading}
                  className="btn-corporate w-full"
                >
                  {loading ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sistema">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <span>Configurações do Sistema</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="form-label">Tema do Sistema</Label>
                    <p className="text-sm text-muted-foreground">
                      Escolha entre tema claro ou escuro
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="w-4 h-4" />
                    <Switch
                      checked={theme === 'dark'}
                      onCheckedChange={(checked) => 
                        setTheme(checked ? 'dark' : 'light')
                      }
                    />
                    <Moon className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={handleSaveCompany} 
                    disabled={loading}
                    className="btn-corporate flex-1"
                  >
                    {loading ? 'Salvando...' : 'Salvar Informações'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conta">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <span>Configurações da Conta</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="form-field">
                  <Label className="form-label">Email da Empresa</Label>
                  <Input
                    value={company?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">
                    Para alterar o email, entre em contato com o suporte
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Sair do Sistema
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ConfiguracoesPage;