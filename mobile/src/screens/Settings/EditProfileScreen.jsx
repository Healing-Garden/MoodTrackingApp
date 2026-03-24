import React, { useState, useCallback } from 'react';
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
    Alert,
    ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const EditProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [fullName, setFullName] = useState("");
    const [age, setAge] = useState("");
    const [heightCm, setHeightCm] = useState("");
    const [weight, setWeight] = useState("");
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const fetchProfile = async () => {
                try {
                    const res = await api.get('/profile');
                    const u = res.data.user;
                    setUser(u);
                    setFullName(u.fullName || "");
                    setAge(u.age ? String(u.age) : "");
                    setHeightCm(u.heightCm ? String(u.heightCm) : "");
                    setWeight(u.weight ? String(u.weight) : "");
                } catch (error) {
                    console.log('Error fetching profile:', error);
                }
            };
            fetchProfile();
        }, [])
    );

    const getAvatarSource = () => {
        if (user && user.avatarUrl) {
            const url = user.avatarUrl;
            if (url.startsWith('http')) return { uri: url };
            return { uri: `http://192.168.1.245:8080${url}` };
        }
        return { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxK9JJUv2t360QguJF7wk7l4JN_wrUSdRzRXL2TiMMd424laXQ0OhoQ4_TdNxx3Z4WRAgTkP4d5ZO-PSGuJ3azvhPC5UjZLn190iSOllhLxTD8n7dESwFUyH--HR72i8nEAjUePnE5sp-OWBugSGtVCXqFp4QicCDppgeCql_yuDo5QVgmWqe9xkOG4WZVrvcVSGDbg7smMKquuDbeJdn_F_xb71zMPWN_ku3ixgJVzjo8KW56GAOfDT9jETsJ24Tw7Id3v5oKmss' };
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/profile', {
                fullName,
                age: parseInt(age) || undefined,
                heightCm: parseInt(heightCm) || undefined,
                weight: parseInt(weight) || undefined,
            });
            Alert.alert("Success", "Profile updated successfully!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to update profile.");
            console.log(error);
        } finally {
            setSaving(false);
        }
    };

    const handleUploadAvatar = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            let uri = result.assets[0].uri;
            let filename = uri.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;

            let formData = new FormData();
            formData.append('avatar', {
                uri,
                name: filename,
                type,
            });

            setUploading(true);
            try {
                const res = await api.post('/profile/avatar', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setUser(res.data.user || { ...user, avatarUrl: res.data.avatarUrl });
                Alert.alert("Success", "Avatar updated successfully!");
            } catch (error) {
                Alert.alert("Error", "Failed to upload image.");
                console.log(error);
            } finally {
                setUploading(false);
            }
        }
    };
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color={theme.colors.onSurface} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving || uploading}>
                    {saving ? (
                        <ActivityIndicator size="small" color={theme.colors.onPrimaryContainer} />
                    ) : (
                        <Text style={styles.saveText}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.moodBloom} />
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarWrapper}>
                            {user?.avatarUrl ? (
                                <Image source={getAvatarSource()} style={styles.avatar} />
                            ) : (
                                <View style={[styles.avatar, { backgroundColor: 'rgba(39, 107, 46, 0.2)', justifyContent: 'center', alignItems: 'center' }]}>
                                    <Text style={{ fontSize: 60, fontWeight: 'bold', color: '#276b2e' }}>
                                        {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                    </Text>
                                </View>
                            )}
                            {uploading && (
                                <View style={styles.uploadOverlay}>
                                    <ActivityIndicator color="#fff" size="large" />
                                    <Text style={styles.uploadText}>Uploading...</Text>
                                </View>
                            )}
                        </View>
                        <TouchableOpacity style={styles.avatarEdit} onPress={handleUploadAvatar} disabled={uploading}>
                            <MaterialIcons name="camera-alt" size={20} color={theme.colors.onPrimaryContainer} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.avatarLabel}>TAP TO UPDATE PHOTO</Text>
                </View>

                {/* Form Section */}
                <View style={styles.form}>
                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={[styles.inputWrapper, { backgroundColor: '#f0f0f0' }]}>
                                <MaterialIcons name="email" size={20} color={theme.colors.onSurfaceVariant} style={styles.icon} />
                                <TextInput style={[styles.input, { color: theme.colors.onSurfaceVariant }]} value={user?.email || ""} editable={false} />
                            </View>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="person" size={20} color={theme.colors.primary} style={styles.icon} />
                                <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
                            </View>
                        </View>

                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Age</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="calendar-today" size={20} color={theme.colors.primary} style={styles.icon} />
                                <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />
                            </View>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Height (cm)</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="straighten" size={20} color={theme.colors.primary} style={styles.icon} />
                                <TextInput style={styles.input} value={heightCm} onChangeText={setHeightCm} keyboardType="numeric" />
                            </View>
                        </View>

                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Weight (kg)</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="monitor-weight" size={20} color={theme.colors.primary} style={styles.icon} />
                                <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" />
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 64, paddingBottom: 16 },
    backCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.surface, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontFamily: 'Plus Jakarta Sans', fontSize: 18, fontWeight: '700', color: theme.colors.onSurface },
    saveButton: { backgroundColor: theme.colors.primaryContainer, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, minWidth: 60, alignItems: 'center', justifyContent: 'center' },
    saveText: { fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: '700', color: theme.colors.onPrimaryContainer },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 32 },
    avatarSection: { alignItems: 'center', marginBottom: 48 },
    avatarContainer: { position: 'relative', marginTop: 16 },
    avatarWrapper: { width: 160, height: 160, borderRadius: 80, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, backgroundColor: theme.colors.surfaceContainerLowest, justifyContent: 'center', alignItems: 'center' },
    uploadOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
    uploadText: { color: '#fff', fontSize: 12, fontWeight: '600', marginTop: 8 },
    avatar: { width: '100%', height: '100%', borderRadius: 80, borderWidth: 4, borderColor: theme.colors.surfaceContainerLowest },
    avatarEdit: { position: 'absolute', bottom: 4, right: 4, backgroundColor: theme.colors.primaryContainer, padding: 12, borderRadius: 24, justifyContent: 'center', alignItems: 'center', zIndex: 10, elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6 },
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
});

export default EditProfileScreen;