import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Trophy } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#020617',
          borderTopColor: 'rgba(255,255,255,0.1)',
          height: 60,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#64748b',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color }) => <Trophy size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
