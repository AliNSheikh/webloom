import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Category, OrderAndRequest, Product, StoreSettings, HeroSlide, CustomFlowerVariety, SiteContent } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_HERO_SLIDES, INITIAL_FLOWER_VARIETIES, INITIAL_SITE_CONTENT } from '../data/initialData';

// Local storage keys
const STORAGE_KEY_PRODUCTS = 'hama_flowers_products_v2';
const STORAGE_KEY_CATEGORIES = 'hama_flowers_categories_v2';
const STORAGE_KEY_SETTINGS = 'hama_flowers_settings_v2';
const STORAGE_KEY_ORDERS = 'hama_flowers_orders_v2';
const STORAGE_KEY_HERO_SLIDES = 'hama_flowers_hero_slides_v2';
const STORAGE_KEY_VARIETIES = 'hama_flowers_varieties_v2';
const STORAGE_KEY_SITE_CONTENT = 'hama_flowers_site_content_v2';

let activeSupabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(url?: string, key?: string): SupabaseClient | null {
  const targetUrl = url || import.meta.env.VITE_SUPABASE_URL || '';
  const targetKey = key || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  if (!targetUrl || !targetKey) {
    activeSupabaseClient = null;
    return null;
  }

  try {
    if (!activeSupabaseClient) {
      activeSupabaseClient = createClient(targetUrl, targetKey);
    }
    return activeSupabaseClient;
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
}

export function resetSupabaseClient(url: string, key: string): SupabaseClient | null {
  if (!url || !key) {
    activeSupabaseClient = null;
    return null;
  }
  try {
    activeSupabaseClient = createClient(url, key);
    return activeSupabaseClient;
  } catch (err) {
    console.error('Error re-initializing Supabase client:', err);
    activeSupabaseClient = null;
    return null;
  }
}

// Check database connection
export async function testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!url.startsWith('https://') || !url.includes('.supabase.co')) {
      return { success: false, message: 'عنوان الرابط يجب أن يبدأ بـ https:// وينتهي بـ .supabase.co' };
    }
    const client = createClient(url, key);
    const { error } = await client.from('categories').select('count', { count: 'exact', head: true });
    if (error) {
      if (error.code === '42P01') {
        return { success: true, message: 'الاتصال بالمشروع ناجح! لكن الجداول غير منشأة بعد. يرجى نسخ كود SQL المرفق وتشغيله في محرر SQL بـ Supabase.' };
      }
      return { success: false, message: `خطأ في الاتصال: ${error.message}` };
    }
    return { success: true, message: 'تم الاتصال بقاعدة بيانات Supabase بنجاح، وجميع الجداول جاهزة!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'تعذر الاتصال بـ Supabase' };
  }
}

// Local Storage Helpers
export function loadLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const saved: Product[] = JSON.parse(raw);
    const existingIds = new Set(saved.map((p) => p.id));
    const missing = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
    if (missing.length > 0) {
      const merged = [...saved, ...missing];
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(merged));
      return merged;
    }
    return saved;
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function saveLocalProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products to localStorage', e);
  }
}

export function loadLocalCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CATEGORIES;
  }
}

export function saveLocalCategories(categories: Category[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories to localStorage', e);
  }
}

export function loadLocalHeroSlides(): HeroSlide[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HERO_SLIDES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_HERO_SLIDES, JSON.stringify(INITIAL_HERO_SLIDES));
      return INITIAL_HERO_SLIDES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_HERO_SLIDES;
  }
}

export function saveLocalHeroSlides(slides: HeroSlide[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_HERO_SLIDES, JSON.stringify(slides));
  } catch (e) {
    console.error('Failed to save hero slides to localStorage', e);
  }
}

export function loadLocalFlowerVarieties(): CustomFlowerVariety[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VARIETIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_VARIETIES, JSON.stringify(INITIAL_FLOWER_VARIETIES));
      return INITIAL_FLOWER_VARIETIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_FLOWER_VARIETIES;
  }
}

