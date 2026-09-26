import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Crown, Flower2, Gift, LayoutGrid } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-4 h-4" />,
  Crown: <Crown className="w-4 h-4" />,
  Flower2: <Flower2 className="w-4 h-4" />,
  Gift: <Gift className="w-4 h-4" />,
};

export const CategoriesFilter: React.FC = () => {
  const { categories, selectedCategoryId, setSelectedCategoryId, language, products } = useStore();
  const isAr = language === 'ar';

  const activeCategories = categories.filter((c) => !c.is_archived);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {/* All Products Tab */}
        <button
          onClick={() => setSelectedCategoryId('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
            selectedCategoryId === 'all'
              ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
              : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-rose-50/50 border border-slate-200/80'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>{isAr ? 'جميع المعروضات' : 'All Catalog'}</span>
          <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${
            selectedCategoryId === 'all' ? 'bg-rose-700/60 text-white' : 'bg-slate-100 text-slate-500'
          }`}>
            {products.filter((p) => !p.is_archived).length}
          </span>
        </button>

        {/* Dynamic Categories */}
        {activeCategories.map((cat) => {
          const count = products.filter((p) => p.category_id === cat.id && !p.is_archived).length;
          const isSelected = selectedCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
                  : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-rose-50/50 border border-slate-200/80'
              }`}
            >
              {CATEGORY_ICONS[cat.icon] || <Flower2 className="w-4 h-4" />}
              <span>{isAr ? cat.name_ar : cat.name_en}</span>
              <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${
                isSelected ? 'bg-rose-700/60 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
