create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  context_tags text[] default '{}',
  importance_score smallint default 5,
  created_at timestamptz default now()
);

create table if not exists brain_context (
  id uuid primary key default gen_random_uuid(),
  finances jsonb default '{}',
  startups jsonb default '{}',
  goals jsonb default '{}',
  schedule_preferences jsonb default '{}',
  team jsonb default '{}',
  platforms jsonb default '{}',
  updated_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  area text check (area in ('personal_brand','skryve','nexus','emc','church','personal')),
  assigned_to text default 'aniekan',
  due_date date,
  status text default 'todo' check (status in ('todo','in_progress','done','blocked')),
  priority text default 'medium' check (priority in ('critical','high','medium','low')),
  created_at timestamptz default now(),
  completed_at timestamptz
);

create table if not exists finances (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income','expense','debt_payment','debt')),
  amount numeric not null,
  description text,
  category text,
  date date default current_date,
  month text,
  notes text
);

create table if not exists opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text,
  description text,
  source_url text,
  confidence_score smallint default 5,
  verified boolean default false,
  recommended boolean default false,
  action_required text,
  relevance_tags text[] default '{}',
  discovered_at timestamptz default now(),
  status text default 'new'
);

create table if not exists content_calendar (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  content_type text,
  pillar text,
  title text,
  script_notes text,
  scheduled_date date,
  status text default 'planned',
  published_url text
);

alter table conversations enable row level security;
alter table brain_context enable row level security;
alter table tasks enable row level security;
alter table finances enable row level security;
alter table opportunities enable row level security;
alter table content_calendar enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='conversations' and policyname='Allow all for authenticated') then
    create policy "Allow all for authenticated" on conversations for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename='brain_context' and policyname='Allow all for authenticated') then
    create policy "Allow all for authenticated" on brain_context for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename='tasks' and policyname='Allow all for authenticated') then
    create policy "Allow all for authenticated" on tasks for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename='finances' and policyname='Allow all for authenticated') then
    create policy "Allow all for authenticated" on finances for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename='opportunities' and policyname='Allow all for authenticated') then
    create policy "Allow all for authenticated" on opportunities for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename='content_calendar' and policyname='Allow all for authenticated') then
    create policy "Allow all for authenticated" on content_calendar for all using (auth.role() = 'authenticated');
  end if;
end $$;
