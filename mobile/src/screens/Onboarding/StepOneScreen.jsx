import React from 'react';
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

const StepOneScreen = ({ navigation }) => {
    const goals = [
        { id: 1, icon: 'eco', label: 'Giảm căng thẳng', selected: true },
        { id: 2, icon: 'mood', label: 'Cải thiện tâm trạng' },
        { id: 3, icon: 'bedtime', label: 'Ngủ ngon hơn' },
        { id: 4, icon: 'spa', label: 'Thấu hiểu bản thân' },
        { id: 5, icon: 'center-focus-strong', label: 'Tăng sự tập trung' },
        { id: 6, icon: 'auto-stories', label: 'Xây dựng thói quen' },
    ];

    const feelings = [
        'Bình yên & Thư thái',
        { label: 'Tích cực & Động lực', selected: true },
        'Tự tin hơn',
        'Cân bằng & Ổn định',
        'Sáng suốt',
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
                    <Text style={styles.progressLabel}>HÀNH TRÌNH BẮT ĐẦU • 01/03</Text>
                    <View style={styles.progressBar}>
                        <View style={styles.progressFill} />
                    </View>
                </View>

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Text style={styles.displayTitle}>
                        Điều gì bạn muốn {"\n"}
                        <Text style={styles.italicTitle}>cải thiện</Text> nhất?
                    </Text>
                    <Text style={styles.subtitle}>Chọn tối đa 2 mục tiêu để chúng mình hỗ trợ bạn tốt nhất.</Text>
                </View>

                {/* Goals Grid */}
                <View style={styles.goalsGrid}>
                    {goals.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.goalCard, item.selected && styles.goalCardSelected]}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.iconCircle, item.selected && styles.iconCircleSelected]}>
                                <MaterialIcons
                                    name={item.icon}
                                    size={24}
                                    color={item.selected ? theme.colors.white : theme.colors.primary}
                                />
                            </View>
                            <Text style={[styles.goalLabel, item.selected && styles.goalLabelSelected]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Section: Feelings */}
                <View style={styles.feelingSection}>
                    <Text style={styles.sectionTitle}>Bạn muốn cảm thấy thế nào thường xuyên hơn?</Text>
                    <View style={styles.chipContainer}>
                        {feelings.map((item, i) => {
                            const label = typeof item === 'string' ? item : item.label;
                            const selected = typeof item === 'object' && item.selected;
                            return (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.chip, selected && styles.chipSelected]}
                                >
                                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                                        {label}
                                    </Text>
                                    {selected && <MaterialIcons name="check" size={18} color={theme.colors.secondary} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Floating Action */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('OnboardingStep2')}
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
        left: -width * 0.2,
        width: width * 0.8,
        height: width * 0.8,
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: width * 0.4,
        opacity: 0.7,
    },
    blob2: {
        position: 'absolute',
        bottom: height * 0.1,
        right: -width * 0.3,
        width: width * 0.9,
        height: width * 0.9,
        backgroundColor: 'rgba(154, 225, 255, 0.1)',
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
        width: '33%',
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: 3,
    },
    heroSection: {
        marginBottom: 40,
        gap: 12,
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
    },
    subtitle: {
        ...theme.typography.body,
        color: theme.colors.onSurfaceVariant,
        fontSize: 16,
        lineHeight: 24,
        maxWidth: '85%',
    },
    goalsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 48,
    },
    goalCard: {
        width: (width - 32 - 16) / 2,
        padding: 20,
        backgroundColor: theme.colors.surfaceBright,
        borderRadius: 24,
        gap: 16,
        ...theme.shadows.soft,
    },
    goalCardSelected: {
        backgroundColor: theme.colors.primary,
        ...theme.shadows.primary,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.surfaceContainerLow,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircleSelected: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    goalIcon: {
        fontSize: 24,
        color: theme.colors.primary,
    },
    goalIconSelected: {
        color: theme.colors.white,
    },
    goalLabel: {
        ...theme.typography.label,
        fontSize: 16,
        color: theme.colors.onSurface,
        lineHeight: 20,
    },
    goalLabelSelected: {
        color: theme.colors.white,
    },
    feelingSection: {
        gap: 24,
    },
    sectionTitle: {
        ...theme.typography.headline,
        fontSize: 24,
        color: theme.colors.onSurface,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: 30,
        gap: 8,
    },
    chipSelected: {
        backgroundColor: theme.colors.secondaryContainer,
        ...theme.shadows.soft,
    },
    chipText: {
        ...theme.typography.body,
        fontSize: 15,
        color: theme.colors.onSurfaceVariant,
    },
    chipTextSelected: {
        color: theme.colors.onSecondaryContainer,
        fontWeight: '700',
    },
    checkIcon: {
        fontSize: 18,
        color: theme.colors.secondary,
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

export default StepOneScreen;

