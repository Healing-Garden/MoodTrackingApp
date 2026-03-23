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
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');

const SettingScreen = ({ navigation }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

            {/* Background blobs */}
            <Svg width={300} height={300} style={styles.bloom1}>
                <Path
                    d="M180,0 C250,30 200,150 100,200 C0,250 0,50 180,0 Z"
                    fill="rgba(202,169,16,0.06)"
                />
            </Svg>
            <Svg width={300} height={300} style={styles.bloom2}>
                <Path
                    d="M120,0 C250,50 200,200 50,250 C-50,300 0,50 120,0 Z"
                    fill="rgba(39,107,46,0.06)"
                />
            </Svg>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backCircle}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={styles.headerIcon}>
                    <MaterialIcons name="settings" size={24} color={theme.colors.primary} />
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatarBorder}>
                            <Image
                                source={{
                                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgugw2M9Dna7xm0EIeV169BACNOkEIdTJYj7wAwE682VqOA0ojQ-qXFQELVPOUbwrph8x0e0KK3LSfztVw9Z71y1KX1Rojin9QNwMG9tnnHzpPDbDaCA_4N7ubYDUYEf9y9ofZ0ZpkbKP7GG2s1F-AgiZISLngEXpMmI6EoBhbkEz-na-rEAYrmicKoI7Lty_Hl4j1A2Rb1m3U25r68luy1bXJBHqfUi4YQfoHKTlowBKDnmi1HVcXm8LBF8cL41ZL4lcLRYSlEYc',
                                }}
                                style={styles.avatar}
                            />
                        </View>
                        <TouchableOpacity style={styles.editBadge}>
                            <MaterialIcons name="edit" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.userName}>Amelia Gardner</Text>
                        <Text style={styles.userStatus}>Daily Nurturer since March 2024</Text>
                        <TouchableOpacity
                            style={styles.editPill}
                            onPress={() => navigation.navigate('EditProfile')}
                        >
                            <Text style={styles.editPillText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Sections */}
                <View style={styles.sectionsContainer}>
                    {/* General */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>GENERAL</Text>
                        <View style={styles.group}>
                            <TouchableOpacity style={styles.menuItem}>
                                <View style={[styles.menuIconBg, { backgroundColor: '#dbfdd7' }]}>
                                    <MaterialIcons name="notifications" size={22} color="#0c6780" />
                                </View>
                                <View style={styles.menuText}>
                                    <Text style={styles.menuLabel}>Notifications</Text>
                                    <Text style={styles.menuSubLabel}>Manage journal reminders</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color="#40493e" style={{ opacity: 0.3 }} />
                            </TouchableOpacity>

                            <View style={styles.menuItem}>
                                <View style={[styles.menuIconBg, { backgroundColor: '#d0f1cc' }]}>
                                    <MaterialIcons name="dark-mode" size={22} color="#705d00" />
                                </View>
                                <Text style={styles.menuLabel}>Dark Mode</Text>
                                <Switch
                                    value={isDarkMode}
                                    onValueChange={setIsDarkMode}
                                    trackColor={{ false: '#c2e3be', true: '#276b2e' }}
                                    thumbColor="#fff"
                                />
                            </View>

                            <TouchableOpacity style={styles.menuItem}>
                                <View style={[styles.menuIconBg, { backgroundColor: '#ffe174' }]}>
                                    <MaterialIcons name="translate" size={22} color="#705d00" />
                                </View>
                                <View style={styles.menuText}>
                                    <Text style={styles.menuLabel}>Language</Text>
                                    <Text style={styles.menuSubLabel}>English (US)</Text>
                                </View>
                                <MaterialIcons name="expand-more" size={24} color="#40493e" style={{ opacity: 0.3 }} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Security */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>SECURITY</Text>
                        <View style={styles.group}>
                            <TouchableOpacity style={styles.menuItem}>
                                <View style={[styles.menuIconBg, { backgroundColor: '#fff6' }]}>
                                    <MaterialIcons name="lock-reset" size={22} color="#0c6780" />
                                </View>
                                <Text style={styles.menuLabel}>Change Password</Text>
                                <MaterialIcons name="chevron-right" size={24} color="#40493e" style={{ opacity: 0.3 }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem}>
                                <View style={[styles.menuIconBg, { backgroundColor: '#fff6' }]}>
                                    <MaterialIcons name="pin" size={22} color="#276b2e" />
                                </View>
                                <Text style={styles.menuLabel}>Set App Lock PIN</Text>
                                <MaterialIcons name="chevron-right" size={24} color="#40493e" style={{ opacity: 0.3 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ebffe6' },
    scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 150 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#ffffffcc', borderBottomWidth: 0, zIndex: 10 },
    backCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#dbfdd7', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#276b2e' },
    headerIcon: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    bloom1: { position: 'absolute', top: -50, left: -50 },
    bloom2: { position: 'absolute', bottom: 100, right: -100 },
    profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 24, padding: 24, marginBottom: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.06, shadowRadius: 32 },
    avatarWrapper: { position: 'relative' },
    avatarBorder: { width: 96, height: 96, borderRadius: 48, overflow: 'hidden', borderWidth: 4, borderColor: '#d6f7d1' },
    avatar: { width: '100%', height: '100%' },
    editBadge: { position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18, backgroundColor: '#276b2e', justifyContent: 'center', alignItems: 'center' },
    profileInfo: { marginLeft: 24, flex: 1 },
    userName: { fontSize: 20, fontWeight: '700', color: '#06210a', marginBottom: 4 },
    userStatus: { fontSize: 14, color: '#40493e', marginBottom: 12 },
    editPill: { alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 24, backgroundColor: '#caa910' },
    editPillText: { fontSize: 14, fontWeight: '700', color: '#fff' },
    sectionsContainer: { gap: 24 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 12, fontWeight: '700', color: '#276b2e', letterSpacing: 2, marginBottom: 12 },
    group: { backgroundColor: '#dbfdd7', borderRadius: 24, padding: 8 },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 8 },
    menuIconBg: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    menuText: { flex: 1 },
    menuLabel: { fontSize: 16, fontWeight: '700', color: '#06210a' },
    menuSubLabel: { fontSize: 12, color: '#40493e', marginTop: 2, opacity: 0.7 },
});

export default SettingScreen;