import React, { useEffect, useRef, useState, useMemo } from 'react';
import ImageWithFallback from './ImageWithFallback';
import thrissurBoundaryRaw from '../data/thrissur-boundary.geojson?raw';

const thrissurBoundary = JSON.parse(thrissurBoundaryRaw);

// Inverted polygon masking outside Thrissur district
const worldMaskGeoJSON = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [
      // Outer ring: World covering rectangle
      [
        [-180, -85],
        [180, -85],
        [180, 85],
        [-180, 85],
        [-180, -85]
      ],
      // Hole: Thrissur district boundary ring
      thrissurBoundary.geometry.coordinates[0]
    ]
  }
};

function createMarkerIcon(L, isVerified, isSelected) {
  const dotColor = isVerified ? '#F5F2EA' : '#B76E50';
  const borderColor = isVerified ? '#254D3B' : '#F5F2EA';

  if (isSelected) {
    return L.divIcon({
      html: `
        <div style="
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background-color: ${dotColor};
          border: 2.5px solid ${borderColor};
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
          cursor: pointer;
        "></div>
      `,
      className: 'loka-selected-marker',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -11],
      tooltipAnchor: [11, 0]
    });
  }

  return L.divIcon({
    html: `
      <div style="
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: ${dotColor};
        border: 2px solid ${borderColor};
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
        cursor: pointer;
      "></div>
    `,
    className: 'loka-circular-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
    tooltipAnchor: [8, 0]
  });
}

function bindMarkerTooltip(marker, name, zoom) {
  marker.unbindTooltip();
  if (zoom >= 12) {
    marker.bindTooltip(name, {
      permanent: true,
      direction: 'right',
      offset: [10, 0],
      className: 'editorial-label-permanent',
      opacity: 1
    });
  } else {
    marker.bindTooltip(name, {
      permanent: false,
      direction: 'top',
      offset: [0, -8],
      className: 'editorial-tooltip',
      opacity: 1
    });
  }
}

