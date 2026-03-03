import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { colours } from '../theme/colours';
import { GlassPanel } from '../components/GlassPanel';
import { ScreenHeader } from '../components/ScreenHeader';
import { meshService } from '../services/MeshService';
import { useVibeStore } from '../stores/vibeStore';

const STAGES = [
  { id: 'techno_dome', name: 'TECHNO DOME', emoji: '🔊' },
  { id: 'main_stage', name: 'MAIN STAGE', emoji: '🎸' },
  { id: 'acid_arena', name: 'ACID ARENA', emoji: '🧪' },
  { id: 'forest_rave', name: 'FOREST RAVE', emoji: '🌲' },
];

const SPOTIFY_PLAYLIST_URL = 'https://open.spotify.com/playlist/placeholder';

export function VibeScreen() {
  const [selectedStage, setSelectedStage] = useState(STAGES[0].id);
  const [myEnergy, setMyEnergy] = useState(50);
  const { addReport, reports } = useVibeStore();

  const handleReport = () => {
    const report = {
      stageId: selectedStage,
      energyLevel: myEnergy,
      reportedBy: 'YOU',
      timestamp: Date.now()
    };
    addReport(report);
    meshService.broadcastVibe(selectedStage, myEnergy);
  };

  function openSpotify() {
    Linking.openURL(SPOTIFY_PLAYLIST_URL).catch(() => {
      Linking.openURL('https://spotify.com');
    });
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title="VIBE CHECK"
        subtitle="REPORT ENERGY // SYNC WITH SQUAD"
        badgeLabel="LIVE DATA"
        badgeColor={colours.cyan}
        showGpsBadge={false}
      />

      <GlassPanel title="THE AGGROMETER">
        <Text style={styles.vibeLabel}>STAGE ENERGY: {myEnergy}%</Text>
        <View style={styles.aggroTrack}>
          <TouchableOpacity
            style={styles.aggroTouch}
            activeOpacity={1}
            onPress={(e) => {
              const x = e.nativeEvent.locationX;
              const percent = Math.round((x / 280) * 100);
              setMyEnergy(Math.max(0, Math.min(100, percent)));
            }}
          >
            <View style={[styles.aggroFill, {
              width: `${myEnergy}%`,
              backgroundColor: myEnergy > 80 ? colours.red : myEnergy > 50 ? colours.cyan : colours.green
            }]} />
            <View style={[styles.aggroKnob, { left: `${myEnergy}%` }]} />
          </TouchableOpacity>
        </View>

        <View style={styles.stageGrid}>
          {STAGES.map(s => (
            <TouchableOpacity
              key={s.id}
              style={[styles.stageBtn, selectedStage === s.id && styles.stageBtnActive]}
              onPress={() => setSelectedStage(s.id)}
            >
              <Text style={styles.stageEmoji}>{s.emoji}</Text>
              <Text style={[styles.stageName, selectedStage === s.id && { color: colours.cyan }]}>{s.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.reportBtn} onPress={handleReport}>
          <Text style={styles.reportBtnText}>⚡ BROADCAST VIBE REPORT</Text>
        </TouchableOpacity>
      </GlassPanel>

      {/* SOUNDS section */}
      <GlassPanel title="TRAVEL RAVERS // OFFICIAL SOUNDS" accentColor={colours.green}>
        <Text style={styles.soundsSubtitle}>THE OFFICIAL PLAYLIST // CURATED BY THE RAVERS</Text>
        <View style={styles.spotifyCard}>
          <Text style={styles.spotifyIcon}>🎵</Text>
          <View style={styles.spotifyInfo}>
            <Text style={styles.spotifyTitle}>TRAVEL RAVERS 2026</Text>
            <Text style={styles.spotifyMeta}>TECHNO · HARD TECHNO · ACID · TRANCE</Text>
            <Text style={styles.spotifyMeta}>128 TRACKS // 8 HOURS</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.spotifyBtn} onPress={openSpotify} activeOpacity={0.85}>
          <Text style={styles.spotifyBtnText}>▶ OPEN IN SPOTIFY</Text>
        </TouchableOpacity>
        <Text style={styles.soundsHint}>Save the playlist before you go offline</Text>
      </GlassPanel>

      <GlassPanel title="SQUAD VIBE FEED">
        {Object.values(reports).length === 0 ? (
          <Text style={styles.noVibes}>NO REPORTS YET // BE THE FIRST</Text>
        ) : (
          Object.values(reports).map((r, i) => (
            <View key={i} style={styles.vibeRow}>
              <Text style={styles.vibeStage}>{STAGES.find(s => s.id === r.stageId)?.name || 'UNKNOWN'}</Text>
              <View style={styles.vibeLevelWrap}>
                <View style={[styles.vibeLevelBar, {
                  width: `${r.energyLevel}%`,
                  backgroundColor: r.energyLevel > 80 ? colours.red : colours.cyan
                }]} />
              </View>
              <Text style={styles.vibeVal}>{r.energyLevel}%</Text>
            </View>
          ))
        )}
      </GlassPanel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: 'transparent' },
  content: { paddingBottom: 24 },
  vibeLabel: { fontFamily: 'Orbitron_700Bold', fontSize: 11, color: colours.text, textAlign: 'center', marginBottom: 15, letterSpacing: 2 },
  aggroTrack: { height: 40, backgroundColor: 'rgba(0,245,255,0.05)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,245,255,0.2)', overflow: 'hidden', position: 'relative', marginBottom: 20, marginHorizontal: 10 },
  aggroTouch: { flex: 1 },
  aggroFill: { height: '100%', opacity: 0.6 },
  aggroKnob: { position: 'absolute', top: -2, width: 4, height: 44, backgroundColor: colours.text, shadowColor: colours.cyan, shadowRadius: 5, shadowOpacity: 1 },
  stageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 20 },
  stageBtn: { width: '45%', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(0,245,255,0.1)', backgroundColor: 'rgba(0,245,255,0.02)', alignItems: 'center' },
  stageBtnActive: { borderColor: colours.cyan, backgroundColor: 'rgba(0,245,255,0.08)' },
  stageEmoji: { fontSize: 20, marginBottom: 4 },
  stageName: { fontFamily: 'ShareTechMono_400Regular', fontSize: 9, color: colours.dim, letterSpacing: 1 },
  reportBtn: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colours.cyan, backgroundColor: 'rgba(0,245,255,0.08)', alignItems: 'center' },
  reportBtnText: { fontFamily: 'Orbitron_700Bold', fontSize: 11, letterSpacing: 3, color: colours.cyan },
  // Sounds
  soundsSubtitle: { fontFamily: 'ShareTechMono_400Regular', fontSize: 8, color: colours.dim, letterSpacing: 2, marginBottom: 14 },
  spotifyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(0,255,136,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(0,255,136,0.15)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  spotifyIcon: { fontSize: 28 },
  spotifyInfo: { flex: 1, gap: 3 },
  spotifyTitle: { fontFamily: 'Orbitron_700Bold', fontSize: 11, color: colours.green, letterSpacing: 2 },
  spotifyMeta: { fontFamily: 'ShareTechMono_400Regular', fontSize: 8, color: colours.dim, letterSpacing: 1 },
  spotifyBtn: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colours.green,
    backgroundColor: 'rgba(0,255,136,0.08)',
    alignItems: 'center',
    marginBottom: 8,
  },
  spotifyBtnText: { fontFamily: 'Orbitron_700Bold', fontSize: 11, letterSpacing: 3, color: colours.green },
  soundsHint: { fontFamily: 'ShareTechMono_400Regular', fontSize: 8, color: colours.dim, textAlign: 'center', letterSpacing: 1 },
  // Vibe feed
  noVibes: { fontFamily: 'ShareTechMono_400Regular', fontSize: 10, color: colours.dim, textAlign: 'center', paddingVertical: 15 },
  vibeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(0,245,255,0.05)' },
  vibeStage: { fontFamily: 'ShareTechMono_400Regular', fontSize: 10, color: colours.text, width: 100 },
  vibeLevelWrap: { flex: 1, height: 4, backgroundColor: 'rgba(0,245,255,0.06)', borderRadius: 2, overflow: 'hidden' },
  vibeLevelBar: { height: '100%' },
  vibeVal: { fontFamily: 'Orbitron_700Bold', fontSize: 9, color: colours.cyan, width: 35, textAlign: 'right' },
});
