# Collections Schema - Igreja Cévennes

Este documento detalha todos os schemas das collections do MongoDB para o projeto da Igreja Cévennes.

## Regras Gerais

### Convenções de Nomenclatura
- **MongoDB**: `snake_case` para todos os campos
- **JavaScript/TypeScript**: `camelCase` (conversão automática via utils)
- **Conversão**: Usar `lib/utils/case-conversion.ts`

### Campos Multilíngues
Todos os textos visíveis ao usuário têm suporte a 3 idiomas:
```typescript
{
  title: {
    fr: "Titre en français",
    pt: "Título em português", 
    en: "Title in English"
  }
}
```

### Campos Padrão
Todas as collections incluem:
- `_id`: MongoDB ObjectId (gerenciado pelo Cappuccino)
- `created_at`: Date - timestamp de criação
- `updated_at`: Date - timestamp de última atualização
- `is_active`: boolean - soft delete (true = ativo, false = deletado)

---

## Collections

### 1. site_config
Configurações globais do site.

```typescript
{
  _id: ObjectId,
  created_at: Date,
  updated_at: Date,
  is_active: boolean,
  
  // Informações da igreja
  church_name: {
    fr: string,
    pt: string,
    en: string
  },
  tagline: {
    fr: string,
    pt: string,
    en: string
  },
  description: {
    fr: string,
    pt: string,
    en: string
  },
  
  // Contato
  contact_email: string,
  contact_phone: string,
  address: {
    fr: string,
    pt: string,
    en: string
  },
  
  // Localizações das igrejas
  locations: [
    {
      name: string, // "Saint-Hippolyte", "Lasalle", "Monoblet"
      address: {
        fr: string,
        pt: string,
        en: string
      },
      coordinates: {
        latitude: number,
        longitude: number
      },
      service_times: {
        fr: string,
        pt: string,
        en: string
      }
    }
  ],
  
  // Redes sociais
  social_media: {
    youtube_channel_url?: string,
    facebook_url?: string,
    instagram_url?: string,
    website_url?: string
  },
  
  // SEO
  seo: {
    meta_title: {
      fr: string,
      pt: string,
      en: string
    },
    meta_description: {
      fr: string,
      pt: string,
      en: string
    },
    og_image_url?: string
  }
}
```

### 2. banners
Banners da homepage e outras páginas.

```typescript
{
  _id: ObjectId,
  created_at: Date,
  updated_at: Date,
  is_active: boolean,
  
  title: {
    fr: string,
    pt: string,
    en: string
  },
  subtitle?: {
    fr: string,
    pt: string,
    en: string
  },
  description?: {
    fr: string,
    pt: string,
    en: string
  },
  
  // Imagem
  image_url: string,
  image_alt: {
    fr: string,
    pt: string,
    en: string
  },
  
  // CTA (Call to Action)
  cta_text?: {
    fr: string,
    pt: string,
    en: string
  },
  cta_link?: string,
  cta_type?: "internal" | "external" | "scroll",
  
  // Configurações
  display_order: number,
  page_location: "homepage" | "events" | "sermons" | "blog" | "community",
  is_featured: boolean,
  start_date?: Date,
  end_date?: Date
}
```

### 3. events
Eventos da igreja.

```typescript
{
  _id: ObjectId,
  created_at: Date,
  updated_at: Date,
  is_active: boolean,
  
  title: {
    fr: string,
    pt: string,
    en: string
  },
  description: {
    fr: string,
    pt: string,
    en: string
  },
  short_description?: {
    fr: string,
    pt: string,
    en: string
  },
  
  // Data e horário
  start_date: Date,
  end_date?: Date,
  start_time: string, // HH:MM
  end_time?: string, // HH:MM
  timezone: string, // "Europe/Paris"
  
  // Localização
  location_type: "physical" | "online" | "hybrid",
  location_name?: string, // "Saint-Hippolyte", "Lasalle", "Monoblet", ou custom
  location_address?: {
    fr: string,
    pt: string,
    en: string
  },
  online_link?: string,
  
  // Categorização
  category: "service" | "study" | "prayer" | "fellowship" | "special" | "youth" | "children",
  tags?: string[], // ["worship", "communion", "baptism"]
  
  // Mídia
  featured_image_url?: string,
  gallery_images?: string[],
  
  // Configurações
  is_recurring: boolean,
  recurrence_pattern?: "weekly" | "monthly" | "yearly",
  max_attendees?: number,
  requires_registration: boolean,
  registration_link?: string,
  
  // SEO
  slug: string,
  meta_description?: {
    fr: string,
    pt: string,
    en: string
  }
}
```

