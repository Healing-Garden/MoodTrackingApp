import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    StatusBar,
    Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

            {/* Background blobs */}
            <View style={styles.blob2} />

            {/* Header */}
            <View style={styles.header}>
                <MaterialIcons name="spa" size={32} color="#276b2e" />
                <Text style={styles.brand}>Healing Garden</Text>
            </View>

            {/* Illustration */}
            <View style={styles.illustrationWrapper}>
                <View style={styles.blobBackground} />
                <View style={styles.glassCard}>
                    <View style={styles.gradientCircle}>
                        <MaterialIcons name="psychology" size={72} color="#fff" style={{ fill: 1 }} />
                        <View style={styles.floatingIcon}>
                            <MaterialIcons name="chat" size={24} color="#4c3e00" />
                        </View>
                    </View>
                </View>
                {/* Visual Decorations */}
                <View style={styles.decoFlower}>
                    <MaterialIcons name="local-florist" size={60} color="rgba(39, 107, 46, 0.3)" />
                </View>
                <View style={styles.decoPlant}>
                    <MaterialIcons name="potted-plant" size={50} color="rgba(0, 77, 98, 0.2)" />
                </View>
            </View>

            {/* Content Area */}
            <View style={styles.content}>
                <Text style={styles.title}>You are not alone</Text>
                <Text style={styles.description}>
                    Our chatbot is always listening and supporting you <Text style={styles.highlight}>24/7</Text> to soothe your mind.
                </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.stepper}>
                    <View style={styles.activeStep} />
                    <View style={styles.inactiveStep} />
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("OnboardingIntro2")}
                >
                    <LinearGradient
                        colors={['#276b2e', '#60a560']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>Next</Text>
                        <MaterialIcons name="arrow-forward" size={24} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.skip}>Skip Introduction</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ebffe6",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 32,
        paddingBottom: 40,
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
        marginTop: Platform.OS === "android" ? 40 : 60,
    },

    brand: {
        fontSize: 22,
        fontWeight: "900",
        color: "#276b2e",
        fontFamily: Platform.OS === 'ios' ? 'Plus Jakarta Sans' : 'sans-serif',
    },

    illustrationWrapper: {
        position: 'relative',
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

    gradientCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: "#276b2e",
        alignItems: "center",
        justifyContent: "center",
    },

    floatingIcon: {
        position: "absolute",
        top: -8,
        right: -8,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#FCA308",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },

    decoFlower: {
        position: 'absolute',
        bottom: -16,
        left: -16,
        transform: [{ rotate: '12deg' }],
    },

    decoPlant: {
        position: 'absolute',
        top: '50%',
        right: -32,
        transform: [{ rotate: '-45deg' }],
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

    highlight: {
        fontWeight: "700",
        color: "#276b2e",
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

    activeStep: {
        width: 32,
        height: 10,
        backgroundColor: "#276b2e",
        borderRadius: 5,
    },

    inactiveStep: {
        width: 10,
        height: 10,
        backgroundColor: "#60a560",
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

    skip: {
        color: "#40493e",
        fontSize: 14,
        fontWeight: '600',
    },
});
