import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import MapExplorer from './components/MapExplorer';
import ListingDetailPage from './components/ListingDetailPage';
import ContributePage from './components/ContributePage';
import AdminPage from './components/AdminPage';
import NotFoundPage from './components/NotFoundPage';
import rawListingsData from './data/listings.json';
import { getApprovedCommunityListings } from './utils/submissionsStorage';

export default function App() {
  // Parse current route and parameters from window.location
  const parseCurrentLocation = () => {
    let path = window.location.pathname;
    const hash = window.location.hash.replace('#', '');
    if (hash && (hash.startsWith('/') || hash.startsWith('/listing/') || hash === 'admin' || hash === '/admin' || hash === 'map' || hash === 'contribute')) {
      path = hash.startsWith('/') ? hash : `/${hash}`;
    }

    if (path.startsWith('/listing/')) {
      const id = path.replace('/listing/', '').trim();
      return { route: '/listing/:id', id, path };
    }
    if (path === '/' || path === '') return { route: '/', id: null, path: '/' };
    if (path === '/map') return { route: '/map', id: null, path: '/map' };
    if (path === '/contribute') return { route: '/contribute', id: null, path: '/contribute' };
    if (path === '/admin') return { route: '/admin', id: null, path: '/admin' };
    return { route: '404', id: null, path };
  };

  const [currentLoc, setCurrentLoc] = useState(parseCurrentLocation);
  const [filterState, setFilterState] = useState({
    searchQuery: '',
    selectedType: 'all',
    selectedArtForm: 'all',
    dateFilter: 'all'
  });
  const [isLoading, setIsLoading] = useState(false);

  // Approved community submissions loaded from localStorage
  const [approvedSubmissions, setApprovedSubmissions] = useState(getApprovedCommunityListings);

  // Reactive listener for moderation changes in localStorage
  useEffect(() => {
    const handleSubmissionsUpdate = () => {
      setApprovedSubmissions(getApprovedCommunityListings());
    };

    window.addEventListener('loka_submissions_updated', handleSubmissionsUpdate);
    window.addEventListener('storage', handleSubmissionsUpdate);

    return () => {
      window.removeEventListener('loka_submissions_updated', handleSubmissionsUpdate);
      window.removeEventListener('storage', handleSubmissionsUpdate);
    };
  }, []);

  // Merge base listings with approved community submissions
  const combinedListings = useMemo(() => {
    return [...rawListingsData, ...approvedSubmissions];
  }, [approvedSubmissions]);

  // Reactive page document title based on route and listing data
  useEffect(() => {
    if (currentLoc.route === '/') {
      document.title = 'LOKA — Thrissur Cultural Map';
    } else if (currentLoc.route === '/map') {
      document.title = 'Explore Cultural Map — LOKA';
    } else if (currentLoc.route === '/contribute') {
      document.title = 'Contribute a Cultural Listing — LOKA';
    } else if (currentLoc.route === '/admin') {
      document.title = 'Curatorial Admin Console — LOKA';
    } else if (currentLoc.route === '/listing/:id') {
      const match = combinedListings.find(l => l.id === currentLoc.id);
      document.title = match ? `${match.name} — LOKA` : 'Listing Not Found — LOKA';
    } else {
      document.title = 'Page Not Found — LOKA';
    }
  }, [currentLoc, combinedListings]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentLoc(parseCurrentLocation());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    try {
      window.history.pushState(null, '', path);
    } catch {
      window.location.hash = path;
    }
    setCurrentLoc(parseCurrentLocation());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetail = (id) => {
    navigateTo(`/listing/${id}`);
  };

  const handleBackToMap = () => {
    navigateTo('/map');
  };

  const isPublicPage = currentLoc.route !== '/admin';

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EA] text-[#20221F] selection:bg-[#254D3B]/20">
      {/* Simple Top Bar on All Pages (No Admin link in public nav) */}
      <Navbar
        currentRoute={currentLoc.path}
        onNavigate={navigateTo}
      />

      {/* Main Route Content */}
      <main className="flex-1 flex flex-col min-h-0">
        {currentLoc.route === '/' && (
          <LandingPage
            onExploreMap={() => navigateTo('/map')}
            onOpenContribute={() => navigateTo('/contribute')}
            onOpenDetail={handleOpenDetail}
            listings={combinedListings}
          />
        )}

        {currentLoc.route === '/map' && (
          <MapExplorer
            rawListings={combinedListings}
            isLoading={isLoading}
            onOpenDetail={handleOpenDetail}
            filterState={filterState}
            onFilterChange={setFilterState}
          />
        )}

        {currentLoc.route === '/listing/:id' && (
          <ListingDetailPage
            listingId={currentLoc.id}
            allListings={combinedListings}
            onNavigate={navigateTo}
            onBackToMap={handleBackToMap}
          />
        )}

        {currentLoc.route === '/contribute' && (
          <ContributePage
            onNavigate={navigateTo}
          />
        )}

        {currentLoc.route === '/admin' && (
          <AdminPage
            onNavigate={navigateTo}
          />
        )}

        {currentLoc.route === '404' && (
          <NotFoundPage
            onNavigate={navigateTo}
          />
        )}
      </main>

      {/* Editorial Footer on all public pages (never links to /admin) */}
      {isPublicPage && <Footer />}
    </div>
  );
}
