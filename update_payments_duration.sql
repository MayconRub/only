-- Adiciona a coluna duration na tabela payments
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS duration INTEGER;

-- Comentário para documentação
COMMENT ON COLUMN public.payments.duration IS 'Duração da assinatura em dias.';
