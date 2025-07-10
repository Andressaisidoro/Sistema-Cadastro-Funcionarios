import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEmployees } from '@/hooks/useEmployees';
import { EmployeeFormData } from '@/types/employee';
import { useToast } from '@/hooks/use-toast';
import { Save, User, Briefcase, MapPin, Phone, Mail, Calendar } from 'lucide-react';

const EmployeeForm = () => {
  const { addEmployee } = useEmployees();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<EmployeeFormData>({
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    departamento: '',
    salario: '',
    dataAdmissao: '',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    dataNascimento: '',
    cpf: '',
    estadoCivil: '',
    genero: '',
    observacoes: ''
  });

  const [errors, setErrors] = useState<Partial<EmployeeFormData>>({});

  const handleInputChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EmployeeFormData> = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    if (!formData.cargo.trim()) newErrors.cargo = 'Cargo é obrigatório';
    if (!formData.departamento.trim()) newErrors.departamento = 'Departamento é obrigatório';
    if (!formData.salario.trim()) newErrors.salario = 'Salário é obrigatório';
    if (!formData.dataAdmissao) newErrors.dataAdmissao = 'Data de admissão é obrigatória';
    if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
    if (!formData.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    if (!formData.estadoCivil) newErrors.estadoCivil = 'Estado civil é obrigatório';
    if (!formData.genero) newErrors.genero = 'Gênero é obrigatório';

    // Validação de email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validação de salário
    if (formData.salario && (isNaN(Number(formData.salario)) || Number(formData.salario) <= 0)) {
      newErrors.salario = 'Salário deve ser um número positivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erro na validação",
        description: "Por favor, corrija os campos marcados em vermelho.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const success = addEmployee(formData);
      
      if (success) {
        toast({
          title: "Funcionário cadastrado!",
          description: `${formData.nome} foi adicionado ao sistema com sucesso.`,
        });
        
        // Limpar formulário
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          cargo: '',
          departamento: '',
          salario: '',
          dataAdmissao: '',
          cep: '',
          rua: '',
          numero: '',
          bairro: '',
          cidade: '',
          estado: '',
          dataNascimento: '',
          cpf: '',
          estadoCivil: '',
          genero: '',
          observacoes: ''
        });
      } else {
        throw new Error('Falha ao cadastrar funcionário');
      }
    } catch (error) {
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao cadastrar o funcionário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const departamentos = [
    'Tecnologia',
    'Recursos Humanos',
    'Financeiro',
    'Marketing',
    'Vendas',
    'Operações',
    'Gestão',
    'Atendimento',
    'Jurídico',
    'Outro'
  ];

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Cadastrar Funcionário
        </h1>
        <p className="text-muted-foreground">
          Preencha as informações do novo funcionário
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Pessoais */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <span>Informações Pessoais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-field">
              <Label htmlFor="nome" className="form-label">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className={errors.nome ? 'border-destructive' : ''}
                placeholder="Digite o nome completo"
              />
              {errors.nome && <p className="text-sm text-destructive">{errors.nome}</p>}
            </div>

            <div className="form-field">
              <Label htmlFor="cpf" className="form-label">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                className={errors.cpf ? 'border-destructive' : ''}
                placeholder="000.000.000-00"
              />
              {errors.cpf && <p className="text-sm text-destructive">{errors.cpf}</p>}
            </div>

            <div className="form-field">
              <Label htmlFor="dataNascimento" className="form-label">Data de Nascimento *</Label>
              <Input
                id="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                className={errors.dataNascimento ? 'border-destructive' : ''}
              />
              {errors.dataNascimento && <p className="text-sm text-destructive">{errors.dataNascimento}</p>}
            </div>

            <div className="form-field">
              <Label htmlFor="genero" className="form-label">Gênero *</Label>
              <Select value={formData.genero} onValueChange={(value) => handleInputChange('genero', value)}>
                <SelectTrigger className={errors.genero ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              {errors.genero && <p className="text-sm text-destructive">{errors.genero}</p>}
            </div>

            <div className="form-field">
              <Label htmlFor="estadoCivil" className="form-label">Estado Civil *</Label>
              <Select value={formData.estadoCivil} onValueChange={(value) => handleInputChange('estadoCivil', value)}>
                <SelectTrigger className={errors.estadoCivil ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecione o estado civil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                  <SelectItem value="casado">Casado(a)</SelectItem>
                  <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                  <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                </SelectContent>
              </Select>
              {errors.estadoCivil && <p className="text-sm text-destructive">{errors.estadoCivil}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-primary" />
              <span>Informações de Contato</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-field">
              <Label htmlFor="email" className="form-label">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
                placeholder="email@empresa.com"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="form-field">
              <Label htmlFor="telefone" className="form-label">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                className={errors.telefone ? 'border-destructive' : ''}
                placeholder="(11) 99999-9999"
              />
              {errors.telefone && <p className="text-sm text-destructive">{errors.telefone}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Informações Profissionais */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <span>Informações Profissionais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-field">
              <Label htmlFor="cargo" className="form-label">Cargo *</Label>
              <Input
                id="cargo"
                value={formData.cargo}
                onChange={(e) => handleInputChange('cargo', e.target.value)}
                className={errors.cargo ? 'border-destructive' : ''}
                placeholder="Ex: Desenvolvedor Frontend"
              />
              {errors.cargo && <p className="text-sm text-destructive">{errors.cargo}</p>}
            </div>

            <div className="form-field">
              <Label htmlFor="departamento" className="form-label">Departamento *</Label>
              <Select value={formData.departamento} onValueChange={(value) => handleInputChange('departamento', value)}>
                <SelectTrigger className={errors.departamento ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departamentos.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.departamento && <p className="text-sm text-destructive">{errors.departamento}</p>}
            </div>

            <div className="form-field">
              <Label htmlFor="salario" className="form-label">Salário (R$) *</Label>
              <Input
                id="salario"
                type="number"
                min="0"
                step="0.01"
                value={formData.salario}
                onChange={(e) => handleInputChange('salario', e.target.value)}
                className={errors.salario ? 'border-destructive' : ''}
                placeholder="0,00"
              />
              {errors.salario && <p className="text-sm text-destructive">{errors.salario}</p>}
            </div>

            <div className="form-field">
              <Label htmlFor="dataAdmissao" className="form-label">Data de Admissão *</Label>
              <Input
                id="dataAdmissao"
                type="date"
                value={formData.dataAdmissao}
                onChange={(e) => handleInputChange('dataAdmissao', e.target.value)}
                className={errors.dataAdmissao ? 'border-destructive' : ''}
              />
              {errors.dataAdmissao && <p className="text-sm text-destructive">{errors.dataAdmissao}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Endereço</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="form-field">
              <Label htmlFor="cep" className="form-label">CEP</Label>
              <Input
                id="cep"
                value={formData.cep}
                onChange={(e) => handleInputChange('cep', e.target.value)}
                placeholder="00000-000"
              />
            </div>

            <div className="form-field md:col-span-2">
              <Label htmlFor="rua" className="form-label">Rua</Label>
              <Input
                id="rua"
                value={formData.rua}
                onChange={(e) => handleInputChange('rua', e.target.value)}
                placeholder="Nome da rua"
              />
            </div>

            <div className="form-field">
              <Label htmlFor="numero" className="form-label">Número</Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) => handleInputChange('numero', e.target.value)}
                placeholder="123"
              />
            </div>

            <div className="form-field">
              <Label htmlFor="bairro" className="form-label">Bairro</Label>
              <Input
                id="bairro"
                value={formData.bairro}
                onChange={(e) => handleInputChange('bairro', e.target.value)}
                placeholder="Nome do bairro"
              />
            </div>

            <div className="form-field">
              <Label htmlFor="cidade" className="form-label">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
                placeholder="Nome da cidade"
              />
            </div>

            <div className="form-field">
              <Label htmlFor="estado" className="form-label">Estado</Label>
              <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map(estado => (
                    <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle>Observações Adicionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="form-field">
              <Label htmlFor="observacoes" className="form-label">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                placeholder="Informações adicionais sobre o funcionário..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            disabled={loading}
            className="btn-corporate px-8 py-3 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Salvando...' : 'Cadastrar Funcionário'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;