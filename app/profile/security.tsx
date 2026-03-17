import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const COLORS = {
    primary: "#0A1F44",
    secondary: "#0B3D2E",
    heritage: "#F5EFE7",
    heritageAccent: "#D4C2AD",
    white: "#FFFFFF",
    textLight: "#666666",
    success: "#34C759",
};

export default function SecurityScreen() {
    const router = useRouter();
    const [biometrics, setBiometrics] = useState(true);
    const [twoFactor, setTwoFactor] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account Security</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Login Settings</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconCircle}>
                            <Ionicons name="lock-closed-outline" size={22} color={COLORS.primary} />
                        </View>
                        <View style={styles.menuTextContainer}>
                            <Text style={styles.menuItemTitle}>Change Password</Text>
                            <Text style={styles.menuItemSubtitle}>Update your account password</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.heritageAccent} />
                    </TouchableOpacity>

                    <View style={styles.menuItem}>
                        <View style={styles.menuIconCircle}>
                            <Ionicons name="finger-print-outline" size={22} color={COLORS.primary} />
                        </View>
                        <View style={styles.menuTextContainer}>
                            <Text style={styles.menuItemTitle}>Face ID / Biometrics</Text>
                            <Text style={styles.menuItemSubtitle}>Quick access with biometrics</Text>
                        </View>
                        <Switch
                            value={biometrics}
                            onValueChange={setBiometrics}
                            trackColor={{ false: "#D1D1D1", true: COLORS.secondary }}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Verification</Text>
                    <View style={styles.menuItem}>
                        <View style={styles.menuIconCircle}>
                            <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.primary} />
                        </View>
                        <View style={styles.menuTextContainer}>
                            <Text style={styles.menuItemTitle}>Two-Factor Authentication</Text>
                            <Text style={styles.menuItemSubtitle}>Adds an extra layer of security</Text>
                        </View>
                        <Switch
                            value={twoFactor}
                            onValueChange={setTwoFactor}
                            trackColor={{ false: "#D1D1D1", true: COLORS.secondary }}
                        />
                    </View>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconCircle}>
                            <Ionicons name="phone-portrait-outline" size={22} color={COLORS.primary} />
                        </View>
                        <View style={styles.menuTextContainer}>
                            <Text style={styles.menuItemTitle}>Trusted Devices</Text>
                            <Text style={styles.menuItemSubtitle}>Manage devices that can access your account</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.heritageAccent} />
                    </TouchableOpacity>
                </View>

                <View style={styles.infobox}>
                    <Ionicons name="information-circle-outline" size={20} color={COLORS.secondary} />
                    <Text style={styles.infoText}>
                        We recommend enabling Two-Factor Authentication to keep your investments safe.
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
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    headerTitle: { fontSize: 24, fontWeight: "800", color: COLORS.primary },
    scrollContent: { paddingHorizontal: 24, paddingVertical: 16 },
    section: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 16,
        marginBottom: 24,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
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
