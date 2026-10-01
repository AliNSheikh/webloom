import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Category, StoreSettings, OrderAndRequest, HeroSlide, CustomFlowerVariety, SiteContent } from '../types';
import { SUPABASE_SQL_SCHEMA } from '../lib/supabase';
import { generateSitemapXml, downloadSitemapXml } from '../lib/sitemap';
import { ImageUploadInput } from './ImageUploadInput';
import { MultiImageUploadInput } from './MultiImageUploadInput';
import { Logo } from './Logo';
import {
  Lock,
  LogOut,
  Flower2,
  FolderTree,
  ShoppingBag,
  Settings,
  Database,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Check,
  X,
  Copy,
  ExternalLink,
  Search,
  Sliders,
  Sparkles,
  MapPin,
  Globe,
  Download,
  FileCode,
  Layers,
  Palette,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    products,
    categories,
    orders,
    heroSlides,
    flowerVarieties,
    siteContent,
    settings,
    saveProduct,
    deleteProduct,
    toggleProductAvailability,
    saveCategory,
    deleteCategory,
    toggleCategoryArchived,
    toggleCategoryHome,
    saveHeroSlide,
    deleteHeroSlide,
    saveFlowerVariety,
    deleteFlowerVariety,
    toggleVarietyAvailability,
    saveSiteContent,
    saveSettings,
    updateOrderStatus,
    deleteOrder,
    purgeAllDemoData,
    testDatabaseConnection,
    syncWithSupabase,
    isSyncing,
    isSupabaseConnected,
    language,
    formatPrice,
    addToast,
    navigateTo,
  } = useStore();

  const isAr = language === 'ar';

  // Login Form State
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  type AdminTab = 'orders' | 'products' | 'categories' | 'hero' | 'varieties' | 'content' | 'seo' | 'settings';
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');

  // Product modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  // Category modal
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Hero Slide modal
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);

  // Flower Variety modal
  const [editingVariety, setEditingVariety] = useState<CustomFlowerVariety | null>(null);
  const [isVarietyModalOpen, setIsVarietyModalOpen] = useState(false);

  // Content form state
  const [contentFormData, setContentFormData] = useState<SiteContent>(siteContent);

  // Settings form state
  const [settingsFormData, setSettingsFormData] = useState<StoreSettings>(settings);
  const [dbTestResult, setDbTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [isSavingStoreSettings, setIsSavingStoreSettings] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Order filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderAndRequest['status']>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<'all' | 'order' | 'custom_bouquet'>('all');

  // Inline Price Editing: { [id]: price }
  const [inlinePriceMap, setInlinePriceMap] = useState<Record<string, number>>({});

  // Login Card - Secure login with masked password field and hidden credentials
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-emerald-900/10 text-center space-y-6">
          <div className="flex justify-center">
            <Logo size="lg" showSubtitle={false} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              {isAr ? 'لوحة إدارة متجر وي بلووم' : 'Webloom Admin Portal'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isAr
                ? 'إدارة الكتالوج، الطلبات، وقاعدة بيانات المتجر'
                : 'Catalog, Orders & Store Database Management'}
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{isAr ? 'اسم المستخدم أو كلمة المرور غير صحيحة، يرجى المحاولة ثانية' : 'Invalid username or password. Please try again.'}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsLoggingIn(true);
              const success = loginAdmin(usernameInput.trim(), passwordInput.trim());
              if (!success) {
                setLoginError(true);
                setIsLoggingIn(false);
              }
            }}
            className="space-y-4 text-right"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isAr ? 'اسم المستخدم:' : 'Username:'}
              </label>
              <input
                type="text"
                dir="ltr"
                required
                value={usernameInput}
                onChange={(e) => {
                  setUsernameInput(e.target.value);
                  setLoginError(false);
                }}
                className="w-full text-xs p-3 rounded-2xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-hidden bg-slate-50 font-mono transition-all"
                placeholder="admin"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isAr ? 'كلمة المرور:' : 'Password:'}
              </label>
              <input
                type="password"
                dir="ltr"
                required
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setLoginError(false);
                }}
                className="w-full text-xs p-3 rounded-2xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-hidden bg-slate-50 font-mono transition-all"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-emerald-900 hover:bg-emerald-950 text-amber-300 font-bold rounded-2xl text-xs shadow-lg shadow-emerald-950/20 transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-800 disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{isLoggingIn ? (isAr ? 'جاري التحقق...' : 'Verifying...') : (isAr ? 'تسجيل الدخول إلى لوحة إدارة وي بلووم' : 'Enter Webloom Dashboard')}</span>
            </button>
          </form>

          <div className="pt-2 text-[11px] text-slate-400 font-mono">
            <span>https://webloom-phi.vercel.app</span>
          </div>
        </div>
      </div>
    );
  }

  // Orders Calculations (sole focus on order data, visitor statistics removed as requested)
  const totalRevenueSYP = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'completed').length;
  const customRequestsCount = orders.filter((o) => o.request_type === 'custom_bouquet').length;

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderTypeFilter !== 'all' && o.request_type !== orderTypeFilter) return false;
    return true;
  });

  const filteredProducts = products.filter((p) => {
    if (!productSearch) return true;
    const q = productSearch.toLowerCase();
    return (
      p.title_ar.toLowerCase().includes(q) ||
      p.title_en.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  });

  // Dynamic Sitemap string
  const currentSitemapXml = generateSitemapXml(products, categories, settings);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      {/* Admin Top Bar */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo size="md" variant="icon" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
              {isAr ? 'لوحة تحكم وإدارة وي بلووم' : 'Webloom Boutique Dashboard'}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{isAr ? 'إدارة الكتالوج، المخزون، والربط مع Supabase' : 'Store Management'}</span>
              <span className="text-slate-300">•</span>
              <span className={`inline-flex items-center gap-1 font-semibold ${isSupabaseConnected ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isSupabaseConnected ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {isAr ? 'قاعدة بيانات Supabase متصلة وجاهزة' : 'Supabase Connected'}
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    {isAr ? 'قاعدة بيانات Supabase قيد التجهيز' : 'Supabase Initializing'}
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => syncWithSupabase()}
            disabled={isSyncing}
            className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            title="جلب البيانات حصرياً من Supabase"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? (isAr ? 'جاري المزامنة...' : 'Syncing...') : (isAr ? 'جلب من Supabase' : 'Fetch Supabase')}</span>
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{isAr ? 'معاينة المتجر' : 'View Store'}</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>{isAr ? 'تسجيل الخروج' : 'Log Out'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-2xs flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'orders' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{isAr ? 'الطلبات والمبيعات' : 'Orders & Sales'}</span>
          {pendingOrdersCount > 0 && (
            <span className="bg-white text-rose-600 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold">
              {pendingOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'products' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Flower2 className="w-4 h-4" />
          <span>{isAr ? 'إدارة الباقات والمنتجات' : 'Products & Bouquets'}</span>
          <span className="text-[11px] opacity-80">({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'categories' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>{isAr ? 'إدارة التصنيفات وترتيب الواجهة' : 'Categories & Layout'}</span>
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'hero' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{isAr ? 'سلايدر الواجهة' : 'Hero Slider'}</span>
        </button>

        <button
          onClick={() => setActiveTab('varieties')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'varieties' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>{isAr ? 'أنواع الزهور المخصصة' : 'Custom Flower Varieties'}</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'content' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>{isAr ? 'محتوى المتجر والموقع' : 'Content & Location'}</span>
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'seo' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>{isAr ? 'فهرسة Google و Sitemap' : 'Google SEO & Sitemap'}</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'settings' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>{isAr ? 'الإعدادات وقاعدة البيانات' : 'Settings & Database'}</span>
        </button>
      </div>

      {/* ================= TAB 1: ORDERS (Focus solely on orders, visitor stats removed) ================= */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Order Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">{isAr ? 'إجمالي الطلبات' : 'Total Orders'}</span>
              <div className="text-2xl font-bold font-serif text-slate-900 mt-1 tabular-nums">
                {orders.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{isAr ? 'طلبات سلة وتصميم مخصص' : 'Cart & Custom'}</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs text-amber-700 font-medium">{isAr ? 'طلبات قيد المتابعة' : 'Pending Orders'}</span>
              <div className="text-2xl font-bold font-serif text-amber-600 mt-1 tabular-nums">
                {pendingOrdersCount}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{isAr ? 'بحاجة لتأكيد التسليم' : 'Awaiting confirmation'}</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs text-emerald-700 font-medium">{isAr ? 'طلبات مكتملة ومسلمة' : 'Completed'}</span>
              <div className="text-2xl font-bold font-serif text-emerald-600 mt-1 tabular-nums">
                {completedOrdersCount}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{isAr ? 'تم تسليمها للزبائن' : 'Delivered'}</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs text-rose-700 font-medium">{isAr ? 'المبيعات المقدرة' : 'Total Sales'}</span>
              <div className="text-xl font-bold font-serif text-rose-700 mt-1 tabular-nums">
                {formatPrice(totalRevenueSYP)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{isAr ? 'بالليرة السورية SYP' : 'In Syrian Lira'}</div>
            </div>
          </div>

          {/* Orders Filter & Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  {isAr ? 'قائمة الطلبات واستفسارات الواتساب' : 'Orders & WhatsApp Inquiries'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAr ? 'مراجعة بيانات العملاء، الأحياء في حماة، وتحديث حالة التسليم' : 'Manage customer requests'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                  className="p-2 rounded-xl border border-slate-200 bg-white font-medium cursor-pointer"
                >
                  <option value="all">{isAr ? 'كافة الحالات' : 'All Statuses'}</option>
                  <option value="pending">{isAr ? 'قيد الانتظار' : 'Pending'}</option>
                  <option value="processing">{isAr ? 'قيد التجهيز' : 'Processing'}</option>
                  <option value="completed">{isAr ? 'مكتمل' : 'Completed'}</option>
                  <option value="cancelled">{isAr ? 'ملغي' : 'Cancelled'}</option>
                </select>

                <select
                  value={orderTypeFilter}
                  onChange={(e) => setOrderTypeFilter(e.target.value as any)}
                  className="p-2 rounded-xl border border-slate-200 bg-white font-medium cursor-pointer"
                >
                  <option value="all">{isAr ? 'جميع أنواع الطلبات' : 'All Types'}</option>
                  <option value="order">{isAr ? 'شراء سلة' : 'Store Orders'}</option>
                  <option value="custom_bouquet">{isAr ? 'طلب باقة مخصصة' : 'Custom Requests'}</option>
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-bold text-slate-600">{isAr ? 'لا توجد طلبات مطابقة حالياً' : 'No matching orders'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-stone-50/40 hover:bg-stone-50/80 transition-colors space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            ord.request_type === 'custom_bouquet'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {ord.request_type === 'custom_bouquet'
                            ? isAr ? '🎨 تصميم باقة مخصصة' : 'Custom Bouquet'
                            : isAr ? '🌸 طلب باقات المتجر' : 'Store Order'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">#{ord.id}</span>
                        <span className="text-xs text-slate-400">
                          {new Date(ord.created_at).toLocaleString(isAr ? 'ar-SY' : 'en-US')}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-semibold">{isAr ? 'الحالة:' : 'Status:'}</span>
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer ${
                            ord.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : ord.status === 'processing'
                              ? 'bg-sky-50 text-sky-700 border-sky-300'
                              : ord.status === 'cancelled'
                              ? 'bg-red-50 text-red-700 border-red-300'
                              : 'bg-amber-50 text-amber-700 border-amber-300'
                          }`}
                        >
                          <option value="pending">{isAr ? 'قيد الانتظار' : 'Pending'}</option>
                          <option value="processing">{isAr ? 'قيد التجهيز' : 'Processing'}</option>
                          <option value="completed">{isAr ? 'مكتمل ومسلّم' : 'Completed'}</option>
                          <option value="cancelled">{isAr ? 'ملغي' : 'Cancelled'}</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer & Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200/80">
                      <div>
                        <span className="text-slate-400 block">{isAr ? 'العميل:' : 'Customer:'}</span>
                        <span className="font-bold text-slate-900">{ord.customer_name}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{isAr ? 'رقم الهاتف / واتساب:' : 'Phone:'}</span>
                        <a
                          href={`https://wa.me/${ord.customer_phone.replace(/[^\d+]/g, '').replace('+', '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-emerald-600 hover:underline flex items-center gap-1 font-mono"
                          dir="ltr"
                        >
                          <span>{ord.customer_phone}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{isAr ? 'الحي والعنوان بحماة:' : 'Neighborhood & Address:'}</span>
                        <span className="font-semibold text-slate-800">
                          {ord.customer_neighborhood || ord.customer_city || 'حماة'}
                          {ord.customer_address ? ` - ${ord.customer_address}` : ''}
                        </span>
                      </div>
                    </div>

                    {/* Ordered Items summary with product links */}
                    {Array.isArray(ord.items) && ord.items.length > 0 && (
                      <div className="text-xs space-y-1 pt-1">
                        <span className="font-bold text-slate-700 block">{isAr ? 'العناصر وروابط الباقات:' : 'Items & Links:'}</span>
                        <div className="space-y-1">
                          {ord.items.map((it: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-800">
                                  {isAr ? it.product_title_ar : it.product_title_en} (x{it.quantity})
                                </span>
                                {it.product_slug && (
                                  <a
                                    href={`/#product/${it.product_slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] text-rose-600 hover:underline flex items-center gap-1 font-mono"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>رابط الباقة</span>
                                  </a>
                                )}
                              </div>
                              <span className="font-bold text-slate-800 tabular-nums">
                                {formatPrice(it.price * it.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {ord.notes && (
                      <div className="text-xs text-slate-500 bg-white p-2.5 rounded-lg border border-slate-100">
                        <span className="font-bold text-slate-700">{isAr ? 'ملاحظات العميل: ' : 'Notes: '}</span>
                        {ord.notes}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{isAr ? 'إجمالي الطلب المطلوب:' : 'Total Amount:'}</span>
                        <span className="text-base font-extrabold text-rose-700 tabular-nums">
                          {ord.total_amount > 0 ? formatPrice(ord.total_amount) : (isAr ? 'يحدد عبر واتساب' : 'Quoted on WhatsApp')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(isAr ? `هل أنت متأكد من حذف سجل الطلب #${ord.id.slice(0, 8)} نهائياً؟` : 'Delete this order record permanently?')) {
                            deleteOrder(ord.id);
                          }
                        }}
                        className="px-2.5 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        title={isAr ? 'حذف هذا الطلب نهائياً من السجلات' : 'Delete order record'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isAr ? 'حذف الطلب' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: PRODUCTS (Package deletion, availability toggle, computer image upload, SYP pricing) ================= */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  {isAr ? 'كتالوج الباقات والزهور' : 'Bouquets & Arrangements Catalog'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAr
                    ? 'إضافة وحذف الباقات، إيقاف العرض مع الإبقاء بالمخزون، ورفع الصور من جهازك'
                    : 'Manage products, toggle availability, upload computer photos, and edit SYP prices'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute top-2.5 right-3 text-slate-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder={isAr ? 'بحث بالاسم أو SKU...' : 'Search bouquets...'}
                    className="p-2 pr-9 pl-3 rounded-xl border border-slate-200 text-xs focus:border-rose-500 outline-hidden bg-slate-50 w-44 sm:w-56"
                  />
                </div>

                {/* Purge Demo Products Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(isAr ? 'هل أنت متأكد من تفريغ كافة المنتجات التجريبية من الذاكرة والمتجر؟ لن يتم حذف منتجاتك الخاصة المحفوظة في Supabase.' : 'Purge all demo products to free memory?')) {
                      purgeAllDemoData();
                    }
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-200 cursor-pointer transition-colors"
                  title={isAr ? 'حذف كافة البيانات التجريبية لتقليص استهلاك الذاكرة' : 'Purge demo data to free memory'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تفريغ البيانات التجريبية' : 'Purge Demo Data'}</span>
                </button>

                <button
                  onClick={() => {
                    const newId = `prod-${Date.now().toString(36)}`;
                    setEditingProduct({
                      id: newId,
                      title_ar: '',
                      title_en: '',
                      slug: `bouquet-${Date.now().toString(36)}`,
                      description_ar: '',
                      description_en: '',
                      price: 250000,
                      has_discount: false,
                      category_id: categories[0]?.id || 'cat-bouquets',
                      images: [],
                      stock_quantity: 10,
                      sku: `WBM-${Math.floor(100 + Math.random() * 900)}`,
                      is_featured: false,
                      is_new: true,
                      is_available: true,
                      is_archived: false,
                      specs: [],
                      created_at: new Date().toISOString(),
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-amber-300 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-950/20 cursor-pointer border border-emerald-800"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'إضافة باقة جديدة' : 'Add Bouquet'}</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-3 pr-2">{isAr ? 'الصورة والباقة' : 'Item'}</th>
                    <th className="pb-3">{isAr ? 'التصنيف' : 'Category'}</th>
                    <th className="pb-3">{isAr ? 'السعر (ل.س)' : 'Price (SYP)'}</th>
                    <th className="pb-3">{isAr ? 'العرض بالمتجر' : 'Store Display'}</th>
                    <th className="pb-3 pl-2 text-left rtl:text-right">{isAr ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => {
                    const cat = categories.find((c) => c.id === p.category_id);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 pr-2 flex items-center gap-3">
                          <img
                            src={p.images[0] || ''}
                            alt={p.title_ar}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{isAr ? p.title_ar : p.title_en}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              SKU: {p.sku} | #{p.slug}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 text-slate-600">
                          {cat ? (isAr ? cat.name_ar : cat.name_en) : '—'}
                        </td>

                        {/* Inline SYP Price edit */}
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              defaultValue={p.price}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 0;
                                setInlinePriceMap((prev) => ({ ...prev, [p.id]: val }));
                              }}
                              className="w-24 p-1.5 text-xs font-bold text-rose-700 border border-slate-200 rounded-lg focus:border-rose-500 outline-hidden bg-white tabular-nums"
                            />
                            {inlinePriceMap[p.id] !== undefined && inlinePriceMap[p.id] !== p.price && (
                              <button
                                onClick={() => {
                                  saveProduct({ ...p, price: inlinePriceMap[p.id] });
                                  setInlinePriceMap((prev) => {
                                    const next = { ...prev };
                                    delete next[p.id];
                                    return next;
                                  });
                                }}
                                className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                                title="حفظ السعر الجديد"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Availability Toggle: Stop displaying while retaining in inventory */}
                        <td className="py-3">
                          <button
                            onClick={() => toggleProductAvailability(p.id)}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                              p.is_available
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                            title={p.is_available ? 'انقر لإيقاف عرض الباقة بالمتجر' : 'انقر لإعادة تفعيل العرض'}
                          >
                            {p.is_available ? (
                              <>
                                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{isAr ? 'معروض بالمتجر' : 'Displayed'}</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                                <span>{isAr ? 'مخفي بالمخزون' : 'Hidden in Inventory'}</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Action buttons: Edit, Delete */}
                        <td className="py-3 pl-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setIsProductModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                              title={isAr ? 'تعديل الباقة' : 'Edit'}
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* Package deletion function */}
                            <button
                              onClick={() => {
                                if (confirm(isAr ? `هل أنت متأكد من حذف باقة "${p.title_ar}" نهائياً؟` : 'Delete bouquet permanently?')) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                              title={isAr ? 'حذف نهائي' : 'Delete'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: CATEGORIES & LAYOUT (Dedicated tab, name, description, computer cover image upload, hide/delete, arrange home sections) ================= */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  {isAr ? 'إدارة التصنيفات وترتيب أقسام المتجر' : 'Categories & Homepage Layout'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAr
                    ? 'التحكم بالتصنيفات، صور الغلاف من جهازك، تحديد التصنيفات الظاهرة بالرئيسية، وإخفاء التصنيف (يخفي منتجاته تلقائياً)'
                    : 'Manage categories, upload cover photos, toggle homepage appearance, and shareable links'}
                </p>
              </div>

              <button
                onClick={() => {
                  const newId = `cat-${Date.now().toString(36)}`;
                  setEditingCategory({
                    id: newId,
                    name_ar: '',
                    name_en: '',
                    slug: `category-${Date.now().toString(36)}`,
                    description_ar: '',
                    description_en: '',
                    icon: 'Sparkles',
                    image: '',
                    show_on_home: true,
                    sort_order: categories.length + 1,
                    is_archived: false,
                    created_at: new Date().toISOString(),
                  });
                  setIsCategoryModalOpen(true);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-rose-200 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إضافة تصنيف جديد' : 'New Category'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const count = products.filter((p) => p.category_id === cat.id && !p.is_archived).length;
                const categoryUrl = `${window.location.origin}/#category/${cat.slug}`;

                return (
                  <div
                    key={cat.id}
                    className={`p-5 rounded-2xl border transition-all space-y-4 ${
                      cat.is_archived
                        ? 'border-slate-200 bg-slate-100/70 opacity-75'
                        : 'border-slate-200 bg-white hover:border-rose-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name_ar}
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg shrink-0 border border-rose-100">
                          <FolderTree className="w-7 h-7" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-900 truncate">
                            {isAr ? cat.name_ar : cat.name_en}
                          </h4>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                            {count} {isAr ? 'منتجات' : 'items'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {isAr ? (cat.description_ar || 'لا يوجد وصف مضاف') : (cat.description_en || 'No description')}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] text-slate-400 font-mono">#{cat.slug}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(categoryUrl);
                              addToast('success', 'تم نسخ رابط التصنيف الفريد');
                            }}
                            className="text-[10px] text-rose-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{isAr ? 'نسخ الرابط' : 'Copy Link'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Controls: Show on Home screen toggle, Hide category toggle, Edit, Delete */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        {/* Homepage Section Toggle */}
                        <button
                          onClick={() => toggleCategoryHome(cat.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            cat.show_on_home
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          title="تحديد هل يظهر هذا القسم في واجهة الصفحة الرئيسية"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>{cat.show_on_home ? (isAr ? 'يظهر بالرئيسية' : 'On Home') : (isAr ? 'مخفي من الرئيسية' : 'Hidden from Home')}</span>
                        </button>

                        {/* Hide Category (automatically hides all its products!) */}
                        <button
                          onClick={() => toggleCategoryArchived(cat.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            cat.is_archived
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                          title="إخفاء التصنيف يخفي تلقائياً كافة المنتجات التابعة له"
                        >
                          {cat.is_archived ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{cat.is_archived ? (isAr ? 'مخفي تماماً' : 'Archived') : (isAr ? 'نشط ومعروض' : 'Active')}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setIsCategoryModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(isAr ? `حذف تصنيف "${cat.name_ar}" نهائياً؟` : 'Delete category?')) {
                              deleteCategory(cat.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: HERO SLIDER (Edit image, text, computer image upload stored in DB) ================= */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  {isAr ? 'سلايدر العرض في الصفحة الرئيسية (Hero Slider)' : 'Hero Slider Management'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAr ? 'إضافة وتعديل شرائح السلايدر، رفع صور من جهازك وتخزينها، وتعديل النصوص والأزرار' : 'Manage slides and background images'}
                </p>
              </div>

              <button
                onClick={() => {
                  const newId = `slide-${Date.now().toString(36)}`;
                  setEditingSlide({
                    id: newId,
                    title_ar: '',
                    title_en: '',
                    subtitle_ar: '',
                    subtitle_en: '',
                    badge_ar: 'عرض مميز',
                    badge_en: 'Special Feature',
                    image: '',
                    cta_text_ar: 'تصفح الباقات',
                    cta_text_en: 'Explore Bouquets',
                    cta_link: '#catalog',
                    sort_order: heroSlides.length + 1,
                    is_active: true,
                  });
                  setIsSlideModalOpen(true);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-rose-200 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إضافة شريحة جديدة' : 'Add Slide'}</span>
              </button>
            </div>

            <div className="space-y-4">
              {heroSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-stone-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={slide.image || ''}
                      alt={slide.title_ar}
                      className="w-24 h-16 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                          {isAr ? `شريحة ${idx + 1}` : `Slide ${idx + 1}`}
                        </span>
                        {slide.badge_ar && (
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                            {slide.badge_ar}
                          </span>
                        )}
                        <span className={`text-[10px] font-bold ${slide.is_active ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {slide.is_active ? (isAr ? '• نشطة' : '• Active') : (isAr ? '• معطلة' : '• Inactive')}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 mt-1 truncate">
                        {isAr ? slide.title_ar : slide.title_en}
                      </h4>
                      <p className="text-xs text-slate-500 truncate max-w-lg mt-0.5">
                        {isAr ? slide.subtitle_ar : slide.subtitle_en}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <button
                      onClick={() => {
                        saveHeroSlide({ ...slide, is_active: !slide.is_active });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        slide.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {slide.is_active ? (isAr ? 'تعطيل' : 'Disable') : (isAr ? 'تفعيل' : 'Enable')}
                    </button>
                    <button
                      onClick={() => {
                        setEditingSlide(slide);
                        setIsSlideModalOpen(true);
                      }}
                      className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-200 cursor-pointer"
                      title="تعديل"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(isAr ? 'حذف هذه الشريحة؟' : 'Delete slide?')) {
                          deleteHeroSlide(slide.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: CUSTOM FLOWER VARIETIES (Add varieties, computer image upload, color, availability) ================= */}
      {activeTab === 'varieties' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  {isAr ? 'أصناف الزهور المتاحة للطلب وتصميم الباقات' : 'Custom Flower Varieties Studio'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAr
                    ? 'إضافة أصناف وأنواع الورد غير المعروضة بالمتجر لتتيح للزبائن اختيارها وطلبها ضمن مصمم الباقات'
                    : 'Manage flower varieties available for custom bouquet design requests'}
                </p>
              </div>

              <button
                onClick={() => {
                  const newId = `var-${Date.now().toString(36)}`;
                  setEditingVariety({
                    id: newId,
                    name_ar: '',
                    name_en: '',
                    image: '',
                    color_hex: '#dc2626',
                    is_available: true,
                  });
                  setIsVarietyModalOpen(true);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-rose-200 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إضافة نوع ورد جديد' : 'Add Variety'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {flowerVarieties.map((v) => (
                <div
                  key={v.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-stone-50/50 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {v.image ? (
                      <img
                        src={v.image}
                        alt={v.name_ar}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 border border-slate-200"
                        style={{ backgroundColor: v.color_hex || '#f43f5e' }}
                      >
                        <Flower2 className="w-6 h-6" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate">
                        {isAr ? v.name_ar : v.name_en}
                      </h4>
                      <span className={`text-[10px] font-bold ${v.is_available ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {v.is_available ? (isAr ? 'متاح للطلب' : 'Available') : (isAr ? 'غير متوفر مؤقتاً' : 'Unavailable')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleVarietyAvailability(v.id)}
                      className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                        v.is_available ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-200 text-slate-600'
                      }`}
                      title={v.is_available ? 'إيقاف التوفر' : 'تفعيل التوفر'}
                    >
                      {v.is_available ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => {
                        setEditingVariety(v);
                        setIsVarietyModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200 cursor-pointer"
                      title="تعديل"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(isAr ? 'حذف هذا الصنف؟' : 'Delete variety?')) {
                          deleteFlowerVariety(v.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: STOREFRONT CONTENT & LOCATION (Announcement ticker, Story & Location, Google Maps) ================= */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveSiteContent(contentFormData);
            }}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  {isAr ? 'محتوى ونصوص المتجر والموقع الجغرافي' : 'Storefront Content & Location'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAr
                    ? 'شريط الإعلانات المتحرك، نصوص قسم "موقعنا وقصتنا"، وإحداثيات خريطة Google في حماة'
                    : 'Customize ticker announcement, story narrative, and Google Maps physical location'}
                </p>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-200 cursor-pointer"
              >
                {isAr ? 'حفظ كافة النصوص والموقع' : 'Save Changes'}
              </button>
            </div>

            {/* Announcement Ticker Text */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                {isAr ? 'نص شريط الإعلانات العلوي المتحرك (Marquee Ticker):' : 'Top Scrolling Announcement Ticker:'}
              </label>
              <textarea
                value={contentFormData.announcement_ticker}
                onChange={(e) => setContentFormData({ ...contentFormData, announcement_ticker: e.target.value })}
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50 leading-relaxed"
                placeholder="اكتب الإعلان الترويجي الذي سيتحرك أفقياً أعلى الصفحة..."
              />
            </div>

            {/* Story & Location Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>{isAr ? 'قسم موقعنا وقصتنا في حماة (Story & Location)' : 'Our Story & Location in Hama'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'عنوان القسم (عربي):' : 'Section Title (Arabic):'}
                  </label>
                  <input
                    type="text"
                    value={contentFormData.story_title_ar}
                    onChange={(e) => setContentFormData({ ...contentFormData, story_title_ar: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'عنوان القسم (إنجليزي):' : 'Section Title (English):'}
                  </label>
                  <input
                    type="text"
                    value={contentFormData.story_title_en}
                    onChange={(e) => setContentFormData({ ...contentFormData, story_title_en: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'نص قصة المتجر والتراث الحموي (عربي):' : 'Story Narrative (Arabic):'}
                </label>
                <textarea
                  value={contentFormData.story_body_ar}
                  onChange={(e) => setContentFormData({ ...contentFormData, story_body_ar: e.target.value })}
                  rows={4}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50 leading-relaxed"
                />
              </div>

              {/* Story image upload from computer */}
              <ImageUploadInput
                value={contentFormData.story_image}
                onChange={(img) => setContentFormData({ ...contentFormData, story_image: img })}
                label={isAr ? 'صورة قسم القصة والمشغل (رفع من الجهاز):' : 'Story & Workshop Photo:'}
              />
            </div>

            {/* Physical Location & Google Maps */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'الموقع الجغرافي الفعلي وربط خرائط Google' : 'Physical Location & Google Maps'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'العنوان التفصيلي في حماة (عربي):' : 'Address in Hama (Arabic):'}
                  </label>
                  <input
                    type="text"
                    value={contentFormData.location_address_ar}
                    onChange={(e) => setContentFormData({ ...contentFormData, location_address_ar: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'العنوان التفصيلي في حماة (إنجليزي):' : 'Address in Hama (English):'}
                  </label>
                  <input
                    type="text"
                    value={contentFormData.location_address_en}
                    onChange={(e) => setContentFormData({ ...contentFormData, location_address_en: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'خط العرض (Latitude):' : 'Latitude:'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={contentFormData.location_lat}
                    onChange={(e) => setContentFormData({ ...contentFormData, location_lat: parseFloat(e.target.value) || 35.1318 })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAr ? 'خط الطول (Longitude):' : 'Longitude:'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={contentFormData.location_lng}
                    onChange={(e) => setContentFormData({ ...contentFormData, location_lng: parseFloat(e.target.value) || 36.7578 })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-200 cursor-pointer"
              >
                {isAr ? 'حفظ كافة التعديلات' : 'Save All Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= TAB 7: GOOGLE SEARCH CONSOLE & DYNAMIC SITEMAP ================= */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  {isAr ? 'التكامل مع Google Search Console و Google Analytics وخريطة الموقع' : 'Google Search Console, Analytics & Dynamic Sitemap'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAr
                    ? 'إثبات ملكية الموقع لمحركات البحث، تتبع الزيارات عبر Analytics، وتوليد خريطة sitemap.xml محدثة يومياً تلقائياً'
                    : 'Search Engine Indexing, Google Site Verification, and Daily Dynamic Sitemap'}
                </p>
              </div>
            </div>

            {/* Google Site Verification & Analytics inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  {isAr ? 'رمز التحقق من Google Search Console (Verification Meta Tag):' : 'Google Search Console Verification Token:'}
                </label>
                <input
                  type="text"
                  value={contentFormData.google_search_console_code}
                  onChange={(e) => setContentFormData({ ...contentFormData, google_search_console_code: e.target.value })}
                  placeholder="google-site-verification=xxxxxxxxxxxxxx"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50 font-mono"
                />
                <p className="text-[11px] text-slate-400">
                  {isAr ? 'يتم حقن هذا الرمز تلقائياً في وسم head لإثبات الملكية في Search Console.' : 'Automatically injected into head tag for instant verification.'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  {isAr ? 'معرّف Google Analytics (Measurement ID):' : 'Google Analytics ID:'}
                </label>
                <input
                  type="text"
                  value={contentFormData.google_analytics_id}
                  onChange={(e) => setContentFormData({ ...contentFormData, google_analytics_id: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50 font-mono"
                />
                <p className="text-[11px] text-slate-400">
                  {isAr ? 'معرف القياس لتتبع تفاعل المشترين وإحصائيات الزيارات الرسمية من Google.' : 'Measurement ID for Google Analytics 4.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                saveSiteContent(contentFormData);
                addToast('success', 'تم حفظ إعدادات Google Search Console و Analytics');
              }}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              {isAr ? 'تطبيق إعدادات Google SEO' : 'Save Google SEO'}
            </button>

            {/* Dynamic Sitemap Generator */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-rose-600" />
                    <span>{isAr ? 'خريطة الموقع الديناميكية (sitemap.xml)' : 'Dynamic XML Sitemap'}</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isAr
                      ? 'تتحدث يومياً وتتضمن روابط كافة الباقات والتصنيفات الفعالة لضمان أرشفة فورية وسريعة في Google'
                      : 'Auto-generated daily XML containing all active categories and bouquets'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(currentSitemapXml);
                      addToast('success', 'تم نسخ كود sitemap.xml');
                    }}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isAr ? 'نسخ كود XML' : 'Copy XML'}</span>
                  </button>

                  <button
                    onClick={() => {
                      downloadSitemapXml(currentSitemapXml, 'sitemap.xml');
                      addToast('success', 'جاري تحميل ملف sitemap.xml');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تحميل sitemap.xml' : 'Download Sitemap'}</span>
                  </button>
                </div>
              </div>

              {/* Sitemap code preview */}
              <div className="relative rounded-2xl bg-slate-950 p-4 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-60 border border-slate-800" dir="ltr">
                <pre>{currentSitemapXml}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 8: STORE SETTINGS & SUPABASE SYNC ================= */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Store Info & Phone */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  {isAr ? 'بيانات المتجر وخدمة الزبائن' : 'Store Contact & Info'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAr ? 'أرقام الهاتف وواتساب المعتمدة لاستقبال طلبات الزبائن' : 'WhatsApp and phone configuration'}
                </p>
              </div>

              <button
                type="button"
                disabled={isSavingStoreSettings}
                onClick={async () => {
                  setIsSavingStoreSettings(true);
                  await saveSettings(settingsFormData);
                  setIsSavingStoreSettings(false);
                }}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold rounded-xl text-xs shadow-md shadow-emerald-950/20 cursor-pointer flex items-center gap-2 disabled:opacity-50 transition-all border border-emerald-700"
              >
                <Database className={`w-4 h-4 ${isSavingStoreSettings ? 'animate-spin' : ''}`} />
                <span>
                  {isSavingStoreSettings
                    ? (isAr ? 'جاري المزامنة مع قاعدة البيانات...' : 'Syncing with Database...')
                    : (isAr ? 'حفظ ومزامنة المتجر مع قاعدة البيانات' : 'Save & Sync Store to Database')}
                </span>
              </button>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 mb-6">
              <label className="block text-xs font-bold text-emerald-950 mb-2">
                {isAr ? 'شعار المتجر الرسمي (Logo):' : 'Official Store Logo:'}
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-400 bg-[#032013] shrink-0 shadow-md">
                  <img
                    src={settingsFormData.site_logo || '/logo.png'}
                    alt="Logo Preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="flex-1 w-full">
                  <ImageUploadInput
                    label={isAr ? 'تغيير أو رفع شعار جديد للمتجر' : 'Change or upload new store logo'}
                    helperText={isAr ? 'ارفع ملف الشعار مباشرة من جهازك وسيتم اعتماده لكافة أجزاء المتجر' : 'Upload logo image directly'}
                    value={settingsFormData.site_logo || '/logo.png'}
                    onChange={(url) => setSettingsFormData({ ...settingsFormData, site_logo: url })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'اسم المتجر (عربي):' : 'Store Name (Arabic):'}
                </label>
                <input
                  type="text"
                  value={settingsFormData.site_name_ar}
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, site_name_ar: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'رقم واتساب المعتمد لتلقي الطلبات:' : 'WhatsApp Orders Number:'}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={settingsFormData.whatsapp_number}
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, whatsapp_number: e.target.value })}
                  placeholder="+963944556677"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'رقم الهاتف الأساسي للاتصال:' : 'Primary Phone Number:'}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={settingsFormData.phone_primary}
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, phone_primary: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'العنوان في حماة:' : 'Hama Address:'}
                </label>
                <input
                  type="text"
                  value={settingsFormData.address_ar}
                  onChange={(e) => setSettingsFormData({ ...settingsFormData, address_ar: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* Supabase Integration & Schema for Vercel */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <span>{isAr ? 'التكامل مع قاعدة بيانات Supabase واستضافة Vercel' : 'Supabase & Vercel Integration'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAr
                    ? 'جلب وتخزين المنتجات والطلبات حصرياً من قاعدة بيانات Supabase المرتبطة بمشروعك في Vercel'
                    : 'Fetch and store data exclusively from your Supabase PostgreSQL instance in Vercel'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isTestingDb}
                  onClick={async () => {
                    setIsTestingDb(true);
                    const res = await testDatabaseConnection(
                      settingsFormData.supabase_url || import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || '',
                      settingsFormData.supabase_anon_key || import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || ''
                    );
                    setDbTestResult(res);
                    setIsTestingDb(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {isTestingDb ? (isAr ? 'جاري الفحص...' : 'Testing...') : (isAr ? 'فحص الاتصال' : 'Test Connection')}
                </button>

                <button
                  type="button"
                  disabled={isSyncing}
                  onClick={() => syncWithSupabase()}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? (isAr ? 'جاري الجلب...' : 'Syncing...') : (isAr ? 'جلب البيانات حصرياً من Supabase' : 'Fetch Exclusively')}</span>
                </button>
              </div>
            </div>

            {/* Vercel Integration Status Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">
                    {isAr ? 'تكامل Supabase في Vercel مدعوم تلقائياً:' : 'Vercel Supabase integration supported:'}
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    {isAr
                      ? 'يقرأ الموقع تلقائياً متغيرات البيئة من Vercel (SUPABASE_URL و SUPABASE_ANON_KEY أو VITE_SUPABASE_URL) دون الحاجة لإدخالها يدوياً.'
                      : 'Automatically detects env variables injected by Vercel integration.'}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right font-mono text-[11px] font-bold text-emerald-950 bg-white/80 px-3 py-1.5 rounded-xl border border-emerald-300">
                https://webloom-phi.vercel.app
              </div>
            </div>

            {/* Test result message */}
            {dbTestResult && (
              <div
                className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                  dbTestResult.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {dbTestResult.success ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                <span>{dbTestResult.message}</span>
              </div>
            )}

            {/* Database Linking Details - Permanently Locked & Secured */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      {isAr ? 'بيانات الربط مع مشروع Supabase الرسمي (مثبتة ومحمية)' : 'Supabase Official Integration (Permanent & Locked)'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {isAr
                        ? 'تم تعطيل وقفل خيارات التعديل اليدوي في لوحة التحكم لمنع انقطاع الاتصال أو مسح الربط بالخطأ'
                        : 'Linking parameters are locked and read-only to prevent tampering or broken database connection'}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1 self-start sm:self-auto">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? 'مثبت ومحمي برمجياً ✓' : 'Secured & Active ✓'}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Supabase Project URL:</span>
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    disabled
                    readOnly
                    value="https://juiiibnuzbctwfmghevy.supabase.co"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-mono cursor-not-allowed select-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Supabase Anon Public API Key:</span>
                  </label>
                  <input
                    type="password"
                    dir="ltr"
                    disabled
                    readOnly
                    value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1aWlpYm51emJjdHdmbWdoZXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MjQxMjgsImV4cCI6MjEwNjAwMDEyOH0.ezr1RPTfpJM-Ht9BCay_AWBOrk-b7GwDgLHmuHvLVW0"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-mono cursor-not-allowed select-all"
                  />
                </div>
              </div>
            </div>

            {/* Updated SQL Schema Viewer with Copy Button */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  {isAr ? 'مخطط جداول الـ SQL المحدث لقاعدة البيانات (PostgreSQL):' : 'Complete Database Schema (SQL):'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                    setCopiedSql(true);
                    addToast('success', 'تم نسخ كود SQL المحدث لقاعدة بيانات Supabase');
                    setTimeout(() => setCopiedSql(false), 3000);
                  }}
                  className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedSql ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ كود SQL بالكامل' : 'Copy Full SQL')}</span>
                </button>
              </div>

              <div className="relative rounded-2xl bg-slate-950 p-4 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-64 border border-slate-800" dir="ltr">
                <pre>{SUPABASE_SQL_SCHEMA}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT/ADD PRODUCT ================= */}
      {isProductModalOpen && editingProduct && (
        <div
          onClick={() => setIsProductModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border border-slate-100 my-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-serif">
                {isAr ? 'تعديل أو إضافة باقة' : 'Edit Bouquet'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{isAr ? 'اسم الباقة (عربي):' : 'Title (AR):'}</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title_ar}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title_ar: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-hidden bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isAr ? 'اسم الباقة (إنجليزي):' : 'Title (EN):'}</label>
                <input
                  type="text"
                  value={editingProduct.title_en}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title_en: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-hidden bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isAr ? 'السعر بالليرة (SYP):' : 'Price (SYP):'}</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-hidden bg-slate-50 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isAr ? 'التصنيف:' : 'Category:'}</label>
                  <select
                    value={editingProduct.category_id}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-hidden bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {isAr ? c.name_ar : c.name_en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Multi-Image Computer Upload for Bouquet */}
              <MultiImageUploadInput
                images={editingProduct.images || []}
                onChange={(imgs) => setEditingProduct({ ...editingProduct, images: imgs })}
                label={isAr ? 'صور الباقة (رفع عدة صور من جهاز الكمبيوتر):' : 'Bouquet Photos (Upload multiple images):'}
                helperText={isAr ? 'ارفع صورة أو أكثر للباقة. الصورة الأولى ستكون هي الغلاف الرئيسي، ويمكنك إعادة الترتيب أو الحذف.' : 'Upload one or multiple photos from your device.'}
              />

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isAr ? 'الوصف (عربي):' : 'Description (AR):'}</label>
                <textarea
                  value={editingProduct.description_ar}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description_ar: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-hidden bg-slate-50 resize-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_available}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_available: e.target.checked })}
                    className="rounded text-rose-600 w-4 h-4"
                  />
                  <span>{isAr ? 'معروضة ومتاحة بالمتجر' : 'Available in store'}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_featured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                    className="rounded text-rose-600 w-4 h-4"
                  />
                  <span>{isAr ? 'مميزة بالصفحة الأولى' : 'Featured'}</span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  saveProduct(editingProduct);
                  setIsProductModalOpen(false);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isAr ? 'حفظ الباقة' : 'Save Bouquet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT/ADD CATEGORY ================= */}
      {isCategoryModalOpen && editingCategory && (
        <div
          onClick={() => setIsCategoryModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 my-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-serif">
                {isAr ? 'تعديل أو إضافة تصنيف' : 'Category Details'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{isAr ? 'اسم التصنيف (عربي):' : 'Name (AR):'}</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name_ar}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name_ar: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-hidden bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isAr ? 'اسم التصنيف (إنجليزي):' : 'Name (EN):'}</label>
                <input
                  type="text"
                  value={editingCategory.name_en}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name_en: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-hidden bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isAr ? 'وصف التصنيف (عربي):' : 'Description (AR):'}</label>
                <textarea
                  value={editingCategory.description_ar}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description_ar: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-hidden bg-slate-50 resize-none"
                />
              </div>

              {/* Cover Image Upload from computer */}
              <ImageUploadInput
                value={editingCategory.image || ''}
                onChange={(img) => setEditingCategory({ ...editingCategory, image: img })}
                label={isAr ? 'صورة غلاف التصنيف (رفع من الجهاز):' : 'Cover Image (Computer upload):'}
              />

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={editingCategory.show_on_home}
                    onChange={(e) => setEditingCategory({ ...editingCategory, show_on_home: e.target.checked })}
                    className="rounded text-rose-600 w-4 h-4"
                  />
                  <span>{isAr ? 'عرض في الصفحة الرئيسية' : 'Show on homepage sections'}</span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  saveCategory(editingCategory);
                  setIsCategoryModalOpen(false);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isAr ? 'حفظ التصنيف' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT/ADD HERO SLIDE ================= */}
      {isSlideModalOpen && editingSlide && (
        <div
          onClick={() => setIsSlideModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 my-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-serif">
                {isAr ? 'تعديل شريحة السلايدر' : 'Slide Details'}
              </h3>
              <button onClick={() => setIsSlideModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{isAr ? 'عنوان الشريحة (عربي):' : 'Title (AR):'}</label>
                <input
                  type="text"
                  required
                  value={editingSlide.title_ar}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title_ar: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-hidden bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isAr ? 'العنوان الفرعي (عربي):' : 'Subtitle (AR):'}</label>
                <textarea
                  value={editingSlide.subtitle_ar}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtitle_ar: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-hidden bg-slate-50 resize-none"
                />
              </div>

              {/* Image Upload from computer */}
              <ImageUploadInput
                value={editingSlide.image}
                onChange={(img) => setEditingSlide({ ...editingSlide, image: img })}
                label={isAr ? 'صورة الشريحة (رفع من الجهاز وتخزين بقاعدة البيانات):' : 'Slide Background Photo:'}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isAr ? 'نص الشارة (Badge):' : 'Badge text:'}</label>
                  <input
                    type="text"
                    value={editingSlide.badge_ar}
                    onChange={(e) => setEditingSlide({ ...editingSlide, badge_ar: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-hidden bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{isAr ? 'نص الزر:' : 'CTA Button:'}</label>
                  <input
                    type="text"
                    value={editingSlide.cta_text_ar}
                    onChange={(e) => setEditingSlide({ ...editingSlide, cta_text_ar: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-hidden bg-slate-50"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSlideModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  saveHeroSlide(editingSlide);
                  setIsSlideModalOpen(false);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isAr ? 'حفظ الشريحة' : 'Save Slide'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT/ADD FLOWER VARIETY ================= */}
      {isVarietyModalOpen && editingVariety && (
        <div
          onClick={() => setIsVarietyModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 my-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-serif">
                {isAr ? 'صنف زهرة مخصص' : 'Flower Variety'}
              </h3>
              <button onClick={() => setIsVarietyModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{isAr ? 'اسم صنف الورد (عربي):' : 'Variety Name (AR):'}</label>
                <input
                  type="text"
                  required
                  value={editingVariety.name_ar}
                  onChange={(e) => setEditingVariety({ ...editingVariety, name_ar: e.target.value })}
                  placeholder="مثال: جوري أحمر مخملي"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-hidden bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isAr ? 'اسم صنف الورد (إنجليزي):' : 'Variety Name (EN):'}</label>
                <input
                  type="text"
                  value={editingVariety.name_en}
                  onChange={(e) => setEditingVariety({ ...editingVariety, name_en: e.target.value })}
                  placeholder="e.g. Dutch Velvet Red Rose"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-hidden bg-slate-50"
                />
              </div>

              {/* Variety Image Upload from computer */}
              <ImageUploadInput
                value={editingVariety.image || ''}
                onChange={(img) => setEditingVariety({ ...editingVariety, image: img })}
                label={isAr ? 'صورة نوع الورد (رفع من الجهاز):' : 'Flower Photo:'}
              />

              <div>
                <label className="block font-bold text-slate-700 mb-1">{isAr ? 'لون الزهرة الدلالي (HEX):' : 'Color HEX:'}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editingVariety.color_hex || '#dc2626'}
                    onChange={(e) => setEditingVariety({ ...editingVariety, color_hex: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={editingVariety.color_hex || '#dc2626'}
                    onChange={(e) => setEditingVariety({ ...editingVariety, color_hex: e.target.value })}
                    className="w-28 p-2.5 rounded-xl border border-slate-200 outline-hidden font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsVarietyModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  saveFlowerVariety(editingVariety);
                  setIsVarietyModalOpen(false);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isAr ? 'حفظ الصنف' : 'Save Variety'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
