import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_RULES, FlorenceRules } from '@/data/default-rules';
import { CostType } from '@/lib/calculations';

export interface ProductState {
  name: string;
  sku: string;
  brand: string;
  category: string;
  platform: 'Noon' | 'Shopify' | 'Trendyol' | 'Direct Sale' | 'Other';
  rrp: number;
  costRaw: number;
  costType: CostType;
  stockQty: number;
}

export const EMPTY_PRODUCT: ProductState = {
  name: '',
  sku: '',
  brand: '',
  category: '',
  platform: 'Noon',
  rrp: 0,
  costRaw: 0,
  costType: 'exVat',
  stockQty: 0,
};

export interface SavedCalculation {
  id: string;
  createdAt: string;
  product: ProductState;
  platform: string;
  sellingPriceInclVat: number;
  netProfit: number;
  netMarginPercent: number;
  notes?: string;
}

interface FlorenceStoreState {
  rules: FlorenceRules;
  product: ProductState;
  savedCalculations: SavedCalculation[];
  updateRules: (patch: Partial<FlorenceRules>) => void;
  resetRules: () => void;
  updateProduct: (patch: Partial<ProductState>) => void;
  resetProduct: () => void;
  saveCalculation: (calc: Omit<SavedCalculation, 'id' | 'createdAt'>) => void;
  deleteCalculation: (id: string) => void;
  clearCalculations: () => void;
}

export const useFlorenceStore = create<FlorenceStoreState>()(
  persist(
    (set) => ({
      rules: DEFAULT_RULES,
      product: EMPTY_PRODUCT,
      savedCalculations: [],

      updateRules: (patch) => set((state) => ({ rules: { ...state.rules, ...patch } })),
      resetRules: () => set({ rules: DEFAULT_RULES }),

      updateProduct: (patch) => set((state) => ({ product: { ...state.product, ...patch } })),
      resetProduct: () => set({ product: EMPTY_PRODUCT }),

      saveCalculation: (calc) =>
        set((state) => ({
          savedCalculations: [
            { ...calc, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
            ...state.savedCalculations,
          ],
        })),
      deleteCalculation: (id) =>
        set((state) => ({ savedCalculations: state.savedCalculations.filter((c) => c.id !== id) })),
      clearCalculations: () => set({ savedCalculations: [] }),
    }),
    { name: 'florence-price-calculator' }
  )
);
