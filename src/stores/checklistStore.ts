import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckItem, DEFAULT_CHECKLIST } from '../data/checklist';

const STORAGE_KEY = '@travel_ravers_checklist';

interface ChecklistStore {
  items: CheckItem[];
  loaded: boolean;
  load: () => Promise<void>;
  toggle: (id: string) => Promise<void>;
}

export const useChecklistStore = create<ChecklistStore>((set, get) => ({
  items: DEFAULT_CHECKLIST,
  loaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: CheckItem[] = JSON.parse(raw);
        set({ items: saved, loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch {
      set({ loaded: true });
    }
  },

  toggle: async (id) => {
    const updated = get().items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    set({ items: updated });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  },
}));
