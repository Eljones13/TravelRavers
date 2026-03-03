import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Easing
} from 'react-native';
import Svg, {
  Circle, Line, Text as SvgText, Path, Ellipse, Rect, Defs,
  RadialGradient, Stop, G,
} from 'react-native-svg';
import { colours } from '../theme/colours';
import { GlassPanel } from '../components/GlassPanel';
import { ScreenHeader } from '../components/ScreenHeader';
import { useFestivalStore } from '../stores/festivalStore';
import { useLocationStore } from '../stores/locationStore';

const SQUAD = [
  { initial: 'S', name: 'SARAH', loc: 'TECHNO DOME // 400m NE // 2min ago', status: 'ACTIVE', color: colours.cyan, cx: 210, cy: 82, label: '400m NE' },
  { initial: 'M', name: 'MIKE', loc: 'MAIN STAGE // 150m S // 1min ago', status: 'ACTIVE', color: colours.green, cx: 162, cy: 198, label: '150m S' },
  { initial: 'J', name: 'JESS', loc: '⚠️ LAST SEEN ACID ARENA // 22min ago', status: 'LOST', color: colours.orange, cx: 80, cy: 190, label: '600m W' },
];

const MESH_MESSAGES = [
  'SCANNING FOR SQUAD...',
  'MESH ACTIVE // SEARCHING',
  'NO NODES DETECTED // MOVE CLOSER',
];

function MeshStatusBar() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [showSignal, setShowSignal] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const cycle = setInterval(() => {
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setMsgIndex((i) => (i + 1) % MESH_MESSAGES.length);
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    }, 3000);

    // Flash "SIGNAL DETECTED" every 8 seconds
    const signal = setInterval(() => {
      setShowSignal(true);
      setTimeout(() => setShowSignal(false), 1500);
    }, 8000);

    return () => {
      clearInterval(cycle);
      clearInterval(signal);
    };
  }, []);

  const msg = showSignal ? 'SIGNAL DETECTED' : MESH_MESSAGES[msgIndex];
  const color = showSignal ? colours.green : colours.dim;

  return (
    <View style={styles.meshBar}>
      <View style={[styles.meshDot, { backgroundColor: showSignal ? colours.green : colours.cyan }]} />
      <Animated.Text style={[styles.meshText, { opacity, color }]}>
        {msg}
      </Animated.Text>
    </View>
  );
}

