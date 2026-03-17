import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    ImageBackground
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../config/authService";
import { auth } from "../config/firebase";
import { formatCurrency, convertCurrency, parsePrice } from "../../constants/currency";

const { width } = Dimensions.get("window");

const COLORS = {
    primary: "#0A1F44", // Deep Blue
    secondary: "#0B3D2E", // Dark Emerald
    heritage: "#F5EFE7", // Savannah Stone
    white: "#FFFFFF",
    text: "#1A1A1A",
    textLight: "#666666",
    success: "#34C759",
    warning: "#FF9500",
};

export default function ProjectDetails() {
    const { id, title: paramTitle, price: paramPrice, description: paramDesc, images: paramImages, category: paramCategory, active } = useLocalSearchParams();
    const router = useRouter();
    const [selectedInvestmentType, setSelectedInvestmentType] = React.useState("Fractional");
    const [activeImageIndex, setActiveImageIndex] = React.useState(0);
    const [selectedMaterials, setSelectedMaterials] = React.useState<string[]>([]);
    const [dbProject, setDbProject] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(false);
    const [userProfile, setUserProfile] = React.useState<any>(null);

    // Data Identification based on ID or Category
    const currentCategory = dbProject?.category || paramCategory;
    const isVehicle = (id as string)?.startsWith("veh") || (id as string)?.startsWith("hot_veh") || currentCategory === "Vehicle Sourcing";
    const isUtilities = (id as string)?.startsWith("res") || (id as string)?.startsWith("com") || (id as string)?.startsWith("utl") || (id as string)?.startsWith("util") || (id as string)?.startsWith("hot_util") || id === "144" || id === "156" || currentCategory === "Utilities and Products";
    const isBusiness = (id as string)?.startsWith("biz") || (id as string)?.startsWith("hot_biz") || currentCategory === "Business" || currentCategory === "Business Opps";
    const isImport = (id as string)?.includes("imp") || dbProject?.metadata?.source === "Import";
    const isBuildOrBuy = (id as string)?.startsWith("prop") || (id as string)?.startsWith("hot_re") || (id as string)?.startsWith("mansion") || currentCategory === "Build or Buy a House" || currentCategory === "Real Estate";
    const isManagedLands = currentCategory === "Managed Lands" || (!isVehicle && !isUtilities && !isBusiness && !isBuildOrBuy);

    React.useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            const [projectRes, profileRes] = await Promise.all([
                (id && !id.toString().includes('_') && id.toString().length > 10) 
                    ? axios.get(`${API_URL}/projects/${id}`)
                    : Promise.resolve({ data: null }),
                token ? axios.get(`${API_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                }) : Promise.resolve({ data: null })
            ]);

            if (projectRes.data) setDbProject(projectRes.data);
            if (profileRes.data) setUserProfile(profileRes.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const currencySymbol = userProfile?.currencySymbol || "KSh";
    const preferredCurrency = userProfile?.preferredCurrency || "KES";

    // Pre-calculate derived fields to avoid bracket depth issues
    const displayTitle = dbProject?.title || paramTitle || (
        isVehicle ? (isImport ? "2019 Toyota Harrier" : "2018 Toyota Prado TX-L") :
            isUtilities ? (
                id === "util_sol_1" || id === "hot_util_1" ? "Eco-Smart Solar Heater 300L" :
                    id === "util_furn_1" || id === "hot_util_2" ? "Executive Mahogany Bed" :
                        id === "util_ag_1" || id === "hot_util_3" ? "Solar Water Pump 5HP" :
                            id === "util_app_1" || id === "hot_util_4" ? "Samsung Smart Fridge" :
                                id === "util_build_1" ? "Interlocking Brick Machine" :
                                    id === "util_ag_2" ? "Drip Irrigation Kit (1 Acre)" : "Modern Eco-Utility"
            ) :
                isBusiness ? (
                    id === "biz_001" ? "Poultry Farming (Layers)" :
                        id === "biz_ag_002" ? "Greenhouse Tomato Farming" : "Tilapia Fish Farming"
                ) :
                    (
                        id === "mansion_001" ? "5 Bedroom Mansion - Syokimau" :
                            id === "prop001" ? "Modern 2 Bedroom - Westlands" :
                                id === "prop002" ? "Off-Plan 3 Bedroom Villa" :
                                    id === "1" ? "Rift Valley Macro-Farm" : "Nairobi Smart Lofts"
                    )
    );

    const displayCategory = dbProject?.category || paramCategory || (
        isVehicle ? "Vehicle Sourcing" :
            isUtilities ? "Utilities and Products" :
                isBusiness ? "Business" :
                    ((id as string)?.startsWith("prop") ? "Build or Buy a House" : "Managed Lands")
    );

    const displayRoi = dbProject?.roi || (
        isVehicle ? (isImport ? "Est. Total: $18,300" : "Verified Dealer") :
            isUtilities ? "12% - 15% ROI" :
                isBusiness ? "35% Profit" :
                    (id === "prop001" ? "7.5% Yield" : id === "prop002" ? "15% ROI" : "18%")
    );

    const displayPrice = dbProject?.price || (
        isVehicle ? (isImport ? "$12,000" : "KSh 5.8M") :
            isUtilities ? "KSh 4.8M" :
                isBusiness ? "KSh 0" :
                    (id === "mansion_001" ? "KSh 11.16M" : (id === "prop001" ? "KSh 60M" : id === "prop002" ? "KSh 20M" : "KSh 15.4M"))
    );

    const displayTarget = dbProject?.targetAmount ? `KSh ${dbProject.targetAmount.toLocaleString()}` : (
        isVehicle ? (isImport ? "$18,300" : "Ready Stock") :
            isUtilities ? "KSh 12M" :
                isBusiness ? "KSh 400,000" :
                    (id === "mansion_001" ? "KSh 18M" : (id === "prop001" ? "KSh 100M" : id === "prop002" ? "KSh 80M" : "KSh 20M"))
    );

    const displayProgress = isVehicle ? (isImport ? 0.0 : 1.0) : (isUtilities ? 0.40 : (isBusiness ? 0.0 : (id === "mansion_001" ? 0.62 : (id === "prop001" ? 0.60 : id === "prop002" ? 0.25 : 0.77))));
    const displayInvestors = isVehicle ? (isImport ? 12 : 1) : (isUtilities ? 28 : (isBusiness ? 1 : (id === "prop001" ? 180 : 45)));
    const displayLocation = dbProject?.location || (
        isVehicle ? (isImport ? "Japan -> Mombasa" : "Westlands, Nairobi") :
            isUtilities ? "Syokimau / Athi River" :
                isBusiness ? "Kiambu, Central" :
                    (id === "prop001" ? "Westlands, Nairobi" : "Syokimau, Nairobi")
    );

    const displayDescription = dbProject?.description || paramDesc || (
        isVehicle ? "A meticulously maintained vehicle offering comfort, reliability, and modern features. Fully inspected and verified for quality assurance." :
            isUtilities ? (
                id === "hot_util_1" ? "High-efficiency solar water heating system with a 300L capacity. Perfect for large families, reduces electricity bills by up to 70%." :
                    id === "hot_util_2" ? "Handcrafted executive bed made from premium aged mahogany. Features a modern minimalist design with reinforced slats for maximum comfort." :
                        id === "hot_util_3" ? "Powerful 5HP solar-powered water pump capable of lifting water from depths of up to 100m. Ideal for medium-scale agricultural irrigation." :
                            id === "hot_util_4" ? "Energy-efficient Samsung Smart Fridge with twin cooling plus technology. Keeps food fresh for longer with a sleek silver finish." :
                                "A high-quality utility or product sourced and verified by Zamani. Designed for reliability, efficiency, and long-term value."
            ) :
                isBusiness ? "A unique business opportunity with strong market demand and reliable revenue projections. Zamani has verified the fundamentals to ensure viability and growth potential." :
                    ((id as string)?.startsWith("prop") || isBuildOrBuy ? "A premium residential development offering unmatched luxury and strategic location. Perfect for both high-yield rental income and long-term capital appreciation." :
                        "Prime agricultural land in a high-yield area with excellent soil quality. The land is accessible, well-documented, and ideal for long-term investment or farming.")
    );

    const displayProductPriceNum = parsePrice(dbProject?.price || paramPrice || (
        id === "hot_util_1" ? "45000" :
            id === "hot_util_2" ? "85000" :
                id === "hot_util_3" ? "120000" :
                    id === "hot_util_4" ? "155000" :
                        (id === "util_sol_1" ? "42000" : "25000")
    ));
    const displayProductPrice = formatCurrency(convertCurrency(displayProductPriceNum, "KES", preferredCurrency), preferredCurrency, currencySymbol);

    const displayImages = dbProject?.images?.length > 0 ? dbProject.images : (
        paramImages ? (
            Array.isArray(paramImages) ? paramImages :
                (typeof paramImages === 'string' && paramImages.includes(',') ? paramImages.split(',') : [paramImages])
        ) :
            (
                isVehicle ? [
                    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format&fit=crop"
                ] :
                    isUtilities ? [
                        "https://images.unsplash.com/photo-1503387762-592dea58ef41?q=80&w=800&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1590641243171-893ec7a68e64?q=80&w=800&auto=format&fit=crop"
                    ] :
                        isManagedLands ? [
                            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop"
                        ] :
                            [
                                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop",
                                "https://images.unsplash.com/photo-1460317442991-0ec23939714b?q=80&w=800&auto=format&fit=crop",
                                "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
                            ]
            )
    );

    const project: any = {
        id: id,
        title: displayTitle,
        category: displayCategory,
        roi: displayRoi,
        tenure: isVehicle ? "Immediate" : (isUtilities ? "12-24 Months" : (isBusiness ? "Recurring Income" : "Flexible")),
        fundinged: displayPrice,
        target: displayTarget,
        progress: displayProgress,
        investors: displayInvestors,
        location: displayLocation,

        // Infrastructure Specifics
        milestones: id === "mansion_001" ? [
            { id: 1, title: "Site Clearing & Excavation", status: "Completed", date: "Oct 2025", media: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=400" },
            { id: 2, title: "Foundation & Sub-structure", status: "Completed", date: "Dec 2025", media: "https://images.unsplash.com/photo-1590641243171-893ec7a68e64?q=80&w=400" },
            { id: 3, title: "Walling & Lintels", status: "Completed", date: "Feb 2026", media: "https://images.unsplash.com/photo-1503387762-592dea58ef41?q=80&w=400" },
            { id: 4, title: "Roofing & Plumbing", status: "In Progress", date: "April 2026", media: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400" },
            { id: 5, title: "Plastering & Interiors", status: "Pending", date: "June 2026", media: null },
            { id: 6, title: "Final Handover", status: "Pending", date: "Aug 2026", media: null },
        ] : [
            { id: 1, title: "Foundation & Slab", status: "Completed", date: "Jan 2026", media: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=400" },
            { id: 2, title: "Wall & Roofing", status: "In Progress", date: "March 2026", media: null },
            { id: 3, title: "Finishing & Interiors", status: "Pending", date: "June 2026", media: null },
            { id: 4, title: "Handover", status: "Pending", date: "Aug 2026", media: null },
        ],
        materials: [
            { id: "m1", name: "Bamburi Cement", price: 950, unit: "Bag", icon: "cube-outline" },
            { id: "m2", name: "Steel Rebars (12mm)", price: 1200, unit: "Piece", icon: "reorder-two-outline" },
            { id: "m3", name: "Clay Roof Tiles", price: 85, unit: "Tile", icon: "layers-outline" },
            { id: "m4", name: "Solar Panel 300W", price: 18000, unit: "Panel", icon: "sunny-outline" },
        ],

        // Property Specifics
        bedrooms: dbProject?.metadata?.bedrooms || (id === "mansion_001" ? 5 : (id === "prop001" ? 2 : 3)),
        bathrooms: dbProject?.metadata?.bathrooms || (id === "mansion_001" ? 6 : (id === "prop001" ? 2 : 3)),
        size: dbProject?.metadata?.plotSize || dbProject?.metadata?.size || (id === "mansion_001" ? "550 sqm" : (id === "prop001" ? "120 sqm" : "180 sqm")),

        // Vehicle Specifics
        year: dbProject?.metadata?.year || (isImport ? 2019 : 2018),
        mileage: dbProject?.metadata?.mileage || (isImport ? "45,000 km" : "72,000 km"),
        transmission: dbProject?.metadata?.transmission || "Automatic",
        fuel: dbProject?.metadata?.fuel || "Petrol",
        engine: dbProject?.metadata?.engine || "2500cc",
        importSummary: (isImport || dbProject?.metadata?.source === "Import") ? {
            fob: dbProject?.metadata?.fob || "$12,000",
            shipping: dbProject?.metadata?.ship || "$1,500",
            duty: dbProject?.metadata?.duty || "$4,200",
            clearing: dbProject?.metadata?.clear || "$600"
        } : null,

        // Resolve Developer/Seller Name
        developer: (
            dbProject?.metadata?.partner ||
            dbProject?.partner?.name ||
            (isVehicle ? "Premium Verified Seller" :
                (isUtilities ? "Verified Zamani Supplier" :
                    (isManagedLands ? (id === "69a34cda0d4d59fff6ea5403" ? "Karen Hills Residences" : "Sema Real Estate Group") : "Premium Developer")))
        ),

        // Contact details
        contactPhone: dbProject?.metadata?.phone || (isManagedLands ? "+254 712 345 678" : "+254 700 000 000"),
        contactEmail: dbProject?.metadata?.email || (isManagedLands ? "info@semarealestate.co.ke" : "support@zamani.app"),

        offPlan: !isVehicle && (id === "prop002" || isUtilities || dbProject?.metadata?.offPlan),
        completion: dbProject?.metadata?.completionDate || (isVehicle ? "Available Now" : (isUtilities ? "Aug 2026" : "Dec 2026")),
        description: displayDescription,

        // Product & Utility & Land Info
        landInfo: isManagedLands ? {
            price: dbProject?.price || paramPrice || "KSh 1.2M",
            size: dbProject?.metadata?.plotSize || "50x100 (1/8 Acre)",
            location: dbProject?.location || "Syokimau, Nairobi",
            county: dbProject?.metadata?.county || "Machakos",
            titleDeed: dbProject?.metadata?.titleType || "Ready Freehold Title",
            nearestTown: dbProject?.metadata?.nearestTown || "Athi River (10 Mins)",
            utilities: dbProject?.metadata?.utilities || "Water, Electricity, Near Schools, Hospitals & Tarmac Road"
        } : undefined,
        productInfo: {
            price: displayProductPrice,
            condition: dbProject?.metadata?.condition || "Brand New",
            warranty: "12 Months",
            delivery: "2-3 Working Days",
            seller: dbProject?.metadata?.partner || dbProject?.partner?.name || (isVehicle ? "Premium Verified Seller" : (isUtilities ? "Verified Zamani Supplier" : "Sema Real Estate Group"))
        },
        impact: isVehicle
            ? ["Verified Dealer Guarantee", "Partnering with NCBA/Equity", "7-Day Return Policy"]
            : [
                "Asset-backed Security",
                "Verified Ownership Documents",
                "7.5% - 15% Annual Returns"
            ],
        documents: isVehicle
            ? ["Logbook / Export Cert", "Inspection Certificate", "Sales Agreement"]
            : ["Title Deed", "Floor Plan", "Project Brochure"],
        images: displayImages,

        // Business Opportunity Specifics
        capitalBreakdown: [
            { label: "Land lease / Setup", value: "50,000" },
            { label: "Equipment & Machinery", value: "150,000" },
            { label: "Initial Stock / Inputs", value: "100,000" },
            { label: "Licenses & Permits", value: "20,000" },
            { label: "Working Capital (3 mo)", value: "80,000" },
        ],
        revenueProjection: {
            monthly: dbProject?.metadata?.revenueProjection || "90,000",
            expenses: "35,000",
            netProfit: "55,000",
            breakEven: "10 months"
        },
        riskAssessment: {
            level: dbProject?.metadata?.riskLevel || "Medium",
            volatility: "Moderate",
            weatherDep: "High (Rain-fed)",
            competition: "Low"
        },
        licenses: ["County Permit", "KRA PIN", "KEBS (Value Addition)", "NEMA"],
        recommendedCounties: ["Kiambu", "Murang'a", "Nyeri", "Nakuru"]
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Header Carousel */}
                <View style={styles.heroContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={(e) => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / width);
                            setActiveImageIndex(index);
                        }}
                        scrollEventThrottle={16}
                    >
                        {project.images.map((img: string, index: number) => (
                            <ImageBackground
                                key={index}
                                source={{ uri: img }}
                                style={[styles.heroImage, { width }]}
                            >
                                <View style={styles.heroOverlay}>
                                    <SafeAreaView>
                                        <View style={styles.headerRow}>
                                            <TouchableOpacity
                                                onPress={() => router.back()}
                                                style={styles.backBtn}
                                            >
                                                <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.shareBtn}>
                                                <Ionicons name="share-outline" size={24} color={COLORS.white} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.heroContent}>
                                            <View style={styles.catBadge}>
                                                <Text style={styles.catText}>{project.category}</Text>
                                            </View>
                                            <Text style={styles.title}>{project.title}</Text>
                                            {isManagedLands && (
                                                <Text style={{ color: COLORS.white, fontSize: 14, fontWeight: '600', marginTop: 4 }}>
                                                    {project.location}, {project.landInfo?.county}, {project.landInfo?.size}
                                                </Text>
                                            )}
                                        </View>
                                    </SafeAreaView>
                                </View>
                            </ImageBackground>
                        ))}
                    </ScrollView>

                    {/* Pagination Dots & Counter */}
                    <View style={styles.paginationContainer}>
                        <View style={styles.dotsRow}>
                            {project.images.map((_: string, index: number) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        activeImageIndex === index && styles.dotActive
                                    ]}
                                />
                            ))}
                        </View>
                        <View style={styles.slideCounter}>
                            <Text style={styles.slideCounterText}>{activeImageIndex + 1}/{project.images.length}</Text>
                        </View>
                    </View>
                </View>

                {/* Main Content */}
                <View style={styles.content}>
                    {/* Stats Card - Hidden globally */}
                    {false && (
                        <View style={styles.statsCard}>
                            <View style={styles.statsRow}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Target ROI</Text>
                                    <Text style={styles.statValue}>{project.roi}</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Tenure</Text>
                                    <Text style={styles.statValue}>{project.tenure}</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Investors</Text>
                                    <Text style={styles.statValue}>{project.investors}</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Managed Lands, Build/Buy & Utilities - Simple Information */}
                    {(isManagedLands || isUtilities) && (
                        <View style={styles.statsCard}>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.primary, marginBottom: 16 }}>
                                {isBuildOrBuy ? 'Property Details' : (isUtilities ? 'Product Details' : 'Land Details')}
                            </Text>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                                <View style={{ alignItems: 'center', flex: 1 }}>
                                    <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.secondary }}>
                                        {isUtilities ? (project as any).productInfo?.price : project.landInfo?.price}
                                    </Text>
                                    <Text style={{ fontSize: 12, color: COLORS.textLight, fontWeight: '600', marginTop: 2 }}>PRICE</Text>
                                </View>
                                <View style={{ width: 1, height: 40, backgroundColor: 'rgba(0,0,0,0.05)' }} />
                                <View style={{ alignItems: 'center', flex: 1 }}>
                                    <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.primary }}>
                                        {isUtilities ? (project as any).productInfo?.condition : project.landInfo?.size}
                                    </Text>
                                    <Text style={{ fontSize: 12, color: COLORS.textLight, fontWeight: '600', marginTop: 2 }}>
                                        {isUtilities ? "CONDITION" : (id === "prop003" || id === "prop006" ? "UNITS" : id === "prop004" ? "ROOMS" : id === "prop005" ? "AREA" : "SIZE")}
                                    </Text>
                                </View>
                            </View>

                            <View style={{ gap: 12 }}>
                                {isUtilities ? (
                                    <>
                                        {[
                                            { icon: 'shield-outline', label: 'Warranty', value: (project as any).productInfo?.warranty },
                                            { icon: 'bus-outline', label: 'Delivery', value: (project as any).productInfo?.delivery },
                                            { icon: 'person-outline', label: 'Seller', value: project.developer },
                                        ].map((item: any, idx: number) => (
                                            <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: idx < 2 ? 1 : 0, borderBottomColor: 'rgba(0,0,0,0.04)' }}>
                                                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.heritage, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                                                    <Ionicons name={item.icon as any} size={18} color={COLORS.secondary} />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 12, color: COLORS.textLight, fontWeight: '500', marginBottom: 2 }}>{item.label}</Text>
                                                    <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.primary }}>{item.value}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {project.landInfo?.income && (
                                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.heritage, padding: 12, borderRadius: 12, marginBottom: 4 }}>
                                                <Ionicons name="trending-up" size={20} color={COLORS.secondary} style={{ marginRight: 12 }} />
                                                <View>
                                                    <Text style={{ fontSize: 12, color: COLORS.textLight, fontWeight: '600' }}>EST. MONTHLY REVENUE</Text>
                                                    <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.primary }}>{project.landInfo.income}</Text>
                                                </View>
                                            </View>
                                        )}
                                        {[
                                            { icon: 'location-outline', label: 'Location', value: project.landInfo?.location },
                                            { icon: 'document-text-outline', label: 'Title Deed', value: project.landInfo?.titleDeed },
                                            { icon: 'navigate-outline', label: 'Nearest Town', value: project.landInfo?.nearestTown },
                                            { icon: 'construct-outline', label: 'Utilities & Infrastructure', value: project.landInfo?.utilities },
                                        ].map((item: any, idx: number) => (
                                            <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: idx < 3 ? 1 : 0, borderBottomColor: 'rgba(0,0,0,0.04)' }}>
                                                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.heritage, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                                                    <Ionicons name={item.icon as any} size={18} color={COLORS.secondary} />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 12, color: COLORS.textLight, fontWeight: '500', marginBottom: 2 }}>{item.label}</Text>
                                                    <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.primary }}>{item.value}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Progress Section */}
                    {!isBusiness && !isManagedLands && !isVehicle && !isUtilities && (
                        <View style={styles.section}>
                            <View style={styles.fundingHeader}>
                                <Text style={styles.sectionTitle}>{isUtilities ? "Construction Progress" : "Funding Status"}</Text>
                                <Text style={styles.progressPercent}>{Math.round(project.progress * 100)}%</Text>
                            </View>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${project.progress * 100}%` }]} />
                            </View>
                            <View style={styles.fundingFooter}>
                                <Text style={styles.raisedValue}>{formatCurrency(convertCurrency(dbProject?.currentAmount || 0, "KES", preferredCurrency), preferredCurrency, currencySymbol)} raised</Text>
                                <Text style={styles.targetLabel}>{isUtilities ? "Current Phase" : "Target"}: {formatCurrency(convertCurrency(dbProject?.targetAmount || 0, "KES", preferredCurrency), preferredCurrency, currencySymbol)}</Text>
                            </View>
                        </View>
                    )}

                    {/* Business Opportunity Specific Sections */}
                    {isBusiness && (
                        <>
                            {/* Capital Breakdown */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>💰 Capital Breakdown</Text>
                                <View style={styles.projectionCard}>
                                    {project.capitalBreakdown?.map((item: any, idx: number) => (
                                        <View key={idx} style={styles.projectionRow}>
                                            <Text style={styles.projectionLabel}>{item.label}</Text>
                                            <Text style={styles.projectionValue}>{formatCurrency(convertCurrency(parseInt(item.value.replace(/[^0-9]/g, '')), "KES", preferredCurrency), preferredCurrency, currencySymbol)}</Text>
                                        </View>
                                    ))}
                                    <View style={[styles.importDivider, { marginVertical: 8 }]} />
                                    <View style={styles.projectionRow}>
                                        <Text style={[styles.projectionLabel, { color: COLORS.white, fontWeight: '700' }]}>Total Capital</Text>
                                        <Text style={[styles.projectionValue, { color: COLORS.white, fontSize: 18 }]}>{formatCurrency(convertCurrency(400000, "KES", preferredCurrency), preferredCurrency, currencySymbol)}</Text>
                                    </View>
                                </View>
                            </View>



                            {/* Licenses */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>📜 Required Licenses</Text>
                                <View style={styles.tagsContainer}>
                                    {project.licenses?.map((license: string, idx: number) => (
                                        <View key={idx} style={styles.licenseTag}>
                                            <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.secondary} />
                                            <Text style={styles.licenseTagText}>{license}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                        </>
                    )}





                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{isVehicle ? 'About This Vehicle' : (isBuildOrBuy ? 'About This Property' : (isManagedLands ? 'About This Land' : 'About Investment'))}</Text>
                        <Text style={styles.description}>{project.description}</Text>
                    </View>

                    {/* Project Status Timeline (Construction) */}
                    {isBuildOrBuy && project.milestones && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeaderRow}>
                                <Text style={styles.sectionTitle}>Project Progress Updates</Text>
                                <TouchableOpacity>
                                    <Text style={styles.viewAllLink}>View Admin Log</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.sectionSubtitle}>
                                Periodic updates from the site supervisor and project admin.
                            </Text>

                            <View style={styles.milestoneContainer}>
                                {project.milestones.map((milestone: any, index: number) => (
                                    <View key={milestone.id} style={styles.milestoneRow}>
                                        <View style={styles.milestoneLeft}>
                                            <View style={[
                                                styles.milestoneDot,
                                                milestone.status === "Completed" && styles.milestoneDotCompleted,
                                                milestone.status === "In Progress" && styles.milestoneDotActive
                                            ]} />
                                            {index < project.milestones.length - 1 && <View style={styles.milestoneLine} />}
                                        </View>
                                        <View style={styles.milestoneRight}>
                                            <View style={styles.milestoneTextContent}>
                                                <Text style={[
                                                    styles.milestoneTitle,
                                                    milestone.status === "Completed" && styles.milestoneTitleCompleted
                                                ]}>
                                                    {milestone.title}
                                                </Text>
                                                <Text style={styles.milestoneDate}>{milestone.date} • {milestone.status}</Text>
                                            </View>
                                            {milestone.media && (
                                                <View style={styles.milestoneMedia}>
                                                    <ImageBackground
                                                        source={{ uri: milestone.media }}
                                                        style={styles.milestoneImage}
                                                    >
                                                        <View style={styles.mediaOverlay}>
                                                            <Ionicons name="image-outline" size={20} color={COLORS.white} />
                                                        </View>
                                                    </ImageBackground>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Property Features (Real Estate) */}
                    {project.category === "Real Estate" && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Property Features</Text>
                            <View style={styles.reFeaturesGrid}>
                                <View style={styles.reFeatureBox}>
                                    <Ionicons name="bed-outline" size={24} color={COLORS.primary} />
                                    <Text style={styles.reFeatureValue}>{project.bedrooms}</Text>
                                    <Text style={styles.reFeatureLabel}>Beds</Text>
                                </View>
                                <View style={styles.reFeatureBox}>
                                    <Ionicons name="water-outline" size={24} color={COLORS.primary} />
                                    <Text style={styles.reFeatureValue}>{project.bathrooms}</Text>
                                    <Text style={styles.reFeatureLabel}>Baths</Text>
                                </View>
                                <View style={styles.reFeatureBox}>
                                    <Ionicons name="resize-outline" size={24} color={COLORS.primary} />
                                    <Text style={styles.reFeatureValue}>{project.size}</Text>
                                    <Text style={styles.reFeatureLabel}>Size</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Vehicle Features (Vehicle Sourcing) */}
                    {isVehicle && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Vehicle Specifications</Text>
                            <View style={styles.reFeaturesGrid}>
                                <View style={styles.reFeatureBox}>
                                    <Ionicons name="calendar-outline" size={24} color={COLORS.primary} />
                                    <Text style={styles.reFeatureValue}>{project.year}</Text>
                                    <Text style={styles.reFeatureLabel}>Year</Text>
                                </View>
                                <View style={styles.reFeatureBox}>
                                    <Ionicons name="speedometer-outline" size={24} color={COLORS.primary} />
                                    <Text style={styles.reFeatureValue}>{project.mileage?.replace(' km', '')}</Text>
                                    <Text style={styles.reFeatureLabel}>Km</Text>
                                </View>
                                <View style={styles.reFeatureBox}>
                                    <Ionicons name="cog-outline" size={24} color={COLORS.primary} />
                                    <Text style={styles.reFeatureValue}>{project.transmission === "Automatic" ? "Auto" : "Manual"}</Text>
                                    <Text style={styles.reFeatureLabel}>Trans</Text>
                                </View>
                                <View style={styles.reFeatureBox}>
                                    <Ionicons name="flash-outline" size={24} color={COLORS.primary} />
                                    <Text style={styles.reFeatureValue}>{project.engine}</Text>
                                    <Text style={styles.reFeatureLabel}>Engine</Text>
                                </View>
                                <View style={styles.reFeatureBox}>
                                    <Ionicons name="shield-outline" size={24} color={COLORS.primary} />
                                    <Text style={styles.reFeatureValue}>{dbProject?.metadata?.condition || "New"}</Text>
                                    <Text style={styles.reFeatureLabel}>Cond.</Text>
                                </View>
                                <View style={styles.reFeatureBox}>
                                    <Ionicons name="globe-outline" size={24} color={COLORS.primary} />
                                    <Text style={styles.reFeatureValue}>{dbProject?.metadata?.source || "Local"}</Text>
                                    <Text style={styles.reFeatureLabel}>Source</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Projections Section */}
                    {/* Projections Section - Hidden globally */}
                    {false && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Financial Projections</Text>
                            <View style={styles.projectionCard}>
                                <View style={styles.projectionRow}>
                                    <Text style={styles.projectionLabel}>Estimated ROI</Text>
                                    <Text style={styles.projectionValue}>{project.roi}</Text>
                                </View>
                                <View style={styles.projectionRow}>
                                    <Text style={styles.projectionLabel}>Capital Growth</Text>
                                    <Text style={styles.projectionValue}>12% / yr</Text>
                                </View>
                                <View style={styles.projectionRow}>
                                    <Text style={styles.projectionLabel}>Ownership Type</Text>
                                    <Text style={styles.projectionValue}>Fractional / Full</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Import Cost Summary (Vehicles) */}
                    {isVehicle && isImport && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>🚢 Import Cost Summary</Text>
                            <View style={styles.importCard}>
                                <View style={styles.importRow}>
                                    <Text style={styles.importLabel}>FOB Price (Japan)</Text>
                                    <Text style={styles.importValue}>{project.importSummary?.fob}</Text>
                                </View>
                                <View style={styles.importRow}>
                                    <Text style={styles.importLabel}>Shipping & Insurance</Text>
                                    <Text style={styles.importValue}>{project.importSummary?.shipping}</Text>
                                </View>
                                <View style={styles.importRow}>
                                    <Text style={styles.importLabel}>Duty & Taxes (KRA)</Text>
                                    <Text style={styles.importValue}>{project.importSummary?.duty}</Text>
                                </View>
                                <View style={styles.importRow}>
                                    <Text style={styles.importLabel}>Port Clearing & Delivery</Text>
                                    <Text style={styles.importValue}>{project.importSummary?.clearing}</Text>
                                </View>
                                <View style={styles.importDivider} />
                                <View style={styles.importRow}>
                                    <Text style={[styles.importLabel, { fontWeight: '700', color: COLORS.primary }]}>Total Estimated Cost</Text>
                                    <Text style={[styles.importValue, { color: COLORS.secondary, fontSize: 18 }]}>{project.roi?.split(': ')[1]}</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Developer Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{(isVehicle || isUtilities) ? "Seller" : "Developer"}</Text>
                        <View style={styles.developerCard}>
                            <View style={styles.developerIcon}>
                                <Ionicons name="business" size={24} color={COLORS.white} />
                            </View>
                            <View>
                                <Text style={styles.developerName}>{project.developer}</Text>
                                {!isBusiness && (
                                    <View style={styles.verifiedTag}>
                                        <Ionicons name="checkmark-circle" size={12} color={COLORS.success} />
                                        <Text style={styles.verifiedTagText}>{(isVehicle || isUtilities) ? "VERIFIED SELLER" : "PLATINUM DEVELOPER"}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        {isManagedLands && (
                            <View style={{ marginTop: 16, backgroundColor: COLORS.white, padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 12, color: COLORS.textLight, fontWeight: '600', marginBottom: 4 }}>REACH OUT</Text>
                                    <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.primary }}>{(project as any).contactPhone}</Text>
                                    <Text style={{ fontSize: 14, color: COLORS.textLight, marginTop: 2 }}>{(project as any).contactEmail}</Text>
                                </View>
                                <TouchableOpacity
                                    style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.secondary, justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => {
                                        // Optional: Add linking to phone dialer if phone exists
                                    }}
                                >
                                    <Ionicons name="call" size={20} color={COLORS.white} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Investment Options Selector - hidden for Business */}
                    {!isBusiness && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Investment Model</Text>
                            <View style={styles.investmentGrid}>
                                {[
                                    { id: "Fractional", label: "Fractional", icon: "pie-chart-outline" },
                                    { id: "Installments", label: "Installments", icon: "calendar-outline" },
                                    { id: "Full", label: "Full Purchase", icon: "key-outline" }
                                ].map((type: any) => (
                                    <TouchableOpacity
                                        key={type.id}
                                        style={[
                                            styles.investmentOption,
                                            selectedInvestmentType === type.id && styles.selectedInvestmentOption
                                        ]}
                                        onPress={() => setSelectedInvestmentType(type.id)}
                                    >
                                        <View style={[
                                            styles.investmentIcon,
                                            selectedInvestmentType === type.id && styles.selectedInvestmentIcon
                                        ]}>
                                            <Ionicons
                                                name={type.icon as any}
                                                size={20}
                                                color={selectedInvestmentType === type.id ? COLORS.white : COLORS.primary}
                                            />
                                        </View>
                                        <Text style={[
                                            styles.investmentLabel,
                                            selectedInvestmentType === type.id && styles.selectedInvestmentLabel
                                        ]}>{type.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Special Financing or Progress-based Info */}
                            {selectedInvestmentType === "Installments" && (isVehicle || isUtilities) && (
                                <View style={[styles.projectionCard, { marginTop: 12, backgroundColor: "rgba(10, 31, 68, 0.05)" }]}>
                                    <View style={styles.projectionRow}>
                                        <Ionicons name={isUtilities ? "trending-up-outline" : "card-outline"} size={20} color={COLORS.primary} />
                                        <Text style={[styles.projectionLabel, { color: COLORS.primary, fontWeight: '700', marginLeft: 8 }]}>
                                            {isUtilities ? "Milestone-Based Payment" : "Partner Financing (NCBA)"}
                                        </Text>
                                    </View>
                                    {isUtilities ? (
                                        <>
                                            <View style={[styles.projectionRow, { marginTop: 12 }]}>
                                                <Text style={styles.projectionLabel}>Booking Fee</Text>
                                                <Text style={[styles.projectionValue, { color: COLORS.primary }]}>KSh 100,000</Text>
                                            </View>
                                            <View style={styles.projectionRow}>
                                                <Text style={styles.projectionLabel}>Installment Frequency</Text>
                                                <Text style={[styles.projectionValue, { color: COLORS.primary }]}>Quarterly</Text>
                                            </View>
                                            <View style={styles.projectionRow}>
                                                <Text style={styles.projectionLabel}>Trigger Event</Text>
                                                <Text style={[styles.projectionValue, { color: COLORS.primary }]}>Milestone Completion</Text>
                                            </View>
                                        </>
                                    ) : (
                                        <>
                                            <View style={[styles.projectionRow, { marginTop: 12 }]}>
                                                <Text style={styles.projectionLabel}>Min Deposit</Text>
                                                <Text style={[styles.projectionValue, { color: COLORS.primary }]}>30%</Text>
                                            </View>
                                            <View style={styles.projectionRow}>
                                                <Text style={styles.projectionLabel}>Annual Interest</Text>
                                                <Text style={[styles.projectionValue, { color: COLORS.primary }]}>12.5%</Text>
                                            </View>
                                            <View style={styles.projectionRow}>
                                                <Text style={styles.projectionLabel}>Tenure</Text>
                                                <Text style={[styles.projectionValue, { color: COLORS.primary }]}>Up to 36 Months</Text>
                                            </View>
                                        </>
                                    )}
                                </View>
                            )}
                        </View>
                    )}

                    {/* Trust Section - Hidden globally */}
                    {false && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Trust & Verification</Text>
                            {project.impact.map((item: string, index: number) => (
                                <View key={index} style={styles.impactItem}>
                                    <Ionicons name="shield-checkmark" size={20} color={COLORS.secondary} />
                                    <Text style={styles.impactText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Spacing for button */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Sticky Foot CTA */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.stakeBtn}
                    onPress={() => {
                        if (isManagedLands || isUtilities) {
                            router.push({
                                pathname: "/projects/pay",
                                params: {
                                    id: id,
                                    title: project.title,
                                    price: isUtilities ? displayProductPriceNum : (project.landInfo?.priceNum || parsePrice(project.landInfo?.price)),
                                    location: project.location,
                                    category: project.category,
                                    selectedPlan: selectedInvestmentType // Pass the selected plan down to the payment screen
                                }
                            } as any);
                        } else {
                            router.push({
                                pathname: isBusiness ? "/savings/create-goal" : "/projects/start",
                                params: isBusiness ? {
                                    title: project.title,
                                    target: "400000",
                                    category: "Business",
                                    id: project.id,
                                    capitalBreakdown: JSON.stringify(project.capitalBreakdown),
                                    revenueProjection: JSON.stringify(project.revenueProjection),
                                    riskLevel: project.riskAssessment?.level,
                                    image: project.images[0]
                                } : { id: project.id, mode: selectedInvestmentType }
                            } as any);
                        }
                    }}
                >
                    <Text style={styles.stakeBtnText}>
                        {active === 'true' ? "Continue Investing" :
                            (isManagedLands ? "Proceed to Payment" :
                                isUtilities ? "Continue Payment" :
                                    (isBusiness ? "Start Professional Saving Plan" : (selectedInvestmentType === "Full" ? "Proceed to Purchase" : "Start Investment")))}
                    </Text>
                    <Ionicons name={isManagedLands ? "card" : (isBusiness ? "rocket" : "flash")} size={20} color={COLORS.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.heritage,
    },
    heroContainer: {
        height: 400,
        backgroundColor: COLORS.primary,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    dotsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    dotActive: {
        width: 24,
        backgroundColor: COLORS.white,
        borderRadius: 4,
    },
    slideCounter: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    slideCounterText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '600',
    },
    heroImage: {
        height: 400,
    },
    heroOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        paddingHorizontal: 24,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 10,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    shareBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    heroContent: {
        marginTop: 60,
    },
    catBadge: {
        backgroundColor: COLORS.secondary,
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        marginBottom: 12,
    },
    catText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "800",
        textTransform: "uppercase",
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: COLORS.white,
        lineHeight: 36,
    },
    content: {
        marginTop: -30,
        backgroundColor: COLORS.heritage,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 32,
    },
    statsCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 24,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        marginBottom: 32,
    },
    statsRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 4,
        fontWeight: "600",
    },
    statValue: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.primary,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: "rgba(0,0,0,0.05)",
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.primary,
        marginBottom: 16,
    },
    fundingHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    progressPercent: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.secondary,
    },
    progressBarBg: {
        height: 10,
        backgroundColor: "rgba(10, 31, 68, 0.05)",
        borderRadius: 5,
        overflow: "hidden",
        marginBottom: 12,
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: COLORS.secondary,
        borderRadius: 5,
    },
    fundingFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    raisedValue: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.primary,
    },
    targetLabel: {
        fontSize: 14,
        color: COLORS.textLight,
        fontWeight: "500",
    },
    description: {
        fontSize: 15,
        color: COLORS.textLight,
        lineHeight: 24,
    },
    impactItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        gap: 12,
    },
    impactText: {
        fontSize: 15,
        color: COLORS.text,
        fontWeight: "500",
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: "rgba(245, 239, 231, 0.95)",
        borderTopWidth: 1,
        borderTopColor: "rgba(0,0,0,0.05)",
    },
    stakeBtn: {
        flexDirection: "row",
        backgroundColor: COLORS.secondary,
        height: 60,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        elevation: 8,
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    stakeBtnText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "800",
    },
    reFeaturesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    reFeatureBox: {
        width: (width - 72) / 3, // Roughly 3 per row with gap
        minWidth: 100,
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },
    reFeatureValue: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.primary,
        marginTop: 8,
    },
    reFeatureLabel: {
        fontSize: 10,
        color: COLORS.textLight,
        fontWeight: "700",
        textTransform: "uppercase",
        marginTop: 2,
    },
    projectionCard: {
        backgroundColor: COLORS.primary,
        borderRadius: 24,
        padding: 20,
    },
    projectionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    projectionLabel: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 14,
        fontWeight: "500",
    },
    projectionValue: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: "800",
    },
    developerCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 24,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    licenseTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.secondary + '10',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    licenseTagText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.secondary,
    },
    developerIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
    },
    developerName: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.primary,
    },
    verifiedTag: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 4,
    },
    verifiedTagText: {
        fontSize: 10,
        fontWeight: "800",
        color: COLORS.success,
    },
    investmentGrid: {
        flexDirection: "row",
        gap: 10,
    },
    investmentOption: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 12,
        borderRadius: 16,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "transparent",
    },
    selectedInvestmentOption: {
        borderColor: COLORS.secondary,
        backgroundColor: "rgba(11, 61, 46, 0.05)",
    },
    investmentIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "rgba(10, 31, 68, 0.05)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    selectedInvestmentIcon: {
        backgroundColor: COLORS.secondary,
    },
    investmentLabel: {
        fontSize: 10,
        fontWeight: "700",
        color: COLORS.primary,
        textAlign: "center",
    },
    selectedInvestmentLabel: {
        color: COLORS.secondary,
    },
    importCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        marginTop: 12,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.05)",
    },
    importRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    importLabel: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    importValue: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.primary,
    },
    importDivider: {
        height: 1,
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        marginVertical: 12,
    },
    milestoneContainer: {
        marginTop: 8,
    },
    milestoneRow: {
        flexDirection: "row",
        minHeight: 80,
    },
    milestoneLeft: {
        width: 30,
        alignItems: "center",
    },
    milestoneDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: "rgba(10, 31, 68, 0.1)",
        borderWidth: 2,
        borderColor: COLORS.white,
        zIndex: 1,
    },
    milestoneDotCompleted: {
        backgroundColor: COLORS.success,
    },
    milestoneDotActive: {
        backgroundColor: COLORS.secondary,
        transform: [{ scale: 1.2 }],
    },
    milestoneLine: {
        width: 2,
        flex: 1,
        backgroundColor: "rgba(10, 31, 68, 0.05)",
        marginVertical: -2,
    },
    milestoneRight: {
        flex: 1,
        paddingLeft: 12,
        paddingBottom: 24,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    milestoneTextContent: {
        flex: 1,
    },
    milestoneTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.textLight,
    },
    milestoneTitleCompleted: {
        color: COLORS.primary,
        textDecorationLine: "line-through",
        opacity: 0.6,
    },
    milestoneDate: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 4,
    },
    milestoneMedia: {
        width: 60,
        height: 60,
        borderRadius: 12,
        overflow: "hidden",
        marginLeft: 12,
    },
    milestoneImage: {
        width: "100%",
        height: "100%",
    },
    mediaOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    sectionHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    viewAllLink: {
        fontSize: 14,
        color: COLORS.secondary,
        fontWeight: "700",
    },
    sectionSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 16,
        lineHeight: 20,
    },
    materialsScroll: {
        marginHorizontal: -24,
        paddingHorizontal: 24,
    },
    materialCard: {
        width: 140,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 16,
        marginRight: 12,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.05)",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    materialCardSelected: {
        borderColor: COLORS.secondary,
        backgroundColor: "rgba(11, 61, 46, 0.02)",
    },
    materialIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "rgba(10, 31, 68, 0.05)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    materialName: {
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 4,
    },
    materialPrice: {
        fontSize: 15,
        fontWeight: "800",
        color: COLORS.secondary,
    },
    materialUnit: {
        fontSize: 10,
        color: COLORS.textLight,
        fontWeight: "600",
    },
    materialCheck: {
        position: "absolute",
        top: 12,
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(10, 31, 68, 0.05)",
        justifyContent: "center",
        alignItems: "center",
    },
    materialCheckActive: {
        backgroundColor: COLORS.secondary,
    },
    costSummary: {
        marginTop: 20,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(11, 61, 46, 0.1)",
    },
    costRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    costLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textLight,
    },
    costValue: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.primary,
    },
    checkoutBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: 14,
        padding: 16,
        alignItems: "center",
    },
    checkoutBtnText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: "800",
    },
});
