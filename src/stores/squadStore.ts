import { create } from 'zustand';

export interface SquadMember {
    id: string;
    name: string;
    lat: number;
    lng: number;
    lastSeen: number;
    status: 'online' | 'offline' | 'sos';
    isOk: boolean;
    distance?: number;
}

interface SquadState {
    members: Record<string, SquadMember>;
    updateMember: (id: string, data: Partial<SquadMember>) => void;
    removeMember: (id: string) => void;
    getMemberList: () => SquadMember[];
}

export const useSquadStore = create<SquadState>((set, get) => ({
    members: {},
    updateMember: (id, data) => set((state) => ({
        members: {
            ...state.members,
            [id]: {
                ...(state.members[id] || {
                    id,
                    name: `RAVER_${id.slice(0, 4)}`,
                    status: 'online',
                    isOk: true
                }),
                ...data,
                lastSeen: Date.now(),
            }
        }
    })),
    removeMember: (id) => set((state) => {
        const newMembers = { ...state.members };
        delete newMembers[id];
        return { members: newMembers };
    }),
    getMemberList: () => Object.values(get().members).sort((a, b) => b.lastSeen - a.lastSeen),
}));
