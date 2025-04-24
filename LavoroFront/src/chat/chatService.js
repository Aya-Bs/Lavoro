import axios from 'axios';
import io from 'socket.io-client';

const API_URL = 'http://localhost:3000';
const socket = io(API_URL, {
    withCredentials: true,
    extraHeaders: {
        "my-custom-header": "abcd"
    }
});

// Create axios instance for chat API
const api = axios.create({
    baseURL: `${API_URL}/chat`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add authorization header to requests if token exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Socket.io connection management
export const connectSocket = (userId) => {
    socket.emit('user_connected', userId);
};

// Direct Messages API
export const getUserChats = async (userId) => {
    try {
        const response = await api.get(`/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user chats:', error);
        throw error;
    }
};

export const getConversation = async (userId, otherUserId) => {
    try {
        console.log(`Fetching conversation between ${userId} and ${otherUserId}`);
        const response = await api.get(`/conversation/${userId}/${otherUserId}`);
        console.log('Conversation response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching conversation:', error);
        // Au lieu de propager l'erreur, retournons un objet avec success: false
        // pour que le composant puisse gérer l'erreur plus gracieusement
        return {
            success: false,
            error: error.message,
            data: { messages: [] }
        };
    }
};

export const sendMessage = async (messageData, attachment = null) => {
    try {
        // If there's an attachment, use FormData
        if (attachment) {
            const formData = new FormData();
            formData.append('sender_id', messageData.sender_id);
            formData.append('receiver_id', messageData.receiver_id);
            formData.append('message', messageData.message);
            formData.append('attachment', attachment);

            const response = await api.post('/message', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } else {
            // Regular JSON request without attachment
            const response = await api.post('/message', messageData);
            return response.data;
        }
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

export const deleteMessage = async (messageId) => {
    try {
        const response = await api.delete(`/message/${messageId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting message:', error);
        throw error;
    }
};

// Group Chat API
export const getUserGroups = async (userId) => {
    try {
        const response = await api.get(`/groups/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user groups:', error);
        throw error;
    }
};

export const createGroup = async (groupData, avatar = null) => {
    try {
        // If there's an avatar, use FormData
        if (avatar) {
            const formData = new FormData();
            formData.append('name', groupData.name);
            formData.append('description', groupData.description);
            formData.append('creator', groupData.creator);

            // Append each member to the formData
            groupData.members.forEach(member => {
                formData.append('members', member);
            });

            formData.append('avatar', avatar);

            const response = await api.post('/group', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } else {
            // Regular JSON request without avatar
            const response = await api.post('/group', groupData);
            return response.data;
        }
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
};

export const getGroupMessages = async (groupId, userId) => {
    try {
        console.log(`Fetching group messages for group ${groupId} and user ${userId}`);
        const response = await api.get(`/group/${groupId}/${userId}`);
        console.log('Group messages response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching group messages:', error);
        // Au lieu de propager l'erreur, retournons un objet avec success: false
        // pour que le composant puisse gérer l'erreur plus gracieusement
        return {
            success: false,
            error: error.message,
            data: { messages: [] }
        };
    }
};

export const sendGroupMessage = async (messageData, attachment = null) => {
    try {
        // If there's an attachment, use FormData
        if (attachment) {
            const formData = new FormData();
            formData.append('group_id', messageData.group_id);
            formData.append('sender_id', messageData.sender_id);
            formData.append('message', messageData.message);
            formData.append('attachment', attachment);

            const response = await api.post('/group/message', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } else {
            // Regular JSON request without attachment
            const response = await api.post('/group/message', messageData);
            return response.data;
        }
    } catch (error) {
        console.error('Error sending group message:', error);
        throw error;
    }
};

export const deleteGroupMessage = async (messageId) => {
    try {
        const response = await api.delete(`/group/message/${messageId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting group message:', error);
        throw error;
    }
};

// Socket.io event listeners
export const onNewMessage = (callback) => {
    socket.on('new_message', callback);
};

export const onMessageSent = (callback) => {
    socket.on('message_sent', callback);
};

export const onNewGroupMessage = (callback) => {
    socket.on('new_group_message', callback);
};

export const onGroupMessageSent = (callback) => {
    socket.on('group_message_sent', callback);
};

export const onUserTyping = (callback) => {
    socket.on('user_typing', callback);
};

export const onUserStopTyping = (callback) => {
    socket.on('user_stop_typing', callback);
};

// Socket.io event listeners removal
export const offNewMessage = () => {
    socket.off('new_message');
};

export const offMessageSent = () => {
    socket.off('message_sent');
};

export const offNewGroupMessage = () => {
    socket.off('new_group_message');
};

export const offGroupMessageSent = () => {
    socket.off('group_message_sent');
};

export const offUserTyping = () => {
    socket.off('user_typing');
};

export const offUserStopTyping = () => {
    socket.off('user_stop_typing');
};

// Socket.io event emitters
export const emitPrivateMessage = (messageData) => {
    socket.emit('private_message', messageData);
};

export const emitGroupMessage = (messageData) => {
    socket.emit('group_message', messageData);
};

export const emitTyping = (data) => {
    socket.emit('typing', data);
};

export const emitStopTyping = (data) => {
    socket.emit('stop_typing', data);
};

export default {
    getUserChats,
    getConversation,
    sendMessage,
    deleteMessage,
    getUserGroups,
    createGroup,
    getGroupMessages,
    sendGroupMessage,
    deleteGroupMessage,
    connectSocket,
    onNewMessage,
    onMessageSent,
    onNewGroupMessage,
    onGroupMessageSent,
    onUserTyping,
    onUserStopTyping,
    offNewMessage,
    offMessageSent,
    offNewGroupMessage,
    offGroupMessageSent,
    offUserTyping,
    offUserStopTyping,
    emitPrivateMessage,
    emitGroupMessage,
    emitTyping,
    emitStopTyping
};
