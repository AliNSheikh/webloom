/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { CategoriesFilter } from './components/CategoriesFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CategoryPage } from './components/CategoryPage';
import { CategoriesListPage } from './components/CategoriesListPage';
import { CustomBouquetModal } from './components/CustomBouquetModal';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { AdminDashboard } from './components/AdminDashboard';
import { StorySection } from './components/StorySection';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { Sparkles, MessageCircle, Heart, ArrowUp } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    currentView,
    products,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    language,
    setIsCustomBouquetModalOpen,
    settings,
  } = useStore();

  const isAr = language === 'ar';

  const cleanPhone = settings.whatsapp_number.replace(/[^\d+]/g, '').replace('+', '');

  // Archived categories hide all their products automatically
  const archivedCategoryIds = new Set(categories.filter((c) => c.is_archived).map((c) => c.id));

  const filteredProducts = products.filter((p) => {
    if (p.is_archived || !p.is_available) return false;
    if (archivedCategoryIds.has(p.category_id)) return false;
    if (selectedCategoryId === 'all') return true;
    return p.category_id === selectedCategoryId;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf8f9]">
      <Header />

      <main className="flex-1">
        {currentView === 'admin' ? (
          <AdminDashboard />
        ) : currentView === 'product' ? (
          <ProductDetailPage />
        ) : currentView === 'category' ? (
          <CategoryPage />
        ) : currentView === 'categories' ? (
          <CategoriesListPage />
        ) : (
          /* Home View */
          <>
            <HeroSlider />

            {/* Catalog Section */}
            <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4 text-rose-500" />
                    <span>{isAr ? 'تشكيلة زهور وباقات حماة الفاخرة' : 'Signature Floral Collection'}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif text-balance">
                    {isAr ? 'أحدث الباقات والتنسيقات الفنية الجاهزة' : 'Fresh Hand-Tied Bouquets & Arrangements'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {isAr
                      ? 'اختر باقتك المفضلة واطلبها فوراً عبر واتساب أو السلة مع توصيل سريع في حماة'
                      : 'Choose your bouquet for direct WhatsApp order or instant cart checkout'}
                  </p>
                </div>

                {/* Custom Bouquet Button */}
                <button
                  onClick={() => setIsCustomBouquetModalOpen(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-rose-200 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAr ? 'طلب باقة مخصصة بلمستك' : 'Request Custom Bouquet'}</span>
                </button>
              </div>

              {/* Categories Segmented Filter */}
              <div className="mb-8">
                <CategoriesFilter />
              </div>

              {/* Products Display: Grouped by category when 'all' is selected (respecting show_on_home), or filtered list when a specific category is active */}
              {selectedCategoryId === 'all' ? (
                /* Grouped by categories with limited items per category and "View All" link */
                <div className="space-y-12">
                  {categories
                    .filter((cat) => !cat.is_archived && cat.show_on_home)
                    .map((cat) => {
                      const catProducts = products.filter(
                        (p) => !p.is_archived && p.is_available && p.category_id === cat.id
                      );
                      if (catProducts.length === 0) return null;

                      // Limit display to 4 items on homepage preview
                      const displayLimit = 4;
                      const displayedProducts = catProducts.slice(0, displayLimit);
                      const hasMore = catProducts.length > displayLimit;

                      return (
                        <div key={cat.id} className="space-y-4">
                          {/* Category Header with "View All" button */}
                          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                              <h3 className="font-bold text-lg sm:text-xl text-slate-900 font-serif">
                                {isAr ? cat.name_ar : cat.name_en}
                              </h3>
                              <span className="text-xs text-slate-400 font-semibold px-2 py-0.5 rounded-full bg-slate-100">
                                {catProducts.length}
                              </span>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedCategoryId(cat.id);
                                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <span>{isAr ? 'عرض الكل' : 'View All'}</span>
                              <span className="text-xs font-mono">({catProducts.length})</span>
                            </button>
                          </div>

                          {/* 2 items per row on mobile (grid-cols-2), 3 on desktop */}
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
                            {displayedProducts.map((product) => (
                              <ProductCard key={product.id} product={product} />
                            ))}
                          </div>

                          {/* Secondary View All link if category has more products */}
                          {hasMore && (
                            <div className="pt-2 text-center">
                              <button
                                onClick={() => {
                                  setSelectedCategoryId(cat.id);
                                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                              >
                                <span>{isAr ? `استعراض كافة معروضات ${cat.name_ar}` : `View all in ${cat.name_en}`}</span>
                                <span className="text-[11px] font-mono">({catProducts.length})</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              ) : (
                /* Specific Category View (Full List) */
                <div className="space-y-6">
                  {/* Category Title & Reset */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <h3 className="font-bold text-lg sm:text-xl text-slate-900 font-serif">
                        {isAr
                          ? categories.find((c) => c.id === selectedCategoryId)?.name_ar
                          : categories.find((c) => c.id === selectedCategoryId)?.name_en}
                      </h3>
                      <span className="text-xs text-slate-400 font-semibold px-2 py-0.5 rounded-full bg-slate-100">
                        {filteredProducts.length} {isAr ? 'منتجات' : 'items'}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedCategoryId('all')}
                      className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      {isAr ? 'العودة لجميع التصنيفات' : 'View all categories'}
                    </button>
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="py-16 text-center bg-white rounded-3xl border border-slate-200">
                      <p className="text-slate-500 text-sm font-medium">
                        {isAr ? 'لا توجد منتجات متوفرة في هذا التصنيف حالياً.' : 'No items currently in this category.'}
                      </p>
                    </div>
                  ) : (
                    /* 2 items per row on mobile (grid-cols-2), 3 on desktop */
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
                      {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Exclusive Occasion / Custom Bouquet Banner */}
              <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-rose-900 via-slate-900 to-slate-950 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="relative z-10 max-w-xl">
                  <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4 text-rose-400" />
                    <span>{isAr ? 'خدمة المناسبات الخاصة والأعراس' : 'VIP Events & Weddings'}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-serif mb-2 leading-tight">
                    {isAr ? 'هل تبحث عن تنسيقة فريدة تعبر عنك تماماً؟' : 'Looking for a One-of-a-Kind Floral Masterpiece?'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isAr
                      ? 'فريقنا المتخصص في حماة مستعد لتصميم باقاتك الخاصة، هدايا التخرج، ومناسباتكم السعيدة بلمسات تليق بأذواقكم الرفيعة.'
                      : 'Our florist studio in Hama crafts bespoke wedding florals, graduation bouquets, and executive gift displays.'}
                  </p>
                </div>

                <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsCustomBouquetModalOpen(true)}
                    className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-rose-950/50 hover:scale-102 transition-all cursor-pointer"
                  >
                    {isAr ? 'طلب تصميم باقة مخصصة' : 'Request Custom Bouquet'}
                  </button>

                  <a
                    href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      'مرحباً، أود الاستفسار عن تنسيقات الأفراح والمناسبات الخاصة في حماة 🌸'
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold rounded-xl text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>{isAr ? 'محادثة واتساب' : 'WhatsApp Us'}</span>
                  </a>
                </div>
              </div>
            </section>

            {/* Story & Location Section with Interactive Google Map */}
            <StorySection />
          </>
        )}
      </main>

      <Footer />

      {/* Modals & Overlays */}
      <CustomBouquetModal />
      <CartDrawer />
      <SearchModal />
      <ToastContainer />

      {/* Floating Action Buttons: WhatsApp & Scroll to top */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-center gap-3">
        {/* WhatsApp Direct Float */}
        <a
          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
            'مرحباً بوتيك زهور حماة، أود الاستفسار عن باقات الزهور وتوصيل الطلبات 🌸'
          )}`}
          target="_blank"
          rel="noreferrer"
          className="w-13 h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all group"
          title={isAr ? 'تواصل معنا فوراً عبر واتساب' : 'Chat on WhatsApp'}
          aria-label="واتساب"
        >
          <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </a>

        {/* Scroll to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 shadow-md border border-slate-200/80 flex items-center justify-center transition-all cursor-pointer"
          title={isAr ? 'أعلى الصفحة' : 'Back to top'}
          aria-label="الرجوع للأعلى"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
