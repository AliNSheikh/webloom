import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ArrowRight, ArrowLeft, Share2, Copy, Check, Sparkles, Flower2 } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const {
    activeCategorySlug,
    categories,
    products,
    language,
    navigateTo,
    addToast,
  } = useStore();

  const isAr = language === 'ar';
  const [isCopied, setIsCopied] = useState(false);

  const category = categories.find((c) => c.slug === activeCategorySlug);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Flower2 className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {isAr ? 'التصنيف غير موجود' : 'Category Not Found'}
        </h2>
        <p className="text-slate-500 mb-6 text-sm">
          {isAr
            ? 'ربما تم تغيير رابط التصنيف أو تم إخفاؤه.'
            : 'The requested category may have been modified or hidden.'}
        </p>
        <button
          onClick={() => navigateTo('home')}
          className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 cursor-pointer"
        >
          {isAr ? 'العودة لمتجر زهور حماة' : 'Return to Catalog'}
        </button>
      </div>
    );
  }

  // Filter products: category must not be archived, product must be active and in stock
  const categoryProducts = products.filter(
    (p) => !p.is_archived && p.is_available && p.category_id === category.id
  );

  const fullCategoryUrl = `${window.location.origin}/#category/${category.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullCategoryUrl).then(() => {
      setIsCopied(true);
      addToast(
        'success',
        isAr ? 'تم نسخ رابط هذا القسم لمشاركته' : 'Category link copied to clipboard!'
      );
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
        <button
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
        >
          {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isAr ? 'العودة إلى المعرض الرئيسي' : 'Back to Storefront'}</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{isAr ? 'الرئيسية' : 'Home'}</span>
          <span>/</span>
          <span className="text-slate-800 font-medium">
            {isAr ? category.name_ar : category.name_en}
          </span>
        </div>
      </div>

      {/* Category Hero / Cover Header */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[220px] sm:min-h-[260px] flex items-center shadow-md">
        {category.image && (
          <img
            src={category.image}
            alt={isAr ? category.name_ar : category.name_en}
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-rose-950/50"></div>

        <div className="relative z-10 p-6 sm:p-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>{isAr ? 'قسم متخصص في زهور حماة' : 'Signature Collection'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif mb-2">
            {isAr ? category.name_ar : category.name_en}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            {isAr ? category.description_ar : category.description_en}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isCopied
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
              }`}
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? (isAr ? 'تم نسخ الرابط!' : 'Copied!') : (isAr ? 'نسخ رابط القسم' : 'Share Category')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid (2 on mobile, 3-4 on desktop) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>{isAr ? `المعروضات المتوفرة (${categoryProducts.length})` : `Available Items (${categoryProducts.length})`}</span>
          <span>{isAr ? 'الأسعار تشمل التغليف الفاخر بالليرة السورية' : 'Prices in Syrian Lira (SYP)'}</span>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500 text-sm font-medium">
              {isAr ? 'لا توجد منتجات متوفرة حالياً في هذا القسم.' : 'No items currently available in this category.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
