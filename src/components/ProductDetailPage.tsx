import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import QRCode from 'qrcode';
import {
  ArrowRight,
  ArrowLeft,
  Heart,
  ShoppingBag,
  MessageCircle,
  Copy,
  Check,
  Share2,
  QrCode as QrIcon,
  ShieldCheck,
  Truck,
  Sparkles,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ProductCard } from './ProductCard';

export const ProductDetailPage: React.FC = () => {
  const {
    activeProduct,
    products,
    language,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
    generateWhatsAppProductUrl,
    addToast,
  } = useStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cardMessage, setCardMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const isAr = language === 'ar';

  const fullProductUrl = activeProduct
    ? `${window.location.origin}/#product/${activeProduct.slug}`
    : '';

  // Generate QR Code for sharing
  useEffect(() => {
    if (fullProductUrl) {
      QRCode.toDataURL(fullProductUrl, {
        width: 250,
        margin: 2,
        color: {
          dark: '#9f1239',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('QR code error', err));
    }
  }, [fullProductUrl]);

  if (!activeProduct) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Sparkles className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {isAr ? 'الباقة أو التنسيقة غير موجودة' : 'Product Not Found'}
        </h2>
        <p className="text-slate-500 mb-6 text-sm">
          {isAr
            ? 'ربما تم نقل المنتج أو تغيير رابطه الخاص.'
            : 'The requested product may have been moved or archived.'}
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

  const isWish = isInWishlist(activeProduct.id);
  const images = activeProduct.images.length > 0 ? activeProduct.images : [''];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullProductUrl).then(() => {
      setIsCopied(true);
      addToast(
        'success',
        isAr ? 'تم نسخ الرابط المباشر للباقة بنجاح' : 'Product link copied to clipboard!',
        isAr ? 'رابط المشاركة 🔗' : 'Link Copied'
      );
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  const handleAddToCart = () => {
    addToCart(activeProduct, quantity, cardMessage);
  };

  const handleWhatsAppOrder = () => {
    let customNote = '';
    if (cardMessage) {
      customNote += `نص الكرت: "${cardMessage}"\n`;
    }
    const url = generateWhatsAppProductUrl(activeProduct, quantity, customNote);
    window.open(url, '_blank');
  };

  const totalItemPrice = activeProduct.price * quantity;

  // 4 Similar Recommended Products
  const similarProducts = products
    .filter((p) => p.id !== activeProduct.id && p.is_available && !p.is_archived)
    .sort((a, b) => {
      // Prioritize same category
      if (a.category_id === activeProduct.category_id && b.category_id !== activeProduct.category_id) return -1;
      if (b.category_id === activeProduct.category_id && a.category_id !== activeProduct.category_id) return 1;
      return 0;
    })
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Back button and breadcrumb */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/80">
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
          <span className="text-slate-800 font-medium truncate max-w-xs">
            {isAr ? activeProduct.title_ar : activeProduct.title_en}
          </span>
        </div>
      </div>

      {/* Share & Copy Bar - Direct link text is HIDDEN, showing ONLY Copy and Share buttons */}
      <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50/50 to-amber-50/40 border border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-rose-900 flex items-center gap-2">
              <span>{isAr ? 'مشاركة هذه الباقة المميزة' : 'Share this Bouquet'}</span>
              <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-semibold">
                {isAr ? 'رابط مباشر جاهز' : 'Direct Link Ready'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isAr ? 'انسخ الرابط أو شاركه مباشرة عبر تطبيقات التواصل مع أصدقائك' : 'Copy link or share directly with friends via messaging apps'}
            </p>
          </div>
        </div>

        {/* Buttons Only: Copy & Share */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleCopyLink}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
              isCopied
                ? 'bg-emerald-600 text-white shadow-emerald-200'
                : 'bg-white text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-300'
            }`}
          >
            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? (isAr ? 'تم نسخ الرابط!' : 'Copied!') : (isAr ? 'نسخ الرابط' : 'Copy Link')}</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>{isAr ? 'مشاركة الباقة' : 'Share Bouquet'}</span>
          </button>

          <button
            onClick={() => setShowQrModal(true)}
            className="p-2.5 bg-white text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-300 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
            title={isAr ? 'رمز QR' : 'QR code'}
          >
            <QrIcon className="w-4 h-4 text-rose-600" />
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery Left / Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Interactive Image Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Large Image */}
          <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-stone-100 border border-slate-200/80 shadow-xs group">
            <img
              src={images[selectedImageIndex] || images[0]}
              alt={isAr ? activeProduct.title_ar : activeProduct.title_en}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {activeProduct.has_discount && activeProduct.discount_percent ? (
              <span className="absolute top-4 right-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm">
                {isAr ? `وفر ${activeProduct.discount_percent}%` : `Save ${activeProduct.discount_percent}%`}
              </span>
            ) : null}

            {/* Gallery Navigation Controls for Multi-Images */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-all cursor-pointer backdrop-blur-xs shadow-md"
                  aria-label="الصورة السابقة"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-all cursor-pointer backdrop-blur-xs shadow-md"
                  aria-label="الصورة التالية"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[11px] font-mono px-2.5 py-1 rounded-full backdrop-blur-xs">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails list */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-rose-600 shadow-md scale-102 ring-2 ring-rose-200'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Flower Specifications & Care Section - Country of Origin HIDDEN, other database details retained */}
          <div className="mt-6 p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>{isAr ? 'مكونات الباقة ومواصفاتها الفنية' : 'Bouquet Ingredients & Specs'}</span>
            </h3>

            {(() => {
              // Hide the flower's country of origin (e.g. Netherlands / بلد المنشأ) while retaining other details from DB
              const cleanSpecs = (activeProduct.specs || []).filter((spec) => {
                const kAr = (spec.key_ar || '').toLowerCase();
                const kEn = (spec.key_en || '').toLowerCase();
                if (
                  kAr.includes('منشأ') ||
                  kAr.includes('المنشأ') ||
                  kAr.includes('بلد') ||
                  kAr.includes('مصدر') ||
                  kEn.includes('origin') ||
                  kEn.includes('country') ||
                  kEn.includes('source')
                ) {
                  return false;
                }
                return true;
              });

              if (cleanSpecs.length > 0) {
                return (
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {cleanSpecs.map((spec, i) => (
                      <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                        <dt className="text-slate-500 font-medium mb-1">
                          {isAr ? spec.key_ar : spec.key_en}
                        </dt>
                        <dd className="text-slate-800 font-bold text-sm">
                          {isAr ? spec.value_ar : spec.value_en}
                        </dd>
                      </div>
                    ))}
                  </dl>
                );
              }

              return (
                <p className="text-xs text-slate-500">
                  {isAr
                    ? 'جميع زهور هذه الباقة مختارة بعناية من ورود النخب الأول وتصل منسقة مع مثبت النضارة المائي.'
                    : 'All flowers are grade-A fresh blooms arranged with hydrating floral preservation.'}
                </p>
              );
            })()}

            {/* Freshness & Delivery Assurance */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {isAr
                    ? 'توصيل مكيّف وسريع داخل حماة لضمان وصول الأزهار بنضارة تامة.'
                    : 'Air-conditioned delivery across Hama ensuring crisp perfection.'}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  {isAr
                    ? 'ضمان جودة النضارة مع إرشادات الحفظ والترطيب.'
                    : '7-day freshness guarantee with proper care.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Purchase Module (Title, Price, Description, Optional Gift Card Box) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-6 sticky top-24">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-mono tracking-wider">{activeProduct.sku}</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {isAr ? 'متوفرة للتجهيز والتسليم الفوري' : 'Available for immediate delivery'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight font-serif mb-3">
                {isAr ? activeProduct.title_ar : activeProduct.title_en}
              </h1>

              {/* Price display in Syrian Lira exclusively */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-extrabold text-emerald-900 tabular-nums">
                  {formatPrice(activeProduct.price)}
                </span>
                {activeProduct.has_discount && activeProduct.compare_at_price && (
                  <span className="text-base text-slate-400 line-through tabular-nums">
                    {formatPrice(activeProduct.compare_at_price)}
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {isAr ? activeProduct.description_ar : activeProduct.description_en}
              </p>
            </div>

            {/* Single Optional Text Box for Gift Card Message */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>{isAr ? 'نص كرت الإهداء (اختياري):' : 'Gift Card Message (Optional):'}</span>
                <span className="text-[10px] text-amber-700 font-semibold">{isAr ? 'مجاناً مع الباقة' : 'Free with order'}</span>
              </label>
              <textarea
                value={cardMessage}
                onChange={(e) => setCardMessage(e.target.value)}
                placeholder={isAr ? 'اكتب عبارة التهنئة أو الإهداء التي ترغب بتضمينها داخل كرت الهدية...' : 'Write your greeting or message for the recipient...'}
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden resize-none bg-slate-50/70"
              />
            </div>

            {/* Quantity Stepper & Price Calculation */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600">
                  {isAr ? 'الكمية:' : 'Qty:'}
                </span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                    aria-label="تقليل الكمية"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold tabular-nums">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                    aria-label="زيادة الكمية"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] text-slate-400">{isAr ? 'المجموع الإجمالي:' : 'Subtotal:'}</div>
                <div className="text-xl font-extrabold text-emerald-900 tabular-nums">
                  {formatPrice(totalItemPrice)}
                </div>
              </div>
            </div>

            {/* CTAs: WhatsApp Direct Order + Add to Cart */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <MessageCircle className="w-5 h-5 text-emerald-200" />
                <span>{isAr ? 'طلب وتأكيد فوري عبر واتساب' : 'Direct Order via WhatsApp'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 bg-emerald-900 hover:bg-emerald-950 text-amber-300 font-bold rounded-xl text-xs sm:text-sm shadow-sm shadow-emerald-950/20 flex items-center justify-center gap-2 cursor-pointer transition-all border border-emerald-800"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'إضافة إلى سلة الشراء' : 'Add to Bag'}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(activeProduct.id)}
                  className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                    isWish
                      ? 'border-rose-300 bg-rose-50 text-rose-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:text-rose-600'
                  }`}
                  title={isAr ? 'حفظ في المفضلة' : 'Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isWish ? 'fill-rose-600' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Similar Recommended Products Section */}
      {similarProducts.length > 0 && (
        <div className="mt-20 pt-10 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>{isAr ? 'تنسيقات قد تنال إعجابك' : 'Handpicked for You'}</span>
              </div>
              <h3 className="text-2xl font-bold font-serif text-slate-900">
                {isAr ? 'باقات وتنسيقات مشابهة ومقترحة' : 'Similar Bouquets You May Love'}
              </h3>
            </div>

            <button
              onClick={() => navigateTo('home')}
              className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
            >
              {isAr ? 'استعراض كافة الباقات' : 'View all bouquets'}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {similarProducts.map((simProd) => (
              <ProductCard key={simProd.id} product={simProd} />
            ))}
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div
          onClick={() => setShowQrModal(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl relative"
          >
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <QrIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {isAr ? 'امسح الرمز بكاميرا الجوال' : 'Scan with Mobile Camera'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {isAr
                ? 'امسح رمز الاستجابة السريعة للانتقال الفوري إلى صفحة هذه الباقة ومشاركتها مع أصدقائك.'
                : 'Instantly opens this bouquet page on mobile camera scan.'}
            </p>

            {qrCodeDataUrl ? (
              <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-2xl inline-block mx-auto mb-4">
                <img src={qrCodeDataUrl} alt="Product QR Code" className="w-48 h-48 mx-auto" />
              </div>
            ) : (
              <div className="w-48 h-48 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xs text-slate-400">جاري إنشاء الرمز...</span>
              </div>
            )}

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 cursor-pointer"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Social Share Modal */}
      {showShareModal && (
        <div
          onClick={() => setShowShareModal(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {isAr ? 'مشاركة رابط الباقة' : 'Share Bouquet'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {isAr ? 'شارك هذه التنسيقة الفنية مع أحبائك عبر تطبيقات التواصل:' : 'Share this artistic arrangement with loved ones:'}
            </p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  (isAr ? `شاهد هذه الباقة الرائعة من زهور حماة: ${activeProduct.title_ar} 🌸 ` : `Check out this gorgeous bouquet: `) + fullProductUrl
                )}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-6 h-6 text-emerald-600" />
                <span className="text-[11px] font-semibold">واتساب</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(fullProductUrl)}&text=${encodeURIComponent(
                  isAr ? activeProduct.title_ar : activeProduct.title_en
                )}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-6 h-6 text-sky-600" />
                <span className="text-[11px] font-semibold">تلغرام</span>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullProductUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-6 h-6 text-blue-600" />
                <span className="text-[11px] font-semibold">فيسبوك</span>
              </a>
            </div>

            <button
              onClick={() => {
                handleCopyLink();
                setShowShareModal(false);
              }}
              className="w-full py-2.5 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 flex items-center justify-center gap-2 mb-2 cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>{isAr ? 'نسخ الرابط المباشر' : 'Copy Direct Link'}</span>
            </button>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-2 text-slate-500 text-xs hover:text-slate-800 cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
