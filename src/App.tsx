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
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Cropper from 'react-easy-crop';
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

const POSTS: Post[] = [];

const NOTIFICATIONS: Notification[] = [];

const MESSAGES: Message[] = [];

// --- Components ---

const TopNav = ({ title = "Novinha do JOB MOC", showBack = false, onBack = () => {}, avatar }: { title?: string, showBack?: boolean, onBack?: () => void, avatar?: string }) => (
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

const ScreenWallet = ({ onBack, isMaster }: { onBack: () => void, isMaster: boolean }) => {
  const [balance, setBalance] = useState('R$ 45,00');
  const [loading, setLoading] = useState(false);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);

  // Mock data for demonstration since we don't have the tables yet
  React.useEffect(() => {
    if (isMaster) {
      setSubscribers([
        { id: '1', name: 'João Silva', username: 'joaosilva', plan: 'Mensal', date: '2026-03-29', avatar: 'https://i.pravatar.cc/150?u=1' },
        { id: '2', name: 'Maria Oliveira', username: 'maria_o', plan: 'Anual', date: '2026-03-28', avatar: 'https://i.pravatar.cc/150?u=2' },
      ]);
      setPurchases([
        { id: '1', name: 'Pedro Santos', username: 'pedros', item: 'Post Exclusivo', price: 'R$ 15,00', date: '2026-03-30', avatar: 'https://i.pravatar.cc/150?u=3' },
      ]);
    }
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
        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Saldo Disponível</p>
        <h2 className="text-5xl font-black text-on-surface tracking-tighter">{balance}</h2>
        <div className="mt-6 flex justify-center gap-2">
          <div className="px-4 py-1.5 bg-primary/10 rounded-full flex items-center gap-2">
            <Crown size={14} className="text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Membro VIP</span>
          </div>
        </div>
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
                      <img src={sub.avatar} alt={sub.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-sm text-on-surface">{sub.name}</p>
                        <p className="text-[10px] text-on-surface/60 font-medium">@{sub.username} • {sub.plan}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">Ativo</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface/60 px-1">Nenhum assinante ainda.</p>
            )}
          </section>

          <section className="space-y-4">
            <h3 className="font-bold text-lg text-on-surface px-1">Vendas de Conteúdo</h3>
            {purchases.length > 0 ? (
              <div className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
                {purchases.map((purchase, index) => (
                  <div key={purchase.id} className={`p-4 flex items-center justify-between ${index !== purchases.length - 1 ? 'border-b border-primary/5' : ''}`}>
                    <div className="flex items-center gap-3">
                      <img src={purchase.avatar} alt={purchase.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-sm text-on-surface">{purchase.name}</p>
                        <p className="text-[10px] text-on-surface/60 font-medium">Comprou: {purchase.item}</p>
                      </div>
                    </div>
                    <span className="font-black text-primary text-sm">{purchase.price}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface/60 px-1">Nenhuma venda ainda.</p>
            )}
          </section>
        </div>
      ) : (
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
      )}

      <section className="mt-12 bg-primary/5 p-6 rounded-3xl border border-primary/10">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="text-primary" size={20} />
          <h3 className="font-bold text-sm text-on-surface uppercase tracking-widest">Segurança Garantida</h3>
        </div>
        <p className="text-xs text-on-surface/60 leading-relaxed font-medium">
          Todas as transações são processadas de forma segura via Pix. Seus dados financeiros nunca são armazenados em nossos servidores.
        </p>
      </section>
    </div>
  );
};

const MASTER_EMAIL = 'mayconrubemx@gmail.com';

const BottomNav = ({ active, onChange, isMaster }: { active: Screen, onChange: (s: Screen) => void, isMaster: boolean }) => (
  <nav className="fixed bottom-0 w-full flex justify-around items-center px-4 py-3 bg-white border-t border-primary/5 z-50">
    <button onClick={() => onChange('feed')} className={`flex flex-col items-center gap-1 transition-all ${active === 'feed' ? 'text-primary' : 'text-on-surface/40'}`}>
      <Home size={24} />
      <span className="text-[10px] font-bold">Início</span>
    </button>
    <button onClick={() => onChange('wallet')} className={`flex flex-col items-center gap-1 transition-all ${active === 'wallet' ? 'text-primary' : 'text-on-surface/40'}`}>
      <CreditCard size={24} />
      <span className="text-[10px] font-bold">Carteira</span>
    </button>
    
    {isMaster && (
      <button onClick={() => onChange('create-post')} className={`p-2 bg-primary text-white rounded-full shadow-lg shadow-primary/20 transition-transform active:scale-90 ${active === 'create-post' ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
        <PlusCircle size={28} />
      </button>
    )}

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
            <div className="absolute bottom-0 md:relative md:bottom-auto w-full md:w-1/3 h-[50vh] md:h-full bg-white rounded-t-3xl md:rounded-none flex flex-col z-[105]">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold">Comentários</h3>
                <button onClick={() => setShowComments(false)} className="md:hidden">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments.map(c => (
                  <div key={c.id} className="flex gap-3">
                    <img src={c.user.avatar} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <p className="text-sm"><span className="font-bold mr-2">{c.user.name}</span>{c.content}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-100 flex gap-2">
                <input 
                  type="text" 
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Adicione um comentário..."
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
                  onKeyDown={e => e.key === 'Enter' && handleSendComment()}
                />
                <button onClick={handleSendComment} className="text-primary font-bold px-4">
                  Enviar
                </button>
              </div>
            </div>
          )}

          {!showComments && (
            <div className="absolute bottom-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
              <div className="flex items-center gap-3 mb-4">
                <img src={post.creator.avatar} className="w-10 h-10 rounded-full object-cover border border-white/20" referrerPolicy="no-referrer" />
                <div>
                  <p className="font-bold text-sm">{post.creator.name}</p>
                  <p className="text-[10px] text-white/60 uppercase tracking-widest">{post.time}</p>
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
  onCommentPost
}: { 
  posts: Post[], 
  stories: any[], 
  onStoryUpload: (file: File) => void, 
  creator: Creator,
  onDeletePost: (id: string) => void,
  onUpdatePost: (id: string, caption: string, isLocked: boolean) => void,
  onDeleteStory: (id: string) => void,
  onSubscribe: () => void,
  isMaster: boolean,
  onLikePost?: (id: string, isLiked: boolean) => void,
  onCommentPost?: (id: string, content: string) => void
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
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
                <img src={creator.avatar} className="w-16 h-16 rounded-full object-cover" referrerPolicy="no-referrer" />
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

    {/* Posts */}
    <div className="space-y-4 py-4">
      {posts.length > 0 ? (
        posts.map(post => {
          const isOwner = post.creator.id === creator.id;
          
          return (
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
                  <button 
                    onClick={onSubscribe}
                    className="w-full py-4 px-8 premium-gradient text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all text-[10px] uppercase tracking-[0.2em]"
                  >
                    ASSINAR POR {post.price || 'R$ 19,90'}
                  </button>
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
                <Send className="text-on-surface cursor-pointer" />
              </div>
              <Bookmark className="text-on-surface cursor-pointer" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold">{post.likesCount || 0} curtidas</p>
              <p className="text-sm text-on-surface/80 leading-relaxed">
                <span className="font-bold">{post.creator.name}</span> {post.caption}
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
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
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
      />
      <button 
        onClick={togglePlay}
        className="w-12 h-12 flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center shadow-md shadow-primary/20 active:scale-95 transition-all"
      >
        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
      </button>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-black uppercase tracking-widest text-primary">Boas-vindas</span>
          <Volume2 size={14} className="text-primary/60" />
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
  onCommentPost
}: { 
  onEdit: () => void, 
  creator: Creator, 
  onLogout: () => void, 
  posts: Post[],
  onDeletePost: (id: string) => void,
  onUpdatePost: (id: string, caption: string, isLocked: boolean) => void,
  onSubscribe: () => void,
  stories: any[],
  onDeleteStory: (id: string) => void,
  isMaster: boolean,
  onLikePost?: (id: string, isLiked: boolean) => void,
  onCommentPost?: (id: string, content: string) => void
}) => {
  const [activeTab, setActiveTab] = React.useState<'all' | 'exclusive'>('all');
  const myPosts = posts.filter(p => p.creator.id === creator.id).filter(p => activeTab === 'all' ? true : p.isLocked);
  const myStories = stories.filter(s => s.creator_id === creator.id);
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
        currentUserId={creator.id}
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
          <div 
            className="relative w-40 h-40 md:w-48 md:h-48 rounded-full p-[4px] story-ring bg-background shadow-2xl cursor-pointer"
            onClick={() => myStories.length > 0 && setActiveStoryIndex(0)}
          >
            <img src={creator.avatar} className="w-full h-full object-cover rounded-full border-4 border-white" referrerPolicy="no-referrer" />
            {myStories.length > 0 && (
              <div className="absolute inset-0 rounded-full border-4 border-primary animate-pulse pointer-events-none"></div>
            )}
          </div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">{creator.name}</h1>
        <p className="text-base text-primary font-bold mb-8">{creator.bio}</p>

        {creator.welcome_audio && (
          <WelcomeAudioPlayer audioUrl={creator.welcome_audio} />
        )}

        <div className="flex justify-center items-center gap-4 sm:gap-10 mb-10 py-6 px-4 sm:px-8 bg-white rounded-3xl shadow-sm max-w-md mx-auto border border-primary/5 overflow-hidden">
          <div className="text-center min-w-[60px]">
            <span className="block text-xl font-bold">{isMaster ? myPosts.length : '0'}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40">Posts</span>
          </div>
          <div className="w-px h-8 bg-primary/10 flex-shrink-0"></div>
          <div className="text-center min-w-[60px]">
            <span className="block text-xl font-bold">{isMaster ? creator.stats?.followers || '0' : '1'}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40">Seguidores</span>
          </div>
          <div className="w-px h-8 bg-primary/10 flex-shrink-0"></div>
          <div className="text-center min-w-[60px]">
            <span className="block text-xl font-bold">{isMaster ? creator.stats?.likes || '0' : '0'}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40">Curtidas</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 mb-10 max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            {isMaster && (
              <button onClick={onEdit} className="flex-1 py-4 premium-gradient text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs">
                Editar Perfil
              </button>
            )}
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
          
          {!isMaster && (
            <button 
              onClick={onSubscribe}
              className="w-full py-5 bg-black text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3"
            >
              <Crown size={20} className="text-yellow-400" fill="currentColor" />
              Seja Membro VIP
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
                    <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-white">
                      <Lock size={20} fill="white" className="drop-shadow-lg" />
                      <span className="text-[8px] font-black uppercase tracking-widest mt-1 drop-shadow-md">VIP</span>
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

const ScreenPublicProfile = ({ creator, posts, onSubscribe, stories, onLikePost, onCommentPost }: { creator: Creator, posts: Post[], onSubscribe: () => void, stories: any[], onLikePost?: (id: string, isLiked: boolean) => void, onCommentPost?: (id: string, content: string) => void }) => {
  const [activeTab, setActiveTab] = React.useState<'all' | 'exclusive'>('all');
  const myPosts = posts.filter(p => p.creator.id === creator.id).filter(p => activeTab === 'all' ? true : p.isLocked);
  const myStories = stories.filter(s => s.creator_id === creator.id);
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = React.useState<number | null>(null);
  
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
          <div 
            className="relative w-40 h-40 md:w-48 md:h-48 rounded-full p-[4px] story-ring bg-background shadow-2xl cursor-pointer"
            onClick={() => myStories.length > 0 && setActiveStoryIndex(0)}
          >
            <img src={creator.avatar} className="w-full h-full object-cover rounded-full border-4 border-white" referrerPolicy="no-referrer" />
            {myStories.length > 0 && (
              <div className="absolute inset-0 rounded-full border-4 border-primary animate-pulse pointer-events-none"></div>
            )}
          </div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">{creator.name}</h1>
        <p className="text-base text-primary font-bold mb-8">{creator.bio}</p>

        {creator.welcome_audio && (
          <WelcomeAudioPlayer audioUrl={creator.welcome_audio} />
        )}

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

        <div className="max-w-md mx-auto space-y-4 mb-12">
          <button 
            onClick={onSubscribe}
            className="w-full py-5 premium-gradient text-white font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3"
          >
            <Lock size={20} fill="white" />
            Assinar Agora
          </button>
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
                if (!post.hasAccess) onSubscribe();
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
                <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-white">
                  <Lock size={20} fill="white" className="drop-shadow-lg" />
                  <span className="text-[8px] font-black uppercase tracking-widest mt-1 drop-shadow-md">VIP</span>
                </div>
              )}
              {post.isLocked && post.hasAccess && (
                <div className="absolute top-2 right-2 bg-primary/90 backdrop-blur-md p-1.5 rounded-full shadow-lg z-10">
                  <Lock className="text-white" size={14} />
                </div>
              )}
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

  if (diffInSeconds < 60) return 'Agora mesmo';
  if (diffInSeconds < 3600) return `Há ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `Há ${Math.floor(diffInSeconds / 3600)} h`;
  if (diffInSeconds < 604800) return `Há ${Math.floor(diffInSeconds / 86400)} d`;
  return date.toLocaleDateString('pt-BR');
};

const ScreenActivity = ({ notifications }: { notifications: Notification[] }) => {
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
      <section className="mb-8 pt-8">
        <h2 className="text-4xl font-extrabold tracking-tight mb-1">Atividade</h2>
        <p className="text-on-surface/60 text-sm font-medium">Sua jornada criativa em tempo real.</p>
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
                      const url = await handleFileUpload(file, 'avatars');
                      if (url) setWelcomeAudio(url);
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
      <div className="w-full max-w-md space-y-12">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-4xl font-black text-primary tracking-tighter">Novinha +18</div>
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
          <div className="grid grid-cols-1 gap-4">
            <button 
              type="button"
              onClick={async () => {
                try {
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                      redirectTo: window.location.origin
                    }
                  });
                  if (error) throw error;
                } catch (err: any) {
                  setError(err.message || 'Erro ao entrar com Google');
                }
              }}
              className="flex items-center justify-center gap-2 bg-white border border-primary/5 py-4 rounded-2xl shadow-sm active:scale-95 transition-all"
            >
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
      <div className="w-full max-w-md space-y-10">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-4xl font-black text-primary tracking-tighter">Novinha do JOB MOC</div>
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

const ScreenPayment = ({ onBack, creator }: { onBack: () => void, creator: Creator | null }) => {
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
      const selectedPlanData = plans.find(p => p.id === selectedPlan);
      const amount = parseFloat(selectedPlanData?.price.replace('R$ ', '').replace(',', '.') || '0');

      const response = await fetch('/api/payments/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          description: `Assinatura ${selectedPlanData?.name} - ${creator.name}`,
          payerEmail: currentUser.email,
          userId: currentUser.id,
          creatorId: creator.id,
          planId: selectedPlan
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
            <img src={creator?.avatar} className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover" referrerPolicy="no-referrer" />
            <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full border-2 border-white">
              <Lock size={14} fill="white" />
            </div>
          </div>
          <h1 className="text-2xl font-black mb-1 uppercase tracking-tight">Assinar {creator?.name}</h1>
          <p className="text-xs font-bold text-on-surface/40 uppercase tracking-widest">Escolha seu plano de acesso</p>
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
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [creator, setCreator] = React.useState<Creator>(ELENA);
  const [publicCreator, setPublicCreator] = React.useState<Creator | null>(null);
  const [publicPosts, setPublicPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [dbStatus, setDbStatus] = React.useState<'checking' | 'connected' | 'error'>('checking');
  const [editingPost, setEditingPost] = React.useState<Post | null>(null);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);

  const isMaster = userEmail === MASTER_EMAIL;

  const fetchData = React.useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile
      const { data: profileData, error: profileFetchError } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      
      if (profileData) {
        setCreator(profileData as any);
        // If profile exists but email is missing, update it
        if (!profileData.email && user.email) {
          console.log('Updating profile with missing email:', user.email);
          await supabase.from('profiles').update({ email: user.email }).eq('id', user.id);
        }
      } else if (profileFetchError && profileFetchError.code === 'PGRST116') {
        // PGRST116 is "The result contains 0 rows" for .single()
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
        .select('creator_id')
        .eq('user_id', user.id)
        .eq('status', 'approved');

      const subscribedCreatorIds = new Set(userPayments?.map(p => p.creator_id) || []);

      // Fetch posts
      // Try to find master profile by email. If it fails, masterId will be undefined and we show all posts.
      let masterId: string | undefined = undefined;
      try {
        const { data: masterProfile } = await supabase.from('profiles').select('id').eq('email', MASTER_EMAIL).single();
        masterId = masterProfile?.id;
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
          
          console.log(`Filtered to ${filteredPosts.length} posts (masterId: ${masterId})`);

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
        
        console.log(`Filtered to ${filteredPosts.length} posts (masterId: ${masterId})`);

        setPosts(filteredPosts.map((p: any) => ({
          ...p,
          isLocked: p.is_locked,
          hasAccess: p.creator_id === user.id ? true : (subscribedCreatorIds.has(p.creator_id) ? true : !p.is_locked),
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
          .select('*, user:profiles!user_id(name, avatar, is_verified)')
          .eq('user_id', user.id) // Only for the current user
          .order('created_at', { ascending: false });
        
        if (notifErr) {
          console.log('Notifications table might not exist or query failed:', notifErr.message);
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
          .select('*, user:profiles!user_id(name, avatar, is_verified)')
          .eq('creator_id', user.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (payErr) {
          console.error('Error fetching payments for notifications:', payErr);
        } else if (paymentsData) {
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
      console.log(`User has ${myPostIds.length} posts for notification filtering`);

      // Fetch likes for notifications
      if (myPostIds.length > 0) {
        try {
          const { data: likesData, error: likesErr } = await supabase
            .from('post_likes')
            .select('*, user:profiles!user_id(name, avatar, is_verified), posts!post_id(image)')
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
                  avatar: l.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
                  isVerified: l.user?.is_verified
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
            .select('*, user:profiles!user_id(name, avatar, is_verified), posts!post_id(image)')
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
                  avatar: c.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
                  isVerified: c.user?.is_verified
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
      
      setNotifications(allNotifications);

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
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
    }
  }, [refreshKey, screen]);

  React.useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, fetchData]);

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
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
             const { data: userPayments } = await supabase
              .from('payments')
              .select('creator_id')
              .eq('user_id', session.user.id)
              .eq('status', 'approved');
             subscribedCreatorIds = new Set(userPayments?.map(p => p.creator_id) || []);
          }

          const { data: posts, error: postsError } = await supabase.from('posts').select('*, creator:profiles(*), post_likes(user_id), post_comments(id)').eq('creator_id', profile.id).order('created_at', { ascending: false });
          
          if (postsError) {
            console.error('Error fetching public posts with likes/comments:', postsError);
            const { data: fallbackPosts } = await supabase.from('posts').select('*, creator:profiles(*)').eq('creator_id', profile.id).order('created_at', { ascending: false });
            if (fallbackPosts) {
              setPublicPosts(fallbackPosts.map((p: any) => ({
                ...p,
                isLocked: p.is_locked,
                hasAccess: session?.user?.id === p.creator_id ? true : (subscribedCreatorIds.has(p.creator_id) ? true : !p.is_locked),
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
              hasAccess: session?.user?.id === p.creator_id ? true : (subscribedCreatorIds.has(p.creator_id) ? true : !p.is_locked),
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary font-bold animate-pulse">CARREGANDO...</div>
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
          />
        );
      }
      if (screen === 'register') {
        return <ScreenRegister onRegister={() => setScreen('feed')} onNavigateToLogin={() => setScreen('login')} />;
      }
      return <ScreenLogin onLogin={() => setScreen('feed')} onNavigateToRegister={() => setScreen('register')} />;
    }

    switch (screen) {
      case 'feed': return (
        <ScreenFeed 
          posts={posts} 
          stories={stories.filter(s => s.creator_id === creator.id)} 
          onStoryUpload={handleStoryUpload} 
          creator={creator} 
          onDeletePost={handleDeletePost}
          onUpdatePost={handleUpdatePost}
          onDeleteStory={handleDeleteStory}
          onSubscribe={() => setScreen('payment')}
          isMaster={isMaster}
          onLikePost={handleLikePost}
          onCommentPost={handleCommentPost}
        />
      );
      case 'profile': return (
        <ScreenProfile 
          onEdit={() => setScreen('edit-profile')} 
          creator={creator} 
          onLogout={() => supabase.auth.signOut()} 
          posts={posts}
          onDeletePost={handleDeletePost}
          onUpdatePost={handleUpdatePost}
          onSubscribe={() => setScreen('payment')}
          stories={stories}
          onDeleteStory={handleDeleteStory}
          isMaster={isMaster}
          onLikePost={handleLikePost}
          onCommentPost={handleCommentPost}
        />
      );
      case 'public-profile': 
        return publicCreator ? (
          <ScreenPublicProfile 
            creator={publicCreator} 
            posts={publicPosts} 
            stories={stories}
            onSubscribe={() => {
              if (isLoggedIn) {
                setScreen('payment');
              } else {
                setScreen('register');
              }
            }} 
            onLikePost={handleLikePost}
            onCommentPost={handleCommentPost}
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
            onSubscribe={() => setScreen('payment')}
            isMaster={isMaster}
            onLikePost={handleLikePost}
            onCommentPost={handleCommentPost}
          />
        );
      case 'activity': return <ScreenActivity notifications={notifications} />;
      case 'messages': return <ScreenMessages messages={messages} />;
      case 'wallet': return <ScreenWallet onBack={() => setScreen('feed')} isMaster={isMaster} />;
      case 'edit-profile': return <ScreenEditProfile onBack={() => setScreen('profile')} creator={creator} onProfileUpdated={() => setRefreshKey(prev => prev + 1)} />;
      case 'create-post': return <ScreenCreatePost onBack={() => setScreen('feed')} onPostCreated={() => { setRefreshKey(prev => prev + 1); setScreen('feed'); }} />;
      case 'payment': return <ScreenPayment onBack={() => setScreen('feed')} creator={publicCreator || creator} />;
      default: return (
        <ScreenFeed 
          posts={posts} 
          stories={stories.filter(s => s.creator_id === creator.id)} 
          onStoryUpload={handleStoryUpload} 
          creator={creator} 
          onDeletePost={handleDeletePost}
          onUpdatePost={handleUpdatePost}
          onDeleteStory={handleDeleteStory}
          onSubscribe={() => setScreen('payment')}
          isMaster={isMaster}
          onLikePost={handleLikePost}
          onCommentPost={handleCommentPost}
        />
      );
    }
  };

  const getTitle = () => {
    if (screen === 'profile') return 'PERFIL';
    if (screen === 'activity') return 'ATIVIDADE';
    if (screen === 'messages') return 'MENSAGENS';
    if (screen === 'wallet') return 'CARTEIRA';
    if (screen === 'edit-profile') return 'EDITAR';
    if (screen === 'create-post') return 'POSTAR';
    if (screen === 'payment') return 'ASSINAR';
    return 'Novinha do JOB MOC';
  };

  const showNav = isLoggedIn && !['edit-profile', 'create-post', 'public-profile', 'payment'].includes(screen);
  const showTopNav = (isLoggedIn || screen === 'public-profile' || screen === 'payment') && !['login', 'register'].includes(screen);

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
          avatar={isLoggedIn ? creator.avatar : publicCreator?.avatar}
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
        <BottomNav active={screen} onChange={setScreen} isMaster={isMaster} />
      )}
    </div>
  );
}
