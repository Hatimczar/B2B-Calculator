// Trendyol UAE commission table — as confirmed against Florence's official reference sheet.
// "Tiered" categories use price-threshold codes like "8_13_50" (low%_high%_thresholdAED).
// Decoded: below/at threshold = low rate, above threshold = high rate (= the listed Service
// Commission %). This decode is consistent across every tiered row in the source sheet.
// Newcomer tiered low-rate is derived by applying the same ~20% newcomer discount used
// elsewhere in this table (not separately specified in the source — flagged as an assumption).

export interface TrendyolTier {
  upTo: number;
  standardRate: number;
  newcomerRate: number;
}

export interface TrendyolCategory {
  id: string;
  categoryMain: string;
  categoryGroup: string;
  serviceRate: number;
  newcomerRate: number;
  brandException?: { brands: string[]; rate: number; newcomerRate: number };
  tier?: TrendyolTier; // present only for tiered categories; standard/newcomer rate above apply beyond upTo
}

const NEWCOMER_DISCOUNT = 0.8; // 20% off

function tier(upTo: number, lowRate: number, highRate: number): TrendyolTier {
  return { upTo, standardRate: lowRate, newcomerRate: +(lowRate * NEWCOMER_DISCOUNT).toFixed(4) };
  // highRate is the already-known serviceRate/newcomerRate for the category, used above threshold
}

