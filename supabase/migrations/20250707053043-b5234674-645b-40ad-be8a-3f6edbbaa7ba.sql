-- Create companies table for multi-tenant system
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  subtitle TEXT,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table linked to auth.users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  cargo TEXT NOT NULL,
  departamento TEXT NOT NULL,
  departamento_outro TEXT, -- For when "Outro" is selected
  salario DECIMAL(10,2) NOT NULL,
  data_admissao DATE NOT NULL,
  data_nascimento DATE NOT NULL,
  cpf TEXT NOT NULL,
  estado_civil TEXT NOT NULL CHECK (estado_civil IN ('solteiro', 'casado', 'divorciado', 'viuvo')),
  genero TEXT NOT NULL CHECK (genero IN ('masculino', 'feminino', 'outro')),
  foto_url TEXT,
  endereco JSONB NOT NULL DEFAULT '{}',
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'ferias')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create policies for companies
CREATE POLICY "Users can view their own company" 
ON public.companies 
FOR SELECT 
USING (
  id IN (
    SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own company" 
ON public.companies 
FOR UPDATE 
USING (
  id IN (
    SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create policies for employees
CREATE POLICY "Users can view employees from their company" 
ON public.employees 
FOR SELECT 
USING (
  company_id IN (
    SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert employees to their company" 
ON public.employees 
FOR INSERT 
WITH CHECK (
  company_id IN (
    SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update employees from their company" 
ON public.employees 
FOR UPDATE 
USING (
  company_id IN (
    SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete employees from their company" 
ON public.employees 
FOR DELETE 
USING (
  company_id IN (
    SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('employee-photos', 'employee-photos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('company-logos', 'company-logos', true);

-- Storage policies for employee photos
CREATE POLICY "Anyone can view employee photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'employee-photos');

CREATE POLICY "Authenticated users can upload employee photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'employee-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update employee photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'employee-photos' AND auth.role() = 'authenticated');

-- Storage policies for company logos
CREATE POLICY "Anyone can view company logos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'company-logos');

CREATE POLICY "Authenticated users can upload company logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'company-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update company logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'company-logos' AND auth.role() = 'authenticated');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();