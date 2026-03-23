import React, { useState, useEffect } from 'react';
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
    ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AdminBottomNavBar from '../../components/common/AdminBottomNavBar';
import api from '../../services/api';

const { width } = Dimensions.get('window');

const DashboardAdminScreens = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/users');
            setUsers(res.data || []);
        } catch (error) {
            console.error("Failed to load users", error);
        } finally {
            setLoading(false);
        }
    };

    const activeUsersCount = users.filter(u => u.accountStatus === 'active' && !u.isBanned).length;

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
                <TouchableOpacity style={styles.iconButton} onPress={fetchUsers}>
                    <MaterialIcons name="refresh" size={24} color="#065f46" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.overline}>Administrative Insights</Text>
                    <Text style={styles.displayMd}>Dashboard</Text>
                </View>

                {/* Summary Cards: Bento Style */}
                <View style={styles.bentoGrid}>
                    <View style={[styles.card, styles.halfWidthCard]}>
                        <View style={styles.moodBloom} />
                        <Text style={styles.cardLabel}>Total Users</Text>
                        <Text style={styles.cardValueLarge}>{users.length}</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>All registered</Text>
                        </View>
                    </View>

                    <View style={[styles.card, styles.halfWidthCard, { backgroundColor: '#dbfdd7' }]}>
                        <MaterialIcons name="group" size={24} color="#0c6780" />
                        <View>
                            <Text style={styles.cardSmallLabel}>Active</Text>
                            <Text style={[styles.cardValueLarge, {fontSize: 32, color: '#0c6780', fontWeight: '800'}]}>{activeUsersCount}</Text>
                        </View>
                    </View>
                </View>

                {/* Users List Area */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Users</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#276b2e" style={{ marginTop: 20 }} />
                ) : (
                    <View style={styles.userList}>
                        {users.slice(0, 10).map((user) => (
                            <View key={user._id} style={styles.userItem}>
                                <View style={styles.userInfo}>
                                    <View style={styles.userAvatarContainer}>
                                        <Image style={styles.userAvatar} source={{ uri: user.avatarUrl || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" }} />
                                        {user.isBanned ? (
                                            <View style={[styles.onlineDot, { backgroundColor: '#ba1a1a', borderColor: '#ffebee' }]} />
                                        ) : (
                                            <View style={styles.onlineDot} />
                                        )}
                                    </View>
                                    <View style={{ flex: 1, paddingRight: 10 }}>
                                        <Text style={styles.userName} numberOfLines={1}>{user.fullName || 'Anonymous'}</Text>
                                        <Text style={styles.userTime} numberOfLines={1}>{user.email}</Text>
                                    </View>
                                </View>
                                <View style={{ alignItems: 'flex-end', gap: 6 }}>
                                    <View style={[styles.statusBadge, user.isBanned && { backgroundColor: '#ffebee' }]}>
                                        <Text style={[styles.statusText, user.isBanned && { color: '#ba1a1a' }]}>
                                            {user.isBanned ? "Banned" : "Active"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
                
                <TouchableOpacity 
                    style={styles.viewAllBtn} 
                    onPress={() => navigation.navigate("AdminUsers")}
                >
                    <Text style={styles.viewAllText}>View All Users</Text>
                    <MaterialIcons name="arrow-forward" size={16} color="#065f46" />
                </TouchableOpacity>
            </ScrollView>

            <AdminBottomNavBar navigation={navigation} activeTab="Dashboard" />
        </SafeAreaView>
    );
};

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
        paddingBottom: 120,
    },
    welcomeSection: {
        marginBottom: 30,
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
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 30,
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
    halfWidthCard: {
        width: (width - 64) / 2,
        height: 140,
        justifyContent: 'space-between',
        padding: 20,
        overflow: 'hidden'
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
        marginBottom: 8,
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
    cardSmallLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#40493e',
        opacity: 0.7,
        marginBottom: 6
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
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
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
        width: 14,
        height: 14,
        backgroundColor: '#276b2e',
        borderRadius: 7,
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
        opacity: 0.8,
    },
    statusBadge: {
        backgroundColor: 'rgba(171, 244, 167, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        alignSelf: 'center',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#075318',
    },
    viewAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: 'rgba(209, 250, 229, 0.5)',
        borderRadius: 16,
        marginTop: 16,
        gap: 8,
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#065f46',
    }
});

export default DashboardAdminScreens;
