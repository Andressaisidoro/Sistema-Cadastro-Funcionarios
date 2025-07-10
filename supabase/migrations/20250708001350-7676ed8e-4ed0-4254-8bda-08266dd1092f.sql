-- Permitir inserção de novas empresas durante o cadastro
CREATE POLICY "Allow company creation during signup" 
ON public.companies 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Permitir inserção de perfis durante o cadastro
CREATE POLICY "Allow profile creation during signup" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());