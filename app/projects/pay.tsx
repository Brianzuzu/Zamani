import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StatusBar,
    Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { paymentService } from "../config/paymentService";
import { auth } from "../config/firebase";
import axios from "axios";
import { API_URL } from "../config/authService";
import { convertCurrency, formatCurrency, parsePrice } from "../../constants/currency";

const COLORS = {
    primary: "#0A1F44",
    secondary: "#0B3D2E",
    heritage: "#F5EFE7",
    white: "#FFFFFF",
    text: "#1A1A1A",
    textLight: "#666666",
    success: "#34C759",
    warning: "#FF9500",
    danger: "#FF3B30",
};

export default function LandPayment() {
    const { id, title, price, size, location, category, selectedPlan: incomingPlan } = useLocalSearchParams();
    const router = useRouter();

    const rawPrice = parsePrice(price);
    const isProduct = category === "Utilities and Products" || (id as string)?.startsWith("hot_util");
    const [selectedPlan, setSelectedPlan] = useState((incomingPlan as string)?.toLowerCase() || "full");

    const [investAmount, setInvestAmount] = useState(() => {
        const plan = (incomingPlan as string)?.toLowerCase() || "full";
        if (plan === "full") return rawPrice.toString();
        if (plan === "installments") return Math.round(rawPrice * 0.4).toString();
        return "";
    });

    const [selectedMethod, setSelectedMethod] = useState("card");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);

    // Fetch user profile
    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                if (token) {
                    const res = await axios.get(`${API_URL}/users/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUserProfile(res.data);
                }
            } catch (error) {
                console.error("Error fetching profile in pay:", error);
            }
        };
        fetchProfile();
    }, []);

    const currencySymbol = userProfile?.currencySymbol || "KSh";
    const preferredCurrency = userProfile?.preferredCurrency || "KES";

    // Convert rawPrice to preferred currency for display if needed
    // But usually, projects are listed in KES.
    // Let's assume rawPrice is always in KES.
    const displayPrice = formatCurrency(convertCurrency(rawPrice, "KES", preferredCurrency), preferredCurrency, currencySymbol);

    // Card Details state
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCVC, setCardCVC] = useState("");
    // Zip is usually handled by processor

    const paymentMethods = [
        { id: "mpesa", label: "M-Pesa", icon: "phone-portrait-outline", color: "#4CAF50" },
        { id: "card", label: "Intl Card", icon: "card-outline", color: COLORS.primary },
        { id: "remit", label: "Remittance", icon: "globe-outline", color: COLORS.secondary },
        { id: "bank", label: "Bank Transfer", icon: "business-outline", color: "#666" },
    ];

    const handlePay = () => {
        if (!name.trim()) {
            Alert.alert("Required", "Please enter your full name.");
            return;
        }
        if (selectedMethod === "mpesa" && !phone.trim()) {
            Alert.alert("Required", "Please enter your M-Pesa phone number.");
            return;
        }
        if (selectedMethod === "card" && (!cardNumber || !cardExpiry || !cardCVC)) {
            Alert.alert("Required", "Please complete all card details.");
            return;
        }
        if (!agreed) {
            Alert.alert("Required", "Please agree to the terms to proceed.");
            return;
        }

        const inputAmountString = investAmount.replace(/[^\d]/g, "");
        const inputAmount = parseInt(inputAmountString || "0");
        const finalAmount = isProduct
            ? (selectedPlan === "full" ? rawPrice : initialDeposit)
            : inputAmount;

        if (!isProduct && finalAmount < 10000) {
            Alert.alert("Required", "Minimum investment amount is KSh 10,000.");
            return;
        }

        processPayment(finalAmount);
    };

    const processPayment = async (amount: number) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                Alert.alert("Error", "You must be logged in to make a payment.");
                return;
            }

            // Convert KES amount to preferred currency for Flutterwave charge
            const chargeAmount = convertCurrency(amount, "KES", preferredCurrency);

            const methodMap: Record<string, string> = {
                mpesa: "M-Pesa",
                card: "Card",
                bank: "Bank Transfer",
                remit: "Card" // Using Card as a fallback for international processing
            };

            // Initialize payment via Flutterwave
            const response = await paymentService.initialize({
                amount: chargeAmount,
                currency: preferredCurrency,
                email: user.email || "",
                name: name || user.displayName || "Member",
                phone: phone,
                type: "Investment",
                referenceId: id as string,
                method: methodMap[selectedMethod] || "Card"
            });

            if (response.status === "success" && response.link) {
                // Open Flutterwave checkout in browser
                await WebBrowser.openBrowserAsync(response.link);
                
                // After browser closes, navigate to status page to verify
                router.replace({
                    pathname: "/payment-status",
                    params: { 
                        reference: response.reference,
                        type: "Investment"
                    }
                } as any);
            }
        } catch (error: any) {
            Alert.alert("Payment Error", error.message || "Failed to initialize payment.");
        }
    };

    const initialDeposit = Math.round(rawPrice * 0.4);
    const monthlyInstallment = Math.round((rawPrice * 0.6) / 3);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Payment</Text>
                    <View style={styles.testBadge}>
                        <Ionicons name="flask" size={10} color="#FF9500" />
                        <Text style={styles.testBadgeText}>TEST MODE</Text>
                    </View>
                </View>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Project Summary */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryIcon}>
                        <Ionicons
                            name={isProduct ? "cart" : "map"}
                            size={24}
                            color={COLORS.secondary}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.summaryTitle}>{title || "Zamani Product"}</Text>
                        <Text style={styles.summaryLocation}>
                            <Ionicons name="location-outline" size={12} color={COLORS.textLight} /> {location || "Verified Supplier"}
                        </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.summaryPrice}>{displayPrice}</Text>
                        {!isProduct && <Text style={styles.summarySize}>{size || ""}</Text>}
                        {isProduct && <Text style={styles.summarySize}>VERIFIED ITEM</Text>}
                    </View>
                </View>

                {/* Payment Plan for Products */}
                {isProduct && (
                    <>
                        <Text style={styles.sectionTitle}>Choose Payment Plan</Text>
                        <View style={styles.planContainer}>
                            <TouchableOpacity
                                style={[styles.planCard, selectedPlan === "full" && styles.planCardActive]}
                                onPress={() => setSelectedPlan("full")}
                            >
                                <View style={styles.planHeader}>
                                    <Text style={[styles.planTitle, selectedPlan === "full" && styles.planTitleActive]}>Full Payment</Text>
                                    <Ionicons name={selectedPlan === "full" ? "radio-button-on" : "radio-button-off"} size={20} color={selectedPlan === "full" ? COLORS.secondary : COLORS.textLight} />
                                </View>
                                <Text style={styles.planDesc}>One-time payment of {displayPrice}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.planCard, selectedPlan === "installments" && styles.planCardActive]}
                                onPress={() => setSelectedPlan("installments")}
                            >
                                <View style={styles.planHeader}>
                                    <Text style={[styles.planTitle, selectedPlan === "installments" && styles.planTitleActive]}>Lipia Pole Pole</Text>
                                    <Ionicons name={selectedPlan === "installments" ? "radio-button-on" : "radio-button-off"} size={20} color={selectedPlan === "installments" ? COLORS.secondary : COLORS.textLight} />
                                </View>
                                <Text style={styles.planDesc}>40% Deposit + 3 Monthly Payments</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Plan Breakdown */}
                        <View style={styles.breakdownCard}>
                            <View style={styles.breakdownRow}>
                                <Text style={styles.breakdownLabel}>{selectedPlan === "full" ? "Total Amount" : "Initial Deposit (40%)"}</Text>
                                <Text style={styles.breakdownValue}>{currencySymbol} {convertCurrency(selectedPlan === "full" ? rawPrice : initialDeposit, "KES", preferredCurrency).toLocaleString()}</Text>
                            </View>
                            {selectedPlan === "installments" && (
                                <>
                                    <View style={styles.breakdownRow}>
                                        <Text style={styles.breakdownLabel}>Remaining Balance</Text>
                                        <Text style={styles.breakdownValue}>{currencySymbol} {convertCurrency(rawPrice - initialDeposit, "KES", preferredCurrency).toLocaleString()}</Text>
                                    </View>
                                    <View style={styles.breakdownDivider} />
                                    <View style={styles.breakdownRow}>
                                        <Text style={styles.breakdownLabel}>Monthly Payments (3x)</Text>
                                        <Text style={styles.breakdownValue}>{currencySymbol} {convertCurrency(monthlyInstallment, "KES", preferredCurrency).toLocaleString()}</Text>
                                    </View>
                                </>
                            )}
                        </View>
                    </>
                )}

                {/* Investment Amount Input */}
                {!isProduct && (
                    <>
                        <Text style={styles.sectionTitle}>
                            {selectedPlan === "full" ? "Total Purchase Amount" :
                                selectedPlan === "installments" ? "Installment Deposit Amount" :
                                    "Investment Amount"}
                        </Text>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Amount to Invest (Min: {currencySymbol} {convertCurrency(10000, "KES", preferredCurrency).toLocaleString()})</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 50000"
                                placeholderTextColor={COLORS.textLight}
                                keyboardType="numeric"
                                value={investAmount}
                                onChangeText={setInvestAmount}
                            />
                        </View>
                    </>
                )}

                {/* Buyer Details */}
                <Text style={styles.sectionTitle}>Buyer Details</Text>
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your full name"
                        placeholderTextColor={COLORS.textLight}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {/* Payment Method */}
                <Text style={styles.sectionTitle}>Payment Method</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24, marginHorizontal: -20, paddingHorizontal: 20 }}>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        {paymentMethods.map((method) => (
                            <TouchableOpacity
                                key={method.id}
                                style={[
                                    styles.methodCardSmall,
                                    selectedMethod === method.id && styles.methodCardSelectedSmall
                                ]}
                                onPress={() => setSelectedMethod(method.id)}
                            >
                                <View style={[
                                    styles.methodIconSmall,
                                    { backgroundColor: selectedMethod === method.id ? method.color : COLORS.heritage }
                                ]}>
                                    <Ionicons
                                        name={method.icon as any}
                                        size={20}
                                        color={selectedMethod === method.id ? COLORS.white : COLORS.textLight}
                                    />
                                </View>
                                <Text style={[
                                    styles.methodLabelSmall,
                                    selectedMethod === method.id && styles.methodLabelSelectedSmall
                                ]}>{method.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                {/* M-Pesa Phone Input */}
                {selectedMethod === "mpesa" && (
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>M-Pesa Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 0712 345 678"
                            placeholderTextColor={COLORS.textLight}
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />
                    </View>
                )}

                {/* Bank Transfer Info */}
                {selectedMethod === "bank" && (
                    <View style={styles.bankInfoCard}>
                        <Text style={styles.bankInfoTitle}>Bank Transfer Details</Text>
                        {[
                            { label: "Bank", value: "Equity Bank" },
                            { label: "Account Name", value: "Zamani Investments Ltd" },
                            { label: "Account No.", value: "0123456789012" },
                            { label: "Branch", value: "Nairobi Main" },
                        ].map((item, idx) => (
                            <View key={idx} style={styles.bankInfoRow}>
                                <Text style={styles.bankInfoLabel}>{item.label}</Text>
                                <Text style={styles.bankInfoValue}>{item.value}</Text>
                            </View>
                        ))}
                        <View style={styles.bankNote}>
                            <Ionicons name="information-circle-outline" size={16} color={COLORS.warning} />
                            <Text style={styles.bankNoteText}>Use your phone number as reference</Text>
                        </View>
                    </View>
                )}

                {/* Card Form */}
                {selectedMethod === "card" && (
                    <View style={styles.cardForm}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Card Number</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0000 0000 0000 0000"
                                placeholderTextColor={COLORS.textLight}
                                keyboardType="numeric"
                                value={cardNumber}
                                onChangeText={setCardNumber}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.inputLabel}>Expiry</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="MM/YY"
                                    placeholderTextColor={COLORS.textLight}
                                    value={cardExpiry}
                                    onChangeText={setCardExpiry}
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.inputLabel}>CVV</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="123"
                                    placeholderTextColor={COLORS.textLight}
                                    keyboardType="numeric"
                                    value={cardCVC}
                                    onChangeText={setCardCVC}
                                />
                            </View>
                        </View>
                    </View>
                )}

                {/* Remittance Info */}
                {selectedMethod === "remit" && (
                    <View style={styles.bankInfoCard}>
                        <Text style={styles.bankInfoTitle}>Global Remittance Options</Text>
                        <Text style={styles.remitDesc}>
                            Send funds directly to Zamani&apos;s corporate accounts via these providers for instant local settlement.
                        </Text>
                        {[
                            { label: "Providers", value: "WorldRemit, Remitly, SendWave" },
                            { label: "Recipient", value: "Zamani Investments Ltd" },
                            { label: "Country", value: "Kenya" },
                            { label: "Currency", value: "KES (Preferred)" },
                        ].map((item, idx) => (
                            <View key={idx} style={styles.bankInfoRow}>
                                <Text style={styles.bankInfoLabel}>{item.label}</Text>
                                <Text style={styles.bankInfoValue}>{item.value}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Terms */}
                <TouchableOpacity
                    style={styles.termsRow}
                    onPress={() => setAgreed(!agreed)}
                >
                    <Ionicons
                        name={agreed ? "checkbox" : "square-outline"}
                        size={24}
                        color={agreed ? COLORS.secondary : COLORS.textLight}
                    />
                    <Text style={styles.termsText}>
                        I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and confirm the purchase details.
                    </Text>
                </TouchableOpacity>

                <View style={{ height: 32 }} />
            </ScrollView>

            {/* Pay Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.payBtn, !agreed && styles.payBtnDisabled]}
                    onPress={handlePay}
                    disabled={!agreed}
                >
                    <Text style={styles.payBtnText}>
                        {selectedMethod === "mpesa"
                            ? `Pay ${currencySymbol}${convertCurrency(isProduct ? (selectedPlan === "full" ? rawPrice : initialDeposit) : (parseInt(investAmount.replace(/[^\d]/g, "") || "0")), "KES", preferredCurrency).toLocaleString()} with M-Pesa`
                            : selectedMethod === "card"
                                ? "Pay Securely via Card"
                                : "Confirm Payment Method"}
                    </Text>
                    <Ionicons name={selectedMethod === "mpesa" ? "phone-portrait" : (selectedMethod === "card" ? "lock-closed" : "checkmark-circle")} size={20} color={COLORS.white} />
                </TouchableOpacity>
            </View>
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
        paddingVertical: 16,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: COLORS.white,
        justifyContent: "center",
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.primary,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    summaryCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 28,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
    },
    summaryIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: COLORS.heritage,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 4,
    },
    summaryLocation: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    summaryPrice: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.secondary,
    },
    summarySize: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.primary,
        marginBottom: 14,
    },
    inputGroup: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.textLight,
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: COLORS.text,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.06)",
    },
    methodsRow: {
        gap: 12,
        marginBottom: 24,
    },
    methodCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "transparent",
    },
    methodCardSelected: {
        borderColor: COLORS.secondary,
        backgroundColor: COLORS.secondary + "08",
    },
    methodIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    methodLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.text,
    },
    methodLabelSelected: {
        color: COLORS.secondary,
        fontWeight: "700",
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: "rgba(0,0,0,0.15)",
        justifyContent: "center",
        alignItems: "center",
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.secondary,
    },
    bankInfoCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 18,
        marginBottom: 24,
    },
    bankInfoTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 14,
    },
    bankInfoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.04)",
    },
    bankInfoLabel: {
        fontSize: 13,
        color: COLORS.textLight,
    },
    bankInfoValue: {
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.primary,
    },
    bankNote: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
        gap: 6,
    },
    bankNoteText: {
        fontSize: 12,
        color: COLORS.warning,
        fontWeight: "500",
    },
    termsRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
    },
    termsText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.textLight,
        lineHeight: 20,
    },
    termsLink: {
        color: COLORS.secondary,
        fontWeight: "700",
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: COLORS.heritage,
        borderTopWidth: 1,
        borderTopColor: "rgba(0,0,0,0.04)",
    },
    payBtn: {
        backgroundColor: COLORS.secondary,
        borderRadius: 16,
        paddingVertical: 18,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    payBtnDisabled: {
        opacity: 0.5,
    },
    payBtnText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: "800",
    },
    planContainer: {
        gap: 12,
        marginBottom: 20,
    },
    planCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: "transparent",
    },
    planCardActive: {
        borderColor: COLORS.secondary,
        backgroundColor: COLORS.secondary + "05",
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    planTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.primary,
    },
    planTitleActive: {
        color: COLORS.secondary,
    },
    planDesc: {
        fontSize: 13,
        color: COLORS.textLight,
    },
    breakdownCard: {
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        padding: 20,
        marginBottom: 28,
    },
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 4,
    },
    breakdownLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
    },
    breakdownValue: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '800',
    },
    breakdownDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 12,
    },
    methodCardSmall: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 12,
        alignItems: "center",
        width: 100,
        borderWidth: 2,
        borderColor: "transparent",
    },
    methodCardSelectedSmall: {
        borderColor: COLORS.secondary,
        backgroundColor: COLORS.secondary + "08",
    },
    methodIconSmall: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    methodLabelSmall: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.textLight,
    },
    methodLabelSelectedSmall: {
        color: COLORS.secondary,
        fontWeight: "700",
    },
    cardForm: {
        marginBottom: 20,
    },
    remitDesc: {
        fontSize: 13,
        color: COLORS.textLight,
        lineHeight: 18,
        marginBottom: 16,
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
