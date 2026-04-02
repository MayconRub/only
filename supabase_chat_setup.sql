-- Script SQL para o Chat funcionar 100% no Supabase

-- IMPORTANTE: Se você já criou a tabela anteriormente e ela está com erro, 
-- a linha abaixo irá apagar a tabela antiga para criar a nova corretamente.
DROP TABLE IF EXISTS public.messages CASCADE;

-- 1. Criar a tabela de mensagens
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas de segurança
-- Permitir que usuários vejam apenas suas próprias mensagens (enviadas ou recebidas)
CREATE POLICY "Users can view their own messages"
ON public.messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Permitir que usuários enviem mensagens (apenas como eles mesmos)
CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Permitir que o destinatário marque a mensagem como lida
CREATE POLICY "Users can update their own received messages"
ON public.messages FOR UPDATE
USING (auth.uid() = receiver_id)
WITH CHECK (auth.uid() = receiver_id);

-- 4. Habilitar Realtime para a tabela de mensagens
-- Nota: Certifique-se de que a publicação 'supabase_realtime' existe
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE messages;
    END IF;
END $$;

-- 5. Criar a tabela de seguidores
DROP TABLE IF EXISTS public.follows CASCADE;

CREATE TABLE public.follows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(follower_id, following_id)
);

-- 6. Habilitar RLS para follows
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- 7. Criar políticas para follows
CREATE POLICY "Users can view all follows" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can follow others" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow" ON public.follows FOR DELETE USING (auth.uid() = follower_id);
