import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    Dimensions,
} from 'react-native';
import { theme } from '../../theme';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const StepTwoScreen = ({ navigation, route }) => {
    const { onboardingData } = route.params || { onboardingData: {} };

    // Q4 Options
    const stressLevelOptions = [
        'Very low',
        'Low',
        'Moderate',
        'High',
        'Very high',
    ];

    // Q5 Options
    const recentStateOptions = [
        { id: 'Peaceful', emoji: '😌', label: 'Peaceful' },
        { id: 'Anxious', emoji: '😰', label: 'Anxious' },
        { id: 'Tired', emoji: '😓', label: 'Tired' },
        { id: 'Sad', emoji: '😔', label: 'Sad' },
        { id: 'Stressed', emoji: '😠', label: 'Stressed' },
    ];

    // Q6 Options
    const emotionalClarityOptions = [
        'Very clearly',
        'Quite clearly',
        'Normal',
        'Difficult',
        'Very difficult',
    ];

    const [selectedStress, setSelectedStress] = useState('');
    const [selectedRecentState, setSelectedRecentState] = useState('');
    const [selectedClarity, setSelectedClarity] = useState('');

    const handleContinue = () => {
        if (selectedStress && selectedRecentState && selectedClarity) {
            navigation.navigate('OnboardingStep3', {
                onboardingData: {
                    ...onboardingData,
                    stressLevel: selectedStress,
                    recentState: selectedRecentState,
                    emotionalClarity: selectedClarity,
                }
            });
        }
    };

    const isFormValid = selectedStress !== '' && selectedRecentState !== '' && selectedClarity !== '';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" transparent backgroundColor="transparent" />

            {/* Organic Asymmetrical Background */}
            <View style={styles.blob1} />
            <View style={styles.blob2} />

            {/* Editorial Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={theme.colors.onSurface} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Progress Stepper */}
                <View style={styles.progressContainer}>
                    <Text style={styles.progressLabel}>MILESTONE 02: JOURNAL</Text>
                    <View style={styles.progressBar}>
                        <View style={styles.progressFill} />
                    </View>
                </View>

                {/* Section 1: Stress Level */}
                <View style={styles.section}>
                    <Text style={styles.displayTitle}>
                        Share your {"\n"}
                        current <Text style={styles.italicTitle}>state</Text>
                    </Text>

                    <Text style={styles.sectionTitle}>How stressed have you been lately?</Text>
                    <View style={styles.stressContainer}>
                        {stressLevelOptions.map((opt) => {
                            const isSelected = selectedStress === opt;
                            return (
                                <TouchableOpacity
                                    key={opt}
                                    onPress={() => setSelectedStress(opt)}
                                    style={[styles.stressBtn, isSelected && styles.stressBtnSelected]}
                                >
                                    <Text style={[styles.stressText, isSelected && styles.stressTextSelected]}>
                                        {opt}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Section 2: Typical Mood */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Common emotional state recently?</Text>
                    <View style={styles.moodGrid}>
                        {recentStateOptions.map((item) => {
                            const isSelected = selectedRecentState === item.id;
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => setSelectedRecentState(item.id)}
                                    style={[styles.moodPebble, isSelected && styles.moodPebbleSelected]}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.moodEmoji}>{item.emoji}</Text>
                                    <Text style={[styles.moodLabel, isSelected && styles.moodLabelSelected]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Section 3: Emotional Clarity */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>How well do you understand your emotions?</Text>
                    <View style={styles.listContainer}>
                        {emotionalClarityOptions.map((item) => {
                            const isSelected = selectedClarity === item;
                            return (
                                <TouchableOpacity
                                    key={item}
                                    onPress={() => setSelectedClarity(item)}
                                    style={[styles.listItem, isSelected && styles.listItemSelected]}
                                >
                                    <Text style={[styles.listItemText, isSelected && styles.listItemTextSelected]}>
                                        {item}
                                    </Text>
                                    <View style={[styles.radio, isSelected && styles.radioSelected]}>
                                        {isSelected && <View style={styles.radioInner} />}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom Floating Action */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.primaryButton, !isFormValid && { opacity: 0.5 }]}
                    onPress={handleContinue}
                    disabled={!isFormValid}
                    activeOpacity={0.9}
                >
                    <Text style={styles.primaryButtonText}>Continue</Text>
                    <MaterialIcons name="arrow-forward" size={20} color={theme.colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },
    blob1: {
        position: 'absolute',
        top: -height * 0.1,
        right: -width * 0.2,
        width: width * 0.8,
        height: width * 0.8,
        backgroundColor: 'rgba(96, 165, 96, 0.1)',
        borderRadius: width * 0.4,
        opacity: 0.7,
    },
    blob2: {
        position: 'absolute',
        bottom: height * 0.05,
        left: -width * 0.3,
        width: width * 0.9,
        height: width * 0.9,
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: width * 0.45,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: 48,
        zIndex: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.surfaceBright,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.soft,
    },
    backIcon: {
        fontSize: 24,
        color: theme.colors.onSurface,
    },
    skipText: {
        ...theme.typography.label,
        color: theme.colors.onSurfaceVariant,
        opacity: 0.6,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: 32,
    },
    progressContainer: {
        marginBottom: 32,
        gap: 12,
    },
    progressLabel: {
        ...theme.typography.label,
        fontSize: 12,
        color: theme.colors.primary,
        opacity: 0.6,
        letterSpacing: 1.5,
    },
    progressBar: {
        height: 6,
        backgroundColor: theme.colors.surfaceContainerHighest,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        width: '50%',
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: 3,
    },
    section: {
        marginBottom: 48,
        gap: 24,
    },
    displayTitle: {
        ...theme.typography.headline,
        fontSize: 34,
        lineHeight: 40,
        color: theme.colors.onSurface,
    },
    italicTitle: {
        fontFamily: theme.fonts.elegant,
        color: theme.colors.secondary,
        fontWeight: 'normal',
        fontStyle: 'italic',
    },
    editorialSliderContainer: {
        backgroundColor: theme.colors.surfaceBright,
        padding: 24,
        borderRadius: 32,
        ...theme.shadows.soft,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    sliderValue: {
        ...theme.typography.headline,
        fontSize: 32,
        color: theme.colors.primary,
    },
    sliderStatus: {
        ...theme.typography.label,
        color: theme.colors.onSurfaceVariant,
    },
    track: {
        height: 12,
        backgroundColor: theme.colors.surfaceContainerHighest,
        borderRadius: 6,
        justifyContent: 'center',
    },
    fill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: 6,
    },
    thumb: {
        position: 'absolute',
        width: 32,
        height: 32,
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        borderWidth: 8,
        borderColor: theme.colors.primary,
        marginLeft: -16,
        ...theme.shadows.soft,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    labelSmall: {
        ...theme.typography.label,
        fontSize: 10,
        color: theme.colors.onSurfaceVariant,
        opacity: 0.6,
        letterSpacing: 1,
    },
    stressContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    stressBtn: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    stressBtnSelected: {
        backgroundColor: theme.colors.primaryContainer,
        borderColor: theme.colors.primary,
    },
    stressText: {
        ...theme.typography.body,
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
    },
    stressTextSelected: {
        color: theme.colors.primary,
        fontWeight: '700',
    },
    sectionTitle: {
        ...theme.typography.headline,
        fontSize: 24,
        color: theme.colors.onSurface,
    },
    moodGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    moodPebble: {
        width: (width - 32 - 24) / 3,
        aspectRatio: 1,
        backgroundColor: theme.colors.surfaceBright,
        borderRadius: 40, // More rounded/organic
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        ...theme.shadows.soft,
    },
    moodPebbleSelected: {
        backgroundColor: theme.colors.secondary,
        ...theme.shadows.primary, // Using primary shadow for elevation feel
    },
    moodEmoji: {
        fontSize: 32,
    },
    moodLabel: {
        ...theme.typography.label,
        fontSize: 12,
        color: theme.colors.onSurfaceVariant,
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
        padding: 22,
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: 24,
    },
    listItemSelected: {
        backgroundColor: theme.colors.surfaceContainerHighest,
    },
    listItemText: {
        ...theme.typography.body,
        fontSize: 16,
        color: theme.colors.onSurface,
        flex: 1,
    },
    listItemTextSelected: {
        fontWeight: '700',
        color: theme.colors.primary,
    },
    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: theme.colors.outline,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioSelected: {
        borderColor: theme.colors.primary,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: theme.colors.primary,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: 40,
        paddingTop: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    primaryButton: {
        width: '100%',
        height: 64,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.xl,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        ...theme.shadows.primary,
    },
    primaryButtonText: {
        ...theme.typography.label,
        fontSize: 18,
        color: theme.colors.white,
    },
    buttonArrow: {
        fontSize: 20,
        color: theme.colors.white,
    },
});

export default StepTwoScreen;

