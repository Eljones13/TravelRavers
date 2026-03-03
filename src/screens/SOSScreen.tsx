import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Animated, Easing, PanResponder, Modal
} from 'react-native';
import Svg, { Circle as SvgCircle, G } from 'react-native-svg';
import { colours } from '../theme/colours';
import { GlassPanel } from '../components/GlassPanel';
import { ScreenHeader } from '../components/ScreenHeader';
import { useSOSStore } from '../stores/sosStore';
import { meshService } from '../services/MeshService';
import { useLocationStore } from '../stores/locationStore';
import * as Haptics from 'expo-haptics';

const WHAT_HAPPENS = [
  '📍 GPS coords broadcast instantly',
  '📡 Hops through all nearby phones',
  '🔴 Squad alerted immediately',
  '🏥 Medical teams notified',
];

const HOLD_DURATION = 3000;

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

/** Circular SVG progress ring drawn around the SOS button while held */
function HoldProgressRing({ progress }: { progress: Animated.Value }) {
  const RADIUS = 84;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const AnimatedSvgCircle = Animated.createAnimatedComponent(SvgCircle);

  return (
    <Svg
      width={200}
      height={200}
      viewBox="0 0 200 200"
      style={{ position: 'absolute' }}
    >
      <G rotation="-90" origin="100,100">
        {/* Track */}
        <SvgCircle
          cx={100}
          cy={100}
          r={RADIUS}
          stroke="rgba(255,34,68,0.15)"
          strokeWidth={4}
          fill="none"
        />
        {/* Progress */}
        <AnimatedSvgCircle
          cx={100}
          cy={100}
          r={RADIUS}
          stroke={colours.red}
          strokeWidth={4}
          fill="none"
          strokeDasharray={`${CIRCUMFERENCE}`}
          strokeDashoffset={progress.interpolate({
            inputRange: [0, 1],
            outputRange: [CIRCUMFERENCE, 0],
          })}
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}

function SOSActivatedOverlay({ onCancel }: { onCancel: () => void }) {
  const pulse = useRef(new Animated.Value(0.95)).current;
  const { coords } = useLocationStore();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.0, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.95, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const lat = coords?.latitude?.toFixed(4) ?? '---';
  const lng = coords?.longitude?.toFixed(4) ?? '---';

  return (
    <Modal visible transparent animationType="fade">
      <Animated.View style={[overlayStyles.overlay, { transform: [{ scale: pulse }] }]}>
        <Text style={overlayStyles.title}>🆘 SOS ACTIVE</Text>
        <Text style={overlayStyles.subtitle}>BROADCASTING YOUR LOCATION</Text>
        <View style={overlayStyles.infoBox}>
          <Text style={overlayStyles.infoLine}>GPS: {lat}, {lng}</Text>
          <Text style={overlayStyles.infoLine}>MESH HOPS: <Text style={{ color: colours.cyan }}>ACTIVE</Text></Text>
          <Text style={overlayStyles.infoLine}>SQUAD: <Text style={{ color: colours.green }}>✓ NOTIFIED</Text></Text>
        </View>
        <TouchableOpacity style={overlayStyles.cancelBtn} onPress={onCancel} activeOpacity={0.85}>
          <Text style={overlayStyles.cancelBtnText}>✓ I'M SAFE — CANCEL SOS</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const overlayStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(200,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 20,
  },
  title: {
    fontFamily: 'Orbitron_900Black',
    fontSize: 36,
    color: '#fff',
    letterSpacing: 4,
  },
  subtitle: {
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 3,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    alignSelf: 'stretch',
  },
  infoLine: {
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 11,
    color: '#fff',
    letterSpacing: 1,
    textAlign: 'center',
  },
  cancelBtn: {
    backgroundColor: 'rgba(0,255,136,0.15)',
    borderWidth: 2,
    borderColor: colours.green,
    borderRadius: 14,
    padding: 18,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 13,
    letterSpacing: 3,
    color: colours.green,
  },
});

export function SOSScreen() {
  const { active, trigger, cancel } = useSOSStore();
  const { coords } = useLocationStore();
  const holdProgress = useRef(new Animated.Value(0)).current;
  const holdAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const [isHolding, setIsHolding] = useState(false);

  function startHold() {
    setIsHolding(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    holdAnimation.current = Animated.timing(holdProgress, {
      toValue: 1,
      duration: HOLD_DURATION,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    holdAnimation.current.start(({ finished }) => {
      if (finished) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        trigger();
        meshService.sendSOS('MEDICAL EMERGENCY // ASSISTANCE REQUIRED');
        setIsHolding(false);
        holdProgress.setValue(0);
      }
    });
  }

  function cancelHold() {
    holdAnimation.current?.stop();
    holdProgress.setValue(0);
    setIsHolding(false);
  }

  function handleCancel() {
    cancel();
    meshService.broadcastVibe('SOS_CANCEL', 0);
  }

  return (
    <>
      {active && <SOSActivatedOverlay onCancel={handleCancel} />}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="EMERGENCY SOS"
          subtitle="MESH BROADCAST // ALL NEARBY USERS"
          titleColor={colours.red}
          showGpsBadge={false}
        />

        <Text style={styles.sosInstructions}>
          HOLD 3 SECONDS // BROADCASTS VIA MESH{'\n'}NO SIGNAL REQUIRED // ALL NEARBY PHONES
        </Text>

        {/* SOS Button with hold progress ring */}
        <View style={styles.sosBtnWrap}>
          <PulseRing size={200} delay={0} color={`${colours.red}40`} />
          <PulseRing size={200} delay={700} color={`${colours.red}28`} />

          {isHolding && <HoldProgressRing progress={holdProgress} />}

          <TouchableOpacity
            style={[styles.sosBtn, isHolding && styles.sosBtnHolding]}
            onPressIn={startHold}
            onPressOut={cancelHold}
            activeOpacity={0.85}
            delayLongPress={100}
          >
            <Text style={styles.sosBtnText}>SOS</Text>
            <Text style={styles.sosBtnSub}>{isHolding ? 'HOLD...' : 'HOLD 3s'}</Text>
          </TouchableOpacity>
        </View>

        <GlassPanel title="WHAT HAPPENS">
          {WHAT_HAPPENS.map((line) => (
            <View key={line} style={styles.whatRow}>
              <Text style={styles.whatText}>{line}</Text>
            </View>
          ))}
        </GlassPanel>

        <TouchableOpacity style={styles.okayBtn} activeOpacity={0.8}>
          <Text style={styles.okayBtnText}>✅ BROADCAST I'M OKAY</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: 'transparent' },
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
    width: 210,
    height: 210,
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
  sosBtnHolding: {
    backgroundColor: 'rgba(255,34,68,0.25)',
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
});
