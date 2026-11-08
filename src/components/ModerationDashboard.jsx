import React, { useState } from 'react';
import { 
  ShieldCheck, Check, X, Clock, AlertTriangle, Trash2, 
  MapPin, Eye, RotateCcw, Filter, User, Calendar, ExternalLink 
} from 'lucide-react';
import { 
  updateSubmissionStatus, 
  deleteSubmission, 
  resetSubmissionsToDefault 
} from '../utils/storage';

export default function ModerationDashboard({ 
  submissions = [], 
  onRefreshSubmissions, 
  onViewOnMap 
}) {
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const [notesState, setNotesState] = useState({});

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;
  const rejectedCount = submissions.filter(s => s.status === 'rejected').length;

  const filtered = submissions.filter(s => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const handleStatusChange = (id, newStatus) => {
    const note = notesState[id] || "";
    updateSubmissionStatus(id, newStatus, note);
    onRefreshSubmissions();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      deleteSubmission(id);
      onRefreshSubmissions();
    }
  };

  const handleResetData = () => {
    if (window.confirm("Reset submissions to default sample set?")) {
      resetSubmissionsToDefault();
      onRefreshSubmissions();
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cultural Integrity & Moderation Desk</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Community Contributions Review
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm">
              Review, verify, and approve community-submitted cultural locations before publishing to the live Thrissur map.
            </p>
          </div>

          <button
            onClick={handleResetData}
            className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Queue</span>
          </button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div 
            onClick={() => setFilter('all')}
            className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all ${
              filter === 'all' ? 'border-stone-900 ring-2 ring-stone-900/10 shadow-md' : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Queue</div>
            <div className="text-2xl font-serif font-bold text-stone-900 mt-1">{submissions.length}</div>
          </div>

          <div 
            onClick={() => setFilter('pending')}
            className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all ${
              filter === 'pending' ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md' : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center justify-between">
              <span>Pending Review</span>
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-2xl font-serif font-bold text-amber-600 mt-1">{pendingCount}</div>
          </div>

          <div 
            onClick={() => setFilter('approved')}
            className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all ${
              filter === 'approved' ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-md' : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center justify-between">
              <span>Live on Map</span>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-serif font-bold text-emerald-600 mt-1">{approvedCount}</div>
          </div>

          <div 
            onClick={() => setFilter('rejected')}
            className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all ${
              filter === 'rejected' ? 'border-red-500 ring-2 ring-red-500/20 shadow-md' : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="text-xs font-semibold text-red-700 uppercase tracking-wider flex items-center justify-between">
              <span>Rejected</span>
              <X className="w-3.5 h-3.5 text-red-500" />
            </div>
            <div className="text-2xl font-serif font-bold text-red-600 mt-1">{rejectedCount}</div>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs">
          <span className="font-semibold text-stone-500 mr-2">Filter By:</span>
          {['all', 'pending', 'approved', 'rejected'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-full capitalize font-semibold transition-all ${
                filter === tab
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Submissions List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
            <ShieldCheck className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-stone-800">
              No submissions found in &ldquo;{filter}&rdquo;
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Select another filter or submit a new cultural spot from the navigation bar.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(item => {
              const isPending = item.status === 'pending';
              const isApproved = item.status === 'approved';
              const isRejected = item.status === 'rejected';

              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 sm:p-6 transition-all hover:shadow-md"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Thumbnail & Quick info */}
                    <div className="w-full lg:w-48 flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-32 rounded-xl object-cover"
                      />
                      <div className="mt-2 text-[11px] text-stone-500 space-y-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-600" />
                          <span className="truncate">{item.panchayat}</span>
                        </div>
                        <div className="font-mono text-[10px] text-stone-400">
                          {item.coordinates?.[0]?.toFixed(4)}, {item.coordinates?.[1]?.toFixed(4)}
                        </div>
                        <div className="flex items-center gap-1 text-stone-500">
                          <User className="w-3 h-3" />
                          <span className="truncate">{item.submittedBy}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800">
                            {item.category}
                          </span>
                          
                          {/* Status Pill */}
                          {isPending && (
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Pending Review
                            </span>
                          )}
                          {isApproved && (
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Approved (Live on Map)
                            </span>
                          )}
                          {isRejected && (
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                              <X className="w-3 h-3" />
                              Rejected
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-stone-400">
                          ID: <span className="font-mono">{item.id}</span>
                        </div>
                      </div>

                      <h3 className="font-serif font-bold text-xl text-stone-900 leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-stone-600 leading-relaxed font-medium bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                        {item.summary}
                      </p>

                      {item.culturalSignificance && (
                        <div className="text-xs text-stone-600 leading-relaxed">
                          <strong className="text-stone-800 font-semibold block mb-0.5">Cultural Significance:</strong>
                          {item.culturalSignificance}
                        </div>
                      )}

                      {/* Notes & Actions Bar */}
                      <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        {/* Moderator note input */}
                        <div className="flex-1 max-w-sm">
                          <input
                            type="text"
                            placeholder="Add moderator verification notes..."
                            value={notesState[item.id] !== undefined ? notesState[item.id] : (item.moderationNotes || '')}
                            onChange={(e) => setNotesState({ ...notesState, [item.id]: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        {/* Decision Buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleStatusChange(item.id, 'approved')}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Approve & Publish
                              </button>
                              <button
                                onClick={() => handleStatusChange(item.id, 'rejected')}
                                className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-semibold text-xs flex items-center gap-1 transition-all"
                              >
                                <X className="w-3.5 h-3.5" />
                                Reject
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <>
                              <button
                                onClick={() => onViewOnMap(item)}
                                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View on Map
                              </button>
                              <button
                                onClick={() => handleStatusChange(item.id, 'rejected')}
                                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-red-50 text-red-600 font-semibold text-xs"
                              >
                                Unpublish
                              </button>
                            </>
                          )}

                          {isRejected && (
                            <button
                              onClick={() => handleStatusChange(item.id, 'pending')}
                              className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold text-xs flex items-center gap-1"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              Move to Pending
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(item.id)}
                            title="Delete submission"
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-stone-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