export function saveLocalFlowerVarieties(varieties: CustomFlowerVariety[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_VARIETIES, JSON.stringify(varieties));
  } catch (e) {
    console.error('Failed to save flower varieties to localStorage', e);
  }
}

export function loadLocalSiteContent(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SITE_CONTENT);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SITE_CONTENT, JSON.stringify(INITIAL_SITE_CONTENT));
      return INITIAL_SITE_CONTENT;
    }
    return { ...INITIAL_SITE_CONTENT, ...JSON.parse(raw) };
  } catch {
    return INITIAL_SITE_CONTENT;
  }
}

export function saveLocalSiteContent(content: SiteContent): void {
  try {
    localStorage.setItem(STORAGE_KEY_SITE_CONTENT, JSON.stringify(content));
  } catch (e) {
    console.error('Failed to save site content to localStorage', e);
  }
}

export function loadLocalSettings(): StoreSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    return { ...INITIAL_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return INITIAL_SETTINGS;
  }
}

export function saveLocalSettings(settings: StoreSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
}

export function loadLocalOrders(): OrderAndRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalOrders(orders: OrderAndRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to localStorage', e);
  }
}

// SQL Schema for Supabase Setup
export const SUPABASE_SQL_SCHEMA = `-- ========================================================
-- Hama Flowers Boutique - Complete Modern Supabase Schema
-- متجر زهور حماة - مخطط جداول قاعدة البيانات المحدث والمتكامل
-- ========================================================

-- Migration block for existing installations (ترقية الجداول القائمة تلقائياً بدون فقدان البيانات)
ALTER TABLE IF EXISTS public.products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE IF EXISTS public.products ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS public.products ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.products ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '[]'::jsonb;
ALTER TABLE IF EXISTS public.categories ADD COLUMN IF NOT EXISTS image TEXT DEFAULT '';
ALTER TABLE IF EXISTS public.categories ADD COLUMN IF NOT EXISTS show_on_home BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS public.categories ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.orders_and_requests ADD COLUMN IF NOT EXISTS customer_neighborhood TEXT DEFAULT '';

-- 1. products table (المنتجات والباقات مع خاصية رفع صور متعددة والإخفاء والتوفر والحذف)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description_ar TEXT DEFAULT '',
    description_en TEXT DEFAULT '',
    price NUMERIC NOT NULL DEFAULT 0, -- السعر حصراً بالليرة السورية SYP
    compare_at_price NUMERIC DEFAULT 0,
    discount_percent INTEGER DEFAULT 0,
    has_discount BOOLEAN DEFAULT false,
    category_id TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb, -- مصفوفة صور الباقة المتعددة
    stock_quantity INTEGER DEFAULT 0,
    sku TEXT UNIQUE NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true, -- توفر الباقة أو إيقاف عرضها مع بقائها بالمخزون
    is_archived BOOLEAN DEFAULT false, -- الحذف النهائي أو الأرشفة
    specs JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON public.products(is_available);

-- 2. categories table (التصنيفات مع الوصف وصورة الغلاف وخيار العرض بالرئيسية والحذف والإخفاء)
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description_ar TEXT DEFAULT '',
    description_en TEXT DEFAULT '',
    icon TEXT DEFAULT 'Sparkles',
    image TEXT DEFAULT '', -- صورة غلاف التصنيف المرفوعة
    show_on_home BOOLEAN DEFAULT true, -- التحكم بظهور التصنيف في الصفحة الرئيسية
    sort_order INTEGER DEFAULT 0,
    is_archived BOOLEAN DEFAULT false, -- إخفاء التصنيف (يخفي تلقائياً كافة منتجاته)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- 3. hero_slides table (سلايدر الواجهة الرئيسية)
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id TEXT PRIMARY KEY,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    subtitle_ar TEXT DEFAULT '',
    subtitle_en TEXT DEFAULT '',
    badge_ar TEXT DEFAULT '',
    badge_en TEXT DEFAULT '',
    image TEXT NOT NULL,
    cta_text_ar TEXT DEFAULT '',
    cta_text_en TEXT DEFAULT '',
    cta_link TEXT DEFAULT '#catalog',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. custom_flower_varieties table (أنواع الزهور المخصصة للطلب الشخصي)
CREATE TABLE IF NOT EXISTS public.custom_flower_varieties (
    id TEXT PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    image TEXT DEFAULT '',
    color_hex TEXT DEFAULT '#dc2626',
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. site_content table (نصوص وصور المتجر والموقع الجغرافي)
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY DEFAULT 'default',
    announcement_ticker TEXT DEFAULT '',
    announcement_speed_sec INTEGER DEFAULT 25,
    story_title_ar TEXT DEFAULT 'موقعنا وقصتنا في قلب حماة',
    story_body_ar TEXT DEFAULT '',
    story_image TEXT DEFAULT '',
    vip_banner_title_ar TEXT DEFAULT '',
    vip_banner_body_ar TEXT DEFAULT '',
    location_address_ar TEXT DEFAULT 'حماة، سوريا - شارع العلمين، ساحة العاصي',
    location_lat NUMERIC DEFAULT 35.1318,
    location_lng NUMERIC DEFAULT 36.7578,
    google_maps_place_url TEXT DEFAULT '',
    google_analytics_id TEXT DEFAULT '',
    google_search_console_code TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. store_settings table (إعدادات المتجر وبيانات الاتصال والمسؤول)
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    site_name_ar TEXT DEFAULT 'زهور حماة | بوتيك الزهور والتنسيقات الفنية',
    site_name_en TEXT DEFAULT 'Hama Flowers Boutique',
    site_domain TEXT DEFAULT 'hama-flowers.sy',
    phone_primary TEXT DEFAULT '+96333221100',
    whatsapp_number TEXT DEFAULT '+963944556677',
    address_ar TEXT DEFAULT 'حماة، سوريا - ساحة العاصي',
    admin_username TEXT DEFAULT 'admin',
    admin_password TEXT DEFAULT 'hamaflowers2026',
    supabase_url TEXT DEFAULT '',
    supabase_anon_key TEXT DEFAULT '',
    announcement_text_ar TEXT DEFAULT '',
    announcement_enabled BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. orders_and_requests table (الطلبات وطلبات الباقات المخصصة)
CREATE TABLE IF NOT EXISTS public.orders_and_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_type TEXT NOT NULL CHECK (request_type IN ('order', 'custom_bouquet')),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_city TEXT DEFAULT 'حماة',
    customer_neighborhood TEXT DEFAULT '',
    customer_address TEXT DEFAULT '',
    items JSONB DEFAULT '[]'::jsonb, -- يشمل روابط المنتجات المباشرة
    total_amount NUMERIC DEFAULT 0, -- بالليرة السورية
    currency TEXT DEFAULT 'SYP',
    notes TEXT DEFAULT '',
    gift_card_note TEXT DEFAULT '',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders_and_requests(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders_and_requests(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_flower_varieties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders_and_requests ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active public content
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read HeroSlides" ON public.hero_slides FOR SELECT USING (true);
CREATE POLICY "Public Read Varieties" ON public.custom_flower_varieties FOR SELECT USING (true);
CREATE POLICY "Public Read SiteContent" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON public.store_settings FOR SELECT USING (true);

-- Allow public customer order submission
CREATE POLICY "Public Insert Orders" ON public.orders_and_requests FOR INSERT WITH CHECK (true);

-- Full access for authenticated/admin
CREATE POLICY "Admin Full Access Products" ON public.products FOR ALL USING (true);
CREATE POLICY "Admin Full Access Categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Admin Full Access HeroSlides" ON public.hero_slides FOR ALL USING (true);
CREATE POLICY "Admin Full Access Varieties" ON public.custom_flower_varieties FOR ALL USING (true);
CREATE POLICY "Admin Full Access SiteContent" ON public.site_content FOR ALL USING (true);
CREATE POLICY "Admin Full Access Settings" ON public.store_settings FOR ALL USING (true);
CREATE POLICY "Admin Full Access Orders" ON public.orders_and_requests FOR ALL USING (true);
`;
