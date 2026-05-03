const { parsePhoneNumberFromString } = require('libphonenumber-js');

const DIAL_CODES = {
  AF: '93', AL: '355', DZ: '213', AS: '1-684', AD: '376', AO: '244', AI: '1-264',
  AG: '1-268', AR: '54', AM: '374', AW: '297', AU: '61', AT: '43', AZ: '994',
  BS: '1-242', BH: '973', BD: '880', BB: '1-246', BY: '375', BE: '32', BZ: '501',
  BJ: '229', BM: '1-441', BT: '975', BO: '591', BA: '387', BW: '267', BR: '55',
  BN: '673', BG: '359', BF: '226', BI: '257', KH: '855', CM: '237', CA: '1',
  CV: '238', KY: '1-345', CF: '236', TD: '235', CL: '56', CN: '86', CO: '57',
  KM: '269', CG: '242', CD: '243', CK: '682', CR: '506', CI: '225', HR: '385',
  CU: '53', CY: '357', CZ: '420', DK: '45', DJ: '253', DM: '1-767', DO: '1-809',
  EC: '593', EG: '20', SV: '503', GQ: '240', ER: '291', EE: '372', SZ: '268',
  ET: '251', FJ: '679', FI: '358', FR: '33', GA: '241', GM: '220', GE: '995',
  DE: '49', GH: '233', GR: '30', GD: '1-473', GT: '502', GN: '224', GW: '245',
  GY: '592', HT: '509', HN: '504', HK: '852', HU: '36', IS: '354', IN: '91',
  ID: '62', IR: '98', IQ: '964', IE: '353', IL: '972', IT: '39', JM: '1-876',
  JP: '81', JO: '962', KZ: '7', KE: '254', KI: '686', KP: '850', KR: '82',
  KW: '965', KG: '996', LA: '856', LV: '371', LB: '961', LS: '266', LR: '231',
  LY: '218', LI: '423', LT: '370', LU: '352', MO: '853', MG: '261', MW: '265',
  MY: '60', MV: '960', ML: '223', MT: '356', MH: '692', MR: '222', MU: '230',
  MX: '52', FM: '691', MD: '373', MC: '377', MN: '976', ME: '382', MA: '212',
  MZ: '258', MM: '95', NA: '264', NR: '674', NP: '977', NL: '31', NZ: '64',
  NI: '505', NE: '227', NG: '234', MK: '389', NO: '47', OM: '968', PK: '92',
  PW: '680', PS: '970', PA: '507', PG: '675', PY: '595', PE: '51', PH: '63',
  PL: '48', PT: '351', QA: '974', RO: '40', RU: '7', RW: '250', KN: '1-869',
  LC: '1-758', VC: '1-784', WS: '685', SM: '378', ST: '239', SA: '966',
  SN: '221', RS: '381', SC: '248', SL: '232', SG: '65', SK: '421', SI: '386',
  SB: '677', SO: '252', ZA: '27', SS: '211', ES: '34', LK: '94', SD: '249',
  SR: '597', SE: '46', CH: '41', SY: '963', TW: '886', TJ: '992', TZ: '255',
  TH: '66', TL: '670', TG: '228', TO: '676', TT: '1-868', TN: '216', TR: '90',
  TM: '993', TV: '688', UG: '256', UA: '380', AE: '971', GB: '44', US: '1',
  UY: '598', UZ: '998', VU: '678', VE: '58', VN: '84', YE: '967', ZM: '260',
  ZW: '263',
};

const POSTAL_PATTERNS = {
  US: /^\d{5}(-\d{4})?$/,
  GB: /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i,
  CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
  AU: /^\d{4}$/,
  DE: /^\d{5}$/,
  FR: /^\d{5}$/,
  IN: /^\d{6}$/,
  PK: /^\d{5}$/,
  CN: /^\d{6}$/,
  JP: /^\d{3}-?\d{4}$/,
  AE: /^$/,
};

const sanitizeString = (value) => String(value || '').trim();
const normalizeCountryCode = (value) => sanitizeString(value).toUpperCase();

const validatePhoneForCountry = (phone, countryCode) => {
  const rawPhone = sanitizeString(phone);
  const selectedCountryCode = normalizeCountryCode(countryCode);

  if (!rawPhone) {
    return { error: 'Phone number is required' };
  }

  let parsedPhone = null;

  if (selectedCountryCode) {
    parsedPhone = parsePhoneNumberFromString(rawPhone, selectedCountryCode);

    if (!parsedPhone && !rawPhone.startsWith('+')) {
      const dialCode = DIAL_CODES[selectedCountryCode];
      if (dialCode) {
        const digitsOnly = rawPhone.replace(/[^\d]/g, '');
        parsedPhone = parsePhoneNumberFromString(
          `+${dialCode.replace(/\D/g, '')}${digitsOnly}`
        );
      }
    }
  } else {
    parsedPhone = parsePhoneNumberFromString(rawPhone);
  }

  if (!parsedPhone || !parsedPhone.isValid()) {
    return {
      error: selectedCountryCode
        ? 'Phone number is not valid for the selected country'
        : 'Phone number must be in valid international format',
    };
  }

  if (selectedCountryCode && parsedPhone.country && parsedPhone.country !== selectedCountryCode) {
    return {
      error: 'Phone number is not valid for the selected country',
    };
  }

  return { e164: parsedPhone.number };
};

const validateShippingAddress = (payload) => {
  const fullName = sanitizeString(payload.fullName);
  const country = sanitizeString(payload.country);
  const countryCode = normalizeCountryCode(payload.countryCode);
  const city = sanitizeString(payload.city);
  const state = sanitizeString(payload.state);
  const postalCode = sanitizeString(payload.postalCode);
  const address = sanitizeString(payload.address);
  const additionalDetails = sanitizeString(payload.additionalDetails);

  const errors = [];

  if (!fullName) errors.push({ field: 'fullName', message: 'Full name is required' });
  if (!country) errors.push({ field: 'country', message: 'Country is required' });
  if (!countryCode) errors.push({ field: 'countryCode', message: 'Country code is required' });
  if (!city) errors.push({ field: 'city', message: 'City is required' });
  if (!state) errors.push({ field: 'state', message: 'State / Province is required' });
  if (!postalCode) errors.push({ field: 'postalCode', message: 'Postal code is required' });
  if (!address) errors.push({ field: 'address', message: 'Address is required' });

  const phoneValidation = validatePhoneForCountry(payload.phone, countryCode);
  if (phoneValidation.error) {
    errors.push({ field: 'phone', message: phoneValidation.error });
  }

  if (postalCode && countryCode) {
    const pattern = POSTAL_PATTERNS[countryCode];
    if (pattern && !pattern.test(postalCode)) {
      errors.push({ field: 'postalCode', message: `Invalid postal code format for ${countryCode}` });
    }
  }

  return {
    errors,
    shippingAddress: {
      fullName,
      country,
      countryCode,
      city,
      state,
      postalCode,
      address,
      phone: phoneValidation.e164 || sanitizeString(payload.phone),
      latitude: Number.isFinite(Number(payload.latitude)) ? Number(payload.latitude) : undefined,
      longitude: Number.isFinite(Number(payload.longitude)) ? Number(payload.longitude) : undefined,
      additionalDetails: additionalDetails || undefined,
    },
  };
};

module.exports = {
  DIAL_CODES,
  validateShippingAddress,
};