import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
    StatusBar,
    Dimensions,
    Animated,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { theme } from '../../theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';

const { width, height } = Dimensions.get('window');

// Local Gradients for Onboarding
const GRADIENTS = {
    primary: ['#276b2e', '#60a560'],
    secondary: ['#0c6780', '#09657f'],
    soft: ['#ebffe6', '#caebc6'],
};

const MOOD_OPTIONS = [
    { level: 1, emoji: '😢', label: 'Very Low', color: '#E76F51' },
    { level: 2, emoji: '😟', label: 'Low', color: '#F4A261' },
    { level: 3, emoji: '😐', label: 'Neutral', color: '#FFD166' },
    { level: 4, emoji: '😊', label: 'Good', color: '#74C69D' },
    { level: 5, emoji: '😄', label: 'Great', color: '#276B2E' },
];

const StepFourScreen = ({ navigation, route }) => {
    const { onboardingData, isDailyCheckIn } = route.params || { onboardingData: {}, isDailyCheckIn: false };

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // Q10 Options (Sleep Selection)
    const sleepOptions = [
        { label: '< 5h', value: 4 },
        { label: '5-6h', value: 5.5 },
        { label: '6-7h', value: 6.5 },
        { label: '7-8h', value: 7.5 },
        { label: '8-9h', value: 8.5 },
        { label: '> 9h', value: 10 },
    ];

    // Q11 Options (Energy) - Mapping labels to numeric levels for API
    const energyOptions = [
        { id: 'Exhausted', label: 'Exhausted', icon: 'battery-alert', color: '#E76F51', level: 2 },
        { id: 'Low', label: 'Low Energy', icon: 'battery-unknown', color: '#F4A261', level: 4 },
        { id: 'Normal', label: 'Balanced', icon: 'battery-std', color: '#FFD166', level: 6 },
        { id: 'Good', label: 'Energetic', icon: 'battery-charging-full', color: '#74C69D', level: 8 },
        { id: 'High', label: 'Powerful', icon: 'battery-full', color: '#276B2E', level: 10 },
    ];

    // Q12 Options (Focus)
    const focusLevelOptions = [
        'Very high',
        'Quite high',
        'Normal',
        'Easily distracted',
        'Very difficult to focus',
    ];

    const [selectedMood, setSelectedMood] = useState(onboardingData?.stressLevel ? (6 - onboardingData.stressLevel) : 3);
    const [selectedSleep, setSelectedSleep] = useState(7.5);
    const [selectedEnergy, setSelectedEnergy] = useState('');
    const [selectedFocus, setSelectedFocus] = useState('');
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFinish = async () => {
        if (!selectedEnergy || !selectedFocus || !selectedMood) {
            Alert.alert("Missing Info", "Please select your mood, energy, and focus levels.");
            return;
        }

        setIsSubmitting(true);
        try {
            const energyObj = energyOptions.find(e => e.id === selectedEnergy);
            const energyLevelVal = energyObj ? energyObj.level : 5;

            // 1. Prepare Check-in Payload
            const allowedTriggers = ["Family", "Work", "Health", "Relationships", "Friends", "Study", "Finance", "Sleep", "Social", "Self-care", "Other"];
            const selectedTriggers = Array.isArray(onboardingData?.negativeEmotionHandling)
                ? onboardingData.negativeEmotionHandling
                    .map((t) => (t || "").toString().trim())
                    .filter((t) => t && allowedTriggers.includes(t))
                : [];

            const checkInData = {
                mood: selectedMood,
                energy: energyLevelVal,
                note: note.trim() || undefined,
                triggers: selectedTriggers.length > 0 ? selectedTriggers : ["Other"],
                metadata: {
                    sleepHours: selectedSleep,
                    focusLevel: selectedFocus,
                }
            };

            // 2. Submit Daily Check-in
            await api.post('/user/checkins', checkInData);

            // 3. If in Onboarding Flow, mark Onboarding as complete
            if (!isDailyCheckIn) {
                const safeNegativeEmotionHandling = Array.isArray(onboardingData?.negativeEmotionHandling)
                    ? onboardingData.negativeEmotionHandling.join(', ')
                    : onboardingData?.negativeEmotionHandling || '';

                const finalPreferences = {
                    ...onboardingData,
                    sleepHours: selectedSleep,
                    energyLevel: selectedEnergy,
                    focusLevel: selectedFocus,
                    negativeEmotionHandling: safeNegativeEmotionHandling,
                    isOnboarded: true,
                };
                await api.post('/user/onboarding', finalPreferences);
            }

            // 4. Navigate to Dashboard
            navigation.replace('Dashboard');
        } catch (error) {
            console.error('Check-in failed:', error);
            const errorMsg = error.response?.data?.message || "Failed to save your progress. Please try again.";
            Alert.alert("Error", errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = selectedEnergy !== '' && selectedFocus !== '' && selectedMood !== null;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            <LinearGradient
                colors={GRADIENTS.soft}
                style={styles.backgroundGradient}
            />

            <View style={styles.header}>
                {!isDailyCheckIn && (
                    <Pressable 
                        onPress={() => navigation.goBack()} 
                        style={styles.backButton}
                        android_ripple={{ color: '#ccc', radius: 24 }}
                    >
                        <MaterialIcons name="chevron-left" size={28} color={theme.colors.onSurface} />
                    </Pressable>
                )}
                {isDailyCheckIn && <View style={{ width: 48 }} />}
                
                <Pressable onPress={() => navigation.navigate('Dashboard')} android_ripple={{ color: '#ccc', radius: 24 }}>
                    <Text style={styles.skipText}>SKIP</Text>
                </Pressable>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                    {!isDailyCheckIn && (
                        <View style={styles.progressContainer}>
                            <Text style={styles.progressLabel}>04 / 04</Text>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: '100%' }]} />
                            </View>
                            <Text style={styles.milestoneTag}>FINAL HARVEST</Text>
                        </View>
                    )}

                    <View style={styles.heroSection}>
                        <Text style={styles.displayTitle}>
                            {isDailyCheckIn ? "Good Morning," : "Finalizing your\n"}
                            <Text style={styles.elegantTitle}>{isDailyCheckIn ? "Gardener" : "environment"}</Text>
                        </Text>
                        <Text style={styles.subtitle}>
                            {isDailyCheckIn 
                                ? "Let's check the stability of your inner garden today." 
                                : "How was your rest and focus as we begin this path together?"}
                        </Text>
                    </View>

                    {/* Mood Selector (Crucial for Check-in) */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>How are you feeling right now?</Text>
                        <View style={styles.moodSelector}>
                            {MOOD_OPTIONS.map((opt) => {
                                const isSelected = selectedMood === opt.level;
                                return (
                                    <Pressable
                                        key={opt.level}
                                        onPress={() => setSelectedMood(opt.level)}
                                        style={({ pressed }) => [
                                            styles.moodItem,
                                            isSelected && styles.moodItemSelected,
                                            isSelected && { borderColor: opt.color },
                                            pressed && styles.pressHold,
                                        ]}
                                    >
                                        <Text style={[styles.moodEmoji, isSelected && styles.moodEmojiSelected]}>{opt.emoji}</Text>
                                        <Text style={[styles.moodLabel, isSelected && styles.moodLabelSelected]}>
                                            {opt.label}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    {/* Sleep Selector */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Quality of your rest last night?</Text>
                        <View style={styles.sleepSelector}>
                            {sleepOptions.map((opt) => {
                                const isSelected = selectedSleep === opt.value;
                                return (
                                    <Pressable
                                        key={opt.label}
                                        onPress={() => setSelectedSleep(opt.value)}
                                        style={({ pressed }) => [
                                            styles.sleepNode,
                                            isSelected && styles.sleepNodeSelected,
                                            pressed && styles.pressHold,
                                        ]}
                                    >
                                        <Text style={[styles.sleepValue, isSelected && styles.sleepValueSelected]}>
                                            {opt.label}
                                        </Text>
                                        <View style={[styles.sleepDot, isSelected && styles.sleepDotSelected]} />
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    {/* Energy Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Your vital energy today?</Text>
                        <View style={styles.energyGrid}>
                            {energyOptions.map((item) => {
                                const isSelected = selectedEnergy === item.id;
                                return (
                                    <Pressable
                                        key={item.id}
                                        onPress={() => setSelectedEnergy(item.id)}
                                        style={({ pressed }) => [
                                            styles.energyItem,
                                            isSelected && styles.energyItemSelected,
                                            { borderColor: isSelected ? item.color : 'transparent' },
                                            pressed && styles.pressHold,
                                        ]}
                                    >
                                        <MaterialIcons 
                                            name={item.icon} 
                                            size={28} 
                                            color={isSelected ? item.color : theme.colors.onSurfaceVariant} 
                                        />
                                        <Text style={[styles.energyLabel, isSelected && styles.energyLabelSelected]}>
                                            {item.label}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    {/* Focus Level List */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>My focus level is...</Text>
                        <View style={styles.listContainer}>
                            {focusLevelOptions.map((item) => {
                                const isSelected = selectedFocus === item;
                                return (
                                    <Pressable
                                        key={item}
                                        onPress={() => setSelectedFocus(item)}
                                        style={({pressed}) => [styles.listItem, isSelected && styles.listItemSelected, pressed && styles.pressHold]}
                                    >
                                        <Text style={[styles.listItemText, isSelected && styles.listItemTextSelected]}>
                                            {item}
                                        </Text>
                                        {isSelected ? (
                                            <MaterialIcons name="radio-button-checked" size={24} color={theme.colors.secondary} />
                                        ) : (
                                            <MaterialIcons name="radio-button-off" size={24} color={theme.colors.outline} />
                                        )}
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    {/* Quick Note Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Any thoughts on your mind? (Optional)</Text>
                        <View style={styles.noteContainer}>
                            <TextInput
                                placeholder="Write a short reflection..."
                                style={styles.noteInput}
                                multiline
                                numberOfLines={4}
                                value={note}
                                onChangeText={setNote}
                                placeholderTextColor={theme.colors.onSurfaceVariant + '80'}
                            />
                        </View>
                    </View>

                    {!isDailyCheckIn && (
                        <View style={styles.affirmationCard}>
                            <Text style={styles.affirmationText}>
                                "Every moment is a fresh beginning. Your garden is ready for you to plant your first seed."
                            </Text>
                        </View>
                    )}

                    <View style={{ height: 160 }} />
                </Animated.View>
            </ScrollView>

            <View style={styles.footer}>
                <Pressable
                    disabled={!isFormValid || isSubmitting}
                    onPress={handleFinish}
                    style={({pressed}) => [{ width: '100%' }, pressed && styles.pressHold]}
                >
                    <View
                        style={[
                            styles.primaryButton,
                            isFormValid ? styles.primaryButtonActive : styles.primaryButtonInactive
                        ]}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color={theme.colors.white} />
                        ) : (
                            <>
                                <Text style={styles.primaryButtonText}>
                                    {isDailyCheckIn ? "Submit Check-in" : "Enter My Healing Garden"}
                                </Text>
                                <MaterialIcons name={isDailyCheckIn ? "send" : "local-florist"} size={24} color={theme.colors.white} />
                            </>
                        )}
                    </View>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    backgroundGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: 60,
        paddingBottom: 10,
        zIndex: 10,
    },
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.soft,
    },
    skipText: {
        ...theme.typography.label,
        color: theme.colors.onSurfaceVariant,
        opacity: 0.6,
        letterSpacing: 1,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: 20,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 36,
        gap: 12,
    },
    progressLabel: {
        ...theme.typography.label,
        fontSize: 12,
        color: theme.colors.primary,
        width: 45,
    },
    progressBar: {
        flex: 1,
        height: 6,
        backgroundColor: theme.colors.outlineVariant,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: 3,
    },
    milestoneTag: {
        ...theme.typography.label,
        fontSize: 10,
        color: theme.colors.onSurfaceVariant,
        backgroundColor: theme.colors.surfaceVariant,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        overflow: 'hidden',
    },
    heroSection: {
        marginBottom: 48,
    },
    displayTitle: {
        ...theme.typography.headline,
        color: theme.colors.onSurface,
        marginBottom: 16,
    },
    elegantTitle: {
        fontFamily: theme.fonts.elegant,
        color: theme.colors.secondary,
        fontStyle: 'italic',
        fontSize: 40,
    },
    subtitle: {
        ...theme.typography.body,
        color: theme.colors.onSurfaceVariant,
        opacity: 0.8,
    },
    section: {
        marginBottom: 48,
    },
    sectionTitle: {
        ...theme.typography.body,
        fontWeight: '700',
        color: theme.colors.onSurface,
        marginBottom: 24,
    },
    moodSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    moodItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        backgroundColor: theme.colors.surface,
        ...theme.shadows.soft,
        marginHorizontal: 3,
    },
    moodItemSelected: {
        backgroundColor: '#E7F8E0',
        borderWidth: 1,
        shadowColor: '#46964b',
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 2,
        transform: [{ scale: 1.01 }],
    },
    moodEmojiSelected: {
        transform: [{ scale: 1.1 }],
    },
    moodLabelSelected: {
        color: theme.colors.primary,
        fontWeight: '700',
    },
    moodEmoji: {
        fontSize: 24,
        marginBottom: 4,
    },
    moodLabel: {
        ...theme.typography.label,
        fontSize: 8,
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
    },
    sleepSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.surfaceContainerHighest,
        padding: 28,
        borderRadius: 24,
        ...theme.shadows.soft,
    },
    sleepNode: {
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 8,
        borderRadius: 12,
        paddingVertical: 10,
    },
    sleepNodeSelected: {
        backgroundColor: '#ebffe6',
        borderColor: '#60a560',
        borderWidth: 1,
        transform: [{ scale: 1.01 }],
    },
    sleepValue: {
        ...theme.typography.label,
        fontSize: 12,
        color: theme.colors.onSurfaceVariant,
    },
    sleepValueSelected: {
        color: theme.colors.primary,
        fontWeight: '700',
    },
    energyLabelSelected: {
        color: theme.colors.primary,
        fontWeight: '700',
    },
    sleepDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.outlineVariant,
    },
    sleepDotSelected: {
        backgroundColor: theme.colors.primary,
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    energyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 14,
    },
    energyItem: {
        width: '48%',
        minHeight: 110,
        backgroundColor: theme.colors.surfaceContainerHighest,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        ...theme.shadows.soft,
        borderWidth: 2,
    },
    energyItemSelected: {
        backgroundColor: theme.colors.surface,
        ...theme.shadows.medium,
    },
    energyLabel: {
        ...theme.typography.label,
        fontSize: 10,
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
    },
    listContainer: {
        gap: 16,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        backgroundColor: theme.colors.surfaceContainerHighest,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.soft,
        borderWidth: 0,
        borderColor: 'transparent',
        marginVertical: 4,
        shadowOpacity: 0.09,
    },
    listItemSelected: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 0,
        borderColor: 'transparent',
        ...theme.shadows.soft,
        shadowColor: theme.colors.primary,
        shadowOpacity: 0.16,
        shadowRadius: 2,
        elevation: 3,
    },
    pressHold: {
        opacity: 0.6,
        transform: [{ scale: 0.98 }],
    },
    listItemText: {
        ...theme.typography.body,
        color: theme.colors.onSurface,
    },
    listItemTextSelected: {
        fontWeight: '700',
        color: theme.colors.white,
    },
    noteContainer: {
        backgroundColor: theme.colors.surfaceContainerHighest,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        ...theme.shadows.soft,
    },
    noteInput: {
        ...theme.typography.body,
        color: theme.colors.onSurface,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    affirmationCard: {
        padding: 36,
        backgroundColor: 'rgba(39, 107, 46, 0.05)',
        borderRadius: 32,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: theme.colors.primary,
        marginTop: 20,
    },
    affirmationText: {
        ...theme.typography.body,
        color: theme.colors.primary,
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 28,
        opacity: 0.8,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: theme.spacing.lg,
        paddingBottom: 40,
        backgroundColor: 'rgba(235, 255, 230, 0.9)',
        borderTopWidth: 1,
        borderTopColor: theme.colors.outlineVariant,
    },
    primaryButton: {
        height: 64,
        borderRadius: theme.borderRadius.lg,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        ...theme.shadows.primary,
    },
    primaryButtonActive: {
        backgroundColor: theme.colors.primary,
    },
    primaryButtonInactive: {
        backgroundColor: theme.colors.surfaceDim,
    },
    primaryButtonText: {
        ...theme.typography.body,
        fontWeight: '700',
        color: theme.colors.white,
    },
});

export default StepFourScreen;
