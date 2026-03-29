import { supabase } from '../lib/supabase';

export const supabaseService = {
  // --- Auth ---
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    if (error) throw error;
    
    // Create profile manually if trigger is not set up
    if (data.user) {
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([
            { 
              id: data.user.id, 
              full_name: fullName,
              username: email.split('@')[0] + Math.floor(Math.random() * 1000),
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`,
              bio: 'Novo criador na plataforma'
            }
          ], { onConflict: 'id' });
        if (profileError) {
          console.error('Error creating profile:', profileError);
          // If it fails, we might want to know why, but we don't want to block the sign up
        }
      } catch (err) {
        console.error('Unexpected error creating profile:', err);
      }
    }
    
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // --- Profiles ---
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // Profile doesn't exist, create it
      const { data: newData, error: createError } = await supabase
        .from('profiles')
        .upsert([
          { 
            id: userId, 
            full_name: 'Novo Usuário',
            username: 'user_' + userId.substring(0, 5),
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
            bio: 'Novo criador na plataforma'
          }
        ], { onConflict: 'id' })
        .select()
        .single();
      
      if (createError) throw createError;
      return newData;
    }
    
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    if (error) throw error;
    return data;
  },

  // --- Posts & Stories ---
  async getFeed() {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:author_id (
          username,
          full_name,
          avatar_url,
          is_verified
        )
      `)
      .eq('type', 'post')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getStories() {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:author_id (
          username,
          avatar_url
        )
      `)
      .eq('type', 'story')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getPostsByUserId(userId: string) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('author_id', userId)
      .eq('type', 'post')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // --- Messages ---
  async getMessages(userId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (username, avatar_url),
        receiver:receiver_id (username, avatar_url)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // --- Notifications ---
  async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        actor:actor_id (username, avatar_url, is_verified)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};
