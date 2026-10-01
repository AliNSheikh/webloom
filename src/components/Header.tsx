import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  ShoppingBag,
  Heart,
  Sparkles,
  MapPin,
  X,
  Menu,
  Flower2,
  FolderTree,
} from 'lucide-react';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  const {
    language,
    settings,
    siteContent,
    cartTotalCount,
    wishlist,
    navigateTo,
    setIsSearchModalOpen,
    setIsCartDrawerOpen,
    setIsCustomBouquetModalOpen,
    currentView,
  } = useStore();

  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const announcement = language === 'ar'
    ? (siteContent.announcement_ticker || settings.announcement_text_ar)
    : (siteContent.announcement_ticker_en || settings.announcement_text_en);
  const isAr = language === 'ar';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      {/* Top Announcement Bar - Continuous Horizontal Scrolling Marquee in Luxury Emerald & Gold */}
      {settings.announcement_enabled && announcement && !isBannerDismissed && (
        <div className="relative bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-emerald-100 text-xs py-2 px-3 overflow-hidden border-b border-emerald-800/40 select-none">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex-1 overflow-hidden relative mr-2 ml-2" dir="ltr">
              <div className="animate-ticker hover:[animation-play-state:paused] flex items-center">
                {/* Clone 1 */}
                <div className="inline-flex items-center gap-8 px-6 text-xs font-medium tracking-wide" dir="rtl">
                  <span className="inline-flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    {announcement}
                  </span>
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{announcement}</span>
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{announcement}</span>
                </div>
                {/* Clone 2 for seamless loop */}
                <div className="inline-flex items-center gap-8 px-6 text-xs font-medium tracking-wide" dir="rtl" aria-hidden="true">
                  <span className="inline-flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    {announcement}
                  </span>
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{announcement}</span>
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{announcement}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsBannerDismissed(true)}
              className="text-emerald-300 hover:text-white p-1 rounded-md transition-colors shrink-0 cursor-pointer"
              aria-label="إغلاق شريط الإعلانات"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Zone 1: Logo & Store Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-emerald-700 rounded-lg cursor-pointer"
              aria-label="القائمة"
            >
              <Menu className="w-5 h-5" />
            </button>

            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('home');
              }}
              className="group flex items-center cursor-pointer transition-transform"
              aria-label="وي بلووم"
            >
              <Logo size="md" />
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-700">
            <button
              onClick={() => navigateTo('home')}
              className={`hover:text-emerald-800 transition-colors cursor-pointer ${
                currentView === 'home' ? 'text-emerald-900 font-bold' : ''
              }`}
            >
              {isAr ? 'الرئيسية' : 'Home'}
            </button>

            {/* Dedicated Categories Tab */}
            <button
              onClick={() => navigateTo('categories')}
              className={`hover:text-emerald-800 transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'categories' ? 'text-emerald-900 font-bold' : ''
              }`}
            >
              <FolderTree className="w-4 h-4 text-emerald-700" />
              <span>{isAr ? 'الأقسام' : 'Categories'}</span>
            </button>

            <button
              onClick={() => {
                navigateTo('home');
                setTimeout(() => {
                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hover:text-emerald-800 transition-colors cursor-pointer"
            >
              {isAr ? 'تشكيلة الباقات' : 'Bouquet Catalog'}
            </button>

            <button
              onClick={() => setIsCustomBouquetModalOpen(true)}
              className="hover:text-emerald-800 transition-colors flex items-center gap-1.5 cursor-pointer text-emerald-800 font-bold"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{isAr ? 'صمّم باقتك' : 'Custom Bouquet'}</span>
            </button>

            <button
              onClick={() => navigateTo('location')}
              className="hover:text-emerald-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? 'قصة وي بلووم' : 'Our Story & Brand'}</span>
            </button>
          </nav>

          {/* Zone 3: Actions (Search, Wishlist, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/60 transition-colors cursor-pointer"
              aria-label="بحث في المتجر"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Custom Bouquet Button (Desktop CTA) */}
            <button
              onClick={() => setIsCustomBouquetModalOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-amber-300 text-xs font-bold transition-all shadow-sm border border-emerald-800 cursor-pointer"
            >
              <Flower2 className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'تصميم باقة مخصصة' : 'Custom Request'}</span>
            </button>

            {/* Wishlist Link */}
            <button
              onClick={() => {
                navigateTo('home');
                setTimeout(() => {
                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="relative p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50/60 transition-colors cursor-pointer"
              aria-label="المفضلة"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-medium text-xs sm:text-sm shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
              aria-label="سلة المشتريات"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline font-bold">{isAr ? 'السلة' : 'Cart'}</span>
              {cartTotalCount > 0 && (
                <span className="bg-amber-400 text-emerald-950 text-xs font-black px-1.5 py-0.2 rounded-full min-w-4 text-center">
                  {cartTotalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 border-t border-slate-200/80 px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigateTo('home');
            }}
            className="w-full text-right py-2 text-sm font-bold text-slate-800 border-b border-slate-100 flex items-center justify-between"
          >
            <span>{isAr ? 'الرئيسية' : 'Home'}</span>
          </button>

          {/* Mobile Categories Link */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigateTo('categories');
            }}
            className="w-full text-right py-2 text-sm font-bold text-slate-800 border-b border-slate-100 flex items-center justify-between"
          >
            <span>{isAr ? 'أقسام وتصنيفات المتجر' : 'Categories'}</span>
            <FolderTree className="w-4 h-4 text-emerald-700" />
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigateTo('home');
              setTimeout(() => {
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="w-full text-right py-2 text-sm font-bold text-slate-800 border-b border-slate-100 flex items-center justify-between"
          >
            <span>{isAr ? 'تشكيلة الباقات والتنسيقات' : 'Bouquet Catalog'}</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsCustomBouquetModalOpen(true);
            }}
            className="w-full text-right py-2 text-sm font-bold text-emerald-800 border-b border-slate-100 flex items-center justify-between"
          >
            <span>{isAr ? 'تصميم باقة مخصصة بلمستك' : 'Custom Bouquet Request'}</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigateTo('location');
            }}
            className="w-full text-right py-2 text-sm font-bold text-slate-800 flex items-center justify-between"
          >
            <span>{isAr ? 'قصة ورؤية وي بلووم' : 'Our Story & Brand'}</span>
            <MapPin className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      )}
    </header>
  );
};
