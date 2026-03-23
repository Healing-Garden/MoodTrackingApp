import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';

const DashboardScreen = ({ navigation }) => {

    return (

        <View style={styles.container}>

            <StatusBar barStyle="dark-content" />

            {/* HEADER */}

            <View style={styles.header}>

                <View style={styles.profileRow}>

                    <Image
                        source={{
                            uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
                        }}
                        style={styles.avatar}
                    />

                    <View>
                        <Text style={styles.headerTag}>CHÀO BUỔI SÁNG</Text>
                        <Text style={styles.userName}>Elena Anh</Text>
                    </View>

                </View>

                <TouchableOpacity style={styles.iconCircle}>
                    <MaterialIcons name="notifications-none" size={22} color={theme.colors.onSurface} />
                </TouchableOpacity>

            </View>


            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >


                {/* HERO CARD */}

                <View style={styles.heroCard}>

                    <MaterialIcons
                        name="spa"
                        size={120}
                        color="rgba(255,255,255,0.15)"
                        style={styles.heroIcon}
                    />

                    <Text style={styles.heroGreeting}>
                        Chào buổi sáng
                    </Text>

                    <Text style={styles.heroTitle}>
                        Khu vườn của bạn {"\n"}
                        đang <Text style={styles.heroHighlight}>nở rộ</Text>
                    </Text>

                    <View style={styles.heroPill}>
                        <View style={styles.heroDot} />
                        <Text style={styles.heroPillText}>
                            12 mầm xanh đang phát triển
                        </Text>
                    </View>

                </View>


                {/* DAILY CHECKIN */}

                <TouchableOpacity
                    style={styles.dailyCard}
                    onPress={() => navigation.navigate('OnboardingStep1')}
                >

                    <View style={styles.dailyLeft}>

                        <MaterialIcons
                            name="calendar-today"
                            size={26}
                            color={theme.colors.primary}
                        />

                        <View>
                            <Text style={styles.dailyTitle}>
                                Check-in hôm nay
                            </Text>

                            <Text style={styles.dailySub}>
                                Ghi lại cảm xúc buổi sáng
                            </Text>
                        </View>

                    </View>

                    <MaterialIcons
                        name="chevron-right"
                        size={22}
                        color={theme.colors.onSurfaceVariant}
                    />

                </TouchableOpacity>


                {/* ACTION CARDS */}

                <View style={styles.activityGrid}>

                    <TouchableOpacity style={styles.activityCard}>

                        <View style={styles.iconBoxMeditation}>
                            <MaterialIcons name="self-improvement" size={24} />
                        </View>

                        <Text style={styles.activityLabel}>
                            Thiền định
                        </Text>

                    </TouchableOpacity>


                    <TouchableOpacity
                        style={styles.activityCard}
                        onPress={() => navigation.navigate('Journal')}
                    >

                        <View style={styles.iconBoxJournal}>
                            <MaterialIcons name="edit-note" size={24} />
                        </View>

                        <Text style={styles.activityLabel}>
                            Nhật ký
                        </Text>

                    </TouchableOpacity>

                </View>


                {/* MOOD TREND */}

                <View style={styles.summarySection}>

                    <View style={styles.summaryHeader}>

                        <Text style={styles.sectionTitle}>
                            Xu hướng cảm xúc
                        </Text>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Insights')}
                        >
                            <Text style={styles.viewMore}>
                                Xem chi tiết
                            </Text>
                        </TouchableOpacity>

                    </View>


                    <View style={styles.tonalChart}>

                        {[0.4, 0.6, 0.5, 0.8, 0.7, 0.9, 0.85].map((v, i) => (
                            <View key={i} style={styles.chartCol}>

                                <View style={[
                                    styles.chartBar,
                                    { height: `${v * 100}%` }
                                ]} />

                                <Text style={styles.chartDay}>
                                    {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i]}
                                </Text>

                            </View>
                        ))}

                    </View>

                </View>


                {/* INSIGHT CARD */}

                <View style={styles.insightCard}>

                    <MaterialIcons
                        name="format-quote"
                        size={36}
                        color={theme.colors.tertiary}
                    />

                    <Text style={styles.insightText}>
                        "Tâm hồn không thể nở hoa trong sự vội vã.
                        Hãy dành một chút thời gian hôm nay để thở thật sâu."
                    </Text>

                    <View style={styles.insightDivider} />

                    <Text style={styles.insightAuthor}>
                        Lời nhắc từ khu vườn
                    </Text>

                </View>

            </ScrollView>


            {/* BOTTOM NAV */}

            <View style={styles.bottomNav}>

                <TouchableOpacity style={styles.navActive}>
                    <MaterialIcons name="spa" size={24} color={theme.colors.primary} />
                    <Text style={styles.navActiveLabel}>Vườn</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Journal')}
                >
                    <MaterialIcons name="menu-book" size={26} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Insights')}
                >
                    <MaterialIcons name="bar-chart" size={26} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <MaterialIcons name="settings" size={26} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity>

            </View>


        </View>

    );
};



