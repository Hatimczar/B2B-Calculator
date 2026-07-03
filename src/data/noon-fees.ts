// Noon UAE referral fee tables — transcribed verbatim from Florence's official Noon rate sheet.
// Tiered categories use a whole-price threshold switch (confirmed): crossing the threshold
// changes the rate for the ENTIRE selling price, not just the portion above it.

export interface NoonTier {
  upTo: number | null; // AED, inclusive upper bound; null = no upper bound
  rate: number; // decimal, e.g. 0.15 = 15%
}

export interface NoonCategory {
  id: string;
  family: string;
  productType: string;
  tiers: NoonTier[]; // ascending by upTo, last entry has upTo: null
  remarks?: string;
}

export interface NoonBrandException {
  categoryId: string;
  brands: string[]; // lowercase for matching
  rate: number;
  label?: string;
}

const flat = (rate: number): NoonTier[] => [{ upTo: null, rate }];
const tiered = (upTo: number, lowRate: number, highRate: number): NoonTier[] => [
  { upTo, rate: lowRate },
  { upTo: null, rate: highRate },
];

export const NOON_CATEGORIES: NoonCategory[] = [
  // Fashion
  { id: 'fashion-apparel-footwear', family: 'Fashion', productType: 'Apparel, Footwear', tiers: flat(0.27), remarks: 'Some exceptions apply' },

  // Watches
  { id: 'watches-all', family: 'Watches', productType: 'All', tiers: tiered(5000, 0.15, 0.05) },

  // Eyewear
  { id: 'eyewear-all', family: 'Eyewear', productType: 'All', tiers: flat(0.15) },

  // Jewelry
  { id: 'jewelry-gold-bars-coins', family: 'Jewelry', productType: 'Gold Bars & Coins', tiers: flat(0.05) },
  { id: 'jewelry-silver-bars', family: 'Jewelry', productType: 'Silver Bars', tiers: flat(0.10) },
  { id: 'jewelry-fine-jewelry', family: 'Jewelry', productType: 'Fine Jewelry', tiers: tiered(1000, 0.16, 0.05), remarks: 'Source formatting was ambiguous for Fine/Other Jewelry — verify with Noon before relying on this' },
  { id: 'jewelry-other-jewelry', family: 'Jewelry', productType: 'Other Jewelry', tiers: tiered(1000, 0.16, 0.05), remarks: 'Source formatting was ambiguous for Fine/Other Jewelry — verify with Noon before relying on this' },

  // Bags & Luggage
  { id: 'bags-travel-luggage', family: 'Bags & Luggage', productType: 'Travel Luggage', tiers: flat(0.20) },
  { id: 'bags-all-other', family: 'Bags & Luggage', productType: 'All other bags', tiers: flat(0.25) },

  // Home
  { id: 'home-cleaning-hygiene', family: 'Home', productType: 'Cleaning & Hygiene', tiers: flat(0.09) },
  { id: 'home-bath-bedding-decor', family: 'Home', productType: 'Bath, Bedding, Home Decor, Home Improvement, Gardening, Kitchen & Dining', tiers: flat(0.15) },
  { id: 'home-furniture', family: 'Home', productType: 'Furniture', tiers: tiered(750, 0.15, 0.10), remarks: 'Some exceptions apply' },

  // Health & Beauty
  { id: 'health-fragrance', family: 'Health & Beauty', productType: 'Fragrance', tiers: flat(0.14) },
  { id: 'health-colour-cosmetics', family: 'Health & Beauty', productType: 'Colour Cosmetics', tiers: tiered(50, 0.08, 0.15) },
  { id: 'health-hair-skin-personal-care', family: 'Health & Beauty', productType: 'Hair, Skin & Personal Care', tiers: tiered(50, 0.08, 0.15) },
  { id: 'health-electronic-personal-care', family: 'Health & Beauty', productType: 'Electronic Personal Care', tiers: tiered(50, 0.08, 0.15) },
  { id: 'health-nutrition', family: 'Health & Beauty', productType: 'Health Nutrition', tiers: tiered(50, 0.08, 0.14) },

  // Electronics — Audio & Video
  { id: 'av-tv-projectors-streaming', family: 'Electronics — Audio & Video', productType: 'Televisions, Projectors, Streaming Devices', tiers: flat(0.05), remarks: 'Some exceptions apply' },
  { id: 'av-players-accessories', family: 'Electronics — Audio & Video', productType: 'Audio Video Players, Accessories', tiers: flat(0.10) },
  { id: 'av-tv-accessories-cases-bags', family: 'Electronics — Audio & Video', productType: 'TV Accessories, Cases & Bags', tiers: flat(0.15) },

  // Electronics — Mobiles
  { id: 'mobiles-phones-tablets-ereaders', family: 'Electronics — Mobiles', productType: 'Phones, Tablets, E-Book Readers', tiers: tiered(500, 0.06, 0.05), remarks: 'Apple / Samsung international versions: flat 6% (see brand exceptions)' },
  { id: 'mobiles-sim-cards', family: 'Electronics — Mobiles', productType: 'Sim Cards', tiers: flat(0.04) },
  { id: 'mobiles-stylus-pens', family: 'Electronics — Mobiles', productType: 'Stylus Digital Pens', tiers: flat(0.10) },
  { id: 'mobiles-accessories-top-brands', family: 'Electronics — Mobiles', productType: 'Accessories — Top Brands (Apple, Anker, Ugreen, Samsung, Baseus, Spigen)', tiers: flat(0.15) },
  { id: 'mobiles-accessories-other-brands', family: 'Electronics — Mobiles', productType: 'Accessories — Other Brands', tiers: flat(0.20) },

  // Electronics — PC Store
  { id: 'pc-laptops-desktop', family: 'Electronics — PC Store', productType: 'Laptops and Desktop', tiers: flat(0.065), remarks: 'Some exceptions apply' },
  { id: 'pc-memory-card', family: 'Electronics — PC Store', productType: 'Memory Card', tiers: flat(0.075) },
  { id: 'pc-flash-drives', family: 'Electronics — PC Store', productType: 'Flash Drives', tiers: tiered(250, 0.155, 0.085) },
  { id: 'pc-other-storage', family: 'Electronics — PC Store', productType: 'Other Storage Devices (SSDs, HDs etc.)', tiers: flat(0.065) },
  { id: 'pc-networking-accessories', family: 'Electronics — PC Store', productType: 'Networking Accessories', tiers: flat(0.065) },
  { id: 'pc-monitors-graphic-cards', family: 'Electronics — PC Store', productType: 'Monitors, Graphic Cards', tiers: flat(0.065) },
  { id: 'pc-other-computer-hardware', family: 'Electronics — PC Store', productType: 'Other Computer Hardware', tiers: flat(0.135) },
  { id: 'pc-other-accessories', family: 'Electronics — PC Store', productType: 'Other Accessories (general)', tiers: flat(0.135) },
  { id: 'pc-accessories-input-devices', family: 'Electronics — PC Store', productType: 'Input Devices (Keyboard, Mice, Numeric Keypads, Pointers, Touch Pads)', tiers: flat(0.135), remarks: 'Apple: 8% (see brand exceptions)' },
  { id: 'pc-accessories-laptop-skin', family: 'Electronics — PC Store', productType: 'Laptop Skin', tiers: flat(0.135), remarks: 'Apple: 9% (see brand exceptions)' },
  { id: 'pc-softwares', family: 'Electronics — PC Store', productType: 'Softwares', tiers: flat(0.155) },
  { id: 'pc-laptop-bags-sleeves', family: 'Electronics — PC Store', productType: 'Laptop Bags & Sleeves', tiers: flat(0.155) },

  // Electronics — Office Electronics
  { id: 'office-printers-scanners', family: 'Electronics — Office Electronics', productType: 'Printers, Scanner & Accessories', tiers: flat(0.065) },
  { id: 'office-other', family: 'Electronics — Office Electronics', productType: 'Other Office Electronics', tiers: flat(0.135) },

  // Electronics — Headphones
  { id: 'headphones-headphones', family: 'Electronics — Headphones', productType: 'Headphones', tiers: tiered(250, 0.15, 0.08), remarks: 'Apple/Samsung 7%, Yasmina 12% (see brand exceptions)' },
  { id: 'headphones-accessories', family: 'Electronics — Headphones', productType: 'Headphone Accessories', tiers: tiered(250, 0.15, 0.08), remarks: 'Apple/Samsung 7%, Yasmina 12% (see brand exceptions)' },

  // Electronics — Wearables
  { id: 'wearables-vr-headsets', family: 'Electronics — Wearables', productType: 'VR Headsets', tiers: flat(0.12), remarks: 'Apple/Sony/HTC/Oculus/Samsung/Meta/Xiaomi/HP: 7.5% (see brand exceptions)' },
  { id: 'wearables-smartwatches', family: 'Electronics — Wearables', productType: 'Smartwatches, Fitness Bands, Smart Glasses, Smart Rings, AR Glasses', tiers: flat(0.15), remarks: 'Samsung/Huawei 6%, Apple/Amazfit/Honor/Garmin/Xiaomi/Fitbit 7.5% (see brand exceptions)' },
  { id: 'wearables-accessories', family: 'Electronics — Wearables', productType: 'Wearable Accessories', tiers: flat(0.15) },

  // Electronics — Camera
  { id: 'camera-cameras-lenses-scopes', family: 'Electronics — Camera', productType: 'Cameras, Lenses, Scopes', tiers: flat(0.06) },
  { id: 'camera-support-stabilizers', family: 'Electronics — Camera', productType: 'Camera Support Stabilizers', tiers: flat(0.08) },
  { id: 'camera-other-accessories', family: 'Electronics — Camera', productType: 'All other Camera Accessories', tiers: tiered(250, 0.15, 0.08) },

  // Electronics — Home Appliances
  { id: 'appliances-large', family: 'Electronics — Home Appliances', productType: 'Large Appliance', tiers: tiered(50, 0.15, 0.05), remarks: 'Some exceptions apply' },
  { id: 'appliances-small', family: 'Electronics — Home Appliances', productType: 'Small Appliances', tiers: flat(0.13), remarks: 'LG/Xiaomi: 10% (see brand exceptions)' },

  // Electronics — Video Games
  { id: 'vg-consoles', family: 'Electronics — Video Games', productType: 'VG Consoles', tiers: flat(0.06), remarks: 'Some exceptions apply' },
  { id: 'vg-video-games', family: 'Electronics — Video Games', productType: 'Video Games', tiers: flat(0.10), remarks: 'Sony: 5% (see brand exceptions)' },
  { id: 'vg-gift-cards', family: 'Electronics — Video Games', productType: 'Gift Cards', tiers: flat(0.05) },
  { id: 'vg-other-accessories', family: 'Electronics — Video Games', productType: 'Other Accessories', tiers: flat(0.15), remarks: 'Sony 5%, Microsoft/RAZER/HyperX/Logitech and other listed gaming brands 10% (see brand exceptions)' },

  // Books & Media
  { id: 'books', family: 'Books & Media', productType: 'Books', tiers: flat(0.15) },
  { id: 'music', family: 'Books & Media', productType: 'Music', tiers: flat(0.15) },
  { id: 'video', family: 'Books & Media', productType: 'Video', tiers: flat(0.10) },

  // Baby & Kids
  { id: 'baby-products', family: 'Baby & Kids', productType: 'Baby Products', tiers: tiered(50, 0.08, 0.15) },
  { id: 'baby-toys', family: 'Baby & Kids', productType: 'Toys', tiers: flat(0.14) },

  // Pets
  { id: 'pets-furniture', family: 'Pets', productType: 'Pet Furniture', tiers: tiered(50, 0.08, 0.15) },
  { id: 'pets-toys', family: 'Pets', productType: 'Toys', tiers: flat(0.14) },
  { id: 'pets-all-others', family: 'Pets', productType: 'All Others', tiers: flat(0.09) },

  // Automotive
  { id: 'auto-audio-video', family: 'Automotive', productType: 'Audio & Video', tiers: flat(0.05) },
  { id: 'auto-vehicles', family: 'Automotive', productType: 'Vehicles', tiers: flat(0.05), remarks: 'Effective from 1 Jan 2026' },
  { id: 'auto-garage-tyres', family: 'Automotive', productType: 'Garage Equipment & Tyres', tiers: flat(0.06), remarks: 'Effective from 1 Jan 2026' },
  { id: 'auto-others', family: 'Automotive', productType: 'Others', tiers: flat(0.10) },

  // Other Categories
  { id: 'other-food-beverages', family: 'Other Categories', productType: 'Food & Beverages', tiers: flat(0.09) },
  { id: 'other-sports-outdoors', family: 'Other Categories', productType: 'Sports & Outdoors', tiers: tiered(30, 0.20, 0.13) },
  { id: 'other-stationery-office', family: 'Other Categories', productType: 'Stationery & Office Supplies', tiers: flat(0.12), remarks: 'Some exceptions apply' },
  { id: 'other-all-other-categories', family: 'Other Categories', productType: 'All Other Categories (catch-all)', tiers: flat(0.14) },
];

