import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Dimensions,
    KeyboardAvoidingView,
    Platform
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
};

const GOAL_CATEGORIES = [
    { id: "house_build", name: "Build a House", icon: "home-outline" },
    { id: "house_buy", name: "Buy a House", icon: "key-outline" },
    { id: "car", name: "Buy a Car", icon: "car-outline" },
    { id: "land", name: "Buy Land", icon: "map-outline" },
    { id: "business", name: "Start Business", icon: "briefcase-outline" },
    { id: "family", name: "Support Family", icon: "people-outline" },
    { id: "other", name: "Other relevant goal", icon: "star-outline" },
];

export default function CreateGoalScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [selectedCategory, setSelectedCategory] = useState<string | null>((params.category as string)?.toLowerCase() || null);
    const [goalName, setGoalName] = useState((params.title as string) || "");
    const [targetAmount, setTargetAmount] = useState((params.target as string) || "");
    const [timeline, setTimeline] = useState("12"); // Months

    // Effect to handle late param loading if needed, but useLocalSearchParams is usually sync
    React.useEffect(() => {
        if (params.title) setGoalName(params.title as string);
        if (params.target) setTargetAmount(params.target as string);
        if (params.category) setSelectedCategory((params.category as string).toLowerCase());
    }, [params]);

    // Parse business-specific metadata if available
    const capitalBreakdown = params.capitalBreakdown ? JSON.parse(params.capitalBreakdown as string) : null;
    const revenueProjection = params.revenueProjection ? JSON.parse(params.revenueProjection as string) : null;
    const isBusinessProject = params.category === "Business";

    const handleCreate = () => {
        // Navigate to deposit screen to make the first payment/setup
        router.push({
            pathname: "/savings/deposit",
            params: {
                category: isBusinessProject ? "Business" : selectedCategory,
                title: goalName,
                target: targetAmount,
                revenueProjection: params.revenueProjection,
                riskLevel: params.riskLevel
            }
        } as any);
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
                    <Text style={styles.headerTitle}>
                        {isBusinessProject ? "Professional Business Plan" : "New Savings Goal"}
                    </Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {isBusinessProject ? (
                        <>
                            <Text style={styles.sectionTitle}>Business Strategy: {goalName}</Text>
                            <Text style={styles.sectionSubtitle}>We've prepared a professional roadmap based on your chosen opportunity.</Text>

                            <View style={styles.bizPlanCard}>
                                <View style={styles.bizPlanHeader}>
                                    <Ionicons name="briefcase" size={20} color={COLORS.white} />
                                    <Text style={styles.bizPlanTitle}>Execution Roadmap</Text>
                                </View>

                                <View style={styles.bizSection}>
                                    <Text style={styles.bizLabel}>Total Funding Required</Text>
                                    <Text style={styles.bizValue}>KES {Number(targetAmount).toLocaleString()}</Text>
                                </View>

                                <View style={styles.bizDivider} />

                                <View style={styles.bizSection}>
                                    <Text style={styles.bizLabel}>Projected Net Monthly Profit</Text>
                                    <Text style={[styles.bizValue, { color: COLORS.success }]}>
                                        KES {revenueProjection?.netProfit || "0"}
                                    </Text>
                                </View>

                                <View style={styles.bizDivider} />

                                <View style={styles.bizSection}>
                                    <Text style={styles.bizLabel}>Estimated Break-even</Text>
                                    <Text style={styles.bizValue}>{revenueProjection?.breakEven || "N/A"}</Text>
                                </View>
                            </View>

                            <Text style={[styles.label, { marginTop: 24, marginBottom: 12 }]}>Refine Your Target</Text>
                        </>
                    ) : (
                        <>
                            <Text style={styles.sectionTitle}>What are you saving for?</Text>
                            <Text style={styles.sectionSubtitle}>Choose a category for your personal goal</Text>

                            <View style={styles.categoryGrid}>
                                {GOAL_CATEGORIES.map((cat) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={[
                                            styles.categoryCard,
                                            selectedCategory === cat.id && styles.selectedCategoryCard
                                        ]}
                                        onPress={() => {
                                            setSelectedCategory(cat.id);
                                            if (!goalName) setGoalName(cat.name);
                                        }}
                                    >
                                        <View style={[
                                            styles.iconContainer,
                                            selectedCategory === cat.id && styles.selectedIconContainer
                                        ]}>
                                            <Ionicons
                                                name={cat.icon as any}
                                                size={24}
                                                color={selectedCategory === cat.id ? COLORS.white : COLORS.primary}
                                            />
                                        </View>
                                        <Text style={[
                                            styles.categoryName,
                                            selectedCategory === cat.id && styles.selectedCategoryName
                                        ]}>{cat.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Goal Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. My First Home"
                                value={goalName}
                                onChangeText={setGoalName}
                                placeholderTextColor={COLORS.heritageAccent}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Target Amount (KSh)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0.00"
                                keyboardType="numeric"
                                value={targetAmount}
                                onChangeText={setTargetAmount}
                                placeholderTextColor={COLORS.heritageAccent}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Timeline (Months)</Text>
                            <View style={styles.timelineRow}>
                                {["6", "12", "24", "36"].map((t) => (
                                    <TouchableOpacity
                                        key={t}
                                        style={[
                                            styles.timelineBtn,
                                            timeline === t && styles.selectedTimelineBtn
                                        ]}
                                        onPress={() => setTimeline(t)}
                                    >
                                        <Text style={[
                                            styles.timelineBtnText,
                                            timeline === t && styles.selectedTimelineBtnText
                                        ]}>{t}m</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    <View style={styles.infoBox}>
                        <Ionicons name="bulb-outline" size={20} color={COLORS.secondary} />
                        <Text style={styles.infoText}>
                            {isBusinessProject
                                ? "This goal is linked to a business opportunity. Once fully funded, you'll unlock the Execution Mode to launch."
                                : "Zamani Savings are personal. You decide how much and how often to save based on your weight."}
                        </Text>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.createBtn,
                            (!selectedCategory || !targetAmount) && styles.disabledBtn
                        ]}
                        onPress={handleCreate}
                        disabled={!selectedCategory || !targetAmount}
                    >
                        <Text style={styles.createBtnText}>Start Saving</Text>
                    </TouchableOpacity>
                </View>
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
        fontSize: 24,
        fontWeight: "700",
        color: COLORS.primary,
        marginTop: 10,
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 15,
        color: COLORS.textLight,
        marginBottom: 24,
    },
    categoryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 32,
    },
    categoryCard: {
        width: (width - 64) / 3,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 16,
        alignItems: "center",
        marginBottom: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        borderWidth: 2,
        borderColor: "transparent",
    },
    selectedCategoryCard: {
        borderColor: COLORS.secondary,
        backgroundColor: "rgba(11, 61, 46, 0.02)",
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: COLORS.heritage,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    selectedIconContainer: {
        backgroundColor: COLORS.secondary,
    },
    categoryName: {
        fontSize: 11,
        fontWeight: "700",
        color: COLORS.primary,
        textAlign: "center",
    },
    selectedCategoryName: {
        color: COLORS.secondary,
    },
    form: {
        gap: 24,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.text,
        marginLeft: 4,
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        height: 56,
        paddingHorizontal: 20,
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: "600",
        borderWidth: 1,
        borderColor: "rgba(10, 31, 68, 0.05)",
    },
    timelineRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    timelineBtn: {
        flex: 1,
        height: 48,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: "rgba(10, 31, 68, 0.05)",
    },
    selectedTimelineBtn: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    timelineBtnText: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.primary,
    },
    selectedTimelineBtnText: {
        color: COLORS.white,
    },
    infoBox: {
        flexDirection: "row",
        backgroundColor: "rgba(11, 61, 46, 0.05)",
        padding: 16,
        borderRadius: 16,
        marginTop: 32,
        alignItems: "center",
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.textLight,
        lineHeight: 18,
    },
    footer: {
        padding: 24,
        backgroundColor: COLORS.heritage,
        borderTopWidth: 1,
        borderTopColor: "rgba(0,0,0,0.05)",
    },
    createBtn: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    disabledBtn: {
        backgroundColor: COLORS.heritageAccent,
    },
    createBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "800",
    },
    bizPlanCard: {
        backgroundColor: COLORS.primary,
        borderRadius: 24,
        padding: 24,
        marginTop: 16,
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
    },
    bizPlanHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
    },
    bizPlanTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.white,
    },
    bizSection: {
        marginVertical: 4,
    },
    bizLabel: {
        fontSize: 12,
        color: "rgba(255,255,255,0.7)",
        marginBottom: 4,
    },
    bizValue: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.white,
    },
    bizDivider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.1)",
        marginVertical: 16,
    },
});
