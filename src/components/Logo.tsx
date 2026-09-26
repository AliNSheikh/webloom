import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'horizontal';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  showSubtitle = true,
}) => {
  const sizeMap = {
    sm: { icon: 34, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 44, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 56, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 84, text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  // Precision SVG Circular Emblem (Luxury Emerald Green & Metallic Gold)
  const Emblem = (
    <svg
      width={currentSize.icon}
      height={currentSize.icon}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-md transition-transform hover:scale-105"
      aria-label="وي بلووم | Webloom Logo"
    >
      <defs>
        {/* Deep Emerald Background Gradient */}
        <radialGradient id="emeraldRadial" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#0b462c" />
          <stop offset="60%" stopColor="#05301e" />
          <stop offset="100%" stopColor="#021c11" />
        </radialGradient>

        {/* Radiant Metallic Gold Foil Gradient */}
        <linearGradient id="goldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5e1a4" />
          <stop offset="25%" stopColor="#dfb76c" />
          <stop offset="50%" stopColor="#c59b27" />
          <stop offset="75%" stopColor="#f7e5b2" />
          <stop offset="100%" stopColor="#a8801c" />
        </linearGradient>

        {/* Inner Gold Shimmer */}
        <linearGradient id="goldShimmer" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff3d1" />
          <stop offset="50%" stopColor="#d8ae43" />
          <stop offset="100%" stopColor="#8d650b" />
        </linearGradient>
      </defs>

      {/* Outer Emerald Medallion Circle */}
      <circle cx="100" cy="100" r="96" fill="url(#emeraldRadial)" />

      {/* Concentric Double Gold Rings */}
      <circle cx="100" cy="100" r="92" stroke="url(#goldFoil)" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="86" stroke="url(#goldFoil)" strokeWidth="1" strokeDasharray="3 3" opacity="0.85" />
      <circle cx="100" cy="100" r="82" stroke="url(#goldFoil)" strokeWidth="1.2" />

      {/* 8 Ornamental Gold Star Beads on the Ring */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 100 + 86 * Math.cos(rad);
        const cy = 100 + 86 * Math.sin(rad);
        return <circle key={i} cx={cx} cy={cy} r="2" fill="url(#goldShimmer)" />;
      })}

      {/* Central Botanical Flower / Rose Blossom Motif */}
      <g transform="translate(100, 72) scale(0.85)">
        {/* Central Bud */}
        <ellipse cx="0" cy="0" rx="9" ry="12" fill="url(#goldFoil)" />
        {/* Layer 1 Petals */}
        <path
          d="M -12,2 C -18,-10 -6,-22 0,-14 C 6,-22 18,-10 12,2 C 8,8 -8,8 -12,2 Z"
          fill="url(#goldShimmer)"
          opacity="0.9"
        />
        {/* Layer 2 Petals */}
        <path
          d="M -22,8 C -30,-4 -18,-24 0,-18 C 18,-24 30,-4 22,8 C 14,18 -14,18 -22,8 Z"
          stroke="url(#goldFoil)"
          strokeWidth="2.5"
          fill="none"
        />
        {/* Outer Flourish Leaves */}
        <path
          d="M -30,12 C -20,18 -10,24 0,22 C 10,24 20,18 30,12"
          stroke="url(#goldFoil)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="0" cy="-24" r="2.5" fill="url(#goldShimmer)" />
      </g>

      {/* Elegant Serif / Script "webloom" Typography in Center */}
      <text
        x="100"
        y="126"
        textAnchor="middle"
        fill="url(#goldShimmer)"
        fontFamily="serif"
        fontSize="25"
        fontWeight="bold"
        letterSpacing="2.5"
        className="font-serif select-none"
      >
        webloom
      </text>

      {/* Subtitle Circular / Arc Accent Ribbon */}
      <line x1="45" y1="138" x2="72" y2="138" stroke="url(#goldFoil)" strokeWidth="1.2" />
      <polygon points="100,135 103,138 100,141 97,138" fill="url(#goldShimmer)" />
      <line x1="128" y1="138" x2="155" y2="138" stroke="url(#goldFoil)" strokeWidth="1.2" />

      {/* Arabic Script Subtitle: وي بلووم */}
      <text
        x="100"
        y="158"
        textAnchor="middle"
        fill="url(#goldFoil)"
        fontFamily="Cairo, sans-serif"
        fontSize="17"
        fontWeight="700"
        letterSpacing="1"
        className="select-none"
      >
        وي بلووم
      </text>

      {/* Lower Luxury Tag */}
      <text
        x="100"
        y="174"
        textAnchor="middle"
        fill="#dfb76c"
        fontFamily="sans-serif"
        fontSize="7.5"
        letterSpacing="3"
        opacity="0.85"
        className="uppercase tracking-widest select-none"
      >
        LUXURY BOUTIQUE
      </text>
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{Emblem}</div>;
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {Emblem}

      <div className="flex flex-col text-right">
        <span
          className={`font-serif font-black tracking-tight text-slate-900 ${currentSize.text} leading-none flex items-center gap-1.5`}
        >
          <span>وي بلووم</span>
          <span className="text-amber-600 font-sans text-xs font-semibold px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-200/80">
            webloom
          </span>
        </span>

        {showSubtitle && (
          <span className={`text-emerald-800 font-medium tracking-wide mt-1 ${currentSize.sub}`}>
            بوتيك الزهور والتنسيقات الفاخرة
          </span>
        )}
      </div>
    </div>
  );
};
