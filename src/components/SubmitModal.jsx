import React, { useState } from 'react';
import { X, Send, MapPin, Sparkles, Image, CheckCircle, Info } from 'lucide-react';
import { saveNewSubmission } from '../utils/storage';

const CATEGORIES = [
  "Sacred & Heritage",
  "Performing Arts",
  "Artisans & Crafts",
  "Festivals & Melam",
  "Culinary Heritage",
  "Ecology & Agri-Culture",
  "Folklore & Street Culture"
];

const PRESET_COORDINATES = [
  { label: "Thrissur Town Center", lat: 10.5276, lng: 76.2144 },
  { label: "Cheruthuruthy (Kalamandalam)", lat: 10.7486, lng: 76.2801 },
  { label: "Irinjalakuda (Koodalmanikyam)", lat: 10.3475, lng: 76.2001 },
  { label: "Kodungallur (Muziris Coast)", lat: 10.2246, lng: 76.1969 },
  { label: "Guruvayur Temple Area", lat: 10.5946, lng: 76.0401 }
];

export default function SubmitModal({ isOpen, onClose, onSubmissionSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Sacred & Heritage',
    panchayat: '',
    latitude: '10.5276',
    longitude: '76.2144',
    summary: '',
    culturalSignificance: '',
    heritageHighlights: '',
    bestTimeToVisit: '',
    etiquette: '',
    tags: '',
    submittedBy: '',
    contact: '',
    imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1000&q=80'
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.panchayat) {
      alert("Please fill in the title and panchayat/locality.");
      return;
    }

    const created = saveNewSubmission(formData);
    setSubmitted(true);
    if (onSubmissionSuccess) {
      onSubmissionSuccess(created);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-stone-900 to-amber-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
              🪔
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-amber-100">
                Contribute Cultural Spot
              </h2>
              <p className="text-xs text-stone-300">
                LOKA Community Cultural Cartography • Thrissur District
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900">
              Contribution Received!
            </h3>
            <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
              Thank you for enriching Thrissur&rsquo;s living cultural archive. Your submission has been saved to the <strong>moderation queue</strong> and will appear on the public map once reviewed.
            </p>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 max-w-sm mx-auto">
              Tip: You can visit the <strong>Moderation Hub</strong> anytime to inspect or approve this entry.
            </div>
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-600 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                Submissions are stored in local storage and queued for cultural moderation before being published to the active map.
              </span>
            </div>

            {/* Title & Category */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Spot or Tradition Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paramekkavu Bhagavathy Temple"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Cultural Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Locality & Coordinates */}
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block font-bold text-stone-700 mb-1">
                  Panchayat / Town *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cherpu, Ollur, Chalakudy"
                  value={formData.panchayat}
                  onChange={(e) => setFormData({ ...formData, panchayat: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Quick Coordinate Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-stone-500">Quick coordinates:</span>
              {PRESET_COORDINATES.map((p) => (
                <button
                  type="button"
                  key={p.label}
                  onClick={() => setFormData({ ...formData, latitude: String(p.lat), longitude: String(p.lng) })}
                  className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-0.5 rounded border border-stone-200 cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Short Summary */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Short Summary (1-2 sentences)
              </label>
              <textarea
                rows={2}
                placeholder="Brief description of the site and why travelers should know about it."
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Cultural Significance */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Living Folklore & Cultural Significance
              </label>
              <textarea
                rows={3}
                placeholder="Share the oral history, legendary master craftsmen, temple rituals, or community stories."
                value={formData.culturalSignificance}
                onChange={(e) => setFormData({ ...formData, culturalSignificance: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Heritage Highlights */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Key Highlights (One per line)
              </label>
              <textarea
                rows={2}
                placeholder="Wood carved ceiling&#10;Evening Melam concert&#10;Handmade brass lamps"
                value={formData.heritageHighlights}
                onChange={(e) => setFormData({ ...formData, heritageHighlights: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none leading-relaxed font-mono"
              />
            </div>

            {/* Best Time & Etiquette */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Best Time to Visit</label>
                <input
                  type="text"
                  placeholder="e.g. Dawn at 5:30 AM or Onam week"
                  value={formData.bestTimeToVisit}
                  onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Visitor Etiquette / Dress</label>
                <input
                  type="text"
                  placeholder="e.g. Traditional attire, quiet observation"
                  value={formData.etiquette}
                  onChange={(e) => setFormData({ ...formData, etiquette: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Submitter Name & Email */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Your Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Ananya Nair (Local Resident)"
                  value={formData.submittedBy}
                  onChange={(e) => setFormData({ ...formData, submittedBy: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Email / Contact</label>
                <input
                  type="email"
                  placeholder="For moderation verification"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/30"
              >
                <Send className="w-3.5 h-3.5" />
                Submit for Moderation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

