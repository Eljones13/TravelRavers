import Mapbox from '@rnmapbox/maps';

export interface OfflineRegionOptions {
    name: string;
    styleURL: string;
    bounds: [[number, number], [number, number]]; // [[neLng, neLat], [swLng, swLat]]
    minZoom: number;
    maxZoom: number;
}

export const downloadOfflineRegion = async (options: OfflineRegionOptions, onProgress?: (progress: number) => void) => {
    try {
        await Mapbox.offlineManager.createPack(
            {
                name: options.name,
                styleURL: options.styleURL,
                minZoom: options.minZoom,
                maxZoom: options.maxZoom,
                bounds: options.bounds,
            },
            (pack, status) => {
                if (onProgress) {
                    onProgress(status.percentage);
                }
                console.log(`Download progress for ${options.name}: ${status.percentage}%`);
                if (status.state === Mapbox.OfflinePackDownloadState.Complete) {
                    console.log(`Download complete for ${options.name}`);
                }
            }
        );
    } catch (error) {
        console.error(`Failed to download offline region ${options.name}:`, error);
        throw error;
    }
};

export const deleteOfflineRegion = async (name: string) => {
    const packs = await Mapbox.offlineManager.getPacks();
    const pack = packs.find(p => p.name === name);
    if (pack) {
        await Mapbox.offlineManager.deletePack(name);
        console.log(`Deleted offline region: ${name}`);
    }
};
