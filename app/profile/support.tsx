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
    white: "#FFFFFF",
    textLight: "#666666",
};

export default function SupportScreen() {
    const router = useRouter();

    const faqs = [
        { q: "How do I withdraw my funds?", a: "Go to the Savings tab, select your goal, and tap 'Withdraw'. Transfers are typically processed within 60 seconds." },
        { q: "Are my investments insured?", a: "All agricultural and infrastructure projects are covered under our Heritage Trust insurance partners." },
        { q: "Can I invest from abroad?", a: "Yes! You can use the International transfer option in the Support tab to fund your account from anywhere." },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Support & Help</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.heroCard}>
                    <Ionicons name="chatbubbles" size={40} color={COLORS.white} />
                    <Text style={styles.heroTitle}>How can we help?</Text>
                    <Text style={styles.heroSubtitle}>Our team is available 24/7 for you.</Text>
                </View>

                <View style={styles.contactRow}>
                    <TouchableOpacity style={styles.contactBtn}>
                        <Ionicons name="call" size={24} color={COLORS.secondary} />
                        <Text style={styles.contactText}>Call Us</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.contactBtn}>
                        <Ionicons name="mail" size={24} color={COLORS.secondary} />
                        <Text style={styles.contactText}>Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.contactBtn}>
                        <Ionicons name="chatbox-ellipses" size={24} color={COLORS.secondary} />
                        <Text style={styles.contactText}>Live Chat</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                {faqs.map((faq, index) => (
                    <View key={index} style={styles.faqCard}>
                        <Text style={styles.faqQ}>{faq.q}</Text>
                        <Text style={styles.faqA}>{faq.a}</Text>
                    </View>
                ))}
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
    heroCard: {
        backgroundColor: COLORS.primary,
        borderRadius: 28,
        padding: 32,
        alignItems: "center",
        marginBottom: 24,
    },
    heroTitle: { fontSize: 24, fontWeight: "800", color: COLORS.white, marginTop: 16 },
    heroSubtitle: { fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 8 },
    contactRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 32,
    },
    contactBtn: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 16,
        alignItems: "center",
        marginHorizontal: 4,
        elevation: 2,
    },
    contactText: { fontSize: 13, fontWeight: "700", color: COLORS.primary, marginTop: 8 },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 16,
    },
    faqCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 12,
    },
    faqQ: { fontSize: 16, fontWeight: "700", color: COLORS.primary, marginBottom: 8 },
    faqA: { fontSize: 14, color: COLORS.textLight, lineHeight: 20 },
});
