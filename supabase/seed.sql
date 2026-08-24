-- ============================================================================
-- Lensaeri — seed content, transcribed from the original design canvas.
-- Safe to re-run: every statement is an idempotent upsert.
-- ============================================================================

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Editable copy blocks
-- ---------------------------------------------------------------------------
insert into public.content_blocks (key, page, label, value, field_type, sort_order) values
  ('home.hero.eyebrow',      'Home', 'Hero eyebrow',        'Kuching, Sarawak — Wedding Films & Content', 'text', 10),
  ('home.hero.title',        'Home', 'Hero title',          'Your day, held', 'text', 20),
  ('home.hero.title_em',     'Home', 'Hero title (italic)', 'quietly cinematic.', 'text', 30),
  ('home.hero.body',         'Home', 'Hero paragraph',      'Lensaeri films, photographs and stands beside couples across Borneo — present, unobtrusive, entirely yours.', 'textarea', 40),
  ('home.hero.cta_primary',  'Home', 'Primary button',      'View Portfolio', 'text', 50),
  ('home.hero.cta_secondary','Home', 'Secondary button',    'See Packages', 'text', 60),
  ('home.services.eyebrow',  'Home', 'Services eyebrow',    'What We Do', 'text', 70),
  ('home.services.title',    'Home', 'Services heading',    'Three ways we walk alongside your day', 'text', 80),
  ('home.portfolio.title',   'Home', 'Portfolio heading',   'Recent Films & Frames', 'text', 90),
  ('home.portfolio.link',    'Home', 'Portfolio link',      'Full Portfolio', 'text', 100),
  ('home.testimonial.eyebrow','Home','Testimonial eyebrow', 'Kind Words', 'text', 110),

  ('about.eyebrow',          'About', 'Eyebrow',            'Our Story', 'text', 10),
  ('about.title',            'About', 'Page heading',       'Founded on the belief a wedding day is too fast to be captured loudly.', 'textarea', 20),
  ('about.body_1',           'About', 'Paragraph 1',        'Lensaeri began in 2021 in Kuching, Sarawak — one person, one camera, showing up early enough to catch the quiet, unplanned minutes: a father''s last look, a veil pinned twice, the walk before the walk down the aisle.', 'textarea', 30),
  ('about.body_2',           'About', 'Paragraph 2',        'Today the same eye guides every film, frame and hour spent quietly by a bride''s side — across Sarawak and beyond.', 'textarea', 40),
  ('about.founder_name',     'About', 'Founder name',       'Ain Sofea', 'text', 50),
  ('about.founder_role',     'About', 'Founder role',       'Founder & Lead Creator', 'text', 60),
  ('about.mission',          'About', 'Mission quote',      '“We exist to hold your wedding day gently — present, unobtrusive, and entirely yours.”', 'textarea', 70),
  ('about.bts_title',        'About', 'BTS heading',        'Behind the Scenes', 'text', 80),
  ('about.bts_meta',         'About', 'BTS caption',        'On set, off duty', 'text', 90),

  ('services.eyebrow',       'Services', 'Eyebrow',         'Services', 'text', 10),
  ('services.title',         'Services', 'Page heading',    'Three roles, one quiet attention', 'text', 20),

  ('portfolio.eyebrow',      'Portfolio', 'Eyebrow',        'Portfolio', 'text', 10),
  ('portfolio.title',        'Portfolio', 'Page heading',   'Films & frames, kept honest', 'text', 20),

  ('packages.eyebrow',       'Packages', 'Eyebrow',         'Packages & Pricing', 'text', 10),
  ('packages.title',         'Packages', 'Page heading',    'Choose how we walk beside your day', 'text', 20),
  ('packages.note',          'Packages', 'Pricing note',    'All prices in MYR · Travel outside Kuching quoted separately', 'text', 30),
  ('packages.book_eyebrow',  'Packages', 'Booking eyebrow', 'Book Now', 'text', 40),
  ('packages.book_title',    'Packages', 'Booking heading', 'Tell us about your day', 'text', 50),
  ('packages.book_body',     'Packages', 'Booking body',    'We reply within 48 hours. For a faster response, message us directly on WhatsApp.', 'textarea', 60),
  ('packages.book_contact',  'Packages', 'Booking footnote','Based in Kuching, Sarawak — available across Borneo', 'text', 70),
  ('packages.thanks_title',  'Packages', 'Thank-you title', 'Thank you.', 'text', 80),
  ('packages.thanks_body',   'Packages', 'Thank-you body',  'We''ve received your inquiry and will be in touch within 48 hours.', 'textarea', 90)
on conflict (key) do update
  set page = excluded.page, label = excluded.label,
      field_type = excluded.field_type, sort_order = excluded.sort_order;

