export interface FlorenceRules {
  vatPercent: number; // default 5%
  vatOnFees: boolean; // whether 5% VAT is added on top of every platform/gateway fee

  // Shopify / Website payment scenarios
  shopifyPercent: number; // Shopify transaction fee %
  stripePercent: number; // Stripe (credit card) %
  tabbyTamaraPercent: number; // BNPL %
  tabbyTamaraFlatFee: number; // BNPL flat AED fee

  // Cost-from-RRP rule
  rrpVatPercent: number; // VAT % removed from RRP first
  rrpDeductionPercent: number; // % deducted after VAT removal
  rrpMarginPercent: number; // supplier margin % added after deduction

  // General
  defaultShippingAmount: number;
  defaultHandlingCharge: number;
  defaultProfitPercent: number;
}

export const DEFAULT_RULES: FlorenceRules = {
  vatPercent: 0.05,
  vatOnFees: true,

  shopifyPercent: 0.02,
  stripePercent: 0.031,
  tabbyTamaraPercent: 0.0699,
  tabbyTamaraFlatFee: 1.5,

  rrpVatPercent: 0.05,
  rrpDeductionPercent: 0.13,
  rrpMarginPercent: 0.02,

  defaultShippingAmount: 0,
  defaultHandlingCharge: 0,
  defaultProfitPercent: 0.1,
};
