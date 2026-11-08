import React, { useState } from 'react';
import { createSubmission, getSubmissionById } from '../utils/submissionsStorage';

const CULTURAL_TYPES = [
  { value: 'place', label: 'Place (Temple, Monument, Site)' },
  { value: 'festival', label: 'Festival (Pooram, Utsavam, Celebration)' },
  { value: 'performance', label: 'Performance (Melam, Kathakali, Theater)' },
  { value: 'craft', label: 'Craft (Bell Metal, Weaving, Pottery)' },
  { value: 'artist', label: 'Artist / Master Practitioner' }
];

function isValidUrl(string) {
  if (!string || !string.trim()) return true;
  try {
    const url = new URL(string.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidEmail(string) {
  if (!string || !string.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(string.trim());
}

export default function ContributePage({ onNavigate }) {
  // Form input state
  const [formData, setFormData] = useState({
    name: '',
    type: 'place',
    art_form: '',
    location: '',
    lat: '',
    lng: '',
    description: '',
    source_url: '',
    image_url: '',
    contact_email: ''
  });

  const [errors, setErrors] = useState({});
  const [submittedItem, setSubmittedItem] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // "Check my submission" box state
  const [lookupId, setLookupId] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupSearched, setLookupSearched] = useState(false);

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = 'Listing name is required.';
    }

    if (!formData.type.trim()) {
      errs.type = 'Cultural type is required.';
    }

    if (!formData.location.trim()) {
      errs.location = 'Location or address description is required.';
    }

    if (!formData.description.trim()) {
      errs.description = 'Description is required.';
    }

    if (formData.source_url && !isValidUrl(formData.source_url)) {
      errs.source_url = 'Please enter a valid URL starting with http:// or https://';
    }

    if (formData.image_url && !isValidUrl(formData.image_url)) {
      errs.image_url = 'Please enter a valid image URL starting with http:// or https://';
    }

    if (formData.contact_email && !isValidEmail(formData.contact_email)) {
      errs.contact_email = 'Please enter a valid email address.';
    }

    if (formData.lat && (isNaN(Number(formData.lat)) || Number(formData.lat) < -90 || Number(formData.lat) > 90)) {
      errs.lat = 'Latitude must be a valid number between -90 and 90.';
    }

    if (formData.lng && (isNaN(Number(formData.lng)) || Number(formData.lng) < -180 || Number(formData.lng) > 180)) {
      errs.lng = 'Longitude must be a valid number between -180 and 180.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const created = createSubmission({
      name: formData.name,
      type: formData.type,
      art_form: formData.art_form,
      location: formData.location,
      lat: formData.lat ? parseFloat(formData.lat) : null,
      lng: formData.lng ? parseFloat(formData.lng) : null,
      description: formData.description,
      source_url: formData.source_url,
      image_url: formData.image_url,
      contact_email: formData.contact_email
    });

    setSubmittedItem(created);
    setFormData({
      name: '',
      type: 'place',
      art_form: '',
      location: '',
      lat: '',
      lng: '',
      description: '',
      source_url: '',
      image_url: '',
      contact_email: ''
    });
    setErrors({});
  };

  const handleCopyId = (id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleLookup = (e) => {
    e.preventDefault();
    if (!lookupId.trim()) return;
    const result = getSubmissionById(lookupId.trim());
    setLookupResult(result);
    setLookupSearched(true);
  };

  return (
    <div className="min-h-[calc(100vh-70px)] bg-[#F5F2EA] text-[#20221F] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Block */}
        <div className="border-b border-[#20221F]/20 pb-6">
          <div className="text-[11px] uppercase tracking-widest text-[#B76E50] font-sans font-semibold mb-2">
            Participatory Cartography • Thrissur District
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#20221F] font-normal tracking-tight">
            Contribute a Cultural Listing
          </h1>
          <p className="font-sans text-sm text-[#20221F]/75 max-w-2xl mt-2 leading-relaxed">
            Document uncataloged sacred sites, folk rituals, percussion kalaries, and master artisan workshops. Every submission is reviewed by cultural editors before publishing with the community badge.
          </p>
        </div>

        {/* Section: Check My Submission Box */}
        <section className="bg-[#EAE6DC]/60 border border-[#20221F]/25 p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#20221F]/15 pb-3">
            <div>
              <h2 className="font-serif text-2xl text-[#20221F] font-normal">
                Check My Submission
              </h2>
              <p className="font-sans text-xs text-[#20221F]/70">
                Track the moderation status and editorial feedback for your contribution.
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#254D3B] uppercase tracking-wider bg-[#254D3B]/10 px-2 py-1 self-start sm:self-auto">
              Status Inquiry
            </span>
          </div>

          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter submission ID (e.g., sub-m...)"
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-[#F5F2EA] border border-[#20221F]/30 text-[#20221F] placeholder-[#20221F]/40 font-mono text-xs focus:outline-none focus:border-[#20221F]"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#20221F] text-[#F5F2EA] font-sans text-xs font-semibold uppercase tracking-wider hover:bg-[#254D3B] transition-colors"
            >
              Check Status
            </button>
          </form>

          {lookupSearched && (
            <div className="mt-4 pt-4 border-t border-[#20221F]/15">
              {lookupResult ? (
                <div className="bg-[#F5F2EA] border border-[#20221F]/20 p-4 space-y-3 font-sans text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-serif text-lg font-semibold text-[#20221F]">
                      {lookupResult.name}
                    </span>
                    <span
                      className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-none ${
                        lookupResult.status === 'approved'
                          ? 'bg-[#254D3B] text-[#F5F2EA]'
                          : lookupResult.status === 'rejected'
                          ? 'bg-[#B76E50] text-[#F5F2EA]'
                          : lookupResult.status === 'changes_requested'
                          ? 'bg-amber-700 text-[#F5F2EA]'
                          : 'bg-[#20221F]/20 text-[#20221F]'
                      }`}
                    >
                      Status: {lookupResult.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#20221F]/70 text-[11px]">
                    <div>ID: <span className="font-mono text-[#20221F]">{lookupResult.id}</span></div>
                    <div>Type: <span className="capitalize text-[#20221F]">{lookupResult.type}</span></div>
                    <div>Submitted: <span className="text-[#20221F]">{new Date(lookupResult.createdAt).toLocaleDateString()}</span></div>
                    <div>Location: <span className="text-[#20221F]">{lookupResult.location}</span></div>
                  </div>

                  {/* Editorial Reasons & History */}
                  {Array.isArray(lookupResult.history) && lookupResult.history.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-[#20221F]/10">
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-[#20221F]/60">
                        Editorial Log & Feedback:
                      </div>
                      <div className="space-y-1">
                        {lookupResult.history.map((h, i) => (
                          <div key={i} className="p-2 bg-[#EAE6DC]/50 border-l-2 border-[#20221F]/40 text-[11px] leading-relaxed">
                            <div className="flex items-center justify-between font-medium">
                              <span className="text-[#20221F]">{h.action}</span>
                              <span className="text-[#20221F]/40 text-[10px]">{new Date(h.time).toLocaleString()}</span>
                            </div>
                            {h.reason && (
                              <div className="text-[#20221F]/80 mt-0.5">
                                Note: &ldquo;{h.reason}&rdquo;
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {lookupResult.status === 'approved' && (
                    <div className="text-[#254D3B] font-medium text-xs pt-1">
                      ✓ This listing has been approved and published to the public directory and map with the community badge.
                    </div>
                  )}
                  {lookupResult.status === 'pending' && (
                    <div className="text-[#20221F]/70 italic text-xs pt-1">
                      Your submission is currently in the editorial moderation queue.
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-[#F5F2EA] border border-[#B76E50]/40 text-[#B76E50] text-xs font-sans">
                  No submission found with ID &ldquo;{lookupId}&rdquo;. Please verify the identifier and try again.
                </div>
              )}
            </div>
          )}
        </section>

        {/* Success Banner if recently submitted */}
        {submittedItem && (
          <div className="bg-[#254D3B]/10 border border-[#254D3B] p-6 space-y-3 font-sans">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl text-[#254D3B] font-medium">
                  Thank you. Your submission is pending review.
                </h3>
                <p className="text-xs text-[#20221F]/80 mt-1 leading-relaxed">
                  Your cultural entry has been logged. Cultural editors will review the details before making it public.
                </p>
              </div>
              <button
                onClick={() => setSubmittedItem(null)}
                className="text-[#20221F]/50 hover:text-[#20221F] text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-3 bg-[#F5F2EA] border border-[#254D3B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs">
                <span className="text-[#20221F]/60">Your Submission ID: </span>
                <strong className="font-mono text-sm text-[#20221F]">{submittedItem.id}</strong>
              </div>
              <button
                onClick={() => handleCopyId(submittedItem.id)}
                className="px-3 py-1 bg-[#254D3B] text-[#F5F2EA] text-[11px] font-semibold uppercase tracking-wider hover:bg-[#20221F] transition-colors self-start sm:self-auto"
              >
                {isCopied ? 'Copied!' : 'Copy ID'}
              </button>
            </div>
            <p className="text-[11px] text-[#20221F]/60">
              Save this ID to check the review status at any time in the inquiry box above.
            </p>
          </div>
        )}

        {/* Section: Main Contribution Form */}
        <section className="bg-[#F5F2EA] border border-[#20221F] p-6 sm:p-10 space-y-8">
          <div>
            <h2 className="font-serif text-3xl text-[#20221F] font-normal">
              Cultural Listing Submission Form
            </h2>
            <p className="font-sans text-xs text-[#20221F]/60 mt-1">
              Fields marked with an asterisk (<span className="text-[#B76E50]">*</span>) are required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 font-sans text-xs">
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="input-name" className="block uppercase tracking-wider font-semibold text-[#20221F]/80 text-[11px]">
                Name of Cultural Listing <span className="text-[#B76E50]">*</span>
              </label>
              <input
                id="input-name"
                type="text"
                placeholder="e.g., Arattupuzha Pooram or Peruvanam Temple"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-[#F5F2EA] border text-[#20221F] placeholder-[#20221F]/40 focus:outline-none ${
                  errors.name ? 'border-[#B76E50]' : 'border-[#20221F]/30 focus:border-[#20221F]'
                }`}
              />
              {errors.name && (
                <p className="text-[11px] text-[#B76E50] font-medium">{errors.name}</p>
              )}
            </div>

            {/* Type & Art Form (Two column grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Type */}
              <div className="space-y-1.5">
                <label htmlFor="input-type" className="block uppercase tracking-wider font-semibold text-[#20221F]/80 text-[11px]">
                  Cultural Type <span className="text-[#B76E50]">*</span>
                </label>
                <select
                  id="input-type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-[#F5F2EA] border text-[#20221F] focus:outline-none ${
                    errors.type ? 'border-[#B76E50]' : 'border-[#20221F]/30 focus:border-[#20221F]'
                  }`}
                >
                  {CULTURAL_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                {errors.type && (
                  <p className="text-[11px] text-[#B76E50] font-medium">{errors.type}</p>
                )}
              </div>

              {/* Art Form */}
              <div className="space-y-1.5">
                <label htmlFor="input-artform" className="block uppercase tracking-wider font-semibold text-[#20221F]/80 text-[11px]">
                  Art Form / Tradition (Optional)
                </label>
                <input
                  id="input-artform"
                  type="text"
                  placeholder="e.g., Panchavadyam, Mural Painting, Bronze Casting"
                  value={formData.art_form}
                  onChange={(e) => setFormData({ ...formData, art_form: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F5F2EA] border border-[#20221F]/30 text-[#20221F] placeholder-[#20221F]/40 focus:outline-none focus:border-[#20221F]"
                />
              </div>
            </div>

            {/* Location (Address) */}
            <div className="space-y-1.5">
              <label htmlFor="input-location" className="block uppercase tracking-wider font-semibold text-[#20221F]/80 text-[11px]">
                Location / Address <span className="text-[#B76E50]">*</span>
              </label>
              <input
                id="input-location"
                type="text"
                placeholder="Village, Panchayat, landmark, or street address in Thrissur district"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-[#F5F2EA] border text-[#20221F] placeholder-[#20221F]/40 focus:outline-none ${
                  errors.location ? 'border-[#B76E50]' : 'border-[#20221F]/30 focus:border-[#20221F]'
                }`}
              />
              {errors.location && (
                <p className="text-[11px] text-[#B76E50] font-medium">{errors.location}</p>
              )}
            </div>

            {/* Optional Coordinates (Lat / Lng) */}
            <div className="p-4 bg-[#EAE6DC]/40 border border-[#20221F]/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-wider font-semibold text-[#20221F]/70 text-[10px]">
                  Geographic Coordinates (Optional)
                </span>
                <span className="text-[10px] text-[#20221F]/50">
                  Required to place marker on the interactive map
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="input-lat" className="block text-[10px] text-[#20221F]/60 mb-1">
                    Latitude (e.g., 10.5246)
                  </label>
                  <input
                    id="input-lat"
                    type="number"
                    step="any"
                    placeholder="10.52..."
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    className={`w-full px-3 py-2 bg-[#F5F2EA] border text-[#20221F] placeholder-[#20221F]/40 font-mono text-xs focus:outline-none ${
                      errors.lat ? 'border-[#B76E50]' : 'border-[#20221F]/30 focus:border-[#20221F]'
                    }`}
                  />
                  {errors.lat && (
                    <p className="text-[10px] text-[#B76E50] mt-1">{errors.lat}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="input-lng" className="block text-[10px] text-[#20221F]/60 mb-1">
                    Longitude (e.g., 76.2144)
                  </label>
                  <input
                    id="input-lng"
                    type="number"
                    step="any"
                    placeholder="76.21..."
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    className={`w-full px-3 py-2 bg-[#F5F2EA] border text-[#20221F] placeholder-[#20221F]/40 font-mono text-xs focus:outline-none ${
                      errors.lng ? 'border-[#B76E50]' : 'border-[#20221F]/30 focus:border-[#20221F]'
                    }`}
                  />
                  {errors.lng && (
                    <p className="text-[10px] text-[#B76E50] mt-1">{errors.lng}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="input-description" className="block uppercase tracking-wider font-semibold text-[#20221F]/80 text-[11px]">
                Description & Cultural Background <span className="text-[#B76E50]">*</span>
              </label>
              <textarea
                id="input-description"
                rows={4}
                placeholder="Provide a detailed description of the site, historic lineage, artisan tradition, or ritual significance..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-[#F5F2EA] border text-[#20221F] placeholder-[#20221F]/40 focus:outline-none leading-relaxed ${
                  errors.description ? 'border-[#B76E50]' : 'border-[#20221F]/30 focus:border-[#20221F]'
                }`}
              />
              {errors.description && (
                <p className="text-[11px] text-[#B76E50] font-medium">{errors.description}</p>
              )}
            </div>

            {/* Source Link & Photo URL (Two column grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Source Link */}
              <div className="space-y-1.5">
                <label htmlFor="input-source" className="block uppercase tracking-wider font-semibold text-[#20221F]/80 text-[11px]">
                  Source Link (Optional)
                </label>
                <input
                  id="input-source"
                  type="url"
                  placeholder="https://..."
                  value={formData.source_url}
                  onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-[#F5F2EA] border text-[#20221F] placeholder-[#20221F]/40 focus:outline-none ${
                    errors.source_url ? 'border-[#B76E50]' : 'border-[#20221F]/30 focus:border-[#20221F]'
                  }`}
                />
                {errors.source_url && (
                  <p className="text-[11px] text-[#B76E50] font-medium">{errors.source_url}</p>
                )}
              </div>

              {/* Photo URL */}
              <div className="space-y-1.5">
                <label htmlFor="input-photo" className="block uppercase tracking-wider font-semibold text-[#20221F]/80 text-[11px]">
                  Photo URL (Optional)
                </label>
                <input
                  id="input-photo"
                  type="url"
                  placeholder="https://...jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-[#F5F2EA] border text-[#20221F] placeholder-[#20221F]/40 focus:outline-none ${
                    errors.image_url ? 'border-[#B76E50]' : 'border-[#20221F]/30 focus:border-[#20221F]'
                  }`}
                />
                {errors.image_url && (
                  <p className="text-[11px] text-[#B76E50] font-medium">{errors.image_url}</p>
                )}
              </div>
            </div>

            {/* Contact Email */}
            <div className="space-y-1.5">
              <label htmlFor="input-email" className="block uppercase tracking-wider font-semibold text-[#20221F]/80 text-[11px]">
                Contributor Contact Email (Optional)
              </label>
              <input
                id="input-email"
                type="email"
                placeholder="your.email@example.com (used only if editors need to reach you)"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className={`w-full px-3.5 py-2.5 bg-[#F5F2EA] border text-[#20221F] placeholder-[#20221F]/40 focus:outline-none ${
                  errors.contact_email ? 'border-[#B76E50]' : 'border-[#20221F]/30 focus:border-[#20221F]'
                }`}
              />
              {errors.contact_email && (
                <p className="text-[11px] text-[#B76E50] font-medium">{errors.contact_email}</p>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-[#20221F]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#20221F] text-[#F5F2EA] font-sans text-xs font-semibold uppercase tracking-wider hover:bg-[#254D3B] transition-colors"
              >
                Submit Cultural Listing →
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/map')}
                className="text-xs font-sans text-[#20221F]/60 hover:text-[#20221F] underline"
              >
                Cancel and return to map
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
