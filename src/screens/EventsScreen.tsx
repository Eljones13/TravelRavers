import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet
} from 'react-native';
import { colours } from '../theme/colours';
import { GlassPanel } from '../components/GlassPanel';
import { ScreenHeader } from '../components/ScreenHeader';
import { FESTIVALS } from '../data/festivals';
import { useFestivalStore } from '../stores/festivalStore';
import { useNavigation } from '@react-navigation/native';

const FILTERS = [
  { key: 'all', label: 'ALL' },
  { key: 'uk', label: '🇬🇧 UK' },
  { key: 'eu', label: '🌍 EU' },
  { key: 'carnival', label: '🎪 CARNIVAL' },
  { key: 'concert', label: '🎤 CONCERT' },
];

function formatCapacity(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(0)}M PEOPLE`;
  if (n >= 1000) return `${(n / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}K RAVERS`;
  return `${n} RAVERS`;
}

export function EventsScreen() {
  const navigation = useNavigation<any>();
  const { selectedId, setSelected, filterCat, setFilter } = useFestivalStore();
  const [customText, setCustomText] = useState('');

  const visible = FESTIVALS.filter(
    (f) => filterCat === 'all' || f.cat === filterCat
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader
        title="SELECT EVENT"
        subtitle="TAP YOUR FESTIVAL // OFFLINE DATA LOADS"
        badgeLabel="READY"
        badgeColor={colours.green}
      />

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBtn, filterCat === f.key && styles.filterBtnActive]}
            onPress={() => setFilter(f.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, filterCat === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Festival grid */}
      <View style={styles.grid}>
        {visible.map((fest) => {
          const selected = selectedId === fest.id;
          return (
            <TouchableOpacity
              key={fest.id}
              style={[
                styles.card,
                { borderColor: selected ? fest.accent : 'rgba(0,245,255,0.15)' },
                selected && { backgroundColor: 'rgba(0,245,255,0.07)' },
              ]}
              onPress={() => setSelected(fest.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.cardTopLine, { backgroundColor: fest.accent }]} />
              {selected && (
                <Text style={[styles.checkMark, { color: fest.accent }]}>✓</Text>
              )}
              <Text style={styles.festEmoji}>{fest.emoji}</Text>
              <Text style={styles.festName}>{fest.name}</Text>
              <Text style={styles.festInfo}>
                {fest.date} · {fest.location}{'\n'}{fest.genre}
              </Text>
              <Text style={[styles.festCap, { color: fest.accent }]}>
                {formatCapacity(fest.capacity)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Enter button */}
      <TouchableOpacity
        style={styles.enterBtn}
        onPress={() => navigation.navigate('Radar')}
        activeOpacity={0.8}
      >
        <Text style={styles.enterBtnText}>⚡ ENTER FESTIVAL // LOAD MAP</Text>
      </TouchableOpacity>

      {/* Custom event */}
      <GlassPanel title="CUSTOM EVENT // ADD YOUR OWN">
        <View style={styles.customRow}>
          <TextInput
            style={styles.customInput}
            placeholder="TYPE EVENT NAME..."
            placeholderTextColor={colours.dim}
            value={customText}
            onChangeText={setCustomText}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.addBtn} activeOpacity={0.7}>
            <Text style={styles.addBtnText}>+ ADD</Text>
          </TouchableOpacity>
        </View>
      </GlassPanel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 16 },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,245,255,0.18)',
    backgroundColor: 'rgba(0,245,255,0.03)',
  },
  filterBtnActive: {
    borderColor: colours.cyan,
    backgroundColor: 'rgba(0,245,255,0.10)',
  },
  filterText: {
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 9,
    letterSpacing: 1,
    color: colours.dim,
  },
  filterTextActive: { color: colours.cyan },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 4,
  },
  card: {
    width: '47.5%',
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(0,245,255,0.03)',
    padding: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  cardTopLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.6,
  },
  checkMark: {
    position: 'absolute',
    top: 8,
    right: 10,
    fontSize: 10,
    fontFamily: 'ShareTechMono_400Regular',
  },
  festEmoji: { fontSize: 24, marginBottom: 6 },
  festName: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 9,
    letterSpacing: 2,
    color: colours.text,
    marginBottom: 3,
  },
  festInfo: {
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 8,
    color: colours.dim,
    letterSpacing: 1,
    lineHeight: 14,
  },
  festCap: {
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 8,
    marginTop: 4,
    letterSpacing: 1,
  },
  enterBtn: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,245,255,0.4)',
    backgroundColor: 'rgba(0,245,255,0.08)',
    alignItems: 'center',
  },
  enterBtnText: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 12,
    letterSpacing: 4,
    color: colours.cyan,
  },
  customRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  customInput: {
    flex: 1,
    backgroundColor: 'rgba(0,245,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(0,245,255,0.2)',
    borderRadius: 8,
    padding: 10,
    color: colours.cyan,
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 10,
    letterSpacing: 1,
  },
  addBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,245,255,0.28)',
    backgroundColor: 'rgba(0,245,255,0.07)',
  },
  addBtnText: {
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 9,
    color: colours.cyan,
    letterSpacing: 1,
  },
});
