/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  Link as LinkIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen, Post, Notification, Message, Creator } from './types';
import { supabase } from './lib/supabase';

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

const TopNav = ({ title = "Safadinha +18", showBack = false, onBack = () => {}, avatar }: { title?: string, showBack?: boolean, onBack?: () => void, avatar?: string }) => (
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
      <div>
        <div className="text-2xl font-black text-primary tracking-tight leading-none">
          {title}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
        <img src={avatar || ELENA.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
      <MessageCircle size={24} />
      <span className="text-[10px] font-bold">Mensagens</span>
    </button>
    <button onClick={() => onChange('create-post')} className={`p-2 bg-primary text-white rounded-full shadow-lg shadow-primary/20 transition-transform active:scale-90 ${active === 'create-post' ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
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

const ScreenFeed = ({ posts, stories, onStoryUpload, creator }: { posts: Post[], stories: any[], onStoryUpload: (file: File) => void, creator: Creator }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="pt-20 pb-24 max-w-2xl mx-auto">
      {/* Stories */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 py-6 bg-white border-b border-primary/5">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,video/*"
          onChange={(e) => {
            if (e.target.files?.[0]) onStoryUpload(e.target.files[0]);
          }}
        />
        <div 
          className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="relative p-[3px] rounded-full story-ring">
            <div className="p-0.5 bg-white rounded-full">
              <img src={creator.avatar} className="w-16 h-16 rounded-full object-cover" referrerPolicy="no-referrer" />
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
                <img src={story.image} className="w-16 h-16 rounded-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
            <span className="text-[10px] font-bold text-on-surface/60">{story.creator_name || 'Amigo'}</span>
          </div>
        ))}
        {stories.length === 0 && ['Valentina', 'Kael', 'Mariana', 'Thiago', 'Lucas', 'Bia'].map((name) => (
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
      {posts.map(post => (
        <article key={post.id} className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <img src={post.creator.avatar} className="w-10 h-10 rounded-full object-cover border border-primary/10" referrerPolicy="no-referrer" />
              <div>
                <div className="flex items-center gap-1">
                  <p className="font-bold text-sm">{post.creator.name}</p>
                  <CheckCircle2 size={12} className="text-primary fill-primary/10" />
                </div>
                <p className="text-[10px] text-on-surface/40 font-bold uppercase tracking-wider">{post.time}</p>
              </div>
            </div>
            <MoreHorizontal className="text-on-surface/40 cursor-pointer" />
          </div>
          
          <div className="aspect-square relative overflow-hidden bg-on-surface/5">
            <img 
              src={post.image} 
              className={`w-full h-full object-cover transition-all duration-700 ${post.isLocked ? 'blur-[60px] scale-110 opacity-50' : 'hover:scale-105'}`} 
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1633078654544-61b3455b9161?q=80&w=400&auto=format&fit=crop'; // Fallback image
              }}
            />
            {post.isLocked && (
              <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/20">
                <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] flex flex-col items-center text-center shadow-2xl border border-white/20 w-full max-w-[280px]">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary/10">
                    <Lock className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-black mb-2 text-white drop-shadow-md">Conteúdo VIP</h3>
                  <p className="text-xs text-white/80 mb-8 font-bold uppercase tracking-widest leading-relaxed">
                    Desbloqueie este post exclusivo do criador.
                  </p>
                  <button className="w-full py-4 px-8 premium-gradient text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all text-[10px] uppercase tracking-[0.2em]">
                    ASSINAR POR {post.price || 'R$ 19,90'}
                  </button>
                </div>
              </div>
            )}
            {post.isVideo && !post.isLocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <Play className="text-white fill-white" size={40} />
                </div>
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-6">
                <Heart className="text-on-surface cursor-pointer" fill={post.id === '1' ? '#E11D48' : 'none'} stroke={post.id === '1' ? '#E11D48' : 'currentColor'} />
                <MessageCircle className="text-on-surface cursor-pointer" />
                <Send className="text-on-surface cursor-pointer" />
              </div>
              <Bookmark className="text-on-surface cursor-pointer" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold">{post.likes} curtidas</p>
              <p className="text-sm text-on-surface/80 leading-relaxed">
                <span className="font-bold">{post.creator.name}</span> {post.caption}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
  );
};

const ScreenProfile = ({ onEdit, creator, onLogout, posts }: { onEdit: () => void, creator: Creator, onLogout: () => void, posts: Post[] }) => {
  const myPosts = posts.filter(p => p.creator.id === creator.id);
  
  return (
    <div className="pt-0 pb-24">
      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full relative overflow-hidden bg-on-surface/5">
        <img 
          src={creator.cover_image || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200'} 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background"></div>
      </div>

      <section className="max-w-4xl mx-auto px-6 text-center -mt-20 relative z-10">
        <div className="relative inline-block mb-6">
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full p-[4px] story-ring bg-background shadow-2xl">
            <img src={creator.avatar} className="w-full h-full object-cover rounded-full border-4 border-white" referrerPolicy="no-referrer" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">{creator.name}</h1>
        <p className="text-base text-primary font-bold mb-8">{creator.bio}</p>

        <div className="flex justify-center items-center gap-10 mb-10 py-6 px-8 bg-white rounded-3xl shadow-sm max-w-md mx-auto border border-primary/5">
          <div className="text-center">
            <span className="block text-xl font-bold">{myPosts.length}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40">Posts</span>
          </div>
          <div className="w-px h-8 bg-primary/10"></div>
          <div className="text-center">
            <span className="block text-xl font-bold">{creator.stats?.followers || '0'}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40">Seguidores</span>
          </div>
          <div className="w-px h-8 bg-primary/10"></div>
          <div className="text-center">
            <span className="block text-xl font-bold">{creator.stats?.likes || '0'}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40">Curtidas</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 max-w-md mx-auto">
          <button onClick={onEdit} className="w-full py-4 premium-gradient text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs">
            Editar Perfil
          </button>
          <button className="w-full py-4 bg-primary/5 text-primary font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all uppercase tracking-widest text-xs">
            <Mail size={18} />
            Mensagem
          </button>
        </div>
        
        <button 
          onClick={onLogout}
          className="text-red-500 font-bold text-xs uppercase tracking-widest hover:underline mb-12"
        >
          Sair da Conta
        </button>
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
        {myPosts.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {myPosts.map((post) => (
              <div key={post.id} className="relative aspect-square overflow-hidden rounded-2xl bg-on-surface/5 shadow-sm group">
                <img 
                  src={post.image} 
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${post.isLocked ? 'blur-2xl scale-125 opacity-40' : ''}`} 
                  referrerPolicy="no-referrer" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1633078654544-61b3455b9161?q=80&w=400&auto=format&fit=crop';
                  }}
                />
                {post.isLocked && (
                  <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-white">
                    <Lock size={20} fill="white" className="drop-shadow-lg" />
                    <span className="text-[8px] font-black uppercase tracking-widest mt-1 drop-shadow-md">VIP</span>
                  </div>
                )}
                {post.isVideo && !post.isLocked && (
                  <div className="absolute top-3 left-3 z-10 text-white">
                    <Play size={18} fill="white" />
                  </div>
                )}
                <div className="absolute top-3 right-3 z-10">
                  <div className="bg-black/20 backdrop-blur-md p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart size={14} fill="white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-primary/5">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="text-primary/40" size={32} />
            </div>
            <p className="text-on-surface/40 font-bold uppercase tracking-widest text-xs">Nenhuma publicação ainda</p>
          </div>
        )}
      </section>
    </div>
  );
};

