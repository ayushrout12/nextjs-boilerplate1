-- create saved_websites table
create table if not exists public.saved_websites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  prompt text not null,
  html_content text not null,
  thumbnail_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- enable RLS
alter table public.saved_websites enable row level security;

-- RLS policies
create policy "users can view their own websites" 
  on public.saved_websites for select 
  using (auth.uid() = user_id);

create policy "users can insert their own websites" 
  on public.saved_websites for insert 
  with check (auth.uid() = user_id);

create policy "users can update their own websites" 
  on public.saved_websites for update 
  using (auth.uid() = user_id);

create policy "users can delete their own websites" 
  on public.saved_websites for delete 
  using (auth.uid() = user_id);

-- allow anonymous users to save websites (for users not logged in)
create policy "anonymous users can insert websites" 
  on public.saved_websites for insert 
  with check (user_id is null);

create policy "anonymous users can view their session websites" 
  on public.saved_websites for select 
  using (user_id is null);

-- create index for faster queries
create index if not exists saved_websites_user_id_idx on public.saved_websites(user_id);
create index if not exists saved_websites_created_at_idx on public.saved_websites(created_at desc);
