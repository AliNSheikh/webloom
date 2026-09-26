import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { HAMA_NEIGHBORHOODS } from '../data/initialData';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  MapPin,
  Phone,
  User,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQty,
    clearCart,
    cartTotalAmount,
    cartTotalCount,
    formatPrice,
    language,
    submitOrder,
    navigateTo,
  } = useStore();

  const isAr = language === 'ar';

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(HAMA_NEIGHBORHOODS[0].ar);
  const [customNeighborhood, setCustomNeighborhood] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartDrawerOpen) return null;

  const effectiveNeighborhood = customNeighborhood.trim() ? customNeighborhood.trim() : selectedNeighborhood;

  const handleCheckoutSubmit = async (viaWhatsApp = true) => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert(isAr ? 'يرجى إدخال الاسم ورقم الهاتف للتوصيل' : 'Please provide recipient name and phone');
      return;
    }

    if (!effectiveNeighborhood.trim()) {
      alert(isAr ? 'يرجى تحديد اسم الحي في حماة' : 'Please specify the neighborhood in Hama');
      return;
    }

    setIsSubmitting(true);
    await submitOrder(
      {
        name: customerName,
        phone: customerPhone,
        neighborhood: effectiveNeighborhood,
        address: deliveryAddress,
        notes,
      },
      viaWhatsApp
    );
    setIsSubmitting(false);
    setCheckoutStep('cart');
  };

  return (
    <div
      onClick={() => setIsCartDrawerOpen(false)}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-in"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {checkoutStep === 'cart'
                  ? isAr
                    ? 'سلة المشتريات'
                    : 'Shopping Bag'
                  : isAr
                  ? 'بيانات التوصيل في حماة'
                  : 'Delivery Details in Hama'}
              </h3>
              <span className="text-xs text-slate-500">
                {cartTotalCount} {isAr ? 'باقات وعناصر مختارة' : 'items selected'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-300 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-700 text-base mb-1">
                {isAr ? 'سلة المشتريات فارغة' : 'Your bag is empty'}
              </h4>
              <p className="text-xs text-slate-500 mb-6 max-w-xs">
                {isAr
                  ? 'تصفح أحدث الباقات والتنسيقات الفنية لاختيار ما يناسب ذوقك ومناسبتك.'
                  : 'Explore our artistic arrangements and hand-tied bouquets.'}
              </p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigateTo('home');
                  setTimeout(() => {
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                }}
                className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 shadow-sm shadow-rose-200 cursor-pointer"
              >
                {isAr ? 'تصفح تشكيلة الباقات' : 'Browse Bouquets'}
              </button>
            </div>
          ) : checkoutStep === 'cart' ? (
            <div className="space-y-4">
              {cart.map((item, idx) => {
                const itemTotal = item.product.price * item.quantity;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-slate-200/80 bg-stone-50/50 flex gap-3 relative group"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                      <img
                        src={item.product.images[0] || ''}
                        alt={isAr ? item.product.title_ar : item.product.title_en}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 pr-1">
                      <h4 className="font-bold text-slate-900 text-xs truncate">
                        {isAr ? item.product.title_ar : item.product.title_en}
                      </h4>

                      <div className="text-rose-700 font-extrabold text-xs mt-1 tabular-nums">
                        {formatPrice(item.product.price)}
                      </div>

                      {item.cardMessage && (
                        <div className="text-[10px] text-slate-500 bg-white p-1 rounded-md border border-slate-200 mt-1 italic truncate">
                          💌 {item.cardMessage}
                        </div>
                      )}

                      {/* Quantity Stepper & Subtotal */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                            className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                            aria-label="تقليل"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                            className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                            aria-label="زيادة"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-slate-800 tabular-nums">
                          {formatPrice(itemTotal)}
                        </span>
                      </div>
                    </div>

                    {/* Remove item */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-300 hover:text-rose-500 p-1 self-start transition-colors cursor-pointer"
                      title={isAr ? 'حذف من السلة' : 'Remove item'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              <div className="pt-2 text-left rtl:text-right">
                <button
                  onClick={clearCart}
                  className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  {isAr ? 'تفريغ السلة بالكامل' : 'Clear entire cart'}
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Step: Hama Delivery Details */
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  {isAr
                    ? 'سيتم إرفاق روابط الباقات المباشرة في رسالة واتساب لتسهيل مراجعة وتجهيز الطلب'
                    : 'Direct product links will be included in the WhatsApp order message'}
                </span>
              </div>

              {/* Customer Name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-rose-500" />
                  <span>{isAr ? 'اسم المستلم / العميل:' : 'Recipient Name:'} *</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={isAr ? 'الاسم الثلاثي أو اللقب' : 'Full name'}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50 text-xs"
                />
              </div>

              {/* Customer Phone */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? 'رقم الهاتف / الواتساب للتواصل:' : 'Phone / WhatsApp:'} *</span>
                </label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+963 9xx xxx xxx"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50 text-xs font-mono"
                />
              </div>

              {/* Neighborhood in Hama - Dropdown & Custom Field */}
              <div className="space-y-2 pt-2">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? 'منطقة / حي التوصيل في حماة:' : 'Neighborhood in Hama:'} *</span>
                </label>

                <select
                  value={selectedNeighborhood}
                  onChange={(e) => {
                    setSelectedNeighborhood(e.target.value);
                    if (e.target.value !== 'حي آخر في حماة (يُحدد في تفاصيل العنوان)') {
                      setCustomNeighborhood('');
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-xs focus:border-rose-500 outline-hidden cursor-pointer"
                >
                  {HAMA_NEIGHBORHOODS.map((n, i) => (
                    <option key={i} value={n.ar}>
                      {isAr ? n.ar : n.en}
                    </option>
                  ))}
                </select>

                {/* Dedicated Neighborhood Name Input */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-semibold">
                    {isAr ? 'أو اكتب اسم الحي في حماة مباشرة إذا كان غير مدرج:' : 'Or enter custom neighborhood name in Hama:'}
                  </label>
                  <input
                    type="text"
                    value={customNeighborhood}
                    onChange={(e) => setCustomNeighborhood(e.target.value)}
                    placeholder={isAr ? 'مثال: حي الصابونية، أو طريق حلب قرب الدوار' : 'e.g. Al-Sabouniyyeh'}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50 text-xs"
                  />
                </div>
              </div>

              {/* Detailed Address */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  {isAr ? 'العنوان التفصيلي وملاحظات البناء:' : 'Detailed Address:'}
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder={isAr ? 'الشارع، اسم البناء، الطابق، أو علامة مميزة' : 'Street, Building, Floor'}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50 text-xs"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  {isAr ? 'ملاحظات خاصة بالتوصيل أو التوقيت:' : 'Special Delivery Notes:'}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isAr ? 'أي تعليمات للمندوب أو توقيت مفضل للتسليم...' : 'Any special instructions...'}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50 text-xs resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout Summary & CTAs */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
              <span className="font-bold text-slate-900 text-sm tabular-nums">
                {formatPrice(cartTotalAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{isAr ? 'رسوم التوصيل داخل حماة:' : 'Delivery in Hama:'}</span>
              <span className="text-emerald-600 font-semibold">
                {isAr ? 'تُحدد حسب الحي' : 'Calculated by neighborhood'}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">
                {isAr ? 'المجموع الإجمالي المطلوب:' : 'Total Amount:'}
              </span>
              <span className="font-extrabold text-rose-700 text-lg tabular-nums">
                {formatPrice(cartTotalAmount)}
              </span>
            </div>

            {checkoutStep === 'cart' ? (
              <button
                onClick={() => setCheckoutStep('checkout')}
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-rose-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>{isAr ? 'متابعة إلى بيانات التوصيل' : 'Proceed to Checkout'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            ) : (
              <div className="space-y-3">
                {/* Mandated CTA: Orders placed exclusively via WhatsApp while logged in database records */}
                <button
                  disabled={isSubmitting}
                  onClick={() => handleCheckoutSubmit(true)}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{isAr ? 'تأكيد وإرسال الطلب حصراً عبر واتساب' : 'Confirm Order Exclusively via WhatsApp'}</span>
                </button>

                <p className="text-[11px] text-center text-slate-500 leading-normal bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                  {isAr
                    ? '✨ يتم حفظ وتوثيق طلبك تلقائياً في سجلات النظام وفتح تطبيق واتساب فوراً لإتمام التوصيل والتأكيد مع فريق زهور حماة.'
                    : '✨ Your order is permanently logged in system records and WhatsApp is opened to finalize delivery.'}
                </p>

                <button
                  onClick={() => setCheckoutStep('cart')}
                  className="w-full py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer transition-colors"
                >
                  {isAr ? 'رجوع لتعديل عناصر السلة' : 'Back to Cart'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
