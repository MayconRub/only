-- Script SQL para o Chat funcionar 100% no Supabase

-- 1. Criar a tabela de mensagens
CREATE TABLE IF NOT EXISTS public.messages (
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
