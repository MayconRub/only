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
  Pause,
  Volume2,
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
  EyeOff,
  Star,
  ChevronRight,
  Camera,
  Link as LinkIcon,
  X,
  Check,
  CreditCard,
  ShieldCheck,
  Crown,
  QrCode,
  Copy,
  RefreshCw,
  Mic,
  Trash2,
  Image as ImageIcon,
  Video as VideoIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Cropper from 'react-easy-crop';
import { Screen, Post, Notification, Message, Creator, ChatMessage } from './types';
import { supabase } from './lib/supabase';

// --- Constants ---

const LOGIN_LOGO_URL = `${(import.meta as any).env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/scren.png`;
const APP_LOGO_URL = `${(import.meta as any).env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/logoo.png`;

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

const POSTS: Post[] = [];

const NOTIFICATIONS: Notification[] = [];

const MESSAGES: Message[] = [];

// --- Components ---

const FormattedText = ({ text, className }: { text: string, className?: string }) => {
  if (!text) return null;
  
  // Split by ** to find bold parts
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return (
    <p className={className}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-black">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </p>
  );
};

const GoogleLoginButton = ({ onClick, loading }: { onClick: () => void, loading?: boolean }) => (
  <button 
    type="button"
    onClick={onClick}
    disabled={loading}
    className="w-full flex items-center justify-center gap-3 bg-white border border-primary/10 py-4 rounded-2xl shadow-sm active:scale-[0.98] transition-all hover:bg-on-surface/5 disabled:opacity-50"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
    <span className="text-sm font-bold text-on-surface">Continuar com Google</span>
  </button>
);