function RadarSVG({ sweep, userPos }: { sweep: Animated.Value; userPos: { x: number, y: number } | null }) {
  const AnimatedG = Animated.createAnimatedComponent(G);

  return (
    <Svg width={300} height={300} viewBox="0 0 300 300">
      <Defs>
        <RadialGradient id="globeGrad" cx="50%" cy="50%">
          <Stop offset="0%" stopColor="rgba(0,245,255,0.06)" />
          <Stop offset="70%" stopColor="rgba(0,245,255,0.02)" />
          <Stop offset="100%" stopColor="rgba(0,245,255,0.08)" />
        </RadialGradient>
        <RadialGradient id="sweepGrad" cx="50%" cy="50%">
          <Stop offset="0%" stopColor="rgba(0,245,255,0)" />
          <Stop offset="60%" stopColor="rgba(0,245,255,0.15)" />
          <Stop offset="100%" stopColor="rgba(0,245,255,0.35)" />
        </RadialGradient>
      </Defs>

      {/* Globe sphere */}
      <Circle cx={150} cy={150} r={128} fill="url(#globeGrad)" stroke="rgba(0,245,255,0.25)" strokeWidth={1.5} />

      {/* Latitude lines */}
      <Ellipse cx={150} cy={150} rx={128} ry={30} fill="none" stroke="rgba(0,245,255,0.08)" strokeWidth={0.8} />
      <Ellipse cx={150} cy={150} rx={128} ry={65} fill="none" stroke="rgba(0,245,255,0.07)" strokeWidth={0.8} />
      <Ellipse cx={150} cy={150} rx={128} ry={100} fill="none" stroke="rgba(0,245,255,0.06)" strokeWidth={0.8} />
      <Ellipse cx={150} cy={120} rx={110} ry={22} fill="none" stroke="rgba(0,245,255,0.05)" strokeWidth={0.8} />
      <Ellipse cx={150} cy={180} rx={110} ry={22} fill="none" stroke="rgba(0,245,255,0.05)" strokeWidth={0.8} />

      {/* Longitude lines */}
      <Path d="M150,22 Q200,150 150,278" fill="none" stroke="rgba(0,245,255,0.07)" strokeWidth={0.8} />
      <Path d="M150,22 Q100,150 150,278" fill="none" stroke="rgba(0,245,255,0.07)" strokeWidth={0.8} />
      <Path d="M150,22 Q240,100 278,150 Q240,200 150,278" fill="none" stroke="rgba(0,245,255,0.05)" strokeWidth={0.8} />
      <Path d="M150,22 Q60,100 22,150 Q60,200 150,278" fill="none" stroke="rgba(0,245,255,0.05)" strokeWidth={0.8} />

      {/* Range rings */}
      <Circle cx={150} cy={150} r={100} fill="none" stroke="rgba(0,245,255,0.14)" strokeWidth={1} />
      <Circle cx={150} cy={150} r={70} fill="none" stroke="rgba(0,245,255,0.16)" strokeWidth={1} />
      <Circle cx={150} cy={150} r={40} fill="none" stroke="rgba(0,245,255,0.2)" strokeWidth={1} />

      {/* Cross hairs */}
      <Line x1={150} y1={22} x2={150} y2={278} stroke="rgba(0,245,255,0.1)" strokeWidth={0.8} />
      <Line x1={22} y1={150} x2={278} y2={150} stroke="rgba(0,245,255,0.1)" strokeWidth={0.8} />
      <Line x1={60} y1={60} x2={240} y2={240} stroke="rgba(0,245,255,0.05)" strokeWidth={0.8} />
      <Line x1={240} y1={60} x2={60} y2={240} stroke="rgba(0,245,255,0.05)" strokeWidth={0.8} />

      {/* Compass */}
      <SvgText x={147} y={16} fill={colours.cyan} fontSize={11} fontFamily="ShareTechMono_400Regular" fontWeight="bold">N</SvgText>
      <SvgText x={147} y={292} fill={colours.cyan} fontSize={11} fontFamily="ShareTechMono_400Regular" fontWeight="bold">S</SvgText>
      <SvgText x={8} y={154} fill={colours.cyan} fontSize={11} fontFamily="ShareTechMono_400Regular" fontWeight="bold">W</SvgText>
      <SvgText x={272} y={154} fill={colours.cyan} fontSize={11} fontFamily="ShareTechMono_400Regular" fontWeight="bold">E</SvgText>

      {/* Range labels */}
      <SvgText x={152} y={108} fill="rgba(0,245,255,0.4)" fontSize={8} fontFamily="ShareTechMono_400Regular">500m</SvgText>
      <SvgText x={152} y={138} fill="rgba(0,245,255,0.35)" fontSize={8} fontFamily="ShareTechMono_400Regular">200m</SvgText>

      {/* Sweep */}
      <AnimatedG
        rotation={sweep.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 360]
        })}
        originX="150"
        originY="150"
      >
        <Path d="M150,150 L150,22 A128,128 0 0,1 240,68 Z" fill="url(#sweepGrad)" opacity={0.7} />
        <Line x1={150} y1={150} x2={150} y2={22} stroke="rgba(0,245,255,0.6)" strokeWidth={1.5} />
      </AnimatedG>

      {/* Squad member dots with glow rings */}
      {SQUAD.map((m) => (
        <G key={m.name}>
          <Circle cx={m.cx} cy={m.cy} r={18} fill="none" stroke={m.color} strokeWidth={0.5} opacity={0.15} />
          <Circle cx={m.cx} cy={m.cy} r={11} fill="none" stroke={m.color} strokeWidth={1} opacity={0.35} />
          <Circle cx={m.cx} cy={m.cy} r={6} fill={m.color} opacity={0.9} />
          {/* Avatar initial */}
          <SvgText x={m.cx} y={m.cy - 14} fill={m.color} fontSize={8} fontFamily="Orbitron_700Bold" textAnchor="middle">{m.initial}</SvgText>
          <SvgText x={m.cx + 13} y={m.cy - 4} fill={m.color} fontSize={7} fontFamily="ShareTechMono_400Regular">{m.name}</SvgText>
          <SvgText x={m.cx + 13} y={m.cy + 5} fill={colours.dim} fontSize={6} fontFamily="ShareTechMono_400Regular">{m.label}</SvgText>
          <Line x1={150} y1={150} x2={m.cx} y2={m.cy} stroke={m.color} strokeWidth={0.8} strokeDasharray="4,4" opacity={0.3} />
        </G>
      ))}

      {/* YOU dot */}
      {userPos ? (
        <G>
          <Circle cx={userPos.x} cy={userPos.y} r={20} fill="none" stroke={colours.cyan} strokeWidth={0.8} opacity={0.2} />
          <Circle cx={userPos.x} cy={userPos.y} r={11} fill="none" stroke={colours.cyan} strokeWidth={1.5} opacity={0.5} />
          <Circle cx={userPos.x} cy={userPos.y} r={6} fill={colours.cyan} opacity={0.95} />
          <SvgText x={userPos.x + 8} y={userPos.y - 6} fill={colours.cyan} fontSize={8} fontFamily="ShareTechMono_400Regular">YOU</SvgText>
        </G>
      ) : (
        <G>
          <Circle cx={150} cy={150} r={6} fill={colours.cyan} opacity={0.3} />
          <SvgText x={158} y={144} fill={colours.dim} fontSize={8} fontFamily="ShareTechMono_400Regular">ACQUIRING...</SvgText>
        </G>
      )}

      {/* Base camp + medical */}
      <Rect x={24} y={162} width={8} height={8} rx={1} fill="rgba(255,255,0,0.6)" />
      <SvgText x={10} y={155} fill={colours.yellow} fontSize={7} fontFamily="ShareTechMono_400Regular">CAMP</SvgText>
      <SvgText x={14} y={165} fill={colours.dim} fontSize={7} fontFamily="ShareTechMono_400Regular">800m W</SvgText>
      <Rect x={218} y={195} width={10} height={10} rx={2} fill="rgba(255,34,68,0.7)" />
      <SvgText x={215} y={192} fill={colours.red} fontSize={7} fontFamily="ShareTechMono_400Regular">MED</SvgText>

      {/* Outer glow ring */}
      <Circle cx={150} cy={150} r={128} fill="none" stroke="rgba(0,245,255,0.3)" strokeWidth={1} />
    </Svg>
  );
}

