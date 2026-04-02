export type Screen = 'feed' | 'profile' | 'activity' | 'messages' | 'login' | 'register' | 'edit-profile' | 'create-post' | 'public-profile' | 'payment' | 'wallet';

export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  cover_image?: string;
  bio?: string;
  welcome_audio?: string;
  stats?: {
    posts: string;
    followers: string;
    likes: string;
  };
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
  image: string;
  likes: string;
  caption: string;
  time: string;
  isLocked?: boolean;
  hasAccess?: boolean;
  isVideo?: boolean;
  price?: string;
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
