/**
 * Seed Script — 20 Leather Products
 * Usage: node seedProducts.js <admin-email>
 *
 * Example: node seedProducts.js admin@globalleatherhub.com
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const User = require('./src/models/User');

// ─── 20 Products ─────────────────────────────────────────────────────────────
const products = [
  // ── LEATHER JACKETS (8) ──────────────────────────────────────────────────
  {
    name: 'Classic Biker Leather Jacket',
    description:
      'A timeless biker-style jacket crafted from full-grain cowhide leather. Features asymmetric zip closure, quilted shoulder panels, snap-button lapels, and two front zip pockets. Fully lined with satin for a smooth, comfortable wear. Perfect for retail or wholesale distribution to motorcycle apparel stores.',
    category: 'leather-jackets',
    moq: 10,
    status: 'active',
    material: 'Full-grain cowhide leather, 1.2–1.4 mm thickness',
    fit: 'Slim fit; runs true to size. Available in XS–4XL.',
    pricingTiers: [
      { minQuantity: 10, maxQuantity: 49, price_usd: 89 },
      { minQuantity: 50, maxQuantity: 199, price_usd: 74 },
      { minQuantity: 200, maxQuantity: null, price_usd: 62 },
    ],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    availableColors: ['Black', 'Dark Brown', 'Vintage Brown', 'Dark Red'],
    specifications: [
      { label: 'Leather Type', value: 'Full-grain cowhide' },
      { label: 'Lining', value: 'Satin + quilted shoulder padding' },
      { label: 'Closure', value: 'YKK asymmetric zip' },
      { label: 'Pockets', value: '2 front zip, 2 side zip, 1 inner' },
      { label: 'Weight (per unit)', value: '~1.8 kg' },
      { label: 'Origin', value: 'Pakistan' },
    ],
    highlights: [
      'Full-grain cowhide — highest quality hide',
      'YKK zippers throughout',
      'Satin-lined interior',
      'Available in 4 colorways',
      'Custom branding available on MOQ 200+',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
        publicId: 'seed/jacket_biker_1',
      },
    ],
  },
  {
    name: 'Vintage Distressed Leather Jacket',
    description:
      'Aged and hand-rubbed for an authentic vintage look, this distressed leather jacket is made from top-grain lambskin. Features a button-front placket, two chest patch pockets, and a relaxed silhouette. Ideal for fashion-forward retail buyers looking for heritage-inspired designs with modern proportions.',
    category: 'leather-jackets',
    moq: 10,
    status: 'active',
    material: 'Top-grain lambskin, hand-distressed finish, 0.9–1.1 mm',
    fit: 'Relaxed fit; size up for a baggier look.',
    pricingTiers: [
      { minQuantity: 10, maxQuantity: 49, price_usd: 95 },
      { minQuantity: 50, maxQuantity: 199, price_usd: 80 },
      { minQuantity: 200, maxQuantity: null, price_usd: 67 },
    ],
    availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    availableColors: ['Vintage Tan', 'Antique Brown', 'Washed Black', 'Cognac'],
    specifications: [
      { label: 'Leather Type', value: 'Top-grain lambskin' },
      { label: 'Finish', value: 'Hand-distressed, wax-rubbed' },
      { label: 'Closure', value: 'Coconut shell buttons' },
      { label: 'Pockets', value: '2 chest patch, 2 side welt' },
      { label: 'Weight (per unit)', value: '~1.4 kg' },
      { label: 'Origin', value: 'Pakistan' },
    ],
    highlights: [
      'Hand-rubbed distressed finish — unique per batch',
      'Premium lambskin for ultra-soft hand feel',
      'Vintage button hardware',
      'Heritage-inspired silhouette',
      'OEM/ODM branding available',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
        publicId: 'seed/jacket_vintage_1',
      },
    ],
  },
  {
    name: 'Slim-Fit Moto Racing Jacket',
    description:
      'Designed for performance and style, this moto racing jacket uses perforated cowhide leather panels for breathability. CE-level padding compartments at shoulders and elbows are included (pads sold separately). The pre-curved arms and stretch panels ensure unrestricted movement. Great for motorsport apparel retailers.',
    category: 'leather-jackets',
    moq: 20,
    status: 'active',
    material: 'Perforated full-grain cowhide + stretch textile panels',
    fit: 'Athletic slim fit; pre-curved arms. Recommend sizing up one.',
    pricingTiers: [
      { minQuantity: 20, maxQuantity: 99, price_usd: 105 },
      { minQuantity: 100, maxQuantity: 299, price_usd: 88 },
      { minQuantity: 300, maxQuantity: null, price_usd: 73 },
    ],
    availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    availableColors: ['Black', 'Black/Red', 'Black/White', 'Navy Blue'],
    specifications: [
      { label: 'Leather Type', value: 'Perforated full-grain cowhide' },
      { label: 'Panels', value: 'Stretch textile at sides and underarms' },
      { label: 'Protection', value: 'CE padding compartments (shoulders & elbows)' },
      { label: 'Closure', value: 'Main zip + collar snap' },
      { label: 'Pockets', value: '4 exterior zip + 2 inner' },
      { label: 'Origin', value: 'Pakistan' },
    ],
    highlights: [
      'Perforated panels for superior airflow',
      'CE-compliant armor compartments',
      'Pre-curved ergonomic arms',
      'Stretch textile side inserts',
      'Reflective piping for night visibility',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800',
        publicId: 'seed/jacket_moto_1',
      },
    ],
  },
  {
    name: 'Women\'s Cropped Leather Jacket',
    description:
      'A fashion-forward cropped leather jacket tailored for women, crafted from soft nappa leather. The cropped length hits at the natural waist, with a notched lapel, single-button closure, and clean minimalist lines. No bulk — just structure and elegance. Ideal for fashion boutiques and online apparel brands.',
    category: 'leather-jackets',
    moq: 10,
    status: 'active',
    material: 'Nappa lamb leather, 0.8–1.0 mm, ultra-soft tannage',
    fit: 'Fitted cropped silhouette; true to size. Hem hits at natural waist.',
    pricingTiers: [
      { minQuantity: 10, maxQuantity: 49, price_usd: 82 },
      { minQuantity: 50, maxQuantity: 149, price_usd: 68 },
      { minQuantity: 150, maxQuantity: null, price_usd: 57 },
    ],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    availableColors: ['Black', 'Blush Pink', 'Ivory White', 'Camel', 'Forest Green'],
    specifications: [
      { label: 'Leather Type', value: 'Nappa lambskin' },
      { label: 'Lining', value: 'Viscose satin' },
      { label: 'Closure', value: 'Single oversized button' },
      { label: 'Lapel', value: 'Notched lapel' },
      { label: 'Weight (per unit)', value: '~1.0 kg' },
      { label: 'Origin', value: 'Pakistan' },
    ],
    highlights: [
      'Ultra-soft nappa leather',
      'Minimalist clean-line design',
      'Available in 5 fashion-forward colorways',
      'Viscose satin lining',
      'Private label available',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
        publicId: 'seed/jacket_womens_cropped_1',
      },
    ],
  },
  {
    name: 'Oversized Shearling Leather Jacket',
    description:
      'A premium shearling-lined leather jacket combining suede lamb exterior with genuine wool shearling interior. Offers exceptional warmth without bulk. Button-front with spread collar and welt pockets. Ideal for autumn/winter collections and cold-climate markets. Extremely popular in European and North American retail.',
    category: 'leather-jackets',
    moq: 10,
    status: 'active',
    material: 'Suede lambskin exterior + genuine wool shearling interior',
    fit: 'Oversized relaxed fit. Size down for a more fitted look.',
    pricingTiers: [
      { minQuantity: 10, maxQuantity: 49, price_usd: 145 },
      { minQuantity: 50, maxQuantity: 149, price_usd: 122 },
      { minQuantity: 150, maxQuantity: null, price_usd: 102 },
    ],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    availableColors: ['Natural Tan', 'Dark Brown', 'Black/Black', 'Camel/Cream'],
    specifications: [
      { label: 'Exterior', value: 'Suede-finish lambskin' },
      { label: 'Interior', value: 'Genuine wool shearling, 25mm pile' },
      { label: 'Closure', value: 'Horn-effect buttons' },
      { label: 'Collar', value: 'Wide shearling-trimmed spread collar' },
      { label: 'Weight (per unit)', value: '~2.6 kg' },
      { label: 'Origin', value: 'Pakistan' },
    ],
    highlights: [
      'Genuine wool shearling lining — natural insulation',
      'Perfect for AW collections',
      'Durable suede lambskin exterior',
      'Oversized trend-ready silhouette',
      'Horn-effect buttons',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800',
        publicId: 'seed/jacket_shearling_1',
      },
    ],
  },
  {
    name: 'Café Racer Leather Jacket',
    description:
      'Inspired by 1960s motorcycle culture, the café racer jacket features a band collar, front zip, and minimal external pockets. Made from smooth vegetable-tanned cowhide that ages beautifully with wear. A wardrobe staple that patinas uniquely over time, giving each jacket a one-of-a-kind character.',
    category: 'leather-jackets',
    moq: 10,
    status: 'active',
    material: 'Vegetable-tanned cowhide, 1.1–1.3 mm, natural tanning process',
    fit: 'Slim close-to-body fit. Size up for layering over knitwear.',
    pricingTiers: [
      { minQuantity: 10, maxQuantity: 49, price_usd: 98 },
      { minQuantity: 50, maxQuantity: 199, price_usd: 83 },
      { minQuantity: 200, maxQuantity: null, price_usd: 70 },
    ],
    availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    availableColors: ['Tan', 'Dark Brown', 'Black', 'Oxblood'],
    specifications: [
      { label: 'Leather Type', value: 'Vegetable-tanned cowhide' },
      { label: 'Finish', value: 'Natural — develops patina over time' },
      { label: 'Collar', value: 'Band collar (no lapel)' },
      { label: 'Closure', value: 'Center front YKK zip' },
      { label: 'Pockets', value: '2 side welt' },
      { label: 'Origin', value: 'Pakistan' },
    ],
    highlights: [
      'Vegetable-tanned — eco-friendly and long-lasting',
      'Develops unique patina with use',
      'Minimalist band-collar design',
      'YKK main zip',
      'Great for heritage and lifestyle brands',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=800',
        publicId: 'seed/jacket_caferacer_1',
      },
    ],
  },
  {
    name: 'Men\'s Quilted Leather Jacket',
    description:
      'A contemporary take on the quilted jacket, this piece uses soft nappa leather with diamond-quilted stitching throughout the body. Lightweight yet protective, with a stand collar and side zip pockets. The quilted pattern adds texture and dimension, making it a versatile piece for smart-casual and streetwear markets.',
    category: 'leather-jackets',
    moq: 10,
    status: 'active',
    material: 'Nappa cowhide, diamond-quilted, 1.0 mm',
    fit: 'Slim regular fit. True to size.',
    pricingTiers: [
      { minQuantity: 10, maxQuantity: 49, price_usd: 92 },
      { minQuantity: 50, maxQuantity: 199, price_usd: 77 },
      { minQuantity: 200, maxQuantity: null, price_usd: 64 },
    ],
    availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    availableColors: ['Black', 'Midnight Navy', 'Dark Olive', 'Charcoal'],
    specifications: [
      { label: 'Leather Type', value: 'Nappa cowhide' },
      { label: 'Quilting', value: 'Diamond pattern, 4 cm grid' },
      { label: 'Collar', value: 'Stand collar' },
      { label: 'Closure', value: 'Center zip + press studs' },
      { label: 'Pockets', value: '2 side zip + 1 inner' },
      { label: 'Origin', value: 'Pakistan' },
    ],
    highlights: [
      'Full-body diamond quilting',
      'Lightweight nappa — easy to wear',
      'Versatile smart-casual aesthetic',
      'Stand collar for a modern edge',
      'Custom color development on 200+ MOQ',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800',
        publicId: 'seed/jacket_quilted_1',
      },
    ],
  },
  {
    name: 'Long Trench Leather Coat',
    description:
      'An executive-level long leather trench coat reaching below the knee. Crafted from smooth top-grain cowhide with a double-breasted button front, belted waist, and storm flap. A statement outerwear piece for luxury retail and department store buyers. Timeless design with modern refined tailoring.',
    category: 'leather-jackets',
    moq: 5,
    status: 'active',
    material: 'Top-grain cowhide, smooth finish, 1.0–1.2 mm',
    fit: 'Regular tailored fit. Knee-length. Belt included.',
    pricingTiers: [
      { minQuantity: 5, maxQuantity: 24, price_usd: 175 },
      { minQuantity: 25, maxQuantity: 99, price_usd: 148 },
      { minQuantity: 100, maxQuantity: null, price_usd: 124 },
    ],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    availableColors: ['Black', 'Camel', 'Deep Burgundy', 'Dark Forest Green'],
    specifications: [
      { label: 'Leather Type', value: 'Top-grain cowhide' },
      { label: 'Length', value: 'Below-knee (approx. 110 cm for size M)' },
      { label: 'Closure', value: 'Double-breasted buttons + belt' },
      { label: 'Storm Flap', value: 'Yes — front and back' },
      { label: 'Lining', value: 'Fully lined, polyester satin' },
      { label: 'Origin', value: 'Pakistan' },
    ],
    highlights: [
      'Below-knee executive silhouette',
      'Double-breasted with storm flap',
      'Fully lined interior',
      'Detachable belt with leather keeper',
      'Low MOQ for luxury buyers',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800',
        publicId: 'seed/coat_trench_1',
      },
    ],
  },

  // ── LEATHER BELTS (6) ────────────────────────────────────────────────────
  {
    name: 'Classic Full-Grain Dress Belt',
    description:
      'A sophisticated dress belt made from a single piece of full-grain cowhide leather, burnished at the edges for a clean finish. Features a solid brass pin buckle and uniform 35mm width — ideal for formal trousers and suits. One of our highest-volume wholesale items, loved by menswear retailers worldwide.',
    category: 'leather-belts',
    moq: 50,
    status: 'active',
    material: 'Full-grain cowhide, single piece, vegetable-tanned edges',
    fit: 'Standard sizing: 28–46 inches waist. Custom lengths available on 200+ MOQ.',
    pricingTiers: [
      { minQuantity: 50, maxQuantity: 199, price_usd: 14 },
      { minQuantity: 200, maxQuantity: 499, price_usd: 11 },
      { minQuantity: 500, maxQuantity: null, price_usd: 8.5 },
    ],
    availableSizes: ['28"', '30"', '32"', '34"', '36"', '38"', '40"', '42"', '44"', '46"'],
    availableColors: ['Black', 'Dark Brown', 'Tan', 'Cognac'],
    specifications: [
      { label: 'Leather Type', value: 'Full-grain cowhide' },
      { label: 'Width', value: '35mm' },
      { label: 'Buckle', value: 'Solid brass pin buckle' },
      { label: 'Edge Finish', value: 'Burnished and painted' },
      { label: 'Thickness', value: '3.5 mm' },
      { label: 'Origin', value: 'Pakistan' },
    ],
    highlights: [
      'Single-piece full-grain construction — no joins',
      'Solid brass hardware',
      'Burnished vegetable-tanned edges',
      'Standard and custom lengths',
      'High-volume wholesale pricing',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800',
        publicId: 'seed/belt_dress_1',
      },
    ],
  },
  {
    name: 'Braided Leather Belt',
    description:
      'Handcrafted braided leather belt made by weaving three strips of top-grain leather into a classic braid pattern. Stretches slightly for a comfortable fit without punched holes. Features a polished silver roller buckle and tapered tip. A popular casual item for lifestyle and Western-wear retailers.',
    category: 'leather-belts',
    moq: 50,
    status: 'active',
    material: 'Top-grain leather strips, hand-braided, 3-strand construction',
    fit: 'One-size-fits-most per color due to braid stretch. Available in S/M/L/XL.',
    pricingTiers: [
      { minQuantity: 50, maxQuantity: 199, price_usd: 12 },
      { minQuantity: 200, maxQuantity: 499, price_usd: 9.5 },
      { minQuantity: 500, maxQuantity: null, price_usd: 7.5 },
    ],
    availableSizes: ['S (28"–32")', 'M (32"–36")', 'L (36"–40")', 'XL (40"–44")'],
    availableColors: ['Tan', 'Brown', 'Black', 'Natural'],
    specifications: [
      { label: 'Construction', value: '3-strand hand braid' },
      { label: 'Width', value: '32mm' },
      { label: 'Buckle', value: 'Polished silver roller buckle' },
      { label: 'Tip', value: 'Tapered natural tip' },
      { label: 'Stretch', value: 'Yes — no holes needed' },
      { label: 'Origin', value: 'Pakistan' },
    ],
    highlights: [
      'Authentic hand-braided construction',
      'Stretchy — no holes, fits a range of waists',
      'Silver roller buckle',
      'Casual and Western styling',
      'Great sell-through rate for lifestyle retail',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800',
        publicId: 'seed/belt_braided_1',
      },
    ],
  },
  {
    name: 'Wide Leather Work Belt',
    description:
      'A heavy-duty 45mm wide work belt made from thick chrome-tanned cowhide (4.5 mm), designed for tradespeople, workwear, and outdoor markets. The roller buckle with reinforced keeper handles daily hard use. Can support tool loops or badge clips. Extremely durable — a top seller in the industrial workwear segment.',
    category: 'leather-belts',
    moq: 50,
    status: 'active',
    material: 'Chrome-tanned cowhide, 4.5 mm thick, heavy-duty grade',
    fit: 'Waist 30"–48". Custom sizes available.',
    pricingTiers: [
      { minQuantity: 50, maxQuantity: 199, price_usd: 18 },
      { minQuantity: 200, maxQuantity: 499, price_usd: 14.5 },
      { minQuantity: 500, maxQuantity: null, price_usd: 11 },
    ],
    availableSizes: ['30"', '32"', '34"', '36"', '38"', '40"', '42"', '44"', '46"', '48"'],
    availableColors: ['Black', 'Dark Brown', 'Natural Tan'],
    specifications: [
      { label: 'Leather Type', value: 'Chrome-tanned cowhide' },
      { label: 'Width', value: '45mm' },
      { label: 'Thickness', value: '4.5 mm' },
      { label: 'Buckle', value: 'Gunmetal roller buckle with double keeper' },
      { label: 'Holes', value: '7 holes, 25mm spacing' },
      { label: 'Origin', value: 'Pakistan' },
    ],
    highlights: [
      '4.5 mm thick — built for daily hard use',
      'Wide 45mm belt for maximum support',
      'Gunmetal hardware',
      'Compatible with tool clips and badge loops',
      'Workwear and outdoor retail segment',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800',
        publicId: 'seed/belt_work_1',
      },
    ],
  },
  {
    name: 'Reversible Leather Dress Belt',
    description:
      'A smart two-in-one reversible dress belt with one side in smooth black leather and the other in dark brown, sharing a single rotating buckle. A top gift item and a staple for menswear departments. Sold with a premium gift box — ideal for retail display.',
    category: 'leather-belts',
    moq: 50,
    status: 'active',
    material: 'Bonded leather core with full-grain split leather overlay on both sides',
    fit: 'Standard sizing 30"–44". Cut-to-length at home with included instructions.',
    pricingTiers: [
      { minQuantity: 50, maxQuantity: 199, price_usd: 16 },
      { minQuantity: 200, maxQuantity: 499, price_usd: 12.5 },
      { minQuantity: 500, maxQuantity: null, price_usd: 10 },
    ],
    availableSizes: ['30"', '32"', '34"', '36"', '38"', '40"', '42"', '44"'],
    availableColors: ['Black/Dark Brown', 'Black/Tan', 'Navy/Brown'],
    specifications: [
      { label: 'Construction', value: 'Reversible with rotating buckle' },
      { label: 'Width', value: '35mm' },
      { label: 'Buckle', value: 'Rotating pin buckle, gold or silver tone' },
      { label: 'Packaging', value: 'Premium gift box included' },
      { label: 'Cut-to-length', value: 'Yes — trim to exact waist size' },
      { label: 'Origin', value: 'Pakistan' },
    ],
    highlights: [
      '2-in-1 reversible — black and brown in one belt',
      'Rotating buckle for easy flip',
      'Cut-to-length for perfect fit',
      'Gift box included — ready for retail display',
      'Best-selling gift item',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=800',
        publicId: 'seed/belt_reversible_1',
      },
    ],
  },
  {
    name: 'Women\'s Skinny Leather Belt',
    description:
      'A sleek 20mm skinny belt crafted from soft nappa leather, designed for women\'s fashion. Features a gold-tone oval frame buckle and five adjustment holes with branded punching. Works beautifully over dresses, blazers, and high-waisted trousers. A high-turnover fashion accessory for womenswear retailers.',
    category: 'leather-belts',
    moq: 50,
    status: 'active',
    material: 'Nappa cowhide, smooth finish, 2.0 mm',
    fit: 'Waist 24"–40". Also available in XS–XL sizing on request.',
    pricingTiers: [
      { minQuantity: 50, maxQuantity: 199, price_usd: 10 },
      { minQuantity: 200, maxQuantity: 499, price_usd: 8 },
      { minQuantity: 500, maxQuantity: null, price_usd: 6.5 },
    ],
    availableSizes: ['XS (24"–26")', 'S (26"–30")', 'M (30"–34")', 'L (34"–38")', 'XL (38"–40")'],
    availableColors: ['Black', 'White', 'Camel', 'Red', 'Nude Blush', 'Olive'],
    specifications: [
      { label: 'Leather Type', value: 'Nappa cowhide' },
      { label: 'Width', value: '20mm' },
      { label: 'Buckle', value: 'Gold-tone oval frame buckle' },
      { label: 'Holes', value: '5 adjustment holes' },
      { label: 'Tip', value: 'Square tip' },
      { label: 'Origin', value: 'Pakistan' },
    ],
    highlights: [
      'Ultra-slim 20mm width for womenswear',
      'Gold-tone hardware',
      'Available in 6 fashion colors',
      'Soft nappa leather',
      'High sell-through accessory item',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
        publicId: 'seed/belt_skinny_womens_1',
      },
    ],
  },
  {
    name: 'Western Tooled Leather Belt',
    description:
      'Hand-tooled with authentic floral Western patterns by skilled artisans, this decorative belt is a showpiece for Western wear, country lifestyle, and equestrian retailers. Made from thick saddle leather with a nickel concho buckle and decorative tip. Each belt is individually crafted — slight variation in tooling is part of the artisan character.',
    category: 'leather-belts',
    moq: 25,
    status: 'active',
    material: 'Saddle leather (oak-tanned), 5 mm thick, hand-tooled',
    fit: 'Waist 30"–46". Custom names or initials available on 100+ MOQ.',
    pricingTiers: [
      { minQuantity: 25, maxQuantity: 99, price_usd: 28 },
      { minQuantity: 100, maxQuantity: 299, price_usd: 23 },
      { minQuantity: 300, maxQuantity: null, price_usd: 18 },
    ],
    availableSizes: ['30"', '32"', '34"', '36"', '38"', '40"', '42"', '44"', '46"'],
    availableColors: ['Natural Tan', 'Medium Brown', 'Dark Walnut'],
    specifications: [
      { label: 'Leather Type', value: 'Oak-tanned saddle leather' },
      { label: 'Tooling', value: 'Floral Western — hand-carved by artisans' },
      { label: 'Width', value: '40mm' },
      { label: 'Buckle', value: 'Nickel concho buckle' },
      { label: 'Tip', value: 'Decorative engraved metal tip' },
      { label: 'Origin', value: 'Pakistan' },
    ],
    highlights: [
      'Authentic hand-tooled floral Western pattern',
      'Each belt is individually artisan-crafted',
      'Nickel concho buckle',
      'Custom monogramming available',
      'Ideal for Western and country lifestyle retail',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800',
        publicId: 'seed/belt_western_1',
      },
    ],
  },

  // ── LEATHER WALLETS (6) ──────────────────────────────────────────────────
  {
    name: 'Slim Minimalist Bifold Wallet',
    description:
      'A slim bifold wallet engineered for the modern man who carries only essentials. Holds up to 6 cards and folded cash. Made from full-grain cowhide with a pull-tab for easy card access. Fits comfortably in the front pocket. One of our best-selling wholesale wallet styles worldwide.',
    category: 'leather-wallets',
    moq: 100,
    status: 'active',
    material: 'Full-grain cowhide, 1.0 mm, smooth finish',
    fit: 'Dimensions: 10 × 8.5 cm folded. Capacity: 6 cards + cash slot.',
    pricingTiers: [
      { minQuantity: 100, maxQuantity: 499, price_usd: 12 },
      { minQuantity: 500, maxQuantity: 999, price_usd: 9.5 },
      { minQuantity: 1000, maxQuantity: null, price_usd: 7.5 },
    ],
    availableSizes: ['One Size'],
    availableColors: ['Black', 'Dark Brown', 'Tan', 'Navy Blue', 'Burgundy'],
    specifications: [
      { label: 'Leather Type', value: 'Full-grain cowhide' },
      { label: 'Dimensions', value: '10 × 8.5 cm folded' },
      { label: 'Card Slots', value: '6 dedicated slots' },
      { label: 'Cash Slot', value: '1 full-length note compartment' },
      { label: 'RFID Blocking', value: 'Optional (add $1.50/unit)' },
      { label: 'Origin', value: 'Pakistan' },
    ],
    highlights: [
      'Ultra-slim — front-pocket friendly',
      'Full-grain leather ages beautifully',
      'Pull-tab for fast card access',
      'Optional RFID blocking lining',
      'Private label embossing available',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
        publicId: 'seed/wallet_bifold_slim_1',
      },
    ],
  },
  {
    name: 'Full-Zip Leather Travel Wallet',
    description:
      'A full-zip travel wallet designed for international travelers. Holds passport, boarding pass, up to 12 cards, a pen loop, coin pouch, and full-length note section. Made from smooth top-grain cowhide with a YKK zipper all-around. Available in gift box packaging. A premium offering for travel retail and gift shops.',
    category: 'leather-wallets',
    moq: 50,
    status: 'active',
    material: 'Top-grain cowhide, smooth finish, 1.1 mm',
    fit: 'Dimensions: 19 × 11 cm. Fits all passport sizes.',
    pricingTiers: [
      { minQuantity: 50, maxQuantity: 199, price_usd: 22 },
      { minQuantity: 200, maxQuantity: 499, price_usd: 18 },
      { minQuantity: 500, maxQuantity: null, price_usd: 14.5 },
    ],
    availableSizes: ['One Size'],
    availableColors: ['Black', 'Brown', 'Burgundy', 'Navy'],
    specifications: [
      { label: 'Leather Type', value: 'Top-grain cowhide' },
      { label: 'Dimensions', value: '19 × 11 cm' },
      { label: 'Compartments', value: 'Passport, 12 cards, coin pouch, notes, pen loop' },
      { label: 'Closure', value: 'YKK all-around zipper' },
      { label: 'Packaging', value: 'Gift box included' },
      { label: 'Origin', value: 'Pakistan' },
    ],
    highlights: [
      'Holds passport, cards, cash, coins',
      'YKK premium zipper',
      'Pen loop — perfect for border crossings',
      'Gift box — ready for retail',
      'Top-grain leather durability',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
        publicId: 'seed/wallet_travel_zip_1',
      },
    ],
  },
  {
    name: 'Women\'s Trifold Leather Wallet',
    description:
      'A trifold wallet designed for women, featuring a large bill compartment, 12 card slots, 2 clear ID windows, a zip coin pocket, and a checkbook slot. Made from pebbled genuine leather with a snap closure. Available in a wide range of fashion colors. A consistent best-seller in the women\'s accessories category.',
    category: 'leather-wallets',
    moq: 100,
    status: 'active',
    material: 'Pebbled genuine cowhide, 1.0 mm',
    fit: 'Dimensions: 9.5 × 19 cm unfolded, 9.5 × 10.5 cm folded.',
    pricingTiers: [
      { minQuantity: 100, maxQuantity: 499, price_usd: 14 },
      { minQuantity: 500, maxQuantity: 999, price_usd: 11 },
      { minQuantity: 1000, maxQuantity: null, price_usd: 8.5 },
    ],
    availableSizes: ['One Size'],
    availableColors: ['Black', 'Blush Pink', 'Burgundy', 'Red', 'Purple', 'Tan', 'Teal', 'Ivory'],
    specifications: [
      { label: 'Leather Type', value: 'Pebbled genuine cowhide' },
      { label: 'Dimensions (folded)', value: '9.5 × 10.5 cm' },
      { label: 'Card Slots', value: '12 slots + 2 clear ID windows' },
      { label: 'Coin Pocket', value: 'Yes — zip closure' },
      { label: 'Bill Compartment', value: 'Full-length' },
      { label: 'Origin', value: 'Pakistan' },
    ],
    highlights: [
      'Large capacity — 12 cards + coin + ID',
      'Available in 8 fashion colors',
      'Pebbled texture — hides scratches',
      'Snap closure for security',
      'Top-selling women\'s accessory',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800',
        publicId: 'seed/wallet_trifold_womens_1',
      },
    ],
  },
  {
    name: 'RFID Blocking Card Holder Wallet',
    description:
      'A compact card holder wallet with built-in RFID blocking technology to protect against contactless card skimming. Holds 4–8 cards with a quick-access pull-tab. Made from full-grain cowhide with a slim profile of just 8mm when loaded. A must-stock item for tech-savvy and security-conscious consumers.',
    category: 'leather-wallets',
    moq: 100,
    status: 'active',
    material: 'Full-grain cowhide exterior + RFID-blocking aluminum layer',
    fit: 'Dimensions: 9.5 × 6.5 cm. Thickness: 8mm when loaded with 6 cards.',
    pricingTiers: [
      { minQuantity: 100, maxQuantity: 499, price_usd: 11 },
      { minQuantity: 500, maxQuantity: 999, price_usd: 8.5 },
      { minQuantity: 1000, maxQuantity: null, price_usd: 6.5 },
    ],
    availableSizes: ['One Size'],
    availableColors: ['Black', 'Dark Brown', 'Midnight Blue', 'Olive Green', 'Red'],
    specifications: [
      { label: 'Leather Type', value: 'Full-grain cowhide' },
      { label: 'RFID Blocking', value: 'Yes — 13.56 MHz NFC/RFID protected' },
      { label: 'Card Capacity', value: '4–8 cards' },
      { label: 'Thickness (loaded)', value: '8 mm' },
      { label: 'Pull Tab', value: 'Yes — quick card access' },
      { label: 'Origin', value: 'Pakistan' },
    ],
    highlights: [
      'RFID blocking — protection against data theft',
      'Ultra-slim 8mm profile',
      'Quick-access pull-tab fan design',
      'Full-grain cowhide quality',
      'Front-pocket carry ready',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1624913503273-5f9c4e980dba?w=800',
        publicId: 'seed/wallet_rfid_cardholder_1',
      },
    ],
  },
  {
    name: 'Long Leather Clutch Wallet',
    description:
      'An elegant long clutch wallet that doubles as a small evening bag. Wrist strap included. Features 12 card slots, full-length note section, coin pocket, and phone sleeve. Made from high-gloss patent nappa leather. Ideal for luxury accessories retailers and evening wear boutiques.',
    category: 'leather-wallets',
    moq: 50,
    status: 'active',
    material: 'Patent nappa leather (high-gloss), 0.9 mm, PU-coated',
    fit: 'Dimensions: 20 × 10.5 cm. Wrist strap: 22 cm, detachable.',
    pricingTiers: [
      { minQuantity: 50, maxQuantity: 199, price_usd: 24 },
      { minQuantity: 200, maxQuantity: 499, price_usd: 19.5 },
      { minQuantity: 500, maxQuantity: null, price_usd: 15.5 },
    ],
    availableSizes: ['One Size'],
    availableColors: ['Glossy Black', 'Glossy Red', 'Glossy White', 'Glossy Gold', 'Glossy Silver'],
    specifications: [
      { label: 'Leather Type', value: 'Patent nappa — high-gloss finish' },
      { label: 'Dimensions', value: '20 × 10.5 cm' },
      { label: 'Card Slots', value: '12' },
      { label: 'Phone Sleeve', value: 'Yes — fits up to 6.5" screen' },
      { label: 'Wrist Strap', value: 'Detachable, 22 cm' },
      { label: 'Origin', value: 'Pakistan' },
    ],
    highlights: [
      'High-gloss patent leather — luxury feel',
      'Doubles as an evening clutch bag',
      'Phone sleeve fits large smartphones',
      'Detachable wrist strap',
      'Available in 5 high-impact glossy colors',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800',
        publicId: 'seed/wallet_clutch_long_1',
      },
    ],
  },
  {
    name: 'Vintage Bifold Genuine Leather Wallet',
    description:
      'A classic bifold wallet with a vintage aesthetic, made from hand-finished genuine buffalo leather. Features 8 card slots, 2 billfold compartments, 1 transparent ID window, and a center divider. The distressed look gets better with age. A reliable mid-range wallet that performs well across gift, department, and online retail.',
    category: 'leather-wallets',
    moq: 100,
    status: 'active',
    material: 'Genuine buffalo leather, hand-finished, 1.2 mm',
    fit: 'Dimensions: 11 × 9.5 cm folded.',
    pricingTiers: [
      { minQuantity: 100, maxQuantity: 499, price_usd: 9.5 },
      { minQuantity: 500, maxQuantity: 999, price_usd: 7.5 },
      { minQuantity: 1000, maxQuantity: null, price_usd: 6 },
    ],
    availableSizes: ['One Size'],
    availableColors: ['Vintage Brown', 'Distressed Black', 'Antique Tan', 'Hunter Green'],
    specifications: [
      { label: 'Leather Type', value: 'Genuine buffalo leather' },
      { label: 'Finish', value: 'Hand-finished, vintage distressed' },
      { label: 'Card Slots', value: '8 + 1 ID window' },
      { label: 'Bill Compartments', value: '2 full-length' },
      { label: 'Center Divider', value: 'Yes' },
      { label: 'Origin', value: 'Pakistan' },
    ],
    highlights: [
      'Buffalo leather — tough and characterful',
      'Vintage distressed finish — ages like wine',
      'Double bill compartment',
      'Transparent ID window',
      'Excellent value for mid-market retail',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
        publicId: 'seed/wallet_vintage_bifold_1',
      },
    ],
  },
];
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  const adminEmail = process.argv[2];
  if (!adminEmail) {
    console.error('\n❌  Usage: node seedProducts.js <admin-email>\n');
    process.exit(1);
  }

  console.log(`\n🔌  Connecting to MongoDB...`);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅  Connected.\n');

  const admin = await User.findOne({ email: adminEmail, role: 'admin' });
  if (!admin) {
    console.error(`❌  No admin user found with email: ${adminEmail}`);
    console.error(`    Make sure the user exists and has role: "admin"\n`);
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`👤  Admin found: ${admin.username} (${admin.email})\n`);
  console.log(`📦  Seeding ${products.length} products...\n`);

  let created = 0;
  let skipped = 0;

  for (const p of products) {
    const exists = await Product.findOne({ name: p.name });
    if (exists) {
      console.log(`  ⚠️  Skipped (already exists): ${p.name}`);
      skipped++;
      continue;
    }
    await Product.create({ ...p, createdBy: admin._id });
    console.log(`  ✅  Created: ${p.name}`);
    created++;
  }

  console.log(`\n🎉  Done! Created: ${created} | Skipped: ${skipped}\n`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('\n❌  Seed failed:', err.message);
  process.exit(1);
});
