'use client';

import { useMemo, useState } from 'react';
import { useFlorenceStore } from '@/store/useFlorenceStore';
import { NOON_CATEGORIES, resolveNoonRate } from '@/data/noon-fees';
import { calcMarketplace, normalizeCost, formatAED, formatPercent } from '@/lib/calculations';
import { Card, SectionHeader, Field, NumberInput, TextInput, SelectInput, StatCard, Row, Badge } from './ui';
import { ExportActions } from './ExportActions';

const CATEGORY_OPTIONS = NOON_CATEGORIES.map((c) => ({
  value: c.id,
  label: `${c.family} — ${c.productType}`,
}));

export function NoonPanel() {
  const { product, rules } = useFlorenceStore();
  const [categoryId, setCategoryId] = useState(CATEGORY_OPTIONS[0]?.value ?? '');
  const [brand, setBrand] = useState(product.brand || '');
  const [sellingPrice, setSellingPrice] = useState(0);
  const [feeOverride, setFeeOverride] = useState<number | null>(null);
  const [shippingCost, setShippingCost] = useState(rules.defaultShippingAmount);
  const [handlingCharge, setHandlingCharge] = useState(rules.defaultHandlingCharge);

  const { costExVat } = normalizeCost(product.costRaw, product.costType, rules.vatPercent);

  const resolved = useMemo(
    () => resolveNoonRate(categoryId, brand, sellingPrice),
    [categoryId, brand, sellingPrice]
  );
  const feePercent = feeOverride ?? resolved.rate;

  const category = NOON_CATEGORIES.find((c) => c.id === categoryId);

  const breakdown = useMemo(
    () =>
      calcMarketplace({
        costExVat,
        sellingPriceInclVat: sellingPrice,
        feePercent,
        vatPercent: rules.vatPercent,
        vatOnFees: rules.vatOnFees,
        shippingCost,
        handlingCharge,
      }),
    [costExVat, sellingPrice, feePercent, rules.vatPercent, rules.vatOnFees, shippingCost, handlingCharge]
  );

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <SectionHeader step="①" title="Noon — Category & Selling Price" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Noon Category">
            <SelectInput id="noon-category-select" value={categoryId} onValueChange={setCategoryId} options={CATEGORY_OPTIONS} />
          </Field>
          <Field label="Brand (for exceptions)" hint="e.g. Apple, Samsung — leave blank if none applies">
            <TextInput id="noon-brand-input" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Apple" />
          </Field>
          <Field label="Selling Price on Noon (AED)" hint="What the customer pays — VAT inclusive">
            <NumberInput id="noon-selling-price-input" value={sellingPrice} onValueChange={setSellingPrice} />
          </Field>
          <Field label="Noon Fee % (auto / override)">
            <NumberInput
              prefix={null}
              value={+(feePercent * 100).toFixed(3)}
              onValueChange={(n) => setFeeOverride(n / 100)}
            />
          </Field>
          <Field label="Shipping Cost (AED)">
            <NumberInput value={shippingCost} onValueChange={setShippingCost} />
          </Field>
          <Field label="Extra Handling Charge (AED)">
            <NumberInput value={handlingCharge} onValueChange={setHandlingCharge} />
          </Field>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge tone="accent">
            {category ? `${category.family} → ${category.productType}` : 'No category'}
          </Badge>
          <Badge tone={resolved.source === 'brand-exception' ? 'profit' : 'neutral'}>
            {resolved.source === 'brand-exception' ? 'Brand exception applied' : 'Base category rate'}
          </Badge>
          {feeOverride !== null && (
            <button onClick={() => setFeeOverride(null)} className="text-xs text-accent hover:underline">
              Reset to auto rate ({formatPercent(resolved.rate)})
            </button>
          )}
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <SectionHeader step="②" title="Cost Breakdown" />
          <Row label="Your Cost — Ex-VAT" value={formatAED(breakdown.costExVat)} />
          <Row label="Your Cost — Incl. VAT" value={formatAED(breakdown.costInclVat)} />
          <Row label="VAT on Your Cost" value={formatAED(breakdown.costInclVat - breakdown.costExVat)} muted />
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <SectionHeader step="③" title="Noon Fees Breakdown" />
          <Row label="Selling Price — Ex-VAT" value={formatAED(breakdown.sellingPriceExVat)} />
          <Row label="VAT Collected on Sale" value={formatAED(breakdown.vatCollected)} muted />
          <Row label={`Noon Referral Fee (${formatPercent(breakdown.feePercent)})`} value={formatAED(breakdown.feeAmount)} />
          <Row label={`VAT on Noon Fee (${rules.vatOnFees ? formatPercent(rules.vatPercent) : 'off'})`} value={formatAED(breakdown.vatOnFee)} muted />
          <Row label="Total Noon Deduction" value={formatAED(breakdown.totalDeduction)} strong />
          <Row label="Net Revenue After Noon" value={formatAED(breakdown.netRevenue)} strong />
        </div>
      </Card>

      <div className="flex flex-col gap-5">
        <Card>
          <SectionHeader step="④" title="Profit Summary" />
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Gross Profit" value={formatAED(breakdown.grossProfit)} tone={breakdown.grossProfit >= 0 ? 'profit' : 'loss'} />
            <StatCard label="Gross Margin" value={formatPercent(breakdown.sellingPriceExVat ? breakdown.grossProfit / breakdown.sellingPriceExVat : 0)} />
            <StatCard label="Net Profit" value={formatAED(breakdown.netProfit)} tone={breakdown.netProfit >= 0 ? 'profit' : 'loss'} />
            <StatCard label="Net Margin" value={formatPercent(breakdown.netMarginPercent)} />
          </div>
          <div className="mt-4 rounded-xl border border-border bg-surface-muted p-3">
            <Row label="Shipping + Handling" value={formatAED(breakdown.shippingCost + breakdown.handlingCharge)} muted />
            <Row label="Final Profit" value={formatAED(breakdown.finalProfit)} strong />
          </div>
          <div className="mt-3 text-center">
            <Badge tone={breakdown.profitable ? 'profit' : 'loss'}>
              {breakdown.profitable ? '✓ Profitable' : '✗ Loss-Making'}
            </Badge>
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <ExportActions
              platform="Noon"
              sellingPriceInclVat={breakdown.sellingPriceInclVat}
              netProfit={breakdown.netProfit}
              netMarginPercent={breakdown.netMarginPercent}
              lines={[
                { label: 'Category', value: category ? `${category.family} — ${category.productType}` : '—' },
                { label: 'Selling Price (incl. VAT)', value: formatAED(breakdown.sellingPriceInclVat) },
                { label: 'Cost (ex-VAT)', value: formatAED(breakdown.costExVat) },
                { label: 'Noon Fee', value: `${formatAED(breakdown.feeAmount)} (${formatPercent(breakdown.feePercent)})` },
                { label: 'Total Deduction', value: formatAED(breakdown.totalDeduction) },
                { label: 'Net Revenue', value: formatAED(breakdown.netRevenue) },
                { label: 'Net Profit', value: formatAED(breakdown.netProfit) },
                { label: 'Net Margin', value: formatPercent(breakdown.netMarginPercent) },
                { label: 'Final Profit (after shipping/handling)', value: formatAED(breakdown.finalProfit) },
              ]}
            />
          </div>
        </Card>

        <Card>
          <SectionHeader step="⑤" title="Pricing Targets" />
          <Row label="Break-even Selling Price" value={formatAED(breakdown.breakEvenPrice)} />
          <Row label="Min. Price for 5% Margin" value={formatAED(breakdown.minPriceForMargin(0.05))} />
          <Row label="Min. Price for 10% Margin" value={formatAED(breakdown.minPriceForMargin(0.1))} />
          <Row label="Min. Price for 15% Margin" value={formatAED(breakdown.minPriceForMargin(0.15))} />
          <p className="mt-2 text-[11px] text-muted">Target margin = markup over cost, grossed up for VAT + Noon fee.</p>
        </Card>
      </div>
    </div>
  );
}
