import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as chatService from './chatService.js';
import * as userService from './userService.js';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import './ChatStyles.css';

const ChatComponent = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [groups, setGroups] = useState([]);
    const [contacts, setContacts] = useState({});
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('users'); // 'users', 'groups', 'contacts'

    // Get current user from localStorage or fetch from API
    useEffect(() => {
        const fetchUser = async () => {
            console.log("Checking localStorage for user data...");
            const userString = localStorage.getItem('user');
            console.log("User string from localStorage:", userString);

            try {
                // Essayer d'abord 'user'
                let user = userString ? JSON.parse(userString) : null;

                // Si pas d'utilisateur, essayer 'userInfo'
                if (!user) {
                    const userInfoString = localStorage.getItem('userInfo');
                    console.log("UserInfo string from localStorage:", userInfoString);
                    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
                    user = userInfo?.user || userInfo;
                }

                // Si toujours pas d'utilisateur, essayer de récupérer à partir du token
                if (!user || !user._id) {
                    console.log("No valid user found in localStorage, fetching from API...");
                    user = await userService.fetchUserInfo();
                    console.log("User fetched from API:", user);
                }

                console.log("Final user object:", user);

                if (user && user._id) {
                    console.log("Valid user found with ID:", user._id);
                    setCurrentUser(user);
                    // Connect to socket
                    chatService.connectSocket(user._id);
                    // Load initial data
                    loadUserData(user._id);
                } else if (user && !user._id && user.id) {
                    // Certaines applications utilisent 'id' au lieu de '_id'
                    console.log("User found with 'id' instead of '_id':", user.id);
                    user._id = user.id; // Ajouter _id pour compatibilité
                    setCurrentUser(user);
                    chatService.connectSocket(user._id);
                    loadUserData(user._id);
                } else {
                    console.error("No valid user found. Redirecting to login...");
                    // Rediriger vers la page de connexion
                    navigate('/signin');
                }
            } catch (error) {
                console.error("Error getting user data:", error);
                navigate('/signin');
            }
        };

        fetchUser();
    }, [navigate]);

    // Load user's conversations, groups, and contacts
    const loadUserData = async (userId) => {
        console.log("Loading user data for userId:", userId);
        setIsLoading(true);
        try {
            // Load conversations
            console.log("Fetching user chats...");
            try {
                const chatsResponse = await chatService.getUserChats(userId);
                console.log("Chats response:", chatsResponse);
                if (chatsResponse && chatsResponse.success) {
                    console.log("Setting conversations:", chatsResponse.data);
                    setConversations(chatsResponse.data);
                } else {
                    console.warn("Invalid chats response format or empty data, using mock data");


                    setConversations(mockConversations);
                }
            } catch (chatError) {
                console.error("Error fetching chats:", chatError);

                // En cas d'erreur, utiliser des données fictives
                const mockConversations = [
                    {
                        user: {
                            _id: '101',
                            name: 'Rashid Khan',
                            email: 'rashid@example.com',
                            profileImage: '../assets/images/faces/5.jpg',
                            status: 'online'
                        },
                        lastMessage: {
                            _id: '1001',
                            sender_id: '101',
                            receiver_id: userId,
                            message: 'Hey!! you are there? 😊',
                            sent_at: new Date(Date.now() - 3600000).toISOString(),
                            is_read: false
                        },
                        unreadCount: 3
                    },
                    {
                        user: {
                            _id: '102',
                            name: 'Jamison Jen',
                            email: 'jamison@example.com',
                            profileImage: '../assets/images/faces/2.jpg',
                            status: 'online'
                        },
                        lastMessage: {
                            _id: '1002',
                            sender_id: '102',
                            receiver_id: userId,
                            message: 'Typing...',
                            sent_at: new Date(Date.now() - 7200000).toISOString(),
                            is_read: true
                        },
                        unreadCount: 0
                    }
                ];

                setConversations(mockConversations);
            }

            // Load groups
            console.log("Fetching user groups...");
            try {
                const groupsResponse = await chatService.getUserGroups(userId);
                console.log("Groups response:", groupsResponse);
                if (groupsResponse && groupsResponse.success) {
                    console.log("Setting groups:", groupsResponse.data);
                    setGroups(groupsResponse.data);
                } else {
                    console.warn("Invalid groups response format or empty data, using mock data");

                    // Créer des groupes fictifs pour test
                    const mockGroups = [
                        {
                            _id: '201',
                            name: 'Huge Rocks 😍',
                            description: 'Group for rock climbing enthusiasts',
                            creator: userId,
                            members: [
                                { _id: '101', name: 'Rashid Khan', email: 'rashid@example.com', profileImage: '../assets/images/faces/5.jpg', status: 'online' },
                                { _id: '102', name: 'Jamison Jen', email: 'jamison@example.com', profileImage: '../assets/images/faces/2.jpg', status: 'online' },
                                { _id: '103', name: 'Andy Max', email: 'andy@example.com', profileImage: '../assets/images/faces/10.jpg', status: 'online' },
                                { _id: '104', name: 'Kerina Cherish', email: 'kerina@example.com', profileImage: '../assets/images/faces/6.jpg', status: 'online' }
                            ],
                            avatar: '../assets/images/faces/17.jpg',
                            last_message: new Date(Date.now() - 3600000).toISOString(),
                            lastMessage: {
                                _id: '2001',
                                sender_id: '101',
                                sender: { name: 'Mony', email: 'mony@example.com' },
                                group_id: '201',
                                message: 'Typing...',
                                sent_at: new Date(Date.now() - 3600000).toISOString(),
                                read_by: [userId]
                            },
                            unreadCount: 2
                        },
                        {
                            _id: '202',
                            name: 'Creative Group',
                            description: 'Group for creative professionals',
                            creator: userId,
                            members: [
                                { _id: '105', name: 'Rony Erick', email: 'rony@example.com', profileImage: '../assets/images/faces/11.jpg', status: 'offline' },
                                { _id: '106', name: 'Kenath Kin', email: 'kenath@example.com', profileImage: '../assets/images/faces/3.jpg', status: 'offline' },
                                { _id: '107', name: 'Thomas Lie', email: 'thomas@example.com', profileImage: '../assets/images/faces/13.jpg', status: 'offline' }
                            ],
                            avatar: '../assets/images/faces/18.jpg',
                            last_message: new Date(Date.now() - 7200000).toISOString(),
                            lastMessage: {
                                _id: '2002',
                                sender_id: '106',
                                sender: { name: 'Kin', email: 'kenath@example.com' },
                                group_id: '202',
                                message: 'Have any updates today?',
                                sent_at: new Date(Date.now() - 7200000).toISOString(),
                                read_by: []
                            },
                            unreadCount: 1
                        },
                        {
                            _id: '203',
                            name: 'Anyside Spriritual 😎',
                            description: 'Spiritual discussion group',
                            creator: '105',
                            members: [
                                { _id: '101', name: 'Rashid Khan', email: 'rashid@example.com', profileImage: '../assets/images/faces/5.jpg', status: 'online' },
                                { _id: '105', name: 'Rony Erick', email: 'rony@example.com', profileImage: '../assets/images/faces/11.jpg', status: 'offline' },
                                userId
                            ],
                            avatar: '../assets/images/faces/19.jpg',
                            last_message: new Date(Date.now() - 172800000).toISOString(),
                            lastMessage: {
                                _id: '2003',
                                sender_id: '105',
                                group_id: '203',
                                message: 'Samantha, Adam, Jessica, Emily, Alex',
                                sent_at: new Date(Date.now() - 172800000).toISOString(),
                                read_by: [userId]
                            },
                            unreadCount: 0
                        }
                    ];

                    setGroups(mockGroups);
                }
            } catch (groupError) {
                console.error("Error fetching groups:", groupError);

                // En cas d'erreur, utiliser des données fictives
                const mockGroups = [
                    {
                        _id: '201',
                        name: 'Huge Rocks 😍',
                        description: 'Group for rock climbing enthusiasts',
                        creator: userId,
                        members: [
                            { _id: '101', name: 'Rashid Khan', email: 'rashid@example.com', profileImage: '../assets/images/faces/5.jpg', status: 'online' },
                            { _id: '102', name: 'Jamison Jen', email: 'jamison@example.com', profileImage: '../assets/images/faces/2.jpg', status: 'online' }
                        ],
                        avatar: '../assets/images/faces/17.jpg',
                        last_message: new Date(Date.now() - 3600000).toISOString(),
                        lastMessage: {
                            _id: '2001',
                            sender_id: '101',
                            sender: { name: 'Mony', email: 'mony@example.com' },
                            group_id: '201',
                            message: 'Typing...',
                            sent_at: new Date(Date.now() - 3600000).toISOString(),
                            read_by: [userId]
                        },
                        unreadCount: 2
                    }
                ];

                setGroups(mockGroups);
            }

            // Fetch contacts (all users from database)
            console.log("Fetching contacts (all users)...");
            try {
                // Récupérer tous les utilisateurs de la base de données
                const allUsers = await userService.fetchAllUsers();
                console.log("All users fetched:", allUsers);

                if (Array.isArray(allUsers) && allUsers.length > 0) {
                    // Organiser les utilisateurs par ordre alphabétique
                    const organizedUsers = userService.organizeUsersByAlphabet(allUsers);
                    console.log("Organized users by alphabet:", organizedUsers);

                    // Définir les contacts
                    setContacts(organizedUsers);
                } else {
                    console.warn("No users found or invalid response, using mock data");

                    // Pour test: créer des contacts fictifs si aucun utilisateur n'est trouvé
                    const mockContacts = {
                        'A': [
                            { _id: '1', name: 'Alice Smith', email: 'alice@example.com', profileImage: '../assets/images/faces/5.jpg' },
                            { _id: '2', name: 'Adam Johnson', email: 'adam@example.com', profileImage: '../assets/images/faces/12.jpg' }
                        ],
                        'B': [
                            { _id: '3', name: 'Bob Williams', email: 'bob@example.com', profileImage: '../assets/images/faces/14.jpg' }
                        ],
                        'C': [
                            { _id: '4', name: 'Charlie Brown', email: 'charlie@example.com', profileImage: '../assets/images/faces/3.jpg' }
                        ]
                    };
                    console.log("Setting mock contacts for testing");
                    setContacts(mockContacts);
                }
            } catch (contactError) {
                console.error("Error fetching contacts:", contactError);

                // En cas d'erreur, utiliser des contacts fictifs
                const mockContacts = {
                    'A': [
                        { _id: '1', name: 'Alice Smith', email: 'alice@example.com', profileImage: '../assets/images/faces/5.jpg' },
                        { _id: '2', name: 'Adam Johnson', email: 'adam@example.com', profileImage: '../assets/images/faces/12.jpg' }
                    ],
                    'B': [
                        { _id: '3', name: 'Bob Williams', email: 'bob@example.com', profileImage: '../assets/images/faces/14.jpg' }
                    ],
                    'C': [
                        { _id: '4', name: 'Charlie Brown', email: 'charlie@example.com', profileImage: '../assets/images/faces/3.jpg' }
                    ]
                };
                setContacts(mockContacts);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Load conversation messages when active chat changes
    useEffect(() => {
        if (activeChat && currentUser) {
            loadMessages();
        }
    }, [activeChat, currentUser]);

    // Generate mock messages for testing
    const generateMockMessages = (chatId, isGroup = false) => {
        const now = Date.now();
        const otherUserId = isGroup ? chatId : activeChat.user._id;
        const otherUserName = isGroup ? activeChat.name : activeChat.user.name;

        return [
            {
                _id: `msg_${now}_1`,
                sender_id: otherUserId,
                receiver_id: isGroup ? null : currentUser._id,
                group_id: isGroup ? chatId : null,
                message: `Bonjour! Comment allez-vous aujourd'hui?`,
                sent_at: new Date(now - 3600000).toISOString(),
                is_read: true,
                sender: { name: otherUserName }
            },
            {
                _id: `msg_${now}_2`,
                sender_id: currentUser._id,
                receiver_id: isGroup ? null : otherUserId,
                group_id: isGroup ? chatId : null,
                message: `Je vais bien, merci! Et vous?`,
                sent_at: new Date(now - 3500000).toISOString(),
                is_read: true
            },
            {
                _id: `msg_${now}_3`,
                sender_id: otherUserId,
                receiver_id: isGroup ? null : currentUser._id,
                group_id: isGroup ? chatId : null,
                message: `Très bien! Je travaille sur le projet Lavoro.`,
                sent_at: new Date(now - 3400000).toISOString(),
                is_read: true,
                sender: { name: otherUserName }
            },
            {
                _id: `msg_${now}_4`,
                sender_id: currentUser._id,
                receiver_id: isGroup ? null : otherUserId,
                group_id: isGroup ? chatId : null,
                message: `C'est génial! J'ai quelques questions sur les fonctionnalités.`,
                sent_at: new Date(now - 3300000).toISOString(),
                is_read: true
            },
            {
                _id: `msg_${now}_5`,
                sender_id: otherUserId,
                receiver_id: isGroup ? null : currentUser._id,
                group_id: isGroup ? chatId : null,
                message: `Bien sûr, je suis là pour vous aider. Quelles sont vos questions?`,
                sent_at: new Date(now - 3200000).toISOString(),
                is_read: true,
                sender: { name: otherUserName }
            }
        ];
    };

    // Load messages for the active chat
    const loadMessages = async () => {
        setIsLoading(true);
        try {
            if (activeChat.type === 'direct') {
                try {
                    const response = await chatService.getConversation(
                        currentUser._id,
                        activeChat.user._id
                    );
                    if (response && response.success && response.data.messages && response.data.messages.length > 0) {
                        setMessages(response.data.messages);
                    } else {
                        console.log("No messages found or invalid response, using mock data");
                        // Utiliser des messages fictifs
                        setMessages(generateMockMessages(activeChat.user._id));
                    }
                } catch (error) {
                    console.error('Error loading direct messages:', error);
                    // En cas d'erreur, utiliser des messages fictifs
                    setMessages(generateMockMessages(activeChat.user._id));
                }
            } else if (activeChat.type === 'group') {
                try {
                    const response = await chatService.getGroupMessages(
                        activeChat._id,
                        currentUser._id
                    );
                    if (response && response.success && response.data.messages && response.data.messages.length > 0) {
                        setMessages(response.data.messages);
                    } else {
                        console.log("No group messages found or invalid response, using mock data");
                        // Utiliser des messages fictifs
                        setMessages(generateMockMessages(activeChat._id, true));
                    }
                } catch (error) {
                    console.error('Error loading group messages:', error);
                    // En cas d'erreur, utiliser des messages fictifs
                    setMessages(generateMockMessages(activeChat._id, true));
                }
            }
        } catch (error) {
            console.error('Error in loadMessages:', error);
            // Utiliser des messages fictifs en cas d'erreur générale
            if (activeChat.type === 'direct') {
                setMessages(generateMockMessages(activeChat.user._id));
            } else {
                setMessages(generateMockMessages(activeChat._id, true));
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Handle sending a message
    const handleSendMessage = async (message, attachment = null) => {
        try {
            if (activeChat.type === 'direct') {
                const messageData = {
                    sender_id: currentUser._id,
                    receiver_id: activeChat.user._id,
                    message
                };

                if (attachment) {
                    await chatService.sendMessage(messageData, attachment);
                } else {
                    // For faster UI update, emit through socket
                    chatService.emitPrivateMessage(messageData);
                }
            } else if (activeChat.type === 'group') {
                const messageData = {
                    group_id: activeChat._id,
                    sender_id: currentUser._id,
                    message
                };

                if (attachment) {
                    await chatService.sendGroupMessage(messageData, attachment);
                } else {
                    // For faster UI update, emit through socket
                    chatService.emitGroupMessage(messageData);
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Set up socket event listeners
    useEffect(() => {
        if (!currentUser) return;

        // Listen for new direct messages
        chatService.onNewMessage((data) => {
            // If the message is from the active chat, add it to messages
            if (
                activeChat &&
                activeChat.type === 'direct' &&
                (data.message.sender_id === activeChat.user._id ||
                    data.message.receiver_id === activeChat.user._id)
            ) {
                setMessages((prevMessages) => [...prevMessages, data.message]);
            }

            // Update the conversations list
            updateConversationWithNewMessage(data.message, data.sender);
        });

        // Listen for new group messages
        chatService.onNewGroupMessage((data) => {
            // If the message is from the active group, add it to messages
            if (
                activeChat &&
                activeChat.type === 'group' &&
                data.message.group_id === activeChat._id
            ) {
                setMessages((prevMessages) => [...prevMessages, data.message]);
            }

            // Update the groups list
            updateGroupWithNewMessage(data.message, data.sender, data.group);
        });

        // Listen for message sent confirmation
        chatService.onMessageSent((message) => {
            // Add the sent message to the messages list
            if (
                activeChat &&
                activeChat.type === 'direct' &&
                message.receiver_id === activeChat.user._id
            ) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        });

        // Listen for group message sent confirmation
        chatService.onGroupMessageSent((message) => {
            // Add the sent message to the messages list
            if (
                activeChat &&
                activeChat.type === 'group' &&
                message.group_id === activeChat._id
            ) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        });

        // Clean up listeners on unmount
        return () => {
            // Désenregistrer les écouteurs d'événements
            chatService.offNewMessage();
            chatService.offMessageSent();
            chatService.offNewGroupMessage();
            chatService.offGroupMessageSent();
        };
    }, [currentUser, activeChat]);

    // Update conversations list with a new message
    const updateConversationWithNewMessage = (message, sender) => {
        setConversations((prevConversations) => {
            // Check if conversation already exists
            const existingConvIndex = prevConversations.findIndex(
                (conv) => conv.user._id === sender._id
            );

            if (existingConvIndex !== -1) {
                // Update existing conversation
                const updatedConversations = [...prevConversations];
                updatedConversations[existingConvIndex] = {
                    ...updatedConversations[existingConvIndex],
                    lastMessage: message,
                    unreadCount:
                        message.sender_id !== currentUser._id
                            ? updatedConversations[existingConvIndex].unreadCount + 1
                            : updatedConversations[existingConvIndex].unreadCount
                };
                return updatedConversations;
            } else {
                // Add new conversation
                return [
                    {
                        user: sender,
                        lastMessage: message,
                        unreadCount: message.sender_id !== currentUser._id ? 1 : 0
                    },
                    ...prevConversations
                ];
            }
        });
    };

    // Update groups list with a new message
    const updateGroupWithNewMessage = (message, _sender, group) => {
        // Note: _sender est préfixé avec un underscore pour indiquer qu'il n'est pas utilisé
        console.log("Updating group with new message:", { message, group });

        setGroups((prevGroups) => {
            // Check if group already exists
            const existingGroupIndex = prevGroups.findIndex(
                (g) => g._id === group._id
            );

            if (existingGroupIndex !== -1) {
                // Update existing group
                const updatedGroups = [...prevGroups];
                updatedGroups[existingGroupIndex] = {
                    ...updatedGroups[existingGroupIndex],
                    lastMessage: message,
                    unreadCount:
                        message.sender_id !== currentUser?._id
                            ? updatedGroups[existingGroupIndex].unreadCount + 1
                            : updatedGroups[existingGroupIndex].unreadCount
                };
                return updatedGroups;
            }
            return prevGroups;
        });
    };

    // Handle chat selection
    const handleChatSelect = (chat, type) => {
        setActiveChat({ ...chat, type });

        // Mark messages as read when selecting a chat
        if (type === 'direct') {
            setConversations((prevConversations) => {
                return prevConversations.map((conv) => {
                    if (conv.user._id === chat.user._id) {
                        return { ...conv, unreadCount: 0 };
                    }
                    return conv;
                });
            });
        } else if (type === 'group') {
            setGroups((prevGroups) => {
                return prevGroups.map((group) => {
                    if (group._id === chat._id) {
                        return { ...group, unreadCount: 0 };
                    }
                    return group;
                });
            });
        }
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter conversations, groups, and contacts based on search query
    const filteredConversations = conversations.filter((conv) => {
        // Vérifier que conv et conv.user existent et que conv.user.name est une chaîne
        return conv && conv.user && typeof conv.user.name === 'string' &&
            conv.user.name.toLowerCase().includes((searchQuery || '').toLowerCase());
    });

    const filteredGroups = groups.filter((group) => {
        // Vérifier que group existe et que group.name est une chaîne
        return group && typeof group.name === 'string' &&
            group.name.toLowerCase().includes((searchQuery || '').toLowerCase());
    });

    // Filter contacts by search query
    const filteredContacts = {};
    Object.keys(contacts || {}).forEach((letter) => {
        // Vérifier que contacts[letter] existe
        if (contacts[letter] && Array.isArray(contacts[letter])) {
            const filteredLetterContacts = contacts[letter].filter((contact) => {
                // Vérifier que contact existe et que contact.name est une chaîne
                return contact && typeof contact.name === 'string' &&
                    contact.name.toLowerCase().includes((searchQuery || '').toLowerCase());
            });
            if (filteredLetterContacts.length > 0) {
                filteredContacts[letter] = filteredLetterContacts;
            }
        }
    });

    return (
        <div className="main-content app-content chat-theme-dark">
            <div className="container-fluid p-0">

                <div className="main-chart-wrapper gap-0 d-lg-flex">
                    {/* Chat Sidebar */}
                    <ChatSidebar
                        conversations={filteredConversations}
                        groups={filteredGroups}
                        contacts={filteredContacts}
                        activeChat={activeChat}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        onChatSelect={handleChatSelect}
                        searchQuery={searchQuery}
                        onSearch={handleSearch}
                        currentUser={currentUser}
                    />

                    {/* Chat Window */}
                    {activeChat ? (
                        <ChatWindow
                            chat={activeChat}
                            messages={messages}
                            currentUser={currentUser}
                            onSendMessage={handleSendMessage}
                            isLoading={isLoading}
                        />
                    ) : (
                        <div className="chat-window-placeholder">
                            <div className="text-center">
                                <i className="ri-chat-smile-3-line"></i>
                                <h4 className="mt-3 mb-2">Bienvenue dans votre messagerie</h4>
                                <p className="text-muted mb-4">Sélectionnez une conversation pour commencer à discuter</p>
                                <button className="btn btn-primary btn-lg">
                                    <i className="ri-user-add-line me-2"></i> Nouveau message
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatComponent;
