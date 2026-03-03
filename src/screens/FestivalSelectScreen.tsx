import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, TextInput } from 'react-native';
import { colours } from '../theme/colours';
import { ScreenHeader } from '../components/ScreenHeader';
import { useFestivalStore } from '../stores/festivalStore';
import { FESTIVALS } from '../data/festivals';

const CATEGORIES = [
    { key: 'all', label: 'ALL' },
    { key: 'uk', label: '🇬🇧 UK' },
    { key: 'eu', label: '🌍 EU' },
    { key: 'carnival', label: '🎪 CARNIVAL' },
    { key: 'concert', label: '🎤 CONCERT' },
];

export function FestivalSelectScreen({ navigation }: any) {
    const { selectedId, filterCat, setSelected, setFilter } = useFestivalStore();

    const filtered = FESTIVALS.filter(f => filterCat === 'all' || f.cat === filterCat);

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <ScreenHeader
                title="SELECT EVENT"
                subtitle="TAP YOUR FESTIVAL // OFFLINE DATA LOADS"
                badgeLabel="READY"
                badgeColor={colours.green}
            />

            {/* Category Filter */}
            <View style={styles.filterRow}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat.key}
                            style={[styles.filterBtn, filterCat === cat.key && styles.filterBtnActive]}
                            onPress={() => setFilter(cat.key)}
                        >
                            <Text style={[styles.filterText, filterCat === cat.key && styles.filterTextActive]}>
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Grid */}
            <View style={styles.grid}>
                {filtered.map(fest => (
                    <TouchableOpacity
                        key={fest.id}
                        style={[
                            styles.card,
                            { borderTopColor: fest.accent },
                            selectedId === fest.id && styles.cardSelected
                        ]}
                        onPress={() => setSelected(fest.id)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.emoji}>{fest.emoji}</Text>
                        <Text style={styles.name}>{fest.name}</Text>
                        <Text style={styles.info}>{fest.date} · {fest.location}</Text>
                        <Text style={styles.info}>{fest.genre}</Text>
                        <Text style={[styles.cap, { color: fest.accent }]}>{fest.capacity.toLocaleString()} RAVERS</Text>
                        {selectedId === fest.id && <Text style={[styles.check, { color: fest.accent }]}>✓</Text>}
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                style={styles.enterBtn}
                onPress={() => navigation.navigate('Radar')}
            >
                <Text style={styles.enterBtnText}>⚡ ENTER FESTIVAL // LOAD MAP</Text>
            </TouchableOpacity>

            <View style={styles.customPanel}>
                <Text style={styles.customTitle}>CUSTOM EVENT // ADD YOUR OWN</Text>
                <View style={styles.customRow}>
                    <TextInput
                        placeholder="TYPE EVENT NAME..."
                        placeholderTextColor={colours.dim}
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.addBtn}>
                        <Text style={styles.addBtnText}>+ ADD</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { flex: 1, backgroundColor: 'transparent' },
    content: { paddingBottom: 30 },
    filterRow: { paddingHorizontal: 16, marginBottom: 16 },
    filterScroll: { gap: 8 },
    filterBtn: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,245,255,0.15)',
        backgroundColor: 'rgba(0,245,255,0.03)',
    },
    filterBtnActive: {
        borderColor: colours.cyan,
        backgroundColor: 'rgba(0,245,255,0.1)',
    },
    filterText: {
        fontFamily: 'ShareTechMono_400Regular',
        fontSize: 9,
        letterSpacing: 2,
        color: colours.dim,
    },
    filterTextActive: {
        color: colours.cyan,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    card: {
        width: '48.2%',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,245,255,0.15)',
        backgroundColor: 'rgba(0,245,255,0.03)',
        padding: 14,
        borderTopWidth: 2,
        position: 'relative',
    },
    cardSelected: {
        borderColor: colours.cyan,
        backgroundColor: 'rgba(0,245,255,0.07)',
    },
    emoji: { fontSize: 24, marginBottom: 6 },
    name: { fontFamily: 'Orbitron_700Bold', fontSize: 9, letterSpacing: 2, color: colours.text, marginBottom: 4 },
    info: { fontFamily: 'ShareTechMono_400Regular', fontSize: 8, color: colours.dim, letterSpacing: 1, lineHeight: 12 },
    cap: { fontFamily: 'ShareTechMono_400Regular', fontSize: 8, marginTop: 6, letterSpacing: 1 },
    check: { position: 'absolute', top: 8, right: 10, fontSize: 10 },
    enterBtn: {
        marginHorizontal: 16,
        marginBottom: 20,
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
    customPanel: {
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(0,245,255,0.15)',
        backgroundColor: 'rgba(0,245,255,0.025)',
    },
    customTitle: {
        fontFamily: 'Orbitron_700Bold',
        fontSize: 9,
        letterSpacing: 3,
        color: colours.cyan,
        marginBottom: 14,
    },
    customRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    input: {
        flex: 1,
        height: 38,
        backgroundColor: 'rgba(0,245,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(0,245,255,0.2)',
        borderRadius: 8,
        paddingHorizontal: 10,
        color: colours.cyan,
        fontFamily: 'ShareTechMono_400Regular',
        fontSize: 10,
    },
    addBtn: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,245,255,0.28)',
        backgroundColor: 'rgba(0,245,255,0.07)',
    },
    addBtnText: {
        fontFamily: 'ShareTechMono_400Regular',
        fontSize: 9,
        color: colours.cyan,
    }
});
