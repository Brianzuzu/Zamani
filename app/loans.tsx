import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    TextInput
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

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

export default function LoansScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [loanAmount, setLoanAmount] = useState("");

    const loanProducts = [
        {
            id: "biz_loan",
            title: "Business Growth Loan",
            rate: "12% p.a.",
            term: "12 - 36 Months",
            maxAmount: "KSh 5,000,000",
            icon: "briefcase",
            context: "Best for scaling your venture"
        },
        {
            id: "asset_finance",
            title: "Asset Finance",
            rate: "13.5% p.a.",
            term: "Up to 48 Months",
            maxAmount: "Up to 80% Asset Value",
            icon: "car-sport",
            context: "For vehicles & machinery"
        },
        {
            id: "personal_loan",
            title: "Personal Development",
            rate: "14% p.a.",
            term: "6 - 24 Months",
            maxAmount: "KSh 1,000,000",
            icon: "person",
            context: "For school fees, medical, etc."
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Request Funding</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Business Context Header if coming from execution */}
                {params.from === "execution" && (
                    <View style={styles.contextCard}>
                        <View style={styles.contextHeader}>
                            <Ionicons name="rocket" size={20} color={COLORS.white} />
                            <Text style={styles.contextTitle}>Funding for Poultry Farming</Text>
                        </View>
                        <Text style={styles.contextDesc}>
                            You have raised KSh 400,000. Access additional capital to accelerate your launch.
                        </Text>
                    </View>
                )}

                <Text style={styles.sectionTitle}>Select Loan Product</Text>

                {loanProducts.map((product) => (
                    <TouchableOpacity key={product.id} style={styles.productCard}>
                        <View style={[styles.iconContainer, { backgroundColor: COLORS.heritage }]}>
                            <Ionicons name={product.icon as any} size={24} color={COLORS.primary} />
                        </View>
                        <View style={styles.productInfo}>
                            <Text style={styles.productTitle}>{product.title}</Text>
                            <Text style={styles.productContext}>{product.context}</Text>

                            <View style={styles.productMeta}>
                                <View style={styles.metaItem}>
                                    <Ionicons name="trending-up" size={12} color={COLORS.secondary} />
                                    <Text style={styles.metaText}>{product.rate}</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <Ionicons name="calendar-outline" size={12} color={COLORS.textLight} />
                                    <Text style={styles.metaText}>{product.term}</Text>
                                </View>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={COLORS.heritageAccent} />
                    </TouchableOpacity>
                ))}

                <View style={styles.calculatorSection}>
                    <Text style={styles.sectionTitle}>Loan Calculator</Text>
                    <View style={styles.calcCard}>
                        <Text style={styles.inputLabel}>How much do you need?</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.currencyPrefix}>KSh</Text>
                            <TextInput
                                style={styles.amountInput}
                                placeholder="0"
                                keyboardType="numeric"
                                value={loanAmount}
                                onChangeText={setLoanAmount}
                            />
                        </View>

                        <View style={styles.calcResult}>
                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>Est. Monthly Repayment</Text>
                                <Text style={styles.resultValue}>KSh 0.00</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.applyBtn}>
                            <Text style={styles.applyBtnText}>Check Eligibility</Text>
                        </TouchableOpacity>
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
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.primary,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 16,
        marginTop: 24,
    },
    contextCard: {
        backgroundColor: COLORS.secondary,
        borderRadius: 20,
        padding: 20,
        marginBottom: 8,
    },
    contextHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        gap: 8,
    },
    contextTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.white,
    },
    contextDesc: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 14,
        lineHeight: 20,
    },
    productCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        elevation: 2,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    productInfo: {
        flex: 1,
    },
    productTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 4,
    },
    productContext: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 8,
    },
    productMeta: {
        flexDirection: "row",
        gap: 12,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    metaText: {
        fontSize: 11,
        color: COLORS.text,
        fontWeight: "600",
    },
    calculatorSection: {
        marginTop: 8,
    },
    calcCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 24,
    },
    inputLabel: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
        paddingBottom: 8,
        marginBottom: 24,
    },
    currencyPrefix: {
        fontSize: 24,
        fontWeight: "600",
        color: COLORS.primary,
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        fontSize: 24,
        fontWeight: "700",
        color: COLORS.primary,
    },
    calcResult: {
        backgroundColor: COLORS.heritage,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    resultRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    resultLabel: {
        fontSize: 13,
        color: COLORS.textLight,
    },
    resultValue: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.secondary,
    },
    applyBtn: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    applyBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "700",
    },
});
