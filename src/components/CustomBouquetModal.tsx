import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CustomBouquetForm, SelectedVarietyItem } from '../types';
import { HAMA_NEIGHBORHOODS, WRAPPING_COLORS } from '../data/initialData';
import {
  X,
  Sparkles,
  MessageCircle,
  Calendar,
  Send,
  Camera,
  Check,
  MapPin,
  Phone,
  User,
  Plus,
  Minus,
  Flower2,
  Info,
} from 'lucide-react';
import { ImageUploadInput } from './ImageUploadInput';

const SIZES = [
  { id: 'small', ar: 'باقة ناعمة وبسيطة (10 - 15 وردة)', en: 'Small & Delicate (10-15 stems)' },
  { id: 'medium', ar: 'باقة وسط كلاسيكية (20 - 30 وردة)', en: 'Medium Classic (20-30 stems)' },
  { id: 'large', ar: 'باقة كبيرة فاخرة (35 - 50 وردة)', en: 'Large Luxury (35-50 stems)' },
  { id: 'royal', ar: 'باقة ملكية VIP ضخمة (أكثر من 50 وردة)', en: 'Royal Grand VIP (50+ stems)' },
] as const;

export const CustomBouquetModal: React.FC = () => {
  const {
    isCustomBouquetModalOpen,
    setIsCustomBouquetModalOpen,
    language,
    submitCustomBouquet,
    flowerVarieties,
  } = useStore();

  const isAr = language === 'ar';

  const availableVarieties = flowerVarieties.filter((v) => v.is_available);

  const [selectedVarieties, setSelectedVarieties] = useState<SelectedVarietyItem[]>(() => {
    if (availableVarieties.length > 0) {
      return [
        {
          varietyId: availableVarieties[0].id,
          varietyNameAr: availableVarieties[0].name_ar,
          varietyNameEn: availableVarieties[0].name_en,
          count: 12,
        },
      ];
    }
    return [];
  });

  const [wrappingColor, setWrappingColor] = useState<string>(WRAPPING_COLORS[0].name_ar);
  const [size, setSize] = useState<'small' | 'medium' | 'large' | 'royal'>('medium');
  const [cardMessage, setCardMessage] = useState('');
  const [occasion, setOccasion] = useState('مناسبة خاصة / تهنئة');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(HAMA_NEIGHBORHOODS[0].ar);
  const [customNeighborhood, setCustomNeighborhood] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [notes, setNotes] = useState('');
  const [referenceImage, setReferenceImage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState<1 | 2>(1);

  if (!isCustomBouquetModalOpen) return null;

  const totalFlowerCount = selectedVarieties.reduce((sum, item) => sum + item.count, 0);

  const handleVarietyCountChange = (variety: typeof availableVarieties[0], delta: number) => {
    setSelectedVarieties((prev) => {
      const existing = prev.find((v) => v.varietyId === variety.id);
      if (existing) {
        const newCount = existing.count + delta;
        if (newCount <= 0) {
          return prev.filter((v) => v.varietyId !== variety.id);
        }
        return prev.map((v) => (v.varietyId === variety.id ? { ...v, count: newCount } : v));
      } else if (delta > 0) {
        return [
          ...prev,
          {
            varietyId: variety.id,
            varietyNameAr: variety.name_ar,
            varietyNameEn: variety.name_en,
            count: delta,
          },
        ];
      }
      return prev;
    });
  };

  const getVarietyCount = (varietyId: string) => {
    return selectedVarieties.find((v) => v.varietyId === varietyId)?.count || 0;
  };

  const effectiveNeighborhood = customNeighborhood.trim() ? customNeighborhood.trim() : selectedNeighborhood;

  const handleSubmit = async (viaWhatsApp: boolean) => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert(isAr ? 'يرجى كتابة اسم العميل ورقم الهاتف للتواصل' : 'Please provide your name and phone number');
      setFormStep(2);
      return;
    }

    if (!effectiveNeighborhood.trim()) {
      alert(isAr ? 'يرجى تحديد الحي في حماة' : 'Please specify the neighborhood in Hama');
      setFormStep(2);
      return;
    }

    const payload: CustomBouquetForm = {
      selectedVarieties,
      totalFlowerCount: totalFlowerCount > 0 ? totalFlowerCount : 20,
      wrappingColor,
      size,
      cardMessage,
      occasion,
      customerName,
      customerPhone,
      deliveryNeighborhood: effectiveNeighborhood,
      deliveryAddress,
      targetDate,
      notes,
      referenceImage,
    };

    setIsSubmitting(true);
    await submitCustomBouquet(payload, viaWhatsApp);
    setIsSubmitting(false);
  };

  return (
    <div
      onClick={() => setIsCustomBouquetModalOpen(false)}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-6 border border-rose-100 flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={() => setIsCustomBouquetModalOpen(false)}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>{isAr ? 'مشغل زهور حماة الحصري' : 'Hama Florist Bespoke Studio'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif">
            {isAr ? 'تصميم باقة مخصصة بلمستك الفريدة' : 'Design Your Custom Floral Bouquet'}
          </h2>
          <p className="text-xs text-rose-100 mt-1 max-w-lg leading-relaxed">
            {isAr
              ? 'اختر أصناف الزهور، ألوان التغليف، والحجم المناسب؛ وسيتولى فريقنا التواصل معك فوراً عبر واتساب لتأكيد التكلفة والتجهيز.'
              : 'Pick your preferred flowers, wrapping color, and size. Our florists will confirm pricing and details directly on WhatsApp.'}
          </p>

          {/* Stepper Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/15 text-xs">
            <button
              onClick={() => setFormStep(1)}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                formStep === 1 ? 'bg-white text-rose-950 font-bold' : 'text-rose-200 hover:text-white'
              }`}
            >
              {isAr ? '1. اختيار الزهور والتغليف' : '1. Flowers & Style'}
            </button>
            <span className="text-rose-400">/</span>
            <button
              onClick={() => setFormStep(2)}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                formStep === 2 ? 'bg-white text-rose-950 font-bold' : 'text-rose-200 hover:text-white'
              }`}
            >
              {isAr ? '2. بيانات التوصيل والإهداء' : '2. Delivery & Card'}
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
          {formStep === 1 ? (
            <>
              {/* Step 1: Flower Varieties Picker with stem quantities */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Flower2 className="w-4 h-4 text-rose-600" />
                    <span>{isAr ? 'حدد أصناف الزهور وعدد الأغصان (يمكن اختيار أكثر من نوع):' : 'Select Flower Varieties & Stem Count:'}</span>
                  </label>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                    {isAr ? `إجمالي الورود: ${totalFlowerCount} زهرة` : `Total: ${totalFlowerCount} stems`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableVarieties.map((variety) => {
                    const count = getVarietyCount(variety.id);
                    const isSelected = count > 0;
                    return (
                      <div
                        key={variety.id}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-rose-400 bg-rose-50/50 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {variety.image ? (
                            <img
                              src={variety.image}
                              alt={isAr ? variety.name_ar : variety.name_en}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-200"
                              style={{ backgroundColor: variety.color_hex || '#f43f5e' }}
                            >
                              <Flower2 className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-slate-900 truncate">
                              {isAr ? variety.name_ar : variety.name_en}
                            </h4>
                            <span className="text-[10px] text-emerald-600 font-semibold">
                              {isAr ? 'طازج قطف يومي' : 'Fresh Daily Cut'}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Stepper for this variety */}
                        <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-2xs shrink-0">
                          <button
                            type="button"
                            onClick={() => handleVarietyCountChange(variety, -5)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-r-xl cursor-pointer"
                            title="-5"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-bold text-xs tabular-nums text-slate-800">
                            {count}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleVarietyCountChange(variety, 5)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-l-xl cursor-pointer"
                            title="+5"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Wrapping Color Palette Selection */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  <span>{isAr ? 'لون ورق التغليف والتنسيق الفاخر:' : 'Luxury Wrapping Palette:'}</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {WRAPPING_COLORS.map((w) => {
                    const isSelected = wrappingColor === w.name_ar;
                    return (
                      <div
                        key={w.id}
                        onClick={() => setWrappingColor(w.name_ar)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-rose-600 bg-rose-50/70 font-bold text-rose-950 shadow-2xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border shadow-2xs shrink-0 flex items-center justify-center ${
                            w.border ? 'border-slate-300' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: w.hex }}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white drop-shadow-xs" />}
                        </div>
                        <span className="text-[11px] truncate">{isAr ? w.name_ar : w.name_en}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bouquet Size Selection - strictly NO PRICES! */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="font-bold text-slate-900 text-sm">
                  {isAr ? 'حجم الباقة العام:' : 'Bouquet Size:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SIZES.map((s) => {
                    const isSelected = size === s.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => setSize(s.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-rose-600 bg-rose-50/70 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-rose-600 bg-rose-600 text-white' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">
                              {isAr ? s.ar : s.en}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {isAr ? 'تنسيق يدوي مع ورق فاخر وشريط' : 'Hand-tied with satin ribbon'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reference Image Upload */}
              <div className="pt-4 border-t border-slate-100">
                <ImageUploadInput
                  value={referenceImage}
                  onChange={setReferenceImage}
                  label={isAr ? 'صورة توضيحية لتنسيقة معجب بها (اختياري):' : 'Reference Image (Optional):'}
                  helperText={isAr ? 'إذا كان لديك صورة لباقة رأيتها وتريد تنفيذ مثلها، ارفعها من جهازك' : 'Upload an inspiration photo if you have one'}
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setFormStep(2)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{isAr ? 'متابعة إلى بيانات المستلم والتوصيل في حماة' : 'Continue to Delivery & Recipient'}</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Delivery & Contact details */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <p className="font-bold mb-0.5">
                    {isAr ? '💡 سياسة تسعير وتأكيد الباقات المخصصة:' : '💡 Pricing Notice:'}
                  </p>
                  <p>
                    {isAr
                      ? 'لا يتم عرض أسعار ثابتة للباقات المخصصة مسبقاً، بل يتولى فريق التصميم في حماة مراجعة خياراتك وحساب التكلفة الدقيقة بناءً على قطاف اليوم وإرسال التسعيرة وتأكيدها معك مباشرة عبر واتساب.'
                      : 'Custom bouquets are priced individually based on fresh stems. Our florists will coordinate with you directly on WhatsApp with the quotation.'}
                  </p>
                </div>
              </div>

              {/* Customer Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-rose-500" />
                    <span>{isAr ? 'اسمك الكريم:' : 'Your Full Name:'} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={isAr ? 'مثال: محمد الحلبي' : 'e.g. John Doe'}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isAr ? 'رقم الهاتف / الواتساب:' : 'Phone / WhatsApp:'} *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+963 9xx xxx xxx"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Neighborhood in Hama - Dropdown + Dedicated input field */}
              <div className="space-y-3 pt-2">
                <label className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? 'منطقة / حي التوصيل في حماة:' : 'Neighborhood in Hama:'} *</span>
                </label>

                {/* Dropdown Selection */}
                <select
                  value={selectedNeighborhood}
                  onChange={(e) => {
                    setSelectedNeighborhood(e.target.value);
                    if (e.target.value !== 'حي آخر في حماة (يُحدد في تفاصيل العنوان)') {
                      setCustomNeighborhood('');
                    }
                  }}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white font-medium text-xs focus:border-rose-500 outline-hidden cursor-pointer"
                >
                  {HAMA_NEIGHBORHOODS.map((n, i) => (
                    <option key={i} value={n.ar}>
                      {isAr ? n.ar : n.en}
                    </option>
                  ))}
                </select>

                {/* Dedicated Neighborhood Name Input */}
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-500 font-semibold">
                    {isAr ? 'أو اكتب اسم الحي في حماة مباشرة إذا كان غير مدرج في القائمة أعلاه:' : 'Or enter custom neighborhood name in Hama:'}
                  </label>
                  <input
                    type="text"
                    value={customNeighborhood}
                    onChange={(e) => setCustomNeighborhood(e.target.value)}
                    placeholder={isAr ? 'مثال: حي الحاضر قرب جامع الحيات، أو شارع ابن رشد' : 'e.g. Near Al-Hayat Mosque, Al-Hader'}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50 text-xs"
                  />
                </div>
              </div>

              {/* Detailed Address */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">
                  {isAr ? 'العنوان التفصيلي وملاحظات البناء:' : 'Detailed Address & Landmark:'}
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder={isAr ? 'الشارع، اسم البناء، الطابق، أو علامة مميزة' : 'Street name, building, floor'}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50 text-xs"
                />
              </div>

              {/* Occasion & Delivery Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">
                    {isAr ? 'مناسبة الإهداء:' : 'Occasion:'}
                  </label>
                  <input
                    type="text"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    placeholder={isAr ? 'عيد ميلاد، خطوبة، تخرج، ترقية...' : 'Birthday, Wedding, Graduation...'}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isAr ? 'تاريخ ووقت التسليم المرغوب:' : 'Target Date/Time:'}</span>
                  </label>
                  <input
                    type="text"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    placeholder={isAr ? 'اليوم مساءً الساعة 7 / غداً صباحاً' : 'Today 7 PM / Tomorrow morning'}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50 text-xs"
                  />
                </div>
              </div>

              {/* Gift Card Message */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 flex items-center justify-between">
                  <span>{isAr ? 'نص كرت الإهداء (يُكتب بالخط العربي مجاناً):' : 'Gift Card Message (Free):'}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">{isAr ? 'مجاناً' : 'Free'}</span>
                </label>
                <textarea
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  placeholder={isAr ? 'اكتب الرسالة التي تود إرفاقها مع الباقة...' : 'Your greeting note...'}
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-hidden bg-slate-50 text-xs resize-none"
                />
              </div>

              {/* Action Buttons: Mandated exclusively via WhatsApp */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormStep(1)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 cursor-pointer"
                >
                  {isAr ? 'رجوع' : 'Back'}
                </button>

                {/* Mandated CTA: WhatsApp direct confirmation while logging in system database */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit(true)}
                  className="w-full flex-1 py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{isAr ? 'إرسال وتأكيد الطلب والتسعير حصراً عبر واتساب' : 'Submit & Confirm Exclusively on WhatsApp'}</span>
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-500 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                {isAr
                  ? '🌸 يتم حفظ وتوثيق مواصفات باقتك المخصصة في سجلات النظام والتواصل معك مباشرة على واتساب لتحديد السعر وتأكيد الموعد.'
                  : '🌸 Your custom bouquet request is logged in system records and WhatsApp is opened for instant pricing.'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
