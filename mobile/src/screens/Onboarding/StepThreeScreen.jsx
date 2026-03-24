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
    tertiary: ['#705d00', '#caa910'],
    soft: ['#ebffe6', '#caebc6'],
};

const StepThreeScreen = ({ navigation, route }) => {
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

    // Q7 Options (Frequency)
    const frequencyOptions = [
        'Daily',
        'Weekly',
        'Only on hard days',
        'Never',
    ];

    // Q8 Options (Negative Emotions)
    const handlingOptions = [
        { id: 'Write it down', icon: 'edit', label: 'Write it down' },
        { id: 'Meditate/Breath', icon: 'spa', label: 'Meditate/Breath' },
        { id: 'Talk to someone', icon: 'groups', label: 'Talk to someone' },
        { id: 'Distract myself', icon: 'videogame-asset', label: 'Distract myself' },
        { id: 'Other', icon: 'more-horiz', label: 'Other' },
    ];

    // Q9 Options (Learning)
    const learningOptions = [
        'Often learn',
        'Sometimes learn',
        'Rarely learn',
        'Not ready yet',
    ];

    const [selectedFreq, setSelectedFreq] = useState('');
    const [selectedHandling, setSelectedHandling] = useState([]);
    const [selectedLearning, setSelectedLearning] = useState('');

    const toggleHandling = (id) => {
        if (selectedHandling.includes(id)) {
            setSelectedHandling(selectedHandling.filter(h => h !== id));
        } else {
            setSelectedHandling([...selectedHandling, id]);
        }
    };

    const handleContinue = () => {
        if (selectedFreq && selectedHandling.length > 0 && selectedLearning) {
            navigation.navigate('OnboardingStep4', {
                onboardingData: {
                    ...onboardingData,
                    reflectionFrequency: selectedFreq,
                    negativeEmotionHandling: selectedHandling,
                    learningFromExperience: selectedLearning,
                }
            });
        }
    };

    const isFormValid = selectedFreq !== '' && selectedHandling.length > 0 && selectedLearning !== '';

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
                        <Text style={styles.progressLabel}>03 / 04</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: '75%' }]} />
                        </View>
                        <Text style={styles.milestoneTag}>BLOOMING PHASE</Text>
                    </View>

                    <View style={styles.heroSection}>
                        <Text style={styles.displayTitle}>
                            Deepening the{"\n"}
                            <Text style={styles.elegantTitle}>reflections</Text>
                        </Text>
                        <Text style={styles.subtitle}>Let's find the light that helps your garden grow through every season.</Text>
                    </View>

                    {/* Seed of Wisdom (Insight Card) */}
                    <LinearGradient
                        colors={GRADIENTS.tertiary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.insightCard}
                    >
                        <View style={styles.insightIconCircle}>
                            <MaterialIcons name="wb-sunny" size={24} color={theme.colors.tertiary} />
                        </View>
                        <View style={styles.insightContent}>
                            <Text style={styles.insightTitle}>Seed of Wisdom</Text>
                            <Text style={styles.insightText}>Reflection is the sunlight of the mind. Even 5 minutes a day can transform your inner landscape.</Text>
                        </View>
                    </LinearGradient>

                    {/* Reflection Frequency */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>How often do you reflect?</Text>
                        <View style={styles.chipContainer}>
                            {frequencyOptions.map((item) => {
                                const isSelected = selectedFreq === item;
                                return (
                                    <TouchableOpacity
                                        key={item}
                                        onPress={() => setSelectedFreq(item)}
                                        style={[styles.chip, isSelected && styles.chipSelected]}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Negative Emotion Handling */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>When "stormy" emotions arrive...</Text>
                        <View style={styles.listContainer}>
                            {handlingOptions.map((item) => {
                                const isSelected = selectedHandling.includes(item.id);
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => toggleHandling(item.id)}
                                        style={[styles.listItem, isSelected && styles.listItemSelected]}
                                        activeOpacity={0.8}
                                    >
                                        <View style={[styles.itemIconBox, isSelected && styles.itemIconBoxSelected]}>
                                            <MaterialIcons 
                                                name={item.icon} 
                                                size={22} 
                                                color={isSelected ? theme.colors.white : theme.colors.tertiary} 
                                            />
                                        </View>
                                        <Text style={[styles.listItemText, isSelected && styles.listItemTextSelected]}>
                                            {item.label}
                                        </Text>
                                        {isSelected && (
                                            <MaterialIcons name="check-circle" size={24} color={theme.colors.tertiary} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Learning Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Do those storms leave gifts?</Text>
                        <View style={styles.horizontalList}>
                            {learningOptions.map((item) => {
                                const isSelected = selectedLearning === item;
                                return (
                                    <TouchableOpacity
                                        key={item}
                                        onPress={() => setSelectedLearning(item)}
                                        style={[styles.smallChip, isSelected && styles.smallChipSelected]}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[styles.smallChipText, isSelected && styles.smallChipTextSelected]}>
                                            {item}
                                        </Text>
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
                    <LinearGradient
                        colors={isFormValid ? GRADIENTS.primary : [theme.colors.surfaceDim, theme.colors.outlineVariant]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.primaryButton}
                    >
                        <Text style={styles.primaryButtonText}>Continue Blooming</Text>
                        <MaterialIcons name="local-florist" size={24} color={theme.colors.white} />
                    </LinearGradient>
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
        marginBottom: 32,
    },
    displayTitle: {
        ...theme.typography.headline,
        color: theme.colors.onSurface,
        marginBottom: 16,
    },
    elegantTitle: {
        fontFamily: theme.fonts.elegant,
        color: theme.colors.tertiary,
        fontStyle: 'italic',
        fontSize: 40,
    },
    subtitle: {
        ...theme.typography.body,
        color: theme.colors.onSurfaceVariant,
        opacity: 0.8,
    },
    insightCard: {
        flexDirection: 'row',
        padding: 24,
        borderRadius: 32,
        marginBottom: 40,
        alignItems: 'center',
        ...theme.shadows.primary,
    },
    insightIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    insightContent: {
        flex: 1,
        marginLeft: 16,
    },
    insightTitle: {
        ...theme.typography.body,
        fontWeight: '700',
        color: theme.colors.white,
        marginBottom: 4,
    },
    insightText: {
        ...theme.typography.body,
        fontSize: 14,
        color: theme.colors.white,
        opacity: 0.9,
        lineHeight: 20,
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
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    chip: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: theme.colors.surfaceContainerHighest,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        ...theme.shadows.soft,
    },
    chipSelected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    chipText: {
        ...theme.typography.body,
        fontSize: 14,
        color: theme.colors.onSurface,
    },
    chipTextSelected: {
        color: theme.colors.white,
        fontWeight: '700',
    },
    listContainer: {
        gap: 12,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: theme.colors.surfaceContainerHighest,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        ...theme.shadows.soft,
    },
    listItemSelected: {
        borderColor: theme.colors.tertiary,
        backgroundColor: theme.colors.tertiaryContainer + '20',
    },
    itemIconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemIconBoxSelected: {
        backgroundColor: theme.colors.tertiary,
    },
    listItemText: {
        ...theme.typography.body,
        fontSize: 15,
        color: theme.colors.onSurface,
        flex: 1,
        marginLeft: 16,
    },
    listItemTextSelected: {
        fontWeight: '700',
        color: theme.colors.tertiary,
    },
    horizontalList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    smallChip: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.surface,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    smallChipSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primaryContainer + '20',
    },
    smallChipText: {
        ...theme.typography.label,
        fontSize: 11,
        color: theme.colors.onSurfaceVariant,
    },
    smallChipTextSelected: {
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
    primaryButtonText: {
        ...theme.typography.body,
        fontWeight: '700',
        color: theme.colors.white,
    },
});

export default StepThreeScreen;
