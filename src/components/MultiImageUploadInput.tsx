import React, { useRef, useState } from 'react';
import { UploadCloud, X, Star, Plus, Link as LinkIcon, Trash2, CheckCircle2 } from 'lucide-react';

interface MultiImageUploadInputProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  helperText?: string;
}

export const MultiImageUploadInput: React.FC<MultiImageUploadInputProps> = ({
  images = [],
  onChange,
  label = 'صور الباقة (يمكنك رفع عدة صور من جهاز الكمبيوتر)',
  helperText = 'ارفع صورة أو أكثر للباقة من جهازك مباشرة. الصورة الأولى ستكون هي الغلاف الرئيسي.',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFiles = (fileList: FileList | File[]) => {
    setErrorMsg(null);
    const filesArray = Array.from(fileList);
    const validFiles = filesArray.filter((file) => {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('تم تخطي بعض الملفات لأنها ليست صوراً صالحة');
        return false;
      }
      if (file.size > 8 * 1024 * 1024) {
        setErrorMsg('تم تخطي بعض الملفات لأن حجمها أكبر من 8 ميغابايت');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    let loadedCount = 0;
    const newImages: string[] = [];

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          newImages.push(result);
        }
        loadedCount++;
        if (loadedCount === validFiles.length) {
          onChange([...images, ...newImages]);
        }
      };
      reader.onerror = () => {
        loadedCount++;
        setErrorMsg('حدث خطأ أثناء قراءة إحدى الصور');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const next = images.filter((_, idx) => idx !== indexToRemove);
    onChange(next);
  };

  const handleSetCover = (indexToCover: number) => {
    if (indexToCover === 0) return;
    const item = images[indexToCover];
    const rest = images.filter((_, idx) => idx !== indexToCover);
    onChange([item, ...rest]);
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
    setShowUrlField(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-800">{label}</label>
        <div className="flex items-center gap-2">
          {images.length > 0 && (
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {images.length} {images.length === 1 ? 'صورة مرفوعة' : 'صور مرفوعة'}
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowUrlField(!showUrlField)}
            className="text-[11px] text-rose-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlField ? 'إخفاء رابط URL' : 'إضافة عبر رابط URL'}</span>
          </button>
        </div>
      </div>

      {helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}

      {/* URL input field if toggled */}
      {showUrlField && (
        <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="flex-1 text-xs p-2 rounded-lg border border-slate-200 outline-hidden bg-white font-mono"
            dir="ltr"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 cursor-pointer"
          >
            إضافة الرابط
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Existing Images Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-200">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`relative group rounded-xl overflow-hidden border-2 bg-white aspect-square shadow-2xs transition-all ${
                idx === 0 ? 'border-rose-500 ring-2 ring-rose-200' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <img
                src={img}
                alt={`Bouquet Photo ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Cover badge */}
              {idx === 0 ? (
                <div className="absolute top-1.5 right-1.5 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  <span>الصورة الرئيسية</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetCover(idx)}
                  className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-rose-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors opacity-90 group-hover:opacity-100 flex items-center gap-1 cursor-pointer"
                  title="تعيين كغلاف رئيسي للباقة"
                >
                  <Star className="w-3 h-3" />
                  <span>تعيين رئيسية</span>
                </button>
              )}

              {/* Delete image button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute bottom-1.5 left-1.5 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg shadow-sm transition-transform active:scale-95 cursor-pointer"
                title="حذف هذه الصورة"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                #{idx + 1}
              </span>
            </div>
          ))}

          {/* Add more button in the grid */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/40 hover:bg-rose-50 text-rose-700 aspect-square transition-all cursor-pointer p-3"
          >
            <Plus className="w-6 h-6" />
            <span className="text-[11px] font-bold text-center">إضافة صورة أخرى</span>
            <span className="text-[9px] text-slate-500">من جهازك</span>
          </button>
        </div>
      )}

      {/* Main Drag & Drop Zone if no images or below gallery */}
      {images.length === 0 && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 transition-all text-center cursor-pointer ${
            isDragging
              ? 'border-rose-500 bg-rose-50/60 scale-[1.01]'
              : 'border-slate-300 hover:border-rose-400 bg-white hover:bg-rose-50/20'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-800 mb-1">
            اضغط لاختيار صور من جهازك أو اسحبها وأفلتها هنا
          </p>
          <p className="text-[11px] text-slate-500">
            يمكنك تحديد أكثر من صورة معاً (JPG, PNG, WEBP)
          </p>
        </div>
      )}

      {errorMsg && (
        <p className="text-[11px] text-red-600 font-semibold bg-red-50 p-2 rounded-lg border border-red-200">
          {errorMsg}
        </p>
      )}
    </div>
  );
};
