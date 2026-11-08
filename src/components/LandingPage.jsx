import React from 'react';
import ImageWithFallback from './ImageWithFallback';

export default function LandingPage({ onExploreMap, onOpenContribute, onOpenDetail, listings = [] }) {
  const featured = (listings || []).filter(l => l.status === 'verified').slice(0, 3);

  return (
    <div className="flex-1 bg-[#F5F2EA] text-[#20221F]">
      {/* Hero Section */}
      <section className="border-b border-[#DED5C5] bg-[#F5F2EA] py-12 md:py-24 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6 flex flex-col items-center">
          <div className="inline-block px-3 py-1 border border-[#DED5C5] text-[#B76E50] text-[11px] uppercase tracking-widest font-sans font-semibold rounded-[2px] bg-[#EAE6DC]/50">
            Thrissur District Cultural Cartography • Kerala
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-[#20221F] tracking-tight leading-[1.1]">
            LOKA
          </h1>

          <p className="font-serif italic text-2xl sm:text-3xl text-[#254D3B] max-w-2xl mx-auto leading-[1.3]">
            &ldquo;Discover culture beyond the destination&rdquo;
          </p>

          <p className="font-sans text-base leading-[1.6] text-[#20221F]/80 max-w-[70ch] mx-auto pt-2">
            An open community-informed cultural map documenting Thrissur district&rsquo;s living traditions, temple architecture, percussion ensembles, classical theater, and heritage craft clusters.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={onExploreMap}
              className="w-full sm:w-auto px-8 py-3 min-h-[44px] bg-[#254D3B] text-[#F5F2EA] text-xs font-sans font-semibold uppercase tracking-wider hover:bg-[#1a372a] transition-colors border border-[#254D3B] rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B] focus-visible:outline-offset-2 flex items-center justify-center shadow-none"
            >
              Explore Cultural Map →
            </button>
            <button
              onClick={onOpenContribute}
              className="w-full sm:w-auto px-8 py-3 min-h-[44px] bg-transparent text-[#20221F] text-xs font-sans font-semibold uppercase tracking-wider hover:bg-[#EAE6DC] transition-colors border border-[#DED5C5] rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B] focus-visible:outline-offset-2 flex items-center justify-center"
            >
              Contribute Listing
            </button>
          </div>
        </div>
      </section>

      {/* Featured Curated Records */}
      {featured.length > 0 && (
        <section className="py-12 md:py-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#DED5C5] pb-4 gap-2">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[#B76E50] font-sans font-semibold mb-1">
                From the District Archive
              </div>
              <h2 className="font-serif text-3xl font-normal text-[#20221F] leading-[1.25]">
                Featured Cultural Sanctuaries
              </h2>
            </div>
            <button
              onClick={onExploreMap}
              className="text-xs uppercase font-sans font-semibold text-[#254D3B] hover:text-[#1a372a] underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B] rounded-[2px] py-1"
            >
              View all on map →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map(item => (
              <div
                key={item.id}
                onClick={() => onOpenDetail ? onOpenDetail(item.id) : onExploreMap()}
                className="border border-[#DED5C5] p-4 sm:p-6 bg-[#EAE6DC]/30 hover:bg-[#EAE6DC]/70 cursor-pointer transition-colors space-y-4 group flex flex-col justify-between rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B]"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (onOpenDetail) onOpenDetail(item.id);
                    else onExploreMap();
                  }
                }}
              >
                <div className="space-y-3">
                  {/* Fixed 4:3 Aspect Ratio for Featured Cards */}
                  <div className="overflow-hidden border border-[#DED5C5] rounded-[2px]">
                    <ImageWithFallback
                      src={item.image_url}
                      alt={item.name}
                      aspectRatio="aspect-[4/3]"
                    />
                  </div>

                  {item.id === 'kathakali' && (
                    <div className="text-[10px] italic text-[#20221F]/70 font-sans -mt-1">
                      Illustrative photo of the art form.
                    </div>
                  )}

                  {(item.image_credit || item.image_license) && (
                    <div className="text-[10px] font-sans text-[#20221F]/60 truncate -mt-1">
                      Photo: {item.image_credit}
                      {item.image_credit && item.image_license ? ', ' : ''}
                      {item.image_license && (
                        item.image_source_url ? (
                          <a
                            href={item.image_source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="underline hover:text-[#254D3B] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#254D3B]"
                          >
                            {item.image_license}
                          </a>
                        ) : (
                          <span>{item.image_license}</span>
                        )
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#B76E50] font-semibold font-sans px-2 py-0.5 border border-[#DED5C5] rounded-[2px] bg-[#EAE6DC]/50">
                      {item.type}
                    </span>
                    <span className="text-[#20221F]/30">•</span>
                    <span className="text-[10px] uppercase tracking-wider text-[#254D3B] font-semibold font-sans">
                      {item.art_form || item.status}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl text-[#20221F] group-hover:text-[#254D3B] transition-colors leading-[1.25]">
                    {item.name}
                  </h3>

                  {item.description && (
                    <p className="font-sans text-sm text-[#20221F]/75 line-clamp-3 leading-[1.6]">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[#DED5C5] text-xs text-[#254D3B] font-semibold underline font-sans flex items-center gap-1 group-hover:text-[#1a372a]">
                  Read Cultural Story →
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
