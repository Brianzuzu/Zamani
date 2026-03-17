import React from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { savingsService } from "../config/savingsService";
import { authService } from "../config/authService";
import axios from 'axios';
import { API_URL } from "../config/authService";
import { auth } from "../config/firebase";
import { convertCurrency, formatCurrency } from "../../constants/currency";

// const { width } = Dimensions.get("window");

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
    const [goals, setGoals] = React.useState<any[]>([]);
    const [userProfile, setUserProfile] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            const [goalsData, profileRes] = await Promise.all([
                savingsService.getMyGoals(),
                axios.get(`${API_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setGoals(goalsData);
            setUserProfile(profileRes.data);
        } catch (error) {
            console.error("Error fetching savings data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    const currencySymbol = userProfile?.currencySymbol || "KSh";
    const preferredCurrency = userProfile?.preferredCurrency || "KES";
    const totalSavedNum = goals.reduce((acc, goal) => acc + (goal.currentAmount || 0), 0);
    const totalSavedDisplay = formatCurrency(totalSavedNum, preferredCurrency, currencySymbol);
    
    // Display USD as secondary if not in USD/KES, or KES if in USD
    const altCurrency = preferredCurrency === "KES" ? "USD" : "KES";
    const altSymbol = preferredCurrency === "KES" ? "$" : "KSh";
    const altAmount = convertCurrency(totalSavedNum, preferredCurrency, altCurrency);
    const totalSavedAlt = formatCurrency(altAmount, altCurrency, altSymbol);


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
                    <Text style={styles.wealthLabel}>Total Saved ({preferredCurrency})</Text>
                    <Text style={styles.wealthKES}>{totalSavedDisplay}</Text>
                    <View style={styles.usdBadge}>
                        <Text style={styles.wealthUSD}>≈ {totalSavedAlt}</Text>
                    </View>

                    <View style={styles.wealthFooter}>
                        <View style={styles.wealthStat}>
                            <Text style={styles.statLabel}>Monthly Growth</Text>
                            <Text style={styles.statValue}>+KSh 0</Text>
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

                {goals.length === 0 && (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="sparkles-outline" size={40} color={COLORS.secondary} />
                        </View>
                        <Text style={styles.emptyTitle}>Start Building Wealth</Text>
                        <Text style={styles.emptySubtitle}>You don&apos;t have any active savings goals yet.</Text>

                        <TouchableOpacity
                            style={styles.projectChooseBtn}
                            onPress={() => router.push("/savings/create-goal")}
                        >
                            <Ionicons name="briefcase-outline" size={24} color={COLORS.white} />
                            <Text style={styles.projectChooseBtnText}>Choose a saving goal from existing projects</Text>
                        </TouchableOpacity>

                        <View style={styles.dividerRow}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>
                    </View>
                )}

                {goals.map((goal, index) => (
                    <View key={goal._id || goal.id || index} style={styles.goalCard}>
                        {/* existing goal card content content remains the same */}
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
                                        {goal.type === "Project" && (
                                            <View style={styles.projTag}>
                                                <Text style={styles.projTagText}>PROJECT</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.goalAmount}>
                                        {currencySymbol} {(goal.currentAmount || 0).toLocaleString()} / {currencySymbol} {(goal.targetAmount || 0).toLocaleString()}
                                    </Text>
                                </View>
                                <View style={styles.percentContainer}>
                                    <Text style={styles.goalPercent}>
                                        {Math.round(((goal.currentAmount || 0) / (goal.targetAmount || 1)) * 100)}%
                                    </Text>
                                    {(goal.currentAmount >= goal.targetAmount) && (
                                        <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                                    )}
                                </View>
                            </View>

                            <View style={styles.progressBarBg}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        { 
                                            width: `${Math.min(100, Math.round(((goal.currentAmount || 0) / (goal.targetAmount || 1)) * 100))}%`, 
                                            backgroundColor: goal.color || COLORS.primary 
                                        }
                                    ]}
                                />
                            </View>

                            <View style={styles.goalFooter}>
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity
                                        style={styles.topUpBtn}
                                        onPress={() => router.push({
                                            pathname: "/savings/deposit",
                                            params: { 
                                                id: goal._id || goal.id, 
                                                title: goal.title, 
                                                category: goal.type 
                                            }
                                        } as any)}
                                    >
                                        <Ionicons name="add" size={16} color={COLORS.white} />
                                        <Text style={styles.topUpBtnText}>Top Up</Text>
                                    </TouchableOpacity>

                                    {goal.currentAmount > 0 && (
                                        <TouchableOpacity
                                            style={styles.withdrawBtn}
                                            onPress={() => router.push({
                                                pathname: "/savings/withdraw",
                                                params: { 
                                                    id: goal._id || goal.id, 
                                                    title: goal.title, 
                                                    balance: goal.currentAmount 
                                                }
                                            } as any)}
                                        >
                                            <Ionicons name="arrow-up" size={16} color={COLORS.primary} />
                                            <Text style={styles.withdrawBtnText}>Withdraw</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                                
                                <TouchableOpacity 
                                    style={styles.detailsBtn}
                                    onPress={() => router.push(`/savings/create-goal` as any)}
                                >
                                    <Text style={styles.detailsBtnText}>Details</Text>
                                    <Ionicons name="chevron-forward" size={14} color={COLORS.textLight} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>

                        {/* Business Execution Actions */}
                        {goal.type === "Business" && (goal.currentAmount >= goal.targetAmount) && (
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
                        Increasing your monthly contribution by just {currencySymbol} {convertCurrency(2000, "KES", preferredCurrency).toLocaleString()} can reach your &quot;Land Project&quot; goal 3 months faster.
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
    projTag: {
        backgroundColor: "rgba(10, 31, 68, 0.1)",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    projTagText: {
        fontSize: 9,
        fontWeight: "800",
        color: COLORS.primary,
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
    emptyState: {
        alignItems: "center",
        paddingVertical: 32,
        backgroundColor: COLORS.white,
        borderRadius: 30,
        marginTop: 16,
        paddingHorizontal: 24,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(11, 61, 46, 0.05)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 20,
    },
    projectChooseBtn: {
        width: "100%",
        height: 60,
        backgroundColor: COLORS.secondary,
        borderRadius: 18,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        elevation: 4,
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    projectChooseBtnText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: "700",
        textAlign: "center",
        flex: 1,
    },
    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginVertical: 20,
        gap: 12,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "rgba(0,0,0,0.05)",
    },
    dividerText: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.heritageAccent,
    },
    topUpBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 6,
    },
    topUpBtnText: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: "700",
    },
    actionButtons: {
        flexDirection: "row",
        gap: 8,
    },
    withdrawBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.heritage,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 6,
        borderWidth: 1,
        borderColor: "rgba(10, 31, 68, 0.1)",
    },
    withdrawBtnText: {
        color: COLORS.primary,
        fontSize: 13,
        fontWeight: "700",
    },
    goalFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
    },
    detailsBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    detailsBtnText: {
        fontSize: 13,
        color: COLORS.textLight,
        fontWeight: "600",
    },
});
