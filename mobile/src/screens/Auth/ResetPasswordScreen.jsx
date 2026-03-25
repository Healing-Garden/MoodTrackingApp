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
import api from "../../services/api";

const { width } = Dimensions.get("window");

const ResetPasswordScreen = ({ navigation, route }) => {
    const { email } = route.params;
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert("Error", "Please enter both new password and confirmation.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try {
            await api.post("/auth/forgot-password/reset", { email, newPassword });
            Alert.alert("Success", "Your password has been changed. Please log in again.", [
                { text: "OK", onPress: () => navigation.navigate("Login") }
            ]);
        } catch (error) {
            console.error("Reset password failed:", error);
            const errorMsg = error.response?.data?.message || "Password reset failed. Please try again.";
            Alert.alert("Error", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={[styles.bloom, styles.bloom1]} />
            <View style={[styles.bloom, styles.bloom2]} />

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                <View style={styles.brandSection}>
                    <View style={styles.logoBox}>
                        <Image
                            source={require("../../../assets/images/logo.png")}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>Enter a new password for account {email}</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>New Password</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="lock" size={20} color={theme.colors.outline} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor={theme.colors.outline}
                                    secureTextEntry
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons name="lock-outline" size={20} color={theme.colors.outline} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor={theme.colors.outline}
                                    secureTextEntry
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.submitBtnContainer}
                            onPress={handleResetPassword}
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
                                    <Text style={styles.submitBtnText}>Reset Password</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
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
    },
    bloom2: {
        bottom: -150,
        right: -80,
        backgroundColor: theme.colors.secondaryContainer,
        width: 320,
        height: 320,
        borderRadius: 160,
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
        fontSize: 32,
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
        paddingHorizontal: 20,
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
    label: {
        fontSize: 14,
        fontFamily: theme.fonts.headline,
        fontWeight: "600",
        color: theme.colors.onSurfaceVariant,
        marginLeft: 4,
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
});

export default ResetPasswordScreen;
