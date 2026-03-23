import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    Platform,
    StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AdminBottomNavBar from '../../components/common/AdminBottomNavBar';


const { width } = Dimensions.get('window');

const ManagementFeedback = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Top App Bar */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.menuButton}>
                        <MaterialIcons name="menu" size={24} color="#064e3b" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Community Garden</Text>
                </View>
                <Image
                    style={styles.adminAvatar}
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTE9HlWCxkyMGgnasTM3Ecewbvm25nlyEgnsT-TbOoyyOFc6C2Ay3op0lp6qjpS3OlrKySGONLaAMJVj-1IbFVCkXOyLHWqIP0b9-4HSc8MDmsz42RCsMWj9el-axOw-fgtS2_2KoI7BnrIXJUseW31IkDXs9j380vxhWRN-wIy1jBF928m-dm2M0BWCEZieIGjZp-1xBbLqU0bSaZos_ExSVy8zki37NAeVYv_zQ3JhP6C0YAU7OWKEMyMUNs3POtGqqEyWORhk8' }}
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Editorial Header Section */}
                <View style={styles.sectionHeader}>
                    <View style={styles.titleRow}>
                        <Text style={styles.displayLg}>System Users</Text>
                        <View style={styles.moodBloom}>
                            <MaterialIcons name="shield-person" size={24} color="#276b2e" />
                        </View>
                    </View>
                    <Text style={styles.subtitle}>
                        Managing the keepers of our digital sanctuary and therapeutic meadow.
                    </Text>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={20} color="#717a6d" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Find a gardener..."
                        placeholderTextColor="rgba(113, 122, 109, 0.6)"
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Users List */}
                <View style={styles.usersList}>
                    {users.map((user) => (
                        <View key={user.id} style={[styles.userCard, user.status === 'Offline' && styles.offlineCard]}>
                            <View style={styles.cardHeader}>
                                {user.avatar ? (
                                    <View style={styles.avatarWrap}>
                                        <Image style={styles.avatar} source={{ uri: user.avatar }} />
                                    </View>
                                ) : (
                                    <View style={[styles.initialsAvatar, { backgroundColor: '#60a560' }]}>
                                        <Text style={styles.initialsText}>{user.initials}</Text>
                                    </View>
                                )}

                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>{user.name}</Text>
                                    <Text style={styles.userEmail}>{user.email}</Text>
                                </View>

                                <View style={[styles.statusBadge, user.status === 'Offline' ? styles.offlineBadge : styles.activeBadge]}>
                                    <View style={[styles.statusDot, { backgroundColor: user.status === 'Offline' ? '#717a6d' : '#276b2e' }]} />
                                    <Text style={[styles.statusText, { color: user.status === 'Offline' ? '#717a6d' : '#276b2e' }]}>
                                        {user.status.toUpperCase()}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.cardActions}>
                                <TouchableOpacity style={styles.banButton}>
                                    <MaterialIcons name="block" size={18} color="#93000a" />
                                    <Text style={styles.banButtonText}>Ban User</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Pagination Component */}
                <View style={styles.pagination}>
                    <TouchableOpacity style={styles.pageArrow}>
                        <MaterialIcons name="chevron-left" size={20} color="#06210a" />
                    </TouchableOpacity>
                    <View style={styles.pageNumbers}>
                        <TouchableOpacity style={styles.activePage}>
                            <Text style={styles.activePageText}>1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.pageNumber}>
                            <Text style={styles.pageNumberText}>2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.pageNumber}>
                            <Text style={styles.pageNumberText}>3</Text>
                        </TouchableOpacity>
                        <Text style={styles.ellipsis}>...</Text>
                        <TouchableOpacity style={styles.pageNumber}>
                            <Text style={styles.pageNumberText}>8</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.pageArrow}>
                        <MaterialIcons name="chevron-right" size={20} color="#06210a" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity style={styles.fab}>
                <LinearGradient
                    colors={['#276b2e', '#60a560']}
                    style={styles.fabGradient}
                >
                    <MaterialIcons name="person-add" size={30} color="#ffffff" />
                </LinearGradient>
            </TouchableOpacity>

            <AdminBottomNavBar navigation={navigation} activeTab="Users" />
        </SafeAreaView>
    );
};