const TopNav = ({ 
  title = "Novinha do JOB MOC", 
  showBack = false, 
  onBack = () => {}, 
  avatar,
  isMaster = false,
  onMessageClick,
  unreadCount = 0
}: { 
  title?: string, 
  showBack?: boolean, 
  onBack?: () => void, 
  avatar?: string,
  isMaster?: boolean,
  onMessageClick?: () => void,
  unreadCount?: number
}) => (
  <header className="fixed top-0 w-full flex justify-between items-center px-6 py-0 glass-header z-50">
    <div className="flex items-center gap-4">
      {showBack && (
        <button onClick={onBack} className="text-on-surface hover:opacity-80 transition-opacity">
          <ArrowLeft size={24} />
        </button>
      )}
      <div>
        <div className="flex items-center gap-3">
          <img 
            src={APP_LOGO_URL} 
            alt="Logo" 
            className="h-12 w-auto object-contain" 
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="text-2xl font-black text-primary tracking-tighter leading-none">NUDLYE</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-4">
      {isMaster && onMessageClick && (
        <button onClick={onMessageClick} className="text-on-surface/60 hover:text-primary transition-colors relative">
          <MessageCircle size={24} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      )}
      <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
        <img src={avatar || ELENA.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>
    </div>
  </header>
);

const ScreenSubscriptions = ({ onBack }: { onBack: () => void }) => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('payments')
          .select('*, creator:profiles!creator_id(*)')
          .eq('user_id', user.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setSubscriptions(data);
      } catch (err) {
        console.error('Error fetching subscriptions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  return (
    <div className="pt-20 pb-24 px-6 max-w-2xl mx-auto">
      <section className="mb-8 pt-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-1">Assinaturas</h1>
        <p className="text-on-surface/60 text-sm font-medium">Histórico de conteúdos que você assinou.</p>
      </section>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : subscriptions.length > 0 ? (
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="bg-white p-5 rounded-2xl border border-primary/5 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={sub.creator?.avatar} className="w-14 h-14 rounded-full object-cover border-2 border-primary/10" referrerPolicy="no-referrer" />
                  <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full border-2 border-white">
                    <ShieldCheck size={12} />
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-on-surface text-base uppercase tracking-tight">{sub.creator?.name}</h3>
                  <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">Plano: {sub.plan_id || 'VIP'}</p>
                  <p className="text-[9px] font-bold text-primary/60 uppercase tracking-widest mt-1">
                    Ativo desde {new Date(sub.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-black text-primary text-sm">R$ {sub.amount?.toFixed(2).replace('.', ',')}</span>
                <span className="text-[8px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1 rounded-md border border-green-100">Confirmado</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-6 bg-white rounded-3xl border border-primary/5 shadow-sm">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="text-primary/20" size={40} />
          </div>
          <h3 className="text-lg font-black mb-2 uppercase tracking-tight">Nenhuma Assinatura</h3>
          <p className="text-xs text-on-surface/40 font-bold uppercase tracking-widest leading-relaxed">
            Você ainda não assinou nenhum criador. Explore o feed para encontrar conteúdos exclusivos!
          </p>
        </div>
      )}

      <section className="mt-12 bg-primary/5 p-6 rounded-3xl border border-primary/10">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="text-primary" size={20} />
          <h3 className="font-bold text-sm text-on-surface uppercase tracking-widest">Suporte ao Assinante</h3>
        </div>
        <p className="text-xs text-on-surface/60 leading-relaxed font-medium">
          Suas assinaturas são processadas de forma segura. Se tiver qualquer problema com o acesso ao conteúdo, entre em contato com o suporte.
        </p>
      </section>
    </div>
  );
};

const ScreenWallet = ({ onBack, isMaster }: { onBack: () => void, isMaster: boolean }) => {
  const [balance, setBalance] = useState('R$ 0,00');
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        if (isMaster) {
          const { data: payments, error } = await supabase
            .from('payments')
            .select('*, profiles:user_id(name, username, avatar)')
            .eq('creator_id', user.id)
            .eq('status', 'approved')
            .order('created_at', { ascending: false });

          if (error) throw error;

          if (payments) {
            const total = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
            setBalance(`R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
            
            const subs = payments
              .filter(p => p.description?.toLowerCase().includes('assinatura'))
              .map(p => ({
                id: p.id,
                name: p.profiles?.name || 'Usuário',
                username: p.profiles?.username || 'usuario',
                plan: p.description?.split(' - ')[0]?.replace(/assinatura/i, '').trim() || 'Plano',
                date: new Date(p.created_at).toLocaleDateString('pt-BR'),
                avatar: p.profiles?.avatar || `https://i.pravatar.cc/150?u=${p.user_id}`
              }));
            setSubscribers(subs);

            const sales = payments
              .filter(p => !p.description?.toLowerCase().includes('assinatura'))
              .map(p => ({
                id: p.id,
                name: p.profiles?.name || 'Usuário',
                username: p.profiles?.username || 'usuario',
                item: p.description || 'Conteúdo',
                price: `R$ ${p.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                date: new Date(p.created_at).toLocaleDateString('pt-BR'),
                avatar: p.profiles?.avatar || `https://i.pravatar.cc/150?u=${p.user_id}`
              }));
            setPurchases(sales);
          }
        } else {
          // Para assinantes, poderíamos mostrar histórico de gastos ou créditos
          setBalance('R$ 0,00');
        }
      } catch (err) {
        console.error('Erro ao carregar dados da carteira:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isMaster]);

  const creditOptions = [
    { id: '1', amount: 'R$ 20,00', credits: '20' },
    { id: '2', amount: 'R$ 50,00', credits: '55', badge: '+5 BÔNUS' },
    { id: '3', amount: 'R$ 100,00', credits: '120', badge: '+20 BÔNUS' },
    { id: '4', amount: 'R$ 200,00', credits: '250', badge: '+50 BÔNUS' },
  ];

  const handleAddCredits = (amount: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Simulação: Pagamento de ${amount} via Pix iniciado.`);
    }, 1500);
  };

  return (
    <div className="pt-20 pb-24 px-6 max-w-2xl mx-auto">
      <section className="mb-8 pt-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-1">Minha Carteira</h1>
        <p className="text-on-surface/60 text-sm font-medium">Gerencie seus ganhos e pagamentos.</p>
      </section>

      <div className="bg-white p-8 rounded-3xl border border-primary/5 shadow-sm mb-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <CreditCard size={120} />
        </div>
        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">
          {isMaster ? 'Faturamento' : 'Saldo Disponível'}
        </p>
        <h2 className="text-5xl font-black text-on-surface tracking-tighter">
          {loading ? '...' : balance}
        </h2>
        {!isMaster && (
          <div className="mt-6 flex justify-center gap-2">
            <div className="px-4 py-1.5 bg-primary/10 rounded-full flex items-center gap-2">
              <Crown size={14} className="text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Membro VIP</span>
            </div>
          </div>
        )}
      </div>

      {isMaster ? (
        <div className="space-y-8">
          <section className="space-y-4">
            <h3 className="font-bold text-lg text-on-surface px-1">Assinantes Recentes</h3>
            {subscribers.length > 0 ? (
              <div className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
                {subscribers.map((sub, index) => (
                  <div key={sub.id} className={`p-4 flex items-center justify-between ${index !== subscribers.length - 1 ? 'border-b border-primary/5' : ''}`}>
                    <div className="flex items-center gap-3">
                      <img src={sub?.avatar} alt={sub?.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold text-sm text-on-surface">{sub?.name}</p>
                        <p className="text-[10px] text-on-surface/60 font-medium">@{sub?.username} • {sub?.plan}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">Ativo</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface/60 px-1">{loading ? 'Carregando...' : 'Nenhum assinante ainda.'}</p>
            )}
          </section>

          <section className="space-y-4">
            <h3 className="font-bold text-lg text-on-surface px-1">Vendas de Conteúdo</h3>
            {purchases.length > 0 ? (
              <div className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
                {purchases.map((purchase, index) => (
                  <div key={purchase.id} className={`p-4 flex items-center justify-between ${index !== purchases.length - 1 ? 'border-b border-primary/5' : ''}`}>
                    <div className="flex items-center gap-3">
                      <img src={purchase?.avatar} alt={purchase?.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold text-sm text-on-surface">{purchase?.name}</p>
                        <p className="text-[10px] text-on-surface/60 font-medium">Comprou: {purchase?.item}</p>
                      </div>
                    </div>
                    <span className="font-black text-primary text-sm">{purchase.price}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface/60 px-1">{loading ? 'Carregando...' : 'Nenhuma venda ainda.'}</p>
            )}
          </section>
        </div>
      ) : (
        <>
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-bold text-lg text-on-surface">Adicionar Créditos</h3>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Melhor Valor</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {creditOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAddCredits(option.amount)}
                  disabled={loading}
                  className="bg-white p-5 rounded-2xl border border-primary/5 shadow-sm flex items-center justify-between hover:border-primary/30 transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center">
                      <PlusCircle size={24} className="text-primary" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-black text-on-surface text-lg leading-none">{option.credits} Créditos</h4>
                      {option.badge && (
                        <span className="text-[8px] font-black text-primary uppercase tracking-widest">{option.badge}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-black text-primary text-xl">{option.amount}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-12 bg-primary/5 p-6 rounded-3xl border border-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-primary" size={20} />
              <h3 className="font-bold text-sm text-on-surface uppercase tracking-widest">Segurança Garantida</h3>
            </div>
            <p className="text-xs text-on-surface/60 leading-relaxed font-medium">
              Todas as transações são processadas de forma segura via Pix. Seus dados financeiros nunca são armazenados em nossos servidores.
            </p>
          </section>
        </>
      )}
    </div>
  );
};

const MASTER_EMAIL = 'mayconrubemx@gmail.com';

const BottomNav = ({ active, onChange, isMaster, unreadCount }: { active: Screen, onChange: (s: Screen) => void, isMaster: boolean, unreadCount: number }) => (
  <nav className="fixed bottom-0 w-full flex justify-around items-center px-4 py-3 bg-white border-t border-primary/5 z-50">
    <button onClick={() => onChange('feed')} className={`flex flex-col items-center gap-1 transition-all ${active === 'feed' ? 'text-primary' : 'text-on-surface/40'}`}>
      <Home size={24} />
      <span className="text-[10px] font-bold">Início</span>
    </button>
    <button onClick={() => onChange(isMaster ? 'wallet' : 'subscriptions')} className={`flex flex-col items-center gap-1 transition-all ${(active === 'wallet' || active === 'subscriptions') ? 'text-primary' : 'text-on-surface/40'}`}>
      <CreditCard size={24} />
      <span className="text-[10px] font-bold">{isMaster ? 'Carteira' : 'Assinaturas'}</span>
    </button>
    
    {isMaster && (
      <button onClick={() => onChange('create-post')} className={`p-2 bg-primary text-white rounded-full shadow-lg shadow-primary/20 transition-transform active:scale-90 ${active === 'create-post' ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
        <PlusCircle size={28} />
      </button>
    )}

    <button onClick={() => onChange('activity')} className={`flex flex-col items-center gap-1 transition-all relative ${active === 'activity' ? 'text-primary' : 'text-on-surface/40'}`}>
      <div className="relative">
        {isMaster ? <Bell size={24} /> : <MessageCircle size={24} />}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>
      <span className="text-[10px] font-bold">{isMaster ? 'Atividade' : 'Chat'}</span>
    </button>
    <button onClick={() => onChange('profile')} className={`flex flex-col items-center gap-1 transition-all ${active === 'profile' ? 'text-primary' : 'text-on-surface/40'}`}>
      <User size={24} />
      <span className="text-[10px] font-bold">Perfil</span>
    </button>
  </nav>
);

// --- Components ---

import { Comment } from './types';

const FullScreenPostModal = ({ 
  post, 
  onClose, 
  onDelete, 
  onEdit, 
  currentUserId,
  onLike,
  onComment
}: { 
  post: Post | null, 
  onClose: () => void, 
  onDelete?: (id: string) => void, 
  onEdit?: (post: Post) => void,
  currentUserId?: string,
  onLike?: (id: string, isLiked: boolean) => void,
  onComment?: (id: string, content: string) => void
}) => {
  const isOwner = post?.creator.id === currentUserId;
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [newComment, setNewComment] = React.useState('');
  const [showComments, setShowComments] = React.useState(false);

  React.useEffect(() => {
    if (post && showComments) {
      const fetchComments = async () => {
        const { data } = await supabase
          .from('post_comments')
          .select('*, user:profiles(*)')
          .eq('post_id', post.id)
          .order('created_at', { ascending: true });
        if (data) setComments(data as any);
      };
      fetchComments();
    }
  }, [post?.id, showComments]);

  const handleSendComment = async () => {
    if (!newComment.trim() || !post || !onComment) return;
    onComment(post.id, newComment);
    
    // Optimistic update
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profile) {
        setComments(prev => [...prev, {
          id: Math.random().toString(),
          user: profile as any,
          content: newComment,
          created_at: new Date().toISOString()
        }]);
      }
    }
    setNewComment('');
  };

  return (
    <AnimatePresence>
      {post && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black flex flex-col md:flex-row items-center justify-center"
        >
          <div className="absolute top-6 right-6 flex items-center gap-4 z-[110]">
            {isOwner && onDelete && onEdit && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onEdit(post)}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Editar
                </button>
                <button 
                  onClick={() => {
                    onDelete(post.id);
                    onClose();
                  }}
                  className="bg-red-500/20 hover:bg-red-500/40 text-red-500 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Excluir
                </button>
              </div>
            )}
            <button 
              onClick={onClose}
              className="text-white/70 hover:text-white"
            >
              <X size={32} />
            </button>
          </div>
          
          <div className={`w-full h-full flex items-center justify-center p-4 transition-all ${showComments ? 'md:w-2/3' : 'w-full'}`}>
            {post.isVideo ? (
              <video 
                src={`${post.image}#t=0.001`} 
                className="max-w-full max-h-full rounded-lg shadow-2xl" 
                controls 
                autoPlay 
                referrerPolicy="no-referrer"
              />
            ) : (
              <img 
                src={post.image} 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
                referrerPolicy="no-referrer"
              />
            )}
          </div>

          {/* Comments Panel */}
          {showComments && (
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto w-full md:w-1/3 h-[70vh] md:h-full bg-white rounded-t-[2.5rem] md:rounded-none flex flex-col z-[105] shadow-2xl overflow-hidden"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 mb-1 md:hidden" />
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-black text-lg uppercase tracking-tight">Comentários</h3>
                <button onClick={() => setShowComments(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain no-scrollbar">
                {comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-30 py-10">
                    <MessageCircle size={48} className="mb-2" />
                    <p className="text-xs font-bold uppercase tracking-widest">Nenhum comentário ainda</p>
                  </div>
                ) : (
                  comments.map(c => (
                    <div key={c.id} className="flex gap-3 group">
                      <img src={c.user?.avatar} className="w-10 h-10 rounded-full object-cover border border-primary/5" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none">
                          <p className="text-xs font-black text-primary uppercase tracking-tight mb-0.5">{c.user?.name}</p>
                          <p className="text-sm text-on-surface/80 leading-relaxed">{c.content}</p>
                        </div>
                        <p className="text-[9px] font-bold text-on-surface/30 mt-1 ml-1 uppercase tracking-widest">
                          {new Date(c.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 border-t border-gray-100 bg-white pb-safe">
                <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 focus-within:border-primary/30 transition-colors">
                  <input 
                    type="text" 
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Adicione um comentário..."
                    className="flex-1 bg-transparent px-4 py-2.5 text-base outline-none font-medium"
                    onKeyDown={e => e.key === 'Enter' && handleSendComment()}
                  />
                  <button 
                    onClick={handleSendComment} 
                    disabled={!newComment.trim()}
                    className="bg-primary text-white font-black px-6 py-2 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 text-xs uppercase tracking-widest"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {!showComments && (
            <div className="absolute bottom-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
              <div className="flex items-center gap-3 mb-4">
                <img src={post.creator?.avatar} className="w-10 h-10 rounded-full object-cover border border-white/20" referrerPolicy="no-referrer" />
                <div>
                  <p className="font-bold text-sm">{post.creator?.name}</p>
                </div>
              </div>
              <p className="text-sm text-white/80 leading-relaxed mb-4">{post.caption}</p>
              
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => onLike && onLike(post.id, !!post.isLikedByMe)}
                  className="flex items-center gap-2 text-white hover:text-primary transition-colors"
                >
                  <Heart size={24} fill={post.isLikedByMe ? "currentColor" : "none"} className={post.isLikedByMe ? "text-primary" : ""} />
                  <span className="text-sm font-bold">{post.likesCount || 0}</span>
                </button>
                <button 
                  onClick={() => setShowComments(true)}
                  className="flex items-center gap-2 text-white hover:text-primary transition-colors"
                >
                  <MessageCircle size={24} />
                  <span className="text-sm font-bold">{post.commentsCount || 0}</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CropModal = ({ image, onCropComplete, onClose, aspect = 1 }: { image: string, onCropComplete: (croppedImage: Blob) => void, onClose: () => void, aspect?: number }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (crop: any) => setCrop(crop);
  const onZoomChange = (zoom: number) => setZoom(zoom);
  const onCropCompleteInternal = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('No 2d context');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const handleDone = async () => {
    try {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedBlob);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col">
      <div className="flex justify-between items-center p-4 bg-white z-10">
        <button onClick={onClose} className="text-on-surface/60 font-bold uppercase tracking-widest text-xs">Cancelar</button>
        <h3 className="font-bold uppercase tracking-widest text-xs">Ajustar Imagem</h3>
        <button onClick={handleDone} className="text-primary font-bold uppercase tracking-widest text-xs">Concluir</button>
      </div>
      <div className="relative flex-1 bg-on-surface/10">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteInternal}
          onZoomChange={onZoomChange}
        />
      </div>
      <div className="p-6 bg-white">
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>
    </div>
  );
};

const StoryViewer = ({ stories, initialIndex, onClose, onDelete }: { stories: any[], initialIndex: number, onClose: () => void, onDelete: (id: string) => void }) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const story = stories[currentIndex];

  React.useEffect(() => {
    if (!story) return;
    const timer = setTimeout(() => {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onClose();
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, stories.length, story, onClose]);

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
      <div className="absolute top-0 w-full p-4 flex gap-1 z-[210]">
        {stories.map((_, i) => (
          <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: i === currentIndex ? '100%' : i < currentIndex ? '100%' : '0%' }}
              transition={{ duration: i === currentIndex ? 5 : 0, ease: 'linear' }}
              className="h-full bg-white"
            />
          </div>
        ))}
      </div>
      
      <div className="absolute top-8 left-0 right-0 p-4 flex justify-between items-center z-[210]">
        <div className="flex items-center gap-3">
          <img src={story.image} className="w-10 h-10 rounded-full object-cover border border-white/20" referrerPolicy="no-referrer" />
          <span className="text-white font-bold text-sm">{story.creator_name || 'Você'}</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (confirm('Excluir este story?')) {
                onDelete(story.id);
                if (stories.length === 1) onClose();
                else if (currentIndex === stories.length - 1) setCurrentIndex(prev => prev - 1);
              }
            }}
            className="text-white/70 hover:text-red-500 transition-colors"
          >
            Excluir
          </button>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X size={32} />
          </button>
        </div>
      </div>

      <div className="w-full h-full flex items-center justify-center">
        <img src={story.image} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
      </div>
    </div>
  );
};

const EditPostModal = ({ post, onSave, onClose }: { post: Post, onSave: (id: string, caption: string, isLocked: boolean) => void, onClose: () => void }) => {
  const [caption, setCaption] = React.useState(post.caption);
  const [isLocked, setIsLocked] = React.useState(!!post.isLocked);

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-primary/5 flex justify-between items-center">
          <h3 className="font-black uppercase tracking-widest text-xs">Editar Postagem</h3>
          <button onClick={onClose} className="text-on-surface/40"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="aspect-square rounded-2xl overflow-hidden bg-on-surface/5">
            <img src={post.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-2">Legenda</label>
            <textarea 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-4 bg-on-surface/5 rounded-2xl text-sm focus:ring-2 focus:ring-primary outline-none min-h-[100px]"
              placeholder="Escreva algo..."
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-on-surface/5 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isLocked ? 'bg-primary/10 text-primary' : 'bg-on-surface/5 text-on-surface/40'}`}>
                <Lock size={18} />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-tight">Conteúdo Pago</h4>
                <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">Apenas assinantes</p>
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

          <button 
            onClick={() => onSave(post.id, caption, isLocked)}
            className="w-full py-4 premium-gradient text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs"
          >
            Salvar Alterações
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Screens ---

const ForwardModal = ({ 
  post, 
  onClose, 
  onForward 
}: { 
  post: Post, 
  onClose: () => void, 
  onForward: (recipient: Creator) => void 
}) => {
  const [contacts, setContacts] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  React.useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch all profiles that the user has interacted with or follows
        const { data: messages } = await supabase
          .from('messages')
          .select('sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

        const contactMap = new Map<string, Creator>();
        messages?.forEach((m: any) => {
          const other = m.sender_id === user.id ? m.receiver : m.sender;
          if (other) contactMap.set(other.id, other as any);
        });

        // Also add the Master if not already there
        const { data: masterProfile } = await supabase.from('profiles').select('*').eq('email', MASTER_EMAIL).single();
        if (masterProfile && masterProfile.id !== user.id) {
          contactMap.set(masterProfile.id, masterProfile as any);
        }

        setContacts(Array.from(contactMap.values()));
      } catch (err) {
        console.error('Error fetching contacts for forward:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) || 
    c.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col max-h-[80vh] animate-in slide-in-from-bottom-10 duration-300 shadow-2xl">
        <div className="p-6 border-b border-primary/5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black tracking-tight text-on-surface">Encaminhar para...</h3>
            <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">Selecione um contato</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-primary/5 rounded-full transition-colors">
            <X size={20} className="text-on-surface/40" />
          </button>
        </div>

        <div className="p-4 border-b border-primary/5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/40" size={16} />
            <input 
              type="text" 
              placeholder="Buscar contatos..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-primary/5 border-none rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-2 space-y-1">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filteredContacts.length > 0 ? (
            filteredContacts.map(contact => (
              <button 
                key={contact.id}
                onClick={() => onForward(contact)}
                className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-primary/5 transition-all text-left group"
              >
                <img src={contact.avatar} className="w-12 h-12 rounded-full object-cover border border-primary/10 p-0.5" referrerPolicy="no-referrer" />
                <div className="flex-grow">
                  <h4 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{contact.name}</h4>
                  <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-tight">@{contact.username}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all">
                  <Send size={14} />
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-10 opacity-30">
              <User size={40} className="mx-auto mb-2" />
              <p className="text-[10px] font-black uppercase tracking-widest">Nenhum contato encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ScreenFeed = ({ 
  posts, 
  stories, 
  onStoryUpload, 
  creator, 
  onDeletePost, 
  onUpdatePost,
  onDeleteStory,
  onSubscribe,
  isMaster,
  onLikePost,
  onCommentPost,
  onViewProfile,
  onForwardPost
}: { 
  posts: Post[], 
  stories: any[], 
  onStoryUpload: (file: File) => void, 
  creator: Creator,
  onDeletePost: (id: string) => void,
  onUpdatePost: (id: string, caption: string, isLocked: boolean) => void,
  onDeleteStory: (id: string) => void,
  onSubscribe: (creator: Creator, post?: Post) => void,
  isMaster: boolean,
  onLikePost?: (id: string, isLiked: boolean) => void,
  onCommentPost?: (id: string, content: string) => void,
  onViewProfile?: (creatorId: string) => void,
  onForwardPost?: (post: Post) => void
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
  const [forwardingPost, setForwardingPost] = React.useState<Post | null>(null);
  const [editingPost, setEditingPost] = React.useState<Post | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = React.useState<number | null>(null);
  const [showPostMenu, setShowPostMenu] = React.useState<string | null>(null);

  return (
    <div className="pt-20 pb-24 max-w-2xl mx-auto">
      {/* Modals */}
      <FullScreenPostModal 
        post={selectedPost} 
        onClose={() => setSelectedPost(null)} 
        onDelete={onDeletePost}
        onEdit={setEditingPost}
        currentUserId={creator.id}
        onLike={onLikePost}
        onComment={onCommentPost}
      />
      {editingPost && <EditPostModal post={editingPost} onSave={onUpdatePost} onClose={() => setEditingPost(null)} />}
      {activeStoryIndex !== null && (
        <StoryViewer 
          stories={stories} 
          initialIndex={activeStoryIndex} 
          onClose={() => setActiveStoryIndex(null)} 
          onDelete={onDeleteStory}
        />
      )}

      {/* Stories */}
      {(isMaster || stories.length > 0) && (
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
          {isMaster && (
            <div 
              className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="relative p-[3px] rounded-full story-ring">
                <div className="p-0.5 bg-white rounded-full">
                  <img src={creator?.avatar} className="w-16 h-16 rounded-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 border-2 border-white">
                  <PlusCircle size={14} />
                </div>
              </div>
              <span className="text-[10px] font-bold text-on-surface">Você</span>
            </div>
          )}
          {stories.map((story, index) => (
            <div 
              key={story.id} 
              className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer"
              onClick={() => setActiveStoryIndex(index)}
            >
              <div className="p-[3px] rounded-full story-ring">
                <div className="p-0.5 bg-white rounded-full">
                  <img src={story.image} className="w-16 h-16 rounded-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-on-surface/60">{story.creator_name || 'Você'}</span>
            </div>
          ))}
        </div>
      )}

    {/* Posts */}
    <div className="space-y-4 py-4">
      {posts.length > 0 ? (
        posts.map(post => {
          const isOwner = post.creator.id === creator.id;
          
          return (
            <article key={post.id} className="bg-white shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewProfile && onViewProfile(post.creator?.id || '')}>
                <img src={post.creator?.avatar} className="w-10 h-10 rounded-full object-cover border border-primary/10" referrerPolicy="no-referrer" />
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-sm hover:text-primary transition-colors">{post.creator?.name}</p>
                    <CheckCircle2 size={12} className="text-primary fill-primary/10" />
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowPostMenu(showPostMenu === post.id ? null : post.id)}
                  className="text-on-surface/40 hover:text-primary transition-colors"
                >
                  <MoreHorizontal size={20} />
                </button>
                
                {showPostMenu === post.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-primary/5 z-50 overflow-hidden">
                    {isOwner ? (
                      <>
                        <button 
                          onClick={() => {
                            setEditingPost(post);
                            setShowPostMenu(null);
                          }}
                          className="w-full px-4 py-3 text-left text-sm font-bold hover:bg-primary/5 flex items-center gap-2"
                        >
                          Editar Postagem
                        </button>
                        <button 
                          onClick={() => {
                            onDeletePost(post.id);
                            setShowPostMenu(null);
                          }}
                          className="w-full px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"
                        >
                          Excluir Postagem
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => {
                          alert('Denunciado com sucesso!');
                          setShowPostMenu(null);
                        }}
                        className="w-full px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50"
                      >
                        Denunciar
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          
          <div 
            className="aspect-square relative overflow-hidden bg-on-surface/5 cursor-pointer"
            onClick={() => post.hasAccess && setSelectedPost(post)}
          >
            {post.isVideo ? (
              <video 
                src={`${post.image}#t=0.001`} 
                className={`w-full h-full object-cover transition-all duration-700 ${!post.hasAccess ? 'blur-[60px] scale-110 opacity-50' : 'hover:scale-105'}`} 
                preload="metadata"
                playsInline
                muted
              />
            ) : (
              <img 
                src={post.image} 
                className={`w-full h-full object-cover transition-all duration-700 ${!post.hasAccess ? 'blur-[60px] scale-110 opacity-50' : 'hover:scale-105'}`} 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1633078654544-61b3455b9161?q=80&w=400&auto=format&fit=crop'; // Fallback image
                }}
              />
            )}
            {!post.hasAccess && (
              <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/20">
                <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] flex flex-col items-center text-center shadow-2xl border border-white/20 w-full max-w-[280px]">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary/10">
                    <Lock className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-black mb-2 text-white drop-shadow-md">Conteúdo VIP</h3>
                  <p className="text-xs text-white/80 mb-8 font-bold uppercase tracking-widest leading-relaxed">
                    Desbloqueie este post exclusivo do criador.
                  </p>
                  <div className="w-full space-y-3">
                    <button 
                      onClick={() => onSubscribe(post.creator)}
                      className="w-full py-4 px-8 premium-gradient text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all text-[10px] uppercase tracking-[0.2em]"
                    >
                      ASSINAR MENSAL
                    </button>
                    <button 
                      onClick={() => onSubscribe(post.creator, post)}
                      className="w-full py-4 px-8 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl border border-white/20 active:scale-95 transition-all text-[10px] uppercase tracking-[0.2em]"
                    >
                      COMPRAR POST POR {post.price || 'R$ 15,00'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {post.isLocked && post.hasAccess && (
              <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md p-2 rounded-full shadow-lg z-10">
                <Lock className="text-white" size={16} />
              </div>
            )}
            {post.isVideo && post.hasAccess && (
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
                <button onClick={() => onLikePost && onLikePost(post.id, !!post.isLikedByMe)} className="flex items-center gap-2">
                  <Heart className={post.isLikedByMe ? "text-primary" : "text-on-surface"} fill={post.isLikedByMe ? "currentColor" : "none"} />
                  <span className="text-sm font-bold">{post.likesCount || 0}</span>
                </button>
                <button onClick={() => post.hasAccess && setSelectedPost(post)} className="flex items-center gap-2">
                  <MessageCircle className="text-on-surface" />
                  <span className="text-sm font-bold">{post.commentsCount || 0}</span>
                </button>
                <Send 
                  className="text-on-surface cursor-pointer hover:text-primary transition-colors" 
                  onClick={() => onForwardPost && onForwardPost(post)}
                />
              </div>
              <Bookmark className="text-on-surface cursor-pointer" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold">{post.likesCount || 0} curtidas</p>
              <p className="text-sm text-on-surface/80 leading-relaxed">
                <span className="font-bold cursor-pointer hover:text-primary transition-colors" onClick={() => onViewProfile && onViewProfile(post.creator.id)}>{post.creator.name}</span> {post.caption}
              </p>
            </div>
          </div>
        </article>
      );
    })
  ) : (
    <div className="text-center py-20 px-6">
      <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
        <Camera className="text-primary/20" size={40} />
      </div>
      <h3 className="text-lg font-black mb-2">Nenhuma postagem</h3>
      <p className="text-xs text-on-surface/40 font-bold uppercase tracking-widest leading-relaxed">
        Ainda não há conteúdo disponível no feed.
      </p>
    </div>
  )}
</div>
</div>
);
};

