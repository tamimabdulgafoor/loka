import React, { useEffect, useRef } from 'react';

export default function MiniMap({ listing }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  const hasCoords = 
    listing &&
    listing.lat !== null && listing.lat !== undefined &&
    listing.lng !== null && listing.lng !== undefined &&
    !isNaN(Number(listing.lat)) && !isNaN(Number(listing.lng));

  useEffect(() => {
    if (!hasCoords || !containerRef.current) return;
    if (mapRef.current) return;
    const L = window.L;
    if (!L) return;

    const lat = Number(listing.lat);
    const lng = Number(listing.lng);

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 14,
      zoomControl: false,
      dragging: false,
      touchZoom: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      attributionControl: false
    });

    // Standard OSM tile layer (styled dark via .leaflet-tile-pane in CSS)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18
    }).addTo(map);

    const isVerified = listing.status === 'verified';
    const dotColor = isVerified ? '#F5F2EA' : '#B76E50';
    const borderColor = isVerified ? '#254D3B' : '#F5F2EA';

    const icon = L.divIcon({
      html: `
        <div style="
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: ${dotColor};
          border: 2px solid ${borderColor};
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
        "></div>
      `,
      className: 'loka-minimap-marker',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    const marker = L.marker([lat, lng], { icon }).addTo(map);

    marker.bindTooltip(listing.name, {
      permanent: true,
      direction: 'top',
      offset: [0, -8],
      className: 'editorial-tooltip',
      opacity: 1
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [hasCoords, listing]);

  if (!hasCoords) {
    return (
      <div className="w-full h-44 bg-[#141816] border border-[#254D3B] flex flex-col items-center justify-center p-4 text-center">
        <span className="text-xs uppercase tracking-widest text-[#A7B99A] font-sans font-medium">
          Coordinates unpinned
        </span>
        <span className="text-[11px] text-[#F5F2EA]/50 font-sans mt-1">
          This cultural listing does not have geographic coordinates.
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-48 bg-[#141816] border border-[#254D3B] overflow-hidden relative">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-2 right-2 z-[400] text-[9px] uppercase tracking-wider text-[#A7B99A] bg-[#202722]/80 px-2 py-0.5 border border-[#254D3B]/40 font-mono">
        {Number(listing.lat).toFixed(4)}, {Number(listing.lng).toFixed(4)}
      </div>
    </div>
  );
}