export const NOON_BRAND_EXCEPTIONS: NoonBrandException[] = [
  { categoryId: 'av-tv-projectors-streaming', brands: ['jvc', 'videocon', 'impex'], rate: 0.08 },
  { categoryId: 'mobiles-phones-tablets-ereaders', brands: ['apple', 'samsung'], rate: 0.06, label: 'International versions' },
  { categoryId: 'headphones-headphones', brands: ['apple', 'samsung'], rate: 0.07 },
  { categoryId: 'headphones-headphones', brands: ['yasmina'], rate: 0.12 },
  { categoryId: 'headphones-accessories', brands: ['apple', 'samsung'], rate: 0.07 },
  { categoryId: 'headphones-accessories', brands: ['yasmina'], rate: 0.12 },
  { categoryId: 'appliances-small', brands: ['lg', 'xiaomi'], rate: 0.10 },
  { categoryId: 'vg-video-games', brands: ['sony'], rate: 0.05 },
  { categoryId: 'vg-other-accessories', brands: ['sony'], rate: 0.05 },
  {
    categoryId: 'vg-other-accessories',
    brands: [
      'microsoft', 'next level racing', 'cougar', 'astro', 'turtle beach', 'kotion each',
      'steelseries', 'steel series', 'hori', 'powera', 'razer', 'thrustmaster', 'nintendo',
      'nacon', 'logitech', 'hyperx', 'onikuma', 'astro gaming', 'gameon', 'corsair', 'vertux',
      'redragon', 'ajazz', 'pdp', 'cronusmax', 'royal kludge', 'cronus zen', 'pxn', 'keychron',
    ],
    rate: 0.10,
  },
  { categoryId: 'wearables-smartwatches', brands: ['samsung', 'huawei'], rate: 0.06, label: 'Smartwatch / Fitness Tracker' },
  { categoryId: 'wearables-smartwatches', brands: ['apple', 'amazfit', 'honor', 'garmin', 'xiaomi', 'fitbit'], rate: 0.075, label: 'Smartwatch / Fitness Tracker' },
  { categoryId: 'wearables-vr-headsets', brands: ['apple', 'sony', 'htc', 'oculus', 'samsung', 'meta', 'xiaomi', 'hp'], rate: 0.075 },
  { categoryId: 'pc-accessories-input-devices', brands: ['apple'], rate: 0.08 },
  { categoryId: 'pc-accessories-laptop-skin', brands: ['apple'], rate: 0.09 },
];

export function lookupNoonTierRate(tiers: NoonTier[], priceInclVat: number): number {
  for (const tier of tiers) {
    if (tier.upTo === null || priceInclVat <= tier.upTo) return tier.rate;
  }
  return tiers[tiers.length - 1].rate;
}

export function resolveNoonRate(
  categoryId: string,
  brand: string | undefined,
  priceInclVat: number
): { rate: number; source: 'brand-exception' | 'base-tier' | 'fallback' } {
  const category = NOON_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return { rate: 0.14, source: 'fallback' };

  if (brand) {
    const normalizedBrand = brand.trim().toLowerCase();
    const exception = NOON_BRAND_EXCEPTIONS.find(
      (e) => e.categoryId === categoryId && e.brands.includes(normalizedBrand)
    );
    if (exception) return { rate: exception.rate, source: 'brand-exception' };
  }

  return { rate: lookupNoonTierRate(category.tiers, priceInclVat), source: 'base-tier' };
}
