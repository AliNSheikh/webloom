import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  Eye,
  Sparkles,
  Check,
  X,
  Share2,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    language,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateToProduct,
    generateWhatsAppProductUrl,
    addToast,
  } = useStore();

  const [imageError, setImageError] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isAr = language === 'ar';
  const isWish = isInWishlist(product.id);
  const primaryImage = product.images[0] || '';
  const secondaryImage = product.images[1] || primaryImage;

  const currentDisplayImage = isHovered && secondaryImage !== primaryImage ? secondaryImage : primaryImage;

  const handleCardClick = (e: React.MouseEvent) => {
    // If clicked on an interactive button, do not navigate
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;
    navigateToProduct(product.slug);
  };

  const handleQuickWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateWhatsAppProductUrl(product, 1);
    window.open(url, '_blank');
  };

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fullUrl = `${window.location.origin}/#product/${product.slug}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      addToast(
        'success',
        isAr ? 'تم نسخ رابط الباقة إلى الحافظة' : 'Product link copied to clipboard'
      );
    });
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
      >
        {/* Image Container (4:3 aspect ratio) */}
        <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
          {!imageError ? (
            <img
              src={currentDisplayImage}
              alt={isAr ? product.title_ar : product.title_en}
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-stone-100 p-3 sm:p-6 text-center">
              <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 text-rose-400 mb-1 sm:mb-2 opacity-60" />
              <span className="text-[11px] sm:text-xs font-semibold text-slate-700 line-clamp-1">
                {isAr ? product.title_ar : product.title_en}
              </span>
            </div>
          )}

          {/* Quick Action Badges */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1 z-10">
            {product.has_discount && product.discount_percent ? (
              <span className="bg-rose-600 text-white text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2.5 py-0.5 rounded shadow-xs">
                {isAr ? `-${product.discount_percent}%` : `-${product.discount_percent}%`}
              </span>
            ) : null}

            {product.is_new && (
              <span className="bg-emerald-600 text-white text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded shadow-xs">
                {isAr ? 'جديد' : 'New'}
              </span>
            )}
          </div>

          {/* Top Left Floating Quick Actions: Wishlist & Zoom */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex items-center gap-1 sm:gap-1.5 z-10">
            <button
              onClick={handleToggleWishlist}
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl backdrop-blur-md transition-colors cursor-pointer ${
                isWish
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white/85 text-slate-700 hover:bg-white hover:text-rose-600'
              }`}
              title={isAr ? 'حفظ في المفضلة' : 'Wishlist'}
              aria-label="المفضلة"
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWish ? 'fill-white text-white' : ''}`} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomOpen(true);
              }}
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/85 text-slate-700 hover:bg-white hover:text-rose-600 backdrop-blur-md transition-colors cursor-pointer"
              title={isAr ? 'معاينة سريعة' : 'Quick zoom'}
              aria-label="معاينة الصورة"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Out of Stock Scrim */}
          {product.stock_quantity <= 0 && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white text-xs sm:text-sm font-bold z-20">
              {isAr ? 'نفدت الكمية' : 'Out of Stock'}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between gap-2 sm:gap-3">
          <div>
            {/* SKU and Stock Indicator */}
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 mb-1">
              <span className="font-mono text-[10px] sm:text-[11px] tracking-wider text-slate-400">
                {product.sku}
              </span>
              <span className="flex items-center gap-1 text-[10px] sm:text-[11px]">
                {product.stock_quantity > 0 ? (
                  <span className="text-emerald-700 flex items-center gap-0.5 sm:gap-1 font-medium">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">{isAr ? 'متوفر' : 'In Stock'}</span>
                  </span>
                ) : (
                  <span className="text-rose-600 font-medium">
                    {isAr ? 'غير متوفر' : 'Unavailable'}
                  </span>
                )}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-slate-900 text-xs sm:text-base leading-snug group-hover:text-rose-600 transition-colors line-clamp-2 sm:line-clamp-1">
              {isAr ? product.title_ar : product.title_en}
            </h3>

            {/* Description Excerpt (shown on larger screens) */}
            <p className="hidden sm:block text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
              {isAr ? product.description_ar : product.description_en}
            </p>
          </div>

          {/* Pricing & Actions */}
          <div className="pt-2 sm:pt-3 border-t border-slate-100 flex flex-col gap-2 sm:gap-3">
            {/* Price display with compare at price */}
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="text-sm sm:text-lg font-bold text-slate-900 tabular-nums">
                  {formatPrice(product.price)}
                </span>
                {product.has_discount && product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="text-[10px] sm:text-xs text-slate-400 line-through tabular-nums">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
              </div>

              <button
                onClick={handleQuickShare}
                className="text-slate-400 hover:text-slate-700 p-0.5 sm:p-1 rounded-lg"
                title={isAr ? 'نسخ الرابط' : 'Copy link'}
              >
                <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              {/* WhatsApp Quick Order */}
              <button
                onClick={handleQuickWhatsApp}
                className="flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-1.5 sm:px-3 bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all border border-emerald-200/80 cursor-pointer"
                title={isAr ? 'طلب فوري ومباشر عبر واتساب' : 'Order via WhatsApp'}
              >
                <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="truncate">{isAr ? 'واتساب' : 'WhatsApp'}</span>
              </button>

              {/* Add to Cart */}
              <button
                onClick={handleQuickAddToCart}
                disabled={product.stock_quantity <= 0}
                className="flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-1.5 sm:px-3 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 text-white rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all shadow-xs shadow-rose-200 cursor-pointer"
              >
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="truncate">{isAr ? 'السلة' : 'Bag'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Image Zoom Modal */}
      {isZoomOpen && (
        <div
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
          >
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 left-4 z-10 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[75vh] overflow-hidden bg-stone-900 flex items-center justify-center">
              <img
                src={primaryImage}
                alt={isAr ? product.title_ar : product.title_en}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 bg-white flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900">
                  {isAr ? product.title_ar : product.title_en}
                </h4>
                <div className="text-sm font-semibold text-rose-600">
                  {formatPrice(product.price)}
                </div>
              </div>
              <button
                onClick={() => {
                  setIsZoomOpen(false);
                  navigateToProduct(product.slug);
                }}
                className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700"
              >
                {isAr ? 'عرض التفاصيل الكاملة' : 'View Full Details'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
