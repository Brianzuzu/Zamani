import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

const COLORS = {
    primary: "#0A1F44",
    secondary: "#0B3D2E",
    heritage: "#F5EFE7",
    white: "#FFFFFF",
    textLight: "#666666",
};

export default function NotificationsScreen() {
    const router = useRouter();
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [investmentAlerts, setInvestmentAlerts] = useState(true);
    const [marketingAlerts, setMarketingAlerts] = useState(false);

    const NotificationItem = ({ title, subtitle, icon, value, onValueChange }: any) => (
        <View style={styles.menuItem}>
            <View style={styles.menuIconCircle}>
                <Ionicons name={icon} size={22} color={COLORS.primary} />
            </View>
            <View style={styles.menuTextContainer}>
                <Text style={styles.menuItemTitle}>{title}</Text>
                <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: "#D1D1D1", true: COLORS.secondary }}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>General Channels</Text>
                    <NotificationItem
                        title="Push Notifications"
                        subtitle="Receive alerts on your device"
                        icon="notifications-outline"
                        value={pushEnabled}
                        onValueChange={setPushEnabled}
                    />
                    <NotificationItem
                        title="Email Notifications"
                        subtitle="Summary reports and updates"
                        icon="mail-outline"
                        value={emailEnabled}
                        onValueChange={setEmailEnabled}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Alert Categories</Text>
                    <NotificationItem
                        title="Investment Alerts"
                        subtitle="New projects and updates"
                        icon="rocket-outline"
                        value={investmentAlerts}
                        onValueChange={setInvestmentAlerts}
                    />
                    <NotificationItem
                        title="Marketing & Promos"
                        subtitle="Exclusive deals and offers"
                        icon="gift-outline"
                        value={marketingAlerts}
                        onValueChange={setMarketingAlerts}
                    />
                </View>

                <View style={styles.infobox}>
                    <Ionicons name="notifications-circle-outline" size={24} color={COLORS.secondary} />
                    <Text style={styles.infoText}>
                        We only send important updates that help you stay on top of your investment journey.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.heritage },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: COLORS.white,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    headerTitle: { fontSize: 24, fontWeight: "800", color: COLORS.primary },
    scrollContent: { paddingHorizontal: 24, paddingVertical: 16 },
    section: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.textLight,
        marginBottom: 16,
        marginLeft: 4,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
    },
    menuIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: COLORS.heritage,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    menuTextContainer: { flex: 1 },
    menuItemTitle: { fontSize: 16, fontWeight: "700", color: COLORS.primary },
    menuItemSubtitle: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
    infobox: {
        flexDirection: "row",
        backgroundColor: "rgba(11, 61, 46, 0.05)",
        padding: 20,
        borderRadius: 24,
        alignItems: "center",
        gap: 15,
    },
    infoText: { flex: 1, fontSize: 13, color: COLORS.textLight, lineHeight: 18 },
});
