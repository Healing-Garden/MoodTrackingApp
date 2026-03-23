import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';

const AdminBottomNavBar = ({ navigation, activeTab = 'Dashboard' }) => {
    const navItems = [
        { id: 'Dashboard', icon: 'dashboard', label: 'Dashboard', screen: 'AdminDashboard' },
        { id: 'Feedback', icon: 'forum', label: 'Feedback', screen: 'AdminFeedback' },
        { id: 'Users', icon: 'group', label: 'Users', screen: 'AdminUsers' },
        { id: 'Content', icon: 'auto_stories', label: 'Content', screen: 'AdminContent' },
        { id: 'Settings', icon: 'settings', label: 'Settings', screen: 'AdminSettings' }
    ];

    return (
        <View style={styles.container}>
            <BlurView intensity={90} style={styles.blurBackground}>
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.item}
                            onPress={() => navigation.navigate(item.screen)}
                        >
                            <MaterialIcons 
                                name={item.icon} 
                                size={24} 
                                color={isActive ? theme.colors.primary : "rgba(39, 107, 46, 0.4)"} 
                                style={isActive ? styles.activeIcon : null}
                            />
                            <Text style={[styles.label, isActive && styles.activeLabel]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
    },
    blurBackground: {
        flexDirection: 'row',
        backgroundColor: 'rgba(235, 255, 230, 0.9)',
        height: Platform.OS === 'ios' ? 90 : 70,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        ...theme.shadows.soft,
    },
    item: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    activeIcon: {
        transform: [{ scale: 1.1 }],
    },
    label: {
        fontSize: 10,
        fontWeight: '600',
        color: 'rgba(39, 107, 46, 0.5)',
        fontFamily: theme.fonts.label,
    },
    activeLabel: {
        color: theme.colors.primary,
        fontWeight: '800',
    }
});

export default AdminBottomNavBar;
