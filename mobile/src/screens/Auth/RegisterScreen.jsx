import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    StatusBar,
    ScrollView,
    Dimensions,
    Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../theme";

const { width, height } = Dimensions.get("window");

const RegisterScreen = ({ navigation }) => {
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
                    <Text style={styles.lang}>VN</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                {/* HERO */}
                <View style={styles.hero}>
                    <Text style={styles.title}>
                        Bắt đầu hành trình{"\n"}
                        <Text style={styles.italic}>chữa lành.</Text>
                    </Text>

                    <Text style={styles.subtitle}>
                        Tham gia cùng cộng đồng Healing Garden để tìm lại sự bình yên trong tâm hồn.
                    </Text>
                </View>

                {/* FORM */}
                <View style={styles.form}>

                    <Input label="Họ tên" icon="person-outline" />
                    <Input label="Email" icon="mail-outline" />
                    <Input label="Mật khẩu" icon="lock-outline" secure />
                    <Input label="Xác nhận mật khẩu" icon="verified-user" secure />

                    <TouchableOpacity>
                        <LinearGradient
                            colors={["#276b2e", "#60a560"]}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Đăng Ký Ngay</Text>
                            <MaterialIcons name="east" size={22} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>

                </View>

                {/* DIVIDER */}
                <View style={styles.dividerRow}>
                    <View style={styles.line} />
                    <Text style={styles.dividerText}>hoặc tham gia bằng</Text>
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
                    <Text>Đã có tài khoản?</Text>

                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.login}>Đăng nhập ngay</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
};

export default RegisterScreen;

const Input = ({ label, icon, secure }) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>

        <View style={styles.inputWrapper}>
            <TextInput
                secureTextEntry={secure}
                style={styles.input}
                placeholder={label}
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