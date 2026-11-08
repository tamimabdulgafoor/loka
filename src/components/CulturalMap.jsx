import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  Search, Filter, MapPin, Sparkles, Compass, Eye, 
  Layers, CheckCircle, ChevronRight, Info, Music
} from 'lucide-react';

const CATEGORIES = [
  "All",
  "Sacred & Heritage",
  "Performing Arts",
  "Artisans & Crafts",
  "Festivals & Melam",
  "Culinary Heritage",
  "Ecology & Agri-Culture"
];

const CATEGORY_COLORS = {
  "Sacred & Heritage": { bg: "#D97706", text: "#FFF", emoji: "🛕" },
  "Performing Arts": { bg: "#7C3AED", text: "#FFF", emoji: "🎭" },
  "Artisans & Crafts": { bg: "#B45309", text: "#FFF", emoji: "🏺" },
  "Festivals & Melam": { bg: "#DC2626", text: "#FFF", emoji: "🥁" },
  "Culinary Heritage": { bg: "#EA580C", text: "#FFF", emoji: "🍲" },
  "Ecology & Agri-Culture": { bg: "#059669", text: "#FFF", emoji: "🌾" },
  "Folklore & Street Culture": { bg: "#DB2777", text: "#FFF", emoji: "🐯" }
};

export default function CulturalMap({ 
  baseListings = [], 
  approvedCommunityListings = [], 
  onSelectListing,
  onOpenSubmit
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [includeCommunity, setIncludeCommunity] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  // Combine base data with approved community submissions
  const allListings = useMemo(() => {
    if (!includeCommunity) return baseListings;
    return [...baseListings, ...approvedCommunityListings];
  }, [baseListings, approvedCommunityListings, includeCommunity]);

  // Filter listings
  const filteredListings = useMemo(() => {
    return allListings.filter(item => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        item.title.toLowerCase().includes(q) ||
        item.panchayat.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(q)));
      return matchCat && matchSearch;
    });
  }, [allListings, selectedCategory, searchQuery]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center on Thrissur City / District
    const map = L.map(mapContainerRef.current, {
      center: [10.5276, 76.2144],
      zoom: 11,
      minZoom: 9,
      maxZoom: 18,
      zoomControl: true
    });

    // Tile layer: CartoDB Positron / OSM
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map markers when filteredListings change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    filteredListings.forEach(item => {
      const catConfig = CATEGORY_COLORS[item.category] || { bg: "#D97706", emoji: "📍" };
      const isCommunity = Boolean(item.id?.startsWith('sub-'));

      // Custom HTML Marker Pin
      const iconHtml = `
        <div class="relative group cursor-pointer" style="transform: translate(-50%, -100%);">
          <div class="flex items-center justify-center w-10 h-10 rounded-2xl shadow-lg border-2 border-white transition-all transform hover:scale-125"
               style="background-color: ${catConfig.bg};">
            <span style="font-size: 16px;">${catConfig.emoji}</span>
          </div>
          ${isCommunity ? `
            <div class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" title="Community Verified"></div>
          ` : ''}
          <div class="w-2 h-2 bg-stone-800 rotate-45 mx-auto -mt-1 shadow-sm"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-cultural-pin',
        iconSize: [40, 48],
        iconAnchor: [20, 48],
        popupAnchor: [0, -48]
      });

      const marker = L.marker(item.coordinates, { icon: customIcon });

      // Popup Content
      const popupHtml = `
        <div style="width: 260px; font-family: 'Plus Jakarta Sans', sans-serif;">
          <div style="height: 110px; position: relative; overflow: hidden;">
            <img src="${item.imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="${item.title}" />
            <div style="position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.75); color: #FBBF24; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 600;">
              ${item.category}
            </div>
            ${isCommunity ? '<div style="position: absolute; bottom: 8px; right: 8px; background: #059669; color: white; padding: 2px 6px; border-radius: 6px; font-size: 9px; font-weight: 700;">COMMUNITY VERIFIED</div>' : ''}
          </div>
          <div style="padding: 12px;">
            <div style="font-size: 11px; color: #78716C; margin-bottom: 2px;">📍 ${item.panchayat}</div>
            <h4 style="font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: #1C1917; margin: 0 0 6px 0; line-height: 1.25;">
              ${item.title}
            </h4>
            <p style="font-size: 11px; color: #57534E; margin: 0 0 10px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${item.summary}
            </p>
            <button id="popup-btn-${item.id}" style="width: 100%; background: #D97706; color: white; border: none; padding: 7px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
              View Full Cultural Story →
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300 });

      marker.on('popupopen', () => {
        setSelectedId(item.id);
        const btn = document.getElementById(`popup-btn-${item.id}`);
        if (btn) {
          btn.onclick = () => onSelectListing(item);
        }
      });

      marker.addTo(markersLayer);
    });
  }, [filteredListings, onSelectListing]);

  // Center map on a specific listing
  const handleFocusItem = (item) => {
    setSelectedId(item.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(item.coordinates, 13, { duration: 1.2 });
    }
  };

  const handleResetMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([10.5276, 76.2144], 11, { duration: 1 });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-stone-100 overflow-hidden">
      {/* Top Controls Bar */}
      <div className="bg-white border-b border-stone-200 px-4 py-3 shadow-sm z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search temples, melam, weaving villages, cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Controls: Community toggle & Reset */}
          <div className="flex items-center gap-3 self-end md:self-auto text-xs">
            <label className="inline-flex items-center gap-2 cursor-pointer bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl hover:bg-stone-100 transition-colors">
              <input
                type="checkbox"
                checked={includeCommunity}
                onChange={(e) => setIncludeCommunity(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
              />
              <span className="font-medium text-stone-700">Community Spots</span>
              <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full text-[10px]">
                +{approvedCommunityListings.length}
              </span>
            </label>

            <button
              onClick={handleResetMap}
              className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl font-medium text-stone-700 transition-colors"
            >
              Reset View
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pt-2 pb-1 text-xs no-scrollbar">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            const config = CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {config?.emoji && <span>{config.emoji}</span>}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map + Directory View */}
      <div className="flex-1 flex flex-col-reverse lg:flex-row relative overflow-hidden">
        {/* Sidebar Directory list */}
        <aside className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-r border-stone-200 flex flex-col h-64 lg:h-full z-10 shadow-lg lg:shadow-none">
          <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600">
            <span className="font-semibold text-stone-800">
              {filteredListings.length} Cultural Destinations
            </span>
            <span className="text-[11px] text-stone-500">
              Click to pinpoint on map
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-stone-100 p-2 space-y-2">
            {filteredListings.length === 0 ? (
              <div className="p-6 text-center text-stone-500 text-xs">
                <p className="font-medium text-stone-700">No cultural places found</p>
                <p className="mt-1">Try adjusting your filters or search keywords.</p>
              </div>
            ) : (
              filteredListings.map(item => {
                const isSelected = selectedId === item.id;
                const catConfig = CATEGORY_COLORS[item.category] || { bg: "#D97706", emoji: "📍" };
                const isCommunity = Boolean(item.id?.startsWith('sub-'));

                return (
                  <div
                    key={item.id}
                    onClick={() => handleFocusItem(item)}
                    className={`p-3 rounded-xl transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-400 shadow-sm'
                        : 'bg-stone-50/60 border-stone-100 hover:bg-stone-100/80'
                    }`}
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                            {catConfig.emoji} {item.category}
                          </span>
                          {isCommunity && (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              Community
                            </span>
                          )}
                        </div>

                        <h4 className="font-serif font-bold text-sm text-stone-900 truncate">
                          {item.title}
                        </h4>

                        <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-600 flex-shrink-0" />
                          <span className="truncate">{item.panchayat}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-stone-500 line-clamp-1 flex-1 mr-2">
                        {item.summary}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectListing(item);
                        }}
                        className="text-amber-700 hover:text-amber-900 font-semibold text-xs flex items-center gap-0.5 flex-shrink-0"
                      >
                        Details
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Submit Prompt at bottom of sidebar */}
          <div className="p-3 bg-amber-50/60 border-t border-amber-200/50 flex items-center justify-between text-xs">
            <span className="text-stone-700">Know a hidden cultural spot?</span>
            <button
              onClick={onOpenSubmit}
              className="text-amber-700 hover:text-amber-900 font-bold underline cursor-pointer"
            >
              + Submit Spot
            </button>
          </div>
        </aside>

        {/* Leaflet Map Canvas */}
        <div className="flex-1 relative h-full">
          <div ref={mapContainerRef} className="w-full h-full min-h-[350px]" />

          {/* Floating District Guide Badge */}
          <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-stone-200 text-xs hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-medium text-stone-700">Thrissur District (Cultural Capital)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

