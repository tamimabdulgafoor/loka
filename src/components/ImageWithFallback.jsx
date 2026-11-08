import React, { useState, useEffect } from 'react';

export default function ImageWithFallback({ 
  src, 
  alt, 
  className = "", 
  aspectRatio = "aspect-[4/3]",
  height = "" 
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const sizeClasses = `${aspectRatio} ${height} w-full`;

  if (!src || hasError) {
    return (
      <div 
        className={`${sizeClasses} bg-[#EAE6DC] border border-[#DED5C5] flex flex-col items-center justify-center text-center p-3 select-none rounded-[2px] ${className}`}
      >
        <svg 
          className="w-6 h-6 text-[#20221F]/40 mb-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="1.2" 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
        <span className="text-[11px] uppercase tracking-wider text-[#20221F]/60 font-sans font-medium">
          Image unavailable
        </span>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses} overflow-hidden bg-[#EAE6DC] rounded-[2px] ${className}`}>
      <img
        src={src}
        alt={alt || "Cultural listing"}
        loading="lazy"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover rounded-[2px] transition-opacity duration-200"
      />
    </div>
  );
}
