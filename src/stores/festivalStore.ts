import { create } from 'zustand';
import { Festival, FESTIVALS, FESTIVAL_MAP } from '../data/festivals';

interface FestivalStore {
  selectedId: string;
  festival: Festival;
  filterCat: string;
  setSelected: (id: string) => void;
  setFilter: (cat: string) => void;
}

export const useFestivalStore = create<FestivalStore>((set) => ({
  selectedId: 'creamfields',
  festival: FESTIVAL_MAP['creamfields'],
  filterCat: 'all',
  setSelected: (id) =>
    set({ selectedId: id, festival: FESTIVAL_MAP[id] ?? FESTIVAL_MAP['creamfields'] }),
  setFilter: (cat) => set({ filterCat: cat }),
}));
