import { Tabs } from 'expo-router';
import { CreditCard, House, LayoutDashboard, Leaf, Wallet } from 'lucide-react-native';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { isDesktop } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import { path } from '@/constants/path';
import useNav from '@/hooks/useNav';

export default function TabLayout() {
  const { isDashboard } = useNav();

  return (
    <>
      <Navbar />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "white",
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {
              backgroundColor: "#262626",
              borderColor: "#686163",
              display: isDesktop() ? 'none' : 'flex',
            },
          }),
        }}
        backBehavior="order"
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color }) => <House size={28} color={color} />,
            href: isDashboard ? null : path.HOME,
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            headerShown: false,
            tabBarIcon: ({ color }) => <LayoutDashboard size={28} color={color} />,
            href: isDashboard ? path.DASHBOARD : null,
          }}
        />
        <Tabs.Screen
          name="deposit"
          options={{
            title: 'Deposit',
            headerShown: false,
            tabBarIcon: ({ color }) => <Wallet size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="card"
          options={{
            title: 'Card',
            tabBarIcon: ({ color }) => <CreditCard size={28} color={color} />,
            href: Platform.OS === 'web' ? null : path.CARD,
          }}
        />
        <Tabs.Screen
          name="earn"
          options={{
            title: 'Earn',
            tabBarIcon: ({ color }) => <Leaf size={28} color={color} />,
            href: Platform.OS === 'web' ? null : path.EARN,
          }}
        />
      </Tabs>
    </>
  );
}
