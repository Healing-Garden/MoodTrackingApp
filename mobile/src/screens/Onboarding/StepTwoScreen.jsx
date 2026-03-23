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

const StepTwoScreen = ({ navigation }) => {
    const [stressLevel, setStressLevel] = useState(7);

    const emotionalStates = [
        { id: 1, emoji: '😔', label: 'U sầu' },
        { id: 2, emoji: '😰', label: 'Lo âu', selected: true },
        { id: 3, emoji: '😠', label: 'Tức giận' },
        { id: 4, emoji: '😓', label: 'Áp lực' },
        { id: 5, emoji: '😶', label: 'Vô cảm' },
    ];

    const selfUnderstandingOptions = [
        'Mình hiểu rõ bản thân',
        { label: 'Đang dần thấu hiểu', selected: true },
        'Đôi khi thấy mông lung',
        'Cần thêm thời gian chiêm nghiệm',
        'Vừa bắt đầu hành trình',
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
                <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
                    <Text style={styles.skipText}>Bỏ qua</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Progress Stepper */}
                <View style={styles.progressContainer}>
                    <Text style={styles.progressLabel}>HÀNH TRÌNH TIẾP DIỄN • 02/03</Text>
                    <View style={styles.progressBar}>
                        <View style={styles.progressFill} />
                    </View>
                </View>

                {/* Section 1: Stress Level (Editorial Slider) */}
                <View style={styles.section}>
                    <Text style={styles.displayTitle}>
                        Gần đây bạn {"\n"}
                        <Text style={styles.italicTitle}>áp lực</Text> thế nào?
                    </Text>

                    <View style={styles.editorialSliderContainer}>
                        <View style={styles.sliderHeader}>
                            <Text style={styles.sliderValue}>{stressLevel}/10</Text>
                            <Text style={styles.sliderStatus}>
                                {stressLevel > 7 ? 'Rất căng thẳng' : stressLevel > 4 ? 'Căng thẳng vừa' : 'Khá bình ổn'}
                            </Text>
                        </View>

                        <View style={styles.track}>
                            <View style={[styles.fill, { width: `${stressLevel * 10}%` }]} />
                            <View style={[styles.thumb, { left: `${stressLevel * 10}%` }]}>
                                <View style={styles.thumbInner} />
                            </View>
                        </View>

                        <View style={styles.sliderLabels}>
                            <Text style={styles.labelSmall}>TỰ TẠI</Text>
                            <Text style={styles.labelSmall}>QUÁ TẢI</Text>
                        </View>
                    </View>
                </View>

                {/* Section 2: Typical Mood (Asymmetric Pebbles) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Trạng thái tâm trí thường gặp?</Text>
                    <View style={styles.moodGrid}>
                        {emotionalStates.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.moodPebble, item.selected && styles.moodPebbleSelected]}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.moodEmoji}>{item.emoji}</Text>
                                <Text style={[styles.moodLabel, item.selected && styles.moodLabelSelected]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Section 3: Self-discovery */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Bạn thấy mình thấu hiểu bản thân đến đâu?</Text>
                    <View style={styles.listContainer}>
                        {selfUnderstandingOptions.map((item, i) => {
                            const label = typeof item === 'string' ? item : item.label;
                            const selected = typeof item === 'object' && item.selected;
                            return (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.listItem, selected && styles.listItemSelected]}
                                >
                                    <Text style={[styles.listItemText, selected && styles.listItemTextSelected]}>
                                        {label}
                                    </Text>
                                    <View style={[styles.radio, selected && styles.radioSelected]}>
                                        {selected && <View style={styles.radioInner} />}
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
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('OnboardingStep3')}
                    activeOpacity={0.9}
                >
                    <Text style={styles.primaryButtonText}>Tiếp tục</Text>
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
        width: '66%',
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

