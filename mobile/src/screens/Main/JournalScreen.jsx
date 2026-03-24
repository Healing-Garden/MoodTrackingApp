import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    StatusBar,
    Image,
    Dimensions,
    Alert,
    Modal
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { theme } from '../../theme';
import BottomNavBar from '../../components/common/BottomNavBar';
import logo from '../../../assets/images/logo.png';
import { aiApi } from '../../services/aiApi';
import api from '../../services/api';
import journalService from '../../services/journalService';
import { uploadToCloudinary } from '../../utils/cloudinary';

const { width } = Dimensions.get('window');

const MOODS = ["😊", "😢", "😡", "😠", "😐", "🙂", "🙃", "😍"];
const EMOTIONS = ['Happy', 'Sad', 'Anxious', 'Grateful', 'Peaceful', 'Energized', 'Overwhelmed', 'Hopeful'];

const JournalScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Write');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMood, setSelectedMood] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const [user, setUser] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [entries, setEntries] = useState([]);
    const [trashedEntries, setTrashedEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editingEntryId, setEditingEntryId] = useState(null);
    const [selectedEmotions, setSelectedEmotions] = useState([]);

    // New states for Advanced Features
    const [imagePreviews, setImagePreviews] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState(null);
    const [audioUri, setAudioUri] = useState(null);

    // States for In-place Editing
    const [expandingEntryId, setExpandingEntryId] = useState(null);
    const [expandingTitle, setExpandingTitle] = useState('');
    const [expandingContent, setExpandingContent] = useState('');
    const [expandingMood, setExpandingMood] = useState(null);
    const [expandingImagePreviews, setExpandingImagePreviews] = useState([]);
    const [expandingImageUrls, setExpandingImageUrls] = useState([]);
    const [expandingAudioUri, setExpandingAudioUri] = useState(null);

<<<<<<< HEAD
    // Security
    const [isPinModalVisible, setPinModalVisible] = useState(false);
    const [enteredPin, setEnteredPin] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [verifyingPin, setVerifyingPin] = useState(false);
=======
    // PIN Lock stuff
    const [pinModalVisible, setPinModalVisible] = useState(false);
    const [pinValue, setPinValue] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isAnalysingEmotions, setIsAnalysingEmotions] = useState(false);
