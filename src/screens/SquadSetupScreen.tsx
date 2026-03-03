import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Share, Alert, Platform,
} from 'react-native';
import { colours } from '../theme/colours';
import { GlassPanel } from '../components/GlassPanel';
import { useSquadProfileStore } from '../stores/squadProfileStore';

export function SquadSetupScreen({ onComplete }: { onComplete: () => void }) {
  const { myName, generatedCode, setMyName, completeSetup, regenerateCode } = useSquadProfileStore();
  const [nameInput, setNameInput] = useState(myName);
  const [copied, setCopied] = useState(false);

  function handleJoin() {
    if (!nameInput.trim()) {
      Alert.alert('ENTER YOUR NAME', 'We need your rave name to identify you to your squad.');
      return;
    }
    setMyName(nameInput.trim().toUpperCase());
    completeSetup();
    onComplete();
  }

  async function handleCopy() {
    // Use share sheet as clipboard fallback (no expo-clipboard installed)
    await Share.share({ message: generatedCode });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    await Share.share({
      message: `Join my Travel Ravers squad! Code: ${generatedCode}\n\nDownload the app and enter this code to track each other offline at the festival.`,
    });
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.logo}>⚡ TRAVEL RAVERS</Text>
        <Text style={styles.title}>SQUAD SETUP</Text>
        <Text style={styles.subtitle}>MESH NETWORK // OFFLINE FIRST</Text>
      </View>

      <GlassPanel title="YOUR RAVE NAME">
        <Text style={styles.hint}>How should your squad see you on the radar?</Text>
        <TextInput
          style={styles.input}
          placeholder="E.G. NEON FOX, DJ PRISM..."
          placeholderTextColor={colours.dim}
          value={nameInput}
          onChangeText={(t) => setNameInput(t.toUpperCase())}
          autoCapitalize="characters"
          maxLength={20}
        />
      </GlassPanel>

      <GlassPanel title="YOUR SQUAD CODE">
        <Text style={styles.hint}>Share this with your crew. They enter it to join your mesh.</Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>{generatedCode}</Text>
        </View>
        <View style={styles.codeActions}>
          <TouchableOpacity style={styles.codeBtn} onPress={handleCopy} activeOpacity={0.8}>
            <Text style={styles.codeBtnText}>{copied ? '✓ COPIED' : '📋 COPY CODE'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.codeBtn, { borderColor: 'rgba(255,0,255,0.4)' }]} onPress={handleShare} activeOpacity={0.8}>
            <Text style={[styles.codeBtnText, { color: colours.magenta }]}>📡 SHARE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.codeBtn, { borderColor: 'rgba(0,245,255,0.15)' }]} onPress={regenerateCode} activeOpacity={0.8}>
            <Text style={[styles.codeBtnText, { color: colours.dim }]}>🔄 NEW</Text>
          </TouchableOpacity>
        </View>
      </GlassPanel>

      <GlassPanel title="HOW IT WORKS">
        <View style={styles.howRow}>
          <Text style={styles.howIcon}>📡</Text>
          <Text style={styles.howText}>Works without internet using Bluetooth mesh</Text>
        </View>
        <View style={styles.howRow}>
          <Text style={styles.howIcon}>📍</Text>
          <Text style={styles.howText}>Squad appears as dots on your tactical radar</Text>
        </View>
        <View style={styles.howRow}>
          <Text style={styles.howIcon}>🆘</Text>
          <Text style={styles.howText}>SOS alerts hop through all nearby phones instantly</Text>
        </View>
      </GlassPanel>

      <TouchableOpacity style={styles.joinBtn} onPress={handleJoin} activeOpacity={0.85}>
        <Text style={styles.joinBtnText}>⚡ ACTIVATE SQUAD LINK</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: 'transparent' },
  content: { paddingBottom: 40 },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  logo: {
    fontFamily: 'Orbitron_900Black',
    fontSize: 14,
    letterSpacing: 4,
    color: colours.cyan,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 22,
    letterSpacing: 5,
    color: colours.text,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 9,
    color: colours.dim,
    letterSpacing: 3,
  },
  hint: {
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 10,
    color: colours.dim,
    marginBottom: 12,
    lineHeight: 16,
  },
  input: {
    backgroundColor: 'rgba(0,245,255,0.04)',
    borderWidth: 1,
    borderColor: colours.glassBorder,
    borderRadius: 10,
    padding: 14,
    color: colours.cyan,
    fontFamily: 'Orbitron_700Bold',
    fontSize: 14,
    letterSpacing: 2,
  },
  codeBox: {
    backgroundColor: 'rgba(0,245,255,0.06)',
    borderWidth: 1,
    borderColor: colours.cyan,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  codeText: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 13,
    color: colours.cyan,
    letterSpacing: 2,
    textAlign: 'center',
  },
  codeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  codeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,245,255,0.35)',
    backgroundColor: 'rgba(0,245,255,0.05)',
    alignItems: 'center',
  },
  codeBtnText: {
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 9,
    color: colours.cyan,
    letterSpacing: 1,
  },
  howRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  howIcon: { fontSize: 16 },
  howText: {
    flex: 1,
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 10,
    color: colours.text,
    lineHeight: 16,
  },
  joinBtn: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colours.cyan,
    backgroundColor: 'rgba(0,245,255,0.09)',
    alignItems: 'center',
    shadowColor: colours.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  joinBtnText: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 14,
    letterSpacing: 4,
    color: colours.cyan,
  },
});
