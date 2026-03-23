import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    StatusBar,
    ScrollView,
    Dimensions,
    Image,
    ActivityIndicator,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../theme";
import api, { setAuthToken } from "../../services/api";

const { width, height } = Dimensions.get("window");

const RegisterScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!fullName || !email || !password) {
            Alert.alert("Error", "Please fill in all information.");
            return;
        }

        setLoading(true);
        try {
            await api.post("/auth/register", {
                fullName,
                email,
                password,
            });

            setShowOtp(true);
            Alert.alert("Success", "OTP code has been sent to your email.");
        } catch (error) {
            console.error("Registration initial failed:", error);
            const errorMsg = error.response?.data?.message || "Registration failed. Email might already exist.";
            Alert.alert("Error", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            Alert.alert("Error", "Please enter the OTP code.");
            return;
        }

        setLoading(true);
        try {
            await api.post("/auth/register/verify-otp", {
                email,
                otp,
            });

            Alert.alert("Success", "Registration successful! Start your journey.");
            navigation.replace("OnboardingStep1");
        } catch (error) {
            console.error("OTP Verification failed:", error);
            const errorMsg = error.response?.data?.message || "Invalid or expired OTP code.";
            Alert.alert("Error", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Background blobs */}
            <View style={styles.blob1} />
            <View style={styles.blob2} />

            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.brandRow}>
                    <MaterialIcons name="local-florist" size={28} color="#276b2e" />
                    <Text style={styles.brandTitle}>Healing Garden</Text>
                </View>

                <TouchableOpacity>
                    <Text style={styles.lang}>EN</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                {/* HERO */}
                <View style={styles.hero}>
                    <Text style={styles.title}>
                        {showOtp ? "OTP Verification" : "Start your\n" + "healing journey."}
                    </Text>

                    <Text style={styles.subtitle}>
                        {showOtp 
                            ? "Please check your email for the verification code."
                            : "Join the Healing Garden community to find your inner peace."}
                    </Text>
                </View>

                {/* FORM */}
                <View style={styles.form}>
                    {!showOtp ? (
                        <>
                            <Input label="Full Name" icon="person-outline" value={fullName} onChangeText={setFullName} />
                            <Input label="Email" icon="mail-outline" value={email} onChangeText={setEmail} />
                            <Input label="Password" icon="lock-outline" secure value={password} onChangeText={setPassword} />

                            <TouchableOpacity onPress={handleRegister} disabled={loading}>
                                <LinearGradient
                                    colors={["#276b2e", "#60a560"]}
                                    style={[styles.button, loading && { opacity: 0.7 }]}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <Text style={styles.buttonText}>Register Now</Text>
                                            <MaterialIcons name="east" size={22} color="#fff" />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Input label="OTP Code" icon="vpn-key" value={otp} onChangeText={setOtp} />
                            
                            <TouchableOpacity onPress={handleVerifyOtp} disabled={loading}>
                                <LinearGradient
                                    colors={["#276b2e", "#60a560"]}
                                    style={[styles.button, loading && { opacity: 0.7 }]}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <Text style={styles.buttonText}>Verify OTP</Text>
                                            <MaterialIcons name="check" size={22} color="#fff" />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setShowOtp(false)} style={{ marginTop: 10 }}>
                                <Text style={{ textAlign: 'center', color: theme.colors.primary }}>Go back</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {/* DIVIDER */}
                <View style={styles.dividerRow}>
                    <View style={styles.line} />
                    <Text style={styles.dividerText}>or join with</Text>
                    <View style={styles.line} />
                </View>

                {/* SOCIAL */}
                <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialBtn}>
                        <Image
                            source={{
                                uri: "https://cdn-icons-png.flaticon.com/512/300/300221.png"
                            }}
                            style={styles.socialIcon}
                        />
                        <Text style={styles.socialText}>Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialBtn}>
                        <MaterialIcons name="facebook" size={22} color="#1877F2" />
                        <Text style={styles.socialText}>Facebook</Text>
                    </TouchableOpacity>
                </View>

                {/* FOOTER */}
                <View style={styles.footer}>
                    <Text>Already have an account?</Text>

                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.login}>Login now</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
};

export default RegisterScreen;

const Input = ({ label, icon, secure, value, onChangeText }) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>

        <View style={styles.inputWrapper}>
            <TextInput
                secureTextEntry={secure}
                style={styles.input}
                placeholder={label}
                value={value}
                onChangeText={onChangeText}
                autoCapitalize={label === "Email" ? "none" : "sentences"}
            />

            <MaterialIcons
                name={icon}
                size={20}
                color="#717a6d"
                style={styles.icon}
            />
        </View>
    </View>
);

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#ebffe6"
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 50
    },

    brandRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },

    brandTitle: {
        fontSize: 22,
        fontWeight: "700"
    },

    lang: {
        color: "#276b2e",
        fontWeight: "600"
    },

    scroll: {
        padding: 24
    },

    hero: {
        marginTop: 30,
        marginBottom: 30
    },

    title: {
        fontSize: 34,
        fontWeight: "800",
        lineHeight: 40
    },

    italic: {
        color: "#276b2e",
        fontStyle: "italic"
    },

    subtitle: {
        marginTop: 8,
        color: "#40493e"
    },

    form: {
        gap: 20
    },

    inputGroup: {
        gap: 6
    },

    label: {
        fontWeight: "700",
        fontSize: 13
    },

    inputWrapper: {
        backgroundColor: "#d0f1cc",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        position: "relative"
    },

    input: {
        paddingRight: 32
    },

    icon: {
        position: "absolute",
        right: 14,
        top: 16
    },

    button: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        paddingVertical: 18,
        borderRadius: 16,
        marginTop: 10
    },

    buttonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16
    },

    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 26
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#c0c9bb"
    },

    dividerText: {
        marginHorizontal: 10,
        fontStyle: "italic",
        color: "#40493e"
    },

    socialRow: {
        flexDirection: "row",
        gap: 12
    },

    socialBtn: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        padding: 14,
        backgroundColor: "#d6f7d1",
        borderRadius: 16
    },

    socialIcon: {
        width: 22,
        height: 22
    },

    socialText: {
        fontWeight: "700"
    },

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
        gap: 6
    },

    login: {
        color: "#276b2e",
        fontWeight: "700"
    },

    blob1: {
        position: "absolute",
        top: -100,
        right: -80,
        width: 250,
        height: 250,
        backgroundColor: "rgba(154,225,255,0.3)",
        borderRadius: 130
    },

    blob2: {
        position: "absolute",
        top: height / 2,
        left: -120,
        width: 300,
        height: 300,
        backgroundColor: "rgba(39,107,46,0.2)",
        borderRadius: 160
    }

});