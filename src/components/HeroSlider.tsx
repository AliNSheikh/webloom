import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowLeft, ArrowRight, MessageCircle, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { language, setIsCustomBouquetModalOpen, settings, heroSlides } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);
  const isAr = language === 'ar';

  const activeSlides = heroSlides.filter((s) => s.is_active);
  const slides = activeSlides.length > 0 ? activeSlides : heroSlides;

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const currentSlide = slides[activeSlide % slides.length];

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleCtaClick = () => {
    if (currentSlide.cta_link === 'custom-bouquet') {
      setIsCustomBouquetModalOpen(true);
    } else if (currentSlide.cta_link === '#catalog' || !currentSlide.cta_link) {
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
    } else if (currentSlide.cta_link.startsWith('http') || currentSlide.cta_link.includes('wa.me')) {
      window.open(currentSlide.cta_link, '_blank');
    } else if (currentSlide.cta_link.startsWith('#')) {
      const el = document.querySelector(currentSlide.cta_link);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-900 text-white min-h-[460px] md:min-h-[520px] flex items-center">
      {/* Background Image with Fallback Container & Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          key={currentSlide.id}
          src={currentSlide.image}
          alt={isAr ? currentSlide.title_ar : currentSlide.title_en}
          className="w-full h-full object-cover object-center transform scale-102 transition-transform duration-1000 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1600&q=85';
          }}
        />
        {/* Anti-AI Slop Scrim: 3-Stop Gradient Overlay to guarantee high text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-emerald-950/50"></div>
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-slate-950/40 to-slate-950/80"></div>
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          {(currentSlide.badge_ar || currentSlide.badge_en) && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-amber-300 text-xs font-semibold mb-4 animate-fade-in shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? currentSlide.badge_ar : currentSlide.badge_en}</span>
            </div>
          )}

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-serif leading-tight sm:leading-tight mb-4 drop-shadow-sm">
            {isAr ? currentSlide.title_ar : currentSlide.title_en}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-8 max-w-xl font-normal drop-shadow-xs">
            {isAr ? currentSlide.subtitle_ar : currentSlide.subtitle_en}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCtaClick}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl text-sm font-black shadow-lg shadow-amber-950/30 hover:shadow-xl hover:scale-102 active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{isAr ? (currentSlide.cta_text_ar || 'تصفح الباقات') : (currentSlide.cta_text_en || 'Explore Bouquets')}</span>
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsCustomBouquetModalOpen(true)}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-amber-400/30 text-amber-200 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer hover:border-amber-400/50"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'صمّم باقتك بلمستك' : 'Custom Bouquet'}</span>
            </button>
          </div>

          {/* Trust Value Props Ribbon */}
          <div className="mt-10 pt-6 border-t border-white/15 grid grid-cols-3 gap-4 text-[11px] sm:text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{isAr ? 'توصيل خلال ساعات بحماة' : 'Same-day Hama delivery'}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isAr ? 'زهور طبيعية قطف يومي' : 'Daily fresh cut stems'}</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{isAr ? 'تنسيق يدوي وإهداء فاخر' : 'Artisanal gift wrapping'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-6 sm:left-12 z-20 flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm border border-white/20 transition-all cursor-pointer"
            aria-label="Previous Slide"
          >
            <ArrowRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
          </button>
          <div className="flex items-center gap-1.5 px-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === activeSlide ? 'w-6 bg-rose-500' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm border border-white/20 transition-all cursor-pointer"
            aria-label="Next Slide"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
};
