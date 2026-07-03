'use client';

import { useFlorenceStore } from '@/store/useFlorenceStore';
import { Field, PercentInput, NumberInput, Toggle, Card } from './ui';
import { X } from 'lucide-react';

export function RulesDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { rules, updateRules, resetRules } = useFlorenceStore();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto bg-surface p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Editable Rules</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-surface-muted">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <Card>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">VAT</h3>
            <Field label="VAT Percentage">
              <PercentInput value={rules.vatPercent} onValueChange={(v) => updateRules({ vatPercent: v })} />
            </Field>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm">Add VAT on top of every platform fee</span>
              <Toggle checked={rules.vatOnFees} onChange={(v) => updateRules({ vatOnFees: v })} />
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Shopify / Gateway Rates</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Shopify Fee %">
                <PercentInput value={rules.shopifyPercent} onValueChange={(v) => updateRules({ shopifyPercent: v })} />
              </Field>
              <Field label="Stripe Fee %">
                <PercentInput value={rules.stripePercent} onValueChange={(v) => updateRules({ stripePercent: v })} />
              </Field>
              <Field label="Tabby/Tamara %">
                <PercentInput value={rules.tabbyTamaraPercent} onValueChange={(v) => updateRules({ tabbyTamaraPercent: v })} />
              </Field>
              <Field label="Tabby/Tamara Flat Fee">
                <NumberInput value={rules.tabbyTamaraFlatFee} onValueChange={(v) => updateRules({ tabbyTamaraFlatFee: v })} />
              </Field>
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Cost-from-RRP Rule</h3>
            <div className="grid grid-cols-3 gap-3">
              <Field label="VAT Removed">
                <PercentInput value={rules.rrpVatPercent} onValueChange={(v) => updateRules({ rrpVatPercent: v })} />
              </Field>
              <Field label="Deduction %">
                <PercentInput value={rules.rrpDeductionPercent} onValueChange={(v) => updateRules({ rrpDeductionPercent: v })} />
              </Field>
              <Field label="Margin Added">
                <PercentInput value={rules.rrpMarginPercent} onValueChange={(v) => updateRules({ rrpMarginPercent: v })} />
              </Field>
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Defaults</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Default Shipping (AED)">
                <NumberInput value={rules.defaultShippingAmount} onValueChange={(v) => updateRules({ defaultShippingAmount: v })} />
              </Field>
              <Field label="Default Handling (AED)">
                <NumberInput value={rules.defaultHandlingCharge} onValueChange={(v) => updateRules({ defaultHandlingCharge: v })} />
              </Field>
              <Field label="Default Profit %">
                <PercentInput value={rules.defaultProfitPercent} onValueChange={(v) => updateRules({ defaultProfitPercent: v })} />
              </Field>
            </div>
          </Card>

          <button
            onClick={resetRules}
            className="rounded-lg border border-border py-2 text-sm font-medium text-muted hover:bg-surface-muted"
          >
            Reset all rules to default
          </button>
        </div>
      </div>
    </div>
  );
}
