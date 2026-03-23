import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    Image
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../theme";

const TrashScreen = ({ navigation }) => {

    const trashedEntries = [
        {
            id: 1,
            title: "Morning Reflection on Growth",
            content: "I felt like a seedling pushing through the soil today...",
            deleted: "Deleted Oct 12",
            remain: "24 days remaining"
        },
        {
            id: 2,
            title: "Unspoken Storm Clouds",
            content: "Sometimes silence is louder than rain...",
            deleted: "Deleted Oct 04",
            remain: "12 days remaining"
        },
        {
            id: 3,
            title: "Draft: The River Path",
            content: "Walking by the creek helped me realize...",
            deleted: "Deleted Sep 22",
            remain: "2 days remaining"
        }
    ]
    

    return (

        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* HEADER */}

            <View style={styles.header}>

                <View style={styles.headerLeft}>

                    <Image
                        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzldgveiq-37_7eC5Hrtrcyz2Yksax6PLCEQ6IgnscKprh1RGHJqbKALNUYLdDWs8f7Kedv8CHQV0ubIty9wruPdM9zAml9iZrhwH697FRlfmmNtuQ9ORWwvgVQ0sX12fLc7j8b5izYdhqmlOLX48kQTaBd8maXnusl_sf2mvW7olCP9lNtLJQj29GAT0lzl_oix1Pzdf-OUqxGMRap5sktV0E8DxuanM86m7LtZRtzm7q5lL3dsM4w4NaMdIxe2TIRaTS75BnC6M" }}
                        style={styles.avatar}
                    />

                    <Text style={styles.headerTitle}>
                        Digital Sanctuary
                    </Text>

                </View>

                <TouchableOpacity style={styles.settingsBtn}>
                    <MaterialIcons name="settings" size={22} color="#1f3d21" />
                </TouchableOpacity>

            </View>


            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >

                {/* TABS */}

                <View style={styles.tabs}>

                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabText}>Write</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabText}>My Entries</Text>
                    </TouchableOpacity>

                    <View style={styles.tabActive}>
                        <Text style={styles.tabActiveText}>Trash</Text>
                    </View>

                </View>


                {/* INFO BANNER */}

                <View style={styles.banner}>

                    <View style={styles.bannerIcon}>
                        <MaterialIcons name="cleaning-services" size={20} color="#276b2e" />
                    </View>

                    <Text style={styles.bannerText}>
                        Items in trash will be permanently deleted after 30 days.
                    </Text>

                    <View style={styles.blob} />

                </View>


                {/* CARDS */}

                {trashedEntries.map(item => (

                    <View key={item.id} style={styles.card}>

                        <View style={styles.cardTop}>

                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {item.remain}
                                </Text>
                            </View>

                            <Text style={styles.deletedText}>
                                {item.deleted}
                            </Text>

                        </View>

                        <Text style={styles.cardTitle}>
                            {item.title}
                        </Text>

                        <Text style={styles.cardContent} numberOfLines={2}>
                            {item.content}
                        </Text>

                        <View style={styles.cardActions}>

                            <TouchableOpacity style={styles.restoreBtn}>

                                <MaterialIcons
                                    name="settings-backup-restore"
                                    size={18}
                                    color="#276b2e"
                                />

                                <Text style={styles.restoreText}>
                                    Restore
                                </Text>

                            </TouchableOpacity>

                            <TouchableOpacity style={styles.deleteBtn}>

                                <MaterialIcons
                                    name="delete-forever"
                                    size={20}
                                    color="#ba1a1a"
                                />

                            </TouchableOpacity>

                        </View>

                    </View>

                ))}

            </ScrollView>


            {/* BOTTOM NAV */}

            <View style={styles.bottomNav}>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="eco" size={26} color="#4b6b50" />
                    <Text style={styles.navText}>Garden</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="monitoring" size={26} color="#4b6b50" />
                    <Text style={styles.navText}>Insights</Text>
                </TouchableOpacity>

                <View style={styles.navActive}>
                    <MaterialIcons name="import-contacts" size={26} color="#0f2f13" />
                    <Text style={styles.navActiveText}>Journal</Text>
                </View>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="local-library" size={26} color="#4b6b50" />
                    <Text style={styles.navText}>Library</Text>
                </TouchableOpacity>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#ebffe6"
    },

    content: {
        paddingHorizontal: 24,
        paddingTop: 90,
        paddingBottom: 120
    },

    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 80,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24
    },

    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "700"
    },

    settingsBtn: {
        padding: 8
    },

    tabs: {
        flexDirection: "row",
        backgroundColor: "#dbfdd7",
        borderRadius: 12,
        padding: 6,
        marginBottom: 24
    },

    tab: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 12
    },

    tabText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#606e62"
    },

    tabActive: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#276b2e",
        paddingVertical: 12,
        borderRadius: 10
    },

    tabActiveText: {
        color: "#fff",
        fontWeight: "700"
    },

    banner: {
        flexDirection: "row",
        backgroundColor: "#caebc6",
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 24
    },

    bannerIcon: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#e6f6e4",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12
    },

    bannerText: {
        flex: 1,
        fontSize: 13
    },

    blob: {
        position: "absolute",
        right: -20,
        top: -20,
        width: 80,
        height: 80,
        backgroundColor: "#276b2e20",
        borderRadius: 40,
        transform: [{ rotate: "45deg" }]
    },

    card: {
        backgroundColor: "#fff",
        padding: 24,
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 16
    },

    cardTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12
    },

    badge: {
        backgroundColor: "#ffdad6",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20
    },

    badgeText: {
        fontSize: 11,
        fontWeight: "700",
        textTransform: "uppercase"
    },

    deletedText: {
        fontSize: 12,
        color: "#777"
    },

    cardTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 8
    },

    cardContent: {
        fontSize: 14,
        color: "#666",
        fontStyle: "italic",
        marginBottom: 16
    },

    cardActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderColor: "#eee",
        paddingTop: 12
    },

    restoreBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },

    restoreText: {
        color: "#276b2e",
        fontWeight: "700"
    },

    deleteBtn: {
        padding: 6
    },

    bottomNav: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: "rgba(255,255,255,0.9)",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        borderTopLeftRadius: 48,
        borderTopRightRadius: 48
    },

    navItem: {
        alignItems: "center"
    },

    navText: {
        fontSize: 11,
        marginTop: 2
    },

    navActive: {
        alignItems: "center",
        backgroundColor: "#cdecc9",
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20
    },

    navActiveText: {
        fontSize: 11,
        fontWeight: "700"
    }

})

export default TrashScreen