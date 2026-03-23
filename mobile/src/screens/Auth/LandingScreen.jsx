import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const LandingScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ImageBackground
                source={{
                    uri: "https://lh3.googleusercontent.com/aida/ADBb0uhYO9EWGyVXHGrCKtWFPMU24NNkVhSYn9f6ryGAKjbEgg4hvCREGom1cQuEJJIbSdjwM8uTBRHfJRQLovR-kN1YVAZqqWQXezvTfhaRAEJAovG5R3LU6JBJ_Dm72afXQnRxBwxpyamUXFYs5OXHQVNJ4fN_p2RM75GVZhCbuil9JojMBoIuKZyyWT_m2R31Fi2OMtlWa_4d4UVqZRmEqvnI0i8_JSzsFyIGopzsWRYp95sEr99wD2_kgjHiTaz0zdTTl4BAQpE1",
                }}
                style={styles.background}
                resizeMode="cover"
            >
                {/* overlay */}
                <View style={styles.overlay} />

                <View style={styles.content}>
                    {/* slogan */}
                    <View>
                        <Text style={styles.slogan}>
                            Nơi tâm hồn{"\n"}
                            tìm lại sự{" "}
                            <Text style={styles.sloganHighlight}>tĩnh lặng</Text>
                        </Text>
                    </View>

                    {/* buttons */}
                    <View style={styles.buttonContainer}>
                        {/* Start */}
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => navigation.navigate("OnboardingWelcome")}
                        >
                            <BlurView intensity={50} tint="dark" style={styles.primaryButton}>
                                <Text style={styles.primaryText}>Bắt đầu hành trình mới</Text>
                                <MaterialIcons name="arrow-forward" size={22} color="#fff" />
                            </BlurView>
                        </TouchableOpacity>

                        {/* Login */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate("Login")}
                        >
                            <BlurView intensity={40} tint="light" style={styles.secondaryButton}>
                                <Text style={styles.secondaryText}>Đã có tài khoản</Text>
                            </BlurView>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

export default LandingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    background: {
        flex: 1,
        justifyContent: "flex-end",
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.08)",
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
        color: "#04210a",
        fontWeight: "500",
    },

    sloganHighlight: {
        fontStyle: "italic",
        color: "#276b2e",
    },

    buttonContainer: {
        gap: 16,
    },

    primaryButton: {
        height: 60,
        borderRadius: 30,
        backgroundColor: "rgba(6,78,59,0.85)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
    },

    primaryText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },

    secondaryButton: {
        height: 60,
        borderRadius: 30,
        backgroundColor: "rgba(255,255,255,0.3)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.4)",
    },

    secondaryText: {
        color: "#04320a",
        fontSize: 17,
        fontWeight: "600",
    },
});