import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const IntroTwoScreen = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Background blobs */}
            <View style={styles.blob2} />

            {/* Header */}
            <View style={styles.header}>
                <MaterialIcons name="spa" size={32} color="#276b2e" />
                <Text style={styles.brand}>Healing Garden</Text>
            </View>

            {/* Illustration Area */}
            <View style={styles.illustrationWrapper}>
                <View style={styles.blobBackground} />
                <View style={styles.glassCard}>
                    <View style={styles.chartContainer}>
                        <View style={styles.barRow}>
                            <View style={[styles.bar, { height: '30%', backgroundColor: 'rgba(154, 225, 255, 0.4)' }]} />
                            <View style={[styles.bar, { height: '50%', backgroundColor: 'rgba(154, 225, 255, 0.6)' }]} />
                            <View style={[styles.bar, { height: '85%', backgroundColor: '#0c6780' }]}>
                                <View style={styles.flowerTip}>
                                    <MaterialIcons name="local-florist" size={16} color="#caa910" />
                                </View>
                            </View>
                            <View style={[styles.bar, { height: '65%', backgroundColor: 'rgba(154, 225, 255, 0.7)' }]} />
                            <View style={[styles.bar, { height: '40%', backgroundColor: 'rgba(154, 225, 255, 0.5)' }]} />
                        </View>

                        <View style={styles.moodIndicatorGrid}>
                            <View style={styles.moodDotSmall}><MaterialIcons name="circle" size={8} color="rgba(12, 103, 128, 0.4)" /></View>
                            <View style={styles.moodDotLarge}><MaterialIcons name="mood" size={12} color="#0c6780" /></View>
                            <View style={styles.moodDotSmall}><MaterialIcons name="circle" size={8} color="rgba(12, 103, 128, 0.4)" /></View>
                            <View style={styles.moodDotWarning}><MaterialIcons name="sunny" size={12} color="#705d00" /></View>
                            <View style={styles.moodDotSmall}><MaterialIcons name="circle" size={8} color="rgba(12, 103, 128, 0.4)" /></View>
                            <View style={styles.moodDotLarge}><MaterialIcons name="sentiment-satisfied" size={12} color="#0c6780" /></View>
                            <View style={styles.moodDotSmall}><MaterialIcons name="circle" size={8} color="rgba(12, 103, 128, 0.4)" /></View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Content Area */}
            <View style={styles.content}>
                <Text style={styles.title}>Track Spiritual Growth</Text>
                <Text style={styles.description}>
                    Record daily emotions and look back at your own healing journey through every moment.
                </Text>
            </View>

            {/* Footer Actions */}
            <View style={styles.footer}>
                <View style={styles.stepper}>
                    <View style={styles.inactiveDot} />
                    <View style={styles.activePill} />
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Login')}
                >
                    <LinearGradient
                        colors={['#276b2e', '#60a560']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>Go to Login Page</Text>
                        <MaterialIcons name="arrow-forward" size={24} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>

                <View style={{ height: 36 }} />
            </View>
        </View>
    );
};

export default IntroTwoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ebffe6",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 64,
        paddingHorizontal: 32,
    },

    blob2: {
        position: "absolute",
        bottom: "-10%",
        right: "-10%",
        width: "70%",
        height: "40%",
        backgroundColor: "rgba(96, 165, 96, 0.2)",
        borderRadius: 150,
        opacity: 0.5,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    brand: {
        fontSize: 22,
        fontWeight: "900",
        color: "#276b2e",
    },

    illustrationWrapper: {
        width: 288,
        height: 288,
        alignItems: 'center',
        justifyContent: 'center',
    },

    blobBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(96, 165, 96, 0.1)',
        borderRadius: 100,
        transform: [{ scale: 1.25 }],
    },

    glassCard: {
        width: 288,
        height: 288,
        borderRadius: 100,
        backgroundColor: "#f1fbeb",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#276b2e",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.05,
        shadowRadius: 40,
        elevation: 5,
    },

    chartContainer: {
        width: '100%',
        paddingHorizontal: 32,
    },

    barRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 96,
        gap: 6,
    },

    bar: {
        flex: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },

    flowerTip: {
        position: 'absolute',
        top: -12,
        left: '50%',
        transform: [{ translateX: -8 }],
    },

    moodIndicatorGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },

    moodDotSmall: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#dbfdd7',
        alignItems: 'center',
        justifyContent: 'center',
    },

    moodDotLarge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#baeaff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    moodDotWarning: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(202, 169, 16, 0.3)',
        borderWidth: 2,
        borderColor: 'rgba(202, 169, 16, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    content: {
        alignItems: 'center',
        width: '100%',
    },

    title: {
        fontSize: 36,
        fontWeight: "900",
        textAlign: "center",
        marginBottom: 24,
        color: "#06210a",
        lineHeight: 44,
    },

    description: {
        fontSize: 18,
        textAlign: "center",
        color: "#40493e",
        lineHeight: 28,
        paddingHorizontal: 16,
        opacity: 0.9,
    },

    footer: {
        width: "100%",
        alignItems: "center",
        gap: 32,
    },

    stepper: {
        flexDirection: "row",
        gap: 12,
    },

    inactiveDot: {
        width: 10,
        height: 10,
        backgroundColor: "#60a560",
        borderRadius: 5,
    },

    activePill: {
        width: 32,
        height: 10,
        backgroundColor: "#276b2e",
        borderRadius: 5,
    },

    button: {
        width: "100%",
        borderRadius: 16,
        overflow: 'hidden',
    },

    buttonGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 64,
        gap: 8,
    },

    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "800",
    },
});
