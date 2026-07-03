'use client';

import { useState } from 'react';
import { useFlorenceStore } from '@/store/useFlorenceStore';
import { Card, SectionHeader, Field, TextInput, NumberInput, SelectInput, Row, Badge } from './ui';
import { costFromRRP, normalizeCost, formatAED } from '@/lib/calculations';

export function ProductInputPanel() {
  const { product, updateProduct, rules } = useFlorenceStore();
  const [showRrpTool, setShowRrpTool] = useState(false);

  const { costExVat, costInclVat } = normalizeCost(product.costRaw, product.costType, rules.vatPercent);
  const rrpDerivedCost = product.rrp > 0 ? costFromRRP(product.rrp, rules) : 0;

  return (
    <Card>
      <SectionHeader step="①" title="Product Details" subtitle="Shared across every calculator tab below" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Product Name">
          <TextInput
            placeholder="e.g. MacBook Air M3 — 15 inch"
            value={product.name}
            onChange={(e) => updateProduct({ name: e.target.value })}
          />
        </Field>
        <Field label="Part Number / SKU">
          <TextInput
            placeholder="e.g. MC123AB/A"
            value={product.sku}
            onChange={(e) => updateProduct({ sku: e.target.value })}
          />
        </Field>
        <Field label="Brand">
          <TextInput
            placeholder="e.g. Apple"
            value={product.brand}
            onChange={(e) => updateProduct({ brand: e.target.value })}
          />
        </Field>
        <Field label="Category (free text, optional)">
          <TextInput
            placeholder="e.g. Laptops"
            value={product.category}
            onChange={(e) => updateProduct({ category: e.target.value })}
          />
        </Field>
        <Field label="Platform">
          <SelectInput
            value={product.platform}
            onValueChange={(v) => updateProduct({ platform: v as typeof product.platform })}
            options={[
              { value: 'Noon', label: 'Noon' },
              { value: 'Shopify', label: 'Shopify (Website)' },
              { value: 'Trendyol', label: 'Trendyol' },
              { value: 'Direct Sale', label: 'Direct Sale' },
              { value: 'Other', label: 'Other' },
            ]}
          />
        </Field>
        <Field label="Stock Quantity">
          <NumberInput prefix={null} value={product.stockQty} onValueChange={(n) => updateProduct({ stockQty: n })} />
        </Field>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="RRP (AED, incl. VAT)" hint="Optional — use the RRP→Cost tool below">
          <NumberInput value={product.rrp} onValueChange={(n) => updateProduct({ rrp: n })} />
        </Field>
        <Field label="Your Cost Price (AED)">
          <NumberInput id="product-cost-input" value={product.costRaw} onValueChange={(n) => updateProduct({ costRaw: n })} />
        </Field>
        <Field label="Cost Type">
          <SelectInput
            value={product.costType}
            onValueChange={(v) => updateProduct({ costType: v as typeof product.costType })}
            options={[
              { value: 'exVat', label: 'Ex-VAT / RCM' },
              { value: 'inclVat', label: 'Incl. VAT' },
            ]}
          />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Row label="Cost — Ex-VAT" value={formatAED(costExVat)} />
        <span className="text-muted">·</span>
        <Row label="Cost — Incl. VAT" value={formatAED(costInclVat)} />
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <button
          onClick={() => setShowRrpTool((s) => !s)}
          className="text-xs font-medium text-accent hover:underline"
        >
          {showRrpTool ? 'Hide' : 'Use'} Cost-from-RRP tool ②
        </button>
        {showRrpTool && (
          <div className="mt-3 rounded-xl border border-dashed border-border bg-surface-muted p-4">
            <p className="mb-3 text-xs text-muted">
              RRP ÷ (1 + {(rules.rrpVatPercent * 100).toFixed(0)}%) × (1 − {(rules.rrpDeductionPercent * 100).toFixed(0)}%) × (1 + {(rules.rrpMarginPercent * 100).toFixed(0)}%) = Cost (ex-VAT). Edit these rates in Rules.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="accent">RRP {formatAED(product.rrp)}</Badge>
              <span className="text-muted">→</span>
              <Badge tone="profit">Derived Cost (ex-VAT) {formatAED(rrpDerivedCost)}</Badge>
              <button
                onClick={() => updateProduct({ costRaw: rrpDerivedCost, costType: 'exVat' })}
                disabled={product.rrp <= 0}
                className="ml-auto rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-black disabled:opacity-40"
              >
                Use as Cost
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
