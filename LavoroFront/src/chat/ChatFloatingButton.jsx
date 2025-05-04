import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as chatService from './chatService.js';
import './ChatFullScreen.css';

const ChatFloatingButton = () => {
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);

    // Get current user from localStorage
    useEffect(() => {
        const fetchUser = async () => {
            const userString = localStorage.getItem('user');
            let user = userString ? JSON.parse(userString) : null;

            if (!user) {
                const userInfoString = localStorage.getItem('userInfo');
                const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
                user = userInfo?.user || userInfo;
            }

            if (user && user._id) {
                setCurrentUser(user);
                // Connect to socket
                chatService.connectSocket(user._id);
                // Start listening for new messages
                setupMessageListeners(user._id);
            }
        };

        fetchUser();
    }, []);

    // Setup message listeners
    const setupMessageListeners = (userId) => {
        // Listen for new direct messages
        chatService.onNewMessage(() => {
            updateUnreadCount(userId);
        });

        // Listen for new group messages
        chatService.onNewGroupMessage(() => {
            updateUnreadCount(userId);
        });

        // Initial count
        updateUnreadCount(userId);
    };

    // Update unread count
    const updateUnreadCount = async (userId) => {
        try {
            // Get user chats
            const chatsResponse = await chatService.getUserChats(userId);
            if (chatsResponse && chatsResponse.success) {
                const directUnread = chatsResponse.data.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
                
                // Get user groups
                const groupsResponse = await chatService.getUserGroups(userId);
                if (groupsResponse && groupsResponse.success) {
                    const groupUnread = groupsResponse.data.reduce((total, group) => total + (group.unreadCount || 0), 0);
                    
                    // Set total unread count
                    setUnreadCount(directUnread + groupUnread);
                }
            }
        } catch (error) {
            console.error('Error updating unread count:', error);
        }
    };

    // Handle button click
    const handleClick = () => {
        navigate('/chat');
    };

    return (
        <div className="chat-floating-button" onClick={handleClick}>
            <i className="ri-chat-3-line"></i>
            {unreadCount > 0 && (
                <span className="chat-unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
            )}
        </div>
    );
};

export default ChatFloatingButton;
