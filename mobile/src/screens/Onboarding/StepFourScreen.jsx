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
} from 'react-native';
import { theme } from '../../theme';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const StepFourScreen = ({ navigation }) => {
    const [selectedMood, setSelectedMood] = useState(2);
    const [energyLevel, setEnergyLevel] = useState(8);

    const moods = [
        { id: 1, emoji: '🤩', label: 'Rất tốt' },
        { id: 2, emoji: '😊', label: 'Ổn' },
        { id: 3, emoji: '😐', label: 'Bình thường' },
        { id: 4, emoji: '😔', label: 'Hơi thấp' },
        { id: 5, emoji: '😫', label: 'Tệ' },
    ];

    const triggers = [
        { label: 'Công việc', selected: true },
        { label: 'Gia đình', selected: true },
        { label: 'Sức khỏe', selected: true },
        { label: 'Tài chính' },
        { label: 'Xã hội' },
        { label: 'Thời tiết' },
        { label: 'Giấc ngủ' },
    ];

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
                    <Text style={styles.headerTitle}>Kiểm tra hằng ngày</Text>
                </View>
                <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>04/04</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Text style={styles.displayTitle}>
                        Hiện tại bạn {"\n"}
                        <Text style={styles.italicTitle}>cảm thấy</Text> thế nào?
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
                                {energyLevel > 7 ? 'Tràn đầy từ tin' : energyLevel > 4 ? 'Vừa phải' : 'Hơi mệt mỏi'}
                            </Text>
                        </View>

                        <View style={styles.track}>
                            <View style={[styles.fill, { width: `${energyLevel * 10}%` }]} />
                            <View style={[styles.thumb, { left: `${energyLevel * 10}%` }]}>
                                <View style={styles.thumbInner} />
                            </View>
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
                        {triggers.map((trigger, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.triggerChip, trigger.selected && styles.triggerChipSelected]}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.triggerChipText, trigger.selected && styles.triggerChipTextSelected]}>
                                    {trigger.label}
                                </Text>
                                {trigger.selected && <MaterialIcons name="check" size={16} color={theme.colors.secondary} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Quick Note */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ghi chú nhanh</Text>
                    <TextInput
                        style={styles.noteInput}
                        placeholder="Có điều gì đang ở trong tâm trí bạn?"
                        placeholderTextColor="rgba(39, 107, 46, 0.3)"
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Final Celebration Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('Dashboard')}
                    activeOpacity={0.9}
                >
                    <MaterialIcons name="celebration" size={24} color={theme.colors.white} />
                    <Text style={styles.primaryButtonText}>Hoàn tất & Bắt đầu</Text>
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
