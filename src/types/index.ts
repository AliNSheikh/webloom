export type Language = 'ar' | 'en';
export type Currency = 'SYP';

export interface ProductSpec {
  key_ar: string;
  key_en: string;
  value_ar: string;
  value_en: string;
}

export interface Product {
  id: string;
  title_ar: string;
  title_en: string;
  slug: string;
  description_ar: string;
  description_en: string;
  price: number; // Always in SYP
  compare_at_price?: number; // In SYP
  discount_percent?: number;
  has_discount: boolean;
  category_id: string;
  images: string[];
  stock_quantity: number;
  sku: string;
  is_featured: boolean;
  is_new: boolean;
  is_available: boolean; // Retained in inventory but toggles display in storefront
  is_archived: boolean;
  specs: ProductSpec[];
  created_at: string;
}

export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string;
  description_en: string;
  icon: string;
  image?: string;
  show_on_home: boolean; // Whether it appears in homepage sections
  sort_order: number;
  is_archived: boolean; // Hiding category automatically hides its products
  created_at: string;
}

export interface HeroSlide {
  id: string;
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  badge_ar?: string;
  badge_en?: string;
  image: string;
  cta_text_ar?: string;
  cta_text_en?: string;
  cta_link?: string;
  sort_order: number;
  is_active: boolean;
}

export interface CustomFlowerVariety {
  id: string;
  name_ar: string;
  name_en: string;
  image?: string;
  color_hex?: string;
  is_available: boolean;
}

export interface SiteContent {
  announcement_ticker: string;
  announcement_ticker_en: string;
  announcement_speed_sec: number;
  story_title_ar: string;
  story_title_en: string;
  story_body_ar: string;
  story_body_en: string;
  story_image: string;
  vip_banner_title_ar: string;
  vip_banner_title_en: string;
  vip_banner_body_ar: string;
  vip_banner_body_en: string;
  location_address_ar: string;
  location_address_en: string;
  location_city_ar: string;
  location_city_en: string;
  location_lat: number;
  location_lng: number;
  google_maps_place_url: string;
  google_analytics_id: string;
  google_search_console_code: string;
}

export interface StoreSettings {
  id: string;
  site_name_ar: string;
  site_name_en: string;
  site_domain: string;
  phone_primary: string;
  whatsapp_number: string;
  address_ar: string;
  address_en: string;
  admin_username: string;
  admin_password: string;
  supabase_url: string;
  supabase_anon_key: string;
  announcement_text_ar: string;
  announcement_text_en: string;
  announcement_enabled: boolean;
  exchange_rate_usd_syp: number;
  site_logo?: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_title_ar: string;
  product_title_en: string;
  product_slug?: string;
  price: number; // SYP
  quantity: number;
  image?: string;
  card_note?: string;
}

export type OrderRequestType = 'order' | 'custom_bouquet';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface OrderAndRequest {
  id: string;
  request_type: OrderRequestType;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_neighborhood?: string;
  customer_address?: string;
  items: OrderItem[] | Record<string, any>;
  total_amount: number; // SYP
  currency: 'SYP';
  notes: string;
  gift_card_note?: string;
  status: OrderStatus;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  cardMessage?: string;
}

export interface SelectedVarietyItem {
  varietyId: string;
  varietyNameAr: string;
  varietyNameEn: string;
  count: number;
}

export interface CustomBouquetForm {
  selectedVarieties: SelectedVarietyItem[];
  totalFlowerCount: number;
  wrappingColor: string;
  size: 'small' | 'medium' | 'large' | 'royal';
  cardMessage: string;
  occasion: string;
  customerName: string;
  customerPhone: string;
  deliveryNeighborhood: string;
  deliveryAddress: string;
  targetDate: string;
  notes: string;
  referenceImage?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title?: string;
  message: string;
}
