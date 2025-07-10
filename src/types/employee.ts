export interface Employee {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  departamento: string;
  salario: number;
  dataAdmissao: string;
  endereco: {
    cep: string;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  status: 'ativo' | 'inativo' | 'ferias';
  fotoPerfil?: string;
  dataNascimento: string;
  cpf: string;
  estadoCivil: 'solteiro' | 'casado' | 'divorciado' | 'viuvo';
  genero: 'masculino' | 'feminino' | 'outro';
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFormData {
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  departamento: string;
  departamentoOutro?: string;
  salario: string;
  dataAdmissao: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  dataNascimento: string;
  cpf: string;
  estadoCivil: string;
  genero: string;
  observacoes?: string;
  fotoUrl?: string;
}

export interface EmployeeStats {
  total: number;
  ativos: number;
  inativos: number;
  ferias: number;
  novosMes: number;
}