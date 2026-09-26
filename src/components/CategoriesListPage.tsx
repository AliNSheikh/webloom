import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { FolderTree, Sparkles, ArrowRight, ArrowLeft, Copy, ExternalLink, Flower2, ShoppingBag } from 'lucide-react';

export const CategoriesListPage: React.FC = () => {
  const { categories, products, language, navigateTo, navigateToCategory, addToast } = useStore();
  const isAr = language === 'ar';
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter only active categories (hiding a category hides it from this page and hides all its products)
  const activeCategories = categories
    .filter((cat) => !cat.is_archived)
    .sort((a, b) => a.sort_order - b.sort_order);

  const handleCopyLink = (catSlug: string, catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/#category/${catSlug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(catId);
      addToast(
        'success',
        isAr ? 'تم نسخ رابط هذا القسم لمشاركته' : 'Category link copied to clipboard!'
      );
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-8">
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
          <span className="text-slate-800 font-bold">{isAr ? 'أقسام المتجر' : 'Categories'}</span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 text-white p-8 sm:p-12 shadow-xl border border-rose-900/40">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-400/30">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>{isAr ? 'دليل تصنيفات زهور حماة' : 'Floral Categories Guide'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight">
            {isAr ? 'أقسام وتصنيفات المتجر' : 'Store Collections & Categories'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isAr
              ? 'تصفح تشكيلاتنا المتنوعة من باقات الورد الجاهزة، التنسيقات الفنية الملكية، الزهور الطبيعية المقطوفة بالحبة، والهدايا الفاخرة المرافقة.'
              : 'Explore our curated collections of hand-tied bouquets, artistic floral arrangements, fresh single stems, and premium gift add-ons.'}
          </p>
        </div>

        <div className="absolute left-8 bottom-0 translate-y-1/4 opacity-10 pointer-events-none hidden lg:block">
          <FolderTree className="w-80 h-80 text-rose-300" />
        </div>
      </div>

      {/* Categories Grid */}
      {activeCategories.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200">
          <FolderTree className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 text-lg">
            {isAr ? 'لا توجد تصنيفات معروضة حالياً' : 'No active categories'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isAr ? 'يرجى مراجعة لوحة التحكم لتفعيل وتعيين التصنيفات' : 'Please check admin dashboard to activate categories.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {activeCategories.map((cat) => {
            const catProducts = products.filter(
              (p) => !p.is_archived && p.is_available && p.category_id === cat.id
            );
            const categoryUrl = `${window.location.origin}/#category/${cat.slug}`;

            return (
              <div
                key={cat.id}
                onClick={() => navigateToCategory(cat.slug)}
                className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden hover:border-rose-400 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Cover Image */}
                <div className="relative aspect-16/9 w-full bg-stone-100 overflow-hidden">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={isAr ? cat.name_ar : cat.name_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-rose-50 text-rose-300">
                      <Flower2 className="w-16 h-16" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                  {/* Header Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-slate-900 rounded-full text-xs font-bold shadow-sm">
                      {catProducts.length} {isAr ? 'باقات وتنسيقات' : 'arrangements'}
                    </span>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-4 right-4 left-4 text-white">
                    <h3 className="text-xl sm:text-2xl font-extrabold font-serif drop-shadow-sm">
                      {isAr ? cat.name_ar : cat.name_en}
                    </h3>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {isAr
                      ? cat.description_ar || 'أرقى تشكيلات الزهور والتنسيقات المصممة بعناية فائقة لتناسب كافة مناسباتكم السعيدة.'
                      : cat.description_en || 'Artisanal flower arrangements curated for every joyful celebration in Hama.'}
                  </p>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToCategory(cat.slug);
                      }}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-rose-600 group-hover:text-rose-700 group-hover:underline cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isAr ? 'تصفح باقات ومعروضات القسم' : 'Browse Bouquet Collection'}</span>
                      {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={(e) => handleCopyLink(cat.slug, cat.id, e)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title={isAr ? 'نسخ رابط القسم الفريد للمشاركة' : 'Copy shareable category link'}
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedId === cat.id ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'مشاركة القسم' : 'Share')}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
