import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Flower2, Heart, Award, MapPin, Navigation, Phone, Clock, ExternalLink } from 'lucide-react';

export const StorySection: React.FC = () => {
  const { language, setIsCustomBouquetModalOpen, siteContent, settings } = useStore();
  const isAr = language === 'ar';

  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDHoP4hGyAlrJGk-xBEV5H8gZGluR_GikA';
  const lat = siteContent.location_lat || 35.1318;
  const lng = siteContent.location_lng || 36.7578;
  const address = isAr ? siteContent.location_address_ar : siteContent.location_address_en;

  const mapEmbedUrl = mapsApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${lat},${lng}&zoom=15&language=${language}`
    : `https://maps.google.com/maps?q=${lat},${lng}&hl=${language}&z=15&output=embed`;

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <section id="location-section" className="py-20 bg-stone-100/70 border-y border-stone-200/80 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Story Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>{isAr ? 'عراقة حموية وأناقة عالمية' : 'Hama Heritage & Floral Elegance'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight font-serif text-balance">
              {isAr ? siteContent.story_title_ar : siteContent.story_title_en}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isAr ? siteContent.story_body_ar : siteContent.story_body_en}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
                  <Flower2 className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  {isAr ? 'قطاف يومي نخب أول' : 'Daily Prime Harvest'}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isAr ? 'ورود طبيعية منتقاة بعناية لتدوم نضرة لأكثر من 7 أيام.' : 'Handpicked daily for exceptional vase longevity.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  {isAr ? 'خط عربي يدوي مجاناً' : 'Handwritten Calligraphy'}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isAr ? 'تدوين رسائل الإهداء بخط الرقعة والديواني مع كل باقة.' : 'Custom Arabic calligraphy cards accompanying every order.'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsCustomBouquetModalOpen(true)}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-rose-200" />
                <span>{isAr ? 'صمم باقة مخصصة لمناسبتك القادمة' : 'Design Your Custom Bouquet'}</span>
              </button>

              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-300 rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2"
              >
                <Navigation className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'الاتجاهات عبر خرائط Google' : 'Directions on Google Maps'}</span>
              </a>
            </div>
          </div>

          {/* Right Visual Collage */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-md aspect-3/4 bg-stone-200">
                  <img
                    src={siteContent.story_image || "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80"}
                    alt="Floral Workshop"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-xs">
                  <div className="font-extrabold text-2xl text-rose-600 tabular-nums mb-1 font-serif">
                    100%
                  </div>
                  <div className="font-bold text-slate-800 mb-0.5">
                    {isAr ? 'ضمان نضارة الأزهار' : 'Freshness Guarantee'}
                  </div>
                  <div className="text-slate-500">
                    {isAr ? 'عناية وترطيب فوري حتى باب المستلم في حماة' : 'Immediate hydration until delivery'}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 text-white shadow-md text-xs">
                  <Heart className="w-5 h-5 text-rose-200 mb-2" />
                  <div className="font-extrabold text-xl mb-1">
                    {isAr ? '+12,000 ابتسامة' : '+12,000 Smiles'}
                  </div>
                  <div className="text-rose-100">
                    {isAr ? 'شاركنا أهالي حماة أفراحهم ومناسباتهم الغالية' : 'Proudly serving Hama with floral joy'}
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden shadow-md aspect-4/3 bg-stone-200">
                  <img
                    src="https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80"
                    alt="Hama Blossoms"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Physical Store Location & Interactive Google Map */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'الموقع الفعلي للمتجر والمعرض' : 'Physical Store & Showroom'}</span>
              </div>
              <h3 className="text-2xl font-bold font-serif text-slate-900">
                {isAr ? 'زيارة بوتيك زهور حماة' : 'Visit Our Boutique in Hama'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {address}
              </p>
            </div>

            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{isAr ? 'فتح في خرائط Google والتوجيه' : 'Open in Google Maps'}</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Store Information Cards */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">
                    {isAr ? 'العنوان في حماة' : 'Address in Hama'}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {address}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">
                    {isAr ? 'أوقات العمل واستقبال الزبائن' : 'Opening Hours'}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isAr ? 'يومياً من 9:00 صباحاً حتى 11:30 مساءً (طيلة أيام الأسبوع بما فيها العطل والأعياد)' : 'Open Daily: 9:00 AM - 11:30 PM'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">
                    {isAr ? 'الاتصال المباشر والطلب' : 'Direct Call & Order'}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 font-mono" dir="ltr">
                  {settings.phone_primary} / {settings.whatsapp_number}
                </p>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative min-h-[320px] bg-slate-100">
              <iframe
                title="Google Maps Location - Hama Flowers Boutique"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                className="w-full h-full min-h-[320px] border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
