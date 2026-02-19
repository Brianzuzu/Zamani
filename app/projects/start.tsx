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
};

const SECTORS = [
    {
        id: "agriculture",
        name: "Sustainable Agriculture",
        icon: "leaf-outline",
        description: "Direct investment in high-yield avocado and macadamia farming.",
        roi: "18-22% p.a."
    },
    {
        id: "realestate",
        name: "Affordable Housing",
        icon: "business-outline",
        description: "Community-driven urban development projects in Nairobi.",
        roi: "12-15% p.a."
    },
    {
        id: "energy",
        name: "Clean Energy",
        icon: "sunny-outline",
        description: "Solar micro-grids for rural community empowerment.",
        roi: "10-14% p.a."
    },
    {
        id: "education",
        name: "Education Tech",
        icon: "school-outline",
        description: "Digital learning centers for low-income areas.",
        roi: "8-12% p.a."
    },
    {
        id: "stocks",
        name: "Kenyan Stocks",
        icon: "trending-up-outline",
        description: "Direct access to blue-chip shares on the Nairobi Securities Exchange.",
        roi: "15-25% p.a."
    }
];

export default function StartProjectScreen() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [amount, setAmount] = useState("");

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            router.back();
        }
    };

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Choose your sector</Text>
            <Text style={styles.stepSubtitle}>Where would you like to make an impact today?</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.sectorList}>
                {SECTORS.map((sector) => (
                    <TouchableOpacity
                        key={sector.id}
                        style={[
                            styles.sectorCard,
                            selectedSector === sector.id && styles.selectedCard
                        ]}
                        onPress={() => setSelectedSector(sector.id)}
                    >
                        <View style={[
                            styles.iconContainer,
                            selectedSector === sector.id && styles.selectedIconContainer
                        ]}>
                            <Ionicons
                                name={sector.icon as any}
                                size={24}
                                color={selectedSector === sector.id ? COLORS.white : COLORS.primary}
                            />
                        </View>
                        <View style={styles.sectorInfo}>
                            <Text style={styles.sectorName}>{sector.name}</Text>
                            <Text style={styles.sectorDesc}>{sector.description}</Text>
                            <View style={styles.roiBadge}>
                                <Text style={styles.roiText}>Est. ROI: {sector.roi}</Text>
                            </View>
                        </View>
                        {selectedSector === sector.id && (
                            <Ionicons name="checkmark-circle" size={24} color={COLORS.secondary} />
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderStep2 = () => {
        const sectorData = SECTORS.find(s => s.id === selectedSector);
        const calculatedROI = amount ? (parseInt(amount.replace(/[^0-9]/g, "")) * 0.15).toLocaleString() : "0";

        return (
            <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>Define your stake</Text>
                <Text style={styles.stepSubtitle}>How much would you like to invest in {sectorData?.name}?</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.currencyPrefix}>KSh</Text>
                    <TextInput
                        style={styles.amountInput}
                        placeholder="0.00"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                        placeholderTextColor={COLORS.heritageAccent}
                        autoFocus
                    />
                </View>

                <View style={styles.quickSelectGrid}>
                    {["10000", "50000", "100000"].map((val) => (
                        <TouchableOpacity
                            key={val}
                            style={styles.quickBtn}
                            onPress={() => setAmount(val)}
                        >
                            <Text style={styles.quickBtnText}>+ KSh {parseInt(val).toLocaleString()}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.projectionCard}>
                    <View style={styles.projectionHeader}>
                        <Ionicons name="trending-up" size={20} color={COLORS.secondary} />
                        <Text style={styles.projectionTitle}>Investment Projection</Text>
                    </View>
                    <View style={styles.projectionDivider} />
                    <View style={styles.projectionRow}>
                        <Text style={styles.projectionLabel}>Est. Annual Returns</Text>
                        <Text style={styles.projectionValue}>KSh {calculatedROI}</Text>
                    </View>
                    <View style={styles.projectionRow}>
                        <Text style={styles.projectionLabel}>Project Tenure</Text>
                        <Text style={styles.projectionValue}>12 Months</Text>
                    </View>
                    <Text style={styles.projectionNote}>
                        *Projections based on historical {sectorData?.name} performance.
                    </Text>
                </View>
            </View>
        );
    };

    const renderStep3 = () => {
        const sectorData = SECTORS.find(s => s.id === selectedSector);
        return (
            <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>Review investment</Text>
                <Text style={styles.stepSubtitle}>Please confirm your selection below.</Text>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Sector</Text>
                        <Text style={styles.summaryValue}>{sectorData?.name}</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total Stake</Text>
                        <Text style={styles.summaryValue}>KSh {parseInt(amount || "0").toLocaleString()}</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Target ROI</Text>
                        <Text style={styles.summaryValue}>{sectorData?.roi}</Text>
                    </View>
                </View>

                <View style={styles.warningBox}>
                    <Ionicons name="information-circle" size={20} color={COLORS.primary} />
                    <Text style={styles.warningText}>
                        By proceeding, you agree to the Zamani Investment Terms and Conditions.
                    </Text>
                </View>
            </View>
        );
    };

    const handleComplete = () => {
        router.replace("/(tabs)/home");
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Step {step} of 3</Text>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${(step / 3) * 100}%` }]} />
                    </View>
                </View>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.content}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </View>

            {/* Footer Navigation */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.nextBtn,
                        (step === 1 && !selectedSector) || (step === 2 && !amount) ? styles.disabledBtn : null
                    ]}
                    onPress={step === 3 ? handleComplete : handleNext}
                    disabled={(step === 1 && !selectedSector) || (step === 2 && !amount)}
                >
                    <Text style={styles.nextBtnText}>
                        {step === 3 ? "Complete Investment" : "Continue"}
                    </Text>
                    {step < 3 && <Ionicons name="arrow-forward" size={20} color={COLORS.white} />}
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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    progressHeader: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 20,
    },
    progressLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.textLight,
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    progressBarBg: {
        width: "100%",
        height: 6,
        backgroundColor: "rgba(10, 31, 68, 0.1)",
        borderRadius: 3,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: COLORS.primary,
        borderRadius: 3,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    stepContainer: {
        flex: 1,
        paddingTop: 10,
    },
    stepTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 8,
    },
    stepSubtitle: {
        fontSize: 15,
        color: COLORS.textLight,
        lineHeight: 22,
        marginBottom: 30,
    },
    sectorList: {
        flex: 1,
    },
    sectorCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: "transparent",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    selectedCard: {
        borderColor: COLORS.secondary,
        backgroundColor: "rgba(11, 61, 46, 0.02)",
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: COLORS.heritage,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    selectedIconContainer: {
        backgroundColor: COLORS.secondary,
    },
    sectorInfo: {
        flex: 1,
        marginRight: 10,
    },
    sectorName: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 4,
    },
    sectorDesc: {
        fontSize: 13,
        color: COLORS.textLight,
        lineHeight: 18,
        marginBottom: 8,
    },
    roiBadge: {
        backgroundColor: "rgba(52, 199, 89, 0.1)",
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    roiText: {
        fontSize: 11,
        fontWeight: "700",
        color: COLORS.success,
    },
    footer: {
        padding: 24,
        backgroundColor: COLORS.heritage,
        borderTopWidth: 1,
        borderTopColor: "rgba(0,0,0,0.05)",
    },
    nextBtn: {
        flexDirection: "row",
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    disabledBtn: {
        backgroundColor: COLORS.heritageAccent,
    },
    nextBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "700",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderRadius: 20,
        paddingHorizontal: 20,
        height: 80,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "rgba(10, 31, 68, 0.1)",
    },
    currencyPrefix: {
        fontSize: 24,
        fontWeight: "700",
        color: COLORS.primary,
        marginRight: 10,
    },
    amountInput: {
        flex: 1,
        fontSize: 32,
        fontWeight: "700",
        color: COLORS.primary,
    },
    quickSelectGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    quickBtn: {
        backgroundColor: "rgba(10, 31, 68, 0.05)",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(10, 31, 68, 0.1)",
    },
    quickBtnText: {
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.primary,
    },
    projectionCard: {
        backgroundColor: COLORS.secondary,
        borderRadius: 24,
        padding: 24,
        elevation: 4,
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
    },
    projectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    projectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.white,
        marginLeft: 10,
    },
    projectionDivider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.1)",
        marginBottom: 20,
    },
    projectionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    projectionLabel: {
        fontSize: 14,
        color: "rgba(255,255,255,0.7)",
    },
    projectionValue: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.white,
    },
    projectionNote: {
        fontSize: 11,
        color: "rgba(255,255,255,0.5)",
        fontStyle: "italic",
        marginTop: 8,
    },
    summaryCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    summaryItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: COLORS.textLight,
        fontWeight: "500",
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primary,
    },
    summaryDivider: {
        height: 1,
        backgroundColor: "rgba(0,0,0,0.05)",
    },
    warningBox: {
        flexDirection: "row",
        backgroundColor: "rgba(10, 31, 68, 0.05)",
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
        gap: 12,
    },
    warningText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.textLight,
        lineHeight: 18,
    },
});
