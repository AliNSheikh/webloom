import React from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, MessageCircle, Clock, Heart } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const { language, settings, navigateTo, setIsCustomBouquetModalOpen } = useStore();
  const isAr = language === 'ar';

  const cleanPhone = settings.whatsapp_number.replace(/[^\d+]/g, '').replace('+', '');

  return (
    <footer id="contact" className="bg-[#031d12] text-slate-300 pt-16 pb-12 border-t border-emerald-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-emerald-900/50">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Logo size="md" inverted />
            </div>
            <p className="text-xs text-emerald-100/70 leading-relaxed">
              {isAr
                ? 'بوتيك وي بلووم (Webloom) للباقات الفاخرة والتنسيقات الفنية الاستثنائية. نبتكر من أرقّ الزهور الطبيعية حكايات فنية مفعمة بالجمال والمشاعر الراقية.'
                : 'Webloom Luxury Floral Boutique. Exquisite artisanal hand-tied bouquets and bespoke floral arrangements crafted with sheer elegance.'}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-emerald-900/90 text-amber-300 hover:bg-emerald-800 transition-colors flex items-center gap-2 text-xs font-semibold border border-emerald-700/60 shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>واتساب مباشر لخدمة العملاء</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-amber-300 text-sm font-serif">
              {isAr ? 'أقسام وروابط سريعة' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {isAr ? 'الرئيسية وتشكيلة اليوم' : 'Home Catalog'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('categories')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {isAr ? 'أقسام وتصنيفات المتجر' : 'Categories Directory'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsCustomBouquetModalOpen(true)}
                  className="hover:text-amber-300 transition-colors text-amber-200 font-medium cursor-pointer"
                >
                  {isAr ? '✨ صمم باقتك بلمستك الخاصة' : '✨ Custom Bouquet'}
                </button>
              </li>
              <li>
                <a
                  href="#catalog"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('home');
                    setTimeout(() => {
                      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {isAr ? 'باقات المناسبات والأعراس الفاخرة' : 'Weddings & Occasions'}
                </a>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('location')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {isAr ? 'قصة وهوية وي بلووم' : 'Our Brand Story'}
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Hours */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-amber-300 text-sm font-serif">
              {isAr ? 'معلومات التواصل وساعات العمل' : 'Contact & Hours'}
            </h4>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {isAr ? settings.address_ar : settings.address_en}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-emerald-200" dir="ltr">{settings.phone_primary}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isAr ? 'خدمة الطلبات يومياً: 9:00 صباحاً - 11:00 ليلاً' : 'Daily: 9:00 AM - 11:00 PM'}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Care Policy */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-amber-300 text-sm font-serif">
              {isAr ? 'خدمة التوصيل والعناية' : 'Luxury Care & Delivery'}
            </h4>
            <p className="text-slate-400 leading-relaxed">
              {isAr
                ? 'تجهيز فاخر وتغليف راقٍ مع سيارات مجهزة لحفظ نضارة البتلات طازجة وعبقة حتى لحظة التسليم لأيدي من تحبون.'
                : 'Climate-controlled delivery and artisanal wrapping to preserve the supreme freshness of each bloom.'}
            </p>
            <div className="pt-2 text-amber-400 text-xs font-semibold flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{isAr ? 'صُنعت بشغف وإتقان من وي بلووم' : 'Crafted with Passion by Webloom'}</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {isAr ? 'متجر وي بلووم (Webloom) - جميع الحقوق محفوظة' : 'Webloom Boutique. All rights reserved.'}
          </div>

          <div className="flex items-center gap-4 text-emerald-400/80 text-[11px]">
            <span>{isAr ? 'الطلب حصراً عبر واتساب مع تأكيد التوصيل' : 'WhatsApp Checkout Enabled'}</span>
            <span className="text-emerald-900">•</span>
            <span>https://webloom-phi.vercel.app</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
