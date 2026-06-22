-- Run this once in your Supabase project: Dashboard → SQL Editor → New query

create table if not exists tasks (
  id         bigint generated always as identity primary key,
  text       text        not null check (char_length(text) between 1 and 500),
  completed  boolean     not null default false,
  created_at timestamptz not null default now()
);

-- Disable Row Level Security for server-side service-key access
alter table tasks disable row level security;

-- Optional seed data (remove if you want to start empty)
insert into tasks (text, completed) values
  ('Buy groceries', false),
  ('Read a book',   true);
