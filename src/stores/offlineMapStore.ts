import { create } from 'zustand';

type DownloadStatus = 'idle' | 'downloading' | 'complete' | 'error';

interface OfflineMapState {
  packStatus: Record<string, DownloadStatus>;
  packProgress: Record<string, number>;
  setPackStatus: (festivalId: string, status: DownloadStatus) => void;
  setPackProgress: (festivalId: string, progress: number) => void;
}

export const useOfflineMapStore = create<OfflineMapState>((set) => ({
  packStatus: {},
  packProgress: {},
  setPackStatus: (festivalId, status) => set((s) => ({
    packStatus: { ...s.packStatus, [festivalId]: status }
  })),
  setPackProgress: (festivalId, progress) => set((s) => ({
    packProgress: { ...s.packProgress, [festivalId]: progress }
  })),
}));
