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
import { theme } from '../../theme';
import BottomNavBar from '../../components/common/BottomNavBar';
import userService from '../../services/userService';
import logo from '../../../assets/images/logo.png';
import api from '../../services/api';
import { aiApi } from '../../services/aiApi';

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

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get('/profile');
                setUser(res.data?.user || null);
            } catch (err) { }
        };
        loadProfile();
    }, []);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!user?._id) return;
            setLoadingSummary(true);
            try {
                const date = getLocalDateString();
                const result = await api.get(`/ai/summary/daily/${user._id}?date=${encodeURIComponent(date)}`);
                if (result?.data?.success && result.data.data?.summary) {
                    setDailySummary(result.data.data.summary);
                } else {
                    const generateRes = await aiApi.getDailySummary(user._id, date, false);
                    if (generateRes?.data?.success && generateRes.data?.data?.summary) {
                        setDailySummary(generateRes.data.data.summary);
                    }
                }
            } catch (error) {
                if (error.response?.status === 404) {
                    try {
                        const date = getLocalDateString();
                        const generateRes = await aiApi.getDailySummary(user._id, date, false);
                        if (generateRes?.data?.success && generateRes.data?.data?.summary) {
                            setDailySummary(generateRes.data.data.summary);
                        }
                    } catch (genErr) {
                        console.log('Generate summary failed', genErr);
                    }
                }
            } finally {
                setLoadingSummary(false);
            }
        };
        fetchSummary();
    }, [user?._id]);

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

                {/* DAILY AI SUMMARY */}
                <View style={[styles.sectionHeader, { marginTop: 32 }]}>
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