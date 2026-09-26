import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react';

interface ImageUploadInputProps {
  value: string;
  onChange: (urlOrBase64: string) => void;
  label?: string;
  helperText?: string;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  value,
  onChange,
  label = 'صورة العنصر',
  helperText = 'ارفع صورة مباشرة من جهازك (PNG, JPG, WEBP) بحد أقصى 5 ميغابايت',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFile = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('يرجى اختيار ملف صورة صالح (JPEG, PNG, WebP)');
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      setErrorMsg('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 6 ميغابايت');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.onerror = () => {
      setErrorMsg('حدث خطأ أثناء قراءة ملف الصورة من جهازك');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">{label}</label>
        {value && (
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            تم تحديد الصورة
          </span>
        )}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all text-center ${
          isDragging
            ? 'border-rose-500 bg-rose-50/50'
            : value
            ? 'border-slate-200 bg-slate-50/50'
            : 'border-slate-300 hover:border-rose-400 bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {value ? (
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0 shadow-sm">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="text-right flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">صورة مخزنة ومحفوظة بنجاح</p>
              <p className="text-[11px] text-slate-500 mt-0.5">جاهزة للعرض في المتجر وقاعدة البيانات</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  تغيير الصورة
                </button>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="p-1 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer"
                  title="حذف الصورة"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-2 shadow-inner">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-800">
              انقر لاختيار صورة من جهاز الكمبيوتر أو اسحبها هنا
            </p>
            <p className="text-[11px] text-slate-500 mt-1">{helperText}</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold cursor-pointer transition-colors border border-rose-200"
            >
              اختيار ملف من الجهاز
            </button>
          </div>
        )}
      </div>

      {errorMsg && <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>}
    </div>
  );
};
