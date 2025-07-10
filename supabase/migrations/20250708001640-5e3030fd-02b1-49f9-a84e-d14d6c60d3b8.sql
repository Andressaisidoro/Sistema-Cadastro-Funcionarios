-- Remover a política anterior que pode estar causando conflito
DROP POLICY IF EXISTS "Allow company creation during signup" ON public.companies;

-- Criar uma política mais específica para permitir inserção de empresas por usuários anônimos
CREATE POLICY "Allow anonymous company creation" 
ON public.companies 
FOR INSERT 
TO public
WITH CHECK (true);

-- Garantir que a política de perfil está correta
DROP POLICY IF EXISTS "Allow profile creation during signup" ON public.profiles;

CREATE POLICY "Allow authenticated profile creation" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());