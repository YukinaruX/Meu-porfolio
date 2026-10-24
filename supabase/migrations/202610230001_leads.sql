create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
create policy own_admin_membership on public.admin_users for select to authenticated using (user_id = auth.uid());

create table public.leads (
  id uuid primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (length(name) between 1 and 2000),
  contact text not null check (length(contact) between 3 and 2000),
  project text not null check (length(project) between 1 and 2000),
  timeline text not null check (length(timeline) between 1 and 2000),
  language text not null check (language in ('pt', 'en')),
  privacy_version text not null,
  acknowledged_at timestamptz not null default now(),
  status text not null default 'Novo' check (status in ('Novo', 'Em contato', 'Proposta enviada', 'Fechado', 'Arquivado')),
  airtable_synced_at timestamptz
);
create index leads_created_at_idx on public.leads(created_at desc);
alter table public.leads enable row level security;
revoke all on public.leads from anon, authenticated;
grant select, delete on public.leads to authenticated;
grant update(status, updated_at) on public.leads to authenticated;
create policy admin_read on public.leads for select to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy admin_update on public.leads for update to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid())) with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy admin_delete on public.leads for delete to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Shared, atomic intake quota. No visitor IP or fingerprint is retained.
create table public.intake_limits (minute timestamptz primary key, count integer not null);
alter table public.intake_limits enable row level security;
revoke all on public.intake_limits from anon, authenticated;
create function public.take_intake_slot() returns boolean language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  delete from public.intake_limits where minute < now() - interval '1 hour';
  insert into public.intake_limits(minute, count) values (date_trunc('minute', now()), 1)
  on conflict (minute) do update set count = public.intake_limits.count + 1 returning count into n;
  return n <= 20;
end;
$$;
revoke all on function public.take_intake_slot() from public, anon, authenticated;
grant execute on function public.take_intake_slot() to service_role;
grant all on public.admin_users, public.leads, public.intake_limits to service_role;
