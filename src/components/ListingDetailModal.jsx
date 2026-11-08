import React, { useState } from 'react';
import { 
  X, MapPin, Calendar, ShieldCheck, Compass, ExternalLink, 
  Sparkles, Tag, Volume2, VolumeX, AlertCircle, CheckCircle2 
} from 'lucide-react';

export default function ListingDetailModal({ listing, onClose }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!listing) return null;

  const isCommunity = Boolean(listing.id?.startsWith('sub-'));
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${listing.coordinates[0]},${listing.coordinates[1]}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image & Badges */}
        <div className="relative h-64 sm:h-72 w-full bg-stone-900 flex-shrink-0">
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110 cursor-pointer shadow-lg z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on Image */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wide shadow-md">
              {listing.category}
            </span>
            {isCommunity && (
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                Community Verified
              </span>
            )}
          </div>

          {/* Title & Panchayat */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium mb-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{listing.panchayat}, Thrissur District</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight drop-shadow-md">
              {listing.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-stone-700">
          {/* Summary */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-stone-800 leading-relaxed font-medium">
            {listing.summary}
          </div>

          {/* Audio Atmosphere Player */}
          <div className="p-4 rounded-2xl bg-stone-900 text-stone-100 flex items-center justify-between gap-4 border border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                {isPlayingAudio ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5 text-stone-400" />}
              </div>
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Atmospheric Soundscape
                </div>
                <div className="text-xs text-stone-300">
                  {isPlayingAudio ? "Playing Chenda Melam & Nila breeze ambiance..." : "Experience the acoustic ambience"}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors"
            >
              {isPlayingAudio ? "Pause" : "Play Sound"}
            </button>
          </div>

          {/* Cultural Significance & History */}
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Living Heritage & Cultural Significance
            </h3>
            <p className="text-stone-600 leading-relaxed">
              {listing.culturalSignificance}
            </p>
          </div>

          {/* Key Heritage Highlights */}
          {listing.heritageHighlights && listing.heritageHighlights.length > 0 && (
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2.5">
                Heritage Highlights & Ritual Observances
              </h3>
              <ul className="space-y-2">
                {listing.heritageHighlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-stone-600">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Timing & Etiquette */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-1.5 font-bold text-stone-900 mb-1 text-xs uppercase tracking-wide">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Best Time to Visit
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {listing.bestTimeToVisit}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-1.5 font-bold text-stone-900 mb-1 text-xs uppercase tracking-wide">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Cultural Etiquette & Respect
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {listing.etiquette}
              </p>
            </div>
          </div>

          {/* Tags */}
          {listing.tags && listing.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {listing.tags.map(tag => (
                <span 
                  key={tag}
                  className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 text-xs flex items-center gap-1"
                >
                  <Tag className="w-3 h-3 text-stone-400" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Contributor / Verification Footer */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-500">
            <div>
              <span>Documented by: </span>
              <span className="font-semibold text-stone-700">{listing.submittedBy || "District Cultural Archivist"}</span>
            </div>
            
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold transition-colors"
            >
              <span>Get Directions</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

