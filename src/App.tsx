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
  Lock, 
  Play, 
  Pause,
  Volume2,
  Home, 
  Compass, 
  PlusCircle, 
  Bell, 
  User, 
  UserPlus,
  Gift,
  ArrowLeft,
  ArrowRight,
  MoreHorizontal,
  Share2,
  CheckCircle2,
  Mail,
  Eye,
  EyeOff,
  Star,
  ChevronRight,
  ChevronDown,
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
  Video as VideoIcon,
  Settings,
  Edit2,
  Instagram,
  Twitter,
  MapPin,
  Music,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Shield,
  PieChart,
  List,
  Timer,
  Clock4,
  House,
  AlertCircle,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Cropper from 'react-easy-crop';
import { Screen, Post, Notification, Message, Creator, ChatMessage } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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

const SecureMedia = ({ 
  mediaPath,
  isVideo = false,
  className, 
  controls = false, 
  autoPlay = false, 
  muted = false, 
  playsInline = false,
  previewUrl = null,
  bucket = 'posts',
  alt = ""
}: { 
  mediaPath: string | null,
  isVideo?: boolean,
  className?: string, 
  controls?: boolean, 
  autoPlay?: boolean, 
  muted?: boolean, 
  playsInline?: boolean,
  previewUrl?: string | null,
  bucket?: string,
  alt?: string
}) => {
  const [url, setUrl] = useState<string | null>(previewUrl);
  const [loading, setLoading] = useState(!previewUrl && !!mediaPath);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (previewUrl) {
      setUrl(previewUrl);
      setLoading(false);
      return;
    }

    const fetchUrl = async () => {
      if (!mediaPath) {
        setLoading(false);
        return;
      }

      // If it's a full URL (legacy), use it directly
      if (mediaPath.startsWith('http')) {
        setUrl(mediaPath);
        setLoading(false);
        return;
      }

      try {
        const { data, error: signedError } = await supabase.storage
          .from(bucket)
          .createSignedUrl(mediaPath, 3600); // 1 hour for chat/posts

        if (signedError) throw signedError;
        setUrl(data.signedUrl);
      } catch (err) {
        console.error('Error fetching signed URL:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUrl();
  }, [mediaPath, previewUrl, bucket]);

  if (loading) {
    return (
      <div className={`${className} bg-black flex items-center justify-center`}>
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !url) {
    return (
      <div className={`${className} bg-black/90 flex flex-col items-center justify-center p-4 text-center text-white`}>
        <Lock size={24} className="text-white/40 mb-2" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Conteúdo Protegido</p>
      </div>
    );
  }

  if (isVideo) {
    return (
      <video 
        src={`${url}#t=0.001`} 
        className={className} 
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        playsInline={playsInline}
        preload="metadata"
        crossOrigin="anonymous"
      />
    );
  }

  return (
    <img 
      src={url} 
      className={className} 
      referrerPolicy="no-referrer" 
      alt={alt}
    />
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
  onSettingsClick,
  onProfileClick,
  onNotificationsClick,
  unreadCount = 0,
  unreadNotifications = 0
}: { 
  title?: string, 
  showBack?: boolean, 
  onBack?: () => void, 
  avatar?: string,
  isMaster?: boolean,
  onMessageClick?: () => void,
  onSettingsClick?: () => void,
  onProfileClick?: () => void,
  onNotificationsClick?: () => void,
  unreadCount?: number,
  unreadNotifications?: number
}) => (
  <header className="fixed top-0 w-full flex justify-between items-center px-6 py-2 glass-header z-50">
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
            className="h-10 w-auto object-contain" 
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="text-xl font-black text-primary tracking-tighter leading-none">NUDLYE</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      {!isMaster && onNotificationsClick && (
        <button onClick={onNotificationsClick} className="text-on-surface/60 hover:text-primary transition-colors relative">
          <Bell size={24} strokeWidth={1.5} />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
              {unreadNotifications > 99 ? '99+' : unreadNotifications}
            </span>
          )}
        </button>
      )}
      {isMaster && onSettingsClick && (
        <button onClick={onSettingsClick} className="text-on-surface/60 hover:text-primary transition-colors relative">
          <Settings size={24} strokeWidth={1.5} />
        </button>
      )}
      {isMaster && onMessageClick && (
        <button onClick={onMessageClick} className="text-on-surface/60 hover:text-primary transition-colors relative">
          <MessageCircle size={24} strokeWidth={1.5} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      )}
      <button 
        onClick={onProfileClick}
        className="w-9 h-9 rounded-full overflow-hidden border border-primary/10 active:scale-95 transition-transform"
      >
        <img src={avatar || ELENA.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </button>
    </div>
  </header>
);

const ScreenCreatorPlans = ({ onBack, profile }: { onBack: () => void, profile: any }) => {
  const [activeTab, setActiveTab] = useState<'assinaturas' | 'atendimento'>('assinaturas');
  const [plans, setPlans] = useState<any[]>([]);
  const [atendimentos, setAtendimentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  const [editingAtendimento, setEditingAtendimento] = useState<any | null>(null);

  React.useEffect(() => {
    if (profile) {
      const existingPlans = profile.stats?.plans || [
        { id: 'monthly', name: 'Mensal', price: '29.90', description: 'Acesso total por 30 dias', duration: 30, category: 'Assinaturas' },
        { id: 'quarterly', name: 'Trimestral', price: '79.90', description: 'Economize 15% - 90 dias', badge: 'Popular', duration: 90, category: 'Promoções' },
        { id: 'yearly', name: 'Anual', price: '249.90', description: 'Economize 30% - 365 dias', badge: 'Melhor Valor', duration: 365, category: 'Promoções' },
      ];
      setPlans(existingPlans);
      setAtendimentos(profile.atendimento_presencial || []);
      setLoading(false);
    }
  }, [profile]);

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    
    setSaving(true);
    try {
      let updatedPlans;
      if (editingPlan.isNew) {
        const { isNew, ...planData } = editingPlan;
        updatedPlans = [...plans, { ...planData, id: Date.now().toString() }];
      } else {
        updatedPlans = plans.map(p => p.id === editingPlan.id ? editingPlan : p);
      }

      const updatedStats = { ...(profile.stats || {}), plans: updatedPlans };
      
      const { error } = await supabase
        .from('profiles')
        .update({ stats: updatedStats })
        .eq('id', profile.id);

      if (error) throw error;
      
      setPlans(updatedPlans);
      setEditingPlan(null);
    } catch (err) {
      console.error('Error saving plan:', err);
      alert('Erro ao salvar plano.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este plano?')) return;
    
    setSaving(true);
    try {
      const updatedPlans = plans.filter(p => p.id !== id);
      const updatedStats = { ...(profile.stats || {}), plans: updatedPlans };
      
      const { error } = await supabase
        .from('profiles')
        .update({ stats: updatedStats })
        .eq('id', profile.id);

      if (error) throw error;
      
      setPlans(updatedPlans);
    } catch (err) {
      console.error('Error deleting plan:', err);
      alert('Erro ao excluir plano.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAtendimento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAtendimento) return;
    
    setSaving(true);
    try {
      let updatedAtendimentos;
      if (editingAtendimento.isNew) {
        const { isNew, ...atendimentoData } = editingAtendimento;
        updatedAtendimentos = [...atendimentos, { ...atendimentoData, id: Date.now().toString() }];
      } else {
        updatedAtendimentos = atendimentos.map(a => a.id === editingAtendimento.id ? editingAtendimento : a);
      }

      const { error } = await supabase
        .from('profiles')
        .update({ atendimento_presencial: updatedAtendimentos })
        .eq('id', profile.id);

      if (error) throw error;
      
      setAtendimentos(updatedAtendimentos);
      setEditingAtendimento(null);
    } catch (err) {
      console.error('Error saving atendimento:', err);
      alert('Erro ao salvar atendimento.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAtendimento = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este atendimento?')) return;
    
    setSaving(true);
    try {
      const updatedAtendimentos = atendimentos.filter(a => a.id !== id);
      
      const { error } = await supabase
        .from('profiles')
        .update({ atendimento_presencial: updatedAtendimentos })
        .eq('id', profile.id);

      if (error) throw error;
      
      setAtendimentos(updatedAtendimentos);
    } catch (err) {
      console.error('Error deleting atendimento:', err);
      alert('Erro ao excluir atendimento.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="pt-20 pb-24 px-6 max-w-2xl mx-auto text-center">Carregando...</div>;

  return (
    <div className="pt-20 pb-24 px-6 max-w-2xl mx-auto">
      <section className="mb-8 pt-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-1">Planos & Serviços</h1>
          <p className="text-on-surface/60 text-sm font-medium">Gerencie suas assinaturas e atendimentos.</p>
        </div>
        <button 
          onClick={() => {
            if (activeTab === 'assinaturas') {
              setEditingPlan({ isNew: true, name: '', price: '', description: '', badge: '', duration: 30, category: 'Assinaturas' });
            } else {
              setEditingAtendimento({ isNew: true, duration: 15, price: '', isPopular: false });
            }
          }}
          className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md"
        >
          + Novo {activeTab === 'assinaturas' ? 'Plano' : 'Atendimento'}
        </button>
      </section>

      <div className="flex gap-4 mb-8 border-b border-primary/10 pb-2">
        <button 
          onClick={() => setActiveTab('assinaturas')}
          className={`font-bold text-sm pb-2 border-b-2 transition-colors ${activeTab === 'assinaturas' ? 'border-primary text-primary' : 'border-transparent text-on-surface/40 hover:text-on-surface/80'}`}
        >
          Assinaturas
        </button>
        <button 
          onClick={() => setActiveTab('atendimento')}
          className={`font-bold text-sm pb-2 border-b-2 transition-colors ${activeTab === 'atendimento' ? 'border-primary text-primary' : 'border-transparent text-on-surface/40 hover:text-on-surface/80'}`}
        >
          Atendimento Presencial
        </button>
      </div>

      {activeTab === 'assinaturas' && (
        <>
          {editingPlan ? (
            <div className="bg-white p-6 rounded-3xl border border-primary/10 shadow-sm mb-8">
              <h2 className="text-xl font-black mb-4">{editingPlan.isNew ? 'Novo Plano' : 'Editar Plano'}</h2>
              <form onSubmit={handleSavePlan} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface/60 mb-1">Nome do Plano</label>
                  <input 
                    required
                    value={editingPlan.name}
                    onChange={e => setEditingPlan({...editingPlan, name: e.target.value})}
                    className="w-full bg-surface border border-primary/10 rounded-xl px-4 py-3 font-bold"
                    placeholder="Ex: Mensal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface/60 mb-1">Preço (R$)</label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    value={editingPlan.price}
                    onChange={e => setEditingPlan({...editingPlan, price: e.target.value})}
                    className="w-full bg-surface border border-primary/10 rounded-xl px-4 py-3 font-bold"
                    placeholder="Ex: 29.90"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface/60 mb-1">Descrição</label>
                  <input 
                    required
                    value={editingPlan.description}
                    onChange={e => setEditingPlan({...editingPlan, description: e.target.value})}
                    className="w-full bg-surface border border-primary/10 rounded-xl px-4 py-3 font-bold"
                    placeholder="Ex: Acesso total por 30 dias"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface/60 mb-1">Duração (Dias)</label>
                  <input 
                    required
                    type="number"
                    value={editingPlan.duration || ''}
                    onChange={e => setEditingPlan({...editingPlan, duration: parseInt(e.target.value)})}
                    className="w-full bg-surface border border-primary/10 rounded-xl px-4 py-3 font-bold"
                    placeholder="Ex: 30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface/60 mb-1">Badge (Opcional)</label>
                  <input 
                    value={editingPlan.badge || ''}
                    onChange={e => setEditingPlan({...editingPlan, badge: e.target.value})}
                    className="w-full bg-surface border border-primary/10 rounded-xl px-4 py-3 font-bold"
                    placeholder="Ex: Popular"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface/60 mb-1">Categoria</label>
                  <select 
                    value={editingPlan.category || 'Assinaturas'}
                    onChange={e => setEditingPlan({...editingPlan, category: e.target.value})}
                    className="w-full bg-surface border border-primary/10 rounded-xl px-4 py-3 font-bold"
                  >
                    <option value="Assinaturas">Assinaturas</option>
                    <option value="Promoções">Promoções</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setEditingPlan(null)}
                    className="flex-1 py-3 rounded-xl font-bold text-on-surface/60 bg-surface hover:bg-surface/80"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 disabled:opacity-50"
                  >
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-white p-5 rounded-2xl border border-primary/5 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-on-surface text-lg uppercase tracking-tight">{plan.name}</h3>
                      {plan.badge && (
                        <span className="bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-on-surface/60">{plan.description}</p>
                    <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest mt-1">Duração: {plan.duration || 30} dias | Categoria: {plan.category || 'Assinaturas'}</p>
                    <p className="text-primary font-black mt-2">R$ {parseFloat(plan.price).toFixed(2).replace('.', ',')}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingPlan(plan)}
                      className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-on-surface/60 hover:text-primary transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeletePlan(plan.id)}
                      className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {plans.length === 0 && (
                <div className="text-center py-10 text-on-surface/40 font-bold">
                  Nenhum plano cadastrado.
                </div>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === 'atendimento' && (
        <>
          {editingAtendimento ? (
            <div className="bg-white p-6 rounded-3xl border border-primary/10 shadow-sm mb-8">
              <h2 className="text-xl font-black mb-4">{editingAtendimento.isNew ? 'Novo Atendimento' : 'Editar Atendimento'}</h2>
              <form onSubmit={handleSaveAtendimento} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface/60 mb-1">Duração (Minutos)</label>
                  <input 
                    required
                    type="number"
                    value={editingAtendimento.duration}
                    onChange={e => setEditingAtendimento({...editingAtendimento, duration: parseInt(e.target.value)})}
                    className="w-full bg-surface border border-primary/10 rounded-xl px-4 py-3 font-bold"
                    placeholder="Ex: 15"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface/60 mb-1">Preço (R$)</label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    value={editingAtendimento.price}
                    onChange={e => setEditingAtendimento({...editingAtendimento, price: e.target.value})}
                    className="w-full bg-surface border border-primary/10 rounded-xl px-4 py-3 font-bold"
                    placeholder="Ex: 100.00"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id="isPopular"
                    checked={editingAtendimento.isPopular}
                    onChange={e => setEditingAtendimento({...editingAtendimento, isPopular: e.target.checked})}
                    className="w-4 h-4 text-primary border-primary/20 rounded"
                  />
                  <label htmlFor="isPopular" className="text-sm font-bold text-on-surface/80">Marcar como Popular</label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setEditingAtendimento(null)}
                    className="flex-1 py-3 rounded-xl font-bold text-on-surface/60 bg-surface hover:bg-surface/80"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 disabled:opacity-50"
                  >
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              {atendimentos.map((atendimento) => (
                <div key={atendimento.id} className="bg-white p-5 rounded-2xl border border-primary/5 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-on-surface text-lg uppercase tracking-tight">{atendimento.duration} Min</h3>
                      {atendimento.isPopular && (
                        <span className="bg-primary text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-primary font-black mt-2">R$ {parseFloat(atendimento.price).toFixed(2).replace('.', ',')}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingAtendimento(atendimento)}
                      className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-on-surface/60 hover:text-primary transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteAtendimento(atendimento.id)}
                      className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {atendimentos.length === 0 && (
                <div className="text-center py-10 text-on-surface/40 font-bold">
                  Nenhum atendimento cadastrado.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ScreenSubscriptions = ({ onBack }: { onBack: () => void }) => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('subscriptions')
          .select('*, creator:profiles!creator_id(*)')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('end_date', { ascending: false });

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
                    Expira em {new Date(sub.end_date).toLocaleDateString('pt-BR')}
                  </p>
                  {(() => {
                    const remainingDays = Math.ceil((new Date(sub.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${remainingDays <= 3 ? 'text-red-500' : 'text-green-600'}`}>
                        {remainingDays > 0 ? `${remainingDays} dias restantes` : 'Expirado'}
                      </p>
                    );
                  })()}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[8px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1 rounded-md border border-green-100">Ativa</span>
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

const ScreenSubscriberArea = ({ onNavigate, onLogout, profile }: { onNavigate: (s: Screen) => void, onLogout: () => void, profile: any }) => {
  const menuItems = [
    { icon: MessageCircle, title: 'Chat', description: 'Converse com criador agora', screen: 'messages' as Screen },
    { icon: Crown, title: 'Área VIP', description: 'Veja os criador que você assina', screen: 'subscriptions' as Screen },
    { icon: Wallet, title: 'Carteira', description: 'Escolha como paga e veja seus gastos', screen: 'wallet' as Screen },
    { icon: Activity, title: 'Atividades', description: 'Acesse suas mídias favoritas salvas', screen: 'activity' as Screen },
    { icon: Settings, title: 'Definições', description: 'Personalize sua experiência', screen: 'edit-profile' as Screen },
    { icon: AlertCircle, title: 'Ajuda', description: 'Precisa de suporte ou tem dúvidas?', screen: 'help' as any },
  ];

  return (
    <div className="pt-24 pb-24 px-6 max-w-2xl mx-auto min-h-screen bg-[#FDFCF9]">
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface mb-6">Área do Assinante</h1>
      </section>

      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item, index) => (
          <button 
            key={index} 
            onClick={() => item.screen && onNavigate(item.screen)}
            className="bg-white p-6 rounded-[2rem] border border-primary/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left hover:shadow-md transition-all active:scale-[0.98] flex flex-col h-full"
          >
            <div className="mb-4">
              <item.icon className="text-on-surface" size={24} strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-on-surface text-base mb-1">{item.title}</h3>
            <p className="text-[11px] text-on-surface/50 font-medium leading-tight">{item.description}</p>
          </button>
        ))}
      </div>

      <button 
        onClick={onLogout}
        className="mt-8 w-full bg-white p-6 rounded-[2rem] border border-primary/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left text-red-500 font-bold flex flex-col hover:shadow-md transition-all active:scale-[0.98]"
      >
        <div className="flex items-center gap-2 mb-1">
          <ArrowLeft size={20} strokeWidth={2} />
          <span className="text-base">Sair</span>
        </div>
        <p className="text-[11px] text-on-surface/50 font-medium pl-7">Sair da plataforma</p>
      </button>
    </div>
  );
};

const ScreenWallet = ({ onBack, isMaster }: { onBack: () => void, isMaster: boolean }) => {
  const [balance, setBalance] = useState('R$ 0,00');
  const [availableBalance, setAvailableBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [mimos, setMimos] = useState<any[]>([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [pixKey, setPixKey] = useState('');
  const [payoutName, setPayoutName] = useState('');
  const [payoutDocument, setPayoutDocument] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [savingPayout, setSavingPayout] = useState(false);
  const [isPayoutInfoSaved, setIsPayoutInfoSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'extracts' | 'subscribers' | 'sales' | 'mimos'>('extracts');

  const handleSavePayoutInfo = async () => {
    setSavingPayout(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('profiles')
        .update({ 
          pix_key: pixKey,
          payout_name: payoutName,
          payout_document: payoutDocument
        })
        .eq('id', user.id);

      if (error) throw error;
      alert('Dados de recebimento salvos com sucesso!');
    } catch (err: any) {
      alert(`Erro ao salvar dados: ${err.message}`);
    } finally {
      setSavingPayout(false);
    }
  };

  const handleWithdraw = async () => {
    if (!pixKey || !payoutName || !payoutDocument) {
      alert('Por favor, preencha todos os dados de recebimento antes de solicitar o saque.');
      return;
    }

    if (!withdrawAmount) {
      alert('Por favor, informe o valor do saque.');
      return;
    }

    const amountNum = parseFloat(withdrawAmount.replace(',', '.'));
    
    if (amountNum > availableBalance) {
      alert('Saldo disponível insuficiente para este saque.');
      return;
    }

    if (amountNum < 50) {
      alert('O valor mínimo para saque é R$ 50,00.');
      return;
    }

    setWithdrawing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar perfil para pegar o nome do criador
      const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single();

      // Salvar solicitação de saque
      const { error: withdrawError } = await supabase
        .from('withdrawal_requests')
        .insert({
          profile_id: user.id,
          amount: amountNum,
          pix_key: pixKey,
          status: 'pending'
        });

      if (withdrawError) throw withdrawError;

      // Notificar Administrador
      try {
        const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin');
        if (admins && admins.length > 0) {
          const notifications = admins.map(admin => ({
            user_id: admin.id,
            type: 'withdrawal',
            content: `solicitou um saque de R$ ${amountNum.toFixed(2)}`,
            badge: 'SAQUE',
            created_at: new Date().toISOString()
          }));
          await supabase.from('notifications').insert(notifications);
        }
      } catch (notifErr) {
        console.error('Erro ao notificar admin sobre saque:', notifErr);
      }

      // Salvar chave PIX no perfil para uso futuro
      await supabase
        .from('profiles')
        .update({ pix_key: pixKey })
        .eq('id', user.id);

      alert('Solicitação de saque enviada com sucesso! O prazo de processamento é de até 48 horas.');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
    } catch (err: any) {
      alert(`Erro ao solicitar saque: ${err.message}`);
    } finally {
      setWithdrawing(false);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Buscar dados de recebimento salvos
        const { data: profile } = await supabase
          .from('profiles')
          .select('pix_key, payout_name, payout_document')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          if (profile.pix_key) setPixKey(profile.pix_key);
          if (profile.payout_name) setPayoutName(profile.payout_name);
          if (profile.payout_document) setPayoutDocument(profile.payout_document);
          
          if (profile.pix_key && profile.payout_name && profile.payout_document) {
            setIsPayoutInfoSaved(true);
          }
        }

        if (isMaster) {
          const { data: payments, error } = await supabase
            .from('payments')
            .select('*, profiles:user_id(name, username, avatar)')
            .eq('creator_id', user.id)
            .eq('status', 'approved')
            .order('created_at', { ascending: false });

          if (error) throw error;

          // Buscar saques
          const { data: withdrawalRequests } = await supabase
            .from('withdrawal_requests')
            .select('*')
            .eq('profile_id', user.id)
            .order('created_at', { ascending: false });
          
          setWithdrawals(withdrawalRequests || []);

          if (payments) {
            const total = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
            setBalance(`R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
            
            // Calcular saldo disponível (Total - Saques Pendentes ou Pagos)
            const withdrawnTotal = (withdrawalRequests || [])
              .filter(w => w.status === 'pending' || w.status === 'approved')
              .reduce((acc, w) => acc + (w.amount || 0), 0);
            
            const available = total - withdrawnTotal;
            setAvailableBalance(available);

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

          // Buscar mimos
          const { data: mimosData } = await supabase
            .from('mimos')
            .select('*, profiles:user_id(name, username, avatar)')
            .eq('creator_id', user.id)
            .order('created_at', { ascending: false });
          
          setMimos(mimosData || []);
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
          {isMaster ? 'Faturamento Total' : 'Saldo Disponível'}
        </p>
        <h2 className="text-5xl font-black text-on-surface tracking-tighter">
          {loading ? '...' : balance}
        </h2>
        {isMaster && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Disponível para Saque</p>
              <p className="text-2xl font-black text-on-surface">R$ {availableBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <button 
              onClick={() => setShowWithdrawModal(true)}
              className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Solicitar Saque
            </button>
          </div>
        )}
        {!isMaster && (
          <div className="mt-6 flex justify-center gap-2">
            <div className="px-4 py-1.5 bg-primary/10 rounded-full flex items-center gap-2">
              <Crown size={14} className="text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Membro VIP</span>
            </div>
          </div>
        )}
      </div>

      {isMaster && (
        <section className="mb-10 bg-white p-6 rounded-3xl border border-primary/5 shadow-sm space-y-6">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="text-primary" size={18} />
              <h2 className="font-bold text-base text-on-surface">Dados de Recebimento</h2>
            </div>
            {isPayoutInfoSaved && (
              <div className="px-2 py-1 bg-green-50 text-green-600 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Verificado</span>
              </div>
            )}
          </div>

          {!isPayoutInfoSaved ? (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                <Bell size={16} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Atenção: Dados Permanentes</p>
                <p className="text-[11px] text-amber-700/70 leading-relaxed font-medium">
                  Confira seus dados com atenção. Por questões de segurança, <span className="font-bold">não é possível alterar</span> essas informações após o primeiro salvamento.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-on-surface/40 px-1 font-medium italic">
              Seus dados de recebimento estão protegidos e não podem ser alterados via painel. Entre em contato com o suporte para atualizações críticas.
            </p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-black text-primary/70 px-1">Nome Completo / Razão Social</label>
              <input 
                className="w-full bg-background border border-primary/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 shadow-sm text-sm font-bold text-on-surface disabled:opacity-50" 
                placeholder="Nome do titular da conta"
                value={payoutName}
                onChange={(e) => setPayoutName(e.target.value)}
                disabled={isPayoutInfoSaved}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-black text-primary/70 px-1">CPF ou CNPJ</label>
              <input 
                className="w-full bg-background border border-primary/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 shadow-sm text-sm font-bold text-on-surface disabled:opacity-50" 
                placeholder="000.000.000-00"
                value={payoutDocument}
                onChange={(e) => setPayoutDocument(e.target.value)}
                disabled={isPayoutInfoSaved}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-primary/70 px-1">Chave PIX</label>
              <input 
                className="w-full bg-background border border-primary/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 shadow-sm text-sm font-bold text-on-surface disabled:opacity-50" 
                placeholder="E-mail, CPF, Telefone ou Chave Aleatória"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                disabled={isPayoutInfoSaved}
              />
            </div>
          </div>

          {!isPayoutInfoSaved && (
            <button 
              onClick={handleSavePayoutInfo}
              disabled={savingPayout}
              className="w-full bg-on-surface text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-on-surface/90 transition-all disabled:opacity-50"
            >
              {savingPayout ? 'Salvando...' : 'Salvar Dados de Recebimento'}
            </button>
          )}
        </section>
      )}

      {isMaster ? (
        <div className="space-y-8">
          {/* Tabs for Wallet */}
          <div className="flex gap-2 bg-white p-1 rounded-2xl border border-primary/5 shadow-sm">
            <button 
              onClick={() => setActiveTab('extracts')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'extracts' ? 'bg-primary text-white shadow-md' : 'text-on-surface/40 hover:bg-primary/5'}`}
            >
              Extratos
            </button>
            <button 
              onClick={() => setActiveTab('subscribers')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'subscribers' ? 'bg-primary text-white shadow-md' : 'text-on-surface/40 hover:bg-primary/5'}`}
            >
              Assinantes
            </button>
            <button 
              onClick={() => setActiveTab('sales')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'sales' ? 'bg-primary text-white shadow-md' : 'text-on-surface/40 hover:bg-primary/5'}`}
            >
              Vendas
            </button>
            <button 
              onClick={() => setActiveTab('mimos')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'mimos' ? 'bg-primary text-white shadow-md' : 'text-on-surface/40 hover:bg-primary/5'}`}
            >
              Mimos
            </button>
          </div>

          {activeTab === 'extracts' && (
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="font-bold text-lg text-on-surface px-1">Histórico de Saques</h3>
              {withdrawals.length > 0 ? (
                <div className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
                  {withdrawals.map((w, index) => (
                    <div key={w.id} className={`p-4 flex items-center justify-between ${index !== withdrawals.length - 1 ? 'border-b border-primary/5' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          w.status === 'pending' ? 'bg-amber-50 text-amber-500' :
                          w.status === 'approved' ? 'bg-green-50 text-green-500' :
                          'bg-red-50 text-red-500'
                        }`}>
                          <Wallet size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-on-surface">Saque via PIX</p>
                          <p className="text-[10px] text-on-surface/60 font-medium">{new Date(w.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-on-surface text-sm">R$ {Number(w.amount).toFixed(2)}</p>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${
                          w.status === 'pending' ? 'text-amber-500' :
                          w.status === 'approved' ? 'text-green-500' :
                          'text-red-500'
                        }`}>
                          {w.status === 'pending' ? 'Pendente' : w.status === 'approved' ? 'Pago' : 'Cancelado'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-on-surface/60 px-1">Nenhum saque solicitado ainda.</p>
              )}
            </section>
          )}

          {activeTab === 'subscribers' && (
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
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
          )}

          {activeTab === 'sales' && (
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
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
          )}

          {activeTab === 'mimos' && (
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-lg text-on-surface">Mimos Recebidos</h3>
                <div className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Gift size={12} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Total: R$ {mimos.reduce((acc, m) => acc + (m.amount || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              {mimos.length > 0 ? (
                <div className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
                  {mimos.map((mimo, index) => (
                    <div key={mimo.id} className={`p-4 flex items-center justify-between ${index !== mimos.length - 1 ? 'border-b border-primary/5' : ''}`}>
                      <div className="flex items-center gap-3">
                        <img src={mimo.profiles?.avatar} alt={mimo.profiles?.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <p className="font-bold text-sm text-on-surface">{mimo.profiles?.name || 'Usuário'}</p>
                          <p className="text-[10px] text-on-surface/60 font-medium">@{mimo.profiles?.username || 'usuario'} • {new Date(mimo.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-pink-500 text-sm">R$ {Number(mimo.amount).toFixed(2)}</p>
                        <span className="text-[9px] font-black text-on-surface/40 uppercase tracking-widest">Presente</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-primary/5 shadow-sm p-10 text-center">
                  <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift size={32} />
                  </div>
                  <p className="text-sm text-on-surface/60 font-medium">Você ainda não recebeu nenhum mimo.</p>
                </div>
              )}
            </section>
          )}
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

      {/* Modal de Saque */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-on-surface uppercase tracking-tight">Solicitar Saque</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="p-2 text-on-surface/20 hover:text-on-surface transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-primary/5 p-4 rounded-2xl space-y-2">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Destino do Saque</p>
                <p className="text-xs font-bold text-on-surface">{payoutName}</p>
                <p className="text-[10px] font-medium text-on-surface/60">PIX: {pixKey}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-black text-primary/70 px-1">Valor do Saque</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-primary/40 font-bold">R$</span>
                  <input 
                    type="text"
                    className="w-full bg-background border border-primary/10 rounded-xl pl-10 pr-4 py-3.5 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
                    placeholder="0,00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>
                <p className="text-[10px] text-on-surface/40 font-medium px-1 italic">Mínimo: R$ 50,00</p>
              </div>
            </div>

            <button 
              onClick={handleWithdraw}
              disabled={withdrawing}
              className="w-full premium-gradient text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all disabled:opacity-50"
            >
              {withdrawing ? 'Processando...' : 'Confirmar Saque'}
            </button>

            <p className="text-[10px] text-center text-on-surface/40 font-medium leading-relaxed">
              Ao solicitar o saque, o valor será debitado do seu saldo e enviado para a chave PIX informada em até 2 dias úteis.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const BottomNav = ({ active, onChange, isMaster, unreadCount }: { active: Screen, onChange: (s: Screen) => void, isMaster: boolean, unreadCount: number }) => (
  <nav className="fixed bottom-0 w-full flex justify-around items-center px-4 py-3 bg-white border-t border-primary/5 z-50">
    <button onClick={() => onChange('feed')} className={`flex flex-col items-center gap-1 transition-all ${active === 'feed' ? 'text-primary' : 'text-on-surface/40'}`}>
      <Home size={24} />
      <span className="text-[10px] font-bold">Início</span>
    </button>
    <button onClick={() => onChange('search')} className={`flex flex-col items-center gap-1 transition-all ${active === 'search' ? 'text-primary' : 'text-on-surface/40'}`}>
      <Search size={24} />
      <span className="text-[10px] font-bold">Pesquisar</span>
    </button>

    {isMaster && (
      <button onClick={() => onChange('create-post')} className={`p-2 bg-primary text-white rounded-full shadow-lg shadow-primary/20 transition-transform active:scale-90 ${active === 'create-post' ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
        <PlusCircle size={28} />
      </button>
    )}

    <button onClick={() => onChange(isMaster ? 'wallet' : 'subscriber-area')} className={`flex flex-col items-center gap-1 transition-all ${(active === 'wallet' || active === 'subscriber-area') ? 'text-primary' : 'text-on-surface/40'}`}>
      <Crown size={24} />
      <span className="text-[10px] font-bold">{isMaster ? 'Carteira' : 'Área VIP'}</span>
    </button>
    
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
  onComment,
  onForward,
  initialShowComments = false
}: { 
  post: Post | null, 
  onClose: () => void, 
  onDelete?: (id: string) => void, 
  onEdit?: (post: Post) => void,
  currentUserId?: string,
  onLike?: (id: string, isLiked: boolean) => void,
  onComment?: (id: string, content: string) => void,
  onForward?: (post: Post) => void,
  initialShowComments?: boolean
}) => {
  const isOwner = post?.creator.id === currentUserId;
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [newComment, setNewComment] = React.useState('');
  const [showComments, setShowComments] = React.useState(initialShowComments);

  React.useEffect(() => {
    if (post) {
      setShowComments(initialShowComments);
    } else {
      setShowComments(false);
    }
  }, [post, initialShowComments]);

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
            {!post.hasAccess ? (
              <div className="flex flex-col items-center justify-center text-center p-12 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 max-w-md mx-auto shadow-2xl">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-8 ring-8 ring-primary/5">
                  <Lock className="text-primary" size={48} />
                </div>
                <h2 className="text-3xl font-black text-white mb-4 tracking-tight">CONTEÚDO EXCLUSIVO</h2>
                <p className="text-white/60 text-sm font-bold uppercase tracking-[0.2em] mb-10 leading-relaxed">
                  Este conteúdo é reservado para assinantes VIP.
                </p>
                <button 
                  onClick={() => {
                    // We don't have onSubscribe here, but we can close and let the parent handle it
                    // Or we can just show that it's locked.
                    onClose();
                  }}
                  className="w-full py-5 premium-gradient text-white font-black rounded-2xl shadow-2xl shadow-primary/30 active:scale-95 transition-all text-xs uppercase tracking-[0.3em]"
                >
                  VOLTAR E ASSINAR
                </button>
              </div>
            ) : (
              <SecureMedia 
                mediaPath={post.image}
                isVideo={post.isVideo}
                className="max-w-full max-h-full rounded-lg shadow-2xl" 
                controls 
                autoPlay 
                alt={post.caption}
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

const CropModal = ({ image, onCropComplete, onSkip, onClose, aspect = 1 }: { image: string, onCropComplete: (croppedImage: Blob) => void, onSkip?: () => void, onClose: () => void, aspect?: number }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [currentAspect, setCurrentAspect] = useState(aspect);

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

  const aspects = [
    { label: 'Quadrado', value: 1 },
    { label: 'Retrato', value: 4 / 5 },
    { label: 'Paisagem', value: 16 / 9 },
    { label: 'Livre', value: undefined }
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col">
      <div className="flex justify-between items-center p-4 bg-white z-10">
        <div className="flex gap-4">
          <button onClick={onClose} className="text-on-surface/60 font-bold uppercase tracking-widest text-xs">Cancelar</button>
          {onSkip && (
            <button onClick={onSkip} className="text-on-surface/40 hover:text-primary font-bold uppercase tracking-widest text-xs transition-colors">Original</button>
          )}
        </div>
        <h3 className="font-bold uppercase tracking-widest text-xs">Ajustar Imagem</h3>
        <button onClick={handleDone} className="text-primary font-bold uppercase tracking-widest text-xs">Concluir</button>
      </div>
      <div className="relative flex-1 bg-on-surface/10">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={currentAspect}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteInternal}
          onZoomChange={onZoomChange}
        />
      </div>
      <div className="p-6 bg-white space-y-6">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {aspects.map((asp) => (
            <button
              key={asp.label}
              onClick={() => setCurrentAspect(asp.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                currentAspect === asp.value
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-on-surface/5 text-on-surface/40 hover:bg-on-surface/10'
              }`}
            >
              {asp.label}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/30">Zoom</p>
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
            <SecureMedia mediaPath={post.image} isVideo={post.isVideo} className="w-full h-full object-cover" />
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
        console.log('Fetched messages for contacts:', messages?.length);
        messages?.forEach((m: any) => {
          const other = m.sender_id === user.id ? m.receiver : m.sender;
          if (other) {
            console.log('Adding contact from message:', other.name);
            contactMap.set(other.id, other as any);
          }
        });

        // Also add the Master if not already there
        const { data: masterProfile } = await supabase.from('profiles').select('*').eq('role', 'master').single();
        if (masterProfile && masterProfile.id !== user.id) {
          console.log('Adding master profile to contacts');
          contactMap.set(masterProfile.id, masterProfile as any);
        }

        const allContacts = Array.from(contactMap.values());
        console.log('Total contacts found for forwarding:', allContacts.length);
        setContacts(allContacts);
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

const ScreenSearch = ({ onViewProfile }: { onViewProfile: (creator: any) => void }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const searchUsers = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .or(`name.ilike.%${query}%,username.ilike.%${query}%`)
          .limit(20);

        if (error) throw error;
        setResults(data || []);
      } catch (err) {
        console.error('Error searching users:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="min-h-screen bg-background pb-24 pt-20 px-4">
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={18} className="text-on-surface/40" />
        </div>
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar usuários..."
          className="w-full bg-surface border border-primary/5 rounded-2xl py-4 pl-12 pr-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="animate-spin text-primary" size={24} />
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          {results.map((user) => (
            <button 
              key={user.id}
              onClick={() => onViewProfile(user.id)}
              className="w-full flex items-center gap-4 p-4 bg-surface rounded-2xl border border-primary/5 active:scale-[0.98] transition-all"
            >
              <img 
                src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`} 
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/10"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-1">
                  <h4 className="font-black text-sm uppercase tracking-tight">{user.name}</h4>
                  {user.verificada && <CheckCircle2 size={12} className="text-primary" />}
                </div>
                <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">@{user.username}</p>
              </div>
              <ChevronRight size={18} className="text-on-surface/20" />
            </button>
          ))}
        </div>
      ) : query.trim().length >= 2 ? (
        <div className="text-center py-12">
          <p className="text-xs font-bold text-on-surface/40 uppercase tracking-widest">Nenhum usuário encontrado</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <Search size={48} className="mx-auto text-on-surface/5 mb-4" />
          <p className="text-[10px] font-black text-on-surface/20 uppercase tracking-[0.2em]">Encontre novos perfis</p>
        </div>
      )}
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
  onForwardPost,
  onRefresh
}: { 
  posts: Post[], 
  stories: any[], 
  onStoryUpload: (file: File) => void, 
  creator: Creator,
  onDeletePost: (id: string) => void,
  onUpdatePost: (id: string, caption: string, isLocked: boolean) => void,
  onDeleteStory: (id: string) => void,
  onSubscribe: (creator: Creator) => void,
  isMaster: boolean,
  onLikePost?: (id: string, isLiked: boolean) => void,
  onCommentPost?: (id: string, content: string) => void,
  onViewProfile?: (creatorId: string) => void,
  onForwardPost?: (post: Post) => void,
  onRefresh?: () => void
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
  const [openComments, setOpenComments] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<Post | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = React.useState<number | null>(null);
  const [showPostMenu, setShowPostMenu] = React.useState<string | null>(null);
  const [cropImage, setCropImage] = React.useState<{ url: string, aspect: number } | null>(null);
  const [originalFile, setOriginalFile] = React.useState<File | null>(null);

  const handleStoryFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      setOriginalFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setCropImage({ url: reader.result as string, aspect: 9 / 16 });
      };
      reader.readAsDataURL(file);
    } else {
      onStoryUpload(file);
    }
  };

  const handleStorySkipCrop = () => {
    if (originalFile) {
      onStoryUpload(originalFile);
    }
    setCropImage(null);
    setOriginalFile(null);
  };

  const handleStoryCropComplete = (croppedBlob: Blob) => {
    const file = new File([croppedBlob], `story_${Date.now()}.jpg`, { type: 'image/jpeg' });
    onStoryUpload(file);
    setCropImage(null);
    setOriginalFile(null);
  };

  return (
    <div className="pt-20 pb-24 max-w-2xl mx-auto">
      {/* Modals */}
      {cropImage && (
        <CropModal 
          image={cropImage.url} 
          aspect={cropImage.aspect}
          onCropComplete={handleStoryCropComplete} 
          onSkip={handleStorySkipCrop}
          onClose={() => {
            setCropImage(null);
            setOriginalFile(null);
          }} 
        />
      )}
      <FullScreenPostModal 
        post={selectedPost} 
        onClose={() => {
          setSelectedPost(null);
          setOpenComments(false);
        }} 
        onDelete={onDeletePost}
        onEdit={setEditingPost}
        currentUserId={creator.id}
        onLike={onLikePost}
        onComment={onCommentPost}
        onForward={onForwardPost}
        initialShowComments={openComments}
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
            onChange={handleStoryFileSelection}
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
                    {post.creator?.verificada && <CheckCircle2 size={12} className="text-primary fill-primary/10" />}
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
            className="aspect-square relative overflow-hidden bg-black cursor-pointer"
            onClick={() => {
              if (post.hasAccess) {
                setSelectedPost(post);
                setOpenComments(false);
              }
            }}
          >
            <SecureMedia 
              mediaPath={post.image}
              isVideo={post.isVideo}
              className={`w-full h-full object-cover transition-all duration-700 ${!post.hasAccess ? 'blur-[60px] scale-110 opacity-50' : 'hover:scale-105'}`} 
            />
            {!post.hasAccess && (
              <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/20">
                <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] flex flex-col items-center text-center shadow-2xl border border-white/20 w-full max-w-[280px]">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary/10">
                    <Lock className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-black mb-2 text-white drop-shadow-md">Conteúdo VIP</h3>
                  <p className="text-xs text-white/80 mb-8 font-bold uppercase tracking-widest leading-relaxed">
                    Assine para ter acesso a este conteúdo exclusivo.
                  </p>
                  <div className="w-full space-y-3">
                    <button 
                      onClick={() => onSubscribe(post.creator)}
                      className="w-full py-4 px-8 premium-gradient text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all text-[10px] uppercase tracking-[0.2em]"
                    >
                      ASSINAR AGORA
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
                <button onClick={() => {
                  if (post.hasAccess) {
                    setSelectedPost(post);
                    setOpenComments(true);
                  }
                }} className="flex items-center gap-2">
                  <MessageCircle className="text-on-surface" />
                  <span className="text-sm font-bold">{post.commentsCount || 0}</span>
                </button>
              </div>
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
      <p className="text-xs text-on-surface/40 font-bold uppercase tracking-widest leading-relaxed mb-8">
        Ainda não há conteúdo disponível no feed.
      </p>
      {onRefresh && (
        <button 
          onClick={onRefresh}
          className="px-8 py-3 bg-primary text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all text-[10px] uppercase tracking-widest"
        >
          Atualizar Feed
        </button>
      )}
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
    <div className="w-full max-w-[280px] mx-auto mb-8 bg-primary/5 border border-primary/10 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
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
        className="w-10 h-10 flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center shadow-md shadow-primary/20 active:scale-95 transition-all disabled:opacity-70"
      >
        {isBuffering && !isPlaying ? (
          <RefreshCw size={18} className="animate-spin" />
        ) : isPlaying ? (
          <Pause size={18} fill="currentColor" />
        ) : (
          <Play size={18} fill="currentColor" className="ml-0.5" />
        )}
      </button>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-primary">Ouça minha voz</span>
          <div className="flex items-center gap-1 text-[9px] font-bold text-primary/60">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const AtendimentoPresencialSection = ({ atendimentos }: { atendimentos: any[] }) => {
  if (!atendimentos || atendimentos.length === 0) return null;
  
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4 px-2">
        <h3 className="text-xl font-black tracking-tight text-on-surface">Atendimento Presencial</h3>
        <House size={20} className="text-[#b30047]" />
      </div>
      <div className="grid grid-cols-2 gap-3 px-2">
        {atendimentos.map((item, index) => (
          <div key={index} className="bg-[#fff0f5] rounded-3xl p-4 flex flex-col items-center text-center relative border border-[#ffe6ee] w-full">
            {item.isPopular && (
              <div className="absolute -top-2 bg-[#b30047] text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-sm">
                Popular
              </div>
            )}
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-3 shadow-sm">
              <Clock4 size={24} className="text-[#b30047]" />
            </div>
            <div className="flex items-baseline justify-center gap-1 mb-1">
              <span className="text-2xl font-black text-on-surface">{item.duration}</span>
              <span className="text-xs font-bold text-on-surface/40">Min</span>
            </div>
            <div className="text-lg font-black text-[#b30047]">
              {parseFloat(item.price).toFixed(2).replace('.', ',')} R$
            </div>
          </div>
        ))}
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
  onMessage,
  onForwardPost,
  onNavigateToAdmin
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
  onMessage?: (creator: Creator) => void,
  onForwardPost?: (post: Post) => void,
  onNavigateToAdmin?: () => void,
  onNavigateToSubscriberArea?: () => void
}) => {
  const [activeTab, setActiveTab] = React.useState<'all' | 'exclusive'>('all');
  const myPosts = (posts || []).filter(p => {
    const pCreatorId = p.creator?.id || p.creator_id;
    return pCreatorId && creator?.id && pCreatorId === creator.id;
  }).filter(p => activeTab === 'all' ? true : p.isLocked);
  const myStories = stories.filter(s => s.creator_id === creator?.id);
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
  const [openComments, setOpenComments] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<Post | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = React.useState<number | null>(null);
  
  return (
    <div className="pt-0 pb-24">
      {/* Modals */}
      <FullScreenPostModal 
        post={selectedPost} 
        onClose={() => {
          setSelectedPost(null);
          setOpenComments(false);
        }} 
        onDelete={onDeletePost}
        onEdit={setEditingPost}
        currentUserId={creator?.id}
        onLike={onLikePost}
        onComment={onCommentPost}
        onForward={onForwardPost}
        initialShowComments={openComments}
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

      <section className={`max-w-4xl mx-auto px-6 text-left relative z-10 ${myStories.length > 0 ? '-mt-20' : 'mt-6'}`}>
        <div className="flex justify-between items-end mb-6">
          <div className="relative">
            <div 
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full p-[3px] story-ring bg-background shadow-2xl cursor-pointer"
              onClick={() => myStories.length > 0 && setActiveStoryIndex(0)}
            >
              <img src={creator?.avatar} className="w-full h-full object-cover rounded-full border-4 border-white" referrerPolicy="no-referrer" />
              {myStories.length > 0 && (
                <div className="absolute inset-0 rounded-full border-4 border-primary animate-pulse pointer-events-none"></div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <button 
              onClick={() => {
                const url = `${window.location.origin}/?u=${creator.username}`;
                navigator.clipboard.writeText(url);
                alert('Link do perfil copiado!');
              }}
              className="w-12 h-12 rounded-full border border-on-surface/10 bg-white/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:bg-on-surface/5 transition-all active:scale-95 shadow-sm"
            >
              <Share2 size={20} />
            </button>
            <button 
              onClick={onEdit}
              className="w-12 h-12 rounded-full border border-on-surface/10 bg-white/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:bg-on-surface/5 transition-all active:scale-95 shadow-sm"
            >
              <Edit2 size={20} />
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-2">
              {creator?.name}
              {creator?.verificada && (
                <div className="bg-[#0095f6] p-0.5 rounded-full flex items-center justify-center">
                  <Check size={10} className="text-white" strokeWidth={4} />
                </div>
              )}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-sm text-on-surface/60 font-medium">@{creator?.username || creator?.name?.toLowerCase().replace(/\s+/g, '')}</p>
            </div>
          </div>
          {creator.social_links && (
            <div className="flex gap-3">
              {creator.social_links.instagram && (
                <a href={creator.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                  <Instagram size={24} />
                </a>
              )}
              {creator.social_links.twitter && (
                <a href={creator.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                  <Twitter size={24} />
                </a>
              )}
              {creator.social_links.tiktok && (
                <a href={creator.social_links.tiktok} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                  <Music size={24} />
                </a>
              )}
            </div>
          )}
        </div>

        <p className="text-sm text-on-surface/80 font-medium mb-2 max-w-xl leading-relaxed">{creator?.bio}</p>

        {creator?.cidade && (
          <div className="flex items-center gap-1.5 text-on-surface/40 mb-6">
            <MapPin size={12} className="text-primary/60" />
            <span className="text-[11px] font-bold uppercase tracking-widest">{creator.cidade}</span>
          </div>
        )}

        {creator.welcome_audio && (
          <WelcomeAudioPlayer audioUrl={creator.welcome_audio} />
        )}

        {/* Temporariamente removido
        {creator?.services_bio && (
          <div className="bg-gradient-to-br from-white to-primary/5 p-6 rounded-[2rem] shadow-sm max-w-md mx-auto border border-primary/10 mb-8 text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                    <Star size={18} className="text-white" fill="currentColor" />
                  </div>
                  <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-primary">Serviços & Preços</h4>
                </div>
                <div className="bg-primary/10 px-3 py-1 rounded-full">
                  <span className="text-[9px] font-black uppercase text-primary tracking-wider">Premium</span>
                </div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-primary/5">
                <FormattedText 
                  text={creator?.services_bio} 
                  className="text-sm text-on-surface/80 leading-relaxed whitespace-pre-wrap font-medium"
                />
              </div>
            </div>
          </div>
        )}
        */}

        <AtendimentoPresencialSection atendimentos={creator?.atendimento_presencial || []} />

        {isMaster && (
          <div className="flex justify-center items-center gap-4 sm:gap-8 mb-8 py-4 px-4 bg-white rounded-2xl shadow-sm max-w-[280px] border border-primary/5 overflow-hidden">
            <div className="text-center min-w-[50px]">
              <span className="block text-lg font-bold">{myPosts.length}</span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-on-surface/40">Posts</span>
            </div>
            <div className="w-px h-6 bg-primary/10 flex-shrink-0"></div>
            <div className="text-center min-w-[50px]">
              <span className="block text-lg font-bold">{creator.stats?.followers || '0'}</span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-on-surface/40">Seguidores</span>
            </div>
            <div className="w-px h-6 bg-primary/10 flex-shrink-0"></div>
            <div className="text-center min-w-[50px]">
              <span className="block text-lg font-bold">{creator.stats?.likes || '0'}</span>
              <span className="text-[9px] uppercase tracking-widest font-bold text-on-surface/40">Curtidas</span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-3 mb-10 max-w-md">
          {creator.role === 'admin' && onNavigateToAdmin && (
            <button 
              onClick={onNavigateToAdmin}
              className="w-full py-4 bg-red-500 text-white font-black rounded-2xl shadow-lg shadow-red-500/20 active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              <Shield size={18} />
              Painel Administrativo
            </button>
          )}
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
          <button 
            onClick={onLogout}
            className="w-full py-4 bg-red-500/10 text-red-500 font-bold rounded-2xl shadow-sm active:scale-95 transition-all uppercase tracking-widest text-xs"
          >
            Sair da Conta
          </button>
        </div>
      </section>

      {isMaster && (
        <div className="sticky top-16 bg-white/80 backdrop-blur-md z-40 border-b border-primary/5 mb-6">
          <div className="max-w-4xl mx-auto px-6 flex justify-around">
            <button 
              onClick={() => setActiveTab('all')}
              className={`py-4 border-b-2 font-bold text-xs uppercase tracking-widest ${activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-on-surface/40'}`}
            >
              POST
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
                  className="relative aspect-square overflow-hidden rounded-2xl bg-black shadow-sm group cursor-pointer"
                  onClick={() => {
                    if (post.hasAccess) {
                      setSelectedPost(post);
                      setOpenComments(false);
                    }
                  }}
                >
                  <SecureMedia 
                    mediaPath={post.image}
                    isVideo={post.isVideo}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!post.hasAccess ? 'blur-2xl scale-125 opacity-40' : ''}`} 
                  />
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
                        ASSINAR
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
          <div className="pt-0 pb-20 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="text-primary" size={32} />
            </div>
            <h3 className="text-lg font-black mb-2">Conta de Assinante</h3>
            <p className="text-xs text-on-surface/50 font-bold uppercase tracking-widest leading-relaxed">
              Mergulhe agora nos conteúdos mais quentes e exclusivos que preparamos para você
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

const MimoModal = ({ isOpen, onClose, creator }: { isOpen: boolean, onClose: () => void, creator: Creator }) => {
  const { user } = useAuth();
  const [amount, setAmount] = React.useState<number | null>(null);
  const [customAmount, setCustomAmount] = React.useState('');
  const [step, setStep] = React.useState<'select' | 'pix'>('select');
  const [loading, setLoading] = React.useState(false);
  const [pixData, setPixData] = React.useState<{ qrCode: string, qrCodeBase64: string, paymentId: string } | null>(null);
  const [paymentId, setPaymentId] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setStep('select');
      setAmount(null);
      setCustomAmount('');
      setPixData(null);
      setPaymentId(null);
      setSuccess(false);
    }
  }, [isOpen]);

  // Polling for payment status
  React.useEffect(() => {
    if (!paymentId || paymentId === 'undefined' || success) return;

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('payments')
        .select('status')
        .eq('id', paymentId)
        .single();

      if (data && data.status === 'approved') {
        setSuccess(true);
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [paymentId, success]);

  if (!isOpen) return null;

  const predefinedAmounts = [5, 10, 20, 50];

  const handleContinue = async () => {
    const finalAmount = amount || parseFloat(customAmount);
    if (!finalAmount || finalAmount <= 0) return;
    if (!user) {
      alert('Você precisa estar logado para enviar um mimo.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/payments/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          description: `Mimo para ${creator.name}`,
          payerEmail: user.email,
          userId: user.id,
          creatorId: creator.id,
          planId: 'mimo',
          duration: 0,
          paymentId: paymentId // Reuse existing ID
        })
      });

      const data = await response.json();
      if (data.error) {
        if (data.paymentId) {
          setPaymentId(data.paymentId);
          setStep('pix');
          return;
        }
        throw new Error(data.error);
      }
      
      setPixData(data);
      if (data.paymentId) setPaymentId(data.paymentId);
      setStep('pix');
    } catch (error: any) {
      console.error("Erro ao gerar Pix para Mimo:", error);
      // If we have a paymentId, we can stay in a "waiting" state even if generation failed
      if (paymentId) {
        setStep('pix');
      } else {
        alert(`Erro ao gerar Pix: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPix = () => {
    if (pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-on-surface/40 hover:text-on-surface">
            <X size={20} />
          </button>
          
          {success ? (
            <div className="py-8 animate-in fade-in zoom-in-95">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-green-100">
                <Check size={40} strokeWidth={3} />
              </div>
              <h3 className="font-black text-xl mb-2">Mimo Enviado!</h3>
              <p className="text-sm text-on-surface/60 font-medium mb-8">
                Seu presente foi enviado com sucesso para <span className="text-primary font-bold">{creator?.name}</span>.
              </p>
              <button
                onClick={onClose}
                className="w-full py-4 bg-on-surface text-white font-black rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                Fechar
              </button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-pink-100 overflow-hidden">
                <img src={creator?.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h3 className="font-black text-lg mb-1">Enviar Mimo</h3>
              <p className="text-xs text-on-surface/60 font-medium mb-6">Para {creator?.name}</p>

              {step === 'select' ? (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {predefinedAmounts.map(val => (
                      <button
                        key={val}
                        onClick={() => { setAmount(val); setCustomAmount(''); }}
                        className={`py-3 rounded-xl font-bold text-sm transition-all border ${
                          amount === val 
                          ? 'bg-pink-500 text-white border-pink-500' 
                          : 'bg-on-surface/5 text-on-surface/80 border-transparent hover:bg-on-surface/10'
                        }`}
                      >
                        R$ {val},00
                      </button>
                    ))}
                  </div>
                  
                  <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <span className="text-on-surface/40 font-bold">R$</span>
                    </div>
                    <input
                      type="number"
                      placeholder="Outro valor"
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); setAmount(null); }}
                      className="w-full bg-on-surface/5 border border-transparent rounded-xl py-3 pl-12 pr-4 font-bold text-on-surface focus:outline-none focus:border-pink-500/30 focus:bg-white transition-all"
                    />
                  </div>

                  <button
                    onClick={handleContinue}
                    disabled={(!amount && !customAmount) || loading}
                    className="w-full py-4 bg-pink-500 text-white font-black rounded-xl shadow-lg shadow-pink-500/20 active:scale-95 transition-all uppercase tracking-widest text-xs disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Continuar'
                    )}
                  </button>
                </>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <div className="bg-white p-4 rounded-2xl border-2 border-primary/5 flex items-center justify-center mb-4 shadow-inner">
                    {pixData?.qrCodeBase64 ? (
                      <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} className="w-48 h-48" alt="QR Code PIX" />
                    ) : (
                      <div className="w-48 h-48 bg-on-surface/5 flex flex-col items-center justify-center p-6 text-center gap-3">
                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">
                          Gerando QR Code...
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-bold text-on-surface/80">
                    Valor: R$ {(amount || parseFloat(customAmount)).toFixed(2)}
                  </p>
                  
                  {pixData ? (
                    <>
                      <p className="text-xs text-on-surface/60 mb-4">
                        Escaneie o QR Code ou copie a chave PIX abaixo para enviar seu mimo.
                      </p>
                      <button
                        onClick={handleCopyPix}
                        className={`w-full py-4 font-black rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 ${
                          copied ? 'bg-green-500 text-white' : 'bg-on-surface text-white'
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check size={16} />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <QrCode size={16} />
                            Copiar Chave PIX
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-amber-600 bg-amber-50 p-4 rounded-xl font-medium leading-relaxed">
                        O Turbofy está processando seu pedido, mas a conexão falhou. <br/>
                        <span className="font-bold">Verifique se o PIX já apareceu no seu banco</span> ou clique no botão abaixo para tentar recuperar o QR Code.
                      </p>
                      <button
                        onClick={handleContinue}
                        disabled={loading}
                        className="w-full py-4 bg-on-surface text-white font-black rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                      >
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Recuperar QR Code'}
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center gap-2 text-[10px] text-on-surface/40 font-bold uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    Aguardando confirmação...
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
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
  isLoggedIn,
  onForwardPost,
  onNavigate,
  onFollow
}: { 
  creator: Creator, 
  posts: Post[], 
  onSubscribe: () => void, 
  stories: any[], 
  onLikePost?: (id: string, isLiked: boolean) => void, 
  onCommentPost?: (id: string, content: string) => void,
  onMessage?: (creator: Creator) => void,
  isLoggedIn: boolean,
  onForwardPost?: (post: Post) => void,
  onNavigate?: (screen: Screen) => void,
  onFollow?: () => void
}) => {
  const [activeTab, setActiveTab] = React.useState<'all' | 'exclusive'>('all');
  const myPosts = posts.filter(p => p.creator.id === creator.id).filter(p => activeTab === 'all' ? true : p.isLocked);
  const myStories = stories.filter(s => s.creator_id === creator.id);
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
  const [openComments, setOpenComments] = React.useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = React.useState<number | null>(null);
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [showMimoModal, setShowMimoModal] = React.useState(false);
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
      if (onNavigate) onNavigate('register');
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
    if (onFollow) onFollow();
  };
  
  return (
    <div className="pt-0 pb-24">
      <MimoModal 
        isOpen={showMimoModal} 
        onClose={() => setShowMimoModal(false)} 
        creator={creator} 
      />
      {/* Full Screen Modal */}
      <FullScreenPostModal 
        post={selectedPost} 
        onClose={() => {
          setSelectedPost(null);
          setOpenComments(false);
        }} 
        onLike={(id, isLiked) => {
          if (onLikePost) onLikePost(id, isLiked);
          // Update local state for the modal
          if (selectedPost && selectedPost.id === id) {
            const newLikesCount = isLiked ? Math.max(0, (selectedPost.likesCount || 0) - 1) : (selectedPost.likesCount || 0) + 1;
            setSelectedPost({
              ...selectedPost,
              isLikedByMe: !isLiked,
              likesCount: newLikesCount
            });
            // Update total likes count
            setLikesCount(prev => isLiked ? Math.max(0, prev - 1) : prev + 1);
          }
        }}
        onComment={onCommentPost}
        onForward={onForwardPost}
        initialShowComments={openComments}
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

      <section className="max-w-4xl mx-auto px-6 text-left -mt-20 relative z-10">
        <div className="flex justify-between items-end mb-6">
          <div className="relative">
            <div 
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full p-[3px] story-ring bg-background shadow-2xl cursor-pointer"
              onClick={() => myStories.length > 0 && setActiveStoryIndex(0)}
            >
              <img src={creator?.avatar} className="w-full h-full object-cover rounded-full border-4 border-white" referrerPolicy="no-referrer" />
              {myStories.length > 0 && (
                <div className="absolute inset-0 rounded-full border-4 border-primary animate-pulse pointer-events-none"></div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            {onMessage && (
              <button 
                onClick={() => onMessage(creator)}
                className="w-12 h-12 rounded-full border border-on-surface/10 bg-white/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:bg-on-surface/5 transition-all active:scale-95 shadow-sm"
              >
                <Mail size={22} />
              </button>
            )}
            <button 
              onClick={handleFollow}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all active:scale-95 shadow-sm ${
                isFollowing 
                ? 'bg-primary border-primary text-white' 
                : 'bg-white/80 backdrop-blur-md border-on-surface/10 text-on-surface hover:bg-on-surface/5'
              }`}
            >
              <UserPlus size={22} />
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-2">
              {creator?.name}
              {creator?.verificada && (
                <div className="bg-[#0095f6] p-0.5 rounded-full flex items-center justify-center">
                  <Check size={10} className="text-white" strokeWidth={4} />
                </div>
              )}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-sm text-on-surface/60 font-medium">@{creator?.username || creator?.name?.toLowerCase().replace(/\s+/g, '')}</p>
            </div>
          </div>
          {creator.social_links && (
            <div className="flex gap-3">
              {creator.social_links.instagram && (
                <a href={creator.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                  <Instagram size={24} />
                </a>
              )}
              {creator.social_links.twitter && (
                <a href={creator.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                  <Twitter size={24} />
                </a>
              )}
              {creator.social_links.tiktok && (
                <a href={creator.social_links.tiktok} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                  <Music size={24} />
                </a>
              )}
            </div>
          )}
        </div>

        <p className="text-sm text-black font-medium mb-2 max-w-xl leading-relaxed">{creator?.bio}</p>

        {creator?.cidade && (
          <div className="flex items-center gap-1.5 text-on-surface/40 mb-6">
            <MapPin size={12} className="text-primary/60" />
            <span className="text-[11px] font-bold uppercase tracking-widest">{creator.cidade}</span>
          </div>
        )}

        {creator.welcome_audio && (
          <WelcomeAudioPlayer audioUrl={creator.welcome_audio} />
        )}

        {/* Temporariamente removido
        {creator?.services_bio && (
          <div className="bg-gradient-to-br from-white to-primary/5 p-6 rounded-[2rem] shadow-sm max-w-md mx-auto border border-primary/10 mb-8 text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                    <Star size={18} className="text-white" fill="currentColor" />
                  </div>
                  <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-primary">Serviços & Preços</h4>
                </div>
                <div className="bg-primary/10 px-3 py-1 rounded-full">
                  <span className="text-[9px] font-black uppercase text-primary tracking-wider">Premium</span>
                </div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-primary/5">
                <FormattedText 
                  text={creator?.services_bio} 
                  className="text-sm text-on-surface/80 leading-relaxed whitespace-pre-wrap font-medium"
                />
              </div>
            </div>
          </div>
        )}
        */}

        <AtendimentoPresencialSection atendimentos={creator?.atendimento_presencial || []} />

        <div className="max-w-md mx-auto space-y-3 mb-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button 
                onClick={() => setShowMimoModal(true)}
                className="w-full py-4 bg-pink-500 text-white font-black rounded-2xl shadow-sm shadow-pink-500/20 active:scale-95 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
              >
                <Gift size={16} />
                Enviar MIMO
              </button>
            </div>
            
            <div className="flex flex-col gap-2 mt-2 mb-0">
              <button 
                onClick={onSubscribe}
                className="w-full py-4 premium-gradient text-white font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <Crown size={18} fill="white" />
                Assinar VIP
              </button>
              <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest text-center">
                Acesso imediato a todo o conteúdo exclusivo
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 sm:gap-8 mb-4 py-4 px-4 bg-white rounded-2xl shadow-sm max-w-[280px] mx-auto border border-primary/5 overflow-hidden">
          <div className="text-center min-w-[50px]">
            <span className="block text-lg font-bold">{myPosts.length}</span>
            <span className="text-[9px] uppercase tracking-widest font-bold text-on-surface/40">Posts</span>
          </div>
          <div className="w-px h-6 bg-primary/10 flex-shrink-0"></div>
          <div className="text-center min-w-[50px]">
            <span className="block text-lg font-bold">{followerCount}</span>
            <span className="text-[9px] uppercase tracking-widest font-bold text-on-surface/40">Seguidores</span>
          </div>
          <div className="w-px h-6 bg-primary/10 flex-shrink-0"></div>
          <div className="text-center min-w-[50px]">
            <span className="block text-lg font-bold">{likesCount}</span>
            <span className="text-[9px] uppercase tracking-widest font-bold text-on-surface/40">Curtidas</span>
          </div>
        </div>
      </section>

      <div className="sticky top-16 bg-white/80 backdrop-blur-md z-40 border-b border-primary/5 mb-6">
        <div className="max-w-4xl mx-auto px-6 flex justify-center">
          <button 
            onClick={() => setActiveTab('all')}
            className={`py-4 border-b-2 font-bold text-xs uppercase tracking-widest ${activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-on-surface/40'}`}
          >
            MIDIAS
          </button>
        </div>
      </div>

      <section className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-2">
          {myPosts.map((post) => (
            <div 
              key={post.id} 
              className="relative aspect-square overflow-hidden rounded-2xl bg-black shadow-sm group cursor-pointer"
              onClick={() => {
                if (!post.hasAccess) onSubscribe();
                else {
                  setSelectedPost(post);
                  setOpenComments(false);
                }
              }}
            >
              <SecureMedia 
                mediaPath={post.image}
                isVideo={post.isVideo}
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!post.hasAccess ? 'blur-2xl scale-125 opacity-40' : ''}`} 
              />
              {!post.hasAccess && (
                <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-white p-2 text-center">
                  <Lock size={20} fill="white" className="drop-shadow-lg mb-1" />
                  <span className="text-[8px] font-black uppercase tracking-widest drop-shadow-md mb-2">VIP</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSubscribe();
                    }}
                    className="px-3 py-1.5 bg-primary text-white text-[7px] font-black uppercase tracking-widest rounded-lg shadow-lg active:scale-95 transition-all"
                  >
                    ASSINAR
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
                  <Heart size={12} fill={post.isLikedByMe ? "#ec4899" : "white"} className={post.isLikedByMe ? "text-pink-500" : ""} />
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

const ChatView = ({ recipient, onBack, onMessagesRead, onViewProfile }: { recipient: Creator, onBack?: () => void, onMessagesRead?: () => void, onViewProfile?: (id: string) => void }) => {
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
          .filter(m => m.receiver_id === userId && m.is_read !== true && m.is_read !== 'true')
          .map(m => m.id);
        
        if (unreadIds.length > 0) {
          const { error: updateError } = await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', unreadIds);
          
          if (updateError) {
            console.error('Error updating messages as read:', updateError);
          } else {
            console.log(`Successfully marked ${unreadIds.length} messages as read`);
            if (onMessagesRead) onMessagesRead();
          }
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
      media_type: type,
      is_read: false
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

      let type: 'image' | 'video' | 'audio' = 'image';
      if (fileType.startsWith('video/')) type = 'video';
      else if (fileType.startsWith('audio/')) type = 'audio';

      await handleSendMessage(filePath, type);
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
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onViewProfile?.(recipient?.id)}
        >
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
                        <SecureMedia mediaPath={msg.media_url} isVideo={false} className="w-full max-h-64 object-cover" />
                      )}
                      {msg.media_type === 'video' && (
                        <SecureMedia mediaPath={msg.media_url} isVideo={true} controls className="w-full max-h-64" />
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

const ScreenMessages = ({ messages, isMaster, onMessagesRead, onViewProfile }: { messages: Message[], isMaster: boolean, onMessagesRead?: () => void, onViewProfile?: (id: string) => void }) => {
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
          const { data: masterProfile } = await supabase.from('profiles').select('*').eq('role', 'master').single();
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
    return <ChatView recipient={selectedRecipient} onBack={() => setSelectedRecipient(null)} onMessagesRead={onMessagesRead} onViewProfile={onViewProfile} />;
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
                onClick={() => onViewProfile?.(contact.id)}
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
              {msg.unreadCount > 0 && (
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
  const [welcomeAudio, setWelcomeAudio] = useState(creator.welcome_audio || '');
  const [avatar, setAvatar] = useState(creator.avatar);
  const [coverImage, setCoverImage] = useState(creator.cover_image || '');
  const [instagram, setInstagram] = useState(creator.social_links?.instagram || '');
  const [twitter, setTwitter] = useState(creator.social_links?.twitter || '');
  const [tiktok, setTiktok] = useState(creator.social_links?.tiktok || '');
  const [cidade, setCidade] = useState(creator.cidade || '');
  const [loading, setLoading] = useState(false);

  // Removida a sincronização agressiva que limpava os campos durante a digitação
  
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
        welcome_audio: welcomeAudio,
        avatar,
        cover_image: coverImage,
        role: creator.role,
        cidade
      }).eq('id', user.id);

      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        alert(`Erro ao atualizar perfil: ${error.message}`);
        throw error;
      }

      // Save social connections
      const socialLinks = [
        { platform: 'instagram', url: instagram },
        { platform: 'twitter', url: twitter },
        { platform: 'tiktok', url: tiktok }
      ];

      console.log('Iniciando salvamento de redes sociais para o usuário:', user.id, socialLinks);

      for (const link of socialLinks) {
        try {
          if (link.url && link.url.trim() !== '') {
            console.log(`Tentando upsert para ${link.platform}:`, link.url.trim());
            const { data: upsertData, error: socialError } = await supabase
              .from('social_connections')
              .upsert(
                { profile_id: user.id, platform: link.platform, url: link.url.trim() },
                { onConflict: 'profile_id, platform' }
              )
              .select();
            
            if (socialError) {
              console.warn(`Upsert falhou para ${link.platform}, tentando estratégia de fallback:`, socialError.message);
              
              // Fallback: Deletar existente e inserir novo
              await supabase
                .from('social_connections')
                .delete()
                .eq('profile_id', user.id)
                .eq('platform', link.platform);
                
              const { error: insertError } = await supabase
                .from('social_connections')
                .insert({ profile_id: user.id, platform: link.platform, url: link.url.trim() });
                
              if (insertError) {
                console.error(`Erro crítico ao salvar ${link.platform}:`, insertError);
                alert(`Erro ao salvar ${link.platform}: ${insertError.message}`);
              } else {
                console.log(`Sucesso ao salvar ${link.platform} via fallback.`);
              }
            } else {
              console.log(`Sucesso ao salvar ${link.platform}:`, upsertData);
            }
          } else {
            // Se a URL estiver vazia, removemos a conexão existente
            console.log(`Removendo conexão vazia para ${link.platform}`);
            const { error: deleteError } = await supabase
              .from('social_connections')
              .delete()
              .eq('profile_id', user.id)
              .eq('platform', link.platform);
            
            if (deleteError) console.warn(`Aviso ao remover ${link.platform}:`, deleteError);
          }
        } catch (socialErr: any) {
          console.error(`Exceção no loop de redes sociais (${link.platform}):`, socialErr);
        }
      }

      console.log('Salvamento de redes sociais concluído.');
      onProfileUpdated();
      alert('Perfil e redes sociais salvos com sucesso!');
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
            <label className="text-[10px] uppercase tracking-widest font-black text-primary/70 px-1">Nome de Usuário (@)</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-on-surface/40 font-bold">@</span>
              <input 
                className="w-full bg-white border border-primary/10 rounded-xl pl-9 pr-4 py-3.5 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
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
            <label className="text-[10px] uppercase tracking-widest font-black text-primary/70 px-1">Cidade</label>
            <input 
              className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
              placeholder="Ex: Montes Claros - Minas Gerais"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-primary/70 px-1">Áudio - Ouça minha voz</label>
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
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40 px-1">Instagram</label>
              <input 
                className="w-full bg-background border border-primary/5 rounded-lg px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/10 font-medium" 
                placeholder="https://instagram.com/usuario" 
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40 px-1">Twitter (X)</label>
              <input 
                className="w-full bg-background border border-primary/5 rounded-lg px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/10 font-medium" 
                placeholder="https://twitter.com/usuario" 
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-on-surface/40 px-1">TikTok</label>
              <input 
                className="w-full bg-background border border-primary/5 rounded-lg px-4 py-2.5 text-xs focus:ring-2 focus:ring-primary/10 font-medium" 
                placeholder="https://tiktok.com/@usuario" 
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
              />
            </div>
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cropImage, setCropImage] = useState<{ url: string, aspect: number } | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const uploadFile = async (file: File) => {
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

      setImage(filePath);
      setPreviewUrl(URL.createObjectURL(file));
      setIsVideo(file.type.startsWith('video/'));
    } catch (err: any) {
      setError(`Erro no upload: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      setOriginalFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setCropImage({ url: reader.result as string, aspect: 1 });
      };
      reader.readAsDataURL(file);
    } else {
      await uploadFile(file);
    }
  };

  const handleSkipCrop = async () => {
    if (originalFile) {
      await uploadFile(originalFile);
    }
    setCropImage(null);
    setOriginalFile(null);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    const file = new File([croppedBlob], `post_${Date.now()}.jpg`, { type: 'image/jpeg' });
    await uploadFile(file);
    setCropImage(null);
    setOriginalFile(null);
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
      {cropImage && (
        <CropModal 
          image={cropImage.url} 
          aspect={cropImage.aspect}
          onCropComplete={handleCropComplete} 
          onSkip={handleSkipCrop}
          onClose={() => {
            setCropImage(null);
            setOriginalFile(null);
          }} 
        />
      )}
      <section className="mb-8 pt-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-1">Nova Postagem</h1>
        <p className="text-on-surface/60 text-sm font-medium">Compartilhe sua arte com o mundo.</p>
      </section>

      <form className="space-y-8" onSubmit={handleCreatePost}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest px-1">Mídia (Foto ou Vídeo)</label>
            <div className="relative group aspect-video bg-white border-2 border-dashed border-primary/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 transition-all overflow-hidden">
              {previewUrl ? (
                isVideo ? (
                  <video src={`${previewUrl}#t=0.001`} className="w-full h-full object-cover" controls />
                ) : (
                  <img src={previewUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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

const ScreenLogin = ({ onLogin, onNavigateToRegister }: { onLogin: (user?: any) => void, onNavigateToRegister: () => void }) => {
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onLogin(data.user);
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
    <div className="min-h-screen flex flex-col items-center justify-start px-8 pt-0 pb-12 bg-background">
      <div className="w-full max-w-md space-y-2">
        <div className="flex flex-col items-center space-y-0">
          <img 
            src={LOGIN_LOGO_URL} 
            alt="Logo" 
            className="h-32 w-auto object-contain mb-0" 
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

const ScreenAdminDashboard = ({ onBack }: { onBack: () => void }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCreators: 0,
    totalRevenue: 0,
    totalPosts: 0,
    totalSubscriptions: 0
  });
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'sales' | 'withdrawals'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: creatorCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'creator');
      const { count: postCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
      const { count: subCount } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active');
      
      const { data: payments } = await supabase.from('payments').select('amount').eq('status', 'approved');
      const totalRevenue = payments?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;

      setStats({
        totalUsers: userCount || 0,
        totalCreators: creatorCount || 0,
        totalRevenue,
        totalPosts: postCount || 0,
        totalSubscriptions: subCount || 0
      });

      // Fetch recent sales
      const { data: sales, error: salesError } = await supabase
        .from('payments')
        .select(`
          *,
          buyer:profiles!user_id (name, avatar, username),
          creator:profiles!creator_id (name, avatar, username)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (salesError) {
        console.error('Error fetching sales:', salesError);
      }
      setRecentSales(sales || []);

      // Fetch users
      const { data: allUsers } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      setUsers(allUsers || []);

      // Fetch withdrawals
      const { data: allWithdrawals } = await supabase
        .from('withdrawal_requests')
        .select('*, profiles:profile_id (*)')
        .order('created_at', { ascending: false });
      setWithdrawals(allWithdrawals || []);

    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWithdrawalStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      fetchAdminData();
      alert(`Saque ${status === 'approved' ? 'pago' : 'cancelado'} com sucesso!`);
    } catch (err: any) {
      alert(`Erro ao atualizar saque: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-on-surface/60 font-bold uppercase tracking-widest text-xs">Carregando Painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-primary/5 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight">Painel Administrativo</h1>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Controle Total</p>
          </div>
        </div>
        <button onClick={fetchAdminData} className="p-2 hover:bg-primary/5 rounded-full transition-colors">
          <RefreshCw size={20} />
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 pt-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-primary/5 shadow-sm">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-primary text-white shadow-lg' : 'text-on-surface/40 hover:bg-primary/5'}`}
          >
            <PieChart size={16} />
            Visão Geral
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-primary text-white shadow-lg' : 'text-on-surface/40 hover:bg-primary/5'}`}
          >
            <Users size={16} />
            Usuários
          </button>
          <button 
            onClick={() => setActiveTab('sales')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'sales' ? 'bg-primary text-white shadow-lg' : 'text-on-surface/40 hover:bg-primary/5'}`}
          >
            <DollarSign size={16} />
            Vendas
          </button>
          <button 
            onClick={() => setActiveTab('withdrawals')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'withdrawals' ? 'bg-primary text-white shadow-lg' : 'text-on-surface/40 hover:bg-primary/5'}`}
          >
            <Wallet size={16} />
            Saques
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-primary/5 shadow-sm">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <Users size={20} />
                </div>
                <p className="text-2xl font-black">{stats.totalUsers}</p>
                <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">Usuários</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-primary/5 shadow-sm">
                <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Crown size={20} />
                </div>
                <p className="text-2xl font-black">{stats.totalCreators}</p>
                <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">Criadores</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-primary/5 shadow-sm">
                <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center mb-4">
                  <DollarSign size={20} />
                </div>
                <p className="text-2xl font-black">R$ {stats.totalRevenue.toFixed(2)}</p>
                <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">Vendas Totais</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-primary/5 shadow-sm">
                <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <ImageIcon size={20} />
                </div>
                <p className="text-2xl font-black">{stats.totalPosts}</p>
                <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">Postagens</p>
              </div>
            </div>

            {/* Recent Sales Preview */}
            <div className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-primary/5 flex items-center justify-between">
                <h3 className="font-black text-sm uppercase tracking-widest">Vendas Recentes</h3>
                <button onClick={() => setActiveTab('sales')} className="text-primary text-[10px] font-black uppercase tracking-widest">Ver Todas</button>
              </div>
              <div className="divide-y divide-primary/5">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="px-6 py-4 flex items-center justify-between hover:bg-primary/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={sale.buyer?.avatar} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <p className="text-sm font-bold">{sale.buyer?.name || 'Usuário'}</p>
                        <p className="text-[10px] text-on-surface/40 font-bold uppercase tracking-widest">Comprou de {sale.creator?.name || 'Criador'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-green-500">R$ {Number(sale.amount).toFixed(2)}</p>
                      <p className="text-[10px] text-on-surface/40 font-bold uppercase tracking-widest">{new Date(sale.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                ))}
                {recentSales.length === 0 && (
                  <div className="px-6 py-12 text-center">
                    <p className="text-on-surface/40 font-bold uppercase tracking-widest text-xs">Nenhuma venda registrada</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface/40" size={20} />
              <input 
                type="text"
                placeholder="Buscar usuários por nome, username ou e-mail..."
                className="w-full bg-white border border-primary/5 rounded-2xl pl-14 pr-6 py-4 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
              <div className="divide-y divide-primary/5">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="px-6 py-4 flex items-center justify-between hover:bg-primary/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <img src={u.avatar} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black">{u.name}</p>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${
                            u.role === 'admin' ? 'bg-red-500 text-white' : 
                            u.role === 'creator' ? 'bg-primary text-white' : 
                            'bg-on-surface/10 text-on-surface/60'
                          }`}>
                            {u.role || 'user'}
                          </span>
                        </div>
                        <p className="text-[10px] text-on-surface/40 font-bold uppercase tracking-widest">@{u.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-primary/10 rounded-xl text-primary transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-500/10 rounded-xl text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <div className="px-6 py-12 text-center">
                    <p className="text-on-surface/40 font-bold uppercase tracking-widest text-xs">Nenhum usuário encontrado</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Search Sales */}
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface/40" size={20} />
              <input 
                type="text"
                placeholder="Buscar vendas por comprador, criador ou descrição..."
                className="w-full bg-white border border-primary/5 rounded-2xl pl-14 pr-6 py-4 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary/5">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface/40">Data</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface/40">Comprador</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface/40">Criador</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface/40">Descrição</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface/40">Valor</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface/40">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {recentSales.filter(sale => {
                    const search = searchTerm.toLowerCase();
                    const buyerName = sale.buyer?.name?.toLowerCase() || '';
                    const creatorName = sale.creator?.name?.toLowerCase() || '';
                    const description = sale.description?.toLowerCase() || '';
                    return buyerName.includes(search) || creatorName.includes(search) || description.includes(search);
                  }).map((sale) => (
                    <tr key={sale.id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4 text-[11px] font-bold">{new Date(sale.created_at).toLocaleDateString('pt-BR')}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <img src={sale.buyer?.avatar} className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                          <span className="text-xs font-bold">{sale.buyer?.name || 'Usuário'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <img src={sale.creator?.avatar} className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                          <span className="text-xs font-bold">{sale.creator?.name || 'Criador'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[10px] font-medium text-on-surface/60 line-clamp-1">{sale.description || 'Conteúdo'}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-black text-green-500">R$ {Number(sale.amount).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full w-fit">Aprovado</span>
                          {sale.description?.toLowerCase().includes('assinatura') && (
                            <span className="bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full w-fit">Assinatura</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentSales.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-on-surface/40 font-bold uppercase tracking-widest text-xs">Nenhuma venda registrada</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary/5">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface/40">Data</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface/40">Criador</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface/40">Valor</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface/40">Chave PIX</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface/40">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface/40">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {withdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4 text-[11px] font-bold">{new Date(w.created_at).toLocaleDateString('pt-BR')}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <img src={w.profiles?.avatar} className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                          <span className="text-xs font-bold">{w.profiles?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-black">R$ {Number(w.amount).toFixed(2)}</td>
                      <td className="px-6 py-4 text-[10px] font-medium">{w.pix_key}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          w.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                          w.status === 'approved' ? 'bg-green-50 text-green-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {w.status === 'pending' ? 'Pendente' : w.status === 'approved' ? 'Pago' : 'Cancelado'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {w.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleUpdateWithdrawalStatus(w.id, 'approved')}
                              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                              title="Aprovar Pagamento"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={() => handleUpdateWithdrawalStatus(w.id, 'rejected')}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              title="Rejeitar"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {withdrawals.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-on-surface/40 font-bold uppercase tracking-widest text-xs">Nenhuma solicitação de saque</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ScreenRegister = ({ onRegister, onNavigateToLogin }: { onRegister: (user?: any) => void, onNavigateToLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
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
            phone: phone,
            username: username
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
          email: email,
          username: username || (email.split('@')[0] + Math.floor(Math.random() * 1000)),
          avatar: `https://picsum.photos/seed/${data.user.id}/400`,
          bio: 'Novo usuário no pedaço!',
          stats: { posts: '0', followers: '0', likes: '0' },
          phone: phone,
          role: 'user'
        });
        if (profileError) {
          console.error('Error creating profile:', profileError);
          // If profile creation fails, we might want to alert the user or try again
          // but for now we'll just log it.
        } else {
          console.log('Profile created successfully');
        }
      }

      onRegister(data.user);
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-8 pt-0 pb-12 bg-background">
      <div className="w-full max-w-md space-y-2">
        <div className="flex flex-col items-center space-y-0">
          <img 
            src={LOGIN_LOGO_URL} 
            alt="Logo" 
            className="h-32 w-auto object-contain mb-0" 
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
          <div className="text-center w-full relative">
            <div className="space-y-0">
              <h1 className="text-2xl font-black tracking-tight leading-none text-on-surface">Crie sua conta</h1>
              <p className="text-on-surface/60 text-sm font-bold max-w-[280px] mx-auto">Assine, interaja e conecte-se com acompanhantes e criadores em um clique.</p>
            </div>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <input 
                className="w-full bg-white border border-primary/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
                placeholder="Nome Completo" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="relative flex items-center">
                <span className="absolute left-5 text-on-surface/40 font-bold">@</span>
                <input 
                  className="w-full bg-white border border-primary/5 rounded-2xl pl-10 pr-5 py-4 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
                  placeholder="nome_de_usuario" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <input 
                className="w-full bg-white border border-primary/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
                placeholder="E-mail" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <input 
                className="w-full bg-white border border-primary/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
                placeholder="Telefone" 
                type="tel"
                value={phone}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, '');
                  if (val.length > 11) val = val.slice(0, 11);
                  
                  let formatted = '';
                  if (val.length > 0) {
                    formatted = '(' + val.slice(0, 2);
                    if (val.length > 2) {
                      formatted += ') ' + val.slice(2, 7);
                      if (val.length > 7) {
                        formatted += '-' + val.slice(7);
                      }
                    }
                  }
                  setPhone(formatted);
                }}
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="relative flex items-center">
                <input 
                  className="w-full bg-white border border-primary/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 shadow-sm font-bold text-on-surface" 
                  placeholder="Senha" 
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

          <div className="space-y-3">
            <div className="flex items-start gap-4 px-4 py-4 bg-primary/5 rounded-2xl border border-primary/10 hover:bg-primary/10 transition-colors cursor-pointer group" onClick={() => {
              const cb = document.getElementById('age-check') as HTMLInputElement;
              if (cb) cb.checked = !cb.checked;
            }}>
              <div className="flex items-center h-7">
                <input 
                  id="age-check"
                  type="checkbox" 
                  className="w-7 h-7 rounded-lg border-primary/30 text-primary focus:ring-primary/20 cursor-pointer accent-primary transition-transform group-active:scale-90" 
                  required 
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="space-y-1">
                <p className="text-[13px] font-black text-on-surface leading-tight flex items-center gap-2">
                  <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-md">+18 ANOS</span>
                  Confirmo que sou maior de idade
                </p>
                <p className="text-[11px] font-bold text-on-surface/60 leading-relaxed">
                  Ao marcar, você atesta que tem pelo menos 18 anos e concorda com nossos <span className="text-primary underline">Termos e Privacidade</span>.
                </p>
              </div>
            </div>
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

const ScreenPayment = ({ onBack, creator }: { onBack: () => void, creator: Creator | null }) => {
  const [step, setStep] = useState<'select-plan' | 'checkout'>('select-plan');
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pixData, setPixData] = useState<{ qrCode: string, qrCodeBase64: string, paymentId: string } | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const defaultPlans = [
    { id: 'monthly', name: '1 mês', price: '19.90', description: 'Acesso total por 30 dias', duration: 30, category: 'Assinaturas' },
    { id: 'quarterly', name: '3 meses (50% off)', price: '29.85', description: 'Economize 50% - 90 dias', badge: 'Popular', duration: 90, category: 'Promoções' },
    { id: 'yearly', name: '6 meses (50% off)', price: '59.70', description: 'Economize 50% - 180 dias', badge: 'Melhor Valor', duration: 180, category: 'Promoções' },
  ];

  const plans = creator?.stats?.plans || defaultPlans;

  // Ensure selectedPlan is valid
  React.useEffect(() => {
    if (plans.length > 0 && !plans.find((p: any) => p.id === selectedPlan)) {
      setSelectedPlan(plans[0].id);
    }
  }, [plans, selectedPlan]);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error && (error.message?.includes('Refresh Token Not Found') || error.message?.includes('Invalid Refresh Token'))) {
        supabase.auth.signOut();
      }
      setCurrentUser(data?.user || null);
    });
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
      const selectedPlanData = plans.find((p: any) => p.id === selectedPlan);
      const amount = parseFloat(String(selectedPlanData?.price).replace('R$ ', '').replace(',', '.') || '0');
      const description = `Assinatura ${selectedPlanData?.name} - ${creator.name}`;
      const duration = selectedPlanData?.duration || 30;

      // Check if we already have a paymentId in state to reuse it
      const response = await fetch('/api/payments/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          description,
          payerEmail: currentUser.email,
          userId: currentUser.id,
          creatorId: creator.id,
          planId: selectedPlan,
          duration,
          paymentId: paymentId
        })
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Erro do servidor: ${text.substring(0, 100)}`);
      }

      if (data.error) {
        if (data.paymentId) {
          setPaymentId(data.paymentId);
          // Don't alert, let the UI show the recovery state
          return;
        }
        throw new Error(data.error);
      }
      
      setPixData(data);
      if (data.paymentId) setPaymentId(data.paymentId);
    } catch (error: any) {
      console.error("Erro ao gerar Pix:", error);
      // If we have a paymentId, we can show the "waiting" UI even if generation failed
      if (paymentId) {
        // We don't have pixData yet, but we have an ID to poll
      } else {
        alert(`Erro ao gerar Pix: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    const currentPaymentId = pixData?.paymentId || paymentId;
    if (!currentPaymentId || currentPaymentId === 'undefined' || checkingStatus) return;
    
    setCheckingStatus(true);
    try {
      // First, try to sync with the server (which checks the platform directly)
      const response = await fetch(`/api/payments/sync/${currentPaymentId}`);
      const result = await response.json();

      if (result.status === 'approved') {
        setSuccess(true);
      } else {
        // Fallback: check the database directly just in case
        const { data } = await supabase
          .from('payments')
          .select('status')
          .eq('id', currentPaymentId)
          .single();

        if (data && data.status === 'approved') {
          setSuccess(true);
        }
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
    } finally {
      setCheckingStatus(false);
    }
  };

  // Polling for payment status
  React.useEffect(() => {
    if (!paymentId && !pixData?.paymentId) return;

    const interval = setInterval(async () => {
      const currentId = pixData?.paymentId || paymentId;
      if (!currentId || currentId === 'undefined') return;

      const { data } = await supabase
        .from('payments')
        .select('status')
        .eq('id', currentId)
        .single();

      if (data && data.status === 'approved') {
        setSuccess(true);
        clearInterval(interval);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [pixData?.paymentId, paymentId]);

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
          onClick={() => {
            onBack();
            // Force a global data refresh to unlock content
            if ((window as any).refreshAppData) {
              (window as any).refreshAppData();
            }
          }}
          className="w-full py-5 premium-gradient text-white font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all uppercase tracking-widest text-sm"
        >
          Começar a Ver
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 overflow-y-auto no-scrollbar">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative"
      >
        <button 
          onClick={onBack}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header with Cover and Profile */}
        <div className="relative h-24 bg-primary/10">
          <img 
            src={creator?.cover_image || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800'} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-10 left-6 flex items-end gap-2">
            <div className="w-14 h-14 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white">
              <img src={creator?.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="pb-0.5 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-lg shadow-sm border border-white">
              <h2 className="font-bold text-slate-900 leading-tight text-xs">{creator?.name}</h2>
              <p className="text-[8px] text-slate-500 font-medium">@{creator?.username}</p>
            </div>
          </div>
        </div>

        <div className="pt-16 px-6 pb-4 space-y-2">
          {step === 'select-plan' ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest">Assinaturas</h3>
                <div className="space-y-2">
                  {plans.filter((p: any) => p.category !== 'Promoções').map((plan: any) => (
                    <button
                      key={plan.id}
                      onClick={() => {
                        setSelectedPlan(plan.id);
                        setStep('checkout');
                      }}
                      className="w-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold py-3.5 px-6 rounded-full flex items-center justify-between transition-all active:scale-[0.98] shadow-sm"
                    >
                      <span className="text-sm">{plan.name}</span>
                      <span className="text-sm">R$ {parseFloat(String(plan.price).replace(',', '.')).toFixed(2).replace('.', ',')}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest">Promoções</h3>
                  <ChevronDown size={14} className="text-on-surface/40" />
                </div>
                <div className="space-y-2">
                  {plans.filter((p: any) => p.category === 'Promoções').map((plan: any) => (
                    <button
                      key={plan.id}
                      onClick={() => {
                        setSelectedPlan(plan.id);
                        setStep('checkout');
                      }}
                      className="w-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold py-3.5 px-6 rounded-full flex items-center justify-between transition-all active:scale-[0.98] shadow-sm"
                    >
                      <span className="text-sm">{plan.name}</span>
                      <span className="text-sm">R$ {parseFloat(String(plan.price)).toFixed(2).replace('.', ',')}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Benefits */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-1.5 text-[9px] text-on-surface/60 font-bold uppercase tracking-wider">
                  <Check size={12} className="text-rose-500" />
                  <span>Acesso Total</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-on-surface/60 font-bold uppercase tracking-wider">
                  <Check size={12} className="text-rose-500" />
                  <span>Chat VIP</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-on-surface/60 font-bold uppercase tracking-wider">
                  <Check size={12} className="text-rose-500" />
                  <span>Exclusivo</span>
                </div>
              </div>

              <div className="h-px bg-on-surface/5 w-full" />

              {/* Payment Info */}
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <div className="space-y-0.5">
                    {!pixData && <h3 className="font-bold text-slate-900 text-sm">Formas de pagamento</h3>}
                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Valor</p>
                  </div>
                  <p className="text-xl font-black text-slate-900">
                    R$ {parseFloat(String(plans.find((p: any) => p.id === selectedPlan)?.price || '0')).toFixed(2).replace('.', ',')}
                  </p>
                </div>

                {!pixData && !paymentId ? (
                  <div className="space-y-2">
                    <button 
                      onClick={generatePix}
                      disabled={loading}
                      className="w-full py-4 premium-gradient text-white font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <QrCode size={20} />
                          Gerar Pix
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => setStep('select-plan')}
                      className="w-full py-2 text-on-surface/40 font-bold text-[10px] uppercase tracking-widest hover:text-primary transition-colors"
                    >
                      Alterar Plano
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 flex flex-col items-center">
                    {/* QR Code */}
                    <div className="w-48 h-48 bg-white rounded-2xl p-3 shadow-lg border border-on-surface/5 relative flex items-center justify-center">
                      {pixData?.qrCodeBase64 ? (
                        <img 
                          src={`data:image/jpeg;base64,${pixData.qrCodeBase64}`} 
                          alt="Pix QR Code" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-center p-4">
                          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                          <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest leading-tight">
                            Processando no Turbofy...
                          </p>
                        </div>
                      )}
                    </div>

                    {/* PIX Key Input */}
                    <div className="w-full space-y-3">
                      {pixData ? (
                        <>
                          <div className="w-full bg-on-surface/5 border border-on-surface/10 rounded-2xl px-4 py-3 flex items-center gap-2">
                            <input 
                              readOnly 
                              value={pixData.qrCode} 
                              className="bg-transparent border-none outline-none flex-1 text-[10px] font-medium text-on-surface/60 truncate"
                            />
                          </div>
                          
                          <button 
                            onClick={handleCopyPix}
                            className="w-full py-4 bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-black rounded-2xl shadow-lg active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
                          >
                            {copied ? 'Copiado!' : 'Copiar chave Pix'}
                          </button>
                        </>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-[10px] text-amber-600 bg-amber-50 p-3 rounded-xl font-bold uppercase tracking-tight leading-relaxed text-center">
                            O Turbofy está demorando. <br/>
                            Se você já pagou, aguarde aqui.
                          </p>
                          <button 
                            onClick={generatePix}
                            disabled={loading}
                            className="w-full py-4 bg-on-surface text-white font-black rounded-2xl shadow-lg active:scale-[0.98] transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                          >
                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Tentar Recuperar QR Code'}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="h-px bg-on-surface/5 w-full" />

                    {/* Status Polling */}
                    <div className="flex flex-col items-center gap-2 w-full">
                      <div className="flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-widest animate-pulse">
                        <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        Aguardando confirmação...
                      </div>
                      
                      <button 
                        onClick={checkPaymentStatus}
                        disabled={checkingStatus}
                        className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 hover:text-primary transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        <RefreshCw size={10} className={checkingStatus ? 'animate-spin' : ''} />
                        {checkingStatus ? 'Verificando...' : 'Verificar agora'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

// --- Constants ---

export default function App() {
  const { user, profile, loading: authLoading, error: authError, signOut, refreshProfile } = useAuth();
  const [screen, setScreen] = React.useState<Screen>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('u')) return 'public-profile';
    
    const saved = localStorage.getItem('novinha_screen');
    if (saved && ['feed', 'profile', 'activity', 'messages', 'edit-profile', 'create-post', 'wallet', 'payment'].includes(saved)) {
      return saved as Screen;
    }
    return 'feed';
  });
  
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [stories, setStories] = React.useState<any[]>([]);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = React.useState(0);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [publicCreator, setPublicCreator] = React.useState<Creator | null>(null);
  const [publicPosts, setPublicPosts] = React.useState<Post[]>([]);
  const [dataLoading, setDataLoading] = React.useState(true);
  const [showResetButton, setShowResetButton] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [selectedRecipient, setSelectedRecipient] = React.useState<Creator | null>(null);
  const [forwardingPost, setForwardingPost] = React.useState<Post | null>(null);
  const [editingPost, setEditingPost] = React.useState<Post | null>(null);

  const isMaster = profile?.role === 'master' || profile?.role === 'admin' || profile?.role === 'creator';
  const isGlobalAdmin = profile?.role === 'master' || profile?.role === 'admin';
  const isLoggedIn = !!user;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (authLoading || dataLoading) setShowResetButton(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [authLoading, dataLoading]);

  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const handleReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    signOut().catch(console.error);
    window.location.href = '/';
  };

  const checkAccess = (post: any, currentUserId: string | undefined, userProfile: Creator | null, subscribedIds: Set<string>) => {
    if (!post) return false;
    const isOwner = currentUserId && post.creator_id === currentUserId;
    const isGlobalAdmin = userProfile?.role === 'admin' || userProfile?.role === 'master';
    const isLocked = post.is_locked === true || post.isLocked === true;
    const isUnlocked = !isLocked;
    const isSubscribed = subscribedIds.has(post.creator_id);

    const access = !!(isOwner || isGlobalAdmin || isUnlocked || isSubscribed);
    
    return access;
  };

  const fetchData = React.useCallback(async () => {
    if (!user || !profile) {
      setDataLoading(false);
      return;
    }
    
    setDataLoading(true);
    setFetchError(null);
    try {
      console.log('Fetching data for user:', user.id);
      
      // Get master profile ID for filtering
      let masterId = null;
      try {
        const { data: masterProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin')
          .limit(1)
          .maybeSingle();
        masterId = masterProfile?.id;
        console.log('Master ID found:', masterId);
      } catch (e) {
        console.log('Master profile not found');
      }

      // Fetch followed creators
      let followedCreatorIds: string[] = [];
      try {
        const { data: follows, error: followsError } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', profile.id);
        
        if (followsError) throw followsError;
        followedCreatorIds = follows?.map(f => f.following_id) || [];
        console.log('Followed creators found:', followedCreatorIds);
      } catch (err) {
        console.warn('Error fetching follows:', err);
      }

      // Fetch posts with likes and comments
      let postsData: any[] = [];
      
      try {
        // Construct relevant IDs for initial filtering
        const relevantIds = [profile.id];
        if (masterId) relevantIds.push(masterId);
        if (followedCreatorIds.length > 0) {
          followedCreatorIds.forEach(id => {
            if (id && !relevantIds.includes(id)) relevantIds.push(id);
          });
        }
        
        console.log('Current User ID:', profile.id);
        console.log('Master ID:', masterId);
        console.log('Followed IDs:', followedCreatorIds);
        console.log('Fetching posts for relevant IDs:', relevantIds);

        let query = supabase
          .from('secure_posts')
          .select(`
            *,
            profiles:creator_id (*),
            post_likes (*),
            post_comments (*, profiles:user_id (*))
          `);
        
        // Filter at DB level for performance, but fallback to all if needed
        query = query.in('creator_id', relevantIds);

        const { data, error } = await query;
        
        if (error) throw error;
        postsData = data || [];
        console.log(`Fetched ${postsData.length} posts from DB`);
      } catch (err: any) {
        console.warn('Filtered posts query failed, trying all posts:', err.message);
        const { data, error } = await supabase
          .from('secure_posts')
          .select(`
            *,
            profiles:creator_id (*),
            post_likes (*),
            post_comments (*, profiles:user_id (*))
          `);
        
        if (error) {
          console.error('All posts query also failed:', error);
          throw error;
        }
        postsData = data || [];
        console.log(`Fetched ${postsData.length} posts from fallback query`);
      }
      
      // Sort posts in JS
      postsData.sort((a, b) => {
        const dateA = new Date(a.created_at || a.time || 0).getTime();
        const dateB = new Date(b.created_at || b.time || 0).getTime();
        return dateB - dateA;
      });

      // Final filter in JS to ensure user only sees what they should
      const filteredPostsData = postsData.filter((p: any) => {
        // 1. Admins see everything
        if (isGlobalAdmin) return true;
        // 2. Users see their own posts
        if (p.creator_id === profile.id) return true;
        // 3. Users see posts from creators they follow
        if (followedCreatorIds.includes(p.creator_id)) return true;
        // 4. If no masterId is defined, show everything (discovery mode)
        if (!masterId) return true;
        // 5. Always show master's posts
        if (p.creator_id === masterId) return true;
        
        return false;
      });

      console.log(`After filtering, ${filteredPostsData.length} posts remain`);
      if (filteredPostsData.length === 0 && postsData.length > 0) {
        console.log('Sample of fetched posts (not filtered):', postsData.slice(0, 5).map(p => ({ id: p.id, creator: p.creator_id })));
        console.log('Filtering criteria:', {
          currentUserId: profile.id,
          masterId,
          followedIds: followedCreatorIds,
          isGlobalAdmin
        });
      }

      // Fetch stories
      let storiesData: any[] = [];
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('*, profiles:creator_id (*)');
        if (error) throw error;
        storiesData = data || [];
      } catch (err: any) {
        console.warn('Stories query failed, trying simpler query:', err.message);
        const { data, error } = await supabase
          .from('stories')
          .select('*');
        if (error) throw error;
        storiesData = data || [];
      }
      
      storiesData.sort((a, b) => {
        const dateA = new Date(a.created_at || a.time || 0).getTime();
        const dateB = new Date(b.created_at || b.time || 0).getTime();
        return dateB - dateA;
      });

      const filteredStoriesData = storiesData.filter((s: any) => {
        if (isGlobalAdmin) return true;
        if (s.creator_id === profile.id) return true;
        if (followedCreatorIds.includes(s.creator_id)) return true;
        if (!masterId) return true;
        return s.creator_id === masterId;
      });

      // Fetch notifications
      const { data: notificationsDataRaw, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id);

      if (notificationsError) throw notificationsError;
      
      const notificationsData = notificationsDataRaw || [];
      notificationsData.sort((a, b) => {
        const dateA = new Date(a.created_at || a.time || 0).getTime();
        const dateB = new Date(b.created_at || b.time || 0).getTime();
        return dateB - dateA;
      });

      // Fetch user subscriptions for access control
      let subscribedCreatorIds = new Set<string>();
      
      try {
        // Fetch active subscriptions
        const { data: activeSubs } = await supabase
          .from('subscriptions')
          .select('creator_id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .gt('end_date', new Date().toISOString());
        
        subscribedCreatorIds = new Set(activeSubs?.map(s => s.creator_id) || []);
      } catch (err) {
        console.warn('Error fetching access data:', err);
      }

      // Fetch messages (conversations)
      const { data: messagesDataRaw, error: messagesError } = await supabase
        .from('messages')
        .select('*, profiles:sender_id (*), receiver:receiver_id (*)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (messagesError) throw messagesError;
      
      const messagesData = messagesDataRaw || [];
      messagesData.sort((a, b) => {
        const dateA = new Date(a.created_at || a.time || 0).getTime();
        const dateB = new Date(b.created_at || b.time || 0).getTime();
        return dateB - dateA;
      });

      // Fetch all profiles to map creators
      const { data: allProfiles } = await supabase.from('profiles').select('*');
      const profilesMap = new Map(allProfiles?.map(p => [p.id, p]) || []);

      // Process posts
      const processedPosts = filteredPostsData.map(post => {
        const isOwner = post.creator_id === user.id;
        const isGlobalAdmin = profile.role === 'master' || profile.role === 'admin';
        
        // Try to get creator profile from the join first, then from the map
        let creatorProfile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
        if (!creatorProfile) {
          creatorProfile = profilesMap.get(post.creator_id);
        }
        
        // If still null and it's my post, use my profile
        if (!creatorProfile && isOwner) {
          creatorProfile = profile;
        }
        
        return {
          ...post,
          creator: creatorProfile || { id: post.creator_id, name: 'Criador', avatar: 'https://images.unsplash.com/photo-1633078654544-61b3455b9161?q=80&w=400&auto=format&fit=crop' },
          likes: String(post.post_likes?.length || 0),
          likesCount: post.post_likes?.length || 0,
          commentsCount: post.post_comments?.length || 0,
          isLikedByMe: post.post_likes?.some((l: any) => l.user_id === user.id),
          isLocked: post.is_locked,
          isVideo: post.is_video,
          hasAccess: checkAccess(post, user.id, profile, subscribedCreatorIds),
          commentList: (post.post_comments || []).map((c: any) => ({
            id: c.id,
            user: c.profiles?.name || 'Usuário',
            text: c.content,
            time: new Date(c.created_at).toLocaleDateString()
          }))
        };
      });

      // Process stories
      const processedStories = filteredStoriesData.map(story => {
        let creatorProfile = Array.isArray(story.profiles) ? story.profiles[0] : story.profiles;
        if (!creatorProfile) {
          creatorProfile = profilesMap.get(story.creator_id);
        }
        
        return {
          ...story,
          creator: creatorProfile,
          creator_name: creatorProfile?.name || 'Criador'
        };
      });

      // Process messages into conversations
      const conversationsMap = new Map<string, any>();
      messagesData.forEach((m: any) => {
        let otherUser = m.sender_id === user.id ? m.receiver : m.profiles;
        if (Array.isArray(otherUser)) otherUser = otherUser[0];
        if (!otherUser) return;
        
        const existing = conversationsMap.get(otherUser.id);
        const msgTime = new Date(m.created_at || m.time || 0).getTime();
        const isUnread = m.receiver_id === user.id && m.is_read !== true && m.is_read !== 'true';

        if (!existing) {
          conversationsMap.set(otherUser.id, {
            id: otherUser.id,
            user: otherUser as any,
            lastMessage: m.content,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unreadCount: isUnread ? 1 : 0,
            isOnline: false,
            _rawTime: msgTime
          });
        } else {
          if (isUnread) {
            existing.unreadCount++;
          }
          if (msgTime > existing._rawTime) {
            existing.lastMessage = m.content;
            existing.time = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            existing._rawTime = msgTime;
          }
        }
      });

      setPosts(processedPosts as any);
      setStories(processedStories as any);
      setNotifications(notificationsData as any);
      setUnreadNotificationsCount(notificationsData.filter((n: any) => !n.read).length);
      setMessages(Array.from(conversationsMap.values()));
      setDataLoading(false);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setFetchError(error.message || JSON.stringify(error));
      setDataLoading(false);
    }
  }, [user, profile, refreshKey]);

  // Initial data fetch
  React.useEffect(() => {
    if (isLoggedIn && profile) {
      fetchData();
    } else if (!authLoading && !isLoggedIn) {
      setDataLoading(false);
    } else if (!authLoading && isLoggedIn && !profile) {
      // Logged in but no profile - maybe fetch failed or is being created
      console.warn('User is logged in but profile is missing');
      setDataLoading(false);
    }
  }, [isLoggedIn, profile, fetchData, authLoading, screen === 'feed']);

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
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'subscriptions' },
        () => {
          console.log('Real-time: Subscription detected, refreshing data');
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

  const handleForwardPost = async (post: Post, recipient: Creator) => {
    console.log('handleForwardPost called', { post, recipient });
    try {
      if (!user) {
        console.error('No user found in handleForwardPost');
        return;
      }

      console.log('Inserting message for forward...');
      const creatorName = post.creator?.name || 'Criador';
      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: recipient.id,
        content: `Encaminhou uma publicação de ${creatorName}`,
        media_url: post.image,
        media_type: post.isVideo ? 'video' : 'image',
        is_read: false
      });

      if (error) {
        console.error('Error inserting message:', error);
        throw error;
      }

      console.log('Message inserted successfully');

      // Create notification for the receiver
      const { error: notifError } = await supabase.from('notifications').insert({
        user_id: recipient.id,
        type: 'message',
        content: `encaminhou uma publicação para você`,
        created_at: new Date().toISOString()
      });

      if (notifError) {
        console.warn('Error creating notification (non-fatal):', notifError);
      }

      console.log('Navigating to chat with recipient:', recipient.id);
      setSelectedRecipient(recipient);
      setScreen('chat');
      setForwardingPost(null);
    } catch (err) {
      console.error('Error forwarding post:', err);
      alert('Erro ao encaminhar publicação. Verifique sua conexão.');
    }
  };

  const handleViewProfile = async (creatorId: string) => {
    try {
      if (profile && creatorId === profile.id) {
        setScreen('profile');
        return;
      }
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', creatorId).single();
      if (profileData) {
        // Fetch social connections
        const { data: socialData } = await supabase
          .from('social_connections')
          .select('platform, url')
          .eq('profile_id', creatorId);

        const socialLinks = socialData?.reduce((acc: any, curr: any) => {
          acc[curr.platform] = curr.url;
          return acc;
        }, {});

        setPublicCreator({ ...profileData, social_links: socialLinks } as any);
        
        // Fetch access data for the current user
        let subscribedCreatorIds = new Set<string>();
        let purchasedPostIds = new Set<string>();
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError && (sessionError.message?.includes('Refresh Token Not Found') || sessionError.message?.includes('Invalid Refresh Token'))) {
          supabase.auth.signOut();
        }
        if (session?.user) {
          // Fetch active subscriptions
          const { data: activeSubs } = await supabase
            .from('subscriptions')
            .select('creator_id')
            .eq('user_id', session.user.id)
            .eq('status', 'active')
            .gt('end_date', new Date().toISOString());
          
          subscribedCreatorIds = new Set(activeSubs?.map(s => s.creator_id) || []);

          // Fetch purchased posts
          const { data: userPayments, error: paymentsError } = await supabase
            .from('payments')
            .select('post_id')
            .eq('user_id', session.user.id)
            .eq('status', 'approved');
          
          if (paymentsError) {
            console.warn('Error fetching purchased posts (post_id might be missing):', paymentsError);
          } else {
            userPayments?.forEach(p => {
              if (p.post_id) purchasedPostIds.add(p.post_id);
            });
          }
        }

        // Fetch posts for this creator with likes and comments
        const { data: postsData } = await supabase
          .from('secure_posts')
          .select(`
            *,
            creator:profiles(*),
            post_likes (*),
            post_comments (*)
          `)
          .eq('creator_id', creatorId);
        
        const isGlobalAdmin = profile?.role === 'admin' || profile?.role === 'master';

        if (postsData) {
          const sortedPosts = [...postsData].sort((a, b) => {
            const dateA = new Date(a.created_at || a.time || 0).getTime();
            const dateB = new Date(b.created_at || b.time || 0).getTime();
            return dateB - dateA;
          });
          
          setPublicPosts(sortedPosts.map(p => ({
            ...p,
            isLocked: p.is_locked,
            isVideo: p.is_video,
            likesCount: p.post_likes?.length || 0,
            commentsCount: p.post_comments?.length || 0,
            isLikedByMe: session?.user ? p.post_likes?.some((l: any) => l.user_id === session.user.id) : false,
            hasAccess: checkAccess(p, session?.user?.id, profile, subscribedCreatorIds)
          })) as any);
        }
        setScreen('public-profile');
      }
    } catch (err) {
      console.error('Error viewing profile:', err);
    }
  };

  const handleSubscribe = (targetCreator: Creator) => {
    setPublicCreator(targetCreator);
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
      
      const updateFn = (p: Post) => p.id === postId ? { ...p, caption: newCaption, isLocked, hasAccess: p.hasAccess } : p;
      
      setPosts(prev => prev.map(updateFn));
      setPublicPosts(prev => prev.map(updateFn));
      setEditingPost(null);
    } catch (err) {
      console.error('Error updating post:', err);
      alert('Erro ao atualizar postagem.');
    }
  };

  const handleLikePost = async (postId: string, isLiked: boolean) => {
    if (!user) return;

    // Optimistic update
    const updatePosts = (postsList: any[]) => postsList.map(p => {
      if (p.id === postId) {
        const newLikesCount = isLiked ? Math.max(0, (p.likesCount || 0) - 1) : (p.likesCount || 0) + 1;
        return {
          ...p,
          isLikedByMe: !isLiked,
          likesCount: newLikesCount,
          likes: String(newLikesCount)
        };
      }
      return p;
    });

    setPosts(prev => updatePosts(prev) as any);
    if (publicPosts.length > 0) {
      setPublicPosts(prev => updatePosts(prev) as any);
    }

    try {
      if (isLiked) {
        const { error } = await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
        if (error && error.code !== '23505') throw error;
      }
      // We don't call fetchData() here to keep it fast. 
      // Real-time listener will eventually sync if needed, or next manual refresh.
    } catch (err: any) {
      // Revert optimistic update on error
      const revertPosts = (postsList: any[]) => postsList.map(p => {
        if (p.id === postId) {
          const newLikesCount = isLiked ? (p.likesCount || 0) + 1 : Math.max(0, (p.likesCount || 0) - 1);
          return {
            ...p,
            isLikedByMe: isLiked,
            likesCount: newLikesCount,
            likes: String(newLikesCount)
          };
        }
        return p;
      });
      
      setPosts(prev => revertPosts(prev) as any);
      if (publicPosts.length > 0) {
        setPublicPosts(prev => revertPosts(prev) as any);
      }

      console.error('Error liking post:', err);
      if (err.code === 'PGRST116' || err.message?.includes('relation "public.post_likes" does not exist')) {
        alert('Erro: As tabelas de curtidas não foram criadas no banco de dados.');
      }
    }
  };

  const handleCommentPost = async (postId: string, content: string) => {
    try {
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
      if (!user || !profile) return;

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
        creator_name: profile.name
      });

      if (insertError) {
        console.error('Error inserting story record:', insertError);
      }
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error('Error uploading story:', err);
    }
  };

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('u');
    
    if (username) {
      const fetchPublicProfile = async () => {
        const { data: targetProfile } = await supabase.from('profiles').select('*').eq('username', username).single();
        if (targetProfile) {
          // Fetch social connections
          const { data: socialData } = await supabase
            .from('social_connections')
            .select('platform, url')
            .eq('profile_id', targetProfile.id);

          const socialLinks = socialData?.reduce((acc: any, curr: any) => {
            acc[curr.platform] = curr.url;
            return acc;
          }, {});

          setPublicCreator({ ...targetProfile, social_links: socialLinks } as any);
          let subscribedCreatorIds = new Set<string>();
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            console.error('Public profile session check error:', sessionError);
            if (sessionError.message?.includes('Refresh Token Not Found') || sessionError.message?.includes('Invalid Refresh Token')) {
              supabase.auth.signOut();
            }
          }
          if (session?.user) {
             // Fetch active subscriptions
             const { data: activeSubs } = await supabase
               .from('subscriptions')
               .select('creator_id')
               .eq('user_id', session.user.id)
               .eq('status', 'active')
               .gt('end_date', new Date().toISOString());
             
             subscribedCreatorIds = new Set(activeSubs?.map(s => s.creator_id) || []);
          }

          const { data: posts, error: postsError } = await supabase.from('secure_posts').select('*, creator:profiles(*), post_likes(user_id), post_comments(id)').eq('creator_id', targetProfile.id);
          
          const isGlobalAdmin = profile?.role === 'admin' || profile?.role === 'master';

          if (postsError) {
            console.error('Error fetching public posts with likes/comments:', postsError);
            const { data: fallbackPosts } = await supabase.from('secure_posts').select('*, creator:profiles(*)').eq('creator_id', targetProfile.id);
            if (fallbackPosts) {
              const sortedFallback = [...fallbackPosts].sort((a, b) => {
                const dateA = new Date(a.created_at || a.time || 0).getTime();
                const dateB = new Date(b.created_at || b.time || 0).getTime();
                return dateB - dateA;
              });
              setPublicPosts(sortedFallback.map((p: any) => ({
                ...p,
                isLocked: p.is_locked,
                hasAccess: checkAccess(p, session?.user?.id, profile, subscribedCreatorIds),
                isVideo: p.is_video,
                likesCount: 0,
                commentsCount: 0,
                isLikedByMe: false
              })) as any);
            }
          } else if (posts) {
            const sortedPosts = [...posts].sort((a, b) => {
              const dateA = new Date(a.created_at || a.time || 0).getTime();
              const dateB = new Date(b.created_at || b.time || 0).getTime();
              return dateB - dateA;
            });
            setPublicPosts(sortedPosts.map((p: any) => ({
              ...p,
              isLocked: p.is_locked,
              hasAccess: checkAccess(p, session?.user?.id, profile, subscribedCreatorIds),
              isVideo: p.is_video,
              likesCount: p.post_likes?.length || 0,
              commentsCount: p.post_comments?.length || 0,
              isLikedByMe: p.post_likes?.some((l: any) => l.user_id === session?.user?.id)
            })) as any);
          }
          setScreen('public-profile');
        } else {
          setScreen('feed');
        }
      };
      fetchPublicProfile();
    }
  }, [user, profile]);

  // Expose setScreen and refreshData globally
  React.useEffect(() => {
    (window as any).setScreen = setScreen;
    (window as any).refreshAppData = fetchData;
  }, [fetchData]);

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

  if (authError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <div className="text-red-500 font-black text-xl tracking-widest mb-4 uppercase">Erro de Autenticação</div>
        <p className="text-on-surface/60 text-sm mb-8 max-w-xs mx-auto uppercase tracking-wider leading-relaxed">
          {authError}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all text-[10px] uppercase tracking-widest"
        >
          Recarregar Aplicativo
        </button>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <div className="text-primary font-black animate-pulse text-xl tracking-widest mb-8 uppercase">Carregando...</div>
      </div>
    );
  }

  if (isLoggedIn && dataLoading && posts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <div className="text-primary font-black animate-pulse text-xl tracking-widest mb-8 uppercase">Carregando...</div>
        
        {showResetButton && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xs w-full">
            <p className="text-xs text-on-surface/40 font-bold uppercase tracking-widest mb-6 leading-relaxed">
              O carregamento está demorando mais que o esperado.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setShowResetButton(false);
                  if (isLoggedIn) fetchData();
                  else window.location.reload();
                }}
                className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all text-[10px] uppercase tracking-widest"
              >
                Tentar Novamente
              </button>
              <button 
                onClick={handleReset}
                className="w-full py-4 bg-red-500/10 text-red-500 font-black rounded-2xl active:scale-95 transition-all text-[10px] uppercase tracking-widest"
              >
                Sair da Conta
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const renderScreen = () => {
    if (!isLoggedIn) {
      if (screen === 'public-profile') {
        if (publicCreator) {
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
              onNavigate={setScreen}
            />
          );
        } else {
          return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
              <div className="text-primary font-black animate-pulse text-xl tracking-widest mb-4 uppercase">CARREGANDO PERFIL</div>
            </div>
          );
        }
      }
      if (screen === 'register') {
        return (
          <ScreenRegister 
            onRegister={(user) => {
              setScreen('feed');
            }} 
            onNavigateToLogin={() => setScreen('login')} 
          />
        );
      }
      return (
        <ScreenLogin 
          onLogin={(user) => {
            setScreen('feed');
          }} 
          onNavigateToRegister={() => setScreen('register')} 
        />
      );
    }

    if (!profile || fetchError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
          <div className="text-primary font-black animate-pulse text-xl tracking-widest mb-4 uppercase">CARREGANDO</div>
        </div>
      );
    }

    switch (screen) {
      case 'feed': return (
        <ScreenFeed 
          posts={posts} 
          stories={stories} 
          onStoryUpload={handleStoryUpload} 
          creator={profile} 
          onDeletePost={handleDeletePost}
          onUpdatePost={handleUpdatePost}
          onDeleteStory={handleDeleteStory}
          onSubscribe={handleSubscribe}
          isMaster={isMaster}
          onLikePost={handleLikePost}
          onCommentPost={handleCommentPost}
          onViewProfile={handleViewProfile}
          onRefresh={fetchData}
        />
      );
      case 'profile': 
        return (
          <ScreenProfile 
            onEdit={() => setScreen('edit-profile')} 
            creator={profile} 
            onLogout={() => signOut()} 
            posts={posts}
            onDeletePost={handleDeletePost}
            onUpdatePost={handleUpdatePost}
            onSubscribe={() => handleSubscribe(profile)}
            stories={stories}
            onDeleteStory={handleDeleteStory}
            isMaster={isMaster}
            onLikePost={handleLikePost}
            onCommentPost={handleCommentPost}
            onMessage={(c) => {
              setSelectedRecipient(c);
              setScreen('chat');
            }}
            onForwardPost={(post) => {
              console.log('Forwarding post from profile:', post);
              setForwardingPost(post);
            }}
            onNavigateToAdmin={() => setScreen('admin-dashboard')}
            onNavigateToSubscriberArea={() => setScreen('subscriber-area')}
          />
        );
      case 'public-profile': 
        if (publicCreator) {
          return (
            <ScreenPublicProfile 
              creator={publicCreator} 
              posts={publicPosts} 
              stories={stories}
              onSubscribe={() => handleSubscribe(publicCreator)} 
              onLikePost={handleLikePost}
              onCommentPost={handleCommentPost}
              onMessage={(c) => {
                setSelectedRecipient(c);
                setScreen('chat');
              }}
              isLoggedIn={isLoggedIn}
              onForwardPost={(post) => {
                console.log('Forwarding post from public profile:', post);
                setForwardingPost(post);
              }}
              onNavigate={setScreen}
              onFollow={() => fetchData()}
            />
          );
        } else {
          return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
              <div className="text-primary font-black animate-pulse text-xl tracking-widest mb-4 uppercase">CARREGANDO PERFIL</div>
            </div>
          );
        }
      case 'activity': 
        console.log('Rendering Activity screen with', notifications.length, 'notifications');
        if (isMaster) {
          return <ScreenActivity notifications={notifications} onRefresh={fetchData} />;
        } else {
          return <ScreenMessages messages={messages} isMaster={isMaster} onMessagesRead={() => setRefreshKey(prev => prev + 1)} onViewProfile={handleViewProfile} />;
        }
      case 'messages': return <ScreenMessages messages={messages} isMaster={isMaster} onMessagesRead={() => setRefreshKey(prev => prev + 1)} onViewProfile={handleViewProfile} />;
      case 'wallet': return <ScreenWallet onBack={() => setScreen('feed')} isMaster={isMaster} />;
      case 'subscriptions': return <ScreenSubscriptions onBack={() => setScreen('feed')} />;
      case 'search': return <ScreenSearch onViewProfile={handleViewProfile} />;
      case 'creator-plans': return <ScreenCreatorPlans onBack={() => setScreen('feed')} profile={profile} />;
      case 'subscriber-area': return <ScreenSubscriberArea onNavigate={setScreen} onLogout={signOut} profile={profile} />;
      case 'edit-profile': 
        if (!profile) return null;
        return <ScreenEditProfile onBack={() => setScreen('profile')} creator={profile} onProfileUpdated={() => { refreshProfile(); setRefreshKey(prev => prev + 1); }} />;
      case 'create-post': return <ScreenCreatePost onBack={() => setScreen('feed')} onPostCreated={() => { setRefreshKey(prev => prev + 1); setScreen('feed'); }} />;
      case 'admin-dashboard': return <ScreenAdminDashboard onBack={() => setScreen('profile')} />;
      case 'payment': return <ScreenPayment onBack={() => setScreen('feed')} creator={publicCreator || profile} />;
      case 'chat': return selectedRecipient ? <ChatView recipient={selectedRecipient} onBack={() => setScreen('messages')} onMessagesRead={() => setRefreshKey(prev => prev + 1)} onViewProfile={handleViewProfile} /> : null;
      default: return (
        <ScreenFeed 
          posts={posts} 
          stories={stories} 
          onStoryUpload={handleStoryUpload} 
          creator={profile} 
          onDeletePost={handleDeletePost}
          onUpdatePost={handleUpdatePost}
          onDeleteStory={handleDeleteStory}
          onSubscribe={handleSubscribe}
          isMaster={isMaster}
          onLikePost={handleLikePost}
          onCommentPost={handleCommentPost}
          onViewProfile={handleViewProfile}
          onRefresh={fetchData}
          onForwardPost={(post) => {
            console.log('Forwarding post from feed (default):', post);
            setForwardingPost(post);
          }}
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
    if (screen === 'search') return 'PESQUISAR';
    if (screen === 'edit-profile') return 'EDITAR';
    if (screen === 'create-post') return 'POSTAR';
    if (screen === 'admin-dashboard') return 'ADMIN';
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
          avatar={isLoggedIn ? profile?.avatar : publicCreator?.avatar}
          isMaster={isMaster}
          onMessageClick={() => setScreen('messages')}
          onSettingsClick={() => setScreen('creator-plans')}
          onProfileClick={() => setScreen('subscriber-area')}
          onNotificationsClick={() => setScreen('activity')}
          unreadCount={unreadMessagesCount}
          unreadNotifications={unreadNotificationsCount}
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
