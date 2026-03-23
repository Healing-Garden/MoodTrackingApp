import React, { useState, useEffect } from 'react';
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
    Dimensions,
    ActivityIndicator,
    Modal,
    TextInput,
    Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import AdminBottomNavBar from '../../components/common/AdminBottomNavBar';
import api from '../../services/api';

const { width } = Dimensions.get('window');

const FeedbackCard = ({ item, onPressCard }) => {
    // Determine colors
    let statusColor = '#0c6780'; // reviewed
    if (item.status === 'pending') statusColor = '#705d00';
    if (item.status === 'resolved') statusColor = '#276b2e';

    let tagBg = '#60a560'; // feature
    let tagTextColor = '#00370b';
    if (item.type === 'bug') { tagBg = '#ffdad6'; tagTextColor = '#ba1a1a'; }
    if (item.type === 'content_rating') { tagBg = '#0c6780'; tagTextColor = '#ffffff'; }

    const initials = item.user_id?.fullName ? item.user_id.fullName.substring(0,2).toUpperCase() : 'U';

    return (
        <TouchableOpacity style={styles.card} onPress={() => onPressCard(item)}>
            <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                    <View style={styles.initialsContainer}>
                        <Text style={styles.initialsText}>{initials}</Text>
                    </View>
                    <View>
                        <Text style={styles.userName} numberOfLines={1}>{item.user_id?.fullName || 'Anonymous'}</Text>
                        <Text style={styles.userEmail} numberOfLines={1}>{item.user_id?.email || 'N/A'}</Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                    <Text style={[styles.statusBadgeText, { color: statusColor }]}>{item.status?.toUpperCase() || 'UNKNOWN'}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={[styles.tag, { backgroundColor: tagBg }]}>
                    <Text style={[styles.tagText, { color: tagTextColor }]}>{(item.type || '').toUpperCase()}</Text>
                </View>
                <Text style={styles.feedbackTitle} numberOfLines={2}>{item.subject}</Text>
                <Text style={styles.feedbackMessage} numberOfLines={2}>{item.message}</Text>
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.footerInfo}>
                    {item.rating != null && (
                        <View style={styles.ratingRow}>
                            <MaterialIcons name="star" size={16} color={theme.colors.tertiary} />
                            <Text style={styles.ratingText}>{item.rating}/5</Text>
                        </View>
                    )}
                    <View style={styles.dateRow}>
                        <MaterialIcons name="calendar-today" size={14} color={theme.colors.onSurfaceVariant} />
                        <Text style={styles.dateText}>{new Date(item.created_at).toLocaleDateString()}</Text>
                    </View>
                </View>

                <View style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}>
                    <MaterialIcons name="arrow-forward" size={20} color={theme.colors.onPrimary} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const AdminFeedbackScreen = ({ navigation }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Modal states
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [adminResponse, setAdminResponse] = useState('');
    const [updateStatus, setUpdateStatus] = useState('');

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/feedback');
            setFeedbacks(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePressCard = (item) => {
        setSelectedFeedback(item);
        setAdminResponse(item.admin_response || '');
        setUpdateStatus(item.status || 'pending');
        setModalVisible(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedFeedback) return;
        try {
            await api.patch(`/admin/feedback/${selectedFeedback._id}/status`, {
                status: updateStatus,
                admin_response: adminResponse
            });
            Alert.alert("Thành công", "Đã cập nhật phản hồi!");
            setModalVisible(false);
            fetchFeedbacks();
        } catch (error) {
            Alert.alert("Lỗi", "Không thể cập nhật phản hồi.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <MaterialIcons name="spa" size={24} color={theme.colors.primary} />
                    <Text style={styles.headerTitle}>Healing Garden Admin</Text>
                </View>
                <TouchableOpacity onPress={fetchFeedbacks}>
                    <MaterialIcons name="refresh" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text style={styles.mainTitle}>Feedback Overview</Text>
                    <Text style={styles.mainSubtitle}>Listening to the garden's whispers. Review and manage user thoughts.</Text>
                </View>

                {/* Feedback List */}
                {loading ? (
                    <ActivityIndicator size="large" color="#276b2e" style={{ marginTop: 20 }} />
                ) : (
                    <View style={styles.list}>
                        {feedbacks.length === 0 ? (
                            <Text style={{ textAlign: 'center', color: '#666', marginTop: 20 }}>Không có phản hồi nào.</Text>
                        ) : (
                            feedbacks.map(item => (
                                <FeedbackCard key={item._id} item={item} onPressCard={handlePressCard} />
                            ))
                        )}
                    </View>
                )}
            </ScrollView>

            <AdminBottomNavBar navigation={navigation} activeTab="Feedback" />

            {/* DETAIL / EDIT MODAL */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedFeedback && (
                            <>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Chi tiết Feedback</Text>
                                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                                        <MaterialIcons name="close" size={24} color="#666" />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                                    <Text style={styles.detailLabel}>Chủ đề:</Text>
                                    <Text style={styles.detailText}>{selectedFeedback.subject}</Text>

                                    <Text style={styles.detailLabel}>Nội dung:</Text>
                                    <View style={styles.messageBox}>
                                        <Text style={styles.detailText}>{selectedFeedback.message}</Text>
                                    </View>

                                    <Text style={styles.detailLabel}>Từ: <Text style={{fontWeight: '400'}}>{selectedFeedback.user_id?.fullName} ({selectedFeedback.user_id?.email})</Text></Text>

                                    <Text style={styles.detailLabel}>Đổi trạng thái:</Text>
                                    <View style={styles.statusChips}>
                                        {['pending', 'reviewed', 'resolved'].map(statusVal => (
                                            <TouchableOpacity 
                                                key={statusVal}
                                                style={[styles.statusChip, updateStatus === statusVal && styles.statusChipActive]}
                                                onPress={() => setUpdateStatus(statusVal)}
                                            >
                                                <Text style={[styles.statusChipText, updateStatus === statusVal && styles.statusChipTextActive]}>{statusVal.toUpperCase()}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    <Text style={styles.detailLabel}>Phản hồi / Ghi chú admin:</Text>
                                    <TextInput 
                                        style={styles.responseInput}
                                        value={adminResponse}
                                        onChangeText={setAdminResponse}
                                        multiline
                                        placeholder="Admin memo..."
                                    />

                                    <TouchableOpacity style={styles.updateBtn} onPress={handleUpdateStatus}>
                                        <Text style={styles.updateBtnText}>Lưu & Cập nhật</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
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
        letterSpacing: -1,
    },
    mainSubtitle: {
        fontSize: 13,
        color: theme.colors.onSurfaceVariant,
        marginTop: 4,
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
        flex: 1,
        paddingRight: 10
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
        fontSize: 16,
        fontWeight: '700',
        color: '#065f46',
        marginBottom: 4
    },
    feedbackMessage: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18
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
    // Modal
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, height: '80%'
    },
    modalHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20
    },
    modalTitle: {
        fontSize: 18, fontWeight: '800', color: '#064e3b'
    },
    closeBtn: {
        padding: 4, backgroundColor: '#f5f5f5', borderRadius: 20
    },
    detailLabel: {
        fontSize: 14, fontWeight: '700', color: '#064e3b', marginBottom: 6, marginTop: 16
    },
    detailText: {
        fontSize: 15, color: '#333', lineHeight: 22
    },
    messageBox: {
        backgroundColor: '#f5f5f5', padding: 12, borderRadius: 12
    },
    statusChips: {
        flexDirection: 'row', gap: 10, marginTop: 4
    },
    statusChip: {
        paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#ccc'
    },
    statusChipActive: {
        backgroundColor: '#064e3b', borderColor: '#064e3b'
    },
    statusChipText: {
        fontSize: 12, fontWeight: '600', color: '#666'
    },
    statusChipTextActive: {
        color: '#fff'
    },
    responseInput: {
        backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#eee', padding: 12, borderRadius: 12, fontSize: 14, color: '#333', minHeight: 80, textAlignVertical: 'top', marginTop: 4
    },
    updateBtn: {
        backgroundColor: '#276b2e', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 24
    },
    updateBtnText: {
        color: '#fff', fontWeight: '700', fontSize: 16
    }
});

export default AdminFeedbackScreen;
