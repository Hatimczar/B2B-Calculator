'use client';

import { useState } from 'react';
import { Copy, Download, Save, Check } from 'lucide-react';
import { buildWhatsAppText, copyToClipboard, downloadCSV, SummaryLine } from '@/lib/export';
import { useFlorenceStore } from '@/store/useFlorenceStore';

export function ExportActions({
  platform,
  lines,
  sellingPriceInclVat,
  netProfit,
  netMarginPercent,
}: {
  platform: string;
  lines: SummaryLine[];
  sellingPriceInclVat: number;
  netProfit: number;
  netMarginPercent: number;
}) {
  const { product, saveCalculation } = useFlorenceStore();
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(buildWhatsAppText(product.name, platform, lines));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleSave = () => {
    saveCalculation({
      product,
      platform,
      sellingPriceInclVat,
      netProfit,
      netMarginPercent,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleExport = () => {
    downloadCSV(`${(product.name || 'calculation').replace(/\s+/g, '-')}-${platform}.csv`, lines);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-muted"
      >
        {copied ? <Check size={14} className="text-profit" /> : <Copy size={14} />}
        {copied ? 'Copied' : 'Copy WhatsApp Text'}
      </button>
      <button
        onClick={handleExport}
        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-muted"
      >
        <Download size={14} />
        Export CSV
      </button>
      <button
        onClick={handleSave}
        className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-black hover:bg-accent-strong"
      >
        {saved ? <Check size={14} /> : <Save size={14} />}
        {saved ? 'Saved' : 'Save Calculation'}
      </button>
    </div>
  );
}
