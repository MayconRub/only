export type Screen = 'feed' | 'profile' | 'activity' | 'messages' | 'login' | 'register' | 'edit-profile' | 'create-post' | 'public-profile' | 'payment' | 'wallet' | 'subscriptions' | 'chat' | 'search' | 'admin-dashboard' | 'subscriber-area';

export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  cover_image?: string;
  bio?: string;
  services_bio?: string;
  welcome_audio?: string;
  role?: 'user' | 'admin' | 'master' | 'creator';
  stats?: {
    posts: string;
    followers: string;
    likes: string;
    plans?: any[];
  };
  social_links?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  birth_date?: string;
  cidade?: string;
  verificada?: boolean;
  atendimento_presencial?: {
    id: string;
    duration: number;
    price: number;
    isPopular: boolean;
  }[];
}

export interface Comment {
  id: string;
  user: Creator;
  content: string;
  created_at: string;
}

export interface Post {
  id: string;
  creator: Creator;
  creator_id?: string;
  image: string;
  likes: string;
  caption: string;
  time: string;
  isLocked?: boolean;
  hasAccess?: boolean;
  isVideo?: boolean;
  likesCount?: number;
  commentsCount?: number;
  isLikedByMe?: boolean;
}

export interface Notification {
  id: string;
  type: 'sale' | 'subscription' | 'like' | 'comment';
  user: {
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  content: string;
  time: string;
  thumbnail?: string;
  badge?: string;
  created_at?: string;
}

export interface Message {
  id: string;
  user: Creator;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isLocked?: boolean;
  isOnline?: boolean;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  media_url?: string;
  media_type?: 'image' | 'video' | 'audio';
}
