import React, { useState, useEffect } from 'react';
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
    Dimensions,
    ActivityIndicator,
    Alert,
    Modal
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import { theme } from '../../theme';
import AdminBottomNavBar from '../../components/common/AdminBottomNavBar';
import api from '../../services/api';

const { width } = Dimensions.get('window');

const ResourceCard = ({ item, onEdit, onDelete, onView }) => {
    let authorInitial = 'A';
    const authorName = item.author || (item.metadata && item.metadata.author) || 'Author';
    if(authorName && authorName.length > 0) authorInitial = authorName[0].toUpperCase();

    // Map moodLevel
    let moodBadgeBg = '#d1fae5';
    let moodDot = '#10b981';
    let moodText = '#047857';
    if(item.moodLevel <= 2) { moodBadgeBg = '#fee2e2'; moodDot = '#f87171'; moodText = '#b91c1c'; }

    return (
        <View style={styles.resourceCard}>
            <View style={styles.resourceHeader}>
                <View style={styles.resourceMain}>
                    <Text style={styles.resourceTitle} numberOfLines={2}>{item.title}</Text>
                    {item.type === 'quote' ? (
                        <Text style={styles.resourceSnippet} numberOfLines={2}>"{item.content}"</Text>
                    ) : (
                        <Text style={styles.resourceSnippet} numberOfLines={2}>
                            {item.description || item.content || (item.metadata?.duration_seconds ? `Thời lượng: ${item.metadata.duration_seconds}s` : 'Video/Podcast')}
                        </Text>
                    )}
                </View>
                <View style={styles.authorRow}>
                    <View style={styles.authorAvatar}>
                        <Text style={styles.authorInitials}>{authorInitial}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.resourceBadges}>
                <View style={[styles.moodBadge, { backgroundColor: moodBadgeBg }]}>
                    <View style={[styles.moodDot, { backgroundColor: moodDot }]} />
                    <Text style={[styles.moodText, { color: moodText }]}>Mood: {item.moodLevel}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.is_active ? '#d1fae5' : '#f3f4f6' }]}>
                    <Text style={[styles.statusText, { color: item.is_active ? '#065f46' : '#6b7280' }]}>
                        {item.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </Text>
                </View>
                {item.videoUrl && (
                    <MaterialIcons name={item.type === 'podcast' ? 'mic' : 'videocam'} size={20} color={theme.colors.primary} />
                )}
            </View>

            <View style={styles.resourceActions}>
                <TouchableOpacity style={[styles.iconBtn, { marginRight: 'auto', backgroundColor: '#e2f2ff' }]} onPress={() => onView(item)}>
                    <MaterialIcons name="visibility" size={20} color="#005a80" />
                    <Text style={{fontSize: 12, fontWeight: '700', color: '#005a80', marginLeft: 4}}>View Detail</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={() => onEdit(item)}>
                    <MaterialIcons name="edit" size={20} color={theme.colors.secondary} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconBtn, styles.deleteBtn]} onPress={() => onDelete(item._id)}>
                    <MaterialIcons name="delete" size={20} color={theme.colors.error} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const AdminResourceManagementScreen = ({ navigation }) => {
    const tabs = ['Quotes', 'Videos', 'Podcasts'];
    const tabMap = { 'Quotes': 'quote', 'Videos': 'video', 'Podcasts': 'podcast' };
    const [activeTab, setActiveTab] = useState('Quotes');
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Edit/Add Modal states
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // Detail View Modal states
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);

    // Form states
    const [formId, setFormId] = useState('');
    const [formTitle, setFormTitle] = useState('');
    const [formAuthor, setFormAuthor] = useState('');
    const [formContent, setFormContent] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formMood, setFormMood] = useState('3');
    const [formVideoUri, setFormVideoUri] = useState(null);
    const [formVideoDuration, setFormVideoDuration] = useState('');
    const [formVideoFileToUpload, setFormVideoFileToUpload] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchResources(tabMap[activeTab]);
    }, [activeTab]);

    const fetchResources = async (type) => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/healing-content?type=${type}`);
            setResources(res.data || []);
        } catch (error) {
            console.error("Fetch resource error", error);
            Alert.alert("Lỗi", "Không thể tải danh sách " + activeTab);
        } finally {
            setLoading(false);
        }
    };

    const handleViewPress = (item) => {
        setSelectedDetail(item);
        setDetailVisible(true);
    };

    const handleAddPress = () => {
        setFormId('');
        setFormTitle('');
        setFormAuthor('');
        setFormContent('');
        setFormDescription('');
        setFormMood('3');
        setFormVideoUri(null);
        setFormVideoDuration('');
        setFormVideoFileToUpload(null);
        setIsEditing(false);
        setModalVisible(true);
    };

    const handleEditPress = (item) => {
        setFormId(item._id);
        setFormTitle(item.title || '');
        setFormAuthor(item.author || (item.metadata?.author) || '');
        setFormContent(item.content || '');
        setFormDescription(item.description || '');
        setFormMood(String(item.moodLevel || 3));
        setFormVideoUri(item.videoUrl || null);
        setFormVideoDuration(item.metadata?.duration_seconds ? String(item.metadata.duration_seconds) : '');
        setFormVideoFileToUpload(null);
        setIsEditing(true);
        setModalVisible(true);
    };

    const handleDeletePress = (id) => {
        Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xoá nội dung này không?", [
            { text: "Huỷ", style: "cancel" },
            { 
                text: "Xoá", style: "destructive", onPress: async () => {
                    try {
                        await api.delete(`/admin/healing-content/${id}?type=${tabMap[activeTab]}`);
                        Alert.alert("Thành công", "Đã xoá!");
                        fetchResources(tabMap[activeTab]);
                    } catch(err) {
                        Alert.alert("Lỗi", "Không thể xoá");
                    }
                } 
            }
        ])
    };

    const pickVideoFile = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            setFormVideoFileToUpload(asset);
            setFormVideoUri(asset.uri);
            if (asset.duration) {
                // Convert to seconds
                const durationSeconds = Math.floor(asset.duration / 1000);
                setFormVideoDuration(String(durationSeconds));
            }
        }
    };

    const handleSave = async () => {
        if (!formTitle) {
            Alert.alert("Lỗi", "Tiêu đề không được để trống");
            return;
        }

        const reqType = tabMap[activeTab];

        if ((reqType === 'video' || reqType === 'podcast') && !formVideoUri && !isEditing) {
            Alert.alert("Lỗi", `Vui lòng tải lên ${reqType} file.`);
            return;
        }

        try {
            setSaving(true);
            const formData = new FormData();
            formData.append('title', formTitle);
            formData.append('author', formAuthor);
            formData.append('type', reqType);
            formData.append('content', formContent);
            formData.append('description', formDescription);
            formData.append('moodLevel', Number(formMood));
            formData.append('is_active', "true");

            const metadataObj = { author: formAuthor };
            if (formVideoDuration) {
                metadataObj.duration_seconds = Number(formVideoDuration);
            }
            formData.append('metadata', JSON.stringify(metadataObj));

            if (formVideoFileToUpload) {
                const filename = formVideoFileToUpload.uri.split('/').pop() || 'video.mp4';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `video/${match[1]}` : 'video/mp4';

                formData.append('video', {
                    uri: formVideoFileToUpload.uri,
                    name: filename,
                    type: type
                });
            }

            if (isEditing) {
                await api.put(`/admin/healing-content/${formId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 60000 // up to 1m for large uploads
                });
                Alert.alert("Thành công", "Cập nhật thành công!");
            } else {
                await api.post(`/admin/healing-content`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 60000
                });
                Alert.alert("Thành công", "Thêm mới thành công!");
            }

            setModalVisible(false);
            fetchResources(reqType);
        } catch (error) {
            console.error(error);
            Alert.alert("Lỗi", error.response?.data?.message || "Lỗi khi lưu");
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <Text style={styles.mainTitle}>Resource Mgmt</Text>
                    <Text style={styles.mainSubtitle}>Quản lý dữ liệu trị liệu Healing Content</Text>
                </View>

                <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
                    <LinearGradient
                        colors={[theme.colors.primary, theme.colors.primaryContainer]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradient}
                    >
                        <MaterialIcons name="add" size={24} color="#fff" />
                        <Text style={styles.addButtonText}>Add</Text>
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

                {/* Resource List */}
                {loading ? (
                    <ActivityIndicator size="large" color={theme.colors.primary} style={{marginTop: 30}} />
                ) : (
                    <View style={styles.list}>
                        {resources.length === 0 ? (
                            <Text style={{textAlign: 'center', opacity: 0.5, marginTop: 20}}>Trống.</Text>
                        ) : (
                            resources.map(item => (
                                <ResourceCard 
                                    key={item._id} 
                                    item={item} 
                                    onView={handleViewPress}
                                    onEdit={handleEditPress} 
                                    onDelete={handleDeletePress} 
                                />
                            ))
                        )}
                    </View>
                )}
            </ScrollView>

            <AdminBottomNavBar navigation={navigation} activeTab="Content" />

            {/* DETAIL VIEW MODAL */}
            <Modal visible={detailVisible} transparent animationType="fade">
                <View style={[styles.modalOverlay, {justifyContent: 'center', alignItems: 'center'}]}>
                    <View style={styles.detailCard}>
                        {selectedDetail && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.modalHeaderRow}>
                                    <Text style={[styles.modalTitle, {color: '#005a80'}]}>Chi tiết {activeTab.slice(0, -1)}</Text>
                                    <TouchableOpacity onPress={() => setDetailVisible(false)} style={styles.closeBtn}>
                                        <MaterialIcons name="close" size={24} color="#666" />
                                    </TouchableOpacity>
                                </View>
                                
                                <Text style={styles.detailTitle}>{selectedDetail.title}</Text>
                                
                                <View style={{flexDirection: 'row', gap: 10, marginVertical: 10}}>
                                    <View style={styles.moodBadge}>
                                        <Text style={styles.moodText}>Tác giả: {selectedDetail.author || selectedDetail.metadata?.author || "Ẩn danh"}</Text>
                                    </View>
                                    <View style={[styles.moodBadge, {backgroundColor: '#d1fae5'}]}>
                                        <Text style={[styles.moodText, {color: '#065f46'}]}>Mood Level: {selectedDetail.moodLevel}</Text>
                                    </View>
                                    <View style={[styles.moodBadge, {backgroundColor: selectedDetail.is_active ? '#d1fae5' : '#f3f4f6'}]}>
                                        <Text style={[styles.moodText, {color: selectedDetail.is_active ? '#065f46' : '#6b7280'}]}>{selectedDetail.is_active ? 'Active' : 'Draft'}</Text>
                                    </View>
                                </View>

                                {(selectedDetail.type === 'video' || selectedDetail.type === 'podcast') && selectedDetail.videoUrl && (
                                    <View style={{marginTop: 10, marginBottom: 20}}>
                                        <Video
                                            source={{ uri: selectedDetail.videoUrl }}
                                            style={{ width: '100%', height: 200, borderRadius: 12, backgroundColor: '#000' }}
                                            useNativeControls
                                            resizeMode={ResizeMode.CONTAIN}
                                            isLooping={false}
                                        />
                                        {selectedDetail.metadata?.duration_seconds && (
                                            <Text style={{fontSize: 12, color: '#666', marginTop: 8}}>Thời lượng: {selectedDetail.metadata.duration_seconds} giây</Text>
                                        )}
                                    </View>
                                )}

                                {selectedDetail.type === 'quote' ? (
                                    <Text style={styles.detailContentText}>"{selectedDetail.content}"</Text>
                                ) : (
                                    <View>
                                        <Text style={{fontWeight: '700', marginBottom: 8, fontSize: 16}}>Mô tả:</Text>
                                        <Text style={styles.detailContentText}>{selectedDetail.description || selectedDetail.content || "Không có nội dung mô tả."}</Text>
                                    </View>
                                )}

                                <TouchableOpacity 
                                    style={[styles.submitBtn, {backgroundColor: '#e2f2ff', marginTop: 30}]} 
                                    onPress={() => setDetailVisible(false)}
                                >
                                    <Text style={[styles.submitBtnText, {color: '#005a80'}]}>Đóng Chi Tiết</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>

            {/* EDIT/ADD MODAL */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeaderRow}>
                            <Text style={styles.modalTitle}>{isEditing ? "Chỉnh sửa" : "Thêm"} {activeTab}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                                <MaterialIcons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
                            <Text style={styles.inputLabel}>Tiêu đề (Bắt buộc):</Text>
                            <TextInput style={styles.modalInput} value={formTitle} onChangeText={setFormTitle} />

                            <Text style={styles.inputLabel}>Tác giả:</Text>
                            <TextInput style={styles.modalInput} value={formAuthor} onChangeText={setFormAuthor} />

                            <Text style={styles.inputLabel}>Mức độ cảm xúc (Mood Level 1-5):</Text>
                            <TextInput style={styles.modalInput} value={formMood} onChangeText={setFormMood} keyboardType="numeric" />

                            {activeTab === 'Quotes' ? (
                                <>
                                    <Text style={styles.inputLabel}>Nội dung Quote (Trích dẫn):</Text>
                                    <TextInput style={[styles.modalInput, { height: 100, textAlignVertical: 'top' }]} value={formContent} onChangeText={setFormContent} multiline />
                                </>
                            ) : (
                                <>
                                    <Text style={styles.inputLabel}>Mô tả chi tiết:</Text>
                                    <TextInput style={[styles.modalInput, { height: 80, textAlignVertical: 'top' }]} value={formDescription} onChangeText={setFormDescription} multiline />
                                    
                                    <View style={{ marginTop: 16 }}>
                                        <Text style={styles.inputLabel}>File {(activeTab === 'Videos' ? 'Video' : 'Podcast')} {(!isEditing && '(Bắt buộc)')}</Text>
                                        {formVideoUri ? (
                                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10}}>
                                                <MaterialIcons name="check-circle" size={24} color={theme.colors.primary} />
                                                <Text style={{flex: 1, color: theme.colors.primary, fontSize: 13}}>File đã được đính kèm {formVideoFileToUpload ? '(mới)' : '(cũ)'}</Text>
                                                <TouchableOpacity onPress={() => setFormVideoUri(null)}>
                                                    <Text style={{color: '#ba1a1a'}}>Xoá</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <TouchableOpacity style={styles.uploadBtn} onPress={pickVideoFile}>
                                                <MaterialIcons name="cloud-upload" size={24} color="#fff" />
                                                <Text style={styles.uploadBtnText}>Thêm tệp {(activeTab === 'Videos' ? 'Video' : 'Podcast')}</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    <Text style={styles.inputLabel}>Thời lượng (Giây):</Text>
                                    <TextInput style={styles.modalInput} value={formVideoDuration} onChangeText={setFormVideoDuration} keyboardType="numeric" placeholder="Tự động điền khi tải file..." />
                                </>
                            )}
                            
                            <TouchableOpacity style={[styles.submitBtn, saving && {opacity: 0.7}]} onPress={handleSave} disabled={saving}>
                                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Xác nhận & Lưu</Text>}
                            </TouchableOpacity>
                        </ScrollView>
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
        padding: 24,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerTitleRow: {
        flex: 1
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: theme.colors.onSurface,
        marginBottom: 8,
    },
    mainSubtitle: {
        fontSize: 12,
        color: theme.colors.onSurfaceVariant,
        lineHeight: 18,
    },
    addButton: {
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        ...theme.shadows.primary,
        marginLeft: 16
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 13,
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
    list: {
        gap: 16,
    },
    resourceCard: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 20,
        padding: 20,
        borderLeftWidth: 6,
        borderLeftColor: theme.colors.primary,
        ...theme.shadows.soft,
    },
    resourceHeader: {
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    resourceMain: {
        flex: 1,
        marginBottom: 12,
    },
    resourceTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.colors.onSurface,
        marginBottom: 4,
    },
    resourceSnippet: {
        fontSize: 12,
        color: theme.colors.onSurfaceVariant,
        lineHeight: 18,
        marginTop: 4,
    },
    authorRow: {
        marginLeft: 12,
    },
    authorAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.colors.surfaceContainer,
        alignItems: 'center',
        justifyContent: 'center',
    },
    authorInitials: {
        fontSize: 14,
        fontWeight: '800',
        color: theme.colors.primary,
    },
    resourceBadges: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    moodBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 99,
        backgroundColor: '#f5f5f5',
        gap: 6,
    },
    moodDot: {
        width: 6, height: 6, borderRadius: 3,
    },
    moodText: {
        fontSize: 10, fontWeight: '800', color: '#555'
    },
    statusBadge: {
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99,
    },
    statusText: {
        fontSize: 10, fontWeight: '800', letterSpacing: 0.5,
    },
    resourceActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    iconBtn: {
        flexDirection: 'row', alignItems: 'center', padding: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: theme.colors.surfaceContainerLow,
    },
    deleteBtn: {
        backgroundColor: theme.colors.errorContainer,
    },
    // Modals
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end'
    },
    detailCard: {
        backgroundColor: '#fff', width: '90%', maxHeight: '80%', padding: 24, borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10
    },
    detailTitle: {
        fontSize: 22, fontWeight: '800', color: '#333', marginBottom: 12, marginTop: 4, lineHeight: 30
    },
    detailContentText: {
        fontSize: 15, color: '#444', lineHeight: 24, fontStyle: 'italic'
    },
    modalContent: {
        backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, height: '85%'
    },
    modalHeaderRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20
    },
    modalTitle: {
        fontSize: 20, fontWeight: '800', color: theme.colors.primary
    },
    closeBtn: {
        backgroundColor: '#f5f5f5', padding: 6, borderRadius: 20
    },
    inputLabel: {
        fontSize: 13, fontWeight: '700', color: '#333', marginTop: 14, marginBottom: 8
    },
    modalInput: {
        backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 12, fontSize: 14, color: '#333'
    },
    uploadBtn: {
        backgroundColor: '#0c6780', padding: 14, borderRadius: 12, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center'
    },
    uploadBtnText: {
        color: '#fff', fontWeight: '700', fontSize: 14
    },
    submitBtn: {
        backgroundColor: theme.colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 30
    },
    submitBtnText: {
        color: '#fff', fontWeight: '800', fontSize: 16
    }
});
export default AdminResourceManagementScreen;
