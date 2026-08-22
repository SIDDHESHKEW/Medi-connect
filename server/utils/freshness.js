/**
 * Freshness and Availability Confidence Calculation Utilities
 * Sensible configurable thresholds for last-mile medicine access
 */

// Freshness thresholds in hours
const FRESH_THRESHOLD_HOURS = parseInt(process.env.FRESH_THRESHOLD_HOURS || '2', 10);
const AGING_THRESHOLD_HOURS = parseInt(process.env.AGING_THRESHOLD_HOURS || '24', 10);

/**
 * Calculates freshness level and human-readable time label
 * @param {Date|string} lastUpdated 
 * @returns {{ level: 'fresh'|'aging'|'stale', label: string, minutesAgo: number, timeAgoStr: string }}
 */
function calculateFreshness(lastUpdated) {
  const now = new Date();
  const updatedDate = lastUpdated ? new Date(lastUpdated) : new Date(now.getTime() - 36 * 3600 * 1000);
  const diffMs = Math.max(0, now - updatedDate);
  const minutesAgo = Math.floor(diffMs / (1000 * 60));
  const hoursAgo = Math.floor(diffMs / (1000 * 60 * 60));
  const daysAgo = Math.floor(hoursAgo / 24);

  let timeAgoStr = 'Just now';
  if (minutesAgo < 1) {
    timeAgoStr = 'Just now';
  } else if (minutesAgo < 60) {
    timeAgoStr = `${minutesAgo} min${minutesAgo > 1 ? 's' : ''} ago`;
  } else if (hoursAgo < 24) {
    timeAgoStr = `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
  } else {
    timeAgoStr = `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
  }

  let level = 'fresh';
  let label = 'Fresh';
  let description = 'Recently updated by pharmacist';

  if (hoursAgo >= AGING_THRESHOLD_HOURS) {
    level = 'stale';
    label = 'Stale';
    description = 'Information is old; Request confirmation recommended';
  } else if (hoursAgo >= FRESH_THRESHOLD_HOURS) {
    level = 'aging';
    label = 'Aging';
    description = 'Updated earlier today; Quick confirmation recommended';
  }

  return {
    level,
    label,
    description,
    minutesAgo,
    hoursAgo,
    timeAgoStr,
  };
}

/**
 * Calculates availability confidence score and rating
 * @param {Object} params
 * @param {Date|string} params.lastUpdated
 * @param {string} params.status ('available' | 'low' | 'out')
 * @param {number} params.totalConfirmations
 * @param {number} params.unavailableReports
 * @param {string} params.verificationStatus ('verified' | 'pending' | 'suspended')
 * @returns {{ rating: 'HIGH CONFIDENCE'|'MEDIUM CONFIDENCE'|'LOW CONFIDENCE', score: number, color: string, reason: string }}
 */
function calculateConfidence({
  lastUpdated,
  status = 'available',
  totalConfirmations = 0,
  unavailableReports = 0,
  verificationStatus = 'verified',
}) {
  const freshness = calculateFreshness(lastUpdated);

  let score = 50;

  // Freshness factor
  if (freshness.level === 'fresh') score += 35;
  else if (freshness.level === 'aging') score += 15;
  else score -= 15;

  // Pharmacy verification status
  if (verificationStatus === 'verified') score += 10;
  else if (verificationStatus === 'suspended') score -= 50;

  // Community confirmation signals
  const confirmationBonus = Math.min(15, (totalConfirmations || 0) * 2);
  const penalty = Math.min(30, (unavailableReports || 0) * 10);
  score = score + confirmationBonus - penalty;

  // Status nuance
  if (status === 'out') {
    return {
      rating: 'HIGH CONFIDENCE',
      score: 95,
      color: '#ef4444',
      badgeClass: 'badge-danger',
      reason: 'Pharmacist explicitly marked as Out of Stock',
    };
  }

  // Bounds
  score = Math.max(10, Math.min(99, score));

  if (score >= 75) {
    return {
      rating: 'HIGH CONFIDENCE',
      score,
      color: '#10b981',
      badgeClass: 'badge-success',
      reason: 'Recently updated & verified by pharmacy',
    };
  } else if (score >= 45) {
    return {
      rating: 'MEDIUM CONFIDENCE',
      score,
      color: '#f59e0b',
      badgeClass: 'badge-warning',
      reason: 'Moderate freshness; Request confirmation is advised',
    };
  } else {
    return {
      rating: 'LOW CONFIDENCE',
      score,
      color: '#ef4444',
      badgeClass: 'badge-danger',
      reason: 'Older listing; Please send a Request to verify',
    };
  }
}

/**
 * Calculates Haversine distance in kilometers between two geo points [lng, lat]
 */
function calculateHaversineDistance(coords1, coords2) {
  if (!coords1 || !coords2 || coords1.length < 2 || coords2.length < 2) {
    return 1.5; // fallback standard local distance
  }
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;

  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Rounded to 1 decimal place
}

module.exports = {
  calculateFreshness,
  calculateConfidence,
  calculateHaversineDistance,
  FRESH_THRESHOLD_HOURS,
  AGING_THRESHOLD_HOURS,
};
