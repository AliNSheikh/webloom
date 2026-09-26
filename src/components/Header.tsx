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
  ShieldCheck,
  Flower2,
  FolderTree,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-rose-100/70 shadow-xs">
      {/* Top Announcement Bar - Continuous Horizontal Scrolling Marquee */}
      {settings.announcement_enabled && announcement && !isBannerDismissed && (
        <div className="relative bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-rose-100 text-xs py-2 px-3 overflow-hidden border-b border-rose-800/40 select-none">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex-1 overflow-hidden relative mr-2 ml-2" dir="ltr">
              <div className="animate-ticker hover:[animation-play-state:paused] flex items-center">
                {/* Clone 1 */}
                <div className="inline-flex items-center gap-8 px-6 text-xs font-medium tracking-wide" dir="rtl">
                  <span className="inline-flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    {announcement}
                  </span>
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{announcement}</span>
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{announcement}</span>
                </div>
                {/* Clone 2 for seamless loop */}
                <div className="inline-flex items-center gap-8 px-6 text-xs font-medium tracking-wide" dir="rtl" aria-hidden="true">
                  <span className="inline-flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    {announcement}
                  </span>
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{announcement}</span>
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{announcement}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsBannerDismissed(true)}
              className="text-rose-300 hover:text-white p-1 rounded-md transition-colors shrink-0 cursor-pointer"
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
              className="md:hidden p-2 text-slate-700 hover:text-rose-600 rounded-lg cursor-pointer"
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
              className="group flex items-center gap-2.5 text-slate-900 hover:text-rose-600 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-serif leading-none">
                  {isAr ? 'زهور حماة' : 'Hama Flowers'}
                </span>
                <span className="text-[10px] text-rose-600 font-medium tracking-wider uppercase mt-1">
                  {isAr ? 'بوتيك الزهور والتنسيقات الفنية' : 'Artisanal Florist Boutique'}
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-700">
            <button
              onClick={() => navigateTo('home')}
              className={`hover:text-rose-600 transition-colors cursor-pointer ${
                currentView === 'home' ? 'text-rose-600 font-bold' : ''
              }`}
            >
              {isAr ? 'الرئيسية' : 'Home'}
            </button>

            {/* Dedicated Categories Tab */}
            <button
              onClick={() => navigateTo('categories')}
              className={`hover:text-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'categories' ? 'text-rose-600 font-bold' : ''
              }`}
            >
              <FolderTree className="w-4 h-4 text-rose-500" />
              <span>{isAr ? 'الأقسام' : 'Categories'}</span>
            </button>

            <button
              onClick={() => {
                navigateTo('home');
                setTimeout(() => {
                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hover:text-rose-600 transition-colors cursor-pointer"
            >
              {isAr ? 'تشكيلة الباقات' : 'Bouquet Catalog'}
            </button>

            <button
              onClick={() => setIsCustomBouquetModalOpen(true)}
              className="hover:text-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer text-rose-700 font-bold"
            >
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>{isAr ? 'صمّم باقتك' : 'Custom Bouquet'}</span>
            </button>

            <button
              onClick={() => navigateTo('location')}
              className="hover:text-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? 'موقعنا وقصتنا' : 'Our Story & Location'}</span>
            </button>

            <button
              onClick={() => navigateTo('admin')}
              className="hover:text-slate-900 text-slate-400 text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAr ? 'لوحة الإدارة' : 'Admin'}</span>
            </button>
          </nav>

          {/* Zone 3: Actions (Search, Wishlist, Cart, Language) - Strictly SYP, No USD */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50/60 transition-colors cursor-pointer"
              aria-label="بحث في المتجر"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Custom Bouquet Button (Desktop CTA) */}
            <button
              onClick={() => setIsCustomBouquetModalOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all border border-rose-200 cursor-pointer"
            >
              <Flower2 className="w-4 h-4 text-rose-600" />
              <span>{isAr ? 'تصميم باقة مخصصة' : 'Custom Request'}</span>
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={() => {
                if (wishlist.length === 0) {
                  navigateTo('home');
                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setIsSearchModalOpen(true);
                }
              }}
              className="relative p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50/60 transition-colors cursor-pointer"
              aria-label="المفضلة"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-xl text-slate-700 hover:text-rose-600 hover:bg-rose-50/60 transition-colors cursor-pointer"
              aria-label="سلة التسوق"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartTotalCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(isAr ? 'en' : 'ar')}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-rose-300 text-xs font-bold text-slate-700 hover:text-rose-600 transition-colors cursor-pointer"
            >
              {isAr ? 'English' : 'عربي'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-rose-100 bg-white/98 px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => {
              navigateTo('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-right py-2 text-sm font-bold text-slate-800 border-b border-slate-100 flex items-center justify-between"
          >
            <span>{isAr ? 'الصفحة الرئيسية' : 'Home'}</span>
          </button>

          <button
            onClick={() => {
              navigateTo('categories');
              setMobileMenuOpen(false);
            }}
            className="w-full text-right py-2 text-sm font-bold text-rose-700 border-b border-slate-100 flex items-center justify-between"
          >
            <span>{isAr ? 'أقسام وتصنيفات المتجر' : 'Categories'}</span>
            <FolderTree className="w-4 h-4 text-rose-600" />
          </button>

          <button
            onClick={() => {
              navigateTo('home');
              setMobileMenuOpen(false);
              setTimeout(() => {
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="w-full text-right py-2 text-sm font-bold text-slate-800 border-b border-slate-100 flex items-center justify-between"
          >
            <span>{isAr ? 'تشكيلة باقات الزهور' : 'Floral Catalog'}</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsCustomBouquetModalOpen(true);
            }}
            className="w-full text-right py-2 text-sm font-bold text-rose-600 border-b border-slate-100 flex items-center justify-between"
          >
            <span>{isAr ? 'تصميم باقة مخصصة بلمستك' : 'Custom Bouquet Request'}</span>
            <Sparkles className="w-4 h-4 text-rose-500" />
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigateTo('location');
            }}
            className="w-full text-right py-2 text-sm font-bold text-slate-800 border-b border-slate-100 flex items-center justify-between"
          >
            <span>{isAr ? 'موقعنا في حماة وقصتنا' : 'Our Story & Location'}</span>
            <MapPin className="w-4 h-4 text-emerald-600" />
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigateTo('admin');
            }}
            className="w-full text-right py-2 text-xs font-semibold text-slate-500 flex items-center justify-between pt-2"
          >
            <span>{isAr ? 'لوحة تحكم المسؤول (Admin)' : 'Admin Dashboard'}</span>
            <ShieldCheck className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      )}
    </header>
  );
};
