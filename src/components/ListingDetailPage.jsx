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
      <div className="min-h-[calc(100vh-70px)] bg-[#F5F2EA] text-[#20221F] py-16 px-6">
        <div className="max-w-2xl mx-auto border border-[#20221F] p-8 sm:p-12 bg-[#F5F2EA] text-center space-y-6">
          <div className="text-[11px] uppercase tracking-widest text-[#B76E50] font-sans font-semibold">
            Catalog Error
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#20221F] font-normal">
            Listing not found
          </h1>
          <p className="font-sans text-sm text-[#20221F]/70 max-w-md mx-auto leading-relaxed">
            The cultural listing ID &ldquo;{listingId}&rdquo; does not exist or may have been removed from the archive.
          </p>
          <div className="pt-2">
            <button
              onClick={onBackToMap}
              className="px-5 py-2.5 bg-[#20221F] text-[#F5F2EA] text-xs font-sans font-semibold uppercase tracking-wider hover:bg-[#254D3B] transition-colors"
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
    <div className="min-h-screen bg-[#F5F2EA] text-[#20221F] pb-24">
      {/* Top Breadcrumb / Back Link */}
      <div className="border-b border-[#20221F]/20 bg-[#EAE6DC]/50 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs font-sans">
          <button
            onClick={onBackToMap}
            className="text-[#20221F] hover:text-[#254D3B] font-semibold flex items-center gap-1.5 transition-colors"
          >
            ← Back to map
          </button>
          <span className="text-[#20221F]/50 font-mono text-[11px]">
            ID: {listing.id}
          </span>
        </div>
      </div>

      {/* Main Content Article */}
      <article className="max-w-5xl mx-auto px-6 pt-10 space-y-12">
        {/* Header Block */}
        <header className="space-y-4 border-b border-[#20221F]/15 pb-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs uppercase tracking-widest font-sans font-semibold text-[#B76E50] px-2.5 py-0.5 border border-[#B76E50]/30 bg-[#B76E50]/5">
              {listing.type}
            </span>
            {listing.art_form && (
              <span className="text-xs uppercase tracking-widest font-sans font-semibold text-[#254D3B] px-2.5 py-0.5 border border-[#254D3B]/30 bg-[#254D3B]/5">
                {listing.art_form}
              </span>
            )}
            
            {/* Status Badges */}
            {isVerified && (
              <span className="text-xs uppercase tracking-widest font-sans font-semibold px-2.5 py-0.5 border bg-[#254D3B] text-[#F5F2EA] border-[#254D3B]">
                Verified
              </span>
            )}
            {isCommunity && (
              <span className="text-xs uppercase tracking-widest font-sans font-semibold px-2.5 py-0.5 border bg-[#B76E50] text-[#F5F2EA] border-[#B76E50]">
                Community
              </span>
            )}
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#20221F] leading-tight">
            {listing.name}
          </h1>

          {/* Note for community submissions */}
          {isCommunity && (
            <div className="p-3 bg-[#EAE6DC]/70 border-l-2 border-[#B76E50] text-xs font-sans text-[#20221F]/80">
              Community-submitted, not yet verified.
            </div>
          )}
        </header>

        {/* Media & Location Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Visual Image */}
          <div className="lg:col-span-2 space-y-2">
            <div className="border border-[#20221F]/20 overflow-hidden">
              <ImageWithFallback
                src={listing.image_url}
                alt={listing.name}
                height="h-80 sm:h-96"
              />
            </div>
            {(listing.image_credit || listing.image_license) && (
              <div className="px-3 py-1.5 bg-[#EAE6DC]/60 border border-[#20221F]/10 text-[11px] text-[#20221F]/60 flex flex-wrap gap-x-4 gap-y-0.5 font-sans">
                {listing.image_credit && (
                  <span>Credit: <strong className="text-[#20221F]/80">{listing.image_credit}</strong></span>
                )}
                {listing.image_license && (
                  <span>License: <strong className="text-[#20221F]/80">{listing.image_license}</strong></span>
                )}
              </div>
            )}
          </div>

          {/* Mini Map Card */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-widest text-[#20221F]/60 font-sans font-semibold">
              Location Map
            </div>
            <MiniMap listing={listing} />
            <div className="text-[11px] text-[#20221F]/60 font-sans leading-relaxed">
              Pinned in Thrissur district cartographic dataset.
            </div>
          </div>
        </div>

        {/* Narrative & Details */}
        <div className="space-y-8 max-w-3xl">
          {/* Description */}
          {listing.description && (
            <div className="space-y-2">
              <h2 className="text-xs uppercase tracking-widest text-[#20221F]/60 font-sans font-semibold">
                Overview & Description
              </h2>
              <p className="font-sans text-base sm:text-lg leading-relaxed text-[#20221F]/90">
                {listing.description}
              </p>
            </div>
          )}

          {/* Cultural Significance */}
          {listing.cultural_significance && (
            <div className="p-6 border-l-2 border-[#254D3B] bg-[#EAE6DC]/50 space-y-2">
              <h2 className="text-xs uppercase tracking-widest text-[#254D3B] font-sans font-semibold">
                Living Cultural Significance
              </h2>
              <p className="font-serif text-lg sm:text-xl leading-relaxed text-[#20221F] italic">
                {listing.cultural_significance}
              </p>
            </div>
          )}

          {/* Metadata: Date / Season & Source Links */}
          <div className="border-t border-b border-[#20221F]/15 py-6 space-y-4 text-xs font-sans">
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
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 pt-2 border-t border-[#20221F]/10">
                <span className="text-[#20221F]/50 uppercase tracking-wider w-36 flex-shrink-0">
                  Primary Source
                </span>
                <div className="flex items-center gap-3 flex-wrap">
                  <a
                    href={listing.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#254D3B] hover:text-[#B76E50] underline font-medium"
                  >
                    Source: {sourceDomain || "External Archive"} ↗
                  </a>
                  <span className="text-[#20221F]/30">•</span>
                  <a
                    href={listing.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#20221F]/70 hover:text-[#20221F] underline text-[11px]"
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
          <section className="pt-8 border-t border-[#20221F]/20 space-y-6">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[#B76E50] font-sans font-semibold mb-1">
                Connected Traditions
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#20221F]">
                Related Cultural Listings
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedListings.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => onNavigate(`/listing/${rel.id}`)}
                  className="border border-[#20221F]/20 p-4 bg-[#EAE6DC]/30 hover:bg-[#EAE6DC]/70 cursor-pointer transition-colors space-y-3 group"
                >
                  <div className="h-28 overflow-hidden border border-[#20221F]/10">
                    <ImageWithFallback
                      src={rel.image_url}
                      alt={rel.name}
                      height="h-28"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#B76E50] font-semibold font-sans mb-1">
                      {rel.type} {rel.art_form ? `• ${rel.art_form}` : ''}
                    </div>
                    <h3 className="font-serif text-lg text-[#20221F] group-hover:text-[#254D3B] transition-colors leading-snug line-clamp-2">
                      {rel.name}
                    </h3>
                  </div>
                  <div className="text-[11px] text-[#254D3B] font-semibold underline pt-1 font-sans">
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

