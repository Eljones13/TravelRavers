import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colours } from '../theme/colours';
import { ScreenHeader } from '../components/ScreenHeader';
import { GlassPanel } from '../components/GlassPanel';

const INITIAL_KIT = [
  { id: '1', text: 'Festival wristband activated', checked: true },
  { id: '2', text: 'Phone fully charged (100%)', checked: true },
  { id: '3', text: 'Offline map downloaded', checked: true },
  { id: '4', text: 'Power bank packed', checked: false },
  { id: '5', text: 'Squad meeting point agreed', checked: false },
  { id: '6', text: 'Emergency contact set in app', checked: false },
  { id: '7', text: 'Ear plugs packed', checked: false },
  { id: '8', text: 'Cash + card (cashless backup)', checked: false },
  { id: '9', text: 'Rain poncho packed', checked: false },
  { id: '10', text: 'Tent pegs + mallet', checked: false },
];

export function KitScreen() {
  const [kit, setKit] = useState(INITIAL_KIT);

  const toggleItem = (id: string) => {
    setKit(kit.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title="MISSION KIT"
        subtitle="PRE-FESTIVAL CHECKLIST // TAP TO CHECK"
      />

      <GlassPanel title="ESSENTIALS // CRITICAL">
        {kit.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.checkItem}
            onPress={() => toggleItem(item.id)}
          >
            <View style={[styles.checkBox, item.checked && styles.checkBoxActive]}>
              {item.checked && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={[styles.checkText, item.checked && styles.checkTextDone]}>
              {item.text}
            </Text>
          </TouchableOpacity>
        ))}
      </GlassPanel>

      <GlassPanel title="MEDICAL // KNOW BEFORE YOU GO">
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>🏥 Medical Tent 01</Text>
          <Text style={[styles.statVal, { color: colours.green }]}>NEAR MAIN STAGE</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>🏥 Medical Tent 02</Text>
          <Text style={[styles.statVal, { color: colours.green }]}>NEAR ACID ARENA</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>📞 Site Security</Text>
          <Text style={[styles.statVal, { color: colours.cyan }]}>07700 000 999</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>💧 Free Water</Text>
          <Text style={[styles.statVal, { color: colours.cyan }]}>CENTRAL PLAZA + HALO</Text>
        </View>
      </GlassPanel>

      <GlassPanel title="HARM REDUCTION // STAY SAFE">
        <View style={styles.harmText}>
          <Text style={styles.harmLine}>⚡ Stay hydrated — 500ml per hour</Text>
          <Text style={styles.harmLine}>👥 Never leave a friend alone</Text>
          <Text style={styles.harmLine}>🌡️ Cool down zone near Med Tent 01</Text>
          <Text style={styles.harmLine}> bromine no signal = use this app's SOS</Text>
          <Text style={styles.harmLine}>🔴 Someone struggling? Hit SOS now</Text>
        </View>
      </GlassPanel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: 'transparent' },
  content: { paddingBottom: 24 },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(0,245,255,0.05)' },
  checkBox: { width: 18, height: 18, borderWidth: 1, borderColor: 'rgba(0,245,255,0.25)', borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  checkBoxActive: { backgroundColor: 'rgba(0,255,136,0.1)', borderColor: colours.green },
  checkMark: { color: colours.green, fontSize: 10 },
  checkText: { fontFamily: 'ShareTechMono_400Regular', fontSize: 11, color: colours.text, letterSpacing: 0.5 },
  checkTextDone: { textDecorationLine: 'line-through', color: colours.dim },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(0,245,255,0.05)' },
  statLabel: { fontFamily: 'ShareTechMono_400Regular', fontSize: 10, color: colours.text },
  statVal: { fontFamily: 'Orbitron_700Bold', fontSize: 9, letterSpacing: 2 },
  harmText: { gap: 8 },
  harmLine: { fontFamily: 'ShareTechMono_400Regular', fontSize: 10, color: colours.text, lineHeight: 18 },
});
