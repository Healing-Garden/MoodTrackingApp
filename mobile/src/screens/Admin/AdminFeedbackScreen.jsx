import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Platform,
    Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { theme } from '../../theme';
import AdminBottomNavBar from '../../components/common/AdminBottomNavBar';

const { width } = Dimensions.get('window');

const FeedbackCard = ({ item }) => {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                    <View style={styles.initialsContainer}>
                        <Text style={styles.initialsText}>{item.initials}</Text>
                    </View>
                    <View>
                        <Text style={styles.userName}>{item.name}</Text>
                        <Text style={styles.userEmail}>{item.email}</Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.statusColor + '20' }]}>
                    <Text style={[styles.statusBadgeText, { color: item.statusColor }]}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={[styles.tag, { backgroundColor: item.tagBg }]}>
                    <Text style={[styles.tagText, { color: item.tagTextColor }]}>{item.tag.toUpperCase()}</Text>
                </View>
                <Text style={styles.feedbackTitle}>{item.title}</Text>
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.footerInfo}>
                    <View style={styles.ratingRow}>
                        <MaterialIcons name="star" size={16} color={theme.colors.tertiary} />
                        <Text style={styles.ratingText}>{item.rating || '-'}</Text>
                    </View>
                    <View style={styles.dateRow}>
                        <MaterialIcons name="calendar-today" size={14} color={theme.colors.onSurfaceVariant} />
                        <Text style={styles.dateText}>{item.date}</Text>
                    </View>
                </View>

                <TouchableOpacity style={[styles.actionButton, { backgroundColor: item.actionColor || theme.colors.primary }]}>
                    <MaterialIcons 
                        name={item.actionIcon || "arrow-forward"} 
                        size={20} 
                        color={item.actionIconColor || theme.colors.onPrimary} 
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const AdminFeedbackScreen = ({ navigation }) => {
    const feedbackItems = [
        {
            id: '1',
            name: 'Trần Nguyễn Minh Duy',
            email: 'de180491...gmail.com',
            initials: 'TN',
            status: 'Reviewed',
            statusColor: '#0c6780',
            tag: 'Feature',
            tagBg: '#60a560',
            tagTextColor: '#00370b',
            title: 'Feed Back UI Profile',
            rating: '4/5',
            date: '3/12/2026',
            actionIcon: 'arrow-forward',
            actionColor: theme.colors.primary
        },
        {
            id: '2',
            name: 'Lê Minh',
            email: 'leminh_dev@outlook.com',
            initials: 'LM',
            status: 'Pending',
            statusColor: '#705d00',
            tag: 'Bug',
            tagBg: '#ffdad6',
            tagTextColor: '#ba1a1a',
            title: 'Login Session Expiry Error',
            rating: '-',
            date: '3/11/2026',
            actionIcon: 'edit',
            actionColor: theme.colors.surfaceContainerHigh,
            actionIconColor: theme.colors.onSurfaceVariant
        },
        {
            id: '3',
            name: 'Anya K.',
            email: 'anya.k@wellbeing.io',
            initials: 'AK',
            status: 'Reviewed',
            statusColor: '#0c6780',
            tag: 'Content Rating',
            tagBg: '#0c6780',
            tagTextColor: '#ffffff',
            title: 'Meditation Guide Clarity',
            rating: '5/5',
            date: '3/10/2026',
            actionIcon: 'check',
            actionColor: theme.colors.primary
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <MaterialIcons name="spa" size={24} color={theme.colors.primary} />
                    <Text style={styles.headerTitle}>Healing Garden Admin</Text>
                </View>
                <Image 
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQSsu0mBwWOzY67NeHV8yOe96MQeLnwKpfGoj9NsmPLza0uR39dc_olUxE7A_805CeRxWhJ6g52p_HzKz-BVNcdCsa_Kh5Cq7f8IA3GdXXjSN2gqHJb0EI-ktjICVIKhB3ZJHL5isPp0XNIFXZ6adJ-PMUc2qED1Tkmq6A77goeXHllKPr0dEVnJ7m47gesN3opIQvjq7EN88isEpmhNBI0tfE-JKYnf674xUn3FK8nYRTh3JZsoP1ivtNkmc0wQOMNLz_DrpmsWc' }}
                    style={styles.profileImage}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text style={styles.mainTitle}>Feedback Overview</Text>
                    <Text style={styles.mainSubtitle}>Listening to the garden's whispers. Review and manage user thoughts.</Text>
                </View>

                {/* Filters */}
                <View style={styles.filterGrid}>
                    <View style={styles.filterBox}>
                        <Text style={styles.filterLabel}>TYPE</Text>
                        <TouchableOpacity style={styles.dropdownTrigger}>
                            <Text style={styles.dropdownText}>All Types</Text>
                            <MaterialIcons name="expand-more" size={20} color={theme.colors.onSurface} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.filterBox}>
                        <Text style={styles.filterLabel}>STATUS</Text>
                        <TouchableOpacity style={styles.dropdownTrigger}>
                            <Text style={styles.dropdownText}>All Status</Text>
                            <MaterialIcons name="expand-more" size={20} color={theme.colors.onSurface} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Feedback List */}
                <View style={styles.list}>
                    {feedbackItems.map(item => (
                        <FeedbackCard key={item.id} item={item} />
                    ))}
                </View>

                {/* Pagination */}
                <View style={styles.pagination}>
                    <TouchableOpacity style={styles.pageArrow}>
                        <MaterialIcons name="chevron-left" size={24} color={theme.colors.onSurface} />
                    </TouchableOpacity>
                    <View style={styles.pageNumbers}>
                        <TouchableOpacity style={[styles.pageCircle, styles.activePage]}>
                            <Text style={styles.activePageText}>1</Text>
                        </TouchableOpacity>
                        <Text style={styles.pageText}>2</Text>
                        <Text style={styles.pageText}>3</Text>
                        <Text style={styles.ellipsis}>...</Text>
                        <Text style={styles.pageText}>8</Text>
                    </View>
                    <TouchableOpacity style={styles.pageArrow}>
                        <MaterialIcons name="chevron-right" size={24} color={theme.colors.onSurface} />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <AdminBottomNavBar navigation={navigation} activeTab="Feedback" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'rgba(235, 255, 230, 0.8)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#065f46',
        fontFamily: theme.fonts.headline,
    },
    profileImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: theme.colors.primaryContainer,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 120,
    },
    titleSection: {
        marginBottom: 25,
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.headline,
        letterSpacing: -1,
    },
    mainSubtitle: {
        fontSize: 13,
        color: theme.colors.onSurfaceVariant,
        fontFamily: theme.fonts.body,
        marginTop: 4,
    },
    filterGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 25,
    },
    filterBox: {
        flex: 1,
        backgroundColor: theme.colors.surfaceContainerLow,
        padding: 12,
        borderRadius: 16,
    },
    filterLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: theme.colors.outline,
        marginBottom: 4,
        letterSpacing: 1,
    },
    dropdownTrigger: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.onSurface,
    },
    list: {
        gap: 16,
    },
    card: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 24,
        padding: 20,
        ...theme.shadows.soft,
        shadowOpacity: 0.04,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    initialsContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: theme.colors.surfaceContainer,
        alignItems: 'center',
        justifyContent: 'center',
    },
    initialsText: {
        fontWeight: '800',
        color: theme.colors.primary,
        fontSize: 16,
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.headline,
    },
    userEmail: {
        fontSize: 11,
        color: theme.colors.onSurfaceVariant,
        opacity: 0.7,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 99,
    },
    statusBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    cardBody: {
        marginBottom: 15,
    },
    tag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 6,
    },
    tagText: {
        fontSize: 9,
        fontWeight: '800',
    },
    feedbackTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#065f46',
        fontFamily: theme.fonts.headline,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    footerInfo: {
        flexDirection: 'row',
        gap: 12,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 13,
        fontWeight: '700',
        color: theme.colors.tertiary,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dateText: {
        fontSize: 11,
        color: theme.colors.onSurfaceVariant,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.primary,
        elevation: 4,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        gap: 15,
    },
    pageNumbers: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    pageCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activePage: {
        backgroundColor: theme.colors.primary,
        ...theme.shadows.primary,
    },
    activePageText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 12,
    },
    pageText: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.onSurface,
    },
    ellipsis: {
        color: theme.colors.outline,
    },
    pageArrow: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.colors.surfaceContainerHigh,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default AdminFeedbackScreen;
