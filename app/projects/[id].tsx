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
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [selectedInvestmentType, setSelectedInvestmentType] = React.useState("Fractional");

    // Mock Data Fetch based on ID
    const isVehicle = (id as string)?.startsWith("veh");
    const isInfrastructure = (id as string)?.startsWith("res") || (id as string)?.startsWith("com") || (id as string)?.startsWith("utl") || id === "144" || id === "156";
    const isBusiness = (id as string)?.startsWith("biz");
    const isImport = (id as string)?.includes("imp");

    const [selectedMaterials, setSelectedMaterials] = React.useState<string[]>([]);

    const project = {
        id: id,
        title: isVehicle
            ? (isImport ? "2019 Toyota Harrier" : "2018 Toyota Prado TX-L")
            : (isInfrastructure
                ? (id === "res001" || id === "hot_inf_1" ? "Modern 3-Bedroom Villa" : "Athi River Warehouse")
                : (isBusiness
                    ? (id === "biz_001" ? "Poultry Farming (Layers)" : id === "biz_ag_002" ? "Greenhouse Tomato Farming" : "Tilapia Fish Farming")
                    : (id === "prop001" ? "Modern 2 Bedroom - Westlands" : id === "prop002" ? "Off-Plan 3 Bedroom Villa" : id === "1" ? "Rift Valley Macro-Farm" : "Nairobi Smart Lofts"))),
        category: isVehicle ? "Vehicle Sourcing" : (isInfrastructure ? "Infrastructure" : (isBusiness ? "Business" : ((id as string)?.startsWith("prop") ? "Real Estate" : "Managed Lands"))),
        roi: isVehicle
            ? (isImport ? "Est. Total: $18,300" : "Verified Dealer")
            : (isInfrastructure ? "12% - 15% ROI" : (isBusiness ? "35% Profit" : (id === "prop001" ? "7.5% Yield" : id === "prop002" ? "15% ROI" : "18%"))),
        tenure: isVehicle ? "Immediate" : (isInfrastructure ? "12-24 Months" : (isBusiness ? "Recurring Income" : "Flexible")),
        fundinged: isVehicle ? (isImport ? "$12,000" : "KSh 5.8M") : (isInfrastructure ? "KSh 4.8M" : (isBusiness ? "KSh 0" : (id === "prop001" ? "KSh 60M" : id === "prop002" ? "KSh 20M" : "KSh 15.4M"))),
        target: isVehicle ? (isImport ? "$18,300" : "Ready Stock") : (isInfrastructure ? "KSh 12M" : (isBusiness ? "KSh 400,000" : (id === "prop001" ? "KSh 100M" : id === "prop002" ? "KSh 80M" : "KSh 20M"))),
        progress: isVehicle ? (isImport ? 0.0 : 1.0) : (isInfrastructure ? 0.40 : (isBusiness ? 0.0 : (id === "prop001" ? 0.60 : id === "prop002" ? 0.25 : 0.77))),
        investors: isVehicle ? (isImport ? 12 : 1) : (isInfrastructure ? 28 : (isBusiness ? 1 : (id === "prop001" ? 180 : 45))),
        location: isVehicle ? (isImport ? "Japan -> Mombasa" : "Westlands, Nairobi") : (isInfrastructure ? "Syokimau / Athi River" : (isBusiness ? "Kiambu, Central" : (id === "prop001" ? "Westlands, Nairobi" : "Syokimau, Nairobi"))),

        // Infrastructure Specifics
        milestones: [
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
        bedrooms: id === "prop001" ? 2 : 3,
        bathrooms: id === "prop001" ? 2 : 3,
        size: id === "prop001" ? "120 sqm" : "180 sqm",

        // Vehicle Specifics
        year: isImport ? 2019 : 2018,
        mileage: isImport ? "45,000 km" : "72,000 km",
        transmission: "Automatic",
        fuel: "Petrol",
        engine: "2500cc",
        importSummary: isImport ? {
            fob: "$12,000",
            shipping: "$1,500",
            duty: "$4,200",
            clearing: "$600"
        } : null,

        developer: isVehicle ? "Toyota Kenya Partner" : (isInfrastructure ? "GreenBuild Ltd" : "Sema Real Estate Group"),
        offPlan: !isVehicle && (id === "prop002" || isInfrastructure),
        completion: isVehicle ? "Available Now" : (isInfrastructure ? "Aug 2026" : "Dec 2026"),
        description: isVehicle
            ? "A meticulously maintained vehicle offering comfort, reliability, and modern features. Fully inspected and verified for quality assurance."
            : (isInfrastructure
                ? "A context-aware infrastructure project designed for maximum efficiency and sustainability. Track live updates and construction milestones as we build."
                : ((id as string)?.startsWith("prop")
                    ? "A premium residential development offering unmatched luxury and strategic location. Perfect for both high-yield rental income and long-term capital appreciation."
                    : "Expanding our large-scale production in high-yield areas. Using advanced techniques, we target premium markets while empowering local communities.")),
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
        images: isVehicle
            ? [
                "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format&fit=crop"
            ]
            : (isInfrastructure
                ? [
                    "https://images.unsplash.com/photo-1503387762-592dea58ef41?q=80&w=800&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop"
                ]
                : [
                    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1460317442991-0ec23939714b?q=80&w=800&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
                ]),

        // Business Opportunity Specifics
        capitalBreakdown: [
            { label: "Land lease / Setup", value: "50,000" },
            { label: "Equipment & Machinery", value: "150,000" },
            { label: "Initial Stock / Inputs", value: "100,000" },
            { label: "Licenses & Permits", value: "20,000" },
            { label: "Working Capital (3 mo)", value: "80,000" },
        ],
        revenueProjection: {
            monthly: "90,000",
            expenses: "35,000",
            netProfit: "55,000",
            breakEven: "10 months"
        },
        riskAssessment: {
            level: "Medium",
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
                    >
                        {project.images.map((img, index) => (
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
                                        </View>
                                    </SafeAreaView>
                                </View>
                            </ImageBackground>
                        ))}
                    </ScrollView>
                </View>

                {/* Main Content */}
                <View style={styles.content}>
                    {/* Stats Card */}
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

                    {/* Progress Section */}
                    {!isBusiness && (
                        <View style={styles.section}>
                            <View style={styles.fundingHeader}>
                                <Text style={styles.sectionTitle}>{isInfrastructure ? "Construction Progress" : "Funding Status"}</Text>
                                <Text style={styles.progressPercent}>{Math.round(project.progress * 100)}%</Text>
                            </View>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${project.progress * 100}%` }]} />
                            </View>
                            <View style={styles.fundingFooter}>
                                <Text style={styles.raisedValue}>{project.fundinged}</Text>
                                <Text style={styles.targetLabel}>{isInfrastructure ? "Current Phase" : "Target"}: {project.target}</Text>
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
                                    {project.capitalBreakdown?.map((item, idx) => (
                                        <View key={idx} style={styles.projectionRow}>
                                            <Text style={styles.projectionLabel}>{item.label}</Text>
                                            <Text style={styles.projectionValue}>KES {item.value}</Text>
                                        </View>
                                    ))}
                                    <View style={[styles.importDivider, { marginVertical: 8 }]} />
                                    <View style={styles.projectionRow}>
                                        <Text style={[styles.projectionLabel, { color: COLORS.white, fontWeight: '700' }]}>Total Capital</Text>
                                        <Text style={[styles.projectionValue, { color: COLORS.white, fontSize: 18 }]}>KES 400,000</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Revenue Projection */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>📈 Monthly Projections</Text>
                                <View style={[styles.projectionCard, { backgroundColor: COLORS.secondary }]}>
                                    <View style={styles.projectionRow}>
                                        <Text style={styles.projectionLabel}>Est. Monthly Revenue</Text>
                                        <Text style={styles.projectionValue}>KES {project.revenueProjection?.monthly}</Text>
                                    </View>
                                    <View style={styles.projectionRow}>
                                        <Text style={styles.projectionLabel}>Est. Expenses</Text>
                                        <Text style={styles.projectionValue}>KES {project.revenueProjection?.expenses}</Text>
                                    </View>
                                    <View style={styles.importDivider} />
                                    <View style={styles.projectionRow}>
                                        <Text style={[styles.projectionLabel, { color: COLORS.white, fontWeight: '700' }]}>Net Monthly Profit</Text>
                                        <Text style={[styles.projectionValue, { color: COLORS.white, fontSize: 18 }]}>KES {project.revenueProjection?.netProfit}</Text>
                                    </View>
                                    <View style={[styles.projectionRow, { marginTop: 8 }]}>
                                        <Text style={[styles.projectionLabel, { color: 'rgba(255,255,255,0.6)' }]}>Break-even Period</Text>
                                        <Text style={[styles.projectionValue, { color: COLORS.success }]}>{project.revenueProjection?.breakEven}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Risk Assessment */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>⚠️ Risk Assessment</Text>
                                <View style={styles.reFeaturesGrid}>
                                    <View style={styles.reFeatureBox}>
                                        <Ionicons name="warning-outline" size={24} color={COLORS.primary} />
                                        <Text style={styles.reFeatureValue}>{project.riskAssessment?.level}</Text>
                                        <Text style={styles.reFeatureLabel}>Risk Level</Text>
                                    </View>
                                    <View style={styles.reFeatureBox}>
                                        <Ionicons name="trending-down-outline" size={24} color={COLORS.primary} />
                                        <Text style={styles.reFeatureValue}>{project.riskAssessment?.competition}</Text>
                                        <Text style={styles.reFeatureLabel}>Competition</Text>
                                    </View>
                                    <View style={styles.reFeatureBox}>
                                        <Ionicons name="cloud-outline" size={24} color={COLORS.primary} />
                                        <Text style={styles.reFeatureValue}>High</Text>
                                        <Text style={styles.reFeatureLabel}>Weather Dep.</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Licenses */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>📜 Required Licenses</Text>
                                <View style={styles.tagsContainer}>
                                    {project.licenses?.map((license, idx) => (
                                        <View key={idx} style={styles.licenseTag}>
                                            <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.secondary} />
                                            <Text style={styles.licenseTagText}>{license}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Recommended Counties */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>📍 Recommended Counties</Text>
                                <View style={styles.tagsContainer}>
                                    {project.recommendedCounties?.map((county, idx) => (
                                        <View key={idx} style={[styles.licenseTag, { backgroundColor: COLORS.primary + '10' }]}>
                                            <Ionicons name="location-outline" size={16} color={COLORS.primary} />
                                            <Text style={[styles.licenseTagText, { color: COLORS.primary }]}>{county}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </>
                    )}

                    {/* Infrastructure Milestones */}
                    {isInfrastructure && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Project Milestones</Text>
                            <View style={styles.milestoneContainer}>
                                {project.milestones?.map((m, idx) => (
                                    <View key={m.id} style={styles.milestoneRow}>
                                        <View style={styles.milestoneLeft}>
                                            <View style={[
                                                styles.milestoneDot,
                                                m.status === "Completed" && styles.milestoneDotCompleted,
                                                m.status === "In Progress" && styles.milestoneDotActive
                                            ]} />
                                            {idx < (project.milestones?.length || 0) - 1 && <View style={styles.milestoneLine} />}
                                        </View>
                                        <View style={styles.milestoneRight}>
                                            <View style={styles.milestoneTextContent}>
                                                <Text style={[
                                                    styles.milestoneTitle,
                                                    m.status === "Completed" && styles.milestoneTitleCompleted
                                                ]}>{m.title}</Text>
                                                <Text style={styles.milestoneDate}>{m.date} • {m.status}</Text>
                                            </View>
                                            {m.media && (
                                                <TouchableOpacity style={styles.milestoneMedia}>
                                                    <ImageBackground source={{ uri: m.media }} style={styles.milestoneImage} imageStyle={{ borderRadius: 12 }}>
                                                        <View style={styles.mediaOverlay}>
                                                            <Ionicons name="play-circle" size={24} color={COLORS.white} />
                                                        </View>
                                                    </ImageBackground>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Materials Marketplace (Infrastructure) */}
                    {isInfrastructure && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeaderRow}>
                                <Text style={styles.sectionTitle}>Materials & Products</Text>
                                <TouchableOpacity>
                                    <Text style={styles.viewAllLink}>Partner Pricing</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.sectionSubtitle}>Purchase quality materials directly via Zamani partners.</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.materialsScroll}>
                                {project.materials?.map(item => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[
                                            styles.materialCard,
                                            selectedMaterials.includes(item.id) && styles.materialCardSelected
                                        ]}
                                        onPress={() => {
                                            if (selectedMaterials.includes(item.id)) {
                                                setSelectedMaterials(selectedMaterials.filter(id => id !== item.id));
                                            } else {
                                                setSelectedMaterials([...selectedMaterials, item.id]);
                                            }
                                        }}
                                    >
                                        <View style={styles.materialIcon}>
                                            <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
                                        </View>
                                        <Text style={styles.materialName}>{item.name}</Text>
                                        <Text style={styles.materialPrice}>KSh {item.price.toLocaleString()}</Text>
                                        <Text style={styles.materialUnit}>per {item.unit}</Text>
                                        <View style={[
                                            styles.materialCheck,
                                            selectedMaterials.includes(item.id) && styles.materialCheckActive
                                        ]}>
                                            <Ionicons
                                                name={selectedMaterials.includes(item.id) ? "checkmark" : "add"}
                                                size={16}
                                                color={selectedMaterials.includes(item.id) ? COLORS.white : COLORS.primary}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {selectedMaterials.length > 0 && (
                                <View style={styles.costSummary}>
                                    <View style={styles.costRow}>
                                        <Text style={styles.costLabel}>Selected Supplies ({selectedMaterials.length})</Text>
                                        <Text style={styles.costValue}>
                                            KSh {project.materials
                                                ?.filter(m => selectedMaterials.includes(m.id))
                                                .reduce((sum, m) => sum + m.price, 0)
                                                .toLocaleString()}
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={styles.checkoutBtn}>
                                        <Text style={styles.checkoutBtnText}>Order Materials</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}

                    {/* About Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About Investment</Text>
                        <Text style={styles.description}>{project.description}</Text>
                    </View>

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
                            </View>
                        </View>
                    )}

                    {/* Projections Section */}
                    {project.category !== "Vehicle Sourcing" && (
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
                        <Text style={styles.sectionTitle}>Developer</Text>
                        <View style={styles.developerCard}>
                            <View style={styles.developerIcon}>
                                <Ionicons name="business" size={24} color={COLORS.white} />
                            </View>
                            <View>
                                <Text style={styles.developerName}>{project.developer}</Text>
                                <View style={styles.verifiedTag}>
                                    <Ionicons name="checkmark-circle" size={12} color={COLORS.success} />
                                    <Text style={styles.verifiedTagText}>PLATINUM DEVELOPER</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Investment Options Selector */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Investment Model</Text>
                        <View style={styles.investmentGrid}>
                            {[
                                { id: "Fractional", label: "Fractional", icon: "pie-chart-outline" },
                                { id: "Installments", label: "Installments", icon: "calendar-outline" },
                                { id: "Full", label: "Full Purchase", icon: "key-outline" }
                            ].map((type) => (
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
                        {selectedInvestmentType === "Installments" && (isVehicle || isInfrastructure) && (
                            <View style={[styles.projectionCard, { marginTop: 12, backgroundColor: "rgba(10, 31, 68, 0.05)" }]}>
                                <View style={styles.projectionRow}>
                                    <Ionicons name={isInfrastructure ? "trending-up-outline" : "card-outline"} size={20} color={COLORS.primary} />
                                    <Text style={[styles.projectionLabel, { color: COLORS.primary, fontWeight: '700', marginLeft: 8 }]}>
                                        {isInfrastructure ? "Milestone-Based Payment" : "Partner Financing (NCBA)"}
                                    </Text>
                                </View>
                                {isInfrastructure ? (
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

                    {/* Trust Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Trust & Verification</Text>
                        {project.impact.map((item, index) => (
                            <View key={index} style={styles.impactItem}>
                                <Ionicons name="shield-checkmark" size={20} color={COLORS.secondary} />
                                <Text style={styles.impactText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Spacing for button */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Sticky Foot CTA */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.stakeBtn}
                    onPress={() => router.push({
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
                    } as any)}
                >
                    <Text style={styles.stakeBtnText}>
                        {isBusiness ? "Start Professional Saving Plan" : (selectedInvestmentType === "Full" ? "Proceed to Purchase" : "Start Investment")}
                    </Text>
                    <Ionicons name={isBusiness ? "rocket" : "flash"} size={20} color={COLORS.white} />
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
        gap: 12,
    },
    reFeatureBox: {
        flex: 1,
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
