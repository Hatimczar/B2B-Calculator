'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { Settings, Upload } from 'lucide-react';
import { ProductInputPanel } from '@/components/ProductInputPanel';
import { NoonPanel } from '@/components/NoonPanel';
import { ShopifyPanel } from '@/components/ShopifyPanel';
import { TrendyolPanel } from '@/components/TrendyolPanel';
import { DirectSalePanel } from '@/components/DirectSalePanel';
import { ProfitCalculatorPanel } from '@/components/ProfitCalculatorPanel';
import { ComparePanel } from '@/components/ComparePanel';
import { SavedCalculationsPanel } from '@/components/SavedCalculationsPanel';
import { RulesDrawer } from '@/components/RulesDrawer';
import { ImportDrawer } from '@/components/ImportDrawer';

const TABS = [
  { id: 'noon', label: 'Noon' },
  { id: 'shopify', label: 'Shopify' },
  { id: 'trendyol', label: 'Trendyol' },
  { id: 'direct', label: 'Direct Sale' },
  { id: 'profit', label: 'Profit Calculator' },
  { id: 'compare', label: 'Compare' },
  { id: 'saved', label: 'Saved' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('noon');
  const [rulesOpen, setRulesOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Florence <span className="text-accent">Price Calculator</span>
          </h1>
          <p className="text-xs text-muted sm:text-sm">Florence Trading FZCO — Noon · Shopify · Trendyol · Direct Sale</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-surface"
          >
            <Upload size={15} /> Import
          </button>
          <button
            onClick={() => setRulesOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-surface"
          >
            <Settings size={15} /> Rules
          </button>
        </div>
      </header>

      <div className="mb-5">
        <ProductInputPanel />
      </div>

      <nav className="mb-5 flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              activeTab === tab.id ? 'bg-accent text-black' : 'text-muted hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="flex-1">
        {activeTab === 'noon' && <NoonPanel />}
        {activeTab === 'shopify' && <ShopifyPanel />}
        {activeTab === 'trendyol' && <TrendyolPanel />}
        {activeTab === 'direct' && <DirectSalePanel />}
        {activeTab === 'profit' && <ProfitCalculatorPanel />}
        {activeTab === 'compare' && <ComparePanel />}
        {activeTab === 'saved' && <SavedCalculationsPanel />}
      </main>

      <footer className="mt-10 pb-4 text-center text-[11px] text-muted">
        All figures in AED, rounded to 2 decimals · VAT-on-fees and platform rates are editable in Rules
      </footer>

      <RulesDrawer open={rulesOpen} onClose={() => setRulesOpen(false)} />
      <ImportDrawer open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}
