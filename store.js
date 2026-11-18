// In-memory only. Nothing is written to disk or a database.
// All data is lost when the server restarts or the host spins down.
const crypto = require('crypto');
const config = require('./config');

const requests = new Map();
const reviews = new Map();

function reference() {
  return 'WC-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

function addCapped(map, item, cap) {
  if (map.size >= cap) {
    // drop the oldest entry to stay within memory limits
    map.delete(map.keys().next().value);
  }
  map.set(item.id, item);
  return item;
}

module.exports = {
  requests,
  reviews,
  createRequest(data) {
    const now = new Date().toISOString();
    return addCapped(
      requests,
      { id: crypto.randomUUID(), reference: reference(), status: 'new', adminNotes: '', ...data, createdAt: now, updatedAt: now },
      config.maxRequests
    );
  },
  createReview(data) {
    return addCapped(
      reviews,
      { id: crypto.randomUUID(), status: 'pending', ...data, createdAt: new Date().toISOString() },
      config.maxReviews
    );
  },
};
