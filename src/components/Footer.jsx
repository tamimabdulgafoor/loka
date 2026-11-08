import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-[#DED5C5] bg-[#F5F2EA] py-8 px-4 sm:px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-baseline justify-between gap-4 font-sans text-xs text-[#20221F]/70">
        <div className="space-y-1 max-w-[70ch]">
          <div className="font-serif text-lg font-normal text-[#20221F] tracking-wide">
            LOKA, Thrissur Cultural Map
          </div>
          <p className="text-xs text-[#B76E50] font-medium">
            Community listings are unverified until reviewed.
          </p>
        </div>

        <div className="max-w-[70ch] text-left md:text-right text-[11px] text-[#20221F]/60 leading-relaxed">
          Map © OpenStreetMap contributors. Photos from Wikimedia Commons, credited on each listing.
        </div>
      </div>
    </footer>
  );
}
