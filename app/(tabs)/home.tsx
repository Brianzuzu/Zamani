import React from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Platform,
    ScrollView,
    TouchableOpacity,
    Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const COLORS = {
    primary: "#0A1F44", // Deep Blue
    secondary: "#0B3D2E", // Dark Emerald
    heritage: "#F5EFE7", // Savannah Stone
    heritageAccent: "#D4C2AD", // Heritage Tan
    white: "#FFFFFF",
    text: "#1A1A1A",
    textLight: "#666666",
    success: "#34C759",
    error: "#FF3B30", // System Red
};

export default function HomeScreen() {
    const router = useRouter();

    // Mock Data
    const totalSavings = "KSh 125,400.00";
    const activeProject = {
        name: "Legacy Education Fund",
        progress: 0.65,
        target: "KSh 500,000",
        current: "KSh 325,000"
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Habari, Brian!</Text>
                        <Text style={styles.date}>Friday, February 13</Text>
                    </View>
                    <TouchableOpacity style={styles.notificationBtn}>
                        <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
                        <View style={styles.dot} />
                    </TouchableOpacity>
                </View>

                {/* Total Savings Card */}
                <View style={styles.savingsCard}>
                    <View style={styles.savingsInfo}>
                        <Text style={styles.savingsLabel}>Total Savings</Text>
                        <Text style={styles.savingsAmount}>{totalSavings}</Text>
                        <View style={styles.growthBadge}>
                            <Ionicons name="trending-up" size={14} color={COLORS.success} />
                            <Text style={styles.growthText}>+4.2% this month</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => router.push("/savings/deposit")}
                    >
                        <Ionicons name="add" size={32} color={COLORS.white} />
                    </TouchableOpacity>
                </View>

                {/* Quick Actions */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                </View>
                <View style={styles.actionsGrid}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => router.push("/savings/deposit")}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: "#E8F5E9" }]}>
                            <Ionicons name="wallet-outline" size={24} color={COLORS.secondary} />
                        </View>
                        <Text style={styles.actionText}>Add Savings</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => router.push("/projects")}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: "#E3F2FD" }]}>
                            <Ionicons name="business-outline" size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.actionText}>Start Project</Text>
                    </TouchableOpacity>
                </View>

                {/* Active Project Card */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Featured Project</Text>
                    <TouchableOpacity onPress={() => router.push("/projects")}>
                        <Text style={styles.seeAll}>View All</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.projectCard}
                    onPress={() => router.push("/projects/legacy-fund")} // Mock detail route
                >
                    <View style={styles.projectHeader}>
                        <View style={styles.projectTypeIcon}>
                            <Ionicons name="school-outline" size={20} color={COLORS.primary} />
                        </View>
                        <Text style={styles.projectName}>{activeProject.name}</Text>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>Active</Text>
                        </View>
                    </View>

                    <View style={styles.progressSection}>
                        <View style={styles.progressInfo}>
                            <Text style={styles.progressLabel}>Goal Progress</Text>
                            <Text style={styles.progressPercent}>{Math.round(activeProject.progress * 100)}%</Text>
                        </View>

                        {/* Custom Progress Bar */}
                        <View style={styles.progressBarBg}>
                            <View
                                style={[
                                    styles.progressBarFill,
                                    { width: `${activeProject.progress * 100}%` }
                                ]}
                            />
                        </View>

                        <View style={styles.progressAmounts}>
                            <Text style={styles.currentAmount}>{activeProject.current}</Text>
                            <Text style={styles.targetAmount}>Target: {activeProject.target}</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Market Insights Placeholder */}
                <View style={styles.insightCard}>
                    <Ionicons name="bulb-outline" size={24} color={COLORS.secondary} />
                    <View style={styles.insightTextContent}>
                        <Text style={styles.insightTitle}>Savings Tip</Text>
                        <Text style={styles.insightDescription}>Setting aside an extra 5% today can cut 2 years off your goal.</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.heritage,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 20,
        marginBottom: 32,
    },
    greeting: {
        fontSize: 24,
        fontWeight: "700",
        color: COLORS.primary,
        fontFamily: Platform.OS === "ios" ? "Avenir Next" : "sans-serif-medium",
    },
    date: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 4,
    },
    notificationBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: COLORS.white,
        justifyContent: "center",
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    dot: {
        position: "absolute",
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.error || "#FF3B30",
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    savingsCard: {
        backgroundColor: COLORS.primary,
        marginHorizontal: 24,
        borderRadius: 24,
        padding: 24,
        flexDirection: "row",
        alignItems: "center",
        elevation: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    savingsInfo: {
        flex: 1,
    },
    savingsLabel: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    savingsAmount: {
        color: COLORS.white,
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 12,
    },
    growthBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.1)",
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    growthText: {
        color: COLORS.success,
        fontSize: 12,
        fontWeight: "700",
        marginLeft: 4,
    },
    addBtn: {
        width: 56,
        height: 56,
        borderRadius: 20,
        backgroundColor: COLORS.secondary,
        justifyContent: "center",
        alignItems: "center",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        marginTop: 32,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.primary,
    },
    seeAll: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.secondary,
    },
    actionsGrid: {
        flexDirection: "row",
        paddingHorizontal: 24,
        justifyContent: "space-between",
    },
    actionBtn: {
        backgroundColor: COLORS.white,
        width: (width - 64) / 2,
        padding: 16,
        borderRadius: 20,
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    actionText: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.primary,
    },
    projectCard: {
        backgroundColor: COLORS.white,
        marginHorizontal: 24,
        borderRadius: 24,
        padding: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    projectHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    projectTypeIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.heritage,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    projectName: {
        flex: 1,
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primary,
    },
    statusBadge: {
        backgroundColor: "#E8F5E9",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: COLORS.secondary,
        fontSize: 12,
        fontWeight: "700",
    },
    progressSection: {
        width: "100%",
    },
    progressInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    progressLabel: {
        fontSize: 14,
        color: COLORS.textLight,
        fontWeight: "500",
    },
    progressPercent: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.secondary,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: "#F0F0F0",
        borderRadius: 4,
        marginBottom: 12,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: COLORS.secondary,
        borderRadius: 4,
    },
    progressAmounts: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    currentAmount: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.primary,
    },
    targetAmount: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    insightCard: {
        flexDirection: "row",
        backgroundColor: "rgba(11, 61, 46, 0.05)",
        marginHorizontal: 24,
        marginTop: 24,
        padding: 20,
        borderRadius: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(11, 61, 46, 0.1)",
    },
    insightTextContent: {
        marginLeft: 16,
        flex: 1,
    },
    insightTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.secondary,
        marginBottom: 4,
    },
    insightDescription: {
        fontSize: 13,
        color: COLORS.textLight,
        lineHeight: 18,
    },
});
