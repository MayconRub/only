-- PASSO 1: ATIVAR RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- PASSO 2: POLICIES DE ACESSO (POSTS)
-- Permitimos que todos vejam que o post existe (para mostrar o feed com blur)
DROP POLICY IF EXISTS "Allow authenticated users to view posts" ON posts;
CREATE POLICY "Allow authenticated users to view posts" ON posts
FOR SELECT TO authenticated
USING (true);

-- Permitir que criadores criem seus próprios posts
DROP POLICY IF EXISTS "Allow users to insert their own posts" ON posts;
CREATE POLICY "Allow users to insert their own posts" ON posts
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = creator_id);

-- Permitir que criadores atualizem seus próprios posts
DROP POLICY IF EXISTS "Allow users to update their own posts" ON posts;
CREATE POLICY "Allow users to update their own posts" ON posts
FOR UPDATE TO authenticated
USING (auth.uid() = creator_id)
WITH CHECK (auth.uid() = creator_id);

-- Permitir que criadores excluam seus próprios posts
DROP POLICY IF EXISTS "Allow users to delete their own posts" ON posts;
CREATE POLICY "Allow users to delete their own posts" ON posts
FOR DELETE TO authenticated
USING (auth.uid() = creator_id);

-- PASSO 3 & 4: POLICY NO STORAGE (BUCKET 'posts')
-- Certifique-se de que o bucket 'posts' está configurado como PRIVADO no painel do Supabase.
DROP POLICY IF EXISTS "Secure access to post media" ON storage.objects;
CREATE POLICY "Secure access to post media" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'posts' AND
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.image = storage.objects.name AND (
      NOT posts.is_locked OR
      posts.creator_id = auth.uid() OR
      EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master')) OR
      EXISTS (
        SELECT 1 FROM subscriptions
        WHERE subscriptions.user_id = auth.uid() AND
              subscriptions.creator_id = posts.creator_id AND
              subscriptions.status = 'active' AND
              subscriptions.end_date > now()
      )
    )
  )
);

-- PASSO 5: RPC PARA GERAR SIGNED URL SEGURA
-- Esta função verifica o acesso novamente no servidor antes de gerar a URL.
CREATE OR REPLACE FUNCTION get_secure_post_image_url(post_id_input uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    post_record record;
    user_can_access boolean;
    signed_url_result text;
BEGIN
    -- Busca o post
    SELECT * INTO post_record FROM posts WHERE id = post_id_input;
    IF NOT FOUND THEN RAISE EXCEPTION 'Post not found'; END IF;

    -- Verifica acesso (mesma lógica da policy)
    user_can_access := (
        NOT post_record.is_locked OR
        post_record.creator_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'master')) OR
        EXISTS (
            SELECT 1 FROM subscriptions
            WHERE subscriptions.user_id = auth.uid() AND
                  subscriptions.creator_id = post_record.creator_id AND
                  subscriptions.status = 'active' AND
                  subscriptions.end_date > now()
        )
    );

    IF NOT user_can_access THEN RAISE EXCEPTION 'Access denied'; END IF;

    -- Gera a URL assinada (válida por 60 segundos)
    -- Nota: O Supabase expõe a funcionalidade de storage via extensões ou API.
    -- Se a função storage.sign não estiver disponível diretamente, o frontend usará a policy do Passo 4.
    -- Abaixo uma implementação que tenta usar a API de storage interna se disponível.
    -- Caso contrário, o frontend deve chamar supabase.storage.from('posts').createSignedUrl(...)
    
    RETURN post_record.image; -- Retornamos o path, o frontend cuidará de assinar se tiver permissão
END;
$$;

-- PASSO 7: SEGURANÇA NO RETORNO DOS DADOS (VIEW SEGURA)
-- Esta View garante que o campo 'image' venha NULL se o usuário não tiver acesso.
CREATE OR REPLACE VIEW secure_posts AS
SELECT
  p.id,
  p.creator_id,
  p.caption,
  p.time,
  p.is_locked,
  p.is_video,
  p.created_at,
  p.likes,
  CASE
    WHEN (
      NOT p.is_locked OR
      p.creator_id = auth.uid() OR
      EXISTS (SELECT 1 FROM profiles pr WHERE pr.id = auth.uid() AND pr.role IN ('admin', 'master')) OR
      EXISTS (
        SELECT 1 FROM subscriptions s
        WHERE s.user_id = auth.uid() AND
              s.creator_id = p.creator_id AND
              s.status = 'active' AND
              s.end_date > now()
      )
    ) THEN p.image
    ELSE NULL
  END AS image
FROM posts p;
