import { useState } from 'react';
import { useEmployees } from '@/hooks/useEmployees';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Calendar,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Plane
} from 'lucide-react';
import { Employee } from '@/types/employee';

const EmployeeList = () => {
  const { employees, updateEmployee, deleteEmployee, loading } = useEmployees();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [departmentFilter, setDepartmentFilter] = useState<string>('todos');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Filtros
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.departamento.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || employee.status === statusFilter;
    const matchesDepartment = departmentFilter === 'todos' || employee.departamento === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const departments = [...new Set(employees.map(emp => emp.departamento))];

  const handleStatusChange = async (employeeId: string, newStatus: Employee['status']) => {
    const success = updateEmployee(employeeId, { status: newStatus });
    
    if (success) {
      toast({
        title: "Status atualizado",
        description: "Status do funcionário foi alterado com sucesso.",
      });
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (employeeId: string, employeeName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir ${employeeName}?`)) {
      const success = deleteEmployee(employeeId);
      
      if (success) {
        toast({
          title: "Funcionário excluído",
          description: `${employeeName} foi removido do sistema.`,
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível excluir o funcionário.",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusBadge = (status: Employee['status']) => {
    const statusConfig = {
      ativo: { 
        variant: 'default' as const, 
        icon: UserCheck, 
        color: 'bg-success text-success-foreground' 
      },
      inativo: { 
        variant: 'secondary' as const, 
        icon: UserX, 
        color: 'bg-destructive text-destructive-foreground' 
      },
      ferias: { 
        variant: 'outline' as const, 
        icon: Plane, 
        color: 'bg-warning text-warning-foreground' 
      }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center space-x-1`}>
        <Icon className="w-3 h-3" />
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  const EmployeeDetails = ({ employee }: { employee: Employee }) => (
    <Card className="card-professional">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {employee.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold">{employee.nome}</h3>
              <p className="text-muted-foreground">{employee.cargo} · {employee.departamento}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(false)}
          >
            Fechar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center space-x-2">
              <Mail className="w-4 h-4 text-primary" />
              <span>Contato</span>
            </h4>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> {employee.email}</p>
              <p><strong>Telefone:</strong> {employee.telefone}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-primary" />
              <span>Profissional</span>
            </h4>
            <div className="space-y-2 text-sm">
              <p><strong>Salário:</strong> R$ {employee.salario.toLocaleString('pt-BR')}</p>
              <p><strong>Admissão:</strong> {new Date(employee.dataAdmissao).toLocaleDateString('pt-BR')}</p>
              <p><strong>Status:</strong> {getStatusBadge(employee.status)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Pessoal</span>
            </h4>
            <div className="space-y-2 text-sm">
              <p><strong>Data de Nascimento:</strong> {new Date(employee.dataNascimento).toLocaleDateString('pt-BR')}</p>
              <p><strong>CPF:</strong> {employee.cpf}</p>
              <p><strong>Estado Civil:</strong> <span className="capitalize">{employee.estadoCivil}</span></p>
              <p><strong>Gênero:</strong> <span className="capitalize">{employee.genero}</span></p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Endereço</span>
            </h4>
            <div className="space-y-2 text-sm">
              {employee.endereco.rua && (
                <p>
                  {employee.endereco.rua}, {employee.endereco.numero}<br />
                  {employee.endereco.bairro}<br />
                  {employee.endereco.cidade} - {employee.endereco.estado}<br />
                  CEP: {employee.endereco.cep}
                </p>
              )}
            </div>
          </div>
        </div>

        {employee.observacoes && (
          <div className="space-y-4">
            <h4 className="font-semibold">Observações</h4>
            <div className="p-4 bg-accent/30 rounded-lg">
              <p className="text-sm">{employee.observacoes}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (showDetails && selectedEmployee) {
    return (
      <div className="animate-fade-in">
        <EmployeeDetails employee={selectedEmployee} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Funcionários</h1>
          <p className="text-muted-foreground">
            {filteredEmployees.length} funcionário{filteredEmployees.length !== 1 ? 's' : ''} encontrado{filteredEmployees.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card className="card-professional">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, email, cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
                <SelectItem value="ferias">Em Férias</SelectItem>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos Departamentos</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Funcionários */}
      {filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee, index) => (
            <Card key={employee.id} className="card-professional hover:shadow-professional-hover transition-all duration-300" style={{ animationDelay: `${index * 50}ms` }}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header do Card */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {employee.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{employee.nome}</h3>
                        <p className="text-sm text-muted-foreground">{employee.cargo}</p>
                      </div>
                    </div>
                    {getStatusBadge(employee.status)}
                  </div>

                  {/* Informações */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      <span>{employee.departamento}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{employee.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{employee.telefone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Desde {new Date(employee.dataAdmissao).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setShowDetails(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Select
                        value={employee.status}
                        onValueChange={(value) => handleStatusChange(employee.id, value as Employee['status'])}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                          <SelectItem value="ferias">Férias</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(employee.id, employee.nome)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="card-professional">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum funcionário encontrado
            </h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou realizar uma nova busca.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeList;