import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import * as chatService from './chatService.js';
import EmojiPicker from 'emoji-picker-react';

// API URL for file uploads
const API_URL = 'http://localhost:3000';

const ChatWindow = ({ chat, messages, currentUser, onSendMessage, isLoading }) => {
    const [messageText, setMessageText] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const chatContentRef = useRef(null);
    const fileInputRef = useRef(null);
    const emojiPickerRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    }, [messages]);

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle emoji selection
    const handleEmojiClick = (emojiData) => {
        setMessageText(prev => prev + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    // Toggle emoji picker
    const toggleEmojiPicker = () => {
        setShowEmojiPicker(prev => !prev);
    };

    // Format timestamp to time (e.g., "14:30")
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        return format(new Date(timestamp), 'HH:mm', { locale: fr });
    };

    // Handle message input change
    const handleMessageChange = (e) => {
        setMessageText(e.target.value);

        // Emit typing event
        if (chat.type === 'direct') {
            if (!isTyping) {
                setIsTyping(true);
                chatService.emitTyping({
                    sender_id: currentUser._id,
                    receiver_id: chat.user._id
                });
            }

            // Clear previous timeout
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }

            // Set new timeout to stop typing indicator after 2 seconds
            const timeout = setTimeout(() => {
                setIsTyping(false);
                chatService.emitStopTyping({
                    sender_id: currentUser._id,
                    receiver_id: chat.user._id
                });
            }, 2000);

            setTypingTimeout(timeout);
        }
    };

    // Handle file attachment
    const handleAttachmentClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAttachment(e.target.files[0]);
        }
    };

    // Handle message submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (messageText.trim() === '' && !attachment) return;

        onSendMessage(messageText, attachment);
        setMessageText('');
        setAttachment(null);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Group messages by date
    const groupMessagesByDate = () => {
        const groups = {};

        messages.forEach(message => {
            const date = new Date(message.sent_at).toLocaleDateString('fr-FR');
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
        });

        return groups;
    };

    const messageGroups = groupMessagesByDate();

    // Get chat name and image
    const chatName = chat.type === 'direct' ? chat.user.name : chat.name;
    const chatImage = chat.type === 'direct'
        ? (chat.user.profileImage || "../assets/images/faces/6.jpg")
        : (chat.avatar || "../assets/images/faces/17.jpg");
    const chatStatus = chat.type === 'direct' ? chat.user.status || 'offline' : '';

    return (
        <div className="chat-window border">
            {/* Chat Header */}
            <div className="chat-header d-flex align-items-center justify-content-between p-3 border-bottom">
                <div className="d-flex align-items-center">
                    <span className={`avatar avatar-md ${chatStatus} me-2`}>
                        <img className="chatimageperson" src={chatImage} alt={chatName} />
                    </span>
                    <div>
                        <p className="mb-0 fw-semibold chatnameperson">{chatName}</p>
                        {chat.type === 'direct' && (
                            <p className="mb-0 fs-12 text-muted chatpersonstatus">
                                {chatStatus === 'online' ? 'En ligne' : 'Hors ligne'}
                            </p>
                        )}
                        {chat.type === 'group' && (
                            <p className="mb-0 fs-12 text-muted">
                                {chat.members?.length || 0} membres
                            </p>
                        )}
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <button className="btn btn-sm btn-icon btn-primary-light me-1">
                        <i className="ri-phone-line"></i>
                    </button>
                    <button className="btn btn-sm btn-icon btn-primary-light me-1">
                        <i className="ri-vidicon-line"></i>
                    </button>
                    <button className="btn btn-sm btn-icon btn-primary-light me-1 d-lg-none responsive-chat-close">
                        <i className="ri-close-line"></i>
                    </button>
                    <div className="dropdown">
                        <button className="btn btn-sm btn-icon btn-primary-light" data-bs-toggle="dropdown">
                            <i className="ri-more-2-fill"></i>
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="javascript:void(0);"><i className="ri-user-line me-2"></i>Voir le profil</a></li>
                            <li><a className="dropdown-item" href="javascript:void(0);"><i className="ri-image-line me-2"></i>Médias partagés</a></li>
                            <li><a className="dropdown-item" href="javascript:void(0);"><i className="ri-delete-bin-line me-2"></i>Supprimer la conversation</a></li>
                            <li><a className="dropdown-item" href="javascript:void(0);"><i className="ri-spam-2-line me-2"></i>Bloquer</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Chat Content */}
            <div className="chat-content" id="main-chat-content" ref={chatContentRef}>
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                    </div>
                ) : (
                    <ul className="list-unstyled">
                        {Object.keys(messageGroups).map(date => (
                            <React.Fragment key={date}>
                                <li className="chat-day-label">
                                    <span>{date === new Date().toLocaleDateString('fr-FR') ? "Aujourd'hui" : date}</span>
                                </li>
                                {messageGroups[date].map((message, index) => {
                                    const isCurrentUser = message.sender_id === currentUser._id;
                                    return (
                                        <li key={index} className={isCurrentUser ? "chat-item-end" : "chat-item-start"}>
                                            <div className="chat-list-inner">
                                                {!isCurrentUser && (
                                                    <div className="chat-user-profile">
                                                        <span className={`avatar avatar-md ${chat.type === 'direct' ? chatStatus : ''}`}>
                                                            <img
                                                                src={chat.type === 'direct' ? chatImage : (message.sender?.profileImage || "../assets/images/faces/6.jpg")}
                                                                alt={chat.type === 'direct' ? chatName : message.sender?.name}
                                                            />
                                                        </span>
                                                    </div>
                                                )}
                                                <div className={isCurrentUser ? "me-3" : "ms-3"}>
                                                    <div className="main-chat-msg">
                                                        <div>
                                                            <p className="mb-0">{message.message}</p>
                                                            {message.attachment && (
                                                                <div className="chat-attachment mt-2">
                                                                    {message.attachment_type === 'image' ? (
                                                                        <a href={`${API_URL}/uploads/chat/${message.attachment}`} className="glightbox" data-gallery="chat-gallery">
                                                                            <img src={`${API_URL}/uploads/chat/${message.attachment}`} alt="attachment" className="img-fluid rounded" />
                                                                        </a>
                                                                    ) : message.attachment_type === 'video' ? (
                                                                        <a href={`${API_URL}/uploads/chat/${message.attachment}`} className="glightbox" data-gallery="chat-gallery">
                                                                            <video src={`${API_URL}/uploads/chat/${message.attachment}`} className="img-fluid rounded" controls></video>
                                                                        </a>
                                                                    ) : (
                                                                        <a href={`${API_URL}/uploads/chat/${message.attachment}`} className="chat-file-attachment" download>
                                                                            <i className="ri-file-line me-1"></i>
                                                                            {message.attachment.split('-').pop()}
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="chatting-user-info">
                                                        {chat.type === 'group' && !isCurrentUser ? (
                                                            <span>{message.sender?.name || 'Utilisateur'}</span>
                                                        ) : (
                                                            <span>{isCurrentUser ? 'Vous' : chatName}</span>
                                                        )}
                                                        <span className="msg-sent-time">{formatTime(message.sent_at)}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                        {messages.length === 0 && (
                            <li className="text-center p-5">
                                <p className="text-muted">Aucun message. Commencez la conversation!</p>
                            </li>
                        )}
                    </ul>
                )}
            </div>

            {/* Chat Footer */}
            <div className="chat-footer">
                <form onSubmit={handleSubmit} className="d-flex align-items-center">
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <button
                        type="button"
                        className="btn btn-primary1-light me-2 btn-icon btn-send"
                        onClick={handleAttachmentClick}
                    >
                        <i className="ri-attachment-2"></i>
                    </button>
                    <div className="position-relative">
                        <button
                            type="button"
                            className="btn btn-icon me-2 btn-primary2 emoji-picker"
                            onClick={toggleEmojiPicker}
                        >
                            <i className="ri-emotion-line"></i>
                        </button>
                        {showEmojiPicker && (
                            <div
                                className="position-absolute bottom-100 start-0 mb-2"
                                style={{ zIndex: 1000 }}
                                ref={emojiPickerRef}
                            >
                                <EmojiPicker
                                    onEmojiClick={handleEmojiClick}
                                    width={300}
                                    height={400}
                                    theme="auto"
                                />
                            </div>
                        )}
                    </div>
                    <input
                        className="form-control chat-message-space"
                        placeholder="Tapez votre message ici..."
                        type="text"
                        value={messageText}
                        onChange={handleMessageChange}
                    />
                    <button type="submit" className="btn btn-primary ms-2 btn-icon btn-send">
                        <i className="ri-send-plane-2-line"></i>
                    </button>
                </form>
                {attachment && (
                    <div className="attachment-preview mt-2 p-2 border rounded">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <i className="ri-file-line me-2"></i>
                                <span>{attachment.name}</span>
                            </div>
                            <button
                                type="button"
                                className="btn btn-sm btn-icon btn-danger"
                                onClick={() => setAttachment(null)}
                            >
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatWindow;
