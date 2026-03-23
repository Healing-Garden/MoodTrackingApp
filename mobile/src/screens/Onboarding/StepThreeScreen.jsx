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

const StepThreeScreen = ({ navigation }) => {
    const reflectionFrequencies = [
        'Hiếm khi',
        'Mỗi tuần 1 lần',
        { label: 'Mỗi tối', selected: true },
        'Nhiều lần trong ngày',
    ];

    const emotionResponses = [
        { icon: 'forum', label: 'Tâm sự với ai đó' },
        { icon: 'edit-note', label: 'Viết vào nhật ký', selected: true },
        { icon: 'lock-outline', label: 'Giữ cho riêng mình' },
        { icon: 'self-improvement', label: 'Thiền hoặc hít thở' },
        { icon: 'help-outline', label: 'Mình chưa rõ' },
    ];

    const learningOptions = [
        'Luôn luôn',
        { label: 'Thường xuyên', selected: true },
        'Đôi khi',
        'Hiếm khi',
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
                    <Text style={styles.progressLabel}>HÀNH TRÌNH TIẾP DIỄN • 03/04</Text>
                    <View style={styles.progressBar}>
                        <View style={styles.progressFill} />
                    </View>
                </View>

                {/* Section 1: Reflection Frequency */}
                <View style={styles.section}>
                    <Text style={styles.displayTitle}>
                        Bạn thường {"\n"}
                        <Text style={styles.italicTitle}>nhìn lại</Text> bản thân?
                    </Text>

                    <View style={styles.chipContainer}>
                        {reflectionFrequencies.map((item, i) => {
                            const label = typeof item === 'string' ? item : item.label;
                            const selected = typeof item === 'object' && item.selected;
                            return (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.chip, selected && styles.chipSelected]}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Editorial Insight Card */}
                <View style={styles.insightCard}>
                    <View style={styles.insightContent}>
                        <View style={styles.tagBadge}>
                            <Text style={styles.tagText}>CHIÊM NGHIỆM</Text>
                        </View>
                        <Text style={styles.insightTitle}>Hành trình của bạn</Text>
                        <Text style={styles.insightDescription}>
                            Dành 5 phút mỗi tối để viết ra cảm xúc giúp bạn giải tỏa áp lực và thấu hiểu các khuôn mẫu tâm lý của mình hơn.
                        </Text>
                    </View>
                    <View style={styles.pebbleDecor}>
                        <MaterialIcons name="auto-awesome" size={32} color={theme.colors.primary} />
                    </View>
                </View>

                {/* Section 2: Negative Emotions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cách bạn đối diện với cảm xúc tiêu cực?</Text>
                    <View style={styles.listContainer}>
                        {emotionResponses.map((item, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.listItem, item.selected && styles.listItemSelected]}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.iconPebble, item.selected && styles.iconPebbleSelected]}>
                                    <MaterialIcons
                                        name={item.icon}
                                        size={22}
                                        color={theme.colors.primary}
                                    />
                                </View>
                                <Text style={[styles.listItemText, item.selected && styles.listItemTextSelected]}>
                                    {item.label}
                                </Text>
                                {item.selected && (
                                    <MaterialIcons name="check-circle" size={24} color={theme.colors.primary} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Section 3: Learning */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Bạn có rút ra bài học từ trải nghiệm?</Text>
                    <View style={styles.grid}>
                        {learningOptions.map((item, i) => {
                            const label = typeof item === 'string' ? item : item.label;
                            const selected = typeof item === 'object' && item.selected;
                            return (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.learningBox, selected && styles.learningBoxSelected]}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.learningText, selected && styles.learningTextSelected]}>
                                        {label}
                                    </Text>
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
                    onPress={() => navigation.navigate('OnboardingStep4')}
                    activeOpacity={0.9}
                >
                    <Text style={styles.primaryButtonText}>Hoàn tất hành trình</Text>
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
        top: '20%',
        left: -width * 0.3,
        width: width * 0.9,
        height: width * 0.9,
        backgroundColor: 'rgba(154, 225, 255, 0.1)',
        borderRadius: width * 0.45,
        opacity: 0.7,
    },
    blob2: {
        position: 'absolute',
        bottom: height * 0.1,
        right: -width * 0.2,
        width: width * 0.7,
        height: width * 0.7,
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: width * 0.35,
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
        width: '100%',
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
        color: theme.colors.primary,
        fontWeight: 'normal',
        fontStyle: 'italic',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    chip: {
        paddingHorizontal: 22,
        paddingVertical: 14,
        backgroundColor: theme.colors.surfaceBright,
        borderRadius: 30,
        ...theme.shadows.soft,
    },
    chipSelected: {
        backgroundColor: theme.colors.primary,
        ...theme.shadows.primary,
    },
    chipText: {
        ...theme.typography.body,
        fontSize: 15,
        color: theme.colors.onSurfaceVariant,
    },
    chipTextSelected: {
        color: theme.colors.white,
        fontWeight: '700',
    },
    insightCard: {
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: 32,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 48,
        gap: 16,
        ...theme.shadows.soft,
    },
    insightContent: {
        flex: 1,
        gap: 8,
    },
    tagBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: 'rgba(39, 107, 46, 0.1)',
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    tagText: {
        ...theme.typography.label,
        fontSize: 10,
        color: theme.colors.primary,
        letterSpacing: 1,
    },
    insightTitle: {
        ...theme.typography.headline,
        fontSize: 20,
        color: theme.colors.onSurface,
    },
    insightDescription: {
        ...theme.typography.body,
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
        lineHeight: 20,
    },
    pebbleDecor: {
        width: 64,
        height: 80,
        backgroundColor: theme.colors.surfaceBright,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '-8deg' }],
        ...theme.shadows.soft,
    },
    pebbleIcon: {
        fontSize: 32,
        color: theme.colors.primary,
    },
    sectionTitle: {
        ...theme.typography.headline,
        fontSize: 24,
        color: theme.colors.onSurface,
    },
    listContainer: {
        gap: 12,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: theme.colors.surfaceBright,
        borderRadius: 24,
        gap: 16,
        ...theme.shadows.soft,
    },
    listItemSelected: {
        backgroundColor: theme.colors.surfaceContainerHighest,
    },
    iconPebble: {
        width: 44,
        height: 44,
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconPebbleSelected: {
        backgroundColor: theme.colors.primaryContainer,
    },
    listIcon: {
        fontSize: 22,
        color: theme.colors.primary,
    },
    listIconSelected: {
        color: theme.colors.primary,
    },
    listItemText: {
        ...theme.typography.body,
        fontSize: 16,
        color: theme.colors.onSurface,
        flex: 1,
    },
    listItemTextSelected: {
        fontWeight: '700',
        color: theme.colors.onSurface,
    },
    checkIcon: {
        fontSize: 24,
        color: theme.colors.primary,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    learningBox: {
        width: (width - 32 - 12) / 2,
        padding: 18,
        backgroundColor: 'rgba(202, 169, 16, 0.05)',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    learningBoxSelected: {
        backgroundColor: theme.colors.tertiary,
    },
    learningText: {
        ...theme.typography.label,
        fontSize: 16,
        color: theme.colors.tertiary,
    },
    learningTextSelected: {
        color: theme.colors.white,
        fontWeight: '700',
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

export default StepThreeScreen;
