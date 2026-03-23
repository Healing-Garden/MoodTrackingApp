import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Dimensions,
} from 'react-native';
import { theme } from '../../theme';
import { MaterialSymbols } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ChangePinScreen = ({ navigation }) => {
    const [pin, setPin] = useState(['', '', '', '']);
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" transparent backgroundColor="transparent" />

            {/* Decorative Blooms */}
            <View style={styles.bloom1} />
            <View style={styles.bloom2} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backCircle}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialSymbols name="arrow_back" size={28} color={theme.colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>App Lock PIN</Text>
                <View style={{ width: 48 }} />
            </View>

            <View style={styles.content}>
                {/* Identity Section */}
                <View style={styles.identity}>
                    <View style={styles.lockIconBg}>
                        <MaterialSymbols name="lock" size={40} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.identityTitle}>Change App Lock PIN</Text>
                    <Text style={styles.identitySubtitle}>
                        Enter your new 4-digit security code to keep your garden private.
                    </Text>
                </View>

                {/* PIN Dots */}
                <View style={styles.pinSection}>
                    {pin.map((p, i) => (
                        <View
                            key={i}
                            style={[
                                styles.pinDot,
                                p !== '' && styles.pinDotActive
                            ]}
                        />
                    ))}
                </View>

                {/* Keypad */}
                <View style={styles.keypad}>
                    {keys.map((key, i) =>
                        key === '' ? <View key={i} style={styles.keyPlaceholder} /> : (
                            <TouchableOpacity
                                key={i}
                                style={[styles.key, key === 'delete' && styles.deleteKey]}
                            >
                                {key === 'delete' ? (
                                    <MaterialSymbols name="backspace" size={28} color={theme.colors.primary} />
                                ) : (
                                    <Text style={styles.keyText}>{key}</Text>
                                )}
                            </TouchableOpacity>
                        )
                    )}
                </View>

                {/* Secondary Action */}
                <TouchableOpacity style={styles.forgotBtn}>
                    <Text style={styles.forgotText}>FORGOT PIN?</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    bloom1: {
        position: 'absolute',
        top: '25%',
        right: -48,
        width: 192,
        height: 192,
        backgroundColor: 'rgba(96, 165, 96, 0.2)',
        borderRadius: 96,
        opacity: 0.5,
    },
    bloom2: {
        position: 'absolute',
        bottom: '25%',
        left: -64,
        width: 256,
        height: 256,
        backgroundColor: 'rgba(154, 225, 255, 0.2)',
        borderRadius: 128,
        opacity: 0.4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 64,
        paddingBottom: 24,
        width: '100%',
    },
    backCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.surfaceContainerHigh,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        maxWidth: 360,
        paddingHorizontal: 24,
        paddingTop: 48,
    },
    identity: {
        alignItems: 'center',
        marginBottom: 48,
    },
    lockIconBg: {
        width: 80,
        height: 80,
        backgroundColor: theme.colors.surfaceContainerHigh,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    identityTitle: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 24,
        fontWeight: '800',
        color: theme.colors.onSurface,
        textAlign: 'center',
        marginBottom: 8,
    },
    identitySubtitle: {
        fontFamily: 'Be Vietnam Pro',
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: 280,
    },
    pinSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        marginBottom: 48,
    },
    pinDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: theme.colors.surfaceContainerHighest,
        borderWidth: 2,
        borderColor: 'rgba(39, 107, 46, 0.2)',
    },
    pinDotActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    keypad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 24,
        marginBottom: 24,
    },
    key: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.surfaceContainerLow,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteKey: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(39, 107, 46, 0.2)',
    },
    keyPlaceholder: {
        width: 80,
        height: 80,
    },
    keyText: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    forgotBtn: {
        marginTop: 32,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(39, 107, 46, 0.2)',
    },
    forgotText: {
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 2,
        color: theme.colors.primary,
    },
});

export default ChangePinScreen;