function ScanBar() {
  const x = useRef(new Animated.Value(-1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(x, { toValue: 3, duration: 2000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);
  return (
    <View style={styles.scanTrack}>
      <Animated.View style={[styles.scanFill, {
        transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: ['-100%' as any, '280%' as any] }) }]
      }]} />
    </View>
  );
}

export function RadarScreen() {
  const { festival } = useFestivalStore();
  const { coords, status } = useLocationStore();
  const sweepAnim = useRef(new Animated.Value(0)).current;

  let userPos = null;
  if (coords) {
    const dLat = coords.latitude - festival.lat;
    const dLng = coords.longitude - festival.lng;
    const scale = 100 / 0.0045;
    let dx = dLng * scale * Math.cos(festival.lat * Math.PI / 180);
    let dy = -dLat * scale;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 128) {
      dx = (dx / dist) * 123;
      dy = (dy / dist) * 123;
    }
    userPos = { x: 150 + dx, y: 150 + dy };
  }

  useEffect(() => {
    Animated.loop(
      Animated.timing(sweepAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const accuracy = coords?.accuracy ?? null;
  const gpsLabel = !coords
    ? 'GPS ACQUIRING...'
    : accuracy && accuracy < 20
      ? `GPS LOCKED // ±${Math.round(accuracy)}m`
      : accuracy
        ? `GPS WEAK // ±${Math.round(accuracy)}m`
        : 'GPS ACQUIRING...';

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title={`${festival.name} // RADAR`}
        subtitle={gpsLabel}
        showGpsBadge={false}
        badgeLabel={status === 'granted' ? (accuracy && accuracy < 20 ? 'GPS LOCKED' : 'GPS WEAK') : 'GPS OFF'}
        badgeColor={status === 'granted' ? (accuracy && accuracy < 20 ? colours.green : colours.orange) : colours.red}
      />

      {/* Radar globe */}
      <View style={styles.radarWrap}>
        <RadarSVG sweep={sweepAnim} userPos={userPos} />
      </View>

      {/* Scan bar */}
      <View style={styles.lbar}><ScanBar /></View>

      {/* Mesh status cycling bar */}
      <MeshStatusBar />

      {/* Squad status */}
      <GlassPanel title="SQUAD STATUS">
        {SQUAD.map((m) => (
          <View key={m.name} style={styles.member}>
            <View style={[styles.avatar, {
              borderColor: m.color,
              shadowColor: m.color,
              shadowOpacity: 0.6,
              shadowRadius: 6,
            }]}>
              <Text style={[styles.avatarText, { color: m.color }]}>{m.initial}</Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{m.name}</Text>
              <Text style={styles.memberLoc}>📍 {m.loc}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              m.status === 'ACTIVE' ? styles.statusActive : styles.statusLost
            ]}>
              <Text style={[styles.statusText, { color: m.status === 'ACTIVE' ? colours.green : colours.orange }]}>
                {m.status}
              </Text>
            </View>
          </View>
        ))}
      </GlassPanel>

      <TouchableOpacity style={styles.pingBtn} activeOpacity={0.8}>
        <Text style={styles.pingBtnText}>📡 PING MY LOCATION</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: 'transparent' },
  content: { paddingBottom: 16 },
  radarWrap: { alignItems: 'center', paddingVertical: 10 },
  lbar: { marginHorizontal: 16, height: 2, overflow: 'hidden', marginBottom: 6 },
  scanTrack: { flex: 1, height: 2, backgroundColor: 'rgba(0,245,255,0.08)' },
  scanFill: { height: 2, width: '55%', backgroundColor: colours.cyan },
  meshBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  meshDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  meshText: {
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 9,
    letterSpacing: 2,
  },
  member: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,245,255,0.06)',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,245,255,0.04)',
  },
  avatarText: { fontFamily: 'Orbitron_700Bold', fontSize: 13 },
  memberInfo: { flex: 1 },
  memberName: { fontFamily: 'Orbitron_700Bold', fontSize: 14, color: colours.text, letterSpacing: 1 },
  memberLoc: { fontFamily: 'ShareTechMono_400Regular', fontSize: 9, color: colours.dim, marginTop: 2 },
  statusBadge: { borderWidth: 1, borderRadius: 3, paddingVertical: 2, paddingHorizontal: 8 },
  statusActive: { borderColor: colours.green, backgroundColor: 'rgba(0,255,136,0.08)' },
  statusLost: { borderColor: colours.orange, backgroundColor: 'rgba(255,136,0,0.08)' },
  statusText: { fontFamily: 'ShareTechMono_400Regular', fontSize: 8, letterSpacing: 2 },
  pingBtn: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,245,255,0.38)',
    backgroundColor: 'rgba(0,245,255,0.06)',
    alignItems: 'center',
  },
  pingBtnText: { fontFamily: 'Orbitron_700Bold', fontSize: 11, letterSpacing: 3, color: colours.cyan },
});
