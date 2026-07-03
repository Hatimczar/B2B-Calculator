'use client';

import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { X, Upload } from 'lucide-react';
import { useFlorenceStore } from '@/store/useFlorenceStore';

interface ImportedRow {
  [key: string]: string | number;
}

const FIELD_GUESSES: Record<string, string[]> = {
  name: ['product name', 'name', 'title', 'description'],
  sku: ['sku', 'part number', 'part_number', 'partnumber', 'code'],
  brand: ['brand'],
  costRaw: ['cost', 'cost price', 'purchase cost', 'cost (ex-vat)', 'cost ex vat'],
  rrp: ['rrp', 'retail price', 'list price'],
};

function guessColumn(headers: string[], keys: string[]): string | null {
  const lower = headers.map((h) => h.toLowerCase().trim());
  for (const key of keys) {
    const idx = lower.indexOf(key);
    if (idx !== -1) return headers[idx];
  }
  return null;
}

export function ImportDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { updateProduct } = useFlorenceStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ImportedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  if (!open) return null;

  const handleFile = (file: File) => {
    setError(null);
    setFileName(file.name);
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'numbers') {
      setError('Apple Numbers files can\'t be read directly. In Numbers, use File → Export To → Excel or CSV, then upload that file here.');
      setRows([]);
      setHeaders([]);
      return;
    }

    if (ext === 'csv') {
      Papa.parse<ImportedRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data;
          setRows(data);
          setHeaders(data.length ? Object.keys(data[0]) : []);
        },
        error: (err) => setError(err.message),
      });
      return;
    }

    if (ext === 'xlsx' || ext === 'xls') {
      file.arrayBuffer().then((buf) => {
        try {
          const wb = XLSX.read(buf, { type: 'array' });
          const sheet = wb.Sheets[wb.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json<ImportedRow>(sheet, { defval: '' });
          setRows(data);
          setHeaders(data.length ? Object.keys(data[0]) : []);
        } catch {
          setError('Could not read this Excel file. Please check the file is not corrupted.');
        }
      });
      return;
    }

    setError('Unsupported file type. Please upload .xlsx, .xls, or .csv.');
  };

  const loadRowIntoProduct = (row: ImportedRow) => {
    const nameCol = guessColumn(headers, FIELD_GUESSES.name);
    const skuCol = guessColumn(headers, FIELD_GUESSES.sku);
    const brandCol = guessColumn(headers, FIELD_GUESSES.brand);
    const costCol = guessColumn(headers, FIELD_GUESSES.costRaw);
    const rrpCol = guessColumn(headers, FIELD_GUESSES.rrp);

    updateProduct({
      name: nameCol ? String(row[nameCol] ?? '') : '',
      sku: skuCol ? String(row[skuCol] ?? '') : '',
      brand: brandCol ? String(row[brandCol] ?? '') : '',
      costRaw: costCol ? Number(row[costCol]) || 0 : 0,
      rrp: rrpCol ? Number(row[rrpCol]) || 0 : 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-surface p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Import Products</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-surface-muted">
            <X size={18} />
          </button>
        </div>

        <div
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-muted p-8 text-center"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
        >
          <Upload size={28} className="mb-2 text-muted" />
          <p className="text-sm text-foreground">Drag & drop, or click to choose a file</p>
          <p className="mt-1 text-xs text-muted">.xlsx, .xls, or .csv</p>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv,.numbers"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-loss/30 bg-loss-bg p-3 text-sm text-loss">{error}</div>
        )}

        {rows.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs text-muted">
              {fileName} — {rows.length} row{rows.length === 1 ? '' : 's'} found. Click a row to load it into Product
              Details.
            </p>
            <div className="max-h-64 overflow-auto rounded-xl border border-border">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-surface-muted">
                  <tr>
                    {headers.map((h) => (
                      <th key={h} className="whitespace-nowrap px-3 py-2 text-left font-medium text-muted">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 50).map((row, i) => (
                    <tr
                      key={i}
                      className="cursor-pointer border-t border-border/60 hover:bg-surface-muted"
                      onClick={() => loadRowIntoProduct(row)}
                    >
                      {headers.map((h) => (
                        <td key={h} className="whitespace-nowrap px-3 py-1.5">
                          {String(row[h] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
