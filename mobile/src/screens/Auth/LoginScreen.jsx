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
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../theme";
import api, { setAuthToken } from "../../services/api";

const { width } = Dimensions.get("window");

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

            // Successfully logged in
            if (user && user.role === 'admin') {
                navigation.replace("AdminDashboard");
                return;
            }
            // 1. Check Onboarding Status
            try {
                const statusRes = await api.get("/user/onboarding/status");
                if (statusRes.data.isOnboarded === false) {
                    navigation.replace("OnboardingStep1");
                    return;
                }

                // 2. Check Today's Check-in
                try {
                    await api.get("/user/checkins/today");
                    // If 200/Success -> Already checked in
                    navigation.replace("Dashboard");
                } catch (checkinErr) {
                    if (checkinErr.response?.status === 404) {
                        // Not checked in yet -> Go to Step 4 (Daily Check-in)
                        navigation.replace("OnboardingStep4", { isDailyCheckIn: true });
                    } else {
                        // Other error -> Default to Dashboard
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
                } catch (e) {
                    // Not JSON
                }
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

            {/* Background blobs */}
            <View style={styles.blob1} />
            <View style={styles.blob2} />

            <ScrollView contentContainerStyle={styles.scroll}>

                {/* BRAND */}
                <View style={styles.brandSection}>
                    <View style={styles.logoBox}>
                        <MaterialIcons name="spa" size={36} color="#00370b" />
                    </View>

                    <Text style={styles.title}>Healing Garden</Text>

                    <Text style={styles.subtitle}>
                        Welcome back to your soul garden
                    </Text>
                </View>

                {/* FORM CARD */}
                <View style={styles.card}>

                    {/* EMAIL */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>

                        <View style={styles.inputWrapper}>
                            <MaterialIcons
                                name="mail-outline"
                                size={22}
                                color="#717a6d"
                                style={styles.inputIcon}
                            />

                            <TextInput
                                placeholder="example@garden.com"
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    {/* PASSWORD */}
                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>Password</Text>

                            <TouchableOpacity>
                                <Text style={styles.forgot}>Forgot password?</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputWrapper}>
                            <MaterialIcons
                                name="lock-outline"
                                size={22}
                                color="#717a6d"
                                style={styles.inputIcon}
                            />

                            <TextInput
                                placeholder="••••••••"
                                secureTextEntry
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                    </View>

                    {/* BUTTON */}
                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <LinearGradient
                            colors={["#276b2e", "#60a560"]}
                            style={[styles.button, loading && { opacity: 0.7 }]}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Sign In</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* DIVIDER */}
                    <View style={styles.dividerRow}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>
                            Or sign in with
                        </Text>
                        <View style={styles.divider} />
                    </View>

                    {/* SOCIAL LOGIN */}
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
                            <MaterialIcons
                                name="facebook"
                                size={22}
                                color="#1877F2"
                            />
                            <Text style={styles.socialText}>Facebook</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* FOOTER */}
                <View style={styles.footer}>
                    <Text>Don't have an account?</Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Register")}
                    >
                        <Text style={styles.register}>Register now</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* BAN MODAL */}
            <Modal visible={showBanModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.banModalContainer}>
                        <MaterialIcons name="block" size={48} color="#ba1a1a" style={{ marginBottom: 16 }} />
                        <Text style={styles.banTitle}>Tài khoản bị cấm</Text>
                        <Text style={styles.banSubtitle}>Bạn không thể đăng nhập vào lúc này.</Text>
                        
                        <View style={styles.banReasonBox}>
                            <Text style={styles.banReasonLabel}>Lý do khóa:</Text>
                            <Text style={styles.banReasonText}>{banData?.banReason || 'Vi phạm chính sách'}</Text>
                        </View>

                        {banData?.banExpiresAt && (
                            <View style={styles.countdownContainer}>
                                <Text style={styles.countdownLabel}>Mở khóa sau:</Text>
                                <View style={styles.countdownRow}>
                                    <View style={styles.countdownBox}><Text style={styles.countdownNumber}>{countdownObj.days}</Text><Text style={styles.countdownUnit}>Ngày</Text></View>
                                    <View style={styles.countdownBox}><Text style={styles.countdownNumber}>{countdownObj.hours}</Text><Text style={styles.countdownUnit}>Giờ</Text></View>
                                    <View style={styles.countdownBox}><Text style={styles.countdownNumber}>{countdownObj.minutes}</Text><Text style={styles.countdownUnit}>Phút</Text></View>
                                    <View style={styles.countdownBox}><Text style={styles.countdownNumber}>{countdownObj.seconds}</Text><Text style={styles.countdownUnit}>Giây</Text></View>
                                </View>
                            </View>
                        )}
                        {!banData?.banExpiresAt && (
                            <View style={styles.countdownContainer}>
                                <Text style={[styles.countdownLabel, { color: "#ba1a1a" }]}>Tài khoản bị khóa vĩnh viễn</Text>
                            </View>
                        )}

                        <TouchableOpacity style={styles.banCloseBtn} onPress={() => setShowBanModal(false)}>
                            <Text style={styles.banCloseText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#ebffe6"
    },

    scroll: {
        padding: 24,
        alignItems: "center"
    },

    blob1: {
        position: "absolute",
        top: -120,
        left: -120,
        width: 320,
        height: 320,
        backgroundColor: "rgba(96,165,96,0.2)",
        borderRadius: 160
    },

    blob2: {
        position: "absolute",
        bottom: -120,
        right: -80,
        width: 260,
        height: 260,
        backgroundColor: "rgba(154,225,255,0.3)",
        borderRadius: 140
    },

    brandSection: {
        alignItems: "center",
        marginBottom: 40
    },

    logoBox: {
        width: 80,
        height: 80,
        backgroundColor: "#60a560",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20
    },

    title: {
        fontSize: 32,
        fontWeight: "800"
    },

    subtitle: {
        color: "#40493e",
        marginTop: 6
    },

    card: {
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.85)",
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12
    },

    inputGroup: {
        marginBottom: 18
    },

    label: {
        fontWeight: "600",
        marginBottom: 6
    },

    labelRow: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    forgot: {
        fontSize: 12,
        color: "#276b2e"
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#dbfdd7",
        borderRadius: 12,
        paddingHorizontal: 12
    },

    inputIcon: {
        marginRight: 10
    },

    input: {
        flex: 1,
        paddingVertical: 14
    },

    button: {
        marginTop: 12,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center"
    },

    buttonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16
    },

    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24
    },

    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#c0c9bb"
    },

    dividerText: {
        marginHorizontal: 10,
        fontSize: 12
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
        padding: 12,
        backgroundColor: "#d6f7d1",
        borderRadius: 10
    },

    socialIcon: {
        width: 22,
        height: 22,
        marginRight: 8
    },

    socialText: {
        fontWeight: "600"
    },

    footer: {
        flexDirection: "row",
        marginTop: 30,
        gap: 6
    },

    register: {
        color: "#276b2e",
        fontWeight: "700"
    },

    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'
    },
    banModalContainer: {
        backgroundColor: '#fff', width: '85%', padding: 24, borderRadius: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10
    },
    banTitle: {
        fontSize: 22, fontWeight: '800', color: '#ba1a1a', marginBottom: 8
    },
    banSubtitle: {
        fontSize: 14, color: '#555', marginBottom: 20, textAlign: 'center'
    },
    banReasonBox: {
        width: '100%', backgroundColor: '#fff0f0', padding: 16, borderRadius: 12, marginBottom: 20
    },
    banReasonLabel: {
        fontSize: 12, fontWeight: '700', color: '#93000a', marginBottom: 4
    },
    banReasonText: {
        fontSize: 14, color: '#555'
    },
    countdownContainer: {
        width: '100%', alignItems: 'center', marginBottom: 24
    },
    countdownLabel: {
        fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 12
    },
    countdownRow: {
        flexDirection: 'row', gap: 12
    },
    countdownBox: {
        alignItems: 'center', backgroundColor: '#f0f0f0', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, minWidth: 50
    },
    countdownNumber: {
        fontSize: 18, fontWeight: '800', color: '#005a80'
    },
    countdownUnit: {
        fontSize: 10, color: '#666', marginTop: 2
    },
    banCloseBtn: {
        backgroundColor: '#005a80', width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center'
    },
    banCloseText: {
        color: '#fff', fontSize: 16, fontWeight: '700'
    }
});