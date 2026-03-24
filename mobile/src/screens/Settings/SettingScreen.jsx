import React, { useState, useCallback } from 'react';
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
    Modal,
    TextInput,
    Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../../theme';
import api, { setAuthToken } from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';
import BottomNavBar from '../../components/common/BottomNavBar';
import AdminBottomNavBar from '../../components/common/AdminBottomNavBar';

const { width } = Dimensions.get('window');

const SettingScreen = ({ navigation }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [user, setUser] = useState(null);
    const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Error", "Please enter all information.");
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            Alert.alert("Error", "Password must be at least 8 characters long, include one uppercase letter and one special character.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Confirm password does not match.");
            return;
        }
        setPasswordLoading(true);
        try {
            await api.post('/profile/change-password', {
                currentPassword,
                newPassword
            });
            Alert.alert("Success", "Password changed successfully!");
            setPasswordModalVisible(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Password change failed.");
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleLogout = () => {
        setAuthToken(null);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    useFocusEffect(
        useCallback(() => {
            const fetchProfile = async () => {
                try {
                    const res = await api.get('/profile');
                    setUser(res.data.user);
                } catch (error) {
                    console.log('Error fetching profile:', error);
                }
            };
            fetchProfile();
        }, [])
    );

    const getAvatarSource = () => {
        if (user && user.avatarUrl) {
            const url = user.avatarUrl;
            if (url.startsWith('http')) return { uri: url };
            return { uri: `http://192.168.1.245:8080${url}` };
        }
        return { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgugw2M9Dna7xm0EIeV169BACNOkEIdTJYj7wAwE682VqOA0ojQ-qXFQELVPOUbwrph8x0e0KK3LSfztVw9Z71y1KX1Rojin9QNwMG9tnnHzpPDbDaCA_4N7ubYDUYEf9y9ofZ0ZpkbKP7GG2s1F-AgiZISLngEXpMmI6EoBhbkEz-na-rEAYrmicKoI7Lty_Hl4j1A2Rb1m3U25r68luy1bXJBHqfUi4YQfoHKTlowBKDnmi1HVcXm8LBF8cL41ZL4lcLRYSlEYc' };
    };

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
                            {user?.avatarUrl ? (
                                <Image source={getAvatarSource()} style={styles.avatar} />
                            ) : (
                                <View style={[styles.avatar, { backgroundColor: 'rgba(39, 107, 46, 0.2)', justifyContent: 'center', alignItems: 'center' }]}>
                                    <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#276b2e' }}>
                                        {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                    </Text>
                                </View>
                            )}
                        </View>
                        {/* <TouchableOpacity style={styles.editBadge} onPress={() => navigation.navigate('EditProfile')}>
                            <MaterialIcons name="edit" size={18} color="#fff" />
                        </TouchableOpacity> */}
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.userName}>{user ? user.fullName : "User Name"}</Text>
                        <Text style={styles.userStatus}>Age: {user?.age || '--'}, W: {user?.weight || '--'}kg, H: {user?.heightCm || '--'}cm</Text>
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
                            <TouchableOpacity style={styles.menuItem} onPress={() => setPasswordModalVisible(true)}>
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

                    {/* Support & Info Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>SUPPORT & INFO</Text>
                        <View style={styles.group}>
                            {user?.role !== 'admin' && (
                                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Feedback')}>
                                    <View style={[styles.menuIconBg, { backgroundColor: theme.colors.white }]}>
                                        <MaterialIcons name="chat-bubble" size={22} color="#705d00" />
                                    </View>
                                    <Text style={styles.menuLabel}>Send Feedback</Text>
                                    <MaterialIcons name="open-in-new" size={20} color={theme.colors.outline} />
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity style={styles.menuItem}>
                                <View style={[styles.menuIconBg, { backgroundColor: theme.colors.white }]}>
                                    <MaterialIcons name="info" size={22} color={theme.colors.onSurfaceVariant} />
                                </View>
                                <View style={styles.menuText}>
                                    <Text style={styles.menuLabel}>About Healing Garden</Text>
                                </View>
                                <Text style={styles.versionText}>V2.4.0</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Account */}
                    <View style={styles.section}>
                        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                            <MaterialIcons name="logout" size={20} color="#ba1a1a" />
                            <Text style={styles.logoutText}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Password Modal */}
            <Modal visible={isPasswordModalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Change Password</Text>
                        
                        <TextInput 
                            style={styles.modalInput}
                            placeholder="Current Password"
                            secureTextEntry
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                        />
                        <TextInput 
                            style={styles.modalInput}
                            placeholder="New Password"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        <TextInput 
                            style={styles.modalInput}
                            placeholder="Confirm New Password"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setPasswordModalVisible(false)}>
                                <Text style={styles.modalButtonCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButtonSubmit} onPress={handleChangePassword} disabled={passwordLoading}>
                                <Text style={styles.modalButtonSubmitText}>{passwordLoading ? 'Saving...' : 'Save'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Conditional BottomNavBar */}
            {user?.role === 'admin' ? (
                <AdminBottomNavBar navigation={navigation} activeTab="Settings" />
            ) : (
                <BottomNavBar navigation={navigation} activeTab="Settings" />
            )}

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
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    modalTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.primary, marginBottom: 16, textAlign: 'center' },
    modalInput: { backgroundColor: '#f0f0f0', borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 16 },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    modalButtonCancel: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: '#e0e0e0', borderRadius: 10, marginRight: 8 },
    modalButtonCancelText: { fontSize: 16, fontWeight: '600', color: '#555' },
    modalButtonSubmit: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: theme.colors.primary, borderRadius: 10, marginLeft: 8 },
    modalButtonSubmitText: { fontSize: 16, fontWeight: '600', color: '#fff' },
    bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#ffffff', borderTopLeftRadius: 48, borderTopRightRadius: 48, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: -12 }, shadowRadius: 32 },
    navItem: { justifyContent: 'center', alignItems: 'center' },
    activeNavItem: { backgroundColor: '#D1F7D6', paddingHorizontal: 20, paddingVertical: 6, borderRadius: 999 },
    navLabel: { fontSize: 11, fontWeight: '500', marginTop: 2, color: theme.colors.stone500 },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#ffdad6', borderRadius: 24, gap: 12, marginTop: 12 },
    logoutText: { fontSize: 16, fontWeight: '700', color: '#ba1a1a' },
    versionText: { 
        fontSize: 12, 
        fontWeight: '700', 
        color: '#40493e', 
        opacity: 0.5,
        fontFamily: theme.fonts.body
    },
});

export default SettingScreen;