const users = [
    {
        id: 1,
        name: 'Elena Moss',
        email: 'elena.m@garden.com',
        status: 'Active',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnM3T9uGono34Z4-qkJofB17bHERQtVq7T9AZ3y0pOAtHSXgEw8wp9-MLkqJPxNqxAsNRSX72_He5QMsv8vSZlnkZEjf8cDy3v5m7I5FkSWnXw00xaLQNreuf7SIkTZUsXC0SozlgD6RXHkge9ISz1i_0J0MILg840rvApvFTmRFBpI2K5h9u37fbSugXL02nnnxeHC8i3erC6zqKiAjH_KohX38HLxUbh7CEiRYU-Uw8OU3GlNKYC784g4uNJXgw1f1wnelpivjQ',
    },
    {
        id: 2,
        name: 'Julian Dew',
        email: 'j.dew@sanctuary.org',
        status: 'Active',
        initials: 'JD',
    },
    {
        id: 3,
        name: 'Oliver Fern',
        email: 'o.fern@growth.io',
        status: 'Active',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUg0jNR4HsV0s1kn9i0Kkjd78EXP_nbxqk6ZbQBxEARY_srIcbz5rojr6xAHZQ5ZscKb1oRQ8zQcUYjGeRBjc3NAmJzZA-NE3BiUNzJWlphPTSYHm4ssOsCT6K_qZOmBXim-XaJNZzFSXScS_Zw_NMqaOoRx8bZS1tCiSRnjVC3PAgCw-z5iVTY-d25qIN6SUm3eYHgGACnSGlhuNcYj8q_swcMSTHrUYce1pP1YZ_lXoVfFZcNhOdo-1J493dhNsnt0L5k4BCb2s',
    },
    {
        id: 4,
        name: 'Sarah Bloom',
        email: 'sarah@bloom.com',
        status: 'Offline',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxiZxp0Q-zRTEC2bCrMQb6ReH8BWuwyYHbBgF-VCsmOSNl_trlQDlspsI5DlFaE9Oq9ZzABiZev96H_CB7UXJTzLwZuc90AaMi6ehmUeCGZ8EVcKwMwN3AKu87UgoKt_JkHFL0GZNS872me235PsB_Lyb6-_bwjLCCa1Cc-ss34Wm2QKIGAjdmmkQhypKXLXUsj19HjY_Vgo5CWeHAx4OPuL1j5ijpfBU4P8KMH1qy5iGB2oiPUpOPxlOvr-b-LvmeRsoWXXSg1VA',
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
        paddingHorizontal: 32,
        paddingVertical: 16,
        backgroundColor: 'rgba(235, 255, 230, 0.8)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    menuButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(235, 255, 230, 1)',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#06210a',
        fontFamily: Platform.OS === 'ios' ? 'Plus Jakarta Sans' : 'sans-serif',
    },
    adminAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#60a560',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 150,
    },
    sectionHeader: {
        marginBottom: 40,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    displayLg: {
        fontSize: 40,
        fontWeight: '800',
        color: '#06210a',
        letterSpacing: -1.5,
    },
    moodBloom: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(96, 165, 96, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#40493e',
        maxWidth: 280,
        lineHeight: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d0f1cc',
        borderRadius: 12,
        paddingHorizontal: 20,
        height: 56,
        marginBottom: 40,
    },
    searchIcon: {
        marginRight: 16,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#06210a',
    },
    usersList: {
        gap: 24,
    },
    userCard: {
        backgroundColor: '#dbfdd7',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    offlineCard: {
        opacity: 0.6,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatarWrap: {
        width: 56,
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        backgroundColor: '#9ae1ff',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    initialsAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    initialsText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#06210a',
    },
    userEmail: {
        fontSize: 12,
        color: '#40493e',
        fontWeight: '500',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
        gap: 6,
    },
    activeBadge: {
        backgroundColor: 'rgba(39, 107, 46, 0.1)',
    },
    offlineBadge: {
        backgroundColor: 'rgba(113, 122, 109, 0.1)',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        paddingTop: 16,
    },
    banButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffdad6',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        gap: 8,
    },
    banButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#93000a',
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 48,
        marginBottom: 32,
        gap: 8,
    },
    pageArrow: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#d0f1cc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageNumbers: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    activePage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#60a560',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    activePageText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#ffffff',
    },
    pageNumber: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageNumberText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#06210a',
    },
    ellipsis: {
        paddingHorizontal: 4,
        color: '#717a6d',
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 120,
        width: 64,
        height: 64,
        borderRadius: 32,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    fabGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 24,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(235, 255, 230, 0.9)',
        borderTopLeftRadius: 48,
        borderTopRightRadius: 48,
        shadowColor: '#06210a',
        shadowOffset: { width: 0, height: -12 },
        shadowOpacity: 0.06,
        shadowRadius: 32,
        elevation: 12,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 8,
    },
    navItemActive: {
        backgroundColor: 'rgba(144, 216, 141, 0.6)',
        borderRadius: 999,
        paddingHorizontal: 24,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ scale: 1.1 }],
    },
    navText: {
        fontSize: 11,
        fontWeight: '500',
        color: 'rgba(6, 95, 70, 0.7)',
        marginTop: 4,
        fontFamily: 'Plus Jakarta Sans',
    },
    navTextActive: {
        fontSize: 11,
        fontWeight: '500',
        color: '#06210a',
        marginTop: 4,
        fontFamily: 'Plus Jakarta Sans',
    },
});

export default ManagementFeedback;