### 4. sermons
Sermões da igreja.

```typescript
{
  _id: ObjectId,
  created_at: Date,
  updated_at: Date,
  is_active: boolean,
  
  title: {
    fr: string,
    pt: string,
    en: string
  },
  description?: {
    fr: string,
    pt: string,
    en: string
  },
  summary?: {
    fr: string,
    pt: string,
    en: string
  },
  
  // Pastor/Pregador
  preacher_name: string,
  preacher_title?: {
    fr: string,
    pt: string,
    en: string
  },
  
  // Conteúdo bíblico
  bible_passage: string, // "João 3:16-17"
  bible_book: string, // "João"
  bible_chapter?: number,
  bible_verses?: string, // "16-17"
  
  // Mídia
  youtube_url: string, // URL do vídeo no YouTube
  youtube_video_id: string, // ID extraído da URL
  audio_url?: string,
  transcript?: {
    fr: string,
    pt: string,
    en: string
  },
  
  // Data da pregação
  preached_date: Date,
  duration_minutes?: number,
  
  // Categorização
  series_name?: {
    fr: string,
    pt: string,
    en: string
  },
  topics?: string[], // ["salvation", "grace", "faith"]
  age_group: "all" | "adults" | "youth" | "children",
  
  // Arquivos complementares
  study_guide_url?: string,
  notes_url?: string,
  
  // Estatísticas
  view_count?: number,
  download_count?: number,
  
  // SEO
  slug: string,
  meta_description?: {
    fr: string,
    pt: string,
    en: string
  },
  featured_image_url?: string
}
```

### 5. blog_posts
Artigos do blog.

```typescript
{
  _id: ObjectId,
  created_at: Date,
  updated_at: Date,
  is_active: boolean,
  
  title: {
    fr: string,
    pt: string,
    en: string
  },
  content: {
    fr: string, // HTML/Markdown
    pt: string,
    en: string
  },
  excerpt?: {
    fr: string,
    pt: string,
    en: string
  },
  
  // Autor
  author_name: string,
  author_title?: {
    fr: string,
    pt: string,
    en: string
  },
  author_bio?: {
    fr: string,
    pt: string,
    en: string
  },
  author_avatar_url?: string,
  
  // Publicação
  published_date: Date,
  is_published: boolean,
  is_featured: boolean,
  
  // Categorização
  category: "teaching" | "testimony" | "news" | "events" | "devotional" | "mission",
  tags?: string[],
  
  // Mídia
  featured_image_url?: string,
  featured_image_alt: {
    fr: string,
    pt: string,
    en: string
  },
  gallery_images?: string[],
  
  // Estatísticas
  view_count?: number,
  reading_time_minutes?: number,
  
  // SEO
  slug: string,
  meta_description?: {
    fr: string,
    pt: string,
    en: string
  }
}
```

### 6. groups
Grupos e ministérios da igreja.

