export type SiteSettings = {
  id: number;
  brand_name: string;
  brand_location: string;
  footer_blurb: string;
  email: string;
  phone: string;
  location: string;
  instagram_handle: string;
  instagram_url: string;
  whatsapp_number: string;
  copyright: string;
  hero_image_path: string | null;
  founder_image_path: string | null;
  logo_path: string | null;
};

export type ContentBlock = {
  key: string;
  page: string;
  label: string;
  value: string;
  field_type: "text" | "textarea";
  sort_order: number;
};

export type Service = {
  id: string;
  number: string;
  title: string;
  short_desc: string;
  full_desc: string;
  points: string[];
  image_path: string | null;
  image_alt: string;
  sort_order: number;
  is_published: boolean;
};

export type PortfolioItem = {
  id: string;
  caption: string;
  category: string;
  image_path: string | null;
  image_alt: string;
  tiktok_url: string | null;
  tiktok_video_id: string | null;
  span: number;
  sort_order: number;
  is_featured: boolean;
  is_published: boolean;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  meta: string;
  is_hero: boolean;
  sort_order: number;
  is_published: boolean;
};

export type Package = {
  id: string;
  name: string;
  badge: string;
  price: string;
  tagline: string;
  features: string[];
  is_featured: boolean;
  sort_order: number;
  is_published: boolean;
};

export type GalleryImage = {
  id: string;
  collection: "teaser" | "bts";
  image_path: string | null;
  image_alt: string;
  sort_order: number;
  is_published: boolean;
};

export type SystemUpdate = {
  id: string;
  summary: string;
  created_at: string;
};

export type Inquiry = {
  id: string;
  name: string;
  event_date: string | null;
  location: string;
  package: string;
  message: string;
  is_read: boolean;
  created_at: string;
};
