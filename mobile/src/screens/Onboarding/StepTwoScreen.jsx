import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    Dimensions,
    Animated,
} from 'react-native';
import { theme } from '../../theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Local Gradients for Onboarding
const GRADIENTS = {
    primary: ['#276b2e', '#60a560'],
    secondary: ['#0c6780', '#09657f'],
    soft: ['#ebffe6', '#caebc6'],
};

const StepTwoScreen = ({ navigation, route }) => {
    const { onboardingData } = route.params || { onboardingData: {} };

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

    // Q4 Options (Stress Level)
    const stressLevels = [
        { level: 1, label: 'Calm', color: '#95D5B2' },
        { level: 2, label: 'Stable', color: '#74C69D' },
        { level: 3, label: 'Tense', color: '#FFD166' },
        { level: 4, label: 'Stressed', color: '#F4A261' },
        { level: 5, label: 'Overwhelmed', color: '#E76F51' },
    ];

    // Q5 Options (Mood Pebbles)
    const moodPebbles = [
        { id: 'joy', emoji: '😊', label: 'Joy' },
        { id: 'peace', emoji: '🍃', label: 'Peace' },
        { id: 'anxiety', emoji: '😟', label: 'Anxiety' },
        { id: 'sadness', emoji: '😢', label: 'Sadness' },
        { id: 'fatigue', emoji: '😴', label: 'Fatigue' },
        { id: 'anger', emoji: '😠', label: 'Anger' },
    ];

    // Q6 Options (Emotional Clarity)
    const clarityOptions = [
        'Often clear',
        'Sometimes confused',
        'Rarely understand',
        'Need more tools',
    ];

    const [selectedStress, setSelectedStress] = useState(2);
    const [selectedMoods, setSelectedMoods] = useState([]);
    const [selectedClarity, setSelectedClarity] = useState('');

    const toggleMood = (id) => {
        if (selectedMoods.includes(id)) {
            setSelectedMoods(selectedMoods.filter(m => m !== id));
        } else {
            setSelectedMoods([...selectedMoods, id]);
        }
    };

    const handleContinue = () => {
        if (selectedMoods.length > 0 && selectedClarity) {
            navigation.navigate('OnboardingStep3', {
                onboardingData: {
                    ...onboardingData,
                    stressLevel: selectedStress,
                    currentMoods: selectedMoods,
                    emotionalClarity: selectedClarity,
                }
            });
        }
    };

    const isFormValid = selectedMoods.length > 0 && selectedClarity !== '';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            <LinearGradient
                colors={GRADIENTS.soft}
                style={styles.backgroundGradient}
            />

            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="chevron-left" size={28} color={theme.colors.onSurface} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
                    <Text style={styles.skipText}>SKIP</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressLabel}>02 / 04</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: '50%' }]} />
                        </View>
                        <Text style={styles.milestoneTag}>WATERING PHASE</Text>
                    </View>

                    <View style={styles.heroSection}>
                        <Text style={styles.displayTitle}>
                            Feeling the{"\n"}
                            <Text style={styles.elegantTitle}>atmosphere</Text>
                        </Text>
                        <Text style={styles.subtitle}>How is the weather in your inner garden today?</Text>
                    </View>

                    {/* Stress Level Scale */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>My stress level is...</Text>
                        <View style={styles.stressScale}>
                            {stressLevels.map((item) => {
                                const isSelected = selectedStress === item.level;
                                return (
                                    <TouchableOpacity
                                        key={item.level}
                                        onPress={() => setSelectedStress(item.level)}
                                        style={styles.stressNode}
                                        activeOpacity={0.8}
                                    >
                                        <View style={[
                                            styles.stressDot,
                                            { backgroundColor: item.color },
                                            isSelected && styles.stressDotSelected
                                        ]}>
                                            {isSelected && <MaterialIcons name="bubble-chart" size={16} color="white" />}
                                        </View>
                                        <Text style={[styles.stressLabel, isSelected && { fontWeight: '700', color: theme.colors.primary }]}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Mood Pebbles Grid */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Typical emotions lately?</Text>
                        <View style={styles.moodGrid}>
                            {moodPebbles.map((pebble) => {
                                const isSelected = selectedMoods.includes(pebble.id);
                                return (
                                    <TouchableOpacity
                                        key={pebble.id}
                                        onPress={() => toggleMood(pebble.id)}
                                        style={[styles.moodPebble, isSelected && styles.moodPebbleSelected]}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.moodEmoji}>{pebble.emoji}</Text>
                                        <Text style={[styles.moodLabel, isSelected && styles.moodLabelSelected]}>
                                            {pebble.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Emotional Clarity List */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>My emotional clarity...</Text>
                        <View style={styles.listContainer}>
                            {clarityOptions.map((item) => {
                                const isSelected = selectedClarity === item;
                                return (
                                    <TouchableOpacity
                                        key={item}
                                        onPress={() => setSelectedClarity(item)}
                                        style={[styles.listItem, isSelected && styles.listItemSelected]}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[styles.listItemText, isSelected && styles.listItemTextSelected]}>
                                            {item}
                                        </Text>
                                        {isSelected && (
                                            <MaterialIcons name="radio-button-checked" size={24} color={theme.colors.secondary} />
                                        )}
                                        {!isSelected && (
                                            <MaterialIcons name="radio-button-off" size={24} color={theme.colors.outline} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View style={{ height: 160 }} />
                </Animated.View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    disabled={!isFormValid}
                    onPress={handleContinue}
                    activeOpacity={0.9}
                    style={{ width: '100%' }}
                >
                    <View
                        style={[
                            styles.primaryButton,
                            isFormValid ? styles.primaryButtonActive : styles.primaryButtonInactive
                        ]}
                    >
                        <Text style={styles.primaryButtonText}>Continue Nurturing</Text>
                        <MaterialIcons name="water-drop" size={24} color={theme.colors.white} />
                    </View>
                </TouchableOpacity>
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
        marginBottom: 32,
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
        marginBottom: 40,
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
        marginBottom: 40,
    },
    sectionTitle: {
        ...theme.typography.body,
        fontWeight: '700',
        color: theme.colors.onSurface,
        marginBottom: 20,
    },
    stressScale: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 10,
        height: 80,
    },
    stressNode: {
        alignItems: 'center',
        gap: 8,
    },
    stressDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.soft,
    },
    stressDotSelected: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 3,
        borderColor: 'white',
        ...theme.shadows.primary,
    },
    stressLabel: {
        ...theme.typography.label,
        fontSize: 10,
        color: theme.colors.onSurfaceVariant,
        letterSpacing: 0.5,
    },
    moodGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    moodPebble: {
        paddingVertical: 14,
        paddingHorizontal: 18,
        backgroundColor: theme.colors.surfaceContainerHighest,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        ...theme.shadows.soft,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    moodPebbleSelected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        ...theme.shadows.primary,
    },
    moodEmoji: {
        fontSize: 20,
    },
    moodLabel: {
        ...theme.typography.body,
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.onSurface,
    },
    moodLabelSelected: {
        color: theme.colors.white,
    },
    listContainer: {
        gap: 12,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        backgroundColor: theme.colors.surfaceContainerHighest,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.soft,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    listItemSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary,
    },
    listItemText: {
        ...theme.typography.body,
        color: theme.colors.onSurface,
    },
    listItemTextSelected: {
        fontWeight: '700',
        color: theme.colors.white,
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

export default StepTwoScreen;
