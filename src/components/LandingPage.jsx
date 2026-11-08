import React from 'react';
import ImageWithFallback from './ImageWithFallback';

export default function LandingPage({ onExploreMap, onOpenContribute, onOpenDetail, listings = [] }) {
  const featured = (listings || []).filter(l => l.status === 'verified').slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#20221F]">
      {/* Hero Section */}
      <section className="border-b border-[#20221F] bg-[#F5F2EA] py-16 sm:py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-block px-3 py-1 border border-[#B76E50] text-[#B76E50] text-[11px] uppercase tracking-widest font-sans font-semibold">
            Thrissur District Cultural Cartography • Kerala
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-[#20221F] tracking-tight">
            LOKA
          </h1>

          <p className="font-serif italic text-2xl sm:text-3xl text-[#254D3B] max-w-2xl mx-auto leading-relaxed">
            &ldquo;Discover culture beyond the destination&rdquo;
          </p>

          <p className="font-sans text-sm sm:text-base text-[#20221F]/80 max-w-xl mx-auto leading-relaxed pt-2">
            An open community-informed cultural map documenting Thrissur district&rsquo;s living traditions, temple architecture, percussion ensembles, classical theater, and heritage craft clusters.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onExploreMap}
              className="px-6 py-3 bg-[#20221F] text-[#F5F2EA] text-xs font-sans font-semibold uppercase tracking-wider hover:bg-[#254D3B] transition-colors border border-[#20221F]"
            >
              Explore Cultural Map →
            </button>
            <button
              onClick={onOpenContribute}
              className="px-6 py-3 bg-transparent text-[#20221F] text-xs font-sans font-semibold uppercase tracking-wider hover:bg-[#EAE6DC] transition-colors border border-[#20221F]/40"
            >
              Contribute Listing
            </button>
          </div>
        </div>
      </section>

      {/* Featured Curated Records */}
      {featured.length > 0 && (
        <section className="py-16 px-6 max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#20221F]/15 pb-4 gap-2">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[#B76E50] font-sans font-semibold mb-1">
                From the District Archive
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#20221F]">
                Featured Cultural Sanctuaries
              </h2>
            </div>
            <button
              onClick={onExploreMap}
              className="text-xs uppercase font-sans font-semibold text-[#254D3B] hover:text-[#20221F] underline"
            >
              View all on map →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map(item => (
              <div
                key={item.id}
                onClick={() => onOpenDetail ? onOpenDetail(item.id) : onExploreMap()}
                className="border border-[#20221F]/20 p-5 bg-[#EAE6DC]/30 hover:bg-[#EAE6DC]/70 cursor-pointer transition-colors space-y-4 group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-44 overflow-hidden border border-[#20221F]/10">
                    <ImageWithFallback
                      src={item.image_url}
                      alt={item.name}
                      height="h-44"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#B76E50] font-semibold font-sans">
                      {item.type}
                    </span>
                    <span className="text-[#20221F]/30">•</span>
                    <span className="text-[10px] uppercase tracking-wider text-[#254D3B] font-semibold font-sans">
                      {item.art_form || item.status}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl text-[#20221F] group-hover:text-[#254D3B] transition-colors leading-snug">
                    {item.name}
                  </h3>

                  {item.description && (
                    <p className="font-sans text-xs text-[#20221F]/70 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[#20221F]/10 text-xs text-[#254D3B] font-semibold underline font-sans">
                  Read Cultural Story →
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-[#20221F]/20 py-8 px-6 text-center text-xs font-sans text-[#20221F]/60">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>LOKA — Thrissur District Cultural Cartography</span>
          <span>OpenStreetMap &copy; contributors • CARTO • Esri</span>
        </div>
      </footer>
    </div>
  );
}