-- ---------------------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------------------
insert into public.services (number, title, short_desc, full_desc, points, sort_order)
select * from (values
  ('01', 'Content Creation',
   'Editorial photo and social-ready content for the modern wedding day.',
   'Editorial-style photography and social-ready content — engagement shoots, day-of stills, and short-form reels styled for the feed and the frame alike.',
   array['Full-day photo coverage', 'Same-week teaser gallery', 'Reels & social cutdowns', 'Styled detail shots'], 10),
  ('02', 'Videography',
   'Cinematic films shot handheld, close, and unobtrusive.',
   'Documentary-style wedding films shot handheld and close, cut with restraint — a same-day edit for the reception, and a full film delivered within weeks.',
   array['Multi-camera ceremony coverage', 'Same-day edit', '3–5 minute highlight film', 'Full-length documentary cut'], 20),
  ('03', 'Bride Assistant',
   'A calm second pair of hands, on call from first light to last dance.',
   'A dedicated second pair of hands on the morning of — dress steaming, timeline keeping, vendor coordinating — so the only thing you have to do is show up ready.',
   array['Timeline & vendor coordination', 'Emergency kit on hand', 'Dress & detail styling', 'Day-of point of contact'], 30)
) as v(number, title, short_desc, full_desc, points, sort_order)
where not exists (select 1 from public.services);

-- ---------------------------------------------------------------------------
-- Portfolio
-- ---------------------------------------------------------------------------
insert into public.portfolio_items (caption, category, span, sort_order, is_featured)
select * from (values
  ('Amelia & Reuben',      'Weddings',    2, 10,  true),
  ('Chong & Wei Ling',     'Films',       1, 20,  true),
  ('Farah & Danial',       'Engagements', 1, 30,  true),
  ('On location, Damai',   'BTS',         1, 40,  true),
  ('Sarah & Kevin',        'Weddings',    1, 50,  true),
  ('Nadia & Haziq',        'Weddings',    2, 60,  false),
  ('Grace & Timothy',      'Engagements', 1, 70,  false),
  ('The Astana Ceremony',  'Films',       1, 80,  false),
  ('Bridal prep, dawn',    'BTS',         1, 90,  false),
  ('Michelle & Jonathan',  'Weddings',    1, 100, false),
  ('Dayang & Iskandar',    'Engagements', 1, 110, false),
  ('Riverbank Reception',  'Films',       2, 120, false)
) as v(caption, category, span, sort_order, is_featured)
where not exists (select 1 from public.portfolio_items);

-- ---------------------------------------------------------------------------
-- Testimonials — is_hero drives the large pull quote on the home page
-- ---------------------------------------------------------------------------
insert into public.testimonials (quote, author, meta, is_hero, sort_order)
select * from (values
  ('“They didn''t just document our wedding — they protected it. Every frame still feels exactly like the day felt.”',
   'Amelia & Reuben', 'Married in Kuching', true, 0),
  ('We were nervous about being filmed all day. By the ceremony we had forgotten anyone was there — and the film still caught every single thing that mattered.',
   'Nadia & Haziq', 'Sarawak Cultural Village', false, 10),
  ('The bride assistance was the part we did not know we needed. Someone held my veil, my water, and my nerves for eleven hours straight.',
   'Cheryl Wong', 'Pullman Kuching', false, 20),
  ('Two years on, our parents still watch the film on anniversaries. It is the only recording of my grandmother laughing.',
   'Ivan & Priya', 'Damai Beach Resort', false, 30)
) as v(quote, author, meta, is_hero, sort_order)
where not exists (select 1 from public.testimonials);

-- ---------------------------------------------------------------------------
-- Packages
-- ---------------------------------------------------------------------------
insert into public.packages (name, badge, price, tagline, features, is_featured, sort_order)
select * from (values
  ('The Elopement', 'For Intimate Days', 'RM 2,800', 'Small ceremonies, close gatherings.',
   array['4 hours coverage', '1 lead creator', 'Edited gallery (50+ images)', '2-minute highlight reel'], false, 10),
  ('The Signature', 'Most Booked', 'RM 6,500', 'Full-day photo, film & content.',
   array['8 hours coverage', 'Photo + video team', 'Same-day edit', '5-minute film', 'Styled BTS reel'], true, 20),
  ('The Grand Affair', 'Full Weekend', 'RM 12,000', 'Multi-day, full team, every detail.',
   array['Full weekend coverage', 'Dedicated bride assistant', 'Documentary film', 'Drone footage', 'Premium printed album'], false, 30)
) as v(name, badge, price, tagline, features, is_featured, sort_order)
where not exists (select 1 from public.packages);

-- ---------------------------------------------------------------------------
-- Gallery placeholders — upload images to these rows from the admin
-- ---------------------------------------------------------------------------
insert into public.gallery_images (collection, sort_order, image_alt)
select 'teaser', i * 10, 'Portfolio teaser ' || i
from generate_series(1, 5) as i
where not exists (select 1 from public.gallery_images where collection = 'teaser');

insert into public.gallery_images (collection, sort_order, image_alt)
select 'bts', i * 10, 'Behind the scenes ' || i
from generate_series(1, 8) as i
where not exists (select 1 from public.gallery_images where collection = 'bts');