const WelcomeAudioPlayer = ({ audioUrl }: { audioUrl: string }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [isBuffering, setIsBuffering] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [audioUrl]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsBuffering(true);
        if (audioRef.current.readyState < 2) {
          audioRef.current.load();
        }
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
        setIsBuffering(false);
      }
    } catch (err) {
      console.error('Welcome audio playback failed:', err);
      setIsPlaying(false);
      setIsBuffering(false);
      
      try {
        if (audioRef.current) {
          audioRef.current.load();
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (retryErr) {
        console.error('Welcome retry failed:', retryErr);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(current);
      if (dur > 0) {
        setProgress((current / dur) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8 bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
      <audio 
        ref={audioRef} 
        src={audioUrl} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsBuffering(false);
          setIsPlaying(true);
        }}
        preload="auto"
        playsInline
      />
      <button 
        onClick={togglePlay}
        disabled={isBuffering && !isPlaying}
        className="w-12 h-12 flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center shadow-md shadow-primary/20 active:scale-95 transition-all disabled:opacity-70"
      >
        {isBuffering && !isPlaying ? (
          <RefreshCw size={20} className="animate-spin" />
        ) : isPlaying ? (
          <Pause size={20} fill="currentColor" />
        ) : (
          <Play size={20} fill="currentColor" className="ml-1" />
        )}
      </button>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Boas-vindas</span>
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary/60">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const ScreenProfile = ({ 
  onEdit, 
  creator, 
  onLogout, 
  posts,
  onDeletePost,
  onUpdatePost,
  onSubscribe,
  stories,
  onDeleteStory,
  isMaster,
  onLikePost,
  onCommentPost,
  onMessage
}: { 
  onEdit: () => void, 
  creator: Creator, 
  onLogout: () => void, 
  posts: Post[],
  onDeletePost: (id: string) => void,
  onUpdatePost: (id: string, caption: string, isLocked: boolean) => void,
  onSubscribe: (post?: Post) => void,
  stories: any[],
  onDeleteStory: (id: string) => void,
  isMaster: boolean,
  onLikePost?: (id: string, isLiked: boolean) => void,
  onCommentPost?: (id: string, content: string) => void,
  onMessage?: (creator: Creator) => void
}) => {
  const [activeTab, setActiveTab] = React.useState<'all' | 'exclusive'>('all');
  const myPosts = posts.filter(p => p.creator?.id === creator?.id).filter(p => activeTab === 'all' ? true : p.isLocked);
  const myStories = stories.filter(s => s.creator_id === creator?.id);
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
  const [editingPost, setEditingPost] = React.useState<Post | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = React.useState<number | null>(null);
  
  return (
    <div className="pt-0 pb-24">
      {/* Modals */}
      <FullScreenPostModal 
        post={selectedPost} 
        onClose={() => setSelectedPost(null)} 
        onDelete={onDeletePost}
        onEdit={setEditingPost}
        currentUserId={creator?.id}
        onLike={onLikePost}
        onComment={onCommentPost}
      />
      {editingPost && <EditPostModal post={editingPost} onSave={onUpdatePost} onClose={() => setEditingPost(null)} />}
      {activeStoryIndex !== null && (
        <StoryViewer 
          stories={myStories} 
          initialIndex={activeStoryIndex} 
          onClose={() => setActiveStoryIndex(null)} 
          onDelete={onDeleteStory}
        />
      )}
      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full relative overflow-hidden bg-on-surface/5">
        <img 
          src={creator?.cover_image || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200'} 
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
          <div 
            className="relative w-40 h-40 md:w-48 md:h-48 rounded-full p-[4px] story-ring bg-background shadow-2xl cursor-pointer"
            onClick={() => myStories.length > 0 && setActiveStoryIndex(0)}
          >
            <img src={creator?.avatar} className="w-full h-full object-cover rounded-full border-4 border-white" referrerPolicy="no-referrer" />
            {myStories.length > 0 && (
              <div className="absolute inset-0 rounded-full border-4 border-primary animate-pulse pointer-events-none"></div>
            )}
          </div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">{creator?.name}</h1>
        <p className="text-sm text-primary font-bold mb-2">{creator?.bio}</p>

        {creator.welcome_audio && (
          <WelcomeAudioPlayer audioUrl={creator.welcome_audio} />
        )}

        {creator?.services_bio && (
          <div className="bg-white p-6 rounded-3xl shadow-sm max-w-md mx-auto border border-primary/5 mb-8 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 p-2 rounded-xl">
                <Star size={20} className="text-primary" fill="currentColor" />
              </div>
              <h4 className="font-black text-xs uppercase tracking-widest text-primary">Serviços & Preços</h4>
            </div>
            <FormattedText 
              text={creator?.services_bio} 
              className="text-sm text-black leading-relaxed whitespace-pre-wrap"
            />
          </div>
        )}

        {isMaster && (
          <div className="flex justify-center items-center gap-4 sm:gap-10 mb-10 py-6 px-4 sm:px-8 bg-white rounded-3xl shadow-sm max-w-md mx-auto border border-primary/5 overflow-hidden">
            <div className="text-center min-w-[60px]">
              <span className="block text-xl font-bold">{myPosts.length}</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40">Posts</span>
            </div>
            <div className="w-px h-8 bg-primary/10 flex-shrink-0"></div>
            <div className="text-center min-w-[60px]">
              <span className="block text-xl font-bold">{creator.stats?.followers || '0'}</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40">Seguidores</span>
            </div>
            <div className="w-px h-8 bg-primary/10 flex-shrink-0"></div>
            <div className="text-center min-w-[60px]">
              <span className="block text-xl font-bold">{creator.stats?.likes || '0'}</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40">Curtidas</span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-3 mb-10 max-w-md mx-auto">
          {isMaster ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={onEdit} className="flex-1 py-4 premium-gradient text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs">
                Editar Perfil
              </button>
              <button 
                onClick={() => {
                  const url = `${window.location.origin}/?u=${creator.username}`;
                  navigator.clipboard.writeText(url);
                  alert('Link do perfil copiado!');
                }}
                className="flex-1 py-4 bg-primary/5 text-primary font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                <Share2 size={18} />
                Compartilhar
              </button>
            </div>
          ) : (
            <button onClick={onEdit} className="w-full py-4 bg-primary/5 text-primary font-bold rounded-2xl shadow-sm active:scale-95 transition-all uppercase tracking-widest text-xs">
              Editar Perfil
            </button>
          )}
        </div>
        
        <button 
          onClick={onLogout}
          className="text-red-500 font-bold text-xs uppercase tracking-widest hover:underline mb-12"
        >
          Sair da Conta
        </button>
      </section>

      {isMaster && (
        <div className="sticky top-16 bg-white/80 backdrop-blur-md z-40 border-b border-primary/5 mb-6">
          <div className="max-w-4xl mx-auto px-6 flex justify-around">
            <button 
              onClick={() => setActiveTab('all')}
              className={`py-4 border-b-2 font-bold text-xs uppercase tracking-widest ${activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-on-surface/40'}`}
            >
              Criações
            </button>
            <button 
              onClick={() => setActiveTab('exclusive')}
              className={`py-4 border-b-2 font-bold text-xs uppercase tracking-widest ${activeTab === 'exclusive' ? 'border-primary text-primary' : 'border-transparent text-on-surface/40'}`}
            >
              Exclusivos
            </button>
            <button className="py-4 border-b-2 border-transparent text-on-surface/40 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
              Pro <Lock size={12} fill="currentColor" />
            </button>
          </div>
        </div>
      )}

      <section className="max-w-5xl mx-auto px-4">
        {isMaster ? (
          myPosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {myPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="relative aspect-square overflow-hidden rounded-2xl bg-on-surface/5 shadow-sm group cursor-pointer"
                  onClick={() => post.hasAccess && setSelectedPost(post)}
                >
                  {post.isVideo ? (
                    <video 
                      src={`${post.image}#t=0.001`} 
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!post.hasAccess ? 'blur-2xl scale-125 opacity-40' : ''}`} 
                      preload="metadata"
                      playsInline
                      muted
                    />
                  ) : (
                    <img 
                      src={post.image} 
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!post.hasAccess ? 'blur-2xl scale-125 opacity-40' : ''}`} 
                      referrerPolicy="no-referrer" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1633078654544-61b3455b9161?q=80&w=400&auto=format&fit=crop';
                      }}
                    />
                  )}
                  {!post.hasAccess && (
                    <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-white p-2 text-center">
                      <Lock size={20} fill="white" className="drop-shadow-lg mb-1" />
                      <span className="text-[8px] font-black uppercase tracking-widest drop-shadow-md mb-2">VIP</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSubscribe(post);
                        }}
                        className="px-3 py-1.5 bg-primary text-white text-[7px] font-black uppercase tracking-widest rounded-lg shadow-lg active:scale-95 transition-all"
                      >
                        Comprar Post
                      </button>
                    </div>
                  )}
                  {post.isLocked && post.hasAccess && (
                    <div className="absolute top-2 right-2 bg-primary/90 backdrop-blur-md p-1.5 rounded-full shadow-lg z-10">
                      <Lock className="text-white" size={14} />
                    </div>
                  )}
                  {post.isVideo && post.hasAccess && (
                    <div className="absolute top-3 left-3 z-10 text-white">
                      <Play size={18} fill="white" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-full text-white flex items-center gap-1 shadow-lg">
                      <Heart size={12} fill="white" />
                      <span className="text-[10px] font-black">{post.likesCount || 0}</span>
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
          )
        ) : (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="text-primary" size={32} />
            </div>
            <h3 className="text-lg font-black mb-2">Conta de Assinante</h3>
            <p className="text-xs text-on-surface/50 font-bold uppercase tracking-widest leading-relaxed">
              Você está logado como assinante.<br/>Aproveite o conteúdo exclusivo do Master!
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

const ScreenPublicProfile = ({ 
  creator, 
  posts, 
  onSubscribe, 
  stories, 
  onLikePost, 
  onCommentPost,
  onMessage,
  isLoggedIn
}: { 
  creator: Creator, 
  posts: Post[], 
  onSubscribe: (post?: Post) => void, 
  stories: any[], 
  onLikePost?: (id: string, isLiked: boolean) => void, 
  onCommentPost?: (id: string, content: string) => void,
  onMessage?: (creator: Creator) => void,
  isLoggedIn: boolean
}) => {
  const [activeTab, setActiveTab] = React.useState<'all' | 'exclusive'>('all');
  const myPosts = posts.filter(p => p.creator.id === creator.id).filter(p => activeTab === 'all' ? true : p.isLocked);
  const myStories = stories.filter(s => s.creator_id === creator.id);
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = React.useState<number | null>(null);
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [followerCount, setFollowerCount] = React.useState(Number(creator.stats?.followers || 0));
  const [likesCount, setLikesCount] = React.useState(Number(creator.stats?.likes || 0));

  React.useEffect(() => {
    const fetchFollowData = async () => {
      if (!isLoggedIn) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Check if following
      const { data } = await supabase.from('follows').select('id').eq('follower_id', user.id).eq('following_id', creator.id).single();
      if (data) setIsFollowing(true);

      // Fetch real follower count
      const { count: followers } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', creator.id);
      if (followers !== null) setFollowerCount(followers);

      // Fetch real likes count
      const { data: creatorPosts } = await supabase
        .from('posts')
        .select('id, post_likes(count)')
        .eq('creator_id', creator?.id);
      
      const totalLikes = creatorPosts?.reduce((acc, post: any) => acc + (post.post_likes?.[0]?.count || 0), 0) || 0;
      setLikesCount(totalLikes);
    };
    fetchFollowData();
  }, [creator?.id, isLoggedIn]);

  const handleFollow = async () => {
    if (!isLoggedIn) {
      alert('Faça login para seguir!');
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (isFollowing) {
      await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', creator?.id);
      setIsFollowing(false);
      setFollowerCount(prev => Math.max(0, prev - 1));
    } else {
      await supabase.from('follows').insert({ follower_id: user.id, following_id: creator?.id });
      setIsFollowing(true);
      setFollowerCount(prev => prev + 1);
    }
  };
  
  return (
    <div className="pt-0 pb-24">
      {/* Full Screen Modal */}
      <FullScreenPostModal 
        post={selectedPost} 
        onClose={() => setSelectedPost(null)} 
        onLike={onLikePost}
        onComment={onCommentPost}
      />
      {activeStoryIndex !== null && (
        <StoryViewer 
          stories={myStories} 
          initialIndex={activeStoryIndex} 
          onClose={() => setActiveStoryIndex(null)} 
          onDelete={() => {}} // Can't delete other people's stories
        />
      )}

      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full relative overflow-hidden bg-on-surface/5">
        <img 
          src={creator?.cover_image || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200'} 
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
          <div 
            className="relative w-40 h-40 md:w-48 md:h-48 rounded-full p-[4px] story-ring bg-background shadow-2xl cursor-pointer"
            onClick={() => myStories.length > 0 && setActiveStoryIndex(0)}
          >
            <img src={creator?.avatar} className="w-full h-full object-cover rounded-full border-4 border-white" referrerPolicy="no-referrer" />
            {myStories.length > 0 && (
              <div className="absolute inset-0 rounded-full border-4 border-primary animate-pulse pointer-events-none"></div>
            )}
          </div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">{creator?.name}</h1>
        <p className="text-sm text-primary font-bold mb-2">{creator?.bio}</p>

        {creator.welcome_audio && (
          <WelcomeAudioPlayer audioUrl={creator.welcome_audio} />
        )}

        {creator?.services_bio && (
          <div className="bg-white p-6 rounded-3xl shadow-sm max-w-md mx-auto border border-primary/5 mb-8 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 p-2 rounded-xl">
                <Star size={20} className="text-primary" fill="currentColor" />
              </div>
              <h4 className="font-black text-xs uppercase tracking-widest text-primary">Serviços & Preços</h4>
            </div>
            <FormattedText 
              text={creator?.services_bio} 
              className="text-sm text-black leading-relaxed whitespace-pre-wrap"
            />
          </div>
        )}

        <div className="flex justify-center items-center gap-4 sm:gap-10 mb-10 py-6 px-4 sm:px-8 bg-white rounded-3xl shadow-sm max-w-md mx-auto border border-primary/5 overflow-hidden">
          <div className="text-center min-w-[60px]">
            <span className="block text-xl font-bold">{myPosts.length}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40">Posts</span>
          </div>
          <div className="w-px h-8 bg-primary/10 flex-shrink-0"></div>
          <div className="text-center min-w-[60px]">
            <span className="block text-xl font-bold">{followerCount}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40">Seguidores</span>
          </div>
          <div className="w-px h-8 bg-primary/10 flex-shrink-0"></div>
          <div className="text-center min-w-[60px]">
            <span className="block text-xl font-bold">{likesCount}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40">Curtidas</span>
          </div>
        </div>

        <div className="max-w-md mx-auto space-y-3 mb-12">
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button 
                onClick={onSubscribe}
                className="flex-[2] py-4 premium-gradient text-white font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <Crown size={18} fill="white" />
                Assinar VIP
              </button>
              <button 
                onClick={handleFollow}
                className={`flex-1 py-4 font-bold rounded-2xl transition-all uppercase tracking-widest text-[10px] border ${
                  isFollowing 
                  ? 'bg-on-surface/5 border-on-surface/10 text-on-surface/60' 
                  : 'bg-white border-primary/20 text-primary'
                }`}
              >
                {isFollowing ? 'Seguindo' : 'Seguir'}
              </button>
            </div>
            
            {onMessage && (
              <button 
                onClick={() => onMessage(creator)}
                className="w-full py-4 bg-white border border-primary/20 text-primary font-black rounded-2xl shadow-sm active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Enviar Mensagem
              </button>
            )}
          </div>
          <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">
            Acesso imediato a todo o conteúdo exclusivo
          </p>
        </div>
      </section>

      <div className="sticky top-16 bg-white/80 backdrop-blur-md z-40 border-b border-primary/5 mb-6">
        <div className="max-w-4xl mx-auto px-6 flex justify-around">
          <button 
            onClick={() => setActiveTab('all')}
            className={`py-4 border-b-2 font-bold text-xs uppercase tracking-widest ${activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-on-surface/40'}`}
          >
            Criações
          </button>
          <button 
            onClick={() => setActiveTab('exclusive')}
            className={`py-4 border-b-2 font-bold text-xs uppercase tracking-widest ${activeTab === 'exclusive' ? 'border-primary text-primary' : 'border-transparent text-on-surface/40'}`}
          >
            Exclusivos
          </button>
        </div>
      </div>

      <section className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-2">
          {myPosts.map((post) => (
            <div 
              key={post.id} 
              className="relative aspect-square overflow-hidden rounded-2xl bg-on-surface/5 shadow-sm group cursor-pointer"
              onClick={() => {
                if (!post.hasAccess) onSubscribe(post);
                else setSelectedPost(post);
              }}
            >
              {post.isVideo ? (
                <video 
                  src={`${post.image}#t=0.001`} 
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!post.hasAccess ? 'blur-2xl scale-125 opacity-40' : ''}`} 
                  preload="metadata"
                  playsInline
                  muted
                />
              ) : (
                <img 
                  src={post.image} 
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!post.hasAccess ? 'blur-2xl scale-125 opacity-40' : ''}`} 
                  referrerPolicy="no-referrer" 
                />
              )}
              {!post.hasAccess && (
                <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-white p-2 text-center">
                  <Lock size={20} fill="white" className="drop-shadow-lg mb-1" />
                  <span className="text-[8px] font-black uppercase tracking-widest drop-shadow-md mb-2">VIP</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSubscribe(post);
                    }}
                    className="px-3 py-1.5 bg-primary text-white text-[7px] font-black uppercase tracking-widest rounded-lg shadow-lg active:scale-95 transition-all"
                  >
                    Comprar Post
                  </button>
                </div>
              )}
              {post.isLocked && post.hasAccess && (
                <div className="absolute top-2 right-2 bg-primary/90 backdrop-blur-md p-1.5 rounded-full shadow-lg z-10">
                  <Lock className="text-white" size={14} />
                </div>
              )}
              <div className="absolute top-3 right-3 z-10">
                <div className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-full text-white flex items-center gap-1 shadow-lg">
                  <Heart size={12} fill="white" />
                  <span className="text-[10px] font-black">{post.likesCount || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return '';
  if (diffInSeconds < 3600) return `Há ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `Há ${Math.floor(diffInSeconds / 3600)} h`;
  if (diffInSeconds < 604800) return `Há ${Math.floor(diffInSeconds / 86400)} d`;
  return date.toLocaleDateString('pt-BR');
};

const ScreenActivity = ({ notifications, onRefresh }: { notifications: Notification[], onRefresh: () => void }) => {
  const groupedNotifications = notifications.reduce((acc: any, notif) => {
    const date = new Date(notif.created_at || Date.now()).toLocaleDateString('pt-BR');
    const today = new Date().toLocaleDateString('pt-BR');
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('pt-BR');
    
    let label = date;
    if (date === today) label = 'Hoje';
    else if (date === yesterday) label = 'Ontem';
    
    if (!acc[label]) acc[label] = [];
    acc[label].push(notif);
    return acc;
  }, {});

  return (
    <div className="pt-20 pb-24 px-6 max-w-2xl mx-auto">
      <section className="mb-8 pt-8 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-1">Atividade</h2>
          <p className="text-on-surface/60 text-sm font-medium">Sua jornada criativa em tempo real.</p>
        </div>
        <button 
          onClick={onRefresh}
          className="p-3 bg-primary/10 rounded-full text-primary hover:bg-primary/20 transition-colors active:scale-95"
          title="Atualizar"
        >
          <RefreshCw size={20} />
        </button>
      </section>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
          <div className="w-20 h-20 bg-on-surface/5 rounded-full flex items-center justify-center mb-4">
            <Bell size={32} />
          </div>
          <p className="text-sm font-bold uppercase tracking-widest">Nenhuma atividade ainda</p>
          <p className="text-xs mt-2">Suas interações e vendas aparecerão aqui.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedNotifications).map(([label, items]: [string, any]) => (
            <div key={label}>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface/30 mb-4">{label}</h3>
              <div className="space-y-3">
                {items.map((notif: Notification) => (
                  <div key={notif.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-primary/5">
                    <div className="relative">
                      <img src={notif.user?.avatar} className="w-12 h-12 rounded-full object-cover border border-primary/10" referrerPolicy="no-referrer" />
                      {notif.user?.isVerified && (
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
                        <span className="font-bold">{notif.user?.name}</span> {notif.content}
                      </p>
                      <span className="text-[10px] text-on-surface/40 mt-0.5 block font-bold uppercase tracking-tighter">
                        {notif.created_at ? formatRelativeTime(notif.created_at) : notif.time}
                      </span>
                    </div>
                    {notif.thumbnail && (
                      <img src={notif.thumbnail} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AudioPlayer = ({ src, isMe }: { src: string, isMe: boolean }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setIsBuffering(false);
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [src]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsBuffering(true);
        
        // iOS Surgical Fix: Ensure the element is "warmed up"
        if (audioRef.current.readyState < 2) {
          audioRef.current.load();
        }
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
        setIsBuffering(false);
      }
    } catch (err) {
      console.error('Audio playback failed:', err);
      setIsPlaying(false);
      setIsBuffering(false);
      
      // Secondary attempt for iOS
      try {
        if (audioRef.current) {
          audioRef.current.load();
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (retryErr) {
        console.error('Retry failed:', retryErr);
      }
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onCanPlay = () => {
    setIsBuffering(false);
  };

  const onWaiting = () => {
    setIsBuffering(true);
  };

  const onPlaying = () => {
    setIsBuffering(false);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <div className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl w-full max-w-[260px] sm:max-w-[320px] ${isMe ? 'bg-white/20' : 'bg-primary/10'} backdrop-blur-sm shadow-sm`}>
      <audio 
        ref={audioRef} 
        src={src} 
        onLoadedMetadata={onLoadedMetadata} 
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        onCanPlay={onCanPlay}
        onWaiting={onWaiting}
        onPlaying={onPlaying}
        preload="auto"
        playsInline
      />
      
      <button 
        onClick={togglePlay}
        disabled={isBuffering && !isPlaying}
        className={`w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center rounded-full transition-all active:scale-90 shadow-sm ${
          isMe ? 'bg-white text-primary' : 'bg-primary text-white'
        } ${isBuffering && !isPlaying ? 'opacity-70' : ''}`}
      >
        {isBuffering && !isPlaying ? (
          <RefreshCw size={16} className="animate-spin" />
        ) : isPlaying ? (
          <Pause size={16} fill="currentColor" />
        ) : (
          <Play size={16} className="ml-0.5" fill="currentColor" />
        )}
      </button>

      <div className="flex-1 flex flex-col gap-1 sm:gap-1.5 pr-1 overflow-hidden relative">
        <div className="flex items-center gap-[2px] sm:gap-1 h-4 sm:h-5">
          {/* Waveform-like bars */}
          {[...Array(20)].map((_, i) => {
            const barHeight = 30 + (Math.sin(i * 0.5) * 20) + (Math.random() * 30);
            const isPlayed = (currentTime / (duration || 1)) * 20 > i;
            return (
              <div 
                key={i} 
                className={`flex-1 rounded-full transition-all duration-200 ${
                  isMe ? 'bg-white' : 'bg-primary'
                }`}
                style={{ 
                  height: `${barHeight}%`,
                  opacity: isPlayed ? 1 : 0.2
                }}
              />
            );
          })}
        </div>
        <input 
          type="range"
          min="0"
          max={duration || 0}
          step="0.01"
          value={currentTime}
          onChange={handleProgressChange}
          className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
        />
        <div className={`flex justify-between text-[10px] sm:text-[11px] font-black uppercase tracking-tighter mt-0.5 ${
          isMe ? 'text-white' : 'text-on-surface/80'
        }`}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

const ChatView = ({ recipient, onBack, onMessagesRead }: { recipient: Creator, onBack?: () => void, onMessagesRead?: () => void }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<any>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio' | null>(null);

  const fetchMessages = React.useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${recipient.id}),and(sender_id.eq.${recipient.id},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages in ChatView:', error);
      } else if (data) {
        setMessages(data);
        
        // Mark received messages as read
        const unreadIds = data
          .filter(m => m.receiver_id === userId && !m.is_read)
          .map(m => m.id);
        
        if (unreadIds.length > 0) {
          await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', unreadIds);
          
          if (onMessagesRead) onMessagesRead();
        }
      }
    } catch (err) {
      console.error('Exception in fetchMessages:', err);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [recipient.id, onMessagesRead]);

  React.useEffect(() => {
    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        fetchMessages(user.id);

        const channel = supabase
          .channel(`chat-${user.id}-${recipient.id}`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages' },
            (payload) => {
              const msg = payload.new;
              if ((msg.sender_id === user.id && msg.receiver_id === recipient.id) || 
                  (msg.sender_id === recipient.id && msg.receiver_id === user.id)) {
                fetchMessages(user.id);
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    };
    setup();
  }, [recipient.id, fetchMessages]);

  const handleSendMessage = async (mediaUrl?: string, type?: 'image' | 'video' | 'audio') => {
    if (!newMessage.trim() && !mediaUrl || !currentUser) return;
    const content = newMessage;
    setNewMessage('');

    const { error } = await supabase.from('messages').insert({
      sender_id: currentUser.id,
      receiver_id: recipient.id,
      content: content,
      media_url: mediaUrl,
      media_type: type
    });

    if (error) {
      console.error('Error sending message:', error);
      alert('Erro ao enviar mensagem.');
    } else {
      // Create notification for the receiver
      try {
        await supabase.from('notifications').insert({
          user_id: recipient.id,
          type: 'message',
          content: `enviou uma nova mensagem para você`,
          created_at: new Date().toISOString()
        });
      } catch (err) {
        console.error('Error creating message notification:', err);
      }

      fetchMessages(currentUser.id);
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement> | Blob) => {
    let file: File | Blob;
    let fileName: string;
    let fileType: string;

    if (e instanceof Blob) {
      file = e;
      fileName = `audio_${Date.now()}.webm`; // Default name, backend will rename to .m4a
      fileType = e.type;
    } else {
      const selectedFile = e.target.files?.[0];
      if (!selectedFile) return;
      file = selectedFile;
      fileName = selectedFile.name;
      fileType = selectedFile.type;
    }

    if (!currentUser) return;

    setUploading(true);
    try {
      const isSupportedByIOS = fileType.includes('mp4') || fileType.includes('aac') || fileType.includes('mpeg');
      if (fileType.startsWith('audio/') && !isSupportedByIOS) {
        const formData = new FormData();
        formData.append('audio', file);
        formData.append('userId', currentUser.id);

        const response = await fetch('/api/audio/convert', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Falha na conversão de áudio');
        }
        
        const data = await response.json();
        await handleSendMessage(data.url, 'audio');
        return;
      }

      const fileExt = fileName.split('.').pop();
      const finalFileName = `${Math.random()}.${fileExt}`;
      const filePath = `chat/${currentUser.id}/${finalFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(filePath, file, {
          contentType: fileType,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('posts').getPublicUrl(filePath);
      
      let type: 'image' | 'video' | 'audio' = 'image';
      if (fileType.startsWith('video/')) type = 'video';
      else if (fileType.startsWith('audio/')) type = 'audio';

      await handleSendMessage(data.publicUrl, type);
    } catch (err: any) {
      alert(`Erro no upload: ${err.message}`);
    } finally {
      setUploading(false);
      if (!(e instanceof Blob) && fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // iOS compatibility: check for supported types
      // Prefer audio/mp4 for iOS, but most browsers will use audio/webm
      const supportedTypes = [
        'audio/mp4',
        'audio/aac',
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
      ];
      
      const mimeType = supportedTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/webm';
      console.log('Using MIME type for recording:', mimeType);
        
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioChunksRef.current.length > 0) {
          await handleMediaUpload(audioBlob);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      // Request data every 1 second to avoid large chunks issues on some browsers
      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Não foi possível acessar o microfone.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      audioChunksRef.current = [];
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      <div className="p-4 bg-white border-b border-primary/5 flex items-center gap-4 sticky top-0 z-10">
        {onBack && (
          <button onClick={onBack} className="p-2 -ml-2 text-on-surface/60">
            <ArrowLeft size={24} />
          </button>
        )}
        <div className="flex items-center gap-3">
          <img src={recipient?.avatar} className="w-10 h-10 rounded-full object-cover border border-primary/10" referrerPolicy="no-referrer" />
          <div>
            <h3 className="font-black text-sm uppercase tracking-tight">{recipient?.name}</h3>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">Online agora</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUser?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
                  isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-on-surface rounded-tl-none border border-primary/5'
                }`}>
                  {msg.media_url && (
                    <div className="mb-2 rounded-xl overflow-hidden bg-black/5">
                      {msg.media_type === 'image' && (
                        <img src={msg.media_url} className="w-full max-h-64 object-cover" referrerPolicy="no-referrer" />
                      )}
                      {msg.media_type === 'video' && (
                        <video src={msg.media_url} controls className="w-full max-h-64" />
                      )}
                      {msg.media_type === 'audio' && (
                        <AudioPlayer src={msg.media_url} isMe={isMe} />
                      )}
                    </div>
                  )}
                  {msg.content && <p className="text-sm font-medium leading-relaxed px-1">{msg.content}</p>}
                  <p className={`text-[9px] mt-1 font-bold uppercase tracking-widest px-1 ${isMe ? 'text-white/60' : 'text-on-surface/30'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 opacity-30">
            <MessageCircle size={48} className="mx-auto mb-4" />
            <p className="text-xs font-black uppercase tracking-widest">Inicie uma conversa exclusiva</p>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-white border-t border-primary/5 pb-safe">
        <div className="flex flex-col gap-3">
          {uploading && (
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse px-2">
              <RefreshCw size={12} className="animate-spin" />
              Enviando mídia...
            </div>
          )}
          
          <div className="flex gap-2 items-center min-h-[56px]">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,video/*,audio/*"
              onChange={handleMediaUpload}
            />
            
            {!isRecording ? (
              <>
                <div className="flex gap-1">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-on-surface/60 hover:text-primary transition-colors bg-gray-100 rounded-xl"
                    title="Enviar Foto ou Vídeo"
                  >
                    <Camera size={20} />
                  </button>
                  <button 
                    onClick={startRecording}
                    className="p-3 text-on-surface/60 hover:text-primary transition-colors bg-gray-100 rounded-xl"
                    title="Gravar Áudio"
                  >
                    <Mic size={20} />
                  </button>
                </div>

                <div className="flex-1 flex gap-2 bg-gray-100 p-1 rounded-2xl border border-gray-200 focus-within:border-primary/30 transition-colors items-center overflow-hidden">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Sua mensagem..."
                    className="flex-1 bg-transparent px-3 py-2 text-sm outline-none font-medium min-w-0"
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={(!newMessage.trim() && !uploading) || uploading}
                    className="bg-primary text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 flex-shrink-0"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center gap-3 bg-primary/5 p-2 rounded-2xl border border-primary/20 animate-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 px-2 flex-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-primary tabular-nums">
                    Gravando: {formatDuration(recordingDuration)}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={cancelRecording}
                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Cancelar"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button 
                    onClick={stopRecording}
                    className="p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
                    title="Enviar Áudio"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ScreenMessages = ({ messages, isMaster, onMessagesRead }: { messages: Message[], isMaster: boolean, onMessagesRead?: () => void }) => {
  const [selectedRecipient, setSelectedRecipient] = useState<Creator | null>(null);
  const [contacts, setContacts] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        if (isMaster) {
          // Fetch all followers and subscribers for Master
          const { data: followers } = await supabase.from('follows').select('follower:profiles!follower_id(*)').eq('following_id', user.id);
          const { data: subscribers } = await supabase.from('payments').select('user:profiles!user_id(*)').eq('creator_id', user.id).eq('status', 'approved');

          const contactMap = new Map<string, Creator>();
          followers?.forEach((f: any) => {
            const follower = Array.isArray(f.follower) ? f.follower[0] : f.follower;
            if (follower) contactMap.set(follower.id, follower as any);
          });
          subscribers?.forEach((s: any) => {
            const user = Array.isArray(s.user) ? s.user[0] : s.user;
            if (user) contactMap.set(user.id, user as any);
          });
          setContacts(Array.from(contactMap.values()));
        } else {
          // For subscribers, always show the Master as a contact
          const { data: masterProfile } = await supabase.from('profiles').select('*').eq('email', MASTER_EMAIL).single();
          if (masterProfile) {
            setContacts([masterProfile as any]);
          }
        }
      } catch (err) {
        console.error('Error fetching contacts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [isMaster]);

  if (selectedRecipient) {
    return <ChatView recipient={selectedRecipient} onBack={() => setSelectedRecipient(null)} onMessagesRead={onMessagesRead} />;
  }

  return (
    <div className="pt-20 pb-24 max-w-2xl mx-auto px-6">
      <section className="mb-8 pt-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-1">Mensagens</h1>
        <p className="text-on-surface/60 text-sm font-medium">Gerencie suas conexões e conversas exclusivas.</p>
      </section>

      {contacts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-black text-primary uppercase tracking-widest mb-4">
            {isMaster ? 'Seus Contatos (Seguidores/Assinantes)' : 'Fale com o Criador'}
          </h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {contacts.map(contact => (
              <button 
                key={contact.id} 
                onClick={() => setSelectedRecipient(contact)}
                className="flex flex-col items-center gap-2 min-w-[70px]"
              >
                <img src={contact?.avatar} className="w-14 h-14 rounded-full object-cover border-2 border-primary/10 p-0.5" referrerPolicy="no-referrer" />
                <span className="text-[10px] font-bold truncate w-full text-center">{contact?.name?.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
        <button className="px-5 py-2 rounded-full premium-gradient text-white font-bold text-xs shadow-sm">Todas</button>
        <button className="px-5 py-2 rounded-full bg-white text-on-surface/60 font-bold text-xs border border-primary/5">Não Lidas</button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : messages.length > 0 ? (
          messages.map(msg => (
            <div 
              key={msg.id} 
              onClick={() => setSelectedRecipient(msg.user)}
              className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white transition-all hover:shadow-md cursor-pointer border border-primary/5"
            >
              <div className="relative flex-shrink-0">
                <img src={msg.user?.avatar} className={`w-14 h-14 rounded-full object-cover border border-primary/10 p-0.5 ${msg.isLocked ? 'grayscale opacity-50' : ''}`} referrerPolicy="no-referrer" />
                {msg.isOnline && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className={`font-bold text-base truncate ${msg.isLocked ? 'text-on-surface/60' : 'text-on-surface'}`}>{msg.user?.name}</h3>
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
          ))
        ) : (
          <div className="text-center py-20 opacity-30">
            <MessageCircle size={48} className="mx-auto mb-4" />
            <p className="text-xs font-black uppercase tracking-widest">Nenhuma mensagem ainda</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ScreenEditProfile = ({ onBack, creator, onProfileUpdated }: { onBack: () => void, creator: Creator, onProfileUpdated: () => void }) => {
  const [name, setName] = useState(creator.name);
  const [username, setUsername] = useState(creator.username);
  const [bio, setBio] = useState(creator.bio);
  const [servicesBio, setServicesBio] = useState(creator.services_bio || '');
  const [welcomeAudio, setWelcomeAudio] = useState(creator.welcome_audio || '');
  const [avatar, setAvatar] = useState(creator.avatar);
  const [coverImage, setCoverImage] = useState(creator.cover_image || '');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cropImage, setCropImage] = useState<{ url: string, bucket: string, aspect: number } | null>(null);

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
    const reader = new FileReader();
    reader.onload = () => {
      setCropImage({ url: reader.result as string, bucket: 'avatars', aspect: 1 });
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const onCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropImage({ url: reader.result as string, bucket: 'covers', aspect: 16 / 9 });
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!cropImage) return;
    const file = new File([croppedBlob], `cropped_${Date.now()}.jpg`, { type: 'image/jpeg' });
    const url = await handleFileUpload(file, cropImage.bucket);
    if (url) {
      if (cropImage.bucket === 'avatars') setAvatar(url);
      else setCoverImage(url);
    }
    setCropImage(null);
  };

  const handleAudioUpload = async (file: File) => {
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const isSupportedByIOS = file.type.includes('mp4') || file.type.includes('aac') || file.type.includes('mpeg');
      if (isSupportedByIOS) {
        const url = await handleFileUpload(file, 'avatars');
        if (url) setWelcomeAudio(url);
        return;
      }

      const formData = new FormData();
      formData.append('audio', file);
      formData.append('userId', user.id);

      const response = await fetch('/api/audio/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha na conversão de áudio');
      }
      
      const data = await response.json();
      setWelcomeAudio(data.url);
    } catch (err: any) {
      alert(`Erro no upload de áudio: ${err.message}`);
    } finally {
      setUploading(false);
    }
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
        services_bio: servicesBio,
        welcome_audio: welcomeAudio,
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
      {cropImage && (
        <CropModal 
          image={cropImage.url} 
          aspect={cropImage.aspect}
          onCropComplete={handleCropComplete} 
          onClose={() => setCropImage(null)} 
        />
      )}
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
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-primary/70 px-1">Preços e Serviços</label>
            <textarea 
              className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/20 shadow-sm text-xs leading-relaxed min-h-[80px] resize-none font-medium text-on-surface/60" 
              placeholder="Use **texto** para negrito. Ex: **Video Chamada** R$ 50,00"
              value={servicesBio}
              onChange={(e) => setServicesBio(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-primary/70 px-1">Áudio de Boas-vindas</label>
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer bg-white border border-primary/10 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-primary/20 shadow-sm flex items-center justify-between group transition-all">
                <span className="text-sm font-bold text-on-surface/60 group-hover:text-primary transition-colors truncate">
                  {welcomeAudio ? 'Áudio selecionado' : 'Fazer upload de áudio (MP3)'}
                </span>
                <Volume2 size={18} className="text-primary/40 group-hover:text-primary transition-colors" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="audio/*" 
                  onChange={async (e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      await handleAudioUpload(file);
                    }
                  }} 
                  disabled={uploading} 
                />
              </label>
              {welcomeAudio && (
                <button 
                  type="button"
                  onClick={() => setWelcomeAudio('')}
                  className="p-3.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
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
        time: ''
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
                  <video src={`${image}#t=0.001`} className="w-full h-full object-cover" controls />
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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResetMessage(null);
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

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Por favor, insira seu e-mail para redefinir a senha.');
      return;
    }
    setLoading(true);
    setError(null);
    setResetMessage(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setResetMessage('E-mail de redefinição de senha enviado! Verifique sua caixa de entrada.');
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar e-mail de redefinição.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-12 bg-background">
      <div className="w-full max-w-md space-y-2">
        <div className="flex flex-col items-center space-y-0">
          <img 
            src={LOGIN_LOGO_URL} 
            alt="Logo" 
            className="h-48 w-auto object-contain mb-0" 
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLElement).parentElement;
              if (parent) {
                const text = document.createElement('div');
                text.className = "text-4xl font-black text-primary tracking-tighter";
                text.innerText = "NUDLYE";
                parent.appendChild(text);
              }
            }}
          />
          <div className="text-center w-full">
            <p className="text-on-surface/60 text-sm font-bold max-w-[280px] mx-auto">Assine, interaja e conecte-se com acompanhantes e criadores em um clique.</p>
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
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  className="absolute right-5 text-on-surface/40" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
          {resetMessage && <p className="text-green-500 text-xs font-bold text-center">{resetMessage}</p>}
          <div className="flex justify-end">
            <button 
              className="text-xs font-black text-primary uppercase tracking-widest" 
              type="button"
              onClick={handleForgotPassword}
              disabled={loading}
            >
              Esqueceu a senha?
            </button>
          </div>
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
          <GoogleLoginButton 
            loading={loading}
            onClick={async () => {
              try {
                setLoading(true);
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: window.location.origin
                  }
                });
                if (error) throw error;
              } catch (err: any) {
                setError(err.message || 'Erro ao entrar com Google');
                setLoading(false);
              }
            }}
          />
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
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+55 ');
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
            phone: phone
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
          stats: { posts: '0', followers: '0', likes: '0' },
          phone: phone
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
      <div className="w-full max-w-md space-y-2">
        <div className="flex flex-col items-center space-y-0">
          <img 
            src={LOGIN_LOGO_URL} 
            alt="Logo" 
            className="h-48 w-auto object-contain mb-0" 
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLElement).parentElement;
              if (parent) {
                const text = document.createElement('div');
                text.className = "text-4xl font-black text-primary tracking-tighter";
                text.innerText = "NUDLYE";
                parent.appendChild(text);
              }
            }}
          />
          <div className="text-center w-full">
            <div className="space-y-0">
              <h1 className="text-4xl font-black tracking-tight leading-none text-on-surface">Criar Conta</h1>
              <p className="text-on-surface/60 text-sm font-bold max-w-[280px] mx-auto">Assine, interaja e conecte-se com acompanhantes e criadores em um clique.</p>
            </div>

            <div className="bg-primary/5 rounded-3xl p-6 space-y-4 border border-primary/10 text-left">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Check size={14} className="text-primary" />
                </div>
                <span className="text-[11px] font-black text-on-surface/80 uppercase tracking-tight">Acesso total ao conteúdo deste usuário</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Check size={14} className="text-primary" />
                </div>
                <span className="text-[11px] font-black text-on-surface/80 uppercase tracking-tight">Mensagem direta com este usuário</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Check size={14} className="text-primary" />
                </div>
                <span className="text-[11px] font-black text-on-surface/80 uppercase tracking-tight">Cancele sua assinatura a qualquer momento</span>
              </div>
            </div>
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
              <label className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest px-1">Telefone</label>
              <input 
                className="w-full bg-white border border-primary/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
                placeholder="+55 (11) 99999-9999" 
                type="tel"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.startsWith('+55')) {
                    setPhone(val);
                  } else {
                    setPhone('+55 ' + val.replace(/^\+55\s*/, ''));
                  }
                }}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest px-1">Senha</label>
              <div className="relative flex items-center">
                <input 
                  className="w-full bg-white border border-primary/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  className="absolute right-5 text-on-surface/40" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

          <div className="flex items-start gap-3 px-1">
            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-primary/20 text-primary focus:ring-primary/20" required />
            <p className="text-[9px] font-bold text-on-surface/60 leading-relaxed">
              Eu aceito os <span className="text-primary underline">Termos de Serviço</span> e a <span className="text-primary underline">Política de Privacidade</span>
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

        <div className="space-y-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-primary/10"></div></div>
            <span className="relative bg-background px-4 text-[10px] font-black text-on-surface/30 uppercase tracking-widest">Ou continue com</span>
          </div>
          <GoogleLoginButton 
            loading={loading}
            onClick={async () => {
              try {
                setLoading(true);
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: window.location.origin
                  }
                });
                if (error) throw error;
              } catch (err: any) {
                setError(err.message || 'Erro ao entrar com Google');
                setLoading(false);
              }
            }}
          />
        </div>

        <div className="text-center pt-4">
          <p className="text-on-surface/60 font-bold text-sm">Já tem uma conta? <button onClick={onNavigateToLogin} className="text-primary font-black ml-1 uppercase tracking-widest">Entrar</button></p>
        </div>
      </div>
    </div>
  );
};

