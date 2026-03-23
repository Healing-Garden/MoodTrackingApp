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
            <View style={styles.blob1} />
            <View style={styles.blob2} />

            {/* Header */}
            <View style={styles.header}>
                <MaterialIcons name="spa" size={28} color="#276b2e" />
                <Text style={styles.brand}>Healing Garden</Text>
            </View>

            {/* Illustration */}
            <View style={styles.illustrationWrapper}>

                <View style={styles.blobBackground} />

                <View style={styles.glassCard}>

                    <View style={styles.chart}>

                        <View style={styles.barRow}>
                            <View style={[styles.bar, { height: '30%', backgroundColor: '#9ae1ff40' }]} />
                            <View style={[styles.bar, { height: '50%', backgroundColor: '#9ae1ff60' }]} />
                            <View style={[styles.bar, { height: '85%', backgroundColor: '#0c6780' }]}>
                                <MaterialIcons
                                    name="local-florist"
                                    size={18}
                                    color="#caa910"
                                    style={styles.flower}
                                />
                            </View>
                            <View style={[styles.bar, { height: '65%', backgroundColor: '#9ae1ff70' }]} />
                            <View style={[styles.bar, { height: '40%', backgroundColor: '#9ae1ff50' }]} />
                        </View>

                        <View style={styles.moodGrid}>

                            {['circle', 'mood', 'circle', 'sunny', 'circle', 'sentiment-satisfied', 'circle']
                                .map((icon, i) => (
                                    <View key={i} style={styles.moodItem}>
                                        <MaterialIcons
                                            name={icon}
                                            size={12}
                                            color="#0c6780"
                                        />
                                    </View>
                                ))}

                        </View>

                    </View>

                </View>

            </View>

            {/* Title */}
            <Text style={styles.title}>
                Track Your Soul's Growth
            </Text>

            {/* Description */}
            <Text style={styles.description}>
                Record your daily emotions and look back at your own healing journey through every moment.
            </Text>

            {/* Footer */}
            <View style={styles.footer}>

                <View style={styles.stepper}>
                    <View style={styles.dot} />
                    <View style={styles.barActive} />
                </View>

                <LinearGradient
                    colors={['#276b2e', '#60a560']}
                    style={styles.button}
                >

                    <TouchableOpacity
                        style={styles.buttonInner}
                        onPress={() => navigation.navigate('Login')}
                    >

                        <Text style={styles.buttonText}>
                            Go to Login
                        </Text>

                        <MaterialIcons
                            name="arrow-forward"
                            size={22}
                            color="#fff"
                        />

                    </TouchableOpacity>

                </LinearGradient>

                <View style={{ height: 36 }} />

            </View>

        </View>
    );
};

export default IntroTwoScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#ebffe6',
        alignItems: 'center',
        paddingTop: 80,
        paddingHorizontal: 32
    },

    blob1: {
        position: 'absolute',
        top: -120,
        left: -120,
        width: 300,
        height: 200,
        backgroundColor: '#d0f1cc',
        borderRadius: 200,
        opacity: 0.6
    },

    blob2: {
        position: 'absolute',
        bottom: -120,
        right: -120,
        width: 260,
        height: 180,
        backgroundColor: '#60a560',
        borderRadius: 200,
        opacity: 0.2
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 40
    },

    brand: {
        fontSize: 20,
        fontWeight: '800',
        color: '#276b2e'
    },

    illustrationWrapper: {
        alignItems: 'center',
        marginBottom: 48
    },

    blobBackground: {
        position: 'absolute',
        width: 260,
        height: 260,
        backgroundColor: 'rgba(39,107,46,0.1)',
        borderRadius: 200
    },

    glassCard: {
        width: 260,
        height: 260,
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: 80,
        justifyContent: 'center',
        paddingHorizontal: 24
    },

    chart: {
        gap: 20
    },

    barRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 90,
        gap: 6
    },

    bar: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },

    flower: {
        position: 'absolute',
        top: -12,
        alignSelf: 'center'
    },

    moodGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    moodItem: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#dbfdd7',
        justifyContent: 'center',
        alignItems: 'center'
    },

    title: {
        fontSize: 32,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 20,
        color: '#06210a'
    },

    description: {
        fontSize: 18,
        textAlign: 'center',
        color: '#40493e',
        marginBottom: 40,
        paddingHorizontal: 16
    },

    footer: {
        width: '100%',
        alignItems: 'center'
    },

    stepper: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20
    },

    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#60a560'
    },

    barActive: {
        width: 32,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#276b2e'
    },

    button: {
        width: '100%',
        borderRadius: 16
    },

    buttonInner: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },

    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700'
    }

});