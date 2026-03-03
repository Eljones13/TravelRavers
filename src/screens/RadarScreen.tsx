import React, { useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Easing
} from 'react-native';
import Svg, {
  Circle, Line, Text as SvgText, Path, Ellipse, Rect, Defs,
  RadialGradient, Stop, Filter, FeGaussianBlur, FeMerge, FeMergeNode, G,
} from 'react-native-svg';
import { colours } from '../theme/colours';
import { GlassPanel } from '../components/GlassPanel';
import { ScreenHeader } from '../components/ScreenHeader';
import { useFestivalStore } from '../stores/festivalStore';

const SQUAD = [
  { initial: 'S', name: 'SARAH', loc: 'TECHNO DOME // 400m NE // 2min ago', status: 'ACTIVE', color: colours.cyan, cx: 210, cy: 82, label: '400m NE' },
  { initial: 'M', name: 'MIKE', loc: 'MAIN STAGE // 150m S // 1min ago', status: 'ACTIVE', color: colours.green, cx: 162, cy: 198, label: '150m S' },
  { initial: 'J', name: 'JESS', loc: '⚠️ LAST SEEN ACID ARENA // 22min ago', status: 'LOST', color: colours.orange, cx: 80, cy: 190, label: '600m W' },
];

function RadarSVG({ sweep }: { sweep: Animated.Value }) {
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

      {/* Sweep — static for now; animated via CSS-style workaround */}
      <Path d="M150,150 L150,22 A128,128 0 0,1 240,68 Z" fill="url(#sweepGrad)" opacity={0.7} />
      <Line x1={150} y1={150} x2={150} y2={22} stroke="rgba(0,245,255,0.6)" strokeWidth={1.5} />

      {/* YOU dot */}
      <Circle cx={150} cy={150} r={6} fill={colours.cyan} opacity={0.95} />
      <Circle cx={150} cy={150} r={11} fill="none" stroke={colours.cyan} strokeWidth={1.5} opacity={0.5} />
      <Circle cx={150} cy={150} r={20} fill="none" stroke={colours.cyan} strokeWidth={0.8} opacity={0.2} />
      <SvgText x={158} y={144} fill={colours.cyan} fontSize={8} fontFamily="ShareTechMono_400Regular">YOU</SvgText>

      {/* SARAH */}
      <Circle cx={210} cy={82} r={6} fill={colours.magenta} />
      <Circle cx={210} cy={82} r={11} fill="none" stroke={colours.magenta} strokeWidth={1} opacity={0.4} />
      <SvgText x={218} y={78} fill={colours.magenta} fontSize={8} fontFamily="ShareTechMono_400Regular">SARAH</SvgText>
      <SvgText x={218} y={88} fill={colours.dim} fontSize={7} fontFamily="ShareTechMono_400Regular">400m NE</SvgText>
      <Line x1={150} y1={150} x2={210} y2={82} stroke={colours.magenta} strokeWidth={0.8} strokeDasharray="4,4" opacity={0.35} />

      {/* MIKE */}
      <Circle cx={162} cy={198} r={6} fill={colours.green} />
      <Circle cx={162} cy={198} r={11} fill="none" stroke={colours.green} strokeWidth={1} opacity={0.35} />
      <SvgText x={170} y={194} fill={colours.green} fontSize={8} fontFamily="ShareTechMono_400Regular">MIKE</SvgText>
      <SvgText x={170} y={204} fill={colours.dim} fontSize={7} fontFamily="ShareTechMono_400Regular">150m S</SvgText>
      <Line x1={150} y1={150} x2={162} y2={198} stroke={colours.green} strokeWidth={0.8} strokeDasharray="4,4" opacity={0.3} />

      {/* BASE CAMP */}
      <Rect x={24} y={162} width={8} height={8} rx={1} fill="rgba(255,255,0,0.6)" />
      <SvgText x={10} y={155} fill={colours.yellow} fontSize={7} fontFamily="ShareTechMono_400Regular">CAMP</SvgText>
      <SvgText x={14} y={165} fill={colours.dim} fontSize={7} fontFamily="ShareTechMono_400Regular">800m W</SvgText>

      {/* Medical */}
      <Rect x={218} y={195} width={10} height={10} rx={2} fill="rgba(255,34,68,0.7)" />
      <SvgText x={215} y={192} fill={colours.red} fontSize={7} fontFamily="ShareTechMono_400Regular">MED</SvgText>

      {/* Outer glow ring */}
      <Circle cx={150} cy={150} r={128} fill="none" stroke="rgba(0,245,255,0.3)" strokeWidth={1} />
    </Svg>
  );
}

export function RadarScreen() {
  const { festival } = useFestivalStore();
  const sweepAnim = useRef(new Animated.Value(0)).current;

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

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title={`${festival.name} // RADAR`}
        subtitle="SNEAKERNET MESH // ACTIVE"
        badgeLabel="OFFLINE"
        badgeColor={colours.green}
      />

      {/* Radar globe */}
      <View style={styles.radarWrap}>
        <RadarSVG sweep={sweepAnim} />
      </View>

      {/* Loading bar */}
      <View style={styles.lbar}><ScanBar /></View>
      <Text style={styles.meshStatus}>MESH ACTIVE // 3 NODES // SNEAKERNET PROTOCOL</Text>

      {/* Squad status */}
      <GlassPanel title="SQUAD STATUS">
        {SQUAD.map((m) => (
          <View key={m.name} style={styles.member}>
            <View style={[styles.avatar, { borderColor: m.color }]}>
              <Text style={[styles.avatarText, { color: m.color }]}>{m.initial}</Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{m.name}</Text>
              <Text style={styles.memberLoc}>{m.loc}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              { borderColor: m.status === 'ACTIVE' ? colours.green : colours.orange },
              { backgroundColor: m.status === 'ACTIVE' ? 'rgba(0,255,136,0.08)' : 'rgba(255,136,0,0.08)' },
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

function ScanBar() {
  const x = useRef(new Animated.Value(-1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(x, { toValue: 3, duration: 2000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);
  return (
    <View style={styles.scanTrack}>
      <Animated.View style={[styles.scanFill, { transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: ['-100%' as any, '280%' as any] }) }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 16 },
  radarWrap: { alignItems: 'center', paddingVertical: 10 },
  lbar: { marginHorizontal: 16, height: 2, overflow: 'hidden', marginBottom: 4 },
  scanTrack: { flex: 1, height: 2, backgroundColor: 'rgba(0,245,255,0.08)' },
  scanFill: { height: 2, width: '55%', backgroundColor: colours.cyan },
  meshStatus: {
    fontFamily: 'ShareTechMono_400Regular',
    textAlign: 'center',
    fontSize: 8,
    color: colours.dim,
    letterSpacing: 2,
    marginBottom: 10,
  },
  member: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(0,245,255,0.06)' },
  avatar: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,245,255,0.04)' },
  avatarText: { fontFamily: 'Orbitron_700Bold', fontSize: 13 },
  memberInfo: { flex: 1 },
  memberName: { fontFamily: 'Orbitron_700Bold', fontSize: 14, color: colours.text, letterSpacing: 1 },
  memberLoc: { fontFamily: 'ShareTechMono_400Regular', fontSize: 9, color: colours.dim, marginTop: 2 },
  statusBadge: { borderWidth: 1, borderRadius: 3, paddingVertical: 2, paddingHorizontal: 8 },
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
