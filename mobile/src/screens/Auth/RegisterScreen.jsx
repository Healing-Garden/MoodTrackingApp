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
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!fullName || !email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all information.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
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

            Alert.alert("Success", "Registration successful! Please log in.");
            navigation.navigate("Login");
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

            {/* Background Decorations */}
            <View style={[styles.blob, styles.blob1]} />
            <View style={[styles.blob, styles.blob2]} />

            {/* Header Branding */}
            <View style={styles.header}>
                <View style={styles.brandContainer}>
                    <Image 
                        source={require("../../../assets/images/logo.png")} 
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.brandText}>Healing Garden</Text>
                </View>
                <TouchableOpacity>
                    <Text style={styles.langBtn}>EN</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                
                {/* Hero Header */}
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>
                        {showOtp ? "OTP Verification" : <>Start your{"\n"}<Text style={styles.heroTitleItalic}>healing journey.</Text></>}
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        {showOtp 
                            ? "Please check your email for the verification code."
                            : "Join the Healing Garden community to find peace in your soul."}
                    </Text>
                </View>

                {/* Form Section */}
                <View style={[styles.formContainer, styles.card]}>
                    {!showOtp ? (
                        <>
                            <Input 
                                label="Full Name" 
                                icon="person" 
                                placeholder="Your full name" 
                                value={fullName} 
                                onChangeText={setFullName} 
                            />
                            <Input 
                                label="Email" 
                                icon="mail" 
                                placeholder="your-email@gmail.com" 
                                value={email} 
                                onChangeText={setEmail} 
                                keyboardType="email-address" 
                                autoCapitalize="none" 
                            />
                            <Input 
                                label="Password" 
                                icon="lock" 
                                placeholder="••••••••" 
                                secure 
                                value={password} 
                                onChangeText={setPassword} 
                            />
                            <Input 
                                label="Confirm Password" 
                                icon="verified-user" 
                                placeholder="••••••••" 
                                secure 
                                value={confirmPassword} 
                                onChangeText={setConfirmPassword} 
                            />

                            <TouchableOpacity 
                                style={styles.submitBtnContainer} 
                                onPress={handleRegister} 
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={[theme.colors.primary, theme.colors.primaryContainer]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.submitBtn}
                                >
                                    {loading ? (
                                        <ActivityIndicator color={theme.colors.onPrimary} />
                                    ) : (
                                        <>
                                            <Text style={styles.submitBtnText}>Register Now</Text>
                                            <MaterialIcons name="east" size={24} color={theme.colors.onPrimary} />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Input 
                                label="OTP Code" 
                                icon="vpn-key" 
                                placeholder="Enter OTP code from email" 
                                value={otp} 
                                onChangeText={setOtp} 
                            />
                            
                            <TouchableOpacity 
                                style={styles.submitBtnContainer} 
                                onPress={handleVerifyOtp} 
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={[theme.colors.primary, theme.colors.primaryContainer]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.submitBtn}
                                >
                                    {loading ? (
                                        <ActivityIndicator color={theme.colors.onPrimary} />
                                    ) : (
                                        <>
                                            <Text style={styles.submitBtnText}>Verify OTP</Text>
                                            <MaterialIcons name="check" size={24} color={theme.colors.onPrimary} />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setShowOtp(false)} style={styles.backBtn}>
                                <Text style={styles.backBtnText}>Back</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {/* Social Divider */}
                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR JOIN WITH</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Social Buttons */}
                <View style={styles.socialContainer}>
                    <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
                        <Image
                            source={{ uri: "https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" }}
                            style={styles.socialIcon}
                        />
                        <Text style={styles.socialBtnText}>Google</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer Link */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.loginLink}> Login now</Text>
                    </TouchableOpacity>
                </View>

                {/* Copyright Section */}
                <View style={styles.copyrightContainer}>
                    <Text style={styles.copyrightText}>© 2026 Healing Garden. All rights reserved.</Text>
                    <View style={styles.legalLinks}>
                        <TouchableOpacity><Text style={styles.legalLinkText}>Terms</Text></TouchableOpacity>
                        <TouchableOpacity><Text style={styles.legalLinkText}>Privacy</Text></TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
};

const Input = ({ label, icon, placeholder, secure, value, onChangeText, ...props }) => (
    <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={styles.inputWrapper}>
            <TextInput
                secureTextEntry={secure}
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.onSurfaceVariant + "60"}
                value={value}
                onChangeText={onChangeText}
                {...props}
            />
            <MaterialIcons
                name={icon}
                size={22}
                color={theme.colors.onSurfaceVariant + "80"}
                style={styles.inputIcon}
            />
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 60,
        backgroundColor: theme.colors.background,
    },
    brandContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    logoImage: {
        width: 32,
        height: 32,
    },
    brandText: {
        fontSize: 24,
        fontFamily: theme.fonts.headline,
        fontWeight: "700",
        color: "#064e3b", // Deep Garden Green
        letterSpacing: -0.5,
    },
    langBtn: {
        fontSize: 16,
        fontFamily: theme.fonts.headline,
        fontWeight: "600",
        color: theme.colors.primary,
    },
    scroll: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    blob: {
        position: "absolute",
        width: 380,
        height: 380,
        opacity: 0.15,
    },
    blob1: {
        top: -120,
        right: -120,
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: 190,
        borderBottomLeftRadius: 100,
    },
    blob2: {
        top: height / 2.5,
        left: -150,
        backgroundColor: theme.colors.secondaryContainer,
        borderRadius: 190,
        borderTopRightRadius: 100,
    },
    heroSection: {
        marginTop: 40,
        marginBottom: 32,
        gap: 8,
    },
    heroTitle: {
        fontSize: 36,
        fontFamily: theme.fonts.headline,
        fontWeight: "800",
        color: theme.colors.onSurface,
        lineHeight: 44,
        letterSpacing: -1,
    },
    heroTitleItalic: {
        color: theme.colors.primary,
        fontStyle: "italic",
    },
    heroSubtitle: {
        fontSize: 18,
        fontFamily: theme.fonts.body,
        fontWeight: "400",
        color: theme.colors.onSurfaceVariant,
        lineHeight: 26,
        maxWidth: "90%",
    },
    formContainer: {
        gap: 20,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 24,
        padding: 24,
        borderWidth: 2,
        borderColor: "white",
        ...theme.shadows.soft,
    },
    inputGroup: {
        gap: 8,
    },
    inputLabel: {
        fontSize: 14,
        fontFamily: theme.fonts.headline,
        fontWeight: "700",
        color: theme.colors.onSurfaceVariant,
        marginLeft: 8,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.surfaceContainerHigh,
        borderRadius: 16,
        paddingHorizontal: 20,
        height: 60,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: theme.fonts.body,
        color: theme.colors.onSurface,
        paddingRight: 10,
    },
    inputIcon: {
        marginLeft: 10,
    },
    submitBtnContainer: {
        marginTop: 12,
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 32,
        elevation: 10,
    },
    submitBtn: {
        flexDirection: "row",
        height: 64,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
    submitBtnText: {
        fontSize: 18,
        fontFamily: theme.fonts.headline,
        fontWeight: "700",
        color: theme.colors.onPrimary,
    },
    backBtn: {
        marginTop: 12,
        paddingVertical: 12,
        alignItems: "center",
    },
    backBtnText: {
        fontSize: 16,
        fontFamily: theme.fonts.headline,
        fontWeight: "600",
        color: theme.colors.primary,
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 32,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.outlineVariant + "50",
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 12,
        fontFamily: theme.fonts.headline,
        fontWeight: "800",
        color: theme.colors.outline,
        letterSpacing: 1.5,
    },
    socialContainer: {
        width: "100%",
    },
    socialBtn: {
        flexDirection: "row",
        height: 56,
        backgroundColor: theme.colors.surfaceContainer,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
    socialIcon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
    socialBtnText: {
        fontSize: 14,
        fontFamily: theme.fonts.headline,
        fontWeight: "700",
        color: theme.colors.onSurface,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 32,
        gap: 4,
    },
    footerText: {
        fontSize: 16,
        fontFamily: theme.fonts.body,
        color: theme.colors.onSurfaceVariant,
    },
    loginLink: {
        fontSize: 16,
        fontFamily: theme.fonts.body,
        fontWeight: "700",
        color: theme.colors.primary,
    },
    copyrightContainer: {
        marginTop: 48,
        alignItems: "center",
        gap: 8,
    },
    copyrightText: {
        fontSize: 12,
        fontFamily: theme.fonts.body,
        color: theme.colors.onSurfaceVariant + "60",
    },
    legalLinks: {
        flexDirection: "row",
        gap: 24,
    },
    legalLinkText: {
        fontSize: 12,
        fontFamily: theme.fonts.body,
        color: theme.colors.onSurfaceVariant + "60",
    },
});

export default RegisterScreen;