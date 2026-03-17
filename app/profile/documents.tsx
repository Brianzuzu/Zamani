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

export default function DocumentsScreen() {
    const router = useRouter();

    const documents = [
        { id: "1", title: "Jan 2024 Statement", date: "Feb 01, 2024", size: "1.2 MB" },
        { id: "2", title: "Dairy Farm Certificate", date: "Jan 15, 2024", size: "2.5 MB" },
        { id: "3", title: "Dec 2023 Statement", date: "Jan 01, 2024", size: "1.1 MB" },
        { id: "4", title: "Solar Project Proof", date: "Dec 20, 2023", size: "3.4 MB" },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Document Center</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>Recent Documents</Text>

                {documents.map((doc) => (
                    <TouchableOpacity key={doc.id} style={styles.docCard}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="document-text" size={24} color={COLORS.secondary} />
                        </View>
                        <View style={styles.docInfo}>
                            <Text style={styles.docTitle}>{doc.title}</Text>
                            <Text style={styles.docDetail}>{doc.date} • {doc.size}</Text>
                        </View>
                        <Ionicons name="download-outline" size={22} color={COLORS.primary} />
                    </TouchableOpacity>
                ))}

                <View style={styles.infobox}>
                    <Ionicons name="cloud-done-outline" size={24} color={COLORS.secondary} />
                    <Text style={styles.infoText}>
                        Your investment certificates and monthly statements are permanently saved here.
                    </Text>
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
    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.textLight,
        marginBottom: 16,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    docCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        elevation: 2,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "rgba(11, 61, 46, 0.05)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    docInfo: { flex: 1 },
    docTitle: { fontSize: 15, fontWeight: "700", color: COLORS.primary },
    docDetail: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
    infobox: {
        flexDirection: "row",
        backgroundColor: "rgba(11, 61, 46, 0.05)",
        padding: 20,
        borderRadius: 24,
        alignItems: "center",
        gap: 15,
        marginTop: 20,
    },
    infoText: { flex: 1, fontSize: 13, color: COLORS.textLight, lineHeight: 18 },
});