export const TRENDYOL_CATEGORIES: TrendyolCategory[] = [
  { id: 'accessories', categoryMain: 'Accessories', categoryGroup: 'Accessories', serviceRate: 0.15, newcomerRate: 0.12 },
  { id: 'gold-bars-coins', categoryMain: 'Accessories', categoryGroup: 'Gold Bars & Coins', serviceRate: 0.05, newcomerRate: 0.04 },
  { id: 'bag-luggage', categoryMain: 'Accessories', categoryGroup: 'Bag, Luggage', serviceRate: 0.15, newcomerRate: 0.12 },
  { id: 'watch-watch-set-bands', categoryMain: 'Accessories', categoryGroup: 'Watch, Watch Set, Watch Bands', serviceRate: 0.15, newcomerRate: 0.12 },
  { id: 'glasses', categoryMain: 'Accessories', categoryGroup: 'Glasses', serviceRate: 0.15, newcomerRate: 0.12 },
  { id: 'fine-jewelry', categoryMain: 'Accessories', categoryGroup: 'Fine Jewelry', serviceRate: 0.05, newcomerRate: 0.04 },
  { id: 'other-jewelry', categoryMain: 'Accessories', categoryGroup: 'Other Jewelry', serviceRate: 0.15, newcomerRate: 0.12 },
  { id: 'shoes', categoryMain: 'Shoes', categoryGroup: 'Shoes', serviceRate: 0.15, newcomerRate: 0.12 },
  { id: 'clothing', categoryMain: 'Clothing', categoryGroup: 'Clothing', serviceRate: 0.15, newcomerRate: 0.12 },
  {
    id: 'cosmetics-personal-care',
    categoryMain: 'Cosmetics & Personal Care',
    categoryGroup: 'Oral Care, Skin Care, Other Personal Care, Feminine Hygiene, Makeup, Hair Care, Shaving, Deodorant',
    serviceRate: 0.13,
    newcomerRate: 0.11,
    tier: tier(50, 0.08, 0.13),
  },
  { id: 'perfume', categoryMain: 'Cosmetics & Personal Care', categoryGroup: 'Perfume, Perfume Set, Body Spray, Cologne', serviceRate: 0.14, newcomerRate: 0.12 },
  {
    id: 'mother-baby-care',
    categoryMain: 'Supermarket',
    categoryGroup: 'Mother and Baby Care',
    serviceRate: 0.12,
    newcomerRate: 0.10,
    tier: tier(50, 0.08, 0.12),
  },
  {
    id: 'home-care-cleaning',
    categoryMain: 'Supermarket',
    categoryGroup: 'Home Care and Cleaning',
    serviceRate: 0.15,
    newcomerRate: 0.12,
    tier: tier(50, 0.08, 0.15),
  },
  {
    id: 'food-beverage-supermarket',
    categoryMain: 'Supermarket',
    categoryGroup: 'Food & Beverage',
    serviceRate: 0.11,
    newcomerRate: 0.09,
    tier: tier(50, 0.05, 0.11),
  },
  {
    id: 'personal-care-health',
    categoryMain: 'Supermarket',
    categoryGroup: 'Personal Care, Health',
    serviceRate: 0.13,
    newcomerRate: 0.11,
    tier: tier(50, 0.08, 0.13),
  },
  {
    id: 'pet-shop',
    categoryMain: 'Supermarket',
    categoryGroup: 'Pet Shop',
    serviceRate: 0.13,
    newcomerRate: 0.11,
    tier: tier(50, 0.08, 0.13),
  },
  {
    id: 'mother-baby-products',
    categoryMain: 'Mom & Baby & Child',
    categoryGroup: "Mother & Baby Products, Baby Gifts, Children's Supplies",
    serviceRate: 0.15,
    newcomerRate: 0.12,
    tier: tier(50, 0.08, 0.15),
  },
  { id: 'toys-mom-baby', categoryMain: 'Mom & Baby & Child', categoryGroup: 'Toys', serviceRate: 0.13, newcomerRate: 0.11 },
  { id: 'garden-power-tools', categoryMain: 'Garden & Power Tools', categoryGroup: 'Garden, Power Tools, Energy Systems', serviceRate: 0.15, newcomerRate: 0.12 },
  { id: 'bathroom-building-hardware', categoryMain: 'Bathroom Building & Hardware', categoryGroup: 'Bathroom Building Materials, Paint, Electrical Installation Materials, Hardware', serviceRate: 0.15, newcomerRate: 0.12 },
  { id: 'home-furniture-bathroom', categoryMain: 'Home & Furniture', categoryGroup: 'Bathroom, Home Textile, Tableware & Kitchen', serviceRate: 0.15, newcomerRate: 0.12 },
  { id: 'furniture', categoryMain: 'Home & Furniture', categoryGroup: 'Furniture', serviceRate: 0.15, newcomerRate: 0.12 },
  { id: 'home-decoration-appliances', categoryMain: 'Home & Furniture', categoryGroup: 'Home Decoration, Home Appliances', serviceRate: 0.15, newcomerRate: 0.12 },
  { id: 'playsets-toys-rc', categoryMain: 'Hobby & Entertainment', categoryGroup: 'Playsets & Toys, Remote Controlled Vehicles', serviceRate: 0.14, newcomerRate: 0.12 },
  { id: 'drones', categoryMain: 'Hobby & Entertainment', categoryGroup: 'Drones', serviceRate: 0.13, newcomerRate: 0.11 },
  { id: 'gift-hobby-party-tobacco', categoryMain: 'Hobby & Entertainment', categoryGroup: 'Gift Products, Hobby Supplies, Party Supplies, Tobacco & Accessories', serviceRate: 0.10, newcomerRate: 0.08 },
  { id: 'musical-instruments', categoryMain: 'Hobby & Entertainment', categoryGroup: 'Musical Instruments and Equipment', serviceRate: 0.15, newcomerRate: 0.12 },
  { id: 'movie-album', categoryMain: 'Hobby & Entertainment', categoryGroup: 'Movie, Album', serviceRate: 0.15, newcomerRate: 0.12 },
  { id: 'stationery-office', categoryMain: 'Stationery & Office Supplies', categoryGroup: 'Pens, Stationery, Office Supplies, Artistic Materials', serviceRate: 0.12, newcomerRate: 0.10 },
  { id: 'books', categoryMain: 'Books', categoryGroup: 'Books', serviceRate: 0.15, newcomerRate: 0.12 },
  { id: 'automobile-motorcycle', categoryMain: 'Automobile & Motorcycle', categoryGroup: 'Tires & Rims, Motorcycle, Car Audio Visual, Automobile Spare Parts', serviceRate: 0.10, newcomerRate: 0.08 },
  { id: 'sports-outdoor', categoryMain: 'Sports & Outdoor', categoryGroup: 'Equipment & Accessories, Emergency & Safety Equipment', serviceRate: 0.13, newcomerRate: 0.11 },
  { id: 'electronics-scanners-components', categoryMain: 'Electronics', categoryGroup: 'Scanners, Core Components, Ancillary Components, Printers', serviceRate: 0.07, newcomerRate: 0.06 },
  { id: 'electronics-network-modem-cables', categoryMain: 'Electronics', categoryGroup: 'Network, Modem, Software, Cable & Adapter, TV Accessories, Monitor Accessories, Notebook Accessories', serviceRate: 0.15, newcomerRate: 0.12 },
  { id: 'white-goods-ac', categoryMain: 'Electronics', categoryGroup: 'White Goods, Air Conditioning', serviceRate: 0.05, newcomerRate: 0.04 },
  { id: 'food-bev-prep-appliances', categoryMain: 'Electronics', categoryGroup: 'Food & Beverage Preparation, Other Household Electrical Appliances', serviceRate: 0.13, newcomerRate: 0.11 },
  { id: 'bluetooth-speakers', categoryMain: 'Electronics', categoryGroup: 'Bluetooth Speakers', serviceRate: 0.07, newcomerRate: 0.06 },
  { id: 'laptops-desktops', categoryMain: 'Electronics', categoryGroup: 'Laptops, Desktop Computers', serviceRate: 0.06, newcomerRate: 0.05 },
  { id: 'cameras-lenses', categoryMain: 'Electronics', categoryGroup: 'Mirrorless, Digital, DSLR Cameras, Photo & Camera Accessories, Video Cameras', serviceRate: 0.08, newcomerRate: 0.07 },
  { id: 'mobile-phones', categoryMain: 'Electronics', categoryGroup: 'Android Cell Phone, iOS Cell Phones, Keypad Cell Phone', serviceRate: 0.05, newcomerRate: 0.04 },
  { id: 'av-cables-speakers-mic', categoryMain: 'Electronics', categoryGroup: 'Video & Audio Cables, Wired Speakers, Microphone, MP Player, Satellite Receiver', serviceRate: 0.14, newcomerRate: 0.12 },
  { id: 'headsets-earphones', categoryMain: 'Electronics', categoryGroup: 'Neckband Bluetooth Headset, TWS Bluetooth Headset, Wired Earphones, On-Ear Headset', serviceRate: 0.10, newcomerRate: 0.08 },
  {
    id: 'screen-protector-cases-cables',
    categoryMain: 'Electronics',
    categoryGroup: 'Screen Protector, Cover & Case, Earphone Accessory, Selfie Stick, Charging Cables, Tablet Case, Smart Tracking Device, In-Car Phone Holder',
    serviceRate: 0.15,
    newcomerRate: 0.12,
    brandException: { brands: ['anker', 'baseus', 'huawei', 'logitech', 'samsung', 'spigen', 'ugreen'], rate: 0.10, newcomerRate: 0.08 },
  },
  {
    id: 'chargers-power-products',
    categoryMain: 'Electronics',
    categoryGroup: 'Chargers, Power Products',
    serviceRate: 0.15,
    newcomerRate: 0.12,
    brandException: { brands: ['anker', 'baseus', 'huawei', 'logitech', 'samsung', 'spigen', 'ugreen'], rate: 0.10, newcomerRate: 0.08 },
  },
  { id: 'vacuum-cleaner', categoryMain: 'Electronics', categoryGroup: 'Vacuum Cleaner, Robot Vacuum Cleaner', serviceRate: 0.13, newcomerRate: 0.11 },
  { id: 'audio-systems-home-theater', categoryMain: 'Electronics', categoryGroup: 'Audio Systems, Home Theater System', serviceRate: 0.06, newcomerRate: 0.05 },
  {
    id: 'games-consoles',
    categoryMain: 'Electronics',
    categoryGroup: 'PC Game, PS4 Game, PS5 Game, Xbox Game, Nintendo Game, Game Consoles',
    serviceRate: 0.15,
    newcomerRate: 0.12,
    brandException: { brands: ['hyperx', 'jbl', 'logitech', 'razer', 'sony'], rate: 0.05, newcomerRate: 0.04 },
  },
  { id: 'peripherals-data-storage', categoryMain: 'Electronics', categoryGroup: 'Peripherals, Data Storage', serviceRate: 0.10, newcomerRate: 0.08 },
  { id: 'computer-spare-parts', categoryMain: 'Electronics', categoryGroup: 'Computer Spare Parts', serviceRate: 0.07, newcomerRate: 0.06 },
  { id: 'tablet-graphic-tablet', categoryMain: 'Electronics', categoryGroup: 'Tablet, Graphic Tablet, Kids Drawing Tablet', serviceRate: 0.07, newcomerRate: 0.06 },
  {
    id: 'console-gamepads-accessories',
    categoryMain: 'Electronics',
    categoryGroup: 'Console Gamepads, PlayStation Accessories, Xbox Accessories, Gaming Hardware',
    serviceRate: 0.14,
    newcomerRate: 0.12,
    brandException: { brands: ['hyperx', 'jbl', 'logitech', 'razer', 'sony'], rate: 0.05, newcomerRate: 0.04 },
  },
  { id: 'personal-care-appliances', categoryMain: 'Electronics', categoryGroup: 'Personal Care Appliances', serviceRate: 0.125, newcomerRate: 0.10 },
  { id: 'printer-consumables', categoryMain: 'Electronics', categoryGroup: 'Printer Consumables', serviceRate: 0.135, newcomerRate: 0.11 },
  { id: 'monitor-gaming-monitor', categoryMain: 'Electronics', categoryGroup: 'Monitor, Gaming Monitor', serviceRate: 0.06, newcomerRate: 0.05 },
  { id: 'smart-wristband-vr', categoryMain: 'Electronics', categoryGroup: 'Smart Wristband, Smartwatch, VR Goggles, Smartwatch for Kids', serviceRate: 0.07, newcomerRate: 0.06 },
  { id: 'cell-phone-spare-parts', categoryMain: 'Electronics', categoryGroup: 'Cell Phone Spare Parts', serviceRate: 0.15, newcomerRate: 0.12 },
  { id: 'playstation-xbox-nintendo-console', categoryMain: 'Electronics', categoryGroup: 'PlayStation 3/4/5, Nintendo Console, Xbox Console', serviceRate: 0.05, newcomerRate: 0.04 },
  { id: 'projection-soundbars', categoryMain: 'Electronics', categoryGroup: 'Projection Device, Soundbars', serviceRate: 0.07, newcomerRate: 0.06 },
  { id: 'refurbished-smartwatch-tablet', categoryMain: 'Electronics', categoryGroup: 'Refurbished Smartwatch, Refurbished Tablet', serviceRate: 0.12, newcomerRate: 0.10 },
  { id: 'refurbished-mobile-phone', categoryMain: 'Electronics', categoryGroup: 'Refurbished Mobile Phone', serviceRate: 0.07, newcomerRate: 0.06 },
  { id: 'second-hand-mobile', categoryMain: 'Electronics', categoryGroup: 'Second-Hand Mobile Phones', serviceRate: 0.08, newcomerRate: 0.07 },
  { id: 'smart-bracelet-accessories', categoryMain: 'Electronics', categoryGroup: 'Smart Bracelet Accessories, Smartwatch Accessories', serviceRate: 0.15, newcomerRate: 0.12 },
  { id: 'smart-home-systems', categoryMain: 'Electronics', categoryGroup: 'Smart Home Systems', serviceRate: 0.14, newcomerRate: 0.12 },
  { id: 'tv', categoryMain: 'Electronics', categoryGroup: 'TV', serviceRate: 0.08, newcomerRate: 0.07 },
  { id: 'refurbished-computers', categoryMain: 'Electronics', categoryGroup: 'Refurbished Computers', serviceRate: 0.08, newcomerRate: 0.07 },
];

export interface ResolvedTrendyolRate {
  rate: number;
  source: 'brand-exception' | 'tier-below' | 'tier-above' | 'flat';
}

export function resolveTrendyolRate(
  categoryId: string,
  brand: string | undefined,
  isNewSeller: boolean,
  priceInclVat: number
): ResolvedTrendyolRate {
  const category = TRENDYOL_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return { rate: 0.15, source: 'flat' };

  if (brand && category.brandException) {
    const normalizedBrand = brand.trim().toLowerCase();
    if (category.brandException.brands.includes(normalizedBrand)) {
      return {
        rate: isNewSeller ? category.brandException.newcomerRate : category.brandException.rate,
        source: 'brand-exception',
      };
    }
  }

  if (category.tier) {
    if (priceInclVat <= category.tier.upTo) {
      return {
        rate: isNewSeller ? category.tier.newcomerRate : category.tier.standardRate,
        source: 'tier-below',
      };
    }
    return { rate: isNewSeller ? category.newcomerRate : category.serviceRate, source: 'tier-above' };
  }

  return { rate: isNewSeller ? category.newcomerRate : category.serviceRate, source: 'flat' };
}
