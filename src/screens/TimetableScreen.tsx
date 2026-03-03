import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated,
  Modal, Pressable, Dimensions
} from 'react-native';
import { colours } from '../theme/colours';
import { ScreenHeader } from '../components/ScreenHeader';
import { useFestivalStore } from '../stores/festivalStore';
import { TIMETABLE, DJ_PROFILES, SetItem, StageData } from '../data/timetable';

const DAYS = [
  { key: 'thu', label: 'THU 27' },
  { key: 'fri', label: 'FRI 28' },
  { key: 'sat', label: 'SAT 29' },
  { key: 'sun', label: 'SUN 30' },
];

const { height: SCREEN_H } = Dimensions.get('window');

interface DJModalProps {
  artist: string | null;
  onClose: () => void;
}

function DJModal({ artist, onClose }: DJModalProps) {
  const slideAnim = useRef(new Animated.Value(SCREEN_H)).current;
  const profile = artist ? DJ_PROFILES[artist] : null;

  React.useEffect(() => {
    if (artist) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }).start();
    }
  }, [artist]);

  function handleClose() {
    Animated.timing(slideAnim, {
      toValue: SCREEN_H,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose());
  }

  if (!profile || !artist) return null;

  function VibeMeter({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
    return (
      <View style={{ marginBottom: 8 }}>
        <View style={styles.meterHeader}>
          <Text style={styles.meterLabel}>{icon} {label}</Text>
          <Text style={[styles.meterVal, { color }]}>{value}%</Text>
        </View>
        <View style={styles.meterTrack}>
          <View style={[styles.meterFill, { width: `${value}%`, backgroundColor: color }]} />
        </View>
      </View>
    );
  }

  return (
    <Modal transparent animationType="none" visible={!!artist} onRequestClose={handleClose}>
      <Pressable style={styles.modalBackdrop} onPress={handleClose}>
        <Animated.View style={[styles.modalWrap, { transform: [{ translateY: slideAnim }] }]}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Top accent bar */}
              <View style={styles.modalAccentBar} />

              {/* Header */}
              <View style={styles.djHeader}>
                <View>
                  <Text style={styles.djIcon}>{profile.icon}</Text>
                  <Text style={[styles.djName, { color: profile.color, textShadowColor: profile.color, textShadowRadius: 10 }]}>
                    {artist}
                  </Text>
                  <Text style={styles.djOrigin}>{profile.origin}</Text>
                </View>
                <View style={styles.djHeaderRight}>
                  <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                    <Text style={styles.closeBtnText}>✕ CLOSE</Text>
                  </TouchableOpacity>
                  <Text style={styles.djSince}>SINCE {profile.since}</Text>
                </View>
              </View>

              {/* Tags */}
              <View style={styles.tagRow}>
                {profile.tags.map((tag) => (
                  <View key={tag} style={[styles.tag, tag.includes('HARD') || tag.includes('DARK') || tag.includes('TECHNO') ? styles.tagMagenta : styles.tagCyan]}>
                    <Text style={[styles.tagText, tag.includes('HARD') || tag.includes('DARK') ? { color: colours.magenta } : { color: colours.cyan }]}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Bio */}
              <Text style={styles.djBio}>{profile.bio}</Text>

              {/* Stats grid */}
              <View style={styles.statsGrid}>
                <View style={styles.statCell}>
                  <Text style={styles.statLabel}>BPM</Text>
                  <Text style={[styles.statVal, { color: colours.cyan }]}>{profile.bpm}</Text>
                </View>
                <View style={styles.statCell}>
                  <Text style={styles.statLabel}>PEAK TIME</Text>
                  <Text style={[styles.statVal, { color: colours.green, fontSize: 9 }]}>{profile.peak}</Text>
                </View>
                <View style={styles.statCell}>
                  <Text style={styles.statLabel}>CROWD</Text>
                  <Text style={[styles.statVal, { color: colours.magenta, fontSize: 8 }]}>{profile.crowd}</Text>
                </View>
              </View>

              {/* Vibe meters */}
              <View style={styles.vibeSection}>
                <Text style={styles.vibeTitle}>VIBE ANALYSIS // REAL-TIME</Text>
                <VibeMeter label="ENERGY" value={profile.energy} color={colours.cyan} icon="⚡" />
                <VibeMeter label="DARKNESS" value={profile.darkness} color={colours.magenta} icon="🌑" />
                <VibeMeter label="WEIRDNESS" value={profile.weirdness} color={colours.green} icon="🌀" />
              </View>

              {/* Safety scores */}
              <View style={styles.scoreGrid}>
                <View style={styles.scoreCell}>
                  <Text style={styles.scoreLabel}>🤘 AGGRO SCORE</Text>
                  <Text style={[styles.scoreVal, { color: colours.red, textShadowColor: colours.red, textShadowRadius: 8 }]}>
                    {profile.aggroScore}
                  </Text>
                  <Text style={styles.scoreDenom}>/ 10</Text>
                </View>
                <View style={[styles.scoreCell, { borderColor: 'rgba(0,255,136,0.2)', backgroundColor: 'rgba(0,255,136,0.04)' }]}>
                  <Text style={styles.scoreLabel}>🌱 FIRST TIMER</Text>
                  <Text style={[styles.scoreVal, { color: colours.green, textShadowColor: colours.green, textShadowRadius: 8 }]}>
                    {profile.firstTimerScore}
                  </Text>
                  <Text style={styles.scoreDenom}>/ 10</Text>
                </View>
              </View>

              {/* Tracks */}
              <View style={styles.tracksSection}>
                <Text style={styles.tracksTitle}>SIGNATURE TRACKS</Text>
                <View style={styles.tracksRow}>
                  {profile.tracks.map((t) => (
                    <View key={t} style={styles.trackChip}>
                      <Text style={styles.trackText}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Action buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>📡 SHARE VIBE TO SQUAD</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { borderColor: 'rgba(255,0,255,0.35)' }]}>
                  <Text style={[styles.actionBtnText, { color: colours.magenta }]}>⭐ ADD TO WATCHLIST</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

export function TimetableScreen() {
  const { festival } = useFestivalStore();
  const [day, setDay] = useState<keyof typeof TIMETABLE>('thu');
  const [selectedDJ, setSelectedDJ] = useState<string | null>(null);
  const [favs, setFavs] = useState<Set<string>>(new Set(['JOHN SUMMIT', 'CHARLOTTE DE WITTE', 'RICHIE HAWTIN']));

  const stages: StageData[] = TIMETABLE[day] ?? [];

  function toggleFav(artist: string) {
    setFavs((prev) => {
      const next = new Set(prev);
      next.has(artist) ? next.delete(artist) : next.add(artist);
      return next;
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="TIMETABLE"
          subtitle={`${festival.name} // ALL STAGES`}
          badgeLabel="OFFLINE"
          badgeColor={colours.green}
        />

        {/* Day tabs */}
        <View style={styles.dayTabs}>
          {DAYS.map((d) => (
            <TouchableOpacity
              key={d.key}
              style={[styles.dayTab, day === d.key && styles.dayTabActive]}
              onPress={() => setDay(d.key as any)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayTabText, day === d.key && styles.dayTabTextActive]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stages */}
        <View style={{ paddingHorizontal: 16 }}>
          {stages.map((stage) => (
            <View key={stage.stage} style={styles.stageCol}>
              <View style={[styles.stageHeader, { borderLeftColor: stage.color }]}>
                <Text style={[styles.stageName, { color: stage.color }]}>{stage.stage}</Text>
              </View>

              {stage.sets.map((set) => (
                <TouchableOpacity
                  key={`${stage.stage}-${set.time}`}
                  style={[styles.setRow, { borderLeftColor: stage.color }, set.now && styles.setRowNow]}
                  onPress={() => setSelectedDJ(set.artist)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.setTime, { color: stage.color }]}>{set.time}</Text>
                  <View style={styles.setArtist}>
                    <Text style={styles.setName}>{set.artist}</Text>
                    <Text style={styles.setGenre}>{set.genre}</Text>
                  </View>
                  {set.now && <Text style={[styles.nowBadge, { color: colours.green }]}>NOW</Text>}
                  <TouchableOpacity onPress={() => toggleFav(set.artist)}>
                    <Text style={[styles.favStar, favs.has(set.artist) && styles.favStarActive]}>
                      {favs.has(set.artist) ? '⭐' : '☆'}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <DJModal artist={selectedDJ} onClose={() => setSelectedDJ(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
  dayTabs: { flexDirection: 'row', gap: 6, paddingHorizontal: 16, marginBottom: 12 },
  dayTab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,245,255,0.15)',
    backgroundColor: 'rgba(0,245,255,0.03)',
  },
  dayTabActive: { borderColor: colours.cyan, backgroundColor: 'rgba(0,245,255,0.09)' },
  dayTabText: { fontFamily: 'ShareTechMono_400Regular', fontSize: 9, letterSpacing: 2, color: colours.dim },
  dayTabTextActive: { color: colours.cyan },
  stageCol: { marginBottom: 16 },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  stageName: { fontFamily: 'Orbitron_700Bold', fontSize: 10, letterSpacing: 2 },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
    backgroundColor: 'rgba(0,245,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(0,245,255,0.08)',
    borderLeftWidth: 3,
  },
  setRowNow: {
    backgroundColor: 'rgba(0,245,255,0.07)',
    borderColor: 'rgba(0,245,255,0.3)',
  },
  setTime: { fontFamily: 'ShareTechMono_400Regular', fontSize: 11, minWidth: 42, letterSpacing: 1 },
  setArtist: { flex: 1 },
  setName: { fontFamily: 'ShareTechMono_400Regular', fontSize: 13, color: colours.text, letterSpacing: 1, fontWeight: '600' },
  setGenre: { fontFamily: 'ShareTechMono_400Regular', fontSize: 8, color: colours.dim, letterSpacing: 1, marginTop: 1 },
  nowBadge: { fontFamily: 'ShareTechMono_400Regular', fontSize: 8, letterSpacing: 2 },
  favStar: { fontSize: 14, color: colours.dim },
  favStarActive: { color: '#ffd700' },

  // Modal
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalWrap: { maxHeight: SCREEN_H * 0.92, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden', backgroundColor: 'rgba(3,8,20,0.98)', borderWidth: 1, borderColor: 'rgba(0,245,255,0.25)' },
  modalScroll: { flex: 1 },
  modalContent: { paddingBottom: 24 },
  modalAccentBar: { height: 4, backgroundColor: colours.cyan },
  djHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 16, paddingBottom: 0 },
  djIcon: { fontSize: 36, lineHeight: 40, marginBottom: 6 },
  djName: { fontFamily: 'Orbitron_700Bold', fontSize: 18, letterSpacing: 3 },
  djOrigin: { fontFamily: 'ShareTechMono_400Regular', fontSize: 9, color: colours.dim, letterSpacing: 2, marginTop: 3 },
  djHeaderRight: { alignItems: 'flex-end', gap: 6 },
  closeBtn: { backgroundColor: 'rgba(0,245,255,0.08)', borderWidth: 1, borderColor: 'rgba(0,245,255,0.2)', borderRadius: 20, paddingVertical: 4, paddingHorizontal: 12 },
  closeBtnText: { fontFamily: 'ShareTechMono_400Regular', fontSize: 10, color: colours.dim, letterSpacing: 1 },
  djSince: { fontFamily: 'ShareTechMono_400Regular', fontSize: 8, color: colours.dim, letterSpacing: 1 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, paddingHorizontal: 16, paddingTop: 12 },
  tag: { paddingVertical: 2, paddingHorizontal: 10, borderRadius: 3, borderWidth: 1 },
  tagCyan: { borderColor: colours.cyan, backgroundColor: 'rgba(0,245,255,0.08)' },
  tagMagenta: { borderColor: colours.magenta, backgroundColor: 'rgba(255,0,255,0.08)' },
  tagText: { fontFamily: 'Orbitron_700Bold', fontSize: 8, letterSpacing: 2 },
  djBio: { fontFamily: 'ShareTechMono_400Regular', fontSize: 11, color: colours.text, lineHeight: 20, padding: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,245,255,0.07)', letterSpacing: 0.3 },
  statsGrid: { flexDirection: 'row', marginHorizontal: 16, borderRadius: 10, overflow: 'hidden', backgroundColor: 'rgba(0,245,255,0.06)' },
  statCell: { flex: 1, backgroundColor: 'rgba(3,8,20,0.9)', padding: 10, alignItems: 'center' },
  statLabel: { fontFamily: 'ShareTechMono_400Regular', fontSize: 8, color: colours.dim, letterSpacing: 1, marginBottom: 4 },
  statVal: { fontFamily: 'Orbitron_700Bold', fontSize: 11 },
  vibeSection: { padding: 14, paddingBottom: 10 },
  vibeTitle: { fontFamily: 'Orbitron_700Bold', fontSize: 8, letterSpacing: 3, color: colours.cyan, marginBottom: 10 },
  meterHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  meterLabel: { fontFamily: 'ShareTechMono_400Regular', fontSize: 9, color: colours.dim, letterSpacing: 1 },
  meterVal: { fontFamily: 'ShareTechMono_400Regular', fontSize: 9, letterSpacing: 1 },
  meterTrack: { height: 4, backgroundColor: 'rgba(0,245,255,0.08)', borderRadius: 2, overflow: 'hidden' },
  meterFill: { height: 4, borderRadius: 2 },
  scoreGrid: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingBottom: 14 },
  scoreCell: { flex: 1, backgroundColor: 'rgba(255,34,68,0.06)', borderWidth: 1, borderColor: 'rgba(255,34,68,0.2)', borderRadius: 10, padding: 10, alignItems: 'center' },
  scoreLabel: { fontFamily: 'ShareTechMono_400Regular', fontSize: 8, color: colours.dim, letterSpacing: 1, marginBottom: 4 },
  scoreVal: { fontFamily: 'Orbitron_700Bold', fontSize: 24, fontWeight: '900' },
  scoreDenom: { fontFamily: 'ShareTechMono_400Regular', fontSize: 7, color: colours.dim, marginTop: 2 },
  tracksSection: { paddingHorizontal: 16, paddingBottom: 16 },
  tracksTitle: { fontFamily: 'Orbitron_700Bold', fontSize: 8, letterSpacing: 3, color: colours.dim, marginBottom: 8 },
  tracksRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  trackChip: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20, backgroundColor: 'rgba(0,245,255,0.05)', borderWidth: 1, borderColor: 'rgba(0,245,255,0.12)' },
  trackText: { fontFamily: 'ShareTechMono_400Regular', fontSize: 9, color: colours.text },
  actionRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 16 },
  actionBtn: { flex: 1, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,245,255,0.38)', backgroundColor: 'rgba(0,245,255,0.06)', alignItems: 'center' },
  actionBtnText: { fontFamily: 'Orbitron_700Bold', fontSize: 9, color: colours.cyan, letterSpacing: 2 },
});