export default function MapExplorer({ 
  rawListings = [], 
  isLoading = false,
  onOpenDetail,
  filterState = {},
  onFilterChange
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const clusterGroupRef = useRef(null);
  const boundaryBoundsRef = useRef(null);
  const markerLookupRef = useRef(new Map());

  const [selectedId, setSelectedId] = useState(null);

  // Active filter state: supports internal state and synchronizes with filterState prop
  const [internalFilters, setInternalFilters] = useState({
    searchQuery: filterState?.searchQuery || '',
    selectedType: filterState?.selectedType || 'all',
    selectedArtForm: filterState?.selectedArtForm || 'all',
    dateFilter: filterState?.dateFilter || 'all'
  });

  // Sync internal state if parent filterState changes
  useEffect(() => {
    if (filterState) {
      setInternalFilters(prev => ({
        ...prev,
        ...filterState
      }));
    }
  }, [filterState]);

  const searchQuery = internalFilters.searchQuery;
  const selectedType = internalFilters.selectedType;
  const selectedArtForm = internalFilters.selectedArtForm;
  const dateFilter = internalFilters.dateFilter;

  const updateFilters = (newFilters) => {
    setInternalFilters(prev => {
      const next = { ...prev, ...newFilters };
      if (onFilterChange) {
        onFilterChange(next);
      }
      return next;
    });
  };

  const handleClearFilters = () => {
    updateFilters({
      searchQuery: '',
      selectedType: 'all',
      selectedArtForm: 'all',
      dateFilter: 'all'
    });
  };

  const hasActiveFilters = 
    searchQuery.trim() !== '' || 
    selectedType !== 'all' || 
    selectedArtForm !== 'all' || 
    dateFilter !== 'all';

  // Public listings: status 'verified' or 'community'
  const publicListings = useMemo(() => {
    return (rawListings || []).filter(item => 
      item && (item.status === 'verified' || item.status === 'community')
    );
  }, [rawListings]);

  // Art form dropdown options built dynamically from listings
  const artFormOptions = useMemo(() => {
    const set = new Set();
    publicListings.forEach(item => {
      if (item.art_form && item.art_form.trim()) {
        set.add(item.art_form.trim());
      }
    });
    return Array.from(set).sort();
  }, [publicListings]);

  // Combined search + type + art_form + date/season filter
  const filteredListings = useMemo(() => {
    return publicListings.filter(item => {
      // 1. Search box matches name, art_form, description, cultural_significance
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.art_form && item.art_form.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.cultural_significance && item.cultural_significance.toLowerCase().includes(q));

      // 2. Type filter
      const matchType = selectedType === 'all' || 
        (item.type && item.type.toLowerCase() === selectedType.toLowerCase());

      // 3. Art form filter
      const matchArtForm = selectedArtForm === 'all' || 
        (item.art_form && item.art_form.trim() === selectedArtForm);

      // 4. Date/season filter: All, Has a known season, Date unconfirmed
      let matchDate = true;
      const isUnconfirmed = !item.date_or_season || 
        item.date_or_season.toLowerCase() === 'unconfirmed' || 
        item.date_or_season.toLowerCase() === 'unknown';

      if (dateFilter === 'known') {
        matchDate = !isUnconfirmed;
      } else if (dateFilter === 'unconfirmed') {
        matchDate = isUnconfirmed;
      }

      return matchSearch && matchType && matchArtForm && matchDate;
    });
  }, [publicListings, searchQuery, selectedType, selectedArtForm, dateFilter]);

  // Helper to scroll list to matching card
  const scrollToListing = (id) => {
    const cardEl = document.getElementById(`listing-card-${id}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // 1. Initialize map on mount (styling unchanged)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;
    const L = window.L;
    if (!L) return;

    // Create base map with zoomSnap 0.25 and maxZoom 18
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      zoomSnap: 0.25,
      maxZoom: 18
    });

    // TILES: Standard OSM layer with dark CSS filter on .leaflet-tile-pane
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);

    // MASK: Outside-district mask at fillOpacity 0.82
    map.createPane('maskPane');
    map.getPane('maskPane').style.zIndex = 350;
    map.getPane('maskPane').style.pointerEvents = 'none';

    L.geoJSON(worldMaskGeoJSON, {
      pane: 'maskPane',
      style: {
        stroke: false,
        weight: 0,
        color: 'transparent',
        fillColor: '#141816',
        fillOpacity: 0.82
      },
      interactive: false
    }).addTo(map);

    // DISTRICT TINT & BOUNDARY: 1.5px #A7B99A line, filled with #A7B99A at 0.06 fillOpacity
    map.createPane('boundaryPane');
    map.getPane('boundaryPane').style.zIndex = 360;
    map.getPane('boundaryPane').style.pointerEvents = 'none';

    const boundaryLayer = L.geoJSON(thrissurBoundary, {
      pane: 'boundaryPane',
      style: {
        color: '#A7B99A',
        weight: 1.5,
        opacity: 0.9,
        fill: true,
        fillColor: '#A7B99A',
        fillOpacity: 0.06,
        lineCap: 'round',
        lineJoin: 'round'
      },
      interactive: false
    }).addTo(map);

    const boundaryBounds = boundaryLayer.getBounds();
    boundaryBoundsRef.current = boundaryBounds;

    // FIT PADDING: fitBounds padding [60, 60] on load
    map.invalidateSize();
    map.fitBounds(boundaryBounds, { padding: [60, 60], animate: false });

    // minZoom = fitted zoom - 1; maxBounds padded by about 25% with viscosity 0.9
    const fitZoom = map.getZoom();
    map.setMinZoom(fitZoom - 1);
    const paddedMaxBounds = boundaryBounds.pad(0.25);
    map.setMaxBounds(paddedMaxBounds);
    map.options.maxBoundsViscosity = 0.9;

    // CLUSTERS: maxClusterRadius 40, and disableClusteringAtZoom 12
    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      spiderfyOnMaxZoom: true,
      removeOutsideVisibleBounds: false,
      maxClusterRadius: 40,
      disableClusteringAtZoom: 12,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div>${count}</div>`,
          className: 'marker-cluster',
          iconSize: L.point(40, 40)
        });
      }
    });

    // Toggle permanent labels vs hover tooltips at zoom 12
    map.on('zoomend', () => {
      const currentZoom = map.getZoom();
      markerLookupRef.current.forEach((marker, id) => {
        const item = publicListings.find(l => l.id === id);
        if (item) {
          bindMarkerTooltip(marker, item.name, currentZoom);
        }
      });
    });

    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Populate marker cluster group whenever filteredListings change
  useEffect(() => {
    const L = window.L;
    const clusterGroup = clusterGroupRef.current;
    const map = mapInstanceRef.current;
    if (!L || !clusterGroup || !map) return;

    clusterGroup.clearLayers();
    markerLookupRef.current.clear();

    const currentZoom = map.getZoom();

    filteredListings.forEach(item => {
      // RULE: Listings with null lat/lng appear in the list but not as markers
      if (
        item.lat === null || item.lat === undefined ||
        item.lng === null || item.lng === undefined ||
        isNaN(Number(item.lat)) || isNaN(Number(item.lng))
      ) {
        return;
      }

      const isVerified = item.status === 'verified';
      const isSelected = selectedId === item.id;
      const icon = createMarkerIcon(L, isVerified, isSelected);

      const marker = L.marker([Number(item.lat), Number(item.lng)], { icon });

      // Apply zoom-dependent tooltip / label
      bindMarkerTooltip(marker, item.name, currentZoom);

      // Popup with dark theme matching map aesthetic
      const badgeColor = isVerified ? '#A7B99A' : '#B76E50';
      const popupHtml = `
        <div style="width: 220px; font-family: 'DM Sans', sans-serif; padding: 12px; background: #202722; color: #F5F2EA;">
          <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: ${badgeColor}; font-weight: 700; margin-bottom: 2px;">
            ${item.type} • ${item.status}
          </div>
          <h4 style="font-family: 'Cormorant Garamond', serif; font-size: 17px; line-height: 1.2; color: #F5F2EA; margin: 0 0 4px 0; font-weight: 600;">
            ${item.name}
          </h4>
          <div style="font-size: 11px; color: #A7B99A; margin-bottom: 6px; font-weight: 500;">
            ${item.art_form || ''}
          </div>
          <button 
            id="popup-btn-${item.id}"
            style="
              width: 100%;
              background: #254D3B;
              color: #F5F2EA;
              border: 1px solid #A7B99A;
              padding: 5px 8px;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              font-weight: 600;
              cursor: pointer;
            "
          >
            View Full Details →
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 240 });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${item.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onOpenDetail) onOpenDetail(item.id);
          };
        }
      });

      // Marker click: highlight and scroll to matching listing in left panel
      marker.on('click', () => {
        setSelectedId(item.id);
        scrollToListing(item.id);
      });

      clusterGroup.addLayer(marker);
      markerLookupRef.current.set(item.id, marker);
    });
  }, [filteredListings, selectedId, onOpenDetail]);

  // Update marker icons when selectedId changes
  useEffect(() => {
    const L = window.L;
    if (!L) return;

    markerLookupRef.current.forEach((marker, id) => {
      const item = publicListings.find(l => l.id === id);
      if (item) {
        const isVerified = item.status === 'verified';
        const isSelected = selectedId === id;
        marker.setIcon(createMarkerIcon(L, isVerified, isSelected));
      }
    });
  }, [selectedId, publicListings]);

  // Click on listing in left panel: highlight, pan to marker, reveal from cluster
  const handleListingClick = (item) => {
    setSelectedId(item.id);

    const marker = markerLookupRef.current.get(item.id);
    const map = mapInstanceRef.current;
    const clusterGroup = clusterGroupRef.current;

    if (marker && map && clusterGroup) {
      clusterGroup.zoomToShowLayer(marker, () => {
        map.panTo([Number(item.lat), Number(item.lng)], { animate: true });
        marker.openPopup();
      });
    }
  };

  // Fit District button
  const handleFitDistrict = () => {
    const map = mapInstanceRef.current;
    const bounds = boundaryBoundsRef.current;
    if (map && bounds) {
      map.invalidateSize();
      map.fitBounds(bounds, { padding: [60, 60], animate: true });
      const fitZoom = map.getZoom();
      map.setMinZoom(fitZoom - 1);
      const padded = bounds.pad(0.25);
      map.setMaxBounds(padded);
      map.options.maxBoundsViscosity = 0.9;
    }
  };

  const typesList = ['all', 'place', 'festival', 'performance', 'craft', 'artist'];

  return (
    <div className="flex flex-col flex-1 bg-[#F5F2EA] text-[#20221F]">
      {/* Search & Comprehensive Filters Bar */}
      <div className="border-b border-[#20221F]/20 bg-[#EAE6DC]/60 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          {/* Top Row: Search input + Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
            {/* Search Input: name, art_form, description, cultural_significance */}
            <div className="relative flex-1 max-w-lg">
              <input
                type="text"
                placeholder="Search name, art form, description, significance..."
                value={searchQuery}
                onChange={(e) => updateFilters({ searchQuery: e.target.value })}
                className="w-full px-3 py-2 bg-[#F5F2EA] border border-[#20221F]/40 text-[#20221F] placeholder-[#20221F]/40 focus:outline-none focus:border-[#20221F]"
              />
              {searchQuery && (
                <button
                  onClick={() => updateFilters({ searchQuery: '' })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#20221F]/50 hover:text-[#20221F] text-base"
                >
                  ×
                </button>
              )}
            </div>

            {/* Clear filters button and Fit District */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="px-2.5 py-1.5 bg-[#20221F]/10 hover:bg-[#20221F] hover:text-[#F5F2EA] border border-[#20221F]/30 text-[#20221F] transition-colors font-medium text-[11px]"
                >
                  Clear filters
                </button>
              )}

              <button
                onClick={handleFitDistrict}
                className="px-2.5 py-1.5 border border-[#20221F] text-[#20221F] hover:bg-[#20221F] hover:text-[#F5F2EA] transition-colors text-[11px] font-medium"
              >
                Fit District
              </button>
            </div>
          </div>

          {/* Bottom Row: Type Buttons, Art Form Dropdown, Date/Season Filter */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-sans pt-1 border-t border-[#20221F]/10">
            {/* Type Buttons: All, Place, Festival, Performance, Craft, Artist */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[10px] uppercase tracking-wider text-[#20221F]/50 mr-1 font-semibold">
                Type:
              </span>
              {typesList.map(t => (
                <button
                  key={t}
                  onClick={() => updateFilters({ selectedType: t })}
                  className={`px-2.5 py-1 capitalize font-medium transition-colors border text-[11px] ${
                    selectedType.toLowerCase() === t.toLowerCase()
                      ? 'bg-[#20221F] text-[#F5F2EA] border-[#20221F]'
                      : 'bg-[#F5F2EA] text-[#20221F] border-[#20221F]/20 hover:border-[#20221F]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Art Form Dropdown built dynamically from listings */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="art-form-select" className="text-[10px] uppercase tracking-wider text-[#20221F]/50 font-semibold">
                Art Form:
              </label>
              <select
                id="art-form-select"
                value={selectedArtForm}
                onChange={(e) => updateFilters({ selectedArtForm: e.target.value })}
                className="px-2.5 py-1 bg-[#F5F2EA] border border-[#20221F]/30 text-[#20221F] text-[11px] focus:outline-none focus:border-[#20221F]"
              >
                <option value="all">All Art Forms</option>
                {artFormOptions.map(af => (
                  <option key={af} value={af}>{af}</option>
                ))}
              </select>
            </div>

            {/* Date/Season Filter: All, Has a known season, Date unconfirmed */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="date-season-select" className="text-[10px] uppercase tracking-wider text-[#20221F]/50 font-semibold">
                Season:
              </label>
              <select
                id="date-season-select"
                value={dateFilter}
                onChange={(e) => updateFilters({ dateFilter: e.target.value })}
                className="px-2.5 py-1 bg-[#F5F2EA] border border-[#20221F]/30 text-[#20221F] text-[11px] focus:outline-none focus:border-[#20221F]"
              >
                <option value="all">All Seasons</option>
                <option value="known">Has a known season</option>
                <option value="unconfirmed">Date unconfirmed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Split Main View: List + Map */}
      <div className="flex-1 flex flex-col-reverse lg:flex-row relative">
        {/* Listing Directory Panel */}
        <aside className="w-full lg:w-[420px] xl:w-[450px] bg-[#F5F2EA] border-t lg:border-t-0 lg:border-r border-[#20221F] flex flex-col h-[500px] lg:h-[calc(100vh-130px)] z-10">
          <div className="p-3 border-b border-[#20221F]/15 flex items-center justify-between text-xs font-sans text-[#20221F]/60">
            <span>
              Showing <strong className="text-[#20221F]">{filteredListings.length}</strong> public listings
            </span>
            <span className="text-[11px]">
              Click entry to pan & inspect
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#20221F]/15">
            {isLoading ? (
              <div className="p-12 text-center space-y-3 font-sans">
                <div className="inline-block w-6 h-6 border-2 border-[#20221F] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-[#20221F]/60">Loading cultural archive...</p>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="p-10 text-center space-y-4 font-sans">
                <p className="font-serif text-xl text-[#20221F]">No listings match your search</p>
                <p className="text-xs text-[#20221F]/60 max-w-xs mx-auto leading-relaxed">
                  Try adjusting keywords or reset your filters to browse the complete directory.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-3.5 py-1.5 bg-[#20221F] text-[#F5F2EA] text-xs font-semibold uppercase tracking-wider hover:bg-[#254D3B] transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredListings.map(item => {
                const isSelected = selectedId === item.id;
                const hasCoords = item.lat !== null && item.lat !== undefined &&
                                  item.lng !== null && item.lng !== undefined;

                return (
                  <article
                    id={`listing-card-${item.id}`}
                    key={item.id}
                    onClick={() => handleListingClick(item)}
                    className={`p-4 transition-colors cursor-pointer text-left ${
                      isSelected
                        ? 'bg-[#EAE6DC] border-l-4 border-l-[#20221F]'
                        : 'hover:bg-[#EAE6DC]/50'
                    }`}
                  >
                    <div className="flex gap-3.5">
                      {/* Thumbnail or neutral placeholder */}
                      <div className="w-16 h-16 flex-shrink-0">
                        <ImageWithFallback
                          src={item.image_url}
                          alt={item.name}
                          height="h-16"
                          className="border border-[#20221F]/20"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase tracking-wider font-sans font-semibold text-[#B76E50]">
                            {item.type}
                          </span>
                          <span className="text-[#20221F]/30">•</span>
                          <span className={`text-[10px] uppercase tracking-wider font-sans font-medium ${
                            item.status === 'verified' ? 'text-[#254D3B]' : 'text-[#B76E50]'
                          }`}>
                            {item.status}
                          </span>
                          {!hasCoords && (
                            <span className="ml-auto text-[9px] font-sans text-[#20221F]/50 border border-[#20221F]/20 px-1">
                              Unpinned
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif text-base leading-tight text-[#20221F] truncate font-normal">
                          {item.name}
                        </h3>

                        {item.art_form && (
                          <div className="text-xs font-sans text-[#254D3B] mt-0.5 truncate">
                            {item.art_form}
                          </div>
                        )}

                        {item.description && (
                          <p className="text-xs text-[#20221F]/70 font-sans mt-1 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}

                        <div className="mt-2.5 flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onOpenDetail) {
                                onOpenDetail(item.id);
                              }
                            }}
                            className="text-[11px] uppercase font-sans font-semibold text-[#254D3B] hover:text-[#20221F] underline"
                          >
                            View full details →
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </aside>

        {/* Map Canvas with 1px #254D3B border */}
        <div className="flex-1 relative min-h-[420px] lg:min-h-0 bg-[#141816] border border-[#254D3B] overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full bg-[#141816]" />

          {/* Bottom-left Editorial Framing (no box, no shadow) */}
          <div className="absolute bottom-6 left-6 z-[400] pointer-events-none select-none">
            <div className="font-serif text-[28px] leading-none text-[#F5F2EA] font-normal tracking-wide">
              Thrissur District
            </div>
            <div className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#A7B99A] font-semibold mt-1">
              Kerala
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
