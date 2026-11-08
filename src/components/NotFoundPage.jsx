import React from 'react';

export default function NotFoundPage({ onNavigate }) {
  return (
    <div className="flex-1 bg-[#F5F2EA] text-[#20221F] py-16 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-xl w-full border border-[#DED5C5] p-8 sm:p-12 bg-[#F5F2EA] text-center space-y-6 rounded-[2px]">
        <div className="inline-block px-2.5 py-0.5 border border-[#DED5C5] text-[11px] uppercase tracking-widest text-[#B76E50] font-sans font-semibold rounded-[2px] bg-[#EAE6DC]/50">
          404 • Cartographic Void
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl text-[#20221F] font-normal leading-[1.15]">
          Page Not Found
        </h1>

        <p className="font-sans text-base leading-[1.6] text-[#20221F]/70 max-w-[70ch] mx-auto">
          The cultural pathway you requested does not exist within the Thrissur district cartography archive.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('/map')}
            className="w-full sm:w-auto px-6 py-3 min-h-[44px] bg-[#254D3B] text-[#F5F2EA] text-xs font-sans font-semibold uppercase tracking-wider hover:bg-[#1a372a] transition-colors rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B]"
          >
            ← Explore Cultural Map
          </button>
          <button
            onClick={() => onNavigate('/')}
            className="w-full sm:w-auto px-6 py-3 min-h-[44px] bg-transparent text-[#20221F] text-xs font-sans font-semibold uppercase tracking-wider hover:bg-[#EAE6DC] transition-colors border border-[#DED5C5] rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B]"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}
