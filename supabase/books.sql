-- Table: public.books
create table public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0 and char_length(title) <= 80),
  author text not null check (char_length(trim(author)) > 0 and char_length(author) <= 60),
  pages integer not null check (pages >= 1 and pages <= 5000),
  status text not null default 'To Read' check (status in ('To Read', 'Reading', 'Finished')),
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.books enable row level security;

-- Policies for Row Level Security
create policy "users can select own books" 
  on public.books for select 
  to authenticated 
  using (auth.uid() = user_id);

create policy "users can insert own books" 
  on public.books for insert 
  to authenticated 
  with check (auth.uid() = user_id);

create policy "users can update own books" 
  on public.books for update 
  to authenticated 
  using (auth.uid() = user_id) 
  with check (auth.uid() = user_id);

create policy "users can delete own books" 
  on public.books for delete 
  to authenticated 
  using (auth.uid() = user_id);

