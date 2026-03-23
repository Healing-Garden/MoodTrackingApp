import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';
import BottomNavBar from '../../components/common/BottomNavBar';
import api from '../../services/api';

const FeedbackScreen = ({ navigation }) => {
    const [type, setType] = useState('feature');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const categories = [
        { id: 'feature', label: 'Feature', icon: 'featured-play-list' },
        { id: 'bug', label: 'Bug', icon: 'pest-control' },
        { id: 'content_rating', label: 'Content Rating', icon: 'star' }
    ];

    const handleSubmit = async () => {
        if (!subject.trim() || !message.trim()) {
            Alert.alert('Notification', 'Please fill in both subject and message');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/feedback/submit', {
                type,
                subject,
                message
            });

            if (response.data.success) {
                Alert.alert('Success', 'Thank you for your feedback! We have received your suggestion.');
                setSubject('');
                setMessage('');
                setType('feature');
            } else {
                Alert.alert('Error', response.data.message || 'Cannot send feedback');
            }
        } catch (error) {
            console.error('Submit feedback error:', error);
            Alert.alert('Error', error.response?.data?.message || 'An error occurred while sending feedback. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'android'} 
        >
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />

                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back" size={24} color="#064e3b" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Give Feedback</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* TITLE SECTION */}
                    <View style={styles.heroSection}>
                        <View style={styles.moodBloomDeco} />
                        <Text style={styles.heroTitle}>We value your feedback</Text>
                        <Text style={styles.heroSubtitle}>
                            Help us nurture this digital sanctuary. Your thoughts help our garden grow stronger.
                        </Text>
                    </View>

                    {/* CATEGORY SELECTION */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>SELECT CATEGORY</Text>
                        <View style={styles.categoryContainer}>
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        styles.categoryChip,
                                        type === cat.id && styles.activeCategoryChip
                                    ]}
                                    onPress={() => setType(cat.id)}
                                >
                                    <MaterialIcons
                                        name={cat.icon}
                                        size={20}
                                        color={type === cat.id ? '#fff' : theme.colors.primary}
                                    />
                                    <Text style={[
                                        styles.categoryChipText,
                                        type === cat.id && styles.activeCategoryChipText
                                    ]}>
                                        {cat.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* INPUT FIELDS */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>SUBJECT</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., New feature request"
                            placeholderTextColor={theme.colors.outlineVariant}
                            value={subject}
                            onChangeText={setSubject}
                        />

                        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>MESSAGE</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Detailed description..."
                            placeholderTextColor={theme.colors.outlineVariant}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            value={message}
                            onChangeText={setMessage}
                        />
                    </View>

                    {/* INSPIRATION CARD */}
                    <View style={styles.inspirationCard}>
                        <View style={styles.inspirationTextContainer}>
                            <Text style={styles.inspirationTitle}>Feeling Inspired?</Text>
                            <Text style={styles.inspirationDesc}>
                                Every small suggestion plants a seed for a more peaceful experience.
                            </Text>
                        </View>
                        <View style={styles.inspirationIconContainer}>
                            <MaterialIcons name="energy-savings-leaf" size={28} color={theme.colors.secondary} />
                        </View>
                        <View style={styles.inspirationDecor} />
                    </View>

                    {/* ACTION BUTTON */}
                    <TouchableOpacity
                        style={styles.submitBtnWrapper}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        <LinearGradient
                            colors={['#276b2e', '#60a560']}
                            style={styles.submitBtn}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={styles.submitBtnText}>
                                {isLoading ? 'Sending...' : 'Send Feedback'}
                            </Text>
                            <MaterialIcons name="send" size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>

                <BottomNavBar navigation={navigation} activeTab="Me" />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(235, 255, 230, 0.8)',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        ...theme.shadows.soft,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(39, 107, 46, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#064e3b',
        fontFamily: theme.fonts.headline,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 120,
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 40,
        position: 'relative',
    },
    moodBloomDeco: {
        position: 'absolute',
        top: -20,
        right: -10,
        width: 100,
        height: 100,
        backgroundColor: 'rgba(96, 165, 96, 0.1)',
        borderRadius: 50,
        zIndex: -1,
        transform: [{ scaleX: 1.2 }],
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: theme.colors.onSurface,
        textAlign: 'center',
        fontFamily: theme.fonts.headline,
        letterSpacing: -0.5,
        marginBottom: 12,
    },
    heroSubtitle: {
        fontSize: 16,
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 300,
    },
    section: {
        marginBottom: 32,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: theme.colors.primary,
        letterSpacing: 1.5,
        marginBottom: 16,
        marginLeft: 4,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 99,
        backgroundColor: theme.colors.surfaceContainerHigh,
        gap: 8,
    },
    activeCategoryChip: {
        backgroundColor: theme.colors.primary,
        ...theme.shadows.medium,
    },
    categoryChipText: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.onSurfaceVariant,
    },
    activeCategoryChipText: {
        color: '#fff',
    },
    input: {
        backgroundColor: theme.colors.surfaceContainerHigh,
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        fontSize: 16,
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.body,
    },
    textArea: {
        height: 156,
        textAlignVertical: 'top',
    },
    inspirationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(154, 225, 255, 0.2)',
        padding: 24,
        borderRadius: 20,
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden',
    },
    inspirationTextContainer: {
        flex: 1,
    },
    inspirationTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: theme.colors.onSecondaryContainer,
        marginBottom: 4,
    },
    inspirationDesc: {
        fontSize: 13,
        color: theme.colors.onSecondaryContainer,
        opacity: 0.8,
        lineHeight: 18,
    },
    inspirationIconContainer: {
        width: 56,
        height: 56,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
    },
    inspirationDecor: {
        position: 'absolute',
        bottom: -20,
        right: -20,
        width: 60,
        height: 60,
        backgroundColor: 'rgba(96, 165, 96, 0.1)',
        borderRadius: 30,
        transform: [{ rotate: '45deg' }],
    },
    submitBtnWrapper: {
        ...theme.shadows.medium,
    },
    submitBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        gap: 12,
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
        fontFamily: theme.fonts.headline,
    }
});

export default FeedbackScreen;