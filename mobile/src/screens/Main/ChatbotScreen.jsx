import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    StatusBar,
    Image,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Modal,
    Animated
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { theme } from '../../theme';
import BottomNavBar from '../../components/common/BottomNavBar';
import logo from '../../../assets/images/logo.png';

const { width, height } = Dimensions.get('window');

const ChatbotScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Welcome to your sanctuary. I am Lumina, your empathetic guide. How are you feeling in your garden today?", sender: 'ai', time: '10:00 AM' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const scrollViewRef = useRef();

    const menuAnim = useRef(new Animated.Value(-width)).current;

    const chatHistory = [
        { id: 'h1', title: "Morning Anxiety", date: "Oct 24" },
        { id: 'h2', title: "Finding Gratitude", date: "Oct 22" },
        { id: 'h3', title: "Workplace Stress", date: "Oct 21" },
        { id: 'h4', title: "Peaceful Evening", date: "Oct 19" }
    ];

    const toggleMenu = (show) => {
        setIsMenuVisible(show);
        Animated.spring(menuAnim, {
            toValue: show ? 0 : -width,
            useNativeDriver: true,
            bounciness: 4
        }).start();
    };

    const handleSend = () => {
        if (inputText.trim() === '') return;

        const newUserMsg = {
            id: Date.now(),
            text: inputText,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newUserMsg]);
        setInputText('');

        // Simulate AI Response
        setTimeout(() => {
            const aiMsg = {
                id: Date.now() + 1,
                text: "Thank you for sharing that with me. It’s important to acknowledge these feelings. Let's take a deep breath together.",
                sender: 'ai',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 1500);
    };

    const startNewChat = () => {
        setMessages([{ id: 1, text: "Welcome back. Let's start a fresh conversation. What's on your mind?", sender: 'ai', time: 'Just now' }]);
        toggleMenu(false);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* HEADER */}
            <BlurView intensity={80} style={styles.header}>
                <TouchableOpacity onPress={() => toggleMenu(true)} style={styles.iconButton}>
                    <MaterialIcons name="menu" size={28} color={theme.colors.primary} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Lumina Chat</Text>
                    <View style={styles.onlineBadge} />
                </View>
                <View style={styles.avatarContainer}>
                    <Image source={logo} style={styles.avatar} resizeMode="contain" />
                </View>
            </BlurView>

            {/* CHAT AREA */}
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={styles.chatWrapper}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <ScrollView 
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                    contentContainerStyle={styles.scrollContent}
                >
                    {messages.map((msg) => (
                        <View key={msg.id} style={[styles.messageContainer, msg.sender === 'user' ? styles.userMsgContainer : styles.aiMsgContainer]}>
                            <View style={[styles.bubble, msg.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
                                <Text style={[styles.messageText, msg.sender === 'user' ? styles.userText : styles.aiText]}>{msg.text}</Text>
                            </View>
                            <Text style={styles.timeText}>{msg.time}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* INPUT AREA */}
                <View style={styles.inputOuter}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Message Lumina..."
                            placeholderTextColor="#a0a99c"
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                        />
                        <TouchableOpacity 
                            style={[styles.sendButton, !inputText && styles.sendButtonDisabled]} 
                            onPress={handleSend}
                            disabled={!inputText}
                        >
                            <MaterialIcons name="send" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

            {/* SIDE HISTORY MENU */}
            {isMenuVisible && (
                <TouchableOpacity 
                    activeOpacity={1} 
                    onPress={() => toggleMenu(false)} 
                    style={StyleSheet.absoluteFill}
                >
                    <BlurView intensity={20} style={StyleSheet.absoluteFill} />
                </TouchableOpacity>
            )}
            <Animated.View style={[styles.historyMenu, { transform: [{ translateX: menuAnim }] }]}>
                <SafeAreaWrapper>
                    <View style={styles.menuHeader}>
                        <Text style={styles.menuTitle}>History</Text>
                        <TouchableOpacity onPress={startNewChat} style={styles.newChatBtn}>
                            <MaterialIcons name="add" size={20} color="#fff" />
                            <Text style={styles.newChatText}>New Chat</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.historyList}>
                        {chatHistory.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.historyItem}>
                                <View style={styles.historyIconBox}>
                                    <MaterialIcons name="chat-bubble-outline" size={18} color={theme.colors.primary} />
                                </View>
                                <View style={styles.historyContent}>
                                    <Text style={styles.historyItemTitle} numberOfLines={1}>{item.title}</Text>
                                    <Text style={styles.historyItemDate}>{item.date}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View style={styles.menuFooter}>
                        <TouchableOpacity style={styles.footerLink}>
                            <MaterialIcons name="settings" size={20} color="#777" />
                            <Text style={styles.footerLinkText}>Chat Settings</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaWrapper>
            </Animated.View>

            <BottomNavBar navigation={navigation} activeTab="Chatbot" />
        </View>
    );
};

const SafeAreaWrapper = ({ children }) => (
    <View style={{ flex: 1, paddingTop: 60, paddingBottom: 20 }}>{children}</View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f9f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.03)',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#064e3b',
        fontFamily: theme.fonts.headline,
    },
    onlineBadge: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#60a561',
    },
    avatarContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#fff',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    chatWrapper: {
        flex: 1,
        paddingTop: 140,
        paddingBottom: 140,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    messageContainer: {
        marginBottom: 20,
        maxWidth: '85%',
    },
    userMsgContainer: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    aiMsgContainer: {
        alignSelf: 'flex-start',
    },
    bubble: {
        padding: 16,
        borderRadius: 20,
        ...theme.shadows.soft,
    },
    userBubble: {
        backgroundColor: theme.colors.primary,
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    userText: {
        color: '#fff',
    },
    aiText: {
        color: theme.colors.onSurface,
    },
    timeText: {
        fontSize: 10,
        color: '#999',
        marginTop: 4,
    },
    inputOuter: {
        padding: 16,
        backgroundColor: 'rgba(246, 249, 245, 0.9)',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        ...theme.shadows.soft,
    },
    input: {
        flex: 1,
        fontSize: 16,
        maxHeight: 120,
        color: '#333',
        paddingTop: 8,
        paddingBottom: 8,
        marginRight: 10,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.primary,
    },
    sendButtonDisabled: {
        backgroundColor: '#ccd4c9',
    },
    // HISTORY MENU
    historyMenu: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: width * 0.8,
        backgroundColor: '#fff',
        zIndex: 1000,
        borderRightWidth: 1,
        borderRightColor: 'rgba(0,0,0,0.05)',
        ...theme.shadows.soft,
    },
    menuHeader: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    menuTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#064e3b',
        marginBottom: 16,
    },
    newChatBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: theme.colors.primary,
        paddingVertical: 12,
        borderRadius: 12,
        ...theme.shadows.primary,
    },
    newChatText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    historyList: {
        flex: 1,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.02)',
    },
    historyIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(96, 165, 96, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    historyContent: {
        flex: 1,
    },
    historyItemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    historyItemDate: {
        fontSize: 11,
        color: '#999',
    },
    menuFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f4ef',
    },
    footerLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    footerLinkText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    }
});

export default ChatbotScreen;
