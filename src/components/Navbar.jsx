import React from 'react';

export default function Navbar({ currentRoute, onNavigate }) {
  const isMapActive = currentRoute === '/map' || currentRoute.startsWith('/map');
  const isHomeActive = currentRoute === '/';
  const isContributeActive = currentRoute === '/contribute';

  return (
    <header className="border-b border-[#20221F] bg-[#F5F2EA] px-6 py-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => onNavigate('/')}
          className="cursor-pointer select-none group flex items-baseline gap-2.5"
        >
          <span className="font-serif text-2xl font-bold tracking-wider text-[#20221F] group-hover:text-[#254D3B] transition-colors">
            LOKA
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#B76E50] font-sans font-semibold">
            Thrissur Cultural Map
          </span>
        </div>

        {/* Navigation Links: Home, Explore Map, Contribute */}
        <nav className="flex items-center gap-1 sm:gap-3 text-xs font-sans font-medium">
          <button
            onClick={() => onNavigate('/')}
            className={`px-3 py-1.5 transition-colors border ${
              isHomeActive
                ? 'bg-[#20221F] text-[#F5F2EA] border-[#20221F]'
                : 'text-[#20221F] border-transparent hover:border-[#20221F]/30'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('/map')}
            className={`px-3 py-1.5 transition-colors border ${
              isMapActive
                ? 'bg-[#20221F] text-[#F5F2EA] border-[#20221F]'
                : 'text-[#20221F] border-transparent hover:border-[#20221F]/30'
            }`}
          >
            Explore Map
          </button>

          <button
            onClick={() => onNavigate('/contribute')}
            className={`px-3 py-1.5 transition-colors border ${
              isContributeActive
                ? 'bg-[#20221F] text-[#F5F2EA] border-[#20221F]'
                : 'text-[#20221F] border-transparent hover:border-[#20221F]/30'
            }`}
          >
            Contribute
          </button>
        </nav>
      </div>
    </header>
  );
}
