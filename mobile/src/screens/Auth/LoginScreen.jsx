import React, { useState, useEffect } from "react";
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
    Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../theme";
import api, { setAuthToken } from "../../services/api";

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [banData, setBanData] = useState(null);
    const [showBanModal, setShowBanModal] = useState(false);
    const [countdownObj, setCountdownObj] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        let timer;
        if (showBanModal && banData && banData.banExpiresAt) {
            const expireDate = new Date(banData.banExpiresAt).getTime();
            timer = setInterval(() => {
                const now = new Date().getTime();
                const distance = expireDate - now;

                if (distance < 0) {
                    clearInterval(timer);
                    setShowBanModal(false);
                } else {
                    setCountdownObj({
                        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                        seconds: Math.floor((distance % (1000 * 60)) / 1000)
                    });
                }
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [showBanModal, banData]);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter email and password.");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            const { accessToken, user } = response.data;
            setAuthToken(accessToken);

            if (user && user.role === 'admin') {
                navigation.replace("AdminDashboard");
                return;
            }

            try {
                const statusRes = await api.get("/user/onboarding/status");
                if (statusRes.data.isOnboarded === false) {
                    navigation.replace("OnboardingStep1");
                    return;
                }

                try {
                    await api.get("/user/checkins/today");
                    navigation.replace("Dashboard");
                } catch (checkinErr) {
                    if (checkinErr.response?.status === 404) {
                        navigation.replace("OnboardingStep4", { isDailyCheckIn: true });
                    } else {
                        navigation.replace("Dashboard");
                    }
                }
            } catch (statusErr) {
                console.error("Status check failed:", statusErr);
                navigation.replace("Dashboard");
            }
        } catch (error) {
            console.error("Login failed:", error);
            if (error.response?.status === 403) {
                try {
                    const parsedMsg = JSON.parse(error.response.data.message);
                    if (parsedMsg.isBanned) {
                        setBanData(parsedMsg);
                        setShowBanModal(true);
                        return;
                    }
                } catch (e) { }
            }
            const errorMsg = error.response?.data?.message || "Login failed. Please check your information.";
            Alert.alert("Error", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Decorative Elements */}
            <View style={[styles.bloom, styles.bloom1]} />
            <View style={[styles.bloom, styles.bloom2]} />

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Brand Anchor */}
                <View style={styles.brandSection}>
                    <View style={styles.logoBox}>
                        <Image
                            source={require("../../../assets/images/logo.png")}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.title}>Healing Garden</Text>
                    <Text style={styles.subtitle}>Welcome back to your soul garden</Text>
                </View>

                {/* Login Form Container */}
                <View style={styles.card}>
                    <View style={styles.form}>
                        {/* Email Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="mail" size={20} color={theme.colors.outline} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="example@garden.com"
                                    placeholderTextColor={theme.colors.outline}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputGroup}>
                            <View style={styles.labelRow}>
                                <Text style={styles.label}>Password</Text>
                                <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                                    <Text style={styles.forgot}>Forgot password?</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="lock" size={20} color={theme.colors.outline} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor={theme.colors.outline}
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={styles.submitBtnContainer}
                            onPress={handleLogin}
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
                                    <Text style={styles.submitBtnText}>Sign In</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>OR SIGN IN WITH</Text>
                        <View style={styles.divider} />
                    </View>

                    {/* Social Login */}
                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
                            <Image
                                source={{ uri: "https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" }}
                                style={styles.googleIcon}
                            />
                            <Text style={styles.socialBtnText}>Google</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer Link */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                        <Text style={styles.registerLink}> Register now</Text>
                    </TouchableOpacity>
                </View>

                {/* Copyright */}
                <Text style={styles.copyright}>© 2026 Healing Garden. All rights reserved.</Text>

            </ScrollView>

            {/* Ban Modal */}
            <Modal visible={showBanModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.banModalContainer}>
                        <MaterialIcons name="block" size={48} color={theme.colors.error} style={{ marginBottom: 16 }} />
                        <Text style={styles.banTitle}>Account Banned</Text>
                        <Text style={styles.banSubtitle}>You cannot log in at this time.</Text>

                        <View style={styles.banReasonBox}>
                            <Text style={styles.banReasonLabel}>Reason:</Text>
                            <Text style={styles.banReasonText}>{banData?.banReason || 'Policy Violation'}</Text>
                        </View>

                        {banData?.banExpiresAt && (
                            <View style={styles.countdownContainer}>
                                <Text style={styles.countdownLabel}>Unlocks in:</Text>
                                <View style={styles.countdownRow}>
                                    <View style={styles.countdownBox}><Text style={styles.countdownNumber}>{countdownObj.days}</Text><Text style={styles.countdownUnit}>Days</Text></View>
                                    <View style={styles.countdownBox}><Text style={styles.countdownNumber}>{countdownObj.hours}</Text><Text style={styles.countdownUnit}>Hours</Text></View>
                                    <View style={styles.countdownBox}><Text style={styles.countdownNumber}>{countdownObj.minutes}</Text><Text style={styles.countdownUnit}>Minutes</Text></View>
                                    <View style={styles.countdownBox}><Text style={styles.countdownNumber}>{countdownObj.seconds}</Text><Text style={styles.countdownUnit}>Seconds</Text></View>
                                </View>
                            </View>
                        )}
                        {!banData?.banExpiresAt && (
                            <View style={styles.countdownContainer}>
                                <Text style={[styles.countdownLabel, { color: theme.colors.error }]}>Permanently Banned</Text>
                            </View>
                        )}

                        <TouchableOpacity style={styles.banCloseBtn} onPress={() => setShowBanModal(false)}>
                            <Text style={styles.banCloseText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scroll: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
        alignItems: "center",
    },
    bloom: {
        position: "absolute",
        width: 380,
        height: 380,
        opacity: 0.2,
    },
    bloom1: {
        top: -100,
        left: -100,
        backgroundColor: theme.colors.primaryContainer,
        borderRadius: 190,
        borderBottomRightRadius: 100,
    },
    bloom2: {
        bottom: -150,
        right: -80,
        backgroundColor: theme.colors.secondaryContainer,
        width: 320,
        height: 320,
        borderRadius: 160,
        borderTopLeftRadius: 80,
    },
    brandSection: {
        alignItems: "center",
        marginBottom: 48,
    },
    logoBox: {
        width: 80,
        height: 80,
        backgroundColor: theme.colors.primaryContainer,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
        ...theme.shadows.primary,
        overflow: "hidden",
    },
    logoImage: {
        width: "90%",
        height: "90%",
    },
    title: {
        fontSize: 36,
        fontFamily: theme.fonts.headline,
        fontWeight: "800",
        color: theme.colors.onBackground,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: theme.fonts.body,
        fontWeight: "500",
        color: theme.colors.onSurfaceVariant,
        marginTop: 8,
        textAlign: "center",
    },
    card: {
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: 24,
        padding: 32,
        borderWidth: 2,
        borderColor: "white",
        ...theme.shadows.soft,
    },
    form: {
        gap: 24,
    },
    inputGroup: {
        gap: 8,
    },
    labelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        fontSize: 14,
        fontFamily: theme.fonts.headline,
        fontWeight: "600",
        color: theme.colors.onSurfaceVariant,
        marginLeft: 4,
    },
    forgot: {
        fontSize: 12,
        fontFamily: theme.fonts.headline,
        fontWeight: "600",
        color: theme.colors.primary,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: theme.fonts.body,
        color: theme.colors.onSurface,
    },
    submitBtnContainer: {
        marginTop: 8,
        borderRadius: 16,
        overflow: "hidden",
        ...theme.shadows.primary,
    },
    submitBtn: {
        height: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    submitBtnText: {
        fontSize: 18,
        fontFamily: theme.fonts.headline,
        fontWeight: "700",
        color: theme.colors.onPrimary,
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 40,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.outlineVariant + "50",
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 10,
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
        height: 52,
        backgroundColor: theme.colors.surfaceContainer,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    googleIcon: {
        width: 24,
        height: 24,
    },
    socialBtnText: {
        fontSize: 14,
        fontFamily: theme.fonts.headline,
        fontWeight: "700",
        color: theme.colors.onSurfaceVariant,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 40,
    },
    footerText: {
        fontSize: 15,
        fontFamily: theme.fonts.body,
        fontWeight: "500",
        color: theme.colors.onSurfaceVariant,
    },
    registerLink: {
        fontSize: 15,
        fontFamily: theme.fonts.body,
        fontWeight: "700",
        color: theme.colors.primary,
    },
    copyright: {
        marginTop: 32,
        fontSize: 12,
        fontFamily: theme.fonts.body,
        color: theme.colors.outline + "80",
        textAlign: "center",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    banModalContainer: {
        backgroundColor: '#fff',
        width: '85%',
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        ...theme.shadows.soft,
    },
    banTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: theme.colors.error,
        marginBottom: 8,
    },
    banSubtitle: {
        fontSize: 14,
        color: '#555',
        marginBottom: 20,
        textAlign: 'center',
    },
    banReasonBox: {
        width: '100%',
        backgroundColor: theme.colors.errorContainer + "30",
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    banReasonLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.onErrorContainer,
        marginBottom: 4,
    },
    banReasonText: {
        fontSize: 14,
        color: '#555',
    },
    countdownContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 24,
    },
    countdownLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    countdownRow: {
        flexDirection: 'row',
        gap: 12,
    },
    countdownBox: {
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        minWidth: 50,
    },
    countdownNumber: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.colors.secondary,
    },
    countdownUnit: {
        fontSize: 10,
        color: '#666',
        marginTop: 2,
    },
    banCloseBtn: {
        backgroundColor: theme.colors.primary,
        width: '100%',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    banCloseText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    }
});

export default LoginScreen;