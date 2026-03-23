import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';

const BottomNavBar = ({ navigation, activeTab = 'Garden' }) => {
    const navItems = [
        { id: 'Garden', icon: 'filter-vintage', label: 'Garden', screen: 'Dashboard' },
        { id: 'Journal', icon: 'menu-book', label: 'Journal', screen: 'Journal' },
        { id: 'Insights', icon: 'bar-chart', label: 'Insights', screen: 'Insights' },
        { id: 'Settings', icon: 'settings', label: 'Settings', screen: 'Settings' }
    ];

    return (
        <View style={styles.container}>
            <BlurView intensity={90} style={styles.blurBackground}>
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={isActive ? styles.activeItem : styles.item}
                            onPress={() => navigation.navigate(item.screen)}
                        >
                            <MaterialIcons 
                                name={item.icon} 
                                size={24} 
                                color={isActive ? theme.colors.primary : "rgba(12, 103, 128, 0.5)"} 
                            />
                            {isActive ? (
                                <Text style={styles.activeLabel}>{item.label}</Text>
                            ) : (
                                <Text style={styles.label}>{item.label}</Text>
                            )}
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
        paddingHorizontal: 16,
        paddingBottom: 32,
        backgroundColor: 'transparent',
    },
    blurBackground: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 40,
        height: 80,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        ...theme.shadows.soft,
    },
    item: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    activeItem: {
        flex: 1.2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(39, 107, 46, 0.1)',
        height: 54,
        borderRadius: 27,
        gap: 8,
        paddingHorizontal: 12,
    },
    label: {
        fontSize: 11,
        fontWeight: '600',
        color: 'rgba(12, 103, 128, 0.5)',
    },
    activeLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: theme.colors.primary,
    }
});

export default BottomNavBar;
