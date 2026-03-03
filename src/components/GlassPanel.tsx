import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colours } from '../theme/colours';

interface Props {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  accentColor?: string;
}

export function GlassPanel({ title, children, style, accentColor = colours.cyan }: Props) {
  return (
    <View style={[styles.panel, style]}>
      {/* Inner top highlight */}
      <View style={styles.innerHighlight} />
      {/* Top accent line */}
      <View style={[styles.topLine, { backgroundColor: accentColor }]} />
      {title ? <Text style={[styles.ptitle, { color: accentColor }]}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colours.glassBg,
    borderWidth: 1,
    borderColor: colours.glassBorder,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  innerHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colours.glassHighlight,
  },
  topLine: {
    position: 'absolute',
    top: 0,
    left: 40,
    right: 40,
    height: 1,
    opacity: 0.6,
  },
  ptitle: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 9,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 14,
    marginTop: 4,
  },
});
