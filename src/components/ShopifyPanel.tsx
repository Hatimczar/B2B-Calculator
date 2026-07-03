'use client';

import { useMemo, useState } from 'react';
import { useFlorenceStore } from '@/store/useFlorenceStore';
import { calcShopifyScenarios, normalizeCost, formatAED, formatPercent, GatewayBreakdown } from '@/lib/calculations';
import { Card, SectionHeader, Field, NumberInput, StatCard, Row, Badge } from './ui';

function ScenarioCard({ breakdown, best }: { breakdown: GatewayBreakdown; best: boolean }) {
  return (
    <Card className={best ? 'ring-2 ring-accent' : ''}>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">{breakdown.label}</h4>
        {best && <Badge tone="accent">Best</Badge>}
      </div>
      {breakdown.fees.map((f) => (
        <Row key={f.label} label={f.label} value={formatAED(f.amount)} muted />
      ))}
      <Row label="VAT on Fees" value={formatAED(breakdown.vatOnFees)} muted />
      <Row label="Total Deduction" value={formatAED(breakdown.totalDeduction)} strong />
      <Row label="Net Revenue" value={formatAED(breakdown.netRevenue)} />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <StatCard label="Net Profit" value={formatAED(breakdown.netProfit)} tone={breakdown.profitable ? 'profit' : 'loss'} size="sm" />
        <StatCard label="Net Margin" value={formatPercent(breakdown.netMarginPercent)} size="sm" />
      </div>
      <div className="mt-2 text-center">
        <Badge tone={breakdown.profitable ? 'profit' : 'loss'}>{breakdown.profitable ? '✓ Profitable' : '✗ Loss'}</Badge>
      </div>
    </Card>
  );
}

export function ShopifyPanel() {
  const { product, rules } = useFlorenceStore();
  const [sellingPrice, setSellingPrice] = useState(0);

  const { costExVat } = normalizeCost(product.costRaw, product.costType, rules.vatPercent);

  const scenarios = useMemo(
    () => calcShopifyScenarios(costExVat, sellingPrice, rules),
    [costExVat, sellingPrice, rules]
  );

  const list = [scenarios.shopifyStripe, scenarios.paymentLink, scenarios.shopifyBnpl, scenarios.directBnpl];
  const bestProfit = Math.max(...list.map((s) => s.netProfit));

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <SectionHeader
          step="①"
          title="Website — Selling Price"
          subtitle="All 4 payment scenarios (Shopify + Stripe, Payment Link, Shopify + BNPL, Direct BNPL) calculate simultaneously"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-md">
          <Field label="Selling Price (AED)" hint="What the customer pays — VAT inclusive">
            <NumberInput value={sellingPrice} onValueChange={setSellingPrice} />
          </Field>
          <Field label="Your Cost — Ex-VAT">
            <div className="flex h-[38px] items-center rounded-lg border border-border bg-surface-muted px-3 text-sm text-muted">
              {formatAED(costExVat)}
            </div>
          </Field>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {list.map((s) => (
          <ScenarioCard key={s.label} breakdown={s} best={s.netProfit === bestProfit && sellingPrice > 0} />
        ))}
      </div>

      <Card>
        <SectionHeader title="Rate Reference" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted sm:grid-cols-4">
          <span>Shopify: {formatPercent(rules.shopifyPercent)}</span>
          <span>Stripe: {formatPercent(rules.stripePercent)}</span>
          <span>Tabby/Tamara: {formatPercent(rules.tabbyTamaraPercent)} + {formatAED(rules.tabbyTamaraFlatFee)}</span>
          <span>VAT on fees: {rules.vatOnFees ? 'On' : 'Off'}</span>
        </div>
      </Card>
    </div>
  );
}
