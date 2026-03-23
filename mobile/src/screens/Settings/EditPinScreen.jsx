import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    Switch,
    Dimensions,
} from 'react-native';
import { theme } from '../../theme';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'; // Dùng icon tương thích Expo

const { width } = Dimensions.get('window');

const EditPinScreen = ({ navigation }) => {
    const [isPinEnabled, setIsPinEnabled] = useState(true);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" transparent backgroundColor="transparent" />

            {/* Decorative Bloom Shapes */}
            <View style={styles.bloom1} />
            <View style={styles.bloom2} />

            {/* Top Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.primaryFixed} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Security Sanctuary</Text>
                <MaterialCommunityIcons name="shield-check" size={24} color={theme.colors.primaryFixed} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.heroIconContainer}>
                        <MaterialCommunityIcons name="lock" size={32} color={theme.colors.primaryContainer} />
                    </View>
                    <Text style={styles.heroTitle}>App Lock Settings</Text>
                    <Text style={styles.heroSubtitle}>Manage how you protect your digital sanctuary.</Text>
                </View>

                {/* Options */}
                <View style={styles.options}>
                    {/* Change PIN */}
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ChangePin')}>
                        <View style={styles.cardLeft}>
                            <View style={[styles.cardIconBg, { backgroundColor: theme.colors.surfaceContainerHighest }]}>
                                <MaterialCommunityIcons name="form-textbox-password" size={22} color={theme.colors.primary} />
                            </View>
                            <View>
                                <Text style={styles.cardTitle}>Change App Lock PIN</Text>
                                <Text style={styles.cardSubtitle}>Update your 4-digit security code</Text>
                            </View>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.outlineVariant} />
                    </TouchableOpacity>

                    {/* Toggle PIN */}
                    <View style={styles.card}>
<View style={styles.cardLeft}>
                            <View style={[styles.cardIconBg, { backgroundColor: 'rgba(154,225,255,0.3)' }]}>
                                <MaterialCommunityIcons name="verified" size={22} color={theme.colors.secondary} />
                            </View>
                            <View>
                                <Text style={styles.cardTitle}>Disable App Lock PIN</Text>
                                <Text style={styles.cardSubtitle}>Toggle global security access</Text>
                            </View>
                        </View>
                        <Switch
                            value={isPinEnabled}
                            onValueChange={setIsPinEnabled}
                            trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primaryContainer }}
                            thumbColor={theme.colors.onPrimary}
                        />
                    </View>

                    {/* Info Banner */}
                    <View style={styles.infoBanner}>
                        <MaterialCommunityIcons name="information" size={20} color={theme.colors.primary} />
                        <Text style={styles.infoText}>
                            Disabling this will remove the requirement to enter a PIN when opening the app. We recommend keeping this active to maintain the privacy of your journal.
                        </Text>
                    </View>
                </View>

                {/* Quote Section */}
                <View style={styles.quoteCard}>
                    <View style={styles.quoteDecoration1} />
                    <View style={styles.quoteDecoration2} />
                    <View style={styles.quoteContent}>
                        <MaterialCommunityIcons name="leaf" size={32} color={theme.colors.primary} />
                        <Text style={styles.quoteText}>Peace of mind is your greatest asset.</Text>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                {[
                    { icon: 'flower', label: 'Garden' },
                    { icon: 'book-open-page-variant', label: 'Journal' },
                    { icon: 'chart-bar', label: 'Insights' },
                    { icon: 'cog', label: 'Settings', active: true },
                ].map((item, idx) => (
                    <TouchableOpacity
                        key={idx}
                        style={[styles.navItem, item.active && styles.navItemActive]}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons
                            name={item.icon}
                            size={24}
                            color={item.active ? theme.colors.primary : theme.colors.onSurfaceVariant}
                        />
<Text style={[styles.navLabel, item.active && { color: theme.colors.primary }]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // giữ nguyên styles cũ
    container: { flex: 1, backgroundColor: theme.colors.background },
    bloom1: { position: 'absolute', bottom: -60, left: -60, width: 192, height: 192, backgroundColor: 'rgba(171,244,167,0.1)', borderRadius: 100 },
    bloom2: { position: 'absolute', bottom: 60, right: -40, width: 160, height: 160, backgroundColor: 'rgba(154,225,255,0.1)', borderRadius: 80 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 64, paddingBottom: 16 },
    backCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.surface, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontFamily: theme.fonts.headline, fontWeight: '700', fontSize: 20, color: theme.colors.onSurface },
    scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 80 },
    heroSection: { marginBottom: 32, alignItems: 'center' },
    heroIconContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(96,165,96,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    heroTitle: { fontFamily: theme.fonts.headline, fontWeight: '700', fontSize: 36, textAlign: 'center', marginBottom: 8, color: theme.colors.onSurface },
    heroSubtitle: { fontFamily: theme.fonts.body, fontSize: 16, textAlign: 'center', lineHeight: 22, color: theme.colors.onSurfaceVariant, opacity: 0.8 },
    options: { gap: 16 },
    card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 4, marginBottom: 12 },
    cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    cardIconBg: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    cardTitle: { fontFamily: theme.fonts.headline, fontWeight: '700', fontSize: 16, color: theme.colors.onSurface },
    cardSubtitle: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.onSurfaceVariant, opacity: 0.7 },
    infoBanner: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: theme.colors.surfaceContainerLow, padding: 16, borderRadius: 16, marginTop: 12, gap: 12 },
    infoText: { flex: 1, fontSize: 12, color: theme.colors.onSurfaceVariant, lineHeight: 18 },
    quoteCard: { marginTop: 32, borderRadius: 32, backgroundColor: theme.colors.primaryContainer, height: 160, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    quoteDecoration1: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.1)', top: -30, left: -30 },
    quoteDecoration2: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.1)', bottom: -20, right: -20 },
    quoteContent: { alignItems: 'center', paddingHorizontal: 20 },
    quoteText: { fontFamily: theme.fonts.headline, fontSize: 16, fontStyle: 'italic', fontWeight: '400', color: theme.colors.onPrimary, textAlign: 'center', marginTop: 8 },
    bottomNav: { position: 'absolute', bottom: 0, left: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 16, backgroundColor: theme.colors.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: -6 }, shadowRadius: 12, elevation: 10 },
    navItem: { alignItems: 'center', justifyContent: 'center' },
    navItemActive: { backgroundColor: theme.colors.primaryContainer, borderRadius: 24, padding: 8 },
    navLabel: { fontSize: 11, fontWeight: '600', color: theme.colors.onSurfaceVariant },
});

export default EditPinScreen;