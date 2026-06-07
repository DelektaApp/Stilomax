create table archetypes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  created_at timestamptz default now()
);

create table images (
  id uuid primary key default gen_random_uuid(),
  archetype_id uuid references archetypes(id) on delete cascade,
  slug text unique not null,
  image_url text not null,
  prompt text,
  created_at timestamptz default now()
);

create table image_visual_scores (
  id uuid primary key default gen_random_uuid(),
  image_id uuid references images(id) on delete cascade,
  formal int not null,
  classic int not null,
  minimalist int not null,
  refined int not null,
  practical int not null,
  urban int not null,
  visibility int not null,
  tailored int not null
);

create table image_psych_scores (
  id uuid primary key default gen_random_uuid(),
  image_id uuid references images(id) on delete cascade,
  adventure int not null,
  status int not null,
  creativity int not null,
  tradition int not null,
  practicality int not null,
  individualism int not null,
  social int not null
);

create table quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  completed_at timestamptz,
  result_json jsonb,
  accuracy_rating int check (accuracy_rating between 1 and 5)
);

create table quiz_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references quiz_sessions(id) on delete cascade,
  round_number int not null,
  left_image_id uuid references images(id),
  right_image_id uuid references images(id),
  chosen_image_id uuid references images(id),
  created_at timestamptz default now()
);

-- Admin views
create view image_stats as
select
  i.id,
  i.slug,
  i.image_url,
  i.prompt,
  a.name as archetype_name,
  a.slug as archetype_slug,
  count(distinct case when qr.left_image_id = i.id or qr.right_image_id = i.id then qr.id end) as times_shown,
  count(distinct case when qr.chosen_image_id = i.id then qr.id end) as times_chosen
from images i
join archetypes a on a.id = i.archetype_id
left join quiz_responses qr on qr.left_image_id = i.id or qr.right_image_id = i.id
group by i.id, i.slug, i.image_url, i.prompt, a.name, a.slug;
