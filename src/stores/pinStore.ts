import { create } from 'zustand';

export interface Pin {
  id: string;
  type: string;
  emoji: string;
  label: string;
  color: string;
  x: number; // legacy normalised coords
  y: number;
  lat?: number; // real GPS lat
  lng?: number; // real GPS lng
  createdAt: number;
  byUser: string;
}

interface PinStore {
  pins: Pin[];
  activePinType: { type: string; emoji: string; color: string; label: string };
  addPin: (pin: Pin) => void;
  removePin: (id: string) => void;
  setActivePinType: (t: { type: string; emoji: string; color: string; label: string }) => void;
}

export const usePinStore = create<PinStore>((set) => ({
  pins: [
    {
      id: 'demo1',
      type: 'tent',
      emoji: '⛺',
      label: 'MY TENT',
      color: '#00f5ff',
      x: 0.35,
      y: 0.55,
      createdAt: Date.now() - 120000,
      byUser: 'YOU',
    },
  ],
  activePinType: { type: 'tent', emoji: '⛺', color: '#00f5ff', label: 'MY TENT' },
  addPin: (pin) => set((s) => ({ pins: [...s.pins, pin] })),
  removePin: (id) => set((s) => ({ pins: s.pins.filter((p) => p.id !== id) })),
  setActivePinType: (t) => set({ activePinType: t }),
}));
