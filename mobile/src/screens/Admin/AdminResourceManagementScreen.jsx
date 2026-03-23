import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Platform,
    Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';
import AdminBottomNavBar from '../../components/common/AdminBottomNavBar';

const { width } = Dimensions.get('window');

const ResourceCard = ({ item }) => {
    return (
        <View style={[styles.resourceCard, { borderLeftColor: item.borderColor || theme.colors.primary }]}>
            <View style={styles.resourceHeader}>
                <View style={styles.resourceMain}>
                    <Text style={styles.resourceTitle}>{item.title}</Text>
                    <Text style={styles.resourceSnippet} numberOfLines={2}>"{item.snippet}"</Text>
                </View>
                <View style={styles.authorRow}>
                    <View style={styles.authorAvatar}>
                        <Text style={styles.authorInitials}>{item.authorInitials}</Text>
                    </View>
                    <Text style={styles.authorName}>{item.author}</Text>
                </View>
            </View>

            <View style={styles.resourceBadges}>
                <View style={[styles.moodBadge, { backgroundColor: item.moodBg }]}>
                    <View style={[styles.moodDot, { backgroundColor: item.moodDotColor }]} />
                    <Text style={[styles.moodText, { color: item.moodTextColor }]}>{item.moodLevel}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.statusBg }]}>
                    <Text style={[styles.statusText, { color: item.statusTextColor }]}>{item.status.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.resourceActions}>
                <TouchableOpacity style={styles.iconBtn}>
                    <MaterialIcons name="visibility" size={20} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}>
                    <MaterialIcons name="edit" size={20} color={theme.colors.secondary} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconBtn, styles.deleteBtn]}>
                    <MaterialIcons name="delete" size={20} color={theme.colors.error} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const AdminResourceManagementScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Quotes');
    
    const resources = [
        {
            id: '1',
            title: 'Breathe Slowly',
            snippet: 'Feel the air entering your lungs like a gentle stream of light. You are present, you are safe.',
            author: 'Thich Nhat Hanh',
            authorInitials: 'TN',
            moodLevel: 'Very Low',
            moodBg: '#fee2e2',
            moodDotColor: '#f87171',
            moodTextColor: '#b91c1c',
            status: 'Active',
            statusBg: '#d1fae5',
            statusTextColor: '#065f46',
            borderColor: theme.colors.primary
        },
        {
            id: '2',
            title: 'You Are Stronger Than You Think',
            snippet: 'Resilience is not the absence of pain, but the presence of persistent hope.',
            author: 'Marcus Aurelius',
            authorInitials: 'MA',
            moodLevel: 'Low',
            moodBg: '#ffedd5',
            moodDotColor: '#fb923c',
            moodTextColor: '#9a3412',
            status: 'Active',
            statusBg: '#d1fae5',
            statusTextColor: '#065f46',
            borderColor: theme.colors.secondary
        },
        {
            id: '3',
            title: 'The Morning Dew',
            snippet: 'Every morning we are born again. What we do today is what matters most.',
            author: 'Buddha',
            authorInitials: 'BU',
            moodLevel: 'Moderate',
            moodBg: '#d1fae5',
            moodDotColor: '#10b981',
            moodTextColor: '#047857',
            status: 'Draft',
            statusBg: theme.colors.surfaceVariant,
            statusTextColor: theme.colors.outline,
            borderColor: theme.colors.tertiaryContainer
        }
    ];

    const tabs = ['Quotes', 'Videos', 'Podcasts'];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>LIBRARY</Text>
                    </View>
                    <Text style={styles.mainTitle}>Resource Management</Text>
                    <Text style={styles.mainSubtitle}>Curate and refine the healing experiences that nourish our community's soul.</Text>
                </View>

                <TouchableOpacity style={styles.addButton}>
                    <LinearGradient
                        colors={[theme.colors.primary, theme.colors.primaryContainer]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradient}
                    >
                        <MaterialIcons name="add" size={24} color="#fff" />
                        <Text style={styles.addButtonText}>Add Content</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Tabs */}
                <View style={styles.tabContainer}>
                    {tabs.map(tab => (
                        <TouchableOpacity 
                            key={tab} 
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Search & Filter */}
                <View style={styles.searchRow}>
                    <View style={styles.searchBox}>
                        <MaterialIcons name="search" size={20} color={theme.colors.outline} />
                        <TextInput 
                            placeholder="Search resources..." 
                            placeholderTextColor={theme.colors.outline}
                            style={styles.searchInput}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterBtn}>
                        <MaterialIcons name="filter-list" size={24} color={theme.colors.onSurfaceVariant} />
                    </TouchableOpacity>
                </View>

                {/* Resource List */}
                <View style={styles.list}>
                    {resources.map(item => (
                        <ResourceCard key={item.id} item={item} />
                    ))}
                </View>

                {/* Pagination (Simplified for mobile) */}
                <View style={styles.pagination}>
                    <Text style={styles.paginationText}>Showing <Text style={styles.bold}>1-10</Text> of <Text style={styles.bold}>48</Text></Text>
                    <View style={styles.pageIcons}>
                        <TouchableOpacity style={styles.pageIconBtn}>
                            <MaterialIcons name="chevron-left" size={24} color={theme.colors.outline} />
                        </TouchableOpacity>
                        <View style={styles.activePageIcon}>
                            <Text style={styles.activePageIconText}>1</Text>
                        </View>
                        <TouchableOpacity style={styles.pageIconBtn}>
                            <MaterialIcons name="chevron-right" size={24} color={theme.colors.onSurfaceVariant} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity style={styles.fab}>
                <LinearGradient
                    colors={[theme.colors.primary, theme.colors.primaryContainer]}
                    style={styles.fabGradient}
                >
                    <MaterialIcons name="add" size={30} color="#fff" />
                </LinearGradient>
            </TouchableOpacity>

            <AdminBottomNavBar navigation={navigation} activeTab="Content" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        padding: 24,
        paddingBottom: 20,
    },
    headerTitleRow: {
        marginBottom: 20,
    },
    badge: {
        backgroundColor: 'rgba(39, 107, 46, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 99,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: theme.colors.primary,
        letterSpacing: 1,
    },
    mainTitle: {
        fontSize: 34,
        fontWeight: '800',
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.headline,
        lineHeight: 40,
        marginBottom: 8,
    },
    mainSubtitle: {
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
        lineHeight: 20,
    },
    addButton: {
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 8,
        ...theme.shadows.primary,
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        gap: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 120,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surfaceContainerLow,
        padding: 5,
        borderRadius: 20,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 15,
    },
    activeTab: {
        backgroundColor: '#d1fae5',
        ...theme.shadows.soft,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.outline,
    },
    activeTabText: {
        color: '#065f46',
        fontWeight: '800',
    },
    searchRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceContainerHigh,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.onSurface,
        marginLeft: 10,
    },
    filterBtn: {
        width: 52,
        height: 52,
        backgroundColor: theme.colors.surfaceContainerHigh,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        gap: 16,
    },
    resourceCard: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 20,
        padding: 20,
        borderLeftWidth: 6,
        ...theme.shadows.soft,
    },
    resourceHeader: {
        marginBottom: 16,
    },
    resourceMain: {
        marginBottom: 12,
    },
    resourceTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.headline,
        marginBottom: 4,
    },
    resourceSnippet: {
        fontSize: 13,
        color: theme.colors.onSurfaceVariant,
        fontStyle: 'italic',
        lineHeight: 18,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    authorAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: theme.colors.surfaceContainer,
        alignItems: 'center',
        justifyContent: 'center',
    },
    authorInitials: {
        fontSize: 10,
        fontWeight: '800',
        color: theme.colors.primary,
    },
    authorName: {
        fontSize: 13,
        fontWeight: '700',
        color: theme.colors.onSurfaceVariant,
    },
    resourceBadges: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    moodBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 99,
        gap: 6,
    },
    moodDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    moodText: {
        fontSize: 10,
        fontWeight: '800',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 99,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    resourceActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    iconBtn: {
        padding: 8,
        borderRadius: 10,
        backgroundColor: theme.colors.surfaceContainerLow,
    },
    deleteBtn: {
        backgroundColor: theme.colors.errorContainer,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
    },
    paginationText: {
        fontSize: 12,
        color: theme.colors.onSurfaceVariant,
    },
    bold: {
        fontWeight: '800',
        color: theme.colors.onSurface,
    },
    pageIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    pageIconBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: theme.colors.surfaceContainer,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activePageIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.primary,
    },
    activePageIconText: {
        color: '#fff',
        fontWeight: '800',
    },
    fab: {
        position: 'absolute',
        bottom: 110,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        elevation: 8,
        ...theme.shadows.primary,
    },
    fabGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default AdminResourceManagementScreen;
