import React from 'react';
import { View, StyleSheet } from 'react-native';
import Mapbox from '@rnmapbox/maps';

interface Props {
  centerCoordinate: [number, number];
  zoomLevel?: number;
  showUserLocation?: boolean;
  children?: React.ReactNode;
  onPress?: (feature: any) => void;
}

export function OfflineMap({
  centerCoordinate,
  zoomLevel = 14,
  showUserLocation = true,
  children,
  onPress,
}: Props) {
  return (
    <View style={styles.container}>
      <Mapbox.MapView
        style={styles.map}
        styleURL={Mapbox.StyleURL.Dark}
        logoEnabled={false}
        attributionEnabled={false}
        onPress={onPress}
      >
        <Mapbox.Camera
          zoomLevel={zoomLevel}
          centerCoordinate={centerCoordinate}
          animationDuration={500}
        />
        {showUserLocation && (
          <Mapbox.UserLocation
            animated={true}
            visible={true}
          />
        )}
        {children}
      </Mapbox.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});
