import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    TextInput,
    FlatList,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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
};

const CATEGORIES = [
    { id: "all", name: "All Inputs", icon: "grid-outline" },
    { id: "seeds", name: "Seeds", icon: "leaf-outline" },
    { id: "tools", name: "Tools", icon: "hammer-outline" },
    { id: "fertilizer", name: "Fertilizer", icon: "flask-outline" },
    { id: "feeds", name: "Feeds", icon: "restaurant-outline" },
];

const PRODUCTS = [
    {
        id: "1",
        name: "Premium Layer Mash",
        category: "feeds",
        price: "KSh 3,200",
        unit: "50kg Bag",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=200",
        stock: "In Stock",
    },
    {
        id: "2",
        name: "Hybrid Maize Seeds",
        category: "seeds",
        price: "KSh 1,800",
        unit: "2kg Packet",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?auto=format&fit=crop&q=80&w=200",
        stock: "Low Stock",
    },
    {
        id: "3",
        name: "Organic Liquid Fertilizer",
        category: "fertilizer",
        price: "KSh 4,500",
        unit: "5L Gallon",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=200",
        stock: "In Stock",
    },
    {
        id: "4",
        name: "Professional Hoe",
        category: "tools",
        price: "KSh 1,200",
        unit: "Each",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1617576621334-9388147d1590?auto=format&fit=crop&q=80&w=200",
        stock: "In Stock",
    },
];

export default function InputShopScreen() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = PRODUCTS.filter(p => {
        const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleAddToCart = (productName: string) => {
        Alert.alert("Added to Cart", `${productName} has been added to your execution orders.`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Input Shop</Text>
                    <Text style={styles.headerSubtitle}>Equipment & Supplies</Text>
                </View>
                <TouchableOpacity style={styles.cartBtn}>
                    <Ionicons name="cart" size={24} color={COLORS.primary} />
                    <View style={styles.cartBadge} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color={COLORS.textLight} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for seeds, tools, etc."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View style={{ height: 60, marginBottom: 10 }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryScroll}
                >
                    {CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[
                                styles.categoryChip,
                                selectedCategory === cat.id && styles.selectedCategoryChip
                            ]}
                            onPress={() => setSelectedCategory(cat.id)}
                        >
                            <Ionicons
                                name={cat.icon as any}
                                size={18}
                                color={selectedCategory === cat.id ? COLORS.white : COLORS.textLight}
                            />
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === cat.id && styles.selectedCategoryText
                            ]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.productList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.productCard}>
                        <Image source={{ uri: item.image }} style={styles.productImage} />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.productUnit}>{item.unit}</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.productPrice}>{item.price}</Text>
                                <TouchableOpacity
                                    style={styles.addBtn}
                                    onPress={() => handleAddToCart(item.name)}
                                >
                                    <Ionicons name="add" size={20} color={COLORS.white} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="search-outline" size={60} color={COLORS.heritageAccent} />
                        <Text style={styles.emptyText}>No products found matching your search.</Text>
                    </View>
                }
            />
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
    headerInfo: {
        flex: 1,
        marginLeft: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.primary,
    },
    headerSubtitle: {
        fontSize: 13,
        color: COLORS.textLight,
        fontWeight: "600",
    },
    cartBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: COLORS.white,
        justifyContent: "center",
        alignItems: "center",
        elevation: 2,
    },
    cartBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.warning,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        marginHorizontal: 20,
        paddingHorizontal: 15,
        borderRadius: 16,
        height: 50,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: "500",
    },
    categoryScroll: {
        paddingHorizontal: 20,
        gap: 10,
        alignItems: 'center',
    },
    categoryChip: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 30,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
        gap: 6,
    },
    selectedCategoryChip: {
        backgroundColor: COLORS.secondary,
        borderColor: COLORS.secondary,
    },
    categoryText: {
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.textLight,
    },
    selectedCategoryText: {
        color: COLORS.white,
    },
    productList: {
        paddingHorizontal: 15,
        paddingBottom: 40,
    },
    productCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        margin: 5,
        borderRadius: 20,
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    productImage: {
        width: "100%",
        height: 140,
        backgroundColor: "#F0F0F0",
    },
    productInfo: {
        padding: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 2,
    },
    productUnit: {
        fontSize: 11,
        color: COLORS.textLight,
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    productPrice: {
        fontSize: 15,
        fontWeight: "800",
        color: COLORS.secondary,
    },
    addBtn: {
        backgroundColor: COLORS.primary,
        width: 30,
        height: 30,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyState: {
        marginTop: 100,
        alignItems: "center",
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: "center",
        marginTop: 10,
        lineHeight: 22,
    },
});
