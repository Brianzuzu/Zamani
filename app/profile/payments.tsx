import React from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    TouchableOpacity,
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

export default function PaymentsScreen() {
    const router = useRouter();

    const accounts = [
        { id: "1", type: "M-Pesa", detail: "+254 712 *** 789", isDefault: true },
        { id: "2", type: "KCB Bank", detail: "**** **** 4567", isDefault: false },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment Methods</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>Your Accounts</Text>

                {accounts.map((acc) => (
                    <View key={acc.id} style={styles.accountCard}>
                        <View style={styles.accountInfo}>
                            <View style={styles.iconCircle}>
                                <Ionicons
                                    name={acc.type === "M-Pesa" ? "phone-portrait" : "business"}
                                    size={24}
                                    color={COLORS.primary}
                                />
                            </View>
                            <View>
                                <Text style={styles.accountType}>{acc.type}</Text>
                                <Text style={styles.accountDetail}>{acc.detail}</Text>
                            </View>
                        </View>
                        {acc.isDefault && (
                            <View style={styles.defaultBadge}>
                                <Text style={styles.defaultText}>Default</Text>
                            </View>
                        )}
                        <TouchableOpacity>
                            <Ionicons name="ellipsis-vertical" size={20} color={COLORS.heritageAccent} />
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity style={styles.addBtn}>
                    <Ionicons name="add-circle-outline" size={24} color={COLORS.secondary} />
                    <Text style={styles.addBtnText}>Add New Payment Method</Text>
                </TouchableOpacity>

                <View style={styles.infobox}>
                    <Ionicons name="shield-checkmark" size={20} color={COLORS.secondary} />
                    <Text style={styles.infoText}>
                        Your payment details are encrypted and stored securely.
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
    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.textLight,
        marginBottom: 16,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    accountCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        elevation: 2,
    },
    accountInfo: { flexDirection: "row", alignItems: "center", gap: 16 },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: COLORS.heritage,
        justifyContent: "center",
        alignItems: "center",
    },
    accountType: { fontSize: 16, fontWeight: "700", color: COLORS.primary },
    accountDetail: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
    defaultBadge: {
        backgroundColor: "rgba(52, 199, 89, 0.1)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    defaultText: { fontSize: 10, fontWeight: "800", color: COLORS.success, textTransform: "uppercase" },
    addBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: COLORS.secondary,
        borderStyle: "dashed",
        gap: 12,
        marginTop: 8,
        marginBottom: 32,
    },
    addBtnText: { fontSize: 16, fontWeight: "700", color: COLORS.secondary },
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
