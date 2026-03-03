import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Modal, View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Path, Rect, Polyline, Polygon } from 'react-native-svg';
import { colours } from '../theme/colours';
import { FestivalSelectScreen } from '../screens/FestivalSelectScreen';
import { RadarScreen } from '../screens/RadarScreen';
import { MapScreen } from '../screens/MapScreen';
import { TimetableScreen } from '../screens/TimetableScreen';
import { KitScreen } from '../screens/KitScreen';
import { SOSScreen } from '../screens/SOSScreen';
import { SquadSetupScreen } from '../screens/SquadSetupScreen';
import { useSquadProfileStore } from '../stores/squadProfileStore';
import * as Haptics from 'expo-haptics';

const Tab = createBottomTabNavigator();

function IconEvents({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Polyline points="9 22 9 12 15 12 15 22" />
    </Svg>
  );
}

function IconRadar({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
      <Circle cx={12} cy={12} r={10} />
      <Circle cx={12} cy={12} r={6} />
      <Circle cx={12} cy={12} r={2} />
      <Line x1={12} y1={2} x2={12} y2={6} />
      <Line x1={2} y1={12} x2={6} y2={12} />
    </Svg>
  );
}

function IconMap({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
      <Polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21" />
      <Line x1={9} y1={3} x2={9} y2={18} />
      <Line x1={15} y1={6} x2={15} y2={21} />
    </Svg>
  );
}

function IconTimes({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
      <Rect x={3} y={4} width={18} height={18} rx={2} />
      <Line x1={16} y1={2} x2={16} y2={6} />
      <Line x1={8} y1={2} x2={8} y2={6} />
      <Line x1={3} y1={10} x2={21} y2={10} />
    </Svg>
  );
}

function IconKit({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
      <Path d="M9 11l3 3L22 4" />
      <Path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </Svg>
  );
}

function IconSOS({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx={12} cy={12} r={10} />
      <Line x1={12} y1={8} x2={12} y2={12} />
      <Line x1={12} y1={16} x2={12.01} y2={16} />
    </Svg>
  );
}

function TabLabel({ label, color }: { label: string; color: string }) {
  return (
    <Text style={[styles.tabLabel, { color }]}>{label}</Text>
  );
}

function RadarTabScreen() {
  const { hasSetup } = useSquadProfileStore();
  const [setupDone, setSetupDone] = useState(hasSetup);

  if (!setupDone) {
    return (
      <View style={{ flex: 1, backgroundColor: colours.bg }}>
        <SquadSetupScreen onComplete={() => setSetupDone(true)} />
      </View>
    );
  }
  return <RadarScreen />;
}

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colours.cyan,
        tabBarInactiveTintColor: colours.dim,
        tabBarShowLabel: false,
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
    >
      <Tab.Screen
        name="Events"
        component={FestivalSelectScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.tabItem}>
              <IconEvents color={color} />
              <TabLabel label="EVENTS" color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Radar"
        component={RadarTabScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.tabItem}>
              <IconRadar color={color} />
              <TabLabel label="RADAR" color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.tabItem}>
              <IconMap color={color} />
              <TabLabel label="MAP" color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Timetable"
        component={TimetableScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.tabItem}>
              <IconTimes color={color} />
              <TabLabel label="TIMES" color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Kit"
        component={KitScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.tabItem}>
              <IconKit color={color} />
              <TabLabel label="KIT" color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="SOS"
        component={SOSScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            const color = focused ? colours.red : 'rgba(255,34,68,0.6)';
            return (
              <View style={styles.tabItem}>
                <IconSOS color={color} />
                <TabLabel label="SOS" color={color} />
              </View>
            );
          },
          tabBarActiveTintColor: colours.red,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,245,255,0.12)',
    height: 74,
    paddingBottom: 8,
  },
  tabItem: {
    alignItems: 'center',
    gap: 3,
    paddingTop: 6,
  },
  tabLabel: {
    fontFamily: 'ShareTechMono_400Regular',
    fontSize: 8,
    letterSpacing: 2,
    marginTop: 2,
  },
});