const ScreenPayment = ({ onBack, creator, post }: { onBack: () => void, creator: Creator | null, post?: Post | null }) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pixData, setPixData] = useState<{ qrCode: string, qrCodeBase64: string, paymentId: string } | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const plans = [
    { id: 'monthly', name: 'Mensal', price: 'R$ 29,90', description: 'Acesso total por 30 dias' },
    { id: 'quarterly', name: 'Trimestral', price: 'R$ 79,90', description: 'Economize 15% - 90 dias', badge: 'Popular' },
    { id: 'yearly', name: 'Anual', price: 'R$ 249,90', description: 'Economize 30% - 365 dias', badge: 'Melhor Valor' },
  ];

  const postPrice = post?.price || 'R$ 15,00';

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
  }, []);

  const handleCopyPix = () => {
    if (pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generatePix = async () => {
    if (!currentUser || !creator) return;
    setLoading(true);
    try {
      let amount = 0;
      let description = "";
      let planId = selectedPlan;

      if (post) {
        amount = parseFloat(postPrice.replace('R$ ', '').replace(',', '.') || '0');
        description = `Compra de Post - ${creator.name}`;
        planId = `post_${post.id}`;
      } else {
        const selectedPlanData = plans.find(p => p.id === selectedPlan);
        amount = parseFloat(selectedPlanData?.price.replace('R$ ', '').replace(',', '.') || '0');
        description = `Assinatura ${selectedPlanData?.name} - ${creator.name}`;
      }

      const response = await fetch('/api/payments/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          description,
          payerEmail: currentUser.email,
          userId: currentUser.id,
          creatorId: creator.id,
          planId,
          postId: post?.id
        })
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Erro do servidor Vercel: ${text.substring(0, 100)}`);
      }

      if (data.error) throw new Error(data.error);
      setPixData(data);
    } catch (error: any) {
      console.error("Erro ao gerar Pix:", error);
      alert(`Erro ao gerar Pix: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Polling for payment status
  React.useEffect(() => {
    if (!pixData?.paymentId) return;

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('payments')
        .select('status')
        .eq('id', pixData.paymentId)
        .single();

      if (data && data.status === 'approved') {
        setSuccess(true);
        clearInterval(interval);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [pixData?.paymentId]);

  if (success) {
    return (
      <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-8 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-green-200"
        >
          <Check size={48} strokeWidth={3} />
        </motion.div>
        <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">Assinatura Ativa!</h2>
        <p className="text-on-surface/60 font-medium mb-10 leading-relaxed">
          Parabéns! Agora você tem acesso total ao conteúdo exclusivo de <span className="text-primary font-bold">{creator?.name}</span>.
        </p>
        <button 
          onClick={onBack}
          className="w-full py-5 premium-gradient text-white font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all uppercase tracking-widest text-sm"
        >
          Começar a Ver
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-background flex flex-col overflow-y-auto no-scrollbar">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center gap-4 border-b border-primary/5">
        <button onClick={onBack} className="p-2 -ml-2 text-on-surface/60 hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-black uppercase tracking-widest text-xs">Pagamento Seguro</h2>
      </div>

      <div className="p-6 max-w-2xl mx-auto w-full space-y-8 pb-24">
        <section className="text-center py-4">
          <div className="relative inline-block mb-4">
            {post ? (
              <img src={post.image} className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl object-cover" referrerPolicy="no-referrer" />
            ) : (
              <img src={creator?.avatar} className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover" referrerPolicy="no-referrer" />
            )}
            <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full border-2 border-white">
              <Lock size={14} fill="white" />
            </div>
          </div>
          <h1 className="text-2xl font-black mb-1 uppercase tracking-tight">
            {post ? 'Desbloquear Conteúdo' : `Assinar ${creator?.name}`}
          </h1>
          <p className="text-xs font-bold text-on-surface/40 uppercase tracking-widest">
            {post ? `Acesso vitalício a este ${post.isVideo ? 'vídeo' : 'post'}` : 'Escolha seu plano de acesso'}
          </p>
        </section>

        <div className="flex items-center justify-center gap-4 py-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
            <ShieldCheck size={14} />
            100% Seguro
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
            <EyeOff size={14} />
            Pagamento Anônimo
          </div>
        </div>

        {!post ? (
          <div className="space-y-4">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                onClick={() => {
                  setSelectedPlan(plan.id);
                  setPixData(null); // Reset pix data when changing plans
                }}
                className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  selectedPlan === plan.id ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-primary/5 bg-white'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 right-6 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                    {plan.badge}
                  </span>
                )}
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === plan.id ? 'border-primary' : 'border-primary/20'
                  }`}>
                    {selectedPlan === plan.id && <div className="w-3 h-3 bg-primary rounded-full" />}
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-tight">{plan.name}</h3>
                    <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">{plan.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-black text-primary text-lg">{plan.price}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-white border-2 border-primary shadow-lg shadow-primary/5 flex items-center justify-between">
            <div>
              <h3 className="font-black text-lg uppercase tracking-tight">Acesso Único</h3>
              <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">Este post será desbloqueado para sempre</p>
            </div>
            <div className="text-right">
              <span className="block font-black text-primary text-2xl">{postPrice}</span>
            </div>
          </div>
        )}

        <div className="bg-white p-8 rounded-3xl border border-primary/5 shadow-sm space-y-8 text-center mt-6">
          <div className="flex flex-col items-center">
            <h3 className="font-black text-lg uppercase tracking-tight mb-4">Pague com Pix</h3>
            <button 
              onClick={generatePix}
              disabled={loading}
              className="w-full py-5 premium-gradient text-white font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={20} />
                  Gerar Código Pix
                </>
              )}
            </button>
          </div>
        </div>
        
        {pixData && (
          <div className="fixed inset-0 z-[300] bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
            <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl border border-primary/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
              <button 
                onClick={() => setPixData(null)}
                className="absolute top-4 right-4 text-on-surface/40 hover:text-primary transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 text-green-600 mb-6 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Ambiente Seguro e Criptografado</span>
                </div>

                <div className="w-48 h-48 bg-white rounded-2xl p-3 mb-6 shadow-lg border border-primary/10 relative">
                  <div className="absolute -top-3 -right-3 bg-primary text-white p-2 rounded-full shadow-md">
                    <QrCode size={20} />
                  </div>
                  <img 
                    src={`data:image/jpeg;base64,${pixData.qrCodeBase64}`} 
                    alt="Pix QR Code" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-black text-xl uppercase tracking-tight mb-2 text-on-surface">Pague com Pix</h3>
                <p className="text-xs text-on-surface/60 font-medium max-w-[260px] text-center mb-8 leading-relaxed">
                  Escaneie o QR Code com o app do seu banco ou copie o código abaixo para liberar seu acesso <span className="font-bold text-primary">imediatamente</span>.
                </p>
              </div>

              <div className="space-y-3 mb-8 bg-on-surface/5 p-4 rounded-2xl border border-on-surface/10">
                <label className="text-[10px] uppercase tracking-widest font-black text-on-surface/60 block text-left flex items-center gap-1.5">
                  <Copy size={12} />
                  Código Pix Copia e Cola
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white border border-primary/10 rounded-xl px-4 py-3.5 font-mono text-[10px] break-all text-left overflow-hidden h-12 flex items-center shadow-inner">
                    {pixData.qrCode.substring(0, 40)}...
                  </div>
                  <button 
                    onClick={handleCopyPix}
                    className="bg-primary text-white px-4 rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-md"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
                {copied && <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest text-center mt-2">Código copiado com sucesso!</p>}
              </div>

              <div className="flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-2 text-primary text-sm font-bold animate-pulse bg-primary/5 px-6 py-3 rounded-full">
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  Aguardando confirmação...
                </div>
                <p className="text-[9px] text-on-surface/40 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Lock size={10} />
                  Transação 100% Anônima
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white p-4 rounded-2xl border border-primary/5 shadow-sm flex items-start gap-4 mt-8">
          <div className="bg-[#5c0a18] p-3 rounded-xl flex-shrink-0">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <div className="text-left">
            <h4 className="font-bold text-sm text-on-surface mb-1">TRANSAÇÃO PROTEGIDA</h4>
            <p className="text-xs text-on-surface/60 leading-relaxed">
              Esta operação está sendo realizada em um ambiente criptografado de ponta a ponta. Sua identidade e dados bancários permanecem privados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [screen, setScreen] = React.useState<Screen>(() => {
    const saved = localStorage.getItem('novinha_screen');
    if (saved && ['feed', 'profile', 'activity', 'messages', 'edit-profile', 'create-post', 'wallet', 'payment'].includes(saved)) {
      return saved as Screen;
    }
    return 'login';
  });
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [stories, setStories] = React.useState<any[]>([]);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = React.useState(0);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [creator, setCreator] = React.useState<Creator | null>(null);
  const [publicCreator, setPublicCreator] = React.useState<Creator | null>(null);
  const [publicPosts, setPublicPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showResetButton, setShowResetButton] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) setShowResetButton(true);
    }, 8000); // Show reset button after 8 seconds of loading
    return () => clearTimeout(timer);
  }, [loading]);

  const handleReset = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      window.location.reload();
    } catch (err) {
      console.error('Error resetting app:', err);
      window.location.reload();
    }
  };
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [dbStatus, setDbStatus] = React.useState<'checking' | 'connected' | 'error'>('checking');
  const [editingPost, setEditingPost] = React.useState<Post | null>(null);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [selectedPostForPayment, setSelectedPostForPayment] = React.useState<Post | null>(null);
  const [selectedRecipient, setSelectedRecipient] = React.useState<Creator | null>(null);
  const [forwardingPost, setForwardingPost] = React.useState<Post | null>(null);

  const handleForwardPost = async (post: Post, recipient: Creator) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: recipient.id,
        content: `Encaminhou uma publicação de ${post.creator.name}`,
        media_url: post.image,
        media_type: post.isVideo ? 'video' : 'image'
      });

      if (error) throw error;

      // Create notification for the receiver
      await supabase.from('notifications').insert({
        user_id: recipient.id,
        type: 'message',
        content: `encaminhou uma publicação para você`,
        created_at: new Date().toISOString()
      });

      setSelectedRecipient(recipient);
      setScreen('chat');
      setForwardingPost(null);
    } catch (err) {
      console.error('Error forwarding post:', err);
      alert('Erro ao encaminhar publicação.');
    }
  };

  const isMaster = userEmail === MASTER_EMAIL;

  const fetchData = React.useCallback(async () => {
    console.log('fetchData called');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found in fetchData');
        setLoading(false);
        return;
      }
      console.log('Fetching data for user:', user.email, 'ID:', user.id);

      // Fetch profile
      const { data: profileData, error: profileFetchError } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      
      // Fetch follower count
      const { count: followerCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', user.id);

      // Fetch total likes for user's posts
      const { data: userPostsLikes } = await supabase
        .from('posts')
        .select('id, post_likes(count)')
        .eq('creator_id', user.id);
      
      const totalLikes = userPostsLikes?.reduce((acc, post: any) => acc + (post.post_likes?.[0]?.count || 0), 0) || 0;
      const totalPosts = userPostsLikes?.length || 0;

      if (profileData) {
        setCreator({
          ...profileData,
          stats: {
            ...profileData.stats,
            followers: followerCount?.toString() || '0',
            likes: totalLikes.toString(),
            posts: totalPosts.toString()
          }
        } as any);
        console.log('Profile fetched:', profileData.name);
        // If profile exists but email is missing, update it
        if (!profileData.email && user.email) {
          console.log('Updating profile with missing email:', user.email);
          await supabase.from('profiles').update({ email: user.email }).eq('id', user.id);
        }
      } else if (profileFetchError && profileFetchError.code === 'PGRST116') {
        console.log('Profile not found, creating default profile for user:', user.id);
        const newProfile = {
          id: user.id,
          email: user.email,
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

      // Fetch user's active payments
      const { data: userPayments } = await supabase
        .from('payments')
        .select('creator_id, post_id')
        .eq('user_id', user.id)
        .eq('status', 'approved');

      const subscribedCreatorIds = new Set(userPayments?.filter(p => !p.post_id).map(p => p.creator_id) || []);
      const purchasedPostIds = new Set(userPayments?.filter(p => p.post_id).map(p => p.post_id) || []);

      // Fetch posts
      // Try to find master profile by email. If it fails, masterId will be undefined and we show all posts.
      let masterId: string | undefined = undefined;
      try {
        const { data: masterProfile } = await supabase.from('profiles').select('id').eq('email', MASTER_EMAIL).single();
        masterId = masterProfile?.id;
        console.log('Master ID found:', masterId);
      } catch (e) {
        console.log('Master profile not found by email, showing all posts');
      }

      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*, creator:profiles(*), post_likes!post_id(user_id), post_comments!post_id(id)')
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Error fetching posts with likes/comments:', postsError);
        
        if (postsError.message?.includes('relation "public.post_likes" does not exist') || 
            postsError.message?.includes('relation "public.post_comments" does not exist') ||
            postsError.message?.includes('relation "post_likes" does not exist') ||
            postsError.message?.includes('relation "post_comments" does not exist')) {
          console.warn('Database tables for likes/comments are missing. Please run the migration script.');
        }

        // Fallback to fetching posts without likes/comments if tables don't exist
        const { data: fallbackPosts, error: fallbackError } = await supabase
          .from('posts')
          .select('*, creator:profiles(*)')
          .order('created_at', { ascending: false });
        
        if (fallbackError) {
          console.error('Error fetching fallback posts:', fallbackError);
        } else if (fallbackPosts) {
          console.log(`Fetched ${fallbackPosts.length} fallback posts`);
          const filteredPosts = masterId 
            ? fallbackPosts.filter((p: any) => p.creator_id === masterId)
            : fallbackPosts;
          
          setPosts(filteredPosts.map((p: any) => ({
            ...p,
            isLocked: p.is_locked,
            hasAccess: p.creator_id === user.id ? true : (subscribedCreatorIds.has(p.creator_id) ? true : !p.is_locked),
            isVideo: p.is_video,
            likesCount: 0,
            commentsCount: 0,
            isLikedByMe: false
          })) as any);
        }
      } else if (postsData) {
        console.log(`Fetched ${postsData.length} posts`);
        // Filter posts to only show master's posts if masterId exists
        const filteredPosts = masterId 
          ? postsData.filter((p: any) => p.creator_id === masterId)
          : postsData;
        
        setPosts(filteredPosts.map((p: any) => ({
          ...p,
          isLocked: p.is_locked,
          hasAccess: p.creator_id === user.id ? true : (subscribedCreatorIds.has(p.creator_id) || purchasedPostIds.has(p.id) ? true : !p.is_locked),
          isVideo: p.is_video,
          likesCount: p.post_likes?.length || 0,
          commentsCount: p.post_comments?.length || 0,
          isLikedByMe: p.post_likes?.some((l: any) => l.user_id === user.id)
        })) as any);
      }

      // Fetch stories (only from the last 24 hours)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: storiesData } = await supabase
        .from('stories')
        .select('*')
        .gte('created_at', twentyFourHoursAgo)
        .order('created_at', { ascending: false });
        
      if (storiesData) {
        const filteredStories = masterId
          ? storiesData.filter((s: any) => s.creator_id === masterId)
          : storiesData;
        setStories(filteredStories);
      }

      // Fetch notifications
      let allNotifications: Notification[] = [];
      try {
        // Fetch from notifications table (system/other notifications)
        const { data: notificationsData, error: notifErr } = await supabase
          .from('notifications')
          .select('*, user:profiles!user_id(name, avatar)')
          .eq('user_id', user.id) // Only for the current user
          .order('created_at', { ascending: false });
        
        if (notifErr) {
          console.log('Notifications table query failed:', notifErr.message);
        } else if (notificationsData) {
          allNotifications = notificationsData.map((n: any) => ({
            ...n,
            user: {
              name: n.user?.name || 'Sistema',
              avatar: n.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=system',
              isVerified: n.user?.is_verified
            }
          }));
        }
      } catch (e) {
        console.log('Error fetching from notifications table:', e);
      }

      // Fetch payments for notifications (subscriptions)
      try {
        const { data: paymentsData, error: payErr } = await supabase
          .from('payments')
          .select('*, user:profiles!user_id(name, avatar)')
          .eq('creator_id', user.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (payErr) {
          console.error('Error fetching payments for notifications:', payErr);
        } else if (paymentsData) {
          console.log(`Fetched ${paymentsData.length} payments for notifications`);
          const paymentNotifications: Notification[] = paymentsData.map((p: any) => ({
            id: `payment-${p.id}`,
            type: 'subscription',
            user: {
              name: p.user?.name || 'Usuário Anônimo',
              avatar: p.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous',
              isVerified: p.user?.is_verified
            },
            content: `assinou seu conteúdo VIP!`,
            time: new Date(p.created_at).toLocaleDateString('pt-BR'),
            badge: 'NOVO ASSINANTE',
            created_at: p.created_at
          }));
          
          allNotifications = [...allNotifications, ...paymentNotifications];
        }
      } catch (e) {
        console.error('Error in payments notification block:', e);
      }

      // Fetch user's posts to get their IDs for filtering likes/comments
      const { data: myPosts } = await supabase
        .from('posts')
        .select('id')
        .eq('creator_id', user.id);
      
      const myPostIds = myPosts?.map(p => p.id) || [];
      console.log(`User has ${myPostIds.length} posts for notification filtering. IDs:`, myPostIds);

      // Fetch likes for notifications
      if (myPostIds.length > 0) {
        try {
          const { data: likesData, error: likesErr } = await supabase
            .from('post_likes')
            .select('*, user:profiles!user_id(name, avatar), posts!post_id(image)')
            .in('post_id', myPostIds)
            .order('created_at', { ascending: false })
            .limit(50);

          if (likesErr) {
            console.error('Error in likesData query:', likesErr);
          } else if (likesData) {
            console.log(`Fetched ${likesData.length} likes for notifications`);
            const likeNotifications: Notification[] = likesData
              .filter((l: any) => l.user_id !== user.id) // Don't notify about own likes
              .map((l: any) => ({
                id: `like-${l.id}`,
                type: 'like',
                user: {
                  name: l.user?.name || 'Usuário',
                  avatar: l.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
                },
                content: `curtiu sua publicação`,
                time: l.created_at ? new Date(l.created_at).toLocaleDateString('pt-BR') : 'Recentemente',
                thumbnail: l.posts?.image,
                badge: 'CURTIDA',
                created_at: l.created_at || new Date().toISOString()
              }));
            allNotifications = [...allNotifications, ...likeNotifications];
          }
        } catch (e) {
          console.error('Error fetching like notifications:', e);
        }

        // Fetch comments for notifications
        try {
          const { data: commentsData, error: commentsErr } = await supabase
            .from('post_comments')
            .select('*, user:profiles!user_id(name, avatar), posts!post_id(image)')
            .in('post_id', myPostIds)
            .order('created_at', { ascending: false })
            .limit(50);

          if (commentsErr) {
            console.error('Error in commentsData query:', commentsErr);
          } else if (commentsData) {
            console.log(`Fetched ${commentsData.length} comments for notifications`);
            const commentNotifications: Notification[] = commentsData
              .filter((c: any) => c.user_id !== user.id) // Don't notify about own comments
              .map((c: any) => ({
                id: `comment-${c.id}`,
                type: 'comment',
                user: {
                  name: c.user?.name || 'Usuário',
                  avatar: c.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
                },
                content: `comentou: "${c.content.substring(0, 30)}${c.content.length > 30 ? '...' : ''}"`,
                time: c.created_at ? new Date(c.created_at).toLocaleDateString('pt-BR') : 'Recentemente',
                thumbnail: c.posts?.image,
                badge: 'COMENTÁRIO',
                created_at: c.created_at || new Date().toISOString()
              }));
            allNotifications = [...allNotifications, ...commentNotifications];
          }
        } catch (e) {
          console.error('Error fetching comment notifications:', e);
        }
      }

      // Sort all notifications by date
      allNotifications.sort((a: any, b: any) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
      
      console.log('Total notifications aggregated:', allNotifications.length);
      setNotifications(allNotifications);

      // Calculate unread count
      const lastSeen = localStorage.getItem('last_seen_notification_time');
      if (lastSeen) {
        const lastSeenTime = new Date(lastSeen).getTime();
        const unread = allNotifications.filter(n => {
          const nTime = n.created_at ? new Date(n.created_at).getTime() : 0;
          return nTime > lastSeenTime;
        }).length;
        setUnreadNotificationsCount(unread);
      } else {
        setUnreadNotificationsCount(allNotifications.length);
      }

      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
      } else if (messagesData) {
        // Group messages by conversation (the other person)
        const conversationsMap = new Map<string, any>();
        
        messagesData.forEach((m: any) => {
          const otherPerson = m.sender_id === user.id ? m.receiver : m.sender;
          if (!otherPerson) return;
          
          if (!conversationsMap.has(otherPerson.id)) {
            let lastMsgText = m.content;
            if (!lastMsgText && m.media_url) {
              if (m.media_type === 'image') lastMsgText = '📷 Foto';
              else if (m.media_type === 'video') lastMsgText = '🎥 Vídeo';
              else if (m.media_type === 'audio') lastMsgText = '🎤 Áudio';
            }

            conversationsMap.set(otherPerson.id, {
              id: m.id,
              user: otherPerson,
              lastMessage: lastMsgText,
              time: formatRelativeTime(m.created_at),
              unreadCount: m.sender_id !== user.id && !m.is_read ? 1 : 0,
              created_at: m.created_at,
              isOnline: false // Could be implemented with presence
            });
          } else {
            const conv = conversationsMap.get(otherPerson.id);
            if (m.sender_id !== user.id && !m.is_read) {
              conv.unreadCount += 1;
            }
          }
        });

        setMessages(Array.from(conversationsMap.values()));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
      setLoading(false);
    }
  }, [refreshKey, screen]);

  React.useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, fetchData]);

  // Real-time updates for notifications
  React.useEffect(() => {
    if (!isLoggedIn) return;

    const channel = supabase
      .channel('activity-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'post_likes' },
        () => {
          console.log('Real-time: Like detected, refreshing data');
          fetchData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'post_comments' },
        () => {
          console.log('Real-time: Comment detected, refreshing data');
          fetchData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payments' },
        () => {
          console.log('Real-time: Payment detected, refreshing data');
          fetchData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        () => {
          console.log('Real-time: Notification detected, refreshing data');
          fetchData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        () => {
          console.log('Real-time: Message detected, refreshing data');
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoggedIn, fetchData]);

  // Clear unread notifications when viewing activity screen
  React.useEffect(() => {
    if (screen === 'activity' && notifications.length > 0) {
      setUnreadNotificationsCount(0);
      const mostRecent = notifications[0].created_at || new Date().toISOString();
      localStorage.setItem('last_seen_notification_time', mostRecent);
    }
  }, [screen, notifications]);

  const handleViewProfile = async (creatorId: string) => {
    try {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', creatorId).single();
      if (profile) {
        setPublicCreator(profile as any);
        // Fetch posts for this creator
        const { data: posts } = await supabase.from('posts').select('*, creator:profiles(*)').eq('creator_id', creatorId).order('created_at', { ascending: false });
        if (posts) setPublicPosts(posts as any);
        setScreen('public-profile');
      }
    } catch (err) {
      console.error('Error viewing profile:', err);
    }
  };

  const handleSubscribe = (targetCreator: Creator, post?: Post) => {
    setPublicCreator(targetCreator);
    setSelectedPostForPayment(post || null);
    if (isLoggedIn) {
      setScreen('payment');
    } else {
      setScreen('register');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta postagem?')) return;
    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) throw error;
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Erro ao excluir postagem.');
    }
  };

  const handleUpdatePost = async (postId: string, newCaption: string, isLocked: boolean) => {
    try {
      const { error } = await supabase.from('posts').update({ caption: newCaption, is_locked: isLocked }).eq('id', postId);
      if (error) throw error;
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, caption: newCaption, isLocked, hasAccess: p.hasAccess } : p));
      setEditingPost(null);
    } catch (err) {
      console.error('Error updating post:', err);
      alert('Erro ao atualizar postagem.');
    }
  };

  const handleLikePost = async (postId: string, isLiked: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (isLiked) {
        const { error } = await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
        if (error) throw error;
        console.log('Unlike successful for post:', postId);
      } else {
        const { error } = await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
        if (error) {
          if (error.code === '23505') {
            console.log('User already liked this post');
          } else {
            throw error;
          }
        }
        console.log('Like successful for post:', postId);
      }
      // Refresh data to update counts and notifications
      fetchData();
    } catch (err: any) {
      console.error('Error liking post:', err);
      if (err.code === 'PGRST116' || err.message?.includes('relation "public.post_likes" does not exist')) {
        alert('Erro: As tabelas de curtidas não foram criadas no banco de dados. Por favor, execute o script SQL no painel do Supabase.');
      } else {
        alert('Erro ao processar curtida: ' + (err.message || 'Erro desconhecido'));
      }
    }
  };

  const handleCommentPost = async (postId: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('post_comments').insert({ post_id: postId, user_id: user.id, content });
      if (error) throw error;
      console.log('Comment successful for post:', postId);
      
      // Refresh data to update counts and notifications
      fetchData();
    } catch (err: any) {
      console.error('Error commenting on post:', err);
      if (err.code === 'PGRST116' || err.message?.includes('relation "public.post_comments" does not exist')) {
        alert('Erro: As tabelas de comentários não foram criadas no banco de dados. Por favor, execute o script SQL no painel do Supabase.');
      } else {
        alert('Erro ao enviar comentário: ' + (err.message || 'Erro desconhecido'));
      }
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!confirm('Tem certeza que deseja excluir este story?')) return;
    try {
      const { error } = await supabase.from('stories').delete().eq('id', storyId);
      if (error) throw error;
      setStories(prev => prev.filter(s => s.id !== storyId));
    } catch (err) {
      console.error('Error deleting story:', err);
      alert('Erro ao excluir story.');
    }
  };

  // Save screen to localStorage whenever it changes
  React.useEffect(() => {
    if (isLoggedIn && !['login', 'register', 'public-profile'].includes(screen)) {
      localStorage.setItem('novinha_screen', screen);
    }
  }, [screen, isLoggedIn]);

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
        setUserEmail(session.user.email || null);
        setScreen(prev => {
          if (['login', 'register'].includes(prev)) {
            const saved = localStorage.getItem('novinha_screen');
            return (saved as Screen) || 'feed';
          }
          return prev;
        });
      }
      // Don't set loading false here, wait for fetchData if logged in
      if (!session) setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        // Check if profile exists for OAuth users
        const { data: profiles } = await supabase.from('profiles').select('id').eq('id', session.user.id);
        
        if (!profiles || profiles.length === 0) {
          console.log('OAuth login: Profile not found, creating one...');
          await supabase.from('profiles').insert({
            id: session.user.id,
            name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Usuário',
            username: (session.user.email?.split('@')[0] || 'user') + Math.floor(Math.random() * 1000),
            avatar: session.user.user_metadata.avatar_url || `https://picsum.photos/seed/${session.user.id}/400`,
            bio: 'Novo criador no pedaço!',
            stats: { posts: '0', followers: '0', likes: '0' },
            is_verified: false
          });
        }

        setIsLoggedIn(true);
        setUserEmail(session.user.email || null);
        setScreen(prev => {
          if (['login', 'register'].includes(prev)) {
            const saved = localStorage.getItem('novinha_screen');
            return (saved as Screen) || 'feed';
          }
          return prev;
        });
      } else {
        setIsLoggedIn(false);
        setScreen('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('u');
    
    if (username) {
      const fetchPublicProfile = async () => {
        const { data: profile } = await supabase.from('profiles').select('*').eq('username', username).single();
        if (profile) {
          setPublicCreator(profile as any);
          let subscribedCreatorIds = new Set();
          let purchasedPostIds = new Set();
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
             const { data: userPayments } = await supabase
              .from('payments')
              .select('creator_id, post_id')
              .eq('user_id', session.user.id)
              .eq('status', 'approved');
             subscribedCreatorIds = new Set(userPayments?.filter(p => !p.post_id).map(p => p.creator_id) || []);
             purchasedPostIds = new Set(userPayments?.filter(p => p.post_id).map(p => p.post_id) || []);
          }

          const { data: posts, error: postsError } = await supabase.from('posts').select('*, creator:profiles(*), post_likes(user_id), post_comments(id)').eq('creator_id', profile.id).order('created_at', { ascending: false });
          
          if (postsError) {
            console.error('Error fetching public posts with likes/comments:', postsError);
            const { data: fallbackPosts } = await supabase.from('posts').select('*, creator:profiles(*)').eq('creator_id', profile.id).order('created_at', { ascending: false });
            if (fallbackPosts) {
              setPublicPosts(fallbackPosts.map((p: any) => ({
                ...p,
                isLocked: p.is_locked,
                hasAccess: session?.user?.id === p.creator_id ? true : (subscribedCreatorIds.has(p.creator_id) || purchasedPostIds.has(p.id) ? true : !p.is_locked),
                isVideo: p.is_video,
                likesCount: 0,
                commentsCount: 0,
                isLikedByMe: false
              })) as any);
            }
          } else if (posts) {
            setPublicPosts(posts.map((p: any) => ({
              ...p,
              isLocked: p.is_locked,
              hasAccess: session?.user?.id === p.creator_id ? true : (subscribedCreatorIds.has(p.creator_id) || purchasedPostIds.has(p.id) ? true : !p.is_locked),
              isVideo: p.is_video,
              likesCount: p.post_likes?.length || 0,
              commentsCount: p.post_comments?.length || 0,
              isLikedByMe: p.post_likes?.some((l: any) => l.user_id === session?.user?.id)
            })) as any);
          }
          setScreen('public-profile');
        }
      };
      fetchPublicProfile();
    }
  }, []);

  // Expose setScreen globally for the VIP button in ScreenProfile
  React.useEffect(() => {
    (window as any).setScreen = setScreen;
  }, []);

  // Audio unlocker for iOS
  React.useEffect(() => {
    const unlock = () => {
      // Create a silent buffer to unlock audio
      const audio = new Audio();
      audio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
      audio.play().then(() => {
        console.log("Audio unlocked successfully");
      }).catch((e) => {
        console.warn("Audio unlock failed:", e);
      });
      
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('click', unlock);
    window.addEventListener('touchstart', unlock);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <div className="text-primary font-black animate-pulse text-xl tracking-widest mb-8">CARREGANDO...</div>
        
        {showResetButton && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xs">
            <p className="text-xs text-on-surface/40 font-bold uppercase tracking-widest mb-6 leading-relaxed">
              O carregamento está demorando mais que o esperado. Isso pode ser um problema de cache ou sessão antiga.
            </p>
            <button 
              onClick={handleReset}
              className="w-full py-4 bg-primary/5 text-primary font-black rounded-2xl border border-primary/10 active:scale-95 transition-all text-[10px] uppercase tracking-widest"
            >
              Limpar Dados e Sair
            </button>
          </div>
        )}
      </div>
    );
  }

  const renderScreen = () => {
    if (!isLoggedIn) {
      if (screen === 'public-profile' && publicCreator) {
        return (
          <ScreenPublicProfile 
            creator={publicCreator} 
            posts={publicPosts} 
            stories={stories}
            onSubscribe={() => {
              if (isLoggedIn) {
                alert('Você já está logado! Processando assinatura...');
              } else {
                setScreen('register');
              }
            }} 
            onMessage={() => setScreen('register')}
            isLoggedIn={isLoggedIn}
          />
        );
      }
      if (screen === 'register') {
        return <ScreenRegister onRegister={() => setScreen('feed')} onNavigateToLogin={() => setScreen('login')} />;
      }
      return <ScreenLogin onLogin={() => setScreen('feed')} onNavigateToRegister={() => setScreen('register')} />;
    }

    switch (screen) {
      case 'feed': return creator ? (
        <ScreenFeed 
          posts={posts} 
          stories={stories.filter(s => s.creator_id === creator.id)} 
          onStoryUpload={handleStoryUpload} 
          creator={creator} 
          onDeletePost={handleDeletePost}
          onUpdatePost={handleUpdatePost}
          onDeleteStory={handleDeleteStory}
          onSubscribe={handleSubscribe}
          isMaster={isMaster}
          onLikePost={handleLikePost}
          onCommentPost={handleCommentPost}
          onViewProfile={handleViewProfile}
        />
      ) : null;
      case 'profile': return creator ? (
        <ScreenProfile 
          onEdit={() => setScreen('edit-profile')} 
          creator={creator} 
          onLogout={() => supabase.auth.signOut()} 
          posts={posts}
          onDeletePost={handleDeletePost}
          onUpdatePost={handleUpdatePost}
          onSubscribe={(post) => handleSubscribe(creator, post)}
          stories={stories}
          onDeleteStory={handleDeleteStory}
          isMaster={isMaster}
          onLikePost={handleLikePost}
          onCommentPost={handleCommentPost}
          onMessage={(c) => {
            setSelectedRecipient(c);
            setScreen('chat');
          }}
        />
      ) : null;
      case 'public-profile': 
        return publicCreator ? (
          <ScreenPublicProfile 
            creator={publicCreator} 
            posts={publicPosts} 
            stories={stories}
            onSubscribe={(post) => handleSubscribe(publicCreator, post)} 
            onLikePost={handleLikePost}
            onCommentPost={handleCommentPost}
            onMessage={(c) => {
              setSelectedRecipient(c);
              setScreen('chat');
            }}
            isLoggedIn={isLoggedIn}
          />
        ) : (
          <ScreenFeed 
            posts={posts} 
            stories={stories.filter(s => s.creator_id === creator.id)} 
            onStoryUpload={handleStoryUpload} 
            creator={creator} 
            onDeletePost={handleDeletePost}
            onUpdatePost={handleUpdatePost}
            onDeleteStory={handleDeleteStory}
            onSubscribe={handleSubscribe}
            isMaster={isMaster}
            onLikePost={handleLikePost}
            onCommentPost={handleCommentPost}
            onViewProfile={handleViewProfile}
            onForwardPost={(post) => setForwardingPost(post)}
          />
        );
      case 'activity': 
        console.log('Rendering Activity screen with', notifications.length, 'notifications');
        if (isMaster) {
          return <ScreenActivity notifications={notifications} onRefresh={fetchData} />;
        } else {
          return <ScreenMessages messages={messages} isMaster={isMaster} onMessagesRead={() => setRefreshKey(prev => prev + 1)} />;
        }
      case 'messages': return <ScreenMessages messages={messages} isMaster={isMaster} onMessagesRead={() => setRefreshKey(prev => prev + 1)} />;
      case 'wallet': return <ScreenWallet onBack={() => setScreen('feed')} isMaster={isMaster} />;
      case 'subscriptions': return <ScreenSubscriptions onBack={() => setScreen('feed')} />;
      case 'edit-profile': 
        if (!creator) return null;
        return <ScreenEditProfile onBack={() => setScreen('profile')} creator={creator} onProfileUpdated={() => setRefreshKey(prev => prev + 1)} />;
      case 'create-post': return <ScreenCreatePost onBack={() => setScreen('feed')} onPostCreated={() => { setRefreshKey(prev => prev + 1); setScreen('feed'); }} />;
      case 'payment': return <ScreenPayment onBack={() => setScreen('feed')} creator={publicCreator || creator} post={selectedPostForPayment} />;
      case 'chat': return selectedRecipient ? <ChatView recipient={selectedRecipient} onBack={() => setScreen('messages')} onMessagesRead={() => setRefreshKey(prev => prev + 1)} /> : null;
      default: return (
        <ScreenFeed 
          posts={posts} 
          stories={stories.filter(s => s.creator_id === creator.id)} 
          onStoryUpload={handleStoryUpload} 
          creator={creator} 
          onDeletePost={handleDeletePost}
          onUpdatePost={handleUpdatePost}
          onDeleteStory={handleDeleteStory}
          onSubscribe={handleSubscribe}
          isMaster={isMaster}
          onLikePost={handleLikePost}
          onCommentPost={handleCommentPost}
          onViewProfile={handleViewProfile}
          onForwardPost={(post) => setForwardingPost(post)}
        />
      );
    }
  };

  const getTitle = () => {
    if (screen === 'profile') return 'PERFIL';
    if (screen === 'activity') return isMaster ? 'ATIVIDADE' : 'CHAT';
    if (screen === 'messages') return 'MENSAGENS';
    if (screen === 'wallet') return 'CARTEIRA';
    if (screen === 'subscriptions') return 'ASSINATURAS';
    if (screen === 'edit-profile') return 'EDITAR';
    if (screen === 'create-post') return 'POSTAR';
    if (screen === 'payment') return 'ASSINAR';
    return 'Novinha do JOB MOC';
  };

  const showNav = isLoggedIn && !['edit-profile', 'create-post', 'public-profile', 'payment'].includes(screen);
  const showTopNav = (isLoggedIn || screen === 'public-profile' || screen === 'payment') && !['login', 'register'].includes(screen);

  const unreadMessagesCount = messages.reduce((acc, m) => acc + (m.unreadCount || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      {showTopNav && (
        <TopNav 
          title={screen === 'public-profile' ? (publicCreator?.name || 'PERFIL') : getTitle()} 
          showBack={['edit-profile', 'create-post', 'public-profile', 'payment'].includes(screen)} 
          onBack={() => {
            if (screen === 'public-profile') {
              if (isLoggedIn) setScreen('feed');
              else setScreen('login');
            } else if (screen === 'payment') {
              setScreen('feed');
            } else {
              setScreen(screen === 'edit-profile' ? 'profile' : 'feed');
            }
          }} 
          avatar={isLoggedIn ? creator?.avatar : publicCreator?.avatar}
          isMaster={isMaster}
          onMessageClick={() => setScreen('messages')}
          unreadCount={unreadMessagesCount}
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
        <BottomNav 
          active={screen} 
          onChange={setScreen} 
          isMaster={isMaster} 
          unreadCount={isMaster ? unreadNotificationsCount : unreadMessagesCount} 
        />
      )}
      {forwardingPost && (
        <ForwardModal 
          post={forwardingPost} 
          onClose={() => setForwardingPost(null)} 
          onForward={(recipient) => handleForwardPost(forwardingPost, recipient)} 
        />
      )}
    </div>
  );
}
