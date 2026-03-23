import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    Image,
    Switch,
    Dimensions,
} from 'react-native';
import { theme } from '../../theme';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SettingScreen = ({ navigation }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" transparent backgroundColor="transparent" />

            {/* Organic Decorations */}
            <View style={styles.bloom1} />
            <View style={styles.bloom2} />

            {/* Editorial Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backCircle}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={24} color={theme.colors.onSurface} />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTag}>QUẢN LÝ</Text>
                    <Text style={styles.headerTitle}>Cài đặt {"\n"}<Text style={styles.italicTitle}>& Riêng tư</Text></Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Asymmetric Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatarBorder}>
                            <Image
                                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgugw2M9Dna7xm0EIeV169BACNOkEIdTJYj7wAwE682VqOA0ojQ-qXFQELVPOUbwrph8x0e0KK3LSfztVw9Z71y1KX1Rojin9QNwMG9tnnHzpPDbDaCA_4N7ubYDUYEf9y9ofZ0ZpkbKP7GG2s1F-AgiZISLngEXpMmI6EoBhbkEz-na-rEAYrmicKoI7Lty_Hl4j1A2Rb1m3U25r68luy1bXJBHqfUi4YQfoHKTlowBKDnmi1HVcXm8LBF8cL41ZL4lcLRYSlEYc' }}
                                style={styles.avatar}
                            />
                        </View>
                        <TouchableOpacity style={styles.editBadge}>
                            <MaterialIcons name="edit" size={18} color={theme.colors.white} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.userName}>Amelia Gardner</Text>
                        <Text style={styles.userStatus}>Hoạt động từ Tháng 3, 2024</Text>
                        <TouchableOpacity
                            style={styles.editPill}
                            onPress={() => navigation.navigate('EditProfile')}
                        >
                            <Text style={styles.editPillText}>Chỉnh sửa hồ sơ</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Settings Sections */}
                <View style={styles.sectionsContainer}>
                    {/* General Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>CÀI ĐẶT CHUNG</Text>
                        <View style={styles.group}>
                            <TouchableOpacity style={styles.menuItem}>
                                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(39, 107, 46, 0.08)' }]}>
                                    <MaterialIcons name="notifications-none" size={22} color={theme.colors.primary} />
                                </View>
                                <View style={styles.menuText}>
                                    <Text style={styles.menuLabel}>Thông báo</Text>
                                    <Text style={styles.menuSubLabel}>Quản lý nhắc nhở nhật ký</Text>
                                </View>
                                <Text style={styles.chevron}>chevron_right</Text>
                            </TouchableOpacity>

                            <View style={styles.menuItem}>
                                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(12, 103, 128, 0.08)' }]}>
                                    <MaterialIcons name="dark-mode" size={22} color={theme.colors.secondary} />
                                </View>
                                <Text style={styles.menuLabel}>Chế độ tối</Text>
                                <Switch
                                    value={isDarkMode}
                                    onValueChange={setIsDarkMode}
                                    trackColor={{ false: 'rgba(0,0,0,0.1)', true: theme.colors.primary }}
                                    thumbColor={theme.colors.white}
                                />
                            </View>

                            <TouchableOpacity style={styles.menuItem}>
                                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(202, 169, 16, 0.08)' }]}>
                                    <MaterialIcons name="language" size={22} color={theme.colors.tertiary} />
                                </View>
                                <View style={styles.menuText}>
                                    <Text style={styles.menuLabel}>Ngôn ngữ</Text>
                                    <Text style={styles.menuSubLabel}>Tiếng Việt (VN)</Text>
                                </View>
                                <MaterialIcons name="expand-more" size={24} color={theme.colors.onSurfaceVariant} style={{ opacity: 0.3 }} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Security Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>BẢO MẬT</Text>
                        <View style={styles.group}>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => navigation.navigate('ChangePassword')}
                            >
                                <View style={styles.menuIconBg}>
                                    <MaterialIcons name="lock-outline" size={22} color={theme.colors.onSurfaceVariant} />
                                </View>
                                <Text style={styles.menuLabel}>Đổi mật khẩu</Text>
                                <Text style={styles.chevron}>chevron_right</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => navigation.navigate('EditPin')}
                            >
                                <View style={styles.menuIconBg}>
                                    <MaterialIcons name="dialpad" size={22} color={theme.colors.onSurfaceVariant} />
                                </View>
                                <Text style={styles.menuLabel}>Mã PIN ứng dụng</Text>
                                <Text style={styles.chevron}>chevron_right</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Support Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>HỖ TRỢ & THÔNG TIN</Text>
                        <View style={styles.group}>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => navigation.navigate('Feedback')}
                            >
                                <View style={styles.menuIconBg}>
                                    <MaterialIcons name="chat-bubble-outline" size={22} color={theme.colors.onSurfaceVariant} />
                                </View>
                                <Text style={styles.menuLabel}>Gửi phản hồi</Text>
                                <MaterialIcons name="open-in-new" size={24} color={theme.colors.onSurfaceVariant} style={{ opacity: 0.3 }} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem}>
                                <View style={styles.menuIconBg}>
                                    <MaterialIcons name="info-outline" size={22} color={theme.colors.onSurfaceVariant} />
                                </View>
                                <Text style={styles.menuLabel}>Về Healing Garden</Text>
                                <Text style={styles.versionTag}>v2.4.0</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => navigation.navigate('Landing')}
                    >
                        <Text style={styles.logoutText}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Glassmorphism Bottom Nav */}
            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Dashboard')}
                >
                    <MaterialIcons name="spa" size={26} color={theme.colors.onSurfaceVariant} style={{ opacity: 0.4 }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Journal')}
                >
                    <MaterialIcons name="menu-book" size={26} color={theme.colors.onSurfaceVariant} style={{ opacity: 0.4 }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Insights')}
                >
                    <MaterialIcons name="bar-chart" size={26} color={theme.colors.onSurfaceVariant} style={{ opacity: 0.4 }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navActivePill}>
                    <MaterialIcons name="settings" size={24} color={theme.colors.primary} />
                    <Text style={styles.navLabelActive}>Cài đặt</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },
    bloom1: {
        position: 'absolute',
        top: -50,
        left: -50,
        width: 250,
        height: 250,
        backgroundColor: 'rgba(202, 169, 16, 0.03)',
        borderRadius: 125,
    },
    bloom2: {
        position: 'absolute',
        bottom: 100,
        right: -100,
        width: 300,
        height: 300,
        backgroundColor: 'rgba(39, 107, 46, 0.03)',
        borderRadius: 150,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: 64,
        paddingBottom: 24,
        gap: 20,
    },
    backCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.surfaceBright,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.soft,
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTag: {
        ...theme.typography.label,
        fontSize: 10,
        color: theme.colors.secondary,
        letterSpacing: 2,
        marginBottom: 8,
    },
    headerTitle: {
        ...theme.typography.headline,
        fontSize: 32,
        lineHeight: 38,
        color: theme.colors.onSurface,
    },
    italicTitle: {
        fontFamily: theme.fonts.elegant,
        fontStyle: 'italic',
        color: theme.colors.primary,
        fontWeight: 'normal',
    },
    iconFont: {
        fontSize: 24,
        color: theme.colors.onSurface,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: 16,
        paddingBottom: 150,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderRadius: 32,
        padding: 24,
        marginBottom: 40,
        ...theme.shadows.soft,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatarBorder: {
        width: 100,
        height: 100,
        borderRadius: 40,
        borderWidth: 6,
        borderColor: theme.colors.surfaceVariant,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    editBadge: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        width: 36,
        height: 36,
        borderRadius: 14,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.primary,
    },
    editIcon: {
        fontSize: 18,
        color: theme.colors.white,
    },
    profileInfo: {
        marginLeft: 24,
        flex: 1,
    },
    userName: {
        ...theme.typography.headline,
        fontSize: 24,
        color: theme.colors.onSurface,
        marginBottom: 4,
    },
    userStatus: {
        ...theme.typography.body,
        fontSize: 13,
        color: theme.colors.onSurfaceVariant,
        opacity: 0.6,
        marginBottom: 16,
    },
    editPill: {
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(39, 107, 46, 0.08)',
        borderRadius: 16,
    },
    editPillText: {
        ...theme.typography.label,
        fontSize: 12,
        color: theme.colors.primary,
        fontWeight: '700',
    },
    sectionsContainer: {
        gap: 32,
    },
    section: {
        gap: 16,
    },
    sectionTitle: {
        ...theme.typography.label,
        fontSize: 11,
        color: theme.colors.primary,
        letterSpacing: 2,
        paddingLeft: 8,
    },
    group: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 32,
        padding: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 24,
        marginBottom: 4,
    },
    menuIconBg: {
        width: 48,
        height: 48,
        borderRadius: 18,
        backgroundColor: theme.colors.surfaceBright,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        ...theme.shadows.soft,
    },
    iconFontSmall: {
        fontSize: 22,
        color: theme.colors.onSurfaceVariant,
    },
    menuText: {
        flex: 1,
    },
    menuLabel: {
        ...theme.typography.headline,
        fontSize: 16,
        color: theme.colors.onSurface,
    },
    menuSubLabel: {
        ...theme.typography.body,
        fontSize: 13,
        color: theme.colors.onSurfaceVariant,
        opacity: 0.6,
        marginTop: 2,
    },
    chevron: {
        fontSize: 24,
        color: theme.colors.onSurfaceVariant,
        opacity: 0.3,
    },
    versionTag: {
        ...theme.typography.label,
        fontSize: 12,
        color: theme.colors.onSurfaceVariant,
        opacity: 0.4,
        fontWeight: '700',
    },
    logoutButton: {
        marginTop: 16,
        paddingVertical: 20,
        borderRadius: 24,
        backgroundColor: 'rgba(186, 26, 26, 0.05)',
        alignItems: 'center',
    },
    logoutText: {
        ...theme.typography.label,
        fontSize: 16,
        color: theme.colors.error,
        fontWeight: '700',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 90,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 20,
        paddingHorizontal: 16,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        ...theme.shadows.soft,
    },
    navItem: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navIcon: {
        fontSize: 26,
        color: theme.colors.onSurfaceVariant,
        opacity: 0.4,
    },
    navActivePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(39, 107, 46, 0.1)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        gap: 8,
    },
    navIconActive: {
        fontSize: 24,
        color: theme.colors.primary,
    },
    navLabelActive: {
        ...theme.typography.label,
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: '700',
    },
});

export default SettingScreen;
