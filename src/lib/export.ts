export interface SummaryLine {
  label: string;
  value: string;
}

export function buildWhatsAppText(productName: string, platform: string, lines: SummaryLine[]): string {
  const header = `*${productName || 'Product'}* — ${platform}\n`;
  const body = lines.map((l) => `${l.label}: ${l.value}`).join('\n');
  return `${header}${body}\n\n_Florence Trading FZCO — Price Calculator_`;
}

export function downloadCSV(filename: string, lines: SummaryLine[]) {
  const rows = [['Field', 'Value'], ...lines.map((l) => [l.label, l.value])];
  const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  triggerDownload(filename, csv, 'text/csv;charset=utf-8;');
}

export function downloadSummaryText(filename: string, productName: string, platform: string, lines: SummaryLine[]) {
  const text = buildWhatsAppText(productName, platform, lines);
  triggerDownload(filename, text, 'text/plain;charset=utf-8;');
}

function triggerDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
