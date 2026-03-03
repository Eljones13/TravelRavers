import { useEffect } from 'react';
import * as Location from 'expo-location';
import { useLocationStore } from '../stores/locationStore';

export function useLocationTracking() {
    const { setCoords, setStatus, setError } = useLocationStore();

    useEffect(() => {
        let subscription: Location.LocationSubscription | null = null;

        async function startTracking() {
            try {
                setStatus('requesting');
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    setStatus('denied');
                    setError('Permission to access location was denied');
                    return;
                }

                setStatus('granted');

                // Watch position for real-time updates
                subscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        timeInterval: 5000,
                        distanceInterval: 5,
                    },
                    (location) => {
                        const newCoords = {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            accuracy: location.coords.accuracy,
                            timestamp: location.timestamp,
                        };
                        setCoords(newCoords);

                        // Broadcast location to mesh network on every move
                        import('../services/MeshService').then(({ meshService }) => {
                            meshService.broadcastLocation();
                        });
                    }
                );
            } catch (err: any) {
                setStatus('error');
                setError(err.message || 'Failed to start location tracking');
            }
        }

        startTracking();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);
}
