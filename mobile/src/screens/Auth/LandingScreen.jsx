import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Video, ResizeMode } from "expo-av"; // Thêm import Video

const LandingScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <Video
                source={require("../../../assets/videos/Video 1.mp4")} // Đường dẫn đến video trong folder public
                style={styles.background}
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping
                isMuted
            />

            {/* overlay */}
            <View style={styles.overlay} />

            <View style={styles.content}>
                {/* slogan */}
                <View>
                    <Text style={styles.slogan}>
                        Where your soul{"\n"}
                        finds its{" "}
                        <Text style={styles.sloganHighlight}>tranquility</Text>
                    </Text>
                </View>

                {/* buttons */}
                <View style={styles.buttonContainer}>
                    {/* Start */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate("OnboardingStep1")}
                    >
                        <BlurView intensity={50} tint="dark" style={styles.primaryButton}>
                            <Text style={styles.primaryText}>Begin a new journey</Text>
                            <MaterialIcons name="arrow-forward" size={22} color="#fff" />
                        </BlurView>
                    </TouchableOpacity>

                    {/* Login */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate("Login")}
                    >
                        <BlurView intensity={40} tint="light" style={styles.secondaryButton}>
                            <Text style={styles.secondaryText}>Already have an account</Text>
                        </BlurView>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default LandingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    background: {
        ...StyleSheet.absoluteFillObject, // Thay đổi để video phủ toàn màn hình
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)", // Tăng độ tối overlay cho video
    },

    content: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 28,
        paddingTop: 100,
        paddingBottom: 50,
    },

    slogan: {
        fontSize: 36,
        lineHeight: 44,
        color: "#fff", // Đổi màu chữ cho phù hợp với video
        fontWeight: "500",
    },

    sloganHighlight: {
        fontStyle: "italic",
        color: "#a8e6cf", // Màu sáng hơn cho highlight
    },

    buttonContainer: {
        gap: 16,
    },

    primaryButton: {
        height: 60,
        borderRadius: 30,
        backgroundColor: "rgba(255, 202, 123, 0.9)", // Tăng độ tối
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
    },
    

    primaryText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },

    secondaryButton: {
        height: 60,
        borderRadius: 30,
        backgroundColor: "rgba(255,255,255,0.25)", // Giảm độ trong suốt
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.5)",
    },

    secondaryText: {
        color: "#fff", // Đổi màu chữ cho phù hợp
        fontSize: 17,
        fontWeight: "600",
    },
});