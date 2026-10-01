import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Category, OrderAndRequest, Product, StoreSettings, HeroSlide, CustomFlowerVariety, SiteContent } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_HERO_SLIDES, INITIAL_FLOWER_VARIETIES, INITIAL_SITE_CONTENT } from '../data/initialData';

// Local storage keys (v3 for Webloom branding and clean state)
const STORAGE_KEY_PRODUCTS = 'webloom_products_v3';
const STORAGE_KEY_CATEGORIES = 'webloom_categories_v3';
const STORAGE_KEY_SETTINGS = 'webloom_settings_v3';
const STORAGE_KEY_ORDERS = 'webloom_orders_v3';
const STORAGE_KEY_HERO_SLIDES = 'webloom_hero_slides_v3';
const STORAGE_KEY_VARIETIES = 'webloom_varieties_v3';
const STORAGE_KEY_SITE_CONTENT = 'webloom_site_content_v3';

export const DEFAULT_SUPABASE_URL = 'https://juiiibnuzbctwfmghevy.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1aWlpYm51emJjdHdmbWdoZXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MjQxMjgsImV4cCI6MjEwNjAwMDEyOH0.ezr1RPTfpJM-Ht9BCay_AWBOrk-b7GwDgLHmuHvLVW0';

let activeSupabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(url?: string, key?: string): SupabaseClient | null {
  const targetUrl =
    url ||
    (typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.VITE_SUPABASE_URL ||
        import.meta.env.SUPABASE_URL ||
        import.meta.env.NEXT_PUBLIC_SUPABASE_URL
      : '') ||
    (typeof process !== 'undefined' && process.env
      ? process.env.VITE_SUPABASE_URL ||
        process.env.SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL
      : '') ||
    DEFAULT_SUPABASE_URL;

  const targetKey =
    key ||
    (typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.VITE_SUPABASE_ANON_KEY ||
        import.meta.env.SUPABASE_ANON_KEY ||
        import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      : '') ||
    (typeof process !== 'undefined' && process.env
      ? process.env.VITE_SUPABASE_ANON_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      : '') ||
    DEFAULT_SUPABASE_ANON_KEY;

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
    activeSupabaseClient = null;
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
        return { success: true, message: 'الاتصال بمشروع Supabase ناجح! لكن الجداول غير منشأة بعد. يرجى نسخ كود SQL المرفق وتشغيله في محرر SQL بـ Supabase.' };
      }
      return { success: false, message: `خطأ في الاتصال: ${error.message}` };
    }
    return { success: true, message: 'تم الاتصال بقاعدة بيانات Supabase بنجاح، وجميع الجداول جاهزة!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'تعذر الاتصال بـ Supabase' };
  }
}

// Local Storage Helpers - Cleaned up to strictly respect user deletions and Supabase data
export function loadLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (raw !== null) {
      // If user deleted items or set it to empty array, return exactly what was saved!
      return JSON.parse(raw);
    }
    // Only return initial products on first ever uninitialized load
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
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

export function purgeLocalProducts(): void {
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify([]));
  } catch (e) {
    console.error('Failed to purge products', e);
  }
}

export function loadLocalCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (raw !== null) {
      return JSON.parse(raw);
    }
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
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

export function purgeLocalCategories(): void {
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify([]));
  } catch (e) {
    console.error('Failed to purge categories', e);
  }
}

