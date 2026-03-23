import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    StyleSheet,
    StatusBar,
    Alert,
    ActivityIndicator
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import Voice from "@react-native-voice/voice";
import { useFocusEffect } from '@react-navigation/native';
import { theme } from "../../theme";
import BottomNavBar from "../../components/common/BottomNavBar";
import api from "../../services/api";

const MOODS = ["😊", "😢", "😡", "😠", "😐", "🙂", "🙃", "😍"];
const EMOTIONS = ["Happy", "Sad", "Anxious", "Grateful", "Peaceful", "Energized", "Overwhelmed", "Hopeful"];

const JournalScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState("entries"); // "write", "entries", "trash"
    const [entries, setEntries] = useState([]);
    const [trashEntries, setTrashEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Form states
    const [content, setContent] = useState("");
    const [selectedMood, setSelectedMood] = useState("😊");
    const [selectedEmotions, setSelectedEmotions] = useState([]);
    const [images, setImages] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [saving, setSaving] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadEntries();
            loadDeletedEntries();
            return () => { }
        }, [])
    );

    useEffect(() => {
        // Init Voice
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = onSpeechError;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const onSpeechResults = (e) => {
        if (e.value && e.value.length > 0) {
            setContent((prev) => prev ? prev + " " + e.value[0] : e.value[0]);
        }
    };

    const onSpeechError = (e) => {
        console.error("Speech error", e.error);
        setIsRecording(false);
        if (e.error?.message?.includes('not available') || e.error === undefined) {
            Alert.alert("Lỗi", "Tính năng này yêu cầu tải thư viện Native. Khi sử dụng Expo Go, hãy dùng biểu tượng Micro 🎤 trên bàn phím điện thoại của bạn để nhập bằng giọng nói nhé!");
        }
    };

    const startRecording = async () => {
        try {
            // Hiển thị alert nếu có khả năng đang dùng Expo Go
            setIsRecording(true);
            await Voice.start('vi-VN');
        } catch (e) {
            console.error(e);
            setIsRecording(false);
            Alert.alert("Lỗi", "Không thể chạy tính năng ghi âm trên Expo Go. Hãy dùng Micro trên bàn phím ảo thay thế!");
        }
    };

    const stopRecording = async () => {
        try {
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
        setIsRecording(false);
    };

    const loadEntries = async () => {
        setLoading(true);
        try {
            const res = await api.get('/journals');
            setEntries(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Failed to load journals:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadDeletedEntries = async () => {
        try {
            const res = await api.get('/journals/deleted');
            setTrashEntries(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Failed to load trash:", error);
        }
    };

    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            const maxAllowed = 3 - images.length;
            const selectedImages = result.assets.slice(0, maxAllowed).map(asset => asset.uri);
            if (images.length + result.assets.length > 3) {
                Alert.alert("Limit Reached", "You can upload a maximum of 3 images.");
            }
            setImages([...images, ...selectedImages]);
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const toggleEmotion = (emotion) => {
        if (selectedEmotions.includes(emotion)) {
            setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion));
        } else {
            setSelectedEmotions([...selectedEmotions, emotion]);
        }
    };

    const handleSaveEntry = async () => {
        if (!content.trim()) {
            Alert.alert("Empty Entry", "Please write something in your journal.");
            return;
        }

        setSaving(true);
        try {
            let formData = new FormData();
            formData.append('text', content);
            formData.append('title', content.substring(0, 30) + '...');
            formData.append('mood', selectedMood);
            selectedEmotions.forEach(e => formData.append('trigger_tags[]', e));

            images.forEach((imgUri, index) => {
                let filename = imgUri.split('/').pop();
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;
                formData.append('images', {
                    uri: imgUri,
                    name: filename,
                    type,
                });
            });

            await api.post('/journals', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            Alert.alert("Success", "Journal saved successfully!");
            setContent("");
            setImages([]);
            setSelectedEmotions([]);
            setSelectedMood("😊");
            setActiveTab("entries");
            loadEntries();
        } catch (error) {
            console.error("Save error:", error);
            Alert.alert("Error", "Could not save journal entry.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteEntry = async (id) => {
        Alert.alert(
            "Delete Journal",
            "Move this entry to trash?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/journals/${id}`);
                            loadEntries();
                            loadDeletedEntries();
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
            ]
        );
    };

    const filteredEntries = entries.filter((entry) =>
        (entry.text || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (entry.title || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.profileRow}>
                    <Image
                        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBz1wh155THxa5_MK-wkpRcOkhWwYI9RsHE3E8yq1hMgcJlJrEguJ2Uea0L43CZ4OervfoD41a2q9VJHTNgz3vCL2Wi5xAw5LobEKtdo9NgwKzV5vwiLkgD3J9ud9j7IVTJn0FWS6XTmf61vgpvv27sUU2kKz-mCaX6kBEtTEmhjAPeTXbG5U-z9Pl1peKIeT4Xt1VbixHw0SxIo3YA8mkIf24UsGVpzkQdc31Vimuoqh4U2mI1OES0w37WAnAO7881H-U8jaCDfc0" }}
                        style={styles.avatar}
                    />
                    <Text style={styles.logo}>Digital Sanctuary</Text>
                </View>

                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate("Settings")}>
                    <MaterialIcons name="settings" size={24} color="#064e3b" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

                {/* TITLE */}
                <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>My Journal</Text>
                    <Text style={styles.subtitle}>Reflecting on your garden's growth.</Text>
                </View>

                {/* TABS */}
                <View style={styles.tabs}>
                    <TouchableOpacity style={[styles.tab, activeTab === "write" && styles.tabActive]} onPress={() => setActiveTab("write")}>
                        <Text style={[styles.tabText, activeTab === "write" && styles.tabActiveText]}>Write</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tab, activeTab === "entries" && styles.tabActive]} onPress={() => setActiveTab("entries")}>
                        <Text style={[styles.tabText, activeTab === "entries" && styles.tabActiveText]}>My Entries</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tab, activeTab === "trash" && styles.tabActive]} onPress={() => setActiveTab("trash")}>
                        <Text style={[styles.tabText, activeTab === "trash" && styles.tabActiveText]}>Trash</Text>
                    </TouchableOpacity>
                </View>

                {/* SEARCH */}
                {activeTab === "entries" && (
                    <View style={styles.searchBox}>
                        <MaterialIcons name="search" size={22} color="#6b7280" />
                        <TextInput
                            placeholder="Search your memories..."
                            style={styles.searchInput}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                )}

                {/* CONTENT LIST */}
                {loading ? (
                    <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
                ) : (
                    <View style={{ paddingBottom: 100 }}>
                        {activeTab === "write" && (
                            <View style={styles.writeContainer}>
                                <TextInput
                                    style={styles.textarea}
                                    placeholder="Start your journey here, share your soul..."
                                    multiline
                                    value={content}
                                    onChangeText={setContent}
                                />
                                <Text style={styles.charCount}>{content.length} characters</Text>

                                {/* Mood */}
                                <Text style={styles.sectionHeading}>Feeling:</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodScroll}>
                                    {MOODS.map(m => (
                                        <TouchableOpacity key={m} onPress={() => setSelectedMood(m)} style={[styles.moodItem, selectedMood === m && styles.moodItemActive]}>
                                            <Text style={styles.moodText}>{m}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>

                                {/* Emotions */}
                                <Text style={styles.sectionHeading}>Emotions:</Text>
                                <View style={styles.emotionsContainer}>
                                    {EMOTIONS.map(e => (
                                        <TouchableOpacity key={e} onPress={() => toggleEmotion(e)} style={[styles.emotionChip, selectedEmotions.includes(e) && styles.emotionChipActive]}>
                                            <Text style={[styles.emotionText, selectedEmotions.includes(e) && styles.emotionTextActive]}>{e}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Images Preview */}
                                {images.length > 0 && (
                                    <View style={styles.imageGrid}>
                                        {images.map((uri, idx) => (
                                            <View key={idx} style={styles.imageWrapper}>
                                                <Image source={{ uri }} style={styles.previewImage} />
                                                <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(idx)}>
                                                    <MaterialIcons name="close" size={14} color="#fff" />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                {/* Tools & Save */}
                                <View style={styles.toolsRow}>
                                    <View style={{ flexDirection: "row", gap: 16 }}>
                                        <TouchableOpacity style={styles.toolBtn} onPress={handlePickImage}>
                                            <MaterialIcons name="image" size={22} color={theme.colors.primary} />
                                            <Text style={styles.toolText}>Images ({images.length}/3)</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.toolBtn} onPress={isRecording ? stopRecording : startRecording}>
                                            <MaterialIcons name={isRecording ? "mic-off" : "mic"} size={22} color={isRecording ? "#ba1a1a" : theme.colors.primary} />
                                            <Text style={[styles.toolText, isRecording && { color: "#ba1a1a" }]}>{isRecording ? "Recording..." : "Voice"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEntry} disabled={saving}>
                                        {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveText}>Save</Text>}
                                        <MaterialIcons name="save" size={16} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {activeTab === "entries" && filteredEntries.map((e) => (
                            <View key={e._id} style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <View>
                                        <Text style={styles.date}>{new Date(e.created_at).toLocaleDateString()}</Text>
                                        <Text style={styles.title}>{e.title}</Text>
                                    </View>
                                    <View style={styles.moodBlob}>
                                        <Text style={{ fontSize: 20 }}>{e.mood}</Text>
                                    </View>
                                </View>
                                {e.trigger_tags && e.trigger_tags.length > 0 && (
                                    <View style={styles.tagsRow}>
                                        {e.trigger_tags.map((tag, i) => (
                                            <View key={i} style={styles.tag}>
                                                <Text style={styles.tagText}>{tag}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                                <Text style={styles.content}>{e.text}</Text>
                                {e.images && e.images.length > 0 && (
                                    <Image source={{ uri: e.images[0] }} style={styles.image} />
                                )}
                                <TouchableOpacity style={styles.deleteInlineBtn} onPress={() => handleDeleteEntry(e._id)}>
                                    <MaterialIcons name="delete-outline" size={20} color="#ba1a1a" />
                                </TouchableOpacity>
                            </View>
                        ))}

                        {activeTab === "entries" && filteredEntries.length === 0 && (
                            <View style={styles.emptyContainer}>
                                <MaterialIcons name="menu-book" size={48} color={theme.colors.outline} />
                                <Text style={styles.emptyText}>No entries yet. Start writing your first entry!</Text>
                            </View>
                        )}

                        {activeTab === "trash" && trashEntries.map((e) => (
                            <View key={e._id} style={[styles.card, { opacity: 0.8 }]}>
                                <View style={styles.cardHeader}>
                                    <View>
                                        <Text style={styles.date}>Deleted {new Date(e.updated_at).toLocaleDateString()}</Text>
                                        <Text style={styles.title}>{e.title}</Text>
                                    </View>
                                </View>
                                <Text style={styles.content}>{e.text}</Text>
                                <View style={styles.trashActions}>
                                    <TouchableOpacity style={styles.restoreBtn} onPress={async () => {
                                        try { await api.patch(`/journals/${e._id}/restore`); loadDeletedEntries(); loadEntries(); } catch (err) { }
                                    }}>
                                        <MaterialIcons name="restore" size={18} color="#276b2e" />
                                        <Text style={styles.restoreText}>Restore</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.permDeleteBtn} onPress={async () => {
                                        try { await api.delete(`/journals/${e._id}/permanent`); loadDeletedEntries(); } catch (err) { }
                                    }}>
                                        <MaterialIcons name="delete-forever" size={20} color="#ba1a1a" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

            </ScrollView>

            {/* FAB */}
            {activeTab !== "write" && (
                <TouchableOpacity style={styles.fab} onPress={() => setActiveTab("write")}>
                    <LinearGradient colors={["#caa910", "#705d00"]} style={styles.fab}>
                        <MaterialIcons name="add" size={30} color="white" />
                    </LinearGradient>
                </TouchableOpacity>
            )}

            {/* BOTTOM NAVIGATION */}
            <BottomNavBar navigation={navigation} activeTab="Journal" />
        </View>
    )
}

export default JournalScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#EBFFE6" },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10 },
    profileRow: { flexDirection: "row", alignItems: "center" },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    logo: { fontSize: 20, fontWeight: "700" },
    iconBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
    pageHeader: { paddingHorizontal: 20, marginTop: 10 },
    pageTitle: { fontSize: 32, fontWeight: "800" },
    subtitle: { opacity: .6 },
    tabs: { flexDirection: "row", backgroundColor: "#d6f7d1", margin: 20, borderRadius: 30, padding: 4 },
    tab: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 30 },
    tabActive: { backgroundColor: "#60a560" },
    tabText: { fontSize: 13, fontWeight: "600", color: "#606e62" },
    tabActiveText: { color: "#fff", fontWeight: "700" },
    searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#e8f9e4", marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 10, marginBottom: 20 },
    searchInput: { flex: 1, padding: 12 },

    // Write Form
    writeContainer: { backgroundColor: "#fff", margin: 20, padding: 20, borderRadius: 16 },
    textarea: { height: 120, textAlignVertical: "top", fontSize: 16, color: "#333" },
    charCount: { textAlign: "right", fontSize: 11, color: "#888", marginBottom: 20 },
    sectionHeading: { fontSize: 14, fontWeight: "600", marginBottom: 10, color: "#444" },
    moodScroll: { flexDirection: "row", marginBottom: 20 },
    moodItem: { padding: 8, borderRadius: 8, marginRight: 8, backgroundColor: "#f5f5f5" },
    moodItemActive: { backgroundColor: "#e0f2e9", transform: [{ scale: 1.1 }] },
    moodText: { fontSize: 24 },
    emotionsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
    emotionChip: { backgroundColor: "#f0f0f0", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    emotionChipActive: { backgroundColor: theme.colors.primary },
    emotionText: { fontSize: 12, color: "#555" },
    emotionTextActive: { color: "#fff" },
    imageGrid: { flexDirection: "row", gap: 8, marginBottom: 20 },
    imageWrapper: { width: 60, height: 60, borderRadius: 8, overflow: "hidden" },
    previewImage: { width: "100%", height: "100%" },
    removeImageBtn: { position: "absolute", top: 2, right: 2, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 10, padding: 2 },
    toolsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderColor: "#eee", paddingTop: 16 },
    toolBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
    toolText: { fontSize: 12, fontWeight: "500", color: theme.colors.primary },
    saveBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: theme.colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
    saveText: { color: "#fff", fontWeight: "600", fontSize: 13 },

    // Entry Card
    card: { backgroundColor: "#fff", marginHorizontal: 20, marginBottom: 20, padding: 20, borderRadius: 16 },
    cardHeader: { flexDirection: "row", justifyContent: "space-between" },
    date: { fontSize: 11, fontWeight: "700", opacity: .6 },
    title: { fontSize: 18, fontWeight: "700", marginTop: 4 },
    moodBlob: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#eff9f0", justifyContent: "center", alignItems: "center" },
    tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginVertical: 10 },
    tag: { backgroundColor: "#9ae1ff", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    tagText: { fontSize: 11, fontWeight: "700", color: "#005a80" },
    content: { opacity: .7, marginBottom: 12, fontSize: 14, lineHeight: 20 },
    image: { width: "100%", height: 160, borderRadius: 12, marginBottom: 10 },
    deleteInlineBtn: { flexDirection: "row", alignSelf: "flex-end", marginTop: 8 },

    // Empty state
    emptyContainer: { alignItems: "center", paddingVertical: 40 },
    emptyText: { color: theme.colors.outline, marginTop: 16 },

    // Trash
    trashActions: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderColor: "#eee", paddingTop: 12, marginTop: 12 },
    restoreBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
    restoreText: { color: "#276b2e", fontWeight: "700", fontSize: 13 },
    permDeleteBtn: { padding: 4 },

    fab: { position: "absolute", right: 20, bottom: 100, width: 64, height: 64, borderRadius: 32, justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 }
});