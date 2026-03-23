import React, { useState, useEffect, useCallback } from 'react';
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
import { theme } from '../../theme';
import BottomNavBar from '../../components/common/BottomNavBar';
import userService from '../../services/userService';
import logo from '../../../assets/images/logo.png';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [moodFlow, setMoodFlow] = useState([]);
    const [dailyQuote, setDailyQuote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else if (hour < 21) setGreeting('Good Evening');
        else setGreeting('Good Night');
    }, []);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [profile, stats, flow, quotes] = await Promise.all([
                userService.getProfile(),
                userService.getDashboardData(),
                userService.getMoodFlow ? userService.getMoodFlow('week') : userService.getDashboardData(), // Fallback if not specifically implemented
                userService.getHealingContent('quote')
            ]);

            setUserProfile(profile);
            setDashboardData(stats);
            
            // Handle mood flow data
            if (flow && flow.items) {
                setMoodFlow(flow.items);
            } else if (stats && stats.moodDistribution) {
                // Fallback or handle differently
            }

            // Handle daily quote
            if (quotes && quotes.length > 0) {
                const today = new Date();
                const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
                const index = seed % quotes.length;
                setDailyQuote(quotes[index]);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const renderMoodTrend = () => {
        const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        const today = new Date().getDay(); // 0 is Sunday, 1 is Monday...
        const adjustedDays = [...days.slice(today), ...days.slice(0, today)]; // Last 7 days including today
        
        // Mock data if no real data yet, or process real data
        const displayData = moodFlow.length > 0 
            ? moodFlow.slice(-7).map(item => ({
                val: item.mood / 5, // Normalize to 0-1
                label: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
            }))
            : [0.5, 0.65, 0.45, 0.75, 1, 0.6, 0.9].map((v, i) => ({
                val: v,
                label: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'TODAY'][i]
            }));

        return (
            <View style={styles.chartContainer}>
                {displayData.map((data, i) => (
                    <View key={i} style={styles.chartCol}>
                        <View style={[styles.bar, { height: data.val * 80 }]}>
                            <MaterialIcons 
                                name={data.val >= 0.8 ? "sentiment-very-satisfied" : data.val >= 0.6 ? "sentiment-satisfied" : "sentiment-neutral"} 
                                size={16} 
                                color={i === displayData.length - 1 ? theme.colors.primary : "rgba(39, 107, 46, 0.4)"} 
                                style={styles.barIcon}
                            />
                        </View>
                        <Text style={[styles.dayLabel, i === displayData.length - 1 && styles.activeDay]}>
                            {data.label === new Date().toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase() ? 'TODAY' : data.label}
                        </Text>
                    </View>
                ))}
            </View>
        );
    };

    if (loading && !dashboardData) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ marginTop: 16, color: theme.colors.onSurfaceVariant }}>Tending to your garden...</Text>
            </View>
        );
    }

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
                        <Text style={styles.heroGreeting}>{greeting}, {userProfile?.fullName || 'Elena'}</Text>
                        <Text style={styles.heroTitle}>Your garden is blooming beautifully</Text>
                        
                        <View style={styles.plantBadge}>
                            <MaterialIcons name="spa" size={14} color="#fff" />
                            <Text style={styles.plantBadgeText}>
                                Day {dashboardData?.journeyDays || 1} of your journey
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

                {/* Daily Check-in (Full Width) */}
                <TouchableOpacity 
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
                </TouchableOpacity>

                {/* Grid Row */}
                <View style={styles.gridRow}>
                    <TouchableOpacity style={[styles.gridCard, { backgroundColor: 'rgba(154, 225, 255, 0.3)' }]}>
                        <View style={[styles.gridIconBox, { backgroundColor: theme.colors.secondaryContainer }]}>
                            <MaterialIcons name="self-improvement" size={24} color={theme.colors.onSecondaryContainer} />
                        </View>
                        <Text style={styles.gridLabel}>Start Meditation</Text>
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
                                {dashboardData?.weeklyStats?.avgMood >= 4 ? 'Blooming' : 'Growing'}
                            </Text>
                        </View>
                    </View>

                    {renderMoodTrend()}
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
            </ScrollView>

            {/* BOTTOM NAVIGATION */}
            <BottomNavBar navigation={navigation} activeTab="Garden" />
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
        marginBottom: 16,
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