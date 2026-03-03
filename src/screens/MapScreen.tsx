import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet
} from 'react-native';
import Svg, {
  Rect, Line, Path, Circle, Text as SvgText, G
} from 'react-native-svg';
import { colours } from '../theme/colours';
import { GlassPanel } from '../components/GlassPanel';
import { ScreenHeader } from '../components/ScreenHeader';
import { useFestivalStore } from '../stores/festivalStore';
import { usePinStore, Pin } from '../stores/pinStore';

const PIN_TYPES = [
  { type: 'tent',   emoji: '⛺', color: '#00f5ff', label: 'MY TENT' },
  { type: 'toilet', emoji: '🚽', color: '#00ff88', label: 'TOILET' },
  { type: 'water',  emoji: '💧', color: '#4488ff', label: 'WATER' },
  { type: 'food',   emoji: '🍕', color: '#ff8800', label: 'FOOD' },
  { type: 'charge', emoji: '⚡', color: '#ffff00', label: 'CHARGE' },
  { type: 'meet',   emoji: '📍', color: '#ff00ff', label: 'MEET' },
];

const MEET_POINTS = [
  { emoji: '🎵', label: 'MAIN STAGE ENTRANCE' },
  { emoji: '🏥', label: 'MEDICAL TENT 01' },
  { emoji: '💧', label: 'CENTRAL WATER POINT' },
  { emoji: '⛺', label: 'BASE CAMP // TENT ZONE A' },
];

const MAP_W = 358;
const MAP_H = 270;

