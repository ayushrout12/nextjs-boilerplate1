-- Create published_sites table for subdomain hosting
create table if not exists public.published_sites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  website_id uuid references public.saved_websites(id) on delete set null,
  subdomain text not null unique,
  title text,
  html_content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create index for fast subdomain lookups
create index if not exists published_sites_subdomain_idx on public.published_sites(subdomain);
create index if not exists published_sites_user_id_idx on public.published_sites(user_id);

-- Enable RLS
alter table public.published_sites enable row level security;

-- RLS policies
-- Anyone can view published sites (they're public)
create policy "published_sites_select_public" on public.published_sites
  for select using (true);

-- Users can insert their own sites
create policy "published_sites_insert_own" on public.published_sites
  for insert with check (auth.uid() = user_id);

-- Users can update their own sites
create policy "published_sites_update_own" on public.published_sites
  for update using (auth.uid() = user_id);

-- Users can delete their own sites
create policy "published_sites_delete_own" on public.published_sites
  for delete using (auth.uid() = user_id);
