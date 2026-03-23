import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Dimensions,
    Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path, Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { theme } from '../../theme';
import BottomNavBar from '../../components/common/BottomNavBar';
import logo from '../../../assets/images/logo.png';
import api from '../../services/api';
import { aiApi } from '../../services/aiApi';

const { width } = Dimensions.get('window');

const InsightsScreen = ({ navigation }) => {
    const [tab, setTab] = useState('Month');
    const [user, setUser] = useState(null);
    const [trendData, setTrendData] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);

    React.useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get('/profile');
                setUser(res.data?.user || null);
            } catch (err) { }
        };
        loadProfile();
    }, []);

    React.useEffect(() => {
        if (!user?._id) return;

        const fetchTrends = async () => {
            setLoadingAI(true);
            try {
                const days = tab === 'Week' ? 7 : tab === 'Month' ? 30 : 365;
                const res = await aiApi.analyzeTrends(user._id, days);
                if (res?.data?.success) {
                    setTrendData(res.data.data);
                }
            } catch (error) {
                console.log('Failed to fetch trend data:', error);
            } finally {
                setLoadingAI(false);
            }
        };

        fetchTrends();
    }, [tab, user?._id]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* TOP BAR */}
            <BlurView intensity={80} style={styles.topBar}>
                <View style={styles.topBarLeft}>
                    <Text style={styles.appTitle}>Insights</Text>
                </View>
                <View style={styles.avatarContainer}>
                    <Image
                        source={logo}
                        style={styles.avatar}
                        resizeMode="contain"
                    />
                </View>
            </BlurView>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* INTERACTIVE TABS */}
                <View style={styles.tabsContainer}>
                    <View style={styles.tabsInner}>
                        {['Week', 'Month', 'Year'].map((t) => (
                            <TouchableOpacity
                                key={t}
                                style={[styles.tab, tab === t && styles.activeTab]}
                                onPress={() => setTab(t)}
                            >
                                <Text style={[styles.tabText, tab === t && styles.activeTabText]}>
                                    {t}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* SUMMARY STATS BENTO GRID */}
                <View style={styles.bentoGrid}>
                    <View style={[styles.statCard, styles.fullWidthStat]}>
                        <View style={styles.moodBloomBg} />
                        <Text style={styles.statLabel}>AVG MOOD SCORE</Text>
                        <Text style={styles.statValue}>4.8</Text>
                        <View style={styles.trendRow}>
                            <MaterialIcons name="trending-up" size={16} color={theme.colors.primary} />
                            <Text style={styles.trendText}>+12% vs last month</Text>
                        </View>
                    </View>

                    <View style={styles.statRow}>
                        <View style={styles.statCardHalf}>
                            <Text style={styles.statLabel}>CONSISTENCY</Text>
                            <View style={styles.circularProgress}>
                                <Svg width="80" height="80" viewBox="0 0 80 80">
                                    <Circle
                                        cx="40"
                                        cy="40"
                                        r="35"
                                        stroke={theme.colors.surfaceContainer}
                                        strokeWidth="8"
                                        fill="transparent"
                                    />
                                    <Circle
                                        cx="40"
                                        cy="40"
                                        r="35"
                                        stroke={theme.colors.secondary}
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray="219.8"
                                        strokeDashoffset={219.8 * (1 - 0.85)}
                                        strokeLinecap="round"
                                    />
                                </Svg>
                                <Text style={styles.progressText}>85%</Text>
                            </View>
                        </View>

                        <View style={styles.statCardHalf}>
                            <Text style={styles.statLabel}>TOTAL ENTRIES</Text>
                            <Text style={[styles.statValue, { color: theme.colors.tertiary }]}>24</Text>
                            <Text style={styles.statSubText}>"Deepening your practice"</Text>
                        </View>
                    </View>
                </View>

                {/* MOOD FLOW CHART */}
                <View style={styles.chartSection}>
                    <View style={styles.chartHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>Mood Flow</Text>
                            <Text style={styles.sectionSubTitle}>Visualizing your emotional landscape</Text>
                        </View>
                        <View style={styles.chartLegend}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
                                <Text style={styles.legendText}>Mood</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: theme.colors.secondary }]} />
                                <Text style={styles.legendText}>Energy</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.chartContainer}>
                        {/* Grid Lines */}
                        <View style={styles.chartGrid}>
                            {[0, 1, 2, 3].map((i) => (
                                <View key={i} style={styles.gridLine} />
                            ))}
                        </View>

                        <Svg width="100%" height="200" style={styles.svgChart}>
                            {/* Energy Line */}
                            <Path
                                d="M0,150 Q50,80 100,120 T200,60 T300,140 T400,100"
                                stroke={theme.colors.secondary}
                                strokeWidth="3"
                                strokeDasharray="4 4"
                                fill="none"
                                opacity="0.4"
                            />
                            {/* Mood Line */}
                            <Path
                                d="M0,180 Q50,140 100,60 T200,90 T300,30 T400,70"
                                stroke={theme.colors.primary}
                                strokeWidth="4"
                                fill="none"
                            />
                            {/* Dots */}
                            <Circle cx="100" cy="60" r="5" fill={theme.colors.primary} />
                            <Circle cx="300" cy="30" r="5" fill={theme.colors.primary} />
                        </Svg>

                        <View style={styles.xAxis}>
                            <Text style={styles.xAxisLabel}>Week 1</Text>
                            <Text style={styles.xAxisLabel}>Week 2</Text>
                            <Text style={styles.xAxisLabel}>Week 3</Text>
                            <Text style={styles.xAxisLabel}>Week 4</Text>
                        </View>
                    </View>
                </View>

                {/* COMPARATIVE ANALYSIS */}
                <View style={styles.analysisCard}>
                    <Text style={styles.cardTitle}>Comparative Analysis</Text>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeadText}>METRIC</Text>
                        <Text style={styles.tableHeadText}>PREV.</Text>
                        <Text style={styles.tableHeadText}>CURR.</Text>
                        <Text style={styles.tableHeadText}>CHG.</Text>
                    </View>

                    <View style={styles.tableRow}>
                        <Text style={styles.metricName}>Avg Mood</Text>
                        <Text style={styles.prevVal}>4.2</Text>
                        <Text style={styles.currVal}>4.8</Text>
                        <View style={styles.changeCell}>
                            <MaterialIcons name="arrow-upward" size={14} color={theme.colors.primary} />
                            <Text style={styles.changeText}>14%</Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <Text style={styles.metricName}>Consistency</Text>
                        <Text style={styles.prevVal}>78%</Text>
                        <Text style={styles.currVal}>85%</Text>
                        <View style={styles.changeCell}>
                            <MaterialIcons name="arrow-upward" size={14} color={theme.colors.primary} />
                            <Text style={styles.changeText}>9%</Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <Text style={styles.metricName}>Entries</Text>
                        <Text style={styles.prevVal}>18</Text>
                        <Text style={styles.currVal}>24</Text>
                        <View style={styles.changeCell}>
                            <MaterialIcons name="add" size={14} color={theme.colors.primary} />
                            <Text style={styles.changeText}>6</Text>
                        </View>
                    </View>
                </View>

                {/* TRIGGER HEATMAP */}
                <View style={styles.heatmapCard}>
                    <View style={styles.heatTitleRow}>
                        <MaterialIcons name="auto-awesome" size={20} color={theme.colors.primary} />
                        <Text style={styles.cardTitle}>Trigger Heatmap</Text>
                    </View>

                    <View style={styles.heatGrid}>
                        {[0.1, 0.3, 0.05, 0.6, 0.2, 0.8, 0.1, 0.05, 0.4, 0.1, 0.7, 0.1, 0.05, 0.3].map((op, i) => (
                            <View key={i} style={[styles.heatCell, { opacity: op }]} />
                        ))}
                    </View>

                    <View style={styles.heatInsightBox}>
                        <Text style={styles.insightText}>
                            "You tend to feel most grounded on Tuesday mornings after <Text style={styles.boldPrimary}>outdoor walks</Text>. However, late-night screen time correlates with 20% lower mood scores the following day."
                        </Text>
                    </View>

                    <View style={styles.tagRow}>
                        <View style={[styles.tag, { backgroundColor: theme.colors.secondaryContainer }]}>
                            <Text style={styles.tagText}>Nature</Text>
                        </View>
                        <View style={[styles.tag, { backgroundColor: theme.colors.secondaryContainer }]}>
                            <Text style={styles.tagText}>Sleep</Text>
                        </View>
                        <View style={[styles.tag, { backgroundColor: '#ffe174' }]}>
                            <Text style={[styles.tagText, { color: '#554500' }]}>Hydration</Text>
                        </View>
                    </View>
                </View>

                {/* AI INSIGHTS SECTION */}
                <View style={styles.aiInsightsContainer}>
                    <View style={styles.aiInsightsHeader}>
                        <View style={styles.aiIconContainer}>
                            <MaterialIcons name="psychology" size={24} color="#fff" />
                        </View>
                        <View style={styles.aiHeaderTextContainer}>
                            <Text style={styles.aiInsightsTitle}>AI Insights</Text>
                            <Text style={styles.aiInsightsSubtitle}>Personalized discoveries from your journal</Text>
                        </View>
                    </View>
                    
                    {loadingAI ? (
                        <View style={styles.aiLoadingContainer}>
                            <View style={styles.loadingSpinner} />
                            <Text style={styles.aiLoadingText}>Analyzing your emotional landscape...</Text>
                        </View>
                    ) : trendData?.insights?.length > 0 ? (
                        <View style={styles.aiInsightsList}>
                            {trendData.insights.map((insight, idx) => (
                                <View key={idx} style={styles.aiInsightCard}>
                                    <View style={styles.insightNumberContainer}>
                                        <Text style={styles.insightNumber}>{idx + 1}</Text>
                                    </View>
                                    <View style={styles.insightContent}>
                                        <Text style={styles.insightText}>{insight}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.aiEmptyState}>
                            <View style={styles.emptyStateIcon}>
                                <MaterialIcons name="lightbulb-outline" size={48} color={theme.colors.primary} />
                            </View>
                            <Text style={styles.emptyStateText}>Keep logging your mood to unlock deep AI insights!</Text>
                            <Text style={styles.emptyStateSubtext}>The more you journal, the smarter your insights become</Text>
                        </View>
                    )}
                </View>

                {/* CTA SECTION */}
                <View style={styles.ctaCard}>
                    <View style={styles.ctaContent}>
                        <Text style={styles.ctaTitle}>Cultivate Deeper Insight</Text>
                        <Text style={styles.ctaDesc}>
                            Our AI gardener has noticed a positive pattern in your journaling. Ready to dive deeper into your reflection practice?
                        </Text>
                        <TouchableOpacity style={styles.ctaButton}>
                            <Text style={styles.ctaButtonText}>Start Daily Focus</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ctaVisual}>
                        <View style={styles.bloomCircle}>
                            <MaterialIcons name="self-improvement" size={48} color="rgba(255,255,255,0.4)" />
                        </View>
                    </View>
                    <View style={styles.ctaDecor} />
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
        backgroundColor: theme.colors.background,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 16,
        paddingHorizontal: 24,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(6,33,10,0.05)',
    },
    topBarLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    appTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#064e3b',
        fontFamily: theme.fonts.headline,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: theme.colors.primaryContainer,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    scrollContent: {
        paddingTop: 120,
        paddingHorizontal: 24,
        paddingBottom: 140,
    },
    tabsContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    tabsInner: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surfaceContainerLow,
        padding: 6,
        borderRadius: 12,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#fff',
        ...theme.shadows.soft,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.onSurfaceVariant,
        fontFamily: theme.fonts.headline,
    },
    activeTabText: {
        color: theme.colors.primary,
        fontWeight: '700',
    },
    bentoGrid: {
        gap: 16,
        marginBottom: 32,
    },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.lg,
        padding: 24,
        alignItems: 'center',
        ...theme.shadows.soft,
        overflow: 'hidden',
    },
    fullWidthStat: {
        height: 180,
        justifyContent: 'center',
    },
    moodBloomBg: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 100,
        height: 100,
        backgroundColor: 'rgba(39, 107, 46, 0.05)',
        borderRadius: 50,
        transform: [{ scaleX: 1.5 }],
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
        color: theme.colors.onSurfaceVariant,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 48,
        fontWeight: '800',
        color: theme.colors.primary,
        fontFamily: theme.fonts.headline,
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
    },
    trendText: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    statRow: {
        flexDirection: 'row',
        gap: 16,
    },
    statCardHalf: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.lg,
        padding: 24,
        alignItems: 'center',
        ...theme.shadows.soft,
    },
    circularProgress: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    progressText: {
        position: 'absolute',
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.headline,
    },
    statSubText: {
        fontSize: 11,
        color: theme.colors.onSurfaceVariant,
        fontStyle: 'italic',
        marginTop: 8,
        textAlign: 'center',
    },
    chartSection: {
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: theme.borderRadius.lg,
        padding: 24,
        marginBottom: 32,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.headline,
    },
    sectionSubTitle: {
        fontSize: 13,
        color: theme.colors.onSurfaceVariant,
    },
    chartLegend: {
        flexDirection: 'row',
        gap: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 11,
        fontWeight: '600',
        color: theme.colors.onSurfaceVariant,
    },
    chartContainer: {
        height: 200,
        position: 'relative',
    },
    chartGrid: {
        position: 'absolute',
        inset: 0,
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    gridLine: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        width: '100%',
    },
    svgChart: {
        zIndex: 10,
    },
    xAxis: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingHorizontal: 4,
    },
    xAxisLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: theme.colors.onSurfaceVariant,
        textTransform: 'uppercase',
    },
    analysisCard: {
        backgroundColor: theme.colors.surfaceContainerHighest,
        borderRadius: theme.borderRadius.lg,
        padding: 24,
        marginBottom: 32,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.onSurface,
        marginBottom: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        paddingBottom: 8,
    },
    tableHeadText: {
        flex: 1,
        fontSize: 10,
        fontWeight: '800',
        color: theme.colors.onSurfaceVariant,
        letterSpacing: 1,
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    metricName: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.onSurface,
    },
    prevVal: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
    },
    currVal: {
        flex: 1,
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.onSurface,
    },
    changeCell: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    changeText: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    heatmapCard: {
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.lg,
        padding: 24,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(39, 107, 46, 0.05)',
    },
    heatTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    heatGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 20,
    },
    heatCell: {
        width: 24,
        height: 24,
        backgroundColor: theme.colors.primary,
        borderRadius: 4,
    },
    heatInsightBox: {
        backgroundColor: 'rgba(39, 107, 46, 0.05)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    insightText: {
        fontSize: 14,
        fontStyle: 'italic',
        lineHeight: 22,
        color: theme.colors.onSurfaceVariant,
    },
    boldPrimary: {
        fontWeight: '700',
        color: theme.colors.primary,
    },
    tagRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 99,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.onSecondaryContainer,
    },
    ctaCard: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.lg,
        padding: 32,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        ...theme.shadows.primary,
    },
    ctaContent: {
        flex: 1,
        zIndex: 10,
    },
    ctaTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 12,
        fontFamily: theme.fonts.headline,
    },
    ctaDesc: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 20,
        marginBottom: 24,
    },
    ctaButton: {
        backgroundColor: '#ffe174', // tertiary-fixed
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    ctaButtonText: {
        color: '#221b00',
        fontWeight: '700',
        fontSize: 15,
    },
    ctaVisual: {
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    bloomCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaDecor: {
        position: 'absolute',
        bottom: -40,
        left: -40,
        width: 120,
        height: 120,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 60,
    },
    // AI INSIGHTS STYLES
    aiInsightsContainer: {
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.lg,
        padding: 24,
        marginBottom: 32,
        borderWidth: 2,
        borderColor: 'rgba(39, 107, 46, 0.08)',
        ...theme.shadows.soft,
    },
    aiInsightsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
    },
    aiIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.primary,
    },
    aiHeaderTextContainer: {
        flex: 1,
    },
    aiInsightsTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.headline,
        marginBottom: 4,
    },
    aiInsightsSubtitle: {
        fontSize: 13,
        color: theme.colors.onSurfaceVariant,
        lineHeight: 18,
    },
    aiLoadingContainer: {
        alignItems: 'center',
        paddingVertical: 32,
        gap: 12,
    },
    loadingSpinner: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: theme.colors.primary,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
    },
    aiLoadingText: {
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
        fontStyle: 'italic',
    },
    aiInsightsList: {
        gap: 16,
    },
    aiInsightCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
        backgroundColor: 'rgba(39, 107, 46, 0.03)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(39, 107, 46, 0.08)',
    },
    insightNumberContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.soft,
    },
    insightNumber: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
        fontFamily: theme.fonts.headline,
    },
    insightContent: {
        flex: 1,
    },
    aiEmptyState: {
        alignItems: 'center',
        paddingVertical: 40,
        gap: 16,
    },
    emptyStateIcon: {
        opacity: 0.6,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.onSurface,
        textAlign: 'center',
        lineHeight: 24,
    },
    emptyStateSubtext: {
        fontSize: 13,
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
        lineHeight: 18,
        fontStyle: 'italic',
    }
});

export default InsightsScreen;