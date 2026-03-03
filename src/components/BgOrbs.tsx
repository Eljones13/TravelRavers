import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

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

  return (
    <Animated.View
      style={[
        styles.orb,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          top,
          left,
          transform: [{ translateX }, { translateY }, { scale }],
        },
      ]}
    />
  );
}

export function BgOrbs() {
  return (
    <View style={styles.container} pointerEvents="none">
      <Orb color="rgba(0,245,255,0.15)" size={400} top={-150} left={-150} duration={8000} delay={0} />
      <Orb color="rgba(255,0,255,0.12)" size={300} top={height - 200} left={width - 200} duration={6000} delay={-2500} />
      <Orb color="rgba(0,60,255,0.1)" size={240} top={height * 0.4} left={width * 0.3} duration={9000} delay={-4500} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
  },
});
