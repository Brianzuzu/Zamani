import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { userPortfolio } from "../_data/portfolio";
import { transactionHistory } from "../_data/trade";

const COLORS = {
    primary: "#0A1F44", // Deep Blue
    secondary: "#0B3D2E", // Dark Emerald
    heritage: "#F5EFE7", // Savannah Stone
    white: "#FFFFFF",
    text: "#1A1A1A",
    textLight: "#666666",
    success: "#34C759",
    danger: "#FF3B30",
};

export default function PortfolioScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Portfolio</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.label}>Current Value</Text>
                            <Text style={styles.value}>KES {userPortfolio.currentValue.toLocaleString()}</Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <Text style={styles.label}>Total Gain</Text>
                            <Text style={[styles.gainValue, { color: COLORS.success }]}>
                                +{userPortfolio.totalGain.toLocaleString()}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.label}>Invested</Text>
                            <Text style={styles.subValue}>KES {userPortfolio.totalInvested.toLocaleString()}</Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <Text style={styles.label}>Return</Text>
                            <Text style={[styles.subValue, { color: COLORS.success }]}>
                                +{((userPortfolio.totalGain / userPortfolio.totalInvested) * 100).toFixed(2)}%
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Holdings Section */}
                <Text style={styles.sectionTitle}>Your Holdings</Text>
                {userPortfolio.holdings.map((holding) => (
                    <TouchableOpacity
                        key={holding.symbol}
                        style={styles.holdingItem}
                        onPress={() => router.push(`/invest/stock/${holding.symbol}` as any)}
                    >
                        <View>
                            <Text style={styles.holdingSymbol}>{holding.symbol}</Text>
                            <Text style={styles.holdingShares}>{holding.shares} shares</Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <Text style={styles.holdingValue}>
                                KES {(holding.shares * holding.currentPrice).toLocaleString()}
                            </Text>
                            <Text style={[styles.holdingGain, { color: COLORS.success }]}>
                                +{holding.gain?.toLocaleString()} ({holding.gainPercent}%)
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Transaction History Preview */}
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                {transactionHistory.map((tx) => (
                    <View key={tx.id} style={styles.txItem}>
                        <View style={styles.txIcon}>
                            <Ionicons
                                name={tx.type === "BUY" ? "arrow-down" : (tx.type === "SELL" ? "arrow-up" : "gift")}
                                size={16}
                                color={COLORS.white}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.txSymbol}>{tx.symbol} - {tx.type}</Text>
                            <Text style={styles.txDate}>{tx.date}</Text>
                        </View>
                        <Text style={styles.txAmount}>
                            {tx.type === "BUY" ? "-" : "+"}KES {tx.amount?.toLocaleString()}
                        </Text>
                    </View>
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
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: COLORS.white,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.primary,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    summaryCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        elevation: 2,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    label: {
        color: COLORS.textLight,
        fontSize: 12,
        marginBottom: 4,
    },
    value: {
        color: COLORS.primary,
        fontSize: 24,
        fontWeight: "700",
    },
    gainValue: {
        fontSize: 24,
        fontWeight: "700",
    },
    subValue: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: "600",
    },
    divider: {
        height: 1,
        backgroundColor: "#F0F0F0",
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 16,
        marginTop: 8,
    },
    holdingItem: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    holdingSymbol: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 4,
    },
    holdingShares: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    holdingValue: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 4,
    },
    holdingGain: {
        fontSize: 12,
        fontWeight: "600",
    },
    txItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    txIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.secondary,
        justifyContent: "center",
        alignItems: "center",
    },
    txSymbol: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.primary,
    },
    txDate: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    txAmount: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.primary,
    },
});
