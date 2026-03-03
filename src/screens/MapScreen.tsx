import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Easing
} from 'react-native';
import { colours } from '../theme/colours';
import { GlassPanel } from '../components/GlassPanel';
import { ScreenHeader } from '../components/ScreenHeader';
import { useFestivalStore } from '../stores/festivalStore';
import { usePinStore, Pin } from '../stores/pinStore';
import { useLocationStore } from '../stores/locationStore';
import { useOfflineMapStore } from '../stores/offlineMapStore';
import { OfflineMap } from '../components/OfflineMap';
import Mapbox from '@rnmapbox/maps';
import * as Haptics from 'expo-haptics';

const PIN_TYPES = [
  { type: 'tent', emoji: '⛺', color: '#00f5ff', label: 'MY TENT' },
  { type: 'toilet', emoji: '🚽', color: '#00ff88', label: 'TOILET' },
  { type: 'water', emoji: '💧', color: '#4488ff', label: 'WATER' },
  { type: 'food', emoji: '🍕', color: '#ff8800', label: 'FOOD' },
  { type: 'charge', emoji: '⚡', color: '#ffff00', label: 'CHARGE' },
  { type: 'meet', emoji: '📍', color: '#ff00ff', label: 'MEET' },
];

const MAP_H = 360;

function OfflineReadyBanner({ festivalId }: { festivalId: string }) {
  const { packStatus, packProgress, setPackStatus, setPackProgress } = useOfflineMapStore();
  const { festival } = useFestivalStore();
  const status = packStatus[festivalId] ?? 'idle';
  const progress = packProgress[festivalId] ?? 0;

  async function handleDownload() {
    setPackStatus(festivalId, 'downloading');
    setPackProgress(festivalId, 0);
    // Simulate download progress (real Mapbox offline download would go here)
    for (let p = 0; p <= 100; p += 5) {
      await new Promise((r) => setTimeout(r, 150));
      setPackProgress(festivalId, p);
    }
    setPackStatus(festivalId, 'complete');
  }

  if (status === 'complete') {
    return (
      <View style={[bannerStyles.banner, { borderColor: colours.green }]}>
        <Text style={[bannerStyles.dot, { color: colours.green }]}>⬤</Text>
        <Text style={[bannerStyles.text, { color: colours.green }]}>MAP DOWNLOADED // OFFLINE READY</Text>
      </View>
    );
  }

  if (status === 'downloading') {
    return (
      <View style={[bannerStyles.banner, { borderColor: colours.cyan }]}>
        <Text style={[bannerStyles.text, { color: colours.cyan }]}>DOWNLOADING... {Math.round(progress)}%</Text>
        <View style={bannerStyles.progressTrack}>
          <View style={[bannerStyles.progressFill, { width: `${progress}%` as any }]} />
        </View>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={[bannerStyles.banner, { borderColor: colours.red }]}>
        <Text style={[bannerStyles.text, { color: colours.red }]}>NO MAP — CONNECT TO WIFI</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={[bannerStyles.banner, { borderColor: colours.orange }]} onPress={handleDownload} activeOpacity={0.8}>
      <Text style={[bannerStyles.dot, { color: colours.orange }]}>⬤</Text>
      <Text style={[bannerStyles.text, { color: colours.orange }]}>TAP TO DOWNLOAD MAP</Text>
    </TouchableOpacity>
  );
}

const bannerStyles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: { fontSize: 8 },
  text: {
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 9,
    letterSpacing: 2,
    flex: 1,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(0,245,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    backgroundColor: colours.cyan,
    borderRadius: 2,
  },
});

