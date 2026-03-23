import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    TextInput,
    Dimensions,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { theme } from '../../theme';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../../services/api';

const { width, height } = Dimensions.get('window');

const StepFourScreen = ({ navigation, route }) => {
    const { onboardingData } = route.params || { onboardingData: {} };
    const [loading, setLoading] = useState(false);

    const [selectedMood, setSelectedMood] = useState(3);
    const [energyLevel, setEnergyLevel] = useState(5);
    const [selectedTriggers, setSelectedTriggers] = useState(['Work']);
    const [note, setNote] = useState('');

    const moods = [
        { id: 5, emoji: '🤩', label: 'Rất tốt' },
        { id: 4, emoji: '😊', label: 'Ổn' },
        { id: 3, emoji: '😐', label: 'Bình thường' },
        { id: 2, emoji: '😔', label: 'Hơi thấp' },
        { id: 1, emoji: '😫', label: 'Tệ' },
    ];

    const triggerOptions = [
        { id: 'Work', label: 'Công việc' },
        { id: 'Family', label: 'Gia đình' },
        { id: 'Health', label: 'Sức khỏe' },
        { id: 'Finance', label: 'Tài chính' },
        { id: 'Social', label: 'Xã hội' },
        { id: 'Weather', label: 'Thời tiết' },
        { id: 'Sleep', label: 'Giấc ngủ' },
    ];

    const toggleTrigger = (id) => {
        setSelectedTriggers((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        );
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            // 1. Save Onboarding Preferences
            await api.post('/user/onboarding', {
                ...onboardingData,
                isOnboarded: true,
            });

            // 2. Save Initial Check-in
            await api.post('/user/checkins', {
                mood: selectedMood,
                energyLevel: energyLevel,
                triggers: selectedTriggers,
                note: note,
            });

            // 3. Navigate to Home
            navigation.replace('Dashboard');
        } catch (error) {
            console.error('Onboarding failed:', error);
            Alert.alert(
                'Lỗi',
                'Không thể lưu thông tin. Vui lòng thử lại sau.'
            );
        } finally {
            setLoading(false);
        }
    };

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
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Cột mốc 04: Nuôi dưỡng</Text>
                </View>
                <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>GROW</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Text style={styles.displayTitle}>
                        Hãy bắt đầu {"\n"}
                        <Text style={styles.italicTitle}>kiểm tra</Text> cảm xúc đầu tiên
                    </Text>
                </View>

                {/* Mood Selection (Asymmetric Pebbles) */}
                <View style={styles.section}>
                    <View style={styles.moodGrid}>
                        {moods.map((mood) => (
                            <TouchableOpacity
                                key={mood.id}
                                style={[
                                    styles.moodPebble,
                                    selectedMood === mood.id && styles.moodPebbleSelected
                                ]}
                                onPress={() => setSelectedMood(mood.id)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                                <Text style={[
                                    styles.moodLabel,
                                    selectedMood === mood.id && styles.moodLabelSelected
                                ]}>
                                    {mood.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Energy Level (Editorial Slider) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mức năng lượng của bạn?</Text>
                    <View style={styles.editorialSliderContainer}>
                        <View style={styles.sliderHeader}>
                            <Text style={styles.sliderValue}>{energyLevel}/10</Text>
                            <Text style={styles.sliderStatus}>
                                {energyLevel > 7 ? 'Tràn đầy tự tin' : energyLevel > 4 ? 'Vừa phải' : 'Hơi mệt mỏi'}
                            </Text>
                        </View>

                        {/* Interactive Slider Placeholder using 5 buttons for mobile simplicity/consistency */}
                        <View style={styles.energyButtons}>
                            {[2, 4, 6, 8, 10].map((val) => (
                                <TouchableOpacity
                                    key={val}
                                    onPress={() => setEnergyLevel(val)}
                                    style={[styles.energyDot, energyLevel === val && styles.energyDotActive]}
                                />
                            ))}
                        </View>

                        <View style={styles.sliderLabels}>
                            <Text style={styles.labelSmall}>KIỆT SỨC</Text>
                            <Text style={styles.labelSmall}>PHẤN CHẤN</Text>
                        </View>
                    </View>
                </View>

                {/* Triggers Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Yếu tố nào ảnh hưởng đến bạn?</Text>
                    <View style={styles.triggerGrid}>
                        {triggerOptions.map((trigger) => {
                            const isSelected = selectedTriggers.includes(trigger.id);
                            return (
                                <TouchableOpacity
                                    key={trigger.id}
                                    onPress={() => toggleTrigger(trigger.id)}
                                    style={[styles.triggerChip, isSelected && styles.triggerChipSelected]}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.triggerChipText, isSelected && styles.triggerChipTextSelected]}>
                                        {trigger.label}
                                    </Text>
                                    {isSelected && <MaterialIcons name="check" size={16} color={theme.colors.secondary} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Quick Note */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ghi chú nhanh (Tùy chọn)</Text>
                    <TextInput
                        style={styles.noteInput}
                        value={note}
                        onChangeText={setNote}
                        placeholder="Có điều gì đang ở trong tâm trí bạn?"
                        placeholderTextColor="rgba(39, 107, 46, 0.3)"
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                <View style={{ height: 160 }} />
            </ScrollView>

            {/* Final Celebration Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.primaryButton, loading && { opacity: 0.7 }]}
                    onPress={handleFinish}
                    disabled={loading}
                    activeOpacity={0.9}
                >
                    {loading ? (
                        <ActivityIndicator color={theme.colors.white} />
                    ) : (
                        <>
                            <MaterialIcons name="celebration" size={24} color={theme.colors.white} />
                            <Text style={styles.primaryButtonText}>Hoàn tất & Khám phá</Text>
                        </>
                    )}
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
        left: -width * 0.2,
        width: width * 0.8,
        height: width * 0.8,
        backgroundColor: 'rgba(171, 244, 167, 0.1)',
        borderRadius: width * 0.4,
    },
    blob2: {
        position: 'absolute',
        bottom: height * 0.05,
        right: -width * 0.3,
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
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        ...theme.typography.headline,
        fontSize: 18,
        color: theme.colors.onSurface,
    },
    stepBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: theme.colors.primaryContainer,
        borderRadius: 20,
    },
    stepBadgeText: {
        ...theme.typography.label,
        fontSize: 12,
        color: theme.colors.primary,
        fontWeight: '700',
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: 32,
    },
    heroSection: {
        marginBottom: 32,
    },
    displayTitle: {
        ...theme.typography.headline,
        fontSize: 34,
        lineHeight: 40,
        color: theme.colors.onSurface,
    },
    italicTitle: {
        fontFamily: theme.fonts.elegant,
        color: theme.colors.primary,
        fontWeight: 'normal',
        fontStyle: 'italic',
    },
    section: {
        marginBottom: 40,
        gap: 20,
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
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        ...theme.shadows.soft,
    },
    moodPebbleSelected: {
        backgroundColor: theme.colors.primaryContainer,
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    moodEmoji: {
        fontSize: 32,
    },
    moodLabel: {
        ...theme.typography.label,
        fontSize: 12,
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
    },
    moodLabelSelected: {
        color: theme.colors.primary,
        fontWeight: '700',
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
        color: theme.colors.secondary,
    },
    sliderStatus: {
        ...theme.typography.label,
        color: theme.colors.onSurfaceVariant,
    },
    energyButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    energyDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: theme.colors.surfaceContainerHighest,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    energyDotActive: {
        backgroundColor: theme.colors.secondary,
        borderColor: theme.colors.secondaryContainer,
        transform: [{ scale: 1.2 }],
    },
    track: {
        height: 12,
        backgroundColor: theme.colors.surfaceContainerHighest,
        borderRadius: 6,
        justifyContent: 'center',
    },
    fill: {
        height: '100%',
        backgroundColor: theme.colors.secondary,
        borderRadius: 6,
    },
    thumb: {
        position: 'absolute',
        width: 32,
        height: 32,
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        borderWidth: 8,
        borderColor: theme.colors.secondary,
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
    triggerGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    triggerChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: 24,
        gap: 8,
    },
    triggerChipSelected: {
        backgroundColor: theme.colors.secondaryContainer,
    },
    triggerChipText: {
        ...theme.typography.body,
        fontSize: 15,
        color: theme.colors.onSurfaceVariant,
    },
    triggerChipTextSelected: {
        color: theme.colors.onSecondaryContainer,
        fontWeight: '700',
    },
    checkIconSmall: {
        fontSize: 16,
        color: theme.colors.secondary,
    },
    noteInput: {
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: 24,
        padding: 24,
        minHeight: 140,
        ...theme.typography.body,
        fontSize: 16,
        color: theme.colors.onSurface,
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
        height: 72, // Slightly taller for celebration fill
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.xl,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        ...theme.shadows.primary,
    },
    buttonIcon: {
        fontSize: 24,
        color: theme.colors.white,
    },
    primaryButtonText: {
        ...theme.typography.label,
        fontSize: 20,
        color: theme.colors.white,
        fontWeight: '800',
    },
});

export default StepFourScreen;
