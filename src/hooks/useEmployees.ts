import { useState, useEffect } from 'react';
import { Employee, EmployeeStats, EmployeeFormData } from '@/types/employee';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useEmployees = () => {
  const { company } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    if (!company) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match Employee interface
      const transformedEmployees: Employee[] = (data || []).map(emp => ({
        id: emp.id,
        nome: emp.nome,
        email: emp.email,
        telefone: emp.telefone,
        cargo: emp.cargo,
        departamento: emp.departamento_outro || emp.departamento,
        salario: parseFloat(emp.salario.toString()),
        dataAdmissao: emp.data_admissao,
        dataNascimento: emp.data_nascimento,
        cpf: emp.cpf,
        estadoCivil: emp.estado_civil as 'solteiro' | 'casado' | 'divorciado' | 'viuvo',
        genero: emp.genero as 'masculino' | 'feminino' | 'outro',
        endereco: emp.endereco as any,
        status: emp.status as 'ativo' | 'inativo' | 'ferias',
        fotoPerfil: emp.foto_url,
        observacoes: emp.observacoes,
        createdAt: emp.created_at,
        updatedAt: emp.updated_at
      }));
      
      setEmployees(transformedEmployees);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (company) {
      loadEmployees();
    }
  }, [company]);

  const addEmployee = async (formData: EmployeeFormData): Promise<boolean> => {
    if (!company) return false;

    try {
      const employeeData = {
        company_id: company.id,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cargo: formData.cargo,
        departamento: formData.departamento === 'Outro' ? 'Outro' : formData.departamento,
        departamento_outro: formData.departamento === 'Outro' ? formData.departamentoOutro : null,
        salario: parseFloat(formData.salario),
        data_admissao: formData.dataAdmissao,
        data_nascimento: formData.dataNascimento,
        cpf: formData.cpf,
        estado_civil: formData.estadoCivil,
        genero: formData.genero,
        endereco: {
          cep: formData.cep,
          rua: formData.rua,
          numero: formData.numero,
          bairro: formData.bairro,
          cidade: formData.cidade,
          estado: formData.estado
        },
        observacoes: formData.observacoes,
        foto_url: formData.fotoUrl
      };

      const { error } = await supabase
        .from('employees')
        .insert(employeeData);

      if (error) throw error;

      await loadEmployees();
      return true;
    } catch (error) {
      console.error('Error adding employee:', error);
      return false;
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('employees')
        .update({
          nome: updates.nome,
          email: updates.email,
          telefone: updates.telefone,
          cargo: updates.cargo,
          departamento: updates.departamento,
          salario: updates.salario,
          status: updates.status,
          observacoes: updates.observacoes
        })
        .eq('id', id);

      if (error) throw error;

      await loadEmployees();
      return true;
    } catch (error) {
      console.error('Error updating employee:', error);
      return false;
    }
  };

  const deleteEmployee = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadEmployees();
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      return false;
    }
  };

  const getStats = (): EmployeeStats => {
    const total = employees.length;
    const ativos = employees.filter(emp => emp.status === 'ativo').length;
    const inativos = employees.filter(emp => emp.status === 'inativo').length;
    const ferias = employees.filter(emp => emp.status === 'ferias').length;
    
    // Calculate employees added this month
    const thisMonth = new Date();
    const firstDayOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
    const novosMes = employees.filter(emp => 
      new Date(emp.dataAdmissao) >= firstDayOfMonth
    ).length;

    return {
      total,
      ativos,
      inativos,
      ferias,
      novosMes
    };
  };

  return {
    employees,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getStats,
    refreshData: loadEmployees
  };
};