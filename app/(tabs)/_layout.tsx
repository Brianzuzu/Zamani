import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

const COLORS = {
    primary: "#0A1F44", // Deep Blue
    secondary: "#0B3D2E", // Dark Emerald
    heritage: "#F5EFE7", // Savannah Stone
    white: "#FFFFFF",
    textLight: "#666666",
};

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textLight,
                tabBarStyle: {
                    backgroundColor: COLORS.white,
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    right: 20,
                    height: 64,
                    borderRadius: 20,
                    borderTopWidth: 0,
                    paddingBottom: 0, // Centered vertically in the floating bar
                    elevation: 10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "700",
                    marginBottom: 10,
                },
                tabBarIconStyle: {
                    marginTop: 10,
                }
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="savings"
                options={{
                    title: "Savings",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "wallet" : "wallet-outline"} size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="projects"
                options={{
                    title: "Projects",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "rocket" : "rocket-outline"} size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="transfers"
                options={{
                    title: "Support",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "send" : "send-outline"} size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
