import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { paymentService } from "./config/paymentService";

const { width } = Dimensions.get("window");

const COLORS = {
    primary: "#0A1F44",
    secondary: "#0B3D2E",
    heritage: "#F5EFE7",
    white: "#FFFFFF",
    success: "#34C759",
    error: "#FF3B30",
    textLight: "#666666",
};

export default function PaymentStatusScreen() {
    const router = useRouter();
    const { reference, tx_ref, status: urlStatus, type } = useLocalSearchParams();
    const [status, setStatus] = useState<'Pending' | 'Completed' | 'Failed' | 'Checking'>('Checking');
    const [attempts, setAttempts] = useState(0);

    useEffect(() => {
        const currentReference = (reference || tx_ref) as string;
        
        if (!currentReference) {
            setStatus('Failed');
            return;
        }

        const checkStatus = async () => {
            try {
                const response = await paymentService.verify(currentReference);
                if (response.status === 'Completed') {
                    setStatus('Completed');
                } else if (response.status === 'Failed') {
                    setStatus('Failed');
                } else {
                    // If still pending, poll a few times
                    if (attempts < 5) {
                        setTimeout(() => {
                            setAttempts(prev => prev + 1);
                        }, 3000);
                    } else {
                        setStatus('Pending'); // Show "Still Processing" instead of error
                    }
                }
            } catch (error) {
                console.error("Verification error:", error);
                setStatus('Failed');
            }
        };

        checkStatus();
    }, [reference, tx_ref, attempts]);

    const handleContinue = () => {
        if (type === 'Investment') {
            router.replace("/(tabs)/projects");
        } else {
            router.replace("/(tabs)/savings");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {status === 'Checking' && (
                    <>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.statusText}>Verifying Payment...</Text>
                        <Text style={styles.subtitle}>Please wait while we confirm your transaction with Flutterwave.</Text>
                    </>
                )}

                {status === 'Completed' && (
                    <>
                        <View style={[styles.iconCircle, { backgroundColor: COLORS.success + '20' }]}>
                            <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
                        </View>
                        <Text style={styles.statusText}>Payment Successful!</Text>
                        <Text style={styles.subtitle}>Your transaction has been confirmed and your account updated.</Text>
                    </>
                )}

                {status === 'Pending' && (
                    <>
                        <View style={[styles.iconCircle, { backgroundColor: '#FFCC0020' }]}>
                            <Ionicons name="time" size={80} color="#FFCC00" />
                        </View>
                        <Text style={styles.statusText}>Still Processing...</Text>
                        <Text style={styles.subtitle}>Your payment is being processed. It will reflect in your dashboard shortly.</Text>
                    </>
                )}

                {status === 'Failed' && (
                    <>
                        <View style={[styles.iconCircle, { backgroundColor: COLORS.error + '20' }]}>
                            <Ionicons name="close-circle" size={80} color={COLORS.error} />
                        </View>
                        <Text style={styles.statusText}>Payment Failed</Text>
                        <Text style={styles.subtitle}>We couldn't verify your payment. If you were charged, please contact support.</Text>
                    </>
                )}

                <TouchableOpacity 
                    style={[styles.button, (status === 'Checking') && styles.disabledButton]}
                    onPress={handleContinue}
                    disabled={status === 'Checking'}
                >
                    <Text style={styles.buttonText}>
                        {status === 'Completed' ? 'Continue to Dashboard' : 'Back to Home'}
                    </Text>
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
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
    },
    iconCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    statusText: {
        fontSize: 24,
        fontWeight: "800",
        color: COLORS.primary,
        marginBottom: 12,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 40,
    },
    button: {
        backgroundColor: COLORS.primary,
        width: '100%',
        height: 56,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "700",
    }
});
