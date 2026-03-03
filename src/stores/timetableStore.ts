import { create } from 'zustand';

export interface SetInfo {
    id: string;
    artist: string;
    stage: string;
    start: string; // ISO or HH:mm
    end: string;
    timestamp: number;
}

interface TimetableState {
    interests: Set<string>; // User's interested set IDs
    squadInterests: Record<string, string[]>; // PeerId -> SetID[]
    toggleInterest: (setId: string) => void;
    updateSquadSchedule: (peerId: string, setIds: string[]) => void;
    getInterestedPeers: (setId: string) => string[];
    isConflict: (setId1: string, setId2: string, allSets: SetInfo[]) => boolean;
}

export const useTimetableStore = create<TimetableState>((set, get) => ({
    interests: new Set(),
    squadInterests: {},

    toggleInterest: (setId) => set((state) => {
        const next = new Set(state.interests);
        if (next.has(setId)) next.delete(setId);
        else next.add(setId);
        return { interests: next };
    }),

    updateSquadSchedule: (peerId, setIds) => set((state) => ({
        squadInterests: {
            ...state.squadInterests,
            [peerId]: setIds
        }
    })),

    getInterestedPeers: (setId) => {
        const { squadInterests } = get();
        return Object.entries(squadInterests)
            .filter(([_, setIds]) => setIds.includes(setId))
            .map(([peerId, _]) => peerId);
    },

    isConflict: (id1, id2, allSets) => {
        const s1 = allSets.find(s => s.id === id1);
        const s2 = allSets.find(s => s.id === id2);
        if (!s1 || !s2) return false;

        // Basic overlap check (assuming HH:mm format for simplicity in this demo)
        const t1S = parseInt(s1.start.replace(':', ''));
        const t1E = parseInt(s1.end.replace(':', ''));
        const t2S = parseInt(s2.start.replace(':', ''));
        const t2E = parseInt(s2.end.replace(':', ''));

        return (t1S < t2E && t1E > t2S);
    }
}));
