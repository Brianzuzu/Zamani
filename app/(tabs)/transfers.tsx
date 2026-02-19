import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

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

export default function TransfersScreen() {
    const [amount, setAmount] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const recentTransfers = [
        { id: "1", name: "Sarah Kamau", type: "M-Pesa", amount: "KSh 5,000", date: "Yesterday" },
        { id: "2", name: "David Maina", type: "Zamani User", amount: "KSh 2,400", date: "2 days ago" },
        { id: "3", name: "Heritage Home Trust", type: "Bank Transfer", amount: "KSh 50,000", date: "Feb 10" },
    ];

    const transferOptions = [
        { id: "1", title: "Mobile Money", icon: "phone-portrait", color: "#66BB6A" },
        { id: "2", title: "Bank Transfer", icon: "business", color: "#42A5F5" },
        { id: "3", title: "Zamani User", icon: "person", color: COLORS.primary },
        { id: "4", title: "International", icon: "globe", color: COLORS.secondary },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Support</Text>
                    <Text style={styles.headerSubtitle}>Direct help & remittances</Text>
                </View>
                <TouchableOpacity style={styles.historyBtn}>
                    <Ionicons name="time-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Send Section */}
                <View style={styles.transferGrid}>
                    {transferOptions.map((option) => (
                        <TouchableOpacity key={option.id} style={styles.transferOption}>
                            <View style={[styles.iconCircle, { backgroundColor: option.color + "15" }]}>
                                <Ionicons name={option.icon as any} size={28} color={option.color} />
                            </View>
                            <Text style={styles.optionTitle}>{option.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Quick Send Input (Mock) */}
                <View style={styles.quickSendCard}>
                    <Text style={styles.sectionTitle}>Quick Send</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.currency}>KSh</Text>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="0.00"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />
                    </View>
                    <TouchableOpacity style={styles.sendBtn}>
                        <Text style={styles.sendBtnText}>Enter Recipient Details</Text>
                        <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
                    </TouchableOpacity>
                </View>

                {/* Recent Transfers */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Transfers</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                {recentTransfers.map((item) => (
                    <View key={item.id} style={styles.recentItem}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                        </View>
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemType}>{item.type} • {item.date}</Text>
                        </View>
                        <Text style={styles.itemAmount}>{item.amount}</Text>
                    </View>
                ))}

                <View style={styles.infobox}>
                    <Ionicons name="shield-checkmark" size={20} color={COLORS.secondary} />
                    <Text style={styles.infoText}>
                        Transfers are secure and encrypted. Funds are typically delivered within 60 seconds.
                    </Text>
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
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: COLORS.primary,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 2,
    },
    historyBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: COLORS.white,
        justifyContent: "center",
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 100,
    },
    transferGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 10,
        marginBottom: 30,
    },
    transferOption: {
        width: (width - 60) / 2,
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 20,
        marginBottom: 12,
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    optionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.primary,
    },
    quickSendCard: {
        backgroundColor: COLORS.secondary,
        borderRadius: 28,
        padding: 24,
        marginBottom: 32,
        elevation: 4,
        shadowColor: COLORS.secondary,
        shadowOpacity: 0.2,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 16,
    },
    quickSendCardTitle: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 16,
        paddingHorizontal: 20,
        height: 64,
        marginBottom: 20,
    },
    currency: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.white,
        marginRight: 10,
    },
    amountInput: {
        flex: 1,
        fontSize: 24,
        fontWeight: "700",
        color: COLORS.white,
    },
    sendBtn: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        height: 54,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    sendBtnText: {
        fontSize: 15,
        fontWeight: "800",
        color: COLORS.secondary,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    seeAllText: {
        fontSize: 14,
        color: COLORS.secondary,
        fontWeight: "600",
    },
    recentItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: COLORS.heritage,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.secondary,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primary,
    },
    itemType: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 2,
    },
    itemAmount: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.primary,
    },
    infobox: {
        flexDirection: "row",
        backgroundColor: "rgba(11, 61, 46, 0.05)",
        padding: 20,
        borderRadius: 24,
        marginTop: 20,
        alignItems: "center",
        gap: 15,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.textLight,
        lineHeight: 18,
    },
});
