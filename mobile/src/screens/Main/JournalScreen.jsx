import React from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    StyleSheet,
    StatusBar
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../theme";

const JournalScreen = () => {

    const entries = [
        {
            id: 1,
            date: "October 24, 2023",
            title: "The Morning Dew",
            tag: "Gratitude",
            content: "Today the garden felt particularly vibrant. I spent thirty minutes just watching the sun hit the hydrangea petals.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDllPwbkrifogq-y4jjgPMVxmkpY3iy_aizhGgvjPmUGpzxwMXeYOSqPewYedwq8NtMw9VXULhBTSdiayueg4QnZBGojxU45hmrlx5wppLLpzaq4CmfQxsPqvjRnqNm1_t1C-oLayDSMVUIXJ77SKpvueBo4uSKS0pE2EOSi7cTDTH-IjBUpxg0WySLCDrDlD8ZoGWFbsyymlo5gGubcYKL9e2eI961z93hNjQaSEsbF8Qt0knme2-8faqyAAxwZUbf3wGSkFr5dTs"
        }
    ]

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.profileRow}>
                    <Image
                        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBz1wh155THxa5_MK-wkpRcOkhWwYI9RsHE3E8yq1hMgcJlJrEguJ2Uea0L43CZ4OervfoD41a2q9VJHTNgz3vCL2Wi5xAw5LobEKtdo9NgwKzV5vwiLkgD3J9ud9j7IVTJn0FWS6XTmf61vgpvv27sUU2kKz-mCaX6kBEtTEmhjAPeTXbG5U-z9Pl1peKIeT4Xt1VbixHw0SxIo3YA8mkIf24UsGVpzkQdc31Vimuoqh4U2mI1OES0w37WAnAO7881H-U8jaCDfc0" }}
                        style={styles.avatar}
                    />
                    <Text style={styles.logo}>Digital Sanctuary</Text>
                </View>

                <TouchableOpacity style={styles.iconBtn}>
                    <MaterialIcons name="settings" size={24} color="#064e3b" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

                {/* TITLE */}
                <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>My Journal</Text>
                    <Text style={styles.subtitle}>Reflecting on your garden's growth.</Text>
                </View>

                {/* TABS */}
                <View style={styles.tabs}>
                    <Text style={styles.tab}>Write</Text>
                    <Text style={styles.tabActive}>My Entries</Text>
                    <Text style={styles.tab}>Trash</Text>
                </View>

                {/* SEARCH */}
                <View style={styles.searchBox}>
                    <MaterialIcons name="search" size={22} color="#6b7280" />
                    <TextInput
                        placeholder="Search your memories..."
                        style={styles.searchInput}
                    />
                </View>

                {/* ENTRY CARD */}
                {entries.map(e => (
                    <View key={e.id} style={styles.card}>

                        <View style={styles.cardHeader}>
                            <View>
                                <Text style={styles.date}>{e.date}</Text>
                                <Text style={styles.title}>{e.title}</Text>
                            </View>

                            <View style={styles.moodBlob}>
                                <MaterialIcons name="wb-sunny" size={22} color="#fff" />
                            </View>

                        </View>

                        <View style={styles.tag}>
                            <Text style={styles.tagText}>{e.tag}</Text>
                        </View>

                        <Text style={styles.content}>{e.content}</Text>

                        <Image source={{ uri: e.image }} style={styles.image} />

                    </View>
                ))}

            </ScrollView>

            {/* FAB */}
            <TouchableOpacity style={styles.fab}>
                <LinearGradient
                    colors={["#caa910", "#705d00"]}
                    style={styles.fab}
                >
                    <MaterialIcons name="add" size={30} color="white" />
                </LinearGradient>
            </TouchableOpacity>

        </View>
    )
}

export default JournalScreen

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#EBFFE6"
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 10
    },

    profileRow: {
        flexDirection: "row",
        alignItems: "center"
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10
    },

    logo: {
        fontSize: 20,
        fontWeight: "700"
    },

    iconBtn: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center"
    },

    pageHeader: {
        paddingHorizontal: 20,
        marginTop: 10
    },

    pageTitle: {
        fontSize: 32,
        fontWeight: "800"
    },

    subtitle: {
        opacity: .6
    },

    tabs: {
        flexDirection: "row",
        backgroundColor: "#d6f7d1",
        margin: 20,
        borderRadius: 30,
        padding: 4
    },

    tab: {
        flex: 1,
        textAlign: "center",
        padding: 10
    },

    tabActive: {
        flex: 1,
        textAlign: "center",
        padding: 10,
        backgroundColor: "#60a560",
        borderRadius: 30,
        color: "#fff"
    },

    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e8f9e4",
        marginHorizontal: 20,
        borderRadius: 12,
        paddingHorizontal: 10,
        marginBottom: 20
    },

    searchInput: {
        flex: 1,
        padding: 12
    },

    card: {
        backgroundColor: "#fff",
        margin: 20,
        padding: 20,
        borderRadius: 16
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    date: {
        fontSize: 11,
        fontWeight: "700",
        opacity: .6
    },

    title: {
        fontSize: 22,
        fontWeight: "700"
    },

    moodBlob: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#caa910",
        justifyContent: "center",
        alignItems: "center"
    },

    tag: {
        backgroundColor: "#9ae1ff",
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        marginVertical: 8
    },

    tagText: {
        fontSize: 12,
        fontWeight: "700"
    },

    content: {
        opacity: .7,
        marginBottom: 10
    },

    image: {
        width: "100%",
        height: 160,
        borderRadius: 12
    },

    fab: {
        position: "absolute",
        right: 20,
        bottom: 100,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center"
    }

})