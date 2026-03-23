import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    StatusBar,
    ScrollView
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../theme";

const ChangePasswordScreen = ({ navigation }) => {

    const InputField = ({ label, placeholder }) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>

            <View style={styles.inputWrapper}>

                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    secureTextEntry
                    placeholderTextColor="#9ca3af"
                />

                <MaterialIcons
                    name="visibility"
                    size={22}
                    color="#9ca3af"
                    style={styles.eyeIcon}
                />

            </View>

        </View>
    );

    return (

        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}

            <View style={styles.header}>

                <View style={styles.headerLeft}>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >

                        <MaterialIcons
                            name="arrow-back"
                            size={24}
                            color="#276b2e"
                        />

                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Security
                    </Text>

                </View>

                <View style={{ width: 40 }} />

            </View>


            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >

                {/* Title */}

                <Text style={styles.title}>
                    Change Password
                </Text>

                <Text style={styles.description}>
                    Your digital sanctuary should remain private. Choose a strong, memorable password to keep your journals protected.
                </Text>


                {/* Form */}

                <View style={styles.form}>

                    <InputField
                        label="Current Password"
                        placeholder="••••••••"
                    />

                    <InputField
                        label="New Password"
                        placeholder="At least 8 characters"
                    />

                    <InputField
                        label="Confirm New Password"
                        placeholder="••••••••"
                    />

                </View>


                {/* Security Tip */}

                <View style={styles.tipCard}>

                    <View style={styles.tipIcon}>

                        <MaterialIcons
                            name="shield"
                            size={20}
                            color="#00370b"
                        />

                    </View>

                    <View style={{ flex: 1 }}>

                        <Text style={styles.tipTitle}>
                            Security Tip
                        </Text>

                        <Text style={styles.tipText}>
                            A strong password is like deep roots. Use a mix of symbols, numbers, and both letter cases to ensure your garden stays secure.
                        </Text>

                    </View>

                </View>


                {/* Button */}

                <LinearGradient
                    colors={["#276b2e", "#60a560"]}
                    style={styles.button}
                >

                    <TouchableOpacity
                        style={styles.buttonInner}
                        onPress={() => navigation.goBack()}
                    >

                        <Text style={styles.buttonText}>
                            Update Password
                        </Text>

                        <MaterialIcons
                            name="lock-open"
                            size={20}
                            color="white"
                        />

                    </TouchableOpacity>

                </LinearGradient>


                {/* Decorative blob */}

                <View style={styles.blob} />

            </ScrollView>

        </View>

    );
};

export default ChangePasswordScreen;


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#ebffe6"
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 12,
        backgroundColor: "rgba(236,253,245,0.8)"
    },

    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center"
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#276b2e"
    },

    content: {
        paddingHorizontal: 24,
        paddingBottom: 120
    },

    title: {
        fontSize: 34,
        fontWeight: "800",
        color: "#06210a",
        marginTop: 20,
        marginBottom: 10
    },

    description: {
        fontSize: 16,
        lineHeight: 24,
        color: "#40493e",
        marginBottom: 40
    },

    form: {
        gap: 28,
        marginBottom: 40
    },

    inputGroup: {
        gap: 8
    },

    label: {
        fontSize: 13,
        fontWeight: "600",
        color: "#40493e",
        marginLeft: 4
    },

    inputWrapper: {
        position: "relative"
    },

    input: {
        height: 64,
        borderRadius: 16,
        paddingHorizontal: 20,
        backgroundColor: "#d0f1cc",
        fontSize: 16,
        color: "#06210a"
    },

    eyeIcon: {
        position: "absolute",
        right: 18,
        top: 20
    },

    tipCard: {
        flexDirection: "row",
        gap: 14,
        padding: 18,
        borderRadius: 16,
        backgroundColor: "#dbfdd7",
        marginBottom: 40
    },

    tipIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#60a560",
        justifyContent: "center",
        alignItems: "center"
    },

    tipTitle: {
        fontWeight: "700",
        fontSize: 14,
        marginBottom: 4
    },

    tipText: {
        fontSize: 12,
        lineHeight: 18,
        color: "#40493e"
    },

    button: {
        borderRadius: 16
    },

    buttonInner: {
        height: 64,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10
    },

    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "700"
    },

    blob: {
        width: 120,
        height: 120,
        backgroundColor: "#60a560",
        borderRadius: 80,
        alignSelf: "center",
        marginTop: 80,
        opacity: 0.2
    }

});