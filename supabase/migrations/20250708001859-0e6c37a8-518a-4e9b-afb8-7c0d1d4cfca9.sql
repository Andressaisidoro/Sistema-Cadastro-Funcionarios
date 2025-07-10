-- Remover as políticas existentes que podem estar causando conflito
DROP POLICY IF EXISTS "Allow anonymous company creation" ON public.companies;

-- Criar uma função segura para cadastro completo
CREATE OR REPLACE FUNCTION public.signup_company_and_user(
  company_name TEXT,
  company_email TEXT,
  user_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  company_id UUID;
BEGIN
  -- Inserir empresa
  INSERT INTO public.companies (name, email)
  VALUES (company_name, company_email)
  RETURNING id INTO company_id;
  
  -- Inserir perfil do usuário
  INSERT INTO public.profiles (user_id, company_id, role)
  VALUES (user_id, company_id, 'admin');
  
  RETURN company_id;
END;
$$;

-- Política simplificada para permitir que usuários autenticados vejam suas empresas
CREATE POLICY "Users can view their own company" 
ON public.companies 
FOR SELECT 
TO authenticated 
USING (id IN (
  SELECT company_id 
  FROM public.profiles 
  WHERE user_id = auth.uid()
));

-- Política para atualização de empresas
CREATE POLICY "Users can update their own company" 
ON public.companies 
FOR UPDATE 
TO authenticated 
USING (id IN (
  SELECT company_id 
  FROM public.profiles 
  WHERE user_id = auth.uid()
));