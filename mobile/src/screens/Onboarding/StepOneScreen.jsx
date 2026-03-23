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

const StepOneScreen = ({ navigation }) => {
    // Q1 Options
    const improveGoalsOptions = [
        { id: 'Reduce stress', icon: 'eco', label: 'Giảm căng thẳng' },
        { id: 'Improve mood', icon: 'mood', label: 'Cải thiện tâm trạng' },
        { id: 'Sleep better', icon: 'bedtime', label: 'Ngủ ngon hơn' },
        { id: 'Better self-understanding', icon: 'spa', label: 'Thấu hiểu bản thân' },
        { id: 'Increase focus', icon: 'center-focus-strong', label: 'Tăng sự tập trung' },
        { id: 'Build positive habits', icon: 'auto-stories', label: 'Xây dựng thói quen' },
    ];

    // Q2 Options
    const frequentFeelingOptions = [
        'Bình yên & Thư thái',
        'Tích cực & Động lực',
        'Tự tin hơn',
        'Cân bằng & Ổn định',
        'Sáng suốt',
    ];

    // Q3 Options
    const personalGoalOptions = [
        'Quản lý cảm xúc tốt hơn',
        'Hiểu rõ suy nghĩ hơn',
        'Cải thiện sức khỏe tinh thần',
        'Phát triển bản thân',
        'Tìm thấy sự cân bằng',
    ];

    const [selectedImproveGoals, setSelectedImproveGoals] = useState([]);
    const [selectedFeeling, setSelectedFeeling] = useState('');
    const [selectedGoalDesc, setSelectedGoalDesc] = useState('');

    const toggleImproveGoal = (id) => {
        setSelectedImproveGoals((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            }
            if (prev.length < 2) {
                return [...prev, id];
            }
            return [prev[1], id]; // Keep max 2, replace oldest
        });
    };

    const handleContinue = () => {
        if (selectedImproveGoals.length > 0 && selectedFeeling && selectedGoalDesc) {
            navigation.navigate('OnboardingStep2', {
                onboardingData: {
                    improveGoals: selectedImproveGoals,
                    frequentFeeling: selectedFeeling,
                    personalGoalDescription: selectedGoalDesc,
                }
            });
        }
    };

    const isFormValid = selectedImproveGoals.length > 0 && selectedFeeling !== '' && selectedGoalDesc !== '';

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
                    <Text style={styles.progressLabel}>CỘT MỐC 01: KIỂM TRA (CHECK IN)</Text>
                    <View style={styles.progressBar}>
                        <View style={styles.progressFill} />
                    </View>
                </View>

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Text style={styles.displayTitle}>
                        Bắt đầu ngày mới {"\n"}
                        bằng việc <Text style={styles.italicTitle}>lắng nghe</Text> bản thân
                    </Text>
                    <Text style={styles.subtitle}>Chọn mục tiêu bạn muốn tập trung cải thiện nhất (Tối đa 2).</Text>
                </View>

                {/* Goals Grid */}
                <View style={styles.goalsGrid}>
                    {improveGoalsOptions.map((item) => {
                        const isSelected = selectedImproveGoals.includes(item.id);
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.goalCard, isSelected && styles.goalCardSelected]}
                                onPress={() => toggleImproveGoal(item.id)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
                                    <MaterialIcons
                                        name={item.icon}
                                        size={24}
                                        color={isSelected ? theme.colors.white : theme.colors.primary}
                                    />
                                </View>
                                <Text style={[styles.goalLabel, isSelected && styles.goalLabelSelected]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Section: Feelings */}
                <View style={styles.feelingSection}>
                    <Text style={styles.sectionTitle}>Bạn muốn cảm thấy thế nào thường xuyên hơn?</Text>
                    <View style={styles.chipContainer}>
                        {frequentFeelingOptions.map((item) => {
                            const isSelected = selectedFeeling === item;
                            return (
                                <TouchableOpacity
                                    key={item}
                                    onPress={() => setSelectedFeeling(item)}
                                    style={[styles.chip, isSelected && styles.chipSelected]}
                                >
                                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                                        {item}
                                    </Text>
                                    {isSelected && <MaterialIcons name="check" size={18} color={theme.colors.secondary} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Section: Personal Goal Context */}
                <View style={styles.feelingSection}>
                    <Text style={styles.sectionTitle}>Mục tiêu của bạn tại khu vườn này là gì?</Text>
                    <View style={styles.chipContainer}>
                        {personalGoalOptions.map((item) => {
                            const isSelected = selectedGoalDesc === item;
                            return (
                                <TouchableOpacity
                                    key={item}
                                    onPress={() => setSelectedGoalDesc(item)}
                                    style={[styles.chip, isSelected && styles.chipSelected]}
                                >
                                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                                        {item}
                                    </Text>
                                    {isSelected && <MaterialIcons name="check" size={18} color={theme.colors.secondary} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View style={{ height: 160 }} />
            </ScrollView>

            {/* Bottom Floating Action */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.primaryButton, !isFormValid && { opacity: 0.5 }]}
                    onPress={handleContinue}
                    disabled={!isFormValid}
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
        width: '25%',
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

