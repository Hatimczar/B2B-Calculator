import { FlorenceRules } from '@/data/default-rules';

export type CostType = 'exVat' | 'inclVat';

export const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

export interface CostBreakdown {
  costExVat: number;
  costInclVat: number;
  vatOnCost: number;
}

export function normalizeCost(cost: number, costType: CostType, vatPercent: number): CostBreakdown {
  const costExVat = costType === 'inclVat' ? cost / (1 + vatPercent) : cost;
  const costInclVat = costExVat * (1 + vatPercent);
  return { costExVat, costInclVat, vatOnCost: costInclVat - costExVat };
}

export interface PriceSplit {
  priceExVat: number;
  vatCollected: number;
}

export function splitSellingPrice(priceInclVat: number, vatPercent: number): PriceSplit {
  const priceExVat = priceInclVat / (1 + vatPercent);
  return { priceExVat, vatCollected: priceInclVat - priceExVat };
}

/** RRP -> Cost (ex-VAT). Sequential: remove VAT, then deduct %, then add supplier margin %. */
export function costFromRRP(rrp: number, rules: FlorenceRules): number {
  const exVat = rrp / (1 + rules.rrpVatPercent);
  const afterDeduction = exVat * (1 - rules.rrpDeductionPercent);
  const withMargin = afterDeduction * (1 + rules.rrpMarginPercent);
  return withMargin;
}

export interface MarketplaceBreakdown {
  costExVat: number;
  costInclVat: number;
  sellingPriceInclVat: number;
  sellingPriceExVat: number;
  vatCollected: number;
  feePercent: number;
  feeAmount: number;
  vatOnFee: number;
  totalDeduction: number;
  netRevenue: number;
  grossProfit: number;
  netProfit: number;
  netMarginPercent: number;
  shippingCost: number;
  handlingCharge: number;
  finalProfit: number;
  breakEvenPrice: number;
  minPriceForMargin: (marginPercent: number) => number;
  profitable: boolean;
}

/**
 * Shared engine for marketplace-style channels (Noon, Trendyol): a referral/commission
 * fee is charged on the VAT-inclusive selling price, and (optionally) 5% VAT is charged
 * on top of that fee.
 */
export function calcMarketplace(params: {
  costExVat: number;
  sellingPriceInclVat: number;
  feePercent: number;
  vatPercent: number;
  vatOnFees: boolean;
  shippingCost?: number;
  handlingCharge?: number;
}): MarketplaceBreakdown {
  const { costExVat, sellingPriceInclVat, feePercent, vatPercent, vatOnFees } = params;
  const shippingCost = params.shippingCost ?? 0;
  const handlingCharge = params.handlingCharge ?? 0;

  const costInclVat = costExVat * (1 + vatPercent);
  const { priceExVat: sellingPriceExVat, vatCollected } = splitSellingPrice(sellingPriceInclVat, vatPercent);

  const feeAmount = sellingPriceInclVat * feePercent;
  const vatOnFee = vatOnFees ? feeAmount * vatPercent : 0;
  const totalDeduction = feeAmount + vatOnFee;
  const netRevenue = sellingPriceInclVat - totalDeduction;

  const grossProfit = sellingPriceExVat - costExVat;
  // Net Profit is fully ex-VAT: revenue ex-VAT minus cost ex-VAT minus fee minus VAT-on-fee.
  // (VAT collected on the sale is a liability owed to the FTA, not profit.)
  const netProfit = grossProfit - totalDeduction;
  const netMarginPercent = sellingPriceInclVat !== 0 ? netProfit / sellingPriceInclVat : 0;
  const finalProfit = netProfit - shippingCost - handlingCharge;

  const feeGrossUp = vatOnFees ? feePercent * (1 + vatPercent) : feePercent;
  const priceToExVatFactor = 1 / (1 + vatPercent) - feeGrossUp;
  const breakEvenPrice = costExVat / priceToExVatFactor;
  const minPriceForMargin = (marginPercent: number) => (costExVat * (1 + marginPercent)) / priceToExVatFactor;

  return {
    costExVat,
    costInclVat,
    sellingPriceInclVat,
    sellingPriceExVat,
    vatCollected,
    feePercent,
    feeAmount,
    vatOnFee,
    totalDeduction,
    netRevenue,
    grossProfit,
    netProfit,
    netMarginPercent,
    shippingCost,
    handlingCharge,
    finalProfit,
    breakEvenPrice,
    minPriceForMargin,
    profitable: finalProfit > 0,
  };
}

