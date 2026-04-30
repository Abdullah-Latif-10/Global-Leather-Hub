// Currency utilities for the application

export const EXCHANGE_RATES = {
  USD: 1.0,
  EUR: 0.85,
  GBP: 0.73,
  AUD: 1.35,
  CAD: 1.25,
  CNY: 6.45,
};

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  AUD: 'A$',
  CAD: 'C$',
  CNY: '¥',
};

export const CURRENCY_NAMES = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  CNY: 'Chinese Yuan',
};

export const getCurrencySymbol = (currency) => {
  return CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS.USD;
};

export const convertCurrency = (amount, toCurrency = 'USD', fromCurrency = 'USD') => {
  if (!EXCHANGE_RATES[fromCurrency] || !EXCHANGE_RATES[toCurrency]) return amount;
  const usdAmount = amount / EXCHANGE_RATES[fromCurrency];
  const convertedAmount = usdAmount * EXCHANGE_RATES[toCurrency];
  return Math.round(convertedAmount * 100) / 100;
};

export const formatCurrency = (amount, currency = 'USD', applyConversion = false) => {
  const symbol = getCurrencySymbol(currency);
  const finalAmount = applyConversion ? convertCurrency(amount, currency, 'USD') : amount;
  return `${symbol}${finalAmount.toFixed(2)}`;
};