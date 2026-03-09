import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#0f0f0f",
          borderTopColor: "#1a1a1a",
        },
        tabBarActiveTintColor: "#a855f7",
        tabBarInactiveTintColor: "#555",
        headerStyle: { backgroundColor: "#0f0f0f" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Explore", tabBarLabel: "Explore", tabBarIcon: ({ color }) => <TabIcon icon="🗺" color={color} /> }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: "Search", tabBarLabel: "Search", tabBarIcon: ({ color }) => <TabIcon icon="🔍" color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarLabel: "Profile", tabBarIcon: ({ color }) => <TabIcon icon="👤" color={color} /> }}
      />
    </Tabs>
  );
}

function TabIcon({ icon, color }: { icon: string; color: string }) {
  const { Text } = require("react-native");
  return <Text style={{ fontSize: 20, opacity: color === "#a855f7" ? 1 : 0.5 }}>{icon}</Text>;
}
