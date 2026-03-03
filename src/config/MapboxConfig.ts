import Mapbox from '@rnmapbox/maps';

export const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN ?? '';

export const setupMapbox = () => {
    Mapbox.setAccessToken(MAPBOX_TOKEN);
};
