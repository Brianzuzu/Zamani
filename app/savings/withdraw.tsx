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
    Alert,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { savingsService } from "../config/savingsService";
import { auth } from "../config/firebase";
import axios from "axios";
import { API_URL } from "../config/authService";
import { convertCurrency, formatCurrency } from "../../constants/currency";

const COLORS = {
    primary: "#0A1F44",
    secondary: "#0B3D2E",
    heritage: "#F5EFE7",
    heritageAccent: "#D4C2AD",
    white: "#FFFFFF",
    text: "#1A1A1A",
    textLight: "#666666",
    border: "#E0E0E0",
    success: "#34C759",
};

export default function WithdrawScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("M-Pesa");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [bankDetails, setBankDetails] = useState("");
    const [userProfile, setUserProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const goalId = params.id as string;
    const goalTitle = params.title as string;
    const balanceNum = parseFloat(params.balance as string) || 0;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await auth.currentUser?.getIdToken();
                if (token) {
                    const res = await axios.get(`${API_URL}/users/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUserProfile(res.data);
                    // Pre-fill phone if available
                    if (res.data.phoneNumber) {
                        setPhoneNumber(res.data.phoneNumber);
                    }
                }
            } catch (error) {
                console.error("Error fetching profile in withdraw:", error);
            }
        };
        fetchProfile();
    }, []);

    const currencySymbol = userProfile?.currencySymbol || "KSh";
    const preferredCurrency = userProfile?.preferredCurrency || "KES";

    const handleWithdraw = async () => {
        const withdrawAmount = parseFloat(amount);
        
        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            Alert.alert("Error", "Please enter a valid amount.");
            return;
        }

        if (withdrawAmount > balanceNum) {
            Alert.alert("Error", "Insufficient balance.");
            return;
        }

        if (method === "M-Pesa" && !phoneNumber) {
            Alert.alert("Error", "Please enter your M-Pesa phone number.");
            return;
        }

        if (method === "Bank Transfer" && !bankDetails) {
            Alert.alert("Error", "Please enter your bank details.");
            return;
        }

        setIsLoading(true);
        try {
            await savingsService.withdraw(goalId, withdrawAmount, method, {
                phoneNumber,
                bankDetails
            });
            
            Alert.alert(
                "Request Submitted",
                "Your withdrawal request has been received and is pending admin approval. Funds usually arrive within 24 hours.",
                [{ text: "OK", onPress: () => router.replace("/(tabs)/savings") }]
            );
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || "Failed to submit withdrawal request.");
        } finally {
            setIsLoading(false);
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
                    <Text style={styles.headerTitle}>Withdraw Funds</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.balanceCard}>
                        <Text style={styles.balanceLabel}>Available Balance</Text>
                        <Text style={styles.balanceAmount}>{formatCurrency(balanceNum, preferredCurrency, currencySymbol)}</Text>
                        <Text style={styles.goalInfo}>From: {goalTitle}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Withdrawal Amount</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.currencyPrefix}>{currencySymbol}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0.00"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                                placeholderTextColor={COLORS.textLight}
                            />
                            <TouchableOpacity 
                                onPress={() => setAmount(balanceNum.toString())}
                                style={styles.maxBtn}
                            >
                                <Text style={styles.maxBtnText}>MAX</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Withdrawal Method</Text>
                        <View style={styles.methodContainer}>
                            {["M-Pesa", "Bank Transfer"].map((m) => (
                                <TouchableOpacity
                                    key={m}
                                    style={[
                                        styles.methodBtn,
                                        method === m && styles.methodBtnActive
                                    ]}
                                    onPress={() => setMethod(m)}
                                >
                                    <Text style={[
                                        styles.methodText,
                                        method === m && styles.methodTextActive
                                    ]}>{m}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {method === "M-Pesa" ? (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>M-Pesa Phone Number</Text>
                            <View style={styles.detailInputContainer}>
                                <Ionicons name="call-outline" size={20} color={COLORS.textLight} />
                                <TextInput
                                    style={styles.detailInput}
                                    placeholder="e.g. 0712 345 678"
                                    keyboardType="phone-pad"
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                />
                            </View>
                        </View>
                    ) : (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Bank Account Details</Text>
                            <View style={[styles.detailInputContainer, { height: 100, alignItems: 'flex-start', paddingTop: 12 }]}>
                                <Ionicons name="business-outline" size={20} color={COLORS.textLight} style={{ marginTop: 2 }} />
                                <TextInput
                                    style={[styles.detailInput, { height: 80 }]}
                                    placeholder="Enter Bank Name, Account Name and Number"
                                    multiline
                                    value={bankDetails}
                                    onChangeText={setBankDetails}
                                />
                            </View>
                        </View>
                    )}

                    <View style={styles.infoBox}>
                        <Ionicons name="information-circle-outline" size={20} color={COLORS.secondary} />
                        <Text style={styles.infoText}>
                            Withdrawals are processed manually by our treasury team for security. Standard processing time is 12-24 hours.
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.withdrawActionBtn, isLoading && { opacity: 0.7 }]}
                        onPress={handleWithdraw}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <>
                                <Text style={styles.withdrawActionBtnText}>Request Withdrawal</Text>
                                <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
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
    },
    balanceCard: {
        backgroundColor: COLORS.primary,
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        alignItems: 'center',
    },
    balanceLabel: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    balanceAmount: {
        color: COLORS.white,
        fontSize: 32,
        fontWeight: "800",
        marginBottom: 8,
    },
    goalInfo: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 12,
        fontWeight: "500",
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 64,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    currencyPrefix: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.primary,
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 24,
        fontWeight: "700",
        color: COLORS.primary,
    },
    maxBtn: {
        backgroundColor: COLORS.heritage,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    maxBtnText: {
        fontSize: 10,
        fontWeight: "800",
        color: COLORS.primary,
    },
    methodContainer: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        padding: 6,
        borderRadius: 16,
    },
    methodBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },
    methodBtnActive: {
        backgroundColor: COLORS.secondary,
    },
    methodText: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textLight,
    },
    methodTextActive: {
        color: COLORS.white,
    },
    detailInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 60,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    detailInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.primary,
    },
    infoBox: {
        flexDirection: "row",
        backgroundColor: "rgba(11, 61, 46, 0.05)",
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
        gap: 12,
        marginBottom: 32,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.textLight,
        lineHeight: 18,
    },
    withdrawActionBtn: {
        backgroundColor: COLORS.secondary,
        height: 60,
        borderRadius: 20,
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
    withdrawActionBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "700",
    },
});
