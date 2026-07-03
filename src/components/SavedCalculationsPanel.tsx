'use client';

import { useFlorenceStore } from '@/store/useFlorenceStore';
import { formatAED, formatPercent } from '@/lib/calculations';
import { Card, SectionHeader, Badge } from './ui';
import { Trash2 } from 'lucide-react';

export function SavedCalculationsPanel() {
  const { savedCalculations, deleteCalculation, clearCalculations } = useFlorenceStore();

  return (
    <Card>
      <div className="flex items-center justify-between">
        <SectionHeader title="Saved Calculations" subtitle={`${savedCalculations.length} saved`} />
        {savedCalculations.length > 0 && (
          <button onClick={clearCalculations} className="text-xs text-loss hover:underline">
            Clear all
          </button>
        )}
      </div>

      {savedCalculations.length === 0 ? (
        <p className="text-sm text-muted">
          No calculations saved yet. Use “Save Calculation” on any platform tab to keep a record here.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {savedCalculations.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">{c.product.name || 'Untitled product'}</span>
                  <Badge tone="accent">{c.platform}</Badge>
                </div>
                <div className="mt-1 text-xs text-muted">
                  {new Date(c.createdAt).toLocaleString()} · Price {formatAED(c.sellingPriceInclVat)}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <div className="text-right">
                  <div className={`text-sm font-semibold tabular-nums ${c.netProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {formatAED(c.netProfit)}
                  </div>
                  <div className="text-xs text-muted">{formatPercent(c.netMarginPercent)}</div>
                </div>
                <button
                  onClick={() => deleteCalculation(c.id)}
                  className="rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-loss"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
