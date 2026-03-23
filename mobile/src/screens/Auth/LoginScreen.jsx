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

const { width } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu.");
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
            } else {
                navigation.replace("Dashboard");
            }
        } catch (error) {
            console.error("Login failed:", error);
            const errorMsg = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
            Alert.alert("Lỗi", errorMsg);
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
                        Chào mừng bạn trở lại khu vườn tâm hồn
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
                            <Text style={styles.label}>Mật khẩu</Text>

                            <TouchableOpacity>
                                <Text style={styles.forgot}>Quên mật khẩu?</Text>
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
                                <Text style={styles.buttonText}>Đăng nhập</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* DIVIDER */}
                    <View style={styles.dividerRow}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>
                            Hoặc đăng nhập với
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
                    <Text>Chưa có tài khoản?</Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Register")}
                    >
                        <Text style={styles.register}>Đăng ký ngay</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
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
    }

});