export function loadLocalHeroSlides(): HeroSlide[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HERO_SLIDES);
    if (raw !== null) {
      return JSON.parse(raw);
    }
    localStorage.setItem(STORAGE_KEY_HERO_SLIDES, JSON.stringify(INITIAL_HERO_SLIDES));
    return INITIAL_HERO_SLIDES;
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
    if (raw !== null) {
      return JSON.parse(raw);
    }
    localStorage.setItem(STORAGE_KEY_VARIETIES, JSON.stringify(INITIAL_FLOWER_VARIETIES));
    return INITIAL_FLOWER_VARIETIES;
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
    if (raw !== null) {
      return { ...INITIAL_SITE_CONTENT, ...JSON.parse(raw) };
    }
    localStorage.setItem(STORAGE_KEY_SITE_CONTENT, JSON.stringify(INITIAL_SITE_CONTENT));
    return INITIAL_SITE_CONTENT;
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
    if (raw !== null) {
      return { ...INITIAL_SETTINGS, ...JSON.parse(raw) };
    }
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    return INITIAL_SETTINGS;
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
-- Webloom Boutique - Complete Modern Supabase Schema
-- متجر وي بلووم (Webloom) - مخطط جداول قاعدة البيانات المحدث والمتكامل
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
    story_title_ar TEXT DEFAULT 'موقعنا وقصتنا - وي بلووم',
    story_body_ar TEXT DEFAULT '',
    story_image TEXT DEFAULT '',
    vip_banner_title_ar TEXT DEFAULT '',
    vip_banner_body_ar TEXT DEFAULT '',
    location_address_ar TEXT DEFAULT '',
    location_city_ar TEXT DEFAULT '',
    location_lat NUMERIC DEFAULT 35.1318,
    location_lng NUMERIC DEFAULT 36.7578,
    google_maps_place_url TEXT DEFAULT '',
    google_analytics_id TEXT DEFAULT '',
    google_search_console_code TEXT DEFAULT ''
);

-- 6. store_settings table (إعدادات المتجر العامة)
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    site_name_ar TEXT DEFAULT 'وي بلووم',
    site_name_en TEXT DEFAULT 'Webloom',
    site_domain TEXT DEFAULT 'https://webloom-phi.vercel.app',
    phone_primary TEXT DEFAULT '+96333221100',
    whatsapp_number TEXT DEFAULT '+963944556677',
    address_ar TEXT DEFAULT '',
    address_en TEXT DEFAULT '',
    admin_username TEXT DEFAULT 'admin',
    admin_password TEXT DEFAULT 'webloom2026',
    announcement_text_ar TEXT DEFAULT '',
    announcement_enabled BOOLEAN DEFAULT true,
    exchange_rate_usd_syp NUMERIC DEFAULT 14500,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. orders_and_requests table (سجلات الطلبات وطلبات الباقات المخصصة عبر واتساب)
CREATE TABLE IF NOT EXISTS public.orders_and_requests (
    id TEXT PRIMARY KEY DEFAULT 'ord_' || substr(md5(random()::text), 1, 10),
    request_type TEXT NOT NULL DEFAULT 'order', -- 'order' أو 'custom_bouquet'
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_city TEXT DEFAULT '',
    customer_neighborhood TEXT DEFAULT '',
    customer_address TEXT DEFAULT '',
    items JSONB DEFAULT '[]'::jsonb,
    total_amount NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'SYP',
    notes TEXT DEFAULT '',
    gift_card_note TEXT DEFAULT '',
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'completed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders_and_requests(status);
CREATE INDEX IF NOT EXISTS idx_orders_type ON public.orders_and_requests(request_type);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders_and_requests(created_at DESC);

-- Enable RLS and public read/write policies for anonymous clients
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_flower_varieties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders_and_requests ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY IF NOT EXISTS "Allow public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read hero_slides" ON public.hero_slides FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read custom_flower_varieties" ON public.custom_flower_varieties FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read site_content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read store_settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow public read orders" ON public.orders_and_requests FOR SELECT USING (true);

-- Allow public insert/update/delete for store management
CREATE POLICY IF NOT EXISTS "Allow public all products" ON public.products FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow public all categories" ON public.categories FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow public all hero_slides" ON public.hero_slides FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow public all varieties" ON public.custom_flower_varieties FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow public all site_content" ON public.site_content FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow public all store_settings" ON public.store_settings FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow public all orders" ON public.orders_and_requests FOR ALL USING (true);
`;
