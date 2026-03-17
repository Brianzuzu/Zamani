import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ImageBackground,
    Image,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { API_URL } from "../config/authService";
import { auth } from "../config/firebase";
import axios from "axios";
import { convertCurrency, formatCurrency, parsePrice } from "../../constants/currency";

const { width, height } = Dimensions.get("window");

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

interface Filters {
    minBudget: string;
    maxBudget: string;
    plotSize: string;
    titleType: string;
    serviced: boolean;
    nearTarmac: boolean;
    utilities: boolean;
    bedrooms: string;
    propertyType: string;
    rentalYield: string;
    make: string;
    transmission: string;
    condition: string;
    importOrLocal: string;
    infraTimeline: string;
    contractor: string;
}

export default function ProjectsScreen() {
    const router = useRouter();
    const [selectedSector, setSelectedSector] = useState("Managed Lands");
    const [selectedRegion, setSelectedRegion] = useState("Nairobi");
    const [selectedArea, setSelectedArea] = useState("All Areas");
    const [selectedSubCategory, setSelectedSubCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showBizResearchModal, setShowBizResearchModal] = useState(false);
    const [bizResearchData, setBizResearchData] = useState({
        name: "",
        capital: "",
        county: "",
        industry: "Agriculture",
    });
    const [requestData, setRequestData] = useState({
        makeModel: "",
        budget: "",
        timeline: "ASAP",
        importPref: "Any",
        sourcingLocation: "Any",
    });
    const [userProfile, setUserProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Advanced Filter State
    const [filters, setFilters] = useState<Filters>({
        minBudget: "",
        maxBudget: "",
        plotSize: "Any Size",
        titleType: "All", // Freehold / Leasehold
        serviced: false,
        nearTarmac: false,
        utilities: false, // Water/Electricity
        bedrooms: "Any",
        propertyType: "All",
        rentalYield: "",
        make: "All",
        transmission: "Any",
        condition: "Any", // New / Used
        importOrLocal: "All",
        infraTimeline: "All",
        contractor: "",
    });

    const categories = [
        { id: "1", name: "Managed Lands", icon: "map" },
        { id: "2", name: "Build or Buy a House", icon: "business" },
        { id: "3", name: "Vehicle Sourcing", icon: "car-sport" },
        { id: "4", name: "Utilities and Products", icon: "cart" },
        { id: "5", name: "Business Opps", icon: "bulb" },
        { id: "6", name: "Kenyan Markets", icon: "trending-up" },
    ];

    const regions = ["All Regions", "Nairobi", "Rift Valley", "Central", "Coast", "Eastern"];
    const nairobiAreas = ["All Areas", "Syokimau", "Karen", "Kasarani", "Kitengela", "Ruai", "Kilimani"];

    const reSubCategories = ["All", "Apartments", "Rental Units", "Residential Houses", "Commercial Properties"];
    const vehSubCategories = ["All", "SUVs", "Sedans", "Motorbikes", "Pickups", "Electric", "Luxury", "Buses"];
    const utilSubCategories = ["All", "Furniture", "Home Appliances", "Farming Utilities", "Building Utilities", "Others"];
    const bizCategories = [
        {
            id: "biz_a",
            name: "Agriculture & Agribusiness",
            icon: "leaf",
            subcategories: ["Greenhouse vegetables", "Poultry (Layers/Broilers)", "Dairy farming", "Avocado export farming", "Goat farming", "Fish farming"],
            displayFields: {
                capital: "KSh 350,000",
                land: "1/4 acre",
                breakEven: "12 months",
                revenue: "80K – 120K",
                risk: "Medium",
                demand: "High"
            }
        },
        {
            id: "biz_b",
            name: "Real Estate & Rental Business",
            icon: "business",
            subcategories: ["Bedsitter rentals", "Airbnb units", "Student hostels", "Container shops", "Small commercial shops"],
            displayFields: {
                cost: "Varies",
                rent: "KSh 15k - 40k",
                occupancy: "90%",
                roi: "15%",
                payback: "5-7 Years"
            }
        },
        {
            id: "biz_c",
            name: "Retail & Trade Businesses",
            icon: "cart",
            subcategories: ["Mini supermarket", "Hardware shop", "Cosmetics shop", "Pharmacy", "Agrovet", "Electronics shop"],
            displayFields: {
                capital: "KES 500k - 1.5M",
                operatingCost: "40K/mo",
                margin: "25%",
                licenses: "County, KEBS"
            }
        },
        {
            id: "biz_d",
            name: "Transport & Logistics",
            icon: "bus",
            subcategories: ["Boda boda", "Matatu", "Delivery van", "Truck transport", "Taxi / Uber"],
            displayFields: {
                vehicle: "KES 150k - 2M",
                insurance: "KES 15K/yr",
                dailyIncome: "1.5K - 6K",
                maintenance: "Low-Med"
            }
        },
        {
            id: "biz_e",
            name: "Manufacturing & Value Addition",
            icon: "construct",
            subcategories: ["Maize milling", "Water bottling", "Animal feed", "Soap making", "Juice processing"],
            displayFields: {
                machinery: "KES 400K+",
                licensing: "KEBS, NEMA",
                capacity: "1 Ton/Day",
                margin: "35%"
            }
        }
    ];

    const getSearchPlaceholder = () => {
        switch (selectedSector) {
            case "Managed Lands": return "Search by location, size or title...";
            case "Build or Buy a House": return "Search for house types, bedrooms...";
            case "Vehicle Sourcing": return "Search by make, model or specs...";
            case "Utilities and Products": return "Search for products or sellers...";
            case "Business Opps": return "Search business sectors or ideas...";
            case "Kenyan Markets": return "Search stocks or symbols...";
            default: return "Search projects...";
        }
    };

    const hottestDeals = [
        // Land Deals
        {
            id: "hot_1",
            title: "Syokimau Prime Plots",
            category: "Managed Lands",
            location: "Syokimau, Nairobi",
            roi: "",
            price: "KSh 1.2M",
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop",
            tag: "PRIME LOCATION",
            tagColor: COLORS.primary
        },
        // Real Estate Deals
        {
            id: "hot_re_1",
            title: "Westlands Luxury Lofts",
            category: "Build or Buy a House",
            location: "Westlands, Nairobi",
            roi: "",
            price: "KSh 9.5M",
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop",
            tag: "LUXURY",
            tagColor: COLORS.success
        },
        {
            id: "hot_re_2",
            title: "Karen Heights Villa",
            category: "Build or Buy a House",
            location: "Karen, Nairobi",
            roi: "",
            price: "KSh 45M",
            image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=600&auto=format&fit=crop",
            tag: "PRIME ASSET",
            tagColor: COLORS.danger
        },
        {
            id: "hot_re_3",
            title: "Kasarani Rental Suite",
            category: "Build or Buy a House",
            location: "Kasarani, Nairobi",
            roi: "",
            price: "KSh 12M",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
            tag: "HIGH INCOME",
            tagColor: COLORS.secondary
        },
        {
            id: "hot_re_hotel",
            title: "Elementaita Boutique Hotel",
            category: "Build or Buy a House",
            location: "Naivasha, Rift Valley",
            roi: "",
            price: "KSh 65M",
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
            tag: "PREMIUM ASSET",
            tagColor: COLORS.heritageAccent
        },
        // Vehicle Deals
        {
            id: "hot_veh_1",
            title: "2018 Toyota Prado TX",
            category: "Vehicle Sourcing",
            location: "Westlands, Nairobi",
            roi: "Verified Dealer",
            price: "KSh 5.8M",
            image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop",
            tag: "BEST SELLER",
            tagColor: COLORS.primary,
            partner: "Toyota Kenya"
        },
        {
            id: "hot_veh_2",
            title: "2019 Toyota Harrier",
            category: "Vehicle Sourcing",
            location: "Import from Japan",
            roi: "Est. $18,300",
            price: "Import Flow",
            image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600&auto=format&fit=crop",
            tag: "DIASPORA FAVORITE",
            tagColor: COLORS.success,
            partner: "SBT Japan"
        },
        {
            id: "hot_veh_3",
            title: "2020 Land Rover Defender",
            category: "Vehicle Sourcing",
            location: "Import from UK",
            roi: "Est. $65,000",
            price: "Premium Flow",
            image: "https://images.unsplash.com/photo-1590333745422-990422998e3b?q=80&w=600&auto=format&fit=crop",
            tag: "PREMIUM",
            tagColor: COLORS.primary,
            partner: "UK Global Motors"
        },
        {
            id: "hot_veh_4",
            title: "2021 Mercedes-Benz C200",
            category: "Vehicle Sourcing",
            location: "Mombasa, Kenya",
            roi: "Verified Unit",
            price: "KSh 6.4M",
            image: "https://images.unsplash.com/photo-1620212000557-41829e05f699?q=80&w=600&auto=format&fit=crop",
            tag: "LOW MILEAGE",
            tagColor: COLORS.secondary,
            partner: "CarWorld Kenya"
        },
        {
            id: "hot_veh_5",
            title: "2019 Toyota Rav4 Hybrid",
            category: "Vehicle Sourcing",
            location: "Westlands, Nairobi",
            roi: "Fuel Efficient",
            price: "KSh 4.2M",
            image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=400&auto=format&fit=crop",
            tag: "HYBRID",
            tagColor: COLORS.success,
            partner: "EcoCars Nairobi"
        },
        {
            id: "hot_veh_bike_1",
            title: "2022 BMW R1250 GS",
            category: "Vehicle Sourcing",
            location: "Import from Germany",
            roi: "Adventure King",
            price: "Est. $24,500",
            image: "https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=600&auto=format&fit=crop",
            tag: "PREMIUM BIKE",
            tagColor: COLORS.heritageAccent,
            partner: "Bavarian Motors"
        },
        // Utilities and Products Deals
        {
            id: "hot_util_1",
            title: "Eco-Smart Solar Heater",
            category: "Utilities and Products",
            location: "Nairobi Warehouse",
            roi: "",
            price: "KSh 65,000",
            image: "https://images.unsplash.com/photo-1509391366360-feaf9fa44853?q=80&w=400&auto=format&fit=crop",
            tag: "",
            tagColor: "transparent",
            partner: "EcoPower Ltd"
        },
        {
            id: "hot_util_2",
            title: "Mahogany Executive Desk",
            category: "Utilities and Products",
            location: "Mombasa Branch",
            roi: "",
            price: "KSh 45,000",
            image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=400&auto=format&fit=crop",
            tag: "",
            tagColor: "transparent",
            partner: "Heritage Furniture"
        },
        {
            id: "hot_util_3",
            title: "Solar Water Pump 5HP",
            category: "Utilities and Products",
            location: "Rift Valley Hub",
            roi: "",
            price: "KSh 85,000",
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400&auto=format&fit=crop",
            tag: "",
            tagColor: "transparent",
            partner: "AgriTech Solutions"
        },
        {
            id: "hot_util_4",
            title: "Samsung Smart Fridge",
            category: "Utilities and Products",
            location: "Nairobi CBD",
            roi: "",
            price: "KSh 120,000",
            image: "https://images.unsplash.com/photo-1571175432230-01c288a399bb?q=80&w=400&auto=format&fit=crop",
            tag: "",
            tagColor: "transparent",
            partner: "Hotpoint Kenya"
        }
    ];

    const [allProjects, setAllProjects] = useState<any[]>([]);

    const fetchData = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            const [projectsRes, profileRes] = await Promise.all([
                axios.get(`${API_URL}/projects`),
                token ? axios.get(`${API_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                }) : Promise.resolve({ data: null })
            ]);

            const data = projectsRes.data;
            setUserProfile(profileRes.data);

            const formatted = data.map((item: any) => {
                return {
                    ...item,
                    ...item.metadata,
                    id: item._id,
                    image: item.images?.[0] || item.metadata?.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop',
                    tag: item.metadata?.tag || item.tags?.[0]?.label || '',
                    tagColor: item.tags?.[0]?.color || undefined,
                    priceNum: item.targetAmount || parsePrice(item.price),
                    raisedNum: item.currentAmount || parsePrice(item.metadata?.raised),
                    type: item.subCategory || item.metadata?.propertyType || item.metadata?.source || item.category,
                    features: {
                        nearTarmac: item.metadata?.isNearTarmac || item.metadata?.nearTarmac,
                        utilities: item.metadata?.hasUtilities || item.metadata?.utilities,
                        serviced: item.metadata?.isServiced || item.metadata?.serviced
                    }
                };
            });
            setAllProjects(formatted);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    const currencySymbol = userProfile?.currencySymbol || "KSh";
    const preferredCurrency = userProfile?.preferredCurrency || "KES";
    const filteredProjects = allProjects.filter(p => {
        const matchRegion = selectedRegion === "All Regions" || p.region === selectedRegion;
        const matchSector = p.category === selectedSector;
        const matchArea = selectedRegion !== "Nairobi" || selectedArea === "All Areas" || p.area === selectedArea;

        // Sub-category matching
        let matchSubCat = true;
        if (selectedSector === "Build or Buy a House") {
            matchSubCat = selectedSubCategory === "All" || p.type === selectedSubCategory;
        } else if (selectedSector === "Vehicle Sourcing") {
            matchSubCat = selectedSubCategory === "All" || p.type === selectedSubCategory;
        } else if (selectedSector === "Infrastructure") {
            matchSubCat = selectedSubCategory === "All" || p.type === selectedSubCategory;
        } else if (selectedSector === "Business Opps") {
            matchSubCat = selectedSubCategory === "All" || p.subCategory === selectedSubCategory;
        }

        // Advanced filters
        const minVal = filters.minBudget ? parseInt(filters.minBudget.replace(/,/g, "")) : 0;
        const maxVal = filters.maxBudget ? parseInt(filters.maxBudget.replace(/,/g, "")) : Infinity;
        const matchBudget = (p.priceNum || 0) >= minVal && (p.priceNum || 0) <= maxVal;

        const matchTitle = filters.titleType === "All" || p.titleType === filters.titleType;
        const matchTarmac = !filters.nearTarmac || p.features?.nearTarmac;
        const matchUtilities = !filters.utilities || p.features?.utilities;
        const matchServiced = !filters.serviced || p.features?.serviced;

        // Real Estate Specific Filters
        const matchBedrooms = filters.bedrooms === "Any" ||
            (filters.bedrooms === "4+" ? (p.bedrooms || 0) >= 4 : p.bedrooms === parseInt(filters.bedrooms));

        const matchYield = !filters.rentalYield || (parseFloat(p.roi?.replace(/[^0-9.]/g, "") || "0") >= parseFloat(filters.rentalYield));

        // Vehicle Specific Filters
        const matchMake = filters.make === "All" || p.make === filters.make;
        const matchTrans = filters.transmission === "Any" || p.transmission === filters.transmission;
        const matchCond = filters.condition === "Any" || p.condition === filters.condition;
        const matchImp = filters.importOrLocal === "All" || p.importOrLocal === filters.importOrLocal;

        // Infrastructure Specific Filters
        const matchInfTimeline = filters.infraTimeline === "All" || (
            filters.infraTimeline === "< 6 Months" ? (p.completionTimeValue || 0) < 6 :
                filters.infraTimeline === "6-12 Months" ? ((p.completionTimeValue || 0) >= 6 && (p.completionTimeValue || 0) <= 12) :
                    filters.infraTimeline === "1yr+" ? (p.completionTimeValue || 0) > 12 :
                        filters.infraTimeline === "2yrs+" ? (p.completionTimeValue || 0) > 24 : true
        );
        const matchContractor = !filters.contractor ||
            ((p as any).developer?.toLowerCase().includes(filters.contractor.toLowerCase())) ||
            ((p as any).partner?.toLowerCase().includes(filters.contractor.toLowerCase()));

        // Search Filter
        const searchLower = searchQuery.toLowerCase();
        const matchSearch = searchQuery === "" ||
            p.title?.toLowerCase().includes(searchLower) ||
            p.location?.toLowerCase().includes(searchLower) ||
            p.description?.toLowerCase().includes(searchLower) ||
            (p as any).make?.toLowerCase().includes(searchLower) ||
            (p as any).model?.toLowerCase().includes(searchLower) ||
            (p as any).partner?.toLowerCase().includes(searchLower);

        return matchRegion && matchSector && matchArea && matchSubCat && matchBudget &&
            matchTitle && matchTarmac && matchUtilities && matchServiced &&
            matchBedrooms && matchYield &&
            matchMake && matchTrans && matchCond && matchImp &&
            matchInfTimeline && matchContractor && matchSearch;
    });

    const FilterOption = ({ label, active, onPress }: { label: string, active: boolean, onPress: () => void }) => (
        <TouchableOpacity
            style={[styles.filterOption, active && styles.filterOptionActive]}
            onPress={onPress}
        >
            <Text style={[styles.filterOptionText, active && styles.filterOptionTextActive]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Projects</Text>
                </View>
                <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilters(true)}>
                    <Ionicons name="options-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hottest Deals Carousel */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>🔥 Hottest Deals</Text>
                    <Text style={styles.locationTag}>{selectedRegion}</Text>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.hotDealsScroll}
                >
                    {allProjects.filter(p => p.isHotDeal)
                        .filter(deal => deal.category === selectedSector)
                        .map((deal) => (
                            <TouchableOpacity
                                key={deal.id}
                                style={styles.hotDealCard}
                                onPress={() => router.push({
                                    pathname: "/projects/[id]",
                                    params: {
                                        id: deal.id,
                                        title: deal.title,
                                        price: deal.price || deal.goal,
                                        description: deal.description,
                                        images: deal.images || [deal.image],
                                        category: deal.category
                                    }
                                } as any)}
                            >
                                <ImageBackground
                                    source={{ uri: deal.image }}
                                    style={styles.hotDealImage}
                                    imageStyle={{ borderRadius: 24 }}
                                >
                                    <View style={styles.hotDealOverlay}>
                                        {deal.category !== "Utilities and Products" && deal.tag !== "" && (
                                            <View style={[styles.hotTag, { backgroundColor: deal.tagColor }]}>
                                                <Text style={styles.hotTagText}>{deal.tag}</Text>
                                            </View>
                                        )}
                                        <View>
                                            <Text style={styles.hotDealTitle}>{deal.title}</Text>
                                            <Text style={styles.hotDealLoc}>
                                                {deal.location}
                                                {deal.category === "Utilities and Products" && deal.partner ? ` • ${deal.partner}` : ""}
                                            </Text>
                                            <View style={styles.hotDealFooter}>
                                                <Text style={styles.hotDealPrice}>{formatCurrency(convertCurrency(deal.priceNum, "KES", preferredCurrency), preferredCurrency, currencySymbol)}</Text>
                                                {deal.roi !== "" && deal.category !== "Utilities and Products" && deal.category !== "Business Opps" && (
                                                    <View style={styles.hotRoiBadge}>
                                                        <Text style={styles.hotRoiText}>{deal.roi}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        ))}
                </ScrollView>

                {/* Sectors Selector */}
                <Text style={styles.sectionTitle}>Sectors</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryScroll}
                >
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[
                                styles.categoryItem,
                                selectedSector === cat.name && styles.selectedCategoryItem
                            ]}
                            onPress={() => {
                                setSelectedSector(cat.name);
                                setSelectedSubCategory("All");
                                if (cat.name === "Vehicle Sourcing") {
                                    setSelectedRegion("All Regions");
                                    setSelectedArea("All Areas");
                                }
                                setSearchQuery(""); // Clear search when switching sectors
                            }}
                        >
                            <View style={[
                                styles.categoryIcon,
                                selectedSector === cat.name && styles.selectedCategoryIcon
                            ]}>
                                <Ionicons
                                    name={cat.icon as any}
                                    size={24}
                                    color={selectedSector === cat.name ? COLORS.white : COLORS.secondary}
                                />
                            </View>
                            <Text style={[
                                styles.categoryName,
                                selectedSector === cat.name && styles.selectedCategoryName
                            ]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Sector Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color={COLORS.textLight} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={getSearchPlaceholder()}
                        placeholderTextColor={COLORS.textLight}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                    {searchQuery !== "" && (
                        <TouchableOpacity
                            onPress={() => setSearchQuery("")}
                            style={styles.clearSearchBtn}
                        >
                            <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Real Estate Sub-categories - Only visible when Build or Buy a House is selected */}
                {selectedSector === "Build or Buy a House" && (
                    <View style={{ marginTop: 16 }}>
                        <Text style={[styles.sectionTitle, { fontSize: 16, marginBottom: 12 }]}>Property Types</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoryScroll}
                        >
                            {reSubCategories.map((sub) => (
                                <TouchableOpacity
                                    key={sub}
                                    style={[
                                        styles.areaChip,
                                        selectedSubCategory === sub && styles.selectedAreaChip,
                                        { paddingHorizontal: 20 }
                                    ]}
                                    onPress={() => setSelectedSubCategory(sub)}
                                >
                                    <Text style={[
                                        styles.areaText,
                                        selectedSubCategory === sub && styles.selectedAreaText
                                    ]}>{sub}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Vehicle Sub-categories */}
                {selectedSector === "Vehicle Sourcing" && (
                    <View style={{ marginTop: 16 }}>
                        <Text style={[styles.sectionTitle, { fontSize: 16, marginBottom: 12 }]}>Body Types</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoryScroll}
                        >
                            {vehSubCategories.map((sub) => (
                                <TouchableOpacity
                                    key={sub}
                                    style={[
                                        styles.areaChip,
                                        selectedSubCategory === sub && styles.selectedAreaChip,
                                        { paddingHorizontal: 20 }
                                    ]}
                                    onPress={() => setSelectedSubCategory(sub)}
                                >
                                    <Text style={[
                                        styles.areaText,
                                        selectedSubCategory === sub && styles.selectedAreaText
                                    ]}>{sub}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.requestBanner}
                            onPress={() => setShowRequestModal(true)}
                        >
                            <View style={styles.requestBannerContent}>
                                <View style={styles.requestBannerIcon}>
                                    <Ionicons name="search" size={20} color={COLORS.white} />
                                </View>
                                <View>
                                    <Text style={styles.requestBannerTitle}>Can&apos;t find your car?</Text>
                                    <Text style={styles.requestBannerSubtitle}>Custom source from Japan/UK/China/Local</Text>
                                </View>
                            </View>
                            <View style={styles.requestBannerBtn}>
                                <Text style={styles.requestBannerBtnText}>REQUEST</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Utilities and Products Sub-categories */}
                {selectedSector === "Utilities and Products" && (
                    <View style={{ marginTop: 16 }}>
                        <Text style={[styles.sectionTitle, { fontSize: 16, marginBottom: 12 }]}>Utilities Type</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoryScroll}
                        >
                            {utilSubCategories.map((sub) => (
                                <TouchableOpacity
                                    key={sub}
                                    style={[
                                        styles.areaChip,
                                        selectedSubCategory === sub && styles.selectedAreaChip,
                                        { paddingHorizontal: 20 }
                                    ]}
                                    onPress={() => setSelectedSubCategory(sub)}
                                >
                                    <Text style={[
                                        styles.areaText,
                                        selectedSubCategory === sub && styles.selectedAreaText
                                    ]}>{sub}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Business Opps Categories */}
                {selectedSector === "Business Opps" && (
                    <View style={{ marginTop: 16 }}>
                        <Text style={[styles.sectionTitle, { fontSize: 16, marginBottom: 12 }]}>Kenya-Focused Business Sectors</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoryScroll}
                        >
                            {["All", ...bizCategories.map(c => c.name)].map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.areaChip,
                                        selectedSubCategory === cat && styles.selectedAreaChip,
                                        { paddingHorizontal: 20 }
                                    ]}
                                    onPress={() => setSelectedSubCategory(cat)}
                                >
                                    <Text style={[
                                        styles.areaText,
                                        selectedSubCategory === cat && styles.selectedAreaText
                                    ]}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.requestBanner, { backgroundColor: COLORS.secondary }]}
                            onPress={() => setShowBizResearchModal(true)}
                        >
                            <View style={styles.requestBannerContent}>
                                <View style={styles.requestBannerIcon}>
                                    <Ionicons name="bulb-outline" size={20} color={COLORS.white} />
                                </View>
                                <View>
                                    <Text style={styles.requestBannerTitle}>Have a Business Idea?</Text>
                                    <Text style={styles.requestBannerSubtitle}>Get custom market research & ROI analysis</Text>
                                </View>
                            </View>
                            <View style={styles.requestBannerBtn}>
                                <Text style={styles.requestBannerBtnText}>ANALYZE</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Region Chips */}
                {selectedSector !== "Business Opps" && selectedSector !== "Kenyan Markets" && selectedSector !== "Vehicle Sourcing" && selectedSector !== "Utilities and Products" && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Explore Regions</Text>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.regionScroll}
                        >
                            {regions.map((region) => (
                                <TouchableOpacity
                                    key={region}
                                    style={[
                                        styles.regionChip,
                                        selectedRegion === region && styles.selectedRegionChip
                                    ]}
                                    onPress={() => {
                                        setSelectedRegion(region);
                                        setSelectedArea("All Areas"); // Reset area when region changes
                                    }}
                                >
                                    <Text style={[
                                        styles.regionText,
                                        selectedRegion === region && styles.selectedRegionText
                                    ]}>{region}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </>
                )}

                {/* Nairobi Areas - Only visible when Nairobi is selected */}
                {selectedSector !== "Business Opps" && selectedSector !== "Kenyan Markets" && selectedSector !== "Vehicle Sourcing" && selectedSector !== "Utilities and Products" && selectedRegion === "Nairobi" && (
                    <View style={{ marginTop: 16 }}>
                        <Text style={[styles.sectionTitle, { fontSize: 16, marginBottom: 12 }]}>Nairobi Neighborhoods</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.regionScroll}
                        >
                            {nairobiAreas.map((area) => (
                                <TouchableOpacity
                                    key={area}
                                    style={[
                                        styles.areaChip,
                                        selectedArea === area && styles.selectedAreaChip
                                    ]}
                                    onPress={() => setSelectedArea(area)}
                                >
                                    <Text style={[
                                        styles.areaText,
                                        selectedArea === area && styles.selectedAreaText
                                    ]}>{area}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Filter Results Summary */}
                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={styles.sectionTitle}>{selectedSector}</Text>
                        <Text style={styles.resultsCount}>{filteredProjects.length} Verified Listings</Text>
                    </View>
                </View>

                {/* Project List */}
                {/* Special View for Kenyan Markets */}
                {selectedSector === "Kenyan Markets" ? (
                    <View>
                        <View style={{ padding: 4, alignItems: 'center', marginBottom: 24 }}>
                            <Text style={{ fontSize: 14, color: COLORS.textLight, textAlign: 'center' }}>
                                Trade top NSE companies directly from your phone.
                                Build your portfolio with our simulated trading engine.
                            </Text>
                        </View>

                        <View
                            style={{
                                backgroundColor: COLORS.white,
                                borderRadius: 16,
                                overflow: 'hidden',
                                marginBottom: 16,
                                elevation: 4,
                                shadowColor: COLORS.primary,
                                shadowOpacity: 0.1,
                                shadowRadius: 10
                            }}
                        >
                            <ImageBackground
                                source={{ uri: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=800&auto=format&fit=crop" }}
                                style={{ height: 180, justifyContent: 'flex-end' }}
                            >
                                <View style={{
                                    padding: 20,
                                    backgroundColor: 'rgba(10, 31, 68, 0.85)'
                                }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View>
                                            <Text style={{ color: COLORS.heritageAccent, fontWeight: '700', fontSize: 12, marginBottom: 4 }}>LIVE MARKET</Text>
                                            <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 22 }}>NSE Trading Floor</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => router.push("/invest")}
                                            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.success, justifyContent: 'center', alignItems: 'center' }}
                                        >
                                            <Ionicons name="trending-up" size={24} color={COLORS.white} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ImageBackground>
                            <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    <TouchableOpacity
                                        style={{ alignItems: 'center' }}
                                        onPress={() => Alert.alert("Coming Soon", "Trading for Safaricom (SCOM) is currently in sandbox mode. Performance tracking is active, but live orders are coming soon!", [{ text: "OK" }])}
                                    >
                                        <Text style={{ fontWeight: '700', color: COLORS.primary }}>SCOM</Text>
                                        <Text style={{ fontSize: 12, color: COLORS.success }}>+1.42%</Text>
                                    </TouchableOpacity>
                                    <View style={{ width: 1, height: '100%', backgroundColor: '#EEE' }} />
                                    <TouchableOpacity
                                        style={{ alignItems: 'center' }}
                                        onPress={() => Alert.alert("Coming Soon", "Trading for Equity Group (EQTY) is currently in sandbox mode.", [{ text: "OK" }])}
                                    >
                                        <Text style={{ fontWeight: '700', color: COLORS.primary }}>EQTY</Text>
                                        <Text style={{ fontSize: 12, color: COLORS.danger }}>-1.90%</Text>
                                    </TouchableOpacity>
                                    <View style={{ width: 1, height: '100%', backgroundColor: '#EEE' }} />
                                    <TouchableOpacity
                                        style={{ alignItems: 'center' }}
                                        onPress={() => Alert.alert("Coming Soon", "Trading for KCB Group is currently in sandbox mode.", [{ text: "OK" }])}
                                    >
                                        <Text style={{ fontWeight: '700', color: COLORS.primary }}>KCB</Text>
                                        <Text style={{ fontSize: 12, color: COLORS.success }}>+0.45%</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => router.push("/invest")}>
                                    <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Enter Market &gt;</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ) : filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                        <TouchableOpacity
                            key={project.id}
                            style={styles.projectCard}
                            onPress={() => router.push({
                                pathname: "/projects/[id]",
                                params: {
                                    id: project.id,
                                    title: project.title,
                                    price: project.price,
                                    description: project.description,
                                    images: project.images || [project.image],
                                    category: project.category
                                }
                            } as any)}
                        >
                            <View style={styles.projectImageContainer}>
                                <Image source={{ uri: project.image }} style={styles.projectImage} />
                                {project.category !== "Vehicle Sourcing" && (
                                    <View style={[styles.statusBadge, { backgroundColor: project.status === "Executing" ? COLORS.success : COLORS.warning }]}>
                                        <Text style={styles.statusText}>{project.status}</Text>
                                    </View>
                                )}
                                {project.verified && (
                                    <View style={styles.verifiedBadge}>
                                        <Ionicons name="checkmark-circle" size={16} color={COLORS.white} />
                                        <Text style={styles.verifiedText}>VERIFIED</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.projectContent}>
                                <View style={styles.projectHeader}>
                                    <View style={{ flex: 1 }}>
                                        {project.category === "Managed Lands" ? (
                                            <>
                                                <Text style={styles.projectLoc}>{project.location}, {project.region}, {project.county || "Machakos"}, {project.area || "Area"}</Text>
                                                <Text style={styles.projectTitle} numberOfLines={1}>{project.partner || project.developer || "Sema Real Estate Group"}</Text>
                                            </>
                                        ) : (
                                            <>
                                                <Text style={styles.projectLoc}>{project.location}, {project.region}</Text>
                                                <Text style={styles.projectTitle} numberOfLines={1}>{project.title}</Text>
                                            </>
                                        )}

                                        {project.category === "Real Estate" && (
                                            <View style={styles.propertyFeatures}>
                                                <View style={styles.featureItem}>
                                                    <Ionicons name="bed-outline" size={14} color={COLORS.textLight} />
                                                    <Text style={styles.featureItemText}>{project.bedrooms} Bed</Text>
                                                </View>
                                                <View style={styles.featureItem}>
                                                    <Ionicons name="water-outline" size={14} color={COLORS.textLight} />
                                                    <Text style={styles.featureItemText}>{project.bathrooms} Bath</Text>
                                                </View>
                                                {project.offPlan && (
                                                    <View style={[styles.hotTag, { backgroundColor: COLORS.warning, paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4 }]}>
                                                        <Text style={[styles.hotTagText, { fontSize: 8 }]}>OFF-PLAN</Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}

                                        {project.category === "Vehicle Sourcing" && (
                                            <View>
                                                <View style={styles.propertyFeatures}>
                                                    <View style={styles.featureItem}>
                                                        <Ionicons name="speedometer-outline" size={14} color={COLORS.textLight} />
                                                        <Text style={styles.featureItemText}>{project.mileage}</Text>
                                                    </View>
                                                    <View style={styles.featureItem}>
                                                        <Ionicons name="cog-outline" size={14} color={COLORS.textLight} />
                                                        <Text style={styles.featureItemText}>{project.transmission}</Text>
                                                    </View>
                                                    <View style={styles.featureItem}>
                                                        <Ionicons name="flash-outline" size={14} color={COLORS.textLight} />
                                                        <Text style={styles.featureItemText}>{("engine" in project ? project.engine : null) || project.type}</Text>
                                                    </View>
                                                    <View style={styles.featureItem}>
                                                        <Ionicons name="shield-outline" size={14} color={COLORS.textLight} />
                                                        <Text style={styles.featureItemText}>{project.condition}</Text>
                                                    </View>
                                                </View>

                                                {project.partner && (
                                                    <View style={[styles.featureItem, {
                                                        marginTop: 12,
                                                        paddingTop: 8,
                                                        borderTopWidth: 1,
                                                        borderTopColor: 'rgba(0,0,0,0.05)',
                                                    }]}>
                                                        <Ionicons name="business-outline" size={14} color={COLORS.secondary} />
                                                        <Text style={[styles.featureItemText, { color: COLORS.secondary, fontWeight: '700' }]}>{project.partner}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}

                                        {project.category === "Utilities and Products" && (
                                            <View>
                                                <Text
                                                    style={{
                                                        fontSize: 13,
                                                        color: COLORS.text,
                                                        marginTop: 8,
                                                        lineHeight: 18,
                                                        fontWeight: '500'
                                                    }}
                                                    numberOfLines={2}
                                                >
                                                    {project.description}
                                                </Text>
                                                <View style={[styles.featureItem, { marginTop: 8 }]}>
                                                    <Ionicons name="business-outline" size={14} color={COLORS.secondary} />
                                                    <Text style={[styles.featureItemText, { color: COLORS.secondary, fontWeight: '700' }]}>{project.partner}</Text>
                                                </View>
                                            </View>
                                        )}

                                        {project.category === "Business Opps" && (
                                            <View style={styles.propertyFeatures}>
                                                <View style={styles.featureItem}>
                                                    <Ionicons name="wallet-outline" size={14} color={COLORS.textLight} />
                                                    <Text style={styles.featureItemText}>{formatCurrency(convertCurrency(project.priceNum, "KES", preferredCurrency), preferredCurrency, currencySymbol)}</Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                    {project.category !== "Managed Lands" && project.category !== "Build or Buy a House" && project.category !== "Vehicle Sourcing" && project.category !== "Utilities and Products" && project.category !== "Business Opps" && (
                                        <View style={styles.projectRoiContainer}>
                                            <Text style={styles.projectRoiValue}>{project.roi}</Text>
                                        </View>
                                    )}
                                </View>

                                {project.category === "Business Opps" ? (
                                    <View style={[styles.fundingInfo, { backgroundColor: COLORS.heritage, padding: 12, borderRadius: 16 }]}>
                                        <View style={styles.fundingHeader}>
                                            <Text style={[styles.fundingLabel, { fontWeight: '700' }]}>Monthly Revenue Potential</Text>
                                            <Ionicons name="trending-up" size={16} color={COLORS.success} />
                                        </View>
                                        <Text style={[styles.fundingValue, { color: COLORS.secondary, fontSize: 18 }]}>
                                            {formatCurrency(convertCurrency(parseInt(project.revenue?.replace(/[^0-9]/g, '') || '0'), "KES", preferredCurrency), preferredCurrency, currencySymbol)}
                                        </Text>
                                        <View style={[styles.fundingFooter, { marginTop: 4 }]}>
                                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                                <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.primary }}>START SAVING</Text>
                                                <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.fundingInfo}>
                                        <View style={styles.fundingHeader}>
                                            <Text style={styles.fundingLabel}>Funding Progress</Text>
                                            <Text style={styles.fundingValue}>{Math.round((project.raisedNum / (project.priceNum || 1)) * 100)}%</Text>
                                        </View>
                                        <View style={styles.progressBarBg}>
                                            <View
                                                style={[
                                                    styles.progressBarFill,
                                                    { width: `${Math.min(Math.round((project.raisedNum / (project.priceNum || 1)) * 100), 100)}%`, backgroundColor: COLORS.secondary }
                                                ]}
                                            />
                                        </View>
                                        <View style={styles.fundingFooter}>
                                            <Text style={styles.raisedText}>{formatCurrency(convertCurrency(project.raisedNum, "KES", preferredCurrency), preferredCurrency, currencySymbol)} raised</Text>
                                            <Text style={styles.targetText}>Target: {formatCurrency(convertCurrency(project.priceNum, "KES", preferredCurrency), preferredCurrency, currencySymbol)}</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="map-outline" size={48} color={COLORS.heritageAccent} />
                        <Text style={styles.emptyText}>No listings match your current filters.</Text>
                        <TouchableOpacity
                            style={styles.resetBtn}
                            onPress={() => {
                                setFilters({
                                    minBudget: "",
                                    maxBudget: "",
                                    plotSize: "Any Size",
                                    titleType: "All",
                                    serviced: false,
                                    nearTarmac: false,
                                    utilities: false,
                                    bedrooms: "Any",
                                    propertyType: "All",
                                    rentalYield: "",
                                    make: "All",
                                    transmission: "Any",
                                    condition: "Any",
                                    importOrLocal: "All",
                                    infraTimeline: "All",
                                    contractor: "",
                                });
                                setSelectedRegion("All Regions");
                                setSelectedArea("All Areas");
                                setSelectedSubCategory("All");
                            }}
                        >
                            <Text style={styles.resetBtnText}>Reset Filters</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* Advanced Filters Modal */}
            <Modal
                visible={showFilters}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Advanced Discovery</Text>
                            <TouchableOpacity onPress={() => setShowFilters(false)}>
                                <Ionicons name="close" size={28} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Budget Section */}
                            <Text style={styles.filterGroupTitle}>Budget Range (KSh)</Text>
                            <View style={styles.budgetInputs}>
                                <TextInput
                                    style={styles.budgetInput}
                                    placeholder="Min"
                                    value={filters.minBudget}
                                    onChangeText={(text) => setFilters({ ...filters, minBudget: text })}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.budgetInput}
                                    placeholder="Max"
                                    value={filters.maxBudget}
                                    onChangeText={(text) => setFilters({ ...filters, maxBudget: text })}
                                    keyboardType="numeric"
                                />
                            </View>



                            {/* Real Estate Specific Filters */}
                            {selectedSector === "Build or Buy a House" && (
                                <>
                                    <Text style={styles.filterGroupTitle}>Bedroom Count</Text>
                                    <View style={styles.filterOptionsRow}>
                                        {["Any", "1", "2", "3", "4+"].map(num => (
                                            <FilterOption
                                                key={num}
                                                label={num === "Any" ? num : `${num} BR`}
                                                active={filters.bedrooms === num}
                                                onPress={() => setFilters({ ...filters, bedrooms: num })}
                                            />
                                        ))}
                                    </View>
                                </>
                            )}

                            {/* Vehicle Specific Filters */}
                            {selectedSector === "Vehicle Sourcing" && (
                                <>
                                    <Text style={styles.filterGroupTitle}>Vehicle Details</Text>
                                    <View style={[styles.budgetInputs, { marginBottom: 16 }]}>
                                        <TextInput
                                            style={styles.budgetInput}
                                            placeholder="Make (e.g. Toyota)"
                                            value={filters.make === "All" ? "" : filters.make}
                                            onChangeText={(text) => setFilters({ ...filters, make: text || "All" })}
                                        />
                                    </View>

                                    <View style={styles.filterOptionsRow}>
                                        <FilterOption label="Any Trans." active={filters.transmission === "Any"} onPress={() => setFilters({ ...filters, transmission: "Any" })} />
                                        <FilterOption label="Auto" active={filters.transmission === "Automatic"} onPress={() => setFilters({ ...filters, transmission: "Automatic" })} />
                                        <FilterOption label="Manual" active={filters.transmission === "Manual"} onPress={() => setFilters({ ...filters, transmission: "Manual" })} />
                                    </View>

                                    <View style={[styles.filterOptionsRow, { marginTop: 12 }]}>
                                        <FilterOption label="Any Cond." active={filters.condition === "Any"} onPress={() => setFilters({ ...filters, condition: "Any" })} />
                                        <FilterOption label="New" active={filters.condition === "New"} onPress={() => setFilters({ ...filters, condition: "New" })} />
                                        <FilterOption label="Used" active={filters.condition === "Used"} onPress={() => setFilters({ ...filters, condition: "Used" })} />
                                    </View>

                                    <View style={[styles.filterOptionsRow, { marginTop: 12 }]}>
                                        <FilterOption label="Local & Import" active={filters.importOrLocal === "All"} onPress={() => setFilters({ ...filters, importOrLocal: "All" })} />
                                        <FilterOption label="Local 🇰🇪" active={filters.importOrLocal === "Local"} onPress={() => setFilters({ ...filters, importOrLocal: "Local" })} />
                                        <FilterOption label="Import 🌍" active={filters.importOrLocal === "Import"} onPress={() => setFilters({ ...filters, importOrLocal: "Import" })} />
                                    </View>
                                </>
                            )}

                            {/* Infrastructure Specific Filters */}
                            {selectedSector === "Infrastructure" && (
                                <>
                                    <Text style={styles.filterGroupTitle}>Project Details</Text>
                                    <View style={styles.filterOptionsRow}>
                                        {["All", "Residential", "Commercial", "Utilities"].map(type => (
                                            <FilterOption
                                                key={type}
                                                label={type}
                                                active={selectedSubCategory === type}
                                                onPress={() => setSelectedSubCategory(type)}
                                            />
                                        ))}
                                    </View>

                                    <Text style={styles.filterGroupTitle}>Completion Timeline</Text>
                                    <View style={styles.filterOptionsRow}>
                                        {["All", "< 6 Months", "6-12 Months", "1yr+", "2yrs+"].map(time => (
                                            <FilterOption
                                                key={time}
                                                label={time}
                                                active={filters.infraTimeline === time}
                                                onPress={() => setFilters({ ...filters, infraTimeline: time })}
                                            />
                                        ))}
                                    </View>

                                    <View style={[styles.budgetInputs, { marginTop: 16 }]}>
                                        <TextInput
                                            style={styles.budgetInput}
                                            placeholder="Preferred Contractor (e.g. GreenBuild)"
                                            placeholderTextColor={COLORS.textLight}
                                            value={filters.contractor}
                                            onChangeText={(text) => setFilters({ ...filters, contractor: text })}
                                        />
                                    </View>
                                </>
                            )}

                            <TouchableOpacity
                                style={styles.applyBtn}
                                onPress={() => setShowFilters(false)}
                            >
                                <Text style={styles.applyBtnText}>Show Results</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Request a Vehicle Modal */}
            <Modal
                visible={showRequestModal}
                animationType="fade"
                transparent={true}
            >
                <View style={[styles.modalOverlay, { backgroundColor: 'rgba(10, 31, 68, 0.8)' }]}>
                    <View style={[styles.modalContent, { height: 'auto', maxHeight: '80%' }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Request a Vehicle</Text>
                            <TouchableOpacity onPress={() => setShowRequestModal(false)}>
                                <Ionicons name="close" size={28} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.stepSubtitle}>Our sourcing agents will find the perfect match for you within 24 hours.</Text>

                            <Text style={styles.filterGroupTitle}>Make & Model</Text>
                            <TextInput
                                style={[styles.budgetInput, { width: '100%', marginBottom: 16 }]}
                                placeholder="e.g. 2019 Toyota Rav4"
                                value={requestData.makeModel}
                                onChangeText={(val) => setRequestData({ ...requestData, makeModel: val })}
                            />

                            <Text style={styles.filterGroupTitle}>Max Budget (KSh)</Text>
                            <TextInput
                                style={[styles.budgetInput, { width: '100%', marginBottom: 16 }]}
                                placeholder="e.g. 3,500,000"
                                keyboardType="numeric"
                                value={requestData.budget}
                                onChangeText={(val) => setRequestData({ ...requestData, budget: val })}
                            />

                            <Text style={styles.filterGroupTitle}>Sourcing Location</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16 }}>
                                {["Any", "Japan", "China", "UK", "Thailand", "Dubai", "Local"].map(loc => (
                                    <TouchableOpacity
                                        key={loc}
                                        style={[styles.areaChip, requestData.sourcingLocation === loc && styles.selectedAreaChip]}
                                        onPress={() => setRequestData({ ...requestData, sourcingLocation: loc })}
                                    >
                                        <Text style={[styles.areaText, requestData.sourcingLocation === loc && styles.selectedAreaText]}>{loc}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <Text style={styles.filterGroupTitle}>Preferred Timeline</Text>
                            <View style={[styles.filterOptionsRow, { marginBottom: 20 }]}>
                                {["ASAP", "2 Weeks", "1 Month"].map(t => (
                                    <TouchableOpacity
                                        key={t}
                                        style={[styles.areaChip, requestData.timeline === t && styles.selectedAreaChip]}
                                        onPress={() => setRequestData({ ...requestData, timeline: t })}
                                    >
                                        <Text style={[styles.areaText, requestData.timeline === t && styles.selectedAreaText]}>{t}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TouchableOpacity
                                style={[styles.applyBtn, { backgroundColor: COLORS.secondary }]}
                                onPress={() => {
                                    setShowRequestModal(false);
                                    // Normally handle submission here
                                }}
                            >
                                <Text style={styles.applyBtnText}>Submit Sourcing Request</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Custom Business Research Modal */}
            <Modal
                visible={showBizResearchModal}
                animationType="slide"
                transparent={true}
            >
                <View style={[styles.modalOverlay, { backgroundColor: 'rgba(11, 61, 46, 0.9)' }]}>
                    <View style={[styles.modalContent, { height: 'auto' }]}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>Research Business Idea</Text>
                                <Text style={styles.stepSubtitle}>Get a professional analysis & savings plan</Text>
                            </View>
                            <TouchableOpacity onPress={() => setShowBizResearchModal(false)}>
                                <Ionicons name="close" size={28} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.filterGroupTitle}>Business Name / Idea</Text>
                            <TextInput
                                style={[styles.budgetInput, { width: '100%', marginBottom: 16 }]}
                                placeholder="e.g. Dairy Farm in Nakuru"
                                value={bizResearchData.name}
                                onChangeText={(val) => setBizResearchData({ ...bizResearchData, name: val })}
                            />

                            <Text style={styles.filterGroupTitle}>Target County</Text>
                            <TextInput
                                style={[styles.budgetInput, { width: '100%', marginBottom: 16 }]}
                                placeholder="e.g. Nakuru"
                                value={bizResearchData.county}
                                onChangeText={(val) => setBizResearchData({ ...bizResearchData, county: val })}
                            />

                            <Text style={styles.filterGroupTitle}>Estimated Capital (If known)</Text>
                            <TextInput
                                style={[styles.budgetInput, { width: '100%', marginBottom: 20 }]}
                                placeholder="e.g. 500,000"
                                keyboardType="numeric"
                                value={bizResearchData.capital}
                                onChangeText={(val) => setBizResearchData({ ...bizResearchData, capital: val })}
                            />

                            <TouchableOpacity
                                style={[styles.applyBtn, { backgroundColor: COLORS.secondary }]}
                                onPress={() => {
                                    setShowBizResearchModal(false);
                                    router.push({
                                        pathname: "/savings/create-goal",
                                        params: {
                                            title: bizResearchData.name || "New Business Venture",
                                            target: bizResearchData.capital,
                                            category: "Business",
                                            // Mocking generated analysis
                                            revenueProjection: JSON.stringify({
                                                monthlyRevenue: "Generating...",
                                                netProfit: "Analysis Pending",
                                                breakEvenLabels: ["Y1", "Y2"],
                                                breakEvenData: [0, 100]
                                            })
                                        }
                                    } as any);
                                }}
                            >
                                <Text style={styles.applyBtnText}>Generate Plan & Start Saving</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
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
    filterBtn: {
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
        paddingBottom: 120,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 32,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.primary,
    },
    locationTag: {
        fontSize: 12,
        fontWeight: "800",
        color: COLORS.secondary,
        backgroundColor: "rgba(11, 61, 46, 0.08)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    resultsCount: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.textLight,
        marginTop: 4,
    },
    hotDealsScroll: {
        paddingRight: 24,
        gap: 16,
    },
    hotDealCard: {
        width: width * 0.75,
        height: 220,
        borderRadius: 24,
        overflow: "hidden",
    },
    hotDealImage: {
        width: "100%",
        height: "100%",
    },
    hotDealOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        padding: 20,
        justifyContent: "space-between",
    },
    hotTag: {
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    hotTagText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 0.5,
    },
    hotDealTitle: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: "800",
    },
    hotDealLoc: {
        color: "rgba(255,255,255,0.9)",
        fontSize: 13,
        marginBottom: 12,
    },
    hotDealFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    hotDealPrice: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "800",
    },
    hotRoiBadge: {
        backgroundColor: "rgba(255,255,255,0.25)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    hotRoiText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "700",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: 24,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: "rgba(10, 31, 68, 0.08)",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.primary,
        padding: 0,
    },
    clearSearchBtn: {
        padding: 4,
    },
    categoryScroll: {
        gap: 12,
        paddingRight: 24,
    },
    categoryItem: {
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 24,
        alignItems: "center",
        width: 100,
        borderWidth: 2,
        borderColor: "transparent",
    },
    selectedCategoryItem: {
        borderColor: COLORS.secondary,
    },
    categoryIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: "rgba(11, 61, 46, 0.05)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    selectedCategoryIcon: {
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
    regionScroll: {
        gap: 10,
        paddingRight: 24,
    },
    regionChip: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: COLORS.white,
    },
    selectedRegionChip: {
        backgroundColor: COLORS.primary,
    },
    regionText: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.text,
    },
    selectedRegionText: {
        color: COLORS.white,
    },
    areaChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: "rgba(10, 31, 68, 0.05)",
        marginRight: 8,
    },
    selectedAreaChip: {
        backgroundColor: COLORS.secondary,
    },
    areaText: {
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.primary,
    },
    selectedAreaText: {
        color: COLORS.white,
    },
    verifiedBadge: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    verifiedText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: "800",
    },
    propertyFeatures: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginTop: 6,
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    featureItemText: {
        fontSize: 12,
        color: COLORS.textLight,
        fontWeight: "600",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: COLORS.heritage,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        maxHeight: height * 0.8,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 32,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: COLORS.primary,
    },
    filterGroupTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 16,
        marginTop: 24,
    },
    budgetInputs: {
        flexDirection: "row",
        gap: 12,
    },
    budgetInput: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 14,
        padding: 16,
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.primary,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },
    filterOptionsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    filterOption: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },
    filterOptionActive: {
        backgroundColor: COLORS.secondary,
        borderColor: COLORS.secondary,
    },
    filterOptionText: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.primary,
    },
    filterOptionTextActive: {
        color: COLORS.white,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
    },
    checkboxLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.text,
    },
    applyBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        marginTop: 40,
        marginBottom: 20,
    },
    applyBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "800",
    },
    projectCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        overflow: "hidden",
        marginBottom: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
    },
    projectImageContainer: {
        height: 160,
        backgroundColor: COLORS.heritageAccent,
    },
    projectImage: {
        width: "100%",
        height: "100%",
    },
    statusBadge: {
        position: "absolute",
        top: 16,
        left: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    statusText: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: "800",
        textTransform: "uppercase",
    },
    projectContent: {
        padding: 20,
    },
    projectHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    projectLoc: {
        fontSize: 11,
        fontWeight: "700",
        color: COLORS.secondary,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.primary,
        marginTop: 4,
    },
    projectRoiContainer: {
        alignItems: "flex-end",
    },
    projectRoiValue: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.secondary,
    },
    projectRoiLabel: {
        fontSize: 10,
        fontWeight: "600",
        color: COLORS.textLight,
        textTransform: "uppercase",
    },
    fundingInfo: {
        backgroundColor: "rgba(245, 239, 231, 0.5)",
        padding: 16,
        borderRadius: 16,
    },
    fundingHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    fundingLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.textLight,
    },
    fundingValue: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.primary,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: COLORS.white,
        borderRadius: 4,
        overflow: "hidden",
        marginBottom: 12,
    },
    progressBarFill: {
        height: "100%",
        borderRadius: 4,
    },
    fundingFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    raisedText: {
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.primary,
    },
    targetText: {
        fontSize: 13,
        color: COLORS.textLight,
    },
    emptyContainer: {
        padding: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.02)",
        borderRadius: 32,
        marginTop: 20,
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: "center",
        marginTop: 16,
        fontWeight: "600",
    },
    resetBtn: {
        marginTop: 24,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
    },
    resetBtnText: {
        color: COLORS.white,
        fontWeight: "700",
    },
    stepSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 20,
        lineHeight: 20,
    },
    requestBanner: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 16,
        marginTop: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "rgba(10, 31, 68, 0.1)",
        elevation: 2,
    },
    requestBannerContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    requestBannerIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
    },
    requestBannerTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.primary,
    },
    requestBannerSubtitle: {
        fontSize: 11,
        color: COLORS.textLight,
    },
    requestBannerBtn: {
        backgroundColor: "rgba(10, 31, 68, 0.05)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    requestBannerBtnText: {
        fontSize: 10,
        fontWeight: "800",
        color: COLORS.primary,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.text,
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 14,
        padding: 16,
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.primary,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },
});
