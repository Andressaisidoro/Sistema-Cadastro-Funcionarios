import { useState } from 'react';
import { useEmployees } from '@/hooks/useEmployees';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, UserX, Plane, UserPlus, TrendingUp, BarChart3, PieChart, Filter, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { employees, getStats, loading } = useEmployees();
  const [filterPeriod, setFilterPeriod] = useState<'day' | 'month' | 'year'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Função para filtrar funcionários por período
  const getFilteredEmployees = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    return employees.filter(emp => {
      const empDate = new Date(emp.dataAdmissao);
      
      switch (filterPeriod) {
        case 'day':
          return empDate.getFullYear() === currentYear && 
                 empDate.getMonth() === currentMonth && 
                 empDate.getDate() === currentDay;
        case 'month':
          return empDate.getFullYear() === currentYear && 
                 empDate.getMonth() === currentMonth;
        case 'year':
          return empDate.getFullYear() === currentYear;
        default:
          return true;
      }
    });
  };

  const filteredEmployees = getFilteredEmployees();
  const stats = getStats();

  const statCards = [
    {
      title: 'Total de Funcionários',
      value: stats.total,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Funcionários Ativos',
      value: stats.ativos,
      icon: UserCheck,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Em Férias',
      value: stats.ferias,
      icon: Plane,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Novos este Mês',
      value: stats.novosMes,
      icon: UserPlus,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    }
  ];

  // Filtrar funcionários recentes baseado no período selecionado
  const recentEmployees = filteredEmployees
    .sort((a, b) => new Date(b.dataAdmissao).getTime() - new Date(a.dataAdmissao).getTime())
    .slice(0, 5);

  // Estatísticas dos departamentos baseado nos funcionários filtrados
  const departmentStats = filteredEmployees.reduce((acc, emp) => {
    acc[emp.departamento] = (acc[emp.departamento] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Estatísticas de status baseado nos funcionários filtrados
  const filteredStats = {
    total: filteredEmployees.length,
    ativos: filteredEmployees.filter(emp => emp.status === 'ativo').length,
    ferias: filteredEmployees.filter(emp => emp.status === 'ferias').length,
    novosMes: filteredEmployees.length
  };

  // Prepare chart data based on filter period
  const getChartData = () => {
    const now = new Date();
    let periods: { name: string; admissoes: number }[] = [];

    if (filterPeriod === 'day') {
      // Últimos 7 dias
      periods = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayEmployees = employees.filter(emp => {
          const empDate = new Date(emp.dataAdmissao);
          return empDate.toDateString() === date.toDateString();
        });
        return {
          name: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          admissoes: dayEmployees.length,
        };
      });
    } else if (filterPeriod === 'month') {
      // Últimos 6 meses
      periods = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        const monthEmployees = employees.filter(emp => {
          const empDate = new Date(emp.dataAdmissao);
          return empDate.getMonth() === date.getMonth() && empDate.getFullYear() === date.getFullYear();
        });
        return {
          name: date.toLocaleDateString('pt-BR', { month: 'short' }),
          admissoes: monthEmployees.length,
        };
      });
    } else {
      // Últimos 5 anos
      periods = Array.from({ length: 5 }, (_, i) => {
        const year = now.getFullYear() - (4 - i);
        const yearEmployees = employees.filter(emp => {
          const empDate = new Date(emp.dataAdmissao);
          return empDate.getFullYear() === year;
        });
        return {
          name: year.toString(),
          admissoes: yearEmployees.length,
        };
      });
    }

    return periods;
  };

  const chartData = getChartData();

  const statusData = [
    { name: 'Ativos', value: filteredStats.ativos, color: 'hsl(var(--success))' },
    { name: 'Em Férias', value: filteredStats.ferias, color: 'hsl(var(--warning))' },
    { name: 'Inativos', value: filteredStats.total - filteredStats.ativos - filteredStats.ferias, color: 'hsl(var(--destructive))' },
  ].filter(item => item.value > 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Visão geral do sistema de funcionários
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filtrar por:</span>
          </div>
          <Select value={filterPeriod} onValueChange={(value: 'day' | 'month' | 'year') => setFilterPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Dia</span>
                </div>
              </SelectItem>
              <SelectItem value="month">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Mês</span>
                </div>
              </SelectItem>
              <SelectItem value="year">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Ano</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        <Card className="card-professional hover:shadow-professional-hover transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Filtrado
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {filteredStats.total}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional hover:shadow-professional-hover transition-all duration-300" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Funcionários Ativos
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {filteredStats.ativos}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-success/10">
                <UserCheck className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional hover:shadow-professional-hover transition-all duration-300" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Em Férias
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {filteredStats.ferias}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10">
                <Plane className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional hover:shadow-professional-hover transition-all duration-300" style={{ animationDelay: '300ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {filterPeriod === 'day' ? 'Novos Hoje' : 
                   filterPeriod === 'month' ? 'Novos este Mês' : 'Novos este Ano'}
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {filteredStats.novosMes}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Admissions Chart */}
        <Card className="card-professional animate-fade-in" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>
                {filterPeriod === 'day' ? 'Admissões - Últimos 7 Dias' : 
                 filterPeriod === 'month' ? 'Admissões - Últimos 6 Meses' : 'Admissões - Últimos 5 Anos'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {chartData.map((item, index) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium text-foreground">{item.admissoes}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${Math.max((item.admissoes / Math.max(...chartData.map(d => d.admissoes), 1)) * 100, 5)}%`,
                        animationDelay: `${index * 100}ms`
                      }}
                    />
                  </div>
                </div>
              ))}
              {chartData.every(item => item.admissoes === 0) && (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma admissão no período selecionado
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution Chart */}
        <Card className="card-professional animate-fade-in" style={{ animationDelay: '500ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-primary" />
              <span>Distribuição por Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {statusData.map((item, index) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{item.value}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        backgroundColor: item.color,
                        width: `${Math.max((item.value / Math.max(filteredStats.total, 1)) * 100, 5)}%`,
                        animationDelay: `${index * 150}ms`
                      }}
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">
                      {filteredStats.total > 0 ? Math.round((item.value / filteredStats.total) * 100) : 0}%
                    </span>
                  </div>
                </div>
              ))}
              {statusData.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum funcionário cadastrado ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Employees */}
        <Card className="card-professional animate-fade-in" style={{ animationDelay: '600ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Funcionários Recentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEmployees.length > 0 ? (
                recentEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center space-x-4 p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {employee.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {employee.nome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {employee.cargo} · {employee.departamento}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(employee.dataAdmissao).toLocaleDateString('pt-BR')}
                      </p>
                      <span className={`inline-block w-2 h-2 rounded-full mt-1 ${
                        employee.status === 'ativo' ? 'bg-success' :
                        employee.status === 'ferias' ? 'bg-warning' : 'bg-destructive'
                      }`}></span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum funcionário cadastrado ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Departments */}
        <Card className="card-professional animate-fade-in" style={{ animationDelay: '700ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Por Departamento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(departmentStats).length > 0 ? (
                Object.entries(departmentStats)
                  .sort(([,a], [,b]) => b - a)
                  .map(([department, count]) => (
                    <div key={department} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                      <span className="text-sm font-medium text-foreground">
                        {department}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${(count / Math.max(filteredStats.total, 1)) * 100}%` }}
                        ></div>
                        </div>
                        <span className="text-sm font-bold text-primary w-8 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum departamento encontrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;