```typescript
{
  _id: ObjectId,
  created_at: Date,
  updated_at: Date,
  is_active: boolean,
  
  name: {
    fr: string,
    pt: string,
    en: string
  },
  description: {
    fr: string,
    pt: string,
    en: string
  },
  short_description?: {
    fr: string,
    pt: string,
    en: string
  },
  
  // Tipo de grupo
  type: "small_group" | "ministry" | "service" | "study" | "prayer" | "youth" | "children" | "seniors",
  
  // Liderança
  leader_name: string,
  leader_contact?: string,
  co_leaders?: string[],
  
  // Reuniões
  meeting_schedule: {
    frequency: "weekly" | "biweekly" | "monthly" | "irregular",
    day_of_week?: string, // "Monday", "Tuesday", etc.
    time?: string, // "19:30"
    duration_hours?: number
  },
  
  // Localização
  meeting_location_type: "physical" | "online" | "hybrid",
  meeting_location?: string,
  meeting_address?: {
    fr: string,
    pt: string,
    en: string
  },
  online_link?: string,
  
  // Configurações
  age_range?: {
    min_age?: number,
    max_age?: number
  },
  gender_restriction?: "male" | "female" | "mixed",
  max_members?: number,
  requires_commitment: boolean,
  
  // Mídia
  featured_image_url?: string,
  gallery_images?: string[],
  
  // Contato
  contact_email?: string,
  contact_phone?: string,
  
  // SEO
  slug: string
}
```

### 7. testimonies
Testemunhos dos membros.

```typescript
{
  _id: ObjectId,
  created_at: Date,
  updated_at: Date,
  is_active: boolean,
  
  title?: {
    fr: string,
    pt: string,
    en: string
  },
  content: {
    fr: string,
    pt: string,
    en: string
  },
  
  // Pessoa
  person_name: string,
  person_title?: {
    fr: string,
    pt: string,
    en: string
  },
  person_photo_url?: string,
  person_age?: number,
  person_location?: string,
  
  // Categorização
  category: "salvation" | "healing" | "provision" | "restoration" | "calling" | "baptism" | "other",
  tags?: string[],
  
  // Mídia
  video_url?: string, // YouTube ou outro
  audio_url?: string,
  photos?: string[],
  
  // Configurações
  is_featured: boolean,
  is_verified: boolean,
  testimony_date?: Date, // quando aconteceu o testemunho
  
  // Moderação
  is_approved: boolean,
  moderated_by?: string,
  moderated_date?: Date,
  moderation_notes?: string
}
```

### 8. prayer_requests
Pedidos de oração.

```typescript
{
  _id: ObjectId,
  created_at: Date,
  updated_at: Date,
  is_active: boolean,
  
  title?: {
    fr: string,
    pt: string,
    en: string
  },
  description: {
    fr: string,
    pt: string,
    en: string
  },
  
  // Solicitante
  requester_name?: string, // opcional para anonimato
  requester_email?: string,
  requester_phone?: string,
  is_anonymous: boolean,
  
  // Categorização
  category: "health" | "family" | "work" | "spiritual" | "financial" | "relationships" | "church" | "missions" | "other",
  urgency_level: "low" | "medium" | "high" | "urgent",
  
  // Configurações
  is_public: boolean, // se deve aparecer na lista pública
  is_ongoing: boolean, // pedido contínuo ou pontual
  
  // Status
  status: "open" | "in_progress" | "answered" | "closed",
  answered_date?: Date,
  answer_description?: {
    fr: string,
    pt: string,
    en: string
  },
  
  // Moderação
  is_approved: boolean,
  moderated_by?: string,
  moderated_date?: Date,
  
  // Estatísticas
  prayer_count?: number, // quantas pessoas oraram
  
  // Prazo
  expires_date?: Date
}
```

### 9. newsletter_subscribers
Inscritos na newsletter.

```typescript
{
  _id: ObjectId,
  created_at: Date,
  updated_at: Date,
  is_active: boolean,
  
  email: string, // único
  name?: string,
  
  // Preferências
  preferred_language: "fr" | "pt" | "en",
  subscription_topics?: string[], // ["events", "sermons", "blog", "prayer"]
  
  // Status
  is_confirmed: boolean,
  confirmation_token?: string,
  confirmed_date?: Date,
  
  // Origem
  subscription_source: "website" | "event" | "manual" | "import",
  subscription_page?: string,
  
  // Estatísticas
  last_email_sent?: Date,
  email_open_count?: number,
  email_click_count?: number,
  
  // Unsubscribe
  unsubscribed: boolean,
  unsubscribe_date?: Date,
  unsubscribe_reason?: string
}
```

