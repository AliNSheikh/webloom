import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'horizontal';
  showSubtitle?: boolean;
  inverted?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  showSubtitle = true,
  inverted = false,
}) => {
  const { settings } = useStore();
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    sm: { icon: 36, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 46, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 60, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 88, text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];
  const logoSrc = (!imgError && settings?.site_logo) ? settings.site_logo : '/logo.png';

  // The exact attached logo image placed where the circle is
  const Emblem = (
    <div
      className="relative shrink-0 rounded-full overflow-hidden transition-transform duration-300 hover:scale-105 shadow-md flex items-center justify-center bg-[#032013] border border-amber-400/40"
      style={{
        width: currentSize.icon,
        height: currentSize.icon,
      }}
    >
      <img
        src={logoSrc}
        alt="شعار وي بلووم"
        className="w-full h-full object-cover rounded-full select-none"
        onError={() => setImgError(true)}
      />
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{Emblem}</div>;
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {Emblem}

      <div className="flex flex-col text-right">
        {/* Title without any English words - strictly Arabic 'وي بلووم' */}
        <span
          className={`font-serif font-black tracking-tight ${
            inverted ? 'text-amber-100' : 'text-slate-900'
          } ${currentSize.text} leading-none`}
        >
          وي بلووم
        </span>

        {showSubtitle && (
          <span
            className={`${
              inverted ? 'text-emerald-300/80' : 'text-emerald-800'
            } font-medium tracking-wide mt-1.5 ${currentSize.sub}`}
          >
            بوتيك الزهور والتنسيقات الفاخرة
          </span>
        )}
      </div>
    </div>
  );
};
