import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Dimensions
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import Svg, { Path, Circle } from "react-native-svg";
import { theme } from "../../theme";
import BottomNavBar from "../../components/common/BottomNavBar";

const { width } = Dimensions.get("window");

const InsightsScreen = ({ navigation }) => {

    const [tab, setTab] = useState("month")

    return (
        <View style={styles.container}>

            <StatusBar barStyle="dark-content" transparent backgroundColor="transparent" />

            {/* HEADER */}

            <View style={styles.header}>

                <View style={styles.headerLeft}>

                    <TouchableOpacity>
                        <MaterialIcons name="menu" size={26} color={theme.colors.primary} />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Insights</Text>

                </View>

                <View style={styles.avatar} />

            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >

                {/* TABS */}

                <View style={styles.tabsContainer}>

                    {["week", "month", "year"].map(t => (

                        <TouchableOpacity
                            key={t}
                            style={[
                                styles.tab,
                                tab === t && styles.tabActive
                            ]}
                            onPress={() => setTab(t)}
                        >

                            <Text style={[
                                styles.tabText,
                                tab === t && styles.tabTextActive
                            ]}>
                                {t.toUpperCase()}
                            </Text>

                        </TouchableOpacity>

                    ))}

                </View>


                {/* STATS GRID */}

                <View style={styles.statsGrid}>

                    <View style={styles.statCardLarge}>

                        <Text style={styles.statLabel}>AVG MOOD SCORE</Text>

                        <Text style={styles.statValue}>4.8</Text>

                        <View style={styles.trendRow}>
                            <MaterialIcons name="trending-up" size={16} color={theme.colors.primary} />
                            <Text style={styles.trendText}>+12% vs last month</Text>
                        </View>

                    </View>

                    <View style={styles.statsRight}>

                        <View style={styles.statCardSmall}>

                            <Text style={styles.statLabel}>CONSISTENCY</Text>

                            <Text style={styles.statSmallValue}>85%</Text>

                        </View>

                        <View style={[styles.statCardSmall, { marginTop: 20 }]}>

                            <Text style={styles.statLabel}>TOTAL ENTRIES</Text>

                            <Text style={[styles.statSmallValue, { color: theme.colors.tertiary }]}>
                                24
                            </Text>

                        </View>

                    </View>

                </View>


                {/* MOOD FLOW CHART */}

                <View style={styles.chartCard}>

                    <View style={styles.chartHeader}>

                        <Text style={styles.chartTitle}>Mood Flow</Text>
                        <Text style={styles.chartSubtitle}>Your emotional landscape</Text>

                    </View>

                    <Svg width="100%" height="160">

                        <Path
                            d="M0 140 Q80 100 160 120 T320 70 T480 120 T640 80"
                            stroke={theme.colors.primary}
                            strokeWidth="4"
                            fill="none"
                        />

                        <Path
                            d="M0 120 Q80 80 160 100 T320 50 T480 100 T640 60"
                            stroke={theme.colors.secondary}
                            strokeWidth="3"
                            strokeDasharray="5 5"
                            fill="none"
                        />

                        <Circle cx="160" cy="120" r="6" fill={theme.colors.primary} />
                        <Circle cx="480" cy="120" r="6" fill={theme.colors.primary} />

                    </Svg>

                    <View style={styles.chartXAxis}>

                        <Text style={styles.axisLabel}>Week 1</Text>
                        <Text style={styles.axisLabel}>Week 2</Text>
                        <Text style={styles.axisLabel}>Week 3</Text>
                        <Text style={styles.axisLabel}>Week 4</Text>

                    </View>

                </View>


                {/* HEATMAP */}

                <View style={styles.heatmapCard}>

                    <Text style={styles.heatTitle}>Trigger Heatmap</Text>

                    <View style={styles.heatGrid}>

                        {Array.from({ length: 28 }).map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.heatCell,
                                    { opacity: Math.random() * 0.9 + 0.1 }
                                ]}
                            />
                        ))}

                    </View>

                    <Text style={styles.heatInsight}>
                        "You feel most grounded after outdoor walks, but late-night screen time reduces mood."
                    </Text>

                    <View style={styles.tagRow}>

                        <View style={styles.tag}><Text>Nature</Text></View>
                        <View style={styles.tag}><Text>Sleep</Text></View>
                        <View style={styles.tag}><Text>Hydration</Text></View>

                    </View>

                </View>


                {/* CTA */}

                <View style={styles.ctaCard}>

                    <View style={styles.ctaText}>

                        <Text style={styles.ctaTitle}>
                            Cultivate Deeper Insight
                        </Text>

                        <Text style={styles.ctaDesc}>
                            Our AI gardener noticed positive journaling patterns. Ready to explore deeper?
                        </Text>

                        <TouchableOpacity style={styles.ctaButton}>
                            <Text style={styles.ctaButtonText}>
                                Start Daily Focus
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.ctaVisual}>

                        <MaterialIcons
                            name="self-improvement"
                            size={64}
                            color="rgba(255,255,255,0.5)"
                        />

                    </View>

                </View>

            </ScrollView>


            {/* BOTTOM NAVIGATION */}
            <BottomNavBar navigation={navigation} activeTab="Insights" />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.surface
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 80,
        paddingBottom: 120
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 70,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: theme.colors.primary
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primaryContainer
    },
    tabsContainer: {
        flexDirection: "row",
        alignSelf: "center",
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: 12,
        padding: 6,
        marginBottom: 32
    },
    tab: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 10
    },
    tabActive: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4
    },
    tabText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#888"
    },
    tabTextActive: {
        color: theme.colors.primary
    },
    statsGrid: {
        flexDirection: "row",
        marginBottom: 32
    },
    statCardLarge: {
        flex: 1.2,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        marginRight: 16
    },
    statsRight: {
        flex: 1
    },
    statCardSmall: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20
    },
    statLabel: {
        fontSize: 10,
        letterSpacing: 1,
        color: "#888",
        marginBottom: 10
    },
    statValue: {
        fontSize: 48,
        fontWeight: "800",
        color: theme.colors.primary
    },
    statSmallValue: {
        fontSize: 30,
        fontWeight: "700",
        color: theme.colors.secondary
    },
    trendRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4
    },
    trendText: {
        fontSize: 11,
        color: theme.colors.primary,
        fontWeight: "700"
    },
    chartCard: {
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: 16,
        padding: 24,
        marginBottom: 32
    },
    chartHeader: {
        marginBottom: 16
    },
    chartTitle: {
        fontSize: 20,
        fontWeight: "700"
    },
    chartSubtitle: {
        fontSize: 13,
        color: "#888"
    },
    chartXAxis: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
    },
    axisLabel: {
        fontSize: 11,
        color: "#888"
    },
    heatmapCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        marginBottom: 32
    },
    heatTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16
    },
    heatGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: 16
    },
    heatCell: {
        width: 22,
        height: 22,
        backgroundColor: theme.colors.primary,
        borderRadius: 4
    },
    heatInsight: {
        fontSize: 13,
        fontStyle: "italic",
        marginBottom: 14
    },
    tagRow: {
        flexDirection: "row",
        gap: 8
    },
    tag: {
        backgroundColor: theme.colors.secondaryContainer,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12
    },
    ctaCard: {
        flexDirection: "row",
        backgroundColor: theme.colors.primary,
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        justifyContent: "space-between"
    },
    ctaText: {
        flex: 1
    },
    ctaTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 10
    },
    ctaDesc: {
        color: "rgba(255,255,255,0.8)",
        marginBottom: 16
    },
    ctaButton: {
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignSelf: "flex-start"
    },
    ctaButtonText: {
        color: theme.colors.primary,
        fontWeight: "700"
    },
    ctaVisual: {
        width: 100,
        alignItems: "center"
    }
});

export default InsightsScreen;