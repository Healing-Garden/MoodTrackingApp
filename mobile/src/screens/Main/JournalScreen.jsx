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
    Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { theme } from '../../theme';
import BottomNavBar from '../../components/common/BottomNavBar';
import logo from '../../../assets/images/logo.png';
import { aiApi } from '../../services/aiApi';
import api from '../../services/api';

const { width } = Dimensions.get('window');

const MOODS = ["😊", "😢", "😡", "😠", "😐", "🙂", "🙃", "😍"];

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

    const entries = [
        {
            id: 1,
            date: "October 24, 2023",
            title: "The Morning Dew",
            tags: ["Gratitude", "Nature"],
            content: "Today the garden felt particularly vibrant. I spent thirty minutes just watching the sun hit the hydrangea petals. It reminded me that growth is often silent but certain...",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDllPwbkrifogq-y4jjgPMVxmkpY3iy_aizhGgvjPmUGpzxwMXeYOSqPewYedwq8NtMw9VXULhBTSdiayueg4QnZBGojxU45hmrlx5wppLLpzaq4CmfQxsPqvjRnqNm1_t1C-oLayDSMVUIXJ77SKpvueBo4uSKS0pE2EOSi7cTDTH-IjBUpxg0WySLCDrDlD8ZoGWFbsyymlo5gGubcYKL9e2eI961z93hNjQaSEsbF8Qt0knme2-8faqyAAxwZUbf3wGSkFr5dTs",
            mood: "🌞"
        },
        {
            id: 2,
            date: "October 21, 2023",
            title: "Finding Stillness in Storms",
            tags: ["Mindfulness"],
            content: "When the rain started, I felt a surge of anxiety. But then I realized the garden needs the rain just as much as the sun. I practiced deep breathing for 10 minutes...",
            moodChar: "Peaceful",
            isAsymmetric: true
        },
        {
            id: 3,
            date: "October 19, 2023",
            title: "Reflections on 'The Hidden Life of Trees'",
            content: "\"Trees are social beings. They share food with their own species and sometimes even nourish their competitors.\" This book has completely changed how I walk through the park...",
            tags: ["Library"],
            isLibrary: true
        }
    ];

    const trashedEntries = [
        {
            id: 'T1',
            title: "Morning Reflection on Growth",
            content: "\"I felt like a seedling pushing through the soil today. The weight of expectations was heavy, but the sunlight felt...\"",
            deleted: "Deleted Oct 12",
            remain: "24 days remaining"
        },
        {
            id: 'T2',
            title: "Unspoken Storm Clouds",
            content: "\"Sometimes the silence is louder than the rain. I'm trying to find where the tension lives in my body and just let it...\"",
            deleted: "Deleted Oct 04",
            remain: "12 days remaining"
        },
        {
            id: 'T3',
            title: "Draft: The River Path",
            content: "\"Walking by the creek helped me realize that life doesn't always have to be a straight line. The curves are where...\"",
            deleted: "Deleted Sep 22",
            remain: "2 days remaining",
            isUrgent: true
        }
    ];

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
                    placeholder="Share your thoughts..."
                    placeholderTextColor="rgba(64, 73, 62, 0.6)"
                    multiline
                    numberOfLines={8}
                    textAlignVertical="top"
                    value={content}
                    onChangeText={setContent}
                />
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
                <View style={[styles.sectionTitleRow, { marginBottom: 16 }]}>
                    <MaterialIcons name="label" size={24} color={theme.colors.secondary} />
                    <Text style={styles.sectionTitle}>Identify Emotions</Text>
                </View>
                <View style={styles.emotionsGrid}>
                    {['Happy', 'Sad', 'Anxious', 'Grateful', 'Peaceful', 'Energized', 'Overwhelmed', 'Hopeful'].map((emotion) => (
                        <TouchableOpacity key={emotion} style={[styles.emotionTag, emotion === 'Happy' && styles.activeEmotionTag]}>
                            <Text style={[styles.emotionTagText, emotion === 'Happy' && styles.activeEmotionTagText]}>{emotion}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.brandCard}>
                <View style={styles.brandContent}>
                    <Text style={styles.brandTitle}>Your Digital Sanctuary</Text>
                    <Text style={styles.brandDesc}>Every word you plant here grows into a more mindful version of yourself. Take your time, there's no rush in the garden.</Text>
                </View>
                <View style={styles.brandVisual}>
                    <MaterialIcons name="energy-savings-leaf" size={48} color="#fff" style={{ opacity: 0.6 }} />
                </View>
                <View style={styles.brandDecor1} />
                <View style={styles.brandDecor2} />
            </View>
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
                    <View key={entry.id} style={[styles.entryCard, entry.isAsymmetric && styles.asymmetricCard]}>
                    <View style={styles.entryHeader}>
                        <View>
                            <Text style={styles.entryDate}>{entry.date.toUpperCase()}</Text>
                            <Text style={styles.entryTitle}>{entry.title}</Text>
                        </View>
                        {entry.mood && (
                            <View style={styles.moodCircle}>
                                <Text style={{ fontSize: 20 }}>{entry.mood}</Text>
                            </View>
                        )}
                        {entry.moodChar && (
                            <View style={styles.peacefulBadge}>
                                <Text style={styles.peacefulBadgeText}>{entry.moodChar}</Text>
                            </View>
                        )}
                        {entry.isLibrary && (
                            <MaterialIcons name="more-horiz" size={24} color={theme.colors.onSurfaceVariant} />
                        )}
                    </View>

                    <View style={styles.tagRow}>
                        {entry.tags?.map(tag => (
                            <View key={tag} style={[styles.tag, tag === 'Gratitude' ? styles.gratitudeTag : tag === 'Nature' ? styles.natureTag : tag === 'Mindfulness' ? styles.mindfulnessTag : styles.libraryTag]}>
                                <Text style={[styles.tagText, tag === 'Library' && { color: theme.colors.onTertiaryFixed }]}>{tag}</Text>
                            </View>
                        ))}
                    </View>

                    <Text style={[styles.entryExcerpt, entry.isLibrary && styles.libraryExcerpt]} numberOfLines={entry.isAsymmetric ? 3 : 2}>
                        {entry.content}
                    </Text>

                    {entry.image && (
                        <View style={styles.entryImageWrapper}>
                            <Image source={{ uri: entry.image }} style={styles.entryImage} />
                            <BlurView intensity={20} style={StyleSheet.absoluteFill} />
                        </View>
                    )}

                    {entry.isAsymmetric && (
                        <View style={styles.asymmetricVisual}>
                            <MaterialIcons name="air" size={48} color={theme.colors.secondary} />
                        </View>
                    )}

                    {entry.isLibrary && (
                        <View style={styles.libraryFooter}>
                            <View style={styles.libraryLine} />
                            <MaterialIcons name="auto-stories" size={18} color={theme.colors.onSurfaceVariant} />
                        </View>
                    )}
                </View>
            )))}

            <TouchableOpacity style={styles.fab}>
                <MaterialIcons name="add" size={32} color="#fff" />
            </TouchableOpacity>
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
                <View key={item.id} style={[styles.trashCard, item.isUrgent && styles.urgentTrashCard]}>
                    <View style={styles.trashCardTop}>
                        <View style={[styles.trashBadge, item.isUrgent && styles.urgentBadge]}>
                            <Text style={styles.trashBadgeText}>{item.remain}</Text>
                        </View>
                        <Text style={styles.trashDateText}>{item.deleted}</Text>
                    </View>
                    <Text style={styles.trashTitle}>{item.title}</Text>
                    <Text style={styles.trashContent} numberOfLines={2}>{item.content}</Text>
                    <View style={styles.trashActions}>
                        <TouchableOpacity style={styles.restoreBtn}>
                            <MaterialIcons name="settings-backup-restore" size={18} color={theme.colors.primary} />
                            <Text style={styles.restoreBtnText}>Restore</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
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
                                onPress={() => setActiveTab(tab)}
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

            {/* CONTEXTUAL ACTIONS FOR WRITE TAB */}
            {activeTab === 'Write' && (
                <View style={styles.contextualFooter}>
                    <View style={styles.footerTools}>
                        <TouchableOpacity style={styles.toolBtn}>
                            <MaterialIcons name="image" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.toolBtn}>
                            <MaterialIcons name="mic" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.saveBtn}>
                        <Text style={styles.saveBtnText}>Save Entry</Text>
                    </TouchableOpacity>
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
        padding: 24,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.onPrimaryContainer,
        fontFamily: theme.fonts.headline,
    },
    moodsRow: {
        gap: 16,
    },
    moodItem: {
        width: 60,
        height: 60,
        borderRadius: 30,
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
        fontSize: 32,
    },
    emotionsSection: {
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: theme.borderRadius.lg,
        padding: 24,
    },
    emotionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    emotionTag: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 99,
        ...theme.shadows.soft,
    },
    activeEmotionTag: {
        backgroundColor: theme.colors.primaryContainer,
    },
    emotionTagText: {
        fontSize: 14,
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
        gap: 8,
        marginBottom: 16,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 99,
    },
    gratitudeTag: { backgroundColor: theme.colors.secondaryContainer },
    natureTag: { backgroundColor: theme.colors.surfaceContainer },
    mindfulnessTag: { backgroundColor: 'rgba(39, 107, 46, 0.1)' },
    libraryTag: { backgroundColor: theme.colors.tertiaryFixed },
    tagText: {
        fontSize: 11,
        fontWeight: '700',
        color: theme.colors.onSecondaryContainer,
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
    }
});

export default JournalScreen;