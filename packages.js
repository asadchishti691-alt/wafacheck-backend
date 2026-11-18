// Edit prices/names here to match your site. Amounts are in PKR.
// Package "custom" is priced on WhatsApp.
module.exports = [
  { id: 'basic', name: 'Basic', price: 800, currency: 'PKR' },
  { id: 'standard', name: 'Standard', price: 1200, currency: 'PKR' },
  { id: 'premium', name: 'Premium', price: 1500, currency: 'PKR' },
  { id: 'custom', name: 'Custom', price: null, currency: 'PKR', note: 'Price agreed on WhatsApp' },
];
