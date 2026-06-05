create table if not exists brain_learnings (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  learning text not null,
  category text check (category in ('preference','fact','pattern','gap','improvement','habit','goal')),
  importance smallint default 5,
  applied boolean default false,
  created_at timestamptz default now()
);

create table if not exists brain_improvements (
  id uuid primary key default gen_random_uuid(),
  trigger_source text,
  improvement_type text check (improvement_type in ('system_prompt','response_style','new_context','feature_idea','pattern_learned')),
  description text not null,
  content text,
  applied boolean default true,
  created_at timestamptz default now()
);

alter table brain_learnings enable row level security;
alter table brain_improvements enable row level security;

create policy "Allow all for authenticated" on brain_learnings for all using (true);
create policy "Allow all for authenticated" on brain_improvements for all using (true);
