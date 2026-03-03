import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MeshSimulator } from '../utils/MeshSimulator';
import { colours } from '../theme/colours';
import { GlassPanel } from '../components/GlassPanel';
import { ScreenHeader } from '../components/ScreenHeader';
import { useSquadStore } from '../stores/squadStore';
import { useLocationStore } from '../stores/locationStore';
import { useTimetableStore } from '../stores/timetableStore';
import { TIMETABLE } from '../data/timetable';

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
}

export function SquadScreen() {
    const { getMemberList } = useSquadStore();
    const { coords } = useLocationStore();
    const { squadInterests } = useTimetableStore();
    const members = getMemberList();

    const sortedMembers = useMemo(() => {
        if (!coords) return members;
        return members.map(m => ({
            ...m,
            distance: getDistance(coords.latitude, coords.longitude, m.lat, m.lng)
        })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }, [members, coords]);

    const handleSimulate = () => {
        // Trigger a bunch of mock events
        MeshSimulator.simulatePeerLocation('peer_1', 'CHARLIE', 34.0522, -118.2437); // Close
        MeshSimulator.simulatePeerLocation('peer_2', 'BOBBY', 34.0525, -118.2430); // Very Close
        MeshSimulator.simulatePeerLocation('peer_3', 'ALICE', 34.0500, -118.2450); // A bit further

        MeshSimulator.simulateVibeReport('peer_2', 'TECHNO DOME', 95);

        setTimeout(() => {
            MeshSimulator.simulateSOS('peer_3', 'ALICE');
        }, 5000);
    };

    const getNextSet = (peerId: string) => {
        const peerSets = squadInterests[peerId] || [];
        if (peerSets.length === 0) return null;

        const allSets = Object.values(TIMETABLE).flatMap(stages => stages.flatMap(s => s.sets));
        return allSets.find(s => peerSets.includes(s.artist));
    };

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <ScreenHeader
                title="SQUAD HUD"
                subtitle="MESH NETWORK // PEER DISCOVERY"
                badgeLabel="SQUAD LIVE"
                badgeColor={colours.green}
            />

            <TouchableOpacity style={styles.debugBtn} onPress={handleSimulate}>
                <Text style={styles.debugBtnText}>🛠️ DEBUG: SIMULATE SQUAD</Text>
            </TouchableOpacity>

            <GlassPanel title="LOCATED NODES">
                {sortedMembers.length === 0 ? (
                    <Text style={styles.noPeers}>NO SQUAD MEMBERS DETECTED // SEARCHING MESH...</Text>
                ) : (
                    sortedMembers.map((m) => {
                        const nextSet = getNextSet(m.id);
                        return (
                            <View key={m.id} style={styles.memberContainer}>
                                <View style={styles.member}>
                                    <View style={[styles.avatar, { borderColor: m.status === 'sos' ? colours.red : colours.cyan }]}>
                                        <Text style={[styles.avatarText, { color: m.status === 'sos' ? colours.red : colours.cyan }]}>
                                            {m.name.charAt(0)}
                                        </Text>
                                    </View>
                                    <View style={styles.memberInfo}>
                                        <Text style={styles.memberName}>{m.name}</Text>
                                        <Text style={styles.memberLoc}>
                                            {m.distance ? `${Math.round(m.distance)}m away` : 'Calculating...'} // {Math.floor((Date.now() - m.lastSeen) / 1000)}s ago
                                        </Text>
                                    </View>
                                    <View style={[
                                        styles.statusBadge,
                                        { borderColor: m.status === 'sos' ? colours.red : colours.green },
                                        { backgroundColor: m.status === 'sos' ? 'rgba(255,34,68,0.1)' : 'rgba(0,255,136,0.08)' }
                                    ]}>
                                        <Text style={[styles.statusText, { color: m.status === 'sos' ? colours.red : colours.green }]}>
                                            {m.status === 'sos' ? '⚠️ SOS' : 'ACTIVE'}
                                        </Text>
                                    </View>
                                </View>
                                {nextSet && (
                                    <View style={styles.plannedSet}>
                                        <Text style={styles.plannedTitle}>NEXT SET</Text>
                                        <Text style={styles.plannedArtist}>{nextSet.artist}</Text>
                                        <Text style={styles.plannedTime}>{nextSet.time}</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })
                )}
            </GlassPanel>

            <TouchableOpacity style={styles.broadcastBtn} activeOpacity={0.8}>
                <Text style={styles.broadcastBtnText}>📡 BROADCAST "I'M OKAY"</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { flex: 1, backgroundColor: 'transparent' },
    content: { paddingBottom: 24 },
    noPeers: {
        fontFamily: 'ShareTechMono_400Regular',
        fontSize: 10,
        color: colours.dim,
        textAlign: 'center',
        paddingVertical: 20,
        letterSpacing: 1,
    },
    memberContainer: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,245,255,0.06)',
        paddingVertical: 4,
    },
    member: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,245,255,0.04)'
    },
    avatarText: { fontFamily: 'Orbitron_700Bold', fontSize: 16 },
    memberInfo: { flex: 1 },
    memberName: { fontFamily: 'Orbitron_700Bold', fontSize: 13, color: colours.text, letterSpacing: 1 },
    memberLoc: { fontFamily: 'ShareTechMono_400Regular', fontSize: 9, color: colours.dim, marginTop: 4 },
    statusBadge: { borderWidth: 1, borderRadius: 4, paddingVertical: 4, paddingHorizontal: 10 },
    statusText: { fontFamily: 'ShareTechMono_400Regular', fontSize: 8, letterSpacing: 2, fontWeight: 'bold' },
    plannedSet: {
        marginLeft: 56,
        paddingBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    plannedTitle: {
        fontFamily: 'Orbitron_700Bold',
        fontSize: 7,
        color: colours.cyan,
        letterSpacing: 1,
    },
    plannedArtist: {
        fontFamily: 'ShareTechMono_400Regular',
        fontSize: 10,
        color: colours.text,
        letterSpacing: 1,
    },
    plannedTime: {
        fontFamily: 'ShareTechMono_400Regular',
        fontSize: 8,
        color: colours.dim,
    },
    broadcastBtn: {
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,255,136,0.3)',
        backgroundColor: 'rgba(0,255,136,0.06)',
        alignItems: 'center',
    },
    broadcastBtnText: { fontFamily: 'Orbitron_700Bold', fontSize: 11, letterSpacing: 3, color: colours.green },
    debugBtn: {
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
    },
    debugBtnText: {
        fontFamily: 'ShareTechMono_400Regular',
        fontSize: 10,
        color: colours.dim,
        letterSpacing: 1,
    },
});
