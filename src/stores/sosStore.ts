import { create } from 'zustand';

interface SOSStore {
  active: boolean;
  trigger: () => void;
  cancel: () => void;
}

export const useSOSStore = create<SOSStore>((set) => ({
  active: false,
  trigger: () => set({ active: true }),
  cancel: () => set({ active: false }),
}));
