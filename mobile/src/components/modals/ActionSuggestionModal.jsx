import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    Image,
    Platform,
    Alert,
    Linking,
    Animated,
    Easing,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { theme } from '../../theme';
import { aiApi } from '../../services/aiApi';

const { width, height } = Dimensions.get('window');

const ConfettiParticle = ({ delay }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 2000 + Math.random() * 1000,
                    easing: Easing.bezier(0.41, 0, 0.58, 1),
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    const rotation = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '720deg'],
    });

    const translateX = animatedValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
    });

    const translateY = animatedValue.interpolate({
        inputRange: [0, 0.2, 1],
        outputRange: [height * 0.45, height * 0.1, height * 1.2],
    });

    const opacity = animatedValue.interpolate({
        inputRange: [0, 0.8, 1],
        outputRange: [1, 1, 0],
    });

    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 6 + Math.random() * 6;

    return (
        <Animated.View
            style={[
                styles.confetti,
                {
                    backgroundColor: color,
                    width: size,
                    height: size,
                    transform: [
                        { translateY },
                        { translateX },
                        { rotate: rotation }
                    ],
                    opacity,
                    left: Math.random() * width * 0.8,
                }
            ]}
        />
    );
};

const ActionSuggestionModal = ({ isVisible, onClose, userId, mood }) => {
    const [phase, setPhase] = useState('list'); // 'list', 'execute', 'celebrate'
    const [loading, setLoading] = useState(false);
    const [actions, setActions] = useState([]);
    const [selectedAction, setSelectedAction] = useState(null);
    const [excludeIds, setExcludeIds] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [postMoodScore, setPostMoodScore] = useState(3);
    const [completedDuration, setCompletedDuration] = useState(0);

    useEffect(() => {
        if (isVisible && userId && phase === 'list' && actions.length === 0) {
            fetchSuggestions();
        }
    }, [isVisible, userId]);

    const fetchSuggestions = async (newExcludes = []) => {
        setLoading(true);
        try {
            const res = await aiApi.suggestActions(userId, mood, 3, newExcludes.length > 0 ? newExcludes : excludeIds);
            if (res.data?.success) {
                setActions(res.data.data.actions || []);
            }
        } catch (error) {
            console.log('Failed to fetch actions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleActionSelect = (action) => {
        setSelectedAction(action);
        setStartTime(Date.now());
        setPhase('execute');
    };

    const handleCompleteAction = () => {
        const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
        setCompletedDuration(duration);
        setPhase('celebrate');
    };

    const handleSkip = async () => {
        try {
            await aiApi.logSkip(userId, mood, actions.map(a => a.id), 'user_skipped');
        } catch (e) {}
        onClose();
    };

    const handleShowMore = () => {
        const currentIds = actions.map(a => a.id);
        const updatedExcludes = [...excludeIds, ...currentIds];
        setExcludeIds(updatedExcludes);
        fetchSuggestions(updatedExcludes);
    };

    const submitCompletion = async (skipMood = false) => {
        setLoading(true);
        try {
            await aiApi.logActionCompletion(
                userId,
                selectedAction.id,
                completedDuration,
                mood,
                'suggestion',
                skipMood ? undefined : postMoodScore
            );
            Alert.alert("Success", "Action completed! Keep up the good work.");
            handleResetAndClose();
        } catch (error) {
            console.log('Failed to log completion:', error);
            handleResetAndClose();
        } finally {
            setLoading(false);
        }
    };

    const handleResetAndClose = () => {
        setPhase('list');
        setSelectedAction(null);
        setActions([]);
        setExcludeIds([]);
        onClose();
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'quote': return 'format-quote';
            case 'video': return 'play-circle-outline';
            case 'podcast': return 'headset';
            case 'article': return 'article';
            default: return 'lightbulb-outline';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'quote': return '#8b5cf6';
            case 'video': return '#3b82f6';
            case 'podcast': return '#10b981';
            default: return theme.colors.primary;
        }
    };

    const renderListView = () => (
        <View style={styles.content}>
            <View style={styles.header}>
                <Text style={styles.title}>🌱 Mood Boosters</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <MaterialIcons name="close" size={24} color="#9ca3af" />
                </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>
                Feeling {mood || 'neutral'}? Try these personalized activities to find your balance.
            </Text>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={styles.loaderText}>Personalizing suggestions...</Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} style={styles.actionList}>
                    {actions.length === 0 ? (
                        <View style={styles.emptyContainer}>
                             <MaterialIcons name="spa" size={48} color="#e5e7eb" />
                             <Text style={styles.emptyText}>No suggestions right now. Take a deep breath.</Text>
                        </View>
                    ) : actions.map((action) => (
                        <TouchableOpacity
                            key={action.id}
                            style={styles.actionCard}
                            onPress={() => handleActionSelect(action)}
                        >
                            <View style={[styles.iconBox, { backgroundColor: getTypeColor(action.type) + '15' }]}>
                                <MaterialIcons name={getTypeIcon(action.type)} size={24} color={getTypeColor(action.type)} />
                            </View>
                            <View style={styles.actionInfo}>
                                <Text style={styles.actionTitle} numberOfLines={1}>{action.title}</Text>
                                <Text style={styles.actionDesc} numberOfLines={2}>{action.description}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#d1d5db" />
                        </TouchableOpacity>
                    ))}

                    <View style={styles.footerButtons}>
                        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
                            <Text style={styles.skipBtnText}>Maybe later</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.moreBtn} onPress={handleShowMore}>
                            <Text style={styles.moreBtnText}>Give me more</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}
        </View>
    );

    const renderExecuteView = () => (
        <View style={styles.content}>
            <View style={styles.header}>
                <View style={styles.typeBadge}>
                    <MaterialIcons name={getTypeIcon(selectedAction.type)} size={14} color={getTypeColor(selectedAction.type)} />
                    <Text style={[styles.typeBadgeText, { color: getTypeColor(selectedAction.type) }]}>
                        {selectedAction.type.toUpperCase()}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => setPhase('list')} style={styles.backBtn}>
                    <MaterialIcons name="arrow-back" size={24} color="#9ca3af" />
                </TouchableOpacity>
            </View>

            <Text style={styles.executeTitle}>{selectedAction.title}</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.executeScroll}>
                {selectedAction.type === 'video' && selectedAction.video_url && (
                    <TouchableOpacity 
                        style={styles.videoWrapper} 
                        onPress={() => Linking.openURL(selectedAction.video_url)}
                        activeOpacity={0.9}
                    >
                        {selectedAction.thumbnail ? (
                            <Image source={{ uri: selectedAction.thumbnail }} style={styles.videoThumbnail} />
                        ) : (
                            <View style={styles.videoPlaceholder}>
                                <MaterialIcons name="play-circle-outline" size={64} color="#fff" />
                            </View>
                        )}
                        <View style={styles.playOverlay}>
                            <View style={styles.playButton}>
                                <MaterialIcons name="play-arrow" size={32} color="#fff" />
                            </View>
                        </View>
                        <View style={styles.videoInfo}>
                            <Text style={styles.videoInfoText}>Watch on YouTube</Text>
                        </View>
                    </TouchableOpacity>
                )}

                {selectedAction.thumbnail && selectedAction.type !== 'video' && (
                    <Image source={{ uri: selectedAction.thumbnail }} style={styles.thumbnail} />
                )}

                <View style={styles.descriptionBox}>
                    <Text style={styles.contentText}>
                        {selectedAction.content || selectedAction.description}
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.executeFooter}>
                <TouchableOpacity style={styles.backOutlineBtn} onPress={() => setPhase('list')}>
                    <Text style={styles.backOutlineBtnText}>Go Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.finishBtnPrimary} onPress={handleCompleteAction}>
                    <MaterialIcons name="check-circle" size={20} color="#fff" />
                    <Text style={styles.finishBtnText}>I've Finished</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderCelebrateView = () => (
        <View style={[styles.content, styles.celebrateContent]}>
            <View style={styles.popperIcon}>
                <MaterialCommunityIcons name="party-popper" size={64} color="#f59e0b" />
            </View>
            <Text style={styles.celebrateTitle}>Great job!</Text>
            <Text style={styles.celebrateSubtitle}>
                You've completed "{selectedAction?.title}". How do you feel now?
            </Text>

            <View style={styles.ratingBox}>
                <Text style={styles.ratingLabel}>Rate your mood (1-5)</Text>
                <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => setPostMoodScore(star)}>
                            <Ionicons
                                name={postMoodScore >= star ? "star" : "star-outline"}
                                size={40}
                                color={postMoodScore >= star ? "#fbbf24" : "#d1d5db"}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                <Text style={styles.scoreText}>{postMoodScore}/5</Text>
            </View>

            <View style={styles.celebFooter}>
                <TouchableOpacity style={styles.skipMoodBtn} onPress={() => submitCompletion(true)}>
                    <Text style={styles.skipMoodText}>Skip reflection</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.finishBtn, { flex: 2 }]} onPress={() => submitCompletion(false)}>
                    <Text style={styles.finishBtnText}>Save my reflection</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={handleResetAndClose}
        >
            <View style={styles.overlay}>
                <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
                
                {phase === 'celebrate' && (
                    <View style={styles.fullScreenConfetti}>
                        {Array.from({ length: 60 }).map((_, i) => (
                            <ConfettiParticle key={i} delay={i * 30} />
                        ))}
                    </View>
                )}

                <View style={styles.modalPanel}>
                    {phase === 'list' && renderListView()}
                    {phase === 'execute' && renderExecuteView()}
                    {phase === 'celebrate' && renderCelebrateView()}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalPanel: {
        width: width * 0.9,
        maxHeight: height * 0.85,
        backgroundColor: '#fff',
        borderRadius: 32,
        padding: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.2,
                shadowRadius: 20,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    content: {
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif-medium',
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 24,
        lineHeight: 20,
    },
    closeBtn: {
        padding: 4,
    },
    backBtn: {
        padding: 4,
    },
    loaderContainer: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    loaderText: {
        marginTop: 16,
        color: '#9ca3af',
        fontSize: 14,
        fontWeight: '500',
    },
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        opacity: 0.5,
    },
    emptyText: {
        marginTop: 12,
        color: '#6b7280',
        textAlign: 'center',
        fontSize: 14,
    },
    actionList: {
        maxHeight: 450,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        padding: 16,
        borderRadius: 24,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    iconBox: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionInfo: {
        flex: 1,
        marginLeft: 16,
        marginRight: 8,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    actionDesc: {
        fontSize: 12,
        color: '#64748b',
        lineHeight: 18,
    },
    footerButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
        paddingBottom: 10,
    },
    skipBtn: {
        flex: 1,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
        backgroundColor: '#f1f5f9',
    },
    skipBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748b',
    },
    moreBtn: {
        flex: 1,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    moreBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e293b',
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 99,
        backgroundColor: '#f1f5f9',
        gap: 6,
    },
    typeBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    executeTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 20,
        marginTop: 12,
    },
    executeScroll: {
        maxHeight: 400,
    },
    videoWrapper: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000',
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 24,
    },
    videoThumbnail: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
    },
    videoPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1e293b',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(239, 68, 68, 0.9)', // YouTube Red
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    videoInfo: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    videoInfoText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    thumbnail: {
        width: '100%',
        height: 200,
        borderRadius: 24,
        marginBottom: 24,
    },
    descriptionBox: {
        backgroundColor: '#f8fafc',
        padding: 24,
        borderRadius: 24,
        marginBottom: 10,
    },
    contentText: {
        fontSize: 16,
        color: '#334155',
        lineHeight: 26,
    },
    executeFooter: {
        marginTop: 24,
        flexDirection: 'row',
        gap: 12,
    },
    backOutlineBtn: {
        flex: 1,
        height: 60,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backOutlineBtnText: {
        color: '#64748b',
        fontSize: 16,
        fontWeight: '700',
    },
    finishBtnPrimary: {
        flex: 2,
        height: 60,
        backgroundColor: theme.colors.primary,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    finishBtn: {
        height: 60,
        backgroundColor: theme.colors.primary,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    finishBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    celebrateContent: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    fullScreenConfetti: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 100,
        pointerEvents: 'none',
    },
    confetti: {
        position: 'absolute',
        borderRadius: 2,
    },
    popperIcon: {
        marginBottom: 16,
    },
    emoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    celebrateTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 12,
    },
    celebrateSubtitle: {
        fontSize: 15,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
        paddingHorizontal: 10,
    },
    ratingBox: {
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#f8fafc',
        padding: 24,
        borderRadius: 28,
        marginBottom: 40,
    },
    ratingLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 20,
    },
    starsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    scoreText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    celebFooter: {
        flexDirection: 'row',
        gap: 16,
        width: '100%',
    },
    skipMoodBtn: {
        flex: 1,
        height: 60,
        backgroundColor: '#f1f5f9',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipMoodText: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '600',
    }
});

export default ActionSuggestionModal;
