'use client';

import { useMemo, useState } from 'react';
import { useFlorenceStore } from '@/store/useFlorenceStore';
import { calcDirectSale, formatAED, formatPercent } from '@/lib/calculations';
import { Card, SectionHeader, Field, NumberInput, StatCard, Row, Badge } from './ui';
import { ExportActions } from './ExportActions';

export function DirectSalePanel() {
  const { product, rules } = useFlorenceStore();
  const [sellingPrice, setSellingPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(rules.defaultShippingAmount);
  const [handlingCharge, setHandlingCharge] = useState(rules.defaultHandlingCharge);

  const breakdown = useMemo(
    () =>
      calcDirectSale(
        product.costRaw,
        product.costType,
        sellingPrice,
        rules.vatPercent,
        shippingCost,
        handlingCharge
      ),
    [product.costRaw, product.costType, sellingPrice, rules.vatPercent, shippingCost, handlingCharge]
  );

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <SectionHeader step="①" title="Direct Sale — No Platform Fees" subtitle="Just VAT, cost, and your profit" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Selling Price (AED)" hint="What the customer pays — VAT inclusive">
            <NumberInput value={sellingPrice} onValueChange={setSellingPrice} />
          </Field>
          <Field label="Shipping Cost (AED)">
            <NumberInput value={shippingCost} onValueChange={setShippingCost} />
          </Field>
          <Field label="Extra Handling Charge (AED)">
            <NumberInput value={handlingCharge} onValueChange={setHandlingCharge} />
          </Field>
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <SectionHeader step="②" title="VAT Breakdown" />
          <Row label="Your Cost — Ex-VAT" value={formatAED(breakdown.costExVat)} />
          <Row label="Your Cost — Incl. VAT" value={formatAED(breakdown.costInclVat)} muted />
          <Row label="Selling Price — Ex-VAT" value={formatAED(breakdown.sellingPriceExVat)} />
          <Row label="VAT Collected on Sale" value={formatAED(breakdown.vatCollected)} muted />
          <Row label="Final Customer Price" value={formatAED(breakdown.finalCustomerPrice)} strong />
        </div>
      </Card>

      <Card>
        <SectionHeader step="③" title="Profit" />
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Profit" value={formatAED(breakdown.profit)} tone={breakdown.profitable ? 'profit' : 'loss'} />
          <StatCard label="Profit %" value={formatPercent(breakdown.profitPercent)} />
        </div>
        <div className="mt-3 text-center">
          <Badge tone={breakdown.profitable ? 'profit' : 'loss'}>{breakdown.profitable ? '✓ Profitable' : '✗ Loss-Making'}</Badge>
        </div>
        <div className="mt-4 border-t border-border pt-4">
          <ExportActions
            platform="Direct Sale"
            sellingPriceInclVat={breakdown.finalCustomerPrice}
            netProfit={breakdown.profit}
            netMarginPercent={breakdown.profitPercent}
            lines={[
              { label: 'Selling Price (incl. VAT)', value: formatAED(breakdown.finalCustomerPrice) },
              { label: 'Cost (ex-VAT)', value: formatAED(breakdown.costExVat) },
              { label: 'VAT Collected', value: formatAED(breakdown.vatCollected) },
              { label: 'Profit', value: formatAED(breakdown.profit) },
              { label: 'Profit %', value: formatPercent(breakdown.profitPercent) },
            ]}
          />
        </div>
      </Card>
    </div>
  );
}