export function MapScreen() {
  const { festival } = useFestivalStore();
  const { pins, activePinType, addPin, removePin, setActivePinType } = usePinStore();
  const { coords, status } = useLocationStore();

  function handleMapTap(feature: any) {
    try {
      const [lng, lat] = feature.geometry.coordinates;
      const newPin: Pin = {
        id: `pin_${Date.now()}`,
        type: activePinType.type,
        emoji: activePinType.emoji,
        label: activePinType.label,
        color: activePinType.color,
        x: 0,
        y: 0,
        lat,
        lng,
        createdAt: Date.now(),
        byUser: 'YOU',
      };
      addPin(newPin);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
  }

  const accuracy = coords?.accuracy ?? null;
  const gpsStatus = !coords ? 'GPS OFF' : accuracy && accuracy < 20 ? 'GPS LOCKED' : 'GPS WEAK';
  const gpsColor = !coords ? colours.red : accuracy && accuracy < 20 ? colours.green : colours.orange;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title={`${festival.name} // MAP`}
        subtitle={festival.sub}
        showGpsBadge={false}
        badgeLabel={gpsStatus}
        badgeColor={gpsColor}
      />

      <Text style={styles.pinHint}>DROP A PIN // TAP TYPE → TAP MAP</Text>

      {/* Pin type selector */}
      <View style={styles.pinSel}>
        {PIN_TYPES.map((pt) => {
          const active = activePinType.type === pt.type;
          return (
            <TouchableOpacity
              key={pt.type}
              style={[styles.ptype, active && { borderColor: pt.color, backgroundColor: `${pt.color}18` }]}
              onPress={() => setActivePinType(pt)}
              activeOpacity={0.7}
            >
              <Text style={[styles.ptypeText, active && { color: pt.color }]}>
                {pt.emoji} {pt.type.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Festival map */}
      <View style={styles.mapContainer}>
        <OfflineMap
          centerCoordinate={[festival.lng, festival.lat]}
          zoomLevel={15}
          onPress={handleMapTap}
        >
          {/* Stage markers */}
          <Mapbox.PointAnnotation id="main_stage" coordinate={[festival.lng - 0.002, festival.lat + 0.001]}>
            <View style={[styles.stageMarker, { borderColor: colours.cyan }]}>
              <Text style={styles.stageEmoji}>🎵</Text>
            </View>
          </Mapbox.PointAnnotation>

          <Mapbox.PointAnnotation id="techno_dome" coordinate={[festival.lng + 0.001, festival.lat + 0.003]}>
            <View style={[styles.stageMarker, { borderColor: colours.magenta }]}>
              <Text style={styles.stageEmoji}>🕺</Text>
            </View>
          </Mapbox.PointAnnotation>

          <Mapbox.PointAnnotation id="acid_arena" coordinate={[festival.lng - 0.001, festival.lat - 0.002]}>
            <View style={[styles.stageMarker, { borderColor: colours.green }]}>
              <Text style={styles.stageEmoji}>🧪</Text>
            </View>
          </Mapbox.PointAnnotation>

          {/* POI: Medical tents (red pulsing) */}
          <Mapbox.PointAnnotation id="med_01" coordinate={[festival.lng + 0.003, festival.lat - 0.001]}>
            <View style={[styles.poiMarker, { borderColor: colours.red, backgroundColor: 'rgba(255,34,68,0.2)' }]}>
              <Text style={styles.poiEmoji}>🏥</Text>
            </View>
          </Mapbox.PointAnnotation>

          <Mapbox.PointAnnotation id="med_02" coordinate={[festival.lng - 0.003, festival.lat + 0.002]}>
            <View style={[styles.poiMarker, { borderColor: colours.red, backgroundColor: 'rgba(255,34,68,0.2)' }]}>
              <Text style={styles.poiEmoji}>🏥</Text>
            </View>
          </Mapbox.PointAnnotation>

          {/* POI: Water points (blue) */}
          <Mapbox.PointAnnotation id="water_01" coordinate={[festival.lng, festival.lat - 0.003]}>
            <View style={[styles.poiMarker, { borderColor: colours.blue, backgroundColor: 'rgba(68,136,255,0.2)' }]}>
              <Text style={styles.poiEmoji}>💧</Text>
            </View>
          </Mapbox.PointAnnotation>

          <Mapbox.PointAnnotation id="water_02" coordinate={[festival.lng + 0.002, festival.lat + 0.002]}>
            <View style={[styles.poiMarker, { borderColor: colours.blue, backgroundColor: 'rgba(68,136,255,0.2)' }]}>
              <Text style={styles.poiEmoji}>💧</Text>
            </View>
          </Mapbox.PointAnnotation>

          {/* POI: Campsites (yellow) */}
          <Mapbox.PointAnnotation id="camp_a" coordinate={[festival.lng - 0.004, festival.lat - 0.003]}>
            <View style={[styles.poiMarker, { borderColor: colours.yellow, backgroundColor: 'rgba(255,255,0,0.12)', borderStyle: 'dashed' }]}>
              <Text style={styles.poiEmoji}>⛺</Text>
            </View>
          </Mapbox.PointAnnotation>

          {/* User pins */}
          {pins.map((pin) => {
            const lat = (pin as any).lat ?? (festival.bounds.swLat + (1 - pin.y) * (festival.bounds.neLat - festival.bounds.swLat));
            const lng = (pin as any).lng ?? (festival.bounds.swLng + pin.x * (festival.bounds.neLng - festival.bounds.swLng));
            return (
              <Mapbox.PointAnnotation key={pin.id} id={pin.id} coordinate={[lng, lat]}>
                <View style={styles.userPin}>
                  <Text style={{ fontSize: 20 }}>{pin.emoji}</Text>
                </View>
              </Mapbox.PointAnnotation>
            );
          })}
        </OfflineMap>

        {/* Offline ready banner */}
        <OfflineReadyBanner festivalId={festival.id} />

        {/* Map label */}
        <View style={styles.mapLabel}>
          <Text style={styles.mapLabelText}>{festival.mapLabel}</Text>
        </View>

        {/* Active pin indicator */}
        <View style={styles.pinIndicator}>
          <Text style={styles.pinIndicatorText}>
            {activePinType.emoji} TAP MAP → PIN {activePinType.label}
          </Text>
        </View>
      </View>

      {/* Pins list */}
      <GlassPanel title="SQUAD PINS // LIVE FEED" style={{ marginTop: 12 }}>
        {pins.length === 0 ? (
          <Text style={styles.noPins}>NO PINS YET // TAP THE MAP ABOVE</Text>
        ) : (
          pins.map((pin) => (
            <View key={pin.id} style={styles.pinRow}>
              <Text style={styles.pinEmoji}>{pin.emoji}</Text>
              <View style={styles.pinInfo}>
                <Text style={[styles.pinLabel, { color: pin.color }]}>{pin.label}</Text>
                <Text style={styles.pinMeta}>
                  {pin.byUser} // {Math.floor((Date.now() - pin.createdAt) / 60000) || '<1'} mins ago
                </Text>
              </View>
              <View style={styles.pinActions}>
                <TouchableOpacity style={[styles.mbtn, styles.cbtn]}>
                  <Text style={[styles.mbtnText, { color: colours.cyan }]}>📡 SHARE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.mbtn, styles.rbtn]} onPress={() => removePin(pin.id)}>
                  <Text style={[styles.mbtnText, { color: colours.red }]}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </GlassPanel>

      {/* Meet me */}
      <GlassPanel title="MEET ME HERE // BROADCAST">
        {[
          { emoji: '🎵', label: 'MAIN STAGE ENTRANCE' },
          { emoji: '🏥', label: 'MEDICAL TENT 01' },
          { emoji: '💧', label: 'CENTRAL WATER POINT' },
          { emoji: '⛺', label: 'BASE CAMP // TENT ZONE A' },
        ].map((mp) => (
          <TouchableOpacity key={mp.label} style={styles.meetBtn} activeOpacity={0.8}>
            <Text style={styles.meetEmoji}>{mp.emoji}</Text>
            <Text style={styles.meetLabel}>{mp.label}</Text>
            <Text style={styles.meetArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </GlassPanel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: 'transparent' },
  content: { paddingBottom: 16 },
  pinHint: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 8,
    color: colours.dim,
    letterSpacing: 2,
    marginBottom: 4,
  },
  pinSel: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 16, paddingBottom: 10 },
  ptype: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,245,255,0.18)',
    backgroundColor: 'rgba(0,245,255,0.03)',
  },
  ptypeText: {
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 9,
    letterSpacing: 1,
    color: colours.dim,
  },
  mapContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,245,255,0.18)',
    overflow: 'hidden',
    position: 'relative',
    height: MAP_H,
    backgroundColor: '#03080f',
  },
  mapLabel: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(0,245,255,0.2)',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  mapLabelText: { fontFamily: 'ShareTechMono_400Regular', fontSize: 7, color: colours.dim },
  pinIndicator: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,245,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,245,255,0.35)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  pinIndicatorText: { fontFamily: 'ShareTechMono_400Regular', fontSize: 8, color: colours.cyan, letterSpacing: 1 },
  stageMarker: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageEmoji: { fontSize: 16 },
  poiMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  poiEmoji: { fontSize: 14 },
  userPin: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPins: { fontFamily: 'ShareTechMono_400Regular', fontSize: 9, color: colours.dim, textAlign: 'center', paddingVertical: 16, letterSpacing: 1 },
  pinRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(0,245,255,0.05)' },
  pinEmoji: { fontSize: 17 },
  pinInfo: { flex: 1 },
  pinLabel: { fontFamily: 'ShareTechMono_400Regular', fontSize: 10 },
  pinMeta: { fontFamily: 'ShareTechMono_400Regular', fontSize: 8, color: colours.dim },
  pinActions: { flexDirection: 'row', gap: 5 },
  mbtn: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 4, borderWidth: 1 },
  cbtn: { borderColor: 'rgba(0,245,255,0.28)', backgroundColor: 'rgba(0,245,255,0.07)' },
  rbtn: { borderColor: 'rgba(255,34,68,0.28)', backgroundColor: 'rgba(255,34,68,0.07)' },
  mbtnText: { fontFamily: 'ShareTechMono_400Regular', fontSize: 7, letterSpacing: 1 },
  meetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,245,255,0.12)',
    borderRadius: 10,
    backgroundColor: 'rgba(0,245,255,0.025)',
    marginBottom: 8,
  },
  meetEmoji: { fontSize: 17 },
  meetLabel: { flex: 1, fontFamily: 'ShareTechMono_400Regular', fontSize: 10, color: colours.text, letterSpacing: 1 },
  meetArrow: { fontFamily: 'ShareTechMono_400Regular', fontSize: 11, color: colours.dim },
});
