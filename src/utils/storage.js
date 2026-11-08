const STORAGE_KEY = 'loka_thrissur_submissions_v1';

const INITIAL_COMMUNITY_SUBMISSIONS = [
  {
    id: "sub-101",
    title: "Thiruvambadi Krishna Temple Deeparadhana & Elephant Stables",
    category: "Sacred & Heritage",
    coordinates: [10.5332, 76.2168],
    panchayat: "Thrissur Corporation",
    summary: "One of the two competing rival partners of the majestic Thrissur Pooram.",
    culturalSignificance: "Famous for housing temple tuskers and the spectacular display of Chamayam (golden elephant headgear, peacock feather fans, and sequined silk umbrellas) before Pooram.",
    heritageHighlights: [
      "Traditional evening oil lamp lighting (Chuttuvilakku)",
      "Pooram exhibition of intricate parasols and gold caparisons",
      "Serene temple pond and community bell chime bells"
    ],
    bestTimeToVisit: "Evenings at 6:30 PM for Deeparadhana lamp ceremony.",
    etiquette: "Footwear to be left outside; respectful silence in temple corridors.",
    tags: ["Thiruvambadi", "Pooram Rival", "Elephant Chamayam", "Deeparadhana"],
    submittedBy: "Unnikrishnan P. (Local Resident)",
    contact: "unni.thrissur@gmail.com",
    submittedAt: "2026-11-08T18:30:00.000Z",
    status: "pending",
    moderationNotes: "",
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "sub-102",
    title: "Marathakkara Bell Foundry & Pot Casting Artisans",
    category: "Artisans & Crafts",
    coordinates: [10.4721, 76.2482],
    panchayat: "Marathakkara",
    summary: "Traditional brassware hamlet where family-run foundries cast bells and traditional culinary urulis.",
    culturalSignificance: "Generations of Vishwakarma smiths maintaining age-old metallurgy formulas for acoustic resonance.",
    heritageHighlights: [
      "Clay casting moulds baked in husk ovens",
      "Hand tuning of temple bell gongs and prayer cymbals",
      "Artisan-led metal casting demonstrations"
    ],
    bestTimeToVisit: "Tuesdays & Thursdays during morning metal pours.",
    etiquette: "Inquire with craft families before taking close-up videos of smelting tools.",
    tags: ["Brass Casting", "Vishwakarma", "Marathakkara", "Craft Heritage"],
    submittedBy: "Radhika Menon (Heritage Documentarian)",
    contact: "radhika.heritage@keralaculture.org",
    submittedAt: "2026-11-07T14:15:00.000Z",
    status: "approved",
    moderationNotes: "Verified coordinates and craft lineage with district artisan guild.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "sub-103",
    title: "Peechi Forest Sacred Kavu (Serpent Grove)",
    category: "Ecology & Agri-Culture",
    coordinates: [10.5312, 76.3524],
    panchayat: "Peechi - Pananchery",
    summary: "Protected biodiversity hotspot preserved through sacred serpent worshipping grove traditions.",
    culturalSignificance: "Ancient ecological conservation method keeping medicinal microclimates intact under religious protection.",
    heritageHighlights: [
      "Centuries-old towering endemic hardwood trees and jungle lianas",
      "Carved granite Nagaraja and Nagayakshi stone idols",
      "Community Ayilyam star rituals with turmeric powder offerings (Noorum Paalum)"
    ],
    bestTimeToVisit: "Morning 7:00 AM - 11:00 AM.",
    etiquette: "Strictly no shoes, no smoking, absolute respect for forest wildlife.",
    tags: ["Sarpakavu", "Biodiversity", "Sacred Grove", "Ecology", "Medicinal Plants"],
    submittedBy: "Harikumar Kavu Conservationist",
    contact: "hari.kavu@gmail.com",
    submittedAt: "2026-11-06T09:00:00.000Z",
    status: "pending",
    moderationNotes: "",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
  }
];

export function getStoredSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COMMUNITY_SUBMISSIONS));
      return INITIAL_COMMUNITY_SUBMISSIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_COMMUNITY_SUBMISSIONS;
  } catch (e) {
    console.error("Failed to read from localStorage", e);
    return INITIAL_COMMUNITY_SUBMISSIONS;
  }
}

export function saveNewSubmission(data) {
  const current = getStoredSubmissions();
  const newEntry = {
    id: `sub-${Date.now()}`,
    title: data.title || "Untitled Cultural Spot",
    category: data.category || "Sacred & Heritage",
    coordinates: [
      parseFloat(data.latitude) || 10.5243,
      parseFloat(data.longitude) || 76.2137
    ],
    panchayat: data.panchayat || "Thrissur District",
    summary: data.summary || "",
    culturalSignificance: data.culturalSignificance || "",
    heritageHighlights: Array.isArray(data.heritageHighlights)
      ? data.heritageHighlights
      : (data.heritageHighlights || "").split("\n").filter(Boolean),
    bestTimeToVisit: data.bestTimeToVisit || "Open regular hours",
    etiquette: data.etiquette || "Follow local customs and dress codes.",
    tags: Array.isArray(data.tags)
      ? data.tags
      : (data.tags || "").split(",").map(t => t.trim()).filter(Boolean),
    submittedBy: data.submittedBy || "Community Contributor",
    contact: data.contact || "",
    submittedAt: new Date().toISOString(),
    status: "pending", // All new community submissions start pending moderation
    moderationNotes: "",
    imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1000&q=80"
  };

  const updated = [newEntry, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newEntry;
}

export function updateSubmissionStatus(id, newStatus, notes = "") {
  const current = getStoredSubmissions();
  const updated = current.map(item => {
    if (item.id === id) {
      return {
        ...item,
        status: newStatus,
        moderationNotes: notes || item.moderationNotes,
        moderatedAt: new Date().toISOString()
      };
    }
    return item;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteSubmission(id) {
  const current = getStoredSubmissions();
  const updated = current.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function resetSubmissionsToDefault() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COMMUNITY_SUBMISSIONS));
  return INITIAL_COMMUNITY_SUBMISSIONS;
}

