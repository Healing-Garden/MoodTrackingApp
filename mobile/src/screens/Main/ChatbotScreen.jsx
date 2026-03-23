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
    Animated
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { theme } from '../../theme';
import api from '../../services/api';
import { io } from 'socket.io-client';
import BottomNavBar from '../../components/common/BottomNavBar';
import logo from '../../../assets/images/logo.png';

const { width, height } = Dimensions.get('window');

const ChatbotScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [user, setUser] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const scrollViewRef = useRef();
    const socketRef = useRef(null);
    const hasInitialJoinRef = useRef(false);

    const menuAnim = useRef(new Animated.Value(-width)).current;
    
    // Dynamically derive socket URL from API base URL to ensure they match
    const apiBaseUrl = api.defaults.baseURL || 'http://192.168.1.253:8080/api';
    const socketUrl = apiBaseUrl.replace('/api', '');
    const moodContext = {
        recentMood: 'anxious',
        energyLevel: 3,
        timestamp: new Date().toISOString()
    };
    const userId = user?._id ? String(user._id) : (user?.id ? String(user.id) : null);

    const formatTime = (ts) => {
        const d = ts ? new Date(ts) : new Date();
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const mapSocketMessageToUi = (msg) => {
        return {
            id: msg.id || msg._id || `${Date.now()}-${Math.random()}`,
            sender: msg.sender === 'user' ? 'user' : 'ai',
            text: msg.text || '',
            time: formatTime(msg.timestamp),
            exercise: msg.exercise || null,
            isCrisis: msg.isCrisis || false
        };
    };

    const toggleMenu = (show) => {
        setIsMenuVisible(show);
        Animated.spring(menuAnim, {
            toValue: show ? 0 : -width,
            useNativeDriver: true,
            bounciness: 4
        }).start();
    };

    const refreshChatHistory = async () => {
        if (!userId) return;
        try {
            const res = await api.get(`/chat/sessions/${userId}`);
            const sessions = Array.isArray(res.data?.data) ? res.data.data : [];
            setChatHistory(
                sessions.map((s) => ({
                    id: s._id,
                    title: (s.sessionSummary && String(s.sessionSummary).trim())
                        ? String(s.sessionSummary).trim().slice(0, 40)
                        : 'Chat Session',
                    date: s.startTime ? new Date(s.startTime).toLocaleDateString(undefined, { month: 'short', day: '2-digit' }) : '',
                }))
            );
        } catch (err) {
            console.log('Failed to load chat sessions:', err?.message || err);
            setChatHistory([]);
        }
    };

    // Load user profile once (needed for socket userId)
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get('/profile');
                setUser(res.data?.user || null);
            } catch (err) {
                console.log('Failed to load profile:', err?.message || err);
            }
        };
        loadProfile();
    }, []);

    // Load socket connection + auto-create session (same as web)
    useEffect(() => {
        if (!userId) return;
        if (socketRef.current) return;

        const socket = io(socketUrl, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            timeout: 10000
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setIsConnected(true);
            if (!hasInitialJoinRef.current) {
                hasInitialJoinRef.current = true;
                socket.emit('join-chat', { userId, moodContext });
            }
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
            console.log('Socket connect_error:', error?.message || error);
            setIsConnected(false);
        });

        socket.on('session_created', (data) => {
            setSessionId(data?.sessionId || null);
        });

        socket.on('session_loaded', (data) => {
            setSessionId(data?.sessionId || null);
            const loaded = Array.isArray(data?.messages) ? data.messages : [];
            setMessages(loaded.map(mapSocketMessageToUi));
            setIsTyping(false);
        });

        socket.on('message', (msg) => {
            setIsTyping(false);
            setMessages((prev) => [...prev, mapSocketMessageToUi(msg)]);
        });

        socket.on('error', (err) => {
            console.log('Socket error event:', err?.message || err);
            setIsTyping(false);
        });

        return () => {
            try {
                socket.disconnect();
            } catch {
                // ignore
            }
            socketRef.current = null;
            hasInitialJoinRef.current = false;
            setIsConnected(false);
        };
    }, [userId]);

    // Refresh sessions when menu opens
    useEffect(() => {
        if (!isMenuVisible || !userId) return;
        refreshChatHistory();
    }, [isMenuVisible, userId]);

    const startNewChat = () => {
        if (!socketRef.current || !isConnected || !userId) return;

        setMessages([]);
        setSessionId(null);
        setIsTyping(false);

        socketRef.current.emit('join-chat', { userId, moodContext });
        toggleMenu(false);
    };

    const loadSession = (targetSessionId) => {
        if (!socketRef.current || !isConnected || !userId) return;

        setMessages([]);
        setSessionId(null);
        setIsTyping(false);

        socketRef.current.emit('join-chat', {
            userId,
            moodContext,
            sessionId: targetSessionId
        });
        toggleMenu(false);
    };

    const handleSend = () => {
        if (!socketRef.current || !isConnected || !userId) return;
        if (!sessionId) return; // need active session from server
        if (isTyping) return;
        if (inputText.trim() === '') return;

        const text = inputText.trim();
        const newUserMsg = {
            id: Date.now(),
            text,
            sender: 'user',
            time: formatTime(new Date()),
            exercise: null,
            isCrisis: false
        };

        setMessages((prev) => [...prev, newUserMsg]);
        setInputText('');
        setIsTyping(true);
        socketRef.current.emit('send-message', { text });
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
                                {msg.exercise && (
                                    <View style={styles.exerciseCard}>
                                        <Text style={styles.exerciseTitle}>Suggested Exercise</Text>
                                        <Text style={styles.exerciseText}>{msg.exercise}</Text>
                                    </View>
                                )}
                                {msg.isCrisis && (
                                    <View style={styles.crisisCard}>
                                        <Text style={styles.crisisTitle}>Support is available</Text>
                                        <Text style={styles.crisisText}>If you're in crisis, please contact Emergency: 115 (VN) or 911 (US)</Text>
                                    </View>
                                )}
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
                            editable={!isTyping && isConnected && !!sessionId}
                        />
                        <TouchableOpacity 
                            style={[
                                styles.sendButton,
                                (!isConnected || !sessionId || isTyping || !inputText.trim()) && styles.sendButtonDisabled
                            ]}
                            onPress={handleSend}
                            disabled={!isConnected || !sessionId || isTyping || !inputText.trim()}
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
                        {chatHistory.length === 0 ? (
                            <View style={styles.historyEmpty}>
                                <Text style={styles.historyEmptyText}>No chat sessions yet</Text>
                            </View>
                        ) : (
                            chatHistory.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.historyItem} onPress={() => loadSession(item.id)}>
                                <View style={styles.historyIconBox}>
                                    <MaterialIcons name="chat-bubble-outline" size={18} color={theme.colors.primary} />
                                </View>
                                <View style={styles.historyContent}>
                                    <Text style={styles.historyItemTitle} numberOfLines={1}>{item.title}</Text>
                                    <Text style={styles.historyItemDate}>{item.date}</Text>
                                </View>
                            </TouchableOpacity>
                            ))
                        )}
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
    },
    historyEmpty: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    historyEmptyText: {
        fontSize: 12,
        color: '#999',
        fontWeight: '600',
    },
    exerciseCard: {
        marginTop: 10,
        padding: 12,
        borderRadius: 14,
        backgroundColor: 'rgba(39, 107, 46, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(39, 107, 46, 0.15)',
    },
    exerciseTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#276b2e',
        marginBottom: 6,
    },
    exerciseText: {
        fontSize: 13,
        lineHeight: 18,
        color: theme.colors.onSurface,
        fontWeight: '600',
    },
    crisisCard: {
        marginTop: 10,
        padding: 12,
        borderRadius: 14,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    crisisTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#b91c1c',
        marginBottom: 6,
    },
    crisisText: {
        fontSize: 12,
        lineHeight: 16,
        color: '#991b1b',
        fontWeight: '600',
    }
});

export default ChatbotScreen;