export interface GatewayBreakdown {
  label: string;
  costExVat: number;
  sellingPriceInclVat: number;
  sellingPriceExVat: number;
  vatCollected: number;
  fees: { label: string; amount: number }[];
  totalFees: number;
  vatOnFees: number;
  totalDeduction: number;
  netRevenue: number;
  netProfit: number;
  netMarginPercent: number;
  profitable: boolean;
}

function calcGatewayScenario(
  label: string,
  costExVat: number,
  sellingPriceInclVat: number,
  fees: { label: string; amount: number }[],
  vatPercent: number,
  vatOnFees: boolean
): GatewayBreakdown {
  const { priceExVat: sellingPriceExVat, vatCollected } = splitSellingPrice(sellingPriceInclVat, vatPercent);
  const totalFees = fees.reduce((sum, f) => sum + f.amount, 0);
  const vatOnFeesAmt = vatOnFees ? totalFees * vatPercent : 0;
  const totalDeduction = totalFees + vatOnFeesAmt;
  const netRevenue = sellingPriceInclVat - totalDeduction;
  // Net Profit is fully ex-VAT: revenue ex-VAT minus cost ex-VAT minus fees (VAT collected on
  // the sale is owed to the FTA, not profit — see calcMarketplace for the same convention).
  const netProfit = sellingPriceExVat - costExVat - totalDeduction;
  const netMarginPercent = sellingPriceInclVat !== 0 ? netProfit / sellingPriceInclVat : 0;

  return {
    label,
    costExVat,
    sellingPriceInclVat,
    sellingPriceExVat,
    vatCollected,
    fees,
    totalFees,
    vatOnFees: vatOnFeesAmt,
    totalDeduction,
    netRevenue,
    netProfit,
    netMarginPercent,
    profitable: netProfit > 0,
  };
}

export interface ShopifyScenarios {
  shopifyStripe: GatewayBreakdown; // Shopify checkout + Credit Card
  paymentLink: GatewayBreakdown; // Direct Stripe payment link
  shopifyBnpl: GatewayBreakdown; // Shopify checkout + Tabby/Tamara
  directBnpl: GatewayBreakdown; // Direct Tabby/Tamara link
}

export function calcShopifyScenarios(
  costExVat: number,
  sellingPriceInclVat: number,
  rules: FlorenceRules
): ShopifyScenarios {
  const { vatPercent, vatOnFees, shopifyPercent, stripePercent, tabbyTamaraPercent, tabbyTamaraFlatFee } = rules;

  const shopifyStripe = calcGatewayScenario(
    'Shopify + Credit Card (Stripe)',
    costExVat,
    sellingPriceInclVat,
    [
      { label: 'Shopify Fee (2%)', amount: sellingPriceInclVat * shopifyPercent },
      { label: 'Stripe Fee (3.1%)', amount: sellingPriceInclVat * stripePercent },
    ],
    vatPercent,
    vatOnFees
  );

  const paymentLink = calcGatewayScenario(
    'Direct Payment Link (Stripe only)',
    costExVat,
    sellingPriceInclVat,
    [{ label: 'Stripe Fee (3.1%)', amount: sellingPriceInclVat * stripePercent }],
    vatPercent,
    vatOnFees
  );

  const shopifyBnpl = calcGatewayScenario(
    'Shopify + BNPL (Tabby/Tamara)',
    costExVat,
    sellingPriceInclVat,
    [
      { label: 'Shopify Fee (2%)', amount: sellingPriceInclVat * shopifyPercent },
      { label: 'Tabby/Tamara Fee (6.99%)', amount: sellingPriceInclVat * tabbyTamaraPercent },
      { label: 'Tabby/Tamara Flat Fee', amount: tabbyTamaraFlatFee },
    ],
    vatPercent,
    vatOnFees
  );

  const directBnpl = calcGatewayScenario(
    'Direct BNPL Link (Tabby/Tamara only)',
    costExVat,
    sellingPriceInclVat,
    [
      { label: 'Tabby/Tamara Fee (6.99%)', amount: sellingPriceInclVat * tabbyTamaraPercent },
      { label: 'Tabby/Tamara Flat Fee', amount: tabbyTamaraFlatFee },
    ],
    vatPercent,
    vatOnFees
  );

  return { shopifyStripe, paymentLink, shopifyBnpl, directBnpl };
}

