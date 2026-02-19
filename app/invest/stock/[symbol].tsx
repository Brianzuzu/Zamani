import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    TextInput,
    Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { marketData } from "../../data/market";
import { userPortfolio } from "../../data/portfolio";
import { placeOrder } from "../../data/trade";

const { width } = Dimensions.get("window");

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

export default function StockDetailsScreen() {
    const router = useRouter();
    const { symbol } = useLocalSearchParams();

    // Find Mock Data
    const stock = marketData.find(s => s.symbol === symbol) || marketData[0];
    const holding = userPortfolio.holdings.find(h => h.symbol === symbol);

    const [shares, setShares] = useState("");
    const [activeTab, setActiveTab] = useState("Buy");

    const estimatedCost = (Number(shares) || 0) * stock.price;

    const handleTrade = () => {
        if (!shares || isNaN(Number(shares))) return;

        const order = placeOrder(
            stock.symbol,
            Number(shares),
            stock.price,
            activeTab === "Buy" ? "BUY" : "SELL"
        );

        Alert.alert(
            "Order Executed",
            `Successfully ${activeTab === "Buy" ? "bought" : "sold"} ${shares} shares of ${stock.symbol} at KES ${stock.price}. Order ID: ${order.orderId}`,
            [{ text: "OK", onPress: () => router.push("/invest/portfolio") }]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{stock.symbol}</Text>
                <TouchableOpacity style={styles.backBtn}>
                    <Ionicons name="star-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Price Header */}
                <View style={{ alignItems: "center", marginBottom: 24 }}>
                    <Text style={styles.stockName}>{stock.name}</Text>
                    <Text style={styles.price}>KES {stock.price.toFixed(2)}</Text>
                    <Text style={[styles.change, { color: stock.change >= 0 ? COLORS.success : COLORS.danger }]}>
                        {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePercent}%) Today
                    </Text>
                </View>

                {/* Mock Chart Area */}
                <View style={styles.chartContainer}>
                    <View style={styles.chartLine} />
                    <Text style={{ position: 'absolute', color: COLORS.textLight }}>Mock Chart Visual</Text>
                </View>

                {/* Market Stats */}
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Volume</Text>
                        <Text style={styles.statValue}>{(stock.volume / 1000000).toFixed(1)}M</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Div Yield</Text>
                        <Text style={styles.statValue}>{(stock.dividendYield * 100).toFixed(2)}%</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>P/E Ratio</Text>
                        <Text style={styles.statValue}>8.4</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Mkt Cap</Text>
                        <Text style={styles.statValue}>240B</Text>
                    </View>
                </View>

                {/* Your Position */}
                {holding && (
                    <View style={styles.positionCard}>
                        <Text style={styles.sectionTitle}>Your Position</Text>
                        <View style={styles.positionRow}>
                            <Text style={styles.posLabel}>Shares Owned</Text>
                            <Text style={styles.posValue}>{holding.shares}</Text>
                        </View>
                        <View style={styles.positionRow}>
                            <Text style={styles.posLabel}>Avg Cost</Text>
                            <Text style={styles.posValue}>KES {holding.avgBuyPrice}</Text>
                        </View>
                        <View style={styles.positionRow}>
                            <Text style={styles.posLabel}>Total Value</Text>
                            <Text style={styles.posValue}>KES {(holding.shares * stock.price).toLocaleString()}</Text>
                        </View>
                    </View>
                )}

                {/* Trade Panel */}
                <View style={styles.tradePanel}>
                    <View style={styles.tabs}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === "Buy" && styles.activeTab]}
                            onPress={() => setActiveTab("Buy")}
                        >
                            <Text style={[styles.tabText, activeTab === "Buy" && styles.activeTabText]}>Buy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === "Sell" && styles.activeTab]}
                            onPress={() => setActiveTab("Sell")}
                        >
                            <Text style={[styles.tabText, activeTab === "Sell" && styles.activeTabText]}>Sell</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.inputLabel}>Number of Shares</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0"
                        keyboardType="numeric"
                        value={shares}
                        onChangeText={setShares}
                    />

                    <View style={styles.costRow}>
                        <Text style={styles.costLabel}>Estimated Cost</Text>
                        <Text style={styles.costValue}>KES {estimatedCost.toLocaleString()}</Text>
                    </View>

                    <TouchableOpacity style={styles.tradeBtn} onPress={handleTrade}>
                        <Text style={styles.tradeBtnText}>{activeTab} {stock.symbol}</Text>
                    </TouchableOpacity>
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
        fontWeight: "800",
        color: COLORS.primary,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    stockName: {
        fontSize: 14,
        color: COLORS.textLight,
        fontWeight: "600",
        marginBottom: 8,
    },
    price: {
        fontSize: 36,
        fontWeight: "800",
        color: COLORS.primary,
    },
    change: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 4,
    },
    chartContainer: {
        height: 200,
        backgroundColor: COLORS.white,
        marginHorizontal: 20,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    chartLine: {
        width: "80%",
        height: 2,
        backgroundColor: COLORS.secondary,
        opacity: 0.2,
    },
    statsGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    statItem: {
        alignItems: "center",
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.primary,
    },
    positionCard: {
        backgroundColor: COLORS.white,
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 12,
    },
    positionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    posLabel: {
        color: COLORS.textLight,
        fontSize: 14,
    },
    posValue: {
        color: COLORS.primary,
        fontWeight: "600",
        fontSize: 14,
    },
    tradePanel: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    tabs: {
        flexDirection: "row",
        backgroundColor: COLORS.heritage,
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
    },
    tab: {
        flex: 1,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: COLORS.white,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textLight,
    },
    activeTabText: {
        color: COLORS.primary,
        fontWeight: "700",
    },
    inputLabel: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.heritage,
        height: 56,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 16,
    },
    costRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    costLabel: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    costValue: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.primary,
    },
    tradeBtn: {
        backgroundColor: COLORS.secondary,
        height: 56,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    tradeBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "700",
    },
});