const ScreenActivity = ({ notifications }: { notifications: Notification[] }) => (
  <div className="pt-20 pb-24 px-6 max-w-2xl mx-auto">
    <section className="mb-8 pt-8">
      <h2 className="text-4xl font-extrabold tracking-tight mb-1">Atividade</h2>
      <p className="text-on-surface/60 text-sm font-medium">Sua jornada criativa em tempo real.</p>
    </section>

    <div className="space-y-10">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface/30 mb-4">Hoje</h3>
        <div className="space-y-3">
          {notifications.map(notif => (
            <div key={notif.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-primary/5">
              <div className="relative">
                <img src={notif.user.avatar} className="w-12 h-12 rounded-full object-cover border border-primary/10" referrerPolicy="no-referrer" />
                {notif.user.isVerified && (
                  <span className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5 border-2 border-white">
                    <CheckCircle2 size={10} fill="white" />
                  </span>
                )}
              </div>
              <div className="flex-1">
                {notif.badge && (
                  <span className="bg-primary/10 text-primary text-[8px] font-black px-2 py-0.5 rounded-full tracking-wider mb-1 inline-block uppercase">
                    {notif.badge}
                  </span>
                )}
                <p className="text-xs font-medium leading-relaxed text-on-surface">
                  <span className="font-bold">{notif.user.name}</span> {notif.content}
                </p>
                <span className="text-[10px] text-on-surface/40 mt-0.5 block font-bold uppercase tracking-tighter">{notif.time}</span>
              </div>
              {notif.thumbnail && (
                <img src={notif.thumbnail} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface/30 mb-4">Ontem</h3>
        <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-primary/5 opacity-60">
          <img src="https://picsum.photos/seed/user/100" className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
          <div className="flex-1">
            <p className="text-xs font-medium text-on-surface">
              <span className="font-bold">Marco Aurélio</span> comentou no seu post: "Incrível!"
            </p>
            <span className="text-[10px] text-on-surface/40 mt-0.5 block font-bold uppercase tracking-tighter">Há 24 horas</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ScreenMessages = ({ messages }: { messages: Message[] }) => (
  <div className="pt-20 pb-24 max-w-2xl mx-auto px-6">
    <section className="mb-8 pt-8">
      <h1 className="text-4xl font-extrabold tracking-tight mb-1">Mensagens</h1>
      <p className="text-on-surface/60 text-sm font-medium">Gerencie suas conexões e conversas exclusivas.</p>
    </section>

    <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
      <button className="px-5 py-2 rounded-full premium-gradient text-white font-bold text-xs shadow-sm">Todas</button>
      <button className="px-5 py-2 rounded-full bg-white text-on-surface/60 font-bold text-xs border border-primary/5">Não Lidas</button>
      <button className="px-5 py-2 rounded-full bg-white text-on-surface/60 font-bold text-xs border border-primary/5 flex items-center gap-1.5">
        <Star size={14} className="text-primary" fill="currentColor" />
        Premium
      </button>
    </div>

    <div className="space-y-3">
      {messages.map(msg => (
        <div key={msg.id} className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white transition-all hover:shadow-md cursor-pointer border border-primary/5">
          <div className="relative flex-shrink-0">
            <img src={msg.user.avatar} className={`w-14 h-14 rounded-full object-cover border border-primary/10 p-0.5 ${msg.isLocked ? 'grayscale opacity-50' : ''}`} referrerPolicy="no-referrer" />
            {msg.isOnline && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>}
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-baseline mb-0.5">
              <h3 className={`font-bold text-base truncate ${msg.isLocked ? 'text-on-surface/60' : 'text-on-surface'}`}>{msg.user.name}</h3>
              <span className="text-[10px] font-bold text-on-surface/40 uppercase tracking-tighter">{msg.time}</span>
            </div>
            <p className={`text-xs truncate ${msg.isLocked ? 'text-primary font-bold' : 'text-on-surface/60 font-medium'}`}>
              {msg.isLocked ? (
                <span className="flex items-center gap-1"><Lock size={12} /> {msg.lastMessage}</span>
              ) : msg.lastMessage}
            </p>
          </div>
          {msg.unreadCount && (
            <div className="bg-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
              {msg.unreadCount}
            </div>
          )}
        </div>
      ))}
    </div>

    <section className="mt-12">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Descobrir Novos</h2>
          <p className="text-xs text-on-surface/60 font-medium">Recomendações baseadas no seu perfil</p>
        </div>
        <button className="text-primary font-bold text-xs flex items-center gap-0.5">Ver todos <ChevronRight size={14} /></button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="relative h-48 rounded-2xl overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
              <span className="text-[8px] font-black text-white uppercase tracking-widest">Fashion</span>
            </div>
            <p className="text-white font-bold text-sm">Alana Costa</p>
          </div>
        </div>
        <div className="grid grid-rows-2 gap-3">
          <div className="relative rounded-2xl overflow-hidden bg-white flex items-center p-3 gap-3 border border-primary/5">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
            <div>
              <p className="font-bold text-xs">Lucas M.</p>
              <p className="text-[8px] font-black text-primary uppercase tracking-widest">Música</p>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-primary/5 flex items-center p-3 gap-3 border border-primary/10">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <PlusCircle size={18} className="text-primary" />
            </div>
            <div>
              <p className="font-bold text-xs text-primary">Explorar</p>
              <p className="text-[8px] font-black text-primary/70 uppercase tracking-widest">Tendências</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

const ScreenEditProfile = ({ onBack, creator, onProfileUpdated }: { onBack: () => void, creator: Creator, onProfileUpdated: () => void }) => {
  const [name, setName] = useState(creator.name);
  const [username, setUsername] = useState(creator.username);
  const [bio, setBio] = useState(creator.bio);
  const [avatar, setAvatar] = useState(creator.avatar);
  const [coverImage, setCoverImage] = useState(creator.cover_image || '');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File, bucket: string) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${creator.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err: any) {
      setError(`Erro no upload: ${err.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const url = await handleFileUpload(e.target.files[0], 'avatars');
    if (url) setAvatar(url);
  };

  const onCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const url = await handleFileUpload(e.target.files[0], 'covers');
    if (url) setCoverImage(url);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase.from('profiles').update({
        name,
        username,
        bio,
        avatar,
        cover_image: coverImage
      }).eq('id', user.id);

      if (error) throw error;
      onProfileUpdated();
      onBack();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-24 px-6 max-w-2xl mx-auto">
      <section className="mb-8 pt-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-1">Editar Perfil</h1>
        <p className="text-on-surface/60 text-sm font-medium">Curadoria do seu espaço digital</p>
      </section>

      <form className="space-y-10" onSubmit={handleSave}>
        <section className="relative">
          <div className="group relative h-40 w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-primary/5">
            <img 
              src={coverImage || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800'} 
              className="w-full h-full object-cover opacity-80" 
              referrerPolicy="no-referrer" 
            />
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <label className="cursor-pointer flex flex-col items-center gap-1.5 bg-white/90 px-5 py-2.5 rounded-full backdrop-blur-sm shadow-lg">
                <Camera className="text-primary" size={18} />
                <span className="text-[8px] uppercase font-black tracking-widest text-primary">Alterar Capa</span>
                <input type="file" className="hidden" accept="image/*" onChange={onCoverChange} disabled={uploading} />
              </label>
            </div>
          </div>
          <div className="absolute -bottom-6 left-6">
            <div className="relative w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-xl bg-white story-ring p-0.5">
              <img src={avatar} className="w-full h-full object-cover rounded-full border-2 border-white" referrerPolicy="no-referrer" />
              <label className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-full">
                <Camera className="text-white" size={20} />
                <input type="file" className="hidden" accept="image/*" onChange={onAvatarChange} disabled={uploading} />
              </label>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 pt-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-primary/70 px-1">Nome de Exibição</label>
            <input 
              className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-primary/70 px-1">Bio Editorial</label>
            <textarea 
              className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/20 shadow-sm text-sm leading-relaxed min-h-[100px] resize-none font-medium text-on-surface/80" 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
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

        {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
        {uploading && <p className="text-primary text-xs font-bold text-center animate-pulse">Fazendo upload...</p>}

        <div className="flex items-center justify-end gap-4 pt-4">
          <button onClick={onBack} type="button" className="text-on-surface/40 font-bold uppercase tracking-widest text-[10px] px-6 py-3">Cancelar</button>
          <button 
            disabled={loading || uploading}
            type="submit" 
            className="premium-gradient text-white px-10 py-4 rounded-xl shadow-lg font-black tracking-widest uppercase text-xs active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
};

const ScreenCreatePost = ({ onBack, onPostCreated }: { onBack: () => void, onPostCreated: () => void }) => {
  const [image, setImage] = useState('');
  const [caption, setCaption] = useState('');
  const [price, setPrice] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('posts').getPublicUrl(filePath);
      setImage(data.publicUrl);
      setIsVideo(file.type.startsWith('video/'));
    } catch (err: any) {
      setError(`Erro no upload: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError('Por favor, selecione uma foto ou vídeo');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase.from('posts').insert({
        creator_id: user.id,
        image,
        caption,
        price: isLocked ? price : null,
        is_locked: isLocked,
        is_video: isVideo,
        time: 'Agora mesmo'
      });

      if (error) throw error;
      onPostCreated();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar postagem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-24 px-6 max-w-2xl mx-auto">
      <section className="mb-8 pt-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-1">Nova Postagem</h1>
        <p className="text-on-surface/60 text-sm font-medium">Compartilhe sua arte com o mundo.</p>
      </section>

      <form className="space-y-8" onSubmit={handleCreatePost}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest px-1">Mídia (Foto ou Vídeo)</label>
            <div className="relative group aspect-video bg-white border-2 border-dashed border-primary/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 transition-all overflow-hidden">
              {image ? (
                isVideo ? (
                  <video src={image} className="w-full h-full object-cover" controls />
                ) : (
                  <img src={image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                )
              ) : (
                <>
                  <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-2">
                    <Camera className="text-primary" size={24} />
                  </div>
                  <p className="text-xs font-bold text-on-surface/60">Clique para selecionar arquivo</p>
                  <p className="text-[8px] uppercase tracking-widest font-black text-on-surface/30 mt-1">PNG, JPG ou MP4</p>
                </>
              )}
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                accept="image/*,video/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest px-1">Legenda</label>
            <textarea 
              className="w-full bg-white border border-primary/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 shadow-sm font-medium text-on-surface min-h-[100px] resize-none" 
              placeholder="Escreva algo sobre sua postagem..." 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-primary/5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isLocked ? 'bg-primary/10 text-primary' : 'bg-on-surface/5 text-on-surface/40'}`}>
                <Lock size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Conteúdo Exclusivo</p>
                <p className="text-[10px] text-on-surface/40 font-bold uppercase tracking-widest">Apenas para assinantes</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setIsLocked(!isLocked)}
              className={`w-12 h-6 rounded-full relative transition-colors ${isLocked ? 'bg-primary' : 'bg-on-surface/10'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${isLocked ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>

          {isLocked && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
              <label className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest px-1">Preço para Desbloquear</label>
              <input 
                className="w-full bg-white border border-primary/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
                placeholder="R$ 15,00" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required={isLocked}
              />
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
        {uploading && <p className="text-primary text-xs font-bold text-center animate-pulse">Fazendo upload do arquivo...</p>}

        <div className="flex items-center justify-end gap-4">
          <button onClick={onBack} type="button" className="text-on-surface/40 font-bold uppercase tracking-widest text-[10px] px-6 py-3">Cancelar</button>
          <button 
            disabled={loading || uploading}
            type="submit" 
            className="premium-gradient text-white px-10 py-4 rounded-xl shadow-lg font-black tracking-widest uppercase text-xs active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Publicando...' : 'Publicar Agora'}
          </button>
        </div>
      </form>
    </div>
  );
};

const ScreenLogin = ({ onLogin, onNavigateToRegister }: { onLogin: () => void, onNavigateToRegister: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onLogin();
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
          <div className="text-4xl font-black text-primary tracking-tighter">Safadinha +18</div>
          <div className="text-center space-y-2">
            <p className="text-on-surface/60 text-base font-bold max-w-[280px] mx-auto">Acesse sua galeria digital e gerencie seu legado.</p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest px-1">E-mail</label>
              <input 
                className="w-full bg-white border border-primary/5 rounded-2xl px-5 py-4.5 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
                placeholder="exemplo@criador.com" 
                type="email"
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
          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
          <div className="flex justify-end"><button className="text-xs font-black text-primary uppercase tracking-widest" type="button">Esqueceu a senha?</button></div>
          <button 
            disabled={loading}
            type="submit" 
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

const ScreenRegister = ({ onRegister, onNavigateToLogin }: { onRegister: () => void, onNavigateToLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });
      if (error) throw error;
      
      // Create profile in profiles table
      if (data.user) {
        console.log('Creating profile for user:', data.user.id);
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          name: name,
          username: email.split('@')[0] + Math.floor(Math.random() * 1000),
          avatar: `https://picsum.photos/seed/${data.user.id}/400`,
          bio: 'Novo criador no pedaço!',
          stats: { posts: '0', followers: '0', likes: '0' }
        });
        if (profileError) {
          console.error('Error creating profile:', profileError);
          // If profile creation fails, we might want to alert the user or try again
          // but for now we'll just log it.
        } else {
          console.log('Profile created successfully');
        }
      }

      onRegister();
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
          <div className="text-4xl font-black text-primary tracking-tighter">Safadinha +18</div>
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-black tracking-tight leading-none text-on-surface">Criar Conta.</h1>
            <p className="text-on-surface/60 text-base font-bold max-w-[280px] mx-auto">Junte-se à elite dos criadores digitais.</p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest px-1">Nome Completo</label>
              <input 
                className="w-full bg-white border border-primary/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
                placeholder="Seu nome" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest px-1">E-mail</label>
              <input 
                className="w-full bg-white border border-primary/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
                placeholder="exemplo@criador.com" 
                type="email"
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
          
          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

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
            disabled={loading}
            type="submit" 
            className="w-full premium-gradient text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all uppercase tracking-widest text-sm disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar Conta Gratuita'}
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

export default function App() {
  const [screen, setScreen] = React.useState<Screen>('login');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [posts, setPosts] = React.useState<Post[]>(POSTS);
  const [stories, setStories] = React.useState<any[]>([]);
  const [notifications, setNotifications] = React.useState<Notification[]>(NOTIFICATIONS);
  const [messages, setMessages] = React.useState<Message[]>(MESSAGES);
  const [creator, setCreator] = React.useState<Creator>(ELENA);
  const [loading, setLoading] = React.useState(true);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [dbStatus, setDbStatus] = React.useState<'checking' | 'connected' | 'error'>('checking');

  const handleStoryUpload = async (file: File) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('stories')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('stories').getPublicUrl(filePath);

      const { error: insertError } = await supabase.from('stories').insert({
        creator_id: user.id,
        image: publicUrl,
        creator_name: creator.name
      });

      if (insertError) {
        // If table doesn't exist, we might need to create it or handle it.
        // For now, we'll assume it exists or use a fallback.
        console.error('Error inserting story record:', insertError);
      }
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error('Error uploading story:', err);
    }
  };

  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        // Test connection by fetching a single profile or just checking health
        const { error } = await supabase.from('profiles').select('id').limit(1);
        if (error) throw error;
        setDbStatus('connected');
      } catch (err) {
        console.error('Supabase connection test failed:', err);
        setDbStatus('error');
      }
    };
    checkConnection();
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        setScreen('feed');
      }
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
        setScreen('feed');
      } else {
        setIsLoggedIn(false);
        setScreen('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch profile
        const { data: profileData, error: profileFetchError } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        
        if (profileData) {
          setCreator(profileData as any);
        } else if (profileFetchError && profileFetchError.code === 'PGRST116') {
          // PGRST116 is "The result contains 0 rows" for .single()
          console.log('Profile not found, creating default profile for user:', user.id);
          const newProfile = {
            id: user.id,
            name: user.user_metadata?.full_name || 'Novo Criador',
            username: user.email?.split('@')[0] + Math.floor(Math.random() * 1000),
            avatar: `https://picsum.photos/seed/${user.id}/400`,
            bio: 'Bem-vindo ao meu perfil!',
            stats: { posts: '0', followers: '0', likes: '0' }
          };
          
          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating fallback profile:', createError);
          } else if (createdProfile) {
            setCreator(createdProfile as any);
          }
        }

        // Fetch posts
        const { data: postsData } = await supabase.from('posts').select('*, creator:profiles(*)').order('created_at', { ascending: false });
        if (postsData) {
          setPosts(postsData.map((p: any) => ({
            ...p,
            isLocked: p.is_locked,
            isVideo: p.is_video
          })) as any);
        }

        // Fetch notifications
        const { data: notificationsData } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
        if (notificationsData) setNotifications(notificationsData as any);

        // Fetch messages
        const { data: messagesData } = await supabase.from('messages').select('*, user:profiles(*)').order('created_at', { ascending: false });
        if (messagesData) {
          setMessages(messagesData.map((m: any) => ({
            ...m,
            unreadCount: m.unread_count,
            isLocked: m.is_locked,
            isOnline: m.is_online
          })) as any);
        }

        // Fetch stories
        const { data: storiesData } = await supabase.from('stories').select('*').order('created_at', { ascending: false });
        if (storiesData) setStories(storiesData);
      } catch (error) {
        console.error('Error fetching data from Supabase:', error);
      }
    };

    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, refreshKey]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary font-bold animate-pulse">CARREGANDO...</div>
      </div>
    );
  }

  const renderScreen = () => {
    if (!isLoggedIn) {
      if (screen === 'register') {
        return <ScreenRegister onRegister={() => setScreen('feed')} onNavigateToLogin={() => setScreen('login')} />;
      }
      return <ScreenLogin onLogin={() => setScreen('feed')} onNavigateToRegister={() => setScreen('register')} />;
    }

    switch (screen) {
      case 'feed': return <ScreenFeed posts={posts} stories={stories} onStoryUpload={handleStoryUpload} creator={creator} />;
      case 'profile': return <ScreenProfile onEdit={() => setScreen('edit-profile')} creator={creator} onLogout={() => supabase.auth.signOut()} posts={posts} />;
      case 'activity': return <ScreenActivity notifications={notifications} />;
      case 'messages': return <ScreenMessages messages={messages} />;
      case 'edit-profile': return <ScreenEditProfile onBack={() => setScreen('profile')} creator={creator} onProfileUpdated={() => setRefreshKey(prev => prev + 1)} />;
      case 'create-post': return <ScreenCreatePost onBack={() => setScreen('feed')} onPostCreated={() => { setRefreshKey(prev => prev + 1); setScreen('feed'); }} />;
      default: return <ScreenFeed posts={posts} stories={stories} onStoryUpload={handleStoryUpload} creator={creator} />;
    }
  };

  const getTitle = () => {
    if (screen === 'profile') return 'PERFIL';
    if (screen === 'activity') return 'ATIVIDADE';
    if (screen === 'messages') return 'MENSAGENS';
    if (screen === 'edit-profile') return 'EDITAR';
    if (screen === 'create-post') return 'POSTAR';
    return 'Safadinha +18';
  };

  const showNav = isLoggedIn && !['edit-profile', 'create-post'].includes(screen);

  return (
    <div className="min-h-screen bg-background">
      {isLoggedIn && (
        <TopNav 
          title={getTitle()} 
          showBack={['edit-profile', 'create-post'].includes(screen)} 
          onBack={() => setScreen(screen === 'edit-profile' ? 'profile' : 'feed')} 
          avatar={creator.avatar}
        />
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