export function MapScreen() {
  const { festival } = useFestivalStore();
  const { pins, activePinType, addPin, removePin, setActivePinType } = usePinStore();

  function handleMapTap(evt: any) {
    const { locationX, locationY } = evt.nativeEvent;
    const newPin: Pin = {
      id: `pin_${Date.now()}`,
      type: activePinType.type,
      emoji: activePinType.emoji,
      label: activePinType.label,
      color: activePinType.color,
      x: locationX / MAP_W,
      y: locationY / MAP_H,
      createdAt: Date.now(),
      byUser: 'YOU',
    };
    addPin(newPin);
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title={`${festival.name} // MAP`}
        subtitle={festival.sub}
        badgeLabel="GPS ON"
        badgeColor={colours.green}
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
        <Svg
          width="100%"
          height={MAP_H}
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          onPress={handleMapTap}
        >
          <Rect width={MAP_W} height={MAP_H} fill="#030810" />

          {/* Grid */}
          {[67, 135, 202].map((y) => (
            <Line key={`hy${y}`} x1={0} y1={y} x2={MAP_W} y2={y} stroke="rgba(0,245,255,0.03)" strokeWidth={1} />
          ))}
          {[90, 179, 268].map((x) => (
            <Line key={`vx${x}`} x1={x} y1={0} x2={x} y2={MAP_H} stroke="rgba(0,245,255,0.03)" strokeWidth={1} />
          ))}

          {/* Perimeter */}
          <Rect x={10} y={10} width={338} height={250} rx={8} fill="none" stroke="rgba(0,245,255,0.1)" strokeWidth={1} strokeDasharray="6,4" />

          {/* Paths */}
          <Path d="M68,128 L168,128 L168,152 L198,152 L198,198" stroke="rgba(255,255,255,0.05)" strokeWidth={10} fill="none" strokeLinecap="round" />
          <Path d="M168,128 L238,98 L293,98" stroke="rgba(255,255,255,0.05)" strokeWidth={9} fill="none" strokeLinecap="round" />
          <Path d="M168,128 L168,52 L198,38" stroke="rgba(255,255,255,0.04)" strokeWidth={7} fill="none" strokeLinecap="round" />

          {/* Stages */}
          <Rect x={18} y={78} width={88} height={52} rx={6} fill="rgba(0,245,255,0.06)" stroke={colours.cyan} strokeWidth={1.5} />
          <Rect x={18} y={78} width={88} height={9} rx={6} fill="rgba(0,245,255,0.18)" />
          <SvgText x={62} y={100} fill={colours.cyan} textAnchor="middle" fontSize={9} fontFamily="ShareTechMono_400Regular" fontWeight="bold">MAIN STAGE</SvgText>
          <SvgText x={62} y={114} fill="rgba(0,245,255,0.5)" textAnchor="middle" fontSize={7} fontFamily="ShareTechMono_400Regular">CALVIN HARRIS 23:00</SvgText>

          <Rect x={152} y={20} width={88} height={52} rx={6} fill="rgba(255,0,255,0.05)" stroke={colours.magenta} strokeWidth={1.5} />
          <Rect x={152} y={20} width={88} height={9} rx={6} fill="rgba(255,0,255,0.18)" />
          <SvgText x={196} y={42} fill={colours.magenta} textAnchor="middle" fontSize={9} fontFamily="ShareTechMono_400Regular" fontWeight="bold">TECHNO DOME</SvgText>
          <SvgText x={196} y={56} fill="rgba(255,0,255,0.5)" textAnchor="middle" fontSize={7} fontFamily="ShareTechMono_400Regular">CHARLOTTE 00:00</SvgText>

          <Rect x={255} y={72} width={90} height={52} rx={6} fill="rgba(255,136,0,0.05)" stroke={colours.orange} strokeWidth={1.5} />
          <Rect x={255} y={72} width={90} height={9} rx={6} fill="rgba(255,136,0,0.18)" />
          <SvgText x={300} y={94} fill={colours.orange} textAnchor="middle" fontSize={9} fontFamily="ShareTechMono_400Regular" fontWeight="bold">ACID ARENA</SvgText>
          <SvgText x={300} y={108} fill="rgba(255,136,0,0.5)" textAnchor="middle" fontSize={7} fontFamily="ShareTechMono_400Regular">HAWTIN 01:00</SvgText>

          <Rect x={100} y={145} width={74} height={40} rx={6} fill="rgba(0,255,136,0.04)" stroke={colours.green} strokeWidth={1} />
          <SvgText x={137} y={163} fill={colours.green} textAnchor="middle" fontSize={8} fontFamily="ShareTechMono_400Regular">HALO STAGE</SvgText>
          <SvgText x={137} y={176} fill="rgba(0,255,136,0.4)" textAnchor="middle" fontSize={7} fontFamily="ShareTechMono_400Regular">SARA LANDRY 02:00</SvgText>

          {/* Campsites */}
          <Rect x={18} y={198} width={108} height={58} rx={6} fill="rgba(255,255,80,0.02)" stroke="rgba(255,255,80,0.2)" strokeWidth={1} strokeDasharray="4,3" />
          <SvgText x={72} y={223} fill="rgba(255,255,80,0.5)" textAnchor="middle" fontSize={8} fontFamily="ShareTechMono_400Regular">CAMPSITE A</SvgText>
          <Rect x={140} y={198} width={100} height={58} rx={6} fill="rgba(255,255,80,0.02)" stroke="rgba(255,255,80,0.18)" strokeWidth={1} strokeDasharray="4,3" />
          <SvgText x={190} y={223} fill="rgba(255,255,80,0.45)" textAnchor="middle" fontSize={8} fontFamily="ShareTechMono_400Regular">CAMPSITE B</SvgText>
          <Rect x={254} y={198} width={92} height={58} rx={6} fill="rgba(255,255,80,0.02)" stroke="rgba(255,255,80,0.18)" strokeWidth={1} strokeDasharray="4,3" />
          <SvgText x={300} y={223} fill="rgba(255,255,80,0.45)" textAnchor="middle" fontSize={8} fontFamily="ShareTechMono_400Regular">CAMPSITE C</SvgText>

          {/* Medical */}
          <Rect x={20} y={158} width={46} height={26} rx={4} fill="rgba(255,34,68,0.1)" stroke={colours.red} strokeWidth={1.5} />
          <SvgText x={43} y={170} fill={colours.red} textAnchor="middle" fontSize={8} fontFamily="ShareTechMono_400Regular">✚ MED 01</SvgText>
          <SvgText x={43} y={180} fill="rgba(255,34,68,0.45)" textAnchor="middle" fontSize={6} fontFamily="ShareTechMono_400Regular">24HR</SvgText>
          <Rect x={290} y={145} width={55} height={26} rx={4} fill="rgba(255,34,68,0.1)" stroke={colours.red} strokeWidth={1.5} />
          <SvgText x={317} y={157} fill={colours.red} textAnchor="middle" fontSize={8} fontFamily="ShareTechMono_400Regular">✚ MED 02</SvgText>

          {/* Water */}
          <Circle cx={238} cy={162} r={13} fill="rgba(0,80,255,0.1)" stroke="#4488ff" strokeWidth={1.5} />
          <SvgText x={238} y={166} fill="#4488ff" textAnchor="middle" fontSize={10}>💧</SvgText>

          {/* YOU */}
          <Circle cx={168} cy={128} r={5} fill={colours.cyan} opacity={0.95} />
          <Circle cx={168} cy={128} r={9} fill="none" stroke={colours.cyan} strokeWidth={1.5} opacity={0.55} />
          <Circle cx={168} cy={128} r={18} fill="none" stroke={colours.cyan} strokeWidth={0.8} opacity={0.2} />
          <SvgText x={176} y={122} fill={colours.cyan} fontSize={7} fontFamily="ShareTechMono_400Regular">YOU</SvgText>

          {/* Squad */}
          <Circle cx={212} cy={52} r={5} fill={colours.magenta} opacity={0.85} />
          <SvgText x={219} y={49} fill={colours.magenta} fontSize={7} fontFamily="ShareTechMono_400Regular">SARAH</SvgText>
          <Circle cx={108} cy={113} r={5} fill={colours.green} opacity={0.85} />
          <SvgText x={115} y={110} fill={colours.green} fontSize={7} fontFamily="ShareTechMono_400Regular">MIKE</SvgText>

          {/* User pins */}
          {pins.map((pin) => (
            <G key={pin.id}>
              <SvgText
                x={pin.x * MAP_W}
                y={pin.y * MAP_H}
                textAnchor="middle"
                fontSize={16}
              >
                {pin.emoji}
              </SvgText>
            </G>
          ))}

          <SvgText x={12} y={267} fill="rgba(0,245,255,0.25)" fontSize={6} fontFamily="ShareTechMono_400Regular">
            LAT: {festival.lat.toFixed(4)} // LNG: {festival.lng.toFixed(4)} // TAP TO DROP PIN
          </SvgText>
        </Svg>

        {/* Overlays */}
        <View style={styles.mapOffline}>
          <Text style={styles.mapOfflineText}>⬤ OFFLINE READY</Text>
        </View>
        <View style={styles.mapLabel}>
          <Text style={styles.mapLabelText}>{festival.mapLabel}</Text>
        </View>
        <View style={styles.pinIndicator}>
          <Text style={styles.pinIndicatorText}>
            {activePinType.emoji} TAP MAP TO PIN {activePinType.label.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Pins list */}
      <GlassPanel title="SQUAD PINS // LIVE FEED" style={{ marginTop: 12 }}>
        {pins.length === 0 ? (
          <Text style={styles.noPins}>NO PINS YET // TAP MAP ABOVE</Text>
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
        {MEET_POINTS.map((mp) => (
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
  scroll: { flex: 1 },
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
  mapOffline: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 1,
    borderColor: colours.green,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 12,
  },
  mapOfflineText: { fontFamily: 'ShareTechMono_400Regular', fontSize: 8, color: colours.green, letterSpacing: 2 },
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
    top: 8,
    left: '50%',
    transform: [{ translateX: -80 }],
    backgroundColor: 'rgba(0,245,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,245,255,0.35)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  pinIndicatorText: { fontFamily: 'ShareTechMono_400Regular', fontSize: 8, color: colours.cyan, letterSpacing: 2 },
  noPins: { fontFamily: 'ShareTechMono_400Regular', fontSize: 9, color: colours.dim, textAlign: 'center', paddingVertical: 10, letterSpacing: 1 },
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
