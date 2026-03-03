import { meshService, MeshMessageType } from '../services/MeshService';

export const MeshSimulator = {
    simulatePeerLocation: (peerId: string, name: string, lat: number, lng: number) => {
        // Internal Bridgefy message structure
        const message = {
            senderId: peerId,
            type: MeshMessageType.LOCATION_UPDATE,
            payload: { lat, lng, timestamp: Date.now() }
        };

        // Directly call the private handler if we were in the class, 
        // but since it's exported, we'll use the public instance 
        // through a small hack in MeshService or just update the stores directly.

        // Let's update stores directly to guarantee visibility
        import('../stores/meshStore').then(({ useMeshStore }) => {
            useMeshStore.getState().addPeer({ id: peerId, name, lastSeen: Date.now() });
        });

        import('../stores/squadStore').then(({ useSquadStore }) => {
            useSquadStore.getState().updateMember(peerId, { lat, lng, name });
        });
    },

    simulateVibeReport: (peerId: string, stageId: string, energyLevel: number) => {
        import('../stores/vibeStore').then(({ useVibeStore }) => {
            useVibeStore.getState().addReport({
                stageId,
                energyLevel,
                reportedBy: peerId,
                timestamp: Date.now()
            });
        });
    },

    simulateSOS: (peerId: string, name: string) => {
        import('../stores/squadStore').then(({ useSquadStore }) => {
            useSquadStore.getState().updateMember(peerId, { status: 'sos', name });
        });
    }
};
