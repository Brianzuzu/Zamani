import React from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform
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
    warning: "#FF9500",
};

export default function SavingsScreen() {
    const router = useRouter();

    // Mock Data
    const totalSavedKES = "KSh 412,500.00";
    const totalSavedUSD = "$3,185.32";

    const goals = [
        {
            id: "biz_poultry_1",
            title: "Poultry Farming (Kiambu)",
            current: "KSh 400,000",
            target: "KSh 400,000",
            progress: 1.0,
            icon: "egg",
            color: COLORS.secondary,
            type: "Business",
            status: "Funded"
        },
        {
            id: "1",
            title: "Legacy Education Fund",
            current: "KSh 325,000",
            target: "KSh 500,000",
            progress: 0.65,
            icon: "school",
            color: COLORS.primary,
            type: "Personal"
        },
        {
            id: "2",
            title: "Nairobi Land Project",
            current: "KSh 87,500",
            target: "KSh 1,200,000",
            progress: 0.07,
            icon: "business",
            color: COLORS.secondary,
            type: "Personal"
        },
        {
            id: "3",
            title: "Emergency Reserves",
            current: "KSh 0",
            target: "KSh 150,000",
            progress: 0.0,
            icon: "shield-checkmark",
            color: COLORS.warning,
            type: "Personal"
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Savings</Text>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => router.push("/savings/create-goal")}
                >
                    <Ionicons name="add" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Total Saved Overview */}
                <View style={styles.wealthCard}>
                    <Text style={styles.wealthLabel}>Total Saved</Text>
                    <Text style={styles.wealthKES}>{totalSavedKES}</Text>
                    <View style={styles.usdBadge}>
                        <Text style={styles.wealthUSD}>≈ {totalSavedUSD}</Text>
                    </View>

                    <View style={styles.wealthFooter}>
                        <View style={styles.wealthStat}>
                            <Text style={styles.statLabel}>Monthly Growth</Text>
                            <Text style={styles.statValue}>+KSh 12,400</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.wealthStat}>
                            <Text style={styles.statLabel}>Active Goals</Text>
                            <Text style={styles.statValue}>{goals.length}</Text>
                        </View>
                    </View>
                </View>

                {/* Savings Goals Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Savings Goals</Text>
                </View>

                {goals.map((goal) => (
                    <View key={goal.id} style={styles.goalCard}>
                        <TouchableOpacity
                            onPress={() => router.push(`/savings/create-goal` as any)}
                        >
                            <View style={styles.goalHeader}>
                                <View style={[styles.goalIconContainer, { backgroundColor: goal.color + "15" }]}>
                                    <View style={styles.iconWrapper}>
                                        <Ionicons name={goal.icon as any} size={20} color={goal.color} />
                                        {goal.type === "Business" && (
                                            <View style={styles.bizBadgeSmall}>
                                                <Ionicons name="briefcase" size={10} color={COLORS.white} />
                                            </View>
                                        )}
                                    </View>
                                </View>
                                <View style={styles.goalInfo}>
                                    <View style={styles.titleRow}>
                                        <Text style={styles.goalTitle}>{goal.title}</Text>
                                        {goal.type === "Business" && (
                                            <View style={styles.bizTag}>
                                                <Text style={styles.bizTagText}>BUSINESS</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.goalAmount}>{goal.current} / {goal.target}</Text>
                                </View>
                                <View style={styles.percentContainer}>
                                    <Text style={styles.goalPercent}>{Math.round(goal.progress * 100)}%</Text>
                                    {goal.progress >= 1 && (
                                        <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                                    )}
                                </View>
                            </View>

                            <View style={styles.progressBarBg}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        { width: `${goal.progress * 100}%`, backgroundColor: goal.color }
                                    ]}
                                />
                            </View>
                        </TouchableOpacity>

                        {/* Business Execution Actions */}
                        {goal.type === "Business" && goal.progress >= 1 && (
                            <View style={styles.executionActions}>
                                <TouchableOpacity
                                    style={styles.executeBtn}
                                    onPress={() => router.push("/savings/execution" as any)}
                                >
                                    <Ionicons name="rocket" size={18} color={COLORS.white} />
                                    <Text style={styles.executeBtnText}>Execute Business</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.loanBtn}
                                    onPress={() => router.push("/loans" as any)}
                                >
                                    <Ionicons name="cash" size={18} color={COLORS.primary} />
                                    <Text style={styles.loanBtnText}>Request Funding</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ))}

                {/* Create Goal Button */}
                <TouchableOpacity
                    style={styles.createGoalBtn}
                    onPress={() => router.push("/savings/create-goal")}
                >
                    <Ionicons name="add-circle-outline" size={24} color={COLORS.secondary} />
                    <Text style={styles.createGoalBtnText}>Create New Goal</Text>
                </TouchableOpacity>

                {/* Growth Insights */}
                <View style={[styles.card, styles.insightCard]}>
                    <View style={styles.insightHeader}>
                        <Ionicons name="trending-up" size={24} color={COLORS.secondary} />
                        <Text style={styles.insightTitle}>Savings Tip</Text>
                    </View>
                    <Text style={styles.insightText}>
                        Increasing your monthly contribution by just KSh 2,000 can reach your "Land Project" goal 3 months faster.
                    </Text>
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
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: COLORS.primary,
    },
    addBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: COLORS.secondary,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    wealthCard: {
        backgroundColor: COLORS.primary,
        borderRadius: 30,
        padding: 28,
        marginTop: 8,
        elevation: 10,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    wealthLabel: {
        color: "rgba(255,255,255,0.6)",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    wealthKES: {
        color: COLORS.white,
        fontSize: 32,
        fontWeight: "800",
        marginBottom: 6,
    },
    usdBadge: {
        backgroundColor: "rgba(255,255,255,0.1)",
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 24,
    },
    wealthUSD: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 14,
        fontWeight: "600",
    },
    wealthFooter: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.1)",
        paddingTop: 20,
    },
    wealthStat: {
        flex: 1,
    },
    statLabel: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 11,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    statValue: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "700",
    },
    statDivider: {
        width: 1,
        height: "100%",
        backgroundColor: "rgba(255,255,255,0.1)",
        marginHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 32,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.primary,
    },
    seeAll: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.secondary,
    },
    goalCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    goalHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    goalIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    goalInfo: {
        flex: 1,
    },
    goalTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primary,
    },
    goalAmount: {
        fontSize: 13,
        color: COLORS.textLight,
        marginTop: 2,
    },
    goalPercent: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primary,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: "#F0F0F0",
        borderRadius: 3,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        borderRadius: 3,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 24,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    insightCard: {
        marginTop: 16,
        backgroundColor: "rgba(11, 61, 46, 0.02)",
        borderWidth: 1,
        borderColor: "rgba(11, 61, 46, 0.05)",
    },
    insightHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.secondary,
        marginLeft: 10,
    },
    insightText: {
        fontSize: 14,
        color: COLORS.textLight,
        lineHeight: 22,
        marginBottom: 16,
    },
    insightBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    insightBtnText: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.secondary,
    },
    createGoalBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(11, 61, 46, 0.05)",
        paddingVertical: 16,
        borderRadius: 20,
        marginVertical: 10,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: COLORS.secondary,
        gap: 10,
    },
    createGoalBtnText: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.secondary,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    bizTag: {
        backgroundColor: "rgba(11, 61, 46, 0.1)",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    bizTagText: {
        fontSize: 9,
        fontWeight: "800",
        color: COLORS.secondary,
        letterSpacing: 0.5,
    },
    percentContainer: {
        alignItems: "flex-end",
        gap: 4,
    },
    iconWrapper: {
        position: "relative",
    },
    bizBadgeSmall: {
        position: "absolute",
        top: -6,
        right: -6,
        backgroundColor: COLORS.secondary,
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: COLORS.white,
    },
    executionActions: {
        flexDirection: "row",
        gap: 12,
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
    },
    executeBtn: {
        flex: 1.5,
        backgroundColor: COLORS.secondary,
        height: 48,
        borderRadius: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        elevation: 2,
    },
    executeBtnText: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: "700",
    },
    loanBtn: {
        flex: 1,
        backgroundColor: COLORS.heritage,
        height: 48,
        borderRadius: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        borderWidth: 1,
        borderColor: "rgba(10, 31, 68, 0.1)",
    },
    loanBtnText: {
        color: COLORS.primary,
        fontSize: 13,
        fontWeight: "700",
    },
});
