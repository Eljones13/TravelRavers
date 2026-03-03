import { create } from 'zustand';

interface LocationState {
    coords: {
        latitude: number;
        longitude: number;
        accuracy: number | null;
        timestamp: number | null;
    } | null;
    status: 'initial' | 'requesting' | 'granted' | 'denied' | 'error';
    errorMsg: string | null;
    setCoords: (coords: LocationState['coords']) => void;
    setStatus: (status: LocationState['status']) => void;
    setError: (msg: string | null) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
    coords: null,
    status: 'initial',
    errorMsg: null,
    setCoords: (coords) => set({ coords }),
    setStatus: (status) => set({ status }),
    setError: (errorMsg) => set({ errorMsg }),
}));
