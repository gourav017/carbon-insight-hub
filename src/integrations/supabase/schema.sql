-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Organizations table
create table public.organizations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  industry text,
  size text,
  region text,
  website text,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Organization Members (for many-to-many relationship if needed later, but simple 1-to-many for now)
-- For now, let's assume a profile belongs to one organization or we just link assessments to organizations.

-- ESG Assessments table
create table public.esg_assessments (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id),
  user_id uuid references public.profiles(id),
  status text default 'draft', -- draft, completed
  reporting_year integer,
  
  -- Scores
  overall_score numeric,
  environmental_score numeric,
  social_score numeric,
  governance_score numeric,
  
  -- JSONB for detailed answers to avoid massive column lists
  answers jsonb default '{}'::jsonb,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Carbon Emissions (Scope-Based) table
create table public.carbon_emissions (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id),
  user_id uuid references public.profiles(id),
  status text default 'draft',
  reporting_year integer,
  
  -- High level results
  total_emissions numeric,
  scope1_total numeric,
  scope2_total numeric,
  scope3_total numeric,
  
  -- JSONB for detailed input data (fuel usage, electricity, etc.)
  scope1_data jsonb default '{}'::jsonb,
  scope2_data jsonb default '{}'::jsonb,
  scope3_data jsonb default '{}'::jsonb,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Carbon Footprints (Sector-Specific) table
create table public.carbon_footprints (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id),
  user_id uuid references public.profiles(id),
  sector_id text not null, -- 'energy', 'transport', etc.
  status text default 'draft',
  
  -- Results
  total_emissions numeric,
  breakdown jsonb, -- Detailed breakdown of calculations
  
  -- Input Data
  input_data jsonb default '{}'::jsonb,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Row Level Security)
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.esg_assessments enable row level security;
alter table public.carbon_emissions enable row level security;
alter table public.carbon_footprints enable row level security;

-- Simple policy: Users can see their own data
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- For other tables, we might need more complex logic based on organization membership, 
-- but for now let's allow users to see data they created.
create policy "Users can view own organizations" on public.organizations
  for select using (auth.uid() = created_by);

create policy "Users can insert organizations" on public.organizations
  for insert with check (auth.uid() = created_by);

create policy "Users can view own esg assessments" on public.esg_assessments
  for select using (auth.uid() = user_id);

create policy "Users can insert esg assessments" on public.esg_assessments
  for insert with check (auth.uid() = user_id);
  
create policy "Users can update own esg assessments" on public.esg_assessments
  for update using (auth.uid() = user_id);

-- Same for Carbon tables
create policy "Users can view own carbon emissions" on public.carbon_emissions
  for select using (auth.uid() = user_id);

create policy "Users can insert carbon emissions" on public.carbon_emissions
  for insert with check (auth.uid() = user_id);

create policy "Users can update own carbon emissions" on public.carbon_emissions
  for update using (auth.uid() = user_id);

create policy "Users can view own carbon footprints" on public.carbon_footprints
  for select using (auth.uid() = user_id);

create policy "Users can insert carbon footprints" on public.carbon_footprints
  for insert with check (auth.uid() = user_id);

create policy "Users can update own carbon footprints" on public.carbon_footprints
  for update using (auth.uid() = user_id);
