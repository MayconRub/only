import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Creator } from '../types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Creator | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) return null;

          const newProfile = {
            id: userId,
            email: userData.user.email,
            name: userData.user.user_metadata?.full_name || 'Novo Criador',
            username: (userData.user.email?.split('@')[0] || 'user') + Math.floor(Math.random() * 1000),
            avatar: userData.user.user_metadata?.avatar_url || `https://picsum.photos/seed/${userId}/400`,
            bio: 'Bem-vindo ao meu perfil!',
            role: 'user',
            stats: { posts: '0', followers: '0', likes: '0' }
          };

          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();

          if (createError) throw createError;
          
          // Redirect new users to edit-profile
          localStorage.setItem('novinha_screen', 'edit-profile');
          if (typeof (window as any).setScreen === 'function') {
            (window as any).setScreen('edit-profile');
          }
          
          return createdProfile as Creator;
        }
        throw profileError;
      }
      return data as Creator;
    } catch (err: any) {
      console.error('Error fetching/creating profile:', err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await fetchProfile(user.id);
      setProfile(p);
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;

    const handleAuthStateChange = async (session: Session | null) => {
      if (!isMounted) return;
      
      console.log('Auth state change handled:', session?.user?.email || 'No user');
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const p = await fetchProfile(session.user.id);
        if (isMounted) setProfile(p);
      } else {
        if (isMounted) setProfile(null);
      }
      
      if (isMounted) {
        setLoading(false);
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    // Set a safety timeout
    timeoutId = setTimeout(() => {
      if (isMounted) {
        setLoading((currentLoading) => {
          if (currentLoading) {
            console.warn('Auth initialization safety timeout reached');
            setError('Tempo de carregamento excedido. Verifique sua conexão.');
            return false;
          }
          return false;
        });
      }
    }, 15000);

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthStateChange(session);
    }).catch(err => {
      console.error('Initial session fetch error:', err);
      if (isMounted) {
        setLoading(false);
        setError('Erro ao conectar ao servidor de autenticação.');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth event:', _event);
      if (_event === 'SIGNED_IN' || _event === 'SIGNED_OUT' || _event === 'USER_UPDATED' || _event === 'TOKEN_REFRESHED') {
        handleAuthStateChange(session);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, error, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
