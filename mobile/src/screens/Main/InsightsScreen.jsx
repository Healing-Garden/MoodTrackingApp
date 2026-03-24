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
import { userService } from '../../services/userService';
import { aiApi } from '../../services/aiApi';

const { width } = Dimensions.get('window');

const InsightsScreen = ({ navigation }) => {
    const [tab, setTab] = useState('Month');
    const [user, setUser] = useState(null);
    const [trendData, setTrendData] = useState(null);
    const [summary, setSummary] = useState(null);
    const [moodFlowData, setMoodFlowData] = useState(null);
    const [heatmapData, setHeatmapData] = useState(null);
    const [wordCloud, setWordCloud] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);
    const [loadingFlow, setLoadingFlow] = useState(false);

    React.useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile = await userService.getProfile();
                setUser(profile || null);
            } catch (err) { 
                console.log('Failed to load profile:', err);
            }
        };
        loadProfile();
    }, []);

    React.useEffect(() => {
        const fetchData = async () => {
            const timeRange = tab.toLowerCase(); // 'week', 'month', 'year'
            const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;

            // Fetch AI Trends
            if (user?._id) {
                setLoadingAI(true);
                try {
                    const res = await aiApi.analyzeTrends(user._id, days);
                    if (res?.data?.success) {
                        setTrendData(res.data.data);
                    }
                } catch (error) {
                    console.log('Failed to fetch trend data:', error);
                } finally {
                    setLoadingAI(false);
                }
            }

            // Fetch Analytics Summary
            setLoadingSummary(true);
            try {
                const data = await userService.getAnalyticsSummary(timeRange);
                setSummary(data);
            } catch (error) {
                console.log('Failed to fetch summary data:', error);
            } finally {
                setLoadingSummary(false);
            }

            // Fetch Mood Flow Data (Matches Frontend Logic)
            setLoadingFlow(true);
            try {
                const flow = await userService.getMoodFlow(timeRange);
                setMoodFlowData(flow);
            } catch (error) {
                console.log('Failed to fetch mood flow:', error);
            } finally {
                setLoadingFlow(false);
            }

            // Fetch Heatmap and WordCloud
            setLoadingAnalytics(true);
            try {
                const [hData, wData] = await Promise.all([
                    userService.getTriggerHeatmap(timeRange),
                    userService.getWordCloud(timeRange)
                ]);
                setHeatmapData(hData);
                setWordCloud(wData);
            } catch (error) {
                console.log('Failed to fetch heatmap/wordcloud:', error);
            } finally {
                setLoadingAnalytics(false);
            }
        };

        fetchData();
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
                        <Text style={styles.statValue}>{summary?.current?.avgMood || '0'}</Text>
                        {summary?.moodTrend !== undefined && summary.moodTrend !== 0 && (
                            <View style={styles.trendRow}>
                                <MaterialIcons 
                                    name={summary.moodTrend > 0 ? "trending-up" : "trending-down"} 
                                    size={16} 
                                    color={summary.moodTrend > 0 ? theme.colors.primary : "#ef4444"} 
                                />
                                <Text style={[styles.trendText, summary.moodTrend < 0 && { color: "#ef4444" }]}>
                                    {summary.moodTrend > 0 ? '+' : ''}{summary.moodTrend} compared to last {tab.toLowerCase()}
                                </Text>
                            </View>
                        )}
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
                                        strokeDashoffset={219.8 * (1 - (summary?.current?.consistency || 0) / 100)}
                                        strokeLinecap="round"
                                    />
                                </Svg>
                                <Text style={styles.progressText}>{summary?.current?.consistency || 0}%</Text>
                            </View>
                        </View>
 
                        <View style={styles.statCardHalf}>
                            <Text style={styles.statLabel}>TOTAL ENTRIES</Text>
                            <Text style={[styles.statValue, { color: theme.colors.tertiary }]}>{summary?.current?.journalEntries || 0}</Text>
                            <Text style={styles.statSubText}>{summary?.current?.journalEntries > 20 ? "Deepening your practice" : "Starting your journey"}</Text>
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
                        <View style={styles.chartGrid}>
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                <View key={i} style={[styles.gridLine, { bottom: (i / 5) * 200 }]} />
                            ))}
                        </View>
 
                        <Svg width={width - 96} height="200" style={styles.svgChart}>
                            <Defs>
                                <SvgGradient id="gradMood" x1="0" y1="0" x2="0" y2="1">
                                    <Stop offset="0" stopColor={theme.colors.primary} stopOpacity="0.2" />
                                    <Stop offset="1" stopColor={theme.colors.primary} stopOpacity="0" />
                                </SvgGradient>
                            </Defs>
                            {(() => {
                                let points = [];
                                const chartW = width - 96;
                                const chartH = 160;

                                const moodFlowItems = moodFlowData?.items || [];
                                
                                if (tab === 'Week') {
                                    const last7Days = [];
                                    for (let i = 6; i >= 0; i--) {
                                        const d = new Date();
                                        d.setDate(d.getDate() - i);
                                        const dateStr = d.toISOString().split('T')[0];
                                        const entry = moodFlowItems.find(item => item.date === dateStr);
                                        last7Days.push({
                                            date: dateStr,
                                            mood: entry?.mood || 0,
                                            energy: entry?.energy || 0,
                                            isToday: i === 0
                                        });
                                    }
                                    points = last7Days;
                                } else {
                                    points = moodFlowItems.map(p => ({
                                        mood: p.mood || 0,
                                        energy: p.energy || 0,
                                        isToday: false
                                    }));
                                }

                                if (points.length === 0) return null;
                                const pointGap = chartW / (points.length - 1 || 1);

                                // Energy line (Dashed) - Scale 1-10
                                let energyPath = '';
                                points.forEach((p, i) => {
                                    const x = i * pointGap;
                                    const y = p.energy > 0 ? chartH - (p.energy / 10) * chartH : chartH;
                                    energyPath += (i === 0 ? 'M' : ' L') + ` ${x} ${y}`;
                                });

                                // Mood line (Bezier Curve) - Scale 1-5
                                let moodPath = '';
                                points.forEach((p, i) => {
                                    const x = i * pointGap;
                                    const y = p.mood > 0 ? chartH - (p.mood / 5) * chartH : chartH;
                                    if (i === 0) {
                                        moodPath += `M ${x} ${y}`;
                                    } else {
                                        const prevX = (i - 1) * pointGap;
                                        const prevY = points[i-1].mood > 0 ? chartH - (points[i - 1].mood / 5) * chartH : chartH;
                                        const midX = (prevX + x) / 2;
                                        moodPath += ` C ${midX} ${prevY}, ${midX} ${y}, ${x} ${y}`;
                                    }
                                });

                                const areaPath = `${moodPath} L ${chartW} ${chartH} L 0 ${chartH} Z`;

                                return (
                                    <>
                                        <Path d={areaPath} fill="url(#gradMood)" />
                                        <Path d={energyPath} stroke={theme.colors.secondary} strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.4" />
                                        <Path d={moodPath} stroke={theme.colors.primary} strokeWidth="3" fill="none" strokeLinecap="round" />
                                        {points.map((p, i) => (
                                            p.mood > 0 && (
                                                <Circle 
                                                    key={i} 
                                                    cx={i * pointGap} 
                                                    cy={chartH - (p.mood / 5) * chartH} 
                                                    r={p.isToday ? 6 : 4} 
                                                    fill={p.isToday ? theme.colors.primary : "#fff"}
                                                    stroke={theme.colors.primary}
                                                    strokeWidth="2"
                                                />
                                            )
                                        ))}
                                    </>
                                );
                            })()}
                        </Svg>
 
                        <View style={[styles.xAxis, { width: width - 96 }]}>
                            {tab === 'Week' ? (() => {
                                const labels = [];
                                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                for (let i = 6; i >= 0; i--) {
                                    const d = new Date();
                                    d.setDate(d.getDate() - i);
                                    labels.push(days[d.getDay()]);
                                }
                                return labels.map((l, i) => <Text key={i} style={styles.xAxisLabel}>{l}</Text>);
                            })() : tab === 'Month' ? (
                                ['W1', 'W2', 'W3', 'W4'].map(w => <Text key={w} style={styles.xAxisLabel}>{w}</Text>)
                            ) : (
                                ['Q1', 'Q2', 'Q3', 'Q4'].map(q => <Text key={q} style={styles.xAxisLabel}>{q}</Text>)
                            )}
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
 
                    {[
                        { label: 'Avg Mood', key: 'avgMood' },
                        { label: 'Consistency', key: 'consistency', suffix: '%' },
                        { label: 'Entries', key: 'journalEntries' }
                    ].map((item) => {
                        const curr = summary?.current?.[item.key] || 0;
                        const prev = summary?.previous?.[item.key] || 0;
                        const diff = curr - prev;
                        const isPositive = diff > 0;

                        return (
                            <View key={item.key} style={styles.tableRow}>
                                <Text style={styles.metricName}>{item.label}</Text>
                                <Text style={styles.prevVal}>{prev}{item.suffix || ''}</Text>
                                <Text style={styles.currVal}>{curr}{item.suffix || ''}</Text>
                                <View style={styles.changeCell}>
                                    {diff !== 0 && (
                                        <MaterialIcons 
                                            name={isPositive ? "arrow-upward" : "arrow-downward"} 
                                            size={14} 
                                            color={isPositive ? theme.colors.primary : "#ef4444"} 
                                        />
                                    )}
                                    <Text style={[styles.changeText, !isPositive && diff !== 0 && { color: "#ef4444" }]}>
                                        {diff === 0 ? '—' : Math.abs(Number(diff.toFixed(1))) + (item.suffix || '')}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* TRIGGER HEATMAP */}
                <View style={styles.heatmapCard}>
                    <View style={styles.heatHeader}>
                        <View style={styles.heatTitleRow}>
                            <MaterialIcons name="auto-awesome" size={20} color={theme.colors.primary} />
                            <Text style={styles.cardTitle}>Mood Triggers</Text>
                        </View>
                        <Text style={styles.heatSubtitle}>How activities influence your emotional state</Text>
                    </View>

                    {/* Legend */}
                    <View style={styles.heatLegend}>
                        <View style={styles.legendDotItem}><View style={[styles.microDot, { backgroundColor: '#22c55e' }]} /><Text style={styles.microText}>Positive</Text></View>
                        <View style={styles.legendDotItem}><View style={[styles.microDot, { backgroundColor: '#f97316' }]} /><Text style={styles.microText}>Neutral</Text></View>
                        <View style={styles.legendDotItem}><View style={[styles.microDot, { backgroundColor: '#ef4444' }]} /><Text style={styles.microText}>Negative</Text></View>
                    </View>

                    {heatmapData?.rows?.some(r => r.positive + r.neutral + r.negative > 0) ? (
                        <View style={styles.triggerList}>
                            {heatmapData.rows
                                .filter(row => (row.positive + row.neutral + row.negative) > 0)
                                .sort((a, b) => (b.positive + b.neutral + b.negative) - (a.positive + a.neutral + a.negative))
                                .map((row, i) => {
                                    const total = row.positive + row.neutral + row.negative;
                                    const pW = (row.positive / total) * 100;
                                    const nW = (row.neutral / total) * 100;
                                    const negW = (row.negative / total) * 100;

                                    return (
                                        <View key={i} style={styles.triggerRow}>
                                            <View style={styles.triggerInfo}>
                                                <Text style={styles.triggerName}>{row.trigger}</Text>
                                                <Text style={styles.triggerTotal}>{total} {total === 1 ? 'entry' : 'entries'}</Text>
                                            </View>
                                            <View style={styles.distributionBar}>
                                                {row.positive > 0 && <View style={[styles.barSegment, { width: `${pW}%`, backgroundColor: '#22c55e' }]} />}
                                                {row.neutral > 0 && <View style={[styles.barSegment, { width: `${nW}%`, backgroundColor: '#f97316' }]} />}
                                                {row.negative > 0 && <View style={[styles.barSegment, { width: `${negW}%`, backgroundColor: '#ef4444' }]} />}
                                            </View>
                                        </View>
                                    );
                                })}
                        </View>
                    ) : (
                        <View style={styles.heatEmpty}>
                            <MaterialIcons name="insights" size={40} color={theme.colors.surfaceVariant} />
                            <Text style={styles.emptyStateSubtext}>Log activities in your check-ins to see correlations</Text>
                        </View>
                    )}

                    <View style={styles.heatInsightBox}>
                        <Text style={styles.insightText}>
                            {trendData?.overallTrend === 'insufficient_data' 
                                ? "Keep logging check-ins to unlock detailed trigger correlations."
                                : trendData?.insights?.[0] || "We're analyzing how your activities affect your mood."}
                        </Text>
                    </View>

                    <View style={styles.tagRow}>
                        {wordCloud?.words?.slice(0, 5).map((w, i) => (
                            <View key={i} style={[styles.tag, { backgroundColor: i % 2 === 0 ? theme.colors.secondaryContainer : '#ffe174' }]}>
                                <Text style={[styles.tagText, i % 2 !== 0 && { color: '#554500' }]}>{w.text}</Text>
                            </View>
                        )) || (
                            <Text style={styles.emptyStateSubtext}>Log notes to see common emotional themes</Text>
                        )}
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
    heatHeader: {
        marginBottom: 16,
    },
    heatSubtitle: {
        fontSize: 12,
        color: theme.colors.onSurfaceVariant,
        marginTop: 4,
        marginBottom: 12,
    },
    heatLegend: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.02)',
        padding: 8,
        borderRadius: 8,
    },
    legendDotItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    microDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    microText: {
        fontSize: 10,
        fontWeight: '700',
        color: theme.colors.onSurfaceVariant,
    },
    triggerList: {
        gap: 16,
        marginBottom: 20,
    },
    triggerRow: {
        gap: 8,
    },
    triggerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    triggerName: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.onSurface,
    },
    triggerTotal: {
        fontSize: 11,
        color: theme.colors.onSurfaceVariant,
        fontWeight: '600',
    },
    distributionBar: {
        height: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 6,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    barSegment: {
        height: '100%',
    },
    heatEmpty: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 12,
        marginBottom: 20,
        gap: 8,
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