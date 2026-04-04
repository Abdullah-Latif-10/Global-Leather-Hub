// Shipping calculation utility
// Basic implementation - can be enhanced with real shipping APIs

const SHIPPING_RATES = {
  // Base rates per kg, by region
  'North America': { USD: 15, CAD: 20 },
  'Europe': { EUR: 12, GBP: 10 },
  'Asia': { CNY: 25, USD: 20 },
  'Australia': { AUD: 18 },
  'Other': { USD: 25 },
};

const COUNTRY_REGIONS = {
  'United States': 'North America',
  'Canada': 'North America',
  'Mexico': 'North America',
  'United Kingdom': 'Europe',
  'Germany': 'Europe',
  'France': 'Europe',
  'Italy': 'Europe',
  'Spain': 'Europe',
  'Netherlands': 'Europe',
  'China': 'Asia',
  'Japan': 'Asia',
  'South Korea': 'Asia',
  'India': 'Asia',
  'Australia': 'Australia',
  'New Zealand': 'Australia',
};

const calculateShippingCost = (country, weightKg = 1, currency = 'USD') => {
  const region = COUNTRY_REGIONS[country] || 'Other';
  const regionRates = SHIPPING_RATES[region];

  if (!regionRates) {
    return { cost: 25, currency: 'USD', estimatedDays: 14 };
  }

  // Use the rate in the requested currency, or convert from USD
  let cost = regionRates[currency];
  if (!cost) {
    cost = regionRates.USD || 25;
    // Simple conversion - in production use proper currency conversion
    if (currency === 'EUR') cost *= 0.85;
    else if (currency === 'GBP') cost *= 0.73;
    else if (currency === 'CNY') cost *= 6.45;
  }

  // Weight multiplier (basic linear scaling)
  cost *= Math.max(1, weightKg);

  // Free shipping over certain thresholds
  if (cost > 100) {
    cost = Math.max(cost * 0.9, 50); // 10% discount, minimum $50
  }

  const estimatedDays = region === 'North America' ? 5 :
                       region === 'Europe' ? 7 :
                       region === 'Asia' ? 10 :
                       region === 'Australia' ? 12 : 14;

  return {
    cost: Math.round(cost * 100) / 100,
    currency,
    estimatedDays,
    region
  };
};

const getShippingRestrictions = (country) => {
  // Basic restrictions - can be expanded
  const restrictedCountries = ['Cuba', 'Iran', 'North Korea', 'Syria'];
  return {
    restricted: restrictedCountries.includes(country),
    notes: restrictedCountries.includes(country) ?
      'Shipping to this country may be restricted due to international regulations.' : null
  };
};

module.exports = {
  calculateShippingCost,
  getShippingRestrictions,
  COUNTRY_REGIONS,
  SHIPPING_RATES,
};