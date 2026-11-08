// Storage key for community submissions
export const SUBMISSIONS_STORAGE_KEY = 'loka_submissions';

// Helper to safely get all submissions from localStorage
export function getSubmissions() {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading submissions from localStorage:', err);
    return [];
  }
}

// Helper to save all submissions to localStorage and notify listeners
export function saveSubmissions(submissions) {
  try {
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
    // Dispatch custom event so reactive components update in the same tab
    window.dispatchEvent(new CustomEvent('loka_submissions_updated', { detail: submissions }));
  } catch (err) {
    console.error('Error saving submissions to localStorage:', err);
  }
}

// Helper to clear all community submissions from localStorage and notify listeners
export function clearSubmissions() {
  try {
    localStorage.removeItem(SUBMISSIONS_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('loka_submissions_updated', { detail: [] }));
  } catch (err) {
    console.error('Error clearing submissions from localStorage:', err);
  }
}

// Create a new submission with pending status, unique id, and initial history log
export function createSubmission({
  name,
  type,
  art_form = '',
  location,
  lat = null,
  lng = null,
  description,
  source_url = '',
  image_url = '',
  contact_email = ''
}) {
  const timestamp = new Date().toISOString();
  const randomPart = Math.random().toString(36).substring(2, 7);
  const id = `sub-${Date.now().toString(36)}-${randomPart}`;

  const newSubmission = {
    id,
    name: name.trim(),
    type: type.trim().toLowerCase(),
    art_form: art_form.trim(),
    location: location.trim(),
    lat: lat !== null && lat !== undefined && lat !== '' && !isNaN(Number(lat)) ? Number(lat) : null,
    lng: lng !== null && lng !== undefined && lng !== '' && !isNaN(Number(lng)) ? Number(lng) : null,
    description: description.trim(),
    cultural_significance: description.trim(),
    source_url: source_url.trim(),
    image_url: image_url.trim(),
    image_credit: 'Community submission',
    image_license: '',
    contact_email: contact_email.trim(),
    status: 'pending', // 'pending' | 'approved' | 'rejected' | 'changes_requested'
    createdAt: timestamp,
    history: [
      {
        action: 'Submitted',
        time: timestamp,
        reason: 'Initial community submission'
      }
    ]
  };

  const existing = getSubmissions();
  const updated = [newSubmission, ...existing];
  saveSubmissions(updated);

  return newSubmission;
}

// Lookup a submission by its unique ID
export function getSubmissionById(id) {
  if (!id) return null;
  const targetId = id.trim().toLowerCase();
  const list = getSubmissions();
  return list.find(s => s.id && s.id.toLowerCase() === targetId) || null;
}

// Update submission status (Approve, Reject, Request changes)
export function updateSubmissionStatus(id, actionType, reason = '') {
  const list = getSubmissions();
  const timestamp = new Date().toISOString();

  let targetStatus = 'pending';
  let logAction = '';

  if (actionType === 'approve') {
    targetStatus = 'approved';
    logAction = 'Approved';
  } else if (actionType === 'reject') {
    targetStatus = 'rejected';
    logAction = 'Rejected';
  } else if (actionType === 'changes_requested') {
    targetStatus = 'changes_requested';
    logAction = 'Changes Requested';
  } else {
    targetStatus = actionType;
    logAction = actionType;
  }

  const updatedList = list.map(item => {
    if (item.id === id) {
      const history = Array.isArray(item.history) ? [...item.history] : [];
      history.unshift({
        action: logAction,
        time: timestamp,
        reason: reason.trim()
      });

      return {
        ...item,
        status: targetStatus,
        history
      };
    }
    return item;
  });

  saveSubmissions(updatedList);
  return updatedList.find(i => i.id === id);
}

// Format approved submissions into the public community listing schema
export function getApprovedCommunityListings() {
  const submissions = getSubmissions();
  return submissions
    .filter(item => item.status === 'approved')
    .map(item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      art_form: item.art_form || '',
      location: item.location || '',
      lat: item.lat !== null && item.lat !== undefined && !isNaN(Number(item.lat)) ? Number(item.lat) : null,
      lng: item.lng !== null && item.lng !== undefined && !isNaN(Number(item.lng)) ? Number(item.lng) : null,
      description: item.description,
      cultural_significance: item.cultural_significance || item.description,
      date_or_season: 'unconfirmed',
      image_url: item.image_url || '',
      image_credit: item.image_credit || 'Community submission',
      image_license: '',
      source_url: item.source_url || '',
      contact_email: item.contact_email || '',
      status: 'community' // Approved items receive status 'community' in public directory
    }));
}
