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
import { savingsService } from "../config/savingsService";
import { Alert } from "react-native";
import axios from "axios";
import { API_URL } from "../config/authService";
import { auth } from "../config/firebase";
import { convertCurrency, formatCurrency } from "../../constants/currency";

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

const PROJECT_SECTORS = [
    { id: "Managed Lands", name: "Managed Lands", icon: "map" },
    { id: "Build or Buy a House", name: "Build or Buy", icon: "business" },
    { id: "Vehicle Sourcing", name: "Vehicle Sourcing", icon: "car-sport" },
    { id: "Business Opps", name: "Business Opps", icon: "bulb" },
    { id: "Utilities and Products", name: "Utilities", icon: "cart" },
];

const AVAILABLE_PROJECTS = [
    // Managed Lands
    { id: "hot_1", sectorId: "Managed Lands", name: "Syokimau Prime Plots", target: "1200000", icon: "map", category: "land" },
    { id: "4", sectorId: "Managed Lands", name: "Kasarani Heights Plots", target: "1500000", icon: "map", category: "land" },
    { id: "1", sectorId: "Managed Lands", name: "Rift Valley Macro-Farm", target: "20000000", icon: "map", category: "land" },

    // Construction
    { id: "mansion_001", sectorId: "Build or Buy a House", name: "5 Bedroom Mansion - Syokimau", target: "18000000", icon: "home", category: "house_build" },
    { id: "hot_re_1", sectorId: "Build or Buy a House", name: "Westlands Luxury Lofts", target: "9500000", icon: "business", category: "house_buy" },
    { id: "hot_re_2", sectorId: "Build or Buy a House", name: "Karen Heights Villa", target: "45000000", icon: "business", category: "house_buy" },

    // Vehicles
    { id: "hot_veh_1", sectorId: "Vehicle Sourcing", name: "2018 Toyota Prado TX", target: "5800000", icon: "car", category: "car" },
    { id: "hot_veh_2", sectorId: "Vehicle Sourcing", name: "2019 Toyota Harrier", target: "4200000", icon: "car", category: "car" },

    // Business
    { id: "biz_001", sectorId: "Business Opps", name: "Poultry Farming (Layers)", target: "400000", icon: "egg", category: "business" },
    { id: "biz_ag_002", sectorId: "Business Opps", name: "Greenhouse Tomato Farming", target: "850000", icon: "leaf", category: "business" },
];

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
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [goalName, setGoalName] = useState((params.title as string) || "");
    const [targetAmount, setTargetAmount] = useState((params.target as string) || "");
    const [timeline, setTimeline] = useState("12"); // Months
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
                console.error("Error fetching profile in create-goal:", error);
            }
        };
        fetchProfile();
    }, []);

    const currencySymbol = userProfile?.currencySymbol || "KSh";
    const preferredCurrency = userProfile?.preferredCurrency || "KES";

    // Effect to handle late param loading if needed, but useLocalSearchParams is usually sync
    React.useEffect(() => {
        if (params.title) setGoalName(params.title as string);
        if (params.target) setTargetAmount(params.target as string);
        if (params.category) setSelectedCategory((params.category as string).toLowerCase());
    }, [params]);

    // Parse business-specific metadata if available
    // const capitalBreakdown = params.capitalBreakdown ? JSON.parse(params.capitalBreakdown as string) : null;
    const revenueProjection = params.revenueProjection ? JSON.parse(params.revenueProjection as string) : null;
    const isBusinessProject = params.category === "Business";

    const handleProjectSelect = (proj: any) => {
        setSelectedProject(proj.id);
        setSelectedCategory(proj.category);
        setGoalName(proj.name);
        setTargetAmount(proj.target);
    };

    const handleCreate = async () => {
        try {
            const project = AVAILABLE_PROJECTS.find(p => p.id === selectedProject);
            
            // Check if projectId looks like a valid MongoDB ObjectId (24 hex characters)
            const isValidObjectId = (id: string | null) => {
                if (!id) return false;
                return /^[0-9a-fA-F]{24}$/.test(id);
            };

            const cleanTarget = typeof targetAmount === 'string' 
                ? Number(targetAmount.replace(/[^0-9.]/g, '')) 
                : Number(targetAmount);

            const goalData = {
                projectId: isValidObjectId(selectedProject) ? selectedProject : null,
                title: goalName,
                target: cleanTarget || 0,
                category: selectedCategory || (isBusinessProject ? "Business" : "General"),
                timeline: Number(timeline),
                type: isBusinessProject ? "Business" : (selectedProject ? "Project" : "Personal"),
                color: project?.category === "land" ? "#0B3D2E" : "#0A1F44",
                icon: project?.icon || "wallet-outline"
            };

            const newGoal = await savingsService.createGoal(goalData);

            router.push({
                pathname: "/savings/deposit",
                params: {
                    id: newGoal._id,
                    category: isBusinessProject ? "Business" : selectedCategory,
                    title: goalName,
                    target: targetAmount,
                    projectId: selectedProject
                }
            } as any);
        } catch (error: any) {
            console.error("Create goal error:", error);
            Alert.alert("Error", "Failed to create savings goal. Please try again.");
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
                            <Text style={styles.sectionSubtitle}>We&apos;ve prepared a professional roadmap based on your chosen opportunity.</Text>

                            <View style={styles.bizPlanCard}>
                                <View style={styles.bizPlanHeader}>
                                    <Ionicons name="briefcase" size={20} color={COLORS.white} />
                                    <Text style={styles.bizPlanTitle}>Execution Roadmap</Text>
                                </View>

                                <View style={styles.bizSection}>
                                    <Text style={styles.bizLabel}>Total Funding Required ({preferredCurrency})</Text>
                                    <Text style={styles.bizValue}>{formatCurrency(convertCurrency(Number(targetAmount), "KES", preferredCurrency), preferredCurrency, currencySymbol)}</Text>
                                </View>

                                <View style={styles.bizDivider} />

                                <View style={styles.bizSection}>
                                    <Text style={styles.bizLabel}>Projected Net Monthly Profit ({preferredCurrency})</Text>
                                    <Text style={[styles.bizValue, { color: COLORS.success }]}>
                                        {formatCurrency(convertCurrency(Number(revenueProjection?.netProfit || 0), "KES", preferredCurrency), preferredCurrency, currencySymbol)}
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
                            <Text style={styles.sectionTitle}>1. Choose a Sector</Text>
                            <Text style={styles.sectionSubtitle}>Select a project category to browse options</Text>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.projectScroll}
                            >
                                {PROJECT_SECTORS.map((sector) => (
                                    <TouchableOpacity
                                        key={sector.id}
                                        style={[
                                            styles.sectorCard,
                                            selectedSector === sector.id && styles.selectedSectorCard
                                        ]}
                                        onPress={() => {
                                            setSelectedSector(sector.id);
                                            setSelectedProject(null);
                                        }}
                                    >
                                        <View style={[
                                            styles.sectorIconContainer,
                                            selectedSector === sector.id && styles.selectedSectorIcon
                                        ]}>
                                            <Ionicons
                                                name={sector.icon as any}
                                                size={24}
                                                color={selectedSector === sector.id ? COLORS.white : COLORS.primary}
                                            />
                                        </View>
                                        <Text style={styles.sectorName}>{sector.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {selectedSector && (
                                <View style={{ marginTop: 24 }}>
                                    <View style={styles.titleRow}>
                                        <Text style={styles.sectionTitle}>2. Select specific Project</Text>
                                        <View style={styles.sectorBadge}>
                                            <Text style={styles.sectorBadgeText}>{selectedSector}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.sectionSubtitle}>Choose which project to save towards</Text>

                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        style={styles.projectScroll}
                                    >
                                        {AVAILABLE_PROJECTS.filter(p => p.sectorId === selectedSector).map((proj) => (
                                            <TouchableOpacity
                                                key={proj.id}
                                                style={[
                                                    styles.projectCard,
                                                    selectedProject === proj.id && styles.selectedProjectCard
                                                ]}
                                                onPress={() => handleProjectSelect(proj)}
                                            >
                                                <View style={[
                                                    styles.projIconContainer,
                                                    selectedProject === proj.id && styles.selectedProjIcon
                                                ]}>
                                                    <Ionicons
                                                        name={proj.icon as any}
                                                        size={24}
                                                        color={selectedProject === proj.id ? COLORS.white : COLORS.primary}
                                                    />
                                                </View>
                                                <Text style={styles.projName} numberOfLines={2}>{proj.name}</Text>
                                                <Text style={styles.projTarget}>{currencySymbol} {convertCurrency(Number(proj.target), "KES", preferredCurrency).toLocaleString()}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}

                            <View style={styles.dividerRow}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>OR CREATE PERSONAL GOAL</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <View style={styles.categoryGrid}>
                                {GOAL_CATEGORIES.map((cat) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={[
                                            styles.categoryCard,
                                            selectedCategory === cat.id && !selectedProject && styles.selectedCategoryCard
                                        ]}
                                        onPress={() => {
                                            setSelectedProject(null);
                                            setSelectedSector(null);
                                            setSelectedCategory(cat.id);
                                            if (!goalName) setGoalName(cat.name);
                                        }}
                                    >
                                        <View style={[
                                            styles.iconContainer,
                                            selectedCategory === cat.id && !selectedProject && styles.selectedIconContainer
                                        ]}>
                                            <Ionicons
                                                name={cat.icon as any}
                                                size={24}
                                                color={selectedCategory === cat.id && !selectedProject ? COLORS.white : COLORS.primary}
                                            />
                                        </View>
                                        <Text style={[
                                            styles.categoryName,
                                            selectedCategory === cat.id && !selectedProject && styles.selectedCategoryName
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
                            <Text style={styles.label}>Target Amount ({preferredCurrency})</Text>
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
        marginBottom: 16,
    },
    projectScroll: {
        marginBottom: 8,
    },
    sectorCard: {
        width: 120,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 12,
        marginRight: 16,
        borderWidth: 2,
        borderColor: "transparent",
        alignItems: "center",
        elevation: 2,
    },
    selectedSectorCard: {
        borderColor: COLORS.secondary,
        backgroundColor: "rgba(11, 61, 46, 0.02)",
    },
    sectorIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: COLORS.heritage,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    selectedSectorIcon: {
        backgroundColor: COLORS.secondary,
    },
    sectorName: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.primary,
        textAlign: "center",
    },
    sectorBadge: {
        backgroundColor: COLORS.heritage,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    sectorBadgeText: {
        fontSize: 10,
        fontWeight: "800",
        color: COLORS.secondary,
    },
    projectCard: {
        width: 160,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 16,
        marginRight: 16,
        borderWidth: 2,
        borderColor: "transparent",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    selectedProjectCard: {
        borderColor: COLORS.secondary,
        backgroundColor: "rgba(11, 61, 46, 0.02)",
    },
    projIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: COLORS.heritage,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    selectedProjIcon: {
        backgroundColor: COLORS.secondary,
    },
    projName: {
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.primary,
        lineHeight: 18,
        height: 36,
        marginBottom: 4,
    },
    projTarget: {
        fontSize: 12,
        color: COLORS.secondary,
        fontWeight: "600",
    },
    categoryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginTop: 12,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginVertical: 32,
        gap: 12,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "rgba(0,0,0,0.05)",
    },
    dividerText: {
        fontSize: 10,
        fontWeight: "800",
        color: COLORS.heritageAccent,
        letterSpacing: 1,
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