export interface DirectSaleBreakdown {
  costExVat: number;
  costInclVat: number;
  sellingPriceInclVat: number;
  sellingPriceExVat: number;
  vatCollected: number;
  handlingCharge: number;
  shippingCost: number;
  profit: number;
  profitPercent: number;
  finalCustomerPrice: number;
  profitable: boolean;
}

export function calcDirectSale(
  rawCost: number,
  costType: CostType,
  sellingPriceInclVat: number,
  vatPercent: number,
  shippingCost = 0,
  handlingCharge = 0
): DirectSaleBreakdown {
  const { costExVat, costInclVat } = normalizeCost(rawCost, costType, vatPercent);
  const { priceExVat: sellingPriceExVat, vatCollected } = splitSellingPrice(sellingPriceInclVat, vatPercent);
  const profit = sellingPriceExVat - costExVat - shippingCost - handlingCharge;
  const profitPercent = sellingPriceInclVat !== 0 ? profit / sellingPriceInclVat : 0;

  return {
    costExVat,
    costInclVat,
    sellingPriceInclVat,
    sellingPriceExVat,
    vatCollected,
    handlingCharge,
    shippingCost,
    profit,
    profitPercent,
    finalCustomerPrice: sellingPriceInclVat,
    profitable: profit > 0,
  };
}

export interface ProfitByAmountResult {
  costExVat: number;
  profitAmount: number;
  customerPriceExVat: number;
  vatAmount: number;
  customerPriceInclVat: number;
  profitPercentOfPrice: number;
}

/** Profit Calculator — Section 7A: fixed profit amount entered by the user. */
export function profitCalcByAmount(costExVat: number, profitAmount: number, vatPercent: number): ProfitByAmountResult {
  const customerPriceExVat = costExVat + profitAmount;
  const vatAmount = customerPriceExVat * vatPercent;
  const customerPriceInclVat = customerPriceExVat + vatAmount;
  return {
    costExVat,
    profitAmount,
    customerPriceExVat,
    vatAmount,
    customerPriceInclVat,
    profitPercentOfPrice: customerPriceInclVat !== 0 ? profitAmount / customerPriceInclVat : 0,
  };
}

export interface ProfitByPercentResult {
  costExVat: number;
  profitPercent: number;
  profitAmount: number;
  customerPriceExVat: number;
  vatAmount: number;
  customerPriceInclVat: number;
}

/**
 * Profit Calculator — Section 7B: target profit % entered by the user.
 * Convention: profit % = Profit ÷ Selling Price (incl. VAT) — same convention as the
 * "Net Margin %" figure reported throughout the Noon/Trendyol/Shopify panels.
 */
export function profitCalcByPercent(costExVat: number, profitPercent: number, vatPercent: number): ProfitByPercentResult {
  const denominator = 1 / (1 + vatPercent) - profitPercent;
  const customerPriceInclVat = denominator > 0 ? costExVat / denominator : 0;
  const customerPriceExVat = customerPriceInclVat / (1 + vatPercent);
  const vatAmount = customerPriceInclVat - customerPriceExVat;
  const profitAmount = customerPriceExVat - costExVat;

  return {
    costExVat,
    profitPercent,
    profitAmount,
    customerPriceExVat,
    vatAmount,
    customerPriceInclVat,
  };
}

export function formatAED(n: number): string {
  return `AED ${round2(n).toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPercent(n: number): string {
  return `${round2(n * 100)}%`;
}
