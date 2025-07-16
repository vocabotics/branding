import { create } from 'zustand';
import { BrandPack, ProcessingStatus } from '@/types/brand';

interface AppState {
  apiKey: string;
  model: string;
  currentBrandPack: BrandPack | null;
  processingStatus: ProcessingStatus | null;
  brandPacks: BrandPack[];
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  setCurrentBrandPack: (brandPack: BrandPack | null) => void;
  setProcessingStatus: (status: ProcessingStatus | null) => void;
  addBrandPack: (brandPack: BrandPack) => void;
  removeBrandPack: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  apiKey: '',
  model: 'openai/gpt-4-vision-preview',
  currentBrandPack: null,
  processingStatus: null,
  brandPacks: [],
  setApiKey: (key) => set({ apiKey: key }),
  setModel: (model) => set({ model }),
  setCurrentBrandPack: (brandPack) => set({ currentBrandPack: brandPack }),
  setProcessingStatus: (status) => set({ processingStatus: status }),
  addBrandPack: (brandPack) => set((state) => ({ 
    brandPacks: [brandPack, ...state.brandPacks] 
  })),
  removeBrandPack: (id) => set((state) => ({ 
    brandPacks: state.brandPacks.filter(bp => bp.id !== id) 
  })),
}));