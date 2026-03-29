/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Lock, 
  Play, 
  Home, 
  Compass, 
  PlusCircle, 
  Bell, 
  User, 
  ArrowLeft,
  MoreHorizontal,
  Share2,
  CheckCircle2,
  Mail,
  Eye,
  Star,
  ChevronRight,
  Camera,
  Link as LinkIcon,
  X,
  Image as ImageIcon,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen, Post, Notification, Message, Creator } from './types';
import { supabase } from './lib/supabase';
import { supabaseService } from './services/supabaseService';

// --- Mock Data ---

const ELENA: Creator = {
  id: 'elena',
  name: 'Elena Noir',
  username: 'elenanoir.art',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  bio: 'Artista digital e modelo',
  stats: {
    posts: '142',
    followers: '84.2k',
    likes: '1.2m'
  }
};

const GABRIEL: Creator = {
  id: 'gabriel',
  name: 'Gabriel Santos',
  username: 'gabrielsantos.art',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
};

const POSTS: Post[] = [
  {
    id: '1',
    creator: ELENA,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    likes: '1.248',
    caption: 'Novas ideias florescendo para a próxima coleção. O que acham dessa paleta? ✨ #fashion #creative',
    time: 'Há 2 horas'
  },
  {
    id: '2',
    creator: { ...ELENA, name: 'Kael', id: 'kael' },
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=800',
    likes: '850',
    caption: 'Atrás desta cortina digital está o meu trabalho mais pessoal...',
    time: 'Há 5 horas',
    isLocked: true,
    price: 'R$ 15,00'
  },
  {
    id: '3',
    creator: { ...ELENA, name: 'Mariana', id: 'mariana' },
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800',
    likes: '3.402',
    caption: 'Vlog de hoje em SP. Energia tá lá em cima! 🏙️⚡️',
    time: 'Há 8 horas',
    isVideo: true
  }
];

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'sale',
    user: { name: 'Marina Silva', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', isVerified: true },
    content: 'comprou seu conteúdo exclusivo "Masterclass de Design".',
    time: 'Agora mesmo',
    badge: 'VENDA PREMIUM',
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '2',
    type: 'subscription',
    user: { name: 'Ricardo Oliveira', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
    content: 'assinou seu perfil anual.',
    time: '2h atrás'
  },
  {
    id: '3',
    type: 'like',
    user: { name: 'André Santos', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
    content: 'e outras 12 pessoas curtiram seu post.',
    time: '5h atrás',
    thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=200'
  }
];

const MESSAGES: Message[] = [
  {
    id: '1',
    user: { ...ELENA, name: 'Valentina Lima', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
    lastMessage: 'Acabei de postar as fotos novas do ensaio!',
    time: '14:20',
    unreadCount: 2,
    isOnline: true
  },
  {
    id: '2',
    user: { ...ELENA, name: 'Marco Aurélio', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
    lastMessage: 'Mensagem trancada. Faça upgrade para Ouro.',
    time: 'Ontem',
    isLocked: true
  },
  {
    id: '3',
    user: { ...ELENA, name: 'Bia Nunes', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
    lastMessage: 'Obrigado pelo apoio no projeto!',
    time: 'Ontem'
  }
];

// --- Components ---

const TopNav = ({ title = "ONLY MOC", showBack = false, onBack = () => {}, supabaseStatus, profile, onRetry }: { title?: string, showBack?: boolean, onBack?: () => void, supabaseStatus: 'checking' | 'connected' | 'error', profile: any, onRetry?: () => void }) => (
  <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 glass-header z-50">
    <div className="flex items-center gap-4">
      {showBack ? (
        <button onClick={onBack} className="text-on-surface hover:opacity-80 transition-opacity">
          <ArrowLeft size={24} />
        </button>
      ) : (
        <button className="text-on-surface hover:opacity-80 transition-opacity">
          <Menu size={24} />
        </button>
      )}
      <div className="text-2xl font-extrabold premium-gradient bg-clip-text text-transparent tracking-tight">
        {title}
      </div>
    </div>
    <div className="flex items-center gap-4">
      <button 
        onClick={onRetry}
        disabled={supabaseStatus === 'checking'}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all active:scale-95 ${
        supabaseStatus === 'connected' ? 'bg-green-50 text-green-600 border-green-200' : 
        supabaseStatus === 'error' ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 
        'bg-gray-50 text-gray-400 border-gray-200'
      }`}>
        <div className={`w-1.5 h-1.5 rounded-full ${
          supabaseStatus === 'connected' ? 'bg-green-500' : 
          supabaseStatus === 'error' ? 'bg-red-500' : 
          'bg-gray-400 animate-pulse'
        }`}></div>
        {supabaseStatus === 'connected' ? 'DB Online' : supabaseStatus === 'error' ? 'DB Offline (Retry)' : 'Checking DB'}
      </button>
      <button className="text-on-surface hover:opacity-80 transition-opacity">
        <Search size={24} />
      </button>
      <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
        <img src={profile?.avatar_url || ELENA.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>
    </div>
  </header>
);

const BottomNav = ({ active, onChange }: { active: Screen, onChange: (s: Screen) => void }) => (
  <nav className="fixed bottom-0 w-full flex justify-around items-center px-4 py-3 bg-white border-t border-primary/5 z-50">
    <button onClick={() => onChange('feed')} className={`flex flex-col items-center gap-1 transition-all ${active === 'feed' ? 'text-primary' : 'text-on-surface/40'}`}>
      <Home size={24} />
      <span className="text-[10px] font-bold">Início</span>
    </button>
    <button onClick={() => onChange('messages')} className={`flex flex-col items-center gap-1 transition-all ${active === 'messages' ? 'text-primary' : 'text-on-surface/40'}`}>
      <Compass size={24} />
      <span className="text-[10px] font-bold">Explorar</span>
    </button>
    <button onClick={() => onChange('create-post')} className="p-2 bg-primary text-white rounded-full shadow-lg shadow-primary/20 transition-transform active:scale-90">
      <PlusCircle size={28} />
    </button>
    <button onClick={() => onChange('activity')} className={`flex flex-col items-center gap-1 transition-all ${active === 'activity' ? 'text-primary' : 'text-on-surface/40'}`}>
      <Bell size={24} />
      <span className="text-[10px] font-bold">Atividade</span>
    </button>
    <button onClick={() => onChange('profile')} className={`flex flex-col items-center gap-1 transition-all ${active === 'profile' ? 'text-primary' : 'text-on-surface/40'}`}>
      <User size={24} />
      <span className="text-[10px] font-bold">Perfil</span>
    </button>
  </nav>
);

// --- Screens ---

const ScreenFeed = ({ profile }: { profile: any }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feedData, storiesData] = await Promise.all([
          supabaseService.getFeed(),
          supabaseService.getStories()
        ]);
        setPosts(feedData || []);
        setStories(storiesData || []);
      } catch (err) {
        console.error('Erro ao carregar feed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="pt-20 pb-24 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24 max-w-2xl mx-auto">
      {/* Stories */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 py-6 bg-white border-b border-primary/5">
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="relative p-[3px] rounded-full story-ring">
            <div className="p-0.5 bg-white rounded-full">
              <img src={profile?.avatar_url || ELENA.avatar} className="w-16 h-16 rounded-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 border-2 border-white">
              <PlusCircle size={14} />
            </div>
          </div>
          <span className="text-[10px] font-bold text-on-surface">Você</span>
        </div>
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="p-[3px] rounded-full story-ring">
              <div className="p-0.5 bg-white rounded-full">
                <img src={story.profiles?.avatar_url || ELENA.avatar} className="w-16 h-16 rounded-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
            <span className="text-[10px] font-bold text-on-surface/60">{story.profiles?.username || 'user'}</span>
          </div>
        ))}
        {stories.length === 0 && ['Valentina', 'Kael', 'Mariana'].map((name) => (
          <div key={name} className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="p-[3px] rounded-full story-ring">
              <div className="p-0.5 bg-white rounded-full">
                <img src={`https://picsum.photos/seed/${name}/200`} className="w-16 h-16 rounded-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
            <span className="text-[10px] font-bold text-on-surface/60">{name}</span>
          </div>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4 py-4">
        {posts.length > 0 ? posts.map(post => (
          <article key={post.id} className="bg-white shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <img src={post.profiles?.avatar_url || ELENA.avatar} className="w-10 h-10 rounded-full object-cover border border-primary/10" referrerPolicy="no-referrer" />
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-sm">{post.profiles?.full_name || 'Criador'}</p>
                    {post.profiles?.is_verified && <CheckCircle2 size={12} className="text-primary fill-primary/10" />}
                  </div>
                  <p className="text-[10px] text-on-surface/40 font-bold uppercase tracking-wider">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <MoreHorizontal className="text-on-surface/40 cursor-pointer" />
            </div>
            
            <div className="aspect-square relative overflow-hidden">
              <img src={post.image_url} className={`w-full h-full object-cover ${post.is_locked ? 'blur-3xl opacity-60' : ''}`} referrerPolicy="no-referrer" />
              {post.is_locked && (
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] flex flex-col items-center text-center shadow-2xl border border-white/40">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                      <Lock className="text-primary" size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Conteúdo Exclusivo</h3>
                    <p className="text-sm text-on-surface/60 mb-8">Assine o nível premium para ter acesso total.</p>
                    <button className="w-full py-4 px-8 premium-gradient text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all text-sm uppercase tracking-widest">
                      DESBLOQUEAR POR {post.price || 'R$ 15,00'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-6">
                  <Heart className="text-on-surface cursor-pointer" />
                  <MessageCircle className="text-on-surface cursor-pointer" />
                  <Send className="text-on-surface cursor-pointer" />
                </div>
                <Bookmark className="text-on-surface cursor-pointer" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-on-surface/80 leading-relaxed">
                  <span className="font-bold">{post.profiles?.full_name}</span> {post.caption}
                </p>
              </div>
            </div>
          </article>
        )) : (
          <div className="text-center py-20 px-6">
            <p className="text-on-surface/40 font-bold">Nenhum post encontrado no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ScreenProfile = ({ onEdit, profile }: { onEdit: () => void, profile: any }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!profile?.id) return;
      try {
        const data = await supabaseService.getPostsByUserId(profile.id);
        setPosts(data || []);
      } catch (err) {
        console.error('Erro ao carregar posts do usuário:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPosts();
  }, [profile?.id]);

  if (!profile) {
    return (
      <div className="pt-20 pb-24 px-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-on-surface/60 mb-4">Perfil não carregado.</p>
        <button onClick={() => window.location.reload()} className="text-primary font-bold">Recarregar</button>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24">
      <section className="max-w-4xl mx-auto px-6 text-center pt-8">
        <div className="relative inline-block mb-6">
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full p-[4px] story-ring">
            <img src={profile?.avatar_url || ELENA.avatar} className="w-full h-full object-cover rounded-full border-4 border-white" referrerPolicy="no-referrer" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">{profile?.full_name || ELENA.name}</h1>
        <p className="text-base text-primary font-bold mb-8">{profile?.bio || ELENA.bio}</p>

        <div className="flex justify-center items-center gap-10 mb-10 py-6 px-8 bg-white rounded-3xl shadow-sm max-w-md mx-auto border border-primary/5">
          <div className="text-center">
            <span className="block text-xl font-bold">{posts.length}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40">Posts</span>
          </div>
          <div className="w-px h-8 bg-primary/10"></div>
          <div className="text-center">
            <span className="block text-xl font-bold">{ELENA.stats?.followers}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40">Seguidores</span>
          </div>
          <div className="w-px h-8 bg-primary/10"></div>
          <div className="text-center">
            <span className="block text-xl font-bold">{ELENA.stats?.likes}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40">Curtidas</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 max-w-md mx-auto">
          <button className="w-full py-4 premium-gradient text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs">
            Assinar R$ 14,99/mês
          </button>
          <button onClick={onEdit} className="w-full py-4 bg-primary/5 text-primary font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all uppercase tracking-widest text-xs">
            <Mail size={18} />
            Mensagem
          </button>
        </div>
      </section>

      <div className="sticky top-16 bg-white/80 backdrop-blur-md z-40 border-b border-primary/5 mb-6">
        <div className="max-w-4xl mx-auto px-6 flex justify-around">
          <button className="py-4 border-b-2 border-primary text-primary font-bold text-xs uppercase tracking-widest">Criações</button>
          <button className="py-4 border-b-2 border-transparent text-on-surface/40 font-bold text-xs uppercase tracking-widest">Exclusivos</button>
          <button className="py-4 border-b-2 border-transparent text-on-surface/40 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
            Pro <Lock size={12} fill="currentColor" />
          </button>
        </div>
      </div>

      <section className="max-w-5xl mx-auto px-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {posts.map(post => (
              <div key={post.id} className="aspect-square overflow-hidden rounded-2xl bg-white shadow-sm relative">
                <img src={post.image_url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                {post.is_locked && (
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-white">
                    <Lock size={18} fill="white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-on-surface/40 font-bold">Nenhuma criação ainda.</p>
          </div>
        )}
      </section>
    </div>
  );
};

const ScreenActivity = ({ user }: { user: any }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;
      try {
        const data = await supabaseService.getNotifications(user.id);
        setNotifications(data || []);
      } catch (err) {
        console.error('Erro ao carregar notificações:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="pt-20 pb-24 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24 px-6 max-w-2xl mx-auto">
      <section className="mb-8 pt-8">
        <h2 className="text-4xl font-extrabold tracking-tight mb-1">Atividade</h2>
        <p className="text-on-surface/60 text-sm font-medium">Sua jornada criativa em tempo real.</p>
      </section>

      <div className="space-y-10">
        {notifications.length > 0 ? (
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface/30 mb-4">Recentes</h3>
            <div className="space-y-3">
              {notifications.map(notif => (
                <div key={notif.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-primary/5">
                  <div className="relative">
                    <img src={notif.actor?.avatar_url || ELENA.avatar} className="w-12 h-12 rounded-full object-cover border border-primary/10" referrerPolicy="no-referrer" />
                    {notif.actor?.is_verified && (
                      <span className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5 border-2 border-white">
                        <CheckCircle2 size={10} fill="white" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium leading-relaxed text-on-surface">
                      <span className="font-bold">{notif.actor?.username || 'Alguém'}</span> {notif.content}
                    </p>
                    <span className="text-[10px] text-on-surface/40 mt-0.5 block font-bold uppercase tracking-tighter">
                      {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-on-surface/40 font-bold">Nenhuma atividade recente.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ScreenMessages = ({ user }: { user: any }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.id) return;
      try {
        const data = await supabaseService.getMessages(user.id);
        setMessages(data || []);
      } catch (err) {
        console.error('Erro ao carregar mensagens:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="pt-20 pb-24 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24 max-w-2xl mx-auto px-6">
      <section className="mb-8 pt-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-1">Mensagens</h1>
        <p className="text-on-surface/60 text-sm font-medium">Gerencie suas conexões e conversas exclusivas.</p>
      </section>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
        <button className="px-5 py-2 rounded-full premium-gradient text-white font-bold text-xs shadow-sm">Todas</button>
        <button className="px-5 py-2 rounded-full bg-white text-on-surface/60 font-bold text-xs border border-primary/5">Não Lidas</button>
      </div>

      <div className="space-y-3">
        {messages.length > 0 ? messages.map(msg => (
          <div key={msg.id} className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white transition-all hover:shadow-md cursor-pointer border border-primary/5">
            <div className="relative flex-shrink-0">
              <img 
                src={msg.sender_id === user.id ? msg.receiver?.avatar_url : msg.sender?.avatar_url || ELENA.avatar} 
                className="w-14 h-14 rounded-full object-cover border border-primary/10 p-0.5" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="font-bold text-base truncate text-on-surface">
                  {msg.sender_id === user.id ? msg.receiver?.username : msg.sender?.username}
                </h3>
                <span className="text-[10px] font-bold text-on-surface/40 uppercase tracking-tighter">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs truncate text-on-surface/60 font-medium">
                {msg.content}
              </p>
            </div>
          </div>
        )) : (
          <div className="text-center py-20">
            <p className="text-on-surface/40 font-bold">Nenhuma mensagem ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ScreenEditProfile = ({ onBack, profile, onUpdate }: { onBack: () => void, profile: any, onUpdate: (updates: any) => void }) => {
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!profile?.id) {
      alert('Erro: Perfil não carregado corretamente.');
      return;
    }
    setLoading(true);
    try {
      await supabaseService.updateProfile(profile.id, {
        full_name: fullName,
        username,
        bio
      });
      onUpdate({ full_name: fullName, username, bio });
      onBack();
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      alert('Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="pt-20 pb-24 px-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-on-surface/60 mb-4">Perfil não carregado.</p>
        <button onClick={onBack} className="text-primary font-bold">Voltar</button>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24 px-6 max-w-2xl mx-auto">
      <section className="mb-8 pt-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-1">Editar Perfil</h1>
        <p className="text-on-surface/60 text-sm font-medium">Curadoria do seu espaço digital</p>
      </section>

      <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <section className="relative">
          <div className="group relative h-40 w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-primary/5">
            <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <label className="cursor-pointer flex flex-col items-center gap-1.5 bg-white/90 px-5 py-2.5 rounded-full backdrop-blur-sm shadow-lg">
                <Camera className="text-primary" size={18} />
                <span className="text-[8px] uppercase font-black tracking-widest text-primary">Alterar Capa</span>
              </label>
            </div>
          </div>
          <div className="absolute -bottom-6 left-6">
            <div className="relative w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-xl bg-white story-ring p-0.5">
              <img src={profile?.avatar_url || ELENA.avatar} className="w-full h-full object-cover rounded-full border-2 border-white" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="text-white" size={20} />
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 pt-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-primary/70 px-1">Nome de Exibição</label>
            <input 
              className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-primary/70 px-1">Nome de Usuário</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-primary/40 font-bold">@</span>
              <input 
                className="w-full bg-white border border-primary/10 rounded-xl pl-8 pr-4 py-3.5 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-primary/70 px-1">Bio Editorial</label>
            <textarea 
              className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/20 shadow-sm text-sm leading-relaxed min-h-[100px] resize-none font-medium text-on-surface/80" 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Fale um pouco sobre você..."
            />
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl space-y-6 border border-primary/5 shadow-sm">
          <div className="flex items-center gap-2.5 mb-1">
            <LinkIcon className="text-primary" size={18} />
            <h2 className="font-bold text-base text-on-surface">Conexões Sociais</h2>
          </div>
          <div className="space-y-4">
            {['Instagram', 'Twitter (X)', 'TikTok'].map(platform => (
              <div key={platform} className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40 px-1">{platform}</label>
                <input className="w-full bg-background border border-primary/5 rounded-lg px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/10 font-medium" placeholder="Adicionar link" />
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-end gap-4 pt-4">
          <button onClick={onBack} type="button" className="text-on-surface/40 font-bold uppercase tracking-widest text-[10px] px-6 py-3">Cancelar</button>
          <button 
            type="submit" 
            disabled={loading}
            className="premium-gradient text-white px-10 py-4 rounded-xl shadow-lg font-black tracking-widest uppercase text-xs active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
};

const ScreenCreatePost = ({ onBack, user }: { onBack: () => void, user: any }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [price, setPrice] = useState('R$ 15,00');
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'post' | 'story'>('post');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to 'posts' bucket
      const imageUrl = await supabaseService.uploadFile('posts', filePath, file);

      // Create post record
      await supabaseService.createPost({
        author_id: user.id,
        image_url: imageUrl,
        caption,
        type,
        is_locked: isLocked,
        price: isLocked ? price : undefined
      });

      onBack();
    } catch (err) {
      console.error('Erro ao criar post:', err);
      alert('Erro ao criar post. Verifique se o bucket "posts" existe no Supabase e tem permissões públicas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-24 px-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8 pt-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Novo Post</h1>
        <button onClick={onBack} className="p-2 bg-primary/5 rounded-full text-primary"><X size={24} /></button>
      </div>

      <div className="space-y-8">
        <div className="flex gap-4 mb-4">
          <button 
            onClick={() => setType('post')}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${type === 'post' ? 'premium-gradient text-white shadow-lg' : 'bg-white text-on-surface/40 border border-primary/5'}`}
          >
            Feed
          </button>
          <button 
            onClick={() => setType('story')}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${type === 'story' ? 'premium-gradient text-white shadow-lg' : 'bg-white text-on-surface/40 border border-primary/5'}`}
          >
            Story
          </button>
        </div>

        {!preview ? (
          <label className="aspect-square w-full border-2 border-dashed border-primary/20 rounded-3xl flex flex-col items-center justify-center gap-4 bg-white cursor-pointer hover:bg-primary/5 transition-colors">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <PlusCircle size={32} />
            </div>
            <div className="text-center">
              <p className="font-bold text-on-surface">Selecionar Foto ou Vídeo</p>
              <p className="text-[10px] text-on-surface/40 uppercase tracking-widest font-black mt-1">Máximo 50MB</p>
            </div>
            <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
          </label>
        ) : (
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-black shadow-xl">
            {file?.type.startsWith('video') ? (
              <video src={preview} className="w-full h-full object-cover" controls />
            ) : (
              <img src={preview} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            )}
            <button 
              onClick={() => { setFile(null); setPreview(null); }}
              className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-primary/70 px-1">Legenda</label>
            <textarea 
              className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/20 shadow-sm text-sm leading-relaxed min-h-[100px] resize-none font-medium text-on-surface/80" 
              placeholder="Escreva algo sobre este conteúdo..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-primary/5 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Lock size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">Conteúdo Exclusivo</p>
                  <p className="text-[10px] text-on-surface/40 font-bold uppercase tracking-widest">Apenas para assinantes</p>
                </div>
              </div>
              <button 
                onClick={() => setIsLocked(!isLocked)}
                className={`w-12 h-6 rounded-full transition-colors relative ${isLocked ? 'bg-primary' : 'bg-on-surface/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isLocked ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>

            {isLocked && (
              <div className="pt-4 border-t border-primary/5 space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-black text-primary/70 px-1">Preço Sugerido</label>
                <input 
                  className="w-full bg-background border border-primary/5 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/10 font-bold" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={handleUpload}
          disabled={loading || !file}
          className="w-full premium-gradient text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all uppercase tracking-widest text-sm disabled:opacity-50"
        >
          {loading ? 'Publicando...' : 'Publicar Conteúdo'}
        </button>
      </div>
    </div>
  );
};

const ScreenLogin = ({ onLogin, onNavigateToRegister }: { onLogin: (user: any) => void, onNavigateToRegister: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await supabaseService.signIn(email, password);
      if (data.user) onLogin(data.user);
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-12 bg-background">
      <div className="w-full max-w-md space-y-12">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-4xl font-black premium-gradient bg-clip-text text-transparent tracking-tighter">ONLY MOC</div>
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-black tracking-tight leading-none text-on-surface">Bem-vindo de volta.</h1>
            <p className="text-on-surface/60 text-base font-bold max-w-[280px] mx-auto">Acesse sua galeria digital e gerencie seu legado.</p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">{error}</div>}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest px-1">E-mail ou Usuário</label>
              <input 
                className="w-full bg-white border border-primary/5 rounded-2xl px-5 py-4.5 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
                placeholder="exemplo@criador.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest px-1">Senha</label>
              <div className="relative flex items-center">
                <input 
                  className="w-full bg-white border border-primary/5 rounded-2xl px-5 py-4.5 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
                  placeholder="••••••••" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button className="absolute right-5 text-on-surface/40" type="button"><Eye size={20} /></button>
              </div>
            </div>
          </div>
          <div className="flex justify-end"><button className="text-xs font-black text-primary uppercase tracking-widest">Esqueceu a senha?</button></div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full premium-gradient text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all uppercase tracking-widest text-sm disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar na Galeria'}
          </button>
        </form>

        <div className="space-y-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-primary/10"></div></div>
            <span className="relative bg-background px-4 text-[10px] font-black text-on-surface/30 uppercase tracking-widest">Ou continue com</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-white border border-primary/5 py-4 rounded-2xl shadow-sm active:scale-95 transition-all">
              <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white text-[10px]">A</div>
              <span className="text-xs font-bold">Apple</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-white border border-primary/5 py-4 rounded-2xl shadow-sm active:scale-95 transition-all">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]">G</div>
              <span className="text-xs font-bold">Google</span>
            </button>
          </div>
        </div>

        <div className="text-center pt-4">
          <p className="text-on-surface/60 font-bold text-sm">Novo por aqui? <button onClick={onNavigateToRegister} className="text-primary font-black ml-1 uppercase tracking-widest">Cadastre-se</button></p>
        </div>
      </div>
    </div>
  );
};

const ScreenRegister = ({ onRegister, onNavigateToLogin }: { onRegister: (user: any) => void, onNavigateToLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await supabaseService.signUp(email, password, fullName);
      if (data.user) onRegister(data.user);
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-12 bg-background">
      <div className="w-full max-w-md space-y-10">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-4xl font-black premium-gradient bg-clip-text text-transparent tracking-tighter">ONLY MOC</div>
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-black tracking-tight leading-none text-on-surface">Criar Conta.</h1>
            <p className="text-on-surface/60 text-base font-bold max-w-[280px] mx-auto">Junte-se à elite dos criadores digitais.</p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleRegister}>
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">{error}</div>}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest px-1">Nome Completo</label>
              <input 
                className="w-full bg-white border border-primary/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
                placeholder="Seu nome" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest px-1">E-mail</label>
              <input 
                className="w-full bg-white border border-primary/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
                placeholder="exemplo@criador.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest px-1">Senha</label>
              <input 
                className="w-full bg-white border border-primary/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
                placeholder="••••••••" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-1">
            <div className="w-12 h-6 bg-primary/10 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full shadow-sm"></div>
            </div>
            <span className="text-xs font-bold text-on-surface/80">Eu sou um criador</span>
          </div>

          <div className="flex items-start gap-3 px-1">
            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-primary/20 text-primary focus:ring-primary/20" required />
            <p className="text-[10px] font-bold text-on-surface/60 leading-relaxed">
              Eu aceito os <span className="text-primary underline">Termos de Serviço</span> e a <span className="text-primary underline">Política de Privacidade</span>.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full premium-gradient text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all uppercase tracking-widest text-sm disabled:opacity-50"
          >
            {loading ? 'Criando Conta...' : 'Criar Conta Gratuita'}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-on-surface/60 font-bold text-sm">Já tem uma conta? <button onClick={onNavigateToLogin} className="text-primary font-black ml-1 uppercase tracking-widest">Entrar</button></p>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

import { testSupabaseConnection } from './lib/supabase';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [connectionDetails, setConnectionDetails] = useState<string | null>(null);

  const checkConnection = async () => {
    setSupabaseStatus('checking');
    setConnectionDetails(null);
    const result = await testSupabaseConnection();
    setSupabaseStatus(result.success ? 'connected' : 'error');
    if (result.details) setConnectionDetails(result.details);
    
    // Se falhar, libera o loading inicial para mostrar a tela de login
    if (!result.success) {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();

    // Timeout de segurança para o loading inicial
    const loadingTimeout = setTimeout(() => {
      setProfileLoading(false);
    }, 8000);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      clearTimeout(loadingTimeout);
      if (session?.user) {
        setUser(session.user);
        setProfileLoading(true);
        try {
          const userProfile = await supabaseService.getProfile(session.user.id);
          setProfile(userProfile);
        } catch (err) {
          console.error('Erro ao carregar perfil:', err);
        } finally {
          setProfileLoading(false);
        }
        setScreen('feed');
      } else {
        setUser(null);
        setProfile(null);
        setProfileLoading(false);
        setScreen('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderScreen = () => {
    if (!user) {
      if (screen === 'register') {
        return <ScreenRegister onRegister={(u) => setUser(u)} onNavigateToLogin={() => setScreen('login')} />;
      }
      return <ScreenLogin onLogin={(u) => setUser(u)} onNavigateToRegister={() => setScreen('register')} />;
    }

    if (profileLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    switch (screen) {
      case 'feed': return <ScreenFeed profile={profile} />;
      case 'profile': return <ScreenProfile onEdit={() => setScreen('edit-profile')} profile={profile} />;
      case 'activity': return <ScreenActivity user={user} />;
      case 'messages': return <ScreenMessages user={user} />;
      case 'create-post': return <ScreenCreatePost onBack={() => setScreen('feed')} user={user} />;
      case 'edit-profile': return (
        <ScreenEditProfile 
          onBack={() => setScreen('profile')} 
          profile={profile} 
          onUpdate={(updates) => setProfile((prev: any) => ({ ...prev, ...updates }))} 
        />
      );
      default: return <ScreenFeed profile={profile} />;
    }
  };

  const getTitle = () => {
    if (screen === 'profile') return 'PERFIL';
    if (screen === 'activity') return 'ATIVIDADE';
    if (screen === 'messages') return 'MENSAGENS';
    if (screen === 'edit-profile') return 'EDITAR';
    return 'ONLY MOC';
  };

  const isLoggedIn = !!user;
  const showNav = isLoggedIn && screen !== 'edit-profile';

  return (
    <div className="min-h-screen bg-background">
      {isLoggedIn && (
        <TopNav 
          title={getTitle()} 
          showBack={screen === 'edit-profile'} 
          onBack={() => setScreen('profile')} 
          supabaseStatus={supabaseStatus}
          profile={profile}
          onRetry={checkConnection}
        />
      )}

      {supabaseStatus === 'error' && (
        <div className="fixed top-20 left-6 right-6 z-[60] bg-red-50 border border-red-100 p-4 rounded-2xl shadow-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 flex-shrink-0">
            <X size={16} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-black text-red-600 uppercase tracking-widest">Erro de Conexão</p>
            <p className="text-[10px] font-bold text-red-500 leading-relaxed">
              Não foi possível conectar ao Supabase. Isso geralmente acontece se o projeto estiver <strong>Pausado</strong> ou se as chaves estiverem incorretas.
              {connectionDetails && <span className="block mt-1 opacity-60">Diagnóstico: {connectionDetails}</span>}
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <button 
                onClick={checkConnection}
                className="text-[10px] font-black text-red-600 uppercase tracking-widest underline"
              >
                Tentar novamente
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="text-[10px] font-black text-red-600 uppercase tracking-widest underline"
              >
                Reiniciar App
              </button>
              <a 
                href="https://supabase.com/dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-black text-red-600 uppercase tracking-widest underline"
              >
                Dashboard Supabase
              </a>
            </div>
          </div>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {showNav && (
        <BottomNav active={screen} onChange={setScreen} />
      )}
    </div>
  );
}
