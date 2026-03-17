import React, { useState, useMemo } from "react";
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Modal,
    FlatList,
    Alert,
    ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COUNTRIES } from "../../constants/countries";
import { authService } from "../config/authService";

const COLORS = {
    primary: "#0A1F44", // Deep Blue
    secondary: "#0B3D2E", // Dark Emerald
    heritage: "#F5EFE7", // Savannah Stone
    heritageAccent: "#D4C2AD", // Heritage Tan
    background: "#F5EFE7",
    text: "#1A1A1A",
    textLight: "#666666",
    border: "#D4C2AD",
    white: "#FFFFFF",
    error: "#FF3B30"
};

export default function Signup() {
    const router = useRouter();
    const [name, setName] = useState("Brian Mwichigi");
    const [email, setEmail] = useState("brianmwichigi@gmail.com");
    const [phone, setPhone] = useState("");
    const [country, setCountry] = useState("United States of America");
    const [homeCountry, setHomeCountry] = useState("Kenya");
    const [password, setPassword] = useState("tiffany");

    // UI States
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [countryModalVisible, setCountryModalVisible] = useState(false);
    const [selectionType, setSelectionType] = useState<"current" | "home">("current");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCountries = useMemo(() => {
        return COUNTRIES.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const openCountryPicker = (type: "current" | "home") => {
        setSelectionType(type);
        setSearchQuery("");
        setCountryModalVisible(true);
    };

    const selectCountry = (countryName: string) => {
        const selectedCountryData = COUNTRIES.find(c => c.name === countryName);
        if (selectionType === "current") {
            setCountry(countryName);
            // Optionally store current country currency if needed later
        } else {
            setHomeCountry(countryName);
        }
        setCountryModalVisible(false);
    };

    const handleSignup = async () => {
        if (!name || !email || !password) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        setIsLoading(true);
        try {
            // Find currency info for current country
            const currentCountryData = COUNTRIES.find(c => c.name === country);
            const preferredCurrency = currentCountryData?.currency || "KES";
            const currencySymbol = currentCountryData?.symbol || "KSh";

            await authService.signup(name, email, password, {
                phone,
                currentCountry: country,
                homeCountry,
                preferredCurrency,
                currencySymbol,
                role: 'user'
            });
            Alert.alert(
                "Account Created! 🎉",
                "Your account has been created successfully. Please log in to continue.",
                [{ text: "Log In", onPress: () => router.replace("/login") }]
            );
        } catch (error: any) {
            console.error("Signup error:", error);
            Alert.alert("Registration Failed", error.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <View style={styles.logoPlaceholder}>
                            <Ionicons name="flash" size={40} color={COLORS.primary} />
                        </View>
                        <Text style={styles.title}>Join Zamani</Text>
                        <Text style={styles.subtitle}>Start your journey toward a secure future.</Text>
                    </View>

                    <View style={styles.form}>
                        {/* Full Name */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="person-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="John Doe"
                                    placeholderTextColor={COLORS.textLight}
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

                        {/* Email */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="your@email.com"
                                    placeholderTextColor={COLORS.textLight}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        {/* Phone */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Phone Number</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="call-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="+254 700 000 000"
                                    placeholderTextColor={COLORS.textLight}
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        {/* Country */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Country</Text>
                            <TouchableOpacity
                                style={styles.inputWrapper}
                                onPress={() => openCountryPicker("current")}
                            >
                                <Ionicons name="location-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                                <Text style={[styles.input, !country && { color: COLORS.textLight }]}>
                                    {country || "Select current country"}
                                </Text>
                                <Ionicons name="chevron-down" size={18} color={COLORS.textLight} />
                            </TouchableOpacity>
                        </View>

                        {/* Home Country */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Home Country</Text>
                            <TouchableOpacity
                                style={styles.inputWrapper}
                                onPress={() => openCountryPicker("home")}
                            >
                                <Ionicons name="home-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                                <Text style={[styles.input, !homeCountry && { color: COLORS.textLight }]}>
                                    {homeCountry || "Select home country"}
                                </Text>
                                <Ionicons name="chevron-down" size={18} color={COLORS.textLight} />
                            </TouchableOpacity>
                        </View>

                        {/* Password */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor={COLORS.textLight}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color={COLORS.textLight}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.signupButton}
                            onPress={handleSignup}
                            activeOpacity={0.8}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <Text style={styles.signupButtonText}>Create Account</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.replace("/login")}>
                                <Text style={styles.loginText}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Country Picker Modal */}
            <Modal
                visible={countryModalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {selectionType === "current" ? "Select Country" : "Select Home Country"}
                            </Text>
                            <TouchableOpacity onPress={() => setCountryModalVisible(false)}>
                                <Ionicons name="close" size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.searchBar}>
                            <Ionicons name="search" size={20} color={COLORS.textLight} style={{ marginRight: 10 }} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search country..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                autoFocus
                            />
                        </View>

                        <FlatList
                            data={filteredCountries}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.countryOption}
                                    onPress={() => selectCountry(item.name)}
                                >
                                    <Text style={styles.countryName}>{item.name}</Text>
                                    {(selectionType === "current" ? country : homeCountry) === item.name && (
                                        <Ionicons name="checkmark" size={20} color={COLORS.secondary} />
                                    )}
                                </TouchableOpacity>
                            )}
                            initialNumToRender={20}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 24,
    },
    header: {
        alignItems: "center",
        marginBottom: 32,
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: "center",
    },
    form: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.text,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FCFBF9",
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
    },
    eyeIcon: {
        padding: 4,
    },
    signupButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 24,
        elevation: 2,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    signupButtonText: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.white,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 8,
        paddingBottom: 24,
    },
    footerText: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    loginText: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.secondary,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: "80%",
        padding: 24,
        paddingTop: 8,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        marginTop: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.primary,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        marginBottom: 15,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
    },
    countryOption: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    countryName: {
        fontSize: 16,
        color: COLORS.text,
    },
});
