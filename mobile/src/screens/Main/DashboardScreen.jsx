import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Svg, Path, Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { theme } from '../../theme';
import BottomNavBar from '../../components/common/BottomNavBar';
import logo from '../../../assets/images/logo.png';
import userService from '../../services/userService';
import api from '../../services/api';
import { aiApi } from '../../services/aiApi';
import ActionSuggestionModal from '../../components/modals/ActionSuggestionModal';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [dailySummary, setDailySummary] = useState(null);
    const [loadingSummary, setLoadingSummary] = useState(true);

    const getLocalDateString = () => {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const [dashboardData, setDashboardData] = useState(null);
    const [moodFlow, setMoodFlow] = useState([]);
    const [dailyQuote, setDailyQuote] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [actionModalVisible, setActionModalVisible] = useState(false);
    const [lastMood, setLastMood] = useState('neutral');

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [profile, stats, flow, quotes] = await Promise.all([
                    userService.getProfile(),
                    userService.getDashboardData(),
                    userService.getMoodFlow('week'),
                    userService.getHealingContent('quote')
                ]);

                setUser(profile || null);
                setDashboardData(stats);
                setMoodFlow(flow.items || []);

                if (quotes && quotes.length > 0) {
                    const today = new Date();
                    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
                    const index = seed % quotes.length;
                    setDailyQuote(quotes[index]);
                }
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
            } finally {
                setLoadingData(false);
            }
        };
        loadDashboardData();
    }, []);

    useEffect(() => {
        const checkActionEligibility = async () => {
            if (!user?._id) return;
            try {
                const res = await aiApi.checkActionEligibility(user._id);
                // The API might return { eligible: true } or { data: { eligible: true } }
                const isEligible = res.data?.data?.eligible || res.data?.eligible || res.eligible;
                
                if (isEligible) {
                    // Try to find last mood from flow or use neutral
                    const latest = moodFlow.length > 0 ? moodFlow[moodFlow.length - 1].mood : 3;
                    const moodLabel = latest <= 2 ? 'sad' : (latest >= 4 ? 'happy' : 'neutral');
                    setLastMood(moodLabel);
                    setActionModalVisible(true);
                }
            } catch (error) {
                console.log('Action eligibility check failed:', error);
            }
        };
        
        if (!loadingData && user?._id) {
            checkActionEligibility();
        }
    }, [loadingData, user?._id]);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!user?._id) return;
            setLoadingSummary(true);
            try {
                const date = getLocalDateString();
                // Try GET first
                try {
                    const res = await api.get(`/ai/summary/daily/${user._id}?date=${encodeURIComponent(date)}`);
                    if (res?.data?.success && res.data.data?.summary) {
                        setDailySummary(res.data.data.summary);
                        setLoadingSummary(false);
                        return;
                    }
                } catch (e) {
                    // Not found or error, proceed to POST
                }

                // If GET failed or no summary, call POST to generate/get
                const result = await aiApi.getDailySummary(user._id, date, false);
                if (result?.data?.success && result.data.data?.summary) {
                    setDailySummary(result.data.data.summary);
                }
            } catch (error) {
                console.log('Fetch summary failed', error);
            } finally {
                setLoadingSummary(false);
            }
        };
        fetchSummary();
    }, [user?._id]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const greeting = getGreeting();

    const renderMoodTrend = () => {
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const today = new Date();
        
        // Map last 7 days from moodFlow
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayEntry = moodFlow.find(item => item.date === dateStr);
            last7Days.push({
                day: days[d.getDay()],
                mood: dayEntry ? dayEntry.mood : 0,
                isToday: i === 0,
                fullDate: dateStr
            });
        }

        const chartHeight = 100;
        const chartWidth = width - 80;
        const pointGap = chartWidth / 6;

        // Generate Path D
        let pathD = '';
        last7Days.forEach((point, i) => {
            const x = i * pointGap;
            const y = chartHeight - (point.mood / 5) * chartHeight;
            if (i === 0) {
                pathD += `M ${x} ${y}`;
            } else {
                // Simplified cubic bezier for a smoother line
                const prevX = (i - 1) * pointGap;
                const prevY = chartHeight - (last7Days[i - 1].mood / 5) * chartHeight;
                const midX = (prevX + x) / 2;
                pathD += ` C ${midX} ${prevY}, ${midX} ${y}, ${x} ${y}`;
            }
        });

        // Area Path
        const areaD = `${pathD} L ${6 * pointGap} ${chartHeight} L 0 ${chartHeight} Z`;

        return (
            <View style={styles.chartWrapper}>
                <View style={styles.chartBackground}>
                    {[0, 1, 2, 3, 4, 5].map(tick => (
                        <View key={tick} style={[styles.tickLine, { bottom: (tick / 5) * chartHeight }]} />
                    ))}
                </View>
                
                <Svg height={chartHeight + 20} width={chartWidth + 20} style={styles.svgContainer}>
                    <Defs>
                        <SvgGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={theme.colors.primary} stopOpacity="0.2" />
                            <Stop offset="1" stopColor={theme.colors.primary} stopOpacity="0" />
                        </SvgGradient>
                    </Defs>
                    
                    {/* Area under line */}
                    <Path d={areaD} fill="url(#grad)" />
                    
                    {/* The Line */}
                    <Path
                        d={pathD}
                        fill="none"
                        stroke={theme.colors.primary}
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    
                    {/* Points */}
                    {last7Days.map((point, i) => {
                        const x = i * pointGap;
                        const y = chartHeight - (point.mood / 5) * chartHeight;
                        return (
                            <Circle
                                key={i}
                                cx={x}
                                cy={y}
                                r={point.isToday ? 6 : 4}
                                fill={point.isToday ? theme.colors.primary : "#fff"}
                                stroke={theme.colors.primary}
                                strokeWidth="2"
                            />
                        );
                    })}
                </Svg>

                <View style={[styles.chartLabels, { width: chartWidth }]}>
                    {last7Days.map((point, i) => (
                        <Text key={i} style={[styles.dayLabel, point.isToday && styles.activeDay]}>
                            {point.day}
                        </Text>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* TOP BAR */}
            <BlurView intensity={80} style={styles.topBar}>
                <View style={styles.topBarLeft}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={logo}
                            style={styles.avatar}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.appTitle}>Healing Garden</Text>
                </View>
                <TouchableOpacity style={styles.notificationBtn} onPress={() => navigation.navigate('Settings')}>
                    <MaterialIcons name="settings" size={24} color={theme.colors.onSurface} />
                </TouchableOpacity>
            </BlurView>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* HERO SECTION */}
                <LinearGradient
                    colors={[theme.colors.primary, theme.colors.primaryContainer]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroCard}
                >
                    <View style={styles.heroContent}>
                        <Text style={styles.heroGreeting}>{greeting}, {user?.fullName}</Text>
                        <Text style={styles.heroTitle}>Your garden is blooming beautifully</Text>
                        
                        <View style={styles.plantBadge}>
                            <MaterialIcons name="spa" size={14} color="#fff" />
                            <Text style={styles.plantBadgeText}>
                                Day {dashboardData?.journeyDays} of your journey
                            </Text>
                        </View>
                    </View>
                    
                    {/* Background Decorative Element */}
                    <View style={styles.flowerBg}>
                        <MaterialCommunityIcons name="flower-tulip" size={140} color="rgba(255,255,255,0.15)" />
                    </View>
                </LinearGradient>

                {/* DAILY SANCTUARY GRID */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionLabel}>DAILY SANCTUARY</Text>
                </View>

                {/* QUOTE SECTION */}
                <View style={styles.quoteCard}>
                    <MaterialIcons name="format-quote" size={40} color={theme.colors.tertiary} style={styles.quoteIcon} />
                    <View style={styles.quoteContent}>
                        <Text style={styles.quoteText}>
                            {dailyQuote?.content || dailyQuote?.description || dailyQuote?.title || "The soul cannot thrive in a garden of stones. Take a moment today to breathe in the green."}
                        </Text>
                        {dailyQuote?.author && <Text style={[styles.quoteLabel, { marginTop: 8, fontStyle: 'italic' }]}>— {dailyQuote.author}</Text>}
                        <View style={styles.quoteDivider} />
                        <Text style={styles.quoteLabel}>INSIGHT FOR YOUR GROWTH</Text>
                    </View>
                </View>

                {/* Daily Check-in (Full Width) */}
                {/* <TouchableOpacity 
                    style={styles.checkInCard}
                    onPress={() => navigation.navigate('OnboardingStep4', { isDailyCheckIn: true })}
                >
                    <View style={styles.checkInLeft}>
                        <View style={styles.checkInIconBox}>
                            <MaterialIcons name="calendar-today" size={24} color={theme.colors.primary} />
                        </View>
                        <View>
                            <Text style={styles.cardTitle}>Daily Check-in</Text>
                            <Text style={styles.cardSub}>Log your morning mood</Text>
                        </View>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity> */}

                {/* Grid Row */}
                <View style={styles.gridRow}>
                    <TouchableOpacity 
                        style={[styles.gridCard, { backgroundColor: 'rgba(154, 225, 255, 0.3)' }]}
                        onPress={() => navigation.navigate('Chatbot')}
                    >
                        <View style={[styles.gridIconBox, { backgroundColor: theme.colors.secondaryContainer }]}>
                            <MaterialIcons name="psychology" size={24} color={theme.colors.onSecondaryContainer} />
                        </View>
                        <Text style={styles.gridLabel}>AI Soul Partner</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.gridCard, { backgroundColor: 'rgba(202, 169, 16, 0.2)' }]}
                        onPress={() => navigation.navigate('Journal')}
                    >
                        <View style={[styles.gridIconBox, { backgroundColor: theme.colors.tertiaryContainer }]}>
                            <MaterialIcons name="edit-note" size={24} color={theme.colors.onTertiaryContainer} />
                        </View>
                        <Text style={styles.gridLabel}>Write in Journal</Text>
                    </TouchableOpacity>
                </View>

                {/* MOOD TREND */}
                <View style={styles.moodSection}>
                    <View style={styles.moodHeader}>
                        <View>
                            <Text style={styles.moodTitle}>Mood Trend</Text>
                            <Text style={styles.moodSub}>Past 7 days</Text>
                        </View>
                        <View style={styles.trendBadge}>
                            <MaterialIcons name="trending-up" size={14} color={theme.colors.primary} />
                            <Text style={styles.trendBadgeText}>
                                {dashboardData?.weeklyStats?.avgMood >= 4 ? 'Blooming' : 'Growing'} ({dashboardData?.weeklyStats?.avgMood || 0})
                            </Text>
                        </View>
                    </View>
                    {renderMoodTrend()}
                </View>

                {/* DAILY AI SUMMARY */}
                <View style={[styles.sectionHeader, { marginTop: 8 }]}>
                    <Text style={styles.sectionLabel}>DAILY AI SUMMARY</Text>
                </View>
                <View style={[styles.quoteCard, { backgroundColor: 'rgba(96, 165, 96, 0.05)', borderColor: 'rgba(96, 165, 96, 0.2)' }]}>
                    <MaterialCommunityIcons name="robot-outline" size={32} color={theme.colors.primary} style={styles.quoteIcon} />
                    <View style={[styles.quoteContent, { marginLeft: 36 }]}>
                        {loadingSummary ? (
                            <Text style={[styles.quoteText, { fontStyle: 'normal', fontSize: 14 }]}>
                                Analyzing your day...
                            </Text>
                        ) : dailySummary ? (
                            <View>
                                {dailySummary.split('\n').filter(line => line.trim() !== '').map((line, idx) => (
                                    <Text key={idx} style={[styles.quoteText, { fontStyle: 'normal', fontSize: 14, marginBottom: 8 }]}>
                                        • {line.replace(/^[-•]\s*/, '')}
                                    </Text>
                                ))}
                            </View>
                        ) : (
                            <Text style={[styles.quoteText, { fontStyle: 'normal', fontSize: 14 }]}>
                                No summary available for today yet. Check in to generate!
                            </Text>
                        )}
                        <View style={[styles.quoteDivider, { backgroundColor: theme.colors.primary }]} />
                        <Text style={[styles.quoteLabel, { color: theme.colors.primary }]}>YOUR DAY IN KEY POINTS</Text>
                    </View>
                </View>
            </ScrollView>

            {/* BOTTOM NAVIGATION */}
            <BottomNavBar navigation={navigation} activeTab="Garden" />

            {/* ACTION SUGGESTION MODAL */}
            <ActionSuggestionModal
                isVisible={actionModalVisible}
                onClose={() => setActionModalVisible(false)}
                userId={user?._id}
                mood={lastMood}
            />
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
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: theme.colors.surfaceContainerHigh,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    appTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#064e3b',
        fontFamily: theme.fonts.headline,
    },
    notificationBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingTop: 120,
        paddingHorizontal: 24,
        paddingBottom: 140,
    },
    heroCard: {
        borderRadius: theme.borderRadius.lg,
        padding: 32,
        marginBottom: 32,
        overflow: 'hidden',
        position: 'relative',
        ...theme.shadows.primary,
    },
    heroContent: {
        zIndex: 10,
    },
    heroGreeting: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 16,
        fontFamily: theme.fonts.headline,
        marginBottom: 4,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 38,
        fontFamily: theme.fonts.headline,
        marginBottom: 20,
    },
    plantBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    plantBadgeText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 8,
    },
    flowerBg: {
        position: 'absolute',
        right: -30,
        bottom: -30,
        opacity: 0.2,
    },
    sectionHeader: {
        marginTop: 16,
        marginBottom: 8,
        paddingLeft: 4,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 2,
        color: theme.colors.onSurfaceVariant,
        opacity: 0.7,
    },
    checkInCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 24,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.surfaceContainerLow,
        marginBottom: 16,
    },
    checkInLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    checkInIconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.primaryContainer,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.headline,
    },
    cardSub: {
        fontSize: 13,
        color: theme.colors.onSurfaceVariant,
    },
    gridRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    gridCard: {
        flex: 1,
        padding: 20,
        borderRadius: theme.borderRadius.lg,
        alignItems: 'flex-start',
        gap: 16,
    },
    gridIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridLabel: {
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 20,
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.headline,
    },
    moodSection: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: theme.borderRadius.lg,
        padding: 24,
        marginBottom: 24,
        ...theme.shadows.soft,
    },
    moodHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 32,
    },
    moodTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.headline,
    },
    moodSub: {
        fontSize: 13,
        color: theme.colors.onSurfaceVariant,
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceContainerLow,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        gap: 4,
    },
    trendBadgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: theme.colors.primary,
    },
    chartWrapper: {
        height: 160,
        marginTop: 20,
        position: 'relative',
    },
    chartBackground: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 40,
        justifyContent: 'space-between',
    },
    tickLine: {
        height: 1,
        backgroundColor: 'rgba(64, 73, 62, 0.05)',
        width: '100%',
        position: 'absolute',
    },
    svgContainer: {
        marginTop: 10,
    },
    chartLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    chartContainer: {
        height: 120,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 4,
    },
    chartCol: {
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    bar: {
        width: '100%',
        maxWidth: 32,
        backgroundColor: 'rgba(39, 107, 46, 0.1)',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 40,
    },
    barIcon: {
        marginBottom: 8,
    },
    dayLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: 'rgba(64, 73, 62, 0.4)',
    },
    activeDay: {
        color: theme.colors.primary,
    },
    quoteCard: {
        backgroundColor: theme.colors.surfaceBright,
        borderRadius: theme.borderRadius.lg,
        padding: 32,
        borderWidth: 1,
        borderColor: 'rgba(39, 107, 46, 0.05)',
        position: 'relative',
        marginBottom: 24,
    },
    quoteIcon: {
        position: 'absolute',
        top: 24,
        left: 24,
        opacity: 0.8,
    },
    quoteContent: {
        marginLeft: 40,
        gap: 16,
    },
    quoteText: {
        fontSize: 18,
        fontWeight: '500',
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.headline,
        fontStyle: 'italic',
        lineHeight: 28,
    },
    quoteDivider: {
        width: 48,
        height: 2,
        backgroundColor: '#e7c433', // tertiary-fixed-dim
    },
    quoteLabel: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
        color: '#554500', // on-tertiary-fixed-variant
    }
});

export default DashboardScreen;