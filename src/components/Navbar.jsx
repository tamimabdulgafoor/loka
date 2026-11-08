import React, { useState } from 'react';

export default function Navbar({ currentRoute, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isMapActive = currentRoute === '/map' || currentRoute.startsWith('/map');
  const isHomeActive = currentRoute === '/';
  const isContributeActive = currentRoute === '/contribute';

  const handleNav = (path) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-[#DED5C5] bg-[#F5F2EA] px-4 sm:px-6 py-3.5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => handleNav('/')}
          className="cursor-pointer select-none group flex items-baseline gap-2.5 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B] rounded-[2px]"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleNav('/'); }}
        >
          <span className="font-serif text-2xl font-bold tracking-wider text-[#20221F] group-hover:text-[#254D3B] transition-colors">
            LOKA
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#B76E50] font-sans font-semibold">
            Thrissur Cultural Map
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 text-xs font-sans font-medium">
          <button
            onClick={() => handleNav('/')}
            className={`px-4 py-2 min-h-[40px] transition-colors border rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B] focus-visible:outline-offset-2 ${
              isHomeActive
                ? 'bg-[#20221F] text-[#F5F2EA] border-[#20221F]'
                : 'text-[#20221F] border-transparent hover:border-[#DED5C5] hover:bg-[#EAE6DC]'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNav('/map')}
            className={`px-4 py-2 min-h-[40px] transition-colors border rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B] focus-visible:outline-offset-2 ${
              isMapActive
                ? 'bg-[#20221F] text-[#F5F2EA] border-[#20221F]'
                : 'text-[#20221F] border-transparent hover:border-[#DED5C5] hover:bg-[#EAE6DC]'
            }`}
          >
            Explore Map
          </button>

          <button
            onClick={() => handleNav('/contribute')}
            className={`px-4 py-2 min-h-[40px] transition-colors border rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B] focus-visible:outline-offset-2 ${
              isContributeActive
                ? 'bg-[#20221F] text-[#F5F2EA] border-[#20221F]'
                : 'text-[#20221F] border-transparent hover:border-[#DED5C5] hover:bg-[#EAE6DC]'
            }`}
          >
            Contribute
          </button>
        </nav>

        {/* Mobile Menu Toggle (min 44px tap target) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="w-11 h-11 flex items-center justify-center border border-[#DED5C5] rounded-[2px] text-[#20221F] hover:bg-[#EAE6DC] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B]"
          >
            {mobileMenuOpen ? (
              <span className="text-lg leading-none font-sans">✕</span>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 pb-2 border-t border-[#DED5C5] mt-3 space-y-1.5 font-sans text-sm">
          <button
            onClick={() => handleNav('/')}
            className={`w-full text-left px-4 py-3 min-h-[44px] flex items-center transition-colors border rounded-[2px] ${
              isHomeActive
                ? 'bg-[#20221F] text-[#F5F2EA] border-[#20221F]'
                : 'text-[#20221F] border-transparent hover:bg-[#EAE6DC]'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNav('/map')}
            className={`w-full text-left px-4 py-3 min-h-[44px] flex items-center transition-colors border rounded-[2px] ${
              isMapActive
                ? 'bg-[#20221F] text-[#F5F2EA] border-[#20221F]'
                : 'text-[#20221F] border-transparent hover:bg-[#EAE6DC]'
            }`}
          >
            Explore Map
          </button>

          <button
            onClick={() => handleNav('/contribute')}
            className={`w-full text-left px-4 py-3 min-h-[44px] flex items-center transition-colors border rounded-[2px] ${
              isContributeActive
                ? 'bg-[#20221F] text-[#F5F2EA] border-[#20221F]'
                : 'text-[#20221F] border-transparent hover:bg-[#EAE6DC]'
            }`}
          >
            Contribute
          </button>
        </div>
      )}
    </header>
  );
}
