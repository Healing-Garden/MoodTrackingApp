import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    StyleSheet,
    StatusBar,
    Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');

const EditProfileScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color={theme.colors.onSurface} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.moodBloom} />
                    <View style={styles.avatarWrapper}>
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxK9JJUv2t360QguJF7wk7l4JN_wrUSdRzRXL2TiMMd424laXQ0OhoQ4_TdNxx3Z4WRAgTkP4d5ZO-PSGuJ3azvhPC5UjZLn190iSOllhLxTD8n7dESwFUyH--HR72i8nEAjUePnE5sp-OWBugSGtVCXqFp4QicCDppgeCql_yuDo5QVgmWqe9xkOG4WZVrvcVSGDbg7smMKquuDbeJdn_F_xb71zMPWN_ku3ixgJVzjo8KW56GAOfDT9jETsJ24Tw7Id3v5oKmss' }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity style={styles.avatarEdit}>
                            <MaterialIcons name="edit" size={20} color={theme.colors.onPrimaryContainer} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.avatarLabel}>TAP TO UPDATE PHOTO</Text>
                </View>

                {/* Form Section */}
                <View style={styles.form}>
                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="person" size={20} color={theme.colors.primary} style={styles.icon} />
                                <TextInput style={styles.input} value="Seraphina Rose" />
                            </View>
                        </View>

                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Age</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="calendar-today" size={20} color={theme.colors.primary} style={styles.icon} />
                                <TextInput style={styles.input} value="28" keyboardType="numeric" />
                            </View>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Height (cm)</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="straighten" size={20} color={theme.colors.primary} style={styles.icon} />
                                <TextInput style={styles.input} value="168" keyboardType="numeric" />
                            </View>
                        </View>

                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Weight (kg)</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="monitor-weight" size={20} color={theme.colors.primary} style={styles.icon} />
                                <TextInput style={styles.input} value="62" keyboardType="numeric" />
                            </View>
                        </View>
                    </View>

                    {/* Garden Intentions */}
                    <View style={styles.gardenSection}>
                        <Text style={styles.sectionTitle}>Garden Intentions</Text>
                        <View style={styles.gardenTags}>
                            <Text style={styles.tag}>Mental Clarity</Text>
                            <Text style={styles.tag}>Morning Walks</Text>
                            <Text style={styles.addTag}>+ Add Goal</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* BottomNavBar */}
            <View style={styles.bottomNav}>
                {['home', 'potted-plant', 'auto-stories', 'person'].map((icon, i) => (
                    <TouchableOpacity key={i} style={[styles.navItem, icon === 'person' && styles.activeNavItem]}>
                        <MaterialIcons name={icon} size={24} color={icon === 'person' ? theme.colors.green900 : theme.colors.stone500} />
                        <Text style={[styles.navLabel, icon === 'person' && { color: theme.colors.green900 }]}>
                            {['Home', 'Garden', 'Journal', 'Profile'][i]}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 64, paddingBottom: 16 },
    backCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.surface, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontFamily: 'Plus Jakarta Sans', fontSize: 18, fontWeight: '700', color: theme.colors.onSurface },
    saveButton: { backgroundColor: theme.colors.primaryContainer, paddingHorizontal: 16, paddingVertical: 4, borderRadius: 999 },
    saveText: { fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: '700', color: theme.colors.onPrimaryContainer },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 32 },
    avatarSection: { alignItems: 'center', marginBottom: 48 },
    avatarWrapper: { width: 160, height: 160, borderRadius: 24, overflow: 'hidden', marginTop: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10 },
    avatar: { width: '100%', height: '100%', borderRadius: 24, borderWidth: 4, borderColor: theme.colors.surfaceContainerLowest },
    avatarEdit: { position: 'absolute', bottom: -8, right: -8, backgroundColor: theme.colors.primaryContainer, padding: 8, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    avatarLabel: { marginTop: 16, fontFamily: 'Plus Jakarta Sans', fontSize: 12, fontWeight: '500', color: theme.colors.outline, letterSpacing: 1 },
    moodBloom: { position: 'absolute', width: 240, height: 240, backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 120, top: -40, zIndex: -1, transform: [{ rotate: '12deg' }], opacity: 0.5 },
    form: { marginTop: 32 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap' },
    inputGroup: { flexBasis: '48%' },
    label: { fontFamily: 'Plus Jakarta Sans', fontSize: 10, fontWeight: '700', color: theme.colors.primary + 'B3', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceContainerHigh, borderRadius: 999, paddingHorizontal: 24, paddingVertical: 16 },
    input: { flex: 1, fontFamily: 'Be Vietnam Pro', fontSize: 14, color: theme.colors.onSurface },
    icon: { marginRight: 16 },
    gardenSection: { marginTop: 24 },
    sectionTitle: { fontFamily: 'Plus Jakarta Sans', fontSize: 18, fontWeight: '700', color: theme.colors.onSurface, marginBottom: 16 },
    gardenTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    tag: { backgroundColor: '#D1F7D6', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 999, fontFamily: 'Be Vietnam Pro', fontSize: 12, fontWeight: '500', color: '#276B2E' },
    addTag: { backgroundColor: theme.colors.surfaceContainerHigh, borderWidth: 1, borderColor: theme.colors.outlineVariant, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 999, fontFamily: 'Be Vietnam Pro', fontSize: 12, fontWeight: '500', color: theme.colors.stone500 },
    bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 24, backgroundColor: theme.colors.surface, borderTopLeftRadius: 48, borderTopRightRadius: 48, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: -12 }, shadowRadius: 32 },
    navItem: { justifyContent: 'center', alignItems: 'center' },
    activeNavItem: { backgroundColor: '#D1F7D6', paddingHorizontal: 20, paddingVertical: 6, borderRadius: 999 },
    navLabel: { fontFamily: 'Be Vietnam Pro', fontSize: 11, fontWeight: '500', marginTop: 2, color: theme.colors.stone500 },
});

export default EditProfileScreen;