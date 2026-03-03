import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop, Filter, FeGaussianBlur, FeMerge, FeMergeNode } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

function Orb({ color, size, top, left, duration, delay }: {
  color: string; size: number; top: number; left: number; duration: number; delay: number;
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(translateX, { toValue: 25, duration, useNativeDriver: true, delay }),
          Animated.timing(translateX, { toValue: -15, duration, useNativeDriver: true }),
          Animated.timing(translateX, { toValue: 0, duration: duration / 2, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(translateY, { toValue: -35, duration, useNativeDriver: true, delay }),
          Animated.timing(translateY, { toValue: 25, duration, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: duration / 2, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.06, duration, useNativeDriver: true, delay }),
          Animated.timing(scale, { toValue: 0.96, duration, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: duration / 2, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  const gradientId = `grad-${color.replace(/[^a-zA-Z0-9]/g, '')}`;
  const filterId = `blur-${size}`;

  return (
    <Animated.View
      style={[
        styles.orbWrapper,
        {
          width: size,
          height: size,
          top,
          left,
          transform: [{ translateX }, { translateY }, { scale }],
        },
      ]}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <Filter id={filterId}>
            <FeGaussianBlur stdDeviation="40" />
          </Filter>
          <RadialGradient id={gradientId} cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor={color} stopOpacity="1" />
            <Stop offset="70%" stopColor={color} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${gradientId})`} filter={`url(#${filterId})`} />
      </Svg>
    </Animated.View>
  );
}

export function BgOrbs() {
  return (
    <View style={styles.container} pointerEvents="none">
      <Orb color="#00f5ff" size={500} top={-150} left={-150} duration={16000} delay={0} />
      <Orb color="#ff00ff" size={400} top={height - 250} left={width - 200} duration={12000} delay={-5000} />
      <Orb color="#003cff" size={300} top={height * 0.4} left={width * 0.35} duration={18000} delay={-9000} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  orbWrapper: {
    position: 'absolute',
  },
});