const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: theme.colors.surface
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        marginBottom: 10
    },

    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },

    avatar: {
        width: 48,
        height: 48,
        borderRadius: 18
    },

    headerTag: {
        fontSize: 10,
        letterSpacing: 1.5,
        color: theme.colors.primary,
        opacity: 0.6
    },

    userName: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.onSurface
    },

    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.surfaceBright,
        justifyContent: 'center',
        alignItems: 'center'
    },

    scroll: {
        paddingHorizontal: 20,
        paddingBottom: 120
    },



    heroCard: {
        backgroundColor: theme.colors.primary,
        borderRadius: 32,
        padding: 28,
        marginBottom: 28,
        overflow: 'hidden'
    },

    heroGreeting: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14
    },

    heroTitle: {
        fontSize: 30,
        lineHeight: 38,
        color: '#fff',
        fontWeight: '700',
        marginTop: 4
    },

    heroHighlight: {
        fontStyle: 'italic',
        fontWeight: '400'
    },

    heroIcon: {
        position: 'absolute',
        right: -20,
        bottom: -20
    },

    heroPill: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)'
    },

    heroDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#fff',
        marginRight: 8
    },

    heroPillText: {
        color: '#fff',
        fontSize: 12
    },



    dailyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderRadius: 24,
        backgroundColor: theme.colors.surfaceContainerLow,
        marginBottom: 24
    },

    dailyLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16
    },

    dailyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.onSurface
    },

    dailySub: {
        fontSize: 12,
        color: theme.colors.onSurfaceVariant
    },



    activityGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 40
    },

    activityCard: {
        flex: 1,
        backgroundColor: theme.colors.surfaceVariant,
        padding: 24,
        borderRadius: 24,
        gap: 12
    },

    iconBoxMeditation: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(12,103,128,0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    iconBoxJournal: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(202,169,16,0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    activityLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: theme.colors.onSurface
    },



    summarySection: {
        marginBottom: 40
    },

    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.onSurface
    },

    viewMore: {
        fontSize: 13,
        color: theme.colors.secondary
    },

    tonalChart: {
        height: 160,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.surfaceContainerLow,
        padding: 20,
        borderRadius: 28
    },

    chartCol: {
        alignItems: 'center',
        gap: 10,
        height: '100%',
        justifyContent: 'flex-end'
    },

    chartBar: {
        width: 14,
        backgroundColor: theme.colors.primary,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },

    chartDay: {
        fontSize: 10,
        opacity: 0.5,
        color: theme.colors.onSurfaceVariant
    },



    insightCard: {
        backgroundColor: theme.colors.surfaceBright,
        padding: 32,
        borderRadius: 28,
        gap: 16
    },

    insightText: {
        fontSize: 18,
        lineHeight: 28,
        fontStyle: 'italic',
        color: theme.colors.onSurface,
        opacity: 0.85
    },

    insightDivider: {
        width: 40,
        height: 1,
        backgroundColor: theme.colors.tertiary,
        opacity: 0.3
    },

    insightAuthor: {
        fontSize: 12,
        color: theme.colors.onSurfaceVariant
    },



    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 90,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 20,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32
    },

    navItem: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center'
    },

    navActive: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(39,107,46,0.15)',
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 24,
        gap: 8
    },

    navActiveLabel: {
        color: theme.colors.primary,
        fontWeight: '700'
    }

});

export default DashboardScreen;