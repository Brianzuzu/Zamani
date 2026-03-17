import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    Modal,
    Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { paymentService } from "../config/paymentService";
import { auth } from "../config/firebase";
import { Alert } from "react-native";
import axios from "axios";
import { API_URL } from "../config/authService";
import { convertCurrency } from "../../constants/currency";

const { width, height } = Dimensions.get("window");

const COLORS = {
    primary: "#0A1F44", // Deep Blue
    secondary: "#0B3D2E", // Dark Emerald
    heritage: "#F5EFE7", // Savannah Stone
    heritageAccent: "#D4C2AD", // Heritage Tan
    white: "#FFFFFF",
    text: "#1A1A1A",
    textLight: "#666666",
    border: "#E0E0E0",
};

const EXCHANGE_RATE = 129.50; // Mock Rate: 1 USD = 129.50 KES

export default function DepositScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Context Detection
    const isBusiness = params.category === "Business";
    const revenueProjection = params.revenueProjection ? JSON.parse(params.revenueProjection as string) : null;

    const [amount, setAmount] = useState("");
    const [homeAmount, setHomeAmount] = useState("");
    const [frequency, setFrequency] = useState("Monthly");
    const [duration, setDuration] = useState(12);
    const [lockPeriod, setLockPeriod] = useState("Flexible (No Lock)");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [exchangeRate, setExchangeRate] = useState(129.50);

    const lockOptions = ["Flexible (No Lock)", "3 Months", "6 Months", "12 Months", "24 Months"];

    const paymentMethods = [
        {
            category: "Mobile Money (Kenya)",
            options: [
                { id: "mpesa", name: "M-Pesa", icon: "phone-portrait", color: "#34C759" },
            ]
        },
        {
            category: "Global Cards & Wallets",
            options: [
                { id: "paypal", name: "PayPal", icon: "logo-paypal", color: "#003087" },
                { id: "card", name: "Credit / Debit Card", icon: "card", color: COLORS.primary },
                { id: "apple_google", name: "Apple / Google Pay", icon: "logo-apple", color: "#000000" },
            ]
        },
        {
            category: "Bank Transfer",
            options: [
                { id: "bank", name: "Bank Account (USA/KES)", icon: "business", color: COLORS.heritageAccent },
            ]
        }
    ];

    const incrementDuration = () => setDuration(prev => prev + 1);
    const decrementDuration = () => setDuration(prev => Math.max(1, prev - 1));

    // Fetch user profile and set dynamic exchange rate
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                if (token) {
                    const res = await axios.get(`${API_URL}/users/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUserProfile(res.data);
                    
                    // Set exchange rate based on preferred currency
                    const currency = res.data.preferredCurrency || "USD";
                    const rate = convertCurrency(1, currency, "KES");
                    setExchangeRate(rate);
                }
            } catch (error) {
                console.error("Error fetching profile in deposit:", error);
            }
        };
        fetchProfile();
    }, []);

    // Handle conversion when current amount changes
    useEffect(() => {
        const value = parseFloat(amount);
        if (!isNaN(value)) {
            setHomeAmount((value * exchangeRate).toLocaleString("en-KE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }));
        } else {
            setHomeAmount("0.00");
        }
    }, [amount]);

    // Reset duration unit context when frequency changes
    useEffect(() => {
        if (frequency === "Monthly") {
            setDuration(12);
        } else {
            setDuration(1);
        }
    }, [frequency]);

    const handleHandoff = async () => {
        if (!selectedMethod) return;

        try {
            const user = auth.currentUser;
            if (!user) {
                Alert.alert("Error", "You must be logged in to deposit.");
                return;
            }

            const val = parseFloat(amount);
            if (isNaN(val) || val <= 0) {
                Alert.alert("Error", "Please enter a valid amount.");
                return;
            }

            // Convert local amount to KES for the backend
            const amountInKES = Math.round(val * exchangeRate);

            const methodMap: Record<string, string> = {
                mpesa: "M-Pesa",
                card: "Card",
                bank: "Bank Transfer",
                paypal: "Card",
                apple_google: "Card"
            };

            const response = await paymentService.initialize({
                amount: amountInKES,
                currency: "KES",
                email: user.email || "",
                name: user.displayName || "Member",
                type: "Deposit",
                referenceId: params.id as string,
                method: methodMap[selectedMethod || ""] || "Card"
            });

            if (response.status === "success" && response.link) {
                setShowPaymentModal(false);
                await WebBrowser.openBrowserAsync(response.link);
                
                router.replace({
                    pathname: "/payment-status",
                    params: { 
                        reference: response.reference,
                        type: "Deposit"
                    }
                } as any);
            }
        } catch (error: any) {
            Alert.alert("Payment Error", error.message || "Failed to start payment.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>{isBusiness ? "Business Plan" : "Savings Plan"}</Text>
                        <View style={styles.testBadge}>
                            <Ionicons name="flask" size={10} color="#FF9500" />
                            <Text style={styles.testBadgeText}>TEST MODE</Text>
                        </View>
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {isBusiness && (
                        <View style={styles.bizSummaryCard}>
                            <View style={styles.bizSummaryHeader}>
                                <Ionicons name="rocket-outline" size={24} color={COLORS.white} />
                                <View>
                                    <Text style={styles.bizSummaryTitle}>{params.title}</Text>
                                    <Text style={styles.bizSummarySubtitle}>Targeting KES {Number(params.target).toLocaleString()}</Text>
                                </View>
                            </View>
                            <View style={styles.bizStatGrid}>
                                <View style={styles.bizStat}>
                                    <Text style={styles.bizStatLabel}>Profit Potential</Text>
                                    <Text style={styles.bizStatValue}>KES {revenueProjection?.netProfit}/mo</Text>
                                </View>
                                <View style={styles.bizStatDivider} />
                                <View style={styles.bizStat}>
                                    <Text style={styles.bizStatLabel}>Risk Level</Text>
                                    <Text style={styles.bizStatValue}>{params.riskLevel}</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Context Context Alert */}
                    <View style={styles.contextAlert}>
                        <Ionicons name="globe-outline" size={20} color={COLORS.primary} />
                        <Text style={styles.contextText}>
                            You are currently in <Text style={{ fontWeight: '700' }}>{userProfile?.currentCountry || "..."}</Text>. 
                            Payments will be made in <Text style={{ fontWeight: '700' }}>{userProfile?.preferredCurrency || "..."}</Text> 
                            and converted to <Text style={{ fontWeight: '700' }}>KES</Text> for your business in Kenya.
                        </Text>
                    </View>
                    {/* Currency Inputs */}
                    <View style={styles.card}>
                        <Text style={styles.cardLabel}>Savings Amount</Text>

                        {/* Current Country (USA Context) */}
                        <View style={styles.inputContainer}>
                            <View style={styles.currencyBadge}>
                                <Text style={styles.currencyText}>{userProfile?.preferredCurrency || "..."}</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="0.00"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                                placeholderTextColor={COLORS.textLight}
                            />
                        </View>

                        <View style={styles.conversionSpacer}>
                            <Ionicons name="swap-vertical" size={20} color={COLORS.heritageAccent} />
                            <View style={styles.rateLine} />
                            <Text style={styles.rateText}>1 {userProfile?.preferredCurrency || "..."} ≈ {exchangeRate} KES</Text>
                        </View>

                        {/* Home Country (Kenya Context) */}
                        <View style={[styles.inputContainer, styles.homeInput]}>
                            <View style={[styles.currencyBadge, { backgroundColor: COLORS.secondary }]}>
                                <Text style={styles.currencyText}>KES</Text>
                            </View>
                            <Text style={styles.homeValueText}>{homeAmount}</Text>
                        </View>
                    </View>

                    {/* Frequency Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Contribution Frequency</Text>
                        <View style={styles.frequencyContainer}>
                            {["Monthly", "Yearly"].map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.frequencyBtn,
                                        frequency === item && styles.frequencyBtnActive
                                    ]}
                                    onPress={() => setFrequency(item)}
                                >
                                    <Text style={[
                                        styles.frequencyText,
                                        frequency === item && styles.frequencyTextActive
                                    ]}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Dynamic Duration Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Plan Duration ({frequency === "Monthly" ? "Months" : "Years"})</Text>
                        <View style={styles.durationCard}>
                            <TouchableOpacity onPress={decrementDuration} style={styles.durationActionBtn}>
                                <Ionicons name="remove" size={24} color={COLORS.primary} />
                            </TouchableOpacity>

                            <View style={styles.durationDisplay}>
                                <Text style={styles.durationValue}>{duration}</Text>
                                <Text style={styles.durationUnit}>{frequency === "Monthly" ? (duration === 1 ? "Month" : "Months") : (duration === 1 ? "Year" : "Years")}</Text>
                            </View>

                            <TouchableOpacity onPress={incrementDuration} style={styles.durationActionBtn}>
                                <Ionicons name="add" size={24} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Lock-in Period */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>Lock-in Period</Text>
                            <Ionicons name="lock-closed-outline" size={16} color={COLORS.primary} />
                        </View>
                        <Text style={styles.sectionSubtitle}>Select duration for higher growth rewards</Text>

                        <View style={styles.lockGrid}>
                            {lockOptions.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.lockOption,
                                        lockPeriod === option && styles.lockOptionActive
                                    ]}
                                    onPress={() => setLockPeriod(option)}
                                >
                                    <Text style={[
                                        styles.lockText,
                                        lockPeriod === option && styles.lockTextActive
                                    ]}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Summary & CTA */}
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Contribution Frequency</Text>
                            <Text style={styles.summaryValue}>{frequency}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Duration</Text>
                            <Text style={styles.summaryValue}>{duration} {frequency === "Monthly" ? (duration === 1 ? "Month" : "Months") : (duration === 1 ? "Year" : "Years")}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Lock-in Duration</Text>
                            <Text style={styles.summaryValue}>{lockPeriod}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Saving Amount ({frequency})</Text>
                            <Text style={[styles.summaryValue, { color: COLORS.white, fontSize: 18 }]}>{homeAmount} KES</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.submitBtn}
                            onPress={() => setShowPaymentModal(true)}
                        >
                            <Text style={styles.submitBtnText}>Confirm Savings Plan</Text>
                            <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Payment Methods Modal */}
                <Modal
                    visible={showPaymentModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowPaymentModal(false)}
                >
                    <Pressable
                        style={styles.modalOverlay}
                        onPress={() => setShowPaymentModal(false)}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <View style={styles.modalHandle} />
                                <Text style={styles.modalTitle}>Choose Payment Method</Text>
                                <Text style={styles.modalSubtitle}>How would you like to fund your savings? </Text>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                {paymentMethods.map((cat, idx) => (
                                    <View key={idx} style={styles.modalCatSection}>
                                        <Text style={styles.modalCatTitle}>{cat.category}</Text>
                                        {cat.options.map((method) => (
                                            <TouchableOpacity
                                                key={method.id}
                                                style={[
                                                    styles.methodItem,
                                                    selectedMethod === method.id && styles.methodItemActive
                                                ]}
                                                onPress={() => setSelectedMethod(method.id)}
                                            >
                                                <View style={[styles.methodIcon, { backgroundColor: method.color + "15" }]}>
                                                    <Ionicons name={method.icon as any} size={24} color={method.color} />
                                                </View>
                                                <Text style={[
                                                    styles.methodName,
                                                    selectedMethod === method.id && styles.methodNameActive
                                                ]}>{method.name}</Text>
                                                <View style={[
                                                    styles.radioInner,
                                                    selectedMethod === method.id && styles.radioInnerActive
                                                ]} />
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                ))}

                                <View style={styles.summaryMiniCount}>
                                    <Text style={styles.miniLabel}>Total to Pay Now (KES)</Text>
                                    <Text style={styles.miniValue}>{homeAmount}</Text>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.payBtn,
                                        !selectedMethod && { opacity: 0.5 }
                                    ]}
                                    disabled={!selectedMethod}
                                    onPress={handleHandoff}
                                >
                                    <Text style={styles.payBtnText}>Proceed to Payment</Text>
                                    <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </Pressable>
                </Modal>
            </KeyboardAvoidingView>
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
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.primary,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 24,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        marginBottom: 24,
    },
    cardLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textLight,
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8F9FA",
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 64,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    currencyBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 12,
    },
    currencyText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "700",
    },
    input: {
        flex: 1,
        fontSize: 24,
        fontWeight: "700",
        color: COLORS.primary,
    },
    conversionSpacer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    rateLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#EEEEEE",
        marginHorizontal: 12,
    },
    rateText: {
        fontSize: 12,
        color: COLORS.textLight,
        fontWeight: "500",
    },
    homeInput: {
        backgroundColor: "rgba(11, 61, 46, 0.05)",
        borderColor: "rgba(11, 61, 46, 0.1)",
    },
    homeValueText: {
        flex: 1,
        fontSize: 24,
        fontWeight: "700",
        color: COLORS.secondary,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primary,
        marginRight: 8,
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 16,
    },
    frequencyContainer: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        padding: 6,
        borderRadius: 16,
        marginBottom: 12,
    },
    frequencyBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },
    frequencyBtnActive: {
        backgroundColor: COLORS.secondary,
    },
    frequencyText: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textLight,
    },
    frequencyTextActive: {
        color: COLORS.white,
    },
    durationCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    durationActionBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: COLORS.heritage,
        justifyContent: "center",
        alignItems: "center",
    },
    durationDisplay: {
        alignItems: "center",
    },
    durationValue: {
        fontSize: 24,
        fontWeight: "700",
        color: COLORS.primary,
    },
    durationUnit: {
        fontSize: 12,
        color: COLORS.textLight,
        fontWeight: "600",
    },
    lockGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    lockOption: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        width: (width - 48 - 12) / 2,
        alignItems: "center",
    },
    lockOptionActive: {
        borderColor: COLORS.primary,
        backgroundColor: "rgba(10, 31, 68, 0.05)",
    },
    lockText: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textLight,
    },
    lockTextActive: {
        color: COLORS.primary,
    },
    summaryCard: {
        backgroundColor: COLORS.primary,
        borderRadius: 24,
        padding: 24,
        marginTop: 8,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
        alignItems: "center",
    },
    summaryLabel: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 14,
    },
    summaryValue: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: "700",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.1)",
        marginVertical: 16,
    },
    submitBtn: {
        backgroundColor: COLORS.secondary,
        height: 56,
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        marginTop: 8,
    },
    submitBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "700",
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: COLORS.heritage,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        maxHeight: height * 0.8,
    },
    modalHeader: {
        alignItems: "center",
        marginBottom: 24,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: COLORS.heritageAccent,
        borderRadius: 2,
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    modalCatSection: {
        marginBottom: 20,
    },
    modalCatTitle: {
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.textLight,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 12,
        marginLeft: 4,
    },
    methodItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "transparent",
    },
    methodItemActive: {
        borderColor: COLORS.primary,
        backgroundColor: "rgba(10, 31, 68, 0.02)",
    },
    methodIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    methodName: {
        flex: 1,
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.text,
    },
    methodNameActive: {
        color: COLORS.primary,
    },
    radioInner: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: COLORS.heritageAccent,
    },
    radioInnerActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary,
    },
    summaryMiniCount: {
        backgroundColor: "rgba(10, 31, 68, 0.05)",
        padding: 16,
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12,
        marginBottom: 20,
    },
    miniLabel: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: "600",
    },
    miniValue: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.primary,
    },
    payBtn: {
        backgroundColor: COLORS.primary,
        height: 64,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
    },
    payBtnText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "700",
    },
    bizSummaryCard: {
        backgroundColor: COLORS.secondary,
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        elevation: 4,
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
    },
    bizSummaryHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        marginBottom: 20,
    },
    bizSummaryTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.white,
    },
    bizSummarySubtitle: {
        fontSize: 13,
        color: "rgba(255,255,255,0.7)",
        marginTop: 2,
    },
    bizStatGrid: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 16,
        padding: 16,
    },
    bizStat: {
        flex: 1,
        alignItems: "center",
    },
    bizStatLabel: {
        fontSize: 10,
        color: "rgba(255,255,255,0.6)",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    bizStatValue: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.white,
    },
    bizStatDivider: {
        width: 1,
        height: 24,
        backgroundColor: "rgba(255,255,255,0.1)",
    },
    contextAlert: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E9ECEF",
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        gap: 12,
    },
    contextText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.primary,
        lineHeight: 18,
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    testBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF950015',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginTop: 2,
        gap: 4,
    },
    testBadgeText: {
        color: '#FF9500',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
});
