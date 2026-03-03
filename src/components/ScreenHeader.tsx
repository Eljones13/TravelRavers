import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colours } from '../theme/colours';
import { OfflineBadge } from './OfflineBadge';
import { useMeshStore } from '../stores/meshStore';
import { useLocationStore } from '../stores/locationStore';

interface Props {
  title: string;
  subtitle?: string;
  badgeLabel?: string;
  badgeColor?: string;
  titleColor?: string;
  showGpsBadge?: boolean;
}

function GpsBadge() {
  const { coords, status } = useLocationStore();

  if (status === 'denied' || status === 'error' || status === 'initial') {
    return <OfflineBadge label="GPS OFF" color={colours.red} />;
  }
  if (status === 'requesting') {
    return <OfflineBadge label="GPS..." color={colours.orange} />;
  }
  if (!coords) {
    return <OfflineBadge label="ACQUIRING" color={colours.orange} />;
  }
  const accuracy = coords.accuracy ?? 999;
  if (accuracy < 20) {
    return <OfflineBadge label="GPS LOCKED" color={colours.green} />;
  }
  return <OfflineBadge label="GPS WEAK" color={colours.orange} />;
}

export function ScreenHeader({
  title,
  subtitle,
  badgeLabel,
  badgeColor,
  titleColor = colours.cyan,
  showGpsBadge = true,
}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.topLine} />
      <View style={styles.head}>
        <View style={styles.left}>
          <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
          {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
        </View>
        <View style={styles.right}>
          {badgeLabel ? (
            <OfflineBadge label={badgeLabel} color={badgeColor} />
          ) : showGpsBadge ? (
            <GpsBadge />
          ) : null}
          {badgeLabel === 'SQUAD LIVE' && (
            <Text style={styles.peerCount}>
              PEERS: {useMeshStore.getState().peerCount}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: 4,
  },
  topLine: {
    height: 1,
    marginHorizontal: 16,
    backgroundColor: 'rgba(0,245,255,0.12)',
    marginBottom: 0,
  },
  head: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    marginRight: 8,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
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
  peerCount: {
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 7,
    color: colours.green,
    textAlign: 'right',
    letterSpacing: 1,
  },
});
