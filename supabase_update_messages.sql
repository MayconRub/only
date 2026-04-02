-- Adicionar suporte a mídia nas mensagens
ALTER TABLE messages ALTER COLUMN content DROP NOT NULL;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS media_url TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS media_type TEXT; -- 'image', 'video', 'audio'
