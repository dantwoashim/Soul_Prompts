create table if not exists prompts (
  id text primary key,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  draft_content jsonb not null,
  published_content jsonb
);

create table if not exists prompt_versions (
  id text primary key,
  prompt_id text not null references prompts(id) on delete cascade,
  version_kind text not null,
  note text not null default '',
  created_at timestamptz not null default now(),
  snapshot jsonb not null
);

create table if not exists site_documents (
  key text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  draft_content jsonb not null,
  published_content jsonb
);

create table if not exists site_document_versions (
  id text primary key,
  document_key text not null references site_documents(key) on delete cascade,
  version_kind text not null,
  note text not null default '',
  created_at timestamptz not null default now(),
  snapshot jsonb not null
);

create table if not exists site_settings (
  key text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  draft_content jsonb not null,
  published_content jsonb
);

create table if not exists site_settings_versions (
  id text primary key,
  settings_key text not null references site_settings(key) on delete cascade,
  version_kind text not null,
  note text not null default '',
  created_at timestamptz not null default now(),
  snapshot jsonb not null
);
