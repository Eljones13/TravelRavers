import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Orbitron_400Regular, Orbitron_700Bold, Orbitron_900Black } from '@expo-google-fonts/orbitron';
import { ShareTechMono_400Regular } from '@expo-google-fonts/share-tech-mono';
import * as SplashScreen from 'expo-splash-screen';
import { AppNavigator } from './src/navigation/AppNavigator';
import { BgOrbs } from './src/components/BgOrbs';
import { Scanlines } from './src/components/Scanlines';
import { BackgroundGrid } from './src/components/BackgroundGrid';
import { colours } from './src/theme/colours';

import { useLocationTracking } from './src/hooks/useLocationTracking';
import { meshService } from './src/services/MeshService';

SplashScreen.preventAutoHideAsync();

export default function App() {
  useLocationTracking();

  useEffect(() => {
    // Initialize mesh networking on launch
    meshService.init('c42986b8-9496-4f85-aca6-c8c32f1ddfc2', { sandbox: true });
  }, []);

  const [fontsLoaded, fontError] = useFonts({
    Orbitron_400Regular,
    Orbitron_700Bold,
    Orbitron_900Black,
    ShareTechMono_400Regular,
  });

  React.useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colours.bg,
      card: 'rgba(2,6,16,0.95)',
      text: colours.text,
      border: 'rgba(0,245,255,0.1)',
      primary: colours.cyan,
    },
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={CustomDarkTheme}>
        <StatusBar barStyle="light-content" backgroundColor={colours.bg} />
        <View style={styles.root}>
          <BackgroundGrid />
          <BgOrbs />
          <Scanlines />
          <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <AppNavigator />
          </SafeAreaView>
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colours.bg,
  },
  safeArea: {
    flex: 1,
  },
});
