'use client';

import { useMemo, useState } from 'react';
import { useFlorenceStore } from '@/store/useFlorenceStore';
import { normalizeCost, profitCalcByAmount, profitCalcByPercent, formatAED, formatPercent } from '@/lib/calculations';
import { Card, SectionHeader, Field, NumberInput, PercentInput, StatCard, Row } from './ui';

export function ProfitCalculatorPanel() {
  const { product, rules } = useFlorenceStore();
  const { costExVat } = normalizeCost(product.costRaw, product.costType, rules.vatPercent);

  const [profitAmount, setProfitAmount] = useState(0);
  const [profitPercent, setProfitPercent] = useState(rules.defaultProfitPercent);

  const byAmount = useMemo(() => profitCalcByAmount(costExVat, profitAmount, rules.vatPercent), [costExVat, profitAmount, rules.vatPercent]);
  const byPercent = useMemo(() => profitCalcByPercent(costExVat, profitPercent, rules.vatPercent), [costExVat, profitPercent, rules.vatPercent]);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Card>
        <SectionHeader step="A" title="By Fixed Profit Amount" subtitle="Enter a target profit amount in AED" />
        <Field label="Profit Amount (AED)">
          <NumberInput value={profitAmount} onValueChange={setProfitAmount} />
        </Field>
        <div className="mt-5 space-y-1">
          <Row label="Your Cost — Ex-VAT" value={formatAED(byAmount.costExVat)} />
          <Row label="Profit Amount" value={formatAED(byAmount.profitAmount)} />
          <Row label="Customer Price — Ex-VAT" value={formatAED(byAmount.customerPriceExVat)} />
          <Row label={`VAT (${formatPercent(rules.vatPercent)})`} value={formatAED(byAmount.vatAmount)} muted />
          <Row label="Customer Price — Incl. VAT" value={formatAED(byAmount.customerPriceInclVat)} strong />
        </div>
        <div className="mt-4">
          <StatCard label="Implied Profit % of Price" value={formatPercent(byAmount.profitPercentOfPrice)} tone="accent" />
        </div>
      </Card>

      <Card>
        <SectionHeader step="B" title="By Profit Percentage" subtitle="Profit % = Profit ÷ Selling Price (incl. VAT)" />
        <Field label="Profit Percentage">
          <PercentInput value={profitPercent} onValueChange={setProfitPercent} />
        </Field>
        <div className="mt-5 space-y-1">
          <Row label="Your Cost — Ex-VAT" value={formatAED(byPercent.costExVat)} />
          <Row label="Profit %" value={formatPercent(byPercent.profitPercent)} />
          <Row label="Profit Amount" value={formatAED(byPercent.profitAmount)} />
          <Row label="Customer Price — Ex-VAT" value={formatAED(byPercent.customerPriceExVat)} />
          <Row label={`VAT (${formatPercent(rules.vatPercent)})`} value={formatAED(byPercent.vatAmount)} muted />
          <Row label="Customer Price — Incl. VAT" value={formatAED(byPercent.customerPriceInclVat)} strong />
        </div>
      </Card>
    </div>
  );
}
