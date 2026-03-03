import React, { useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Animated, Easing
} from 'react-native';
import { colours } from '../theme/colours';
import { GlassPanel } from '../components/GlassPanel';
import { ScreenHeader } from '../components/ScreenHeader';
import { useSOSStore } from '../stores/sosStore';

const WHAT_HAPPENS = [
  '📍 GPS coords broadcast instantly',
  '📡 Hops through all nearby phones',
  '🔴 Squad alerted immediately',
  '🏥 Medical teams notified',
];

function PulseRing({ size, delay, color }: { size: number; delay: number; color: string }) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(scale, { toValue: 1.1, duration: 2000, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.8, duration: 500, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(opacity, { toValue: 0, duration: 2000, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.6, duration: 500, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: delay === 0 ? 2 : 1,
        borderColor: color,
        transform: [{ scale }],
        opacity,
      }}
    />
  );
}

export function SOSScreen() {
  const { active, trigger, cancel } = useSOSStore();
  const sosGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(sosGlow, { toValue: 1, duration: 1250, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(sosGlow, { toValue: 0, duration: 1250, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const sosBoxShadow = sosGlow.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,34,68,0.25)', 'rgba(255,34,68,0.55)'],
  });

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title="EMERGENCY SOS"
        subtitle="MESH BROADCAST // ALL NEARBY USERS"
        titleColor={colours.red}
      />

      {!active ? (
        <>
          <Text style={styles.sosInstructions}>
            HOLD 3 SECONDS // BROADCASTS VIA MESH{'\n'}NO SIGNAL REQUIRED // ALL NEARBY PHONES
          </Text>

          {/* SOS Button with rings */}
          <View style={styles.sosBtnWrap}>
            <PulseRing size={190} delay={0} color={`${colours.red}40`} />
            <PulseRing size={190} delay={700} color={`${colours.red}28`} />

            <TouchableOpacity
              style={styles.sosBtn}
              onPress={trigger}
              activeOpacity={0.85}
            >
              <Text style={styles.sosBtnText}>SOS</Text>
              <Text style={styles.sosBtnSub}>HOLD 3s</Text>
            </TouchableOpacity>
          </View>

          <GlassPanel title="WHAT HAPPENS" style={{ width: '100%', marginHorizontal: 16 }}>
            {WHAT_HAPPENS.map((line) => (
              <View key={line} style={styles.whatRow}>
                <Text style={styles.whatText}>{line}</Text>
              </View>
            ))}
          </GlassPanel>

          <TouchableOpacity style={styles.okayBtn} activeOpacity={0.8}>
            <Text style={styles.okayBtnText}>✅ BROADCAST I'M OKAY</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.sosSentWrap}>
          <Text style={styles.sosSentTitle}>SOS SENT</Text>

          <View style={styles.sosSentRings}>
            <PulseRing size={160} delay={0} color={colours.red} />
            <PulseRing size={160} delay={350} color={colours.red} />
            <Text style={styles.sosSentIcon}>🆘</Text>
          </View>

          <View style={styles.sosSentInfo}>
            <Text style={styles.sosSentLine}>YOUR LOCATION IS BROADCASTING</Text>
            <Text style={[styles.sosSentLine, { color: colours.green }]}>GPS: 53.3498, -2.7280</Text>
            <Text style={styles.sosSentLine}>
              MESH HOPS: <Text style={{ color: colours.cyan }}>7 NODES</Text>
            </Text>
            <Text style={styles.sosSentLine}>
              SQUAD: <Text style={{ color: colours.green }}>✓ NOTIFIED</Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={cancel} activeOpacity={0.8}>
            <Text style={styles.cancelBtnText}>✓ I'M SAFE — CANCEL SOS</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 24, alignItems: 'center' },
  sosInstructions: {
    textAlign: 'center',
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 9,
    color: colours.dim,
    letterSpacing: 2,
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  sosBtnWrap: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  sosBtn: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: colours.red,
    backgroundColor: 'rgba(255,34,68,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosBtnText: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 30,
    fontWeight: '900',
    color: colours.red,
    letterSpacing: 3,
  },
  sosBtnSub: {
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 8,
    letterSpacing: 3,
    color: colours.red,
    marginTop: 4,
  },
  whatRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(0,245,255,0.05)' },
  whatText: { fontFamily: 'ShareTechMono_400Regular', fontSize: 9, color: colours.text },
  okayBtn: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,255,136,0.35)',
    backgroundColor: 'rgba(0,255,136,0.06)',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  okayBtnText: { fontFamily: 'Orbitron_700Bold', fontSize: 11, letterSpacing: 3, color: colours.green },
  sosSentWrap: { alignItems: 'center', gap: 20, paddingTop: 14, paddingHorizontal: 16 },
  sosSentTitle: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 22,
    color: colours.red,
    letterSpacing: 4,
  },
  sosSentRings: { width: 160, height: 160, alignItems: 'center', justifyContent: 'center' },
  sosSentIcon: { fontSize: 36 },
  sosSentInfo: { alignItems: 'center', gap: 4 },
  sosSentLine: {
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 10,
    color: colours.text,
    lineHeight: 22,
    letterSpacing: 1,
    textAlign: 'center',
  },
  cancelBtn: {
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,255,136,0.35)',
    backgroundColor: 'rgba(0,255,136,0.07)',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  cancelBtnText: { fontFamily: 'Orbitron_700Bold', fontSize: 11, letterSpacing: 3, color: colours.green },
});
