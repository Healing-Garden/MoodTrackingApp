import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    Platform,
    StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Svg, Path, Defs, LinearGradient, Stop, Rect, Circle } from 'react-native-svg';
// import { BlurView } from 'expo-blur'; // Remove if not strictly needed or if problematic
// import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const DashboardAdminScreens = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Top App Bar */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.avatarContainer}>
                        <Image
                            style={styles.avatar}
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjGTkvGoJKPp2MpPoSPei19UaLxv9u-h956idNQt4YbvibbmFyUdauqbwBv9LLWrGjdKQT4b70uVxYKwsRlmGTkL2g1hMO4PKJa_JVhQPDMV3ORvq9RfD-LorLa_Oyp85yElHjmUTsmHP5Yg4nMbFxdvrjLBbhhIpk6SbByddzp9rdXOtN5RqoD6u7zeWz8nzbOcnA6ItQtPrhvTiBEDhKmAMW2RkA3ZwC7C0_qjZrB7b8FedgGE8UvV8ma--t3xprWhlgy87vb_M' }}
                        />
                    </View>
                    <Text style={styles.headerTitle}>Wellness Sanctuary</Text>
                </View>
                <TouchableOpacity style={styles.iconButton}>
                    <MaterialIcons name="notifications-none" size={24} color="#065f46" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.overline}>Administrative Insights</Text>
                    <Text style={styles.displayMd}>Garden Health</Text>
                </View>

                {/* Summary Cards: Bento Style */}
                <View style={styles.bentoGrid}>
                    {/* Total Users Card */}
                    <View style={[styles.card, styles.fullWidthCard]}>
                        <View style={styles.moodBloom} />
                        <Text style={styles.cardLabel}>Total Users</Text>
                        <Text style={styles.cardValueLarge}>365</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>+12% growth</Text>
                        </View>
                    </View>

                    {/* Active Now Card */}
                    <View style={[styles.card, styles.halfWidthCard, { backgroundColor: '#dbfdd7' }]}>
                        <MaterialIcons name="group" size={20} color="#0c6780" />
                        <View>
                            <Text style={styles.cardSmallLabel}>Active Now</Text>
                            <Text style={styles.cardValue}>245</Text>
                        </View>
                    </View>

                    {/* Avg Mood Card */}
                    <View style={[styles.card, styles.halfWidthCard, { backgroundColor: '#dbfdd7' }]}>
                        <MaterialIcons name="local-florist" size={20} color="#705d00" />
                        <View>
                            <Text style={styles.cardSmallLabel}>Avg Mood</Text>
                            <Text style={styles.cardValue}>4.3 <Text style={styles.cardUnit}>/ 5</Text></Text>
                        </View>
                    </View>
                </View>

                {/* Charts Section */}
                <View style={styles.chartsSection}>
                    {/* Community Mood Trend */}
                    <View style={styles.chartContainer}>
                        <View style={styles.chartHeader}>
                            <Text style={styles.chartTitle}>Community Mood Trend</Text>
                            <MaterialIcons name="trending-up" size={16} color="#276b2e" />
                        </View>
                        <View style={styles.lineChartArea}>
                            <Svg height="100" width={width - 80} viewBox="0 0 100 100">
                                <Defs>
                                    <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <Stop offset="0%" stopColor="#276b2e" stopOpacity="0.2" />
                                        <Stop offset="100%" stopColor="#276b2e" stopOpacity="0" />
                                    </LinearGradient>
                                </Defs>
                                <Path
                                    d="M0 80 Q25 70 40 40 T70 30 T100 20 L100 100 L0 100 Z"
                                    fill="url(#grad)"
                                />
                                <Path
                                    d="M0 80 Q25 70 40 40 T70 30 T100 20"
                                    fill="none"
                                    stroke="#276b2e"
                                    strokeWidth="3"
                                />
                                <Circle cx="40" cy="40" r="3" fill="#276b2e" stroke="white" strokeWidth="1" />
                                <Circle cx="70" cy="30" r="3" fill="#276b2e" stroke="white" strokeWidth="1" />
                            </Svg>
                        </View>
                        <View style={styles.chartLabels}>
                            <Text style={styles.chartLabel}>MON</Text>
                            <Text style={styles.chartLabel}>WED</Text>
                            <Text style={styles.chartLabel}>FRI</Text>
                            <Text style={styles.chartLabel}>SUN</Text>
                        </View>
                    </View>

                    {/* Activity Volume & User Status Grid */}
                    <View style={styles.smallGrid}>
                        {/* Bar Chart Activity */}
                        <View style={[styles.card, styles.threeCol]}>
                            <Text style={styles.cardTinyLabel}>ACTIVITY VOLUME</Text>
                            <View style={styles.barChart}>
                                <View style={[styles.bar, { height: '40%', backgroundColor: '#dbfdd7' }]} />
                                <View style={[styles.bar, { height: '70%', backgroundColor: '#60a560' }]} />
                                <View style={[styles.bar, { height: '95%', backgroundColor: '#276b2e' }]} />
                                <View style={[styles.bar, { height: '60%', backgroundColor: '#60a560' }]} />
                                <View style={[styles.bar, { height: '30%', backgroundColor: '#dbfdd7' }]} />
                            </View>
                        </View>

                        {/* Pie Chart User Status */}
                        <View style={[styles.card, styles.twoCol, { backgroundColor: 'rgba(154, 225, 255, 0.2)' }]}>
                            <View style={styles.pieChartContainer}>
                                <Svg height="50" width="50" viewBox="0 0 36 36">
                                    <Circle
                                        cx="18"
                                        cy="18"
                                        r="15.9"
                                        fill="none"
                                        stroke="#0c678020"
                                        strokeWidth="4"
                                    />
                                    <Circle
                                        cx="18"
                                        cy="18"
                                        r="15.9"
                                        fill="none"
                                        stroke="#0c6780"
                                        strokeWidth="4"
                                        strokeDasharray="67 100"
                                        strokeDashoffset="25"
                                        strokeLinecap="round"
                                    />
                                </Svg>
                                <View style={styles.pieLabelContainer}>
                                    <Text style={styles.piePercent}>67%</Text>
                                </View>
                            </View>
                            <Text style={styles.cardTinyLabelBlue}>ACTIVE USERS</Text>
                        </View>
                    </View>
                </View>

                {/* Recent Arrivals List */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Arrivals</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAll}>View All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.userList}>
                    {users.map((user) => (
                        <View key={user.id} style={styles.userItem}>
                            <View style={styles.userInfo}>
                                <View style={styles.userAvatarContainer}>
                                    <Image style={styles.userAvatar} source={{ uri: user.avatar }} />
                                    <View style={styles.onlineDot} />
                                </View>
                                <View>
                                    <Text style={styles.userName}>{user.name}</Text>
                                    <Text style={styles.userTime}>{user.joined}</Text>
                                </View>
                            </View>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>Active</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Bottom Navigation Mockup */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItemActive}>
                    <MaterialIcons name="dashboard" size={24} color="#06210a" />
                    <Text style={styles.navTextActive}>DASHBOARD</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Feedback")}>
                    <MaterialIcons name="Feedback" size={24} color="#a8a29e" />
                    <Text style={styles.navText}>FEEDBACK</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("ManagementFeedback")}>
                    <MaterialIcons name="group" size={24} color="#a8a29e" />
                    <Text style={styles.navText}>USER</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="spa" size={24} color="#a8a29e" />
                    <Text style={styles.navText}>HEALING</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const users = [
    {
        id: 1,
        name: 'Julian Rivers',
        joined: 'Joined 2h ago',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0kkcCOKf7qvzxtm5DRF2Cr749mX4fVCO1MRNfs5nUfD6cgEziUjRl9CvgWd1XdL2aserRlh2pyMhYyJ19d5hTaOCPgIFp4EAfFdONfokfWFsHqn6JAryxDJlMPLDA6lO8e10_lylXQakLHODCL3lcY1OvaaLTkUa8iTchR7N9aF8f7GCZV85otz79Ev0WmXSZ_LuETyQwXORchuOFScTSWjeWFWAg4xM6b25t9ABgaOqVWEoR9iAp2Lcg3G5k7O8_Ch4T6FQJ18g',
    },
    {
        id: 2,
        name: 'Elena Solas',
        joined: 'Joined 5h ago',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzIXBk77Jq6VB521uwexN1hQGBB9NUOPJb9JeEk6hbgMy9hZeyVU8GzthtB6a794uTSOwpOWcTsp9gvj8uKYvMVIoHKmQhFTxv-CJbyW_hwaY7c2JXzVGzspBY6zyL6uTpD7a585sjM7BtYX7-ao4U7Wrgu3a64eugA-dYU3xHDf6DAy68IWOfdd6gkn-1019pmXcVJU8dumpWmmaNayhOSfkwidRQJOC0DyXA0t7NFRiY9vQBWkqLDrbTvzSsmsr6l33VIoNPYR4',
    },
    {
        id: 3,
        name: 'Marcus Chen',
        joined: 'Joined 8h ago',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQuJC-zNCVWlwOYrhGSA7pz5j3yMvDaDOWkJ7m0ivR4IOWUFJiR3Bd-213FYFhm4EfzouxqMTSFXfcGBDVfov6muRWr79jzFD1i4Pl9Sp7fbyTJHOa1dz6yRQj4JTe8FD35cW3R6dYbaC6969W_Va0dNajVzqm0kenpSpo4h-WFe0jEqS8s_A2Wk-Vq2eRF7EKywCOynzzc8o8ZLf0KA-GJpQ5kTsmAmr9v7nPwGIc5CpOfpxk2AXA4S7ieY1uV-ZubvFA24MvhCM',
    },
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ebffe6',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(6, 33, 10, 0.06)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(96, 165, 96, 0.2)',
        marginRight: 12,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#064e3b',
        // fontFamily: Platform.OS === 'ios' ? 'Plus Jakarta Sans' : 'sans-serif',
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(209, 250, 229, 0.5)',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 100,
    },
    welcomeSection: {
        marginBottom: 40,
    },
    overline: {
        fontSize: 10,
        fontWeight: '700',
        color: '#276b2e',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 4,
    },
    displayMd: {
        fontSize: 32,
        fontWeight: '800',
        color: '#06210a',
        letterSpacing: -1,
    },
    bentoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 40,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#06210a',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.04,
        shadowRadius: 32,
        elevation: 4,
    },
    fullWidthCard: {
        width: '100%',
        overflow: 'hidden',
    },
    moodBloom: {
        position: 'absolute',
        top: -30,
        right: -30,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(96, 165, 96, 0.1)',
    },
    cardLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#40493e',
        marginBottom: 4,
    },
    cardValueLarge: {
        fontSize: 40,
        fontWeight: '800',
        color: '#276b2e',
        marginBottom: 16,
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: '#abf4a7',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#00370b',
    },
    halfWidthCard: {
        width: (width - 64) / 2,
        height: 140,
        justifyContent: 'space-between',
        padding: 20,
    },
    cardSmallLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#40493e',
        opacity: 0.7,
    },
    cardValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#06210a',
    },
    cardUnit: {
        fontSize: 14,
        fontWeight: '400',
        opacity: 0.5,
    },
    chartsSection: {
        gap: 24,
        marginBottom: 40,
    },
    chartContainer: {
        backgroundColor: 'rgba(202, 235, 198, 0.4)',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(192, 201, 187, 0.15)',
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    chartTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#06210a',
    },
    lineChartArea: {
        height: 100,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    chartLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    chartLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: 'rgba(64, 73, 62, 0.6)',
    },
    smallGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    threeCol: {
        flex: 3,
        padding: 20,
    },
    twoCol: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    cardTinyLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#40493e',
        marginBottom: 16,
    },
    cardTinyLabelBlue: {
        fontSize: 10,
        fontWeight: '700',
        color: '#09657f',
        marginTop: 8,
    },
    barChart: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 80,
        gap: 8,
    },
    bar: {
        flex: 1,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    pieChartContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pieLabelContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    piePercent: {
        fontSize: 10,
        fontWeight: '800',
        color: '#09657f',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#06210a',
    },
    viewAll: {
        fontSize: 12,
        fontWeight: '700',
        color: '#276b2e',
    },
    userList: {
        gap: 12,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 20,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    userAvatarContainer: {
        position: 'relative',
    },
    userAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    onlineDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        backgroundColor: '#276b2e',
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#06210a',
    },
    userTime: {
        fontSize: 12,
        color: '#40493e',
        opacity: 0.6,
    },
    statusBadge: {
        backgroundColor: 'rgba(171, 244, 167, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#075318',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 32,
        paddingHorizontal: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        shadowColor: '#06210a',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.04,
        shadowRadius: 24,
        elevation: 8,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    navItemActive: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#d1fad4',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 999,
        transform: [{ scale: 1.1 }],
    },
    navText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#a8a29e',
        marginTop: 4,
    },
    navTextActive: {
        fontSize: 11,
        fontWeight: '700',
        color: '#06210a',
        marginTop: 4,
    },
});

export default DashboardAdminScreens;
