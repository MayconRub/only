# Documentação do Aplicativo - Nudlye

Esta documentação detalha a arquitetura, as funcionalidades e a estrutura de dados do aplicativo **Nudlye**, uma plataforma de conteúdo por assinatura para criadores.

---

## 1. Visão Geral
O Nudlye é uma plataforma "Content-as-a-Service" onde criadores de conteúdo podem monetizar seu trabalho através de assinaturas mensais e venda de posts individuais (PPV - Pay Per View). O aplicativo oferece uma experiência similar a redes sociais modernas, com foco em privacidade e monetização.

---

## 2. Arquitetura Técnica

### Frontend
- **Framework**: React 18 com Vite (para build rápido e HMR).
- **Linguagem**: TypeScript (garante segurança de tipos e melhor manutenção).
- **Estilização**: Tailwind CSS (utilitários para design responsivo e customizado).
- **Animações**: Framer Motion (transições suaves entre telas e elementos interativos).
- **Ícones**: Lucide React.

### Backend (BaaS - Backend as a Service)
- **Supabase**: Utilizado para gerenciar toda a infraestrutura de backend.
  - **Auth**: Autenticação via E-mail/Senha e persistência de sessão.
  - **Database**: PostgreSQL para armazenamento relacional.
  - **Storage**: Armazenamento de mídias (Avatares, Capas, Posts, Stories e Áudios).
  - **Real-time**: Atualizações em tempo real para o chat.

---

## 3. Funcionalidades Principais

### Gerenciamento de Perfil
- **Tipos de Usuário**: Usuário Comum (Consumidor) e Criador de Conteúdo.
- **Edição**: Upload de avatar, capa, bio editorial, áudio de boas-vindas e links de redes sociais.
- **Conexões Sociais**: Integração com Instagram, Twitter e TikTok armazenada em tabela separada para melhor performance.

### Conteúdo (Posts e Stories)
- **Feed**: Exibição de posts públicos ou bloqueados (exigem assinatura ou compra).
- **Stories**: Conteúdo efêmero que desaparece após 24 horas.
- **Mídia**: Suporte para imagens e vídeos com processamento de upload direto para o Supabase Storage.

### Monetização
- **Planos de Assinatura**: Três níveis (Prata, Ouro, Diamante) com valores configuráveis pelo criador.
- **Pagamentos**: Sistema de processamento de pagamentos (simulado via PIX/Checkout) com registro na tabela `payments`.
- **Carteira (Wallet)**: Controle de saldo, histórico de ganhos e solicitações de saque.

### Interação
- **Chat**: Sistema de mensagens privadas entre usuários e criadores.
- **Comentários e Curtidas**: Engajamento social nos posts.
- **Seguidores**: Sistema de "Follow" para acompanhar criadores favoritos.

---

## 4. Estrutura do Banco de Dados (Schema)

### Tabela: `profiles`
Armazena os dados fundamentais de cada usuário.
- `id`: UUID (FK para auth.users)
- `username`: Nome de usuário único.
- `name`: Nome de exibição.
- `role`: 'user' ou 'creator'.
- `bio`, `services_bio`: Textos descritivos.
- `avatar_url`, `cover_url`: Links das mídias.
- `subscription_price_silver/gold/diamond`: Valores dos planos.

### Tabela: `posts`
Conteúdo publicado pelos criadores.
- `id`: UUID
- `creator_id`: Referência ao perfil do criador.
- `content`: Texto do post.
- `media_url`: Link da imagem/vídeo.
- `is_locked`: Booleano (define se o conteúdo é pago).
- `price`: Valor para desbloqueio individual.

### Tabela: `social_connections`
Armazena links externos de forma relacional.
- `profile_id`: Referência ao perfil.
- `platform`: 'instagram', 'twitter' ou 'tiktok'.
- `url`: Link completo da rede social.

### Tabela: `payments`
Registra todas as transações financeiras.
- `user_id`: Quem pagou.
- `creator_id`: Quem recebeu.
- `post_id`: (Opcional) Referência se for compra de post avulso.
- `status`: 'pending', 'approved' ou 'rejected'.

---

## 5. Segurança e Permissões (RLS)
O aplicativo utiliza **Row Level Security (RLS)** do PostgreSQL para garantir que:
1. Usuários só possam editar seus próprios perfis.
2. Conteúdos bloqueados só sejam acessíveis se houver um registro de pagamento aprovado.
3. Mensagens privadas só sejam lidas pelo remetente ou destinatário.

---

## 6. Fluxo de Dados (Data Flow)
1. O usuário se autentica via `AuthContext`.
2. O `AuthContext` busca o perfil e as conexões sociais no Supabase.
3. O estado global é distribuído para os componentes (`App.tsx`).
4. Interações (como curtir um post) disparam chamadas diretas ao Supabase Client, que valida a permissão via RLS antes de persistir os dados.

---
*Documentação gerada para fins de estudo e referência técnica.*
