import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    products,
    categories,
    language,
    formatPrice,
    navigateToProduct,
  } = useStore();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isAr = language === 'ar';

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const filteredProducts = products.filter((p) => {
    if (p.is_archived) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      p.title_ar.toLowerCase().includes(q) ||
      p.title_en.toLowerCase().includes(q) ||
      p.description_ar.toLowerCase().includes(q) ||
      p.description_en.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  });

  return (
    <div
      onClick={() => setIsSearchModalOpen(false)}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-rose-100 flex flex-col max-h-[80vh] animate-scale-in"
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-rose-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isAr
                ? 'ابحث باسم الزهرة، الباقة، الجوري، التوليب، الأوركيد...'
                : 'Search by rose, tulip, bouquet name, orchid...'
            }
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-800 outline-hidden placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1"
          >
            {isAr ? 'إلغاء' : 'Esc'}
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          <div className="text-xs text-slate-400 flex items-center justify-between pb-2">
            <span>
              {isAr
                ? `النتائج (${filteredProducts.length} باقة وتنسيقة)`
                : `Results (${filteredProducts.length} products)`}
            </span>
            {query && <span className="text-rose-600 font-medium font-mono">"{query}"</span>}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Sparkles className="w-8 h-8 text-rose-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                {isAr ? 'لم نجد أزهاراً مطابقة لبحثك' : 'No matching flowers found'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isAr
                  ? 'جرب البحث عن "جوري"، "توليب"، "فازة"، أو "تخرج".'
                  : 'Try searching for "rose", "tulip", "vase", or "sunflower".'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredProducts.map((p) => {
                const category = categories.find((c) => c.id === p.category_id);
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setIsSearchModalOpen(false);
                      navigateToProduct(p.slug);
                    }}
                    className="p-3 rounded-2xl border border-slate-200/80 hover:border-rose-300 hover:bg-rose-50/40 transition-all flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                      <img
                        src={p.images[0] || ''}
                        alt={p.title_ar}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-rose-600 font-semibold uppercase tracking-wider block">
                        {isAr ? category?.name_ar : category?.name_en}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-rose-600">
                        {isAr ? p.title_ar : p.title_en}
                      </h4>
                      <div className="text-xs font-bold text-slate-900 mt-1 tabular-nums">
                        {formatPrice(p.price)}
                      </div>
                    </div>
                    <div className="text-slate-300 group-hover:text-rose-600">
                      {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
