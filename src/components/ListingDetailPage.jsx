import React, { useMemo } from 'react';
import ImageWithFallback from './ImageWithFallback';
import MiniMap from './MiniMap';

export default function ListingDetailPage({ 
  listingId, 
  allListings = [], 
  onNavigate, 
  onBackToMap 
}) {
  const listing = useMemo(() => {
    return (allListings || []).find(l => l.id === listingId);
  }, [allListings, listingId]);

  // Related listings: up to 3 others with the same art_form or type
  const relatedListings = useMemo(() => {
    if (!listing) return [];
    return allListings
      .filter(item => 
        item.id !== listing.id && 
        (item.status === 'verified' || item.status === 'community') &&
        (
          (item.art_form && listing.art_form && item.art_form.toLowerCase() === listing.art_form.toLowerCase()) ||
          (item.type && listing.type && item.type.toLowerCase() === listing.type.toLowerCase())
        )
      )
      .slice(0, 3);
  }, [allListings, listing]);

  // Unknown ID: show "Listing not found" page with a link back
  if (!listing) {
    return (
      <div className="flex-1 bg-[#F5F2EA] text-[#20221F] py-16 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-xl w-full border border-[#DED5C5] p-8 sm:p-12 bg-[#F5F2EA] text-center space-y-6 rounded-[2px]">
          <div className="text-[11px] uppercase tracking-widest text-[#B76E50] font-sans font-semibold">
            Archive Notice
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#20221F] font-normal">
            Listing not found
          </h1>
          <p className="font-sans text-base leading-[1.6] text-[#20221F]/70 max-w-[70ch] mx-auto">
            The cultural listing ID &ldquo;{listingId}&rdquo; does not exist or may have been removed from the archive.
          </p>
          <div className="pt-2">
            <button
              onClick={onBackToMap}
              className="px-6 py-3 min-h-[44px] bg-[#254D3B] text-[#F5F2EA] text-xs font-sans font-semibold uppercase tracking-wider hover:bg-[#1a372a] transition-colors rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B]"
            >
              ← Back to Cultural Map
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isVerified = listing.status === 'verified';
  const isCommunity = listing.status === 'community';

  const dateDisplay = (listing.date_or_season && listing.date_or_season.toLowerCase() !== 'unconfirmed' && listing.date_or_season.toLowerCase() !== 'unknown')
    ? listing.date_or_season
    : "Date unconfirmed";

  // Hostname helper for source link
  let sourceDomain = "";
  if (listing.source_url) {
    try {
      sourceDomain = new URL(listing.source_url).hostname.replace('www.', '');
    } catch {
      sourceDomain = listing.source_url;
    }
  }

  return (
    <div className="flex-1 bg-[#F5F2EA] text-[#20221F] pb-16">
      {/* Top Breadcrumb / Back Link */}
      <div className="border-b border-[#DED5C5] bg-[#EAE6DC]/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs font-sans">
          <button
            onClick={onBackToMap}
            className="text-[#20221F] hover:text-[#254D3B] font-semibold flex items-center gap-1.5 transition-colors py-1 px-1 rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B]"
          >
            ← Back to map
          </button>
          <span className="text-[#20221F]/50 font-mono text-[11px]">
            ID: {listing.id}
          </span>
        </div>
      </div>

      {/* Main Content Article */}
      <article className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-12">
        {/* Header Block */}
        <header className="space-y-4 border-b border-[#DED5C5] pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-sans font-semibold text-[#B76E50] px-2.5 py-0.5 border border-[#DED5C5] bg-[#EAE6DC]/50 rounded-[2px]">
              {listing.type}
            </span>
            {listing.art_form && (
              <span className="text-xs uppercase tracking-widest font-sans font-semibold text-[#254D3B] px-2.5 py-0.5 border border-[#DED5C5] bg-[#EAE6DC]/50 rounded-[2px]">
                {listing.art_form}
              </span>
            )}
            
            {/* Status Badges */}
            {isVerified && (
              <span className="text-xs uppercase tracking-widest font-sans font-semibold px-2.5 py-0.5 border bg-[#254D3B] text-[#F5F2EA] border-[#254D3B] rounded-[2px]">
                Verified
              </span>
            )}
            {isCommunity && (
              <span className="text-xs uppercase tracking-widest font-sans font-semibold px-2.5 py-0.5 border bg-[#B76E50] text-[#F5F2EA] border-[#B76E50] rounded-[2px]">
                Community
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-[#20221F] leading-[1.15]">
            {listing.name}
          </h1>

          {/* Note for community submissions */}
          {isCommunity && (
            <div className="p-3 bg-[#EAE6DC]/70 border-l-2 border-[#B76E50] text-xs font-sans text-[#20221F]/80 rounded-[2px]">
              Community-submitted, not yet verified.
            </div>
          )}
        </header>

        {/* Media & Location Grid: Single column on mobile, 3 cols on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Main Visual Image Hero: Fixed 16:9 Aspect Ratio */}
          <div className="md:col-span-2 space-y-2 w-full">
            <div className="border border-[#DED5C5] overflow-hidden rounded-[2px] w-full">
              <ImageWithFallback
                src={listing.image_url}
                alt={listing.name}
                aspectRatio="aspect-[16/9]"
              />
            </div>

            {/* Photo Caption & Credit */}
            <div className="space-y-1 font-sans">
              {listing.id === 'kathakali' && (
                <div className="text-xs italic text-[#20221F]/75">
                  Illustrative photo of the art form.
                </div>
              )}
              {(listing.image_credit || listing.image_license) && (
                <div className="text-xs text-[#20221F]/70">
                  Photo: {listing.image_credit}
                  {listing.image_credit && listing.image_license ? ', ' : ''}
                  {listing.image_license && (
                    listing.image_source_url ? (
                      <a
                        href={listing.image_source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-[#254D3B] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#254D3B]"
                      >
                        {listing.image_license}
                      </a>
                    ) : (
                      <span>{listing.image_license}</span>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mini Map Card */}
          <div className="space-y-3 w-full">
            <div className="text-xs uppercase tracking-widest text-[#20221F]/60 font-sans font-semibold">
              Location Map
            </div>
            <div className="border border-[#DED5C5] rounded-[2px] overflow-hidden">
              <MiniMap listing={listing} />
            </div>
            <div className="text-[11px] text-[#20221F]/60 font-sans leading-relaxed">
              Pinned in Thrissur district cartographic dataset.
            </div>
          </div>
        </div>

        {/* Narrative & Details */}
        <div className="space-y-8 max-w-[70ch]">
          {/* Description */}
          {listing.description && (
            <div className="space-y-2">
              <h2 className="text-xs uppercase tracking-widest text-[#20221F]/60 font-sans font-semibold">
                Overview & Description
              </h2>
              <p className="font-sans text-base leading-[1.6] text-[#20221F]/90">
                {listing.description}
              </p>
            </div>
          )}

          {/* Cultural Significance */}
          {listing.cultural_significance && (
            <div className="p-6 border-l-2 border-[#254D3B] bg-[#EAE6DC]/50 space-y-2 rounded-[2px]">
              <h2 className="text-xs uppercase tracking-widest text-[#254D3B] font-sans font-semibold">
                Living Cultural Significance
              </h2>
              <p className="font-serif text-xl sm:text-2xl leading-[1.3] text-[#20221F] italic">
                {listing.cultural_significance}
              </p>
            </div>
          )}

          {/* Metadata: Date / Season & Source Links */}
          <div className="border-t border-b border-[#DED5C5] py-6 space-y-4 text-xs font-sans">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
              <span className="text-[#20221F]/50 uppercase tracking-wider w-36 flex-shrink-0">
                Date / Season
              </span>
              <span className="text-[#20221F] font-medium text-sm">
                {dateDisplay}
              </span>
            </div>

            {/* Source row: only show if source_url is present */}
            {listing.source_url && (
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 pt-2 border-t border-[#DED5C5]">
                <span className="text-[#20221F]/50 uppercase tracking-wider w-36 flex-shrink-0">
                  Primary Source
                </span>
                <div className="flex items-center gap-3 flex-wrap">
                  <a
                    href={listing.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#254D3B] hover:text-[#B76E50] underline font-medium focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#254D3B]"
                  >
                    Source: {sourceDomain || "External Archive"} ↗
                  </a>
                  <span className="text-[#20221F]/30">•</span>
                  <a
                    href={listing.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#20221F]/70 hover:text-[#20221F] underline text-[11px] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#254D3B]"
                  >
                    Original page
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Listings Section */}
        {relatedListings.length > 0 && (
          <section className="pt-8 border-t border-[#DED5C5] space-y-6">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[#B76E50] font-sans font-semibold mb-1">
                Connected Traditions
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#20221F] leading-[1.25]">
                Related Cultural Listings
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedListings.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => onNavigate(`/listing/${rel.id}`)}
                  className="border border-[#DED5C5] p-4 bg-[#EAE6DC]/30 hover:bg-[#EAE6DC]/70 cursor-pointer transition-colors space-y-3 group rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B]"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onNavigate(`/listing/${rel.id}`);
                  }}
                >
                  <div className="overflow-hidden border border-[#DED5C5] rounded-[2px]">
                    <ImageWithFallback
                      src={rel.image_url}
                      alt={rel.name}
                      aspectRatio="aspect-[4/3]"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#B76E50] font-semibold font-sans mb-1">
                      {rel.type} {rel.art_form ? `• ${rel.art_form}` : ''}
                    </div>
                    <h3 className="font-serif text-xl text-[#20221F] group-hover:text-[#254D3B] transition-colors leading-[1.25] line-clamp-2">
                      {rel.name}
                    </h3>
                  </div>
                  <div className="text-[11px] text-[#254D3B] font-semibold underline pt-1 font-sans flex items-center gap-1 group-hover:text-[#1a372a]">
                    View Details →
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