>>>>>>> 613840b262bd2f9c3b181131beca9160cdfb4ebd

    React.useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get('/profile');
                setUser(res.data?.user || null);
            } catch (err) { }
        };
        loadProfile();
    }, []);

    React.useEffect(() => {
        if (activeTab !== 'Write') return;
        if (content.trim() || title.trim()) return;

        const timer = setTimeout(async () => {
            if (!content.trim() && !title.trim() && suggestedQuestions.length === 0 && user?._id) {
                try {
                    const moodLabel = selectedMood !== null ? MOODS[selectedMood] : '😊';
                    const res = await aiApi.getQuestions(user._id, moodLabel, 3, "vi");
                    if (res?.data?.success) {
                        setSuggestedQuestions(res.data?.data?.questions || []);
                    } else if (res?.data?.questions?.length) {
                        setSuggestedQuestions(res.data.questions);
                    }
                } catch (error) {
                    console.log("Failed to fetch questions", error);
                }
            }
        }, 3000); // 3 seconds delay for mobile
        return () => clearTimeout(timer);
    }, [activeTab, content, title, user, selectedMood, suggestedQuestions]);

    React.useEffect(() => {
        if (activeTab !== 'My Entries') return;
        if (!searchQuery.trim() || !user?._id) {
            setSearchResults(null);
            return;
        }

        const blurTimer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await aiApi.semanticSearch(user._id, searchQuery, 5);
                if (res?.data?.success && res.data?.data?.results) {
                    setSearchResults(res.data.data.results);
                }
            } catch (error) {
                console.log("Failed to perform semantic search", error);
            } finally {
                setIsSearching(false);
            }
        }, 800); // Debounce search

        return () => clearTimeout(blurTimer);
    }, [searchQuery, activeTab, user]);

    const fetchEntries = async () => {
        console.log("JournalScreen: fetchEntries called");
        setIsLoading(true);
        try {
            const data = await journalService.getAll();
            console.log("JournalScreen: entries fetched", data?.length);
            setEntries(data || []);
        } catch (error) {
            console.error("JournalScreen: fetchEntries failed", error);
            Alert.alert("Error", "Không thể tải danh sách nhật ký: " + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTrashedEntries = async () => {
        console.log("JournalScreen: fetchTrashedEntries called");
        setIsLoading(true);
        try {
            const data = await journalService.getDeleted();
            console.log("JournalScreen: trashed entries fetched", data?.length);
            setTrashedEntries(data || []);
        } catch (error) {
            console.error("JournalScreen: fetchTrashedEntries failed", error);
            Alert.alert("Error", "Không thể tải thùng rác: " + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyPin = async () => {
        if (!enteredPin || enteredPin.length !== 6) {
            Alert.alert("Error", "Please enter a valid 6-digit PIN.");
            return;
        }
        setVerifyingPin(true);
        try {
            await api.post('/user/app-lock/verify', { pin: enteredPin });
            setIsUnlocked(true);
            setPinModalVisible(false);
            setEnteredPin('');
            setActiveTab('My Entries');
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Invalid PIN");
        } finally {
            setVerifyingPin(false);
        }
    };

    React.useEffect(() => {
        if (activeTab === 'My Entries') {
            if (user?.appLockEnabled && !isUnlocked) {
                setPinModalVisible(true);
            } else {
                fetchEntries();
            }
        } else if (activeTab === 'Trash') {
            fetchTrashedEntries();
        }
    }, [activeTab, isUnlocked, user?.appLockEnabled]);

    const pickImage = async (isExpanding = false) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            if (isExpanding) {
                setExpandingImagePreviews(prev => [...prev, uri]);
            } else {
                setImagePreviews(prev => [...prev, uri]);
            }
        }
    };

    const startRecording = async () => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async (isExpanding = false) => {
        setIsRecording(false);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        if (isExpanding) {
            setExpandingAudioUri(uri);
        } else {
            setAudioUri(uri);
        }
        setRecording(null);
    };

    const handleSave = async (isExpanding = false) => {
        const currentTitle = isExpanding ? expandingTitle : title;
        const currentContent = isExpanding ? expandingContent : content;
        const currentMoodIdx = isExpanding ? expandingMood : selectedMood;
        const currentId = isExpanding ? expandingEntryId : editingEntryId;
        const currentPreviews = isExpanding ? expandingImagePreviews : imagePreviews;
        const currentAudioUri = isExpanding ? expandingAudioUri : audioUri;

        console.log("JournalScreen: handleSave called", { title: currentTitle, isExpanding });
        if (!currentTitle.trim() && !currentContent.trim()) {
            Alert.alert("Thông báo", "Vui lòng nhập tiêu đề hoặc nội dung");
            return;
        }

        setIsLoading(true);
        try {
            // Upload images to Cloudinary
            const uploadedUrls = await Promise.all(
                currentPreviews.map(uri => uri.startsWith('http') ? uri : uploadToCloudinary(uri))
            );

            // Upload voice note if exists
            let uploadedAudioUrl = null;
            if (currentAudioUri) {
                uploadedAudioUrl = await uploadToCloudinary(currentAudioUri);
            }

            const entryData = {
                title: currentTitle,
                text: currentContent,
                mood: currentMoodIdx !== null ? MOODS[currentMoodIdx] : '😐',
                energy_level: currentMoodIdx !== null ? [4, 1, 1, 2, 3, 4, 3, 5][currentMoodIdx] : 3,
                trigger_tags: selectedEmotions,
                images: uploadedUrls.filter(u => u !== null),
                voice_note_url: uploadedAudioUrl,
            };

            if (currentId) {
                console.log("JournalScreen: Updating entry", currentId);
                await journalService.update(currentId, entryData);
            } else {
                console.log("JournalScreen: Creating new entry");
                await journalService.create(entryData);
            }

            console.log("JournalScreen: Save success");

            if (isExpanding) {
                setExpandingEntryId(null);
            } else {
                // Reset form
                setTitle('');
                setContent('');
                setSelectedMood(null);
                setSelectedEmotions([]);
                setEditingEntryId(null);
                setImagePreviews([]);
                setAudioUri(null);
                setExpandingAudioUri(null);
                setActiveTab('My Entries');
            }
            fetchEntries();
        } catch (error) {
            console.error("JournalScreen: handleSave failed", error);
            Alert.alert("Error", "Không thể lưu nhật ký: " + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await journalService.softDelete(id);
            fetchEntries();
        } catch (error) {
            console.error("Failed to delete entry", error);
        }
    };

    const handleRestore = async (id) => {
        try {
            await journalService.restore(id);
            fetchTrashedEntries();
        } catch (error) {
            console.error("Failed to restore entry", error);
        }
    };

    const handlePermanentDelete = async (id) => {
        try {
            await journalService.permanentDelete(id);
            fetchTrashedEntries();
        } catch (error) {
            console.error("Failed to permanent delete entry", error);
        }
    };

    const handleEdit = (entry) => {
        setExpandingEntryId(entry._id || entry.id);
        setExpandingTitle(entry.title);
        setExpandingContent(entry.text || entry.content);
        const moodIdx = MOODS.indexOf(entry.mood);
        setExpandingMood(moodIdx !== -1 ? moodIdx : null);
        setExpandingImagePreviews(entry.images || []);
        setExpandingAudioUri(entry.voice_note_url || null);
        setSelectedEmotions(entry.trigger_tags || []);
        // No need to setActiveTab('Write') because we are doing in-place editing
    };

    const handleVerifyPin = async (enteredPin) => {
        try {
            const res = await api.post('/user/app-lock/verify', { pin: enteredPin });
            if (res.data?.success) {
                setIsUnlocked(true);
                setPinModalVisible(false);
                setPinValue('');
            } else {
                Alert.alert("Error", "Mã PIN không chính xác");
                setPinValue('');
            }
        } catch (error) {
            console.error("PIN verification failed", error);
            Alert.alert("Error", "Xác thực mã PIN thất bại: " + (error.response?.data?.message || error.message));
            setPinValue('');
        }
    };

    const handleAutoIdentifyEmotions = async () => {
        if (!content.trim()) {
            Alert.alert("Thông báo", "Vui lòng nhập nội dung để AI phân tích cảm xúc");
            return;
        }

        setIsAnalysingEmotions(true);
        try {
            const res = await aiApi.analyzeSentiment(content);
            if (res?.data?.success && res.data?.data?.emotions) {
                const aiEmotions = res.data.data.emotions.map(e => {
                    // Map AI labels to our EMOTIONS constant if needed (AI labels are lowercase)
                    const label = e.emotion.charAt(0).toUpperCase() + e.emotion.slice(1);
                    return EMOTIONS.includes(label) ? label : null;
                }).filter(e => e !== null);

                if (aiEmotions.length > 0) {
                    setSelectedEmotions(prev => {
                        const newSet = new Set([...prev, ...aiEmotions]);
                        return Array.from(newSet);
                    });
                    Alert.alert("AI Identified", `AI đã phát hiện những cảm xúc này: ${aiEmotions.join(', ')}`);
                } else {
                    Alert.alert("AI Notification", "AI không tìm thấy cảm xúc cụ thể nào trong danh sách hiện có.");
                }
            }
        } catch (error) {
            console.error("AI emotion analysis failed", error);
        } finally {
            setIsAnalysingEmotions(false);
        }
    };

    const renderWrite = () => (
        <View style={styles.writeContainer}>
            <View style={styles.editorCard}>
                <View style={styles.decorativeMoodBloom} />

                <TextInput
                    style={styles.journalTitleInput}
                    placeholder="Journal Title"
                    placeholderTextColor="#c0c9bb"
                    value={title}
                    onChangeText={setTitle}
                />

                <TextInput
                    style={styles.journalTextArea}
                    placeholder="Start your journey here, share your soul..."
                    placeholderTextColor="rgba(64, 73, 62, 0.6)"
                    multiline
                    textAlignVertical="top"
                    value={content}
                    onChangeText={setContent}
                />

                {audioUri && (
                    <View style={styles.voiceNoteIndicator}>
                        <MaterialIcons name="mic" size={20} color={theme.colors.primary} />
                        <Text style={styles.voiceNoteText}>Voice note recorded</Text>
                        <TouchableOpacity onPress={() => setAudioUri(null)}>
                            <MaterialIcons name="close" size={18} color={theme.colors.outline} />
                        </TouchableOpacity>
                    </View>
                )}

                {imagePreviews.length > 0 && (
                    <View style={styles.imagePreviewGrid}>
                        {imagePreviews.map((uri, idx) => (
                            <View key={idx} style={styles.imagePreviewItem}>
                                <Image source={{ uri }} style={styles.previewImage} />
                                <TouchableOpacity
                                    style={styles.removeImageBtn}
                                    onPress={() => setImagePreviews(prev => prev.filter((_, i) => i !== idx))}
                                >
                                    <MaterialIcons name="close" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                <View style={styles.editorToolbar}>
                    <View style={styles.toolbarLeft}>
                        <TouchableOpacity style={styles.toolbarBtn} onPress={() => pickImage(false)}>
                            <MaterialIcons name="image" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.toolbarBtn}
                            onPressIn={startRecording}
                            onPressOut={() => stopRecording(false)}
                        >
                            <MaterialIcons name="mic" size={24} color={isRecording ? "#ba1a1a" : theme.colors.primary} />
                        </TouchableOpacity>
                    </View>

                </View>
            </View>

            <View style={styles.feelingSection}>
                <View style={[styles.sectionTitleRow, { marginBottom: 16 }]}>
                    <MaterialIcons name="mood" size={24} color={theme.colors.primary} />
                    <Text style={styles.sectionTitle}>Current Feeling</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moodsRow}>
                    {MOODS.map((mood, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.moodItem, selectedMood === index && styles.activeMoodItem]}
                            onPress={() => setSelectedMood(index)}
                        >
                            <Text style={styles.moodEmoji}>{mood}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.emotionsSection}>
                <View style={[styles.sectionTitleRow, { marginBottom: 16, justifyContent: 'space-between' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name="label" size={24} color={theme.colors.secondary} />
                        <Text style={styles.sectionTitle}>Identify Emotions</Text>
                    </View>
                    <TouchableOpacity 
                        style={[styles.aiIdentifyBtn, isAnalysingEmotions && styles.aiIdentifyBtnLoading]} 
                        onPress={handleAutoIdentifyEmotions}
                        disabled={isAnalysingEmotions}
                    >
                        <MaterialIcons name="auto-fix-high" size={20} color={isAnalysingEmotions ? "#fff" : theme.colors.primary} />
                        <Text style={[styles.aiIdentifyBtnText, isAnalysingEmotions && { color: "#fff" }]}>
                            {isAnalysingEmotions ? 'Analyzing...' : 'Auto-Identify'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.emotionsGrid}>
                    {EMOTIONS.map((emotion) => {
                        const isSelected = selectedEmotions.includes(emotion);
                        return (
                            <TouchableOpacity 
                                key={emotion} 
                                style={[styles.emotionTag, isSelected && styles.activeEmotionTag]}
                                onPress={() => {
                                    setSelectedEmotions(prev => 
                                        prev.includes(emotion) 
                                            ? prev.filter(e => e !== emotion) 
                                            : [...prev, emotion]
                                    );
                                }}
                            >
                                <Text style={[styles.emotionTagText, isSelected && styles.activeEmotionTagText]}>
                                    {emotion}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <TouchableOpacity
                style={[styles.inlineSaveBtn, (!title.trim() && !content.trim()) && { opacity: 0.5 }]}
                onPress={() => handleSave(false)}
                disabled={!title.trim() && !content.trim() || isLoading}
            >
                <Text style={styles.inlineSaveBtnText}>{isLoading ? '...' : editingEntryId ? 'Update Entry' : 'Save Entry'}</Text>
            </TouchableOpacity>

            {/* <View style={styles.brandCard}>
                <View style={styles.brandContent}>
                    <Text style={styles.brandTitle}>Your Digital Sanctuary</Text>
                    <Text style={styles.brandDesc}>Every word you plant here grows into a more mindful version of yourself. Take your time, there's no rush in the garden.</Text>
                </View>
                <View style={styles.brandVisual}>
                    <MaterialIcons name="energy-savings-leaf" size={48} color="#fff" style={{ opacity: 0.6 }} />
                </View>
                <View style={styles.brandDecor1} />
                <View style={styles.brandDecor2} />
            </View> */}
        </View>
    );

    const renderEntries = () => (
        <View style={styles.entriesContainer}>
            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={24} color="rgba(113, 122, 109, 0.6)" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search your memories (AI Semantic)..."
                    placeholderTextColor="rgba(113, 122, 109, 0.5)"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {isSearching ? (
                <Text style={{ textAlign: 'center', marginTop: 20, color: theme.colors.primary }}>AI is searching your memories...</Text>
            ) : searchResults ? (
                searchResults.length > 0 ? (
                    searchResults.map((entry, idx) => (
                        <View key={idx} style={[styles.entryCard, entry.isAsymmetric && styles.asymmetricCard]}>
                            <View style={styles.entryHeader}>
                                <View>
                                    <Text style={styles.entryDate}>{(new Date(entry.metadata?.date)).toLocaleDateString() || "RECENT"}</Text>
                                    <Text style={styles.entryTitle}>{entry.metadata?.title || 'Journal Entry'}</Text>
                                </View>
                                <View style={styles.moodCircle}>
                                    <Text style={{ fontSize: 20 }}>{entry.metadata?.mood || "📝"}</Text>
                                </View>
                            </View>
                            <Text style={styles.entryExcerpt} numberOfLines={3}>
                                {entry.text}
                            </Text>
                            <Text style={{ fontSize: 10, color: theme.colors.primary, marginTop: 4 }}>
                                Match Score: {(entry.score * 100).toFixed(1)}%
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={{ textAlign: 'center', marginTop: 20, color: theme.colors.onSurfaceVariant }}>No matching entries found.</Text>
                )
            ) : (
                entries.map((entry) => (
                    <View key={entry._id || entry.id}>
                        {expandingEntryId === (entry._id || entry.id) ? (
                            <View style={[styles.entryCard, styles.expandedEditorCard]}>
                                <TextInput
                                    style={styles.inlineTitleInput}
                                    value={expandingTitle}
                                    onChangeText={setExpandingTitle}
                                    placeholder="Title"
                                />
                                <TextInput
                                    style={styles.inlineTextArea}
                                    value={expandingContent}
                                    onChangeText={setExpandingContent}
                                    multiline
                                    placeholder="Write something..."
                                />

                                {expandingAudioUri && (
                                    <View style={styles.voiceNoteIndicator}>
                                        <MaterialIcons name="mic" size={20} color={theme.colors.primary} />
                                        <Text style={styles.voiceNoteText}>Voice note recorded</Text>
                                        <TouchableOpacity onPress={() => setExpandingAudioUri(null)}>
                                            <MaterialIcons name="close" size={18} color={theme.colors.outline} />
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {expandingImagePreviews.length > 0 && (
                                    <View style={styles.imagePreviewGrid}>
                                        {expandingImagePreviews.map((uri, idx) => (
                                            <View key={idx} style={styles.imagePreviewItem}>
                                                <Image source={{ uri }} style={styles.previewImage} />
                                                <TouchableOpacity
                                                    style={styles.removeImageBtn}
                                                    onPress={() => setExpandingImagePreviews(prev => prev.filter((_, i) => i !== idx))}
                                                >
                                                    <MaterialIcons name="close" size={16} color="#fff" />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                <View style={styles.editorToolbar}>
                                    <View style={styles.toolbarLeft}>
                                        <TouchableOpacity style={styles.toolbarBtn} onPress={() => pickImage(true)}>
                                            <MaterialIcons name="image" size={24} color={theme.colors.primary} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.toolbarBtn}
                                            onPressIn={startRecording}
                                            onPressOut={() => stopRecording(true)}
                                        >
                                            <MaterialIcons name="mic" size={24} color={isRecording ? "#ba1a1a" : theme.colors.primary} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', gap: 8 }}>
                                        <TouchableOpacity
                                            style={[styles.inlineCancelBtn]}
                                            onPress={() => setExpandingEntryId(null)}
                                        >
                                            <Text style={styles.inlineCancelBtnText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.inlineSaveBtn]}
                                            onPress={() => handleSave(true)}
                                            disabled={isLoading}
                                        >
                                            <Text style={styles.inlineSaveBtnText}>{isLoading ? '...' : 'Update'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={[styles.entryCard, entry.isAsymmetric && styles.asymmetricCard]}
                                onPress={() => handleEdit(entry)}
                            >
                                <View style={styles.entryHeader}>
                                    <View>
                                        <Text style={styles.entryDate}>
                                            {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString().toUpperCase() : 'RECENT'}
                                        </Text>
                                        <Text style={styles.entryTitle}>{entry.title}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', gap: 12 }}>
                                        {entry.voice_note_url && (
                                            <MaterialIcons name="mic" size={22} color={theme.colors.primary} style={{ marginRight: 4 }} />
                                        )}
                                        <TouchableOpacity onPress={() => handleEdit(entry)}>
                                            <MaterialIcons name="edit" size={24} color={theme.colors.primary} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDelete(entry._id || entry.id)}>
                                            <MaterialIcons name="delete-outline" size={24} color="#ba1a1a" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.tagRow}>
                                    {entry.mood && (
                                        <View style={styles.moodCircle}>
                                            <Text style={{ fontSize: 20 }}>{entry.mood}</Text>
                                        </View>
                                    )}
                                    {entry.trigger_tags?.map(tag => (
                                        <View key={tag} style={[styles.tag, styles.mindfulnessTag]}>
                                            <Text style={styles.tagText}>{tag}</Text>
                                        </View>
                                    ))}
                                </View>

                                <Text style={styles.entryExcerpt} numberOfLines={3}>
                                    {entry.text || entry.content}
                                </Text>

                                {entry.images && entry.images.length > 0 && (
                                    <View style={styles.entryImageWrapper}>
                                        <Image source={{ uri: entry.images[0] }} style={styles.entryImage} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                )))}

        </View>
    );

    const renderTrash = () => (
        <View style={styles.trashContainer}>
            <View style={styles.trashInfoBanner}>
                <View style={styles.bannerIconBox}>
                    <MaterialIcons name="cleaning-services" size={20} color={theme.colors.primary} />
                </View>
                <Text style={styles.bannerText}>
                    Items in trash will be permanently deleted after 30 days to keep your sanctuary clear.
                </Text>
                <View style={styles.bannerDecor} />
            </View>

            {trashedEntries.map((item) => (
                <View key={item._id || item.id} style={[styles.trashCard, item.isUrgent && styles.urgentTrashCard]}>
                    <View style={styles.trashCardTop}>
                        <View style={[styles.trashBadge, item.isUrgent && styles.urgentBadge]}>
                            <Text style={styles.trashBadgeText}>TRASHED</Text>
                        </View>
                        <Text style={styles.trashDateText}>
                            {item.deletedAt ? new Date(item.deletedAt).toLocaleDateString() : 'Unknown date'}
                        </Text>
                    </View>
                    <Text style={styles.trashTitle}>{item.title}</Text>
                    <Text style={styles.trashContent} numberOfLines={2}>{item.text || item.content}</Text>
                    <View style={styles.trashActions}>
                        <TouchableOpacity style={styles.restoreBtn} onPress={() => handleRestore(item._id || item.id)}>
                            <MaterialIcons name="settings-backup-restore" size={18} color={theme.colors.primary} />
                            <Text style={styles.restoreBtnText}>Restore</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePermanentDelete(item._id || item.id)}>
                            <MaterialIcons name="delete-forever" size={22} color="rgba(186, 26, 26, 0.6)" />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* TOP BAR */}
            <BlurView intensity={80} style={styles.topBar}>
                <View style={styles.topBarLeft}>
                    <Text style={styles.appTitle}>Journal</Text>
                </View>
                <View style={styles.avatarContainer}>
                    <Image source={logo} style={styles.avatar} resizeMode="contain" />
                </View>
            </BlurView>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                {/* TABS NAVIGATION */}
                <View style={styles.tabsWrapper}>
                    <View style={styles.tabsInner}>
                        {['Write', 'My Entries', 'Trash'].map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.tabBtn, activeTab === tab && styles.activeTabBtn]}
                                onPress={() => {
                                    if (tab === 'My Entries' && user?.appLockEnabled && !isUnlocked) {
                                        setPinModalVisible(true);
                                    } else {
                                        setActiveTab(tab);
                                    }
                                }}
                            >
                                <Text style={[styles.tabBtnText, activeTab === tab && styles.activeTabBtnText]}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {activeTab === 'Write' && suggestedQuestions.length > 0 && !title && !content && (
                    <View style={styles.middleSuggestionsContainer}>
                        <View style={styles.suggestionsHeaderRow}>
                            <MaterialIcons name="lightbulb" size={18} color={theme.colors.primary} />
                            <Text style={styles.middleSuggestionsHeader}>✨ Writing Suggestions</Text>
                        </View>

                        {suggestedQuestions.slice(0, 3).map((q, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={styles.middleSuggestionItem}
                                onPress={() => setContent(prev => prev + (prev ? '\n' : '') + q)}
                            >
                                <Text style={styles.middleSuggestionText}>
                                    {idx + 1}. {q}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {activeTab === 'Write' && renderWrite()}
                {activeTab === 'My Entries' && renderEntries()}
                {activeTab === 'Trash' && renderTrash()}
            </ScrollView>

            {/* PIN Verification Modal */}
            <Modal visible={isPinModalVisible} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <MaterialIcons name="lock" size={48} color={theme.colors.primary} style={{ marginBottom: 16 }} />
                        <Text style={styles.modalTitle}>Enter App Lock PIN</Text>
                        <Text style={styles.modalSubtitle}>Please enter your 6-digit PIN to access your entries.</Text>
                        
                        <View style={styles.pinBoxesContainer}>
                            {[0, 1, 2, 3, 4, 5].map(i => (
                                <View key={i} style={[styles.pinBox, enteredPin.length === i && styles.pinBoxActive]}>
                                    <Text style={styles.pinBoxText}>{enteredPin[i] ? '•' : ''}</Text>
                                </View>
                            ))}
                            <TextInput
                                style={styles.hiddenInput}
                                keyboardType="numeric"
                                maxLength={6}
                                value={enteredPin}
                                onChangeText={(text) => setEnteredPin(text.replace(/[^0-9]/g, ''))}
                                autoFocus
                            />
                        </View>
                        
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.modalButtonCancel} onPress={() => {
                                setPinModalVisible(false);
                                setEnteredPin('');
                            }}>
                                <Text style={styles.modalButtonCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButtonSubmit} onPress={handleVerifyPin} disabled={verifyingPin}>
                                <Text style={styles.modalButtonSubmitText}>{verifyingPin ? 'Verifying...' : 'Unlock'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* PIN MODAL */}
            {pinModalVisible && (
                <View style={styles.pinModalOverlay}>
                    <BlurView intensity={95} style={styles.pinModalContent}>
                        <View style={styles.lockIconContainer}>
                            <MaterialIcons name="lock" size={48} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.pinModalTitle}>Security Lock</Text>
                        <Text style={styles.pinModalSubtitle}>Nhập mã PIN để xem nhật ký của bạn</Text>
                        
                        <View style={styles.pinDotsRow}>
                            {[...Array(4)].map((_, i) => (
                                <View 
                                    key={i} 
                                    style={[
                                        styles.pinDot, 
                                        pinValue.length > i && styles.pinDotFilled
                                    ]} 
                                />
                            ))}
                        </View>

                        <View style={styles.keypadContainer}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "back"].map((item, idx) => (
                                <TouchableOpacity 
                                    key={idx} 
                                    style={[styles.keypadBtn, item === "" && { opacity: 0 }]}
                                    onPress={() => {
                                        if (item === "") return;
                                        if (item === "back") {
                                            setPinValue(prev => prev.slice(0, -1));
                                        } else {
                                            const newVal = pinValue + item;
                                            if (newVal.length <= 4) {
                                                setPinValue(newVal);
                                                if (newVal.length === 4) {
                                                    handleVerifyPin(newVal);
                                                }
                                            }
                                        }
                                    }}
                                    disabled={item === ""}
                                >
                                    {item === "back" ? (
                                        <MaterialIcons name="backspace" size={24} color={theme.colors.onSurface} />
                                    ) : (
                                        <Text style={styles.keypadBtnText}>{item}</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity 
                            style={styles.cancelPinBtn}
                            onPress={() => {
                                setPinModalVisible(false);
                                setPinValue('');
                                setActiveTab('Write');
                            }}
                        >
                            <Text style={styles.cancelPinBtnText}>Quay lại</Text>
                        </TouchableOpacity>
                    </BlurView>
                </View>
            )}

            <BottomNavBar navigation={navigation} activeTab="Journal" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 24,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        ...theme.shadows.soft,
    },
    topBarLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuBtn: {
        padding: 8,
        borderRadius: 20,
    },
    appTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#064e3b',
        fontFamily: theme.fonts.headline,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(96, 165, 96, 0.3)',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    scrollContainer: {
        paddingTop: 140,
        paddingBottom: 160,
    },
    pageHeaderText: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    mainTitle: {
        fontSize: 40,
        fontWeight: '800',
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.headline,
        letterSpacing: -1,
    },
    subTitle: {
        fontSize: 16,
        color: 'rgba(64, 73, 62, 0.8)',
        marginTop: 4,
    },
    tabsWrapper: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    tabsInner: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surfaceContainerLow,
        padding: 6,
        borderRadius: 99,
    },
    tabBtn: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 99,
    },
    activeTabBtn: {
        backgroundColor: theme.colors.primaryContainer,
        ...theme.shadows.soft,
    },
    tabBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.onSurfaceVariant,
        fontFamily: theme.fonts.headline,
    },
    activeTabBtnText: {
        color: theme.colors.onPrimaryContainer,
    },
    // WRITE TAB
    writeContainer: {
        paddingHorizontal: 24,
        gap: 24,
    },
    editorCard: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: theme.borderRadius.lg,
        padding: 32,
        ...theme.shadows.soft,
        minHeight: 300,
    },
    decorativeMoodBloom: {
        position: 'absolute',
        top: -24,
        right: -24,
        width: 100,
        height: 100,
        backgroundColor: 'rgba(112, 93, 0, 0.1)',
        borderRadius: 50,
        transform: [{ scaleY: 1.5 }],
    },
    journalTitleInput: {
        fontSize: 32,
        fontWeight: '800',
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.headline,
        padding: 0,
        marginBottom: 24,
    },
    journalTextArea: {
        fontSize: 18,
        lineHeight: 28,
        color: theme.colors.onSurfaceVariant,
        padding: 0,
        minHeight: 150,
    },
    editorToolbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    toolbarLeft: {
        flexDirection: 'row',
        gap: 16,
    },
    toolbarBtn: {
        padding: 8,
    },
    inlineSaveBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.medium,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    inlineSaveBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    inlineCancelBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    inlineCancelBtnText: {
        color: theme.colors.onSurfaceVariant,
        fontWeight: '600',
        fontSize: 14,
    },
    voiceNoteIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(39, 107, 46, 0.05)',
        padding: 12,
        borderRadius: 12,
        marginTop: 16,
        gap: 8,
    },
    voiceNoteText: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
        fontWeight: '500',
    },
    imagePreviewGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 16,
    },
    imagePreviewItem: {
        width: 80,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    removeImageBtn: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
        padding: 2,
    },
    expandedEditorCard: {
        borderWidth: 2,
        borderColor: theme.colors.primaryContainer,
    },
    inlineTitleInput: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.onSurface,
        marginBottom: 12,
    },
    inlineTextArea: {
        fontSize: 16,
        lineHeight: 24,
        color: theme.colors.onSurfaceVariant,
        minHeight: 100,
    },
    suggestionsContainer: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: 'rgba(39, 107, 46, 0.05)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(39, 107, 46, 0.1)',
    },
    suggestionsHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 8,
    },
    suggestionPill: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    suggestionPillText: {
        fontSize: 12,
        color: theme.colors.onSurface,
    },
    feelingSection: {
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: theme.borderRadius.lg,
        padding: 16,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.onPrimaryContainer,
        fontFamily: theme.fonts.headline,
    },
    moodsRow: {
        gap: 16,
    },
    moodItem: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.soft,
    },
    activeMoodItem: {
        backgroundColor: theme.colors.surfaceContainerHighest,
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    moodEmoji: {
        fontSize: 24,
    },
    emotionsSection: {
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: theme.borderRadius.lg,
        padding: 16,
    },
    emotionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    emotionTag: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 99,
        ...theme.shadows.soft,
    },
    activeEmotionTag: {
        backgroundColor: theme.colors.primaryContainer,
    },
    emotionTagText: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.outline,
    },
    activeEmotionTagText: {
        color: theme.colors.onPrimaryContainer,
        fontWeight: '700',
    },
    brandCard: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.lg,
        padding: 40,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        overflow: 'hidden',
    },
    brandContent: {
        flex: 1,
        zIndex: 10,
    },
    brandTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        fontFamily: theme.fonts.headline,
        marginBottom: 16,
    },
    brandDesc: {
        fontSize: 16,
        lineHeight: 24,
        color: 'rgba(255,255,255,0.9)',
    },
    brandVisual: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    brandDecor1: {
        position: 'absolute',
        bottom: -40,
        left: -40,
        width: 120,
        height: 120,
        backgroundColor: 'rgba(171, 244, 167, 0.3)',
        borderRadius: 60,
        filter: 'blur(30px)',
    },
    brandDecor2: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 120,
        height: 120,
        backgroundColor: 'rgba(154, 225, 255, 0.2)',
        borderRadius: 60,
        filter: 'blur(30px)',
    },

    middleSuggestionsContainer: {
        marginHorizontal: 24,
        marginBottom: 16,
        padding: 16,
        backgroundColor: 'rgba(39, 107, 46, 0.05)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(39, 107, 46, 0.1)',
    },

    middleSuggestionsHeader: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.primary,
    },

    middleSuggestionItem: {
        marginTop: 8,
    },

    middleSuggestionText: {
        fontSize: 14,
        color: theme.colors.onSurface,
    },
    // ENTRIES TAB
    entriesContainer: {
        paddingHorizontal: 24,
        gap: 32,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceContainerHigh,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 10,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.onSurface,
    },
    entryCard: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: theme.borderRadius.lg,
        padding: 24,
        ...theme.shadows.soft,
    },
    asymmetricCard: {
        backgroundColor: theme.colors.surfaceContainerLow,
        flexDirection: 'row',
        gap: 20,
        padding: 32,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    entryDate: {
        fontSize: 11,
        fontWeight: '800',
        color: theme.colors.secondary,
        letterSpacing: 2,
        marginBottom: 4,
    },
    entryTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.onSurface,
    },
    moodCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.tertiaryContainer,
        alignItems: 'center',
        justifyContent: 'center',
    },
    peacefulBadge: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 99,
        ...theme.shadows.soft,
        position: 'absolute',
        top: -10,
        right: -10,
    },
    peacefulBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.secondary,
    },
    tagRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 16,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 99,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gratitudeTag: { backgroundColor: theme.colors.secondaryContainer },
    natureTag: { backgroundColor: theme.colors.surfaceContainer },
    mindfulnessTag: { backgroundColor: 'rgba(39, 107, 46, 0.1)' },
    libraryTag: { backgroundColor: theme.colors.tertiaryFixed },
    tagText: {
        fontSize: 11,
        fontWeight: '700',
        color: theme.colors.onSecondaryContainer,
        textAlign: 'center',
    },
    entryExcerpt: {
        fontSize: 15,
        lineHeight: 24,
        color: theme.colors.onSurfaceVariant,
        marginBottom: 20,
    },
    libraryExcerpt: {
        fontStyle: 'italic',
    },
    entryImageWrapper: {
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
    },
    entryImage: {
        width: '100%',
        height: '100%',
    },
    asymmetricVisual: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    libraryFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 10,
    },
    libraryLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(192, 201, 187, 0.2)',
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 0,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.tertiary,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.primary,
    },
    // TRASH TAB
    trashContainer: {
        paddingHorizontal: 24,
        gap: 24,
    },
    trashInfoBanner: {
        flexDirection: 'row',
        backgroundColor: 'rgba(202, 235, 198, 0.4)',
        padding: 24,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(39, 107, 46, 0.05)',
        alignItems: 'center',
        gap: 16,
        overflow: 'hidden',
    },
    bannerIconBox: {
        backgroundColor: 'rgba(39, 107, 46, 0.1)',
        padding: 8,
        borderRadius: 99,
    },
    bannerText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
        color: theme.colors.onSurfaceVariant,
    },
    bannerDecor: {
        position: 'absolute',
        top: -30,
        right: -30,
        width: 100,
        height: 100,
        backgroundColor: 'rgba(39, 107, 46, 0.05)',
        borderRadius: 50,
        transform: [{ rotate: '45deg' }],
    },
    trashCard: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        padding: 24,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.soft,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    urgentTrashCard: {
        opacity: 0.8,
    },
    trashCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    trashBadge: {
        backgroundColor: 'rgba(255, 218, 214, 0.5)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 99,
    },
    urgentBadge: {
        backgroundColor: 'rgba(255, 218, 214, 0.8)',
    },
    trashBadgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#93000a',
        textTransform: 'uppercase',
    },
    trashDateText: {
        fontSize: 12,
        fontWeight: '500',
        color: theme.colors.outline,
    },
    trashTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.onSurface,
        marginBottom: 8,
        fontFamily: theme.fonts.headline,
    },
    trashContent: {
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
        fontStyle: 'italic',
        lineHeight: 20,
        marginBottom: 24,
    },
    trashActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: theme.colors.surfaceContainer,
    },
    restoreBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    restoreBtnText: {
        fontSize: 14,
        fontWeight: '800',
        color: theme.colors.primary,
    },
    contextualFooter: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 16,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...theme.shadows.soft,
        borderWidth: 1,
        borderColor: 'rgba(192, 201, 187, 0.1)',
        zIndex: 10,
    },
    footerTools: {
        flexDirection: 'row',
        gap: 8,
    },
    toolBtn: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
    },
    saveBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 16,
        ...theme.shadows.primary,
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        fontFamily: theme.fonts.headline,
    },
    // EXTERNAL SUGGESTIONS STYLES
    externalSuggestionsContainer: {
        position: 'absolute',
        bottom: 180,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 16,
        borderRadius: 16,
        ...theme.shadows.soft,
        borderWidth: 1,
        borderColor: 'rgba(39, 107, 46, 0.1)',
        zIndex: 5,
    },
    suggestionsHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    externalSuggestionsHeader: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.primary,
        fontFamily: theme.fonts.headline,
    },
    suggestionsScrollContainer: {
        gap: 8,
    },
    externalSuggestionPill: {
        backgroundColor: 'rgba(39, 107, 46, 0.05)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(39, 107, 46, 0.15)',
        marginRight: 8,
    },
    externalSuggestionPillText: {
        fontSize: 13,
        color: theme.colors.onSurface,
        fontWeight: '500',
    },
    // New Styles
    aiIdentifyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(96, 165, 96, 0.1)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(96, 165, 96, 0.2)',
    },
    aiIdentifyBtnLoading: {
        backgroundColor: theme.colors.primary,
    },
    aiIdentifyBtnText: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.primary,
        fontFamily: theme.fonts.headline,
    },
    pinModalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pinModalContent: {
        width: width * 0.9,
        padding: 32,
        borderRadius: 40,
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    lockIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(96, 165, 96, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    pinModalTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.headline,
        marginBottom: 8,
    },
    pinModalSubtitle: {
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
        marginBottom: 32,
    },
    pinDotsRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 40,
    },
    pinDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: theme.colors.outline,
    },
    pinDotFilled: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    keypadContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16,
        width: '100%',
        marginBottom: 32,
    },
    keypadBtn: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: theme.colors.surfaceContainerLow,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keypadBtnText: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.onSurface,
    },
    cancelPinBtn: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    cancelPinBtnText: {
        color: theme.colors.primary,
        fontWeight: '700',
        fontSize: 14,
    },
});

export default JournalScreen;