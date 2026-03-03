import { useMeshStore } from '../stores/meshStore';
import { useLocationStore } from '../stores/locationStore';
import { usePinStore } from '../stores/pinStore';

// Note: In a production environment with a custom Expo Dev Client, 
// you would import the native Bridgefy module here.
// For this architecture demo, we implement the service structure.

export enum MeshMessageType {
    LOCATION_UPDATE = 'LOC_UPD',
    PIN_SYNC = 'PIN_SYNC',
    SOS = 'SOS_ALRT',
    VIBE_REPORT = 'VIBE_RPT',
    SCHEDULE_SYNC = 'SCHED_SYNC'
}

class MeshService {
    private static instance: MeshService;
    private isInitialized = false;

    private constructor() { }

    static getInstance() {
        if (!MeshService.instance) {
            MeshService.instance = new MeshService();
        }
        return MeshService.instance;
    }

    async init(apiKey: string, options?: { sandbox?: boolean }) {
        if (this.isInitialized) return;

        const sandbox = options?.sandbox ?? false;
        console.log(`📡 [MeshService] Initializing Bridgefy | sandbox=${sandbox} | key=${apiKey.slice(0, 8)}...`);

        const { setStatus, setError } = useMeshStore.getState();
        setStatus('starting');

        try {
            // When Bridgefy native SDK is linked:
            // await Bridgefy.init(apiKey, { propagationProfile: 'standard', sandbox });
            this.isInitialized = true;
            setStatus('active');
            console.log(`📡 [MeshService] Bridgefy Active (sandbox=${sandbox})`);

            this.setupListeners();
        } catch (err: any) {
            setStatus('error');
            setError(err.message || 'Mesh initialization failed');
        }
    }

    private setupListeners() {
        console.log('📡 [MeshService] Setting up Mesh listeners...');

        // Mock Peer Discovery
        // Bridgefy.onPeerDiscovered((peer) => {
        //   useMeshStore.getState().addPeer({ id: peer.id, name: peer.name, lastSeen: Date.now() });
        // });

        // Mock Message Received
        // Bridgefy.onMessageReceived((message) => {
        //   this.handleIncomingMessage(message);
        // });
    }

    private handleIncomingMessage(message: any) {
        const { type, payload, senderId } = message;
        console.log(`📡 [MeshService] Message from ${senderId}:`, type);

        switch (type) {
            case MeshMessageType.LOCATION_UPDATE:
                // Update squad location
                import('../stores/squadStore').then(({ useSquadStore }) => {
                    useSquadStore.getState().updateMember(senderId, {
                        lat: payload.lat,
                        lng: payload.lng,
                    });
                });
                break;
            case MeshMessageType.VIBE_REPORT:
                // Update vibe store
                import('../stores/vibeStore').then(({ useVibeStore }) => {
                    useVibeStore.getState().addReport({
                        stageId: payload.stageId,
                        energyLevel: payload.energyLevel,
                        reportedBy: senderId,
                        timestamp: Date.now()
                    });
                });
                break;
            case MeshMessageType.PIN_SYNC:
                // Add pin to local store if it doesn't exist
                const { addPin } = usePinStore.getState();
                addPin(payload);
                break;
            case MeshMessageType.SOS:
                // Trigger global HUD alert
                console.warn('🚨 [SOS RECEIVED]', payload.message);
                import('../stores/squadStore').then(({ useSquadStore }) => {
                    useSquadStore.getState().updateMember(senderId, { status: 'sos' });
                });
                break;
            case MeshMessageType.SCHEDULE_SYNC:
                // Update squad schedule
                import('../stores/timetableStore').then(({ useTimetableStore }) => {
                    useTimetableStore.getState().updateSquadSchedule(senderId, payload.setIds);
                });
                break;
        }
    }

    broadcastLocation() {
        const { coords } = useLocationStore.getState();
        if (!coords) return;

        const message = {
            type: MeshMessageType.LOCATION_UPDATE,
            payload: {
                lat: coords.latitude,
                lng: coords.longitude,
                timestamp: Date.now()
            }
        };

        // Simulated Broadcast
        // Bridgefy.sendBroadcast(message);
        console.log('📡 [MeshService] Broadcasting Location...');
    }

    broadcastVibe(stageId: string, energyLevel: number) {
        const message = {
            type: MeshMessageType.VIBE_REPORT,
            payload: {
                stageId,
                energyLevel,
                timestamp: Date.now()
            }
        };

        // Bridgefy.sendBroadcast(message);
        console.log(`📡 [MeshService] Broadcasting Vibe for ${stageId}: ${energyLevel}%`);
    }

    sendSOS(msg: string) {
        const message = {
            type: MeshMessageType.SOS,
            payload: {
                message: msg,
                sender: 'YOU',
                timestamp: Date.now()
            }
        };

        // Bridgefy.sendBroadcast(message);
        console.log('🚨 [MeshService] BROADCASTING SOS:', msg);
    }

    broadcastSchedule(setIds: string[]) {
        const message = {
            type: MeshMessageType.SCHEDULE_SYNC,
            payload: {
                setIds,
                timestamp: Date.now()
            }
        };

        // Bridgefy.sendBroadcast(message);
        console.log('📡 [MeshService] Broadcasting Schedule Sync...');
    }
}

export const meshService = MeshService.getInstance();
