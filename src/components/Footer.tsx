import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, MapPin, Phone, MessageCircle, Clock, Heart, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, settings, navigateTo, setIsCustomBouquetModalOpen } = useStore();
  const isAr = language === 'ar';

  const cleanPhone = settings.whatsapp_number.replace(/[^\d+]/g, '').replace('+', '');

  return (
    <footer id="contact" className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-950">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-serif">
                {isAr ? 'زهور حماة' : 'Hama Flowers'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'بوتيك الزهور والتنسيقات الفنية الأرقى في مدينة حماة. ورود طبيعية مقطوفة طازجة، وباقات مصممة بشغف لمناسباتكم السعيدة مع خدمة التوصيل السريع.'
                : 'Artisanal florist boutique in Hama, Syria. Hand-tied bouquets and bespoke floral arrangements crafted with elegance.'}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 hover:bg-emerald-900 transition-colors flex items-center gap-2 text-xs font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب مباشر</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm">
              {isAr ? 'روابط سريعة' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-rose-400 transition-colors"
                >
                  {isAr ? 'الرئيسية وتشكيلة اليوم' : 'Home Catalog'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsCustomBouquetModalOpen(true)}
                  className="hover:text-rose-400 transition-colors text-rose-300 font-medium"
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
                  className="hover:text-rose-400 transition-colors"
                >
                  {isAr ? 'باقات المناسبات والأعراس' : 'Weddings & Occasions'}
                </a>
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
                  className="hover:text-rose-400 transition-colors"
                >
                  {isAr ? 'تنسيقات الفازات والبوكسات الملكية' : 'Ceramic Vases & Hatboxes'}
                </a>
              </li>
            </ul>
          </div>

          {/* Location & Hours in Hama */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm">
              {isAr ? 'عنوان البوتيك وساعات العمل' : 'Location & Hours'}
            </h4>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {isAr ? settings.address_ar : settings.address_en}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="font-mono" dir="ltr">{settings.phone_primary}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isAr ? 'يومياً: من 9:00 صباحاً حتى 11:00 ليلاً' : 'Daily: 9:00 AM - 11:00 PM'}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Care Policy */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm">
              {isAr ? 'خدمة التوصيل داخل حماة' : 'Hama Delivery'}
            </h4>
            <p className="text-slate-400 leading-relaxed">
              {isAr
                ? 'فريق توصيل مجهز بسيارات مكيّفة لحفظ درجات حرارة الزهور ونضارتها. نصل إلى: الحاضر، الدباغة، الشريعة، القصور، طريق حلب، جنوب الملعب، والريف القريب.'
                : 'Climate-controlled delivery keeping petals vibrant across all neighborhoods.'}
            </p>
            <div className="pt-2 text-rose-400 text-xs font-semibold flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>{isAr ? 'صُنعت بحب وشغف في حماة' : 'Crafted with Love in Hama'}</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {isAr ? 'متجر زهور حماة - جميع الحقوق محفوظة' : 'Hama Flowers Boutique. All rights reserved.'}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-600">
              {isAr ? 'دعم الدفع عند الاستلام وسيريتل كاش' : 'COD & Syriatel Cash Accepted'}
            </span>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => navigateTo('admin')}
              className="text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>{isAr ? 'لوحة تحكم الإدارة' : 'Admin Portal'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