### 10. donations
Registros de doações (se implementado).

```typescript
{
  _id: ObjectId,
  created_at: Date,
  updated_at: Date,
  is_active: boolean,
  
  // Doador
  donor_name?: string, // opcional para anonimato
  donor_email?: string,
  is_anonymous: boolean,
  
  // Doação
  amount: number,
  currency: string, // "EUR"
  
  // Finalidade
  purpose: "general" | "missions" | "building" | "special_offering" | "events" | "other",
  purpose_description?: {
    fr: string,
    pt: string,
    en: string
  },
  
  // Método de pagamento
  payment_method: "bank_transfer" | "card" | "cash" | "check" | "other",
  payment_status: "pending" | "completed" | "failed" | "refunded",
  
  // IDs externos (do processador de pagamento)
  transaction_id?: string,
  payment_processor?: "stripe" | "paypal" | "bank" | "manual",
  
  // Datas
  donation_date: Date,
  processed_date?: Date,
  
  // Recibo
  receipt_number?: string,
  receipt_sent: boolean,
  tax_deductible: boolean,
  
  // Recorrência
  is_recurring: boolean,
  recurring_frequency?: "monthly" | "quarterly" | "yearly",
  recurring_end_date?: Date,
  parent_donation_id?: ObjectId, // para doações recorrentes
  
  // Notas internas
  internal_notes?: string
}
```

### 11. mission_partners
Parceiros missionários.

```typescript
{
  _id: ObjectId,
  created_at: Date,
  updated_at: Date,
  is_active: boolean,
  
  name: {
    fr: string,
    pt: string,
    en: string
  },
  description: {
    fr: string,
    pt: string,
    en: string
  },
  
  // Informações do missionário/organização
  missionary_names?: string[],
  organization_name?: string,
  
  // Localização
  country: string,
  region?: string,
  city?: string,
  
  // Tipo de missão
  mission_type: "church_planting" | "evangelism" | "education" | "healthcare" | "humanitarian" | "translation" | "other",
  target_audience: "unreached" | "youth" | "children" | "families" | "refugees" | "indigenous" | "urban" | "rural" | "other",
  
  // Contato
  contact_email?: string,
  website_url?: string,
  social_media?: {
    facebook?: string,
    instagram?: string,
    youtube?: string
  },
  
  // Suporte
  support_type: "financial" | "prayer" | "short_term" | "supplies" | "all",
  monthly_support_amount?: number,
  support_currency?: string,
  
  // Mídia
  profile_photo_url?: string,
  gallery_images?: string[],
  
  // Status
  partnership_status: "active" | "inactive" | "completed" | "on_hold",
  partnership_start_date?: Date,
  partnership_end_date?: Date,
  
  // Atualizações
  last_update_received?: Date,
  
  // SEO
  slug: string
}
```

### 12. resources
Recursos para download/visualização.

```typescript
{
  _id: ObjectId,
  created_at: Date,
  updated_at: Date,
  is_active: boolean,
  
  title: {
    fr: string,
    pt: string,
    en: string
  },
  description: {
    fr: string,
    pt: string,
    en: string
  },
  
  // Tipo de recurso
  resource_type: "document" | "audio" | "video" | "image" | "presentation" | "study_guide" | "book" | "other",
  file_format: string, // "pdf", "mp3", "mp4", "pptx", etc.
  
  // Arquivo
  file_url: string,
  file_size_bytes?: number,
  download_filename: string,
  
  // Categorização
  category: "sermons" | "studies" | "worship" | "discipleship" | "leadership" | "children" | "youth" | "missions" | "other",
  tags?: string[],
  target_audience: "all" | "leaders" | "members" | "newcomers" | "children" | "youth" | "adults",
  
  // Autor/Criador
  author_name?: string,
  author_organization?: string,
  
  // Permissões
  access_level: "public" | "members_only" | "leaders_only",
  requires_registration: boolean,
  
  // Estatísticas
  download_count?: number,
  view_count?: number,
  
  // Mídia adicional
  thumbnail_url?: string,
  preview_images?: string[],
  
  // SEO
  slug: string,
  meta_description?: {
    fr: string,
    pt: string,
    en: string
  }
}
```

