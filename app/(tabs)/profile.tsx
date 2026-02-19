import React from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions
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
    warning: "#FF9500",
    danger: "#FF3B30",
};

export default function ProfileScreen() {
    const user = {
        name: "Brian Omondi",
        email: "brian.omondi@zamani.io",
        membership: "Zamani Elite",
        since: "Member since 2024",
        initials: "BO"
    };

    const stats = [
        { label: "Net Worth", value: "KSh 2.45M", icon: "wallet-outline" },
        { label: "Overall ROI", value: "+14.2%", icon: "trending-up-outline", isSuccess: true },
        { label: "Ventures", value: "8 Active", icon: "rocket-outline" },
    ];

    const menuItems = [
        {
            title: "Account Security",
            icon: "shield-checkmark-outline",
            subtitle: "Password, Biometrics, 2FA"
        },
        {
            title: "Payment Methods",
            icon: "card-outline",
            subtitle: "M-Pesa, Bank Accounts"
        },
        {
            title: "Notifications",
            icon: "notifications-outline",
            subtitle: "Investment alerts, Updates"
        },
        {
            title: "Document Center",
            icon: "document-text-outline",
            subtitle: "Statements, Certificates"
        },
        {
            title: "Support & Help",
            icon: "chatbubble-ellipses-outline",
            subtitle: "FAQs, Contact Support"
        },
        {
            title: "Legal & Privacy",
            icon: "information-circle-outline",
            subtitle: "Terms of service, Privacy"
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Account</Text>
                <TouchableOpacity style={styles.editBtn}>
                    <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{user.initials}</Text>
                        </View>
                        <View style={styles.badgeContainer}>
                            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                        </View>
                    </View>

                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>

                    <View style={styles.membershipBadge}>
                        <Ionicons name="star" size={14} color={COLORS.heritage} />
                        <Text style={styles.membershipText}>{user.membership}</Text>
                    </View>
                </View>

                {/* Portfolio Stats */}
                <View style={styles.statsRow}>
                    {stats.map((stat, index) => (
                        <View key={index} style={styles.statCard}>
                            <View style={styles.statIconContainer}>
                                <Ionicons name={stat.icon as any} size={20} color={COLORS.secondary} />
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Menu Section */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.menuItem,
                                index === menuItems.length - 1 && { borderBottomWidth: 0 }
                            ]}
                        >
                            <View style={styles.menuIconCircle}>
                                <Ionicons name={item.icon as any} size={22} color={COLORS.primary} />
                            </View>
                            <View style={styles.menuTextContainer}>
                                <Text style={styles.menuItemTitle}>{item.title}</Text>
                                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.heritageAccent} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutBtn}>
                    <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Zamani v1.2.4 (Alpha)</Text>
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
    editBtn: {
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
        paddingBottom: 120, // Extra space for tab bar
    },
    profileCard: {
        backgroundColor: COLORS.white,
        borderRadius: 32,
        padding: 32,
        alignItems: "center",
        marginTop: 8,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 40,
        backgroundColor: COLORS.secondary,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        fontSize: 36,
        fontWeight: "800",
        color: COLORS.white,
        letterSpacing: 2,
    },
    badgeContainer: {
        position: "absolute",
        bottom: -4,
        right: -4,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 2,
    },
    userName: {
        fontSize: 24,
        fontWeight: "800",
        color: COLORS.primary,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 16,
    },
    membershipBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 8,
    },
    membershipText: {
        fontSize: 12,
        fontWeight: "800",
        color: COLORS.white,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 16,
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
    },
    statIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: "rgba(11, 61, 46, 0.05)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    statValue: {
        fontSize: 15,
        fontWeight: "800",
        color: COLORS.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: COLORS.textLight,
        fontWeight: "600",
    },
    menuContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        marginTop: 32,
        padding: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.03)",
    },
    menuIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: COLORS.heritage,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primary,
    },
    menuItemSubtitle: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 2,
    },
    logoutBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 32,
        gap: 10,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.danger,
    },
    versionText: {
        textAlign: "center",
        marginTop: 24,
        fontSize: 12,
        color: COLORS.heritageAccent,
        fontWeight: "600",
    },
});
