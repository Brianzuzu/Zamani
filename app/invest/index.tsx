import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { marketData } from "../_data/market";
import { userPortfolio } from "../_data/portfolio";

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
    danger: "#FF3B30",
};

export default function InvestDashboard() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Zamani Invest</Text>
                    <Text style={styles.headerSubtitle}>NSE Trading Floor</Text>
                </View>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Portfolio Summary Card */}
                <View style={styles.portfolioCard}>
                    <View style={styles.portfolioHeader}>
                        <Text style={styles.portfolioLabel}>Total Portfolio Value</Text>
                        <TouchableOpacity onPress={() => router.push("/invest/portfolio")}>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.portfolioValue}>KES {userPortfolio.currentValue.toLocaleString()}</Text>

                    <View style={styles.portfolioFooter}>
                        <View style={styles.gainContainer}>
                            <Ionicons name="trending-up" size={16} color={COLORS.success} />
                            <Text style={styles.gainText}>
                                +{userPortfolio.totalGain.toLocaleString()} ({((userPortfolio.totalGain / userPortfolio.totalInvested) * 100).toFixed(2)}%)
                            </Text>
                        </View>
                        <Text style={styles.timeText}>Today&apos;s Return</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.actionGrid}>
                    <TouchableOpacity style={styles.actionItem}>
                        <View style={[styles.actionIcon, { backgroundColor: "#E3F2FD" }]}>
                            <Ionicons name="add" size={24} color="#1565C0" />
                        </View>
                        <Text style={styles.actionText}>Deposit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionItem}>
                        <View style={[styles.actionIcon, { backgroundColor: "#E8F5E9" }]}>
                            <Ionicons name="download-outline" size={24} color="#2E7D32" />
                        </View>
                        <Text style={styles.actionText}>Withdraw</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionItem}>
                        <View style={[styles.actionIcon, { backgroundColor: "#FFF3E0" }]}>
                            <Ionicons name="newspaper-outline" size={24} color="#EF6C00" />
                        </View>
                        <Text style={styles.actionText}>News</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionItem}>
                        <View style={[styles.actionIcon, { backgroundColor: "#F3E5F5" }]}>
                            <Ionicons name="stats-chart-outline" size={24} color="#7B1FA2" />
                        </View>
                        <Text style={styles.actionText}>Analysis</Text>
                    </TouchableOpacity>
                </View>

                {/* Market Overview */}
                <Text style={styles.sectionTitle}>Market Overview</Text>

                {marketData.map((stock) => (
                    <TouchableOpacity
                        key={stock.symbol}
                        style={styles.stockCard}
                        onPress={() => router.push(`/invest/stock/${stock.symbol}` as any)}
                    >
                        <View style={styles.stockInfo}>
                            <View style={styles.stockIcon}>
                                <Text style={styles.stockIconText}>{stock.symbol[0]}</Text>
                            </View>
                            <View>
                                <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                                <Text style={styles.stockName}>{stock.name}</Text>
                            </View>
                        </View>

                        <View style={styles.stockPrice}>
                            <Text style={styles.priceText}>{stock.price.toFixed(2)}</Text>
                            <Text style={[
                                styles.changeText,
                                { color: stock.change >= 0 ? COLORS.success : COLORS.danger }
                            ]}>
                                {stock.change >= 0 ? "+" : ""}{stock.changePercent}%
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}

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
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.white,
        justifyContent: "center",
        alignItems: "center",
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.white,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.primary,
        textAlign: "center",
    },
    headerSubtitle: {
        fontSize: 12,
        color: COLORS.secondary,
        textAlign: "center",
        fontWeight: "600",
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    portfolioCard: {
        backgroundColor: COLORS.primary,
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    portfolioHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    portfolioLabel: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 14,
    },
    viewAllText: {
        color: COLORS.heritageAccent,
        fontSize: 12,
        fontWeight: "700",
    },
    portfolioValue: {
        color: COLORS.white,
        fontSize: 32,
        fontWeight: "800",
        marginBottom: 16,
    },
    portfolioFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.1)",
        padding: 12,
        borderRadius: 16,
    },
    gainContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    gainText: {
        color: COLORS.success,
        fontWeight: "700",
        fontSize: 14,
    },
    timeText: {
        color: "rgba(255,255,255,0.6)",
        fontSize: 12,
    },
    actionGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    actionItem: {
        alignItems: "center",
        gap: 8,
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    actionText: {
        fontSize: 12,
        color: COLORS.text,
        fontWeight: "600",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.primary,
        marginBottom: 16,
    },
    stockCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    stockInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    stockIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.heritage,
        justifyContent: "center",
        alignItems: "center",
    },
    stockIconText: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.secondary,
    },
    stockSymbol: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.primary,
    },
    stockName: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    stockPrice: {
        alignItems: "flex-end",
    },
    priceText: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primary,
    },
    changeText: {
        fontSize: 12,
        fontWeight: "600",
    },
});
