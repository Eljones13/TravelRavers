import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colours } from '../theme/colours';
import { OfflineBadge } from './OfflineBadge';

interface Props {
  title: string;
  subtitle?: string;
  badgeLabel?: string;
  badgeColor?: string;
  titleColor?: string;
}

export function ScreenHeader({
  title,
  subtitle,
  badgeLabel,
  badgeColor,
  titleColor = colours.cyan,
}: Props) {
  return (
    <View style={styles.head}>
      <View>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      </View>
      {badgeLabel ? <OfflineBadge label={badgeLabel} color={badgeColor} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 12,
    letterSpacing: 3,
  },
  sub: {
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 8,
    color: colours.dim,
    letterSpacing: 2,
    marginTop: 3,
  },
});
