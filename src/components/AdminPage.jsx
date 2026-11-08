import React, { useState, useEffect } from 'react';
import { 
  getSubmissions, 
  updateSubmissionStatus,
  clearSubmissions
} from '../utils/submissionsStorage';
import ImageWithFallback from './ImageWithFallback';

// Demo password stored in a clearly named constant
export const DEMO_ADMIN_PASSWORD = 'loka-admin';

export default function AdminPage({ onNavigate }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('loka_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Submissions state
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'changes_requested'

  // Action modals or inline feedback state
  const [actionItem, setActionItem] = useState(null); // { item, type: 'reject' | 'changes_requested' }
  const [actionReason, setActionReason] = useState('');
  const [actionError, setActionError] = useState('');

  const loadData = () => {
    setSubmissions(getSubmissions());
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === DEMO_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('loka_admin_auth', 'true');
      setPasswordError('');
      loadData();
    } else {
      setPasswordError('Invalid credentials. Please use the demo password provided.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('loka_admin_auth');
    setPasswordInput('');
  };

  const handleResetData = () => {
    const confirmed = window.confirm('Are you sure you want to reset all demo submissions data? This will clear loka_submissions from localStorage.');
    if (confirmed) {
      clearSubmissions();
      loadData();
    }
  };

  const handleApprove = (item) => {
    updateSubmissionStatus(item.id, 'approve', 'Approved by administrator');
    loadData();
  };

  const openActionPrompt = (item, type) => {
    setActionItem({ item, type });
    setActionReason('');
    setActionError('');
  };

  const submitActionWithReason = (e) => {
    e.preventDefault();
    if (!actionReason.trim()) {
      setActionError('A reason is required to reject or request changes.');
      return;
    }

    if (!actionItem) return;

    updateSubmissionStatus(actionItem.item.id, actionItem.type, actionReason);
    setActionItem(null);
    setActionReason('');
    setActionError('');
    loadData();
  };

  // Filter submissions by current tab
  const filteredSubmissions = submissions.filter(item => {
    if (activeTab === 'pending') return item.status === 'pending';
    if (activeTab === 'approved') return item.status === 'approved';
    if (activeTab === 'rejected') return item.status === 'rejected';
    if (activeTab === 'changes_requested') return item.status === 'changes_requested';
    return false;
  });

  const counts = {
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
    changes_requested: submissions.filter(s => s.status === 'changes_requested').length,
  };

  // 1. Password Gate View
  if (!isAuthenticated) {
    return (
      <div className="flex-1 bg-[#F5F2EA] text-[#20221F] flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full border border-[#DED5C5] bg-[#F5F2EA] p-8 sm:p-10 space-y-6 rounded-[2px]">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#B76E50] font-sans font-semibold px-2 py-0.5 border border-[#DED5C5] rounded-[2px] bg-[#EAE6DC]/50">
              Internal Curatorial Access
            </span>
            <h1 className="font-serif text-3xl text-[#20221F] font-normal leading-[1.2]">
              Admin Portal
            </h1>
            <p className="font-sans text-xs text-[#20221F]/70">
              Authenticate to review, approve, or moderate community cultural submissions.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 font-sans text-xs">
            <div className="space-y-1.5">
              <label htmlFor="admin-pass" className="block uppercase tracking-wider font-semibold text-[#20221F]/80 text-[11px]">
                Access Password
              </label>
              <input
                id="admin-pass"
                type="password"
                placeholder="Enter admin password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 min-h-[44px] bg-[#F5F2EA] border border-[#DED5C5] text-[#20221F] rounded-[2px] focus:outline-none focus:border-[#254D3B]"
              />
              {passwordError && (
                <p className="text-[11px] text-[#B76E50] font-medium">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 min-h-[44px] bg-[#254D3B] text-[#F5F2EA] font-sans text-xs font-semibold uppercase tracking-wider hover:bg-[#1a372a] transition-colors rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B]"
            >
              Enter Curatorial Console →
            </button>
          </form>

          {/* Demo Note */}
          <div className="p-3 bg-[#EAE6DC]/70 border-l-2 border-[#B76E50] text-[11px] font-sans text-[#20221F]/80 space-y-1 rounded-[2px]">
            <div className="font-semibold text-[#B76E50]">Demo only, not real security</div>
            <p>
              Demo password: <code className="font-mono bg-[#20221F]/10 px-1.5 py-0.5 font-bold text-[#20221F]">loka-admin</code>
            </p>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('/')}
              className="text-xs font-sans text-[#20221F]/60 hover:text-[#20221F] underline py-1"
            >
              Return to Public Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Admin Console View
  return (
    <div className="flex-1 bg-[#F5F2EA] text-[#20221F] pb-16">
      {/* Top Banner */}
      <div className="border-b border-[#DED5C5] bg-[#EAE6DC]/60 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-[#B76E50] font-semibold">
                Curatorial Console
              </span>
              <span className="text-[#20221F]/30">•</span>
              <span className="text-[10px] text-[#20221F]/60 font-mono">
                Demo only, not real security
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#20221F]">
              Community Submissions Moderation
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleResetData}
              className="px-3 py-2 min-h-[38px] border border-[#B76E50] text-[#B76E50] text-xs font-semibold uppercase tracking-wider hover:bg-[#B76E50] hover:text-[#F5F2EA] transition-colors rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B]"
              title="Clears all community submissions from localStorage"
            >
              Reset demo data
            </button>
            <button
              onClick={() => onNavigate('/map')}
              className="px-3 py-2 min-h-[38px] border border-[#DED5C5] text-[#20221F] text-xs font-medium hover:bg-[#EAE6DC] transition-colors rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B]"
            >
              View Map
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 min-h-[38px] bg-[#20221F] text-[#F5F2EA] text-xs font-medium uppercase tracking-wider hover:bg-[#B76E50] transition-colors rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B]"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-[#DED5C5] pb-2 text-xs font-sans font-medium no-scrollbar">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 border transition-colors flex items-center gap-2 rounded-[2px] min-h-[40px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B] ${
              activeTab === 'pending'
                ? 'bg-[#20221F] text-[#F5F2EA] border-[#20221F]'
                : 'bg-[#F5F2EA] text-[#20221F] border-[#DED5C5] hover:border-[#20221F]'
            }`}
          >
            <span>Pending</span>
            <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded-[2px] ${
              activeTab === 'pending' ? 'bg-[#F5F2EA] text-[#20221F]' : 'bg-[#20221F]/10 text-[#20221F]'
            }`}>
              {counts.pending}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 border transition-colors flex items-center gap-2 rounded-[2px] min-h-[40px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B] ${
              activeTab === 'approved'
                ? 'bg-[#254D3B] text-[#F5F2EA] border-[#254D3B]'
                : 'bg-[#F5F2EA] text-[#20221F] border-[#DED5C5] hover:border-[#20221F]'
            }`}
          >
            <span>Approved</span>
            <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded-[2px] ${
              activeTab === 'approved' ? 'bg-[#F5F2EA] text-[#254D3B]' : 'bg-[#20221F]/10 text-[#20221F]'
            }`}>
              {counts.approved}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 border transition-colors flex items-center gap-2 rounded-[2px] min-h-[40px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B] ${
              activeTab === 'rejected'
                ? 'bg-[#B76E50] text-[#F5F2EA] border-[#B76E50]'
                : 'bg-[#F5F2EA] text-[#20221F] border-[#DED5C5] hover:border-[#20221F]'
            }`}
          >
            <span>Rejected</span>
            <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded-[2px] ${
              activeTab === 'rejected' ? 'bg-[#F5F2EA] text-[#B76E50]' : 'bg-[#20221F]/10 text-[#20221F]'
            }`}>
              {counts.rejected}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('changes_requested')}
            className={`px-4 py-2 border transition-colors flex items-center gap-2 rounded-[2px] min-h-[40px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B] ${
              activeTab === 'changes_requested'
                ? 'bg-amber-800 text-[#F5F2EA] border-amber-800'
                : 'bg-[#F5F2EA] text-[#20221F] border-[#DED5C5] hover:border-[#20221F]'
            }`}
          >
            <span>Changes Requested</span>
            <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded-[2px] ${
              activeTab === 'changes_requested' ? 'bg-[#F5F2EA] text-amber-900' : 'bg-[#20221F]/10 text-[#20221F]'
            }`}>
              {counts.changes_requested}
            </span>
          </button>
        </div>

        {/* Action Reason Modal (for Reject & Request Changes) */}
        {actionItem && (
          <div className="fixed inset-0 bg-[#141816]/75 z-50 flex items-center justify-center p-4">
            <div className="bg-[#F5F2EA] border border-[#DED5C5] max-w-lg w-full p-6 sm:p-8 space-y-4 rounded-[2px]">
              <div className="border-b border-[#DED5C5] pb-3">
                <span className="text-[10px] uppercase tracking-widest text-[#B76E50] font-sans font-semibold">
                  Required Curatorial Reason
                </span>
                <h3 className="font-serif text-2xl text-[#20221F]">
                  {actionItem.type === 'reject' ? 'Reject Submission' : 'Request Changes'}
                </h3>
                <p className="font-sans text-xs text-[#20221F]/70 mt-1">
                  Listing: &ldquo;{actionItem.item.name}&rdquo; ({actionItem.item.id})
                </p>
              </div>

              <form onSubmit={submitActionWithReason} className="space-y-4 font-sans text-xs">
                <div className="space-y-1.5">
                  <label htmlFor="action-reason" className="block uppercase tracking-wider font-semibold text-[#20221F]/80 text-[11px]">
                    Reason / Curatorial Feedback <span className="text-[#B76E50]">*</span>
                  </label>
                  <textarea
                    id="action-reason"
                    rows={4}
                    placeholder={
                      actionItem.type === 'reject'
                        ? 'Explain why this submission does not meet criteria or is outside Thrissur district...'
                        : 'Specify what additional details, sources, or clarifications are requested...'
                    }
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F5F2EA] border border-[#DED5C5] text-[#20221F] rounded-[2px] focus:outline-none focus:border-[#254D3B] leading-relaxed"
                  />
                  {actionError && (
                    <p className="text-[11px] text-[#B76E50] font-medium">{actionError}</p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActionItem(null)}
                    className="px-4 py-2 min-h-[40px] border border-[#DED5C5] text-[#20221F] text-xs font-semibold uppercase tracking-wider hover:bg-[#EAE6DC] transition-colors rounded-[2px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2 min-h-[40px] text-[#F5F2EA] text-xs font-semibold uppercase tracking-wider transition-colors rounded-[2px] ${
                      actionItem.type === 'reject'
                        ? 'bg-[#B76E50] hover:bg-[#8e4c34]'
                        : 'bg-amber-800 hover:bg-amber-900'
                    }`}
                  >
                    Confirm {actionItem.type === 'reject' ? 'Rejection' : 'Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Submissions List */}
        <div className="space-y-6">
          {filteredSubmissions.length === 0 ? (
            <div className="p-16 border border-[#DED5C5] text-center space-y-2 bg-[#EAE6DC]/30 font-sans rounded-[2px]">
              <p className="font-serif text-2xl text-[#20221F]">
                No entries in {activeTab.replace('_', ' ')}
              </p>
              <p className="text-xs text-[#20221F]/60">
                There are no submissions currently categorized under this queue.
              </p>
            </div>
          ) : (
            filteredSubmissions.map(item => {
              const hasCoords = item.lat !== null && item.lat !== undefined && !isNaN(Number(item.lat)) &&
                                item.lng !== null && item.lng !== undefined && !isNaN(Number(item.lng));

              return (
                <div
                  key={item.id}
                  className="border border-[#DED5C5] bg-[#F5F2EA] p-6 space-y-6 transition-all rounded-[2px]"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#DED5C5] pb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] bg-[#EAE6DC] px-2 py-0.5 text-[#20221F] border border-[#DED5C5] rounded-[2px]">
                          ID: {item.id}
                        </span>
                        <span className="text-xs uppercase tracking-wider font-semibold text-[#B76E50]">
                          {item.type}
                        </span>
                        {item.art_form && (
                          <>
                            <span className="text-[#20221F]/30">•</span>
                            <span className="text-xs font-semibold text-[#254D3B]">
                              {item.art_form}
                            </span>
                          </>
                        )}
                        <span className="text-[#20221F]/30">•</span>
                        <span className="text-[11px] text-[#20221F]/60 font-sans">
                          Submitted {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                        </span>
                      </div>

                      <h2 className="font-serif text-2xl sm:text-3xl text-[#20221F] font-normal leading-tight">
                        {item.name}
                      </h2>
                    </div>

                    {/* Status Badge */}
                    <div className="self-start">
                      <span
                        className={`inline-block px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-[2px] ${
                          item.status === 'approved'
                            ? 'bg-[#254D3B] text-[#F5F2EA]'
                            : item.status === 'rejected'
                            ? 'bg-[#B76E50] text-[#F5F2EA]'
                            : item.status === 'changes_requested'
                            ? 'bg-amber-800 text-[#F5F2EA]'
                            : 'bg-[#20221F] text-[#F5F2EA]'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* All Submitted Fields Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-xs items-start">
                    {/* Column 1 & 2: Details */}
                    <div className="lg:col-span-2 space-y-4">
                      {/* Location & Coordinates */}
                      <div className="p-3.5 bg-[#EAE6DC]/50 border border-[#DED5C5] space-y-1.5 rounded-[2px]">
                        <div className="font-semibold uppercase tracking-wider text-[10px] text-[#20221F]/60">
                          Location & Geography:
                        </div>
                        <div className="text-xs font-medium text-[#20221F]">
                          {item.location}
                        </div>
                        <div className="text-[11px] text-[#20221F]/70 font-mono">
                          Coordinates: {hasCoords ? `${item.lat}, ${item.lng} (Will render pin on map)` : 'None provided (List directory only)'}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <div className="font-semibold uppercase tracking-wider text-[10px] text-[#20221F]/60">
                          Description & Significance:
                        </div>
                        <p className="text-xs text-[#20221F]/90 leading-relaxed whitespace-pre-wrap">
                          {item.description}
                        </p>
                      </div>

                      {/* Metadata row: source, email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#DED5C5]">
                        <div>
                          <div className="font-semibold uppercase tracking-wider text-[10px] text-[#20221F]/60">
                            Source Reference:
                          </div>
                          {item.source_url ? (
                            <a
                              href={item.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#254D3B] underline break-all hover:text-[#20221F]"
                            >
                              {item.source_url}
                            </a>
                          ) : (
                            <span className="text-[#20221F]/40 italic">None provided</span>
                          )}
                        </div>

                        <div>
                          <div className="font-semibold uppercase tracking-wider text-[10px] text-[#20221F]/60">
                            Contributor Email:
                          </div>
                          {item.contact_email ? (
                            <span className="text-xs font-mono text-[#20221F]">{item.contact_email}</span>
                          ) : (
                            <span className="text-[#20221F]/40 italic">None provided</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Column 3: Photo Preview */}
                    <div className="space-y-2">
                      <div className="font-semibold uppercase tracking-wider text-[10px] text-[#20221F]/60">
                        Photo Attachment:
                      </div>
                      <div className="border border-[#DED5C5] overflow-hidden rounded-[2px]">
                        <ImageWithFallback
                          src={item.image_url}
                          alt={item.name}
                          aspectRatio="aspect-[4/3]"
                        />
                      </div>
                      {item.image_url && (
                        <p className="text-[10px] text-[#20221F]/50 break-all truncate">
                          URL: {item.image_url}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* History Log */}
                  {Array.isArray(item.history) && item.history.length > 0 && (
                    <div className="pt-3 border-t border-[#DED5C5] space-y-2 font-sans">
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-[#20221F]/60">
                        Audit & Action History Log:
                      </div>
                      <div className="space-y-1.5">
                        {item.history.map((log, index) => (
                          <div
                            key={index}
                            className="p-2.5 bg-[#EAE6DC]/40 border-l-2 border-[#20221F] text-xs flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 rounded-[2px]"
                          >
                            <div>
                              <strong className="text-[#20221F] uppercase tracking-wider text-[10px] mr-2">
                                {log.action}
                              </strong>
                              {log.reason && (
                                <span className="text-[#20221F]/80 text-[11px]">
                                  &ldquo;{log.reason}&rdquo;
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#20221F]/50 font-mono">
                              {new Date(log.time).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons: Approve, Reject, Request Changes */}
                  <div className="pt-4 border-t border-[#DED5C5] flex flex-wrap items-center gap-3 font-sans">
                    {item.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(item)}
                        className="px-4 py-2 min-h-[40px] bg-[#254D3B] text-[#F5F2EA] text-xs font-semibold uppercase tracking-wider hover:bg-[#1a372a] transition-colors rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B]"
                      >
                        ✓ Approve Submission
                      </button>
                    )}

                    {item.status !== 'rejected' && (
                      <button
                        onClick={() => openActionPrompt(item, 'reject')}
                        className="px-4 py-2 min-h-[40px] bg-[#B76E50] text-[#F5F2EA] text-xs font-semibold uppercase tracking-wider hover:bg-[#8e4c34] transition-colors rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B]"
                      >
                        ✕ Reject (Reason Required)
                      </button>
                    )}

                    {item.status !== 'changes_requested' && (
                      <button
                        onClick={() => openActionPrompt(item, 'changes_requested')}
                        className="px-4 py-2 min-h-[40px] border border-[#DED5C5] text-[#20221F] hover:bg-[#EAE6DC] text-xs font-semibold uppercase tracking-wider transition-colors rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#254D3B]"
                      >
                        ✎ Request Changes (Reason Required)
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
