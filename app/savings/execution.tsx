import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Width is unused

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

export default function BusinessExecutionScreen() {
    const router = useRouter();
    const [checklist, setChecklist] = useState([
        { id: 1, text: "County Business Permit", completed: true },
        { id: 2, text: "KRA Tax Registration", completed: true },
        { id: 3, text: "Site Inspection & Lease", completed: false },
        { id: 4, text: "Equipment Procurement", completed: false },
        { id: 5, text: "Staff Hiring & Training", completed: false },
    ]);

    const toggleItem = (id: number) => {
        setChecklist(prev => prev.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Business Execution</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.heroSection}>
                    <View style={styles.rocketCircle}>
                        <Ionicons name="rocket" size={40} color={COLORS.white} />
                    </View>
                    <Text style={styles.heroTitle}>Launch Phase Initiated</Text>
                    <Text style={styles.heroSubtitle}>
                        Your Poultry Farming project is fully funded. Follow this roadmap to go live.
                    </Text>
                </View>

                {/* Progress Overview */}
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressTitle}>Launch Readiness</Text>
                        <Text style={styles.progressValue}>
                            {checklist.filter(i => i.completed).length}/{checklist.length} Steps
                        </Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${(checklist.filter(i => i.completed).length / checklist.length) * 100}%` }
                            ]}
                        />
                    </View>
                </View>

                {/* Checklist Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Execution Checklist</Text>
                    {checklist.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.checkItem}
                            onPress={() => toggleItem(item.id)}
                        >
                            <View style={[
                                styles.checkbox,
                                item.completed && styles.checkboxActive
                            ]}>
                                {item.completed && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
                            </View>
                            <Text style={[
                                styles.checkText,
                                item.completed && styles.checkTextDone
                            ]}>{item.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Equipment Ordering */}
                <View style={styles.orderCard}>
                    <View style={styles.cardInfo}>
                        <Ionicons name="cart-outline" size={24} color={COLORS.secondary} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.cardTitle}>Order Equipment</Text>
                            <Text style={styles.cardSubtitle}>Direct delivery from Savannah Partners</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.orderBtn}
                        onPress={() => router.push("/savings/input-shop")}
                    >
                        <Text style={styles.orderBtnText}>Open Input Shop</Text>
                        <Ionicons name="chevron-forward" size={16} color={COLORS.white} />
                    </TouchableOpacity>
                </View>

                <View style={[styles.orderCard, { backgroundColor: COLORS.primary, marginTop: 12 }]}>
                    <View style={styles.cardInfo}>
                        <Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.white} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={[styles.cardTitle, { color: COLORS.white }]}>Execution Assistant</Text>
                            <Text style={[styles.cardSubtitle, { color: 'rgba(255,255,255,0.7)' }]}>Chat with a Zamani consultant</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.orderBtn, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                        <Text style={[styles.orderBtnText, { color: COLORS.white }]}>Start Chat</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.completeBtn}>
                    <Text style={styles.completeBtnText}>Finalize Setup</Text>
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
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.primary,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 100,
    },
    heroSection: {
        alignItems: "center",
        paddingVertical: 32,
    },
    rocketCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.secondary,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        elevation: 10,
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: COLORS.primary,
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 15,
        color: COLORS.textLight,
        textAlign: "center",
        lineHeight: 22,
    },
    progressCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        elevation: 2,
    },
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 16,
    },
    progressTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primary,
    },
    progressValue: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.secondary,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: "#F0F0F0",
        borderRadius: 4,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: COLORS.secondary,
        borderRadius: 4,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 16,
    },
    checkItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: COLORS.heritageAccent,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    checkboxActive: {
        backgroundColor: COLORS.success,
        borderColor: COLORS.success,
    },
    checkText: {
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.primary,
    },
    checkTextDone: {
        color: COLORS.textLight,
        textDecorationLine: "line-through",
    },
    orderCard: {
        backgroundColor: "rgba(11, 61, 46, 0.05)",
        borderRadius: 20,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    cardInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: COLORS.primary,
    },
    cardSubtitle: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 2,
    },
    orderBtn: {
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    orderBtnText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "700",
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: "transparent",
    },
    completeBtn: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
    },
    completeBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "800",
    },
});
