-- Every "image_path" field in the admin (ImageField) now also accepts video
-- uploads (see src/components/admin/ImageField.tsx), capped client-side at
-- 100MB. Supabase's project-wide default per-file limit is 50MB, which would
-- silently reject anything client-side allows above it — raise the `media`
-- bucket's own limit to match.
update storage.buckets
set file_size_limit = 104857600 -- 100MB, in bytes
where id = 'media';