### 13. users
Usuários do sistema (backoffice).

```typescript
{
  _id: ObjectId,
  created_at: Date,
  updated_at: Date,
  is_active: boolean,
  
  // Identificação
  email: string, // único
  name: string,
  avatar_url?: string,
  
  // Autenticação (gerenciado pelo Cappuccino)
  // password_hash, email_verified, etc. são gerenciados automaticamente
  
  // Perfil
  role: "admin" | "editor" | "moderator" | "viewer",
  preferred_language: "fr" | "pt" | "en",
  
  // Permissões específicas
  permissions: {
    manage_site_config: boolean,
    manage_banners: boolean,
    manage_events: boolean,
    manage_sermons: boolean,
    manage_blog: boolean,
    manage_groups: boolean,
    moderate_testimonies: boolean,
    moderate_prayer_requests: boolean,
    manage_newsletter: boolean,
    view_donations: boolean,
    manage_donations: boolean,
    manage_mission_partners: boolean,
    manage_resources: boolean,
    manage_users: boolean
  },
  
  // Informações pessoais (opcional)
  title?: {
    fr: string,
    pt: string,
    en: string
  }, // "Pastor", "Diácono", etc.
  bio?: {
    fr: string,
    pt: string,
    en: string
  },
  phone?: string,
  
  // Status da conta
  is_verified: boolean,
  last_login: Date,
  login_count?: number,
  
  // Configurações
  notification_preferences: {
    email_new_testimony: boolean,
    email_new_prayer_request: boolean,
    email_new_subscriber: boolean,
    email_weekly_summary: boolean
  }
}
```

---

## Índices Recomendados

### Busca e Performance
```javascript
// events
{ "start_date": 1, "is_active": 1 }
{ "category": 1, "is_active": 1 }
{ "slug": 1 }

// sermons  
{ "preached_date": -1, "is_active": 1 }
{ "preacher_name": 1, "is_active": 1 }
{ "slug": 1 }

// blog_posts
{ "published_date": -1, "is_published": 1, "is_active": 1 }
{ "category": 1, "is_published": 1, "is_active": 1 }
{ "slug": 1 }

// newsletter_subscribers
{ "email": 1 } // unique
{ "is_confirmed": 1, "is_active": 1 }

// users
{ "email": 1 } // unique
{ "role": 1, "is_active": 1 }

// prayer_requests
{ "is_public": 1, "is_approved": 1, "status": 1, "is_active": 1 }
```

### Busca de Texto (Text Search)
```javascript
// Para busca multilíngue
{ 
  "title.fr": "text", 
  "title.pt": "text", 
  "title.en": "text",
  "description.fr": "text",
  "description.pt": "text", 
  "description.en": "text"
}
```

---

## Notas de Implementação

### 1. Conversão de Case
- Implementar utils em `lib/utils/case-conversion.ts`
- Usar automaticamente no Cappuccino Client
- Exemplos: `createdAt` → `created_at`, `isActive` → `is_active`

### 2. Validação
- Criar schemas Zod correspondentes em `lib/validations/`
- Validar no client-side e server-side
- Usar tipos TypeScript gerados dos schemas Zod

### 3. Multilíngue
- SEMPRE incluir os 3 idiomas para textos visíveis
- Criar helpers para extrair texto baseado no locale atual
- Considerar fallbacks (fr → en → pt)

### 4. Soft Delete
- NUNCA deletar fisicamente registros importantes
- Usar `is_active: false` para soft delete
- Filtrar por `is_active: true` em queries de listagem

### 5. SEO
- Slugs únicos por collection
- Meta descriptions multilíngues
- URLs amigáveis baseadas em slug