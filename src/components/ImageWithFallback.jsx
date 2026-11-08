import React, { useState } from 'react';

export default function ImageWithFallback({ src, alt, className = "", height = "h-48" }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`w-full ${height} bg-[#EAE6DC] border border-[#20221F]/10 flex flex-col items-center justify-center text-center p-4 select-none ${className}`}>
        <svg 
          className="w-7 h-7 text-[#20221F]/40 mb-1.5" 
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
        <span className="text-xs uppercase tracking-wider text-[#20221F]/60 font-sans font-medium">
          Image unavailable
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "Cultural listing"}
      onError={() => setHasError(true)}
      className={`w-full ${height} object-cover ${className}`}
    />
  );
}

