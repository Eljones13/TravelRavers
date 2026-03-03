import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colours } from '../theme/colours';
import { GlassPanel } from '../components/GlassPanel';
import { ScreenHeader } from '../components/ScreenHeader';
import { useChecklistStore } from '../stores/checklistStore';

const MEDICAL_INFO = [
  { icon: '🏥', label: 'Medical Tent 01', value: 'NEAR MAIN STAGE', vColor: colours.green },
  { icon: '🏥', label: 'Medical Tent 02', value: 'NEAR ACID ARENA', vColor: colours.green },
  { icon: '📞', label: 'Site Security', value: '07700 000 999', vColor: colours.cyan },
  { icon: '💧', label: 'Free Water', value: 'CENTRAL PLAZA + HALO', vColor: colours.cyan },
];

const HARM_REDUCTION = [
  '⚡ Stay hydrated — 500ml per hour',
  '👥 Never leave a friend alone',
  '🌡️ Cool down zone near Med Tent 01',
  '📵 No signal = use this app\'s SOS',
  '🔴 Someone struggling? Hit SOS now',
];

export function KitScreen() {
  const { items, loaded, load, toggle } = useChecklistStore();

  useEffect(() => {
    if (!loaded) load();
  }, []);

  const checked = items.filter((i) => i.checked).length;
  const total = items.length;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ScreenHeader title="MISSION KIT" subtitle="PRE-FESTIVAL CHECKLIST // TAP TO CHECK" />

      {/* Progress */}
      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(checked / total) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{checked}/{total} ITEMS CHECKED</Text>
      </View>

      <GlassPanel title="ESSENTIALS // CRITICAL">
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.checkItem}
            onPress={() => toggle(item.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, item.checked && styles.checkboxDone]}>
              {item.checked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.checkLabel, item.checked && styles.checkLabelDone]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </GlassPanel>

      <GlassPanel title="MEDICAL // KNOW BEFORE YOU GO">
        {MEDICAL_INFO.map((info) => (
          <View key={info.label} style={styles.statRow}>
            <Text style={styles.statIcon}>{info.icon} {info.label}</Text>
            <Text style={[styles.statVal, { color: info.vColor }]}>{info.value}</Text>
          </View>
        ))}
      </GlassPanel>

      <GlassPanel title="HARM REDUCTION // STAY SAFE">
        {HARM_REDUCTION.map((line) => (
          <Text key={line} style={styles.harmLine}>{line}</Text>
        ))}
      </GlassPanel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
  progressWrap: { paddingHorizontal: 16, marginBottom: 12 },
  progressTrack: { height: 3, backgroundColor: 'rgba(0,245,255,0.08)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: 3, backgroundColor: colours.cyan },
  progressText: { fontFamily: 'ShareTechMono_400Regular', fontSize: 8, color: colours.dim, letterSpacing: 2 },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(0,245,255,0.05)' },
  checkbox: { width: 18, height: 18, borderWidth: 1, borderColor: 'rgba(0,245,255,0.25)', borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  checkboxDone: { backgroundColor: 'rgba(0,255,136,0.09)', borderColor: colours.green },
  checkmark: { fontSize: 10, color: colours.green },
  checkLabel: { fontFamily: 'ShareTechMono_400Regular', fontSize: 11, color: colours.text, letterSpacing: 0.5, flex: 1 },
  checkLabelDone: { textDecorationLine: 'line-through', color: colours.dim },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(0,245,255,0.05)' },
  statIcon: { fontFamily: 'ShareTechMono_400Regular', fontSize: 10, color: colours.text },
  statVal: { fontFamily: 'Orbitron_700Bold', fontSize: 9, letterSpacing: 2 },
  harmLine: { fontFamily: 'ShareTechMono_400Regular', fontSize: 10, color: colours.text, lineHeight: 22 },
});
