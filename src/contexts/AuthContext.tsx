import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Company {
  id: string;
  name: string;
  email: string;
  logo_url?: string;
  subtitle?: string;
  theme: 'light' | 'dark';
}

interface Profile {
  id: string;
  user_id: string;
  company_id: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  company: Company | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (companyName: string, email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateCompany: (updates: Partial<Company>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (userId: string) => {
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileData) {
        setProfile(profileData as Profile);
        
        // Load company
        const { data: companyData } = await supabase
          .from('companies')
          .select('*')
          .eq('id', profileData.company_id)
          .single();

        if (companyData) {
          setCompany(companyData as Company);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            loadUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setCompany(null);
        }
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          loadUserData(session.user.id);
        }, 0);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (companyName: string, email: string, password: string) => {
    try {
      // First sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) return { error: authError };

      if (!authData.user) {
        return { error: { message: 'Falha na criação do usuário' } };
      }

      // Use the database function to create company and profile atomically
      const { data: companyId, error: functionError } = await supabase
        .rpc('signup_company_and_user', {
          company_name: companyName,
          company_email: email,
          user_id: authData.user.id
        });

      if (functionError) {
        console.error('Company/profile creation failed:', functionError);
        return { error: functionError };
      }

      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setCompany(null);
  };

  const updateCompany = async (updates: Partial<Company>) => {
    if (!company) return { error: 'No company found' };

    const { error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', company.id);

    if (!error) {
      setCompany({ ...company, ...updates });
    }

    return { error };
  };

  const value: AuthContextType = {
    user,
    session,
    company,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateCompany,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};