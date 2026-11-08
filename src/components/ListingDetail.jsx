import React from 'react';
import ImageWithFallback from './ImageWithFallback';

export default function ListingDetail({ listing, onClose }) {
  if (!listing) return null;

  const hasCoords = listing.lat !== null && listing.lat !== undefined && 
                    listing.lng !== null && listing.lng !== undefined;

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#20221F]/60 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-[#F5F2EA] text-[#20221F] border border-[#20221F] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-[#20221F]/20 px-6 py-4 bg-[#F5F2EA] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-widest font-sans font-semibold text-[#254D3B] px-2.5 py-0.5 border border-[#254D3B]/30 bg-[#254D3B]/5">
              {listing.type}
            </span>
            <span className={`text-[11px] uppercase tracking-widest font-sans font-semibold px-2.5 py-0.5 border ${
              listing.status === 'verified'
                ? 'bg-[#254D3B] text-[#F5F2EA] border-[#254D3B]'
                : 'bg-[#B76E50] text-[#F5F2EA] border-[#B76E50]'
            }`}>
              {listing.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-xs uppercase tracking-wider font-sans text-[#20221F]/70 hover:text-[#20221F] px-2 py-1 border border-transparent hover:border-[#20221F]/30 transition-colors"
          >
            Close [esc]
          </button>
        </div>

        {/* Image with neutral fallback */}
        <div className="border-b border-[#20221F]/15">
          <ImageWithFallback
            src={listing.image_url}
            alt={listing.name}
            height="h-64 sm:h-80"
          />
          {(listing.image_credit || listing.image_license) && (
            <div className="px-6 py-2 bg-[#EAE6DC] border-t border-[#20221F]/10 text-[11px] text-[#20221F]/60 flex flex-wrap gap-x-4 gap-y-1 font-sans">
              {listing.image_credit && (
                <span>Credit: <span className="text-[#20221F]/80">{listing.image_credit}</span></span>
              )}
              {listing.image_license && (
                <span>License: <span className="text-[#20221F]/80">{listing.image_license}</span></span>
              )}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#B76E50] font-sans font-semibold mb-1">
              {listing.art_form || "Cultural Tradition"}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#20221F] leading-tight font-normal">
              {listing.name}
            </h2>
          </div>

          {/* Description */}
          {listing.description && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#20221F]/60 font-sans font-semibold mb-2">
                Overview
              </h3>
              <p className="font-sans text-sm sm:text-base leading-relaxed text-[#20221F]/90">
                {listing.description}
              </p>
            </div>
          )}

          {/* Cultural Significance */}
          {listing.cultural_significance && (
            <div className="p-5 border-l-2 border-[#254D3B] bg-[#EAE6DC]/50 space-y-2">
              <h3 className="text-xs uppercase tracking-widest text-[#254D3B] font-sans font-semibold">
                Cultural Significance
              </h3>
              <p className="font-serif text-base sm:text-lg leading-relaxed text-[#20221F] italic">
                {listing.cultural_significance}
              </p>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#20221F]/15 text-xs font-sans">
            <div>
              <span className="text-[#20221F]/50 uppercase tracking-wider block mb-1">
                Date / Season
              </span>
              <span className="text-[#20221F] font-medium">
                {listing.date_or_season || "unconfirmed"}
              </span>
            </div>

            <div>
              <span className="text-[#20221F]/50 uppercase tracking-wider block mb-1">
                Geographic Coordinates
              </span>
              <span className="text-[#20221F] font-mono">
                {hasCoords ? `${listing.lat}, ${listing.lng}` : "Coordinates null (Listed without map marker)"}
              </span>
            </div>

            {listing.source_url && (
              <div className="sm:col-span-2 pt-2">
                <span className="text-[#20221F]/50 uppercase tracking-wider block mb-1">
                  Primary Source
                </span>
                <a
                  href={listing.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#254D3B] hover:text-[#B76E50] underline break-all font-medium"
                >
                  {listing.source_url}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 border-t border-[#20221F]/15 bg-[#EAE6DC]/40 text-[11px] text-[#20221F]/50 flex justify-between items-center font-sans">
          <span>Catalog ID: {listing.id}</span>
          <span>Thrissur District Cultural Archive</span>
        </div>
      </div>
    </div>
  );
}

