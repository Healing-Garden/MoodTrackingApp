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
    soft: ['#ebffe6', '#caebc6'],
};

const StepOneScreen = ({ navigation }) => {
    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const goalOptions = [
        { id: 'Reduce stress', label: 'Reduce Stress', icon: 'self-improvement' },
        { id: 'Track moods', label: 'Track Moods', icon: 'timeline' },
        { id: 'Improve sleep', label: 'Improve Sleep', icon: 'nights-stay' },
        { id: 'Self-reflection', label: 'Self-Reflection', icon: 'psychology' },
        { id: 'Better focus', label: 'Better Focus', icon: 'center-focus-strong' },
    ];

    const [selectedGoals, setSelectedGoals] = useState([]);

    const toggleGoal = (id) => {
        if (selectedGoals.includes(id)) {
            setSelectedGoals(selectedGoals.filter(goalId => goalId !== id));
        } else {
            setSelectedGoals([...selectedGoals, id]);
        }
    };

    const handleContinue = () => {
        if (selectedGoals.length > 0) {
            navigation.navigate('OnboardingStep2', {
                onboardingData: { goals: selectedGoals }
            });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            <LinearGradient
                colors={GRADIENTS.soft}
                style={styles.backgroundGradient}
            />

            <View style={styles.header}>
                <View style={styles.backContainer} />
                <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressLabel}>01 / 04</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: '25%' }]} />
                        </View>
                        <Text style={styles.milestoneTag}>SEEDING PHASE</Text>
                    </View>

                    <View style={styles.heroSection}>
                        <Text style={styles.displayTitle}>
                            Planting your{"\n"}
                            <Text style={styles.elegantTitle}>intentions</Text>
                        </Text>
                        <Text style={styles.subtitle}>Welcome to your Healing Garden. What would you like to cultivate first?</Text>
                    </View>

                    <View style={styles.goalGrid}>
                        {goalOptions.map((goal) => {
                            const isSelected = selectedGoals.includes(goal.id);
                            return (
                                <TouchableOpacity
                                    key={goal.id}
                                    onPress={() => toggleGoal(goal.id)}
                                    activeOpacity={0.8}
                                    style={[
                                        styles.goalCard,
                                        isSelected && styles.goalCardSelected
                                    ]}
                                >
                                    <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                                        <MaterialIcons
                                            name={goal.icon}
                                            size={28}
                                            color={isSelected ? theme.colors.white : theme.colors.primary}
                                        />
                                    </View>
                                    <View style={styles.goalContent}>
                                        <Text style={[styles.goalLabel, isSelected && styles.goalLabelSelected]}>
                                            {goal.label}
                                        </Text>
                                    </View>
                                    {isSelected && (
                                        <View style={styles.checkBadge}>
                                            <MaterialIcons name="check" size={14} color={theme.colors.white} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View style={{ height: 160 }} />
                </Animated.View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    disabled={selectedGoals.length === 0}
                    onPress={handleContinue}
                    activeOpacity={0.9}
                    style={{ width: '100%' }}
                >
                    <View
                        style={[
                            styles.primaryButton,
                            selectedGoals.length > 0 ? styles.primaryButtonActive : styles.primaryButtonInactive
                        ]}
                    >
                        <Text style={styles.primaryButtonText}>Plant My Intentions</Text>
                        <MaterialIcons name="eco" size={24} color={theme.colors.white} />
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
    backContainer: {
        width: 48,
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
        color: theme.colors.primary,
        fontStyle: 'italic',
        fontSize: 40,
    },
    subtitle: {
        ...theme.typography.body,
        color: theme.colors.onSurfaceVariant,
        opacity: 0.8,
    },
    goalGrid: {
        gap: 16,
    },
    goalCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: theme.colors.surfaceContainerHighest,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.soft,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    goalCardSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.soft,
    },
    iconContainerSelected: {
        backgroundColor: theme.colors.primary,
    },
    goalContent: {
        flex: 1,
        marginLeft: 20,
    },
    goalLabel: {
        ...theme.typography.body,
        fontWeight: '600',
        color: theme.colors.onSurface,
    },
    goalLabelSelected: {
        color: theme.colors.white,
    },
    checkBadge: {
        color: theme.colors.onSurface,
        marginBottom: 16,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: theme.colors.surface,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    chipSelected: {
        backgroundColor: theme.colors.primaryContainer,
        borderColor: theme.colors.primary,
    },
    chipText: {
        ...theme.typography.body,
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
        fontWeight: '500',
    },
    chipTextSelected: {
        color: theme.colors.primary,
        fontWeight: '700',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: theme.spacing.lg,
        paddingBottom: 40,
        backgroundColor: 'rgba(248, 249, 250, 0.95)',
        borderTopWidth: 1,
        borderTopColor: theme.colors.outlineVariant,
    },
    primaryButton: {
        height: 64,
        borderRadius: 20,
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

export default StepOneScreen;

