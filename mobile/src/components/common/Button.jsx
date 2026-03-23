import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { theme } from '../../theme';

export const Button = ({ title, onPress, type = 'primary', style }) => (
    <TouchableOpacity
        style={[
            styles.button,
            type === 'primary' ? styles.primary : styles.secondary,
            style
        ]}
        onPress={onPress}
    >
        <Text style={[
            styles.text,
            type === 'primary' ? styles.primaryText : styles.secondaryText
        ]}>
            {title}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        width: '100%',
        paddingVertical: 18,
        borderRadius: theme.borderRadius.default,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primary: {
        backgroundColor: theme.colors.primary,
    },
    secondary: {
        backgroundColor: theme.colors.primaryContainer,
    },
    text: {
        fontFamily: theme.fonts.headline,
        fontWeight: '700',
        fontSize: 16,
    },
    primaryText: {
        color: theme.colors.white,
    },
    secondaryText: {
        color: theme.colors.onPrimaryContainer,
    },
});
