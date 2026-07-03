'use client';

import { useMemo, useState } from 'react';
import { useFlorenceStore } from '@/store/useFlorenceStore';
import { NOON_CATEGORIES, resolveNoonRate } from '@/data/noon-fees';
import { TRENDYOL_CATEGORIES, resolveTrendyolRate } from '@/data/trendyol-fees';
import { calcMarketplace, calcShopifyScenarios, normalizeCost, formatAED, formatPercent } from '@/lib/calculations';
import { Card, SectionHeader, Field, NumberInput, SelectInput, Badge } from './ui';

const NOON_OPTIONS = NOON_CATEGORIES.map((c) => ({ value: c.id, label: `${c.family} — ${c.productType}` }));
const TRENDYOL_OPTIONS = TRENDYOL_CATEGORIES.map((c) => ({ value: c.id, label: `${c.categoryMain} — ${c.categoryGroup}` }));

interface ComparisonRow {
  platform: string;
  netReceived: number;
  totalCharges: number;
  profit: number;
  margin: number;
}

export function ComparePanel() {
  const { product, rules } = useFlorenceStore();
  const [sellingPrice, setSellingPrice] = useState(0);
  const [noonCategoryId, setNoonCategoryId] = useState(NOON_OPTIONS[0]?.value ?? '');
  const [trendyolCategoryId, setTrendyolCategoryId] = useState(TRENDYOL_OPTIONS[0]?.value ?? '');

  const { costExVat } = normalizeCost(product.costRaw, product.costType, rules.vatPercent);

  const rows: ComparisonRow[] = useMemo(() => {
    const noonRate = resolveNoonRate(noonCategoryId, product.brand, sellingPrice).rate;
    const noon = calcMarketplace({
      costExVat,
      sellingPriceInclVat: sellingPrice,
      feePercent: noonRate,
      vatPercent: rules.vatPercent,
      vatOnFees: rules.vatOnFees,
    });

    const trendyolRate = resolveTrendyolRate(trendyolCategoryId, product.brand, false, sellingPrice).rate;
    const trendyol = calcMarketplace({
      costExVat,
      sellingPriceInclVat: sellingPrice,
      feePercent: trendyolRate,
      vatPercent: rules.vatPercent,
      vatOnFees: rules.vatOnFees,
    });

    const shopify = calcShopifyScenarios(costExVat, sellingPrice, rules).shopifyStripe;

    const { priceExVat: directExVat } = { priceExVat: sellingPrice / (1 + rules.vatPercent) };
    const directProfit = directExVat - costExVat;

    return [
      { platform: 'Noon', netReceived: noon.netRevenue, totalCharges: noon.totalDeduction, profit: noon.netProfit, margin: noon.netMarginPercent },
      { platform: 'Trendyol', netReceived: trendyol.netRevenue, totalCharges: trendyol.totalDeduction, profit: trendyol.netProfit, margin: trendyol.netMarginPercent },
      { platform: 'Shopify + Stripe', netReceived: shopify.netRevenue, totalCharges: shopify.totalDeduction, profit: shopify.netProfit, margin: shopify.netMarginPercent },
      { platform: 'Direct Sale', netReceived: sellingPrice, totalCharges: 0, profit: directProfit, margin: sellingPrice ? directProfit / sellingPrice : 0 },
    ];
  }, [costExVat, sellingPrice, noonCategoryId, trendyolCategoryId, product.brand, rules]);

  const bestPlatform = rows.reduce((best, r) => (r.profit > best.profit ? r : best), rows[0]);

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <SectionHeader step="①" title="Compare Platforms" subtitle="Same product, same selling price, across all channels" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Selling Price (AED)" hint="VAT inclusive, same across platforms">
            <NumberInput value={sellingPrice} onValueChange={setSellingPrice} />
          </Field>
          <Field label="Noon Category">
            <SelectInput value={noonCategoryId} onValueChange={setNoonCategoryId} options={NOON_OPTIONS} />
          </Field>
          <Field label="Trendyol Category">
            <SelectInput value={trendyolCategoryId} onValueChange={setTrendyolCategoryId} options={TRENDYOL_OPTIONS} />
          </Field>
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <th className="py-2 pr-4">Platform</th>
              <th className="py-2 pr-4">Net Received</th>
              <th className="py-2 pr-4">Total Charges</th>
              <th className="py-2 pr-4">Profit</th>
              <th className="py-2 pr-4">Margin</th>
              <th className="py-2">Best?</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.platform} className="border-b border-border/60 last:border-0">
                <td className="py-2.5 pr-4 font-medium">{r.platform}</td>
                <td className="py-2.5 pr-4 tabular-nums">{formatAED(r.netReceived)}</td>
                <td className="py-2.5 pr-4 tabular-nums text-muted">{formatAED(r.totalCharges)}</td>
                <td className={`py-2.5 pr-4 tabular-nums font-semibold ${r.profit >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {formatAED(r.profit)}
                </td>
                <td className="py-2.5 pr-4 tabular-nums">{formatPercent(r.margin)}</td>
                <td className="py-2.5">
                  {r === bestPlatform && sellingPrice > 0 && <Badge tone="accent">✓ Best</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
