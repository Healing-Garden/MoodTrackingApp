import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }) => {
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
                <View style={styles.blurCard}>
                    <View style={styles.gradientCircle}>
                        <MaterialIcons name="psychology" size={64} color="#fff" />

                        <View style={styles.floatingIcon}>
                            <MaterialIcons name="chat" size={24} color="#4c3e00" />
                        </View>
                    </View>
                </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>Bạn không đơn độc</Text>

            {/* Description */}
            <Text style={styles.description}>
                Chatbot của chúng mình luôn lắng nghe và hỗ trợ bạn{" "}
                <Text style={styles.highlight}>24/7</Text> để xoa dịu tâm trí.
            </Text>

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
                    <Text style={styles.buttonText}>Tiếp theo</Text>
                    <MaterialIcons name="arrow-forward" size={22} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.skip}>Bỏ qua giới thiệu</Text>
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
        paddingHorizontal: 32,
        paddingTop: 80,
    },

    blob1: {
        position: "absolute",
        top: -120,
        left: -80,
        width: 300,
        height: 200,
        backgroundColor: "#d0f1cc",
        borderRadius: 120,
        opacity: 0.6,
    },

    blob2: {
        position: "absolute",
        bottom: -120,
        right: -80,
        width: 260,
        height: 180,
        backgroundColor: "#60a560",
        borderRadius: 120,
        opacity: 0.2,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 40,
    },

    brand: {
        fontSize: 20,
        fontWeight: "800",
        color: "#276b2e",
    },

    illustrationWrapper: {
        marginBottom: 40,
    },

    blurCard: {
        width: 260,
        height: 260,
        borderRadius: 80,
        backgroundColor: "rgba(255,255,255,0.4)",
        alignItems: "center",
        justifyContent: "center",
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
        top: -10,
        right: -10,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#caa910",
        alignItems: "center",
        justifyContent: "center",
    },

    title: {
        fontSize: 32,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 16,
        color: "#06210a",
    },

    description: {
        fontSize: 18,
        textAlign: "center",
        color: "#40493e",
        marginBottom: 40,
        paddingHorizontal: 12,
    },

    highlight: {
        fontWeight: "700",
        color: "#276b2e",
    },

    footer: {
        width: "100%",
        alignItems: "center",
        gap: 20,
    },

    stepper: {
        flexDirection: "row",
        gap: 10,
    },

    activeStep: {
        width: 32,
        height: 6,
        backgroundColor: "#276b2e",
        borderRadius: 4,
    },

    inactiveStep: {
        width: 10,
        height: 6,
        backgroundColor: "#60a560",
        borderRadius: 4,
    },

    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 60,
        backgroundColor: "#276b2e",
        borderRadius: 20,
        gap: 8,
    },

    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },

    skip: {
        marginTop: 8,
        color: "#40493e",
        fontSize: 14,
    },
});