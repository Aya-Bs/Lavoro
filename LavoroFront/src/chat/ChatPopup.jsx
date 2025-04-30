import React, { useState, useEffect, useRef } from 'react';
import * as chatService from './chatService.js';
import ChatWindow from './ChatWindow';
import ChatSidebar from './ChatSidebar';
import './ChatFullScreen.css';

const ChatPopup = ({ onClose, currentUser }) => {
    const [expanded, setExpanded] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [groups, setGroups] = useState([]);
    const [contacts, setContacts] = useState({});
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('users');
    const refreshIntervalRef = useRef(null);

    // Load user data when component mounts
    useEffect(() => {
        if (currentUser && currentUser._id) {
            loadUserData(currentUser._id);
            chatService.connectSocket(currentUser._id);
        }

        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, [currentUser]);

    // Load user's conversations, groups, and contacts
    const loadUserData = async (userId) => {
        setIsLoading(true);
        try {
            // Load conversations
            const chatsResponse = await chatService.getUserChats(userId);
            if (chatsResponse && chatsResponse.success) {
                setConversations(chatsResponse.data);
                
                // Set first conversation as active if there's no active chat
                if (chatsResponse.data.length > 0 && !activeChat) {
                    handleChatSelect(chatsResponse.data[0], 'direct');
                }
            }

            // Load groups
            const groupsResponse = await chatService.getUserGroups(userId);
            if (groupsResponse && groupsResponse.success) {
                setGroups(groupsResponse.data);
            }

            // Load contacts
            const contactsResponse = await chatService.getContacts(userId);
            if (contactsResponse && contactsResponse.success) {
                setContacts(contactsResponse.data);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Load messages for the active chat
    const loadMessages = async (showLoading = true) => {
        if (!activeChat) return;
        
        if (showLoading) {
            setIsLoading(true);
        }
        
        try {
            if (activeChat.type === 'direct') {
                const response = await chatService.getConversation(
                    currentUser._id,
                    activeChat.user._id
                );
                if (response && response.success && response.data.messages) {
                    setMessages(response.data.messages);
                }
            } else if (activeChat.type === 'group') {
                const response = await chatService.getGroupMessages(
                    activeChat._id,
                    currentUser._id
                );
                if (response && response.success && response.data.messages) {
                    setMessages(response.data.messages);
                }
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            if (showLoading) {
                setIsLoading(false);
            }
        }
    };

    // Set up message refresh interval when active chat changes
    useEffect(() => {
        if (activeChat && currentUser) {
            loadMessages();
            
            // Clear previous interval
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
            
            // Set up a refresh interval to reload messages periodically
            refreshIntervalRef.current = setInterval(() => {
                if (activeChat) {
                    loadMessages(false); // Don't show loading indicator
                }
            }, 5000); // Refresh every 5 seconds
        }
        
        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, [activeChat, currentUser]);

    // Handle sending a message
    const handleSendMessage = async (message, attachment = null) => {
        try {
            if (!activeChat) return;
            
            const messageText = message || '';
            
            if (messageText.trim() === '' && !attachment) {
                return;
            }
            
            const finalMessage = messageText.trim() === '' && attachment ? 'Pièce jointe' : messageText;
            
            if (activeChat.type === 'direct') {
                const messageData = {
                    sender_id: currentUser._id,
                    receiver_id: activeChat.user._id,
                    message: finalMessage
                };

                if (attachment) {
                    try {
                        const response = await chatService.sendMessage(messageData, attachment);
                        
                        if (response && response.success && response.data) {
                            setMessages(prevMessages => [...prevMessages, response.data]);
                        }
                    } catch (error) {
                        console.error('Failed to send message with attachment:', error);
                        chatService.emitPrivateMessage(messageData);
                    }
                } else {
                    chatService.emitPrivateMessage(messageData);
                }
            } else if (activeChat.type === 'group') {
                const messageData = {
                    group_id: activeChat._id,
                    sender_id: currentUser._id,
                    message: finalMessage
                };

                if (attachment) {
                    try {
                        const response = await chatService.sendGroupMessage(messageData, attachment);
                        
                        if (response && response.success && response.data) {
                            setMessages(prevMessages => [...prevMessages, response.data]);
                        }
                    } catch (error) {
                        console.error('Failed to send group message with attachment:', error);
                        chatService.emitGroupMessage(messageData);
                    }
                } else {
                    chatService.emitGroupMessage(messageData);
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Handle chat selection
    const handleChatSelect = (chat, type) => {
        setActiveChat({ ...chat, type });
        
        // Mark messages as read
        if (type === 'direct') {
            setConversations(prevConversations => {
                return prevConversations.map(conv => {
                    if (conv.user._id === chat.user._id) {
                        return { ...conv, unreadCount: 0 };
                    }
                    return conv;
                });
            });
        } else if (type === 'group') {
            setGroups(prevGroups => {
                return prevGroups.map(group => {
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
    const filteredConversations = conversations.filter(conv => {
        return conv && conv.user && typeof conv.user.name === 'string' &&
            conv.user.name.toLowerCase().includes((searchQuery || '').toLowerCase());
    });

    const filteredGroups = groups.filter(group => {
        return group && typeof group.name === 'string' &&
            group.name.toLowerCase().includes((searchQuery || '').toLowerCase());
    });

    const filteredContacts = {};
    Object.keys(contacts || {}).forEach(letter => {
        if (contacts[letter] && Array.isArray(contacts[letter])) {
            const filteredLetterContacts = contacts[letter].filter(contact => {
                return contact && typeof contact.name === 'string' &&
                    contact.name.toLowerCase().includes((searchQuery || '').toLowerCase());
            });
            if (filteredLetterContacts.length > 0) {
                filteredContacts[letter] = filteredLetterContacts;
            }
        }
    });

    // Toggle expanded mode
    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <div className={`chat-popup ${expanded ? 'expanded' : ''}`}>
            <div className="chat-popup-header">
                <h5 className="mb-0">Messagerie</h5>
                <div>
                    <button className="btn btn-sm btn-icon btn-primary-light me-1" onClick={toggleExpanded}>
                        <i className={`ri-${expanded ? 'contract' : 'expand'}-left-right-line`}></i>
                    </button>
                    <button className="btn btn-sm btn-icon btn-danger" onClick={onClose}>
                        <i className="ri-close-line"></i>
                    </button>
                </div>
            </div>
            <div className="chat-popup-content">
                {expanded && (
                    <div className="chat-popup-sidebar">
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
                    </div>
                )}
                <div className="chat-popup-main">
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
                                <i className="ri-chat-3-line fs-40 text-muted"></i>
                                <h5 className="mt-3">Sélectionnez une conversation pour commencer</h5>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPopup;
