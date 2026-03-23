import React, { useState, useEffect } from 'react';
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
    Modal,
    Alert,
    ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AdminBottomNavBar from '../../components/common/AdminBottomNavBar';
import api from '../../services/api';

const { width } = Dimensions.get('window');

const ManagementFeedback = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Search and Filter
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Active', 'Banned'

    // Ban modal state
    const [banModalVisible, setBanModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [banReason, setBanReason] = useState("");
    const [banDurationDays, setBanDurationDays] = useState("");

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

    const handleBanPress = (user) => {
        setSelectedUser(user);
        setBanReason("");
        setBanDurationDays("");
        setBanModalVisible(true);
    };

    const submitBan = async () => {
        if (!banReason.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập lý do khóa");
            return;
        }
        
        try {
            await api.patch(`/admin/users/${selectedUser._id}/ban`, {
                reason: banReason,
                durationDays: parseInt(banDurationDays, 10) || null
            });
            Alert.alert("Thành công", "Đã khóa tài khoản thành công");
            setBanModalVisible(false);
            fetchUsers();
        } catch (error) {
            Alert.alert("Lỗi", error.response?.data?.message || "Không thể khóa tài khoản");
        }
    };

    const handleUnban = async (userId) => {
        Alert.alert(
            "Xác nhận Mở Khóa",
            "Bạn có chắc muốn mở khóa tài khoản này?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Mở Khóa", onPress: async () => {
                        try {
                            await api.patch(`/admin/users/${userId}/unban`);
                            Alert.alert("Thành công", "Đã mở khóa tài khoản");
                            fetchUsers();
                        } catch (error) {
                            Alert.alert("Lỗi", "Không thể mở khóa tài khoản");
                        }
                    }
                }
            ]
        );
    };

    // Filter and search
    const filteredUsers = users.filter(user => {
        // Name search
        if (searchQuery && !user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) && !user.email?.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        // Status filter
        if (filterStatus === 'Active' && user.isBanned) return false;
        if (filterStatus === 'Banned' && !user.isBanned) return false;

        return true;
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Top App Bar */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.menuButton}>
                        <MaterialIcons name="menu" size={24} color="#064e3b" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>System Users</Text>
                </View>
                <TouchableOpacity onPress={fetchUsers} style={styles.refreshBtn}>
                    <MaterialIcons name="refresh" size={24} color="#064e3b" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={20} color="#717a6d" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Tìm người dùng (Tên, Email)..."
                        placeholderTextColor="rgba(113, 122, 109, 0.6)"
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Filter Bubbles */}
                <View style={styles.filterRow}>
                    {['All', 'Active', 'Banned'].map(status => (
                        <TouchableOpacity 
                            key={status}
                            style={[styles.filterChip, filterStatus === status && styles.filterChipActive]}
                            onPress={() => setFilterStatus(status)}
                        >
                            <Text style={[styles.filterChipText, filterStatus === status && styles.filterChipTextActive]}>
                                {status.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Users List Area */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>User Directory</Text>
                    <Text style={styles.sectionCount}>{filteredUsers.length} Users</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#276b2e" style={{ marginTop: 20 }} />
                ) : (
                    <View style={styles.userList}>
                        {filteredUsers.length === 0 ? (
                            <Text style={{ textAlign: 'center', color: '#666', marginTop: 20 }}>Không tìm thấy người dùng.</Text>
                        ) : (
                            filteredUsers.map((user) => (
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
                                            {user.isBanned && (
                                                <Text style={[styles.userTime, { color: '#ba1a1a', fontSize: 11, marginTop: 4 }]} numberOfLines={1}>
                                                    Lý do cấm: {user.banReason || 'Vi phạm chính sách'}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'flex-end', gap: 6 }}>
                                        <View style={[styles.statusBadge, user.isBanned && { backgroundColor: '#ffebee' }]}>
                                            <Text style={[styles.statusText, user.isBanned && { color: '#ba1a1a' }]}>
                                                {user.isBanned ? "BANNED" : "ACTIVE"}
                                            </Text>
                                        </View>
                                        
                                        {/* Action Buttons */}
                                        {user.role !== 'admin' && (
                                            user.isBanned ? (
                                                <TouchableOpacity style={styles.unbanBtn} onPress={() => handleUnban(user._id)}>
                                                    <MaterialIcons name="lock-open" size={16} color="#15803d" />
                                                    <Text style={styles.unbanBtnText}>Unban</Text>
                                                </TouchableOpacity>
                                            ) : (
                                                <TouchableOpacity style={styles.banBtn} onPress={() => handleBanPress(user)}>
                                                    <MaterialIcons name="block" size={16} color="#b91c1c" />
                                                    <Text style={styles.banBtnText}>Ban User</Text>
                                                </TouchableOpacity>
                                            )
                                        )}
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                )}
            </ScrollView>

            <AdminBottomNavBar navigation={navigation} activeTab="Users" />

            {/* BAN MODAL */}
            <Modal visible={banModalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Khóa {selectedUser?.fullName}</Text>
                            <TouchableOpacity onPress={() => setBanModalVisible(false)} style={styles.closeBtn}>
                                <MaterialIcons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalLabel}>Lý do khóa (Bắt buộc):</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Nhập lý do để người dùng thấy..."
                            value={banReason}
                            onChangeText={setBanReason}
                            multiline
                        />

                        <Text style={styles.modalLabel}>Thời hạn (Số ngày) - Để trống nếu là vĩnh viễn:</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Vd: 7"
                            keyboardType="numeric"
                            value={banDurationDays}
                            onChangeText={setBanDurationDays}
                        />

                        <TouchableOpacity style={styles.submitBanBtn} onPress={submitBan}>
                            <Text style={styles.submitBanText}>Xác nhận cấm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        backgroundColor: 'rgba(192, 233, 187, 0.5)',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#06210a',
    },
    refreshBtn: {
        padding: 8,
        backgroundColor: 'rgba(192, 233, 187, 0.5)',
        borderRadius: 20
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 150,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d0f1cc',
        borderRadius: 12,
        paddingHorizontal: 20,
        height: 56,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 16,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#06210a',
    },
    filterRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 24,
    },
    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#d0f1cc',
    },
    filterChipActive: {
        backgroundColor: '#60a560',
    },
    filterChipText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#064e3b',
    },
    filterChipTextActive: {
        color: '#fff',
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
    sectionCount: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
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
    banBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#fee2e2',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    banBtnText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#b91c1c'
    },
    unbanBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#dcfce7',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    unbanBtnText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#15803d'
    },
    
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#ba1a1a'
    },
    closeBtn: {
        padding: 4,
        backgroundColor: '#f5f5f5',
        borderRadius: 20
    },
    modalLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 12
    },
    modalInput: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#eee',
        padding: 12,
        borderRadius: 12,
        fontSize: 15,
        color: '#333',
        minHeight: 50
    },
    submitBanBtn: {
        backgroundColor: '#ba1a1a',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24
    },
    submitBanText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16
    }
});
export default ManagementFeedback;
