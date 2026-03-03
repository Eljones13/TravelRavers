import { create } from 'zustand';

interface Peer {
    id: string;
    name: string;
    lastSeen: number;
    distance?: number;
}

interface MeshState {
    status: 'off' | 'starting' | 'active' | 'error';
    peers: Peer[];
    peerCount: number;
    lastSyncTimestamp: number | null;
    errorMsg: string | null;

    setStatus: (status: MeshState['status']) => void;
    addPeer: (peer: Peer) => void;
    removePeer: (peerId: string) => void;
    updatePeer: (peerId: string, updates: Partial<Peer>) => void;
    setLastSync: (timestamp: number) => void;
    setError: (msg: string | null) => void;
}

export const useMeshStore = create<MeshState>((set) => ({
    status: 'off',
    peers: [],
    peerCount: 0,
    lastSyncTimestamp: null,
    errorMsg: null,

    setStatus: (status) => set({ status }),
    addPeer: (peer) => set((state) => {
        const exists = state.peers.find(p => p.id === peer.id);
        if (exists) return state;
        const newPeers = [...state.peers, peer];
        return { peers: newPeers, peerCount: newPeers.length };
    }),
    removePeer: (peerId) => set((state) => {
        const newPeers = state.peers.filter(p => p.id !== peerId);
        return { peers: newPeers, peerCount: newPeers.length };
    }),
    updatePeer: (peerId, updates) => set((state) => ({
        peers: state.peers.map(p => p.id === peerId ? { ...p, ...updates } : p)
    })),
    setLastSync: (lastSyncTimestamp) => set({ lastSyncTimestamp }),
    setError: (errorMsg) => set({ errorMsg }),
}));
