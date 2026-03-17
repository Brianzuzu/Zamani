import React from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

const COLORS = {
    primary: "#0A1F44",
    secondary: "#0B3D2E",
    heritage: "#F5EFE7",
    heritageAccent: "#D4C2AD", // Heritage Tan
    white: "#FFFFFF",
    textLight: "#666666",
};

export default function LegalScreen() {
    const router = useRouter();

    const sections = [
        { title: "Terms of Service", content: "By using Zamani, you agree to our terms regarding investment risks and platform usage. We aim to provide a transparent and secure environment for all users." },
        { title: "Privacy Policy", content: "Your data is yours. We use high-level encryption to protect your personal and financial information. We never sell your data to third parties." },
        { title: "Cookie Policy", content: "We use essential cookies to provide a functional and optimized experience for our users." },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Legal & Privacy</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {sections.map((section, index) => (
                    <View key={index} style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <Text style={styles.sectionContent}>{section.content}</Text>
                        <TouchableOpacity style={styles.readMore}>
                            <Text style={styles.readMoreText}>Read Full Document</Text>
                            <Ionicons name="open-outline" size={16} color={COLORS.secondary} />
                        </TouchableOpacity>
                    </View>
                ))}

                <View style={styles.versionInfo}>
                    <Text style={styles.versionText}>Last Updated: Feb 15, 2024</Text>
                    <Text style={styles.versionText}>Zamani v1.2.4 (Kenya/International)</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.heritage },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: COLORS.white,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    headerTitle: { fontSize: 24, fontWeight: "800", color: COLORS.primary },
    scrollContent: { paddingHorizontal: 24, paddingVertical: 16 },
    sectionCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        elevation: 2,
    },
    sectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.primary, marginBottom: 12 },
    sectionContent: { fontSize: 14, color: COLORS.textLight, lineHeight: 22 },
    readMore: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        gap: 8,
    },
    readMoreText: { fontSize: 14, fontWeight: "700", color: COLORS.secondary },
    versionInfo: {
        alignItems: "center",
        marginTop: 20,
        marginBottom: 40,
    },
    versionText: { fontSize: 12, color: COLORS.heritageAccent, marginBottom: 4 },
});
