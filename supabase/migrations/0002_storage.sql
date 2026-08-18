-- Supabase Storage Buckets

-- 1. Property Media (Public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-media', 
  'property-media', 
  true, 
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm']
) on conflict do nothing;

-- 2. Property Documents (Private)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-documents', 
  'property-documents', 
  false, 
  10485760, -- 10MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
) on conflict do nothing;

-- RLS Policies for property-media
create policy "Media is publicly accessible"
on storage.objects for select
to public
using (bucket_id = 'property-media');

create policy "Admins can upload media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'property-media' and (select auth.uid()) in (select id from public.admins));

create policy "Admins can update media"
on storage.objects for update
to authenticated
using (bucket_id = 'property-media' and (select auth.uid()) in (select id from public.admins));

create policy "Admins can delete media"
on storage.objects for delete
to authenticated
using (bucket_id = 'property-media' and (select auth.uid()) in (select id from public.admins));

-- RLS Policies for property-documents
create policy "Admins can read documents"
on storage.objects for select
to authenticated
using (bucket_id = 'property-documents' and (select auth.uid()) in (select id from public.admins));

create policy "Admins can upload documents"
on storage.objects for insert
to authenticated
with check (bucket_id = 'property-documents' and (select auth.uid()) in (select id from public.admins));

create policy "Admins can update documents"
on storage.objects for update
to authenticated
using (bucket_id = 'property-documents' and (select auth.uid()) in (select id from public.admins));

create policy "Admins can delete documents"
on storage.objects for delete
to authenticated
using (bucket_id = 'property-documents' and (select auth.uid()) in (select id from public.admins));
